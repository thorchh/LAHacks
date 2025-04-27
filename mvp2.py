#!/usr/bin/env python3
# mvp.py

import os
import json
import argparse
import re
import requests
import asyncio
import aiohttp
from google import genai
from tqdm import tqdm  # for progress bar

# -----------------------------------------------------------------------------
# Setup & Authentication
# -----------------------------------------------------------------------------
# pip install google-generativeai aiohttp requests tqdm
GEMINI_API_KEY = "AIzaSyDOKIJlSe93VtTz4G2Mj2U22S2TDhawS2o" 
LINKD_API_KEY  = "lk_fa15a73790c64b2b932fe3e837d3d10c"
if not GEMINI_API_KEY or not LINKD_API_KEY:
    raise RuntimeError("Please set GEMINI_API_KEY and LINKD_API_KEY in your environment.")

print("[Setup] Initializing Gemini client...")
client = genai.Client(api_key=GEMINI_API_KEY)
print("[Setup] Done.\n")

# -----------------------------------------------------------------------------
# Sample Event for --test
# -----------------------------------------------------------------------------
SAMPLE_EVENT = {
    "name": "UCLA AI & Ethics Symposium",
    "date": "2025-05-18",
    "location": "Gordon Student Event Center, UCLA Campus",
    "format": "in-person",
    "audience_size": "150",
    "target_groups": "Undergraduate CS majors, Philosophy majors, AI clubs",
    "funding_need": "$5,000",
    "in_kind_needs": "Catering (lunch), swag (tote bags, stickers), AV support",
    "speakers_needed": "3 keynote speakers (AI ethics researchers), 5 panelists",
    "past_sponsors": "IEEE Student Chapter, UCLA Center for Digital Ethics",
    "theme": "Exploring the societal impact and moral frameworks of emerging AI technologies"
}

# -----------------------------------------------------------------------------
# Utilities
# -----------------------------------------------------------------------------
def strip_fences(text: str) -> str:
    text = re.sub(r"^```[a-zA-Z]*\n", "", text)
    text = re.sub(r"\n```$", "", text)
    return text.strip()

# -----------------------------------------------------------------------------
# Event Discovery
# -----------------------------------------------------------------------------
def collect_event_details():
    fields = [
        "name", "date", "location", "format",
        "audience_size", "target_groups",
        "funding_need", "in_kind_needs",
        "speakers_needed", "past_sponsors", "theme"
    ]
    details = {}
    print("[Event Discovery] Please provide your event details.")
    for f in fields:
        while not details.get(f):
            val = input(f"  ➤ {f.replace('_',' ').capitalize()}: ").strip()
            if val:
                details[f] = val
    print("\n[Event Discovery] You entered:")
    for k, v in details.items():
        print(f"  • {k.replace('_',' ')}: {v}")
    if input("\nIs this correct? (y/n): ").lower() != 'y':
        print("[Event Discovery] Let's re-enter.\n")
        return collect_event_details()
    print("[Event Discovery] Details confirmed.\n")
    return details

# -----------------------------------------------------------------------------
# Prompt Planning for Search Queries
# -----------------------------------------------------------------------------
def generate_search_queries_via_llm(event_details):
    prompt = f"""
You are an expert in generating search queries for professionals in specific fields.
Given the following event details:

{json.dumps(event_details, indent=2)}

Create a list of natural language search queries that can help find potential speakers, panelists, and experts for this event. Focus on finding people with expertise in AI ethics, AI research, and related fields. Provide the search queries in a JSON array.

example output:
[
    "AI ethics researchers in California",
    "AI researchers with a focus on ethics",
    "Panelists for AI ethics symposium",
    "Experts in AI and societal impact"
]
"""
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    raw = resp.text
    print("[Query Generation] Raw response:\n", raw)
    try:
        queries = json.loads(strip_fences(raw))
    except Exception as e:
        print(f"[Query Generation] Error parsing response: {e}")
        raise

    print(f"[Query Generation] Generated {len(queries)} queries.")
    return queries

# -----------------------------------------------------------------------------
# Prompt Ranking with LLM
# -----------------------------------------------------------------------------
def rank_profiles_via_llm(profiles, event_details):
    prompt = f"""
You are an expert at ranking professionals based on their relevance to an event.
Given the following event details:

{json.dumps(event_details, indent=2)}

Rank the following profiles in terms of their relevance to this event. The profiles are as follows:

{json.dumps(profiles, indent=2)}

Provide the rankings with scores for each profile based on their relevance.
"""
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    raw = resp.text
    print("[Ranking] Raw response:\n", raw)
    try:
        rankings = json.loads(strip_fences(raw))
    except Exception as e:
        print(f"[Ranking] Error parsing response: {e}")
        raise

    print(f"[Ranking] Ranked {len(rankings)} profiles.")
    return rankings

# -----------------------------------------------------------------------------
# Event Relevance Description via LLM
# -----------------------------------------------------------------------------
def generate_event_relevance_description_via_llm(profile, event_details):
    prompt = f"""
You are an expert in creating event relevance descriptions.
Given the following profile:

{json.dumps(profile, indent=2)}

And the following event details:

{json.dumps(event_details, indent=2)}

Write a brief description of why this person is relevant to the event, considering their expertise, roles, and background.
"""
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    raw = resp.text
    print("[Relevance Description] Raw response:\n", raw)
    try:
        relevance_description = json.loads(strip_fences(raw))
    except Exception as e:
        print(f"[Relevance Description] Error parsing response: {e}")
        raise

    print(f"[Relevance Description] Generated relevance description.")
    return relevance_description

# -----------------------------------------------------------------------------
# Parallel Linkd Search
# -----------------------------------------------------------------------------
async def search_query(session, query, retries=3):
    url = "https://search.linkd.inc/api/search/users"
    headers = {"Authorization": f"Bearer {LINKD_API_KEY}"}
    params = {"query": query, "limit": 10}
    
    print(f"[Search] Sending to Linkd: {query}")
    
    try:
        async with session.get(url, headers=headers, params=params) as resp:
            data = await resp.json()
            return data.get("results", [])
    except Exception as e:
        if retries > 0:
            print(f"[Error] Search for '{query}' failed: {e}. Retrying...")
            return await search_query(session, query, retries - 1)
        print(f"[Error] Search failed after retries: {e}")
        return []

async def run_searches_from_plans(plans):
    all_leads = []
    async with aiohttp.ClientSession() as session:
        tasks = []
        
        for plan in plans:
            queries = generate_search_queries_via_llm(plan)
            
            # Progress bar for searches
            for query in tqdm(queries, desc=f"[Searching for: {plan['description']}]", unit="query"):
                tasks.append(search_query(session, query))
        
        results = await asyncio.gather(*tasks)

    for result_set in results:
        all_leads.extend(result_set)

    return all_leads

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true", help="Use sample event data instead of prompts")
    args = parser.parse_args()

    if args.test:
        print("[Mode] TEST mode: using sample event\n")
        details = SAMPLE_EVENT
        for k, v in details.items():
            print(f"  • {k.replace('_', ' ')}: {v}")
        print()
    else:
        details = collect_event_details()

    # Step 1: Generate queries via LLM (Gemini)
    queries = generate_search_queries_via_llm(details)
    
    # Step 2: Run search using Linkd API
    all_leads = asyncio.run(run_searches_from_plans([{'description': 'AI ethics speakers', 'filters': {'keywords': ['AI', 'ethics']}}]))
    
    # Step 3: Rank profiles using Gemini
    ranked_profiles = rank_profiles_via_llm(all_leads, details)
    
    # Step 4: Print top 5 ranked leads
    print("\nTop 5 sponsor leads:")
    for i, lead in enumerate(ranked_profiles[:5], 1):
        p = lead['profile']
        print(f" {i}. {p['name']} — {p.get('headline', '[no headline]')}")
        print(f"     {p.get('linkedin_url', '[no url]')}")
        print(f"     Bio: {p.get('description', '[no bio]')[:80]}...")
        relevance_desc = generate_event_relevance_description_via_llm(p, details)
        print(f"     Relevance: {relevance_desc}\n")

if __name__ == "__main__":
    main()
