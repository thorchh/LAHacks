from uagents import Agent, Context, Model, Field
import json, re
from google import genai

GEMINI_API_KEY = "AIzaSyDOKIJlSe93VtTz4G2Mj2U22S2TDhawS2o"
client = genai.Client(api_key=GEMINI_API_KEY)

class OutreachRequest(Model):
    profile: dict = Field(description="Profile to contact.")
    event_details: dict = Field(description="Event details.")
    explanation: str = Field(description="Why this person is a good fit.")

class OutreachResponse(Model):
    message: str = Field(description="Personalized outreach message.")

def strip_fences(text: str) -> str:
    text = re.sub(r"^```[a-zA-Z]*\n", "", text)
    text = re.sub(r"\n```$", "", text)
    return text.strip()

agent = Agent(
    name="linkd_agent",
    seed="linkd_agent_seed",
    port=8006,
    endpoint=["http://localhost:8006/submit"]
)

@agent.on_message(model=OutreachRequest, replies=OutreachResponse)
async def handle_outreach(ctx: Context, sender: str, msg: OutreachRequest):
    prompt = f"""
You are an expert at writing personalized outreach emails for event speakers and panelists.
Given the following profile:
{json.dumps(msg.profile, indent=2)}

Event details:
{json.dumps(msg.event_details, indent=2)}

Reason for outreach:
{msg.explanation}

Write a concise, friendly, and professional outreach email inviting this person to participate in the event. Mention the event, their relevance, and offer to provide more details.
"""
    resp = client.models.generate_content(model="gemini-2.5-flash-preview-04-17", contents=[prompt])
    message = strip_fences(resp.text)
    await ctx.send(sender, OutreachResponse(message=message))

@agent.on_rest_post("/api/outreach", OutreachRequest, OutreachResponse)
async def rest_outreach(ctx: Context, req: OutreachRequest) -> OutreachResponse:
    prompt = f"""
You are an expert at writing highly personalized, concise, and compelling outreach emails for event speakers and panelists. Your goal is to attract the best of the best: established professionals, senior researchers, executives, and thought leaders. Unless the event specifically targets undergraduate students, do NOT write outreach for undergraduates or entry-level professionals. Reference the recipient's expertise and relevance to the event, and make the invitation feel exclusive and tailored. Given the following profile, event details, and reason for outreach:

Profile:
{json.dumps(req.profile, indent=2)}

Event details:
{json.dumps(req.event_details, indent=2)}

Reason for outreach:
{req.explanation}

Write a concise, friendly, and professional outreach email inviting this person to participate in the event. Mention the event, their relevance, and offer to provide more details. Make it clear why they were selected and why their participation would be valuable.
"""
    resp = client.models.generate_content(model="gemini-2.5-flash-preview-04-17", contents=[prompt])
    message = strip_fences(resp.text)
    return OutreachResponse(message=message)

if __name__ == "__main__":
    agent.run()
