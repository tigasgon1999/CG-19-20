class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}


class Painting extends Object3d {
  constructor(x, y, z, k, l, r) {
    super(x, y, z);

    this.k = k;
    this.l = l;
    this.r = r;
    this.line = Math.sqrt(2) * this.r;

    this.bgL = this.k * 6;
    this.bgW = this.k / 4;
    this.bgH = this.k * 3;

    this.bgMaterial =
        new THREE.MeshBasicMaterial({color: 0x808080, side: THREE.DoubleSide});
    this.squareMaterial = new THREE.MeshLambertMaterial(
        {color: 0x000000, side: THREE.DoubleSide});
    this.circleMaterial =
        new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});

    this.addBackground();
    this.addSquares();
  }


  addBackground() {
    let geometry = new THREE.CubeGeometry(this.bgL, this.bgH, this.bgW);
    var mesh = new THREE.Mesh(geometry, this.bgMaterial);
    mesh.position.set(0, this.bgH / 2, 0);

    this.add(mesh);
  }

  addSquares() {
    var sidePadding = (this.bgL - this.l) % (this.l + this.line);
    var topPadding = (this.bgH - this.l) % (this.l + this.line);

    var sideSquare = (sidePadding / 2) - this.line;
    var topSquare = (topPadding / 2) - this.line;


    for (let column = (-this.bgL + sidePadding) / 2;
         column < (this.bgL - sidePadding) / 2; column += this.l + this.line) {
      if (topSquare > 0) {
        let geometry = new THREE.CubeGeometry(this.l, topSquare, 1);
        let mesh1 = new THREE.Mesh(geometry, this.squareMaterial);
        mesh1.position.set(
            column + this.l / 2, this.bgH - topSquare / 2, this.bgW / 2);
        this.add(mesh1);


        let mesh2 = new THREE.Mesh(geometry, this.squareMaterial);
        mesh2.position.set(column + this.l / 2, topSquare / 2, this.bgW / 2);
        this.add(mesh2);
      }

      for (let line = this.bgH - topPadding / 2; line > topPadding / 2;
           line -= (this.l + this.line)) {
        let geometry = new THREE.CubeGeometry(this.l, this.l, 1);
        let mesh = new THREE.Mesh(geometry, this.squareMaterial);
        mesh.position.set(column + this.l / 2, line - this.l / 2, this.bgW / 2);
        this.add(mesh);
      }
    }

    if (sideSquare > 0) {
      for (let line = this.bgH - topPadding / 2; line > topPadding / 2;
           line -= (this.l + this.line)) {
        let geometry = new THREE.CubeGeometry(sideSquare, this.l, 1);
        let mesh1 = new THREE.Mesh(geometry, this.squareMaterial);
        mesh1.position.set(
            (-this.bgL + sideSquare) / 2, line - this.l / 2, this.bgW / 2);
        this.add(mesh1);


        let mesh2 = new THREE.Mesh(geometry, this.squareMaterial);
        mesh2.position.set(
            (this.bgL - sideSquare) / 2, line - this.l / 2, this.bgW / 2);
        this.add(mesh2);
      }
    }
  }
}