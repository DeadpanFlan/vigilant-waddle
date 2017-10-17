# vigilant-waddle
## Done
- [x] Work on Displaying things (init Shaders and Buffers) in WebGL2
- [x] Displaying a Pyramid, next thing would be a Camera to look around
- [x] Folder for storing OBJ files added
- [x] Flying Camera

## Next Up
- Investigate [Obj to JS](https://github.com/chrispalazzolo/objtojs/blob/master/index.js) 
	- Started working on my own version
	- Assuming a valid OBJ file is given, fills position, norms, uvs and index for use with VAO
		- No object or group support 
		- no material support
	- Work on Tangents and Bitangents (for use in future with Normal Mapping)
		- Need to be calculated per face
		- Save VBO Indexing for another time?
		- Use tangentSpace and objloader from here as model
			- https://github.com/opengl-tutorials/ogl/tree/master/common
- Lighting
	- Forward Rendering
	- Deferred Rendering