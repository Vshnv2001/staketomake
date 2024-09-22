import uuid
from pydantic import BaseModel, Field

class TelegramUser(BaseModel):
    telegram_id: str = Field(..., description="Telegram ID of the user")
    user_id: str = Field(..., description="User ID of the person who made the submission")
    id: uuid.UUID = Field(..., description="ID of the user")
    
    class Config:
        allow_population_by_field_name = True
        populate_by_name = True 