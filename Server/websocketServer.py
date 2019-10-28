import asyncio
import websockets

connections = {}
async def echo(websocket, path):
    connections[websocket] = 0
    data = True
    while data:
        data = await websocket.recv()
        print(f'Received: {data}')

        reply = f'{connections[websocket]}: {data.upper()}'
        connections[websocket] += 1

        await websocket.send(reply)
        print(f'Sent: {reply}')

server = websockets.serve(echo, 'localhost', 5555)

asyncio.get_event_loop().run_until_complete(server)
asyncio.get_event_loop().run_forever()