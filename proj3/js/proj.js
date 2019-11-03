/*global THREE*/

var cameras = [], scene, renderer, camFactor = 10;
var camera = 0;

function createCamera() {
  'use strict';

  var cameraO = new THREE.OrthographicCamera(
      window.innerWidth / -camFactor, window.innerWidth / camFactor,
      window.innerHeight / camFactor, window.innerHeight / -camFactor, 1, 1300);

  cameraO.position.z = 1000;
  cameras.push(cameraO);

  var cameraP = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 1000);
  cameraP.position.x = 100;
  cameraP.position.y = 200;
  cameraP.position.z = 200;
  cameras.push(cameraP);
  cameraP.lookAt(scene.position);
}

function createScene() {
  'use strict';

  scene = new THREE.Scene();

  var painting = new Painting(0, 0, 0, 20, 6, 2.13);
  scene.add(painting);
  scene.add(new THREE.AxesHelper(5));
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
      camera = 0;
      break;
    case 50:  // 2
      camera = 1;
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

  document.body.appendChild(renderer.domElement);

  createScene();
  createCamera();

  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}