from fastapi import HTTPException
from typing import Dict
from models.goal import Goal
import database.goals as goals_db


def create_goal(user_id: str, goal: Goal) -> Goal:
    created_goal = goals_db.create_goal(user_id, goal)
    if not created_goal:
        raise HTTPException(status_code=400, detail="Goal with this ID already exists.")
    return created_goal


def get_goal(user_id: str, goal_id: str) -> Goal:
    goal = goals_db.get_goal(user_id, goal_id)
    if not goal:
        raise HTTPException(status_code=404, detail="Goal not found.")
    return goal


def list_goals(user_id: str) -> Dict[str, Goal]:
    user_goals = goals_db.get_goals(user_id)
    return user_goals
