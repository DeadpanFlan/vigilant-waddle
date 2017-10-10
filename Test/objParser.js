

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

function parseText(text){
	var ret;
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

		ret = {

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


					for (var j = 1; j < line.length; j++) {
						if(faceMap[line[j]] == undefined){
							faceMap[line[j]] = Object.keys(faceMap).length +1;
						}
						var faces = line[j].indexOf('/') > -1 ? line[j].split('/') : [line[j]];
						var f = faces.map(function(x){
							return parseInt(x);
						})
						ret.indexes = Uint16Concat(ret.indexes, [faceMap[line[j]]])
						ret.vertexPositions = Float32Concat(ret.vertexPositions ,tmp.v[f[0]-1])
						if(f[1] && !isNaN(f[1])){
							ret.vertexUV = Float32Concat(ret.vertexUV ,tmp.vt[f[1]-1])

						}
						if(f[2] && !isNaN(f[2])){
							ret.vertexNorms = Float32Concat(ret.vertexNorms ,tmp.vn[f[2]-1])

						}
					}
					break;
				default:
					break;
			}
		}
		
	}
	return ret;
}

	
