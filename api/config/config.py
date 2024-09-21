from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    supabase_url: str | None = None
    supabase_key: str | None = None
    web3_provider: str | None = None

    model_config: SettingsConfigDict = SettingsConfigDict(env_file=".env")
