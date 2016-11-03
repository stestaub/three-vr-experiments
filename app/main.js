const THREE = require('../node_modules/three/build/three');
require('../node_modules/three-first-person-controls')(THREE);
require('./VREffect')(THREE);
var container;
var camera, scene, renderer;
var controls;
var clock = new THREE.Clock();

var effect;

init();
animate();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    var box = new THREE.BoxGeometry(50, 50, 20, 20);
    var material = new THREE.MeshNormalMaterial();
    material.color = new THREE.Color(0xff0000);
    var boxMesh = new THREE.Mesh(box, material);
    scene.add(boxMesh);


    var grid = new THREE.GridHelper(100, 100, new THREE.Color(0xffffff));
    scene.add(grid);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.x = 50;
    camera.position.y = 50;
    camera.position.z = -100;
    // camera.lookAt = boxMesh.position;
    scene.add( camera );

    // renderer
    renderer = new THREE.WebGLRenderer( { antialias: true } );
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize( window.innerWidth, window.innerHeight );
    container.appendChild( renderer.domElement );


    controls = new THREE.FirstPersonControls( camera );
    controls.movementSpeed = 100;
    controls.lookSpeed = 0.1;


    container.innerHTML = "";
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );

    effect = new THREE.VREffect(renderer, function(error) { console.log(error)})

}

function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize( window.innerWidth, window.innerHeight );
    controls.handleResize();
}

function animate() {
    requestAnimationFrame( animate );
    render();
}
function render() {
    controls.update( clock.getDelta() );
    renderer.render(scene, camera);
}