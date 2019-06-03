import {
    tiny,
    defs
} from './assignment-4-resources.js';

import {
    Key_Board
} from './key-board.js';
// Pull these names into this module's scope for convenience:
const {
    Vec,
    Mat,
    Mat4,
    Color,
    Light,
    Shape,
    Shader,
    Material,
    Texture,
    Scene,
    Canvas_Widget,
    Code_Widget,
    Text_Widget
} = tiny;


const {
    Cube,
    Subdivision_Sphere,
    Transforms_Sandbox_Base
} = defs;

// Now we have loaded everything in the files tiny-graphics.js, tiny-graphics-widgets.js, and assignment-4-resources.js.
// This yielded "tiny", an object wrapping the stuff in the first two files, and "defs" for wrapping all the rest.

// Variables that are in scope for you to use:
// this.shapes: Your shapes, defined above.
// this.materials: Your materials, defined above.
// this.lights:  Assign an array of Light objects to this to light up your scene.
// this.lights_on:  A boolean variable that changes when the user presses a button.
// this.camera_teleporter: A child scene that helps you see your planets up close.
//                         For this to work, you must push their inverted matrices
//                         into the "this.camera_teleporter.cameras" array.
// t:  Your program's time in seconds.
// program_state:  Information the shader needs for drawing.  Pass to draw().
// context:  Wraps the WebGL rendering context shown onscreen.  Pass to draw().  


// add event listener



const Main_Scene =
    class Solar_System extends Scene { // **Solar_System**:  Your Assingment's Scene.
        constructor() { // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
            super();
            // At the beginning of our program, load one of each of these shape 
            // definitions onto the GPU.  NOTE:  Only do this ONCE per shape.
            // Don't define blueprints for shapes in display() every frame.

            // TODO (#1):  Complete this list with any additional shapes you need.
            this.shapes = {
                'background': new defs.Square(),
                'ball_4': new Subdivision_Sphere(4),
                'star': new Planar_Star(),
                'record': new defs.Shape_From_File("assets/mainRecordPlayer.obj"),
                'spindle': new defs.Shape_From_File("assets/spindle.obj"),
                'disk': new defs.Shape_From_File("assets/disk.obj"),
                'lid': new defs.Shape_From_File("assets/lid.obj"),
            };

            // *** Colors *** 
            this.Colors = {
                purple: Color.of(130 / 255., 119 / 255., 203 / 255., 1),
                light_purple: Color.of(221 / 255., 211 / 255., 238 / 255., 1),
                blue: Color.of(119 / 255, 192 / 255, 203 / 255)
            }




            // *** Shaders ***

            // NOTE: The 2 in each shader argument refers to the max
            // number of lights, which must be known at compile time.

            // A simple Phong_Blinn shader without textures:
            const phong_shader = new defs.Phong_Shader(2);
            // Adding textures to the previous shader:
            const texture_shader = new defs.Textured_Phong(2);
            // Same thing, but with a trick to make the textures 
            // seemingly interact with the lights:
            const texture_shader_2 = new defs.Fake_Bump_Map(2);
            // A Simple Gouraud Shader that you will implement:
            const gouraud_shader = new Gouraud_Shader(2);
            // Extra credit shaders:
            const black_hole_shader = new Black_Hole_Shader();
            const rainbow_shader = new Rainbow_Shader();
            const wire_shader = new Wireframe_Shader();
            const funny_shader = new defs.Funny_Shader();
            const water_shader = new Water_Shader();
            const displacement_shader = new Displacement_Shader();
            const flower_shader = new Flower_Shader();
            const trippy_shader = new defs.Trippy_Shader();
            // *** Materials: *** wrap a dictionary of "options" for a shader.

            // TODO (#2):  Complete this list with any additional materials you need:

            this.materials = {
                space: new Material(phong_shader, {
                    ambient: 1,
                    diffusivity: 0,
                    specularity: 0,
                    color: this.Colors.purple
                }),
                rainbow_plastic: new Material(rainbow_shader, {
                    ambient: 0,
                    diffusivity: 1,
                    specularity: 0,
                    color: this.Colors.purple
                }),
                trippy_plastic: new Material(trippy_shader, {
                    ambient: 0,
                    diffusivity: 1,
                    specularity: 0,
                    color: this.Colors.purple
                }),
                plastic: new Material(phong_shader, {
                    ambient: .2,
                    diffusivity: 1,
                    specularity: 0,
                    color: Color.of(1, .5, 1, 1)
                }),
                plastic_stars: new Material(texture_shader_2, {
                    texture: new Texture("assets/stars.png"),
                    ambient: 0,
                    diffusivity: 1,
                    specularity: 0,
                    color: Color.of(.4, .4, .4, 1)
                }),
                metal: new Material(phong_shader, {
                    ambient: 0,
                    diffusivity: 1,
                    specularity: 1,
                    color: Color.of(1, .5, 1, 1)
                }),
                metal_earth: new Material(texture_shader_2, {
                    texture: new Texture("assets/earth.gif"),
                    ambient: 0,
                    diffusivity: 1,
                    specularity: 1,
                    color: Color.of(.4, .4, .4, 1)
                }),
                black_hole: new Material(black_hole_shader),
                sun: new Material(sun_shader, {
                    ambient: 1,
                    color: Color.of(0, 0, 0, 1)
                }),
                glow: new Material(wire_shader, {
                    ambient: .8,
                    diffusivity: .5,
                    specularity: .5,
                    color: Color.of(.3, .1, .9, 1)
                }),
                water: new Material(water_shader, {
                    ambient: .8,
                    diffusivity: .5,
                    specularity: .5,
                    color: Color.of(.5, .5, .9, 1.)
                }),
            };

            this.lights_on = false;
            this.star_matrices = [];
            for (let i = 0; i < 30; i++)
                this.star_matrices.push(Mat4.rotation(Math.PI / 2 * (Math.random() - .5), Vec.of(0, 1, 0))
                    .times(Mat4.rotation(Math.PI / 2 * (Math.random() - .5), Vec.of(1, 0, 0)))
                    .times(Mat4.translation([0, 0, -150])));
        }
        make_control_panel() { // make_control_panel(): Sets up a panel of interactive HTML elements, including
            // buttons with key bindings for affecting this scene, and live info readouts.

            // TODO (#5b): Add a button control.  Provide a callback that flips the boolean value of "this.lights_on".
            // this.key_triggered_button( 
        }
        display(context, program_state) { // display():  Called once per frame of animation.  For each shape that you want to
            // appear onscreen, place a .draw() call for it inside.  Each time, pass in a
            // different matrix value to control where the shape appears.

            context.context.getExtension("OES_standard_derivatives");
            // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
            if (!context.scratchpad.controls) { // Add a movement controls panel to the page:
                this.children.push(context.scratchpad.controls = new defs.Movement_Controls());

                // Add a helper scene / child scene that allows viewing each moving body up close.
                this.children.push(this.camera_teleporter = new Camera_Teleporter());

                // Define the global camera and projection matrices, which are stored in program_state.  The camera
                // matrix follows the usual format for transforms, but with opposite values (cameras exist as 
                // inverted matrices).  The projection matrix follows an unusual format and determines how depth is 
                // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
                // orthographic() automatically generate valid matrices for one.  The input arguments of
                // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.          
                program_state.set_camera(Mat4.look_at(Vec.of(0, 10, 30), Vec.of(0, 0, 0), Vec.of(0, 1, 0)));
                this.initial_camera_location = program_state.camera_inverse;
                program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 1, 200);
            }

            // Find how much time has passed in seconds; we can use
            // time as an input when calculating new transforms:
            const t = program_state.animation_time / 1000;

            // camera gets closer each frame? 
            this.camera_teleporter.cameras = [];
            this.camera_teleporter.cameras.push(Mat4.look_at(Vec.of(0, 10, 30), Vec.of(0, 0, 0), Vec.of(0, 1, 0)));


            /**********************************
            Start coding down here!!!!
            **********************************/


            let model_transform = Mat4.identity();

            const smoothly_varying_ratio = .5 + .5 * Math.sin(2 * Math.PI * t / 10),
                sun_size = 1 + 2 * smoothly_varying_ratio,
                sun = undefined,
                sun_color = this.Colors.purple;

            this.materials.sun.color = sun_color; // Assign our current sun color to the existing sun material.          

            // *** Lights: *** Values of vector or point lights.  They'll be consulted by 
            // the shader when coloring shapes.  See Light's class definition for inputs.

            program_state.lights = [new Light(Vec.of(0, 0, 0, 1), Color.of(1, 1, 1, 1), 10000000)];

            const modifier = this.lights_on ? {
                ambient: 0.3
            } : {
                ambient: 0.0
            };

            // draw bounding box
            var saveMatrix = model_transform.copy();
            model_transform.post_multiply(Mat4.translation([0, 0, -20]));
            model_transform.post_multiply(Mat4.scale([100000, 1000000, 1]));
            // this.shapes.ball_4.draw(context, program_state, model_transform, this.materials.dynamic_plastic);

            this.shapes.background.draw(context, program_state, model_transform, this.materials.space);
            model_transform = saveMatrix.copy();


            const angle = -40 //Math.sin( t );
            const light_position = Mat4.rotation(angle, [1, 0, 0]).times(Vec.of(0, -1, 1, 0));
            program_state.lights = [new Light(light_position, Color.of(1, 1, 1, 1), 1000000000)];
            model_transform = Mat4.identity();

            model_transform = model_transform.post_multiply(Mat4.translation([0, -2, 0]));
            model_transform = model_transform.post_multiply(Mat4.scale([4, 4, 4]));
            this.shapes.record.draw(context, program_state, model_transform, this.materials.plastic.override({
                color: this.Colors.light_purple
            }));

            model_transform = model_transform.post_multiply(Mat4.translation([-.45, 0, -.45]));
            model_transform = model_transform.post_multiply(Mat4.scale([.8, .8, .8]));
            saveMatrix = model_transform.copy();
            model_transform = model_transform.post_multiply(Mat4.translation([1.05, 0, -1.05]));
            model_transform = model_transform.post_multiply(Mat4.rotation(Math.sin(t) / 100. - .05, [1, 0, 0]));
            model_transform = model_transform.post_multiply(Mat4.translation([-1.05, 0, 1.05]));
            this.shapes.spindle.draw(context, program_state, model_transform, this.materials.plastic.override({
                color: Color.of(.2, .2, .5, 1.)
            }));


            model_transform = saveMatrix.copy();
            // flower_disk 
            // model_transform = model_transform.post_multiply(Mat4.translation([-.9, -.2, .3]));
            // model_transform = model_transform.post_multiply(Mat4.rotation(t, [0, 1, 0]));
            // model_transform = model_transform.post_multiply(Mat4.scale([.5, .18, .5]));

            // sun_disk
            model_transform = model_transform.post_multiply(Mat4.translation([-.98, -.2, 0]));
            model_transform = model_transform.post_multiply(Mat4.rotation(t, [0, 1, 0]));
            model_transform = model_transform.post_multiply(Mat4.scale([1 / .75, 1 / .75, 1 / .75]));

            //this.shapes.disk.draw(context, program_state, model_transform, this.materials.plastic);
            this.shapes.disk.draw(context, program_state, model_transform, this.materials.trippy_plastic);

            model_transform = model_transform.post_multiply(Mat4.translation([0, .5, 0]));
            model_transform = Mat4.identity();
            model_transform = model_transform.post_multiply(Mat4.scale([9.6, 9.6, 9.6]));
            model_transform = model_transform.post_multiply(Mat4.translation([-.36, .4, -.85]));

            //model_transform = model_transform.post_multiply(Mat4.translation([0,-.6,-0]));
            //model_transform = model_transform.post_multiply(Mat4.rotation(Math.PI/2-Math.sin(t)/2-.5,[1,0,0]));
            //model_transform = model_transform.post_multiply(Mat4.translation([0,.6,0]));
            this.shapes.lid.draw(context, program_state, model_transform, this.materials.plastic.override({
                color: Color.of(.4, .4, .4, .3)
            }));

            //this.shapes.box.draw( context, program_state, model_transform, this.materials.plastic_stars.override( yellow ) );

            // ***** END TEST SCENE *****

            // Warning: Get rid of the test scene, or else the camera position and movement will not work.



        }
    }

const Additional_Scenes = [];

export {
    Main_Scene,
    Additional_Scenes,
    Canvas_Widget,
    Code_Widget,
    Text_Widget,
    defs
}


const Camera_Teleporter = defs.Camera_Teleporter =
    class Camera_Teleporter extends Scene { // **Camera_Teleporter** is a helper Scene meant to be added as a child to
        // your own Scene.  It adds a panel of buttons.  Any matrices externally
        // added to its "this.cameras" can be selected with these buttons. Upon
        // selection, the program_state's camera matrix slowly (smoothly)
        // linearly interpolates itself until it matches the selected matrix.
        constructor() {
            super();
            this.cameras = [];
            this.selection = 0;
        }
        make_control_panel() { // make_control_panel(): Sets up a panel of interactive HTML elements, including
            // buttons with key bindings for affecting this scene, and live info readouts.

            this.key_triggered_button("Enable", ["e"], () => this.enabled = true);
            this.key_triggered_button("Disable", ["Shift", "E"], () => this.enabled = false);
            this.new_line();
            this.key_triggered_button("Previous location", ["g"], this.decrease);
            this.key_triggered_button("Next", ["h"], this.increase);
            this.new_line();
            this.live_string(box => {
                box.textContent = "Selected camera location: " + this.selection
            });
        }
        increase() {
            this.selection = Math.min(this.selection + 1, Math.max(this.cameras.length - 1, 0));
        }
        decrease() {
            this.selection = Math.max(this.selection - 1, 0);
        } // Don't allow selection of negative indices.
        display(context, program_state) {
            const desired_camera = this.cameras[this.selection];
            if (!desired_camera || !this.enabled)
                return;
            const dt = program_state.animation_delta_time;
            program_state.set_camera(desired_camera.map((x, i) => Vec.from(program_state.camera_inverse[i]).mix(x, .01 * dt)));
        }
    }


const Planar_Star = defs.Planar_Star =
    class Planar_Star extends Shape { // **Planar_Star** defines a 2D five-pointed star shape.  The star's inner 
        // radius is 4, and its outer radius is 7.  This means the complete star 
        // fits inside a 14 by 14 sqaure, and is centered at the origin.
        constructor() {
            super("position", "normal", "texture_coord");

            this.arrays.position.push(Vec.of(0, 0, 0));
            for (let i = 0; i < 11; i++) {
                const spin = Mat4.rotation(i * 2 * Math.PI / 10, Vec.of(0, 0, -1));

                const radius = i % 2 ? 4 : 7;
                const new_point = spin.times(Vec.of(0, radius, 0, 1)).to3();

                this.arrays.position.push(new_point);
                if (i > 0)
                    this.indices.push(0, i, i + 1)
            }

            this.arrays.normal = this.arrays.position.map(p => Vec.of(0, 0, -1));

            // TODO (#5a):  Fill in some reasonable texture coordinates for the star:
            // this.arrays.texture_coord = this.arrays.position.map( p => 
        }
    }

const Gouraud_Shader = defs.Gouraud_Shader =
    class Gouraud_Shader extends defs.Phong_Shader {
        shared_glsl_code() // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {

            // **Varying variables** are passed on from the finished vertex shader to the fragment
            // shader.  A different value of a "varying" is produced for every single vertex
            // in your array.  Three vertices make each triangle, producing three distinct answers
            // of what the varying's value should be.  Each triangle produces fragments (pixels), 
            // and the per-fragment shader then runs.  Each fragment that looks up a varying 
            // variable will pull its value from the weighted average of the varying's value
            // from the three vertices of its triangle, weighted according to how close the 
            // fragment is to each extreme corner point (vertex).

            return `

      `;
        }
        vertex_glsl_code() // ********* VERTEX SHADER *********
        {
            // TODO (#6b2.2):  Copy the Phong_Shader class's implementation of this function,
            // but declare N and vertex_worldspace as vec3s local to function main,
            // since they are no longer scoped as varyings.  Then, copy over the
            // fragment shader code to the end of main() here.  Computing the Phong
            // color here instead of in the fragment shader is called Gouraud
            // Shading.  
            // Modify any lines that assign to gl_FragColor, to assign them to "color", 
            // the varying you made, instead.  You cannot assign to gl_FragColor from 
            // within the vertex shader (because it is a special variable for final
            // fragment shader color), but you can assign to varyings that will be 
            // sent as outputs to the fragment shader.

            return this.shared_glsl_code() + `
        void main()
          {
             
          } `;
        }
        fragment_glsl_code() // ********* FRAGMENT SHADER ********* 
        { // A fragment is a pixel that's overlapped by the current triangle.
            // Fragments affect the final image or get discarded due to depth.  

            // TODO (#6b2.3):  Leave the main function almost blank, except assign gl_FragColor to
            // just equal "color", the varying you made earlier.
            return this.shared_glsl_code() + `
        void main()
          {
                        
          } `;
        }
    }

const Wireframe_Shader = defs.Wireframe_Shader =
    class Wireframe_Shader extends Shader {


        send_material(gl, gpu, material) {
            // send_material(): Send the desired shape-wide material qualities to the
            // graphics card, where they will tweak the Phong lighting formula.                                      
            gl.uniform4fv(gpu.sun_color, material.color);
            gl.uniform1f(gpu.ambient, material.ambient);
            gl.uniform1f(gpu.diffusivity, material.diffusivity);

            gl.uniform1f(gpu.specularity, material.specularity);
            gl.uniform1f(gpu.smoothness, material.smoothness);
        }
        update_GPU(context, gpu_addresses, program_state, model_transform, material) {
            // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
            // pass material.color to the shader.
            const [P, C, M] = [program_state.projection_transform, program_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
            context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D(PCM.transposed()));
            context.uniform1f(gpu_addresses.time, program_state.animation_time / 1000);
            context.uniform1f(gpu_addresses.colorSent, material.color);
            const defaults = {
                color: Color.of(0, 0, 0, 1),
                ambient: 0,
                diffusivity: 1,
                specularity: 1,
                smoothness: 40
            };
            material = Object.assign({}, defaults, material);
            this.send_material(context, gpu_addresses, material);
        }
        shared_glsl_code() {
            return `                   
              #extension GL_OES_standard_derivatives : enable
              precision mediump float;
              varying highp vec3 triangle;
      `;
        }
        vertex_glsl_code() {
            return this.shared_glsl_code() + `

        uniform vec4 sun_color;
        attribute vec3 position;                            // Position is expressed in object coordinates.
        uniform mat4 projection_camera_model_transform;

        void main()
        {                    // Compute the vertex's final resting place (in NDCS), and use the hard-coded color of the vertex:
          gl_Position = projection_camera_model_transform * vec4(position,1.0);
          triangle = vec3(sun_color.r,sun_color.g,sun_color.b);
        }
      `;
        }
        fragment_glsl_code() {
            return this.shared_glsl_code() + `

              vec4 wire_color = vec4(.8,.8,.8,.4);
              vec4 fill_color = vec4(.207,.172,.137,1.);
             highp float wire_width = 1.;
              void main() {
                  if(min(min(triangle.x, triangle.y), triangle.z) < wire_width/10.0) {
                       gl_FragColor = wire_color;
                   } else {
                       gl_FragColor = fill_color;
                    }
}`;
        }

    }

const Black_Hole_Shader = defs.Black_Hole_Shader =
    class Black_Hole_Shader extends Shader // Simple "procedural" texture shader, with texture coordinates but without an input image.
{
    update_GPU(context, gpu_addresses, program_state, model_transform, material) {
        // update_GPU(): Define how to synchronize our JavaScript's variables to the GPU's.  This is where the shader 
        // recieves ALL of its inputs.  Every value the GPU wants is divided into two categories:  Values that belong
        // to individual objects being drawn (which we call "Material") and values belonging to the whole scene or 
        // program (which we call the "Program_State").  Send both a material and a program state to the shaders 
        // within this function, one data field at a time, to fully initialize the shader for a draw.

        // TODO (#EC 1b):  Send the GPU the only matrix it will need for this shader:  The product of the projection, 
        // camera, and model matrices.  The former two are found in program_state; the latter is directly 
        // available here.  Finally, pass in the animation_time from program_state. You don't need to allow
        // custom materials for this part so you don't need any values from the material object.
        // For an example of how to send variables to the GPU, check out the simple shader "Funny_Shader".

        // context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform,       
    }
    shared_glsl_code() // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    {

        return `precision mediump float;
             
      `;
    }
    vertex_glsl_code() // ********* VERTEX SHADER *********
    {

        return this.shared_glsl_code() + `

        void main()
        { 

        }`;
    }
    fragment_glsl_code() // ********* FRAGMENT SHADER *********
    {

        return this.shared_glsl_code() + `
        void main()
        { 

        }`;
    }
}


const sun_shader = defs.Sun_Shader =
    class Sun_Shader extends Shader {

        send_material(gl, gpu, material) { // send_material(): Send the desired shape-wide material qualities to the
            // graphics card, where they will tweak the Phong lighting formula.                                      
            gl.uniform4fv(gpu.sun_color, material.color);
            gl.uniform1f(gpu.ambient, material.ambient);
            gl.uniform1f(gpu.diffusivity, material.diffusivity);
            gl.uniform1f(gpu.specularity, material.specularity);
            gl.uniform1f(gpu.smoothness, material.smoothness);
        }


        update_GPU(context, gpu_addresses, program_state, model_transform, material) {
            // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
            // pass material.color to the shader.
            const [P, C, M] = [program_state.projection_transform, program_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
            context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D(PCM.transposed()));
            context.uniform1f(gpu_addresses.time, program_state.animation_time / 1000);
            context.uniform1f(gpu_addresses.sun_color, material.color);
            const defaults = {
                color: Color.of(0, 0, 0, 1),
                ambient: 0,
                diffusivity: 1,
                specularity: 1,
                smoothness: 40
            };
            material = Object.assign({}, defaults, material);
            this.send_material(context, gpu_addresses, material);
        }

        shared_glsl_code() // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {
            return `precision mediump float;
              varying vec2 f_tex_coord;
              varying float disp;
              uniform vec4 sun_color;
              varying float noise;
      `;
        }
        vertex_glsl_code() // ********* VERTEX SHADER *********
        {
            return this.shared_glsl_code() + `
       uniform mat4 modelMatrix;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat4 viewMatrix;
uniform mat3 normalMatrix;
        uniform mat4 projection_camera_model_transform;
attribute vec3 position;
attribute vec3 normal;
attribute vec2 uv;
attribute vec2 uv2;
uniform float time;
 float fireSpeed = .5;
float pulseHeight = 0.0;
float displacementHeight = .5;
float turbulenceDetail = .7;
vec3 mod289(vec3 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 mod289(vec4 x) {
  return x - floor(x * (1.0 / 289.0)) * 289.0;
}
vec4 permute(vec4 x) {
  return mod289(((x*34.0)+1.0)*x);
}
vec4 taylorInvSqrt(vec4 r) {
  return 1.79284291400159 - 0.85373472095314 * r;
}
vec3 fade(vec3 t) {
  return t*t*t*(t*(t*6.0-15.0)+10.0);
}
// Klassisk Perlin noise 
float cnoise(vec3 P) {
  vec3 Pi0 = floor(P); // indexing
  vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
  Pi0 = mod289(Pi0);
  Pi1 = mod289(Pi1);
  vec3 Pf0 = fract(P); // Fractional part for interpolation
  vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
  vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
  vec4 iy = vec4(Pi0.yy, Pi1.yy);
  vec4 iz0 = Pi0.zzzz;
  vec4 iz1 = Pi1.zzzz;
  vec4 ixy = permute(permute(ix) + iy);
  vec4 ixy0 = permute(ixy + iz0);
  vec4 ixy1 = permute(ixy + iz1);
  vec4 gx0 = ixy0 * (1.0 / 7.0);
  vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
  gx0 = fract(gx0);
  vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
  vec4 sz0 = step(gz0, vec4(0.0));
  gx0 -= sz0 * (step(0.0, gx0) - 0.5);
  gy0 -= sz0 * (step(0.0, gy0) - 0.5);
  vec4 gx1 = ixy1 * (1.0 / 7.0);
  vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
  gx1 = fract(gx1);
  vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
  vec4 sz1 = step(gz1, vec4(0.0));
  gx1 -= sz1 * (step(0.0, gx1) - 0.5);
  gy1 -= sz1 * (step(0.0, gy1) - 0.5);
  vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
  vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
  vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
  vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
  vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
  vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
  vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
  vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);
  vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
  g000 *= norm0.x;
  g010 *= norm0.y;
  g100 *= norm0.z;
  g110 *= norm0.w;
  vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
  g001 *= norm1.x;
  g011 *= norm1.y;
  g101 *= norm1.z;
  g111 *= norm1.w;
  float n000 = dot(g000, Pf0);
  float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
  float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
  float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
  float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
  float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
  float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
  float n111 = dot(g111, Pf1);
  vec3 fade_xyz = fade(Pf0);
  vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
  vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
  float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
  return 1.5 * n_xyz;
}
// Ashima code 
float turbulence( vec3 p ) {
    float t = -0.5;
    for (float f = 1.0 ; f <= 10.0 ; f++ ){
        float power = pow( 2.0, f );
        t += abs( cnoise( vec3( power * p ) ) / power );
    }
    return t;
}
void main() {
    noise = -0.8 * turbulence( turbulenceDetail * normal + ( time * .2 ) );
    
    float b = pulseHeight * cnoise(
        0.05 * position + vec3( 1.0 * time )
    );
    float displacement = ( 0.0 - displacementHeight ) * noise + b;
    disp = displacement*30.;
    vec3 newPosition = position + normal * displacement;
    gl_Position = projection_camera_model_transform * vec4( newPosition, 1.0 );
}
       `;
        }
        fragment_glsl_code() // ********* FRAGMENT SHADER *********
        {
            return this.shared_glsl_code() + `
        void main()
        { 
         vec3 color = vec3((1.-disp), (0.1-disp*0.2)+0.1, (0.1-disp*0.1)+0.1*abs(sin(disp)));
        gl_FragColor = vec4( color.rgb, 1.0 );
        gl_FragColor *= sun_color;
        }`;
        }
    }

// displacement map shader with cellular noise 
const Displacement_Shader = defs.Displacement_Shader =
    class Displacement_Shader extends Shader {

        send_material(gl, gpu, material) {
            // send_material(): Send the desired shape-wide material qualities to the
            // graphics card, where they will tweak the Phong lighting formula.                                      
            gl.uniform4fv(gpu.dynamic_color, material.color);
            gl.uniform1f(gpu.ambient, material.ambient);
            gl.uniform1f(gpu.diffusivity, material.diffusivity);
            gl.uniform1f(gpu.specularity, material.specularity);
            gl.uniform1f(gpu.smoothness, material.smoothness);
        }
        update_GPU(context, gpu_addresses, program_state, model_transform, material) {
            // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
            // pass material.color to the shader.
            const [P, C, M] = [program_state.projection_transform, program_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
            context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D(PCM.transposed()));
            context.uniform1f(gpu_addresses.time, program_state.animation_time / 1000);
            context.uniform1f(gpu_addresses.colorSent, material.color);
            const defaults = {
                color: Color.of(0, 0, 0, 1),
                ambient: 0,
                diffusivity: 1,
                specularity: 1,
                smoothness: 40
            };
            material = Object.assign({}, defaults, material);
            this.send_material(context, gpu_addresses, material);
        }

        shared_glsl_code() // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {
            return `
            precision highp float;
            varying vec2 vUv;
            varying float noise;                 
    `;
        }
        vertex_glsl_code() // ********* VERTEX SHADER *********
        {
            return this.shared_glsl_code() + `

            uniform mat4 modelMatrix;
            uniform mat4 modelViewMatrix;
            uniform mat4 projectionMatrix;
            uniform mat4 viewMatrix;
            uniform mat3 normalMatrix;
            uniform mat4 projection_camera_model_transform;
      
            vec3 mod289(vec3 x)
            {
              return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 mod289(vec4 x)
            {
              return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 permute(vec4 x)
            {
              return mod289(((x*34.0)+1.0)*x);
            }

            vec4 taylorInvSqrt(vec4 r)
            {
              return 1.79284291400159 - 0.85373472095314 * r;
            }

            vec3 fade(vec3 t) {
              return t*t*t*(t*(t*6.0-15.0)+10.0);
            }

            // Classic Perlin noise
            float cnoise(vec3 P)
            {
              vec3 Pi0 = floor(P); // Integer part for indexing
              vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
              Pi0 = mod289(Pi0);
              Pi1 = mod289(Pi1);
              vec3 Pf0 = fract(P); // Fractional part for interpolation
              vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.yy, Pi1.yy);
              vec4 iz0 = Pi0.zzzz;
              vec4 iz1 = Pi1.zzzz;

              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);

              vec4 gx0 = ixy0 * (1.0 / 7.0);
              vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
              gx0 = fract(gx0);
              vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
              vec4 sz0 = step(gz0, vec4(0.0));
              gx0 -= sz0 * (step(0.0, gx0) - 0.5);
              gy0 -= sz0 * (step(0.0, gy0) - 0.5);

              vec4 gx1 = ixy1 * (1.0 / 7.0);
              vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
              gx1 = fract(gx1);
              vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
              vec4 sz1 = step(gz1, vec4(0.0));
              gx1 -= sz1 * (step(0.0, gx1) - 0.5);
              gy1 -= sz1 * (step(0.0, gy1) - 0.5);

              vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
              vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
              vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
              vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
              vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
              vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
              vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
              vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

              vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
              g000 *= norm0.x;
              g010 *= norm0.y;
              g100 *= norm0.z;
              g110 *= norm0.w;
              vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
              g001 *= norm1.x;
              g011 *= norm1.y;
              g101 *= norm1.z;
              g111 *= norm1.w;

              float n000 = dot(g000, Pf0);
              float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
              float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
              float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
              float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
              float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
              float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
              float n111 = dot(g111, Pf1);

              vec3 fade_xyz = fade(Pf0);
              vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
              vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
              float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
              return 2.2 * n_xyz;
            }

            // Classic Perlin noise, periodic variant
            float pnoise(vec3 P, vec3 rep)
            {
              vec3 Pi0 = mod(floor(P), rep); // Integer part, modulo period
              vec3 Pi1 = mod(Pi0 + vec3(1.0), rep); // Integer part + 1, mod period
              Pi0 = mod289(Pi0);
              Pi1 = mod289(Pi1);
              vec3 Pf0 = fract(P); // Fractional part for interpolation
              vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
              vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
              vec4 iy = vec4(Pi0.yy, Pi1.yy);
              vec4 iz0 = Pi0.zzzz;
              vec4 iz1 = Pi1.zzzz;

              vec4 ixy = permute(permute(ix) + iy);
              vec4 ixy0 = permute(ixy + iz0);
              vec4 ixy1 = permute(ixy + iz1);

              vec4 gx0 = ixy0 * (1.0 / 7.0);
              vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
              gx0 = fract(gx0);
              vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
              vec4 sz0 = step(gz0, vec4(0.0));
              gx0 -= sz0 * (step(0.0, gx0) - 0.5);
              gy0 -= sz0 * (step(0.0, gy0) - 0.5);

              vec4 gx1 = ixy1 * (1.0 / 7.0);
              vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
              gx1 = fract(gx1);
              vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
              vec4 sz1 = step(gz1, vec4(0.0));
              gx1 -= sz1 * (step(0.0, gx1) - 0.5);
              gy1 -= sz1 * (step(0.0, gy1) - 0.5);

              vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
              vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
              vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
              vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
              vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
              vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
              vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
              vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

              vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
              g000 *= norm0.x;
              g010 *= norm0.y;
              g100 *= norm0.z;
              g110 *= norm0.w;
              vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
              g001 *= norm1.x;
              g011 *= norm1.y;
              g101 *= norm1.z;
              g111 *= norm1.w;

              float n000 = dot(g000, Pf0);
              float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
              float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
              float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
              float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
              float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
              float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
              float n111 = dot(g111, Pf1);

              vec3 fade_xyz = fade(Pf0);
              vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
              vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
              float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x); 
              return 2.2 * n_xyz;
            }

            attribute vec2 uv;
            attribute vec3 normal;
            attribute vec3 position;
            
          
            float turbulence( vec3 p ) {

              float w = 100.0;
              float t = -.5;
            
              for (float f = 1.0 ; f <= 10.0 ; f++ ){
                float power = pow( 2.0, f );
                t += abs( pnoise( vec3( power * p ), vec3( 10.0, 10.0, 10.0 ) ) / power );
              }
            
              return t;
            
            }
            
            void main() {
            
              vUv = uv;
            
              // get a turbulent 3d noise using the normal, normal to high freq
              noise = 10.0 *  -.10 * turbulence( .5 * normal );
              // get a 3d noise using the position, low frequency
              float b = 5.0 * pnoise( 0.05 * position, vec3( 100.0 ) );
              // compose both noises
              float displacement = - 10. * noise + b;
            
              // move the position along the normal and transform it
              vec3 newPosition = position + normal * displacement;
              gl_Position = projectionMatrix * modelViewMatrix * vec4( newPosition, 1.0 );
            
            }`;
        }
        fragment_glsl_code() // ********* FRAGMENT SHADER *********
        {
            return this.shared_glsl_code() + `
            void main() {

              // compose the colour using the UV coordinate
              // and modulate it with the noise like ambient occlusion
              vec3 color = vec3( vUv * ( 1. - 2. * noise ), 0.0 );
              gl_FragColor = vec4( color.rgb, 1.0 );
            
            } `;
        }

    }

const Water_Shader = defs.Water_Shader =
    class Water_Shader extends Shader {
        send_material(gl, gpu, material) { // send_material(): Send the desired shape-wide material qualities to the
            // graphics card, where they will tweak the Phong lighting formula.                                      
            gl.uniform4fv(gpu.color, material.color);
            gl.uniform1f(gpu.ambient, material.ambient);
            gl.uniform1f(gpu.diffusivity, material.diffusivity);
            gl.uniform1f(gpu.specularity, material.specularity);
            gl.uniform1f(gpu.smoothness, material.smoothness);
        }


        update_GPU(context, gpu_addresses, program_state, model_transform, material) {
            // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
            // pass material.color to the shader.
            const [P, C, M] = [program_state.projection_transform, program_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
            context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D(PCM.transposed()));
            context.uniform1f(gpu_addresses.time, program_state.animation_time / 1000);
            context.uniform1f(gpu_addresses.color, material.color);
            const defaults = {
                color: Color.of(0, 0, 0, 1),
                ambient: 0,
                diffusivity: 1,
                specularity: 1,
                smoothness: 40
            };
            material = Object.assign({}, defaults, material);
            this.send_material(context, gpu_addresses, material);
        }
        // TODO (#EC 2):  Complete the shaders, displacing the input sphere's vertices as
        // a fireball effect and coloring fragments according to displacement.

        shared_glsl_code() // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {
            return `
            precision highp float;
            varying vec2 vUv;
            varying vec3 vNormal;

      `;
        }
        vertex_glsl_code() // ********* VERTEX SHADER *********
        {
            return this.shared_glsl_code() + `
            attribute vec2 uv;
            attribute vec4 normal;
            attribute vec3 position;
            uniform mat4 projection_camera_model_transform;
            void main(){
              vNormal = position * normal.xyz;
              vUv = uv;
              gl_Position = projection_camera_model_transform * vec4(position,1.0);
            }

       `;
        }
        fragment_glsl_code() // ********* FRAGMENT SHADER *********
        {
            return this.shared_glsl_code() + `
        uniform vec3 color;
        uniform float time;
        float speed = .1;
        float brightness = 10.;
        float resolution = .2;

        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        // Classic Perlin noise
        float cnoise(vec3 P) {
          vec3 Pi0 = floor(P); // Integer part for indexing
          vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;

          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);

          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);

          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);

          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g011, g011)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;

          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);

          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 2.2 * n_xyz;
        }

        float surface3 ( vec3 coord ) {

            float frequency = 7.0;
            float n = 0.4;

            n -= 1.0    * abs( cnoise( coord * frequency ) );
            n -= 1.5    * abs( cnoise( coord * frequency * 4.0 ) );
            n -= 1.25   * abs( cnoise( coord * frequency * 4.0 ) );

            return clamp( n, -0.6, 1.0 );
        }

        void main( void ) {
            vec2 position = vNormal.xy * resolution;

            float n = clamp( brightness * surface3(vec3(position, time * speed)), 0.0, 1.0 );

            gl_FragColor = vec4( n * color, 1.0 );
        }
        `;
        }


    }

// rainbow shader
const Rainbow_Shader = defs.Rainbow_Shader =
    class Rainbow_Shader extends Shader {
        update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
            // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
            // pass material.color to the shader.
            const [P, C, M] = [graphics_state.projection_transform, graphics_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
            context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D(PCM.transposed()));
            context.uniform1f(gpu_addresses.animation_time, graphics_state.animation_time / 1000);
            context.uniform1f(gpu_addresses.pulseHeight, 0.2);
        }
        // TODO (#EC 2):  Complete the shaders, displacing the input sphere's vertices as
        // a fireball effect and coloring fragments according to displacement.

        shared_glsl_code() // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {
            return `precision mediump float;
                  varying float disp;
                  uniform float pulseHeight;
                  uniform float animation_time;
                  varying vec3 newPosition;
          `;
        }
        vertex_glsl_code() // ********* VERTEX SHADER *********
        {
            return this.shared_glsl_code() + `
            uniform mat4 projection_camera_model_transform;

            attribute vec3 position;
            attribute vec3 normal;

            // set based on position
            // basic noise function
            // displace vertex based on normal

            void main() {
                
                //displace disk vertices 
                //create varying amplitude based on noise
                
                newPosition = vec3( (normal.x + position.x)/1.8, pulseHeight*(normal.y + position.y) + sin(position.x*45.+ animation_time)*.1, (normal.z  + position.z)/1.8 );
                gl_Position = projection_camera_model_transform * vec4( newPosition, 1.0 );
               
            }`;
        }
        fragment_glsl_code() // ********* FRAGMENT SHADER *********
        {
            return this.shared_glsl_code() + `
            void main()
            {
              gl_FragColor = vec4( newPosition.x + .59, newPosition.y + .59, newPosition.z + .59, 1. );
            } `;
        }
    }

const Flower_Shader = defs.Flower_Shader =
    class Flower_Shader extends Shader {

        send_material(gl, gpu, material) { // send_material(): Send the desired shape-wide material qualities to the
            // graphics card, where they will tweak the Phong lighting formula.                                      
            gl.uniform4fv(gpu.sun_color, material.color);
            gl.uniform1f(gpu.ambient, material.ambient);
            gl.uniform1f(gpu.diffusivity, material.diffusivity);
            gl.uniform1f(gpu.specularity, material.specularity);
            gl.uniform1f(gpu.smoothness, material.smoothness);
        }


        update_GPU(context, gpu_addresses, program_state, model_transform, material) {
            const [P, C, M] = [program_state.projection_transform, program_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
            context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D(PCM.transposed()));
            context.uniform1f(gpu_addresses.time, program_state.animation_time / 1000);
            context.uniform1f(gpu_addresses.sun_color, material.color);
            const defaults = {
                color: Color.of(0, 0, 0, 1),
                ambient: 0,
                diffusivity: 1,
                specularity: 1,
                smoothness: 40
            };
            material = Object.assign({}, defaults, material);
            this.send_material(context, gpu_addresses, material);
        }
        // TODO (#EC 2):  Complete the shaders, displacing the input sphere's vertices as
        // a fireball effect and coloring fragments according to displacement.

        shared_glsl_code() // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {
            return `precision mediump float;
              varying vec2 f_tex_coord;
              varying float disp;
              uniform vec4 sun_color;
              varying float noise;

      `;
        }
        vertex_glsl_code() // ********* VERTEX SHADER *********
        {
            return this.shared_glsl_code() + `
        uniform mat4 modelMatrix;
        uniform mat4 modelViewMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 viewMatrix;
        uniform mat3 normalMatrix;
        uniform mat4 projection_camera_model_transform;

        attribute vec3 position;
        attribute vec3 normal;
        
        attribute vec2 uv;
        attribute vec2 uv2;

        uniform float time;
        float fireSpeed = .5;
        float pulseHeight = 0.8;
        float displacementHeight = .9;
        float turbulenceDetail = .9;

        vec3 mod289(vec3 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 mod289(vec4 x) {
          return x - floor(x * (1.0 / 289.0)) * 289.0;
        }

        vec4 permute(vec4 x) {
          return mod289(((x*34.0)+1.0)*x);
        }

        vec4 taylorInvSqrt(vec4 r) {
          return 1.79284291400159 - 0.85373472095314 * r;
        }

        vec3 fade(vec3 t) {
          return t*t*t*(t*(t*6.0-15.0)+10.0);
        }

        // Klassisk Perlin noise 
        float cnoise(vec3 P) {
          vec3 Pi0 = floor(P); // indexing
          vec3 Pi1 = Pi0 + vec3(1.0); // Integer part + 1
          Pi0 = mod289(Pi0);
          Pi1 = mod289(Pi1);
          vec3 Pf0 = fract(P); // Fractional part for interpolation
          vec3 Pf1 = Pf0 - vec3(1.0); // Fractional part - 1.0
          vec4 ix = vec4(Pi0.x, Pi1.x, Pi0.x, Pi1.x);
          vec4 iy = vec4(Pi0.yy, Pi1.yy);
          vec4 iz0 = Pi0.zzzz;
          vec4 iz1 = Pi1.zzzz;

          vec4 ixy = permute(permute(ix) + iy);
          vec4 ixy0 = permute(ixy + iz0);
          vec4 ixy1 = permute(ixy + iz1);

          vec4 gx0 = ixy0 * (1.0 / 7.0);
          vec4 gy0 = fract(floor(gx0) * (1.0 / 7.0)) - 0.5;
          gx0 = fract(gx0);
          vec4 gz0 = vec4(0.5) - abs(gx0) - abs(gy0);
          vec4 sz0 = step(gz0, vec4(0.0));
          gx0 -= sz0 * (step(0.0, gx0) - 0.5);
          gy0 -= sz0 * (step(0.0, gy0) - 0.5);

          vec4 gx1 = ixy1 * (1.0 / 7.0);
          vec4 gy1 = fract(floor(gx1) * (1.0 / 7.0)) - 0.5;
          gx1 = fract(gx1);
          vec4 gz1 = vec4(0.5) - abs(gx1) - abs(gy1);
          vec4 sz1 = step(gz1, vec4(0.0));
          gx1 -= sz1 * (step(0.0, gx1) - 0.5);
          gy1 -= sz1 * (step(0.0, gy1) - 0.5);

          vec3 g000 = vec3(gx0.x,gy0.x,gz0.x);
          vec3 g100 = vec3(gx0.y,gy0.y,gz0.y);
          vec3 g010 = vec3(gx0.z,gy0.z,gz0.z);
          vec3 g110 = vec3(gx0.w,gy0.w,gz0.w);
          vec3 g001 = vec3(gx1.x,gy1.x,gz1.x);
          vec3 g101 = vec3(gx1.y,gy1.y,gz1.y);
          vec3 g011 = vec3(gx1.z,gy1.z,gz1.z);
          vec3 g111 = vec3(gx1.w,gy1.w,gz1.w);

          vec4 norm0 = taylorInvSqrt(vec4(dot(g000, g000), dot(g010, g010), dot(g100, g100), dot(g110, g110)));
          g000 *= norm0.x;
          g010 *= norm0.y;
          g100 *= norm0.z;
          g110 *= norm0.w;
          vec4 norm1 = taylorInvSqrt(vec4(dot(g001, g001), dot(g011, g011), dot(g101, g101), dot(g111, g111)));
          g001 *= norm1.x;
          g011 *= norm1.y;
          g101 *= norm1.z;
          g111 *= norm1.w;

          float n000 = dot(g000, Pf0);
          float n100 = dot(g100, vec3(Pf1.x, Pf0.yz));
          float n010 = dot(g010, vec3(Pf0.x, Pf1.y, Pf0.z));
          float n110 = dot(g110, vec3(Pf1.xy, Pf0.z));
          float n001 = dot(g001, vec3(Pf0.xy, Pf1.z));
          float n101 = dot(g101, vec3(Pf1.x, Pf0.y, Pf1.z));
          float n011 = dot(g011, vec3(Pf0.x, Pf1.yz));
          float n111 = dot(g111, Pf1);

          vec3 fade_xyz = fade(Pf0);
          vec4 n_z = mix(vec4(n000, n100, n010, n110), vec4(n001, n101, n011, n111), fade_xyz.z);
          vec2 n_yz = mix(n_z.xy, n_z.zw, fade_xyz.y);
          float n_xyz = mix(n_yz.x, n_yz.y, fade_xyz.x);
          return 1.5 * n_xyz;
        }

      // Ashima code 
      float turbulence( vec3 p ) {
          float t = -0.5;
          for (float f = 1.0 ; f <= 10.0 ; f++ ){
              float power = pow( 2.0, f );
              t += abs( cnoise( vec3( power * p ) ) / power );
          }
          return t;
      }

      void main() {
          noise = -0.8 * turbulence( turbulenceDetail * normal + ( .1 * time ) );
          float pct = abs(sin( time ));
          float b = pulseHeight * cnoise (
              0.05 * position + vec3( 1.0  ) 
          );
          
          float displacement = ( 0.0 - displacementHeight ) * noise + b;
          disp = displacement*30.;
          vec3 stretch_displacement = 5.5 * displacement * (normal+position);
          vec3 height_displacement = 2.5 * displacement * (normal+position);
          vec3 newPosition = vec3( (stretch_displacement.x - position.y)/3., sin(height_displacement.y*abs(position.x*3.))/3., stretch_displacement.z/3.);
          gl_Position = projection_camera_model_transform * vec4( newPosition, 1.0 );
      }
       `;
        }
        fragment_glsl_code() // ********* FRAGMENT SHADER *********
        {
            return this.shared_glsl_code() + `

        void main()
        { 
          vec3 color = vec3((1.-disp), (0.1-disp*0.2)+0.1, (0.1-disp*0.1)+0.1*abs(sin(disp)));
          gl_FragColor = vec4( color.rgb, 1.0 );
          gl_FragColor *= sun_color;
        }`;
        }
    }

const trippy_shader = defs.Trippy_Shader =
    class Trippy_Shader extends Shader {

        send_material(gl, gpu, material) { // send_material(): Send the desired shape-wide material qualities to the
            // graphics card, where they will tweak the Phong lighting formula.                                      
            gl.uniform4fv(gpu.sun_color, material.color);
            gl.uniform1f(gpu.ambient, material.ambient);
            gl.uniform1f(gpu.diffusivity, material.diffusivity);
            gl.uniform1f(gpu.specularity, material.specularity);
            gl.uniform1f(gpu.smoothness, material.smoothness);
        }


        update_GPU(context, gpu_addresses, program_state, model_transform, material) {
            const [P, C, M] = [program_state.projection_transform, program_state.camera_inverse, model_transform],
            PCM = P.times(C).times(M);
            context.uniformMatrix4fv(gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D(PCM.transposed()));
            context.uniform1f(gpu_addresses.time, program_state.animation_time / 1000);
            context.uniform1f(gpu_addresses.sun_color, material.color);
            const defaults = {
                color: Color.of(0, 0, 0, 1),
                ambient: 0,
                diffusivity: 1,
                specularity: 1,
                smoothness: 40
            };
            material = Object.assign({}, defaults, material);
            this.send_material(context, gpu_addresses, material);
        }
        // TODO (#EC 2):  Complete the shaders, displacing the input sphere's vertices as
        // a fireball effect and coloring fragments according to displacement.

        shared_glsl_code() // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
        {
            return `precision mediump float;
              varying vec2 f_tex_coord;
              varying float disp;
              uniform vec4 sun_color;
              uniform float time;
              varying float noise;
            
              uniform mat4 projection_camera_model_transform;

      `;
        }
        vertex_glsl_code() // ********* VERTEX SHADER *********
        {
            return this.shared_glsl_code() + `

            attribute vec3 position;
            attribute vec3 normal;

            void main() { 

                gl_Position = projection_camera_model_transform * vec4(position, 1.);

            }
            
       `;
        }
        fragment_glsl_code() // ********* FRAGMENT SHADER ONLY *********
        {
            return this.shared_glsl_code() + `

           
            vec2 random2( vec2 p ) {
                return fract(sin(vec2(dot(p,vec2(127.1,311.7)),dot(p,vec2(269.5,183.3))))*43758.5453);
            }

            void main() { 
                vec2 u_resolution = vec2( 50.,50.); //dimensions of cell space
                vec2 st = gl_FragCoord.xy/u_resolution.xy;
                st.x *= u_resolution.x/u_resolution.y; //ratio
                vec3 color = vec3(0.);
            
            
                // Tile the space
                vec2 i_st = floor(st);
                vec2 f_st = fract(st);
            
                float m_dist = 1.;  // minimun distance
            
                for (int y= -1; y <= 1; y++) {
                    for (int x= -1; x <= 1; x++) {
                        // Neighbor place in the grid
                        vec2 neighbor = vec2(float(x),float(y));
            
                        // Random position from current + neighbor place in the grid
                        vec2 point = random2(i_st + neighbor);
            
                        // Animate the point
                        point = 0.5 + 0.5*sin(time + 6.2831*point);
            
                        // Vector between the pixel and the point
                        vec2 diff = neighbor + point - f_st;
            
                        // Distance to the point
                        float dist = length(diff);
            
                        // Keep the closer distance
                        m_dist = min(m_dist, dist);
                    }
                }
            
                // Draw the min distance (distance field)
                color += m_dist;
            
                // Draw cell center
                color += 1.-step(.02, m_dist);
            
                // Draw grid
                //color.r += step(.98, f_st.x) + step(.98, f_st.y);
            
                // Show isolines
                color -= step(.7,abs(sin(27.0*m_dist)))*.5;
            
                gl_FragColor = sun_color *vec4(color, 1.);
            
            }`;
        }
    }