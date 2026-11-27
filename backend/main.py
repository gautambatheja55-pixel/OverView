import os
from dotenv import load_dotenv
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.services.device_discovery import discover_devices
from backend.services.network_info import get_network_info
from concurrent.futures import ThreadPoolExecutor
from backend.services.mac_discovery import discover_macs
from backend.services.hostname_lookup import get_hostname

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
    print("gateway detected", network_info["gateway"])
    if network_info is None:
        return {
            "error" : "No active network found"
        }
    network = network_info["network"]
    with ThreadPoolExecutor(max_workers =2 ) as executer:
        ip_task = executer.submit(discover_devices,network)
        mac_task = executer.submit(discover_macs, network)

        ips = ip_task.result()
        macs= mac_task.result()
    devices =[]
    all_devices = set(ips) | set (macs)
    all_devices.discard(network_info["gateway"])
    for ip in all_devices:
        devices.append({
            "ip":ip,
            "mac":macs.get(ip),
            "hostname": get_hostname(ip)
        })
    print("Discovered: ",devices)
    return {
        "network":network,
        "count" : len(devices),
        "devices" : devices
    }