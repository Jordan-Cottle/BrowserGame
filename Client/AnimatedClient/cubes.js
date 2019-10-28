let canvas;
let gl;

let program;
let vertexShader, fragmentShader;
let compiled;
let selection = 'z';

let objects = [];

// all initializations
window.onload = function init() {
    // get canvas handle
    canvas = document.getElementById( "gl-canvas" );

    let width = this.document.documentElement.clientWidth;
    let height = this.document.documentElement.clientHeight;

    let length = Math.min(width, height);
    canvas.width = length*.9;
    canvas.height = canvas.width;

	// WebGL Initialization
    gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer: true} );
	if ( !gl ) {
		alert( "WebGL isn't available" );
	}
	gl.viewport( 0, 0, canvas.width, canvas.height );
	gl.clearColor( 0.8, 0.8, 0.0, 1.0 );
	gl.clear( gl.COLOR_BUFFER_BIT );

	// create shaders, compile and link program
	program = createShaders();
    gl.useProgram(program);

    // Only create a single set of vertices for each shape
    let cube = this.createColorCube();
    let tetrahedron = this.createColoredTetrahedron();

    // Top left cube with computed scale
    let scale = .4 * .5;
    objects[0] = new RenderableObject(cube, vec3(scale, scale, scale), vec3(-.5, .5, 0));
    // Rotate around x axis
    objects[0].angularVelocity = vec3(1,0,0);

    // top right cube 
    objects[1] = new RenderableObject(cube, vec3(.4, .4, .4), vec3(.5, .5, 0));
    // Rotate around y axis
    objects[1].angularVelocity = vec3(0,1,0);

    // bottom left cube
    objects[2] = new RenderableObject(cube, vec3(.4, .4, .4), vec3(-.5, -.5, 0));
    // roate around z axis
    objects[2].angularVelocity = vec3(0,0,1);

    // bottom right cube, render function computes angular velocity
    objects[3] = new RenderableObject(cube, vec3(.4, .4, .4), vec3(.5, -.5, 0));

    // Extra diamond
    objects[4] = new RenderableObject(tetrahedron, vec3(.25/2, .4/2, .25/2));
    objects[4].rotation = vec3(180, 0, 0);

    objects[5] = new RenderableObject(tetrahedron, vec3(.25/2, .4/2, .25/2));

    objects[4].position = vec3(.8);
    objects[5].position = vec3(.8);


    gl.enable(gl.DEPTH_TEST);

    render();
}

let count = 0;
let velocity = vec3();
function render(){

	gl.clear( gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
    // Determine axis for bottom right cube
    let angularVelocity = vec3();
    switch(selection){
        case 'y':
            angularVelocity[1] = 1;

            if(count % 90 === 89){
                selection = 'z';
            }
            break;
        case 'z':
            angularVelocity[2] = 1;

            if(count % 90 === 89){
                selection = 'y';
            }
            break;
    }

    
    count++;

    objects[3].angularVelocity = angularVelocity;
    objects[4].angularVelocity = angularVelocity;
    if(angularVelocity[1] >0){
        angularVelocity = negate(angularVelocity);
    }
    objects[5].angularVelocity = angularVelocity;

    // create random velocities that will keep the object inside of the canvas
    if(count % 60 === 1){
        velocity[0] = ((Math.random()*2-1) - objects[4].position[0]/2) / 100;
        velocity[1] = ((Math.random()*2-1) - objects[4].position[1]/2) / 100;
        velocity[2] = ((Math.random()*2-1) - objects[4].position[2]/2) / 100;
    }
    

    objects[4].velocity = velocity;
    objects[5].velocity = velocity;

    for(let i = 0; i < objects.length; i++){
        objects[i].render();
    }

	requestAnimFrame( render );
}

// create a colored cube with 8 vertices and colors at
// at each vertex
function createColorCube () {
    // Create new buffer to store information about cube
    let buffer = new PrimitiveBuffer(gl, program, 'triangle');
    // vertices for unit cube centered at origin
    let vertices = [
        vec3( -.5, -.5,  .5 ),
        vec3( -.5,  .5,  .5 ),
        vec3(  .5,  .5,  .5 ),
        vec3(  .5, -.5,  .5 ),
        vec3( -.5, -.5,  -.5 ),
        vec3( -.5,  .5,  -.5 ),
        vec3(  .5,  .5,  -.5 ),
        vec3(  .5, -.5,  -.5 )
    ];

    for(let i = 0; i < vertices.length; i++){
        buffer.addVertex(vertices[i], randomColor());
    }

    // use quad function to compute list of all triangle indices
    let quads = [
        createQuad( 1, 0, 3, 2),
        createQuad( 2, 3, 7, 6),
        createQuad( 3, 0, 4, 7),
        createQuad( 6, 5, 1, 2),
        createQuad( 4, 5, 6, 7),
        createQuad( 5, 4, 0, 1)
    ];

    for(let i = 0; i < quads.length; i++){
        for ( let j = 0; j < quads[i].length; j++) {
            buffer.addIndex(quads[i][j]);
        }
    }

    return buffer;
}

function createQuad (a, b, c, d) {
	return [ a, b, c, a, c, d ];
}

function createColoredTetrahedron() {
    let buffer = new PrimitiveBuffer(gl, program, 'triangle');
    let tetra_verts = [
        vec3(0,1,0),
        vec3(1, 0, 1),
        vec3(1, 0, -1),
        vec3(-1, 0, -1),
        vec3(-1, 0, 1)
    ];

    // Load vertices with random colors into buffer
    for(let i = 0; i < tetra_verts.length; i++){
        buffer.addVertex(tetra_verts[i], randomColor());
    }   

    // Indices for each triangle in the tetrahedron
    let triangles = [
        [0,1,2],
        [0,2,3],
        [0,3,4],
        [0,1,4],
        [1,2,3],
        [1,3,4]
    ]

    // Load indices into buffer
    for(let i = 0; i < triangles.length; i++){
        for(let j = 0; j < triangles[i].length; j++){
            buffer.addIndex(triangles[i][j]);
        }
    }

    return buffer;
}

// function that does all shader initializations and 
// returns the compiled shader program
function createShaders () {
    			// Create program object
    program = gl.createProgram();

    			//  Load vertex shader
    vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, myVertexShader);
    gl.compileShader(vertexShader);
    gl.attachShader(program, vertexShader);
    compiled = gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS);
    if (!compiled) {
      console.error(gl.getShaderInfoLog(vertexShader));
    }

    			//  Load fragment shader
    fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, myFragmentShader);
    gl.compileShader(fragmentShader);
    gl.attachShader(program, fragmentShader);
    compiled = gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS);
    if (!compiled) {
      console.error(gl.getShaderInfoLog(fragmentShader));
    }

    			//  Link program
    gl.linkProgram(program);
    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
      console.error(gl.getProgramInfoLog(program));
    }
	return program;
}
