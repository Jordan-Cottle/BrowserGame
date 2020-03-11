const TILE_COLOR = randomColor();
const TILE_SELECTED_COLOR = randomColor();

const SQRT3 = Math.sqrt(3);
const TO_RAD = Math.PI/180;
const COS = {
      "0": Math.cos(0 * TO_RAD),
     "60": Math.cos(60 * TO_RAD),
    "120": Math.cos(120 * TO_RAD),
    "180": Math.cos(180 * TO_RAD),
    "240": Math.cos(240 * TO_RAD),
    "300": Math.cos(300 * TO_RAD),
    "360": Math.cos(360 * TO_RAD),
};

const SIN = {
      "0": Math.sin(0 * TO_RAD),
     "60": Math.sin(60 * TO_RAD),
    "120": Math.sin(120 * TO_RAD),
    "180": Math.sin(180 * TO_RAD),
    "240": Math.sin(240 * TO_RAD),
    "300": Math.sin(300 * TO_RAD),
    "360": Math.sin(360 * TO_RAD),
};

let minX;
let maxX;
let minY;
let maxY;

/**
 * Generates vertices for regular hexagon centered at a given position.
 * 
 * X and Y axis are given in hex coordinates. Z axis is copied exactly
 * 
 * @param {Float32Array} dataBuffer An array to put the generated data into.
 * @param {number} x The x axis of the hexagon to generate 
 * @param {number} y The y axis of the hexagon to generate 
 * @param {number} z The z axis of the hexagon to generate 
 * @param {number} size The length of one of the hexagon's sides 
 * 
 * @returns An array containging data to draw all six line segments of a hexagon
 */
function generateHexagon(dataBuffer, x=0, y=0, z=0, size=1){
    const hOffset = size * 1.5 * (x+y);
    const vOffset = size * SIN[60] * (y-x);

    let i = -1;
    dataBuffer[++i] = size*COS[0] + hOffset;
    dataBuffer[++i] = size*SIN[0] + vOffset;
    dataBuffer[++i] = z;

    for (let angle = 60; angle < 360; angle += 60){
        const vertex = [
            size*COS[angle] + hOffset,
            size*SIN[angle] + vOffset,
            z
        ];

        dataBuffer[++i] = vertex[0];
        dataBuffer[++i] = vertex[1];
        dataBuffer[++i] = vertex[2];
        
        dataBuffer[++i] = vertex[0];
        dataBuffer[++i] = vertex[1];
        dataBuffer[++i] = vertex[2];
    }

    dataBuffer[++i] = size*COS[360] + hOffset;
    dataBuffer[++i] = size*SIN[360] + vOffset;
    dataBuffer[++i] = z;
}

class Tile{
    constructor(x, y, vertexBuffer, colorBuffer){
        this.selected = false;
        this.vertexBuffer = vertexBuffer;
        this.colorBuffer = colorBuffer;

        generateHexagon(this.vertexBuffer, x, y);

        this.setColor(TILE_COLOR);
    }

    setColor(color){
        for (let i = 0; i < VERTICES_PER_HEX; i++){
            this.colorBuffer.set(color, i*4);
        }
    }

    select(){
        if(this.selected){
            return;
        }

        this.selected = true;
        for (let i = 2; i < this.vertexBuffer.length; i+=3){
            this.vertexBuffer[i] = 1;
        }

        this.setColor(TILE_SELECTED_COLOR);
    }
    
    deselect(){
        if(!this.selected){
            return;
        }
        
        this.selected = false;
        for (let i = 2; i < this.vertexBuffer.length; i+=3){
            this.vertexBuffer[i] = 0;
        }

        this.setColor(TILE_COLOR);
    }

    color(){
        return this.selected ? TILE_SELECTED_COLOR : TILE_COLOR;
    }
}

const SIDES_PER_HEX = 6;
const VERTICES_PER_LINE = 2;
const VERTICES_PER_HEX = SIDES_PER_HEX*VERTICES_PER_LINE;
const VERTEX_FLOATS_PER_HEX = VERTICES_PER_HEX*3;
const COLOR_FLOATS_PER_HEX = VERTICES_PER_HEX*4;

class TileMap{
    constructor(gl, program, width, height){
        const vertexDataSize = VERTEX_FLOATS_PER_HEX * width * height;
        const colorDataSize = COLOR_FLOATS_PER_HEX * width * height;
        this.vertexBuffer = new MultiBuffer(gl, program, vertexDataSize);

        this.colorBuffer = new MultiBuffer(gl, program, colorDataSize);
        
        this.width = width;
        this.height = height;
        
        this.tiles = [];
        this.selected = [];
        
        minX = 0
        minY = 0
        maxX = this.width-1;
        maxY = this.width-1;
        let i = 0;
        let j = 0;
        for(let x = 0; x < this.width; x++){
            let row = [];
            for(let y = 0; y < this.height; y++){
                const vertexArray = this.vertexBuffer.createSubBuffer(i, VERTEX_FLOATS_PER_HEX);
                const colorArray = this.colorBuffer.createSubBuffer(j, COLOR_FLOATS_PER_HEX);
                row.push(new Tile(x, y, vertexArray, colorArray));
                i += VERTEX_FLOATS_PER_HEX;
                j += COLOR_FLOATS_PER_HEX;
            }
            
            this.tiles.push(row);
        }
        
        this.update();
    }

    update(){
        this.vertexBuffer.update();
        this.colorBuffer.update();
    }

    select(x, y){
        const tile = this.tiles[x][y];
        tile.select();

        this.selected.push(tile);
        this.update();
    }
    
    deselect(x, y){
        const tile = this.tiles[x][y];
        tile.deselect();
        
        this.update();
    }

    render(gl){
        this.colorBuffer.load('vColor', 4);   
        this.vertexBuffer.render(gl.LINES, 'vPosition', 3);   
    }
}