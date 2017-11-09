class MyObject {
	constructor(gl,pos,idx,col){
		this.indices = idx;
		this.positions = pos;
		this.vertexArray = gl.createVertexArray();
		gl.bindVertexArray(this.vertexArray);

		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, pos, gl.STATIC_DRAW);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
		gl.enableVertexAttribArray(0);

		var fColors = new Float32Array();
		if(!col){
			var colors = []
			while(colors.length/4 < pos.length/3){
				colors = colors.concat([1.0, 0.0, 0.0, 1.0,
	            0.0, 1.0, 0.0, 1.0,
	            0.0, 0.0, 1.0, 1.0])
			}
			fColors = new Float32Array(colors);
		}else{
			fColors = col;
		}

		var colourBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, colourBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, fColors, gl.STATIC_DRAW);

		gl.vertexAttribPointer(1, 4, gl.FLOAT, false, 16, 0);
		gl.enableVertexAttribArray(1);

		// var indexBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		// gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, idx, gl.STATIC_DRAW);


		gl.bindVertexArray(null);

		this.numItems = pos.length/3;
	}

	draw(gl){
		gl.bindVertexArray(this.vertexArray);
		gl.drawArrays(gl.TRIANGLES, 0, this.numItems);
		gl.bindVertexArray(null);
	}
}
