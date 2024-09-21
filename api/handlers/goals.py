from typing import Dict, List
import uuid
import os
from pathlib import Path
import shutil

from fastapi import HTTPException, UploadFile
from fastapi.responses import FileResponse

import database.goals as goals_db
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
        amount_staked=0,
        participantsCnt=0,  # Initially zero participants
        participants=[],  # Initially no participants
        start_date=form.start_date,
        end_date=form.end_date,
        current_day=1,  # Starting at day 1
        total_days=(form.end_date - form.start_date).days + 1,
        status=GoalStatus.NOT_STARTED,
        creator=form.creator,
        creator_name=form.creator_name,
        submissions=[],  # Initially no submissions
    )

    result = goals_db.create_goal(new_goal)
    return result


def get_goal_by_id(goal_id: str) -> Goal:
    goal = goals_db.get_goal_by_id(goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")
    return goal


def get_all_goals() -> List[Goal]:
    return goals_db.all_goals()


def get_user_goals(user_id: str) -> List[Goal]:
    return goals_db.get_user_goals(user_id)


def update_goal_by_id_partial(goal_id: str, goal: Dict) -> Goal:
    current_goal = get_goal_by_id(goal_id)
    for key, value in goal.items():
        setattr(current_goal, key, value)
    return goals_db.update_goal_partial(current_goal)


async def upload_photo(goal_id: str, photo: UploadFile) -> str:
    # Validate the goal ID
    _ = get_goal_by_id(goal_id)

    # Save the uploaded photo
    file_extension = os.path.splitext(photo.filename)[1]
    if file_extension.lower() not in [".jpg", ".jpeg", ".png", ".gif"]:
        raise HTTPException(status_code=400, detail="Invalid file type. Only images are allowed.")

    # Generate a unique filename
    photo_filename = f"{uuid.uuid4()}{file_extension}"
    photo_path = os.path.join(UPLOAD_DIRECTORY, photo_filename)

    try:
        with open(photo_path, "wb") as buffer:
            shutil.copyfileobj(photo.file, buffer)
    except Exception as e:
        raise HTTPException(status_code=500, detail="Failed to save the uploaded photo.") from e
    finally:
        photo.file.close()

    # Generate a URL for the saved photo
    photo_url = f"/api/goals/photos/{photo_filename}"

    # Return the photo URL
    return photo_url


def get_photo(photo_filename: str):
    photo_path = os.path.join(UPLOAD_DIRECTORY, photo_filename)
    if not os.path.exists(photo_path):
        raise HTTPException(status_code=404, detail="Photo not found.")
    return FileResponse(photo_path)
