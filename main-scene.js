import {tiny, defs} from './assignment-4-resources.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base } = defs;

    // Now we have loaded everything in the files tiny-graphics.js, tiny-graphics-widgets.js, and assignment-4-resources.js.
    // This yielded "tiny", an object wrapping the stuff in the first two files, and "defs" for wrapping all the rest.

// (Can define Main_Scene's class here)

const Main_Scene =
class Solar_System extends Scene
{                                             // **Solar_System**:  Your Assingment's Scene.
  constructor()
    {                  // constructor(): Scenes begin by populating initial values like the Shapes and Materials they'll need.
      super();
                                                        // At the beginning of our program, load one of each of these shape 
                                                        // definitions onto the GPU.  NOTE:  Only do this ONCE per shape.
                                                        // Don't define blueprints for shapes in display() every frame.

                                                // TODO (#1):  Complete this list with any additional shapes you need.
       const Flat_Obj = defs.Shape_From_File.prototype.make_flat_shaded_version();
       this.shapes = { 'box' : new Cube(),
                   'ball_4' : new Subdivision_Sphere( 4 ),
                     'star' : new Planar_Star(),
                    //'record': new defs.Shape_From_File("assets/mainRecordPlayer.obj"),
                    'record': new Flat_Obj("assets/mainRecordPlayer.obj"),
                   'spindle': new defs.Shape_From_File("assets/spindle.obj"),
                    'disk': new defs.Shape_From_File("assets/disk.obj"),
                     'lid': new defs.Shape_From_File("assets/lid.obj"),
                     };
    //this.shapes.push({ 'record': new Flat_Obj("assets/mainRecordPlayer.obj")});

                                                        // TODO (#1d): Modify one sphere shape's existing texture 
                                                        // coordinates in place.  Multiply them all by 5.
      // this.shapes.ball_repeat.arrays.texture_coord.forEach( coord => coord
      
                                                              // *** Shaders ***

                                                              // NOTE: The 2 in each shader argument refers to the max
                                                              // number of lights, which must be known at compile time.
                                                              
                                                              // A simple Phong_Blinn shader without textures:
      const phong_shader      = new defs.Phong_Shader  (2);
                                                              // Adding textures to the previous shader:
      const texture_shader    = new defs.Textured_Phong(2);
                                                              // Same thing, but with a trick to make the textures 
                                                              // seemingly interact with the lights:
      const texture_shader_2  = new defs.Fake_Bump_Map (2);
                                                              // A Simple Gouraud Shader that you will implement:
      const gouraud_shader    = new Gouraud_Shader     (2);
                                                              // Extra credit shaders:
      const black_hole_shader = new Black_Hole_Shader();
      const sun_shader        = new Sun_Shader();
      const wire_shader = new Wireframe_Shader();
      const funny_shader = new defs.Funny_Shader();
      const water_shader = new Water_Shader();
      //cloud_shader is the better water 
      const cloud_shader = new Cloud_Shader();
      const toon_shader = new Toon_Shader();
      const wood_shader = new Wood_Shader();
      const fire_shader = new Fire_Shader();

                                              // *** Materials: *** wrap a dictionary of "options" for a shader.

                                              // TODO (#2):  Complete this list with any additional materials you need:

      this.materials = { plastic: new Material( phong_shader, 
                                    { ambient: 0, diffusivity: .5, specularity: .1, color: Color.of( 1,.5,1,1 ) } ),
                   plastic_stars: new Material( texture_shader_2,    
                                    { texture: new Texture( "assets/stars.png" ),
                                      ambient: 0, diffusivity: 1, specularity: 0, color: Color.of( .4,.4,.4,1 ) } ),
                           metal: new Material( phong_shader,
                                    { ambient: 0, diffusivity: 1, specularity: 1, color: Color.of( 1,.5,1,1 ) } ),
                     metal_earth: new Material( texture_shader_2,    
                                    { texture: new Texture( "assets/earth.gif" ),
                                      ambient: 0, diffusivity: 1, specularity: 1, color: Color.of( .4,.4,.4,1 ) } ),
                      black_hole: new Material( black_hole_shader ),
                             sun: new Material( sun_shader, { ambient: 1, color: Color.of( 0,0,0,1 ) } ),
                             glow: new Material(wire_shader, {ambient: .8, diffusivity: .5, specularity: .5, color: Color.of(.3,.1,.9,1)}),
                             water: new Material(water_shader, {ambient:.8,diffusivity:.5,specularity:.5, color: Color.of(.5,.5,.9,1.)}),
                             wood: new Material(wood_shader, { ambient: 1., diffusivity: .5, specularity:.5}),
                     betterWater: new Material(cloud_shader,{ambient:1, diffusivity:.5,specularity:.5, color: Color.of(.5,.5,.5,1.)}),
                            toon: new Material(toon_shader,{ambient:1, diffusivity:.5,specularity:.5, color: Color.of(.5,.5,.5,1.)}),
                            fire: new Material(fire_shader,{ambient:1, diffusivity:.5,specularity:.5, color: Color.of(.5,.5,.5,1.)}),

                       };

                                  // Some setup code that tracks whether the "lights are on" (the stars), and also
                                  // stores 30 random location matrices for drawing stars behind the solar system:
      this.lights_on = false;
      this.star_matrices = [];
      for( let i=0; i<30; i++ )
        this.star_matrices.push( Mat4.rotation( Math.PI/2 * (Math.random()-.5), Vec.of( 0,1,0 ) )
                         .times( Mat4.rotation( Math.PI/2 * (Math.random()-.5), Vec.of( 1,0,0 ) ) )
                         .times( Mat4.translation([ 0,0,-150 ]) ) );
    }
  make_control_panel()
    {                                 // make_control_panel(): Sets up a panel of interactive HTML elements, including
                                      // buttons with key bindings for affecting this scene, and live info readouts.

                                 // TODO (#5b): Add a button control.  Provide a callback that flips the boolean value of "this.lights_on".
       // this.key_triggered_button( 
    }
  display( context, program_state )
    {                                                // display():  Called once per frame of animation.  For each shape that you want to
                                                     // appear onscreen, place a .draw() call for it inside.  Each time, pass in a
                                                     // different matrix value to control where the shape appears.
     context.context.getExtension( "OES_standard_derivatives" );
                           // Setup -- This part sets up the scene's overall camera matrix, projection matrix, and lights:
      if( !context.scratchpad.controls ) 
        {                       // Add a movement controls panel to the page:
          this.children.push( context.scratchpad.controls = new defs.Movement_Controls() ); 

                                // Add a helper scene / child scene that allows viewing each moving body up close.
          this.children.push( this.camera_teleporter = new Camera_Teleporter() );

                    // Define the global camera and projection matrices, which are stored in program_state.  The camera
                    // matrix follows the usual format for transforms, but with opposite values (cameras exist as 
                    // inverted matrices).  The projection matrix follows an unusual format and determines how depth is 
                    // treated when projecting 3D points onto a plane.  The Mat4 functions perspective() and
                    // orthographic() automatically generate valid matrices for one.  The input arguments of
                    // perspective() are field of view, aspect ratio, and distances to the near plane and far plane.          
          program_state.set_camera( Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) ) );
          this.initial_camera_location = program_state.camera_inverse;
          program_state.projection_transform = Mat4.perspective( Math.PI/4, context.width/context.height, 1, 200 );
        }

                                                                      // Find how much time has passed in seconds; we can use
                                                                      // time as an input when calculating new transforms:
      const t = program_state.animation_time / 1000;

                                                  // Have to reset this for each frame:
      this.camera_teleporter.cameras = [];
      this.camera_teleporter.cameras.push( Mat4.look_at( Vec.of( 0,10,20 ), Vec.of( 0,0,0 ), Vec.of( 0,1,0 ) ) );


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


      /**********************************
      Start coding down here!!!!
      **********************************/         

      const blue = Color.of( 0,0,.5,1 ), yellow = Color.of( .5,.5,0,1 );

                                    // Variable model_transform will be a local matrix value that helps us position shapes.
                                    // It starts over as the identity every single frame - coordinate axes at the origin.
      let model_transform = Mat4.identity();

                                                  // TODO (#3b):  Use the time-varying value of sun_size to create a scale matrix 
                                                  // for the sun. Also use it to create a color that turns redder as sun_size
                                                  // increases, and bluer as it decreases.
      const smoothly_varying_ratio = .5 + .5 * Math.sin( 2 * Math.PI * t/10 ),
            sun_size = 1 + 2 * smoothly_varying_ratio,
                 sun = undefined,
           sun_color = undefined;

      this.materials.sun.color = sun_color;     // Assign our current sun color to the existing sun material.          

                                                // *** Lights: *** Values of vector or point lights.  They'll be consulted by 
                                                // the shader when coloring shapes.  See Light's class definition for inputs.

                                                // TODO (#3c):  Replace with a point light located at the origin, with the sun's color
                                                // (created above).  For the third argument pass in the point light's size.  Use
                                                // 10 to the power of sun_size.
      program_state.lights = [ new Light( Vec.of( 0,0,0,1 ), Color.of( 1,1,1,1 ), 100000 ) ];

                            // TODO (#5c):  Throughout your program whenever you use a material (by passing it into draw),
                            // pass in a modified version instead.  Call .override( modifier ) on the material to
                            // generate a new one that uses the below modifier, replacing the ambient term with a 
                            // new value based on our light switch.                         
      const modifier = this.lights_on ? { ambient: 0.3 } : { ambient: 0.0 };

                                                // TODO (#3d):   Draw the sun using its matrix (crated by you above) and material.
     
                                                // TODO (#4d1):  Draw planet 1 orbiting at 5 units radius, revolving AND rotating at 1 radian/sec.
      
                                                // TODO (#4d2):  Draw planet 2 orbiting 3 units farther, revolving AND rotating slower.
      
                                                // TODO (#6b1):  Draw moon 1 orbiting 2 units away from planet 2, revolving AND rotating.
      
                                                // TODO (#4d3):  Draw planet 3 orbiting 3 units farther, revolving AND rotating slower.
      
                                                // TODO (#6b2):  Draw moon 2 orbiting 2 units away from planet 3, revolving AND rotating.
     
                                                // TODO (#4d4):  Draw planet 4
      
                                                // TODO (#4d5):  Draw planet 5
      
                                                // TODO (#5a): If the light switch is on, loop through star_matrices and draw 2D stars.
      
                                                // TODO (#7b): Give the child scene (camera_teleporter) the *inverted* matrices
                                                // for each of your objects, mimicking the examples above.  Tweak each
                                                // matrix a bit so you can see the planet, or maybe appear to be standing
                                                // on it.  Remember the moons.
      // this.camera_teleporter.cameras.push( Mat4.inverse( 




      // ***** BEGIN TEST SCENE *****               
                                          // TODO:  Delete (or comment out) the rest of display(), starting here:

     // program_state.set_camera( Mat4.translation([ 0,0,-10 ]) );
      const angle = -40//Math.sin( t );
      const light_position = Mat4.rotation( angle, [ 1,0,0 ] ).times( Vec.of( 0,-1,1,0 ) );
      var lightPos = Color.of(light_position.x,light_position.y, light_position.z, 1.0);
      program_state.lights = [ new Light( light_position, Color.of( 1,1,1,1 ), 1000000000 ) ];
      model_transform = Mat4.identity();
      //this.shapes.box.draw( context, program_state, model_transform, this.materials.plastic.override( yellow ) );
      //model_transform.post_multiply( Mat4.translation([ 0, -4, 0 ]) );
      //this.shapes.ball_4.draw( context, program_state, model_transform, this.materials.metal_earth.override( blue ) );
      model_transform = model_transform.post_multiply(Mat4.translation([0,-2,0]));
      model_transform = model_transform.post_multiply(Mat4.scale([4,4,4]));
      this.shapes.record.draw(context, program_state, model_transform, this.materials.wood.override({color:Color.of(0.2666666667,0.168627451,0.09019607843,1.)}));
      model_transform = model_transform.post_multiply(Mat4.translation([-.45,0,-.45]));
      model_transform = model_transform.post_multiply(Mat4.scale([.8,.8,.8]));
      var saveMatrix = model_transform.copy();
      model_transform = model_transform.post_multiply(Mat4.translation([1.05,0,-1.05]));
      model_transform = model_transform.post_multiply(Mat4.rotation(Math.sin(t)/100.-.05,[1,0,0]));
      model_transform = model_transform.post_multiply(Mat4.translation([-1.05,.05,1.05]));
      this.shapes.spindle.draw(context, program_state, model_transform, this.materials.toon.override({color: Color.of(.1,.5,.5,1.)}));
      model_transform = saveMatrix.copy();
      model_transform = model_transform.post_multiply(Mat4.scale([1/.75,1/.75,1/.75]));
      model_transform = model_transform.post_multiply(Mat4.translation([-.72,-.15,0]));
      //model_transform = model_transform.post_multiply(Mat4.scale([2,2,2]));
     // this.shapes.ball_4.draw(context, program_state, model_transform, this.materials.water.override({color:Color.of(.2,.5,.5,.9)}));
     model_transform = model_transform.post_multiply(Mat4.rotation(t*2,[0,1,0]));
      this.shapes.disk.draw(context, program_state, model_transform, this.materials.betterWater.override({color: Color.of(.2588,.8431,.9568,1)}));
      model_transform = model_transform.post_multiply(Mat4.translation([0,.5,0]));
      model_transform = Mat4.identity();
      model_transform = model_transform.post_multiply(Mat4.scale([9.6,9.6,9.6]));
      model_transform = model_transform.post_multiply(Mat4.translation([-.36,.4,-.85]));

      //model_transform = model_transform.post_multiply(Mat4.translation([0,-.6,-0]));
      //model_transform = model_transform.post_multiply(Mat4.rotation(Math.PI/2-Math.sin(t)/2-.5,[1,0,0]));
      //model_transform = model_transform.post_multiply(Mat4.translation([0,.6,0]));
      this.shapes.lid.draw(context, program_state, model_transform, this.materials.plastic.override({color:Color.of(.4,.4,.4,.5)}));

      //this.shapes.box.draw( context, program_state, model_transform, this.materials.plastic_stars.override( yellow ) );

      // ***** END TEST SCENE *****

      // Warning: Get rid of the test scene, or else the camera position and movement will not work.



    }
}

const Additional_Scenes = [];

export { Main_Scene, Additional_Scenes, Canvas_Widget, Code_Widget, Text_Widget, defs }


const Camera_Teleporter = defs.Camera_Teleporter =
class Camera_Teleporter extends Scene
{                               // **Camera_Teleporter** is a helper Scene meant to be added as a child to
                                // your own Scene.  It adds a panel of buttons.  Any matrices externally
                                // added to its "this.cameras" can be selected with these buttons. Upon
                                // selection, the program_state's camera matrix slowly (smoothly)
                                // linearly interpolates itself until it matches the selected matrix.
  constructor() 
    { super();
      this.cameras = [];
      this.selection = 0;
    }
  make_control_panel()
    {                                // make_control_panel(): Sets up a panel of interactive HTML elements, including
                                     // buttons with key bindings for affecting this scene, and live info readouts.
      
      this.key_triggered_button(  "Enable",       [ "e" ], () => this.enabled = true  );
      this.key_triggered_button( "Disable", [ "Shift", "E" ], () => this.enabled = false );
      this.new_line();
      this.key_triggered_button( "Previous location", [ "g" ], this.decrease );
      this.key_triggered_button(              "Next", [ "h" ], this.increase );
      this.new_line();
      this.live_string( box => { box.textContent = "Selected camera location: " + this.selection } );
    }  
  increase() { this.selection = Math.min( this.selection + 1, Math.max( this.cameras.length-1, 0 ) ); }
  decrease() { this.selection = Math.max( this.selection - 1, 0 ); }   // Don't allow selection of negative indices.
  display( context, program_state )
  {
    const desired_camera = this.cameras[ this.selection ];
    if( !desired_camera || !this.enabled )
      return;
    const dt = program_state.animation_delta_time;
    program_state.set_camera( desired_camera.map( (x,i) => Vec.from( program_state.camera_inverse[i] ).mix( x, .01*dt ) ) );    
  }
}


const Planar_Star = defs.Planar_Star =
class Planar_Star extends Shape
{                                 // **Planar_Star** defines a 2D five-pointed star shape.  The star's inner 
                                  // radius is 4, and its outer radius is 7.  This means the complete star 
                                  // fits inside a 14 by 14 sqaure, and is centered at the origin.
  constructor()
    { super( "position", "normal", "texture_coord" );
                    
      this.arrays.position.push( Vec.of( 0,0,0 ) );
      for( let i = 0; i < 11; i++ )
        {
          const spin = Mat4.rotation( i * 2*Math.PI/10, Vec.of( 0,0,-1 ) );

          const radius = i%2 ? 4 : 7;
          const new_point = spin.times( Vec.of( 0,radius,0,1 ) ).to3();

          this.arrays.position.push( new_point );
          if( i > 0 )
            this.indices.push( 0, i, i+1 )
        }         
                 
      this.arrays.normal        = this.arrays.position.map( p => Vec.of( 0,0,-1 ) );

                                      // TODO (#5a):  Fill in some reasonable texture coordinates for the star:
      // this.arrays.texture_coord = this.arrays.position.map( p => 
    }
}

const Gouraud_Shader = defs.Gouraud_Shader =
class Gouraud_Shader extends defs.Phong_Shader
{ 
  shared_glsl_code()           // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
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

      ` ;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
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
             
          } ` ;
    }
  fragment_glsl_code()         // ********* FRAGMENT SHADER ********* 
    {                          // A fragment is a pixel that's overlapped by the current triangle.
                               // Fragments affect the final image or get discarded due to depth.  

                               // TODO (#6b2.3):  Leave the main function almost blank, except assign gl_FragColor to
                               // just equal "color", the varying you made earlier.
      return this.shared_glsl_code() + `
        void main()
          {
                        
          } ` ;
    }
}

const Wireframe_Shader = defs.Wireframe_Shader = 
class Wireframe_Shader extends Shader{


  send_material( gl, gpu, material )
    {                                       // send_material(): Send the desired shape-wide material qualities to the
                                            // graphics card, where they will tweak the Phong lighting formula.                                      
      gl.uniform4fv( gpu.sun_color,    material.color       );
      gl.uniform1f ( gpu.ambient,        material.ambient     );
      gl.uniform1f ( gpu.diffusivity,    material.diffusivity );
      gl.uniform1f ( gpu.specularity,    material.specularity );
      gl.uniform1f ( gpu.smoothness,     material.smoothness  );
    }
  update_GPU( context, gpu_addresses, program_state, model_transform, material )
    {
                      // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
                      // pass material.color to the shader.
     const [ P, C, M ] = [ program_state.projection_transform, program_state.camera_inverse, model_transform ],
                      PCM = P.times( C ).times( M );
        context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D( PCM.transposed() ) );
        context.uniform1f ( gpu_addresses.time, program_state.animation_time / 1000 );  
        context.uniform1f(gpu_addresses.colorSent, material.color);  
        const defaults = { color: Color.of( 0,0,0,1 ), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40 };
        material = Object.assign( {}, defaults, material );
        this.send_material ( context, gpu_addresses, material );
    }
  shared_glsl_code(){
    return `                   
              #extension GL_OES_standard_derivatives : enable
              precision mediump float;
              varying highp vec3 triangle;
      `;
  }
  vertex_glsl_code(){
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
  fragment_glsl_code(){
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
class Black_Hole_Shader extends Shader         // Simple "procedural" texture shader, with texture coordinates but without an input image.
{ update_GPU( context, gpu_addresses, program_state, model_transform, material )
      { 
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
  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { 
                  // TODO (#EC 1c):  For both shaders, declare a varying vec2 to pass a texture coordinate between
                  // your shaders.  Also make sure both shaders have an animation_time input (a uniform).
      return `precision mediump float;
             
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    {
                          // TODO (#EC 1d,e):  Create the final "gl_Position" value of each vertex based on a displacement
                          // function.  Also pass your texture coordinate to the next shader.  As inputs,
                          // you have the current vertex's stored position and texture coord, animation time,
                          // and the final product of the projection, camera, and model matrices.
      return this.shared_glsl_code() + `

        void main()
        { 

        }`;
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { 
                          // TODO (#EC 1f):  Using the input UV texture coordinates and animation time,
                          // calculate a color that makes moving waves as V increases.  Store
                          // the result in gl_FragColor.
      return this.shared_glsl_code() + `
        void main()
        { 

        }`;
    }
}


const Water_Shader = defs.Water_Shader = 
class Water_Shader extends Shader{
  send_material( gl, gpu, material )
    {                                       // send_material(): Send the desired shape-wide material qualities to the
                                            // graphics card, where they will tweak the Phong lighting formula.                                      
      gl.uniform4fv( gpu.color,    material.color       );
      gl.uniform1f ( gpu.ambient,        material.ambient     );
      gl.uniform1f ( gpu.diffusivity,    material.diffusivity );
      gl.uniform1f ( gpu.specularity,    material.specularity );
      gl.uniform1f ( gpu.smoothness,     material.smoothness  );
    }


update_GPU( context, gpu_addresses, program_state, model_transform, material )
    {
                      // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
                      // pass material.color to the shader.
     const [ P, C, M ] = [ program_state.projection_transform, program_state.camera_inverse, model_transform ],
                      PCM = P.times( C ).times( M );
        context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D( PCM.transposed() ) );
        context.uniform1f ( gpu_addresses.time, program_state.animation_time / 1000 );  
        //context.uniform1f(gpu_addresses.color, material.color);  
        const defaults = { color: Color.of( 0,0,0,1 ), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40 };
        material = Object.assign( {}, defaults, material );
        this.send_material ( context, gpu_addresses, material );
    }
                                // TODO (#EC 2):  Complete the shaders, displacing the input sphere's vertices as
                                // a fireball effect and coloring fragments according to displacement.

  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `
            precision highp float;
            varying vec2 vUv;
            varying vec3 vPosition;
            varying float colorTransfer;
            float brightness = 22.;
            vec2 uvScale = vec2(.06,.06);
            uniform float time;
            float xScale = 1.;
            float yScale = 1.;
            float speed = .01;
            vec3 dotColor = vec3(.0549,.5921568,.7549019);
            vec3 baseColor = vec3(0.898039, 0.1568,.317);

            varying vec2 f_tex_coord;
              varying float disp;
              uniform vec4 sun_color;
              varying float noise;


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
      #define PI 3.141592653589793238462643383279

      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    {  return this.shared_glsl_code() + `
      attribute vec2 texture_coord;
      attribute vec3 position;
      uniform mat4 projection_camera_model_transform;
      float turbulence( vec3 p ) {
          float t = -0.5;
          for (float f = 1.0 ; f <= 10.0 ; f++ ){
              float power = pow( 2.0, f );
              t += abs( cnoise( vec3( power * p ) ) / power );
          }
          return t;
      }
       float fireSpeed = .5;
      float pulseHeight = 0.0;
      float displacementHeight = .5;
      float turbulenceDetail = .7;
      attribute vec3 normal;
      attribute vec2 uv;
      attribute vec2 uv2;

     // void main() {
       //   noise = -0.8 * turbulence( turbulenceDetail * normal + ( time * .2 ) );

         // float b = pulseHeight * cnoise(
           //   0.05 * position + vec3( 1.0 * time )
          //);
          //float displacement = ( 0.0 - displacementHeight ) * noise + b;
          //float disp = displacement*30.;
          //vec3 newPosition = position + normal * displacement;
          //gl_Position = projection_camera_model_transform * vec4( newPosition, 1.0 );
      //}

        void main(){
          //vPosition = position;
          vUv = vec2((pow(position.x,1.)), pow(position.z,1.))/2.;
          vec2 uvMax = ( 2.0 * asin( sin( 2.0 * PI * vUv ) ) ) / PI;
    
          float n = surface3(vec3(uvMax * uvScale, time * speed));

           vec3 s = vec3( clamp( n, 0.0, 1.0 ) ) * dotColor * brightness;
           float mag = sqrt(s.x*s.x+s.y*s.y+s.z*s.z);
          vec4 newPosition = vec4(position.x, position.y*mag/5. + position.y,position.z, 1.0);
          gl_Position = projection_camera_model_transform*newPosition;



          //vec2 positionBoi = vUv;
          //float offset = time*speed;
          //float a = sin(3.14 * xScale  * positionBoi.x + offset) + cos(3.14 * 50.0 * positionBoi.y);
	      //float b = sin(3.14 * xScale * 5.0 * positionBoi.x) * 1.0;
	      //float c = sin(3.14 * yScale * position.y + offset * 5.0) + cos(3.14 * 50.0 * positionBoi.x);
	      //float d = sin(3.14 * yScale * 4.0 * positionBoi.y + offset * 1.0);
	      //float color = a+b+c+d;
          //vec3 newPosition = vec3(position.x, position.y*color, position.z);
          //colorTransfer = color*position.y;
          //gl_Position = projection_camera_model_transform * vec4(newPosition,1.0);
        }
       `;
          }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return this.shared_glsl_code() + `
  
    void main(){
        //vec2 position = vUv;
	     //float offset = time * speed;
	     //float a = sin(3.14 * xScale  * position.x + offset) + cos(3.14 * 50.0 * position.y);
	     //float b = sin(3.14 * xScale * 5.0 * position.x) * 1.0 ;
          //float c = sin(3.14 * yScale * position.y + offset * 5.0) + cos(3.14 * 50.0 * position.x);
          //float d = sin(3.14 * yScale * 4.0 * position.y + offset * 1.0);
          //float color = a + b + c + d;
	     //float diffR = baseColor.r - dotColor.r;
	     //float diffG = baseColor.g  - dotColor.g;
	     //float diffB = baseColor.b - dotColor.b;
	     //gl_FragColor = vec4(dotColor + vec3(diffR,diffG,diffB)*(color-.9)/7., 1.0);
        //gl_FragColor = vec4(1.,1.,1.,1.);
        vec2 uvMax = ( 2.0 * asin( sin( 2.0 * PI * vUv ) ) ) / PI;
    
        float n = surface3(vec3(uvMax * uvScale, time * speed));

        vec3 s = vec3( clamp( n, 0.0, 1.0 ) ) * dotColor * brightness;
        float diffX = baseColor.r - dotColor.r;
        float diffY = baseColor.g - dotColor.g;
        float diffZ = baseColor.b - dotColor.b;

        gl_FragColor = vec4(dotColor+n*vec3(.5-diffX,.5-diffY,.5-diffY)*.5, 1. );

       // float ratio = .7 + .5*sin(2.*3.14159*colorTransfer/5.);
	     // gl_FragColor = vec4(dotColor(colorTransfer+.1)*2.,colorTransfer*20.+.2);
    }

        `;
    }


}



const Cloud_Shader = defs.Cloud_Shader =
class Cloud_Shader extends Shader{

send_material( gl, gpu, material )
    {                                       // send_material(): Send the desired shape-wide material qualities to the
                                            // graphics card, where they will tweak the Phong lighting formula.                                      
      gl.uniform4fv( gpu.color,    material.color       );
      gl.uniform1f ( gpu.ambient,        material.ambient     );
      gl.uniform1f ( gpu.diffusivity,    material.diffusivity );
      gl.uniform1f ( gpu.specularity,    material.specularity );
      gl.uniform1f ( gpu.smoothness,     material.smoothness  );
    }


update_GPU( context, gpu_addresses, program_state, model_transform, material )
    {
                      // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
                      // pass material.color to the shader.
     const [ P, C, M ] = [ program_state.projection_transform, program_state.camera_inverse, model_transform ],
                      PCM = P.times( C ).times( M );
        context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D( PCM.transposed() ) );
        context.uniform1f ( gpu_addresses.time, program_state.animation_time / 1000 );  
        context.uniform1f(gpu_addresses.sun_color, material.color);  
        const defaults = { color: Color.of( 0,0,0,1 ), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40 };
        material = Object.assign( {}, defaults, material );
        this.send_material ( context, gpu_addresses, material );
    }
                                // TODO (#EC 2):  Complete the shaders, displacing the input sphere's vertices as
                                // a fireball effect and coloring fragments according to displacement.

  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision highp float;
            uniform mat4 projection_camera_model_transform;
            #define F4 0.309016994374947451
            #define PI 3.14159
            uniform float time;
            vec2 uvScale = vec2(.1,.1);
            float speed = .01;
            uniform vec4 color;
            varying vec2 vUv;
            vec4 mod289(vec4 x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            float mod289(float x) {
                return x - floor(x * (1.0 / 289.0)) * 289.0;
            }

            vec4 permute(vec4 x) {
                return mod289(((x*34.0)+1.0)*x);
            }

            float permute(float x) {
                return mod289(((x*34.0)+1.0)*x);
            }

            vec4 taylorInvSqrt(vec4 r) {
                return 1.79284291400159 - 0.85373472095314 * r;
            }

            float taylorInvSqrt(float r) {
                return 1.79284291400159 - 0.85373472095314 * r;
            }

            vec4 grad4(float j, vec4 ip) {
                const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
                vec4 p,s;

                p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
                p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
                s = vec4(lessThan(p, vec4(0.0)));
                p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

                return p;
            }

            float snoise(vec4 v) {
                const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                        0.276393202250021,  // 2 * G4
                        0.414589803375032,  // 3 * G4
                        -0.447213595499958); // -1 + 4 * G4

                // First corner
                vec4 i  = floor(v + dot(v, vec4(F4)) );
                vec4 x0 = v -   i + dot(i, C.xxxx);

                // Other corners

                // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
                vec4 i0;
                vec3 isX = step( x0.yzw, x0.xxx );
                vec3 isYZ = step( x0.zww, x0.yyz );
                //  i0.x = dot( isX, vec3( 1.0 ) );
                i0.x = isX.x + isX.y + isX.z;
                i0.yzw = 1.0 - isX;
                //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
                i0.y += isYZ.x + isYZ.y;
                i0.zw += 1.0 - isYZ.xy;
                i0.z += isYZ.z;
                i0.w += 1.0 - isYZ.z;

                // i0 now contains the unique values 0,1,2,3 in each channel
                vec4 i3 = clamp( i0, 0.0, 1.0 );
                vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
                vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

                //  x0 = x0 - 0.0 + 0.0 * C.xxxx
                //  x1 = x0 - i1  + 1.0 * C.xxxx
                //  x2 = x0 - i2  + 2.0 * C.xxxx
                //  x3 = x0 - i3  + 3.0 * C.xxxx
                //  x4 = x0 - 1.0 + 4.0 * C.xxxx
                vec4 x1 = x0 - i1 + C.xxxx;
                vec4 x2 = x0 - i2 + C.yyyy;
                vec4 x3 = x0 - i3 + C.zzzz;
                vec4 x4 = x0 + C.wwww;

                // Permutations
                i = mod289(i);
                float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
                vec4 j1 = permute( permute( permute( permute (
                                    i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
                                + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
                            + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
                        + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

                // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
                // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
                vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

                vec4 p0 = grad4(j0,   ip);
                vec4 p1 = grad4(j1.x, ip);
                vec4 p2 = grad4(j1.y, ip);
                vec4 p3 = grad4(j1.z, ip);
                vec4 p4 = grad4(j1.w, ip);

                // Normalise gradients
                vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                p0 *= norm.x;
                p1 *= norm.y;
                p2 *= norm.z;
                p3 *= norm.w;
                p4 *= taylorInvSqrt(dot(p4,p4));

                // Mix contributions from the five corners
                vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
                vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
                m0 = m0 * m0;
                m1 = m1 * m1;
                return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                        + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

            }


            float surface( vec4 coord ) {

              float n = 0.0;

              n += 0.25 * abs( snoise( coord * 4.0 ) );
              n += 0.5 * abs( snoise( coord * 8.0 ) );
              n += 0.25 * abs( snoise( coord * 16.0 ) );
              n += 0.125 * abs( snoise( coord * 32.0 ) );

              return n;

            }
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    {  return this.shared_glsl_code() + `
attribute vec3 position;

    void main(){
      vUv = position.xz;
      float s = vUv.x * uvScale.x;
      float t = vUv.y * uvScale.y;
      float multiplier = 1.0 / ( 2.0 * PI );
      float nx = cos( s * 2.0 * PI ) * multiplier;
      float ny = cos( t * 2.0 * PI ) * multiplier;
      float nz = sin( s * 2.0 * PI ) * multiplier;
      float nw = sin( t * 2.0 * PI ) * multiplier;
      float surf = surface( vec4( nx, ny, nz, nw ) + time * speed );
      vec4 newPos = vec4(position.x,position.y*surf*10.,position.z,1.0);
    gl_Position = projection_camera_model_transform * vec4(newPos);


    }
       `;
          }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return this.shared_glsl_code() + `

       void main() {

          float s = vUv.x * uvScale.x;
          float t = vUv.y * uvScale.y;
          float multiplier = 1.0 / ( 2.0 * PI );
          float nx = cos( s * 2.0 * PI ) * multiplier;
          float ny = cos( t * 2.0 * PI ) * multiplier;
          float nz = sin( s * 2.0 * PI ) * multiplier;
          float nw = sin( t * 2.0 * PI ) * multiplier;
          float surf = surface( vec4( nx, ny, nz, nw ) + time * speed );

          gl_FragColor = vec4( color*.3+color * vec4( surf,surf,surf,.4 )*1.5);

      }`;
    }



}


const Toon_Shader = defs.Toon_Shader =
class Toon_Shader extends Shader{

        send_material( gl, gpu, material ,program_state)
            {                                       // send_material(): Send the desired shape-wide material qualities to the
                                                    // graphics card, where they will tweak the Phong lighting formula.                                      
              gl.uniform4fv( gpu.myColor,    material.color       );
              gl.uniform1f ( gpu.ambient,        material.ambient     );
              gl.uniform1f ( gpu.diffusivity,    material.diffusivity );
              gl.uniform1f ( gpu.specularity,    material.specularity );
              gl.uniform1f ( gpu.smoothness,     material.smoothness  );
            }


        update_GPU( context, gpu_addresses, program_state, model_transform, material )
            {
                              // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
                              // pass material.color to the shader.
             const [ P, C, M ] = [ program_state.projection_transform, program_state.camera_inverse, model_transform ],
                              PCM = P.times( C ).times( M );
                context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D( PCM.transposed() ) );
                context.uniformMatrix4fv( gpu_addresses.modelMatrix, false, Mat.flatten_2D_to_1D( M.transposed() ) );
                context.uniform1f ( gpu_addresses.time, program_state.animation_time / 1000 );  
                context.uniform1f(gpu_addresses.sun_color, material.color);  
                const defaults = { color: Color.of( 0,0,0,1 ), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40 };
                material = Object.assign( {}, defaults, material );
                this.send_material ( context, gpu_addresses, material ,program_state);
            }


        shared_glsl_code(){
            return `precision highp float;
                    precision highp int;
                    varying vec3 vNormal;
                    varying vec3 vPosition;
                    uniform float time;
                    uniform mat4 modelMatrix;
                    uniform vec4 myColor;
                    uniform mat4 projection_camera_model_transform;
                    vec3 vLightPosition = vec3(-1.6136017,.502889,1.069);
                    vec3 lightColor = vec3(.5,.4,.6);

      `;

        }
        vertex_glsl_code(){
          return this.shared_glsl_code() + 
          `
                attribute vec3 normal;
                attribute vec3 position;
                void main(){
                    vNormal = normal;
                    vPosition = position;
                    gl_Position = projection_camera_model_transform*vec4(position,1.0);
                }
           `


        }
        fragment_glsl_code(){
          return this.shared_glsl_code() + 
          `
           void main(void) {
                float ToonThresholds[4];
                ToonThresholds[0] = 0.95;
                ToonThresholds[1] = 0.5;
                ToonThresholds[2] = 0.2;
                ToonThresholds[3] = 0.03;

                float ToonBrightnessLevels[5];
                ToonBrightnessLevels[0] = 1.0;
                ToonBrightnessLevels[1] = 0.8;
                ToonBrightnessLevels[2] = 0.6;
                ToonBrightnessLevels[3] = 0.35;
                ToonBrightnessLevels[4] = 0.0;

                // Light
                vec3 lightVectorW = normalize(vec3(vec4( vLightPosition*((time-1.)/100.), 1.0) * modelMatrix) - vPosition);

                // diffuse
                float ndl = max(0.0, dot(vNormal, lightVectorW));
                vec3 color = vec3(myColor.rgb);
                if (ndl > ToonThresholds[0]) {
                    color *= ToonBrightnessLevels[0];
                } else if (ndl > ToonThresholds[1])  {
                    color *= ToonBrightnessLevels[1];
                } else if (ndl > ToonThresholds[2]) {
                    color *= ToonBrightnessLevels[2];
                } else if (ndl > ToonThresholds[3]) {
                    color *= ToonBrightnessLevels[3];
                } else {
                    color *= ToonBrightnessLevels[4];
                }

                gl_FragColor = vec4( color, 1.0 );
        }
           `

        }
}



const Wood_Shader = defs.Wood_Shader =
class Wood_Shader extends Shader{
      send_material( gl, gpu, material )
          {                                       // send_material(): Send the desired shape-wide material qualities to the
                                                  // graphics card, where they will tweak the Phong lighting formula.                                      
            gl.uniform4fv( gpu.sun_color,    material.color       );
            gl.uniform1f ( gpu.ambient,        material.ambient     );
            gl.uniform1f ( gpu.diffusivity,    material.diffusivity );
            gl.uniform1f ( gpu.specularity,    material.specularity );
            gl.uniform1f ( gpu.smoothness,     material.smoothness  );
          }


      update_GPU( context, gpu_addresses, program_state, model_transform, material )
          {
                            // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
                            // pass material.color to the shader.
           const [ P, C, M ] = [ program_state.projection_transform, program_state.camera_inverse, model_transform ],
                            PCM = P.times( C ).times( M );
              context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D( PCM.transposed() ) );
              context.uniform1f ( gpu_addresses.time, program_state.animation_time / 1000 );  
              context.uniform1f(gpu_addresses.sun_color, material.color);  
              const defaults = { color: Color.of( 0,0,0,1 ), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40 };
              material = Object.assign( {}, defaults, material );
              this.send_material ( context, gpu_addresses, material );
          }
      shared_glsl_code(){
        return `precision highp float;
                varying vec2 vUv;
                varying vec3 vNormal;
                varying vec3 vPosition;
                uniform float time;
                vec3 color1 = vec3(.3294117,.1568,.0196078);
                vec3 color2 = vec3(.6666667,.5607,.4745);
                float frequency = 2.;
                float noiseScale = 10.;
                float ringScale = .9;
                float contrast = 1.;
                uniform mat4 projection_camera_model_transform;


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

                float snoise(vec3 v) {
                    const vec2  C = vec2(1.0/6.0, 1.0/3.0) ;
                    const vec4  D = vec4(0.0, 0.5, 1.0, 2.0);

                    // First corner
                    vec3 i  = floor(v + dot(v, C.yyy) );
                    vec3 x0 =   v - i + dot(i, C.xxx) ;

                    // Other corners
                    vec3 g = step(x0.yzx, x0.xyz);
                    vec3 l = 1.0 - g;
                    vec3 i1 = min( g.xyz, l.zxy );
                    vec3 i2 = max( g.xyz, l.zxy );

                    //   x0 = x0 - 0.0 + 0.0 * C.xxx;
                    //   x1 = x0 - i1  + 1.0 * C.xxx;
                    //   x2 = x0 - i2  + 2.0 * C.xxx;
                    //   x3 = x0 - 1.0 + 3.0 * C.xxx;
                    vec3 x1 = x0 - i1 + C.xxx;
                    vec3 x2 = x0 - i2 + C.yyy; // 2.0*C.x = 1/3 = C.y
                    vec3 x3 = x0 - D.yyy;      // -1.0+3.0*C.x = -0.5 = -D.y

                    // Permutations
                    i = mod289(i);
                    vec4 p = permute( permute( permute(
                                    i.z + vec4(0.0, i1.z, i2.z, 1.0 ))
                                + i.y + vec4(0.0, i1.y, i2.y, 1.0 ))
                            + i.x + vec4(0.0, i1.x, i2.x, 1.0 ));

                    // Gradients: 7x7 points over a square, mapped onto an octahedron.
                    // The ring size 17*17 = 289 is close to a multiple of 49 (49*6 = 294)
                    float n_ = 0.142857142857; // 1.0/7.0
                    vec3  ns = n_ * D.wyz - D.xzx;

                    vec4 j = p - 49.0 * floor(p * ns.z * ns.z);  //  mod(p,7*7)

                    vec4 x_ = floor(j * ns.z);
                    vec4 y_ = floor(j - 7.0 * x_ );    // mod(j,N)

                    vec4 x = x_ *ns.x + ns.yyyy;
                    vec4 y = y_ *ns.x + ns.yyyy;
                    vec4 h = 1.0 - abs(x) - abs(y);

                    vec4 b0 = vec4( x.xy, y.xy );
                    vec4 b1 = vec4( x.zw, y.zw );

                    vec4 s0 = floor(b0)*2.0 + 1.0;
                    vec4 s1 = floor(b1)*2.0 + 1.0;
                    vec4 sh = -step(h, vec4(0.0));

                    vec4 a0 = b0.xzyw + s0.xzyw*sh.xxyy ;
                    vec4 a1 = b1.xzyw + s1.xzyw*sh.zzww ;

                    vec3 p0 = vec3(a0.xy,h.x);
                    vec3 p1 = vec3(a0.zw,h.y);
                    vec3 p2 = vec3(a1.xy,h.z);
                    vec3 p3 = vec3(a1.zw,h.w);

                    // Normalise gradients
                    vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
                    p0 *= norm.x;
                    p1 *= norm.y;
                    p2 *= norm.z;
                    p3 *= norm.w;

                    // Mix final noise value
                    vec4 m = max(0.6 - vec4(dot(x0,x0), dot(x1,x1), dot(x2,x2), dot(x3,x3)), 0.0);
                    m = m * m;
                    return 42.0 * dot( m*m, vec4( dot(p0,x0), dot(p1,x1),
                                dot(p2,x2), dot(p3,x3) ) );
                }

         `
      }
      vertex_glsl_code(){
        return this.shared_glsl_code() + `
              attribute vec3 position;
              attribute vec3 normal;
               void main(){
                vNormal = normal;
                vUv = vec2(position.x*position.y*position.x,position.z*position.x);
                vPosition = position;
                gl_Position = projection_camera_model_transform*vec4(position,1.0);
               }

         `

      }
      fragment_glsl_code(){
          return this.shared_glsl_code() + `
               void main(){
                  float n = snoise( vPosition );
                  float ring = fract( frequency * vPosition.z + noiseScale * n );
                  ring *= contrast * ( 1.0 - ring );

                  // Adjust ring smoothness and shape, and add some noise
                  float lerp = pow( ring, ringScale ) + n;
                  vec3 base = mix( color1, color2, lerp);
                  gl_FragColor = vec4( base, 1.0 );
               }

            `
      }


}


const Fire_Shader = defs.Fire_Shader = 
class Fire_Shader extends Shader
{
send_material( gl, gpu, material )
          {                                       // send_material(): Send the desired shape-wide material qualities to the
                                                  // graphics card, where they will tweak the Phong lighting formula.                                      
            gl.uniform4fv( gpu.sun_color,    material.color       );
            gl.uniform1f ( gpu.ambient,        material.ambient     );
            gl.uniform1f ( gpu.diffusivity,    material.diffusivity );
            gl.uniform1f ( gpu.specularity,    material.specularity );
            gl.uniform1f ( gpu.smoothness,     material.smoothness  );
          }


      update_GPU( context, gpu_addresses, program_state, model_transform, material )
          {
                            // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
                            // pass material.color to the shader.
           const [ P, C, M ] = [ program_state.projection_transform, program_state.camera_inverse, model_transform ],
                            PCM = P.times( C ).times( M );
              context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D( PCM.transposed() ) );
              context.uniform1f ( gpu_addresses.time, program_state.animation_time / 1000 );  
              context.uniform1f(gpu_addresses.sun_color, material.color);  
              const defaults = { color: Color.of( 0,0,0,1 ), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40 };
              material = Object.assign( {}, defaults, material );
              this.send_material ( context, gpu_addresses, material );
          }
      shared_glsl_code(){
        return `
        precision highp float;
        precision highp int;
        uniform mat4 projection_camera_model_transform;
          varying vec3 vPosition;
          varying vec2 vUv;
          varying vec4 Output;
          #define PI 3.14159265359
              uniform float time;
              #define Scale vec3(.8, .8, .8)
              #define K 19.19
              const int iterations = 15;

              bool Postprocess = false;

              vec3 hash(vec3 p3)
              {
                  p3 = fract(p3 * Scale);
                  p3 += dot(p3, p3.yxz+19.19);
                  return fract((p3.xxy + p3.yxx)*p3.zyx);

              }

              vec3 noise( in vec3 x )
              {
                  vec3 p = floor(x);
                  vec3 f = fract(x);
                  f = f*f*(3.0-2.0*f);

                  return mix(mix(mix( hash(p+vec3(0,0,0)), 
                                      hash(p+vec3(1,0,0)),f.x),
                                 mix( hash(p+vec3(0,1,0)), 
                                      hash(p+vec3(1,1,0)),f.x),f.y),
                             mix(mix( hash(p+vec3(0,0,1)), 
                                      hash(p+vec3(1,0,1)),f.x),
                                 mix( hash(p+vec3(0,1,1)), 
                                      hash(p+vec3(1,1,1)),f.x),f.y),f.z);
              }

              const mat3 m = mat3( 0.00,  0.80,  0.60,
                                  -0.80,  0.36, -0.48,
                                  -0.60, -0.48,  0.64 );
              vec3 fbm(in vec3 q)
              {
                          vec3 f  = 0.5000*noise( q ); q = m*q*2.01;
                          f += 0.2500*noise( q ); q = m*q*2.02;
                          f += 0.1250*noise( q ); q = m*q*2.03;
                          f += 0.0625*noise( q ); q = m*q*2.04; 
                          f += 0.03125*noise( q ); q = m*q*2.05; 
                          //f += 0.015625*noise( q ); q = m*q*2.06; 
                          //f += 0.0078125*noise( q ); q = m*q*2.07; 
                          //f += 0.00390625*noise( q ); q = m*q*2.08;  
                  return vec3(f);
              }

              float smin( float a, float b )
              {
                  float k = .1;
                  float h = clamp( .5+.5*(b-a)/k, 0., 1. );
                  return mix( b, a, h ) - k*h*(1.0-h);
              }


              float sdSphere(in vec3 p, in float r)
              {
                  return length(p) - r;
              }

              vec3 Fire(in vec3 q)
              {
                  vec3 s = vec3(q) - vec3(0.0,time*1.8, 0.0);
                  s = fbm(s);
                  return vec3(max((s.x)*0.9, 0.5*abs(q.x)), smin(s.y, q.y), q.z);
              }

              float map(in vec3 p)
              {
                  vec3 q = Fire(p);

                  float sphere = sdSphere(q, 1.0);

                  return sphere;
              }

              float intersect(in vec3 ro, in vec3 rd)
              {
                  float maxD = 500.0;
                  float h = 1.0;
                  float t = 0.0;

                  for(int i = 0; i < iterations; i++)
                  {
                      if(h < 0.001 || t > maxD)
                          break;
                      h = map(ro+rd*t);
                      t += h;
                  }
                  if( t>maxD ) t=-1.0;
                  return t;

              }

              vec3 PostProcess(in vec2 fc)
              {
                  vec3 oColor = vec3(0.);

                  int vertical = int(mod(fc.x, 6.0));
                  if(vertical < 2) oColor.x = 1.0;
                  else if(vertical >= 2 && vertical < 4) oColor.y = 1.0;
                  else oColor.z = 1.0;


                  float horizontal = (mod(fc.y, 6.0));
                  oColor *= vec3(horizontal/6.0);

                  return oColor;
              }


         `
      }
      vertex_glsl_code(){
        return this.shared_glsl_code() + `
              attribute vec3 position;
              attribute vec3 normal;
              attribute vec2 uv;
              void main(){
                vUv = position.xz;
                vPosition = position;
                gl_Position = projection_camera_model_transform*vec4(position,1.0);


                vec2 uv = vUv.xy;
                  uv = uv * .4 - 0.2;

                  vec3 ro = vec3(0.0, 0.85, 2.15);
                  vec3 rd = normalize(vec3(uv, -1.0));
                  float t = 0.0;


                  t = intersect(ro, rd);
                  vec3 pos = ro+rd*t;
                  vec3 fire = vec3(0.0);

                  if(t > 0.0)
                  {
                      vec3 pos = ro+rd*t;
                      fire = 1.0 - vec3(t*t-1.0);
                      //fire = vec3((fire.x+1.0)*1.2-pos.y, (fire.x+.4)*1.3-pos.y, (1.9+fire.x*1.5) * smoothstep(-0.1, 0.5, pos.y) );
                      fire = vec3((1.4+fire.x*1.2) * smoothstep(-0.1, 0.5, pos.y),(fire.x+.7)*1.2-pos.y,(fire.x+.6)*1.-pos.y);
                  }

                  if(Postprocess)
                     Output = vec4(PostProcess(vUv.xy), 1.0) * vec4(fire*2.0,1.0);
                  else
                     Output = vec4(fire,1.0);

                  float totalBrightness = (Output.x+Output.y+Output.z)/3.;
                  vec4 newPosition = vec4(position,1.0) + vec4(0.,totalBrightness,0.,0.)/15.;
                  gl_Position = projection_camera_model_transform*newPosition;
              }

         `

      }
      fragment_glsl_code(){
          return this.shared_glsl_code() + `
              
              void main()
              {
                  vec2 uv = vUv.xy;
                  uv = uv * .4 - 0.2;

                  vec3 ro = vec3(0.0, 0.85, 2.15);
                  vec3 rd = normalize(vec3(uv, -1.0));
                  float t = 0.0;


                  t = intersect(ro, rd);
                  vec3 pos = ro+rd*t;
                  vec3 fire = vec3(0.0);

                  if(t > 0.0)
                  {
                      vec3 pos = ro+rd*t;
                      fire = 1.0 - vec3(t*t-1.0);
                      //fire = vec3((fire.x+1.0)*1.2-pos.y, (fire.x+.4)*1.3-pos.y, (1.9+fire.x*1.5) * smoothstep(-0.1, 0.5, pos.y) );
                      fire = vec3((1.4+fire.x*1.2) * smoothstep(-0.1, 0.5, pos.y),(fire.x+.6)*1.2-pos.y,(fire.x+.6)*1.-pos.y);
                  }

                  vec4 Output;

                  if(Postprocess)
                     Output = vec4(PostProcess(vUv.xy), 1.0) * vec4(fire*2.0,1.0);
                  else
                     Output = vec4(fire,1.0);
                  float totalBrightness = (Output.x+Output.y+Output.z)/3.;
                  Output =vec4(Output.x,Output.y,Output.z,totalBrightness*.9);
                  gl_FragColor = Output;
              }

            `
      }



}


const Sun_Shader = defs.Sun_Shader =
class Sun_Shader extends Shader
{ 

send_material( gl, gpu, material )
    {                                       // send_material(): Send the desired shape-wide material qualities to the
                                            // graphics card, where they will tweak the Phong lighting formula.                                      
      gl.uniform4fv( gpu.sun_color,    material.color       );
      gl.uniform1f ( gpu.ambient,        material.ambient     );
      gl.uniform1f ( gpu.diffusivity,    material.diffusivity );
      gl.uniform1f ( gpu.specularity,    material.specularity );
      gl.uniform1f ( gpu.smoothness,     material.smoothness  );
    }


update_GPU( context, gpu_addresses, program_state, model_transform, material )
    {
                      // TODO (#EC 2): Pass the same information to the shader as for EC part 1.  Additionally
                      // pass material.color to the shader.
     const [ P, C, M ] = [ program_state.projection_transform, program_state.camera_inverse, model_transform ],
                      PCM = P.times( C ).times( M );
        context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D( PCM.transposed() ) );
        context.uniform1f ( gpu_addresses.time, program_state.animation_time / 1000 );  
        context.uniform1f(gpu_addresses.sun_color, material.color);  
        const defaults = { color: Color.of( 0,0,0,1 ), ambient: 0, diffusivity: 1, specularity: 1, smoothness: 40 };
        material = Object.assign( {}, defaults, material );
        this.send_material ( context, gpu_addresses, material );
    }
                                // TODO (#EC 2):  Complete the shaders, displacing the input sphere's vertices as
                                // a fireball effect and coloring fragments according to displacement.

  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
              varying vec2 f_tex_coord;
              varying float disp;
              uniform vec4 sun_color;
              varying float noise;

      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    {  return this.shared_glsl_code() + `
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
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return this.shared_glsl_code() + `

        void main()
        { 
         vec3 color = vec3((1.-disp), (0.1-disp*0.2)+0.1, (0.1-disp*0.1)+0.1*abs(sin(disp)));
        gl_FragColor = vec4( color.rgb, 1.0 );
        gl_FragColor *= sun_color;
        }`;
    }
}