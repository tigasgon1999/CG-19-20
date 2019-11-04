/*global THREE*/

var cameras = [], scene, renderer, camFactor = 10;
var camera = 1;

var dirLight;
var ico;
var painting;

var spotlights = [];

function createCamera() {
  'use strict';

  var cameraO = new THREE.OrthographicCamera(
      window.innerWidth / -camFactor, window.innerWidth / camFactor,
      window.innerHeight / camFactor, window.innerHeight / -camFactor, 1, 1300);

  cameraO.position.x = -100;
  cameraO.position.y = 50;
  cameraO.position.z = 1000;
  cameras.push(cameraO);

  var cameraP = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 1000);
  cameraP.position.x = -300;
  cameraP.position.y = 400;
  cameraP.position.z = 500;
  cameras.push(cameraP);
  cameraP.lookAt(scene.position);
}

function createScene() {
  'use strict';

  scene = new THREE.Scene();

  var backWall = new Wall(0, 0, -100, 500, 0);
  scene.add(backWall);

  var sideWall = new Wall(250, 0, 50, 300, Math.PI / 2);
  scene.add(sideWall);

  var floor = new Floor(0, 0, 50, 500, 300);
  scene.add(floor);

  painting = new Painting(-100, 50, -100, 20, 6, 2.13);
  scene.add(painting);

  var stand = new Stand(80, 0, 0, 50);
  scene.add(stand);

  ico = new Icosahedron(80, 60, 0, 15);
  scene.add(ico);

  scene.add(new THREE.AxesHelper(10));
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

  var s1 = new Spotlight(40, 150, 100, ico);
  scene.add(s1);
  spotlights.push(s1);

  var s2 = new Spotlight(120, 150, 100, ico);
  scene.add(s2);
  spotlights.push(s2);

  var s3 = new Spotlight(-160, 10, -30, painting);
  scene.add(s3);
  spotlights.push(s3);

  var s4 = new Spotlight(-40, 10, -30, painting);
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
      camera = 0;
      break;
    case 54:  // 6
      camera = 1;
      break;
    case 81:  // Q
      dirLight.visible = !dirLight.visible;
      break;
  }
}

function onKeyUp(e) {
  'use strict';
}

function animate() {
  'use strict';

  render();

  requestAnimationFrame(animate);
}

function init() {
  'use strict';

  renderer = new THREE.WebGLRenderer();

  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = true;
  renderer.shadowMapSoft = true;

  document.body.appendChild(renderer.domElement);

  createScene();
  createLights();
  createCamera();

  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}