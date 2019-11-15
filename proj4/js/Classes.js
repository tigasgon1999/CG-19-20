class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
    this.initPos = this.position.clone();
    this.initRot = this.rotation.clone();

    this.texLoader = new THREE.TextureLoader();

    this.mats = [
      new THREE.MeshStandardMaterial(
          {side: THREE.DoubleSide, wireframe: false}),
      new THREE.MeshBasicMaterial({side: THREE.DoubleSide, wireframe: false})
    ];
  }

  reload(){
    this.position.copy(this.initPos);
    this.rotation.copy(this.initRot);
  }
}

class Border extends Object3d {
  constructor(x, y, z, l, h) {
    super(x, y + h / 2, z);

    this.color = 0x5d432c;
    this.l = l;
    this.h = h;

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].bumpMap = this.texLoader.load('textures/wood.jpg');
      this.mats[i].bumpMap.wrapS = THREE.RepeatWrapping;
      this.mats[i].bumpMap.wrapT = THREE.RepeatWrapping;
      this.mats[i].bumpMap.repeat.set(4, 4);
      this.mats[i].color.set(this.color);
    }

    this.addBorder();
  }

  reload(){
    super.reload();
    this.toggleMaterial(0);
    this.toggleWireframe(true);
  }

  addBorder() {
    let geo = new THREE.CubeGeometry(this.l, this.h, this.l);
    let mat = this.mats[0].clone();
    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.receiveShadow = true;
    this.add(this.mesh);
  }

  toggleWireframe(w) {
    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].wireframe = w == undefined? !this.mats[i].wireframe : w;
    }
    this.mesh.material.wireframe = w == undefined? !this.mesh.material.wireframe : w;
  }

  toggleMaterial(n) {
    this.mesh.material = this.mats[n].clone();
  }
}

class ChessBoard extends Object3d {
  constructor(x, y, z, l, h) {
    super(x, y, z);

    this.l = l;
    this.h = h;

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].bumpMap = this.texLoader.load('textures/wood.jpg');
      this.mats[i].bumpMap.wrapS = THREE.RepeatWrapping;
      this.mats[i].bumpMap.wrapT = THREE.RepeatWrapping;
      this.mats[i].bumpMap.repeat.set(4, 4);

      this.mats[i].map = this.texLoader.load('textures/chess.png');
    }

    this.border = new Border(x, y, z, l * 1.2, h / 2);
    this.add(this.border);
    this.addBoard();
  }

  reload(){
    super.reload();
    this.border.reload();
    this.toggleMaterial(0);
    this.toggleWireframe(false);
  }

  addBoard() {
    let geo = new THREE.CubeGeometry(this.l, this.h, this.l);
    let mat = this.mats[0].clone();
    let mesh = new THREE.Mesh(geo, mat);
    this.board = mesh;
    mesh.position.set(0, this.h / 2, 0);
    mesh.receiveShadow = true;
    this.add(mesh);
  }

  toggleWireframe(w) {
    for(let i=0; i< this.mats.length; i++){
      this.mats[i].wireframe = w == undefined? !this.mats[i].wireframe : w;
    }
    this.border.toggleWireframe(w);
    this.board.material.wireframe = w == undefined? !this.board.material.wireframe : w;
  }

  toggleMaterial(n) {
    this.border.toggleMaterial(n);
    this.board.material = this.mats[n].clone();
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
      this.mats[i].shininess = 50;
      this.mats[i].specular = 0xffffff;
    }



    this.addBall();

  }

  reload(){
    super.reload();
    this.toggleMaterial(0);
    this.toggleWireframe(false);
    this.v = 0;
  }

  addBall() {
    'use strict';

    var geometry = new THREE.SphereGeometry(this.r, 50, 50);
    geometry.center(this.position);
    this.mesh = new THREE.Mesh(geometry, this.mats[0].clone());
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
    dir.normalize();
    let dx = -dir.z * this.v * delta;
    let dz = dir.x * this.v * delta;

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
    for(let i=0; i< this.mats.length; i++){
      this.mats[i].wireframe = w == undefined? !this.mats[i].wireframe : w;
    }
    this.mesh.material.wireframe = w==undefined? !this.mesh.material.wireframe : w;
  }

  toggleMaterial(n) {
    this.mesh.material = this.mats[n].clone();
  }
}

class Dice extends Object3d {
  constructor(x, y, z, l) {
    super(x, y + l / 2, z);
    this.dice_l = l;
    this.rotv = 0.7;

    this.addCube()
  }

  reload(){
    super.reload();
    this.toggleMaterial(0);
    this.toggleWireframe(false);
  }

  addCube() {
    let geo = new THREE.CubeGeometry(this.dice_l, this.dice_l, this.dice_l);

    let mat = [];
    for (let i = 1; i < 7; i++) {
      let tex = this.texLoader.load('textures/dice' + i + '.jpg');
      let m = this.mats[0].clone();
      m.bumpMap = tex;
      m.map = tex;
      mat.push(m);
    }

    this.mesh = new THREE.Mesh(geo, mat);
    this.mesh.position.set(0, ((Math.sqrt(3) - 1) * this.dice_l / 2), 0);
    this.mesh.rotateX(Math.PI / 4);
    this.mesh.rotateZ(Math.PI / 4);

    this.mesh.castShadow = true;

    this.add(this.mesh);
  }

  toggleWireframe(w) {
    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].wireframe = w == undefined? !this.mats[i].wireframe : w;
    }
    for (let i = 0; i < this.mesh.material.length; i++) {
      this.mesh.material[i].wireframe = w == undefined? !this.mesh.material[i].wireframe : w;
    }
  }

  toggleMaterial(n) {
    for (let i = 1; i < 7; i++) {
      let tex = this.texLoader.load('textures/dice' + i + '.jpg');
      let m = this.mats[n].clone();
      m.bumpMap = tex;
      m.map = tex;
      this.mesh.material[i - 1] = m;
    }
  }

  update(delta) {
    let rot = delta * this.rotv;
    this.rotation.y += rot;
  }
}