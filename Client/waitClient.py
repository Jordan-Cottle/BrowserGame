import socket
from time import sleep
from random import random

connectTo = '192.168.1.2'
port = 5555

msg = 'Hello'
with socket.socket() as s:
    s.connect((connectTo, port))

    data = True
    while data:
        print(f'Sending: {msg}')
        s.sendall(str.encode(msg))
        data = s.recv(2048).decode('utf-8')
        print(f'Received:\n{data}')
        sleep(random()*3)
    
    print('Connection lost!')
