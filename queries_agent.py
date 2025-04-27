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
You are an expert in creating diverse natural language search queries for people discovery on search engines and LinkedIn. Given the following event details and related keywords:

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
You are an expert in deep research and people discovery for high-profile events. Your job is to reverse engineer the event into the ideal types of speakers and panelists, then craft highly effective, realistic, and creative search queries to find them. For each event, think about:
- What kind of person would be the dream speaker or panelist? (e.g., a tenured professor in AI ethics, a published author on AI policy, a CTO at a top AI company, a government advisor on AI regulation, a climate tech CEO, a sustainability officer, a biotech founder, a public health leader, a fintech innovator, a renowned artist, a best-selling author, a Nobel laureate, a startup founder, a city mayor, a chief medical officer, etc.)
- What backgrounds, achievements, or affiliations would make someone a perfect fit?
- What search queries would surface these people on LinkedIn or Google?

Unless the event specifically targets undergraduate students, avoid queries that would return undergraduates or entry-level professionals. Focus on queries that surface established professionals, senior researchers, executives, and thought leaders.

Given the following event details and related keywords:

Event details:
{json.dumps(req.event_details, indent=2)}

Keywords:
{json.dumps(req.keywords, indent=2)}

Create 6-8 diverse, creative, and realistic search queries (as a JSON array of strings) that someone would type into a search engine or LinkedIn to find high-caliber people. Do NOT use SQL or boolean logic like AND/OR. Make the queries sound like what a real event organizer would search for to find top speakers or panelists.

Here are some examples of excellent queries:
- "Keynote speaker AI ethics conference published author"
- "CTO artificial intelligence company public speaker"
- "Professor machine learning ethics Stanford invited talks"
- "Director responsible AI Google panelist experience"
- "Government advisor AI policy conference speaker"
- "Research scientist AI fairness DeepMind invited lectures"
- "Author book on AI and society keynote events"
- "Panelist AI regulation United Nations summit"
- "CEO climate tech startup demo day speaker"
- "Sustainability officer city government climate conference"
- "Founder biotech company public health summit panelist"
- "Fintech innovation leader blockchain conference keynote"
- "Urban planning expert smart cities symposium speaker"
- "Healthcare AI entrepreneur digital health event panelist"
- "Nobel laureate chemistry keynote science festival"
- "Best-selling author creative writing workshop guest"
- "Renowned artist contemporary art biennale panelist"
- "City mayor smart mobility summit keynote"
- "Chief medical officer pandemic response conference speaker"
- "Startup founder fintech innovation summit panelist"

Now, create the best possible queries for this event:
"""
    resp = client.models.generate_content(model="gemini-2.0-flash", contents=[prompt])
    queries = json.loads(strip_fences(resp.text))
    return QueriesResponse(queries=queries)

if __name__ == "__main__":
    agent.run()