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
    for i, query in enumerate(queries):
        print(f"[Linkd] Sending query {i+1}/{len(queries)}: {query}")
        resp = requests.post(LINKD_URL, json={"query": query})
        results = resp.json()["results"]
        print(f"[Linkd] Got {len(results)} profiles for query: {query}")
        all_profiles.extend(results)
    print(f"[Linkd] Total profiles collected: {len(all_profiles)}")
    print("Profiles:", all_profiles)
    return all_profiles

def rank_profiles(all_profiles, event_details):
    print("[Ranking] Sending profiles to ranking agent...")
    resp = requests.post(RANKING_URL, json={"profiles": all_profiles, "event_details": event_details})
    ranked = resp.json()["ranked"]
    print(f"[Ranking] Got {len(ranked)} ranked profiles.")
    print("Ranked:", ranked)
    print("[Ranking] Sorting profiles by score...")
    return ranked

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

if __name__ == "__main__":
    app.run(port=5000, debug=True)