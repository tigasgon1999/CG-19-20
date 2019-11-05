/*global THREE*/

var cameras = [], scene, renderer, camFactor = 10;
var camera = 2;

var objs = [];

var dirLight;
var ico;
var painting;

var currMat = 1;
var prevMat = 1;
var lastMat = 1;

var spotlights = [];

function createCamera() {
  'use strict';

  var cameraO = new THREE.OrthographicCamera(
      window.innerWidth / -camFactor, window.innerWidth / camFactor,
      window.innerHeight / camFactor, window.innerHeight / -camFactor, 1, 1300);

  cameraO.position.x = -100;
  cameraO.position.y = 100;
  cameraO.position.z = 1000;
  cameras.push(cameraO);

  var cameraP = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 1000);
  cameraP.position.x = -300;
  cameraP.position.y = 400;
  cameraP.position.z = 500;
  cameras.push(cameraP);
  cameraP.lookAt(scene.position);

  var cameraP2 = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 1000);
  cameraP2.position.x = 300;
  cameraP2.position.y = 400;
  cameraP2.position.z = 500;
  cameras.push(cameraP2);
  cameraP2.lookAt(scene.position);
}

function createScene() {
  'use strict';

  scene = new THREE.Scene();
  scene.background = new THREE.Color(0xa9a9a9);

  var backWall = new Wall(0, 0, -100, 500, 200, 0);
  objs.push(backWall);
  scene.add(backWall);

  var sideWall1 = new Wall(250, 0, 50, 300, 200, Math.PI / 2);
  objs.push(sideWall1);
  scene.add(sideWall1);

  var sideWall2 = new Wall(-250, 0, 50, 300, 200, Math.PI / 2);
  objs.push(sideWall2);
  scene.add(sideWall2);

  var floor = new Floor(0, 0, 50, 500, 300);
  objs.push(floor);
  scene.add(floor);

  painting = new Painting(-100, 110, -100, 20, 10, 3);
  objs.push(painting);
  scene.add(painting);

  var stand = new Stand(80, 0, 0, 50);
  objs.push(stand);
  scene.add(stand);

  ico = new Icosahedron(80, 60, 0, 15);
  objs.push(ico);
  scene.add(ico);
}

function createLights() {
  dirLight = new THREE.DirectionalLight(0xffffff, 1);
  dirLight.position.set(-250, 300, 200);

  dirLight.shadow.camera.near = 2;
  dirLight.shadow.camera.far = 1000;
  dirLight.shadow.camera.left = -200;
  dirLight.shadow.camera.right = 200;
  dirLight.shadow.camera.top = 200;
  dirLight.shadow.camera.bottom = -200;

  dirLight.castShadow = true;

  scene.add(dirLight);

  helper = new THREE.DirectionalLightHelper(dirLight, 5);
  scene.add(helper);

  var s1 = new Spotlight(0, 150, 0, ico, 0.4);
  scene.add(s1);
  spotlights.push(s1);

  var s2 = new Spotlight(160, 150, -70, ico, 0.4);
  scene.add(s2);
  spotlights.push(s2);

  var s3 = new Spotlight(160, 150, 70, ico, 0.4);
  scene.add(s3);
  spotlights.push(s3);

  var s4 = new Spotlight(-100, 10, -30, painting, 0.9);
  scene.add(s4);
  spotlights.push(s4);
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
        cameras[camera].aspect =
            renderer.getSize().width / renderer.getSize().height;
        cameras[camera].updateProjectionMatrix();
      }
    } else {
      cameras[camera].left = -window.innerWidth / camFactor;
      cameras[camera].right = window.innerWidth / camFactor;
      cameras[camera].top = window.innerHeight / camFactor;
      cameras[camera].bottom = -window.innerHeight / camFactor;
      cameras[camera].updateProjectionMatrix();
    }
  }
}


function onKeyDown(e) {
  switch (e.keyCode) {
    case 49:  // 1
      spotlights[0].toggleLight()
      break;
    case 50:  // 2
      spotlights[1].toggleLight()
      break;
    case 51:  // 3
      spotlights[2].toggleLight()
      break;
    case 52:  // 4
      spotlights[3].toggleLight()
      break;
    case 53:  // 5
      camera = 1;
      break;
    case 54:  // 6
      camera = 0;
      break;
    case 55:  // 7
      camera = 2
      break;
    case 81:  // Q
      dirLight.visible = !dirLight.visible;
      break;
    case 87:  // W
      if (currMat == 0) {
        currMat = prevMat;
      } else {
        prevMat = currMat;
        currMat = 0;
      }
      break;
    case 69:  // E
      if (currMat != 0) {
        currMat == 1 ? currMat = 2 : currMat = 1;
      }
      prevMat == 1 ? prevMat = 2 : prevMat = 1;
      break;
  }
}

function onKeyUp(e) {
  'use strict';
}

function animate() {
  'use strict';


  if (lastMat != currMat) {
    lastMat = currMat;
    for (let i = 0; i < objs.length; i++) {
      objs[i].toggleMaterial(currMat);
    }
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