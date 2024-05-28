import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { degrees } from "three/examples/jsm/nodes/Nodes.js";
import { degToRad } from "three/src/math/MathUtils.js";
/**
 * Base
 */

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// texture loader
const textureLoader = new THREE.TextureLoader();
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);


// Space Background
const spaceTexture = textureLoader.load("../textures/starmap_2020_4k.jpeg");
const spaceGeometry = new THREE.SphereGeometry(100, 64, 64);
const spaceMaterial = new THREE.MeshBasicMaterial({
  map: spaceTexture,
  //   color: 0xffffff,
  side: THREE.BackSide,
  //   wireframe: true,
});
const spaceMesh = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(spaceMesh);



// Saturn body
// Saturn dimenstions:
// Saturn's diameter: 120.536 km
// Saturn's equatorial radius".: 60.268 km
const saturnTexture = textureLoader.load("../textures/8k_saturn.jpg");
const bumptexture =textureLoader.load('../textures/minas_bump.jpg');
const saturnRadius = 0.60268; // Saturn radius scaled
const geometry = new THREE.IcosahedronGeometry(saturnRadius, 12);
const material = new THREE.MeshBasicMaterial({
     roughness:1, 
     metalness:0,
     map: saturnTexture ,
     bumpMap: bumptexture,
     bumpScale: 0.3,
    });
const saturnMesh = new THREE.Mesh(geometry, material);
saturnMesh.receiveShadow= true;
saturnMesh.castShadow= true;
saturnMesh.layers.set(0);
scene.add(saturnMesh);

// Saturn rings *****************************************************
// Constants for Ring Geometry
// Rings sizes aprox:
// Ring's total diameter: 275.000 km
// Ring's outer radius: 137.500 km
// Ring's inner radius: 127.500 km
const ringInnerRadius = 1.275;
const ringOuterRadius = 1.375;
const ringThickness = 0.02; //is my custom thickness

// Saturn's particle outer ring
const ringParticlesGeometry = new THREE.BufferGeometry();
const particleCount = 10000;
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius =
    ringOuterRadius - Math.random() * (ringOuterRadius - ringInnerRadius) * 0.4; // Adjusted for outer ring
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = (Math.random() - 0.5) * ringThickness;

  positions[i * 3] = x;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = z;
}

ringParticlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
const ringParticlesMaterial = new THREE.PointsMaterial({
  color:'#bfbfbf',
  size: 0.0001,
});
const ringParticles = new THREE.Points(
  ringParticlesGeometry,
  ringParticlesMaterial
);
scene.add(ringParticles);

// Saturn's particle inner ring
const smallRingParticleCount = 10000;
const positionsSmallRing = new Float32Array(smallRingParticleCount * 3);
const smallRingParticlesGeometry = new THREE.BufferGeometry();

for (let i = 0; i < smallRingParticleCount; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius =
    ringInnerRadius + Math.random() * (ringOuterRadius - ringInnerRadius) * 0.5;
  const x = radius * Math.cos(angle);
  const z = radius * Math.sin(angle);
  const y = (Math.random() - 0.5) * ringThickness;

  positionsSmallRing[i * 3] = x;
  positionsSmallRing[i * 3 + 1] = y;
  positionsSmallRing[i * 3 + 2] = z;
}

smallRingParticlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positionsSmallRing, 3)
);
const smallRingParticlesMaterial = new THREE.PointsMaterial({
  color: '#e2d8ac',
  size: 0.0001,
//   opacity: 1,
}); 
const smallRingParticles = new THREE.Points(
  smallRingParticlesGeometry,
  smallRingParticlesMaterial
);
scene.add(smallRingParticles);

// Saturn's major  moons//

//  Titan
// diameter=5149km;
// distance from saturn= 1,221,850 km
// radius=2574,5km
// orbital period=15.95 days
// titan's tilt= 0.3 degrees
const titanRadius= 0.25745; //scaled
const titanDistance = 12.21850; //scaled
const titanTexture= textureLoader.load('../textures/Titan.png')
const titanGeometry = new THREE.IcosahedronGeometry(titanRadius,12); 
const titanMaterial = new THREE.MeshBasicMaterial({ map: titanTexture }); 
// color: 0xffcc99
const titanMesh = new THREE.Mesh(titanGeometry, titanMaterial);
// const distanceTitan = titanMesh.position.distanceTo(saturnMesh.position); 
scene.add(titanMesh);
// Dione
// diameter=1123 km
// distance from Saturn= 377,400km
// radius=561.5km
// orbital period=2.74 days
// dione's tilt=0.002 degrees;
const dioneRadius= 0.05615; //scaled
const dioneDistance = 3.77400 ;
const dioneTexture= textureLoader.load('../textures/Dione.jpg')
const dioneGeometry = new THREE.IcosahedronGeometry(dioneRadius,12); 
const dioneMaterial = new THREE.MeshBasicMaterial({ map: dioneTexture }); 
const dioneMesh = new THREE.Mesh(dioneGeometry, dioneMaterial);

scene.add(dioneMesh);
// Rhea
// diameter=1527 km
// distance from Saturn= 527,040km
// radius=763.5km
// orbital period=4.52 days
// rhea's tilt=0degrees;
const rheaRadius= 0.007635; //scaled
const rheaDistance = 5.27040 ;
const rheaTexture= textureLoader.load('../textures/rhea4kalb.jpg')
const rheaGeometry = new THREE.IcosahedronGeometry(rheaRadius,12); 
const rheaMaterial = new THREE.MeshBasicMaterial({ map: rheaTexture }); 
const rheaMesh = new THREE.Mesh(rheaGeometry, rheaMaterial);
// Iapetus
// diameter=1470 km
// distance from Saturn= 3,561,300	km
// radius=735km
// orbital period=79.33days
// orbital days in ours=
// iapetus's tilt=15.47 degrees;
const iapetusRadius= 0.00735; //scaled
const iapetusDistance = 3.561300;
const iapetusTexture= textureLoader.load('../textures/iapetus4kalb.jpg')
const iapetusGeometry = new THREE.IcosahedronGeometry(iapetusRadius,12); 
const iapetusMaterial = new THREE.MeshBasicMaterial({ map: iapetusTexture }); 
const iapetusMesh = new THREE.Mesh(iapetusGeometry, iapetusMaterial);

scene.add(rheaMesh);

//  Sizes
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
window.addEventListener("resize", () => {
  (sizes.width = window.innerWidth), (sizes.height = window.innerHeight);
  // update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();
  // update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
// handle fullscreeen
window.addEventListener("dblclick", () => {
  if (!document.fullscreenElement) {
    canvas.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
// Saturn mesh ring
// Small inner ring
const smallInnerRingGeometry = new THREE.TorusGeometry( 1.19, 0.02, 2, 100 ); 
const smallInnerRingTexture= textureLoader.load('../textures/saturnringcolor.jpg')
const smallInnerRingMaterial = new THREE.MeshStandardMaterial( { map: smallInnerRingTexture, } ); 
const smallInnerRing = new THREE.Mesh( smallInnerRingGeometry, smallInnerRingMaterial );
 scene.add( smallInnerRing );
// Big outer ring
const bigOuterRingGeometry = new THREE.TorusGeometry( ringOuterRadius, 0.09, 2, 100 ); 
const bigOuterRingTexture= textureLoader.load('../textures/saturnringcolor.jpg')
const bigOuterRingMaterial = new THREE.MeshBasicMaterial( { map: bigOuterRingTexture, } ); 
const bigOuterRing = new THREE.Mesh( bigOuterRingGeometry, bigOuterRingMaterial );
 scene.add( bigOuterRing);  
//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 1);
scene.add(ambientlight);

// //point Light
// const pointLight = new THREE.PointLight(0xffffff, 1.5);
// pointLight.castShadow = true;
// pointLight.shadowCameraVisible = true;
// pointLight.shadowBias = 0.00001;
// pointLight.shadowDarkness = 0.3;
// pointLight.shadowMapWidth = 1048;
// pointLight.shadowMapHeight = 1048;
// pointLight.position.set(-50, 20, -60);
// scene.add(pointLight);

// Camara
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  300
);
camera.position.z = 5;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  antialias: true,
});

renderer.setSize(sizes.width, sizes.height);

/**
 * Animate
 */
const clock = new THREE.Clock();
// Saturn tilt
const saturnTilt = (26.73 * Math.PI) / 180;
saturnMesh.rotation.x = saturnTilt;
const saturnRotationPeriod = 10.4;
const secondsPerHour = 3600;
const radiansPerSecond = (2 * Math.PI) / (saturnRotationPeriod * secondsPerHour);
//  Titan's orbit
const titanOrbitGroup = new THREE.Group();
scene.add(titanOrbitGroup);
titanOrbitGroup.add(titanMesh);
// Positions Titan
titanMesh.position.set(titanDistance, 0, 0); 

// DIONE/////////////////////////////////////////////////////////////
//  Dione's orbit
const dioneOrbitGroup = new THREE.Group();
scene.add(dioneOrbitGroup);
dioneOrbitGroup.add(dioneMesh);
// Positions Dione
dioneMesh.position.set(dioneDistance, 0, 0); 
// RHEA//////////////////////////////////////////////////
//  Rhea's orbit
const rheaOrbitGroup = new THREE.Group();
scene.add(rheaOrbitGroup);
rheaOrbitGroup.add(rheaMesh);
// Positions RHEA
rheaMesh.position.set(rheaDistance, 0, 0); 
// IAPETUS///////////////////////////////////////////////////////////
const iapetusOrbitGroup = new THREE.Group();
scene.add(iapetusOrbitGroup);
iapetusOrbitGroup.add(iapetusMesh);
// Positions IAPETUS
iapetusMesh.position.set(iapetusDistance, 0, 0); 
const tick = () => {
  // spacebackground rotation
  spaceMesh.rotation.y += 0.00002;

  // saturn rotation
  const elapsedTime = clock.getElapsedTime();
  saturnMesh.rotation.y += radiansPerSecond * elapsedTime;

  // Rings rotations*******************************
  ringParticles.rotation.x = saturnTilt;
  smallRingParticles.rotation.x = saturnTilt;
  smallInnerRing.rotation.x = degToRad(90) + saturnTilt;
  bigOuterRing.rotation.x = degToRad(90) + saturnTilt;
  // Rotations outer ring
  ringParticles.rotation.y += 0.0002;
  // Rotation inner ring
  smallRingParticles.rotation.y += 0.0002;

  // TITAN//////////////////////////////////////////////////
  // TITAN's  rotation tilt and tilt
  const titanRotation = 1378080;
  const  titanScaleRotation = titanRotation /  10000000000;
  titanMesh.rotation.z += THREE.MathUtils.degToRad(0.3);
  titanOrbitGroup.rotation.x = degToRad(90)+ saturnTilt;
  titanOrbitGroup.rotation.y += 0.0002;
  // DIONE//////////////////////////////////////////////////////
  const dioneRotation = 2369952
  const dioneScaledRotation= dioneRotation /  10000000000;
  dioneMesh.rotation.z += THREE.MathUtils.degToRad(-0.002);
  dioneOrbitGroup.rotation.x = degToRad(-90)+ saturnTilt;
  dioneOrbitGroup.rotation.y += dioneScaledRotation;
  // RHEA//////////////////////////////////////////////////////////
  const rheaRotation = 390528
  rheaOrbitGroup.rotation.x =  saturnTilt;
  const rheaScaledRotation= rheaRotation /  10000000000;
  rheaOrbitGroup.rotation.y += rheaScaledRotation;
  // IAPETUS//////////////////////////////////////////////////////////
  const iapetusRotation=  6854112 //in seconds;
  const iapetusScaledRotation= iapetusRotation /  10000000000;
  // 79.33 days*24hours*60min*60sec
   const iapetusTilt = degToRad(15.47)
  iapetusOrbitGroup.rotation.x = degToRad(90)+ iapetusTilt;
  iapetusOrbitGroup.rotation.y += iapetusScaledRotation;
  // 
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick
  window.requestAnimationFrame(tick);
};

tick();
