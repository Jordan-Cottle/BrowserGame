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

cubeColors = [[random(), random(), random(), 1] for _ in range(len(cubeVerts))]

cubeIndices = [
    1, 0, 3, 1, 3, 2,
    2, 3, 7, 2, 7, 6,
    3, 0, 4, 3, 4, 7,
    6, 5, 1, 6, 1, 2,
    4, 5, 6, 4, 6, 7,
    5, 4, 0, 5, 0, 1
]

def vec3(a=0, b=0, c=0):
    return [a, b, c]


class Cube:
    def __init__(self, position=vec3(), scale=vec3(1,1,1), rotation=vec3(), velocity=vec3(), angularVelocity=vec3()):
        self.vertices = cubeVerts
        self.colors = cubeColors
        self.indices = cubeIndices
        self.position = position
        self.scale=scale
        self.rotation = rotation
        self.velocity = velocity
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
            'angularVelocity': self.angularVelocity
        }
        return json.dumps(s)

