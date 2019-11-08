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
    this.wallColor = 0xa9a9a9;
    this.bottomColor = 0xffffff;

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
    mesh.receiveShadow = true;
    this.add(mesh);
  }

  addBottom() {
    let geometry = new THREE.CubeGeometry(this.l, this.h / 20, 5);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.bottomColor);
    mesh.position.set(0, 5, 0);
    mesh.rotateY(this.theta);
    mesh.receiveShadow = true;
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
    this.bottomH = h / 40;
    this.axis = new THREE.Vector3(0, 1, 0);

    this.toCentre = new THREE.Vector3().sub(this.position);

    // this.wallColor = 0xe8e4c9;
    // this.bottomColor = 0x5d432c;
    this.wallColor = 0xa9a9a9;
    this.bottomColor = 0xffffff;

    this.addWall();
    this.addBottom();
  }

  toggleMaterial(n) {
    this.wall.material = this.materialsList[n].clone();
    this.wall.material.color.set(this.wallColor);
    this.bottom.material = this.materialsList[n].clone();
    this.bottom.material.color.set(this.bottomColor);
  }

  addWall() {
    var geometry = new THREE.Geometry();

    for (let i = 0; i <= this.n; i++) {
      for (let j = 0; j <= this.n; j++) {
        let xpos = (-this.l / 2) + i * (this.sl);
        let ypos = this.h - j * this.sh;
        let ver = new THREE.Vector3(xpos, ypos, 0);
        this.worldToLocal(ver);
        ver.applyAxisAngle(this.axis, this.theta);
        geometry.vertices.push(ver);
      }
    }

    for (let l = 0; l < geometry.vertices.length - this.n - 2;
         l += this.n + 1) {
      for (let v = l; v < l + this.n; v++) {
        geometry.faces.push(
            new THREE.Face3(v, v + 1, v + this.n + 1),
            new THREE.Face3(v + 1, v + this.n + 2, v + this.n + 1));
      }
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.wallColor);
    mesh.receiveShadow = true;
    this.wall = mesh;
    this.add(mesh);
  }

  addBottom() {
    let geometry = new THREE.CubeGeometry(this.l, this.bottomH, 5);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.bottomColor);
    mesh.position.set(0, 5, 0);
    mesh.rotateY(this.theta);
    mesh.receiveShadow = true;
    this.bottom = mesh;
    this.add(mesh);
  }

  // addBottom() {
  //   var geometry = new THREE.Geometry();

  //   for (let i = 0; i <= this.n; i++) {
  //     for (let j = 0; j <= 1; j++) {
  //       let xpos = (-this.l / 2) + i * (this.sl);
  //       let ypos = this.bottomH - j * this.bottomH;
  //       let ver = new THREE.Vector3(xpos, ypos, 2.5);
  //       this.worldToLocal(ver);
  //       ver.applyAxisAngle(this.axis, this.theta);
  //       geometry.vertices.push(ver);
  //     }
  //   }

  //   for (let l = 0; l < geometry.vertices.length - this.n - 2;
  //        l += this.n + 1) {
  //     for (let v = l; v < l + this.n; v++) {
  //       geometry.faces.push(
  //           new THREE.Face3(v, v + 1, v + this.n + 1),
  //           new THREE.Face3(v + 1, v + this.n + 2, v + this.n + 1));
  //     }
  //   }

  //   var offset = geometry.vertices.length;

  //   var ver = new THREE.Vector3(-this.l / 2, this.bottomH, -2.5);  // offset
  //   this.worldToLocal(ver);
  //   ver.applyAxisAngle(this.axis, this.theta);
  //   geometry.vertices.push(ver);

  //   ver = new THREE.Vector3(-this.l / 2, 0, -2.5);  // offset + 1
  //   this.worldToLocal(ver);
  //   ver.applyAxisAngle(this.axis, this.theta);
  //   geometry.vertices.push(ver);

  //   ver = new THREE.Vector3(this.l / 2, this.bottomH, -2.5);  // offset+2
  //   this.worldToLocal(ver);
  //   ver.applyAxisAngle(this.axis, this.theta);
  //   geometry.vertices.push(ver);

  //   ver = new THREE.Vector3(this.l / 2, 0, -2.5);  // offset+3
  //   this.worldToLocal(ver);
  //   ver.applyAxisAngle(this.axis, this.theta);
  //   geometry.vertices.push(ver);

  //   geometry.faces.push(
  //       new THREE.Face3(0, offset, offset + 1),
  //       new THREE.Face3(0, offset + 1, this.n),
  //       new THREE.Face3(offset - 1 - this.n, offset + 2, offset),
  //       new THREE.Face3(offset - 1 - this.n, offset, 0),
  //       new THREE.Face3(offset + 3, offset + 1, offset),
  //       new THREE.Face3(offset + 3, offset, offset + 2),
  //       new THREE.Face3(offset - 1, offset + 3, offset + 2),
  //       new THREE.Face3(offset + 2, offset - 1 - this.n, offset - 1),
  //   );


  //   geometry.computeFaceNormals();
  //   geometry.computeVertexNormals();
  //   var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
  //   mesh.material.color.set(this.wallColor);
  //   mesh.receiveShadow = true;
  //   this.wall = mesh;
  //   this.add(mesh);
  // }
}

class Icosahedron extends Object3d {
  constructor(x, y, z, r) {
    super(x, y, z);
    this.r = r;

    this.color = 0xfadadd;

    var t = (1 + Math.sqrt(5)) / 2;

    this.geometry = new THREE.Geometry();

    this.geometry.vertices.push(
        new THREE.Vector3(-1, t + 0, 1, 0).multiplyScalar(this.r),
        new THREE.Vector3(1, t - 0.1, 0).multiplyScalar(this.r),
        new THREE.Vector3(-1 - 0.2, -t, 0).multiplyScalar(this.r),
        new THREE.Vector3(1 + 0.2, -t, 0).multiplyScalar(this.r),
        new THREE.Vector3(0, -1, t - 0.4).multiplyScalar(this.r),
        new THREE.Vector3(0, 1, t - 0.2).multiplyScalar(this.r),
        new THREE.Vector3(0, -1, -t + 0.1).multiplyScalar(this.r),
        new THREE.Vector3(0, 1, -t - 0.4).multiplyScalar(this.r),
        new THREE.Vector3(t + 0.2, 0, -1).multiplyScalar(this.r),
        new THREE.Vector3(t + 0.1, 0, 1).multiplyScalar(this.r),
        new THREE.Vector3(-t - 0.5, 0, -1).multiplyScalar(this.r),
        new THREE.Vector3(-t + 0.2, 0, 1).multiplyScalar(this.r));

    this.geometry.faces.push(
        new THREE.Face3(0, 11, 5), new THREE.Face3(0, 5, 1),
        new THREE.Face3(0, 1, 7), new THREE.Face3(0, 7, 10),
        new THREE.Face3(0, 10, 11), new THREE.Face3(1, 5, 9),
        new THREE.Face3(5, 11, 4), new THREE.Face3(11, 10, 2),
        new THREE.Face3(10, 7, 6), new THREE.Face3(7, 1, 8),
        new THREE.Face3(3, 9, 4), new THREE.Face3(3, 4, 2),
        new THREE.Face3(3, 2, 6), new THREE.Face3(3, 6, 8),
        new THREE.Face3(3, 8, 9), new THREE.Face3(4, 9, 5),
        new THREE.Face3(2, 4, 11), new THREE.Face3(6, 2, 10),
        new THREE.Face3(8, 6, 7), new THREE.Face3(9, 8, 1));

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();

    var mesh = new THREE.Mesh(this.geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.color);
    mesh.position.set(0, this.r * t, 0);
    this.mesh = mesh;
    this.add(mesh);
    mesh.castShadow = true;
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

    this.color = 0x43464b;

    this.addFloor();

    this.receiveShadow = true;
  }

  addFloor() {
    let geometry = new THREE.CubeGeometry(this.l, 1, this.w);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.color);
    mesh.position.set(0, 0, 0);
    this.floor = mesh;
    mesh.receiveShadow = true;

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

    this.color = 0x43464b;

    this.addFloor();
  }

  addFloor() {
    var geometry = new THREE.Geometry();

    for (let i = 0; i <= this.n; i++) {
      for (let j = 0; j <= this.n; j++) {
        let xpos = (-this.l / 2) + i * (this.seg_l);
        let zpos = (-this.w / 2) + j * this.seg_w;
        let ver = new THREE.Vector3(xpos, 0, zpos);
        geometry.vertices.push(ver);
      }
    }

    for (let l = 0; l < geometry.vertices.length - this.n - 2;
         l += this.n + 1) {
      for (let v = l; v < l + this.n; v++) {
        geometry.faces.push(
            new THREE.Face3(v, v + 1, v + this.n + 1),
            new THREE.Face3(v + 1, v + this.n + 2, v + this.n + 1));
      }
    }
    geometry.computeFaceNormals();
    geometry.computeVertexNormals();
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.material.color.set(this.color);
    mesh.receiveShadow = true;
    this.floor = mesh;
    this.add(mesh);
  }

  toggleMaterial(n) {
    this.floor.material = this.materialsList[n].clone();
    this.floor.material.color.set(this.color);
  }
}

class Stand extends Object3d {
  constructor(x, y, z, h, color) {
    super(x, y, z);
    this.h = h;
    this.baseL = h / 2;
    this.baseH = h / 10;
    this.armL = h / 10;
    color == undefined ? this.color = 0xa9a9a9 : this.color = color;
    this.slabs = [];

    this.addSlab(0, this.baseH / 2, 0);
    this.addArm(0, this.baseH + this.h / 2, 0);
    this.addSlab(0, 1.5 * this.baseH + this.h, 0);
  }

  addSlab(x, y, z) {
    let geometry = new THREE.CubeGeometry(this.baseL, this.baseH, this.baseL);
    var mesh = new THREE.Mesh(geometry, this.materialsList[1].clone());
    mesh.position.set(x, y, z);
    mesh.castShadow = true;
    mesh.material.color.set(this.color);
    this.slabs.push(mesh);

    this.add(mesh);
  }

  addArm(x, y, z) {
    let geometry = new THREE.CubeGeometry(this.armL, this.h, this.armL);
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

    this.coneR = 7;
    this.coneL = this.coneR * 2 + 1;
    this.sphereR = this.coneR / 2;


    this.addCone();
    this.addSphere();
    this.addSignal();
    this.addLight(obj, int);
    this.lookAt(obj.position);
  }

  addSignal() {
    var geo = new THREE.SphereGeometry(2, 20, 20);
    var mesh = new THREE.Mesh(geo, this.onMaterial);
    mesh.position.set(0, 0, -this.coneL / 2);
    this.on = mesh;
    this.add(mesh);
  }

  addCone() {
    var geo = new THREE.ConeGeometry(this.coneR, this.coneL, 30, 5, true);
    var mesh = new THREE.Mesh(geo, this.coneMaterial);
    mesh.rotateX(-Math.PI / 2);
    this.add(mesh);
  }

  addSphere() {
    var geo = new THREE.SphereGeometry(this.sphereR, 25, 25);
    var mesh = new THREE.Mesh(geo, this.bulbMaterial);
    mesh.position.set(0, 0, this.coneL / 4);
    this.add(mesh);
  }

  addLight(obj, int) {
    var spotlight = new THREE.SpotLight(0xffffff, int);
    spotlight.position.set(this.position.x, this.position.y, this.position.z);
    spotlight.angle = Math.PI / 4;
    spotlight.castShadow = true;

    spotlight.target = obj;

    spotlight.shadow.mapSize.width = 512;
    spotlight.shadow.mapSize.height = 512;

    spotlight.shadow.camera.near = 0.5;
    spotlight.shadow.camera.far = 400;
    spotlight.shadow.camera.fov = 30;

    spotlight.decay = 2;
    spotlight.penumbra = 0.2;
    spotlight.distance = 800;
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
    mesh1.position.set(0, 0, 0);
    this.frame = mesh1;
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