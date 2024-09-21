from typing import Dict, List
from collections import defaultdict

from models.goal import Goal

# Structure: {creator_address: {goal_id: Goal}}
goals_db: Dict[str, Dict[str, Goal]] = defaultdict(dict)


def create_goal(goal: Goal) -> Goal:
    user_goals = goals_db[goal.creator]
    user_goals[goal.id] = goal
    return goal


def get_goal_by_id(goal_id: str) -> Goal:
    for _, user_goals in goals_db.items():
        goal = user_goals.get(goal_id)
        if goal:
            return goal
    return


def all_goals() -> List[Goal]:
    return [goal for user_goals in goals_db.values() for goal in user_goals.values()]


def get_user_goals(user_id: str) -> List[Goal]:
    return list(goals_db[user_id].values())


def update_goal_partial(goal: Goal) -> Goal:
    return create_goal(goal)
