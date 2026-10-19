import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js';

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0f0c, 0.02); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 30;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 1. PRO LIGHTING (The secret to the premium glass look)
const ambient = new THREE.AmbientLight(0xffffff, 1.5); 
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0xb8ff3c, 8); // Lime top-left
light1.position.set(-10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffd166, 8); // Gold bottom-right
light2.position.set(10, -10, 10);
scene.add(light2);

// 2. THE GLOWING 3D TEXT
const group = new THREE.Group();

// Dark metallic material with a lime glow
const mat = new THREE.MeshStandardMaterial({
  color: 0x111814,       // Very dark green
  roughness: 0.1,        // Glossy
  metalness: 0.9,        // Metallic
  emissive: 0xb8ff3c,    // Glowing lime core
  emissiveIntensity: 0.1
});

// Load standard 3D font
const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
  const geometry = new TextGeometry('HAVEN', {
    font: font,
    size: 7,
    height: 2, // Extrusion depth
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.1,
    bevelOffset: 0,
    bevelSegments: 5
  });

  // Center the geometry
  geometry.computeBoundingBox();
  const xMid = -0.5 * (geometry.boundingBox.max.x - geometry.boundingBox.min.x);
  const yMid = -0.5 * (geometry.boundingBox.max.y - geometry.boundingBox.min.y);
  geometry.center();

  const textMesh = new THREE.Mesh(geometry, mat);
  group.add(textMesh);
  scene.add(group);
});

// 3. PARTICLE STARFIELD (Adds the "wow" depth)
const starGeo = new THREE.BufferGeometry();
const starCount = 2000;
const positions = new Float32Array(starCount * 3);
for(let i=0; i<starCount*3; i++) {
  positions[i] = (Math.random() - 0.5) * 100;
}
starGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
const starMat = new THREE.PointsMaterial({
  color: 0xb8ff3c,
  size: 0.1,
  transparent: true,
  opacity: 0.4,
  blending: THREE.AdditiveBlending
});
const stars = new THREE.Points(starGeo, starMat);
scene.add(stars);

// 4. MOUSE & SCROLL
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0, scrollY = 0;

document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
});

window.addEventListener('scroll', () => {
  scrollY = window.scrollY / window.innerHeight;
});

// 5. ANIMATE
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  // Smooth mouse follow
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  // Text Spin
  group.rotation.y = targetX + (scrollY * Math.PI * 2); 
  group.rotation.x = targetY;
  
  // Float
  group.position.y = Math.sin(time * 1.5) * 0.5;
  
  // Spin stars slowly in the background
  stars.rotation.y = time * 0.02;
  
  renderer.render(scene, camera);
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

animate();
canvas.classList.add('ready');
