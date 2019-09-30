/*global THREE*/

var camera, scene, renderer;

var geometry, material, mesh;

var objects = [];

function addTargetSupport(obj, x, y, z) {
    'use strict';
    
    geometry = new THREE.CylinderGeometry(6, 6, 30, 10, 10);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    obj.add(mesh);
}

function addTargetTorus(obj, x, y, z) {
    'use strict';
    
    geometry = new THREE.TorusGeometry(4, 1, 20, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    obj.add(mesh);
}

function createTarget(x, y, z) {
    'use strict';
    
    var target = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
    
    addTargetSupport(target, 0, 10, 0);
    addTargetTorus(target, 0, 30, 0);
    
    scene.add(target);

    objects.push(target);
    
    target.position.x = x;
    target.position.y = y;
    target.position.z = z;
}

function addTableTop(obj, x, y, z) {
    'use strict';
    
    geometry = new THREE.CubeGeometry(60, 2, 20);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y, z);
    
    obj.add(mesh);
}

function addTableLeg(obj, x, y, z) {
    'use strict';
    
    geometry = new THREE.SphereGeometry(2, 7, 7);
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y - 2, z);
    
    obj.add(mesh);
}

function addSphericalCap(obj, x, y, z) {
    'use strict';
    
    geometry = new THREE.SphereGeometry(5, 7, 7, 0, 6.3, 0, 0.5*Math.PI);   //Semisphere
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(x, y+1, z);
    
    obj.add(mesh);
}

function createTable(x, y, z) {
    'use strict';
    
    var table = new THREE.Object3D();
    
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    
    addTableTop(table, 0, 0, 0);
    addTableLeg(table, -25, -1, -8);
    addTableLeg(table, -25, -1, 8);
    addTableLeg(table, 25, -1, 8);
    addTableLeg(table, 25, -1, -8);
    addSphericalCap(table, 0, 0, 0);
    
    scene.add(table);

    objects.push(table);
    
    table.position.x = x;
    table.position.y = y;
    table.position.z = z;
}

function createCamera() {
    'use strict';
    // camera = new THREE.PerspectiveCamera(100, window.innerWidth / window.innerHeight, 1, 1000);
    camera = new THREE.OrthographicCamera(
        window.innerWidth / -20, window.innerWidth / 20, window.innerHeight / 20,
        window.innerHeight / -20, 0.1, 1000);

    camera.position.x = 0;
    camera.position.y = -1;
    camera.position.z = 0;
    camera.lookAt(scene.position);
}

function createScene() {
    'use strict';
    
    scene = new THREE.Scene();
    
    scene.add(new THREE.AxisHelper(10));
    
    createTable(0, 0, 0);
    createTarget(40, 0, 0);
}

function render() {
    'use strict';
    renderer.render(scene, camera);
}

function onResize() {
    'use strict';

    renderer.setSize(window.innerWidth, window.innerHeight);

    if (window.innerHeight > 0 && window.innerWidth > 0) {
        camera.aspect = renderer.getSize().width / renderer.getSize().height;
        camera.updateProjectionMatrix();
    }
}

function toggleWireframe(obj) {
    obj.children[0].material.wireframe = !obj.children[0].material.wireframe;
}

function onKeyDown(e) {
    'use strict';

    switch(e.keyCode) {
        case 49:  // 1
            camera.position.x = 0;
            camera.position.y = -1;
            camera.position.z = 0;
            camera.lookAt(scene.position)
            break;
        case 50:  // 2
            camera.position.x = 0;
            camera.position.y = 0;
            camera.position.z = 0;
            camera.lookAt(scene.position)
            break;
        case 51:  // 3
            camera.position.x = -1;
            camera.position.y = 0;
            camera.position.z = 0;
            camera.lookAt(scene.position)
            break;
        case 52:    //4
            // scene.traverse(function (node) {
            //     if (node instanceof THREE.Mesh) {
            //         node.material.wireframe = !node.material.wireframe;
            //     }
            // });
            objects.forEach(toggleWireframe);
            break;
    }
}

function animate() {
    'use strict';

    render();

    requestAnimationFrame(animate);
}

function init() {
    'use strict';
    
    renderer = new THREE.WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    
    document.body.appendChild(renderer.domElement);
    
    createScene();
    createCamera();
    
    render();

    window.addEventListener("resize", onResize);
    window.addEventListener("keydown", onKeyDown);
}