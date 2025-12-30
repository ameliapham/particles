import * as THREE from "three";
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import GUI from "lil-gui"

console.log("Hello, Three.js with TypeScript!");

// --- Canvas Setup ---
const canvas = document.querySelector("canvas.webgl") as HTMLCanvasElement;

// --- Scene Setup ---
const scene = new THREE.Scene();

// --- Setup Axes Helper ---
// const axesHelper = new THREE.AxesHelper(2)
// scene.add(axesHelper)

// --- Texture ---
const textureLoader = new THREE.TextureLoader()
const particlesTexture = textureLoader.load('textures/2.png')

// --- Particles ---
// Geometry
const particlesGeometry = new THREE.BufferGeometry()
const points = 5000

const positionArray = new Float32Array(points * 3) // Multiply by 3 because each position is composed of 3 values (x, y, z)
for(let i = 0; i < points * 3; i++){
    positionArray[i] = (Math.random() - 0.5) * 10 //Random between -0.5 and 0.5, then scale to 10
}
const positionAttribute = new THREE.BufferAttribute(positionArray, 3)
particlesGeometry.setAttribute('position', positionAttribute)

// Material
const particlesMaterial = new THREE.PointsMaterial({
    size : 0.1, // Size of point
    sizeAttenuation: true, //Depth near/far between points
    color : 0xff88cc, 
    map : particlesTexture,
    transparent: true, //Enable transparency
    alphaMap: particlesTexture, //Use particlesTexture as transparency mask
    //alphaTest: 0.001, //If the opacity of a point is less than 0.001, it will not be drawn.
    //depthTest: false, //Not hidden by other objects
    depthWrite: false, //Does not affect the depth of the scene
    blending: THREE.AdditiveBlending, //Add color values together to create a glow effect

})

// --- Object ---
const cube = new THREE.Mesh(
    new THREE.BoxGeometry(1, 1, 1),
    new THREE.MeshBasicMaterial({color: "white"})
)
//scene.add(cube)

// Points
const particles = new THREE.Points(particlesGeometry, particlesMaterial)
scene.add(particles)

// --- Camera Setup ---
const camera = new THREE.PerspectiveCamera(75,window.innerWidth / window.innerHeight);
camera.position.z = 3
scene.add(camera)

// --- Controls ---
const controls = new OrbitControls(camera, canvas)
controls.enableDamping = true

// --- Renderer Setup ---
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)) //Limit pixel ratio to 2 for performance

// --- Debug UI ---
const gui = new GUI
gui.close()

// --- Resize ---
window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
})

// --- Render Loop ---
const clock = new THREE.Clock()

function animate(){
    // Clock
    const elapsedTime = clock.getElapsedTime()

    // Update control
    controls.update()

    // Update render
    renderer.render(scene, camera);

    // Call animate again on the next frame
    window.requestAnimationFrame(animate)
}
animate()
