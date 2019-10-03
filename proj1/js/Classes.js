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

    this.addSphericalCap(x, 0, z);
    this.addParallelepiped(x, 2.5, z);
    this.addForearm(x, 21, z);
    this.forearm.rotation.z = -Math.PI / 2;
  }

  addSphericalCap(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        2.5, 20, 20, 0, 6.3, 0, 0.5 * Math.PI);  // Semisphere
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addParallelepiped(x, y, z) {
    'use strict';

    var geometry = new THREE.CubeGeometry(2, 16, 2);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + 8, z);

    this.add(mesh);
  }

  addSphere(x, y, z){
    'use strict';

    var geometry = new THREE.SphereGeometry(2.5, 7, 7);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + 2, z);

    this.add(mesh);
  }
  
  addForearm(x, y, z){
    var forearm = new Forearm(x, y, z, this.material);
    this.forearm = forearm;

    this.add(forearm);
  }

}


class Forearm extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);

    this.addSphere(x, -2.5, z);
    this.addParallelepiped(x, 2.5, z);
    this.addSphere(x,  18.5, z);
    this.addHand(x,  23.5, z);
    this.addFinger(x - 2,  25, z);
    this.addFinger(x + 2,  25, z);

  }

  addSphere(x, y, z){
    'use strict';

    var geometry = new THREE.SphereGeometry(2.5, 20, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y+2.5, z);

    this.add(mesh);
  }

  addParallelepiped(x, y, z) {
    'use strict';

    var geometry = new THREE.CubeGeometry(2, 16, 2);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + 8, z);

    this.add(mesh);
  }

  addHand(x, y, z){
    'use strict'

    var geometry = new THREE.CubeGeometry(5, 1.5, 1);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y +0.75, z);

    this.add(mesh);
  }

  addFinger(x, y, z){
    'use strict'

    var geometry = new THREE.CubeGeometry(1, 3, 1);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y+1.5, z);

    this.add(mesh);
  }
}

class Car extends Object3D {
  constructor(x, y, z, material) {
    super(x, y, z, material);

    this.addTableTop(x, 4.5, z);
    this.addWheel(x - 20, 2, z - 7.5);
    this.addWheel(x - 20, 2, z + 7.5);
    this.addWheel(x + 20, 2, z - 7.5);
    this.addWheel(x + 20, 2, z + 7.5);

    this.addArm(0, 5, 0);
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

  addArm(x, y, z){
    var arm = new Arm(x, y, z, this.material);
    this.arm = arm;
    
    this.add(arm);
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