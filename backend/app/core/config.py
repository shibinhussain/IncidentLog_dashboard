from __future__ import annotations

import os
from pathlib import Path

from dotenv import load_dotenv


BASE_DIR = Path(__file__).resolve().parents[2]
load_dotenv(BASE_DIR / ".env")

DEFAULT_DATABASE_URL = (
    "postgresql+psycopg://incident_user:incident_password@localhost:5432/"
    "incident_dashboard"
)
DEFAULT_ALLOWED_ORIGINS = "http://localhost:5173"


class Settings:
    def __init__(self) -> None:
        self.app_title = "Incident Dashboard API"
        self.api_prefix = "/api/v1"
        self.allowed_origins = [
            origin.strip()
            for origin in os.getenv("ALLOWED_ORIGINS", DEFAULT_ALLOWED_ORIGINS).split(",")
            if origin.strip()
        ]
        self.database_url = os.getenv("DATABASE_URL", DEFAULT_DATABASE_URL)


settings = Settings()
