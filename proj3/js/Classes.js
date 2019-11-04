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
  constructor(x, y, z, k, squares, line) {
    super(x, y, z);


    this.k = k;
    this.bgL = this.k * 6;
    this.bgW = this.k / 4;
    this.bgH = this.k * 3;
    
    this.squares_l = squares;                                         //Number of squares in a line
    this.line = line;                                                 //Size of each grey line
    this.l = (this.bgL - this.squares_l * this.line)/this.squares_l;  //Size of the squares' size
    this.squares_h = this.bgH / (this.line + this.l);                 //Number of squares in a column
    this.r = Math.sqrt(this.line**2 /2);                                //Radius of each circle


    this.bgMaterial =
        new THREE.MeshBasicMaterial({color: 0x808080, side: THREE.DoubleSide});
    this.squareMaterial = new THREE.MeshLambertMaterial(
        {color: 0x000000, side: THREE.DoubleSide});
    this.circleMaterial =
        new THREE.MeshPhongMaterial({color: 0xffffff, side: THREE.DoubleSide});
    this.frameMaterial = 
        new THREE.MeshLambertMaterial({color: 0x5D432c, side: THREE.DoubleSide});

    this.addBackground();
    this.addSquares();
    this.addCircles();
  }


  addBackground() {
    let geometry = new THREE.CubeGeometry(this.bgL, this.bgH, this.bgW);
    var mesh = new THREE.Mesh(geometry, this.bgMaterial);
    mesh.position.set(0, this.bgH / 2, 0);
    this.add(mesh);

    geometry = new THREE.CubeGeometry(this.bgL*1.05, this.bgH*1.1, this.bgW/2);
    var mesh1 = new THREE.Mesh(geometry, this.frameMaterial);
    mesh1.position.set(0, this.bgH / 2, 0);
    this.add(mesh1); 
  }

  addSquares(){
    var geometry = new THREE.CubeGeometry(this.l/2, this.l/2, 1);

    var mesh1 = new THREE.Mesh(geometry, this.squareMaterial);
    mesh1.position.set(-this.bgL/2 + this.l/4, this.bgH - this.l/4, this.bgW/2 );  //Canto sup esq
    this.add(mesh1);

    var mesh2 = new THREE.Mesh(geometry, this.squareMaterial);
    mesh2.position.set(this.bgL/2 - this.l/4, this.bgH - this.l/4, this.bgW/2 );   //Canto sup dto
    this.add(mesh2);

    var mesh3 = new THREE.Mesh(geometry, this.squareMaterial);
    mesh3.position.set(-this.bgL/2 + this.l/4, this.l/4, this.bgW/2 );   
    this.add(mesh3);

    var mesh4 = new THREE.Mesh(geometry, this.squareMaterial);
    mesh4.position.set(this.bgL/2 - this.l/4, this.l/4, this.bgW/2 );
    this.add(mesh4);

    var square_pos_l = -this.bgL/2 + this.l + this.line;

    for(let i = 0; i < this.squares_l-1; i++){
      let geometry = new THREE.CubeGeometry(this.l, this.l/2, 1);

      let mesh5 = new THREE.Mesh(geometry, this.squareMaterial);
      mesh5.position.set(square_pos_l, this.bgH - this.l/4, this.bgW/2);
      scene.add(mesh5);
      
      let mesh6 = new THREE.Mesh(geometry, this.squareMaterial);
      mesh6.position.set(square_pos_l, this.l/4, this.bgW/2);
      scene.add(mesh6);

      square_pos_l += this.l + this.line;
    }

    var square_pos_h = this.bgH - this.l - this.line;

    for(let i = 0; i < this.squares_h-1; i++){
      let geometry = new THREE.CubeGeometry(this.l/2, this.l, 1);

      let mesh5 = new THREE.Mesh(geometry, this.squareMaterial);
      mesh5.position.set(-this.bgL/2 + this.l/4, square_pos_h, this.bgW/2);
      scene.add(mesh5);
      
      let mesh6 = new THREE.Mesh(geometry, this.squareMaterial);
      mesh6.position.set(this.bgL/2 - this.l/4, square_pos_h, this.bgW/2);
      scene.add(mesh6);

      square_pos_h -= (this.l + this.line);
    }

    square_pos_l = -this.bgL/2 + this.l + this.line;
    square_pos_h = this.bgH - this.l - this.line;
    for(let i = 0; i < this.squares_h-1; i++){
      for(let j = 0; j < this.squares_l-1; j++) {
        let geometry = new THREE.CubeGeometry(this.l, this.l, 1);
        let mesh = new THREE.Mesh(geometry, this.squareMaterial);
        mesh.position.set(square_pos_l, square_pos_h, this.bgW/2);
        scene.add(mesh);

        square_pos_l += this.l + this.line;
      }
      square_pos_l = -this.bgL/2 + this.l + this.line;
      square_pos_h -= (this.l + this.line);
    }

    // spotlight, and spotLight helper
    var spotLight = new THREE.SpotLight(0xffffff, 1/*, 200, Math.PI/8*/),
    spotLightHelper = new THREE.SpotLightHelper(spotLight);
    spotLight.add(spotLightHelper);
    scene.add(spotLight);
 
    // set position of spotLight,
    // and helper bust be updated when doing that
    spotLight.position.set(0, 30, 80);
    spotLightHelper.update();
    
  }

  addCircles(){
    var circle_pos_l = (-this.bgL + this.l + this.line)/2;
    var circle_pos_h = this.bgH - this.l/2 - this.line/2;

    for(let i = 0; i < this.squares_h; i++){
      for(let j = 0; j < this.squares_l; j++) {
        let geometry = new THREE.CylinderGeometry( this.r, this.r, 1, 32);
        let mesh = new THREE.Mesh(geometry, this.circleMaterial);
        mesh.position.set(circle_pos_l, circle_pos_h, this.bgW/2);
        mesh.rotation.x = Math.PI/2;
        scene.add(mesh);

        circle_pos_l += this.l + this.line;
      }
      circle_pos_l = (-this.bgL + this.l + this.line)/2;
      circle_pos_h -= (this.l + this.line);
    }
  }
}