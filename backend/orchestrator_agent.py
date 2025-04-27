import asyncio
from uagents import Agent, Context, Model, Field

# Replace with your actual agent addresses
KEYWORDS_AGENT_ADDRESS = "agent1qw8629dtq70ej0pd8yq2q99c2wjjjz4fq6w85qzjdzagwdm55yqy5aw9vv2"  # Fill in actual address
QUERIES_AGENT_ADDRESS = "agent1qfvrh5z03sxm70h687dld2j33rk9gcl2dhnsykfkeuwcrtzhug2uk0w8g8s"    # Fill in actual address
LINKD_AGENT_ADDRESS = "agent1q0jvx70kk5lh86pgx7spqd7yc2kjc39uxyy36yqkvt3yhep2ck52wxm0cev"        # Fill in actual address
RANKING_AGENT_ADDRESS = "agent1q0eu0qpzrrhf9qeked7wnzaz3ljdzek8jnlz8znpfehnn9u6wh8zcq3tc3k"    # Fill in actual address
OUTREACH_AGENT_ADDRESS = "agent1q0jvx70kk5lh86pgx7spqd7yc2kjc39uxyy36yqkvt3yhep2ck52wxm0cev"  # Fill in actual address

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

class KeywordsRequest(Model):
    event_details: dict = Field(description="Event details for keyword extraction.")

class KeywordsResponse(Model):
    companies: list = Field(description="List of companies.")
    universities: list = Field(description="List of universities.")
    roles: list = Field(description="List of professional roles.")

class QueriesRequest(Model):
    event_details: dict = Field(description="Event details.")
    keywords: dict = Field(description="Keywords for query generation.")

class QueriesResponse(Model):
    queries: list = Field(description="List of search queries.")

class LinkdSearchRequest(Model):
    query: str = Field(description="Search query for Linkd API.")

class LinkdSearchResponse(Model):
    results: list = Field(description="List of profile results.")

class RankRequest(Model):
    profiles: list = Field(description="List of LinkedIn profiles.")
    event_details: dict = Field(description="Event details.")

class RankResponse(Model):
    ranked: list = Field(description="Ranked profiles with scores and explanations.")


agent = Agent(
    name="orchestrator_agent",
    seed="orchestrator_agent_seed",
    port=8005,
    endpoint=["http://localhost:8005/submit"]
)

all_profiles = []
pending_queries = 0
all_ranked = []
pending_batches = 0
linkd_timeout_fired = False

def batch_profiles(profiles, batch_size=20):
    for i in range(0, len(profiles), batch_size):
        yield profiles[i:i+batch_size]

@agent.on_event("startup")
async def start_workflow(ctx: Context):
    global all_profiles, pending_queries, all_ranked, pending_batches, linkd_timeout_fired
    all_profiles = []
    all_ranked = []
    pending_queries = 0
    pending_batches = 0
    linkd_timeout_fired = False
    ctx.logger.info("Sending event to Keywords Agent...")
    await ctx.send(KEYWORDS_AGENT_ADDRESS, KeywordsRequest(event_details=SAMPLE_EVENT))

@agent.on_message(model=KeywordsResponse)
async def got_keywords(ctx: Context, sender: str, msg: KeywordsResponse):
    ctx.logger.info(f"Received keywords: {msg.companies}, {msg.universities}, {msg.roles}")
    keywords = {
        "companies": msg.companies,
        "universities": msg.universities,
        "roles": msg.roles
    }
    ctx.logger.info("Sending event and keywords to Queries Agent...")
    await ctx.send(QUERIES_AGENT_ADDRESS, QueriesRequest(event_details=SAMPLE_EVENT, keywords=keywords))

@agent.on_message(model=QueriesResponse)
async def got_queries(ctx: Context, sender: str, msg: QueriesResponse):
    global all_profiles, pending_queries, linkd_timeout_fired
    ctx.logger.info(f"Received queries: {msg.queries}")
    all_profiles = []
    pending_queries = len(msg.queries)
    linkd_timeout_fired = False

    async def send_linkd_queries_throttled(queries, delay=1.0):
        for query in queries:
            ctx.logger.info(f"Sending query to Linkd Agent: {query}")
            await ctx.send(LINKD_AGENT_ADDRESS, LinkdSearchRequest(query=query))
            await asyncio.sleep(delay)  # Throttle requests

    # Start throttled sending as a background task
    asyncio.create_task(send_linkd_queries_throttled(msg.queries, delay=1.0))
    # Start a timer to recover from timeouts
    asyncio.create_task(linkd_timeout_handler(ctx, timeout=90))

async def linkd_timeout_handler(ctx, timeout=90):
    global pending_queries, linkd_timeout_fired
    await asyncio.sleep(timeout)
    if pending_queries > 0 and not linkd_timeout_fired:
        linkd_timeout_fired = True
        ctx.logger.error(f"Timeout: {pending_queries} Linkd queries did not return in {timeout} seconds. Proceeding with available results.")
        pending_queries = 0
        await process_linkd_results(ctx)

async def process_linkd_results(ctx):
    global all_profiles, pending_batches, all_ranked
    seen = set()
    deduped = []
    for p in all_profiles:
        key = p.get('linkedin_url') or p.get('id') or p.get('name')
        if not key:
            key = str(p)
        if key and key not in seen:
            seen.add(key)
            deduped.append(p)
    ctx.logger.info(f"Deduped to {len(deduped)} unique profiles. Sending to Ranking Agent in batches...")
    batches = list(batch_profiles(deduped, batch_size=20))
    pending_batches = len(batches)
    all_ranked.clear()
    if not batches:
        ctx.logger.error("No deduped profiles to rank. Exiting pipeline.")
        return
    for batch in batches:
        await ctx.send(RANKING_AGENT_ADDRESS, RankRequest(profiles=batch, event_details=SAMPLE_EVENT))

@agent.on_message(model=LinkdSearchResponse)
async def got_linkd_results(ctx: Context, sender: str, msg: LinkdSearchResponse):
    global all_profiles, pending_queries, linkd_timeout_fired
    ctx.logger.info(f"Received {len(msg.results)} profiles from Linkd Agent.")
    all_profiles.extend(msg.results)
    pending_queries -= 1
    if pending_queries == 0 and not linkd_timeout_fired:
        linkd_timeout_fired = True
        await process_linkd_results(ctx)

@agent.on_message(model=RankResponse)
async def got_ranking(ctx: Context, sender: str, msg: RankResponse):
    global all_ranked, pending_batches
    ctx.logger.info(f"Received ranked profiles from Ranking Agent.")
    all_ranked.extend(msg.ranked)
    pending_batches -= 1
    if pending_batches == 0:
        if not all_ranked:
            ctx.logger.error("No ranked leads found. Exiting pipeline.")
            return
        top_leads = sorted(all_ranked, key=lambda x: -x['score'])[:5]
        for i, lead in enumerate(top_leads, 1):
            p = lead['profile']
            desc = p.get('description') or '[no bio]'
            ctx.logger.info(f"{i}. {p.get('name', '[no name]')} — {p.get('headline', '[no headline]')}")
            ctx.logger.info(f"   {p.get('linkedin_url', '[no url]')}")
            ctx.logger.info(f"   Bio: {desc[:80]}...")
            ctx.logger.info(f"   Score: {lead['score']}")
            ctx.logger.info(f"   Explanation: {lead['explanation']}")
            await ctx.send(OUTREACH_AGENT_ADDRESS, OutreachRequest(profile=p, event_details=SAMPLE_EVENT, explanation=lead['explanation']))

if __name__ == "__main__":
    agent.run()
