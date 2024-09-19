from typing import Dict
from models.goal import Goal
from collections import defaultdict

goals_db: Dict[str, Dict[str, Goal]] = defaultdict(dict)


def get_goals(user_id: str) -> Dict[str, Goal]:
    return goals_db[user_id]


def create_goal(user_id: str, goal: Goal) -> Goal:
    user_goals = goals_db[user_id]
    if goal.id in user_goals:
        return
    user_goals[goal.id] = goal
    return goal


def get_goal(user_id: str, goal_id: str) -> Goal:
    user_goals = goals_db[user_id]
    if not user_goals:
        return
    goal = user_goals.get(goal_id)
    return goal
