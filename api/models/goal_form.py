from pydantic import BaseModel, Field, validator
from datetime import date


class GoalFormValues(BaseModel):
    title: str = Field(..., max_length=100, description="Title of the goal")
    description: str = Field(..., max_length=500, description="Detailed description of the goal")
    stakingAmount: float = Field(..., gt=0, alias="stakingAmount", description="Amount of crypto to stake")
    startDate: str = Field(..., alias="startDate", description="Start date of the goal")
    endDate: str = Field(..., alias="endDate", description="End date of the goal")
    verificationMethod: str = Field(..., description="Method of verification for the goal")
    isPublic: bool = Field(..., alias="isPublic", description="Whether the goal is public")
    creator: str = Field(..., description="Address of the goal creator")
    creatorName: str = Field(..., alias="creatorName", description="Name of the goal creator")

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True
