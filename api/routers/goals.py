from typing import Dict, List

from fastapi import APIRouter, UploadFile, File

from handlers import goals
from models.goal import Goal
from models.goal_form import GoalFormValues
from models.photo_response import UploadPhotoResponse


router = APIRouter(prefix="/api/goals", tags=["goals"], responses={404: {"description": "Not Found"}})


@router.post("", response_model=Goal, summary="Create a new goal")
def create_goal_endpoint(form: GoalFormValues):
    """
    Create a new goal.
    """
    return goals.create_goal(form)


@router.get("/{goal_id}", response_model=Goal, summary="Get a goal by ID")
def get_goal_by_id_endpoint(goal_id: str):
    """
    Retrieve a specific goal by its ID.
    """
    return goals.get_goal_by_id(goal_id)


@router.get("", response_model=List[Goal], summary="List all goals")
def list_all_goals_endpoint():
    """
    Retrieve all goals.
    """
    return goals.get_all_goals()


@router.get("/user/{user_id}", response_model=List[Goal], summary="List all goals for a user")
def list_user_goals_endpoint(user_id: str):
    """
    Retrieve all goals for a specific user.
    """
    return goals.get_user_goals(user_id)


@router.post("/{goal_id}", response_model=Goal, summary="Update a goal by ID with partial data")
def update_goal_by_id_endpoint(goal_id: str, goal: Goal):
    """
    Update a specific goal by its ID with complete data.
    """
    return goals.update_goal_by_id_partial(goal_id, goal)


@router.post("/{goal_id}/upload-photo", response_model=UploadPhotoResponse, summary="Upload a photo for a goal")
async def upload_photo_endpoint(goal_id: str, photo: UploadFile = File(...)):
    """
    Upload a photo for a specific goal.
    """
    photo_url = await goals.upload_photo(goal_id, photo)
    return UploadPhotoResponse(photoUrl=photo_url)
