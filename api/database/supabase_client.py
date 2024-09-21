import os
from typing import List

from fastapi import HTTPException
from supabase import create_client, Client

from models.goal import Goal
from config.config import Settings

# Initialize Supabase Client
SUPABASE_URL = Settings().supabase_url or os.getenv("SUPABASE_URL")
SUPABASE_KEY = Settings().supabase_key or os.getenv("SUPABASE_KEY")

if not SUPABASE_URL or not SUPABASE_KEY:
    raise ValueError("Supabase URL and KEY must be set in the environment or config.")

client: Client = create_client(SUPABASE_URL, SUPABASE_KEY)


def all_goals() -> List[Goal]:
    """
    Retrieve all goals from the database.
    """
    response = client.table("goals").select("*").execute()

    goals_data = response.data
    goal_models = []
    for goal in goals_data:
        participants_response = client.table("participants").select("participant").eq("id", goal["id"]).execute()
        participants_data = participants_response.data
        goal["participants"] = [participant["participant"] for participant in participants_data]
        goal_model = Goal(**goal)
        goal_models.append(goal_model)

    return goal_models


def get_goal_by_id(goal_id: str) -> Goal:
    """
    Retrieve a specific goal by its ID.
    """
    try:
        all_goal_models = all_goals()
        goal_model = [goal for goal in all_goal_models if goal.id == goal_id][0]
    except IndexError:
        return None

    return goal_model


def get_goals_by_user(user_id: str) -> List[Goal]:
    """
    Retrieve all goals for a specific user.
    """
    all_goal_models = all_goals()
    user_goals = [goal for goal in all_goal_models if goal.creator == user_id]
    return user_goals


def create_goal(goal: Goal) -> Goal:
    """
    Insert a new goal into the database.
    """
    goal_dict = goal.model_dump()
    goal_participants: List[str] = goal_dict.pop("participants", [])

    response = client.table("goals").upsert(goal_dict).execute()

    created_goal_data = response.data
    if not created_goal_data:
        raise HTTPException(status_code=500, detail="Failed to retrieve created goal data.")

    try:
        created_goal_data = created_goal_data[0]
    except IndexError:
        raise HTTPException(status_code=500, detail="Failed to retrieve created goal data.")

    if goal_participants:
        participant_response = (
            client.table("participants").upsert([{"id": goal.id, "participant": participant} for participant in goal_participants]).execute()
        )
        if not participant_response.data:
            raise HTTPException(status_code=500, detail="Failed to insert participants data.")

    try:
        created_goal_data["participants"] = goal_participants
        created_goal = Goal(**created_goal_data)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error parsing created goal data: {e}, {created_goal_data}")

    return created_goal


def update_goal(goal: Goal) -> Goal:
    """
    Update an existing goal in the database.
    """
    return create_goal(goal)


def upload_photo_blob(photo_filename: str, photo_blob: bytes) -> str:
    """
    Upload a photo blob to the 'photos' storage bucket and return its public URL.
    """
    # Upload the photo to the 'photos' bucket
    upload_response = client.storage.from_("submissions").upload(photo_filename, photo_blob)

    if upload_response.is_error:
        raise HTTPException(status_code=500, detail="Failed to upload photo to storage.")

    # Retrieve the public URL of the uploaded photo
    photo_url = client.storage.from_("submissions").get_public_url(photo_filename)

    if not photo_url:
        raise HTTPException(status_code=500, detail="Photo URL not found in response.")

    return photo_url
