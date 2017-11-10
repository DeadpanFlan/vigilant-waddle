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

	// gl.useProgram(shaderProgram); // Use to switch between shaders if more than one
	setMatrixUniforms();
	mesh.draw(gl);
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
var mesh;
var testBufferInfo;

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

	// Get object
	var url = "Objects/icosahedron.obj";

	fetch(url)
	// Parse response as text or log error
	.then((res) => {
		if (!res.ok) {
            throw Error(res.statusText);
        }
		return res.text();
	})
	.then((data) => {
		var t = parseText(data);

		mesh = new Mesh(gl,t.vertexPositions,t.vertexNorms, t.vertexUV, t.indexes);
		// pyramid = new Mesh(gl,arrays.position,arrays.normal, arrays.texcoord,arrays.indices);

		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		gl.cullFace (gl.BACK);
		gl.frontFace (gl.CCW);
		gl.enable (gl.CULL_FACE);
		gl.enable (gl.DEPTH_TEST);

		tick(0);
	})
	.catch((err) => {
		console.log(err)
	})
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
var nFrames = 0;

function processKeys(now) {
	if (lastTime != 0) {
		var elapsed = (now - lastTime)/1000;
		nFrames++;
		if(elapsed >= 1){
			console.log(1000/nFrames);
			nFrames = 0;
		}


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
