'use strict'
// GL Stuff

var gl;
var canvas;




// Variables
var shaderProgram;

var mMatrix = mat4.create();
var pMatrix = mat4.create();

function setMatrixUniforms() {
	gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, pMatrix);
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
	// gl.useProgram(shaderProgram); // Use to switch between shaders if more than one
	setMatrixUniforms();
	// gl.drawArrays(gl.TRIANGLES, 0, pyramid.numItems);
	// console.log(pyramid)
	gl.drawElements(gl.TRIANGLES, 12,  gl.UNSIGNED_SHORT, 0)
	gl.bindVertexArray(null);
}

// Camera Init and Pointerlock
var cam = new Camera();
var keys = [];

function lockChangeAlert() {
	if (document.pointerLockElement === canvas ||
		document.mozPointerLockElement === canvas) {
		console.log('The pointer lock status is now locked');
		// document.addEventListener("mousemove",handleMouse , false);
		$('#screen').mousemove(handleMouse);
		// Handle keys
		$(document).keydown(
			function(e){
				if(!e.originalEvent.repeat){
					keys[e.key] = true;
				}
			}
		);
		$(document).keyup(
			function (e) {
				keys[e.key] = false;
			}
		);

	} else {
		console.log('The pointer lock status is now unlocked');
		$('#screen').off('mousemove keydown');
		keys = [];
		// $(document).off('keypress');

	}
}

function handleMouse(e){
	cam.processMouseMovement(e.originalEvent.movementX, e.originalEvent.movementY);
}




// Initialization Stuff
var pyramid;

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

	parseText("Objects/icosNorms.obj");
	// parseText("Objects/tpNorms.obj");



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

function processKeys(now) {
	if (lastTime != 0) {
		var elapsed = (now - lastTime)/1000;

		if(keys['w'] || keys['ArrowUp']){
			cam.processKeyboard('F',elapsed);
		}
		if(keys['a'] || keys['ArrowLeft']){
			cam.processKeyboard('L',elapsed);
		}
		if(keys['s'] || keys['ArrowDown']){
			cam.processKeyboard('B',elapsed);
		}
		if(keys['d'] || keys['ArrowRight']){
			cam.processKeyboard('R',elapsed);
		}
	}
	lastTime = now;
}

function tick(now){ 

	requestAnimationFrame(tick);
	drawFrame();
	processKeys(now);

}



