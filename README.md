# Recordplayerinator 5000

Welcome to our team project for CS 174A, Spring Quarter 2019 at UCLA!
Our project is a record player, as you may have surmised from the title.

Here's what you're looking at, sorted by contributor:

**Note: fill out the TODO spots with a small explanation of the difficulties and complexities of that feature (for brownie points!)**

**Amanda:**

* A record player, complete with lid, body, spindle, and disc, modeled in Fusion360 and MeshMixer. **AMANDA TODO**
* A wood shader applied to the body of the player. **AMANDA TODO**
* A toon shader applied to the spindle. **AMANDA TODO**
* A cool water shader on the spinning record, with little waves oscillating about. **AMANDA TODO**
* A fire shader. **AMANDA TODO**

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