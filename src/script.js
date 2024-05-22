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
// Saturn's diametry: 120.536 km
// Saturn's equatorial radius".: 60.268 km
const texture = textureLoader.load('../textures/8k_saturn.jpg');
const saturnRadius = 0.60268; // Saturn radius scaled 
const geometry = new THREE.IcosahedronGeometry(saturnRadius, 12);
const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Saturn rings *****************************************************
// Constants for Ring Geometry
// Rings sizes aprox:
// Ring's total diametry: 275.000 km
// Ring's outer radius: 137.500 km
// Ring's inner radius: 127.500 km
const ringInnerRadius = 1.27500;
const ringOuterRadius = 1.37500; 
const ringThickness = 0.08; //is my custom thickness

// Saturn's particle outer ring
const ringParticlesGeometry = new THREE.BufferGeometry();
const particleCount = 10000; 
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = ringOuterRadius - Math.random() * (ringOuterRadius - ringInnerRadius) * 0.40; // Adjusted for outer ring
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = (Math.random() - 0.5) * ringThickness;

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
}

ringParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const ringParticlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.0001 });
const ringParticles = new THREE.Points(ringParticlesGeometry, ringParticlesMaterial);
scene.add(ringParticles);

// Saturn's particle inner ring
const smallRingParticleCount = 10000;
const positionsSmallRing = new Float32Array(smallRingParticleCount * 3); 
const smallRingParticlesGeometry = new THREE.BufferGeometry();

for (let i = 0; i < smallRingParticleCount; i++) {
    const angle = Math.random() * Math.PI * 2;
    const radius = ringInnerRadius + Math.random() * (ringOuterRadius - ringInnerRadius) * 0.5;
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = (Math.random() - 0.5) * ringThickness;

    positionsSmallRing[i * 3] = x;  
    positionsSmallRing[i * 3 + 1] = y; 
    positionsSmallRing[i * 3 + 2] = z; 
}

smallRingParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(positionsSmallRing, 3));
const smallRingParticlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.0001 }); // Same size as outer ring
const smallRingParticles = new THREE.Points(smallRingParticlesGeometry, smallRingParticlesMaterial);
scene.add(smallRingParticles);


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

//ambient light
const ambientlight = new THREE.AmbientLight(0xffffff, 0.2);
scene.add(ambientlight);

//point Light
const pointLight = new THREE.PointLight(0xffffff, 1);
pointLight.castShadow = true;
pointLight.shadowCameraVisible = true;
pointLight.shadowBias = 0.00001;
pointLight.shadowDarkness = 0.3;
pointLight.shadowMapWidth = 2048;
pointLight.shadowMapHeight = 2048;
pointLight.position.set(-50, 20, -60);
scene.add(pointLight);


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
// Saturn tilt
const saturnTilt = -26.73 * Math.PI / 180; 
mesh.rotation.x = saturnTilt; 
const saturnRotationPeriod = 10.4; 
const secondsPerHour = 3600; 
const radiansPerSecond = (2 * Math.PI) / (saturnRotationPeriod * secondsPerHour)

const tick = () =>
{    
    // spacebackground rotation
    // spaceMesh.rotation.y += 0.0002;

    // saturn rotation
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y += radiansPerSecond * elapsedTime;

    // Rings rotations*******************************
    ringParticles.rotation.x = saturnTilt;
    smallRingParticles.rotation.x = saturnTilt;
    // Rotations outer ring
    ringParticles.rotation.y += 0.0002;
    // Rotation inner ring
    smallRingParticles.rotation.y += 0.0002;

    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick 
    window.requestAnimationFrame(tick)
}

tick()