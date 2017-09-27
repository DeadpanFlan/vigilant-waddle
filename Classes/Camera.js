const Y = -90.0;
const P =  0.0;
const SPEED = 2.5;
const SENSITIVTY = 0.1;
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
		vec3.normalize(this.up,c1 );
	}
}