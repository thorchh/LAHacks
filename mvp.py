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
LINKD_API_KEY  = "lk_5b1459f737dc4ee7b92face50b01b8f6"
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

SAMPLE_EVENT_2 = {
    "name": "NYC Climate Tech Startup Demo Day",
    "date": "2025-09-12",
    "location": "Brooklyn Navy Yard, New York City",
    "format": "hybrid",
    "audience_size": "300",
    "target_groups": "Climate tech founders, VCs, sustainability officers, city officials",
    "funding_need": "$20,000",
    "in_kind_needs": "Event space, live streaming, eco-friendly catering, branded notebooks",
    "speakers_needed": "2 climate tech CEOs, 1 city sustainability officer, 4 startup founders",
    "past_sponsors": "NYC Economic Development Corp, Greentown Labs, Urban Future Lab",
    "theme": "Showcasing breakthrough startups tackling urban climate challenges"
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
# Step 1: Generate related companies, universities, and roles via Gemini
# -----------------------------------------------------------------------------
def generate_related_keywords_via_llm(event_details):
    prompt = f"""
You are an expert at extracting related companies, universities, and professional roles from event descriptions.
Given the following event details:

{json.dumps(event_details, indent=2)}

List:
- 5 companies (comma separated)
- 5 universities (comma separated)
- 5 professional roles (comma separated)
Return as a JSON object with keys: companies, universities, roles.
"""
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    raw = resp.text
    print("[Keyword Generation] Raw response:\n", raw)
    try:
        keywords = json.loads(strip_fences(raw))
    except Exception as e:
        print(f"[Keyword Generation] Error parsing response: {e}")
        raise
    print(f"[Keyword Generation] Got companies, universities, roles.")
    return keywords

# -----------------------------------------------------------------------------
# Step 2: Generate diverse search queries using those keywords
# -----------------------------------------------------------------------------
def generate_diverse_search_queries_via_llm(event_details, keywords):
    prompt = f"""
You are an expert in creating diverse natural language search queries for people discovery on search engines and LinkedIn. Given the following event details and related keywords:

Event details:
{json.dumps(event_details, indent=2)}

Keywords:
{json.dumps(keywords, indent=2)}

Create 8-12 diverse, creative, and realistic search queries (as a JSON array of strings) that someone would type into a search engine or LinkedIn to find people. Make sure you use the keywords as a guide but think about what sort of people would be best for that sort of event. Do NOT use SQL or boolean logic like AND/OR. Make the queries sound like what a real person would search for, e.g.:
- People working on AI at FAANG
- People who started companies in Web3 or crypto
- PhDs now working at FAANG companies
- Who works at a VC firm?
- CS graduates working on autonomous vehicles
- People working on biotech in the Bay Area
"""
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    raw = resp.text
    print("[Diverse Query Generation] Raw response:\n", raw)
    try:
        queries = json.loads(strip_fences(raw))
    except Exception as e:
        print(f"[Diverse Query Generation] Error parsing response: {e}")
        raise
    print(f"[Diverse Query Generation] Generated {len(queries)} queries.")
    return queries

# -----------------------------------------------------------------------------
# Step 3: Dedupe profiles
# -----------------------------------------------------------------------------
def dedupe_profiles(profiles):
    print(f"[Deduplication] Found {len(profiles)} profiles.")
    if profiles:
        print("[Deduplication] Sample profile:", json.dumps(profiles[0], indent=2))
    seen = set()
    deduped = []
    for p in profiles:
        key = p.get('linkedin_url') or p.get('id') or p.get('name')
        if not key:
            # Fallback: use the full profile JSON as a key
            key = json.dumps(p, sort_keys=True)
        if key and key not in seen:
            seen.add(key)
            deduped.append(p)
    print(f"[Deduplication] Reduced to {len(deduped)} unique profiles.")
    return deduped

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
            await asyncio.sleep(0.5)
            if resp.content_type != "application/json":
                text = await resp.text()
                print(f"[Error] Non-JSON response for '{query}': {resp.content_type} | First 200 chars: {text[:200]}")
                return []
            data = await resp.json()
            return data.get("results", [])
    except Exception as e:
        if retries > 0:
            print(f"[Error] Search for '{query}' failed: {e}. Retrying...")
            await asyncio.sleep(1)
            return await search_query(session, query, retries - 1)
        print(f"[Error] Search failed after retries: {e}")
        return []

async def run_searches_from_plans(plans):
    all_leads = []
    async with aiohttp.ClientSession() as session:
        for query in tqdm(plans, desc="[Linkd Search]", unit="query"):
            result = await search_query(session, query)
            print(f"[Search] Query '{query}' returned {len(result)} leads.")
            all_leads.extend(result)
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

    # Step 1: Generate related companies, universities, roles
    keywords = generate_related_keywords_via_llm(details)

    # Step 2: Generate diverse search queries
    queries = generate_diverse_search_queries_via_llm(details, keywords)

    # Step 3: Run search using Linkd API for each query
    async def gather_all_leads(queries):
        all_leads = []
        async with aiohttp.ClientSession() as session:
            for query in tqdm(queries, desc="[Linkd Search]", unit="query"):
                result = await search_query(session, query)
                all_leads.extend(result)
        return all_leads
    all_leads = asyncio.run(gather_all_leads(queries))

    # Step 4: Dedupe profiles
    deduped_leads = dedupe_profiles(all_leads)

    # Check if we have any leads before ranking
    if not deduped_leads:
        print("\nNo leads found.")
        return

    # Step 5: Rank profiles using Gemini (with detailed explanation)
    prompt = f"""
You are an expert at ranking professionals for event outreach. Given the event details and a list of LinkedIn profiles, score each profile from 1-10 for relevancy and provide a detailed explanation for each score. Consider location, experience, and likelihood to respond or be interested.

Event details:
{json.dumps(details, indent=2)}

Profiles:
{json.dumps(deduped_leads, indent=2)}

Return a JSON array of objects with keys: profile, score, explanation.
"""
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    raw = resp.text
    print("[Ranking] Raw response:\n", raw)
    try:
        ranked_profiles = json.loads(strip_fences(raw))
    except Exception as e:
        print(f"[Ranking] Error parsing response: {e}")
        raise

    # Step 6: Print up to 5 ranked leads with explanations
    print("\nTop leads:")
    for i, lead in enumerate(sorted(ranked_profiles, key=lambda x: -x['score'])[:5], 1):
        p = lead['profile']
        print(f" {i}. {p.get('name', '[no name]')} — {p.get('headline', '[no headline]')}")
        print(f"     {p.get('linkedin_url', '[no url]')}")
        print(f"     Bio: {p.get('description', '[no bio]')[:80]}...")
        print(f"     Score: {lead['score']}")
        print(f"     Explanation: {lead['explanation']}\n")

if __name__ == "__main__":
    main()
