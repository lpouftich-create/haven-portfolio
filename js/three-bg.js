import * as THREE from 'three';

// 1. Setup Scene, Camera, Renderer
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0f0c, 0.03); // Blends edges into the dark bg

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 22; // Pulled back to fit the massive text

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Lighting (Bright & Premium)
const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Much brighter
scene.add(ambientLight);

const dirLight1 = new THREE.DirectionalLight(0xb8ff3c, 4.0); // Strong Lime light
dirLight1.position.set(5, 10, 5);
scene.add(dirLight1);

const dirLight2 = new THREE.DirectionalLight(0xffd166, 2.5); // Strong Gold light
dirLight2.position.set(-5, -5, 5);
scene.add(dirLight2);

// 3. Build the 3D "HAVEN" Geometry
const group = new THREE.Group();

// Bright, glossy metallic material (Looks like a neon glass sculpture)
const mat = new THREE.MeshStandardMaterial({
  color: 0xb8ff3c,       // Base color is now LIME
  roughness: 0.1,        // Very glossy
  metalness: 0.9,        // Highly reflective
  emissive: 0x2a4a10,    // Slight inner glow
});

const thickness = 2.0; // Much thicker blocks
const gap = 0.6;

function createBlock(w, h, d, x, y) {
  const geo = new THREE.BoxGeometry(w, h, d);
  const mesh = new THREE.Mesh(geo, mat);
  mesh.position.set(x, y, 0);
  return mesh;
}

// --- H ---
let x = -7;
group.add(createBlock(0.8, 6, thickness, x, 0)); // Left pillar
group.add(createBlock(0.8, 6, thickness, x + 3, 0)); // Right pillar
group.add(createBlock(3, 0.8, thickness, x + 1.5, 0)); // Crossbar

// --- A ---
x = -2.5;
group.add(createBlock(0.8, 6, thickness, x, 0)); // Left pillar
group.add(createBlock(0.8, 6, thickness, x + 3, 0)); // Right pillar
group.add(createBlock(3, 0.8, thickness, x + 1.5, 0)); // Crossbar

// --- V ---
x = 2;
const v1 = createBlock(0.8, 6, thickness, x, 0);
v1.rotation.z = -0.3; // Angle it
const v2 = createBlock(0.8, 6, thickness, x + 2.5, 0);
v2.rotation.z = 0.3;
group.add(v1, v2);

// --- E ---
x = 7;
group.add(createBlock(0.8, 6, thickness, x, 0)); // Back
group.add(createBlock(2.8, 0.8, thickness, x + 1.4, 2.6)); // Top
group.add(createBlock(2.8, 0.8, thickness, x + 1.4, 0)); // Mid
group.add(createBlock(2.8, 0.8, thickness, x + 1.4, -2.6)); // Bottom

// Center the whole group and scale it UP
group.position.x = -2.5;
group.scale.setScalar(1.2); // Make it massive
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
  
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  // Spin based on scroll
  group.rotation.y = targetX + (scrollY * Math.PI * 1.5); 
  group.rotation.x = targetY + (scrollY * 0.2);
  
  // Float gently
  group.position.y = Math.sin(time * 1.5) * 0.5 - (scrollY * 5);
  
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
canvas.classList.add('ready');
