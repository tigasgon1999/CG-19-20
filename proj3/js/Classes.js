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
  constructor(x, y, z, l, theta) {
    super(x, y, z);
    this.theta = theta;
    this.l = l;

    this.addWall();
    this.addBottom();
  }

  addWall() {
    let geometry = new THREE.CubeGeometry(this.l, 200, 2);
    var material = new THREE.MeshLambertMaterial(
        {color: 0xe8e4c9, side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 100, 0);
    mesh.rotation.y = this.theta;
    mesh.receiveShadow = true;

    this.add(mesh);
  }

  addBottom() {
    let geometry = new THREE.CubeGeometry(this.l, 10, 5);
    var material = new THREE.MeshLambertMaterial(
        {color: 0x5d432c, side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 5, 0);
    mesh.rotation.y = this.theta;
    mesh.receiveShadow = true;

    this.add(mesh);
  }
}

class Icosahedron extends Object3d {
  constructor(x, y, z, r) {
    super(x, y, z);
    this.r = r;

    this.material = new THREE.MeshLambertMaterial(
        {color: 0xa9a9a9, side: THREE.DoubleSide});

    var t = (1 + Math.sqrt(5)) / 2;

    var vertices = [
      -1,       t + 0.5, 0,  0.8,      t,       0, -1,      -t - 0.2, 0, 1,
      -t + 0.2, 0,       0,  -1,       t + 0.5, 0, 1 - 0.3, t,        0, -1,
      -t + 0.4, 0,       1,  -t + 0.5, t - 0.5, 0, -1,      t - 0.5,  0, 1,
      -t + 0.7, 0,       -1, -t - 0.6, 0,       1
    ];

    /*var vertices = [
      -1, t,  0,  1, t, 0,  -1, -t, 0,  1, -t, 0, 0,  -1, t,  0,  1, t,
      0,  -1, -t, 0, 1, -t, t,  0,  -1, t, 0,  1, -t, 0,  -1, -t, 0, 1
    ];*/ //Regular Icosahedron

    var indices = [
      0, 11, 5,  0, 5,  1, 0, 1, 7, 0, 7,  10, 0, 10, 11, 1, 5, 9, 5, 11,
      4, 11, 10, 2, 10, 7, 6, 7, 1, 8, 3,  9,  4, 3,  4,  2, 3, 2, 6, 3,
      6, 8,  3,  8, 9,  4, 9, 5, 2, 4, 11, 6,  2, 10, 8,  6, 7, 9, 8, 1
    ];

    this.geometry = new THREE.PolyhedronGeometry(vertices, indices, r);

    var mesh = new THREE.Mesh(this.geometry, this.material);
    mesh.position.set(0, r - 2 * t, 0);

    mesh.castShadow = true;

    this.add(mesh);
  }
}

class Floor extends Object3d {
  constructor(x, y, z, l, w) {
    super(x, y, z);
    this.l = l;
    this.w = w;

    this.addFloor();
  }

  addFloor() {
    let geometry = new THREE.CubeGeometry(this.l, 1, this.w);
    var material =
        new THREE.MeshPhongMaterial({color: 0x86242a, side: THREE.DoubleSide});
    var mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(0, 0, 0);
    mesh.receiveShadow = true;

    this.add(mesh);
  }
}

class Stand extends Object3d {
  constructor(x, y, z, h) {
    super(x, y, z);
    this.h = h;
    this.material = new THREE.MeshLambertMaterial(
        {color: 0x464646, side: THREE.DoubleSide});

    this.addSlab(0, 2.5, 0);
    this.addArm(0, 5 + h / 2, 0);
    this.addSlab(0, 7.5 + h, 0);
    this.castShadow = true;
  }

  addSlab(x, y, z) {
    let geometry = new THREE.CubeGeometry(this.h / 2, 5, this.h / 2);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;

    this.add(mesh);
  }

  addArm(x, y, z) {
    let geometry = new THREE.CubeGeometry(5, this.h, 5);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);
    mesh.castShadow = true;

    this.add(mesh);
  }
}

class Spotlight extends Object3d {
  constructor(x, y, z, obj) {
    super(x, y, z);

    this.coneMaterial =
        new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide});

    this.bulbMaterial =
        new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});


    this.addCone();
    this.addSphere();
    this.addLight(obj);

    this.lookAt(obj.position);
  }

  addCone() {
    var geo = new THREE.ConeGeometry(10, 20, 50, 5, true);
    var mesh = new THREE.Mesh(geo, this.coneMaterial);
    mesh.rotateX(-Math.PI / 2);
    this.add(mesh);
  }

  addSphere() {
    var geo = new THREE.SphereGeometry(2, 25, 25);
    var mesh = new THREE.Mesh(geo, this.bulbMaterial);
    this.add(mesh);
  }

  addLight(obj) {
    var spotlight = new THREE.SpotLight(0xffffff, 0.8);
    spotlight.position.set(0, 0, 0);
    spotlight.castShadow = true;

    spotlight.target = obj;

    spotlight.shadow.mapSize.width = 1024;
    spotlight.shadow.mapSize.height = 1024;

    spotlight.shadow.camera.near = 0.5;
    spotlight.shadow.camera.far = 1000;
    spotlight.shadow.camera.fov = 30;
    this.light = spotlight;

    this.add(spotlight)
  }

  toggleLight() {
    this.light.visible = !this.light.visible;
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
        new THREE.MeshPhongMaterial({color: 0x808080, side: THREE.DoubleSide});
    this.squareMaterial = new THREE.MeshLambertMaterial(
        {color: 0x000000, side: THREE.DoubleSide});
    this.circleMaterial =
        new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});

    this.addBackground();
    this.addSquares();

    this.castShadow = true;
  }


  addBackground() {
    let geometry = new THREE.CubeGeometry(this.bgL, this.bgH, this.bgW);
    var mesh = new THREE.Mesh(geometry, this.bgMaterial);
    mesh.position.set(0, this.bgH / 2, 0);
    mesh.castShadow = true;

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