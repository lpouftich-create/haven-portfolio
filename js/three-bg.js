import * as THREE from 'three';

// 1. Setup Scene
const canvas = document.querySelector('#webgl');
const scene = new THREE.Scene();
// Add a subtle fog so particles fade into the background
scene.fog = new THREE.FogExp2(0x0a0f0c, 0.05);

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 100);
camera.position.z = 15;

const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

// 2. Generate the "HAVEN" Texture
const textCanvas = document.createElement('canvas');
textCanvas.width = 1024;
textCanvas.height = 256;
const ctx = textCanvas.getContext('2d');
ctx.fillStyle = 'black';
ctx.fillRect(0, 0, 1024, 256);
ctx.font = 'bold 180px "Fraunces", serif';
ctx.fillStyle = 'white';
ctx.textAlign = 'center';
ctx.textBaseline = 'middle';
ctx.fillText('HAVEN', 512, 128);

// Read pixels to find where the text is
const pixels = ctx.getImageData(0, 0, 1024, 256).data;
const particles = [];

// Sample the text canvas to create particle positions
for (let y = 0; y < 256; y += 3) {
  for (let x = 0; x < 1024; x += 3) {
    const index = (y * 1024 + x) * 4;
    if (pixels[index] > 128) { // If white
      // Map canvas X,Y to 3D X,Y (centered)
      const px = (x - 512) / 25;
      const py = -(y - 128) / 25;
      particles.push({ x: px, y: py, z: 0 });
    }
  }
}

// 3. Create Particle Geometry
const geometry = new THREE.BufferGeometry();
const positions = new Float32Array(particles.length * 3);
const randoms = new Float32Array(particles.length); // For animating sizes

particles.forEach((p, i) => {
  positions[i * 3] = p.x;
  positions[i * 3 + 1] = p.y;
  positions[i * 3 + 2] = p.z;
  randoms[i] = Math.random();
});

geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
geometry.setAttribute('aRandom', new THREE.BufferAttribute(randoms, 1));

// 4. Shader Material (Glowing Lime Green)
const material = new THREE.ShaderMaterial({
  uniforms: {
    uTime: { value: 0 },
    uScroll: { value: 0 },
    uColor: { value: new THREE.Color('#b8ff3c') }, // Your lime color
  },
  vertexShader: `
    uniform float uTime;
    uniform float uScroll;
    attribute float aRandom;
    varying float vRandom;
    
    void main() {
      vRandom = aRandom;
      
      // Gentle floating wave
      vec3 pos = position;
      pos.z += sin(pos.x * 0.5 + uTime) * 0.5;
      pos.z += cos(pos.y * 0.5 + uTime) * 0.5;
      
      // Scroll effect (moves particles in Z and spin)
      pos.z += uScroll * 10.0;
      
      vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
      gl_PointSize = (30.0 / -mvPosition.z) * (0.5 + aRandom);
      gl_Position = projectionMatrix * mvPosition;
    }
  `,
  fragmentShader: `
    uniform vec3 uColor;
    varying float vRandom;
    
    void main() {
      // Draw a soft circle
      vec2 cxy = 2.0 * gl_PointCoord - 1.0;
      float r = dot(cxy, cxy);
      if (r > 1.0) discard;
      
      // Soft edges
      float alpha = (1.0 - r) * 0.8;
      
      // Add some brightness variation
      vec3 color = uColor + (vRandom * 0.3);
      
      gl_FragColor = vec4(color, alpha);
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
const windowHalfX = window.innerWidth / 2;
const windowHalfY = window.innerHeight / 2;

document.addEventListener('mousemove', (event) => {
  mouseX = (event.clientX - windowHalfX) * 0.001;
  mouseY = (event.clientY - windowHalfY) * 0.001;
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
  
  // Update uniforms
  material.uniforms.uTime.value = time;
  material.uniforms.uScroll.value = scrollY;
  
  // Smooth mouse follow
  targetX += (mouseX - targetX) * 0.05;
  targetY += (mouseY - targetY) * 0.05;
  
  // Rotate the whole system based on scroll and mouse
  particleSystem.rotation.y = time * 0.1 + targetX + (scrollY * Math.PI);
  particleSystem.rotation.x = targetY;
  
  // Move the system down slightly as you scroll
  particleSystem.position.y = scrollY * 5;
  
  renderer.render(scene, camera);
}

// 8. Handle Resize & Load
window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

// Wait for fonts to load before rendering the canvas, then fade it in
document.fonts.ready.then(() => {
  animate();
  setTimeout(() => {
    canvas.classList.add('ready');
  }, 100);
});
