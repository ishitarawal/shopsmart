"""
Central application settings, loaded from environment variables / .env.

Keeping every environment-sensitive value here (instead of scattered across
the codebase) means the rest of the app never touches os.environ directly,
and we always know exactly what "configuring ShopSmart" means.
"""
from functools import lru_cache
from typing import List, Optional

from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    environment: str = "development"

    # Database. Empty -> demo mode (local SQLite file, auto-seeded).
    database_url: str = ""

    # AI provider. Empty AI_API_KEY -> MockAIProvider is used automatically.
    ai_api_key: str = ""
    ai_api_provider: str = "anthropic"
    ai_model: str = "claude-sonnet-4-6"

    # External product API (Phase 4). Empty -> MockProductProvider only.
    product_api_key: str = ""
    product_api_base_url: str = ""

    cors_origins: str = "http://localhost:5173"

    @property
    def cors_origin_list(self) -> List[str]:
        return [o.strip() for o in self.cors_origins.split(",") if o.strip()]

    @property
    def is_demo_mode(self) -> bool:
        """True whenever we're missing the pieces needed to be a 'real' backend."""
        return not self.database_url

    @property
    def ai_configured(self) -> bool:
        return bool(self.ai_api_key)

    @property
    def product_api_configured(self) -> bool:
        return bool(self.product_api_key and self.product_api_base_url)


@lru_cache
def get_settings() -> Settings:
    return Settings()
