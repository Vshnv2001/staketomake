from enum import Enum
from pydantic import BaseModel, Field, field_validator
from datetime import datetime
import re


class GoalStatus(str, Enum):
    NOT_STARTED = "Not Started"
    IN_PROGRESS = "In Progress"
    COMPLETED = "Completed"
    FAILED = "Failed"


class Goal(BaseModel):
    id: str = Field(..., description="Unique identifier for the goal")
    title: str = Field(..., max_length=100, description="Title of the goal")
    description: str = Field(..., max_length=500, description="Detailed description of the goal")
    status: GoalStatus = Field(..., description="Current status of the goal")
    target_date: datetime = Field(..., alias="targetDate", description="Target completion date as a UNIX timestamp")
    creator: str = Field(..., description="Ethereum address of the creator")

    @field_validator("creator")
    def validate_eth_address(cls, v):
        if not re.fullmatch(r"0x[a-fA-F0-9]+", v):
            raise ValueError("Invalid Ethereum address")
        return v

    @field_validator("target_date")
    def convert_timestamp(cls, v):
        if isinstance(v, (int, float)):
            return datetime.fromtimestamp(v)
        return v
