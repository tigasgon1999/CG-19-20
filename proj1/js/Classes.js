class Object3D extends THREE.Object3D {
  constructor(x, y, z, material) {
    super();

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    this.material = material
  }
}

class Arm extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);
    this.addCube(x, y, z);
    this.addSphere(x, y, z);
    this.addForearm(x, y, z);
  }

  addCube(x, y, z) {}
  addSphere(x, y, z) {}
  addForearm(x, y, z) {}
}

class Car extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);

    this.addTableTop(x, 4.5, z);
    this.addWheel(x - 20, 2, z - 7.5);
    this.addWheel(x - 20, 2, z + 7.5);
    this.addWheel(x + 20, 2, z - 7.5);
    this.addWheel(x + 20, 2, z + 7.5);
    this.addSphericalCap(x, 5, z);

    // this.addArm(0, 5, 0);
  }

  addArm(x, y, z) {
    var arm = new Arm(x, y, z, this.material);
    this.arm = arm;
    this.add(arm);
  }

  addTableTop(x, y, z) {
    'use strict';


    var geometry = new THREE.CubeGeometry(40, 1, 15);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addWheel(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(2, 7, 7);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addSphericalCap(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        2.5, 20, 20, 0, 6.3, 0, 0.5 * Math.PI);  // Semisphere
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
}

class Stand extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);

    this.addCylinder(x, 15, z);
  }

  addCylinder(x, y, z) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(6, 6, 30, 30, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
}

class Target extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);

    this.addToroid(x, 5, z);
  }

  addToroid(x, y, z) {
    'use strict';

    var geometry = new THREE.TorusGeometry(4, 1, 20, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
}