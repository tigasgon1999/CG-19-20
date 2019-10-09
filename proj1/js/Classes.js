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

    this.addSphere(x, -(2.5 * k), z, k);
    this.addParallelepiped(x, (2.5 * k), z, k);
    this.addSphere(x, (18.3 * k), z, k);
    this.addHand(x, (23.5 * k), z, k);
    this.addFinger(x - (3.5 * k), (25 * k), z, k);
    this.finger = this.addFinger(x + (3.5 * k), (25 * k), z, k);
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

    var geometry = new THREE.SphereGeometry((2 * k), (20 * k), (20 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.sphere);
    mesh.position.set(x, y + (2.5 * k), z);

    this.add(mesh);
  }

  addParallelepiped(x, y, z, k) {
    'use strict';

    var geometry = new THREE.CubeGeometry((2 * k), (16 * k), (2 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.cube);
    mesh.position.set(x, y + (8 * k), z);

    this.add(mesh);
  }

  addHand(x, y, z, k) {
    'use strict'

    var geometry = new THREE.CubeGeometry((8 * k), (1.5 * k), (1 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.hand);
    mesh.position.set(x, y + (0.65 * k), z);

    this.add(mesh);
  }

  addFinger(x, y, z, k) {
    'use strict'

    var geometry = new THREE.CubeGeometry((1 * k), (4 * k), (1 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.hand);
    mesh.position.set(x, y + (2 * k), z);

    this.add(mesh);

    return mesh;
  }
}

class Arm extends Object3D {
  constructor(x, y, z, k) {
    'use strict';
    super(x, y, z);

    this.material = new THREE.MeshBasicMaterial(
        {color: 0x0000ff, wireframe: true, side: THREE.DoubleSide});

    this.addParallelepiped(x, 2.5 * k, z, k);
    this.addForearm(x, 21 * k, z, k);
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

    var geometry = new THREE.CubeGeometry(2 * k, 16 * k, 2 * k);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + (8 * k), z);
    this.pipe = mesh;

    this.add(mesh);
  }

  addForearm(x, y, z, k) {
    'use strict';
    var forearm = new Forearm(x, y - (0.2 * k), z, k);
    this.forearm = forearm;

    this.add(forearm);
  }
}
class Car extends Object3D {
  constructor(x, y, z, k) {
    'use strict';
    super(x, y, z);

    this.k = k;

    this.materials = {
      car: new THREE.MeshBasicMaterial(
          {color: 0x00ff00, wireframe: true, side: THREE.DoubleSide}),
      wheel: new THREE.MeshBasicMaterial(
          {color: 0xa9a9a9, wireframe: true, side: THREE.DoubleSide}),

      sphere: new THREE.MeshBasicMaterial(
          {color: 0xff0000, wireframe: true, side: THREE.DoubleSide})
    };

    this.addTableTop(x * k, 4.5 * k, z * k, k);
    this.addWheel((x - 20) * k, 2 * k, (z - 7.5) * k, k);
    this.addWheel((x - 20) * k, 2 * k, (z + 7.5) * k, k);
    this.addWheel((x + 20) * k, 2 * k, (z - 7.5) * k, k);
    this.addWheel((x + 20) * k, 2 * k, (z + 7.5) * k, k);
    this.addSphericalCap(x * k, 5 * k, z * k, k);
    this.addArm(x * k, 5 * k, z * k, k);
  }

  checkRotation(delta) {
    var v1 = new THREE.Vector3();
    var v2 = new THREE.Vector3();

    if (delta < 0) {
      v1.y = 1.5;
      v1.z = 0.5;
      this.arm.forearm.finger.localToWorld(v1);
      if (v1.y < 0.5) {
        return false;
      }
      return true;

    } else if (delta > 0) {
      v2.y = -8;
      v2.x = -1;
      this.arm.pipe.localToWorld(v2);
      console.log(v2.y);
      if (v2.y < (5 * this.k) + (0.5 * this.k)) {
        return false;
      }
      return true;
    }
    return true;
  }

  scaleObj(k) {
    this.scale.copy(new THREE.Vector3(k, k, k));
    this.k = k;
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
        (2.5 * k), 20, 20, 0, 6.3, 0, 0.5 * Math.PI);  // Semisphere
    var mesh = new THREE.Mesh(geometry, this.materials.sphere);
    mesh.position.set(x, y, z);
    this.sphericalCap = mesh;

    this.add(mesh);
  }

  addArm(x, y, z, k) {
    'use strict';
    var arm = new Arm(x, y, z, k);
    this.arm = arm;
    this.add(arm);
  }

  addTableTop(x, y, z, k) {
    'use strict';

    var geometry = new THREE.CubeGeometry((40 * k), (1 * k), (15 * k));
    var mesh = new THREE.Mesh(geometry, this.materials.car);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addWheel(x, y, z, k) {
    'use strict';

    var geometry = new THREE.SphereGeometry(2 * k, 7 * k, 7 * k);
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