from pydantic import BaseModel, Field


class VerifyRequest(BaseModel):
    address: str = Field(..., description="Address of the user")


class VerifyResponse(BaseModel):
    verified: bool = Field(..., description="Whether the user is verified")
