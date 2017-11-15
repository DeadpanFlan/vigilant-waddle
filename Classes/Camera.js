const Y = -90.0;
const P =  0.0;
const SPEED = 2.5;
// const SPEED = 250;
const SENSITIVTY = 0.3;
const ZOOM       = 45.0;

var toRad = glMatrix.toRadian;

class Camera {
	constructor(pos=vec3.fromValues(0.0,0.0,0.0), up=vec3.fromValues(0.0,1.0,0.0),yw=Y, ptch=P){
		this.front = vec3.fromValues(0.0,0.0,-1.0);
		this.mSpeed = SPEED;
		this.mSensitivity = SENSITIVTY;
		this.zoom = ZOOM;

		this.position = pos;
		this.wUp = up;
		this.yaw = yw;
		this.pitch = ptch;

		this.updateCameraVectors()
	}

	getViewMatrix(){
		var ret = mat4.create();
		var center = vec3.create();
		vec3.add(center, this.position, this.front);

		mat4.lookAt(ret,this.position, center, this.up)
		return ret;
	}

	updateCameraVectors(){
		var f = vec3.create();
		f[0] = Math.cos(toRad(this.yaw)) * Math.cos(toRad(this.pitch));
		f[1] = Math.sin(toRad(this.pitch));
		f[2] = Math.sin(toRad(this.yaw)) * Math.cos(toRad(this.pitch));
		vec3.normalize(this.front, f);

		var c1 = vec3.create()
		this.right = vec3.create()
		this.up = vec3.create()

		vec3.cross(c1,this.front, this.wUp);
		vec3.normalize(this.right, c1)

		vec3.cross(c1,this.right, this.front);
		vec3.normalize(this.up,c1);
	}

	processMouseMovement(xOff,yOff){
		// var e = e.originalEvent;
		// console.log(this)
		xOff *= this.mSensitivity;
		yOff *= this.mSensitivity;


		this.yaw += xOff;
		this.pitch -= yOff;

		if (this.pitch > 89.0){
			this.pitch = 89.0;
		}
        if (this.pitch < -89.0){
            this.pitch = -89.0;
        }
        this.updateCameraVectors();

	}

	processKeyboard(direction, dTime, shift=false){
		var velocity = this.mSpeed * dTime;
		if(shift) velocity*=3;
		var fb = vec3.create();
		var lr = vec3.create();

		vec3.scale(fb,this.front,velocity)
		vec3.scale(lr,this.right,velocity)
		switch(direction){
			case 'F':
				vec3.add(this.position,this.position, fb);
				break;
			case 'B':
				vec3.sub(this.position,this.position, fb)
				break;
			case 'L':
				vec3.sub(this.position,this.position, lr);
				break;
			case 'R':
				vec3.add(this.position,this.position, lr);
				break;
		}
	}


}
