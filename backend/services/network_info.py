import psutil
import ipaddress

interfaces= psutil.net_if_addrs()
stats = psutil.net_if_stats()

for interface_name, addresses in interfaces.items():
    if interface_name not in stats:
        continue
    if not stats[interface_name].isup:
        continue
    if interface_name.lower() =="loopback pseudo-interface 1":
        continue
    for address in addresses:
        if address.family ==2:
            interface = ipaddress.ip_interface(f"{address.address}/{address.netmask}")
            print(f"\nInterface: {interface_name}")
            print(f"IPv4 {address.address}")
            print(f"Subnet {address.netmask}") 
            print(f"Network {interface.network}")
            print(f"Usable addresses: {interface.network.num_addresses -2}")