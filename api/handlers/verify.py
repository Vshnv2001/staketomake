from database import verify
from models.verify import VerifyRequest, VerifyResponse


def verify_user(request: VerifyRequest) -> VerifyResponse:
    return VerifyResponse(verified=verify.verify_user(request.address))


def check_user(request: VerifyRequest) -> VerifyResponse:
    return VerifyResponse(verified=verify.check_user(request.address))
