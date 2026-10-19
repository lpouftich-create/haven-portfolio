import * as THREE from 'three';

// 1. Setup Scene
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
// Fog helps it fade into the background elegantly
scene.fog = new THREE.FogExp2(0x0a0f0c, 0.03);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 20;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Generate the BOLD "HAVEN" Texture
const textCanvas = document.createElement('canvas');
textCanvas.width = 1200;
textCanvas.height = 300;
const ctx = textCanvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, 1200, 300);

// Use a universally heavy font
ctx.font = '900 240px "Arial Black", Impact, sans-serif'; 
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
// Draw it centered
ctx.fillText('HAVEN', 600, 150);

// Read pixels to find where the text is
const pixels = ctx.getImageData(0, 0, 1200, 300).data;
const particles = [];

// Tighten the sampling step (from 3 to 2) to create a denser, bolder shape
for (let y = 0; y < 300; y += 2) {
  for (let x = 0; x < 1200; x += 2) {
    const index = (y * 1200 + x) * 4;
    if (pixels[index] > 128) {
      // Map to 3D space. Center it at (0,0,0)
      const px = (x - 600) / 35; 
      const py = -(y - 150) / 35;
      particles.push({ x: px, y: py, z: 0 });
    }
  }
}

// 3. Create Particle Geometry
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particles.length * 3);
const randoms = new Float32Array(particles.length);

particles.forEach((p, i) => {
  positions[i * 3] = p.x;
  positions[i * 3 + 1] = p.y;
  positions[i * 3 + 2] = p.z;
  randoms[i] = Math.random();
});

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// 4. Shader Material (Thicker, brighter)
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uColor: { value: new THREE.Color('#b8ff3c') },
  },
  vertexShader: `
    uniform float uTime;
    uniform float uScroll;
    attribute float aRandom;
    varying float vRandom;
    
    void main() {
      vRandom = aRandom;
      vec3 pos = position;
      
      // Very subtle breathing effect (keeps it strong, not wavy)
      pos.z += sin(pos.x * 0.3 + uTime * 1.5) * 0.2;
      
      // Scroll gently pushes it back, but doesn't destroy it
      pos.z -= uScroll * 5.0;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      
      // MAKE PARTICLES BIGGER
      gl_PointSize = (40.0 / -mvPosition.z) * (0.8 + aRandom * 0.4);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vRandom;
    
    void main() {
      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
      float r = dot(cxy, cxy);
      if (r > 1.0) discard;
      
      // Solid center, soft edge
      float alpha = smoothstep(1.0, 0.3, r);
      
      // Mix the lime green with a bit of gold for depth
      vec3 color = mix(uColor, vec3(1.0, 0.82, 0.4), vRandom * 0.3);
      
      gl_FragColor = vec4(color, alpha * 0.9);
    }
  `,
  transparent: true,
  depthWrite: false,
  blending: THREE.AdditiveBlending
});

const particleSystem = new THREE.Points(geometry, material);
scene.add(particleSystem);

// 5. Mouse Interaction
let mouseX = 0;
let mouseY = 0;
let targetX = 0;
let targetY = 0;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - window.innerWidth / 2) * 0.001;
  mouseY = (event.clientY - window.innerHeight / 2) * 0.001;
});

// 6. Scroll Interaction
let scrollY = 0;
window.addEventListener('scroll', () => {
  scrollY = window.scrollY / window.innerHeight;
});

// 7. Animation Loop
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  
  const time = clock.getElapsedTime();
  
  material.uniforms.uTime.value = time;
  material.uniforms.uScroll.value = scrollY;
  
  // Smooth mouse follow (subtle tilt)
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  // LOCK TO CENTER: Only rotate, never translate wildly
  particleSystem.rotation.y = time * 0.15 + targetX + (scrollY * 0.5);
  particleSystem.rotation.x = targetY;
  
  // Keep it perfectly centered vertically, only move slightly back on scroll
  particleSystem.position.y = 0; 
  particleSystem.position.z = -scrollY * 2;
  
  renderer.render(scene, camera);
}

// 8. Resize & Load
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Fade in when ready
document.fonts.ready.then(() => {
  animate();
  setTimeout(() => {
    canvas.classList.add('ready');
  }, 100);
});
