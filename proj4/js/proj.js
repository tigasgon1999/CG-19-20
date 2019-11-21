/*global THREE*/

var cameras = [], scene, renderer, camFactor = 12;
var camera = 1, togglePause = false, onPause = false;
var controls;
var time = new Date();

var currMat = 0;

var dirLight, toggleDir = false;
var pointlight, toggleSpot = false;

var toggleMat = false, toggleWire = false;

var ball, board, dice, pauseScreen;
var objs = [];

const a = 80;
var moving = false;

var toggleReload = false;


const l = 640;
const r = 32;
const h = 10;
const vmax = 280;


function createCamera() {
  'use strict';

  var pauseCam = new THREE.OrthographicCamera(
      window.innerWidth / -camFactor, window.innerWidth / camFactor,
      window.innerHeight / camFactor, window.innerHeight / -camFactor, 1, 5000);

  pauseCam.position.x = pauseScreen.position.x;
  pauseCam.position.y = pauseScreen.position.y;
  pauseCam.position.z = pauseScreen.position.z + 100;

  cameras.push(pauseCam);

  var camera = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 2000);
  camera.position.x = 650;
  camera.position.y = 850;
  camera.position.z = 650;
  cameras.push(camera);
  camera.lookAt(scene.position);

  controls = new THREE.OrbitControls(camera, renderer.domElement);
  controls.update();
}

function reload() {
  for (let i = 0; i < objs.length; i++) {
    objs[i].reload();
  }

  camera = 1;
  currMat = 0;

  dirLight.visible = true;
  pointlight.visible = true;

  toggleReload = false;
  toggleDir = false;
  toggleMat = false;
  toggleSpot = false;
  toggleWire = false;
  togglePause = false;
  moving = false;
  onPause = false;
}

function createScene() {
  'use strict';

  scene = new THREE.Scene();
  createObjs();
}

function createObjs() {
  board = new ChessBoard(0, 0, 0, l, h);
  objs.push(board);
  scene.add(board);

  ball = new Ball(-l / 2 + 3 * r, h, 0, r, vmax);
  objs.push(ball);
  scene.add(ball);

  dice = new Dice(0, h, 0, 40);
  objs.push(dice);
  scene.add(dice);

  pauseScreen = new Pause(0, 500, 2000, 200, 80);
  scene.add(pauseScreen);
  pauseScreen.visible = false;
}

function createLights() {
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(0, 300, l);

  dirLight.shadow.camera.near = 2;
  dirLight.shadow.camera.far = 2 * l;
  dirLight.shadow.camera.left = -l / 2;
  dirLight.shadow.camera.right = l / 2;
  dirLight.shadow.camera.top = 200;
  dirLight.shadow.camera.bottom = -200;

  dirLight.castShadow = true;

  scene.add(dirLight);
  toggleDir = false;

  pointlight = new THREE.PointLight(0xffffff, 2.3);
  pointlight.position.set(l / 8, 2 * h, -l / 8);

  pointlight.angle = Math.PI / 2;
  pointlight.castShadow = true;

  pointlight.shadow.mapSize.width = 1024;
  pointlight.shadow.mapSize.height = 1024;

  pointlight.shadow.camera.near = 0.5;
  pointlight.shadow.camera.far = 2000;

  pointlight.decay = 2;
  pointlight.penumbra = 0.2;
  pointlight.distance = 2000;

  scene.add(pointlight);
  toggleSpot = false;
}

function render() {
  'use strict';
  renderer.render(scene, cameras[camera]);
}

function onResize() {
  'use strict';

  renderer.setSize(window.innerWidth, window.innerHeight);

  for (let i = 0; i < cameras.length; i++) {
    if (i == 1 || i == 2) {
      if (window.innerHeight > 0 && window.innerWidth > 0) {
        cameras[i].aspect =
            renderer.getSize().width / renderer.getSize().height;
        cameras[i].updateProjectionMatrix();
      }
    } else {
      cameras[i].left = -window.innerWidth / camFactor;
      cameras[i].right = window.innerWidth / camFactor;
      cameras[i].top = window.innerHeight / camFactor;
      cameras[i].bottom = -window.innerHeight / camFactor;
      cameras[i].updateProjectionMatrix();
    }
  }
}


function pause() {
  togglePause = false;
  if (onPause) {
    onPause = false;
    camera = 1;
    pauseScreen.visible = false;
  } else {
    onPause = true;
    camera = 0;
    pauseScreen.visible = true;
  }
}

function onKeyDown(e) {
  switch (e.keyCode) {
    case 66:  // B
      moving = !moving;
      break;
    case 68:  // D
      toggleDir = true;
      break;
    case 87:  // W
      toggleWire = true;
      break;
    case 76:  // L
      currMat = (currMat + 1) % 2;
      toggleMat = true;
      break;
    case 80:  // P
      toggleSpot = true;
      break;
    case 82:  // R
      toggleReload = onPause;
      break;
    case 83:  // S
      togglePause = true;
      break;
  }
}


function animate() {
  'use strict';
  var newTime = new Date();
  var elapsed = (newTime - time) / 1000;
  time = newTime;

  if (toggleReload) {
    reload();
  }

  if (togglePause) {
    pause();
  }

  if (toggleDir) {
    dirLight.visible = !dirLight.visible;
    toggleDir = false;
  }

  if (toggleSpot) {
    pointlight.visible = !pointlight.visible;
    toggleSpot = false;
  }

  if (toggleWire) {
    for (let i = 0; i < objs.length; i++) {
      objs[i].toggleWireframe();
    }
    toggleWire = false;
  }

  if (toggleMat) {
    for (let i = 0; i < objs.length; i++) {
      objs[i].toggleMaterial(currMat);
    }
    toggleMat = false;
  }

  ball.update(onPause ? 0 : elapsed, moving);
  dice.update(onPause ? 0 : elapsed);

  render();

  requestAnimationFrame(animate);

  controls.update();
}

function init() {
  'use strict';

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.soft = true;

  document.body.appendChild(renderer.domElement);

  createScene();
  createLights();
  createCamera();

  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
}