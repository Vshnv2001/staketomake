import jwt
from typing_extensions import Annotated

from fastapi import Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer


def check_token(token: HTTPAuthorizationCredentials = Depends(HTTPBearer())) -> str:
    try:
        # decoded = jwt.decode(token.credentials, options={"verify_signature": False})
        return True
    except jwt.DecodeError:
        raise HTTPException(status_code=401, detail="Not authenticated")


def is_admin(access_type: Annotated[int, Depends(check_token)]):
    raise HTTPException(status_code=403, detail="Not an admin")
