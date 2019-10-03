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

    this.addShpere(x, y + 12, z);
    this.addParallelepiped(x, y, z);
    this.addForearm(x, y + 16, z);
  }

  addShpere(x, y, z){
    'use strict';

    var geometry = new THREE.SphereGeometry(2, 7, 7);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + 2, z);

    this.add(mesh);
  }

  addParallelepiped(x, y, z){
    'use strict';

    var geometry = new THREE.CubeGeometry(12, 2, 2);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
  
  addForearm(x, y, z){
    var forearm = new Forearm(x, y, z);
    this.forearm = forearm;
    this.forearm.rotation = 90;
    this.add(forearm);
  }

}


class Forearm extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);

    this.addParallelepiped(x, y, z);
    this.addSphere(x, y + 12, z);
    this.addHand(x, y + 16, z);
    this.addFinger(x - 2.5, y + 18, z);
    this.addFinger(x + 2.5, y + 18, z);
  }

  addShpere(x, y, z){
    'use strict';

    var geometry = new THREE.SphereGeometry(2, 7, 7);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + 2, z);

    this.add(mesh);
  }

  addParallelepiped(x, y, z){
    'use strict';

    var geometry = new THREE.CubeGeometry(12, 3, 3);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addHand(x, y, z){
    var geometry = new THREE.CubeGeometry(5, 2, 2);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + 2, z);

    this.add(mesh);
  }

  addFinger(x, y, z){
    var geometry = new THREE.CubeGeometry(3, 1, 1);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
}


class Car extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);

    this.addTableTop(0, 0, 0);
    this.addWheel(-25, -1, -8);
    this.addWheel(-25, -1, 8);
    this.addWheel(25, -1, -8);
    this.addWheel(25, -1, 8);
    this.addSphericalCap(0, 0, 0)
  }

  addTableTop(x, y, z) {
    'use strict';


    var geometry = new THREE.CubeGeometry(60, 2, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addWheel(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(2, 7, 7);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y - 2, z);

    this.add(mesh);
  }

  addSphericalCap(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        5, 20, 20, 0, 6.3, 0, 0.5 * Math.PI);  // Semisphere
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + 1, z);

    this.add(mesh);
  }
}

class Stand extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);

    this.addCylinder(0, 10, 0);
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

    this.addToroid(0, 0, 0);
  }

  addToroid(x, y, z) {
    'use strict';

    var geometry = new THREE.TorusGeometry(4, 1, 20, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
}