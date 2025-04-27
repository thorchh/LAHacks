from uagents import Agent, Context, Model, Protocol, Field
from pydantic import BaseModel
import os
import json
from google import genai
import re

GEMINI_API_KEY = "AIzaSyDOKIJlSe93VtTz4G2Mj2U22S2TDhawS2o"
client = genai.Client(api_key=GEMINI_API_KEY)

# Request/Response Models
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

class RankRequest(Model):
    profiles: list = Field(description="List of LinkedIn profiles.")
    event_details: dict = Field(description="Event details.")

class RankResponse(Model):
    ranked: list = Field(description="Ranked profiles with scores and explanations.")

# Agent definition
agent = Agent(name="gemini_agent", seed="gemini_agent_seed")

def strip_fences(text: str) -> str:
    text = re.sub(r"^```[a-zA-Z]*\n", "", text)
    text = re.sub(r"\n```$", "", text)
    return text.strip()

@agent.on_message(model=KeywordsRequest, replies=KeywordsResponse)
async def handle_keywords(ctx: Context, sender: str, msg: KeywordsRequest):
    ctx.logger.info("Received KeywordsRequest message")
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
    ctx.logger.info("Sending prompt to Gemini for keywords extraction")
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    ctx.logger.info(f"Raw Gemini response: {resp.text}")
    try:
        data = json.loads(strip_fences(resp.text))
        # Convert comma-separated strings to lists
        for key in ["companies", "universities", "roles"]:
            if key in data and isinstance(data[key], str):
                data[key] = [item.strip() for item in data[key].split(",") if item.strip()]
        ctx.logger.info(f"Parsed keywords: {data}")
        await ctx.send(sender, KeywordsResponse(**data))
        ctx.logger.info("Sent KeywordsResponse")
    except Exception as e:
        ctx.logger.error(f"JSONDecodeError: {e}")

@agent.on_message(model=QueriesRequest, replies=QueriesResponse)
async def handle_queries(ctx: Context, sender: str, msg: QueriesRequest):
    ctx.logger.info("Received QueriesRequest message")
    prompt = f"""
You are an expert in creating diverse natural language search queries for people discovery on search engines and LinkedIn. Given the following event details and related keywords:

Event details:
{json.dumps(msg.event_details, indent=2)}

Keywords:
{json.dumps(msg.keywords, indent=2)}

Create 6-8 diverse, creative, and realistic search queries (as a JSON array of strings) that someone would type into a search engine or LinkedIn to find people. Do NOT use SQL or boolean logic like AND/OR.
"""
    ctx.logger.info("Sending prompt to Gemini for query generation")
    resp = client.models.generate_content(
        model="gemini-2.0-flash",
        contents=[prompt]
    )
    ctx.logger.info(f"Raw Gemini response: {resp.text}")
    try:
        queries = json.loads(strip_fences(resp.text))
        ctx.logger.info(f"Parsed queries: {queries}")
        await ctx.send(sender, QueriesResponse(queries=queries))
        ctx.logger.info("Sent QueriesResponse")
    except Exception as e:
        ctx.logger.error(f"JSONDecodeError: {e}")

@agent.on_message(model=RankRequest, replies=RankResponse)
async def handle_ranking(ctx: Context, sender: str, msg: RankRequest):
    ctx.logger.info("Received RankRequest message")
    prompt = f"""
You are an expert at ranking professionals for event outreach. Given the event details and a list of LinkedIn profiles, score each profile from 1-10 for relevancy and provide a detailed explanation for each score.

Event details:
{json.dumps(msg.event_details, indent=2)}

Profiles:
{json.dumps(msg.profiles, indent=2)}

Return a JSON array of objects with keys: profile, score, explanation.
"""
    ctx.logger.info("Sending prompt to Gemini for ranking")
    resp = client.models.generate_content(
        model="gemini-2.5-flash-preview-04-17",
        contents=[prompt]
    )
    ctx.logger.info(f"Raw Gemini response: {resp.text}")
    try:
        ranked = json.loads(strip_fences(resp.text))
        ctx.logger.info(f"Parsed ranking: {ranked}")
        await ctx.send(sender, RankResponse(ranked=ranked))
        ctx.logger.info("Sent RankResponse")
    except Exception as e:
        ctx.logger.error(f"JSONDecodeError: {e}")

if __name__ == "__main__":
    agent.run()