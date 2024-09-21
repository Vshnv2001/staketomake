from typing import Dict, List
import uuid
import os
from pathlib import Path
import datetime

from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse

import database.supabase_client as db
from models.goal import Goal
from models.goal_form import GoalFormValues
from models.enums import GoalStatus

# Directory where uploaded photos will be stored
UPLOAD_DIRECTORY = "uploaded_photos"

# Ensure the upload directory exists
Path(UPLOAD_DIRECTORY).mkdir(parents=True, exist_ok=True)


def create_goal(form: GoalFormValues) -> Goal:
    goal_id = str(uuid.uuid4())

    new_goal = Goal(
        id=goal_id,
        name=form.title,
        description=form.description,
        amountStaked=0,
        participantsCnt=0,  # Initially zero participants
        participants=[],  # Initially no participants
        startDate=form.start_date,
        endDate=form.end_date,
        currentDay=1,  # Starting at day 1
        totalDays=(datetime.date.fromisoformat(form.end_date) - datetime.date.fromisoformat(form.start_date)).days + 1,
        status=GoalStatus.NOT_STARTED,
        creator=form.creator,
        creatorName=form.creator_name,
        submissions=[],  # Initially no submissions
    )

    result = db.create_goal(new_goal)
    return result


def get_goal_by_id(goal_id: str) -> Goal:
    goal = db.get_goal_by_id(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")
    return goal


def get_all_goals() -> List[Goal]:
    return db.all_goals()


def get_user_goals(user_id: str) -> List[Goal]:
    return db.get_goals_by_user(user_id)


def update_goal_by_id_partial(goal_id: str, goal: Dict) -> Goal:
    current_goal = get_goal_by_id(goal_id)
    for key, value in goal.items():
        setattr(current_goal, key, value)
    return db.update_goal(current_goal)


async def upload_photo(goal_id: str, photo: UploadFile) -> str:
    # Validate the goal ID
    _ = get_goal_by_id(goal_id)

    # Save the uploaded photo
    file_extension = os.path.splitext(photo.filename)[1]
    if file_extension.lower() not in [".jpg", ".jpeg", ".png", ".gif"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

    # Generate a unique filename
    photo_filename = f"{uuid.uuid4()}{file_extension}"

    # Generate a URL for the saved photo
    photo_url = db.upload_photo_blob(photo_filename, photo.file.read())

    # Return the photo URL
    return photo_url
