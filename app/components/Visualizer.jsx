import {connect} from 'react-redux'
import React, { Component } from 'react';

let OrbitControls = require('three-orbit-controls')(THREE);

export default class Visualizer extends Component {
  constructor(props) {
    super(props);

    this.stats;
    this.camera;
    this.controls;
    this.scene;
    this.renderer;
    this.animate = this.animate.bind(this);

    
    this.mirror = true;
    
    // offset negative labels by -0.1 so they don't overlap with each other
    // change this to this.props.labels after form is added
    this.labels = {
      "HATE": [-0.1, 0, 0],
      "LOVE": [1, 0, 0],
      "SAD": [0, -0.1, 0],
      "HAPPY": [0, 1, 0],
      "CONFUSED": [0, 0, -0.1],
      "CLEAR": [0, 0, 0.99]
    }

    this.onWindowResize = this.onWindowResize.bind(this);
    this.loadWords = this.loadWords.bind(this);
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  componentDidMount(){
      this.init();
      this.animate();
  }


  /* load the words/label to scene */
  loadWords(words, fontFile, size, height) {
    //need to load the font first
    let loader = new THREE.FontLoader();
    loader.load(fontFile, (font) => {

      //for every word create an object called Mesh
      Object.keys(words).forEach((word) => {
        //properties for word
        let geometry  = new THREE.TextGeometry(word,{size, font, height});
        let color = new THREE.Color(words[word][0], words[word][1], words[word][2]);
        let material =  new THREE.MeshBasicMaterial( { color:color } );
        let mesh = new THREE.Mesh( geometry, material );

        //set the position for every single word
        mesh.position.x = ((words[word][0] - 0.5) * window.innerWidth);
        mesh.position.y = ((words[word][1] - 0.5) * window.innerHeight);
        mesh.position.z = ((words[word][2] - 0.5) * 500);
        mesh.updateMatrix();
        mesh.matrixAutoUpdate = false;
        //append the word to scene
        this.scene.add( mesh );
      })
    })
  }

 init() {
    console.log("INIT FUN");
    // create the scene to contain 3d modules
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.FogExp2( 0xcccccc, 0.002 );

    //to display the scene, create new renderer
    this.renderer = new THREE.WebGLRenderer();
    this.renderer.setClearColor( this.scene.fog.color );
    this.renderer.setPixelRatio( window.devicePixelRatio );
    this.renderer.setSize( window.innerWidth, window.innerHeight );

    let container = document.getElementById( 'container' );
    container.appendChild( this.renderer.domElement );
    //the view from the user
    this.camera = new THREE.PerspectiveCamera( 90, window.innerWidth / window.innerHeight, 100, 1000 );
    this.camera.position.z = 600;

    //orbit around some object
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.25;
    this.controls.enableZoom = false;

    // lights
    let light = new THREE.DirectionalLight( 0xffffff );
    light.position.set( 1, 1, 1 );
    this.scene.add( light );
    light = new THREE.DirectionalLight( 0x002288 );
    light.position.set( -1, -1, -1 );
    this.scene.add( light );
    light = new THREE.AmbientLight( 0x222222 );
    this.scene.add( light );

    //info box to monitor code performance
    this.stats = new Stats();
    container.appendChild( this.stats.dom );

    window.addEventListener( 'resize', this.onWindowResize, false );
  }

  // auto resize
  onWindowResize() {
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize( window.innerWidth, window.innerHeight );
  }

  // animation
  animate() {
    requestAnimationFrame( this.animate );
    this.controls.update(); // required if controls.enableDamping = true, or if controls.autoRotate = true
    this.stats.update();
    this.renderPlot();
  }

  //plot the scene and camera to the canvas
  renderPlot() {
    this.renderer.render( this.scene, this.camera );
  }

  render () {
    // load all words for each scene 
    this.loadWords(this.labels, 'js/optimer_bold.typeface.json', 35, 5); // change to this.props.labels
    this.loadWords(this.props.words, 'js/optimer_regular.typeface.json', 25, 2);
    return (
      <div id = "container">
         <h1>Canvas</h1>
      </div>
    )
  }
}