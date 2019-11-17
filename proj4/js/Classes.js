class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.initPos = this.position.clone();
    this.initRot = this.rotation.clone();
    this.wireframe = false;
    this.prevMat = 0;
    this.currMat = 0;

    this.texLoader = new THREE.TextureLoader();

    this.mats = [
      new THREE.MeshPhongMaterial({side: THREE.DoubleSide, wireframe: false}),
      new THREE.MeshBasicMaterial({side: THREE.DoubleSide, wireframe: false})
    ];
  }

  reload() {
    this.position.copy(this.initPos);
    this.rotation.copy(this.initRot);
  }
}

class Border extends Object3d {
  constructor(x, y, z, l, h) {
    super(x, y + h / 2, z);

    this.l = l;
    this.h = h;

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].bumpMap = this.texLoader.load('textures/wood1.jpg');
      this.mats[i].bumpMap.wrapS = THREE.ClampToEdgeWrapping;
      this.mats[i].bumpMap.wrapT = THREE.ClampToEdgeWrapping;

      this.mats[i].map = this.mats[i].bumpMap;
    }

    this.addBorder();
  }

  reload() {
    super.reload();
    this.toggleWireframe(false);
    this.toggleMaterial(0);
  }

  addBorder() {
    let geo = new THREE.CubeGeometry(this.l, this.h, this.l);
    let mat = this.mats[0];
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.receiveShadow = true;
    this.add(this.mesh);
  }

  toggleWireframe(w) {
    let wireframe = false;
    if (w == undefined) {
      wireframe = !this.mesh.material.wireframe;
    } else {
      wireframe = w;
    }

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].wireframe = wireframe;
    }

    this.wireframe = false;

    if (wireframe) {
      this.toggleMaterial(1);
    } else {
      this.toggleMaterial(this.prevMat);
    }

    this.wireframe = wireframe;
  }

  toggleMaterial(n) {
    this.prevMat = this.currMat;
    this.currMat = n;
    if (this.wireframe) {
      return;
    }
    this.mesh.material = this.mats[n];
  }
}

class ChessBoard extends Object3d {
  constructor(x, y, z, l, h) {
    super(x, y, z);

    this.l = l;
    this.h = h;

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].bumpMap = this.texLoader.load('textures/wood1.jpg');
      this.mats[i].bumpMap.wrapS = THREE.RepeatWrapping;
      this.mats[i].bumpMap.wrapT = THREE.RepeatWrapping;
      this.mats[i].bumpMap.repeat.set(8, 8);

      this.mats[i].map = this.texLoader.load('textures/chess.png');
      this.mats[i].bumpMap.wrapS = THREE.ClampToEdgeWrapping;
      this.mats[i].bumpMap.wrapT = THREE.ClampToEdgeWrapping;
    }

    this.border = new Border(x, y, z, l * 1.2, h / 2);
    this.add(this.border);
    this.addBoard();
  }

  reload() {
    super.reload();
    this.border.reload();
    this.toggleWireframe(false);
    this.toggleMaterial(0);
  }

  addBoard() {
    let geo = new THREE.CubeGeometry(this.l, this.h, this.l);
    let mesh = new THREE.Mesh(geo, this.mats[0]);
    this.mesh = mesh;
    mesh.position.set(0, this.h / 2, 0);
    mesh.receiveShadow = true;
    this.add(mesh);
  }

  toggleWireframe(w) {
    this.border.toggleWireframe(w);
    var wireframe = false;
    if (w == undefined) {
      wireframe = !this.mesh.material.wireframe;
    } else {
      wireframe = w;
    }

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].wireframe = wireframe;
    }

    this.wireframe = false;

    if (wireframe) {
      this.toggleMaterial(1);
    } else {
      this.toggleMaterial(this.prevMat);
    }

    this.wireframe = wireframe;
  }

  toggleMaterial(n) {
    this.prevMat = this.currMat;
    this.currMat = n;
    if (this.wireframe) {
      return;
    }
    this.border.toggleMaterial(n);
    this.mesh.material = this.mats[n];
  }
}

class Ball extends Object3d {
  constructor(x, y, z, r, v_max) {
    'use strict';

    super(x, y + r, z);
    this.r = r;
    this.v = 0;
    this.vmax = v_max;

    this.tex = this.texLoader.load('textures/monalisa.jpg');
    this.tex.wrapS = THREE.RepeatWrapping;
    this.tex.wrapT = THREE.RepeatWrapping;
    this.tex.repeat.set(1, 1);

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].map = this.tex;
      this.mats[i].bumpMap = this.tex;
      this.mats[i].shininess = 10;
      this.mats[i].specular = new THREE.Color(0xa9a9a9);
    }

    this.addBall();
  }

  reload() {
    super.reload();
    this.toggleWireframe(false);
    this.toggleMaterial(0);
    this.v = 0;
  }

  addBall() {
    'use strict';

    var geometry = new THREE.SphereGeometry(this.r, 50, 50);
    geometry.center(this.position);
    this.mesh = new THREE.Mesh(geometry, this.mats[0]);
    this.mesh.castShadow = true;

    this.add(this.mesh);
  }

  update(delta, moving) {
    if (moving) {
      this.v < this.vmax ? this.v += a* delta : this.v = this.v;
    } else {
      this.v > 0 ? this.v -= a* delta : this.v = 0;
    }


    let dir = new THREE.Vector3().subVectors(board.position, this.position);
    dir.setY(0);

    var r = dir.length();
    dir.normalize();
    let dx = -dir.z * this.v * delta;
    let dz = dir.x * this.v * delta;

    this.move(dx, dz, this.worldToLocal(dir));

    let newD = new THREE.Vector3().subVectors(board.position, this.position);
    newD.setY(0);

    var newR = newD.length();

    let diff = newR - r;

    newD.normalize();

    dx = newD.x * diff;
    dz = newD.z * diff;

    this.move(dx, dz, this.worldToLocal(dir));
  }

  move(dx, dz, dir) {
    this.matrix.identity();
    var m_trans = new THREE.Matrix4();
    var m_rot = new THREE.Matrix4();
    var rad = Math.sqrt(dz ** 2 + dx ** 2) / this.r;
    m_trans.makeTranslation(dx, 0, dz);
    m_rot.makeRotationAxis(dir.normalize(), rad);
    this.applyMatrix(m_trans);
    this.matrix.multiply(m_rot);
    this.rotation.setFromRotationMatrix(this.matrix);
  }

  toggleWireframe(w) {
    let wireframe = false;
    if (w == undefined) {
      wireframe = !this.mesh.material.wireframe;
    } else {
      wireframe = w;
    }

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].wireframe = wireframe;
    }

    this.wireframe = false;

    if (wireframe) {
      this.toggleMaterial(1);
    } else {
      this.toggleMaterial(this.prevMat);
    }

    this.wireframe = wireframe;
  }

  toggleMaterial(n) {
    this.prevMat = this.currMat;
    this.currMat = n;
    if (this.wireframe) {
      return;
    }
    this.mesh.material = this.mats[n];
  }
}

class Dice extends Object3d {
  constructor(x, y, z, l) {
    super(x, y + l / 2, z);
    this.dice_l = l;
    this.rotv = 0.7;

    let newMats = [];
    for (let i = 0; i < this.mats.length; i++) {
      let mat = [];
      for (let j = 1; j < 7; j++) {
        let m = this.mats[i].clone();
        m.bumpMap = this.texLoader.load('textures/dice' + j + 'bump4.png');
        m.bumpMap.wrapS = THREE.ClampToEdgeWrapping;
        m.bumpMap.wrapT = THREE.ClampToEdgeWrapping;

        m.map = this.texLoader.load('textures/dice' + j + '.jpg');
        m.map.wrapS = THREE.ClampToEdgeWrapping;
        m.map.wrapT = THREE.ClampToEdgeWrapping;
        mat.push(m);
      }
      newMats.push(mat);
    }

    this.mats = Array.from(newMats);

    this.addCube()
  }

  reload() {
    super.reload();
    this.toggleWireframe(false);
    this.toggleMaterial(0);
  }

  addCube() {
    let geo = new THREE.CubeGeometry(this.dice_l, this.dice_l, this.dice_l);

    this.mesh = new THREE.Mesh(geo, this.mats[0]);
    this.mesh.position.set(0, ((Math.sqrt(3) - 1) * this.dice_l / 2), 0);
    this.mesh.rotateX(Math.PI / 4);
    this.mesh.rotateZ(Math.PI / 4);

    this.mesh.castShadow = true;

    this.add(this.mesh);
  }

  toggleWireframe(w) {
    let wireframe = false;
    if (w == undefined) {
      wireframe = !this.mesh.material[0].wireframe;
    } else {
      wireframe = w;
    }

    for (let i = 0; i < this.mats.length; i++) {
      for (let j = 0; j < this.mats[i].length; j++)
        this.mats[i][j].wireframe = wireframe;
    }

    this.wireframe = false;

    if (wireframe) {
      this.toggleMaterial(1);
    } else {
      this.toggleMaterial(this.prevMat);
    }


    this.wireframe = wireframe
  }

  toggleMaterial(n) {
    this.prevMat = this.currMat;
    this.currMat = n;
    if (this.wireframe) {
      return;
    }
    this.mesh.material = this.mats[n];
  }

  update(delta) {
    let rot = delta * this.rotv;
    this.rotation.y += rot;
  }
}

class Pause extends Object3d {
  constructor(x, y, z, l, h) {
    super(x, y, z);

    this.l = l;
    this.h = h;

    this.addBlock();
  }

  addBlock() {
    let geo = new THREE.CubeGeometry(this.l, this.h, 20);
    let mat = new THREE.MeshBasicMaterial({
      side: THREE.DoubleSide,
      map: this.texLoader.load('textures/pause.png')
    });
    this.mesh = new THREE.Mesh(geo, mat);
    this.add(this.mesh);
  }
}