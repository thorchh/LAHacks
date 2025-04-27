from uagents import Agent, Context, Model, Field
import aiohttp
import asyncio

LINKD_API_KEY = "lk_5b1459f737dc4ee7b92face50b01b8f6"

class LinkdSearchRequest(Model):
    query: str = Field(description="Search query for Linkd API.")

class LinkdSearchResponse(Model):
    results: list = Field(description="List of profile results.")

agent = Agent(
    name="linkd_agent",
    seed="linkd_agent_seed",
    port=8003,
    endpoint=["http://localhost:8003/submit"]
)

async def search_query(query, retries=3):
    url = "https://search.linkd.inc/api/search/users"
    headers = {"Authorization": f"Bearer {LINKD_API_KEY}"}
    params = {"query": query, "limit": 10}
    timeout = aiohttp.ClientTimeout(total=60)
    try:
        async with aiohttp.ClientSession(timeout=timeout) as session:
            async with session.get(url, headers=headers, params=params) as resp:
                await asyncio.sleep(0.5)
                if resp.content_type != "application/json":
                    text = await resp.text()
                    print(f"[Error] Non-JSON response for '{query}': {resp.content_type} | Status: {resp.status} | Body: {text[:200]}")
                    return []
                data = await resp.json()
                return data.get("results", [])
    except Exception as e:
        print(f"[Error] Search for '{query}' failed: {repr(e)}")
        if retries > 0:
            await asyncio.sleep(1)
            return await search_query(query, retries - 1)
        print(f"[Error] Search failed after retries: {repr(e)}")
        return []

@agent.on_message(model=LinkdSearchRequest, replies=LinkdSearchResponse)
async def handle_linkd_search(ctx: Context, sender: str, msg: LinkdSearchRequest):
    results = await search_query(msg.query)
    await ctx.send(sender, LinkdSearchResponse(results=results))

@agent.on_rest_post("/api/linkd", LinkdSearchRequest, LinkdSearchResponse)
async def rest_linkd(ctx: Context, req: LinkdSearchRequest) -> LinkdSearchResponse:
    results = await search_query(req.query)
    return LinkdSearchResponse(results=results)

if __name__ == "__main__":
    agent.run()