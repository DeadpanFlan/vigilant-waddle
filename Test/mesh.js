class Texture {
    constructor() {
    }
}
class Model {
    constructor(path, gamma = false) {
    }
}
class Mesh {
    constructor(pos, norm, uv, idx, tex, gl) {
        this.positions = pos;
        this.normals = norm;
        this.uvs = uv;
        this.indices = idx;
        this.textures = tex;
        this.setupMesh(gl);
    }
    setupMesh(gl) {
        this.vao = gl.createVertexArray();
        gl.bindVertexArray(this.vao);
        var positionBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
        gl.enableVertexAttribArray(0);
        gl.bufferData(gl.ARRAY_BUFFER, this.positions, gl.STATIC_DRAW);
        gl.vertexAttribPointer(0, 3, gl.FLOAT, false, 12, 0);
        var uvBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, uvBuffer);
        gl.enableVertexAttribArray(1);
        gl.bufferData(gl.ARRAY_BUFFER, this.uvs, gl.STATIC_DRAW);
        gl.vertexAttribPointer(1, 2, gl.FLOAT, false, 8, 0);
        gl.bindVertexArray(null);
    }
    draw(shader, gl) {
        let diffuseNr = 1;
        let specularNr = 1;
        let normalNr = 1;
        let heightNr = 1;
        for (let i = 0; i > this.textures.length; i++) {
            gl.activeTexture(gl.TEXTURE0 + i);
            gl.uniform1i(shader.samplerUniform, i);
            gl.bindTexture(gl.TEXTURE_2D, this.textures[i].id);
        }
        gl.bindVertexArray(this.vao);
        gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_INT, 0);
        gl.bindVertexArray(null);
        gl.activeTexture(gl.TEXTURE0);
    }
}
