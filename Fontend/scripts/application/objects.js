/**
 * Generates vertices for regular hexagon centered at the origin with a given side length
 * 
 * @param {number} size The length of one of the hexagon's sides 
 * 
 * @returns An array of 6 coordinate pairs containing data for the six vertices of a hexagon
 */
function hexagon(size=1){
    vertices = [];

    for (let i = 0; i < 6; i++){
        let angle = (60*i) * (Math.PI/180);
        
        vertices.push([
            size*Math.cos(angle),
            size*Math.sin(angle)
        ])
    }

    return vertices;
}


class Tile{
    constructor(x, y){
        this.x = x;
        this.y = y;

        let xDelta = 6/4;
        let hHeight = Math.sqrt(3);

        this.transform = flatten(
            translation(xDelta*x, hHeight*(y-(x%2/2)))
        )
    }
}


class TileMap{
    constructor(gl, program, vertexBuffer, width, height, color){
        this.vertexBuffer = vertexBuffer;

        this.width = width;
        this.height = height;
        
        this.color = flatten(color);


        this.tiles = [];

        for(let x = -this.width/2; x < this.width/2; x++){
            for(let y= -this.height/2; y < this.height/2; y++){
                this.tiles.push(new Tile(x, y));
            }
        }

        this.tPos = gl.getUniformLocation(program, 'transform');
        this.cPos = gl.getUniformLocation(program, 'hexColor');
    }

    render(gl){
        this.vertexBuffer.load('vPosition');
        gl.uniform4fv(this.cPos, this.color);

        let numElements = this.vertexBuffer.length();
        for (let tile of this.tiles){
            gl.uniformMatrix4fv(this.tPos, false, tile.transform);
            gl.drawArrays(gl.LINE_LOOP, 0, numElements);
        }
    }
}