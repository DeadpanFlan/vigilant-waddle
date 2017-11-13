
function getShader(gl, shaderString, type) {
	var shader;
	if (type == "fragment") {
		shader = gl.createShader(gl.FRAGMENT_SHADER);
	} else if (type == "vertex") {
		shader = gl.createShader(gl.VERTEX_SHADER);
	} else {
		return null;
	}

	gl.shaderSource(shader, shaderString);
	gl.compileShader(shader);

	if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
		alert(gl.getShaderInfoLog(shader));
		return null;
	}

	return shader;
}

// Make Sure JS File for Shaders is loaded before calling
function initShaders(gl){
	try {

		var shaderProgram;
		var fragmentShader = getShader(gl, fragShader,'fragment');
		var vertexShader = getShader(gl, vertShader, 'vertex');


		shaderProgram = gl.createProgram();
		gl.attachShader(shaderProgram, vertexShader);
		gl.attachShader(shaderProgram, fragmentShader);
		gl.linkProgram(shaderProgram);

		if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
			alert("Could not initialise shaders");
		}

		gl.useProgram(shaderProgram);
		// No VAO
			// shaderProgram.vertexPositionAttribute = gl.getAttribLocation(shaderProgram, "aVertexPosition");
			// gl.enableVertexAttribArray(shaderProgram.vertexPositionAttribute);

			// shaderProgram.vertexColorAttribute = gl.getAttribLocation(shaderProgram, "aVertexColor");
			// gl.enableVertexAttribArray(shaderProgram.vertexColorAttribute);

			// shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			// shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
		// With VAO
			shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
			shaderProgram.vMatrixUniform = gl.getUniformLocation(shaderProgram, "uVMatrix");
			shaderProgram.mMatrixUniform = gl.getUniformLocation(shaderProgram, "uMMatrix");
			shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "tex");


		return shaderProgram;


	} catch (e) {

	}
}
