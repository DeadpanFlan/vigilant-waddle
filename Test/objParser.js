function processLine(str){
	str = str.replace(/\s\s+/g, ' ');
	str = str.trim();
	return str.split(' ');
}

function readTextFile(file)
{
	var ret;
    var rawFile = new XMLHttpRequest();
    rawFile.open("GET", file, false);
    rawFile.onreadystatechange = function ()
    {
        if(rawFile.readyState === 4)
        {
            if(rawFile.status === 200 || rawFile.status == 0)
            {
                var allText = rawFile.responseText;
                ret = allText;
            }
        }
    }
    rawFile.send(null);
    return ret;
}

function parseText(url){
	var ret;
	var text = readTextFile(url);

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
			f: [],
		}



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
					obj[line[0]].push(line.slice(1).map(function(x){
						return parseInt(x);
					}))
					break;
				default:
					break;
			}
		}
		// console.log(obj)
	}
}