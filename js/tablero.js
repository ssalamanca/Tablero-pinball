var scene = new THREE.Scene();
var aspect = window.innerWidth / window.innerHeight;
var camera = new THREE.PerspectiveCamera(60, aspect, 0.1, 1000);
var renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
//camera.position.z = 200;
//camera.position.y = 70;
camera.position.set(0, 190, 125);
var controls = new THREE.OrbitControls(camera);
controls.minDistance = 20;
controls.maxDistance = 200;
var geometryPelota, materialPelota, geometryPiso, materialPiso, piso, pelotas = [], totalPelotas = 3, GameOver = false, PhMesh, PhFric, PhRes, turningFlips = [];
materialPelota = new THREE.MeshPhongMaterial({ color: 0xffffff, emissive: 0x444444, specular: 0x555555, shininess: 200 });
geometryPelota = new THREE.SphereGeometry(2.25, 12, 12);
var rPad, lPad, rPadUp = false, lPadUp = false, rPadPos = new THREE.Vector3(19.9, 3.75, 72), lPadPos = new THREE.Vector3(-19.9, 3.75, 72),
    rPadRot = new THREE.Vector3(0, 0.5236, 0), lPadRot = new THREE.Vector3(0, -0.5236, 0);//+-30 * Math.PI/180
var vy = 0, vx = 0, gravity = 0.3;

PhFric = 0.1;
PhRes = 0.8;

crearTablero();
crearPared(70, 15, -20, 0, 0, 0, Math.PI / 2, 0, parseInt('0xccffcc'), 'images/wall_texture.jpg', "paredIzquierda");//Pared izquierda
crearPared(70, 15, 20, 0, 0, 0, Math.PI / 2, 0, parseInt('0xccffcc'), 'images/wall_texture.jpg', "paredDerecha");//Pared derecha
crearPared(40, 15, 0, 0, -35, 0, 0, 0, parseInt('0xccffcc'), 'images/wall_texture.jpg', "paredAdelante");//Pared adelante
crearPared(40, 15, 0, 0, 35, 0, 0, 0, parseInt('0xccffcc'), 'images/wall_texture.jpg', "paredAtras");//Pared atras
crearPared(40, 70, 0, -7.5, 0, Math.PI / 2, 0, 0, parseInt('FA8072'), 'images/floor_texture.jpg', "piso"); //Piso
crearPelota();
document.onkeydown = handleKeyDown;
document.onkeyup = handleKeyUp;



var render = function () {
    requestAnimationFrame(render);
    //document.addEventListener('keydown', handleKeyDown, false);
    //document.addEventListener('keydown', handleKeyUp, false);
    //Pongo la logica de las palancas aca
    if (lPadUp) {
        if (lPad.rotation.y <= 0.6764) {
            lPad.rotation.y += 0.1;
            //console.log(lPad.rotation.y);
        }
    } else {
        if (lPad.rotation.y >= -0.5236) {
            lPad.rotation.y -= 0.1;
        }
    }
    if (rPadUp) {
        if (rPad.rotation.y >= -0.6764) {
            rPad.rotation.y -= 0.1;
        }
    } else {
        if (rPad.rotation.y <= 0.5236) {
            rPad.rotation.y += 0.1;
        }
    }



    renderer.render(scene, camera);
};
function crearTablero() {
    Mat = new THREE.MeshPhongMaterial({ color: 0xee9933, specular: 0x885533, emissive: 0x553311, shininess: 50 }); //, opacity: 0.67, transparent: true

    // Estructura del tablero
    var shape = new THREE.Shape();

    shape.moveTo(15, -90);
    shape.lineTo(57, -62.75);
    shape.lineTo(57, -85);
    shape.lineTo(63, -85);
    shape.lineTo(63, 30);
    shape.bezierCurveTo(63, 109, -58, 109, -58, 30);

    shape.lineTo(-58, 25);
    shape.lineTo(-50, 17.5);
    shape.lineTo(-58, 0);

    shape.lineTo(-58, -61.75);
    shape.lineTo(-15, -90);
    shape.lineTo(-60, -90);
    shape.lineTo(-60, 90);
    shape.lineTo(65, 90);
    shape.lineTo(65, -90);
    shape.lineTo(15, -90);

    var extrudeSettings = {
        depth: 10,
        bevelEnabled: true,
        bevelSegments: 2,
        bevelSize: 0.5,
        bevelThickness: 0.5,
        curveSegments: 35
    };

    var geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);

    Mesh = new THREE.Mesh(geometry, Mat);
    Mesh.receiveShadow = true;
    Mesh.castShadow = true;
    Mesh.rotation.set(-90 * Math.PI / 180, 0, 0);
    Mesh.position.set(0, 0, 0);
    //Mesh.visible = false;
    scene.add(Mesh);
    shape = new THREE.Shape();
    shape.moveTo(-19, 3);
    shape.lineTo(19, 3);
    shape.lineTo(19, 0);
    shape.lineTo(-19, 0);

    // Piso
    geometryPiso = new THREE.BoxGeometry(125, 4, 180);
    var texturePiso = new THREE.TextureLoader().load("images/floor_texture.jpg");
    materialPiso = new THREE.MeshBasicMaterial({ map: texturePiso, side: THREE.DoubleSide });
    piso = new THREE.Mesh(geometryPiso, materialPiso);
    //PhMesh.receiveShadow = true;
    piso.position.set(2.5, 0, 0);
    piso.name = "piso";
    scene.add(piso);

    /*
    var geometryTecho = new THREE.BoxGeometry(130, 4, 180);
    var meshTecho= new THREE.Mesh(geometryTecho, materialPiso );
	meshTecho.position.set( 2.5, 12.75, -1 );
	meshTecho.visible = false; // Pysijs bleibt erhalten
    scene.add( meshTecho ); 
    */
    // ------------------------------------- Paddles -----------------------------------
    Shp = new THREE.Shape();
    Shp.moveTo(-15, -1.5);
    Shp.lineTo(0, -3);
    Shp.bezierCurveTo(4.5, -3, 4.5, 3, 0, 3);
    Shp.lineTo(-15, 1.5);
    Shp.bezierCurveTo(-17, 0.75, -17, -0.75, -15, -1.5); // close


    // Paddle right
    Geo = Shp.extrude({ amount: 3.5, bevelEnabled: false, bevelSegments: 1, bevelSize: 0.25, bevelThickness: 0.25, curveSegments: 6 });
    Geo.applyMatrix(new THREE.Matrix4().makeRotationX(-90 * Math.PI / 180));
    Mat = Physijs.createMaterial(new THREE.MeshPhongMaterial({ color: 0xcccccc, specular: 0x999999, shininess: 175 }), 0.4, 0.8);
    rPad = new Physijs.ConvexMesh(Geo, Mat, 10000000);
    rPad.rotation.set(rPadRot.x, rPadRot.y, rPadRot.z);
    rPad.position.set(rPadPos.x, rPadPos.y, rPadPos.z);
    scene.add(rPad);

    // Paddle left
    Geo = Geo.clone();
    Geo.applyMatrix(new THREE.Matrix4().makeRotationY(180 * Math.PI / 180));
    Mat = Physijs.createMaterial(new THREE.MeshPhongMaterial({ color: 0xeeeeee, specular: 0x1c1c1c, shininess: 200 }), 0.4, 0.8);
    lPad = new Physijs.ConvexMesh(Geo, Mat, 10000000);
    lPad.rotation.set(lPadRot.x, lPadRot.y, lPadRot.z);
    lPad.position.set(lPadPos.x, lPadPos.y, lPadPos.z);
    scene.add(lPad);



}
function crearPared(width, height, positionX, positionY, positionZ, rotationX, rotationY, rotationZ, colorPared, textura, nombre) {

    var geometry = new THREE.PlaneGeometry(width, height);
    var texture = new THREE.TextureLoader().load(textura);
    var material = new THREE.MeshBasicMaterial({ map: texture, side: THREE.DoubleSide });
    var plane = new THREE.Mesh(geometry, material);
    if (positionX != 0) { plane.position.x = positionX; }
    if (positionY != 0) { plane.position.y = positionY; }
    if (positionZ != 0) { plane.position.z = positionZ; }

    if (rotationX != 0) { plane.rotation.x = rotationX; }
    if (rotationY != 0) { plane.rotation.y = rotationY; }
    if (rotationZ != 0) { plane.rotation.z = rotationZ; }

    plane.name = nombre;

    scene.add(plane);
}
function crearPelota(ObjetoPelota) {
    var pelota = new THREE.Mesh(geometryPelota, materialPelota);
    if (ObjetoPelota == undefined) {
        pelota.position.set(60, 5, 65); // Posicion de entrada
    } else {
        // Multiball, aktueller Ball, wird an dessen Pos. verdoppelt
        pelota.position.copy(ObjetoPelota.position).add(new THREE.Vector3(3, 0, 3));
    }
    //ball.castShadow = true;
    scene.add(pelota);
    pelotas.push(pelota);
    pelota = null;
}
function handleKeyDown(e) {
    console.log("Entro oprimo hacia abajo");
    if (e.keyCode == 37) {
        console.log("Izquierdo");
        lPadUp = true;

    }
    if (e.keyCode == 39) {
        console.log("Derecho");
        rPadUp = true;
        console.log(rPad.position.y);
    }
}

function handleKeyUp(e) {
    console.log("Entro suelta el boton");
    if (e.keyCode == 37) {
        console.log("Suelta el boton Izquierdo");
        lPadUp = false;

    }
    if (e.keyCode == 39) {
        console.log("Suelta el boton Derecho");
        rPadUp = false;

    }
}


render();

