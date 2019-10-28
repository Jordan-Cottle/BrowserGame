import asyncio
import websockets
from geometry import Cube
connections = {}
async def sendVertexData(websocket, path):
    
    
    connections[websocket] = Cube()
    await websocket.send(str(connections[websocket]))
    data = True
    while data:
        data = await websocket.recv()
        print(f'Received: {data}')

        reply = f'{connections[websocket]}: {data.upper()}'
        connections[websocket] += 1

        await websocket.send(reply)
        print(f'Sent: {reply}')

server = websockets.serve(sendVertexData, 'localhost', 5555)

asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()