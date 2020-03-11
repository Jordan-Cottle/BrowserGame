class ShaderCompileError extends ExtendableError {}

class ProgramLinkError extends ExtendableError {}

/**
 * Initialized a webgl context with a single viewport and a clear color
 * 
 * @param {HTMLCanvasElement} canvas The canvas to link the webgl context to
 * @param {number[]} [clearColor] A four element array of numbers betyween 0 and 1 that represent the clear color for webgl to use on the canvas
 * 
 * @returns {WebGLRenderingContext} A webgl rendering context linked to the provided canvas
 */
function createWebglContext(canvas, clearColor=[0.8,0.8,0,1]){
    gl = WebGLUtils.setupWebGL(canvas, {preserveDrawingBuffer: true} );
	if ( !gl ) {
		alert( "WebGL isn't available" );
    }
    
    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearColor(clearColor[0], clearColor[1], clearColor[2], clearColor[3]);

    return gl;
}

/**
 * Sets up a webgl vertex shader
 * @param {WebGLRenderingContext} gl The webgl context to use for setting up the shader
 * @param {WebGLProgram} program The webgl program to link the vertex shader to
 * @param {String} shaderString A string containing valid source code for a vertex shader
 * 
 * @returns {WebGLShader} A vertex shader created from the shaderString and linked to the program
 */
function setUpVertexShader(gl, program, shaderString){
    let vertexShader = gl.createShader(gl.VERTEX_SHADER);

    compileShader(gl, program, vertexShader, shaderString)

    return vertexShader;
}

/**
 * Sets up a webgl vertex shader
 * @param {WebGLRenderingContext} gl The webgl context to use for setting up the shader
 * @param {WebGLProgram} program The webgl program to link the fragment shader to
 * @param {String} shaderString A string containing valid source code for a fragment shader
 * 
 * @returns {WebGLShader} A fragment shader created from the shaderString and linked to the program
 */
function setUpFragmentShader(gl, program, shaderString){
    let fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

    compileShader(gl, program, fragmentShader, shaderString)

    return fragmentShader;
}

/**
 * Compiles and attaches a shader to a program
 * 
 * @param {WebGLRenderingContext} gl The webgl context to use for setting up the shader
 * @param {WebGLProgram} program The webgl program to link the fragment shader to
 * @param {WebGLShader} shader A webgl shader object created using WebGLRenderingContext.createShader()
 * @param {String} sourceString A string containing valid source code for the shader
 */
function compileShader(gl, program, shader, sourceString){
    gl.shaderSource(shader, sourceString);
    gl.compileShader(shader);
    gl.attachShader(program, shader);

    compiled = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
    if (!compiled) {
        throw new ShaderCompileError(gl.getShaderInfoLog(shader));
    }
}

/**
 * Creates a program for a webgl rendering context with linked and compiled shaders
 * 
 * @param {WebGLRenderingContext} gl The webgl context to use for setting up the program
 * @param {String} vertexShaderString A string containing the source code for this program's vertex shader
 * @param {String} fragmentshaderString A string containing the source code for this program's fragment shader
 * 
 * @returns {WebGLProgram} A webgl program with compiled and linked shaders
 */
function setUpProgram(gl, vertexShaderString, fragmentshaderString){
    let program = gl.createProgram();

    setUpVertexShader(gl, program, vertexShaderString);
    setUpFragmentShader(gl, program, fragmentshaderString);

    gl.linkProgram(program);
    let linked = gl.getProgramParameter(program, gl.LINK_STATUS);
    if (!linked) {
        throw new ProgramLinkError(gl.getProgramInfoLog(program));
    }

    return program;
}