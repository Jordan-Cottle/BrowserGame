let canvas;
let gl;
let program;

let tileMap;
let camera;

const MAP_SIZE = 20;

window.onload = init
window.onresize = scale_canvas

function init(){
    canvas = document.getElementById("gl-canvas");

    scale_canvas();

    gl = createWebglContext(canvas, vec4(0.07, 0.075, 0.12, 1));
    program = setUpProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);
    gl.enable(gl.DEPTH_TEST);

    // Set up tile map
    tileMap = new TileMap(gl, program, MAP_SIZE, MAP_SIZE);

    // Set up camera
    camera = new Camera(gl, program, MAP_SIZE, 0);
    camera.move(1.5, 0);

    // Set up event handlers
    window.addEventListener('keydown', keyboardInputHandler);
    window.addEventListener('wheel', cameraZoomHandler);

    render();
}

function cameraZoomHandler(event){
    camera.zoom(-event.deltaY / 100)
}

let cameraPanSpeed = 0.25;
let cameraRotateSpeed = 2;
function keyboardInputHandler(event){
    switch(event.key){
        case 'ArrowLeft':
        case 'a':
            camera.move(-cameraPanSpeed, 0);
            break;
        case 'ArrowRight':
        case 'd':
            camera.move(cameraPanSpeed, 0);
            break;
        case 'ArrowUp':
        case 'w':
            camera.move(0, cameraPanSpeed);
            break;
        case 'ArrowDown':
        case 's':
            camera.move(0, -cameraPanSpeed);
            break;
        case 'q':
            camera.rotate(-cameraRotateSpeed);
            break;
        case 'e':
            camera.rotate(cameraRotateSpeed);
            break;
        default:
            console.log(event.key);
    }
}

function scale_canvas(){
    let width = this.document.documentElement.clientWidth;
    let height = this.document.documentElement.clientHeight;

    let length = Math.min(width, height);
    canvas.width = length*.9;
    canvas.height = canvas.width;
}

let i = 0;
let count = 0;
function render(){
    requestAnimFrame(render);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    camera.render(tileMap);

    
    if (++count > 4){
        tileMap.select((Math.random()*MAP_SIZE)>>0, (Math.random()*MAP_SIZE)>>0);
        if (tileMap.selected.length > MAP_SIZE*MAP_SIZE/10){
            tileMap.selected.shift().deselect();
        }
        count = 0;
    }



}