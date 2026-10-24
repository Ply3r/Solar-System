import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { ShaderPass } from "three/examples/jsm/postprocessing/ShaderPass.js";
import { FXAAShader } from "three/examples/jsm/shaders/FXAAShader.js";
import Sun from "./components/Sun.js";
import Earth from "./components/Earth.js";
import Moon from "./components/Moon.js";
import Planets from "./components/Planets.js";

// INITIAL SETUP
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  70,
  window.innerWidth / window.innerHeight,
  0.1,
  5000,
);
const renderer = new THREE.WebGLRenderer({
  canvas: document.querySelector("#canvas"),
});
camera.position.set(0, 200, 380);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Post-Processing Effects
const composer = new EffectComposer(renderer);
const renderPass = new RenderPass(scene, camera);
const fxaa = new ShaderPass(FXAAShader);

composer.addPass(renderPass);
composer.addPass(fxaa);

const resize = () => {
  const width = window.innerWidth;
  const height = window.innerHeight;
  const pixelRatio = renderer.getPixelRatio();

  camera.aspect = width / height;
  camera.updateProjectionMatrix();
  renderer.setSize(width, height);
  composer.setSize(width, height);
  fxaa.material.uniforms.resolution.value.set(
    1 / (width * pixelRatio),
    1 / (height * pixelRatio),
  );
};
window.addEventListener("resize", resize);
resize();

// Sun
const [sun, sunLight] = Sun();
scene.add(sun, sunLight);

// Orbitas: cada corpo fica em um pivo na origem (Sol); girar o pivo = orbitar o Sol.
// [name, [radius, widthSegments, heightSegments], distance to Sun, orbit speed (rad/s), spin (rad/s), orbit color]
const planetData = [
  ["mercury", [7, 60, 30], 100, 0.24, 0.54, 0xb1b1b1],
  ["venus", [11, 60, 30], 200, 0.18, 0.03, 0xe6c27a],
  ["earth", [15, 60, 30], 300, 0.12, 0.06, 0x4aa3ff],
  ["mars", [12, 60, 30], 400, 0.09, 0.06, 0xe0573a],
  ["jupiter", [20, 60, 30], 500, 0.05, 0.3, 0xd9a066],
  ["saturn", [18, 60, 30], 600, 0.035, 0.3, 0xe6d28a],
  ["uranus", [16, 60, 30], 700, 0.025, 0.24, 0x7fe0e6],
  ["neptune", [18, 60, 30], 800, 0.02, 0.24, 0x4a6cf0],
];

const addOrbitLine = (radius, color, parent = scene) => {
  const points = [];
  for (let i = 0; i <= 128; i += 1) {
    const angle = (i / 128) * Math.PI * 2;
    points.push(new THREE.Vector3(Math.cos(angle) * radius, 0, Math.sin(angle) * radius));
  }
  const line = new THREE.LineLoop(
    new THREE.BufferGeometry().setFromPoints(points),
    new THREE.LineBasicMaterial({ color, transparent: true, opacity: 0.7 }),
  );
  parent.add(line);
};

const planets = planetData.map(([name, geometry, distance, orbitSpeed, spin, color]) => {
  const pivot = new THREE.Group();
  scene.add(pivot);
  addOrbitLine(distance, color);

  const mesh = name === "earth" ? Earth() : Planets(name, geometry, distance);
  mesh.position.x = distance;
  pivot.add(mesh);
  return { name, pivot, mesh, orbitSpeed, spin };
});

// Moon: filha do pivo da Terra, entao acompanha a Terra e orbita ela
const earthEntry = planets.find(({ name }) => name === "earth");
const { tilt: moonTilt, orbit: moonOrbit, moon } = Moon();
moonTilt.position.x = 300;
earthEntry.pivot.add(moonTilt);
addOrbitLine(25, 0xcccccc, moonTilt);

// Saturn ring: tambem no pivo, acompanhando Saturno
const saturnEntry = planets.find(({ name }) => name === "saturn");
const saturnRing = new THREE.Mesh(
  new THREE.TorusGeometry(30, 5, 2, 100),
  new THREE.MeshStandardMaterial({ color: 0xe6bb7d }),
);
saturnRing.rotation.x = Math.PI / 2 - 0.4;
saturnRing.position.x = 600;
saturnRing.castShadow = true;
saturnRing.receiveShadow = true;
saturnEntry.pivot.add(saturnRing);

// Ambient Light
scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// Camera: gira em volta do Sol (alvo na origem); sem pan, zoom com a roda
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableRotate = true;
controls.enablePan = false;
controls.enableDamping = true;
controls.minDistance = 100;
controls.maxDistance = 3000;

// Stars: um unico draw call, centradas na origem e dentro do alcance da camera
const addStars = () => {
  const count = 1500;
  const range = 3000;
  const positions = new Float32Array(count * 3);
  for (let i = 0; i < positions.length; i += 1) {
    positions[i] = (Math.random() - 0.5) * range;
  }
  const geometry = new THREE.BufferGeometry();
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  const material = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 2,
    sizeAttenuation: false,
  });
  scene.add(new THREE.Points(geometry, material));
};

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const dt = clock.getDelta();

  planets.forEach(({ pivot, mesh, orbitSpeed, spin }) => {
    pivot.rotation.y += orbitSpeed * dt;
    mesh.rotation.y += spin * dt;
  });
  saturnRing.rotation.z += 0.3 * dt;

  moonOrbit.rotation.y += 0.324 * dt;
  moon.rotation.y -= 0.3 * dt;

  sun.rotation.y += 0.03 * dt;

  controls.update();
  composer.render();
}

addStars();
animate();
