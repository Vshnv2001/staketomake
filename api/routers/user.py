from typing import Dict

from fastapi import APIRouter

from models.goal import Goal
from handlers import goals


router = APIRouter(prefix="/api/v1/user", tags=["user"], responses={404: {"description": "Not Found"}})


@router.post("/{user_id}/goals/", response_model=Goal, summary="Create a new goal")
def create_goal_endpoint(user_id: str, goal: Goal):
    """
    Create a new goal under the authenticated user.
    """
    return goals.create_goal(user_id, goal)


@router.get("/{user_id}/goals/{goal_id}", response_model=Goal, summary="Get a goal by ID")
def get_goal_endpoint(user_id: str, goal_id: str):
    """
    Retrieve a specific goal by its ID for the authenticated user.
    """
    return goals.get_goal(user_id, goal_id)


@router.get("/{user_id}/goals/", response_model=Dict[str, Goal], summary="List all goals")
def list_goals_endpoint(user_id: str):
    """
    Retrieve all goals for the authenticated user.
    """
    return goals.list_goals(user_id)
