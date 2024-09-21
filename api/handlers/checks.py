import datetime
import uuid

from database import supabase_client as db
from models.enums import GoalStatus, SubmissionStatus
from models.goal import Goal
from models.submission import Submission


def test_and_set_logic(goal: Goal):
    goal = start_goal(goal)
    goal = create_daily_submission(goal)
    goal = complete_goal(goal)
    db.update_goal(goal)
    return goal


def start_goal(goal: Goal):
    # If the goal is already started, do nothing
    if goal.status != GoalStatus.NOT_STARTED:
        return goal

    # If the current date is before the start date, do nothing
    if datetime.date.today() < datetime.date.fromisoformat(goal.startDate):
        return goal

    # If the current date is after the start date, set the goal status to IN_PROGRESS
    goal.status = GoalStatus.IN_PROGRESS

    return goal


def create_daily_submission(goal: Goal):
    # If the goal is not in progress, do nothing
    if goal.status != GoalStatus.IN_PROGRESS:
        return goal

    new_submissions = []
    today = (datetime.date.today() - datetime.date.fromisoformat(goal.startDate)).days + 1

    for day in range(1, today + 1):
        for person in goal.participants:
            submission_index = -1
            for i, submission in enumerate(goal.submissions):
                if submission.day == day and submission.person == person:
                    submission_index = i
                    break

            if submission_index == -1:
                new_submission = Submission(
                    id=str(uuid.uuid4()),
                    day=day,
                    person=person,
                    status=SubmissionStatus.MISSING if day < today else SubmissionStatus.PENDING_SUBMISSION,
                    photo_url=None,
                )
                new_submissions.append(new_submission)
            else:
                # If the submission wasn't completed, set it back to MISSING
                if goal.submissions[submission_index].status != SubmissionStatus.COMPLETED and day < today:
                    goal.submissions[submission_index].status = SubmissionStatus.MISSING

    # Sort the submissions by day and person
    goal.submissions = sorted(goal.submissions + new_submissions, key=lambda x: (x.day, x.person))
    return goal


def complete_goal(goal: Goal):
    # If the goal is already ended, do nothing
    if goal.status == GoalStatus.COMPLETED:
        return goal

    # If the current date is before the end date, do nothing
    if datetime.date.today() < datetime.date.fromisoformat(goal.endDate):
        return goal

    # If the current date is after the end date, set the goal status to COMPLETED
    goal.status = GoalStatus.COMPLETED

    # Invalidate any pending submissions
    for submission in goal.submissions:
        if submission.status != SubmissionStatus.COMPLETED:
            submission.status = SubmissionStatus.MISSING

    return goal
