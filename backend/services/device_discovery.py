import subprocess
import ipaddress
import platform
from concurrent.futures import ThreadPoolExecutor

def ping_ip(ip):
    system=platform.system().lower()
    if system == "windows":
        command = ["ping","-n","2","-w","1000",str(ip)]
    elif system == "linux":
        command = ["ping","-c","1","-W","1",str(ip)]
    elif system == "darwin":
        command = ["ping","-c","1","-W","1000",str(ip)]
    else:
        raise OSError(f"Unsupported OS: {system}")
    
    result = subprocess.run(command,capture_output=True,text=True)
    if result.returncode == 0:
        return str(ip)
    return None

def discover_devices(network_address):
    network = ipaddress.ip_network(network_address)
    all_ips = list(network.hosts())
    with ThreadPoolExecutor(max_workers=20) as executer:
        results = executer.map(ping_ip,all_ips)
    return [ip for ip in results if ip is not None]

if __name__ == "__main__":
    devices = discover_devices("192.168.29.0/24")
    print("\nDiscovered devices:")

    for ip in devices:
        print(ip)
