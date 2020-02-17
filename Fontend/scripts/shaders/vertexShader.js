let vertexShaderSource = `
attribute vec4 vPosition;

uniform mat4 transform;
uniform mat4 cameraTransform;

uniform vec4 hexColor;

void main()
{
	gl_Position = cameraTransform*transform*vPosition;
}
`;