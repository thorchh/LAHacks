from uagents import Agent, Context, Model, Protocol, Field
from pydantic import BaseModel
import os
import json
from google import genai
import json, re

GEMINI_API_KEY = "AIzaSyDOKIJlSe93VtTz4G2Mj2U22S2TDhawS2o"
client = genai.Client(api_key=GEMINI_API_KEY)

def strip_fences(text: str) -> str:
    import re
    text = re.sub(r"^```[a-zA-Z]*\n", "", text)
    text = re.sub(r"\n```$", "", text)
    return text.strip()

class QualityCheckRequest(Model):
    event_details: dict = Field(description="Event details.")
    queries: list = Field(description="Queries used.")
    profiles: list = Field(description="Profiles returned.")

class QualityCheckResponse(Model):
    is_high_quality: bool = Field(description="Are these profiles high quality?")
    issues: str = Field(description="Main issues if not high quality.")

class RefineQueriesRequest(Model):
    event_details: dict = Field(description="Event details.")
    keywords: dict = Field(description="Keywords used.")
    previous_queries: list = Field(description="Previous queries.")
    profiles: list = Field(description="Profiles returned.")
    issues: str = Field(description="Issues with profiles.")

class RefineQueriesResponse(Model):
    queries: list = Field(description="Improved queries.")

@agent.on_rest_post("/api/quality_check", QualityCheckRequest, QualityCheckResponse)
async def rest_quality_check(ctx: Context, req: QualityCheckRequest) -> QualityCheckResponse:
    prompt = f"""
You are an expert in evaluating the quality of professional leads for high-profile event outreach. Given the following event details, search queries, and the resulting profiles, analyze if these profiles are high-caliber, relevant, and diverse enough for the event. If not, explain the main issues (e.g., too junior, not relevant, not diverse, etc.).

Event details:
{json.dumps(req.event_details, indent=2)}

Search queries used:
{json.dumps(req.queries, indent=2)}

Profiles returned (sample):
{json.dumps(req.profiles[:20], indent=2)}

Return a JSON object with keys:
- is_high_quality (true/false): Are these profiles high quality for the event?
- issues (string): If not high quality, what are the main issues?
"""
    resp = client.models.generate_content(model="gemini-2.5-flash-preview-04-17", contents=[prompt])
    try:
        result = json.loads(strip_fences(resp.text))
        return QualityCheckResponse(is_high_quality=result.get("is_high_quality", False), issues=result.get("issues", ""))
    except Exception as e:
        ctx.logger.error(f"[Gemini Quality Check] Error parsing response: {e}")
        return QualityCheckResponse(is_high_quality=False, issues="Could not parse Gemini response.")

@agent.on_rest_post("/api/refine_queries", RefineQueriesRequest, RefineQueriesResponse)
async def rest_refine_queries(ctx: Context, req: RefineQueriesRequest) -> RefineQueriesResponse:
    prompt = f"""
You are an expert in deep research and people discovery for high-profile events. The previous search queries did not yield enough high-quality leads. Here are the event details, keywords, previous queries, and the issues with the profiles:

Event details:
{json.dumps(req.event_details, indent=2)}

Keywords:
{json.dumps(req.keywords, indent=2)}

Previous queries:
{json.dumps(req.previous_queries, indent=2)}

Issues with profiles:
{req.issues}

Your task:
1. Analyze the previous queries and the issues with the profiles.
2. Explain, step by step, how you will improve the queries to target more specific, high-caliber individuals (e.g., "I will focus on senior titles, add requirements for public speaking, and specify top institutions").
3. Generate 6-8 improved, creative, and realistic search queries (as a JSON array of strings) that would help find the best possible leads for this event. Do NOT use generic phrases like "for this event" or "for UCLA event". Instead, focus on the type of person (e.g., "AI ethics professor Stanford keynote speaker", "CTO climate tech startup demo day panelist", "Nobel laureate chemistry keynote science festival"). Do NOT use SQL or boolean logic like AND/OR. Make the queries sound like what a real event organizer would search for to find top speakers or panelists.
4. Return a JSON object with two keys:
   - "explanation": a step-by-step explanation of how you improved the queries
   - "queries": the improved queries as a JSON array of strings
"""
    resp = client.models.generate_content(model="gemini-2.5-flash-preview-04-17", contents=[prompt])
    try:
        result = json.loads(strip_fences(resp.text))
        ctx.logger.info(f"[RefineQueries] Gemini explanation: {result.get('explanation', '')}")
        ctx.logger.info(f"[RefineQueries] Gemini queries: {result.get('queries', [])}")
        return RefineQueriesResponse(queries=result.get("queries", []))
    except Exception as e:
        ctx.logger.error(f"[Gemini Refine Queries] Error parsing response: {e}")
        return RefineQueriesResponse(queries=[])