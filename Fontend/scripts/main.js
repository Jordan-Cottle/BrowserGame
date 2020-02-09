let canvas;
let gl;

let vertexBuffer;

window.onload = init
window.onresize = scale_canvas

function init(){
    canvas = document.getElementById("gl-canvas");

    scale_canvas();

    gl = createWebglContext(canvas, vec4(0.1, 0.1, 0.1, 1));
    let program = setUpProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    // Set up data to be drawn
    let hexagonVertices = hexagon(.5);

    vertexBuffer = new DataBuffer(gl, program, hexagonVertices);
    
    let colors = createColors(vertexBuffer.length())
    colorBuffer = new DataBuffer(gl, program, colors);
    
    colorBuffer.load('vColor', 4);
    vertexBuffer.load('vPosition', 4);

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

    gl.drawArrays(gl.LINE_LOOP, 0, vertexBuffer.length());

    requestAnimFrame(render);
}