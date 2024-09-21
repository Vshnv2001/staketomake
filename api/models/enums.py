from enum import Enum


class GoalStatus(str, Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"


class SubmissionStatus(str, Enum):
    COMPLETED = "completed"
    PENDING_SUBMISSION = "pending submission"
    PENDING_VERIFICATION = "pending verification"
    MISSING = "missing"
    REJECTED = "rejected"
