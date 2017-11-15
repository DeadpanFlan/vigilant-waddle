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

	mat4.perspective(pMatrix, 45, gl.viewportWidth / gl.viewportHeight, 0.1, 1000.0);
	mat4.identity(mMatrix);

	mat4.translate(mMatrix, mMatrix, [-1.5, 0.0, -8.0]);

	// gl.useProgram(shaderProgram); // Use to switch between shaders if more than one
	setMatrixUniforms();
	gl.activeTexture(gl.TEXTURE0);
  gl.bindTexture(gl.TEXTURE_2D, texture);
  gl.uniform1i(shaderProgram.samplerUniform, 0);
	for(let m of meshes){
		m.draw(gl);
	}

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

var texture;
function initTexture() {
  // texture = gl.createTexture();
  texture.image = new Image();
  texture.image.onload = function () {
		gl.bindTexture(gl.TEXTURE_2D, texture);
		gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
		gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, texture.image);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
		gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
		gl.bindTexture(gl.TEXTURE_2D, null);
  }

  texture.image.src = "Objects/cube.png";
}

// Initialization Stuff
var mesh;
var meshes = [];
var testBufferInfo;

function start() {
	canvas = document.getElementById("screen")
	initGL(canvas);
	texture = gl.createTexture();
	initTexture();

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
	var url = "Objects/cube.obj";

	var testvar = parseObjURL("Objects/", "cube.obj")

	testvar.then(x =>{
		for(let e of x){
			meshes.push(new Mesh(gl,new Float32Array(e.vertexPositions),new Float32Array(e.vertexNorms), new Float32Array(e.vertexUV), new Uint16Array(e.indices), e.material));
		}

		gl.clearColor(0.0, 0.0, 0.0, 1.0);

		gl.cullFace (gl.BACK);
		gl.frontFace (gl.CCW);
		gl.enable (gl.CULL_FACE);
		gl.enable (gl.DEPTH_TEST);

		tick(0);
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
			cam.processKeyboard('F',elapsed, keys["Shift"]);
		}
		if(keys['a'] || keys['ArrowLeft']){
			cam.processKeyboard('L',elapsed,  keys["Shift"]);
		}
		if(keys['s'] || keys['ArrowDown']){
			cam.processKeyboard('B',elapsed,  keys["Shift"]);
		}
		if(keys['d'] || keys['ArrowRight']){
			cam.processKeyboard('R',elapsed,  keys["Shift"]);
		}
	}
	lastTime = now;
}


function tick(now){

	requestAnimationFrame(tick);

	drawFrame();
	processKeys(now);

}
