var fragShader = `#version 300 es
precision highp float;

in vec4 vColor;
in vec2 uvCoord;
out vec4 FragColor;

uniform sampler2D tex;

void main(void) {
	vec4 t = texture(tex, uvCoord.st);
    FragColor = t * vColor;
}
`;

var vertShader = `#version 300 es
layout (location = 0) in vec3 aPos;
layout (location = 1) in vec4 aColour;
layout (location = 2) in vec2 aUV;
// layout (location = 3) in vec3 aNorm;

uniform mat4 uMMatrix;
uniform mat4 uVMatrix;
uniform mat4 uPMatrix;

out vec4 vColor;
out vec2 uvCoord;

void main(void) {
    gl_Position = uPMatrix * uVMatrix * uMMatrix * vec4(aPos, 1.0);
    vColor = aColour;
		uvCoord = aUV;
}
`
