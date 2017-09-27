function processLine(str){
	str = str.replace(/\s\s+/g, ' ');
	str = str.trim();
	return str.split(' ');
}

function parseText(text){
	var ret;
	text = `# OBJ file created by ply_to_obj.c
#
g Object001

v  0  -0.525731  0.850651
v  0.850651  0  0.525731
v  0.850651  0  -0.525731
v  -0.850651  0  -0.525731
v  -0.850651  0  0.525731
v  -0.525731  0.850651  0
v  0.525731  0.850651  0
v  0.525731  -0.850651  0
v  -0.525731  -0.850651  0
v  0  -0.525731  -0.850651
v  0  0.525731  -0.850651
v  0  0.525731  0.850651

f  2  3  7
f  2  8  3
f  4  5  6
f  5  4  9
f  7  6  12
f  6  7  11
f  10  11  3
f  11  10  4
f  8  9  10
f  9  8  1
f  12  1  2
f  1  12  5
f  7  3  11
f  2  7  12
f  4  6  11
f  6  5  12
f  3  8  10
f  8  2  1
f  4  10  9
f  5  9  1`

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

		var line = null;
		for (var i = 0; i <= num_lines - 1; i++) {
			line = lines[i]
			if(line == undefined || line == '' || line == null) continue;

			line = processLine(line);
			// console.log(line)

			switch(line[0]){
				case '#':
					console.log(line);
					break;
				case 'v':
				case 'vt':
				case 'vn':
				case 'vp':
					break;
				default:
					break;
			}
		}
	}
}