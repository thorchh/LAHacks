from uagents import Agent, Context, Model, Field
import json, re
from google import genai

GEMINI_API_KEY = "AIzaSyDOKIJlSe93VtTz4G2Mj2U22S2TDhawS2o"
client = genai.Client(api_key=GEMINI_API_KEY)

class RankRequest(Model):
    profiles: list = Field(description="List of LinkedIn profiles.")
    event_details: dict = Field(description="Event details.")

class RankResponse(Model):
    ranked: list = Field(description="Ranked profiles with scores and explanations.")

def strip_fences(text: str) -> str:
    text = re.sub(r"^```[a-zA-Z]*\n", "", text)
    text = re.sub(r"\n```$", "", text)
    return text.strip()

agent = Agent(
    name="gemini_ranking_agent",
    seed="gemini_ranking_agent_seed",
    port=8004,
    endpoint=["http://localhost:8004/submit"]
)

@agent.on_message(model=RankRequest, replies=RankResponse)
async def handle_ranking(ctx: Context, sender: str, msg: RankRequest):
    prompt = f"""
You are an expert at ranking professionals for event outreach. Given the event details and a list of LinkedIn profiles, score each profile from 1-10 for relevancy and provide a detailed explanation for each score.

Event details:
{json.dumps(msg.event_details, indent=2)}

Profiles:
{json.dumps(msg.profiles, indent=2)}

Return a JSON array of objects with keys: profile, score, explanation.
"""
    resp = client.models.generate_content(model="gemini-2.5-flash-preview-04-17", contents=[prompt])
    ranked = json.loads(strip_fences(resp.text))
    await ctx.send(sender, RankResponse(ranked=ranked))

@agent.on_rest_post("/api/ranking", RankRequest, RankResponse)
async def rest_ranking(ctx: Context, req: RankRequest) -> RankResponse:
    prompt = f"""
You are an expert at evaluating and ranking professionals for high-profile event outreach. Given the event details and a list of LinkedIn profiles, score each profile from 1-10 for relevancy and provide a detailed explanation for each score. Unless the event specifically targets undergraduates, prioritize established professionals, senior researchers, executives, and thought leaders. Consider their experience, seniority, public speaking history, and relevance to the event. Avoid ranking undergraduate students or entry-level professionals highly unless specified. Be highly selective and rigorous in your scoring.

Event details:
{json.dumps(req.event_details, indent=2)}

Profiles:
{json.dumps(req.profiles, indent=2)}

Return a JSON array of objects with keys: profile, score, explanation.
"""
    resp = client.models.generate_content(model="gemini-2.5-flash-preview-04-17", contents=[prompt])
    ranked = json.loads(strip_fences(resp.text))
    return RankResponse(ranked=ranked)

if __name__ == "__main__":
    agent.run()