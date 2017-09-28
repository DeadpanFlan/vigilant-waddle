'use strict'
// GL Stuff

var gl;
var canvas;




// Variables
var shaderProgram;

var mMatrix = mat4.create();
// var vMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
	// gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, vMatrix);
	gl.uniformMatrix4fv(shaderProgram.vMatrixUniform, false, cam.getViewMatrix());
	gl.uniformMatrix4fv(shaderProgram.mMatrixUniform, false, mMatrix);
}


function drawFrame() {
	gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0);
	mat4.identity(mMatrix);

	mat4.translate(mMatrix, mMatrix, [-1.5, 0.0, -8.0]);

	gl.bindVertexArray(pyramid.vertexArray);
	// gl.useProgram(shaderProgram); // Use to switch between shaders
	setMatrixUniforms();
	gl.drawArrays(gl.TRIANGLES, 0, pyramid.numItems);
	gl.bindVertexArray(null);
}




// Initialization Stuff
var pyramid;
var cam = new Camera();


function lockChangeAlert() {
	var t = (e => cam.processMouseMovement(e));
	if (document.pointerLockElement === canvas ||
		document.mozPointerLockElement === canvas) {
		console.log('The pointer lock status is now locked');
		// document.addEventListener("mousemove",t , false);
		$('#screen').mousemove(t);
	} else {
		console.log('The pointer lock status is now unlocked');
		$('#screen').off('mousemove');
		// document.removeEventListener("mousemove", t, false);

	}
}

function start() {
	canvas = document.getElementById("screen")
	initGL(canvas);

	canvas.requestPointerLock =	canvas.requestPointerLock ||
								canvas.mozRequestPointerLock;

	document.exitPointerLock =	document.exitPointerLock ||
								document.mozExitPointerLock;

	document.addEventListener('pointerlockchange', lockChangeAlert, false);
	document.addEventListener('mozpointerlockchange', lockChangeAlert, false);

	canvas.onclick = function() {
		canvas.requestPointerLock();
	}



	shaderProgram = initShaders(gl);
	pyramid = new Pyramid(gl);

	// parseText("");


	tick(0);

	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.enable(gl.DEPTH_TEST);
	// alert("Start");
}

function initGL(cv) {
	try {
		gl = cv.getContext("webgl2");
		gl.viewportWidth = cv.width;
		gl.viewportHeight = cv.height;
	} catch (e) {
	}
	if (!gl) {
		alert("Could not initialise WebGL, sorry :-(");
	}
}

var lastTime = 0;

function animate(now) {
	if (lastTime != 0) {
		var elapsed = (now - lastTime)/1000;
		// console.log(elapsed)

		// rTri += (90 * elapsed) / 1000.0;
		// rSquare += (75 * elapsed) / 1000.0;
	}
	lastTime = now;
}

function tick(now){ 

	requestAnimationFrame(tick);
	// cam.processKeyboard('B',0.1);
	drawFrame();
	animate(now);

}



