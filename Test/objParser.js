class MyStore {

	constructor(){
		this.faceMap = [];
		this.indexes = new Uint16Array([]);
		this.vertexPositions = new Float32Array([]);
		this.vertexNorms = new Float32Array([]);
		this.vertexUV = new Float32Array([]);
	}

	appendPosition(pos)
	{

	}
}

function processLine(str)
{
	str = str.replace(/\s\s+/g, ' ');
	str = str.trim();
	return str.split(' ');
}



function Float32Concat(first, second)
{
    var firstLength = first.length,
        result = new Float32Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}

function Uint16Concat(first, second)
{
    var firstLength = first.length,
        result = new Uint16Array(firstLength + second.length);

    result.set(first);
    result.set(second, firstLength);

    return result;
}

function parseText(text){
	var ret, ret2;
	var num_lines = 0;
	var lines = [];

	if(text && typeof text == "string"){
		if(text.indexOf('\r\n') > -1){
			lines = text.split('\r\n');
		}
		else if(text.indexOf('\n') > -1){
			lines = text.split('\n');
		}

		num_lines = lines.length;

		var tmp = {
			v: [],
			vn: [],
			vt: [],
		}

		var storage = [];

		ret = {

			indexes: new Uint16Array([]),
			vertexPositions: new Float32Array([]),
			vertexNorms: new Float32Array([]),
			vertexUV: new Float32Array([]),
			// vertexTangent: new Float32Array([]),
			// vertexBitangent: new Float32Array([]),
			testvar: []
		}

		ret2 = new MyStore();
		var faceMap = [];



		var line = null;
		for (var i = 0; i <= num_lines - 1; i++) {
			line = lines[i]
			if(line == undefined || line == '' || line == null) continue;

			line = processLine(line);

			switch(line[0]){
				case '#':
					break;
				case 'v':
				case 'vt':
				case 'vn':
					tmp[line[0]].push(line.slice(1).map(function(x){
						return parseFloat(x);
					}))
					break;
				case 'f':
					for (let j = 1; j < line.length; j++) {
						if(faceMap[line[j]] == undefined){

							faceMap[line[j]] = Object.keys(faceMap).length;
							ret2.faceMap[line[j]] = Object.keys(ret2.faceMap).length;

							let faces = line[j].indexOf('/') > -1 ? line[j].split('/') : [line[j]];

							let f = faces.map(x => parseInt(x));

							ret.vertexPositions = Float32Concat(ret.vertexPositions ,tmp.v[f[0]-1])

							if(f[1] && !isNaN(f[1])){
								ret.vertexUV = Float32Concat(ret.vertexUV ,tmp.vt[f[1]-1])

							}
							if(f[2] && !isNaN(f[2])){
								ret.vertexNorms = Float32Concat(ret.vertexNorms ,tmp.vn[f[2]-1])

							}
						}
						ret.indexes = Uint16Concat(ret.indexes, [faceMap[line[j]]]);
					}
					break;
				default:
					break;
			}
		}
		// Calculate Tangent and Bitangents
		// if(ret.vertexPositions.length/3 == ret.vertexNorms.length/3 && ret.vertexNorms.length/3 == ret.vertexUV.length/2){
		// 	for(i = 0; i < ret.vertexPositions.length; i +=9){
		// 		var j = 0;
		// 		var v0 = fromArray(ret.vertexPositions.subarray((i+j*3),((i+j*3))+3 ));
		// 		j++;
		// 		var v1 = fromArray(ret.vertexPositions.subarray((i+j*3),((i+j*3))+3 ));
		// 		j++;
		// 		var v2 = fromArray(ret.vertexPositions.subarray((i+j*3),((i+j*3))+3 ));
		//
		// 		j = 0;
		// 		var uv0 = fromArray(ret.vertexPositions.subarray((i+j*3),((i+j*3))+3 ));
		// 		j++;
		// 		var uv1 = fromArray(ret.vertexPositions.subarray((i+j*3),((i+j*3))+3 ));
		// 		j++;
		// 		var uv2 = fromArray(ret.vertexPositions.subarray((i+j*3),((i+j*3))+3 ));
		//
		// 	}
		//
		// }

	}
	return ret;
}

function fromArray(arr){
	return vec3.fromValues(arr[0],arr[1],arr[2]);
}
