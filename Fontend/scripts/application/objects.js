/**
 * Generates vertices for regular hexagon centered at the origin with a given side length
 * 
 * @param {number} size The length of one of the hexagon's sides 
 * 
 * @returns An array of 6 coordinate pairs containing data for the six vertices of a hexagon
 */
function hexagon(size){
    vertices = [];

    for (let i = 0; i < 6; i++){
        let angle = (60*i) * (Math.PI/180);
        
        vertices.push([
            size*Math.cos(angle),
            size*Math.sin(angle)
        ])
    }

    console.log(vertices);
    return vertices;
}



class TileMap{
    constructor(gl, program, vertexBuffer, width, height, hexSize){
        this.vertexBuffer = vertexBuffer;

        let hWidth = 2*hexSize;
        let hHeight = Math.sqrt(3)*hexSize;

        let xDelta = hWidth*3/4;
        

        this.width = width;
        this.height = height;

        this.transforms = [];

        for(let x = -this.width/2; x < this.width/2; x++){
            for(let y= -this.height/2; y < this.height/2; y++){
                this.transforms.push(flatten(
                    translation(xDelta*x, hHeight*(y-(x%2/2)))
                ));
            }
        }

        this.tPos = gl.getUniformLocation(program, 'transform');
    }

    render(gl){
        for(let x = 0; x < this.width; x++){
            for(let y= 0; y < this.height; y++){
                gl.uniformMatrix4fv(this.tPos, false, this.transforms[x*this.width+y]);

                gl.drawArrays(gl.LINE_LOOP, 0, this.vertexBuffer.length());
            }
        }
    }
}