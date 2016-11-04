const THREE = require('../node_modules/three/build/three');
require('../node_modules/three-first-person-controls')(THREE);
require('./VRControls')(THREE);
require('./VREffect')(THREE);

const WebVRManager = require('./webvr-manager');
var container;
var camera, scene, renderer;
var controls;
var vrControls;
var clock = new THREE.Clock();
var manager;
var effect;

init();

function init() {
    container = document.createElement('div');
    document.body.appendChild(container);

    scene = new THREE.Scene();

    var box = new THREE.BoxGeometry(50, 50, 20, 20);
    var material = new THREE.MeshNormalMaterial();
    material.color = new THREE.Color(0xff0000);
    var boxMesh = new THREE.Mesh(box, material);
    scene.add(boxMesh);


    var grid = new THREE.GridHelper(100, 50, new THREE.Color(0xffffff));
    scene.add(grid);

    camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.x = 10;
    camera.position.y = 10;
    camera.position.z = 100;
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

    vrControls = new THREE.VRControls(camera);
    vrControls.standing = true;

    container.innerHTML = "";
    container.appendChild( renderer.domElement );

    window.addEventListener( 'resize', onWindowResize, false );
    window.addEventListener('vrdisplaypresentchange', onWindowResize, true);

    effect = new THREE.VREffect(renderer);
    effect.setSize(window.innerWidth, window.innerHeight);

    var params = {
        hideButton: false, // Default: false.
        isUndistorted: false // Default: false.
    };
    manager = new WebVRManager(renderer, effect, params);

    setupStage();
}

function onWindowResize() {
    effect.setSize(window.innerWidth, window.innerHeight);
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
}

var vrDisplay;

// Get the HMD, and if we're dealing with something that specifies
// stageParameters, rearrange the scene.
function setupStage() {
    navigator.getVRDisplays().then(function(displays) {
        if (displays.length > 0) {
            vrDisplay = displays[0];
            if (vrDisplay.stageParameters) {
                // setStageDimensions(vrDisplay.stageParameters);
            }
            vrDisplay.requestAnimationFrame(animate);
        }
    });
}

var lastRender;
function animate(timestamp) {
    var delta = Math.min(timestamp - lastRender, 500);
    lastRender = timestamp;

    vrControls.update();
    controls.update(delta);
    // Render the scene through the manager.
    manager.render(scene, camera, timestamp);
    effect.render(scene, camera);

    vrDisplay.requestAnimationFrame(animate);
}