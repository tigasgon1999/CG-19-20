/*global THREE*/

var camera, scene, renderer;
var v = 20;
var rotV = 1;
var time = new Date();
var camFactor = 20

var objects = [];  // [Car, Stand, Target]

function createCamera() {
  'use strict';
  camera = new THREE.OrthographicCamera(
      window.innerWidth / -camFactor, window.innerWidth / camFactor,
      window.innerHeight / camFactor, window.innerHeight / -camFactor, 1, 1000);

  camera.position.z = 500;
  camera.lookAt(scene.position);

  /*camera = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 1000);
  camera.position.x = -80;
  camera.position.y = 60;
  camera.position.z = 100;
  camera.lookAt(scene.position);*/
}

function createScene() {
  'use strict';

  scene = new THREE.Scene();

  var material;

  var car = new Car(
      0, 0, 0, {l: 40, h: 1, w: 15, c: 0x00ff00}, {r: 2, c: 0xa9a9a9},
      {r: 2.5, c: 0xff0000}, {l: 2, h: 16, w: 2, c: 0x00ff00},
      {r: 2.5, c: 0xff0000}, {l: 5, h: 1.5, w: 1, c: 0xffff00},
      {l: 1, h: 3, w: 1, c: 0xffff00});
  objects.push(car);
  scene.add(car);

  var stand = new Stand(40, 0, 0, material);
  objects.push(stand);
  scene.add(stand)

  var target = new Target(40, 30, 0);
  objects.push(target);
  scene.add(target);
}

function render() {
  'use strict';
  renderer.render(scene, camera);
}

function onResize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.left = -window.innerWidth / camFactor;
  camera.right = window.innerWidth / camFactor;
  camera.top = window.innerHeight / camFactor;
  camera.bottom = -window.innerHeight / camFactor;
  camera.updateProjectionMatrix();
}

function toggleWireframe(obj) {
  'use strict';
  obj.toggleWireframe();
}

function onKeyDown(e) {
  'use strict';

  switch (e.keyCode) {
    case 49:  // 1
      camera.position.x = 0;
      camera.position.y = 500;
      camera.position.z = 0
      camera.lookAt(scene.position)
      break;
    case 50:  // 2
      camera.position.x = 0;
      camera.position.y = 0;
      camera.position.z = 500
      camera.lookAt(scene.position)
      break;
    case 51:  // 3
      camera.position.x = -500;
      camera.position.y = 0;
      camera.position.z = 0
      camera.lookAt(scene.position)
      break;
    case 52:  // 4
      objects.forEach(toggleWireframe);
      break;
    case 37:  // Arrow left
      objects[0].left = true;
      break;
    case 38:  // Arrow up
      objects[0].front = true;
      break;
    case 39:  // Arrow right
      objects[0].right = true;
      break;
    case 40:  // Arrow down
      objects[0].back = true;
      break;
    case 87:  // W
      objects[0].armFront = true;
      break;
    case 81:  // Q
      objects[0].armBack = true;
      break;
    case 65:  // A
      objects[0].armLeft = true;
      break;
    case 83:  // S
      objects[0].armRight = true;
      break;
  }
}

function onKeyUp(e) {
  'use strict';

  switch (e.keyCode) {
    case 37:  // Arrow left
      objects[0].left = false;
      break;
    case 38:  // Arrow up
      objects[0].front = false;
      break;
    case 39:  // Arrow right
      objects[0].right = false;
      break;
    case 40:  // Arrow down
      objects[0].back = false;
      break;
    case 87:  // W
      objects[0].armFront = false;
      break;
    case 81:  // Q
      objects[0].armBack = false;
      break;
    case 65:  // A
      objects[0].armLeft = false;
      break;
    case 83:  // S
      objects[0].armRight = false;
      break;
  }
}

function animate() {
  'use strict';

  var newTime = new Date();

  var elapsed = (newTime - time) / 1000
  time = new Date();

  // Move back
  if (objects[0].back) {
    objects[0].moveX(-v * elapsed);
  }
  // Move left
  if (objects[0].left) {
    objects[0].moveZ(-v * elapsed);
  }
  // Move front
  if (objects[0].front) {
    objects[0].moveX(v * elapsed);
  }
  // Move right
  if (objects[0].right) {
    objects[0].moveZ(v * elapsed);
  }
  // Arm front
  if (objects[0].armFront) {
    objects[0].rotateZ(-rotV * elapsed);
  }
  // Arm back
  if (objects[0].armBack) {
    objects[0].rotateZ(rotV * elapsed);
  }
  // Arm left
  if (objects[0].armLeft) {
    objects[0].rotateY(rotV * elapsed);
  }
  // Arm right
  if (objects[0].armRight) {
    objects[0].rotateY(-rotV * elapsed);
  }

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

  render();

  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}