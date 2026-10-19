import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0f0c, 0.03); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 40; // Moved further back

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 1. SOFTER BLOOM
const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.8,  // strength (lowered from 1.5)
  0.3,  // radius
  0.9   // threshold (higher = less glow)
);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

// 2. LIGHTING
const ambient = new THREE.AmbientLight(0xffffff, 0.5); // Dimmer ambient
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0xD4AF37, 3); // Dimmer lime
light1.position.set(-10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xF3E5AB, 2); // Dimmer gold
light2.position.set(10, -10, 10);
scene.add(light2);

// 3. THE 3D TEXT
const group = new THREE.Group();
const mat = new THREE.MeshStandardMaterial({
  color: 0x16201a,       // Darker base color
  roughness: 0.4,        
  metalness: 0.8,        
  emissive: 0xB8860B,
  emissiveIntensity: 0.3 // Much lower glow
});

const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
  const geometry = new TextGeometry('HAVEN', {
    font: font,
    size: 4.5, // Much smaller text
    height: 1, 
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.1,
    bevelSize: 0.05,
    bevelSegments: 3
  });
  geometry.center();
  const textMesh = new THREE.Mesh(geometry, mat);
  group.add(textMesh);
  scene.add(group);
});

// 4. ANIMATION & SCROLL FADE
let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
});

let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY;
  // Fade out the 3D canvas as you scroll down
  const opacity = Math.max(0, 1 - (scrollY / (window.innerHeight * 0.5)));
  canvas.style.opacity = opacity;
});

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

