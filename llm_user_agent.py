from uagents import Agent, Context, Model, Field

# Replace with your actual Gemini agent address
GEMINI_AGENT_ADDRESS = "agent1q0q5ndjhjk5eaafse53pfknz3x5jkt5rghd0sqk7p7u97fk7shte564s262"

# Sample event details from your logs
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

agent = Agent(name="llm_user_agent", seed="llm_user_agent_seed")

@agent.on_event("startup")
async def send_sample(ctx: Context):
    ctx.logger.info("Sending sample event to Gemini agent for keyword extraction")
    await ctx.send(GEMINI_AGENT_ADDRESS, KeywordsRequest(event_details=SAMPLE_EVENT))

@agent.on_message(model=KeywordsResponse)
async def handle_keywords(ctx: Context, sender: str, msg: KeywordsResponse):
    ctx.logger.info(f"Received keywords from Gemini agent: {msg.companies}, {msg.universities}, {msg.roles}")

if __name__ == "__main__":
    agent.run()