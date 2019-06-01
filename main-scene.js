import {
    tiny,
    defs
} from './assignment-4-resources.js';

import { Key_Board } from './key-board.js';
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

            // *** Shapes in the scene ***
            this.shapes = {
                'record': new defs.Shape_From_File("assets/mainRecordPlayer.obj"),
                'disk': new defs.Shape_From_File("assets/disk.obj"),
            };
            
            // key_board that messes with object attributes
            // changes this.modifiers 
            const key_board = new Key_Board;
            window.addEventListener("keydown", key_board.handleKey);

            this.modifiers = { 

              // material : modifier obj

            } // object modifiers 

            // *** Shaders ***
            const phong_shader = new defs.Phong_Shader(2);
            const texture_shader = new defs.Textured_Phong(2);
            // texture that interacts with light
            const texture_shader_2 = new defs.Fake_Bump_Map(2);
            // A simple gouraud
            const gouraud_shader = new Gouraud_Shader(2);
            
            const black_hole_shader = new Black_Hole_Shader();
            const sun_shader = new Sun_Shader();
            const wire_shader = new Wireframe_Shader();
            const funny_shader = new defs.Funny_Shader();

            // *** Pastel Colors *** 
            this.colors = { 

            }


            // *** Materials: *** wrap a dictionary of "options" for a shader.

            this.materials = {
                plastic: new Material(phong_shader, {
                    ambient: 0,
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
                    ambient: .7,
                    diffusivity: 1,
                    specularity: 1,
                    color: Color.of(1, 1, 1, 1)
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
                glow: new Material(phong_shader, {
                    ambient: .8,
                    diffusivity: .5,
                    specularity: .5,
                    color: Color.of(.5, .1, .7, 1)
                }),
            };

            // Some setup code that tracks whether the "lights are on" (the stars), and also
            // stores 30 random location matrices for drawing stars behind the solar system:
            this.lights_on = false;
            // this.star_matrices = [];
            // for (let i = 0; i < 30; i++)
            //     this.star_matrices.push(Mat4.rotation(Math.PI / 2 * (Math.random() - .5), Vec.of(0, 1, 0))
            //         .times(Mat4.rotation(Math.PI / 2 * (Math.random() - .5), Vec.of(1, 0, 0)))
            //         .times(Mat4.translation([0, 0, -150])));
        }

        applyModifiers() { 
          // applyModifiers to materials
        }
        
        // animate
        display(context, program_state) { 
          // display():  Called once per frame of animation. 

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
                program_state.set_camera(Mat4.look_at(Vec.of(0, 10, 20), Vec.of(0, 0, 0), Vec.of(0, 1, 0)));
                this.initial_camera_location = program_state.camera_inverse;
                program_state.projection_transform = Mat4.perspective(Math.PI / 4, context.width / context.height, 1, 200);
            }

            // Find how much time has passed in seconds; we can use
            // time as an input when calculating new transforms:
            const t = program_state.animation_time / 1000;

            // Have to reset this for each frame:
            this.camera_teleporter.cameras = [];
            this.camera_teleporter.cameras.push(Mat4.look_at(Vec.of(0, 10, 20), Vec.of(0, 0, 0), Vec.of(0, 1, 0)));                                                

            applyModifiers();

            // Variable model_transform will be a local matrix value that helps us position shapes.
            // It starts over as the identity every single frame - coordinate axes at the origin.
            let model_transform = Mat4.identity();

            // TODO (#3b):  Use the time-varying value of sun_size to create a scale matrix 
            // for the sun. Also use it to create a color that turns redder as sun_size
            // increases, and bluer as it decreases.
            const smoothly_varying_ratio = .5 + .5 * Math.sin(2 * Math.PI * t / 10),
                sun_size = 1 + 2 * smoothly_varying_ratio,
                sun = undefined,
                sun_color = undefined;

            this.materials.sun.color = sun_color; // Assign our current sun color to the existing sun material.          

            // TODO (#5c):  Throughout your program whenever you use a material (by passing it into draw),
            // pass in a modified version instead.  Call override.( modifier ) on the material to
            // generate a new one that uses the below modifier, replacing the ambient term with a 
            // new value based on our light switch.             

            const modifier = this.lights_on ? {
                ambient: 0.3
            } : {
                ambient: 0.0
            };

            // draw camera
            program_state.set_camera(Mat4.look_at(Vec.of(0, 5, 0), Vec.of(0, 0, 0), Vec.of(0, 0, -1)));

            // light
            const angle = Math.sin(Math.PI/3);
            const light_position = Mat4.rotation(angle, [1, 0, 0]).times(Vec.of(0, -1, 1, 0));
            program_state.lights = [new Light(light_position, Color.of(1, 1, 1, 1), Math.pow(10, 1.5))];
            
            // draw shapes
            model_transform.post_multiply( Mat4.translation([ 0, -4, 0 ]) );
            //make disk drop onto the record player
            this.shapes.record.draw(context, program_state, model_transform, this.materials.glow);

            model_transform.post_multiply( Mat4.translation([-1, 0, 0]))
            this.shapes.disk.draw(context, program_state, model_transform, this.materials.metal);
            
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
            // TODO (#6b2.1):  Copy the Phong_Shader class's implementation of this function, but
            // change the two "varying" vec3s declared in it to just one vec4, called color.
            // REMEMBER:
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
        update_GPU(context, gpu_addresses, program_state, model_transform, material) {

        }
        shared_glsl_code() {
            return `precision highp float;
      `;
        }
        vertex_glsl_code() {
            return this.shared_glsl_code() + `
              attribute vec4 position;
              attribute vec3 color;
              uniform mat4 modelViewProjection;
              varying highp vec3 triangle;
              void main(void) {
                  triangle = color;
                  gl_Position = modelViewProjection * position;
      }`;
        }
        fragment_glsl_code() {
            return this.shared_glsl_code() + `
             #extension GL_OES_standard_derivatives : enable
              //vec4 wire_color = vec4(.5,.5,.5,1);
              //vec4 fill_color = vec4(1,1,1,1);
              //highp float wire_width = 1.2;
              //varying highp vec3 triangle;
              void main() {
                  //highp vec3 d = fwidth(triangle);
                  //highp vec3 tdist = smoothstep(vec3(0.0), d*wire_width, triangle);
                  //gl_FragColor = mix(wire_color, fill_color, min(min(tdist.x, tdist.y), tdist.z));
                  gl_FragColor = vec4(.9,.9,.9,.9);
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


// displacement map shader
const Bumpy_Shader = defs.Bumpy_Shader = 
  class Bumpy_Shader extends Shader { 

      update_GPU(context, gpu_addresses, program_state, model_transform, material) {


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

      } `;
      }

  }

const Sun_Shader = defs.Sun_Shader =
    class Sun_Shader extends Shader {
        update_GPU(context, gpu_addresses, graphics_state, model_transform, material) {
            // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
            // pass material.color to the shader.


        }
        // TODO (#EC 2):  Complete the shaders, displacing the input sphere's vertices as
        // a fireball effect and coloring fragments according to displacement.

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

        } `;
        }
    }