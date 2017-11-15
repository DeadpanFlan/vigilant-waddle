class Mesh {
	constructor(gl,pos,norm,uv,idx,mtl, col){
		this.indices = idx;
		this.positions = pos;
		this.vertexArray = gl.createVertexArray();
		gl.bindVertexArray(this.vertexArray);

		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.enableVertexAttribArray(0);
		gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);


		var fColors = new Float32Array();
		if(!col){
			var colors = []
			while(colors.length/4 < pos.length/3){
				// colors = colors.concat([
				// 	1.0, 0.0, 0.0, 1.0,
				// 	0.0, 1.0, 0.0, 1.0,
				// 	0.0, 0.0, 1.0, 1.0
				// ]);

				colors = colors.concat(mtl.Kd).concat([mtl.d]);


			}
			fColors = new Float32Array(colors);
		}else{
			fColors = col;
		}

		var colourBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
		gl.enableVertexAttribArray(1);
		gl.bufferData(gl.ARRAY_BUFFER, fColors, gl.STATIC_DRAW);
		gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 16, 0);

		var uvBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
		gl.enableVertexAttribArray(2);
		gl.bufferData(gl.ARRAY_BUFFER, uv, gl.STATIC_DRAW);
		gl.vertexAttribPointer(2,2,gl.FLOAT, false, 8,0);


		var vertexIndexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, vertexIndexBuffer);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW)

		gl.bindVertexArray(null);

		this.numItems = idx.length;
	}

	draw(gl){
		gl.bindVertexArray(this.vertexArray);
		gl.drawElements(gl.TRIANGLES, this.numItems,  gl.UNSIGNED_SHORT, 0)
		// gl.drawArrays(gl.TRIANGLES, 0, this.numItems);
		gl.bindVertexArray(null);
	}

	// setTexture(texture){
	// 	this.texture = gl.
	// }
}
