class Pyramid {
	constructor(gl){
		this.vertexArray = gl.createVertexArray();
		gl.bindVertexArray(this.vertexArray);
		var vertices = new Float32Array ([
			// Front face
			 0.0,  1.0,  0.0,
			-1.0, -1.0,  1.0,
			 1.0, -1.0,  1.0,

			// Right face
			 0.0,  1.0,  0.0,
			 1.0, -1.0,  1.0,
			 1.0, -1.0, -1.0,

			// Back face
			 0.0,  1.0,  0.0,
			 1.0, -1.0, -1.0,
			-1.0, -1.0, -1.0,

			// Left face
			 0.0,  1.0,  0.0,
			-1.0, -1.0, -1.0,
			-1.0, -1.0,  1.0
		]);

		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
		gl.enableVertexAttribArray(0);

		var colours = new Float32Array ([
            // Front face
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // Right face
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0,

            // Back face
            1.0, 0.0, 0.0, 1.0,
            0.0, 1.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,

            // Left face
            1.0, 0.0, 0.0, 1.0,
            0.0, 0.0, 1.0, 1.0,
            0.0, 1.0, 0.0, 1.0
        ]);

        var colourBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, colours, gl.STATIC_DRAW);
		
		gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 16, 0);
		gl.enableVertexAttribArray(1);

		// Indices
		var indices = new Uint16Array ([
			0,	1,	2,
			3,	4,	5,
			6,	7,	8,
			9,	10,	11
		]);
		var indexBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indices, gl.STATIC_DRAW);


		gl.bindVertexArray(null);

		this.numItems = vertices.length/3;
	}


}