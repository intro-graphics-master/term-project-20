# Recordplayerinator 5000

Welcome to our team project for CS 174A, Spring Quarter 2019 at UCLA!
Our project is a record player, as you may have surmised from the title.

Here's what you're looking at, sorted by contributor:

**Note: fill out the TODO spots with a small explanation of the difficulties and complexities of that feature (for brownie points!)**

**Amanda:**

* A record player, complete with lid, body, spindle, and disc, modeled in Fusion360 and MeshMixer. The modeling wasn't too complex, as many of the parts are cylinders or boxes. The spindle was very difficult to model, and took roughly 5 hours to model due to complex construction planes. This was a bit more complicated than just modeling the objects. Because Fusion 360 does not export OBJ files with vertex normals, I had to find a workaround. I discovered that the program Autodesk Meshmixer can reexport OBJ files with vertex normals, but with the condition that all objects are moved to the origin. Unfortunately, Meshmixer also exports vertexes with extra vertices. So, I had to directly edit the OBJ file using Notepad++ and find-and-replace all instances of the extra vertices. Then finally, because Meshmixer repositioned and scaled all objects, I had to re-scale and re-position all the objects in the scene. 
* A wood shader applied to the body of the player. This generates wood grain using Simplex noise. Then, it uses a linear interpolation (lerp) and mix() in order to create the rings;
* A toon shader applied to the spindle. This finds the distance from the uniform model matrix and a light vector to determine the shading on the object. After determining distances, it simply uses an array of brightness levels to color the object. The difficult part of this shader was figuring out how to pass the model matrix into the shader. 
* A cool water shader on the spinning record, with little waves oscillating about. The fragment shader, with adaptation from the vertex shader, wasn't too difficult except for the fact that the uv attribute was undefined. My workaround was using position.xz instead of uv to make fake UV mapping. The fragment shader performs most of the same calculations as the vertex shader, but the vertex shader uses the "color" as a multiplier to its y coordinate. 
* A fire/space shader. This also required fake UV mapping. The difficult part was that the shader I had based this on created a small flame in one region of the disk, and I had to change the UV mapping to cover more of the disk. 
* Disc playing. I made a box for the records and had it take out the records from the box. Then, I made it so clicking the "next song" button would toggle different shaders on the disc. Also, the song only plays when there is a disc present on the record player. 
* Lag issues. The pixelation shader was drawing every frame but only displaying when toggled, so I added an extra check to ensure that it would only be called when toggled. 

**Cynthia:**

* A particle shader that permeates the viewport with billboard---that's 2D elements (Squares) floating in a 3D space. **CYNTHIA TODO**
* **CYNTHIA TODO**

**Angela:**

* A flowery shader. **ANGELA TODO**
* A trippy, mind-bending shader that we can't think of a name for (Cellular Noise is too boring). **ANGELA TODO**
* A rainbow shader! :D **ANGELA TODO**
* Linking audio (see **Arjun** below) to the shaders on the disc, so it grooves to the sick beats we're dropping. **ANGELA TODO**

**Arjun:**

* A pixelation effect over the whole scene. This was accomplished using a shader that pixelates a supplied texture image, and a crude implementation of two-pass rendering. The scene with the record player is drawn but not displayed in the viewport; instead, it is saved to a texture. A Square is then drawn in front of the camera (anchored to the camera's position and rotation so that it is always in front and facing the camera), with the pixelation shader applied to it using the aforementioned texture. This effect is togglable, and the code allows for more effects that require two-pass rendering, such as Gaussian Blurs (which could not be implemented in time, unfortunately).
* Audio controls. You can play and pause music, as well as cycle through various songs from ~~a playlist that we have curated for you~~ an album called [Ember by Kubbi](https://open.spotify.com/album/45IjAJ7REqGA1zXZe5we4w?si=dQvLSj5YSMWZXqoNp_JSDg).
* Fixing merge conflicts lmao