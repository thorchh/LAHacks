import requests

KEYWORDS_URL = "http://localhost:8001/api/keywords"
QUERIES_URL = "http://localhost:8002/api/queries"
LINKD_URL = "http://localhost:8003/api/linkd"
RANKING_URL = "http://localhost:8004/api/ranking"
OUTREACH_URL = "http://localhost:8006/api/outreach"

event_details = {
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

# 1. Get keywords
resp = requests.post(KEYWORDS_URL, json={"event_details": event_details})
keywords = resp.json()
print("Keywords:", keywords)

# 2. Get queries
resp = requests.post(QUERIES_URL, json={"event_details": event_details, "keywords": keywords})
queries = resp.json()["queries"]
print("Queries:", queries)

# 3. Get profiles from Linkd (for each query, collect all results)
all_profiles = []
for i, query in enumerate(queries):
    print(f"[Linkd] Sending query {i+1}/{len(queries)}: {query}")
    resp = requests.post(LINKD_URL, json={"query": query})
    results = resp.json()["results"]
    print(f"[Linkd] Got {len(results)} profiles for query: {query}")
    all_profiles.extend(results)
print(f"[Linkd] Total profiles collected: {len(all_profiles)}")
print("Profiles:", all_profiles)

# 4. Rank profiles
print("[Ranking] Sending profiles to ranking agent...")
resp = requests.post(RANKING_URL, json={"profiles": all_profiles, "event_details": event_details})
ranked = resp.json()["ranked"]
print(f"[Ranking] Got {len(ranked)} ranked profiles.")
print("Ranked:", ranked)

print("[Ranking] Sorting profiles by score...")
# 5. Outreach for top 5 leads
for idx, lead in enumerate(ranked[:5], 1):
    profile = lead["profile"]
    explanation = lead["explanation"]
    print(f"[Outreach] Sending outreach request for lead #{idx}: {profile.get('name', '[no name]')}")
    resp = requests.post(OUTREACH_URL, json={
        "profile": profile,
        "event_details": event_details,
        "explanation": explanation
    })
    outreach_msg = resp.json()["message"]
    print(f"Outreach message for {profile.get('name', '[no name]')}\n{outreach_msg}\n")