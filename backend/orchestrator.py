import requests

KEYWORDS_URL = "http://localhost:8001/api/keywords"
QUERIES_URL = "http://localhost:8002/api/queries"
LINKD_URL = "http://localhost:8003/api/linkd"
RANKING_URL = "http://localhost:8004/api/ranking"
OUTREACH_URL = "http://localhost:8006/api/outreach"
LLM_AI_URL = "http://localhost:8007"

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

def get_keywords(event_details):
    resp = requests.post(KEYWORDS_URL, json={"event_details": event_details})
    keywords = resp.json()
    print("Keywords:", keywords)
    return keywords

def get_queries(event_details, keywords):
    resp = requests.post(QUERIES_URL, json={"event_details": event_details, "keywords": keywords})
    queries = resp.json()["queries"]
    print("Queries:", queries)
    return queries

def get_profiles(queries):
    all_profiles = []
    # Set this to True to only use the first query, or False to use all queries
    ONLY_FIRST_QUERY = True  # <-- Set to True to only process the first query
    if ONLY_FIRST_QUERY:
        queries = queries[:2]
    for i, query in enumerate(queries):
        print(f"[Linkd] Sending query {i+1}/{len(queries)}: {query}")
        resp = requests.post(LINKD_URL, json={"query": query})
        results = resp.json()["results"]
        print(f"[Linkd] Got {len(results)} profiles for query: {query}")
        all_profiles.extend(results)
    print(f"[Linkd] Total profiles collected: {len(all_profiles)}")
    print("Profiles:", all_profiles)
    return all_profiles

def batch_profiles(profiles, batch_size=20):
    for i in range(0, len(profiles), batch_size):
        yield profiles[i:i+batch_size]

def rank_profiles(all_profiles, event_details):
    print("[Ranking] Sending profiles to ranking agent in batches...")
    all_ranked = []
    batch_size = 20
    for batch in batch_profiles(all_profiles, batch_size):
        resp = requests.post(RANKING_URL, json={"profiles": batch, "event_details": event_details})
        try:
            ranked = resp.json().get("ranked", [])
            print(f"[Ranking] Got {len(ranked)} ranked profiles in batch.")
            all_ranked.extend(ranked)
        except Exception as e:
            print(f"[Ranking] Error parsing ranking response: {e}")
    print(f"[Ranking] Total ranked profiles: {len(all_ranked)}")
    return all_ranked

def outreach_top_leads(ranked, event_details, top_n=5):
    messages = []
    for idx, lead in enumerate(ranked[:top_n], 1):
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
        messages.append({"profile": profile, "message": outreach_msg})
    return messages

# possible call to deep_research_pipeline
def deep_research_pipeline(event_details, max_rounds=3):
    keywords = get_keywords(event_details)
    queries = get_queries(event_details, keywords)
    round_num = 1
    for _ in range(max_rounds):
        print(f"\n[Deep Research] Round {round_num}: Running queries and collecting profiles...")
        profiles = get_profiles(queries)
        ranked = rank_profiles(profiles, event_details)
        # Quality check
        qc_resp = requests.post(f"{LLM_AI_URL}/api/quality_check", json={
            "event_details": event_details,
            "queries": queries,
            "profiles": profiles
        })
        qc = qc_resp.json()
        print(f"[Deep Research] Quality check: high_quality={qc.get('is_high_quality')}, issues={qc.get('issues')}")
        if qc.get("is_high_quality"):
            print("[Deep Research] Profiles are high quality. Proceeding to outreach.")
            return ranked
        # Refine queries if not high quality
        print("[Deep Research] Refining queries based on issues...")
        refine_resp = requests.post(f"{LLM_AI_URL}/api/refine_queries", json={
            "event_details": event_details,
            "keywords": keywords,
            "previous_queries": queries,
            "profiles": profiles,
            "issues": qc.get("issues", "")
        })
        queries = refine_resp.json().get("queries", queries)
        round_num += 1
    print("[Deep Research] Max rounds reached. Returning last ranked results.")
    return ranked

# --- Flask API for orchestration ---
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

def get_sample_event_details():
    return event_details

@app.route("/api/keywords", methods=["POST"])
def api_keywords():
    try:
        ed = request.json.get("event_details") or get_sample_event_details()
        keywords = get_keywords(ed)
        return jsonify(keywords)
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/queries", methods=["POST"])
def api_queries():
    try:
        ed = request.json.get("event_details") or get_sample_event_details()
        keywords = request.json.get("keywords")
        queries = get_queries(ed, keywords)
        return jsonify({"queries": queries})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/linkd", methods=["POST"])
def api_linkd():
    try:
        queries = request.json.get("queries")
        all_profiles = get_profiles(queries)
        return jsonify({"profiles": all_profiles})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/ranking", methods=["POST"])
def api_ranking():
    try:
        profiles = request.json.get("profiles")
        ed = request.json.get("event_details") or get_sample_event_details()
        ranked = rank_profiles(profiles, ed)
        return jsonify({"ranked": ranked})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/outreach", methods=["POST"])
def api_outreach():
    try:
        profile = request.json.get("profile")
        ed = request.json.get("event_details") or get_sample_event_details()
        explanation = request.json.get("explanation")
        resp = requests.post(OUTREACH_URL, json={
            "profile": profile,
            "event_details": ed,
            "explanation": explanation
        })
        return jsonify(resp.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/quality_check", methods=["POST"])
def api_quality_check():
    try:
        resp = requests.post(f"{LLM_AI_URL}/api/quality_check", json=request.json)
        return jsonify(resp.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route("/api/refine_queries", methods=["POST"])
def api_refine_queries():
    try:
        resp = requests.post(f"{LLM_AI_URL}/api/refine_queries", json=request.json)
        return jsonify(resp.json())
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# won't really be used
@app.route("/api/deep_research", methods=["POST"])
def api_deep_research():
    try:
        ed = request.json.get("event_details") or get_sample_event_details()
        results = deep_research_pipeline(ed)
        return jsonify({"ranked": results})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)