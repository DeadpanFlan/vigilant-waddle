class testStore {
    constructor() {
        this.isTouched = false;
        this.faceMap = new Map();
        this.indices = [];
        this.vertexPositions = [];
        this.vertexNorms = [];
        this.vertexUV = [];
    }
}
function parseOBJ(text) {
    let storage = [];
    let lines;
    if (text) {
        if (text.indexOf('\r\n') > -1) {
            lines = text.split('\r\n');
        }
        else if (text.indexOf('\n') > -1) {
            lines = text.split('\n');
        }
        let num_lines = lines.length;
        let v = [];
        let vn = [];
        let vt = [];
        let item = new testStore();
        let line = null;
        for (let i = 0; i <= num_lines; i++) {
            line = lines[i];
            if (line == undefined || line == '' || line == null)
                continue;
            line = line.replace(/\s\s+/g, ' ').trim().split(' ');
            switch (line[0]) {
                case '#':
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
                        if (!item.isTouched) {
                            item.isTouched = true;
                        }
                        if (!item.faceMap.has(line[j])) {
                            item.faceMap.set(line[j], item.faceMap.size);
                            let faces = line[j].indexOf('/') > -1 ? line[j].split('/') : [line[j]];
                            let f = faces.map(x => parseInt(x));
                            item.vertexPositions = item.vertexPositions.concat(v[f[0] - 1]);
                            if (f[1] && !isNaN(f[1])) {
                                item.vertexUV = item.vertexUV.concat(vt[f[1] - 1]);
                            }
                            if (f[2] && !isNaN(f[2])) {
                                item.vertexNorms = item.vertexNorms.concat(vn[f[2] - 1]);
                            }
                        }
                        item.indices = item.indices.concat([item.faceMap.get(line[j])]);
                    }
                    break;
                case "o":
                    if (item.isTouched) {
                        storage.push(item);
                        item = new testStore();
                    }
                    break;
                default:
                    break;
            }
        }
        if (item.isTouched) {
            storage.push(item);
        }
    }
    return storage;
}
