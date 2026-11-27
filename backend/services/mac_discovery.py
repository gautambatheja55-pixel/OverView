from scapy.all import ARP,Ether,srp

def discover_macs(network_address,timeout=30):
    arp_request = ARP(pdst=network_address)

    broadcast = Ether(dst="ff:ff:ff:ff:ff:ff")
    packet = broadcast/arp_request

    answered, unaswered = srp(packet,timeout=timeout,verbose=False)
    devices ={}
    for sent,recieved in answered:
        ip = recieved.psrc
        mac = recieved.hwsrc
        devices[ip] = mac
    return devices
