/*global THREE*/

var cameras = [], scene, renderer, camFactor = 12;
var camera = 1;
var newcam = 1;

var dirLight, toggleDir;
var spotlight, toggleSpot;

var objs = [];

function createCamera() {
  'use strict';

  var cameraO = new THREE.OrthographicCamera(
      window.innerWidth / -camFactor, window.innerWidth / camFactor,
      window.innerHeight / camFactor, window.innerHeight / -camFactor, 1, 2000);

  cameraO.position.x = 320;
  cameraO.position.y = 0;
  cameraO.position.z = 320;
  cameras.push(cameraO);

  var cameraP = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 2000);
  cameraP.position.x = -150;
  cameraP.position.y = 250;
  cameraP.position.z = 250;
  cameras.push(cameraP);
  cameraP.lookAt(scene.position);

  var cameraP2 = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 2000);
  cameraP2.position.x = 320;
  cameraP2.position.y = 40;
  cameraP2.position.z = 320;
  cameras.push(cameraP2);
  cameraP2.lookAt(scene.position);
}

function createScene() {
  'use strict';

  scene = new THREE.Scene();

  scene.add(new ChessBoard(0, 0, 0, 640));
  scene.add(new Dice(0, 10, 0, 40));
}

function createLights() {
  dirLight = new THREE.DirectionalLight(0xffffff, 2);
  dirLight.position.set(-250, 300, 200);

  dirLight.shadow.camera.near = 2;
  dirLight.shadow.camera.far = 1000;
  dirLight.shadow.camera.left = -200;
  dirLight.shadow.camera.right = 200;
  dirLight.shadow.camera.top = 200;
  dirLight.shadow.camera.bottom = -200;

  dirLight.castShadow = true;

  scene.add(dirLight);
  toggleDir = false;
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


function onKeyDown(e) {
  switch (e.keyCode) {
    case 53:  // 5
      newcam = 1;
      break;
    case 54:  // 6
      newcam = 0;
      break;
    case 55:  // 7
      newcam = 2
      break;
    case 68:  // D
      toggleDir = true;
      break;
  }
}

function onKeyUp(e) {
  'use strict';
}

function animate() {
  'use strict';

  if (newcam != camera) {
    camera = newcam;
  }

  if (toggleDir) {
    dirLight.visible = !dirLight.visible;
    toggleDir = false;
  }
  render();

  requestAnimationFrame(animate);
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
  window.addEventListener('keyup', onKeyUp);
}