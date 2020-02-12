let canvas;
let gl;
let program;

let tileMap;

window.onload = init
window.onresize = scale_canvas

function init(){
    canvas = document.getElementById("gl-canvas");

    scale_canvas();

    gl = createWebglContext(canvas, vec4(0.1, 0.1, 0.1, 1));
    program = setUpProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    let hexSize = 1/16;
    // Set up data to be drawn
    let hexagonVertices = hexagon(hexSize);

    let vertexBuffer = new DataBuffer(gl, program, hexagonVertices);
    
    let colors = createColors(vertexBuffer.length())
    let colorBuffer = new DataBuffer(gl, program, colors);
    
    colorBuffer.load('vColor');
    vertexBuffer.load('vPosition');

    tileMap = new TileMap(gl, program, vertexBuffer, 24, 24, hexSize);

    render();
}

function scale_canvas(){
    let width = this.document.documentElement.clientWidth;
    let height = this.document.documentElement.clientHeight;

    let length = Math.min(width, height);
    canvas.width = length*.9;
    canvas.height = canvas.width;
}

function render(){
    gl.clear(gl.COLOR_BUFFER_BIT);

    tileMap.render(gl);

    requestAnimFrame(render);
}