import * as THREE from 'three';

// 1. Setup Scene, Camera, Renderer
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0f0c, 0.04); // Blends the edges into the dark bg

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 18;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Lighting (This creates the reflections and depth seen in the reference)
const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xb8ff3c, 2.5); // Lime green light
dirLight1.position.set(5, 10, 5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffd166, 1.5); // Gold light
dirLight2.position.set(-5, -5, 5);
scene.add(dirLight2);

const pointLight = new THREE.PointLight(0x111814, 100, 50); // Dark green ambient glow
pointLight.position.set(0, 0, 10);
scene.add(pointLight);

// 3. Build the 3D "HAVEN" Geometry
// Instead of particles, we build solid, thick blocks for each letter.
const group = new THREE.Group();

// A dark, slightly glossy green material matching your site
const mat = new THREE.MeshStandardMaterial({
  color: 0x16201a,
  roughness: 0.2,
  metalness: 0.8,
  emissive: 0x0a0f0c,
});

const thickness = 1.5;
const gap = 0.6;

function createBlock(w, h, d, x, y) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, 0);
  return mesh;
}

// --- H ---
let x = -7;
group.add(createBlock(0.6, 5, thickness, x, 0)); // Left pillar
group.add(createBlock(0.6, 5, thickness, x + 2.5, 0)); // Right pillar
group.add(createBlock(2.5, 0.6, thickness, x + 1.25, 0)); // Crossbar

// --- A ---
x = -2.5;
group.add(createBlock(0.6, 5, thickness, x, 0)); // Left pillar
group.add(createBlock(0.6, 5, thickness, x + 2.5, 0)); // Right pillar
group.add(createBlock(2.5, 0.6, thickness, x + 1.25, 0)); // Crossbar

// --- V ---
x = 2;
const v1 = createBlock(0.6, 5, thickness, x, 0);
v1.rotation.z = -0.3; // Angle it
const v2 = createBlock(0.6, 5, thickness, x + 2, 0);
v2.rotation.z = 0.3;
group.add(v1, v2);

// --- E ---
x = 6.5;
group.add(createBlock(0.6, 5, thickness, x, 0)); // Back
group.add(createBlock(2.2, 0.6, thickness, x + 1.1, 2.2)); // Top
group.add(createBlock(2.2, 0.6, thickness, x + 1.1, 0)); // Mid
group.add(createBlock(2.2, 0.6, thickness, x + 1.1, -2.2)); // Bottom

// Center the whole group
group.position.x = -1.75;
scene.add(group);

// 4. Mouse & Scroll Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;
let scrollY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
});

window.addEventListener('scroll', () => {
  scrollY = window.scrollY / window.innerHeight;
});

// 5. Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  // Smooth mouse follow
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  // THE EFFECT: 
  // It rotates wildly as you scroll, and tilts slightly with the mouse.
  // Scroll down -> spins right and moves into the background.
  group.rotation.y = targetX + (scrollY * Math.PI * 2); 
  group.rotation.x = targetY + (scrollY * 0.5);
  group.rotation.z = Math.sin(time * 0.5) * 0.05; // Very subtle idle floating
  
  // Move it back and down slightly on scroll to feel like it's flying away
  group.position.z = -scrollY * 15;
  group.position.y = -scrollY * 5;
  
  // Idle breathing animation
  group.scale.setScalar(1 + Math.sin(time * 2) * 0.02);
  
  renderer.render(scene, camera);
}

// 6. Resize & Load
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
canvas.classList.add('ready');
