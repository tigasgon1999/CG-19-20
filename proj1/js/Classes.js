class Object3D extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';
    super();

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

class Forearm extends Object3D {
  constructor(x, y, z) {
    'use strict';
    super(x, y, z);
    this.materials = {
      sphere: new THREE.MeshBasicMaterial(
          {color: 0xff0000, wireframe: true, side: THREE.DoubleSide}),
      cube: new THREE.MeshBasicMaterial(
          {color: 0x00ff00, wireframe: true, side: THREE.DoubleSide}),
      hand: new THREE.MeshBasicMaterial(
          {color: 0xffff00, wireframe: true, side: THREE.DoubleSide})
    };

    this.addSphere(x, -2.5, z);
    this.addParallelepiped(x, 2.5, z);
    this.addSphere(x, 18.3, z);
    this.addHand(x, 23.5, z);
    this.addFinger(x - 2, 25, z);
    this.addFinger(x + 2, 25, z);
  }

  toggleWireframe() {
    'use strict';
    this.materials.sphere.wireframe = !this.materials.sphere.wireframe;
    this.materials.cube.wireframe = !this.materials.cube.wireframe;
    this.materials.hand.wireframe = !this.materials.hand.wireframe;
  }

  rotateZ(delta) {
    'use strict';
    this.rotation.z += delta;
  }

  addSphere(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(2.5, 20, 20);
    var mesh = new THREE.Mesh(geometry, this.materials.sphere);
    mesh.position.set(x, y + 2.5, z);

    this.add(mesh);
  }

  addParallelepiped(x, y, z) {
    'use strict';

    var geometry = new THREE.CubeGeometry(2, 16, 2);
    var mesh = new THREE.Mesh(geometry, this.materials.cube);
    mesh.position.set(x, y + 7.9, z);

    this.add(mesh);
  }

  addHand(x, y, z) {
    'use strict'

    var geometry = new THREE.CubeGeometry(5, 1.5, 1);
    var mesh = new THREE.Mesh(geometry, this.materials.hand);
    mesh.position.set(x, y + 0.65, z);

    this.add(mesh);
  }

  addFinger(x, y, z) {
    'use strict'

    var geometry = new THREE.CubeGeometry(1, 3, 1);
    var mesh = new THREE.Mesh(geometry, this.materials.hand);
    mesh.position.set(x, y + 1.5, z);

    this.add(mesh);
  }
}

class Arm extends Object3D {
  constructor(x, y, z) {
    'use strict';
    super(x, y, z);

    this.material = new THREE.MeshBasicMaterial(
        {color: 0x0000ff, wireframe: true, side: THREE.DoubleSide});

    this.addParallelepiped(x, 2.5, z);
    this.addForearm(x, 21, z);
    this.forearm.rotateZ(-Math.PI / 2);
  }

  toggleWireframe() {
    'use strict';
    this.material.wireframe = !this.material.wireframe;
    this.forearm.toggleWireframe();
  }

  rotateY(delta) {
    'use strict';
    this.rotation.y += delta;
  }

  rotateZ(delta) {
    'use strict';
    this.rotation.z += delta;
  }

  addParallelepiped(x, y, z) {
    'use strict';

    var geometry = new THREE.CubeGeometry(2, 16, 2);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + 7.9, z);
    this.pipe = mesh;

    this.add(mesh);
  }

  addForearm(x, y, z) {
    'use strict';
    var forearm = new Forearm(x, y - 0.2, z);
    this.forearm = forearm;

    this.add(forearm);
  }
}

class Car extends Object3D {
  constructor(x, y, z) {
    'use strict';
    super(x, y, z);
    this.materials = {
      car: new THREE.MeshBasicMaterial(
          {color: 0x00ff00, wireframe: true, side: THREE.DoubleSide}),
      wheel: new THREE.MeshBasicMaterial(
          {color: 0xa9a9a9, wireframe: true, side: THREE.DoubleSide}),

      sphere: new THREE.MeshBasicMaterial(
          {color: 0xff0000, wireframe: true, side: THREE.DoubleSide})
    };

    this.addTableTop(x, 4.5, z);
    this.addWheel(x - 20, 2, z - 7.5);
    this.addWheel(x - 20, 2, z + 7.5);
    this.addWheel(x + 20, 2, z - 7.5);
    this.addWheel(x + 20, 2, z + 7.5);
    this.addSphericalCap(x, 5, z);
    this.addArm(0, 5, 0);
  }

  toggleWireframe() {
    'use strict';
    this.materials.car.wireframe = !this.materials.car.wireframe;
    this.materials.wheel.wireframe = !this.materials.wheel.wireframe;
    this.materials.sphere.wireframe = !this.materials.sphere.wireframe;
    this.arm.toggleWireframe();
  }

  moveX(delta) {
    'use strict';
    this.position.x += delta;
  }

  moveZ(delta) {
    'use strict';
    this.position.z += delta;
  }

  rotateY(delta) {
    'use strict';
    this.arm.rotateY(delta);
  }

  rotateZ(delta) {
    'use strict';
    this.arm.rotateZ(delta)
  }

  addSphericalCap(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        2.5, 20, 20, 0, 6.3, 0, 0.5 * Math.PI);  // Semisphere
    var mesh = new THREE.Mesh(geometry, this.materials.sphere);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addArm(x, y, z) {
    'use strict';
    var arm = new Arm(x, y, z);
    this.arm = arm;
    this.add(arm);
  }

  addTableTop(x, y, z) {
    'use strict';


    var geometry = new THREE.CubeGeometry(40, 1, 15);
    var mesh = new THREE.Mesh(geometry, this.materials.car);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addWheel(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(2, 7, 7);
    var mesh = new THREE.Mesh(geometry, this.materials.wheel);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
}

class Stand extends Object3D {
  constructor(x, y, z) {
    'use strict';
    super(x, y, z);

    this.material = new THREE.MeshBasicMaterial(
        {color: 0x800080, wireframe: true, side: THREE.DoubleSide});

    this.addCylinder(x, 15, z);
  }

  addCylinder(x, y, z) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(6, 6, 30, 30, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  toggleWireframe() {
    this.material.wireframe = !this.material.wireframe;
  }
}

class Target extends Object3D {
  constructor(x, y, z) {
    'use strict';
    super(x, y, z);

    this.material = new THREE.MeshBasicMaterial(
        {color: 0xFFB6C1, wireframe: true, side: THREE.DoubleSide});

    this.addToroid(x, 5, z);
  }

  addToroid(x, y, z) {
    'use strict';

    var geometry = new THREE.TorusGeometry(4, 1, 20, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  toggleWireframe() {
    'use strict';
    this.material.wireframe = !this.material.wireframe;
  }
}