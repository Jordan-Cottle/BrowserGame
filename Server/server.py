import socket
from threading import Thread
from time import sleep, time

class TimeoutException(Exception):
    def __init__(self, message=''):
        super().__init__(message)

server = '192.168.1.2'
port = 5555
s = socket.socket()

try:
    s.bind((server,port))
except socket.error as e:
    print(e)

s.listen()
print("Waiting for connections...")

def readSocket(connection, address, timeOut = 0.001):
    print(f'Reading from {address}')

    read = False
    start = time()
    while not read:
        try:
            data = connection.recv(2048)
        except BlockingIOError:
            if(time() - start > timeOut):
                raise TimeoutException(f'{address} took to long to respond!')
            else:
                continue
        else:
            return data.decode('utf-8')
    

counts = {}
s.setblocking(0)
connections = []
while True:
    try:
        conn, addr = s.accept()
    except BlockingIOError as e:
        pass
    else:
        print('Connected to:', addr[0])
        counts[conn] = 0
        connections.append((conn, addr[0]))

    for connection, address in connections:
        try:
            data = readSocket(connection, address)
        except TimeoutException as e:
            continue

        if data:
            reply = f'{counts[connection]}: {data.upper()}'
            counts[connection] += 1
            connection.sendall(str.encode(reply))
        else:
            connection.close()
            connections.remove((connection,address))
            counts.pop(connection)
