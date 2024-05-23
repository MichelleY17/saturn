import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
/**
 * Base
 */


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()

// texture loader
const textureLoader = new THREE.TextureLoader();

// Space Background
// const spaceTexture = textureLoader.load("../texture/Space-PNG-Picture.png");
const spaceGeometry = new THREE.SphereGeometry(80, 64, 64);
const spaceMaterial = new THREE.MeshBasicMaterial({
    // map: spaceTexture,
    color: 0xffffff,
    side: THREE.BackSide,
    wireframe: true,
});
const spaceMesh = new THREE.Mesh(spaceGeometry, spaceMaterial);
scene.add(spaceMesh);

// Saturn body
// Saturn dimenstions:
// Saturn's diameter: 120.536 km
// Saturn's equatorial radius".: 60.268 km
const texture = textureLoader.load('../textures/8k_saturn.jpg');
const saturnRadius = 0.60268; // Saturn radius scaled 
const geometry = new THREE.IcosahedronGeometry(saturnRadius, 12);
const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Saturn tilt
const saturnTilt = -26.73 * Math.PI / 180; 
mesh.rotation.x = saturnTilt; 
const saturnRotationPeriod = 10.4; 
const secondsPerHour = 3600; 
const radiansPerSecond = (2 * Math.PI) / (saturnRotationPeriod * secondsPerHour)

// Saturn rings *****************************************************
// Constants for Ring Geometry
// Rings sizes aprox:
// Ring's total diameter: 275.000 km
// Ring's outer radius: 137.500 km
// Ring's inner radius: 127.500 km
const ringInnerRadius = 1.27500;
const ringOuterRadius = 1.37500; 
const ringThickness = 0.08; //is my custom thickness

// Saturn ring main mesh
// const ringTexture = textureLoader.load('../textures/saturnringcolor.jpg');
// const ringGeometry = new THREE.RingGeometry(1.5, ringInnerRadius , 20 ); 
// const ringMaterial = new THREE.MeshBasicMaterial( { map: ringTexture, side: THREE.DoubleSide } );
// const ringMesh = new THREE.Mesh( ringGeometry, ringMaterial ); 
// scene.add( ringMesh );
// Saturn rings (Multiple meshes and refined particles)
// Saturn rings (Multiple meshes and refined particles)
// Saturn ring main mesh
// Saturn rings (Multiple meshes and refined particles)
// Saturn ring main mesh
// Saturn rings (Multiple meshes and refined particles)
const ringDivisions = [
    { innerRadius: ringInnerRadius, outerRadius: (ringInnerRadius + ringOuterRadius) / 2, texture: textureLoader.load('../textures/saturnringcolor.jpg') },
    { innerRadius: (ringInnerRadius + ringOuterRadius) / 2, outerRadius: ringOuterRadius, texture: textureLoader.load('../textures/saturnringpattern.gif') },
    // ... more divisions if needed
  ];
  
  // Create a group to hold all ring elements (meshes and particles)
  const ringGroup = new THREE.Group();
  ringGroup.rotation.x = saturnTilt; // Apply Saturn's tilt to the entire group
  scene.add(ringGroup); // Add the group to the scene
  
  ringDivisions.forEach(division => {
    const ringGeometry = new THREE.RingGeometry(division.innerRadius, division.outerRadius, 60);
    const ringMaterial = new THREE.MeshBasicMaterial({ 
      map: division.texture, 
      side: THREE.DoubleSide, 
      transparent: true, 
      opacity: 0.8 
    });
    const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
    division.ringMesh = ringMesh; 
  
    // Create a group for this division's mesh and particles
    const divisionGroup = new THREE.Group();
    divisionGroup.add(ringMesh);
    ringGroup.add(divisionGroup);  
  
    // Create particle system for this division
    const divisionParticleCount = 5000;
    const divisionPositions = new Float32Array(divisionParticleCount * 3);
    const divisionParticlesGeometry = new THREE.BufferGeometry();
  
    for (let i = 0; i < divisionParticleCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const radius = division.innerRadius + Math.random() * (division.outerRadius - division.innerRadius);
      const x = radius * Math.cos(angle);
      const z = radius * Math.sin(angle);
      const y = (Math.random() - 0.5) * ringThickness;
  
      divisionPositions[i * 3] = x;
      divisionPositions[i * 3 + 1] = y;
      divisionPositions[i * 3 + 2] = z;
    }
  
    divisionParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(divisionPositions, 3));
    const divisionParticlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.0001 });
    const divisionParticles = new THREE.Points(divisionParticlesGeometry, divisionParticlesMaterial);
    divisionGroup.add(divisionParticles); // Add particles to the division group
  });
  



//  Sizes
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}
window.addEventListener('resize', ()=>{
    sizes.width = window.innerWidth,
    sizes.height = window.innerHeight
    // update camera 
    camera.aspect= sizes.width / sizes.height
    camera.updateProjectionMatrix()
    // update renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
})
// handle fullscreeen
window.addEventListener('dblclick',()=>{
    if(!document.fullscreenElement){
        canvas.requestFullscreen()
    }
    else{
       document.exitFullscreen()
    }
})

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(1, 1, 1);
scene.add(directionalLight);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientLight);

// renderer.shadowMap.enabled = true; 
// directionalLight.castShadow = true;


// Camara
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 200)
camera.position.z = 5
scene.add(camera)

// Controls
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true


/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true
})
renderer.setSize(sizes.width, sizes.height)

/**
 * Animate
 */
const clock = new THREE.Clock();


const tick = () =>
{    
    // spacebackground rotation
    // spaceMesh.rotation.y += 0.00002;

    // saturn rotation
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y += radiansPerSecond * elapsedTime;

    // Rings rotations*******************************
    // ringParticles.rotation.x = saturnTilt;
    // smallRingParticles.rotation.x = saturnTilt;

    // Rotations main ring mesh

   // Rotate the ENTIRE ringGroup (meshes and particles together)
    ringGroup.rotation.y += 0.0002;

    // ringMesh.rotation.y += 0.0002;
     // Rotate EACH ring mesh AND corresponding particles together
    // ringDivisions.forEach(division => {
    //      division.ringMesh.rotation.y += 0.0002;
    // });
    // Rotations outer ring particles
    // ringParticles.rotation.y += 0.0002;
    // Rotation inner ring particles
    // smallRingParticles.rotation.y += 0.0002;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick 
    window.requestAnimationFrame(tick)
}

tick()