class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

class ChessBoard extends THREE.Object3D {
  constructor(x, y, z, l) {
    super(x, y, z);

    this.l = l;
    this.square_l = l / 8;

    this.addBorder();
    for (let i = 0; i < 8; i++) {
      this.addColumn(i);
    }
  }

  addBorder() {
    let geo = new THREE.CubeGeometry(this.l * 1.2, 5, this.l * 1.2);
    let tex = new THREE.TextureLoader().load('textures/wood.jpg');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    let mat = new THREE.MeshStandardMaterial(
        {color: 0x5d432c, side: THREE.DoubleSide, bumpMap: tex});
    let mesh = new THREE.Mesh(geo, mat);
    this.add(mesh);
  }

  addColumn(i) {
    for (let j = 0; j < 8; j++) {
      this.addSquare(i, j);
    }
  }

  addSquare(i, j) {
    let x = this.l / 2 - this.square_l * (i + 0.5)
    let z = this.l / 2 - this.square_l * (j + 0.5);

    let geo = new THREE.CubeGeometry(this.square_l, 10, this.square_l);
    let tex = new THREE.TextureLoader().load('textures/wood.jpg');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    let mat =
        new THREE.MeshStandardMaterial({side: THREE.DoubleSide, bumpMap: tex});

    (i + j) % 2 == 0 ? mat.color.set(0x000000) : mat.color.set(0xffffff);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0, z);
    this.add(mesh);
  }
}

class Ball extends Object3d {
  constructor(x, y, z, r) {
    'use strict';

    super(x, y + r, z);
    this.bound = 1.25 * r;

    this.r = r;
    this.camera = new THREE.PerspectiveCamera(
        50, window.innerWidth / window.innerHeight, 1, 1000);

    this.tex = new THREE.TextureLoader().load('textures/monalisa.jpg');
    this.tex.wrapS = THREE.RepeatWrapping;
    this.tex.wrapT = THREE.RepeatWrapping;
    this.tex.repeat.set(1, 1);

    this.material = new THREE.MeshBasicMaterial(
        { side: THREE.DoubleSide, wireframe: false, map: this.tex });

    this.addBall(0, 0, 0, r);
    this.axis = new THREE.AxesHelper(this.r * 2);
    this.axis.position.set(0, 0, 0);
    this.add(this.axis);
  }

  addBall(x, y, z, r) {
    'use strict';

    var geometry = new THREE.SphereGeometry(r, 50, 50);
    geometry.center(this.position)
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  // move(dx, dz) {
  //   this.matrix.identity();
  //   var m_trans = new THREE.Matrix4();
  //   var m_rot = new THREE.Matrix4();
  //   var axis = new THREE.Vector3(-this.dir.z, 0, this.dir.x);
  //   var rad = Math.sqrt(dz ** 2 + dx ** 2) / this.r;
  //   m_trans.makeTranslation(dx, 0, dz);
  //   m_rot.makeRotationAxis(axis.normalize(), rad);
  //   this.applyMatrix(m_trans);
  //   this.matrix.multiply(m_rot);
  //   this.rotation.setFromRotationMatrix(this.matrix);
  // }

  // update(delta, self) {
  //   var dx = 0
  //   var dz = 0
  //   if (this.v > 0) {
  //     dx = this.dir.x * this.v * delta;
  //     dz = this.dir.z * this.v * delta;
  //     var moveVector = new THREE.Vector3(dx, 0, dz);
  //     moveVector = this.localToWorld(moveVector);
  //     this.v += a * delta;

  //     // Test Balls

  //     for (var i = 0; i < balls.length; i++) {
  //       if (self != i) {
  //         var d = this.getDistance(balls[i]);
  //         var diff = d - (this.bound + balls[i].bound);
  //         if (diff < 0) {  // Overlap detected
  //           dx -= diff * this.dir.x;
  //           dz -= diff * this.dir.z;
  //         }
  //       }
  //     }

  //     // Test Walls

  //     var xLimit = this.position.x + dx - this.bound;  // Wall has x < 0
  //     var zUpper = this.position.z + dz + this.bound;  // Wall has z > 0
  //     var zLower = this.position.z + dz - this.bound;  // Wall has z < 0

  //     var diffX = minX + wallBound - xLimit;
  //     var diffZUp = maxZ - wallBound - zUpper;
  //     var diffZLow = minZ + wallBound - zLower;

  //     if (diffX > 0) {
  //       dx += diffX
  //     }

  //     if (diffZUp < 0) {
  //       dz += diffZUp;
  //     }

  //     if (diffZLow > 0) {
  //       dz += diffZLow;
  //     }


  //     this.move(dx, dz);
  //   }
  //   else {
  //     this.v = 0;
  //     this.dir = new THREE.Vector3();
  //   }

  //   if (this.falling) {
  //     var m = new THREE.Matrix4();
  //     m.makeTranslation(0, -10, 0);
  //     this.applyMatrix(m);
  //   }
  //   this.updateCamera(dx, dz)
  // }
}