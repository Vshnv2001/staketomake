from fastapi import APIRouter

from database.supabase_client import get_user_by_telegram_id, update_user_telegram_id
from models.telegram_users import TelegramUser
from fastapi import APIRouter


router = APIRouter(prefix="/api/telegram", tags=["telegram"], responses={404: {"description": "Not Found"}})

@router.get("/{telegram_id}", response_model=TelegramUser, summary="Get user")
def get_telegram_user(telegram_id: str):
    return get_user_by_telegram_id(telegram_id)

@router.post("/{user_id}", response_model=TelegramUser, summary="Get user")
def update_telegram_user(user_id: str, telegram_id: str):
    return update_user_telegram_id(user_id, telegram_id)

