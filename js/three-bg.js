import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x080808, 0.03); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 35;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 1. SETUP BLOOM (NEON GLOW)
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  2.5,  // strength (MASSIVE NEON GLOW)
  0.8,  // radius (how far it spreads)
  0.1   // threshold (anything bright glows)
);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// 2. LIGHTING
const ambient = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0xFFD700, 5);
light1.position.set(-10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xD4AF37, 3);
light2.position.set(10, -10, 10);
scene.add(light2);

// 3. THE 3D TEXT
const group = new THREE.Group();
const mat = new THREE.MeshStandardMaterial({
  color: 0xffd700,       // Pure bright gold
  roughness: 0.1,        
  metalness: 1.0,        
  emissive: 0xffd700,    // Glowing core
  emissiveIntensity: 2.0 // Maxed out emission for bloom
});

const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
  const geometry = new TextGeometry('HAVEN', {
    font: font,
    size: 5, // Slightly bigger
    height: 2, 
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

// 4. MOUSE & SCROLL
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
});

let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  const opacity = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.5)));
  canvas.style.opacity = opacity;
});

// 5. THEME SWITCHING
function updateTheme() {
  const isLight = document.documentElement.getAttribute('data-theme') === 'light';
  if (isLight) {
    // Light Mode: Silver / Metallic
    mat.color.setHex(0xdddddd); 
    mat.emissive.setHex(0x444444); 
    mat.emissiveIntensity = 0.5;
    bloomPass.strength = 0.5;
    scene.fog.color.setHex(0xFAFAF7);
  } else {
    // Dark Mode: Pure Neon Gold
    mat.color.setHex(0xffd700);
    mat.emissive.setHex(0xffd700);
    mat.emissiveIntensity = 2.0;
    bloomPass.strength = 2.5;
    scene.fog.color.setHex(0x080808);
  }
}

document.getElementById('theme-toggle').addEventListener('click', () => {
  setTimeout(updateTheme, 50);
});
setTimeout(updateTheme, 100);

// 6. ANIMATION LOOP
const clock = new THREE.Clock();
function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  group.rotation.y = targetX;
  group.rotation.x = targetY;
  group.position.y = Math.sin(time * 1.5) * 0.3;
  
  composer.render(); // Using composer renders the bloom effect
}

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  composer.setSize(window.innerWidth, window.innerHeight);
});

animate();
canvas.classList.add('ready');
