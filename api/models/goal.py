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
    amountStaked: float = Field(..., ge=0, alias="amountStaked", description="Amount of crypto staked for the goal")
    participantsCnt: int = Field(..., ge=0, description="Number of participants in the goal")
    participants: List[str] = Field(..., description="List of Ethereum addresses of participants")
    startDate: str = Field(..., alias="startDate", description="Start date of the goal")
    endDate: str = Field(..., alias="endDate", description="End date of the goal")
    currentDay: int = Field(..., ge=0, alias="currentDay", description="Current day number in the goal")
    totalDays: int = Field(..., ge=0, alias="totalDays", description="Total number of days for the goal")
    status: GoalStatus = Field(..., description="Current status of the goal")
    creator: str = Field(..., description="Ethereum address of the creator")
    creatorName: str = Field(..., alias="creatorName", description="Name of the creator")
    submissions: List[Submission] = Field(..., description="List of submissions by participants")

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True
