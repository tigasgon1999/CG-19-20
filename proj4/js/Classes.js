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
      this.add(i);
    }
  }

  addBorder() {
    let geo = new THREE.CubeGeometry(l * 1.2, 5, l * 1.2);
    let tex = new THREE.TextureLoader().load('textures/wood.jpg');
    tex.wrapS = THREE.RepeatWrapping;
    tex.wrapT = THREE.RepeatWrapping;
    tex.repeat.set(4, 4);
    let mat = new THREE.MeshStandarMaterial(
        {color: 0x5d432c, side: THREE.DoubleSide, bumpMap: tex});
    let mesh = new THREE.Mesh(geo, mat);
    this.add(mesh);
  }

  addLine(i) {
    for (let j = 0; j < 8; j++) {
    }
  }
}

class Dice extends THREE.Object3D{
  constructor(x, y, z) {
    super(x, y, z);

  
  }
}