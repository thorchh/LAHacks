from uagents import Agent, Context, Model, Field
import json, re
from google import genai

GEMINI_API_KEY = "AIzaSyDOKIJlSe93VtTz4G2Mj2U22S2TDhawS2o"
client = genai.Client(api_key=GEMINI_API_KEY)

class QueriesRequest(Model):
    event_details: dict = Field(description="Event details.")
    keywords: dict = Field(description="Keywords for query generation.")

class QueriesResponse(Model):
    queries: list = Field(description="List of search queries.")

def strip_fences(text: str) -> str:
    text = re.sub(r"^```[a-zA-Z]*\n", "", text)
    text = re.sub(r"\n```$", "", text)
    return text.strip()

agent = Agent(
    name="gemini_queries_agent",
    seed="gemini_queries_agent_seed",
    port=8002,
    endpoint=["http://localhost:8002/submit"]
)

@agent.on_message(model=QueriesRequest, replies=QueriesResponse)
async def handle_queries(ctx: Context, sender: str, msg: QueriesRequest):
    prompt = f"""
You are an expert in creating diverse natural language search queries for people discovery on Linkd a natural language people finder. It only works with natural language. Given the following event details and related keywords:

Event details:
{json.dumps(msg.event_details, indent=2)}

Keywords:
{json.dumps(msg.keywords, indent=2)}

Create 6-8 diverse, creative, and realistic search queries (as a JSON array of strings) that someone would type into a search engine or LinkedIn to find people. Do NOT use SQL or boolean logic like AND/OR.
"""
    resp = client.models.generate_content(model="gemini-2.0-flash", contents=[prompt])
    queries = json.loads(strip_fences(resp.text))
    await ctx.send(sender, QueriesResponse(queries=queries))

@agent.on_rest_post("/api/queries", QueriesRequest, QueriesResponse)
async def rest_queries(ctx: Context, req: QueriesRequest) -> QueriesResponse:
    prompt = f"""
You are an expert in writing NATURAL LANGUAGE QUERIES for deep research and people discovery for high-profile events. Your job is to reverse engineer the event into the ideal types of speakers and panelists, then craft highly effective, realistic, and creative search queries to find them. For each event, think about:
- What kind of person would be the dream speaker or panelist? (e.g., a tenured professor in AI ethics, a published author on AI policy, a CTO at a top AI company, a government advisor on AI regulation, a climate tech CEO, a biotech founder, a public health leader, a fintech innovator, a renowned artist, a best-selling author, a startup founder, a city mayor, a chief medical officer, etc.)
- What backgrounds, achievements, or affiliations would make someone a perfect fit?
- What search queries would surface these people on LinkedIn or Google?

Unless the event specifically targets undergraduate students, avoid queries that would return undergraduates or entry-level professionals. Focus on queries that surface established professionals, senior researchers, executives, and thought leaders. Do not crowd the queries with too many keywords or generic terms. Do NOT use generic phrases like "for this event", "for UCLA event", or mention the event itself. Do NOT use boolean logic, SQL, AND/OR, or put platform names like "LinkedIn" at the front of the query. Instead, focus on the type of person and their background, role, or achievement.

Given the following event details and related keywords:

Event details:
{json.dumps(req.event_details, indent=2)}

Keywords:
{json.dumps(req.keywords, indent=2)}

Create 6-8 diverse, creative, and realistic search queries (as a JSON array of strings) that someone would type into a search engine or LinkedIn to find high-caliber people. Make the queries sound like what a real event organizer would want to have as their top speakers or panelists.

Here are some examples of excellent queries:
- "AI research lead at top tech company"
- "Founder of successful Web3 startup"
- "PhD in computer science working at Google or Meta"


Now, create the best possible queries for this event:
"""
    resp = client.models.generate_content(model="gemini-2.5-flash-preview-04-17", contents=[prompt])
    queries = json.loads(strip_fences(resp.text))
    return QueriesResponse(queries=queries)

if __name__ == "__main__":
    agent.run()