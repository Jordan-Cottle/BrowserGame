import asyncio
import websockets
from geometry import Cube
import json
connections = {}
objects = []
def getObjectsJson(objs):
    return json.dumps([str(o) for o in objs])
async def sendVertexData(websocket, path):
    connections[websocket] = Cube()
    objects.append(connections[websocket])
    initialMessage = getObjectsJson(objects)
    await websocket.send(initialMessage)

    try:
        data = True
        while data:
            data = await websocket.recv()
            print(f'Received: {data}')

            numObjects = int(data)

            if numObjects < len(objects):
                msg = getObjectsJson(objects[numObjects:])
            else:
                msg = "No new objects!"

            await websocket.send(msg)
    except websockets.ConnectionClosedOK as e:
        connections.pop(websocket)
        print("Closing connection")

server = websockets.serve(sendVertexData, 'localhost', 5555)

asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()