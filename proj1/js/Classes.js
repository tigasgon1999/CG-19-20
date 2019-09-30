class Object3D extends THREE.Object3D {
  constructor(x, y, z) {
    super();

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

class Car extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z);

    this.material = material;

    this.addTableTop(0, 0, 0);
    this.addWheel(-25, -1, -8);
    this.addWheel(-25, -1, 8);
    this.addWheel(25, -1, -8);
    this.addWheel(25, -1, 8);
  }

  addTableTop(x, y, z, material) {
    'use strict';


    geometry = new THREE.CubeGeometry(60, 2, 20);
    mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addWheel(x, y, z, material) {
    'use strict';

    geometry = new THREE.SphereGeometry(2, 7, 7);
    mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y - 2, z);

    this.add(mesh);
  }
}