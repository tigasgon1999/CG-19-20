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
    this.wallW = 2;
    this.bound = 1.1 * this.wallW;

    this.material = new THREE.MeshBasicMaterial({
      color: 0xa9a9a9,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    var a = new THREE.AxesHelper(10);
    this.add(a);

    this.addWall(0, this.wallH / 2, 0);
  }

  addWall(x, y, z) {
    'use strict';


    var geometry =
        new THREE.CubeGeometry(this.wallW, this.wallH, 3 * this.wallH);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = this.theta;

    this.add(mesh);
  }
}

class Ball extends Object3d {
  constructor(x, y, z, r, v, dir) {
    'use strict';

    super(x, y, z);
    this.bound = 1.25 * r;

    this.v = v;
    this.r = r;
    this.dir = dir.normalize();
    this.camera = new THREE.PerspectiveCamera(
        50, window.innerWidth / window.innerHeight, 1, 1000);

    this.material = new THREE.MeshBasicMaterial(
        {color: getRandomColor(), side: THREE.DoubleSide, wireframe: false});

    this.addBall(0, r, 0, r);
    this.add(new THREE.AxesHelper(this.r));
  }

  addBall(x, y, z, r) {
    'use strict';

    var geometry = new THREE.SphereGeometry(r, 15, 15);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
  addCamera() {
    this.camera.position.x = this.position.x + 30 * this.r;
    this.camera.position.y = 30;
    this.camera.position.z = this.position.z;
    cameras.push(this.camera);
    this.camera.lookAt(this.position);
  }

  updateCamera() {
    this.camera.position.x = this.position.x - this.dir.x * 30;
    this.camera.position.y = 30;
    this.camera.position.z = this.position.z - this.dir.z * 30;
  }

  isCoincident(b) {
    var n = new THREE.Vector3();  // Normal vector between two centres
    n.subVectors(this.position, b.position);
    if (n.length() <= b.bound + this.bound) {
      // 1: Find n and t vectors
      var n = new THREE.Vector3();  // Normal vector between two centres
      n.subVectors(this.position, b.position);
      n.normalize();
      var t = new THREE.Vector3(-n.z, n.y, n.x);

      // 2: find v1 and v2 as vectors
      var v1 = new THREE.Vector3(
          this.dir.x * this.v, this.dir.y * this.v, this.dir.z * this.v)
      var v2 = new THREE.Vector3(b.dir.x * b.v, b.dir.y * b.v, b.dir.z * b.v)

      // 3: Project v1 and v2 in n(v1n, v2n) and t(v1t, v2t)
      var v1n = n.dot(v1);
      var v1t = t.dot(v1);
      var v2n = n.dot(v2);
      var v2t = t.dot(v2);

      // 4: Find v1t' and v2t'
      var v1tt = v1t;
      var v2tt = v2t;

      // 5: Find v1n' and v2n'
      var v1nn = v2n;
      var v2nn = v1n;

      // 6: find v1n, v2n, v1t and v2t as vectors

      var vecv1n = new THREE.Vector3(v1nn * n.x, v1nn * n.y, v1nn * n.z);
      var vecv1t = new THREE.Vector3(v1tt * t.x, v1tt * t.y, v1tt * t.z);
      var vecv2n = new THREE.Vector3(v2nn * n.x, v2nn * n.y, v2nn * n.z);
      var vecv2t = new THREE.Vector3(v2tt * t.x, v2tt * t.y, v2tt * t.z);

      // 7: find final v1 and v2

      vecv1n.add(vecv1t);
      vecv2n.add(vecv2t);

      // 8: get v1f and v2f as scalars
      var v1f = vecv1n.length();
      var v2f = vecv2n.length();

      // 9: get normalized directions
      vecv1n.normalize();
      vecv2n.normalize();

      // 10: add everything up

      this.v = v1f;
      this.dir.copy(vecv1n);

      b.v = v2f;
      b.dir.copy(vecv2n);

      return true;
    }
    return false;
  }

  update(delta) {
    var dx = 0
    var dz = 0
    if (this.v > 0) {
      dx = this.dir.x * this.v * delta;
      dz = this.dir.z * this.v * delta;
      this.v += a * delta;

      if (this.position.x + dx - this.r < minX + 2) {
        this.dir.x *= -1;
      }
      if (this.position.z + dz - this.r < minZ + 2 ||
          this.position.z + dz + this.r > maxZ - 2) {
        this.dir.z *= -1;
      }

      this.translateX(dx);
      this.translateZ(dz);
    }
    else {
      this.v = 0;
      this.dir = new THREE.Vector3();
    }

    this.updateCamera(dx, dz)
  }

  move(delta) {
    if (this.wallz) {
      this.wallz = false;
      this.dir.set(this.dir.x, this.dir.y, -this.dir.z);
    }
    if (this.wallx) {
      this.wallx = false;
      this.dir.set(-this.dir.x, this.dir.y, this.dir.z);
    }
    if (this.v > 0) {
      this.translateX(this.dir.x * this.v * delta);
      this.translateZ(this.dir.z * this.v * delta);
      this.v += a * delta;
    } else {
      this.v = 0;
    }
  }

  isHittingWall(w) {
    var centre = new THREE.Vector3();
    this.localToWorld(centre);

    if (centre.x - this.r < minX + w.bound) {
      this.wallx = true;
    }
    if (centre.z - this.r < minZ + w.bound ||
        centre.z + this.r > maxZ - w.bound) {
      this.wallz = true;
    }
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

  fireBall(r, v) {
    cameras.pop();

    var pos = new THREE.Vector3(this.cannonL / 2, 0, 0);
    var centre = new THREE.Vector3();
    this.localToWorld(pos);
    this.localToWorld(centre);
    var dir = new THREE.Vector3();
    dir.subVectors(pos, centre).normalize();
    var b = new Ball(pos.x, r, pos.z, r, v, dir);
    scene.add(b);
    balls.push(b);
    b.addCamera();
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