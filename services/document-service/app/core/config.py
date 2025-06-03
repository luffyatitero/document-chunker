from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "sqlite:///./app.db"
    ALLOWED_ORIGINS: str = "*"

    class Config:
        env_file = ".env"


settings = Settings()