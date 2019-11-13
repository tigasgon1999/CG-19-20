class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);
    this.position.x = x;
    this.position.y = y;
    this.position.z = z;

    this.mats = [
      new THREE.MeshStandardMaterial(
          {side: THREE.DoubleSide, wireframe: false}),
      new THREE.MeshBasicMaterial({side: THREE.DoubleSide, wireframe: false})
    ];
  }
}

class ChessBoard extends Object3d {
  constructor(x, y, z, l) {
    super(x, y, z);

    this.l = l;
    this.square_l = l / 8;

    this.tex = new THREE.TextureLoader().load('textures/wood.jpg');
    this.tex.wrapS = THREE.RepeatWrapping;
    this.tex.wrapT = THREE.RepeatWrapping;
    this.tex.repeat.set(4, 4);

    for (let i = 0; i < this.mats.length; i++) {
      this.mats[i].bumpMap = this.tex;
    }
    this.borderColor = 0x5d432c;
    this.squares = [];

    // this.add(new THREE.AxesHelper(l * 2))



    this.addBorder();
    for (let i = 0; i < 8; i++) {
      this.addColumn(i);
    }
  }

  addBorder() {
    let geo = new THREE.CubeGeometry(this.l * 1.2, 5, this.l * 1.2);
    let mat = this.mats[0].clone();
    mat.color.set(this.borderColor);
    let mesh = new THREE.Mesh(geo, mat);
    this.border = mesh;
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
    let mat = this.mats[0].clone();
    (i + j) % 2 == 0 ? mat.color.set(0x000000) : mat.color.set(0xffffff);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, 0, z);
    this.add(mesh);
    this.squares.push(mesh);
  }

  toggleWireframe() {
    this.border.material.wireframe = !this.border.material.wireframe;
    for (let i = 0; i < 64; i++) {
      this.squares[i].material.wireframe = !this.squares[i].material.wireframe;
    }
  }

  toggleMaterial(n) {
    this.border.material = this.mats[n].clone();
    this.border.material.color.set(this.borderColor);
    for (let i = 0; i < this.squares.length; i++) {
      let c = this.squares[i].material.color;
      this.squares[i].material = this.mats[n].clone();
      this.squares[i].material.color.set(c);
    }
  }
}

class Ball extends Object3d {
  constructor(x, y, z, r, v_max) {
    'use strict';

    super(x, y + r, z);
    this.bound = 1.25 * r;
    this.r = r;
    this.v = 0;
    this.vmax = v_max;

    this.tex = new THREE.TextureLoader().load('textures/monalisa.jpg');
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



    this.addBall(0, 0, 0, r);
    this.axis = new THREE.AxesHelper(this.r * 2);
    this.axis.position.set(0, 0, 0);
    this.axis.visible = false;
    this.add(this.axis);
  }

  addBall(x, y, z, r) {
    'use strict';

    var geometry = new THREE.SphereGeometry(r, 50, 50);
    geometry.center(this.position);
    this.mesh = new THREE.Mesh(geometry, this.mats[0].clone());
    this.mesh.position.set(x, y, z);

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