interface IndexSignature {
  [key: string]: any;
}

class MeshStore {
	faceMap: 			Map<string, number>;
	indices: 			number[];
	vertexPositions: 	number[];
	vertexNorms: 		number[];
	vertexUV: 			number[];
	isTouched: 			boolean;

	material:			string;

	constructor(){
		this.isTouched = false;
		this.faceMap = new Map<string, number>();
		this.indices = [];

		this.vertexPositions = [];
		this.vertexNorms = [];
		this.vertexUV = [];
	}

}

class Material implements IndexSignature{
	[key: string]: any;
	public name: 	string;
	public Ns:		number; 	// Focus of the specular highlight
    public Ni:		number; 	// index of refraction
    public d:		number; 	// Transparency
    public illum:	number;		// Illumination Model
    public Ka:		number[]; 	// Ambient Color
    public Kd:		number[];	// Diffuse Color
    public Ks:		number[]; 	// Specular Color
    public Ke:		number[];	// emissive coeficient
    public map_Kd: 	string;		// Diffuse Texture
	// map_Ka: string;		// AMbient texture
	// map_d:	string;		// Transparency map
	constructor(name="None",ka=[0.0000, 0.0000, 0.0000],kd=[0.8, 0.8, 0.8],ks=[0.8, 0.8, 0.8],ns=0,ni=1,d=1,illum=2,ke=[0.0000, 0.0000, 0.0000] ){
		this.name = name;
		this.Ka = ka;
		this.Kd = kd;
		this.Ks = ks;
		this.Ns = ns;
		this.Ni = ni;
		this.d = d;
		this.illum = illum;
		this.Ke = ke;
	}
}

function parseMtlURL(path: string, mtl: string) : Promise<any> {


	let tmp1 = fetch(path+mtl)
	let tmp2 = tmp1.then((res) => {
		if (!res.ok) {
            throw Error(res.statusText);
        }
		return res.text();
	})

	return tmp2.then( text => {
		let mtlArr : any = [];
		let lines;
		if(text){
			if(text.indexOf('\r\n') > -1){
				lines = text.split('\r\n');
			}
			else if(text.indexOf('\n') > -1){
				lines = text.split('\n');
			}

			let num_lines = lines.length;

			let mtl;

			let line = null;
			for(let i = 0; i <= num_lines ; i++){
				line = lines[i];
				if(line == undefined || line == '' || line == null) continue;

				line = line.replace(/\s\s+/g, ' ').trim().split(' ');

				var type : string = line[0];
				switch(type){
					case 'newmtl':
						if(mtl){
							mtlArr[mtl.name] = mtl;
						}

						mtl = new Material(line[1]);
						break;
					case 'Ns':
					case 'Ni':
					case 'd':
					case 'illum':
						mtl[type] = parseFloat(line[1]);
						break;
					case 'Ka':
					case 'Kd':
					case 'Ks':
					case 'Ke':
						mtl[type] = line.slice(1).map(x => parseFloat(x))
						break;
					case 'map_Kd':
						mtl[type] = line[1];
					default:
						break;
				}

			}
			mtlArr[mtl.name] = mtl;
		}

		return mtlArr;
	})



}


function parseObjURL(path: string, obj: string) : Promise<MeshStore[]>{
	var tmp1 = fetch(path+obj).then((res) => {
		if (!res.ok) {
            throw Error(res.statusText);
        }
		return res.text();
	})
	let mtlString = obj.split('.')[0]+".mtl"

	var tmp2 = parseMtlURL(path, mtlString);


	return Promise.all([tmp1,tmp2]).then((values) =>{
		let text : string = values[0];
		let mtls = values[1];


		let storage = [];
		let lines;
		if(text){
			if(text.indexOf('\r\n') > -1){
				lines = text.split('\r\n');
			}
			else if(text.indexOf('\n') > -1){
				lines = text.split('\n');
			}

			let num_lines = lines.length;

			let v = [];
			let vn = [];
			let vt = [];

			let item = new MeshStore();

			let line = null;
			for(let i = 0; i <= num_lines ; i++){
				line = lines[i];
				if(line == undefined || line == '' || line == null) continue;

				line = line.replace(/\s\s+/g, ' ').trim().split(' ');

				switch(line[0]){
					case '#':
						break;
					case 'mtllib':
						// let mtls = parseMtlURL(path,line[1]);
						// mtls.then(x=>{
						// 	console.log(x);
						// })
						break;
					case 'v':
				  		v.push(line.slice(1).map(x => parseFloat(x)));
				  		break;
					case 'vt':
				  		vt.push(line.slice(1).map(x => parseFloat(x)));
				  		break;
					case 'vn':
				  		vn.push(line.slice(1).map(x => parseFloat(x)));
				  		break;
					case 'f':
				  		for (let j = 1; j < line.length; j++) {
							if(!item.isTouched){
					  			item.isTouched = true;
							}
							if(!item.faceMap.has(line[j])){
					  			item.faceMap.set(line[j], item.faceMap.size);

					  			let faces = line[j].indexOf('/') > -1 ? line[j].split('/') : [line[j]];
								let f = faces.map(x => parseInt(x));

					  			item.vertexPositions = item.vertexPositions.concat(v[f[0]-1]);
					  			if(f[1] && !isNaN(f[1])){
									item.vertexUV = item.vertexUV.concat(vt[f[1]-1]);
								}
								if(f[2] && !isNaN(f[2])){
									item.vertexNorms = item.vertexNorms.concat(vn[f[2]-1]);
								}
							}
							item.indices = item.indices.concat( [item.faceMap.get(line[j])]);
				  		}
				  		break;
					case "o":
					case "g":
				  		if(item.isTouched){
							storage.push(item);
							item = new MeshStore();
				  		}
				  		break;
					case "usemtl":
						item.material = mtls[line[1]];
					default:
				  		break;
			  	}
			}
			if(item.isTouched){
				storage.push(item);
			}
	  	}
	  	return storage;
	})
}

function parseOBJ(text: string) : MeshStore[] {
	let storage = [];
	let lines;

	if(text){
		if(text.indexOf('\r\n') > -1){
			lines = text.split('\r\n');
		}
		else if(text.indexOf('\n') > -1){
			lines = text.split('\n');
		}

		let num_lines = lines.length;

		let v = [];
		let vn = [];
		let vt = [];

		let item = new MeshStore();

		let line = null;
		for(let i = 0; i <= num_lines ; i++){
			line = lines[i];
			if(line == undefined || line == '' || line == null) continue;

			line = line.replace(/\s\s+/g, ' ').trim().split(' ');

			switch(line[0]){
				case '#':
					break;
				case 'mtllib':

					break;
				case 'v':
			  		v.push(line.slice(1).map(x => parseFloat(x)));
			  		break;
				case 'vt':
			  		vt.push(line.slice(1).map(x => parseFloat(x)));
			  		break;
				case 'vn':
			  		vn.push(line.slice(1).map(x => parseFloat(x)));
			  		break;
				case 'f':
			  		for (let j = 1; j < line.length; j++) {
						if(!item.isTouched){
				  			item.isTouched = true;
						}
						if(!item.faceMap.has(line[j])){
				  			item.faceMap.set(line[j], item.faceMap.size);

				  			let faces = line[j].indexOf('/') > -1 ? line[j].split('/') : [line[j]];
							let f = faces.map(x => parseInt(x));

				  			item.vertexPositions = item.vertexPositions.concat(v[f[0]-1]);
				  			if(f[1] && !isNaN(f[1])){
								item.vertexUV = item.vertexUV.concat(vt[f[1]-1]);
							}
							if(f[2] && !isNaN(f[2])){
								item.vertexNorms = item.vertexNorms.concat(vn[f[2]-1]);
							}
						}
						item.indices = item.indices.concat( [item.faceMap.get(line[j])]);
			  		}
			  		break;
				case "o":
				case "g":
			  		if(item.isTouched){
						storage.push(item);
						item = new MeshStore();
			  		}
			  		break;
				case "usemtl":
					item.material = line[1];
				default:
			  		break;
		  	}
		}
		if(item.isTouched){
			storage.push(item);
		}
  	}
  	return storage;
}
