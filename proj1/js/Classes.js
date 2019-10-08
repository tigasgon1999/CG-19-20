class Object3D extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';
    super();

    this.position.x = x;
    this.position.y = y;
    this.position.z = z;
  }
}

class Forearm extends Object3D {
  constructor(x, y, z) {
    'use strict';
    super(x, y, z);
    this.materials = {
      sphere: new THREE.MeshBasicMaterial(
          {color: 0xff0000, wireframe: true, side: THREE.DoubleSide}),
      cube: new THREE.MeshBasicMaterial(
          {color: 0x00ff00, wireframe: true, side: THREE.DoubleSide}),
      hand: new THREE.MeshBasicMaterial(
          {color: 0xffff00, wireframe: true, side: THREE.DoubleSide})
    };

    this.addSphere(x, -2.5, z);
    this.addParallelepiped(x, 2.5, z);
    this.addSphere(x, 18.3, z);
    this.addHand(x, 23.5, z);
    this.finger1 = this.addFinger(x - 2, 25, z);
    this.finger2 = this.addFinger(x + 2, 25, z);
  }

  toggleWireframe() {
    'use strict';
    this.materials.sphere.wireframe = !this.materials.sphere.wireframe;
    this.materials.cube.wireframe = !this.materials.cube.wireframe;
    this.materials.hand.wireframe = !this.materials.hand.wireframe;
  }

  rotateZ(delta) {
    'use strict';
    this.rotation.z += delta;
  }

  addSphere(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        this.jointDim.r == null ? 2.5 : this.jointDim.r, 20, 20);
    var mesh = new THREE.Mesh(geometry, this.materials.sphere);
    mesh.position.set(
        x, y + (this.jointDim.r == null ? 2.5 : this.jointDim.r), z);

    this.add(mesh);
  }

  addParallelepiped(x, y, z) {
    'use strict';

    var geometry = new THREE.CubeGeometry(
        this.armDim.l == null ? 2 : this.armDim.l,
        this.armDim.h == null ? 16 : this.armDim.h,
        this.armDim.w == null ? 2 : this.armDim.w);
    var mesh = new THREE.Mesh(geometry, this.materials.cube);
    mesh.position.set(
        x, y + (this.armDim.h == null ? 8 : this.armDim.h / 2), z);

    this.add(mesh);
  }

  addHand(x, y, z) {
    'use strict'

    var geometry = new THREE.CubeGeometry(
        this.handDim.l == null ? 5 : this.handDim.l,
        this.handDim.h == null ? 1.5 : this.handDim.h,
        this.handDim.w == null ? 1 : this.handDim.w);
    var mesh = new THREE.Mesh(geometry, this.materials.hand);
    mesh.position.set(
        x, y + (this.handDim.h == null ? 0.75 : this.handDim.h / 2), z);

    this.add(mesh);
  }

  addFinger(x, y, z) {
    'use strict'

    var geometry = new THREE.CubeGeometry(
        this.fingersDim.l == null ? 1 : this.fingersDim.l,
        this.fingersDim.h == null ? 3 : this.fingersDim.h,
        this.fingersDim.w == null ? 1 : this.fingersDim.w);
    var mesh = new THREE.Mesh(geometry, this.materials.hand);
    mesh.position.set(
        x, y + (this.fingersDim.h == null ? 1.5 : this, this.fingersDim.h), z);

    this.add(mesh);

    return mesh;
  }
}

class Arm extends Object3D {
  constructor(x, y, z, arm, joint, hand, fingers, semisphere) {
    'use strict';
    super(x, y, z);

    this.armDim = arm;
    this.jointDim = joint;
    this.handDim = hand;
    this.fingersDim = fingers;
    this.semisphereDim = semisphere;

    this.material = new THREE.MeshBasicMaterial({
      color: this.armDim.c == null ? 0x0000ff : this.armDim.c,
      wireframe: true,
      side: THREE.DoubleSide
    });

    this.addParallelepiped(
        x, this.semisphereDim.r == null ? 2.5 : this.semisphereDim.r, z);
    this.addForearm(
        x,
        (this.semisphereDim.r == null ? 2.5 : this.semisphereDim.r) +
            (this.jointDim.r == null ? 2.5 : this, this.jointDim.r) +
            (this.armDim.h == null ? 16 : this.armDim.h),
        z);
    this.forearm.rotateZ(-Math.PI / 2);
  }

  toggleWireframe() {
    'use strict';
    this.material.wireframe = !this.material.wireframe;
    this.forearm.toggleWireframe();
  }

  rotateY(delta) {
    'use strict';
    this.rotation.y += delta;
  }

  rotateZ(delta) {
    'use strict';
    this.rotation.z += delta;
  }

  addParallelepiped(x, y, z) {
    'use strict';

    var geometry = new THREE.CubeGeometry(
        this.armDim.l == null ? 2 : this.armDim.l,
        this.armDim.h == null ? 16 : this.armDim.h,
        this.armDim.w == null ? 2 : this.armDim.w);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y + this.armDim.h / 2, z);
    this.pipe = mesh;

    this.add(mesh);
  }

  addForearm(x, y, z) {
    'use strict';
    var forearm = new Forearm(
        x, y, z, this.armDim, this.jointDim, this.handDim, this.fingersDim);
    this.forearm = forearm;

    this.add(forearm);
  }
}
class Car extends Object3D {
  /* new Car(x: x coordinate, y: y coordinate, z: z coordinate, table:{l:
      lenght, h: height, w: width, c: color }, wheel:{r:radius, c: color},
      semisphere:{r: radius, c:color}, arm:{l:lenght, h:height, w: widht,
      c:color}, joint:{r: radius, c:color}, hand:{l:lenght, h:height; w:widht,
      c:color}, fingers:{l:lenght, h:height, w:width; c:color} )*/
  constructor(x, y, z, table, wheel, semisphere, arm, joint, hand, fingers) {
    'use strict';
    super(x, y, z);

    this.tableDim = table;
    this.wheelDim = wheel;
    this.semisphereDim = semisphere;
    this.armDim = arm;
    this.jointDim = joint;
    this.handDim = hand;
    this.fingersDim = fingers;


    this.materials = {
      car: new THREE.MeshBasicMaterial({
        color: this.tableDim.c == null ? 0x00ff00 : this.tableDim.c,
        wireframe: true,
        side: THREE.DoubleSide
      }),
      wheel: new THREE.MeshBasicMaterial({
        color: this.wheelDim.c == null ? 0xa9a9a9 : this.wheelDim.c,
        wireframe: true,
        side: THREE.DoubleSide
      }),

      sphere: new THREE.MeshBasicMaterial({
        color: this.semisphereDim.c == null ? 0xff0000 : this.semisphereDim.c,
        wireframe: true,
        side: THREE.DoubleSide
      })
    };

    this.addTableTop(x, 4.5, z);
    this.addWheel(x - 20, 2, z - 7.5);
    this.addWheel(x - 20, 2, z + 7.5);
    this.addWheel(x + 20, 2, z - 7.5);
    this.addWheel(x + 20, 2, z + 7.5);
    this.addSphericalCap(x, 5, z);
    this.addArm(x, 5, z);
  }

  checkRotation(delta) {
    var v1 = new THREE.Vector3();
    var v2 = new THREE.Vector3();
    if (delta < 0) {
      v1.y = this.fingersDim.h / 2;
      v1.x = this.fingersDim.l / 2;
      this.arm.forearm.finger1.localToWorld(v1);
      if (v1.y < 0.1) {
        return false;
      }
      return true;
    } else if (delta > 0) {
      v2.y = this.armDim.h / -2;
      v2.x = this.armDim.l / -2;
      this.arm.pipe.localToWorld(v2);
      if (v2.y < 5) {
        return false;
      }
      return true;
    }
    return true;
  }

  toggleWireframe() {
    'use strict';
    this.materials.car.wireframe = !this.materials.car.wireframe;
    this.materials.wheel.wireframe = !this.materials.wheel.wireframe;
    this.materials.sphere.wireframe = !this.materials.sphere.wireframe;
    this.arm.toggleWireframe();
  }

  moveX(delta) {
    'use strict';
    this.position.x += delta;
  }

  moveZ(delta) {
    'use strict';
    this.position.z += delta;
  }

  rotateY(delta) {
    'use strict';
    this.arm.rotateY(delta);
  }

  rotateZ(delta) {
    'use strict';
    if (this.checkRotation(delta)) {
      this.arm.rotateZ(delta);
    }
  }

  addSphericalCap(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        this.semisphereDim.r == null ? 2.5 : this.semisphereDim.r, 20, 20, 0,
        6.3, 0, 0.5 * Math.PI);  // Semisphere
    var mesh = new THREE.Mesh(geometry, this.materials.sphere);
    mesh.position.set(x, y, z);
    this.sphericalCap = mesh;

    this.add(mesh);
  }

  addArm(x, y, z) {
    'use strict';
    var arm = new Arm(
        x, y, z, this.armDim, this.jointDim, this.handDim, this.fingersDim,
        this.semisphereDim);
    this.arm = arm;
    this.add(arm);
  }

  addTableTop(x, y, z) {
    'use strict';



    var geometry = new THREE.CubeGeometry(
        this.tableDim.l == null ? 40 : this.tableDim.l,
        this.tableDim.h == null ? 1 : this.tableDim.h,
        this.tableDim.w == null ? 15 : this.tableDim.w);
    var mesh = new THREE.Mesh(geometry, this.materials.car);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  addWheel(x, y, z) {
    'use strict';

    var geometry = new THREE.SphereGeometry(
        this.wheelDim.r == null ? 2 : this.wheelDim.r, 7, 7);
    var mesh = new THREE.Mesh(geometry, this.materials.wheel);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
}

class Stand extends Object3D {
  constructor(x, y, z) {
    'use strict';
    super(x, y, z);

    this.material = new THREE.MeshBasicMaterial(
        {color: 0x800080, wireframe: true, side: THREE.DoubleSide});

    this.addCylinder(x, 15, z);
  }

  addCylinder(x, y, z) {
    'use strict';

    var geometry = new THREE.CylinderGeometry(6, 6, 30, 30, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  toggleWireframe() {
    this.material.wireframe = !this.material.wireframe;
  }
}

class Target extends Object3D {
  constructor(x, y, z) {
    'use strict';
    super(x, y, z);

    this.material = new THREE.MeshBasicMaterial(
        {color: 0xFFB6C1, wireframe: true, side: THREE.DoubleSide});

    this.addToroid(x, 5, z);
  }

  addToroid(x, y, z) {
    'use strict';

    var geometry = new THREE.TorusGeometry(4, 1, 20, 20);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }

  toggleWireframe() {
    'use strict';
    this.material.wireframe = !this.material.wireframe;
  }
}