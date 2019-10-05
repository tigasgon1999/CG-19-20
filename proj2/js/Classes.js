class Object3d extends THREE.Object3D {
  constructor(x, y, z) {
    'use strict';

    super(x, y, z);
  }
}

class Wall extends Object3d {
  constructor(x, y, z, h, theta) {
    'use strict';

    super(x, y, z);

    this.material = new THREE.MeshBasicMaterial({
      color: 0xa9a9a9,
      wireframe: false,
      side: THREE.DoubleSide,
    });

    this.addWall(x, 0, z, h, theta);
  }

  addWall(x, y, z, h, theta) {
    'use strict';


    var geometry = new THREE.CubeGeometry(2, h, 2 * h);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);
    mesh.rotation.y = theta;

    this.add(mesh);
  }
}

class Ball extends Object3d {
  constructor(x, y, z, r) {
    'use strict';

    super(x, y, z);

    this.material = new THREE.MeshBasicMaterial(
        {color: getRandomColor(), side: THREE.DoubleSide, wireframe: false});

    this.addBall(x, 0, z, r);
  }

  addBall(x, y, z, r) {
    'use strict';

    var geometry = new THREE.SphereGeometry(r, 7, 7);
    var mesh = new THREE.Mesh(geometry, this.material);
    mesh.position.set(x, y, z);

    this.add(mesh);
  }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}