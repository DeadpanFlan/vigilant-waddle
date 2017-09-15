var fragShader = `#version 300 es
precision highp float;

in vec4 vColor;
out vec4 FragColor;

void main(void) {
    FragColor = vColor;
}
`;

var vertShader = `#version 300 es
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec4 aColour;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

out vec4 vColor;

void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPos, 1.0);
    vColor = aColour;
}
`