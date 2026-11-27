import psutil
import ipaddress
from scapy.all import conf

def get_network_info():
    interfaces =  psutil.net_if_addrs()
    stats = psutil.net_if_stats()
    gateway = conf.route.route("0.0.0.0")[2]
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
                return {
                    "interface": interface_name,
                    "ip": address.address,
                    "subnet":address.netmask, 
                    "network":str(interface.network),
                    "usable_addresses":interface.network.num_addresses -2,
                    "gateway":gateway
                    }
   
    return None

