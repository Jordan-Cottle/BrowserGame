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

const TILE_WIDTH = 6/4;
const TILE_HEIGHT = Math.sqrt(3);
const TILE_COLOR = randomColor();
const TILE_SELECTED_COLOR = randomColor();

class Tile{
    constructor(x, y){
        this.x = x;
        this.y = y;
        this.z = 0;
        this.selected = false;

        this.transform = this.compute_transform();
    }

    select(){
        this.selected = true;
        this.z = 1;

        this.transform = this.compute_transform();
    }

    deselect(){
        if(!this.selected){
            return;
        }

        this.selected = false;
        this.z = 0;
        
        this.transform = this.compute_transform();
    }

    compute_transform(){
        const yOffset = Math.abs(this.x)%2/2;
        return flatten(
            translation(
                TILE_WIDTH*this.x,
                TILE_HEIGHT*(this.y-yOffset),
                this.z
            )
        );
    }

    color(){
        return this.selected ? TILE_SELECTED_COLOR : TILE_COLOR;
    }
}


class TileMap{
    constructor(gl, program, vertexBuffer, width, height){
        this.vertexBuffer = vertexBuffer;

        this.width = width;
        this.height = height;

        this.tiles = [];
        this.selected = [];

        for(let x = -this.width/2; x < this.width/2; x++){
            for(let y= -this.height/2; y < this.height/2; y++){
                this.tiles.push(new Tile(x, y));
            }
        }

        this.tPos = gl.getUniformLocation(program, 'transform');
        this.cPos = gl.getUniformLocation(program, 'hexColor');
    }

    select(x, y){
        const tile = this.tiles[x*this.height + y];
        tile.select();
        this.selected.push(tile); 
    }
    
    deselect(x, y){
        const tile = this.tiles[x*this.height + y];
        tile.deselect();
        this.selected.splice(find(tile, this.selected), 1);
    }

    render(gl){
        this.vertexBuffer.load('vPosition');
        
        const numElements = this.vertexBuffer.length();
        for (let tile of this.tiles){
            gl.uniform4fv(this.cPos, tile.color());
            gl.uniformMatrix4fv(this.tPos, false, tile.transform);
            gl.drawArrays(gl.LINE_LOOP, 0, numElements);
        }
    }
}