/*global THREE*/

var camera, scene, renderer;

var objects = []; // [Car, Stand, Target] 

function createCamera() {
  'use strict';
  camera = new THREE.OrthographicCamera(
      window.innerWidth / -20, window.innerWidth / 20, window.innerHeight / 20,
      window.innerHeight / -20, 0.1, 1000);

  camera.position.z = 500;
  camera.lookAt(scene.position);
}

function createScene() {
  'use strict';

  scene = new THREE.Scene();

  scene.add(new THREE.AxisHelper(10));

  var material, geometry;

  material = new THREE.MeshBasicMaterial(
      {color: 0x00ff00, wireframe: true, side: THREE.DoubleSide});
  var car = new Car(0, 0, 0, material);
  objects.push(car);
  scene.add(car);

  material = new THREE.MeshBasicMaterial(
      {color: 0xff0000, wireframe: true, side: THREE.DoubleSide});
  var stand = new Stand(40, 0, 0, material);
  objects.push(stand);
  scene.add(stand)

  material = new THREE.MeshBasicMaterial(
      {color: 0x0000ff, wireframe: true, side: THREE.DoubleSide});
  var target = new Target(40, 30, 0, material);
  objects.push(target);
  scene.add(target);
}

function render() {
  'use strict';
  renderer.render(scene, camera);
}

function onResize() {
  'use strict';

  renderer.setSize(window.innerWidth, window.innerHeight);

  if (window.innerHeight > 0 && window.innerWidth > 0) {
    camera.aspect = renderer.getSize().width / renderer.getSize().height;
    camera.updateProjectionMatrix();
  }
}

function toggleWireframe(obj) {
  obj.material.wireframe = !obj.material.wireframe;
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
      objects[0].userData.movingLeft = !objects[0].userData.movingLeft;
      break;
    case 38:  // Arrow up
      objects[0].userData.movingUp = !objects[0].userData.movingUp;
      break;
    case 39:  // Arrow right
      objects[0].userData.movingRight = !objects[0].userData.movingRight;
      break;
    case 40:  // Arrow down
      objects[0].userData.movingDown= !objects[0].userData.movingDown;
      break;
  }
}

function onKeyUp(e) {
  'use strict';

  switch (e.keyCode) {
    case 37:  // Arrow left
      objects[0].userData.movingLeft = !objects[0].userData.movingLeft;
      break;
    case 38:  // Arrow up
      objects[0].userData.movingUp = !objects[0].userData.movingUp;
      break;
    case 39:  // Arrow right
      objects[0].userData.movingRight = !objects[0].userData.movingRight;
      break;
    case 40:  // Arrow down
      objects[0].userData.movingDown= !objects[0].userData.movingDown;
      break;
  }
}

function animate() {
  'use strict';

  render();

  // Move left
  if (objects[0].userData.movingLeft) {
    objects[0].position.x -= 0.1;
    console.log("left");
  }
  // Move up
  if (objects[0].userData.movingUp) {
    objects[0].position.z -= 0.1;
    console.log("up");
  }
  // Move right
  if (objects[0].userData.movingRight) {
    objects[0].position.x += 0.1;
    console.log("right");
  }
  // Move down
  if (objects[0].userData.movingDown) {
    objects[0].position.z += 0.1;
    console.log("down");
  }

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