from pydantic import BaseModel, Field, HttpUrl, validator
from typing import Optional
from models.enums import SubmissionStatus


class Submission(BaseModel):
    id: str = Field(..., description="Unique identifier for the submission")
    day: int = Field(..., ge=1, description="Day number of the submission")
    person: str = Field(..., description="Name of the person who made the submission")
    status: SubmissionStatus = Field(..., description="Current status of the submission")
    photo_url: Optional[str] = Field(
        None,
        alias="photoUrl",
        description="URL of the submitted photo",
    )

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True
