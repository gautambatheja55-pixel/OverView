import socket

def get_hostname(ip):
    try:
        hostname=socket.gethostbyaddr(ip)[0]
        print(hostname)
        print(hostname[0])
        return hostname
    except socket.herror as error:
        return None
