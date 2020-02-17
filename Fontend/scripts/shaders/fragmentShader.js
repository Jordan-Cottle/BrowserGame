let fragmentShaderSource = `
precision highp float; 

uniform vec4 hexColor;
void main()
{
    gl_FragColor = hexColor;
}
`;