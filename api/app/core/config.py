from pathlib import Path

from pydantic import SecretStr
from pydantic_settings import BaseSettings, SettingsConfigDict

BASE_DIR = Path(__file__).resolve().parent.parent.parent

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=BASE_DIR / ".env", env_file_encoding="utf-8")

    secret_key: SecretStr
    algorithm: str = "HS256"
    access_token_ttl: int = 3600
    db_url: str = "postgresql://app:root@localhost:5432/app"
    test_db_url: str = "postgresql://app:root@localhost:5433/test_app"
    web_app_url: str = "http://localhost:5173"

settings = Settings() # type: ignore