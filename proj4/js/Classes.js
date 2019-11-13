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

class Dice extends THREE.Object3D{
  constructor(x, y, z, l) {
    super(x, y, z);
    this.dice_l = l;
    const loader = new THREE.TextureLoader();
    
    var t1 = loader.load('textures/dice1.jpg');
    var t2 = loader.load('textures/dice2.jpg');
    var t3 = loader.load('textures/dice3.jpg');
    var t4 = loader.load('textures/dice4.jpg');
    var t5 = loader.load('textures/dice5.jpg');
    var t6 = loader.load('textures/dice6.jpg');
    

    const mat = [
      new THREE.MeshStandardMaterial({bumpMap: t1, map: t1}),
      new THREE.MeshStandardMaterial({bumpMap: t2, map: t2}),
      new THREE.MeshStandardMaterial({bumpMap: t3, map: t3}),
      new THREE.MeshStandardMaterial({bumpMap: t4, map: t4}),
      new THREE.MeshStandardMaterial({bumpMap: t5, map: t5}),
      new THREE.MeshStandardMaterial({bumpMap: t6, map: t6})];
    //var material = new THREE.MeshBasicMaterial( { color: 0xffffff, envMap: textureCube } );
      
    let geo = new THREE.CubeGeometry(this.dice_l, this.dice_l , this.dice_l);
    let mesh = new THREE.Mesh(geo, mat);
    mesh.position.set(x, y + this.dice_l/2, z);
    this.add(mesh);

    this.rotateX(Math.PI/4);
    this.rotateX(Math.PI/4);
    
  }
}