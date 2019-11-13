class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    this.texLoader = new THREE.TextureLoader();

    this.mats = [
      new THREE.MeshStandardMaterial(
          {side: THREE.DoubleSide, wireframe: false}),
      new THREE.MeshBasicMaterial({side: THREE.DoubleSide, wireframe: false})
    ];
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

  addBorder() {
    let geo = new THREE.CubeGeometry(this.l, this.h, this.l);
    let mat = this.mats[0].clone();
    this.mesh = new THREE.Mesh(geo, mat);
    this.add(this.mesh);
  }

  toggleWireframe() {
    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].wireframe = !this.mats[i].wireframe;
    }
    this.mesh.material.wireframe = !this.mesh.material.wireframe;
  }

  toggleMaterial(n) {
    this.mesh.material = this.mats[n].clone();
  }
}

class ChessBoard extends Object3d {
  constructor(x, y, z, l, h) {
    super(x, y, z);

    this.l = l;
    this.square_l = l / 8;
    this.h = h;

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].bumpMap = this.texLoader.load('textures/wood.jpg');
      this.mats[i].bumpMap.wrapS = THREE.RepeatWrapping;
      this.mats[i].bumpMap.wrapT = THREE.RepeatWrapping;
      this.mats[i].bumpMap.repeat.set(4, 4);

      this.mats[i].map = this.texLoader.load('textures/chess.png');
    }
    // this.borderColor = 0x5d432c;
    this.squares = [];

    // this.add(new THREE.AxesHelper(l * 2))



    this.border = new Border(x, y, z, l * 1.2, h / 2);
    this.add(this.border);
    // for (let i = 0; i < 8; i++) {
    //   this.addColumn(i);
    // }
    this.addBoard();
  }

  addBorder() {
    let geo = new THREE.CubeGeometry(this.l * 1.2, this.h / 2, this.l * 1.2);
    let mat = this.mats[0].clone();
    mat.color.set(this.borderColor);
    let mesh = new THREE.Mesh(geo, mat);
    this.border = mesh;
    mesh.position.set(0, this.h / 4, 0);
    this.add(mesh);
  }

  addBoard() {
    let geo = new THREE.CubeGeometry(this.l, this.h, this.l);
    let mat = this.mats[0].clone();
    let mesh = new THREE.Mesh(geo, mat);
    this.board = mesh;
    mesh.position.set(0, this.h / 2, 0);
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

    let geo = new THREE.CubeGeometry(this.square_l, this.h, this.square_l);
    let mat = this.mats[0].clone();
    (i + j) % 2 == 0 ? mat.color.set(0x000000) : mat.color.set(0xffffff);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, this.h / 2, z);
    this.add(mesh);
    this.squares.push(mesh);
  }

  toggleWireframe() {
    this.border.toggleWireframe();
    this.board.material.wireframe = !this.board.material.wireframe;
    // for (let i = 0; i < 64; i++) {
    //   this.squares[i].material.wireframe =
    //   !this.squares[i].material.wireframe;
    // }
  }

  toggleMaterial(n) {
    this.border.toggleMaterial(n);
    this.board.material = this.mats[n].clone();
    this.board.material.map = this.chessTex;
    // for (let i = 0; i < this.squares.length; i++) {
    //   let c = this.squares[i].material.color;
    //   this.squares[i].material = this.mats[n].clone();
    //   this.squares[i].material.color.set(c);
    // }
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

    // TODO: specular
    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].map = this.tex;
      this.mats[i].bumpMap = this.tex;
      this.mats[i].shininess = 50;
      this.mats[i].specular = 0xffffff;
    }



    this.addBall();
    this.axis = new THREE.AxesHelper(this.r * 2);
    this.axis.position.set(0, 0, 0);
    this.axis.visible = false;
    this.add(this.axis);
  }

  addBall() {
    'use strict';

    var geometry = new THREE.SphereGeometry(this.r, 50, 50);
    geometry.center(this.position);
    this.mesh = new THREE.Mesh(geometry, this.mats[0].clone());

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

  toggleWireframe() {
    this.mesh.material.wireframe = !this.mesh.material.wireframe;
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

    this.add(this.mesh);

    // this.position.y += ((Math.sqrt(3) - 1) * this.dice_l / 2);
  }

  toggleWireframe() {
    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].wireframe = !this.mats[i].wireframe;
    }
    for (let i = 0; i < this.mesh.material.length; i++) {
      this.mesh.material[i].wireframe = !this.mesh.material[i].wireframe;
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