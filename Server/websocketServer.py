import asyncio
import websockets
from geometry import Cube
import json

# TODO: Reorganize data to facilitate adding/deleting cubes
class Connection:
    def __init__(self, websocket):
        self.websocket = websocket
        self.cube = Cube()

connections = {}
objects = []
removed = []
def getObjectsJson(objs):
    return json.dumps([str(o) for o in objs])
async def sendVertexData(websocket, path):
    connections[websocket] = Connection(websocket)
    objects.append(connections[websocket])
    initialMessage = getObjectsJson(objects)
    await websocket.send(initialMessage)

    try:
        data = True
        while data:
            data = await websocket.recv()
            #print(f'Received: {data}')

            numObjects = int(data)

            if(len(removed) > 0):
                msg = 'rm: ' + ' '.join(removed)

            if numObjects < len(objects):
                msg = getObjectsJson(objects[numObjects:])
            else:
                msg = "No new objects!"

            await websocket.send(msg)
    except websockets.ConnectionClosedOK as e:
        print("Closing connection")
        deleted = connections.pop(websocket)
        objects.pop(deleted)
        removed.append(deleted.id)

server = websockets.serve(sendVertexData, 'localhost', 5555)

asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()