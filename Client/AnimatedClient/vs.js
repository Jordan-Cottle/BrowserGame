var myVertexShader = `
	attribute vec4 vPosition;
	attribute vec4 vColor;
	varying vec4 color;

	uniform mat4 transform;

	void main() {
		gl_Position = transform*vPosition;
		color = vColor;
	}
`;

