import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.device_discovery import discover_devices
from backend.services.network_info import get_network_info

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

@app.get("/api/devices")
async def get_devices():
    network_info=get_network_info()
    print("network info",network_info)
    if network_info is None:
        return {
            "error" : "No active network found"
        }
    network = network_info["network"]
    devices = discover_devices(network)
    return {
        "network":network,
        "count" : len(devices),
        "devices" : devices
    }