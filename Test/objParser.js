

function processLine(str){
	str = str.replace(/\s\s+/g, ' ');
	str = str.trim();
	return str.split(' ');
}

function readTextFile(file)
{
	var ret;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, true);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
    			console.log(allText)

                ret = allText;
            }
        }
    }
    rawFile.send(null);
    return ret;
}

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
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

function parseText(url){
	var ret;
	// var text = readTextFile(url);
	var promise = $.ajax(url);

	promise.then(function(text){
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

			var obj = {
				v: [],
				vn: [],
				vt: [],

				indexes: new Uint16Array([]),
				vertexPositions: new Float32Array([]), 
				vertexNorms: new Float32Array([]), 
				vertexUV: new Float32Array([]), 
			}
			var faceMap = [];



			var line = null;
			for (var i = 0; i <= num_lines - 1; i++) {
				line = lines[i]
				if(line == undefined || line == '' || line == null) continue;

				line = processLine(line);
				// console.log(line)

				switch(line[0]){
					case '#':
						break;
					case 'v':
					case 'vt':
					case 'vn':
						obj[line[0]].push(line.slice(1).map(function(x){
							return parseFloat(x);
						}))
						break;
					case 'f':
						// console.log("Face")

						for (var j = 1; j < line.length; j++) {
							// console.log(i);
							// console.log(line[j]);
							if(faceMap[line[j]] == undefined){
								faceMap[line[j]] = Object.keys(faceMap).length +1;
							}
							// console.log(line[i]);
							var faces = line[j].indexOf('/') > -1 ? line[j].split('/') : [line[j]];
							var f = faces.map(function(x){
								return parseInt(x);
							})
							obj.indexes = Uint16Concat(obj.indexes, [faceMap[line[j]]])
							obj.vertexPositions = Float32Concat(obj.vertexPositions ,obj.v[f[0]-1])
							if(f[1] && !isNaN(f[1])){
								obj.vertexUV = Float32Concat(obj.vertexUV ,obj.vt[f[1]-1])

							}
							if(f[2] && !isNaN(f[2])){
								obj.vertexNorms = Float32Concat(obj.vertexNorms ,obj.vn[f[2]-1])

							}
							// obj.vertexPositions = Float32Concat(obj.vertexPositions ,obj.v[f[0]-1])
						}
						// obj[line[0]].push(line.slice(1).map(function(x){
						// 	return parseInt(x);
						// }))
						break;
					default:
						break;
				}
			}
			console.log(faceMap)
			console.log(obj)
			// return obj;
		}
	})

	
}