import json
from random import random

cubeVerts = [
    ( -.5, -.5,  .5 ),
    ( -.5,  .5,  .5 ),
    (  .5,  .5,  .5 ),
    (  .5, -.5,  .5 ),
    ( -.5, -.5,  -.5 ),
    ( -.5,  .5,  -.5 ),
    (  .5,  .5,  -.5 ),
    (  .5, -.5,  -.5 )
]

cubeIndices = [
    1, 0, 3, 1, 3, 2,
    2, 3, 7, 2, 7, 6,
    3, 0, 4, 3, 4, 7,
    6, 5, 1, 6, 1, 2,
    4, 5, 6, 4, 6, 7,
    5, 4, 0, 5, 0, 1
]

def vec3(a=None, b=None, c=None):
    if a is None:
        a = random()*2 - 1
    if b is None:
        b = random()*2 -1
    if c is None:
        c = random()*2 -1
    
    return [a, b, c]

def randomColors(n):
    return [[random(), random(), random(), (random()+.2) %1] for _ in range(n)]

class Cube:
    numCubes = 0
    def __init__(self, position=None, scale=vec3(1,1,1), rotation=None, velocity=vec3(0,0,0), angularVelocity=None):
        self.vertices = cubeVerts
        self.colors = randomColors(len(self.vertices))
        self.indices = cubeIndices
        self.scale=scale
        self.velocity = velocity

        self.id = Cube.numCubes+1
        Cube.numCubes += 1

        if position is None:
            self.position = vec3()
        else:
            self.position = position

        if rotation is None:
            self.rotation = vec3()
        else:
            self.rotation = rotation

        if angularVelocity is None:
            self.angularVelocity = vec3()
        else:
            self.angularVelocity = angularVelocity
    
    def update(self):
        self.position = [p + v for p, v in zip(self.position, self.velocity)]
        self.rotation = [r + v for r, v in zip(self.rotation, self.angularVelocity)]

    def __str__(self):
        s = {
            'vertices': self.vertices,
            'colors': self.colors,
            'indices': self.indices,
            'position': self.position,
            'scale': self.scale,
            'rotation': self.rotation,
            'velocity': self.velocity,
            'angularVelocity': self.angularVelocity,
            'id': self.id
        }
        return json.dumps(s)

