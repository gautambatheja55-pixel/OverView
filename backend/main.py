import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
app = FastAPI()
origins = os.getenv("ALLOWED_ORIGINS","").split(",")
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_methods=["*"],
    allow_headers=["*"]
)

@app.get("/api/status")
async def get_status():
    return {"status":"online",
            "project" : "Overview",
            "message" : "Backend is running yippee"}
