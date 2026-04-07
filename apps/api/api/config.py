"""Application configuration via environment variables."""

from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    """App settings loaded from environment variables."""

    database_url: str = "postgresql://ping77:ping77@localhost:5432/ping77"
    redis_url: str = "redis://localhost:6379"
    api_port: int = 8000
    uploads_enabled: bool = True
    market_layer: str = "disabled"
    anthropic_api_key: str = ""

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
