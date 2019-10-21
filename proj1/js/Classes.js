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
  constructor(x, y, z, k) {
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

    this.sphereR = 2 * k;
    this.armL = 16 * k;
    this.handW = 8 * k;
    this.handL = 1.5 * k;
    this.fingerL = 4 * k;
    this.fingerW = k;

    this.addSphere(0, 0, 0, k);
    this.addParallelepiped(0, this.sphereR + this.armL / 2, 0, k);
    this.addSphere(0, 2 * this.sphereR + this.armL, 0, k);
    this.addHand(0, 3 * this.sphereR + this.armL + this.handL / 2, 0, k);
    this.addFinger(
        -(this.handW / 2 - this.fingerW / 2),
        3 * this.sphereR + this.armL + this.handL + this.fingerL / 2, 0, k);
    this.finger = this.addFinger(
        this.handW / 2 - this.fingerW / 2,
        3 * this.sphereR + this.armL + this.handL + this.fingerL / 2, 0, k);
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

  addSphere(x, y, z, k) {
    'use strict';

    var geometry = new THREE.SphereGeometry(this.sphereR, (20 * k), (20 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.sphere);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addParallelepiped(x, y, z, k) {
    'use strict';

    var geometry = new THREE.CubeGeometry((2 * k), this.armL, (2 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.cube);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addHand(x, y, z, k) {
    'use strict'

    var geometry = new THREE.CubeGeometry(this.handW, this.handL, (1 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.hand);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addFinger(x, y, z, k) {
    'use strict'

    var geometry = new THREE.CubeGeometry((1 * k), this.fingerL, (1 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.hand);
    mesh.position.set(x, y, z);

    this.add(mesh);

    return mesh;
  }
}

class Arm extends Object3D {
  constructor(x, y, z, k, r) {
    'use strict';
    super(x, y, z);

    this.armL = 16 * k;

    this.material = new THREE.MeshBasicMaterial(
        {color: 0x0000ff, wireframe: true, side: THREE.DoubleSide});

    this.addParallelepiped(0, r + (this.armL / 2), 0, k);
    this.addForearm(0, r + this.armL, 0, k);
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

  addParallelepiped(x, y, z, k) {
    'use strict';

    var geometry = new THREE.CubeGeometry(2 * k, this.armL, 2 * k);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);
    this.pipe = mesh;

    this.add(mesh);
  }

  addForearm(x, y, z, k) {
    'use strict';
    var forearm = new Forearm(x, y, z, k);
    this.forearm = forearm;

    this.add(forearm);
  }
}
class Car extends Object3D {
  constructor(x, y, z, k) {
    'use strict';
    super(x, y, z);

    this.k = k;
    this.table = {l: 15 * k, w: 15 * k, h: k};
    this.wheelR = 2 * k;
    this.cap = 2.5 * k;

    this.materials = {
      car: new THREE.MeshBasicMaterial(
          {color: 0x00ff00, wireframe: true, side: THREE.DoubleSide}),
      wheel: new THREE.MeshBasicMaterial(
          {color: 0xa9a9a9, wireframe: true, side: THREE.DoubleSide}),

      sphere: new THREE.MeshBasicMaterial(
          {color: 0xff0000, wireframe: true, side: THREE.DoubleSide})
    };

    this.addTableTop(0, (2 * this.wheelR + this.table.h / 2), 0, k);
    this.addWheel(-(this.table.l) / 2, this.wheelR, -(this.table.w) / 2, k);
    this.addWheel(-(this.table.l) / 2, this.wheelR, (this.table.w) / 2, k);
    this.addWheel((this.table.l) / 2, this.wheelR, -(this.table.w) / 2, k);
    this.addWheel((this.table.l) / 2, this.wheelR, (this.table.w) / 2, k);
    this.addSphericalCap(0, this.table.h + 2 * this.wheelR, 0, k);
    this.addArm(0, this.table.h + 2 * this.wheelR, 0, k, this.cap);
  }

  checkRotation(delta) {
    var v1 = new THREE.Vector3();
    var v2 = new THREE.Vector3();

    if (delta < 0) {
      v1.y = 1.5 * this.k;
      v1.z = 0.5 * this.k;
      this.arm.forearm.finger.localToWorld(v1);
      if (v1.y < 1) {
        return false;
      }
      return true;

    } else if (delta > 0) {
      v2.y = -8 * this.k;
      v2.x = -1 * this.k;
      this.arm.pipe.localToWorld(v2);
      if (v2.y < (5 * this.k) + (0.5 * this.k)) {
        return false;
      }
      return true;
    }
    return true;
  }

  toggleWireframe() {
    'use strict';
    this.materials.car.wireframe = !this.materials.car.wireframe;
    this.materials.wheel.wireframe = !this.materials.wheel.wireframe;
    this.materials.sphere.wireframe = !this.materials.sphere.wireframe;
    this.arm.toggleWireframe();
  }

  move(vec, v, elapsed) {
    'use strict';

    var tot = Math.abs(vec.x) + Math.abs(vec.y) + Math.abs(vec.z);
    vec.x /= tot;
    vec.y /= tot;
    vec.z /= tot;
    this.translateX(vec.x * v * elapsed);
    this.translateY(vec.y * v * elapsed);
    this.translateZ(vec.z * v * elapsed);
  }

  rotateY(delta) {
    'use strict';
    this.arm.rotateY(delta);
  }

  rotateZ(delta) {
    'use strict';
    if (this.checkRotation(delta, k)) {
      this.arm.rotateZ(delta);
    }
  }

  addSphericalCap(x, y, z, k) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        this.cap, 20, 20, 0, 6.3, 0, 0.5 * Math.PI);  // Semisphere
    var mesh = new THREE.Mesh(geometry, this.materials.sphere);
    mesh.position.set(x, y, z);
    this.sphericalCap = mesh;

    this.add(mesh);
  }

  addArm(x, y, z, k, r) {
    'use strict';
    var arm = new Arm(x, y, z, k, r);
    this.arm = arm;
    this.add(arm);
  }

  addTableTop(x, y, z, k) {
    'use strict';

    var geometry =
        new THREE.CubeGeometry(this.table.l, this.table.h, this.table.w);
    var mesh = new THREE.Mesh(geometry, this.materials.car);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addWheel(x, y, z, k) {
    'use strict';

    var geometry = new THREE.SphereGeometry(this.wheelR, 15 * k, 15 * k);
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

    this.addToroid(x, 5.5, z);
  }

  addToroid(x, y, z) {
    'use strict';

    var geometry = new THREE.TorusGeometry(4, 1.5, 20, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  toggleWireframe() {
    'use strict';
    this.material.wireframe = !this.material.wireframe;
  }
}