/*global THREE*/

var cameras = [], scene, renderer, camFactor = 12;
var camera = 1;
var newcam = 1;

var objs = [];

var dirLight;
var toggleDir;
var ico;
var painting;

var currMat = 1;
var prevMat = 1;
var lastMat = 1;

var spotlights = [];  // [spot1, spot2, spot3,spot4]
var lights = [];

function createCamera() {
  'use strict';

  var cameraO = new THREE.OrthographicCamera(
      window.innerWidth / -camFactor, window.innerWidth / camFactor,
      window.innerHeight / camFactor, window.innerHeight / -camFactor, 1, 1300);

  cameraO.position.x = painting.position.x;
  cameraO.position.y = painting.position.y;
  cameraO.position.z = painting.position.z + 700;
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

  // var backWall = new Wall(0, 0, -100, 500, 200, 0);
  // objs.push(backWall);
  // scene.add(backWall);

  // var sideWall1 = new Wall(250, 0, 50, 300, 200, Math.PI / 2);
  // objs.push(sideWall1);
  // scene.add(sideWall1);

  // var sideWall2 = new Wall(-250, 0, 50, 300, 200, Math.PI / 2);
  // objs.push(sideWall2);
  // scene.add(sideWall2);

  // var floor = new Floor(0, 0, 0, 500, 300);
  // objs.push(floor);
  // scene.add(floor);

  var backWall = new TiledWall(0, 0, -150, 500, 200, 0, 100);
  objs.push(backWall);
  scene.add(backWall);

  var sideWall1 = new TiledWall(250, 0, 0, 300, 200, Math.PI / 2, 100);
  objs.push(sideWall1);
  scene.add(sideWall1);

  // var sideWall2 = new TiledWall(-250, 0, 0, 300, 200, Math.PI / 2, 100);
  // objs.push(sideWall2);
  // scene.add(sideWall2);

  var floor = new TiledFloor(0, 0, 0, 500, 300, 100);
  objs.push(floor);
  scene.add(floor);

  painting = new Painting(-60, 110, backWall.position.z, 20, 10, 3);
  objs.push(painting);
  scene.add(painting);

  var stand = new Stand(100, 0, -20, 50);
  objs.push(stand);
  scene.add(stand);

  ico = new Icosahedron(
      stand.position.x, stand.h + 2 * stand.baseH, stand.position.z, 10);
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
  toggleDir = false;

  // helper = new THREE.DirectionalLightHelper(dirLight, 5);
  // scene.add(helper);

  let r = 130;
  let h = 180;

  let p1 = new THREE.Vector3(ico.position.x - r, h, ico.position.z);

  var s1 = new Spotlight(p1.x, p1.y, p1.z, ico, 0.5);
  scene.add(s1);
  spotlights.push(s1);
  lights.push(false);

  let p2 = new THREE.Vector3(
      ico.position.x + r * Math.cos(Math.PI / 3), h,
      ico.position.z - r * Math.sin(Math.PI / 3));

  var s2 = new Spotlight(p2.x, p2.y, p2.z, ico, 0.5);
  scene.add(s2);
  spotlights.push(s2);
  lights.push(false);

  let p3 = new THREE.Vector3(
      ico.position.x + r * Math.cos(Math.PI / 3), h,
      ico.position.z + r * Math.sin(Math.PI / 3));

  var s3 = new Spotlight(p3.x, p3.y, p3.z, ico, 0.5);
  scene.add(s3);
  spotlights.push(s3);
  lights.push(false);

  var s4 = new Spotlight(
      painting.position.x, 10, painting.position.z + 100, painting, 0.9);
  scene.add(s4);
  spotlights.push(s4);
  lights.push(false);
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
    case 49:  // 1
      lights[0] = true;
      break;
    case 50:  // 2
      lights[1] = true;
      break;
    case 51:  // 3
      lights[2] = true;
      break;
    case 52:  // 4
      lights[3] = true;
      break;
    case 53:  // 5
      newcam = 1;
      break;
    case 54:  // 6
      newcam = 0;
      break;
    case 55:  // 7
      newcam = 2
      break;
    case 81:  // Q
      toggleDir = true;
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

  if (newcam != camera) {
    camera = newcam;
  }


  if (lastMat != currMat) {
    lastMat = currMat;
    for (let i = 0; i < objs.length; i++) {
      objs[i].toggleMaterial(currMat);
    }
  }

  for (let i = 0; i < lights.length; i++) {
    if (lights[i]) {
      spotlights[i].toggleLight();
      lights[i] = false;
    }
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