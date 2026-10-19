import * as THREE from 'three';
import { FontLoader } from 'https://unpkg.com/three@0.160.0/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'https://unpkg.com/three@0.160.0/examples/jsm/geometries/TextGeometry.js';
import { EffectComposer } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'https://unpkg.com/three@0.160.0/examples/jsm/postprocessing/UnrealBloomPass.js';

const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
scene.fog = new THREE.FogExp2(0x0a0f0c, 0.02); 

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 35;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const renderScene = new RenderPass(scene, camera);
const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  1.5, 0.4, 0.85
);
const composer = new EffectComposer(renderer);
composer.addPass(renderScene);
composer.addPass(bloomPass);

const ambient = new THREE.AmbientLight(0xffffff, 1); 
scene.add(ambient);

const light1 = new THREE.DirectionalLight(0xb8ff3c, 10);
light1.position.set(-10, 10, 10);
scene.add(light1);

const light2 = new THREE.DirectionalLight(0xffd166, 10);
light2.position.set(10, -10, 10);
scene.add(light2);

const group = new THREE.Group();
const mat = new THREE.MeshStandardMaterial({
  color: 0xb8ff3c,
  roughness: 0.2,        
  metalness: 0.8,        
  emissive: 0x88cc00,
  emissiveIntensity: 1.0
});

const loader = new FontLoader();
loader.load('https://unpkg.com/three@0.160.0/examples/fonts/helvetiker_bold.typeface.json', function (font) {
  const geometry = new TextGeometry('HAVEN', {
    font: font,
    size: 7,
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

let mouseX = 0, mouseY = 0, targetX = 0, targetY = 0;
document.addEventListener('mousemove', (e) => {
  mouseX = (e.clientX - window.innerWidth / 2) * 0.002;
  mouseY = (e.clientY - window.innerHeight / 2) * 0.002;
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const time = clock.getElapsedTime();
  
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  group.rotation.y = targetX;
  group.rotation.x = targetY;
  group.position.y = Math.sin(time * 1.5) * 0.5;
  
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
