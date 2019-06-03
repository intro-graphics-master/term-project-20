import {tiny, defs} from './assignment-4-resources.js';
                                                                // Pull these names into this module's scope for convenience:
const { Vec, Mat, Mat4, Color, Light, Shape, Shader, Material, Texture,
         Scene, Canvas_Widget, Code_Widget, Text_Widget } = tiny;
const { Cube, Subdivision_Sphere, Transforms_Sandbox_Base, Square } = defs;

function randomNum(min,max)
  {
      return Math.floor((Math.random() * (max-min) + min) * 100) / 100 ;
  }

const Part = defs.part =
class Part extends Square
{
  constructor()
  {
    super();

    var part_array = [];
    var xCenter, yCenter, zCenter;
    this.arrays.center = new Array;
    this.arrays.billboardOffset = new Array;
    this.arrays.billboardOffset.push(Vec.of(-1,-1,0));
    this.arrays.billboardOffset.push(Vec.of(1,-1,0));
    this.arrays.billboardOffset.push(Vec.of(-1,1,0));
    this.arrays.billboardOffset.push(Vec.of(1,1,0));
    this.arrays.center.push(Vec.of(0,0,0));
    this.arrays.center.push(Vec.of(0,0,0));
    this.arrays.center.push(Vec.of(0,0,0));
    this.arrays.center.push(Vec.of(0,0,0));

    for( var i = 0; i < 1000; i++ )
        { 
          
          let factor = 300.0;
          let factor2 = factor / 2;   
          let num = randomNum(0.1, 1.3);   
              
          var square_transform = Mat4.translation([ factor*Math.random()-factor2, factor*Math.random()-factor2, factor*Math.random()-factor2 ])
                                     .times( Mat4.scale([ num, num, num ]) );
                                     
          Square.insert_transformed_copy_into( this, part_array, square_transform );

          this.arrays.billboardOffset.push(Vec.of(-1,-1,0));
          this.arrays.billboardOffset.push(Vec.of(1,-1,0));
          this.arrays.billboardOffset.push(Vec.of(-1,1,0));
          this.arrays.billboardOffset.push(Vec.of(1,1,0));

          var j = i*4;
            let xCenter = (this.arrays.position[j][0] + this.arrays.position[j+1][0] + this.arrays.position[j+2][0] + this.arrays.position[j+3][0])/4;
            let yCenter = (this.arrays.position[j][1] + this.arrays.position[j+1][1] + this.arrays.position[j+2][1] + this.arrays.position[j+3][1])/4;
            let zCenter = (this.arrays.position[j][2] + this.arrays.position[j+1][2] + this.arrays.position[j+2][2] + this.arrays.position[j+3][2])/4;

          this.arrays.center.push(Vec.of(xCenter, yCenter, zCenter));
          this.arrays.center.push(Vec.of(xCenter, yCenter, zCenter));
          this.arrays.center.push(Vec.of(xCenter, yCenter, zCenter));
          this.arrays.center.push(Vec.of(xCenter, yCenter, zCenter));


        }
  }
}

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

      this.scratchpad = document.createElement("canvas");
      this.scratchpad_context = this.scratchpad.getContext("2d");
      this.scratchpad.width = 1024;
      this.scratchpad.height = 1024;
      this.texture = new Texture("data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7");

                                                // TODO (#1):  Complete this list with any additional shapes you need.
      this.shapes = { 'box' : new Cube(),
                   'ball_4' : new Subdivision_Sphere( 4 ),
                     'star' : new Planar_Star(),
                   'particle': new Part(),
                    'record': new defs.Shape_From_File("assets/mainRecordPlayer.obj"),
                   'spindle': new defs.Shape_From_File("assets/spindle.obj"),
                    'disk': new defs.Shape_From_File("assets/disk.obj"),
                     'lid': new defs.Shape_From_File("assets/lid.obj"),
                     };

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
      const particle_shader = new Particle_Shader();
      const pixel_shader = new Pixel_Shader();
      const water_shader = new Water_Shader();

                                              // *** Materials: *** wrap a dictionary of "options" for a shader.

                                              // TODO (#2):  Complete this list with any additional materials you need:

      this.pixelation = 100;
      this.multipass_effects = {
        "pixelate": 0,
      };

      this.materials = { plastic: new Material( phong_shader, 
                                    { ambient: 0.3, diffusivity: 1, specularity: 0, color: Color.of( 1,.5,1,1 ) } ),
                   plastic_stars: new Material( texture_shader_2,    
                                    { texture: new Texture( "assets/stars.png" ),
                                      ambient: 0.3, diffusivity: 1, specularity: 0, color: Color.of( .4,.4,.4,1 ) } ),
                           metal: new Material( phong_shader,
                                    { ambient: 0, diffusivity: 1, specularity: 1, color: Color.of( 1,.5,1,1 ) } ),
                     metal_earth: new Material( texture_shader_2,    
                                    { texture: new Texture( "assets/earth.gif" ),
                                      ambient: 0, diffusivity: 1, specularity: 1, color: Color.of( .4,.4,.4,1 ) } ),
                      black_hole: new Material( black_hole_shader ),
                             sun: new Material( sun_shader, { ambient: 1, color: Color.of( 0,0,0,1 ) } ),
                           shiny: new Material( particle_shader, {ambient: .8, diffusivity: .8, specularity: .8, color: Color.of(102/255,1,204/255,1)}),
                             glow: new Material(wire_shader, {ambient: .8, diffusivity: .5, specularity: .5, color: Color.of(.3,.1,.9,1)}),
                             water: new Material(water_shader, {ambient:.8,diffusivity:.5,specularity:.5, color: Color.of(.5,.5,.9,1.)}),
                        pixelate: new Material(pixel_shader, {ambient: 1, diffusivity: 1, specularity: 0, texture: this.texture, color: Color.of( 0,0,0,1 ), pixels: this.pixelation } ),
                       };

                                  // Some setup code that tracks whether the "lights are on" (the stars), and also
                                  // stores 30 random location matrices for drawing stars behind the solar system:
      this.part_on = false;
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
       this.key_triggered_button("Increase effect", [ "[" ], () => {
         if (this.multipass_effects.pixelate) this.pixelation -= 2;
       }, "green");
       this.key_triggered_button("Decrease effect", [ "]" ], () => {
         if (this.multipass_effects.pixelate) this.pixelation += 2;
       }, "red");

       this.key_triggered_button("Toggle pixelation", [ "b" ], () => {
        this.multipass_effects.pixelate ^= 1;
       })
      
       this.key_triggered_button( "Particles on/off", ["p"], () => this.part_on = !this.part_on);
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
      const teal = Color.of(102/255,1,204/255,1);
      const red = Color.of(1,0,0,1);
      this.Colors = { 
              purple: Color.of(130/255., 119/255., 203/255., 1), 
              light_purple: Color.of(221/255., 211/255., 238/255., 1),
              blue: Color.of(119/255., 192/255., 203/255., 1)
            }


                                    // Variable model_transform will be a local matrix value that helps us position shapes.
                                    // It starts over as the identity every single frame - coordinate axes at the origin.
      let model_transform = Mat4.identity();


     
      program_state.lights = [ new Light( Vec.of( 0,0,0,1 ), Color.of( 1,1,1,1 ), 100000 ) ];
           
      const modifier = this.lights_on ? { ambient: 0.3 } : { ambient: 0.0 };

      var period = 4;
      var part_color = this.Colors.blue;
      var part_color2 = this.Colors.purple;
      var partColors;

      const smoothly_varying_ratio = .5 + .5 * Math.sin( 2 * Math.PI * t/4 );
      // need to fix
      partColors = part_color.times(1-smoothly_varying_ratio).plus(part_color2.times(smoothly_varying_ratio));
      this.materials.shiny.color = partColors; 

     // program_state.set_camera( Mat4.translation([ 0,0,-10 ]) );
      const angle = -40//Math.sin( t );
      const light_position = Mat4.rotation( angle, [ 1,0,0 ] ).times( Vec.of( 0,-1,1,0 ) );
      program_state.lights = [ new Light( light_position, Color.of( 1,1,1,1 ), 1000000000 ) ];
      model_transform = Mat4.identity();
      //this.shapes.box.draw( context, program_state, model_transform, this.materials.plastic.override( yellow ) );
      //model_transform.post_multiply( Mat4.translation([ 0, -4, 0 ]) );
      //this.shapes.ball_4.draw( context, program_state, model_transform, this.materials.metal_earth.override( blue ) );
      model_transform = model_transform.post_multiply(Mat4.translation([0,-2,0]));
      model_transform = model_transform.post_multiply(Mat4.scale([4,4,4]));
      this.shapes.record.draw(context, program_state, model_transform, this.materials.plastic.override({color:Color.of(.25882,.1882,.1176,1)}));
      model_transform = model_transform.post_multiply(Mat4.translation([-.45,0,-.45]));
      model_transform = model_transform.post_multiply(Mat4.scale([.8,.8,.8]));
      var saveMatrix = model_transform.copy();
      model_transform = model_transform.post_multiply(Mat4.translation([1.05,0,-1.05]));
      model_transform = model_transform.post_multiply(Mat4.rotation(Math.sin(t)/100.-.05,[1,0,0]));
      model_transform = model_transform.post_multiply(Mat4.translation([-1.05,0,1.05]));
      this.shapes.spindle.draw(context, program_state, model_transform, this.materials.plastic.override({color: Color.of(.2,.2,.5,1.)}));
      model_transform = saveMatrix.copy();
      model_transform = model_transform.post_multiply(Mat4.scale([1/.75,1/.75,1/.75]));
      model_transform = model_transform.post_multiply(Mat4.translation([-.7,-.2,0]));
      //model_transform = model_transform.post_multiply(Mat4.scale([2,2,2]));
      this.shapes.disk.draw(context, program_state, model_transform, this.materials.plastic.override({color: Color.of(.1,.3,.4,1)}));
      model_transform = model_transform.post_multiply(Mat4.translation([0,.5,0]));
      model_transform = Mat4.identity();
      model_transform = model_transform.post_multiply(Mat4.scale([9.6,9.6,9.6]));
      model_transform = model_transform.post_multiply(Mat4.translation([-.36,.4,-.85]));
      //model_transform = model_transform.post_multiply(Mat4.translation([0,-.6,-0]));
      //model_transform = model_transform.post_multiply(Mat4.rotation(Math.PI/2-Math.sin(t)/2-.5,[1,0,0]));
      //model_transform = model_transform.post_multiply(Mat4.translation([0,.6,0]));
      this.shapes.lid.draw(context, program_state, model_transform, this.materials.plastic.override({color:Color.of(.4,.4,.4,.5)}));

      // two-pass rendering

      if (Object.values(this.multipass_effects).some(effect => effect)) {
        this.scratchpad_context.drawImage(context.canvas, 0, 0, 1024, 1024);
        this.texture.image.src = this.scratchpad.toDataURL("image/png");

        if (this.skipped_first_frame)
          this.texture.copy_onto_graphics_card(context.context, false);
        this.skipped_first_frame = true;

        context.context.clear(context.context.COLOR_BUFFER_BIT | context.context.DEPTH_BUFFER_BIT);

        model_transform = Mat4.identity();
        // model_transform = program_state.camera_transform.post_multiply(Mat4.rotation(Math.PI/2, [1,0,0]));
        let camera_i = program_state.camera_transform.times(Vec.of(1,0,1,0)).to3().normalized();
        let camera_j = program_state.camera_transform.times(Vec.of(0,1,0,0)).to3().normalized();
        let camera_k = program_state.camera_transform.times(Vec.of(0,0,1,0)).to3().normalized();
        let camera_p = program_state.camera_transform.times(Vec.of(0,0,0,1)).to3();

        let translate = camera_p.plus(camera_k.times(-8));

        model_transform.post_multiply(Mat4.identity()
          // .times(program_state.camera_transform)
          // .times(Mat4.translation(Vec.of(0,0,-10)))
          // .times(Mat4.translation(camera_loc + Vec.of(0,0,-10)))
          // .times(Mat4.translation(translate))
          .times(Mat4.inverse(Mat4.look_at(translate, camera_p, camera_j)))
          //.times(Mat4.rotation(Math.PI/2, [1,0,0]))
          .times(Mat4.scale([5.22,2.9,1]))
        );

        // ***** ADD MULTIPASS EFFECTS HERE

        let multipass_material = undefined;

        if (this.multipass_effects.pixelate) {
          multipass_material = this.materials.pixelate.override({pixels: this.pixelation});
        }

        this.shapes.box.draw(context, program_state, model_transform, multipass_material);
      }
      
      // particles
      let position_of_camera = program_state.camera_transform.times( Vec.of( 0,0,0,1 ) ).to3();

      if (this.part_on) {
        model_transform = Mat4.identity();
        // .post_multiply( Mat4.translation(position_of_camera) );
        model_transform.post_multiply( Mat4.scale([0.3, 0.3, 0.3]) ).post_multiply( Mat4.translation([5,5,5]) );
        this.shapes.particle.draw( context, program_state, model_transform, this.materials.shiny );

        model_transform.post_multiply( Mat4.translation([5,5,5]) );
        this.shapes.particle.draw( context, program_state, model_transform, this.materials.shiny.override( blue ) );
      }
      
      // ***** END TEST SCENE *****

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


const Particle_Shader = defs.Particle_Shader = 
class Particle_Shader extends Shader
{ update_GPU( context, gpu_addresses, program_state, model_transform, material )
    {
      const [ P, C, M ] = [ program_state.projection_transform, program_state.camera_inverse, model_transform ],
                          PCM = P.times( C ).times( M );
      context.uniformMatrix4fv( gpu_addresses.projection_camera_model_transform, false, Mat.flatten_2D_to_1D( PCM.transposed() ) );
      //context.uniformMatrix4fv( gpu_addresses.camera_transform, false, Mat.flatten_2D_to_1D( program_state.model_transform.transposed() ));
      context.uniformMatrix4fv( gpu_addresses.camera_transform, false, Mat.flatten_2D_to_1D( program_state.camera_inverse.transposed() ) );
      context.uniform1f ( gpu_addresses.animation_time, program_state.animation_time / 1000 ); 
      context.uniform1f ( gpu_addresses.smoothly_varying_ratio, program_state.smoothly_varying_ratio ); 
      context.uniform4fv( gpu_addresses.sun_color, material.color );
    }

  shared_glsl_code()            // ********* SHARED CODE, INCLUDED IN BOTH SHADERS *********
    { return `precision mediump float;
                            
      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    { return this.shared_glsl_code() + `
        precision mediump float;

        attribute vec3 position;
        attribute vec3 center;
        attribute vec2 texture_coord;
        attribute vec3 billboardOffset;

        uniform mat4 projection_camera_model_transform;
        uniform mat4 camera_transform;
        uniform float animation_time;

        void main() {
          vec3 cameraRight = normalize(vec3(camera_transform[0].x, camera_transform[1].x, camera_transform[2].x));
          vec3 cameraUp = normalize(vec3(camera_transform[0].y, camera_transform[1].y, camera_transform[2].y));

          gl_Position = projection_camera_model_transform * vec4( center.xyz + billboardOffset.x * cameraRight + billboardOffset.y * cameraUp, 1.0 );
        }`;
    }
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return this.shared_glsl_code() + `
        precision mediump float;
        uniform float animation_time;
        uniform vec4 sun_color;
        float brightness = 0.82;

        void main() 
        {

//         vec3 color = vec3((1.-disp), (0.1-disp*0.2)+0.1, (0.1-disp*0.1)+0.1*abs(sin(disp)));
//         gl_FragColor = vec4( color.rgb, 1.0 );
//         gl_FragColor *= sun_color;
          gl_FragColor = sun_color;

        }` ;
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
        context.uniform1f(gpu_addresses.color, material.color);  
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
            varying vec3 vNormal;

      `;
    }
  vertex_glsl_code()           // ********* VERTEX SHADER *********
    {  return this.shared_glsl_code() + `
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
  fragment_glsl_code()           // ********* FRAGMENT SHADER *********
    { return this.shared_glsl_code() + `
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

const Pixel_Shader = defs.Pixel_Shader =
class Pixel_Shader extends defs.Textured_Phong
{
  update_GPU( context, gpu_addresses, gpu_state, model_transform, material ) {
    super.update_GPU( context, gpu_addresses, gpu_state, model_transform, material );

    context.uniform2fv(gpu_addresses.viewport_res, Vec.of(context.width, context.height))
    context.uniform1f(gpu_addresses.pixels, material.pixels ? material.pixels : 50);
  }

  fragment_glsl_code() {
    return this.shared_glsl_code() + `
      varying vec2 f_tex_coord;
      uniform sampler2D texture;
      uniform vec2 viewport_res;
      uniform float pixels;

      void main() {
        float d = 1.0 / pixels;
        float aspect_ratio = viewport_res.x / viewport_res.y;
        float u = floor(f_tex_coord.x / d) * d;
        float v = floor(f_tex_coord.y / d) * d;

        vec4 tex_color = texture2D(texture, vec2(u,v));

        vec3 bumped_N  = N + tex_color.rgb - .5*vec3(1,1,1);

        gl_FragColor = vec4( ( tex_color.xyz ) * ambient, tex_color.w );

        gl_FragColor.xyz += phong_model_lights( normalize( bumped_N ), vertex_worldspace );
      }
    `;
  }
}