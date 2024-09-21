from pydantic import BaseModel, HttpUrl, Field


class UploadPhotoResponse(BaseModel):
    photoUrl: str = Field(..., description="URL of the uploaded photo")

    class Config:
        allow_population_by_field_name = True
        populate_by_name = True
