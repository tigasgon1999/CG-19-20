/*global THREE*/

var cameras = [], scene, renderer, camFactor = 10;
var camera = 0;

var walls = [];
var cannons = [];
var balls = [];
var cannon = 1;
var rotV = 0.5;
var time = new Date();
var h = 30;  // Height of walls
var r = 2;   // Radius of balls
var N = 2;   // Number of balls
var v = 80;
const a = -20;

function createCamera() {
  'use strict';

  var cameraO = new THREE.OrthographicCamera(
      window.innerWidth / -camFactor, window.innerWidth / camFactor,
      window.innerHeight / camFactor, window.innerHeight / -camFactor, 1, 1000);

  cameraO.position.y = 1000;
  cameras.push(cameraO);

  var cameraP = new THREE.PerspectiveCamera(
      50, window.innerWidth / window.innerHeight, 1, 1000);
  cameraP.position.x = 60;
  cameraP.position.y = 120;
  cameraP.position.z = 100;
  cameras.push(cameraP);
  cameraP.lookAt(scene.position);

  // var cameraP2 = new THREE.PerspectiveCamera(
  //   50, window.innerWidth / window.innerHeight, 1, 1000);
  // cameraP2.position.x = 20;
  // cameraP2.position.y = 30;
  // cameraP2.position.z = 20;
  // cameras.push(cameraP2);
  // cameraP2.lookAt(scene.position);
}

function createScene() {
  'use strict';

  scene = new THREE.Scene();


  var wall1 = new Wall(-3 * h, 0, 0, h, 0);
  walls.push(wall1);
  scene.add(wall1);

  var wall2 = new Wall(-1.5 * h, 0, -1.5 * h, h, Math.PI / 2);
  walls.push(wall2);
  scene.add(wall2);

  var wall3 = new Wall(-1.5 * h, 0, 1.5 * h, h, Math.PI / 2);
  walls.push(wall3);
  scene.add(wall3);

  var a = new THREE.AxesHelper(10);
  scene.add(a);

  for (var i = 0; i < N; i++) {
    var valid = false;
    var ball = new Ball(0, 0, 0, r, 0);
    while (!valid) {
      valid = true;
      var randx = -3 * h + (Math.random() * 1.5 * h) + 2 * r;
      var randz = (Math.random() * 2 * h) - h;
      ball.position.x = randx;
      ball.position.z = randz;
      for (var j = 0; j < balls.length; j++) {
        if (balls[j].isCoincident(ball)) {
          valid = false;
        }
      }
    }
    balls.push(ball);
    scene.add(ball);
  }

  var cannon1 = new Cannon(20, 0, 1.5 * h - 10, 1, Math.PI - 0.2);
  cannons.push(cannon1);
  scene.add(cannon1);

  var cannon2 = new Cannon(20, 0, 0, 1, Math.PI);
  cannons.push(cannon2);
  scene.add(cannon2);

  var cannon3 = new Cannon(20, 0, 10 - (1.5 * h), 1, Math.PI + 0.2);
  cannons.push(cannon3);
  scene.add(cannon3);
}

function render() {
  'use strict';
  renderer.render(scene, cameras[camera]);
}

function onResize() {
  'use strict';

  renderer.setSize(window.innerWidth, window.innerHeight);

  if (camera == 0) {
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

function toggleWireframe(obj) {
  'use strict';
  obj.toggleWireframe();
}

function onKeyDown(e) {
  switch (e.keyCode) {
    case 49:  // 1
      camera = 0;
      break;
    case 50:  // 2
      camera = 1;
      break;
    case 51:  // 3
      camera = 2;
      break;
    case 81:  // q
      cannon = 0;
      break;
    case 87:  // w
      cannon = 1;
      break;
    case 69:  // e
      cannon = 2;
      break;
    case 37:  // <-
      cannons[cannon].left = true;
      break;
    case 39:  // ->
      cannons[cannon].right = true;
      break;
    case 32:  // Space
      cannons[cannon].fire = true;
  }
}

function onKeyUp(e) {
  'use strict';

  switch (e.keyCode) {
    case 37:  // <-
      cannons[cannon].left = false;
      break;
    case 39:  // ->
      cannons[cannon].right = false;
      break;
  }
}

function animate() {
  'use strict';

  var newTime = new Date();
  var elapsed = (newTime - time) / 1000;
  time = newTime;

  if (cannon == 0) {
    cannons[0].setColor(new THREE.Color(0x00ff00));
    cannons[1].setColor(new THREE.Color(0xff0000));
    cannons[2].setColor(new THREE.Color(0xff0000));
  } else if (cannon == 1) {
    cannons[1].setColor(new THREE.Color(0x00ff00));
    cannons[0].setColor(new THREE.Color(0xff0000));
    cannons[2].setColor(new THREE.Color(0xff0000));
  } else if (cannon == 2) {
    cannons[2].setColor(new THREE.Color(0x00ff00));
    cannons[0].setColor(new THREE.Color(0xff0000));
    cannons[1].setColor(new THREE.Color(0xff0000));
  }

  if (camera == 0) {
    cameras[0].lookAt(scene.position);
  } else if (camera == 1) {
    cameras[1].lookAt(scene.position);
  } else if (camera == 2) {
    var currentBall = balls[balls.length-1]
    currentBall.updateCamera();
    cameras[2].lookAt(currentBall.position);
    // cameras[2].position.x = currentBall.position.x + 30;
    // cameras[2].position.z = currentBall.position.z;

  }

  if (cannons[cannon].left) {
    cannons[cannon].rotate(rotV * elapsed);
  }
  if (cannons[cannon].right) {
    cannons[cannon].rotate(-rotV * elapsed);
  }

  if (cannons[cannon].fire) {
    cannons[cannon].fire = false;
    cannons[cannon].fireBall(r, v);
  }

  for (var i = 0; i < balls.length; i++) {
    balls[i].move(elapsed);
  }

  for (var j = 0; j < walls.length; j++) {
    for (var k = 0; k < balls.length; k++) {
      if (walls[j].ballHit(balls[k])) {
        balls[k].v = 0;
      }
    }
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
  balls[balls.length-1].addCamera();

  window.addEventListener('resize', onResize);
  window.addEventListener('keydown', onKeyDown);
  window.addEventListener('keyup', onKeyUp);
}