from contextlib import asynccontextmanager

import uvicorn
from fastapi import FastAPI, Depends, HTTPException
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from fastapi.middleware.cors import CORSMiddleware

from routers import user


@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting...")
    yield
    print("Stopped.")


app = FastAPI(
    title="StakeToMake API",
    description="This service is responsible for managing the fetching, adding, updating, and deleting of user data for StakeToMake.",
    version="0.0.1",
    dependencies=[],
    lifespan=lifespan,
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def read_root():
    return {"message": "Root Message"}


@app.get("/health_check")
def health_check():
    print("Health Check Passed, API is up and running!")
    return {"data": "Health Check Passed, API is up and running!"}


# Routers
app.include_router(user.router)

if __name__ == "__main__":
    uvicorn.run(app)
