# vigilant-waddle
## Done
- [x] Work on Displaying things (init Shaders and Buffers) in WebGL2
- [x] Displaying a Pyramid, next thing would be a Camera to look around
- [x] Folder for storing OBJ files added
- [x] Flying Camera
- [x] Generic Mesh object created for storing meshes loaded from obj file.
	- [x] Assuming a valid OBJ file is given, fills position, norms, uvs and index for use with VAO
	- Handles the following
		- [x] positions
		- [x] uvs
		- [ ] normals
		- [ ] tangents/bitangents

## Next Up
- Investigate [Obj to JS](https://github.com/chrispalazzolo/objtojs/blob/master/index.js)
	- Started working on my own version
	- Work on Tangents and Bitangents (for use in future with Normal Mapping)
		- Need to be calculated per face
		- Save VBO Indexing for another time?
		- Use tangentSpace and objloader from here as model
			- https://github.com/opengl-tutorials/ogl/tree/master/common
	- Add Materials to object that is returned to be used by meshes
- Lighting
	- Forward Rendering
	- Deferred Rendering
- Generic Mesh object
	- Textures implemented
		- need to create a default state for meshes with no Textures
		- Multiple Textures
		- Need to read textures from Material


- Shaders
	- Consider texture0 as a White Texture

## Running
```bash
npm start
```
- requires node and http-server to be installed
