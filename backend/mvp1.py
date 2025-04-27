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

def make_natural_queries_from_plan(plan):
    queries = []

    keywords = plan.get("filters", {}).get("keywords", [])
    companies = plan.get("filters", {}).get("companies", [])
    roles = plan.get("filters", {} ).get("roles", [])

    description = plan.get("description", "")

    queries.append(description)

    if roles:
        for role in roles:
            queries.append(f"{role} in {', '.join(keywords)}")
    else:
        queries.append(", ".join(keywords))

    if companies:
        for company in companies:
            if roles:
                for role in roles:
                    queries.append(f"{role} at {company}")
            else:
                queries.append(f"{', '.join(keywords)} at {company}")

    return queries

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
# Prompt Planning
# -----------------------------------------------------------------------------
def plan_search_strategies(details, attempt=0):
    print(f"[Planner] Generating search plans (attempt {attempt+1})...")
    prompt = f"""
You are an expert in crafting filters for Linkd.searchPeople.
Given these event details:
{json.dumps(details, indent=2)}

Generate exactly 3 plans as JSON array, each with:
- description: string
- filters: {{
    keywords: [ ... ],
    companies: [ ... ],
    roles:     [ ... ]
}}

Each plan must have at least one non-empty list in filters.
If less than 3 valid plans are generated, retry up to 3 attempts.
"""
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    raw = resp.text
    print("[Planner] Raw response:\n", raw)
    try:
        plans = json.loads(strip_fences(raw))
    except Exception as e:
        print(f"[Planner] JSON parse error: {e}")
        if attempt < 2:
            return plan_search_strategies(details, attempt+1)
        raise

    valid = [
        p for p in plans
        if isinstance(p.get("filters"), dict)
        and any(p["filters"].get(k) for k in ("keywords","companies","roles"))
    ]
    if len(valid) < 3 and attempt < 2:
        print(f"[Planner] Only {len(valid)} valid plans; retrying...")
        return plan_search_strategies(details, attempt+1)

    valid = valid[:3]
    print(f"[Planner] Generated {len(valid)} plans:")
    for i, p in enumerate(valid, 1):
        print(f"  {i}. {p['description']} → {p['filters']}")
    print()
    return valid

# -----------------------------------------------------------------------------
# Parallel Linkd Search
# -----------------------------------------------------------------------------
async def search_query(session, query):
    url = "https://search.linkd.inc/api/search/users"
    headers = {"Authorization": f"Bearer {LINKD_API_KEY}"}
    params = {"query": query, "limit": 10}
    
    # Print the query that will be sent to Linkd
    print(f"[Search] Sending to Linkd: {query}")
    
    try:
        async with session.get(url, headers=headers, params=params) as resp:
            data = await resp.json()
            return data.get("results", [])
    except Exception as e:
        print(f"[Error] Search for '{query}' failed: {e}")
        return []

async def run_searches_from_plans(plans, max_queries_per_plan=5):
    all_leads = []
    async with aiohttp.ClientSession() as session:
        tasks = []
        
        for plan in plans:
            queries = make_natural_queries_from_plan(plan)
            
            # Progress bar for searches
            for query in tqdm(queries[:max_queries_per_plan], desc=f"[Searching for: {plan['description']}]", unit="query"):
                tasks.append(search_query(session, query))
        
        results = await asyncio.gather(*tasks)

    for result_set in results:
        all_leads.extend(result_set)

    return all_leads

# -----------------------------------------------------------------------------
# Aggregate, Rank & Print
# -----------------------------------------------------------------------------
def aggregate_and_rank(all_leads):
    print(f"[Aggregate] {len(all_leads)} total leads; deduping...")
    unique = {l["profile"]["id"]: l for l in all_leads}.values()
    print(f"[Aggregate] {len(unique)} unique leads.")
    ranked = sorted(
        unique,
        key=lambda r: (
            len(r["profile"].get("description") or ""),
            r["profile"].get("connectionCount",0)
        ),
        reverse=True
    )
    return ranked

# -----------------------------------------------------------------------------
# Description for Event Relevance
# -----------------------------------------------------------------------------
def generate_event_relevance_description(profile, event_details):
    description = profile.get('description', '')
    if description:
        relevance = f"{profile['name']} is highly relevant to the {event_details['name']} due to their expertise in {', '.join(event_details.get('target_groups', '').split(','))}. Their experience in {description[:200]}..."
    else:
        relevance = f"{profile['name']} could potentially provide valuable insights for the {event_details['name']} with their role in {profile.get('headline', '[no headline]')}, contributing to discussions on {event_details.get('theme', 'AI and Ethics')}"
    return relevance

# -----------------------------------------------------------------------------
# Main
# -----------------------------------------------------------------------------
def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--test", action="store_true",
        help="Use sample event data instead of prompts")
    args = parser.parse_args()

    if args.test:
        print("[Mode] TEST mode: using sample event\n")
        details = SAMPLE_EVENT
        for k,v in details.items():
            print(f"  • {k.replace('_',' ')}: {v}")
        print()
    else:
        details = collect_event_details()

    plans = plan_search_strategies(details)
    all_leads = asyncio.run(run_searches_from_plans(plans))

    ranked = aggregate_and_rank(all_leads)
    print("\nTop 5 sponsor leads:")
    for i, lead in enumerate(ranked[:5], 1):
        p = lead["profile"]
        print(f" {i}. {p['name']} — {p.get('headline','[no headline]')}")
        print(f"     {p.get('linkedin_url','[no url]')}")
        bio = p.get('description') or ''
        print(f"     Bio: {bio[:80]}{'...' if len(bio)>80 else ''}")
        print(f"     Relevance to Event: {generate_event_relevance_description(p, details)}\n")

if __name__ == "__main__":
    main()
