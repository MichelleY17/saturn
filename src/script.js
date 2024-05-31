import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
// import { FlyControls } from "three/examples/jsm/controls/FlyControls.js";
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
// const axesHelper = new THREE.AxesHelper(5);
// scene.add(axesHelper);


// Space Background
const spaceTexture = textureLoader.load("../textures/starmap_2020_4k.jpeg");
const spaceGeometry = new THREE.SphereGeometry(150, 64, 64);
const spaceMaterial = new THREE.MeshStandardMaterial({
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
const saturnRadius = 0.60268; // Saturn radius scaled
const geometry = new THREE.IcosahedronGeometry(saturnRadius, 12);
const material = new THREE.MeshPhysicalMaterial({
    roughness:1, 
    metalness:0.01,
    map: saturnTexture ,
    clearcoat: 1.0,      // bright
    clearcoatRoughness: 0.4 
    });
const saturnMesh = new THREE.Mesh(geometry, material);
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
  color: new THREE.Color('#bfbfbf'),
  size: 0.0001,
  transparent: true,
  opacity: 0.1, 
  castShadow: false,
});
const ringParticles = new THREE.Points(
  ringParticlesGeometry,
  ringParticlesMaterial,
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
  color: new THREE.Color('#bfbfbf'),
  size: 0.00001,
  opacity: 0.1, 
  transparent: true,
  castShadow: false,
}); 
const smallRingParticles = new THREE.Points(
  smallRingParticlesGeometry,
  smallRingParticlesMaterial
);
scene.add(smallRingParticles);
// Saturn mesh ring
// Small inner ring
const smallInnerRingGeometry = new THREE.TorusGeometry( 1.19, 0.02, 2, 100 ); 
const smallInnerRingTexture= textureLoader.load('../textures/saturnringcolor.jpg')
const smallInnerRingMaterial = new THREE.MeshPhysicalMaterial( { 
  map: smallInnerRingTexture,
  roughness:0.5, 
  metalness:0.01,
  castShadow: false,
  opacity: 0.1, 
  transparent: true, 
  depthWrite: false // Disable depth write 

}); 
const smallInnerRing = new THREE.Mesh( smallInnerRingGeometry, smallInnerRingMaterial );
 scene.add( smallInnerRing );
// Big outer ring
const bigOuterRingGeometry = new THREE.TorusGeometry( ringOuterRadius, 0.09, 2, 100 ); 
const bigOuterRingTexture= textureLoader.load('../textures/saturnringcolor.jpg')
const bigOuterRingMaterial = new THREE.MeshPhysicalMaterial( { 
  map: bigOuterRingTexture,
  roughness:0.01, 
  metalness:0.01,
  opacity: 0.2, 
  transparent: true, 
  depthWrite: false,

}); 
const bigOuterRing = new THREE.Mesh( bigOuterRingGeometry, bigOuterRingMaterial );
 scene.add( bigOuterRing);
 
 
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
const titanMaterial = new THREE.MeshPhysicalMaterial({ 
    map: titanTexture,
    roughness:0.5, 
    metalness:0.01,
}); 
const titanMesh = new THREE.Mesh(titanGeometry, titanMaterial);
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
const dioneMaterial = new THREE.MeshPhysicalMaterial({ 
  map: dioneTexture,
  roughness:0.5, 
  metalness:0.01,
 }); 
const dioneMesh = new THREE.Mesh(dioneGeometry, dioneMaterial);
scene.add(dioneMesh);
// Rhea
// diameter=1527 km
// distance from Saturn= 527,040km
// radius=763.5km
// orbital period=4.52 days
// rhea's tilt=0degrees;
const rheaRadius= 0.07635; //scaled
const rheaDistance = 5.27040 ;
const rheaTexture= textureLoader.load('../textures/rhea4kalb.jpg')
const rheaGeometry = new THREE.IcosahedronGeometry(rheaRadius,12); 
const rheaMaterial = new THREE.MeshPhysicalMaterial({ 
  map: rheaTexture,
  roughness:0.5, 
  metalness:0.01,
}); 
const rheaMesh = new THREE.Mesh(rheaGeometry, rheaMaterial);
// Iapetus
// diameter=1470 km
// distance from Saturn= 3,561,300	km
// radius=735km
// orbital period=79.33days
// orbital days in ours=
// iapetus's tilt=15.47 degrees;
const iapetusRadius= 0.0735; //scaled
const iapetusDistance = 3.561300;
const iapetusTexture= textureLoader.load('../textures/iapetus4kalb.jpg')
const iapetusGeometry = new THREE.IcosahedronGeometry(iapetusRadius,12); 
const iapetusMaterial = new THREE.MeshPhysicalMaterial({ 
  map: iapetusTexture,
  roughness:0.5, 
  metalness:0.01,
}); 
const iapetusMesh = new THREE.Mesh(iapetusGeometry, iapetusMaterial);
// Mimas
// diameter=	396 km
// distance from Saturn= 185,520	km
// radius=735km
// orbital period= 0.94 days
// mimas's tilt=1.5 degrees;
const mimasRadius= 0.0396; //scaled
const mimasDistance = 1.85520;
const mimasTexture= textureLoader.load('../textures/mimas_jpl_colorify_2k.png')
const mimasGeometry = new THREE.IcosahedronGeometry(mimasRadius,12); 
const mimasMaterial = new THREE.MeshPhysicalMaterial({ 
  map: mimasTexture,
  roughness:0.5, 
  metalness:0.01,
}); 
const mimasMesh = new THREE.Mesh(mimasGeometry, mimasMaterial);
scene.add(mimasMesh);
// Enceladus
// diameter=	504 km
// distance from Saturn= 238,020 km
// radius= 252km
// orbital period=1.37 days
const enceladusRadius= 0.0252; //scaled
const enceladusDistance = 2.38020;
const enceladusTexture= textureLoader.load('../textures/Enceladus.png')
const enceladusGeometry = new THREE.IcosahedronGeometry(enceladusRadius,12); 
const enceladusMaterial = new THREE.MeshPhysicalMaterial({ 
  map: enceladusTexture,
  roughness:0.5, 
  metalness:0.01,
}); 
const enceladusMesh = new THREE.Mesh(enceladusGeometry, enceladusMaterial);
scene.add(enceladusMesh);
// TETHYS
// diameter=	1062 km
// distance from Saturn= 294,660 km
// radius= 531km
// orbital period= 1.89 days
const tethysRadius= 0.0531; //scaled
const tethysDistance = 2.94660;
const tethysTexture= textureLoader.load('../textures/tethys4kalb.jpg')
const tethysGeometry = new THREE.IcosahedronGeometry(tethysRadius,12); 
const tethysMaterial = new THREE.MeshPhysicalMaterial({ 
  map: tethysTexture,
  roughness:0.5, 
  metalness:0.01,
}); 
const tethysMesh = new THREE.Mesh(tethysGeometry, tethysMaterial);
scene.add(tethysMesh);
// Hyperion
// distance from Saturn= 1,481,100 km
// radius= 266km 
//width= 360km
// orbital period= 21.28 days
const hyperionRadius= 0.0266; //scale
const hyperionWidth= 0.036 //scale
const hyperionDistance = 1.481100;
const hyperionTexture= textureLoader.load('../textures/hyperion.jpg')
const hyperionGeometry = new THREE.CapsuleGeometry(hyperionRadius, hyperionWidth, 1, 7); 
const hyperionMaterial = new THREE.MeshPhysicalMaterial({ 
  map: hyperionTexture,
  roughness:0.5, 
  metalness:0.01,
}); 
const hyperionMesh = new THREE.Mesh(hyperionGeometry, hyperionMaterial);
scene.add(hyperionMesh);
// Jupiter
// distance from the sun = 778,500,000 kilometers
// radius = 71,492 km
const jupiterTexture = textureLoader.load("../textures/8k_jupiter.jpg");
const jupiterRadius = 0.71492; // Saturn radius scaled
const jupiterGeometry = new THREE.IcosahedronGeometry(jupiterRadius, 12);
const jupiterMaterial = new THREE.MeshPhysicalMaterial({
    roughness:1, 
    metalness:0.01,
    map: jupiterTexture ,
    clearcoat: 1.0,
    clearcoatRoughness: 0.4 ,
    });
const jupiterMesh = new THREE.Mesh(jupiterGeometry, jupiterMaterial);
scene.add(jupiterMesh);
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

// Lights///////////////////////////////////////////////////////////////////////////////

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.0005);
scene.add(ambientlight);
// particles particular light
const particleLight = new THREE.PointLight(0xffffff, 1); // Adjust intensity as needed
particleLight.position.x= - 26; // Place near the particles
particleLight.castShadow = true;
scene.add(particleLight);
// SUN
// Sun's diameter = 1.3927 million km
// Sun's radius= 696350000km
const sunRadius= 0.69635;
const sphereLight = new THREE.IcosahedronGeometry( sunRadius, 12);
const sun = new THREE.PointLight( '#fcf3db', 10000 );
sun.castShadow = true;
sun.add( new THREE.Mesh( sphereLight, new THREE.MeshBasicMaterial( { color: '#fcf3db' } ) ) );

scene.add(sun);

// Camara
// Base camera

const camera = new THREE.PerspectiveCamera(
  25,
  sizes.width / sizes.height,
  0.1,
  1e7
);
camera.position.z = 10;
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
//  MINAS////////////////////////////////////////////////////////////////
const mimasOrbitGroup = new THREE.Group();
scene.add(mimasOrbitGroup);
mimasOrbitGroup.add(mimasMesh);
// Positions MIMAS
mimasMesh.position.set(mimasDistance, 0, 0); 
//  ENCELADUS////////////////////////////////////////////////////////////////
const enceladusOrbitGroup = new THREE.Group();
scene.add(enceladusOrbitGroup);
enceladusOrbitGroup.add(enceladusMesh);
// Positions ENCELADUS
enceladusMesh.position.set(enceladusDistance, 0, 0); 
//  TETHYS////////////////////////////////////////////////////////////////
const tethysOrbitGroup = new THREE.Group();
scene.add(tethysOrbitGroup);
tethysOrbitGroup.add(tethysMesh);
// Positions TETHYS
tethysMesh.position.set(tethysDistance, 0, 0); 
//  HYPERION////////////////////////////////////////////////////////////////
const hyperionOrbitGroup = new THREE.Group();
scene.add(hyperionOrbitGroup);
hyperionOrbitGroup.add(hyperionMesh);
// Positions HYPERION
hyperionMesh.position.set(hyperionDistance, 0, 0); 
// Position Jupiter
// distance jupiter from the sun= 778,500,000 km
//  hypotetical distance between Jupiter and Saturn = 655,500,000 km
const jupiterCustomDistance= -65.5500000;
jupiterMesh.position.x = jupiterCustomDistance;
// jupiterMesh.position.y = 10;
// light position/////////////////////////////////////////////////////
// saturn's distance from the sun  1,434,000,000 kilometers
const sunCustomDistance= -143.4;
sun.position.set(sunCustomDistance, 10, 0);

const tick = () => {
  // spacebackground rotation
  // spaceMesh.rotation.y += 0.00002;
  // saturn rotation
  const elapsedTime = clock.getElapsedTime();
  saturnMesh.rotation.y += radiansPerSecond * elapsedTime;
  // Rotations outer ring
  ringParticles.rotation.x = saturnTilt;
  ringParticles.rotation.y += 0.0002;
  // Rotation inner ring
  smallRingParticles.rotation.x = saturnTilt;
  smallRingParticles.rotation.y += 0.0002;
  // Ring mesh rotation
  smallInnerRing.rotation.x = degToRad(90) + saturnTilt;
  smallInnerRing.rotation.z += 0.0002;
  bigOuterRing.rotation.x = degToRad(90) + saturnTilt;
  bigOuterRing.rotation.z += 0.0002;
  
  // TITAN//////////////////////////////////////////////////
  titanMesh.rotation.z += THREE.MathUtils.degToRad(0.3);
  titanOrbitGroup.rotation.x = degToRad(90)+ saturnTilt;
  const titanRotation = 1378080;
  const  titanScaleRotation = titanRotation /  10000000000;
  titanOrbitGroup.rotation.y += titanScaleRotation;
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
   const iapetusTilt = degToRad(15.47)
  iapetusOrbitGroup.rotation.x = degToRad(90) + iapetusTilt;
  iapetusOrbitGroup.rotation.y += iapetusScaledRotation;
  // MIMAS/////////////////////////////////////////////////////////////////
  const mimasRotation=  81216 //in seconds;
  const mimasScaleRotation= mimasRotation / 100000000;
  const mimasTilt = degToRad(1.5);
  mimasOrbitGroup.rotation.x = degToRad(90)+ mimasTilt;
  mimasOrbitGroup.rotation.y += mimasScaleRotation  ;
  // ENCELADUS/////////////////////////////////////////////////////////////////
  const enceladusRotation=  118368//in seconds;
  const enceladusScaleRotation = enceladusRotation / 100000000;
  enceladusOrbitGroup.rotation.x = saturnTilt;
  enceladusOrbitGroup.rotation.y += enceladusScaleRotation ;
  // TETHYS/////////////////////////////////////////////////////////////////
  const tethysRotation=  163296//in seconds;
  const tethysScaleRotation = tethysRotation / 100000000;
  tethysOrbitGroup.rotation.x = saturnTilt;
  tethysOrbitGroup.rotation.y += tethysScaleRotation ;
  // Hyperion/////////////////////////////////////////////////////////////////
  const hyperionRotation=  1838592//in seconds;
  const hyperionScaleRotation = hyperionRotation / 1000000000;
  hyperionMesh.rotation.x += 0.002;
  hyperionOrbitGroup.rotation.x = saturnTilt;
  hyperionOrbitGroup.rotation.y += hyperionScaleRotation ;
  // Jupiter
  // jupiterMesh.rotation.y += 0.002;
  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick
  window.requestAnimationFrame(tick);
};

tick();
