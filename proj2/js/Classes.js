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

    this.material = new THREE.MeshBasicMaterial({
      color: 0xa9a9a9,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    this.addWall(0, 1.5 * r, 0);
  }

  addWall(x, y, z) {
    'use strict';


    var geometry = new THREE.CubeGeometry(this.wallW, 3 * r, 3 * this.wallH);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = this.theta;

    this.add(mesh);
  }
}

class Ball extends Object3d {
  constructor(x, y, z, r, v, dir) {
    'use strict';

    super(x, y + r, z);
    this.bound = 1.25 * r;

    this.v = v;
    this.r = r;
    this.dir = dir.normalize();
    this.camera = new THREE.PerspectiveCamera(
        50, window.innerWidth / window.innerHeight, 1, 1000);

    this.material = new THREE.MeshBasicMaterial(
        {color: getRandomColor(), side: THREE.DoubleSide, wireframe: true});

    this.addBall(0, 0, 0, r);
    this.axis = new THREE.AxesHelper(this.r * 2);
    this.axis.position.set(0, 0, 0);
    this.axis.visible = currentAxis;
    this.add(this.axis);
  }

  addBall(x, y, z, r) {
    'use strict';

    var geometry = new THREE.SphereGeometry(r, 8, 8);
    geometry.center(this.position)
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

  checkWallCollisions() {
    if (this.position.x > 0) {
      this.falling = true;
      return
    }

    var ballMinX = this.position.x - this.bound;
    var ballMinZ = this.position.z - this.bound;
    var ballMaxZ = this.position.z + this.bound;

    if (ballMinX <= minX + wallBound) {
      this.dir.x *= -1;
    }
    if (ballMinZ <= minZ + wallBound || ballMaxZ >= maxZ - wallBound) {
      this.dir.z *= -1;
    }
  }

  checkBallCollision(b) {
    var n = new THREE.Vector3();
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
    }
  }

  getDistance(b) {
    return Math.sqrt(
        ((this.position.x - b.position.x) ** 2) +
        ((this.position.y - b.position.y) ** 2) +
        ((this.position.z - b.position.z) ** 2))
  }

  isCoincident(b) {
    return this.getDistance(b) <= this.bound + b.bound;
  }

  move(dx, dz) {
    this.matrix.identity();
    var m_trans = new THREE.Matrix4();
    var m_rot = new THREE.Matrix4();
    var axis = new THREE.Vector3(-this.dir.z, 0, this.dir.x);
    var rad = Math.sqrt(dz ** 2 + dx ** 2) / this.r;
    m_trans.makeTranslation(dx, 0, dz);
    m_rot.makeRotationAxis(axis.normalize(), rad);
    this.applyMatrix(m_trans);
    this.matrix.multiply(m_rot);
    this.rotation.setFromRotationMatrix(this.matrix);
  }

  update(delta, self) {
    var dx = 0
    var dz = 0
    if (this.v > 0) {
      dx = this.dir.x * this.v * delta;
      dz = this.dir.z * this.v * delta;
      var moveVector = new THREE.Vector3(dx, 0, dz);
      moveVector = this.localToWorld(moveVector);
      this.v += a * delta;

      // Test Balls

      for (var i = 0; i < balls.length; i++) {
        if (self != i) {
          var d = this.getDistance(balls[i]);
          var diff = d - (this.bound + balls[i].bound);
          if (diff < 0) {  // Overlap detected
            dx -= diff * this.dir.x;
            dz -= diff * this.dir.z;
          }
        }
      }

      // Test Walls

      var xLimit = this.position.x + dx - this.bound;  // Wall has x < 0
      var zUpper = this.position.z + dz + this.bound;  // Wall has z > 0
      var zLower = this.position.z + dz - this.bound;  // Wall has z < 0

      var diffX = minX + wallBound - xLimit;
      var diffZUp = maxZ - wallBound - zUpper;
      var diffZLow = minZ + wallBound - zLower;

      if (diffX > 0) {
        dx += diffX
      }

      if (diffZUp < 0) {
        dz += diffZUp;
      }

      if (diffZLow > 0) {
        dz += diffZLow;
      }


      this.move(dx, dz);
    }
    else {
      this.v = 0;
      this.dir = new THREE.Vector3();
    }

    if (this.falling) {
      var m = new THREE.Matrix4();
      m.makeTranslation(0, -10, 0);
      this.applyMatrix(m);
    }
    this.updateCamera(dx, dz)
  }

  toggleAxis() {
    this.axis.visible = currentAxis;
  }
}

class Cannon extends Object3d {
  constructor(x, y, z, k, theta) {
    super(x, y, z);

    this.wheelR = 1 * k;
    this.cannonL = 20 * k;
    this.cannonInnerR = r * k;
    this.cannonOuterR = 2 * r * k;
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
    var m = new THREE.Matrix4();
    m.makeRotationAxis(new THREE.Vector3(0, 1, 0), delta);
    this.matrix.multiply(m);
    this.rotation.setFromRotationMatrix(this.matrix);
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
    var vel = min_v + v * Math.random();
    var b = new Ball(pos.x, r, pos.z, r, vel, dir);
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