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
camera.position.z = 50;
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

// Earth + Moon
const earth = Earth();
scene.add(earth);

const { tilt: moonTilt, orbit: moonOrbit, moon } = Moon();
scene.add(moonTilt);

// Other planets: [name, [radius, widthSegments, heightSegments], x, spin (rad/s)]
const planetData = [
  ["mercury", [7, 60, 30], 200, 0.54],
  ["venus", [11, 60, 30], 100, 0.03],
  ["mars", [12, 60, 30], -100, 0.06],
  ["jupiter", [20, 60, 30], -200, 0.3],
  ["saturn", [18, 60, 30], -300, 0.3],
  ["uranus", [16, 60, 30], -400, 0.24],
  ["neptune", [18, 60, 30], -500, 0.24],
];
const planets = planetData.map(([name, geometry, x, spin]) => {
  const mesh = Planets(name, geometry, x);
  scene.add(mesh);
  return { mesh, spin };
});

// Saturn ring
const saturnRing = new THREE.Mesh(
  new THREE.TorusGeometry(30, 5, 2, 100),
  new THREE.MeshStandardMaterial({ color: 0xe6bb7d }),
);
saturnRing.rotation.x = Math.PI / 2 - 0.4;
saturnRing.position.x = -300;
saturnRing.castShadow = true;
saturnRing.receiveShadow = true;
scene.add(saturnRing);

// Ambient Light
scene.add(new THREE.AmbientLight(0xffffff, 0.1));

// Camera: gira em volta da Terra (alvo na origem); sem pan, zoom com a roda
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(0, 0, 0);
controls.enableRotate = true;
controls.enablePan = false;
controls.enableDamping = true;

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

  earth.rotation.y += 0.06 * dt;
  planets.forEach(({ mesh, spin }) => {
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
