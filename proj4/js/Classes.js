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
<<<<<<< HEAD
}

class Dice extends THREE.Object3D{
  constructor(x, y, z) {
    super(x, y, z);

  
=======

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
>>>>>>> eaffdbb7363e6dc1b7ad496d92e58b76c6576423
  }
}