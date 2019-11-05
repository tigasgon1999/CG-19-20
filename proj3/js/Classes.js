class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);
    this.materialsList = [];
    this.materialsList.push(
        new THREE.MeshBasicMaterial({side: THREE.DoubleSide}));
    this.materialsList.push(
        new THREE.MeshLambertMaterial({side: THREE.DoubleSide}));
    this.materialsList.push(
        new THREE.MeshPhongMaterial({side: THREE.DoubleSide}));

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

class Wall extends Object3d {
  constructor(x, y, z, l, h, theta) {
    super(x, y, z);
    this.theta = theta;
    this.l = l;
    this.h = h;
    this.wallColor = 0xe8e4c9;
    this.bottomColor = 0x5d432c;

    this.addWall();
    this.addBottom();

    this.receiveShadow = true;
  }

  toggleMaterial(n) {
    this.wall.material = this.materialsList[n].clone();
    this.wall.material.color.set(this.wallColor);
    this.bottom.material = this.materialsList[n].clone();
    this.bottom.material.color.set(this.bottomColor);
  }

  addWall() {
    let geometry = new THREE.CubeGeometry(this.l, this.h, 1);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(0xe8e4c9);
    mesh.position.set(0, this.h / 2, 0);
    mesh.rotateY(this.theta);
    this.wall = mesh;
    this.add(mesh);
  }

  addBottom() {
    let geometry = new THREE.CubeGeometry(this.l, 10, 5);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.bottomColor);
    mesh.position.set(0, 5, 0);
    mesh.rotateY(this.theta);
    this.bottom = mesh;
    this.add(mesh);
  }
}

class TiledWall extends Object3d {
  constructor(x, y, z, l, h, theta, n) {
    super(x, y, z);
    this.theta = theta;
    this.l = l;
    this.h = h;
    this.n = n;
    this.sl = l / this.n;
    this.sh = h / this.n;
    this.tiles = [];
    this.bottomTiles = [];
    this.axis = new THREE.Vector3(0, 1, 0);

    this.wallColor = 0xe8e4c9;
    this.bottomColor = 0x5d432c;

    this.addWall();
    this.addBottom();

    this.receiveShadow = true;
  }

  toggleMaterial(n) {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].material = this.materialsList[n].clone();
      this.tiles[i].material.color.set(this.wallColor);
    }
    for (let i = 0; i < this.bottomTiles.length; i++) {
      this.bottomTiles[i].material = this.materialsList[n].clone();
      this.bottomTiles[i].material.color.set(this.bottomColor);
    }
  }

  addWall() {
    for (let i = (-this.l + this.sl) / 2; i <= (this.l - this.sl) / 2;
         i += this.sl) {
      for (let j = this.h - this.sh / 2; j >= this.sh / 2; j -= this.sh) {
        let geometry = new THREE.CubeGeometry(this.sl, this.sh, 1);
        var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
        mesh.material.color.set(0xe8e4c9);
        this.tiles.push(mesh);
        mesh.position.set(i, j, 0);
        this.add(mesh);

        mesh.position.applyAxisAngle(this.axis, this.theta);

        mesh.rotateOnAxis(this.axis, this.theta);

        // mesh.receiveShadow = true;
      }
    }
  }

  addBottom() {
    for (let i = (-this.l + this.sl) / 2; i <= (this.l - this.sl) / 2;
         i += this.sl) {
      let geometry = new THREE.CubeGeometry(this.sl, 10, 5);
      var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
      mesh.material.color.set(0x5d432c);
      this.bottomTiles.push(mesh);
      mesh.position.set(i, 5, 0);
      // mesh.receiveShadow = true;
      this.add(mesh);

      mesh.position.applyAxisAngle(this.axis, this.theta);

      mesh.rotateOnAxis(this.axis, this.theta);
    }
  }
}

class Icosahedron extends Object3d {
  constructor(x, y, z, r) {
    super(x, y, z);
    this.r = r;

    this.color = 0xa9a9a9;

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

    var mesh = new THREE.Mesh(this.geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.color);
    mesh.position.set(0, r - 2 * t, 0);

    mesh.castShadow = true;

    this.mesh = mesh;

    this.add(mesh);
  }

  toggleMaterial(n) {
    this.mesh.material = this.materialsList[n].clone();
    this.mesh.material.color.set(this.color);
  }
}

class Floor extends Object3d {
  constructor(x, y, z, l, w) {
    super(x, y, z);
    this.l = l;
    this.w = w;

    this.color = 0x86242a;

    this.addFloor();

    this.receiveShadow = true;
  }

  addFloor() {
    let geometry = new THREE.CubeGeometry(this.l, 1, this.w);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.color);
    mesh.position.set(0, 0, 0);
    this.floor = mesh;

    this.add(mesh);
  }

  toggleMaterial(n) {
    this.floor.material = this.materialsList[n].clone();
    this.floor.material.color.set(this.color);
  }
}

class TiledFloor extends Object3d {
  constructor(x, y, z, l, w, n) {
    super(x, y, z);
    this.l = l;
    this.w = w;
    this.n = n;
    this.seg_l = this.l / this.n;
    this.seg_w = this.w / this.n;
    this.tiles = [];

    this.color = 0x86242a;

    this.addFloor();
  }

  addFloor() {
    for (let i = (-this.l + this.seg_l) / 2; i <= (this.l - this.seg_l) / 2;
         i += this.seg_l) {
      for (let j = (-this.w + this.seg_w) / 2; j <= (this.w - this.seg_w) / 2;
           j += this.seg_w) {
        let geometry = new THREE.CubeGeometry(this.seg_l, 1, this.seg_w);
        var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
        mesh.material.color.set(this.color);
        mesh.position.set(i, 0, j);
        mesh.receiveShadow = true;
        this.tiles.push(mesh);

        this.add(mesh);
      }
    }
  }

  toggleMaterial(n) {
    for (let i = 0; i < this.tiles.length; i++) {
      this.tiles[i].material = this.materialsList[n].clone();
      this.tiles[i].material.color.set(this.color);
    }
  }
}

class Stand extends Object3d {
  constructor(x, y, z, h) {
    super(x, y, z);
    this.h = h;
    this.color = 0x464646;
    this.slabs = [];

    this.addSlab(0, 2.5, 0);
    this.addArm(0, 5 + h / 2, 0);
    this.addSlab(0, 7.5 + h, 0);
    this.castShadow = true;
  }

  addSlab(x, y, z) {
    let geometry = new THREE.CubeGeometry(this.h / 2, 5, this.h / 2);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.material.color.set(this.color);
    this.slabs.push(mesh);

    this.add(mesh);
  }

  addArm(x, y, z) {
    let geometry = new THREE.CubeGeometry(5, this.h, 5);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.material.color.set(this.color);
    this.arm = mesh;

    this.add(mesh);
  }

  toggleMaterial(n) {
    this.slabs[0].material = this.materialsList[n].clone();
    this.slabs[0].material.color.set(this.color);

    this.slabs[1].material = this.materialsList[n].clone();
    this.slabs[1].material.color.set(this.color);

    this.arm.material = this.materialsList[n].clone();
    this.arm.material.color.set(this.color);
  }
}

class Spotlight extends Object3d {
  constructor(x, y, z, obj, int) {
    super(x, y, z);

    this.coneMaterial =
        new THREE.MeshPhongMaterial({color: 0x000000, side: THREE.DoubleSide});

    this.bulbMaterial =
        new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
    this.onMaterial =
        new THREE.MeshBasicMaterial({color: 0xff0000, side: THREE.DoubleSide});


    this.addCone();
    this.addSphere();
    this.addSignal();
    this.addLight(obj, int);
    this.lookAt(obj.position);
  }

  addSignal() {
    var geo = new THREE.SphereGeometry(2, 20, 20);
    var mesh = new THREE.Mesh(geo, this.onMaterial);
    mesh.position.set(0, 0, -10);
    this.on = mesh;
    this.add(mesh);
  }

  addCone() {
    var geo = new THREE.ConeGeometry(10, 20, 50, 5, true);
    var mesh = new THREE.Mesh(geo, this.coneMaterial);
    mesh.rotateX(-Math.PI / 2);
    this.add(mesh);
  }

  addSphere() {
    var geo = new THREE.SphereGeometry(5, 25, 25);
    var mesh = new THREE.Mesh(geo, this.bulbMaterial);
    mesh.position.set(0, 0, 5);
    this.add(mesh);
  }

  addLight(obj, int) {
    var spotlight = new THREE.SpotLight(0xffffff, int);
    spotlight.position.set(this.position.x, this.position.y, this.position.z);
    spotlight.angle = Math.PI / 4;
    spotlight.castShadow = true;

    spotlight.target = obj;

    spotlight.shadow.mapSize.width = 128;
    spotlight.shadow.mapSize.height = 128;

    spotlight.shadow.camera.near = 0.5;
    spotlight.shadow.camera.far = 400;
    spotlight.shadow.camera.fov = 30;
    this.light = spotlight;

    scene.add(spotlight);
  }

  toggleLight() {
    this.light.visible = !this.light.visible;
    this.on.visible = !this.on.visible;
  }
}


class Painting extends Object3d {
  constructor(x, y, z, k, squares, line) {
    super(x, y, z);
    this.k = k;
    this.bgL = this.k * 6;
    this.bgW = this.k / 4;
    this.bgH = this.k * 3;

    this.squares_l = squares;  // Number of squares in a line
    this.line = line;          // Size of each grey line
    this.l = (this.bgL - this.squares_l * this.line) /
        this.squares_l;  // Size of the squares' size
    this.squares_h =
        this.bgH / (this.line + this.l);     // Number of squares in a column
    this.r = Math.sqrt(this.line ** 2 / 2);  // Radius of each circle
    this.circles = [];
    this.squares = [];


    this.bgColor = 0x676c70;
    this.squareColor = 0x000000;
    this.circleColor = 0xffffff;
    this.frameColor = 0x5d432c;

    this.addBackground();
    this.addSquares();
    this.addCircles();

    this.castShadow = true;
  }


  addBackground() {
    let geometry = new THREE.CubeGeometry(this.bgL, this.bgH, this.bgW);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.bgColor);
    mesh.position.set(0, 0, 0);
    this.bg = mesh;

    this.add(mesh);

    geometry =
        new THREE.CubeGeometry(this.bgL * 1.05, this.bgH * 1.1, this.bgW / 2);
    var mesh1 = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh1.material.color.set(this.frameColor);
    this.frame = mesh1;
    mesh1.position.set(0, 0, 0);
    this.add(mesh1);
  }

  addSquares() {
    var geometry = new THREE.CubeGeometry(this.l / 2, this.l / 2, 1);

    var mesh1 = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh1.material.color.set(this.squareColor);
    mesh1.position.set(
        -this.bgL / 2 + this.l / 4, this.bgH / 2 - this.l / 4,
        this.bgW / 2);  // Canto sup esq
    this.squares.push(mesh1);
    this.add(mesh1);

    var mesh2 = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh2.material.color.set(this.squareColor);
    mesh2.position.set(
        this.bgL / 2 - this.l / 4, this.bgH / 2 - this.l / 4,
        this.bgW / 2);  // Canto sup dto
    this.squares.push(mesh2);
    this.add(mesh2);

    var mesh3 = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh3.material.color.set(this.squareColor);
    mesh3.position.set(
        -this.bgL / 2 + this.l / 4, -this.bgH / 2 + this.l / 4, this.bgW / 2);
    this.squares.push(mesh3);
    this.add(mesh3);

    var mesh4 = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh4.material.color.set(this.squareColor);
    mesh4.position.set(
        this.bgL / 2 - this.l / 4, -this.bgH / 2 + this.l / 4, this.bgW / 2);
    this.squares.push(mesh4);
    this.add(mesh4);

    var square_pos_l = -this.bgL / 2 + this.l + this.line;

    for (let i = 0; i < this.squares_l - 1; i++) {
      let geometry = new THREE.CubeGeometry(this.l, this.l / 2, 1);

      let mesh5 = new THREE.Mesh(geometry, this.materialsList[1].clone());
      mesh5.material.color.set(this.squareColor);
      mesh5.position.set(square_pos_l, this.bgH / 2 - this.l / 4, this.bgW / 2);
      this.squares.push(mesh5);
      this.add(mesh5);

      let mesh6 = new THREE.Mesh(geometry, this.materialsList[1].clone());
      mesh6.material.color.set(this.squareColor);
      mesh6.position.set(
          square_pos_l, -this.bgH / 2 + this.l / 4, this.bgW / 2);
      this.squares.push(mesh6);
      this.add(mesh6);

      square_pos_l += this.l + this.line;
    }

    var square_pos_h = this.bgH / 2 - this.l - this.line;

    for (let i = 0; i < this.squares_h - 1; i++) {
      let geometry = new THREE.CubeGeometry(this.l / 2, this.l, 1);

      let mesh5 = new THREE.Mesh(geometry, this.materialsList[1].clone());
      mesh5.material.color.set(this.squareColor);
      mesh5.position.set(
          -this.bgL / 2 + this.l / 4, square_pos_h, this.bgW / 2);
      this.squares.push(mesh5);
      this.add(mesh5);

      let mesh6 = new THREE.Mesh(geometry, this.materialsList[1].clone());
      mesh6.material.color.set(this.squareColor);
      mesh6.position.set(this.bgL / 2 - this.l / 4, square_pos_h, this.bgW / 2);
      this.squares.push(mesh6);
      this.add(mesh6);

      square_pos_h -= (this.l + this.line);
    }

    square_pos_l = -this.bgL / 2 + this.l + this.line;
    square_pos_h = this.bgH / 2 - this.l - this.line;
    for (let i = 0; i < this.squares_h - 1; i++) {
      for (let j = 0; j < this.squares_l - 1; j++) {
        let geometry = new THREE.CubeGeometry(this.l, this.l, 1);
        let mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
        mesh.material.color.set(this.squareColor);
        mesh.position.set(square_pos_l, square_pos_h, this.bgW / 2);
        this.squares.push(mesh);
        this.add(mesh);

        square_pos_l += this.l + this.line;
      }
      square_pos_l = -this.bgL / 2 + this.l + this.line;
      square_pos_h -= (this.l + this.line);
    }
  }

  addCircles() {
    var circle_pos_l = (-this.bgL + this.l + this.line) / 2;
    var circle_pos_h = this.bgH / 2 - this.l / 2 - this.line / 2;

    for (let i = 0; i < this.squares_h; i++) {
      for (let j = 0; j < this.squares_l; j++) {
        let geometry = new THREE.CylinderGeometry(this.r, this.r, 1, 32);
        let mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
        mesh.material.color.set(this.circleColor);
        mesh.position.set(circle_pos_l, circle_pos_h, this.bgW / 2);
        mesh.rotation.x = Math.PI / 2;
        this.circles.push(mesh);
        this.add(mesh);

        circle_pos_l += this.l + this.line;
      }
      circle_pos_l = (-this.bgL + this.l + this.line) / 2;
      circle_pos_h -= (this.l + this.line);
    }
  }

  toggleMaterial(n) {
    this.frame.material = this.materialsList[n].clone();
    this.frame.material.color.set(this.frameColor);
    this.bg.material = this.materialsList[n].clone();
    this.bg.material.color.set(this.bgColor);
    for (let i = 0; i < this.squares.length; i++) {
      this.squares[i].material = this.materialsList[n].clone();
      this.squares[i].material.color.set(this.squareColor);
    }

    for (let i = 0; i < this.circles.length; i++) {
      this.circles[i].material = this.materialsList[n].clone();
      this.circles[i].material.color.set(this.circleColor);
    }
  }
}