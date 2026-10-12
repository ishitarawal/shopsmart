"""
AI service, behind a provider abstraction so the AI vendor can change
later without touching routes, the recommendation engine, or the frontend.

MockAIProvider uses lightweight rule-based NLP (regex + keyword rules) to
extract structured requirements and hold a slot-filling conversation. It's
good enough to demo the full product experience with zero API key, and it
NEVER invents product data — it only ever extracts intent; actual product
facts always come from ProductProvider.

RealAIProvider calls a real AI API (Anthropic by default) once AI_API_KEY
is set. It asks the model to return strict JSON for extraction, and plain
text for chat replies, using the AI's own knowledge of language only —
never letting it fabricate prices/specs (the system prompt explicitly
forbids that, and the chat route always attaches real ProductOut data
after the AI turn).
"""
import json
import re
from abc import ABC, abstractmethod
from typing import List, Optional

import httpx

from app.config import get_settings
from app.schemas.product import ExtractedRequirements

settings = get_settings()

CATEGORY_KEYWORDS = {
    "Earbuds": ["earbud", "earbuds", "tws", "wireless earbud"],
    "Headphones": ["headphone", "headphones", "over-ear", "on-ear"],
    "Laptops": ["laptop", "notebook", "ultrabook"],
    "Smartphones": ["phone", "smartphone", "mobile"],
    "Smartwatches": ["smartwatch", "watch", "fitness band"],
    "Shoes": ["shoes", "sneakers", "running shoes", "trainers"],
    "Fashion": ["shirt", "t-shirt", "tee", "jeans", "jacket"],
    "Home & Kitchen": ["mixer", "kettle", "espresso", "kitchen", "appliance"],
}

PREFERENCE_KEYWORDS = [
    "good battery life", "battery life", "lightweight", "noise cancellation",
    "anc", "strong bass", "bass", "waterproof", "fast charging",
    "good camera", "gaming", "durable", "stylish",
]

USE_CASE_KEYWORDS = {
    "travelling": ["travel", "flight", "commute", "commuting"],
    "coding": ["coding", "programming", "development", "dev work"],
    "college": ["college", "university", "student", "school"],
    "gaming": ["gaming", "games"],
    "office work": ["office", "work from home", "wfh"],
    "running": ["running", "jogging", "marathon"],
    "workout": ["workout", "gym", "exercise", "fitness"],
}


def _extract_budget(text: str) -> Optional[float]:
    text = text.replace(",", "")
    # ₹3,000 / Rs 3000 / under 3000 / 3k
    match = re.search(r"(?:₹|rs\.?|inr)?\s*(\d+(?:\.\d+)?)\s*(k)?", text, re.IGNORECASE)
    for m in re.finditer(r"(₹|rs\.?|inr)\s*(\d+(?:\.\d+)?)\s*(k)?", text, re.IGNORECASE):
        val = float(m.group(2))
        if m.group(3):
            val *= 1000
        return val
    m = re.search(r"\bunder\s+(\d+(?:\.\d+)?)\s*(k)?\b", text, re.IGNORECASE)
    if m:
        val = float(m.group(1))
        if m.group(2):
            val *= 1000
        return val
    m = re.search(r"\b(\d{3,6})\s*k?\b", text, re.IGNORECASE)
    if m and ("budget" in text.lower() or "under" in text.lower() or "₹" in text):
        return float(m.group(1))
    return None


def _rule_based_extract(query: str) -> ExtractedRequirements:
    text = query.lower()

    category = None
    for cat, kws in CATEGORY_KEYWORDS.items():
        if any(kw in text for kw in kws):
            category = cat
            break

    use_case = None
    for uc, kws in USE_CASE_KEYWORDS.items():
        if any(kw in text for kw in kws):
            use_case = uc
            break

    preferences = [p for p in PREFERENCE_KEYWORDS if p in text]
    # de-duplicate overlapping matches like "battery life" inside "good battery life"
    preferences = sorted(set(preferences), key=len, reverse=True)
    deduped: List[str] = []
    for p in preferences:
        if not any(p in kept for kept in deduped):
            deduped.append(p)

    return ExtractedRequirements(
        category=category,
        budget_max=_extract_budget(text),
        use_case=use_case,
        preferences=deduped,
        raw_query=query,
    )


class AIProvider(ABC):
    @abstractmethod
    async def extract_requirements(self, query: str) -> ExtractedRequirements:
        ...

    @abstractmethod
    async def chat_reply(
        self,
        message: str,
        conversation_history: List[dict],
        known_requirements: ExtractedRequirements,
    ) -> dict:
        """Returns {"reply": str, "requirements": ExtractedRequirements,
        "needs_clarification": bool, "suggested_replies": List[str]}"""
        ...


class MockAIProvider(AIProvider):
    """Rule-based provider. No API key required — this is what demo mode uses."""

    async def extract_requirements(self, query: str) -> ExtractedRequirements:
        return _rule_based_extract(query)

    async def chat_reply(self, message, conversation_history, known_requirements) -> dict:
        new_info = _rule_based_extract(message)
        merged = ExtractedRequirements(
            category=new_info.category or known_requirements.category,
            budget_max=new_info.budget_max or known_requirements.budget_max,
            use_case=new_info.use_case or known_requirements.use_case,
            preferences=list(dict.fromkeys((known_requirements.preferences or []) + new_info.preferences)),
            raw_query=message,
        )

        missing = []
        if not merged.category:
            missing.append("category")
        if not merged.budget_max:
            missing.append("budget")
        if not merged.preferences:
            missing.append("preferences")

        if not missing:
            reply = (
                f"Got it — {merged.category.lower()} under ₹{int(merged.budget_max):,} "
                f"with {', '.join(merged.preferences)}. Let me find matches for you."
            )
            return {
                "reply": reply, "requirements": merged, "needs_clarification": False,
                "suggested_replies": [],
            }

        if "category" in missing:
            reply = "Sure — what kind of product are you looking for?"
            suggestions = ["Earbuds", "Laptop", "Headphones", "Smartphone"]
        elif "budget" in missing:
            reply = f"Great choice. What's your budget for the {merged.category.lower()}?"
            suggestions = ["Under ₹2,000", "Under ₹5,000", "Under ₹50,000"]
        else:
            reply = "Got it. Any specific must-haves — battery life, noise cancellation, lightweight?"
            suggestions = ["Good battery life", "Noise cancellation", "Lightweight"]

        return {
            "reply": reply, "requirements": merged, "needs_clarification": True,
            "suggested_replies": suggestions,
        }


class RealAIProvider(AIProvider):
    """Calls a real AI API (Anthropic Messages API by default)."""

    def __init__(self):
        if not settings.ai_configured:
            raise RuntimeError("RealAIProvider requires AI_API_KEY to be set")

    EXTRACTION_SYSTEM_PROMPT = (
        "You extract shopping requirements from a user's message into strict JSON only: "
        '{"category": str|null, "budget_max": number|null, "budget_min": number|null, '
        '"use_case": str|null, "preferences": string[], "brand": str|null}. '
        "Never invent product names, prices, or specifications. Output JSON only, no prose."
    )

    CHAT_SYSTEM_PROMPT = (
        "You are ShopSmart AI, a friendly shopping assistant. Ask short clarifying "
        "questions to learn the user's category, budget, use case, and preferences. "
        "Never invent specific product names, prices, or specifications — those "
        "always come from ShopSmart's product catalog, added after your reply."
    )

    async def _call(self, system: str, user: str) -> str:
        async with httpx.AsyncClient(timeout=30) as client:
            resp = await client.post(
                "https://api.anthropic.com/v1/messages",
                headers={
                    "x-api-key": settings.ai_api_key,
                    "anthropic-version": "2023-06-01",
                    "content-type": "application/json",
                },
                json={
                    "model": settings.ai_model,
                    "max_tokens": 500,
                    "system": system,
                    "messages": [{"role": "user", "content": user}],
                },
            )
            resp.raise_for_status()
            data = resp.json()
            return "".join(b.get("text", "") for b in data.get("content", []) if b.get("type") == "text")

    async def extract_requirements(self, query: str) -> ExtractedRequirements:
        raw = await self._call(self.EXTRACTION_SYSTEM_PROMPT, query)
        try:
            parsed = json.loads(raw.strip().strip("`"))
        except json.JSONDecodeError:
            return _rule_based_extract(query)  # graceful fallback
        parsed["raw_query"] = query
        return ExtractedRequirements(**parsed)

    async def chat_reply(self, message, conversation_history, known_requirements) -> dict:
        merged = await self.extract_requirements(message)
        history_text = "\n".join(f"{h['role']}: {h['content']}" for h in conversation_history[-6:])
        prompt = f"Conversation so far:\n{history_text}\nUser: {message}\nKnown so far: {known_requirements.model_dump()}"
        reply = await self._call(self.CHAT_SYSTEM_PROMPT, prompt)
        needs_clarification = not (merged.category and merged.budget_max)
        return {
            "reply": reply.strip(), "requirements": merged,
            "needs_clarification": needs_clarification, "suggested_replies": [],
        }


def get_ai_provider() -> AIProvider:
    if settings.ai_configured:
        try:
            return RealAIProvider()
        except Exception:
            pass  # fall back to mock so the app keeps working without an API key
    return MockAIProvider()
