import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
// Set fog to white initially to match light mode
scene.fog = new THREE.FogExp2(0xFAFAF7, 0.03); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 35;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// Bloom Settings
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.5,  // Strength
  0.4,  // Radius
  0.85  // Threshold
);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// Lighting
const ambient = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0xD4AF37, 3);
light1.position.set(-10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xFFD700, 2);
light2.position.set(10, -10, 10);
scene.add(light2);

// 3D Text Material
const group = new THREE.Group();
const mat = new THREE.MeshStandardMaterial({
  color: 0xD4AF37,       
  roughness: 0.2,        
  metalness: 0.9,        
  emissive: 0x000000,
  emissiveIntensity: 0
});

const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
  const geometry = new TextGeometry('HAVEN', {
    font: font,
    size: 5, 
    height: 1.5, 
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: 0.1,
    bevelSegments: 5
  });
  geometry.center();
  const textMesh = new THREE.Mesh(geometry, mat);
  group.add(textMesh);
  scene.add(group);
});

// Mouse & Scroll
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
});

window.addEventListener('scroll', () => {
  const opacity = Math.max(0, 1 - (window.scrollY / (window.innerHeight * 0.5)));
  canvas.style.opacity = opacity;
});

// Theme Logic
function updateTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light'; if (isLight) { canvas.style.display = 'none'; } else { canvas.style.display = 'block'; }
  
  if (isLight) {
    // Light Mode: Gold text, white fog, transparent bg
    mat.color.setHex(0xD4AF37); 
    mat.emissive.setHex(0x000000); 
    mat.emissiveIntensity = 0;
    bloomPass.strength = 0.2; // Very subtle bloom
    scene.fog.color.setHex(0xFAFAF7); // Matches the light bg perfectly
  } else {
    // Dark Mode: Bright Gold, black fog, neon glow
    mat.color.setHex(0xD4AF37);
    mat.emissive.setHex(0xFFD700);
    mat.emissiveIntensity = 0.8;
    bloomPass.strength = 0.8;
    scene.fog.color.setHex(0x080808);
  }
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  setTimeout(updateTheme, 50);
});

// Set initial theme
setTimeout(updateTheme, 100);

// Animation
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  group.rotation.y = targetX;
  group.rotation.x = targetY;
  group.position.y = Math.sin(time * 1.5) * 0.3;
  
  composer.render();
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

animate();
canvas.classList.add('ready');

