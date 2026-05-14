from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_file_encoding="utf-8")

    secret_key: SecretStr
    algorithm: str = "HS256"
    access_token_ttl: int = 3600
    refresh_token_ttl: int = 3600 * 24 * 7
    db_url: str
    test_db_url: str
    cors_origins: list[str]


settings = Settings()  # type: ignore
