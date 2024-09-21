from pydantic import BaseModel, Field, validator
from typing import List
from datetime import date
from models.enums import GoalStatus
from models.submission import Submission
import re


class Goal(BaseModel):
    id: str = Field(..., description="Unique identifier for the goal")
    name: str = Field(..., max_length=100, description="Name of the goal")
    description: str = Field(..., max_length=500, description="Detailed description of the goal")
    amount_staked: float = Field(..., ge=0, alias="amountStaked", description="Amount of crypto staked for the goal")
    participantsCnt: int = Field(..., ge=0, description="Number of participants in the goal")
    participants: List[str] = Field(..., description="List of Ethereum addresses of participants")
    start_date: date = Field(..., alias="startDate", description="Start date of the goal")
    end_date: date = Field(..., alias="endDate", description="End date of the goal")
    current_day: int = Field(..., ge=1, description="Current day number in the goal")
    total_days: int = Field(..., ge=1, alias="totalDays", description="Total number of days for the goal")
    status: GoalStatus = Field(..., description="Current status of the goal")
    creator: str = Field(..., description="Ethereum address of the creator")
    creator_name: str = Field(..., alias="creatorName", description="Name of the creator")
    submissions: List[Submission] = Field(..., description="List of submissions by participants")

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True

    @validator("start_date", "end_date", pre=True)
    def parse_dates(cls, v):
        if isinstance(v, str):
            return date.fromisoformat(v)
        return v

    @validator("end_date")
    def validate_end_date(cls, v, values):
        start_date = values.get("start_date")
        if start_date and v < start_date:
            raise ValueError("endDate must be after startDate")
        return v

    @validator("current_day")
    def validate_current_day(cls, v, values):
        total_days = values.get("total_days")
        if total_days and v > total_days:
            raise ValueError("currentDay cannot exceed totalDays")
        return v

    @validator("creator_name")
    def validate_creator_name(cls, v):
        if not v.strip():
            raise ValueError("Creator name cannot be empty")
        return v
