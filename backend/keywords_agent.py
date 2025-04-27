from uagents import Agent, Context, Model, Field
import json, re
from google import genai

GEMINI_API_KEY = "AIzaSyDOKIJlSe93VtTz4G2Mj2U22S2TDhawS2o"
client = genai.Client(api_key=GEMINI_API_KEY)

class KeywordsRequest(Model):
    event_details: dict = Field(description="Event details for keyword extraction.")

class KeywordsResponse(Model):
    companies: list = Field(description="List of companies.")
    universities: list = Field(description="List of universities.")
    roles: list = Field(description="List of professional roles.")

def strip_fences(text: str) -> str:
    text = re.sub(r"^```[a-zA-Z]*\n", "", text)
    text = re.sub(r"\n```$", "", text)
    return text.strip()

agent = Agent(
    name="gemini_keywords_agent",
    seed="gemini_keywords_agent_seed",
    port=8001,
    endpoint=["http://localhost:8001/submit"]
)

@agent.on_message(model=KeywordsRequest, replies=KeywordsResponse)
async def handle_keywords(ctx: Context, sender: str, msg: KeywordsRequest):
    prompt = f"""
You are an expert at extracting related companies, universities, and professional roles from event descriptions.
Given the following event details:

{json.dumps(msg.event_details, indent=2)}

List:
- 5 companies (comma separated)
- 5 universities (comma separated)
- 5 professional roles (comma separated)
Return as a JSON object with keys: companies, universities, roles.
"""
    resp = client.models.generate_content(model="gemini-2.0-flash", contents=[prompt])
    data = json.loads(strip_fences(resp.text))
    for key in ["companies", "universities", "roles"]:
        if key in data and isinstance(data[key], str):
            data[key] = [item.strip() for item in data[key].split(",") if item.strip()]
    await ctx.send(sender, KeywordsResponse(**data))

@agent.on_rest_post("/api/keywords", KeywordsRequest, KeywordsResponse)
async def rest_keywords(ctx: Context, req: KeywordsRequest) -> KeywordsResponse:
    prompt = f"""
You are an expert at extracting the most relevant and high-caliber companies, universities, and professional roles from event descriptions for the purpose of identifying top-tier speakers and panelists. Unless the event specifically targets undergraduate students, do NOT include undergraduate students or entry-level roles as leads. Focus on established professionals, researchers, executives, and thought leaders. Given the following event details:

{json.dumps(req.event_details, indent=2)}

List:
- 5 top companies (comma separated)
- 5 leading universities (comma separated)
- 5 senior professional roles (comma separated)
Return as a JSON object with keys: companies, universities, roles.
"""
    resp = client.models.generate_content(model="gemini-2.0-flash", contents=[prompt])
    data = json.loads(strip_fences(resp.text))
    for key in ["companies", "universities", "roles"]:
        if key in data and isinstance(data[key], str):
            data[key] = [item.strip() for item in data[key].split(",") if item.strip()]
    return KeywordsResponse(**data)

if __name__ == "__main__":
    agent.run()