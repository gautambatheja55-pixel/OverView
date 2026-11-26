import socket

def get_hostname(ip):
    try:
        hostname=socket.gethostbyaddr(ip)[0]
        print(hostname)
        print(hostname[0])
        return hostname
    except socket.herror as error:
        print(error)


if __name__ == "__main__":
    print(get_hostname("192.168.29.154"))