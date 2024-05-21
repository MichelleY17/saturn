import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'
/**
 * Base
 */


// Canvas
const canvas = document.querySelector('canvas.webgl')

// Scene
const scene = new THREE.Scene()
// Saturn body
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('../textures/saturnmap.jpg');
const geometry = new THREE.IcosahedronGeometry(1, 12);
const material = new THREE.MeshBasicMaterial({ map: texture });
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

// Saturn rings no particles
// const ringGeometry = new THREE.RingGeometry(1.5, 2, 64);
// const ringMaterial = new THREE.MeshBasicMaterial({ 
//     side: THREE.DoubleSide, 
//     map: textureLoader.load('../textures/saturnringcolor.jpg'),
//     transparent: true, 
//     opacity: 0.8 
// });
// const ringAlphaTexture = new THREE.DataTexture(
//     new Uint8Array([255, 255, 255, 0]), 
//     1, 1, 
//     THREE.RGBAFormat, 
//     THREE.UnsignedByteType,
//     THREE.UVMapping
// );
// ringAlphaTexture.needsUpdate = true;
// ringMaterial.alphaMap = ringAlphaTexture; // Use the gradient as alpha map

// const ringMesh = new THREE.Mesh(ringGeometry, ringMaterial);
// ringMesh.rotation.x = Math.PI / 2; // Rotate to the correct orientation
// scene.add(ringMesh);
// Ring particles (simplified)
const ringParticlesGeometry = new THREE.BufferGeometry();
const particleCount = 10000; // Adjust for desired density
const positions = new Float32Array(particleCount * 3);

for (let i = 0; i < particleCount; i++) {
    // Randomly distribute particles within ring boundaries
    const angle = Math.random() * 2 * Math.PI;
    const radius = 1.5 + Math.random() * 0.5; // Inner radius + random distance
    const x = radius * Math.cos(angle);
    const z = radius * Math.sin(angle);
    const y = 0; // Assuming ring plane is on the XZ plane

    positions[i * 3] = x;
    positions[i * 3 + 1] = y;
    positions[i * 3 + 2] = z;
}

ringParticlesGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const ringParticlesMaterial = new THREE.PointsMaterial({ color: 0xffffff, size: 0.01 }); // Adjust size as needed
const ringParticles = new THREE.Points(ringParticlesGeometry, ringParticlesMaterial);
scene.add(ringParticles);
//  Sizes
//  
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
/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100)
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
const saturnRotationPeriod = 10.4; // rotazione saturno
const secondsPerHour = 3600; 
const radiansPerSecond = (2 * Math.PI) / (saturnRotationPeriod * secondsPerHour)

const tick = () =>
{
    const elapsedTime = clock.getElapsedTime()
    mesh.rotation.y += radiansPerSecond * elapsedTime;
    const positions = ringParticlesGeometry.attributes.position.array;
    for (let i = 0; i < particleCount; i++) {
        const radius = Math.sqrt(positions[i * 3] ** 2 + positions[i * 3 + 2] ** 2);
        const speed = 0.0001 / radius; 
        const angle = Math.atan2(positions[i * 3 + 2], positions[i * 3]) + speed * elapsedTime;

        positions[i * 3] = radius * Math.cos(angle);
        positions[i * 3 + 2] = radius * Math.sin(angle);
    }
    ringParticlesGeometry.attributes.position.needsUpdate = true;
    // Update controls
    controls.update()

    // Render
    renderer.render(scene, camera)

    // Call tick again on the next frame
    window.requestAnimationFrame(tick)
}

tick()