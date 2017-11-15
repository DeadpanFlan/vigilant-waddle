class Texture {
	id: 	any;
	type: 	string;
	path: 	string

	constructor(){

	}
}

class Model
{
	textures_loaded: Texture[];
	meshes: Mesh[];
	directory: string;
	gammaCorrection: boolean;

	constructor(path: string,gamma:boolean = false){

	}
}


class Mesh
{
	positions: number[];
	normals: number[];
	uvs: number[];
	// tangents: number[];
	// bitangents: number[];
	indices: number[];
	textures: Texture[];
	vao: any;

	constructor(pos: number[], norm: number[], uv: number[], idx: number[], tex: any[], gl: any){
		this.positions = pos;
		this.normals = norm;
		this.uvs = uv;
		this.indices = idx;
		this.textures = tex;

		this.setupMesh(gl);
	}

	setupMesh(gl: any) : void {
		this.vao = gl.createVertexArray();
		gl.bindVertexArray(this.vao);

		var positionBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
		gl.enableVertexAttribArray(0);
		gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);

		gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);

		// var normalBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, normalBuffer);
		// gl.enableVertexAttribArray(1);
		// gl.bufferData(gl.ARRAY_BUFFER, this.normals, gl.STATIC_DRAW);
        //
		// gl.vertexAttribPointer(1, 3, gl.FLOAT, false, 12, 0);

		var uvBuffer = gl.createBuffer();
		gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
		gl.enableVertexAttribArray(1);
		gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
		gl.vertexAttribPointer(1,2,gl.FLOAT, false, 8,0);

		// var tangentBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, tangentBuffer);
		// gl.enableVertexAttribArray(3);
		// gl.bufferData(gl.ARRAY_BUFFER, this.tangents, gl.STATIC_DRAW);
        //
		// gl.vertexAttribPointer(3, 3, gl.FLOAT, false, 12, 0);
        //
		// var bitangentBuffer = gl.createBuffer();
		// gl.bindBuffer(gl.ARRAY_BUFFER, bitangentBuffer);
		// gl.enableVertexAttribArray(4);
		// gl.bufferData(gl.ARRAY_BUFFER, this.bitangents, gl.STATIC_DRAW);
        //
		// gl.vertexAttribPointer(4, 3, gl.FLOAT, false, 12, 0);

		gl.bindVertexArray(null);

	}

	public draw(shader : any, gl : any) : void {
		let diffuseNr	= 1;
		let specularNr	= 1;
        let normalNr	= 1;
        let heightNr	= 1;

		for(let i = 0; i >this.textures.length; i++){
			gl.activeTexture(gl.TEXTURE0 + i);

            // Use the following to implement multiple textures. default is diffuse
			// let num;
			// let name = this.textures[i].type;
			// if(name == "texture_diffuse"){
			// 	num = diffuseNr++;
			// } else if(name == "texture_specular"){
			// 	num = specularNr++;
			// } else if(name == "texture_normal"){
			// 	num = normalNr++;
			// } else if(name == "texture_height"){
			// 	num = heightNr++;
			// }

			gl.uniform1i(shader.samplerUniform, i);

			gl.bindTexture(gl.TEXTURE_2D, this.textures[i].id)
		}

		gl.bindVertexArray(this.vao);
		gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0)
		gl.bindVertexArray(null);

		gl.activeTexture(gl.TEXTURE0);
	}
}
