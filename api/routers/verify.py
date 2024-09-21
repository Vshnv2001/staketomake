from fastapi import APIRouter

from handlers import verify
from models.verify import VerifyRequest, VerifyResponse

router = APIRouter(prefix="/api/verify", tags=["verification"], responses={404: {"description": "Not Found"}})


@router.post("", response_model=VerifyResponse, summary="Verify user")
async def verify_user(request: VerifyRequest):
    return verify.verify_user(request)


@router.post("/check", response_model=VerifyResponse, summary="Check user verification")
async def check_user(request: VerifyRequest):
    return verify.check_user(request)
