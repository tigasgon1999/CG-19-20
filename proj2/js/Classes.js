class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

class Wall extends Object3d {
  constructor(x, y, z, h, theta) {
    'use strict';

    super(x, y, z);

    this.wallH = h;
    this.theta = theta;

    this.material = new THREE.MeshBasicMaterial({
      color: 0xa9a9a9,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    this.addWall(0, this.wallH / 2, 0);
  }

  addWall(x, y, z) {
    'use strict';


    var geometry = new THREE.CubeGeometry(2, this.wallH, 3 * this.wallH);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = this.theta;

    this.add(mesh);
  }
}

class Ball extends Object3d {
  constructor(x, y, z, r, v) {
    'use strict';

    super(x, y, z);

    this.v = v;
    this.r = r;

    this.material = new THREE.MeshBasicMaterial(
        {color: getRandomColor(), side: THREE.DoubleSide, wireframe: false});

    this.addBall(0, r, 0, r);
  }

  addBall(x, y, z, r) {
    'use strict';

    var geometry = new THREE.SphereGeometry(r, 15, 15);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  isCoincident(b) {
    var xlen = this.position.x - b.position.x;
    var ylen = this.position.y - b.position.y;
    var zlen = this.position.z - b.position.z;
    var d = Math.sqrt(xlen * xlen + ylen * ylen + zlen * zlen);
    return d < b.r + this.r;
  }
}

class Cannon extends Object3d {
  constructor(x, y, z, k, theta) {
    super(x, y, z);

    this.wheelR = 1 * k;
    this.cannonL = 20 * k;
    this.cannonInnerR = 2 * k;
    this.cannonOuterR = 4 * k;
    this.cannonMaterial = new THREE.MeshBasicMaterial({
      color: 0xff0000,
      wireframe: false,
      side: THREE.DoubleSide,
    });
    this.wheelMaterial = new THREE.MeshBasicMaterial({
      color: 0xa9a9a9,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    this.addCannonBody(0, this.wheelR + this.cannonOuterR, 0);
    this.addWheel(-this.cannonL / 2, this.wheelR, this.cannonOuterR);
    this.addWheel(-this.cannonL / 2, this.wheelR, -this.cannonOuterR);
    this.addWheel(this.cannonL / 2, this.wheelR, this.cannonInnerR);
    this.addWheel(this.cannonL / 2, this.wheelR, -this.cannonInnerR);
    this.addRod(
        this.cannonL / 2, this.wheelR + this.cannonOuterR / 2,
        this.cannonInnerR);
    this.addRod(
        this.cannonL / 2, this.wheelR + this.cannonOuterR / 2,
        -this.cannonInnerR);
    this.addRod(
        -this.cannonL / 2, this.wheelR + this.cannoninnerR / 2,
        this.cannonOuterR);
    this.addRod(
        -this.cannonL / 2, this.wheelR + this.cannonOuterR / 2,
        -this.cannonOuterR);
    this.addCap(-this.cannonL / 2, this.wheelR + this.cannonOuterR, 0);

    this.rotation.y = theta;
  }

  rotate(delta) {
    this.rotation.y += delta;
  }

  setColor(c) {
    this.cannonMaterial.color = c;
  }

  addRod(x, y, z) {
    'use strict';

    var geometry =
        new THREE.CylinderGeometry(0.1, 0.1, this.cannonOuterR, 30, 20);
    var mesh = new THREE.Mesh(geometry, this.wheelMaterial);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addCannonBody(x, y, z) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(
        this.cannonInnerR, this.cannonOuterR, this.cannonL, 30, 20);
    var mesh = new THREE.Mesh(geometry, this.cannonMaterial);
    mesh.position.set(x, y, z);
    mesh.rotation.z = -Math.PI / 2;
    this.add(mesh);
  }

  addWheel(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(this.wheelR, 15, 15);
    var mesh = new THREE.Mesh(geometry, this.wheelMaterial);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addCap(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        this.cannonOuterR, 20, 20, 0, 6.3, 0, 0.5 * Math.PI);  // Semisphere
    var mesh = new THREE.Mesh(geometry, this.cannonMaterial);
    mesh.position.set(x, y, z);
    mesh.rotation.z = Math.PI / 2;

    this.add(mesh);
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}