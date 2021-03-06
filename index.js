import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/RenderPass.js';
import { PCFSoftShadowMap } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/shaders/FXAAShader.js';
import Sun from './components/Sum.js';
import Earth from './components/Earth.js';
import Moon from './components/Moon.js';
import Planets from './components/Planets.js';

// INITIAL SETUP
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#canvas") })
camera.position.z = 50
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap

// Post-Processing Effects 
const composer = new EffectComposer( renderer )
const renderPass = new RenderPass(scene, camera)
const fxaa = new ShaderPass(FXAAShader)

composer.addPass(renderPass)
composer.addPass(fxaa)

// Sun
const SunComponent = Sun()
scene.add(...SunComponent)

// Mercury
const MercuryComponent = Planets('mercury', [7, 60, 30], 200)
scene.add(MercuryComponent)

// Venus
const VenusComponent = Planets('venus', [11, 60, 30], 100)
scene.add(VenusComponent)

// Earth
const EarthComponent = Earth()
scene.add(EarthComponent)

// Moon
const MoonComponent = Moon()
scene.add(MoonComponent)

// Mars
const MarsComponent = Planets('mars', [12, 60, 30], -100)
scene.add(MarsComponent)

// Jupiter
const JupiterComponent = Planets('jupiter', [20, 60, 30], -200)
scene.add(JupiterComponent)

// Saturn
const SaturnComponent = Planets('saturn', [18, 60, 30], -300)
scene.add(SaturnComponent)

// Saturn_Ring 
const SaturnShape = new THREE.TorusGeometry(30, 5, 2, 100)
const material = new THREE.MeshStandardMaterial({ color: 0xE6BB7D })
const saturnRing = new THREE.Mesh(SaturnShape, material)
saturnRing.rotation.x = 90
saturnRing.position.x = -300
scene.add(saturnRing)

// Uranus
const UranusComponent = Planets('uranus', [16, 60, 30], -400)
scene.add(UranusComponent)

// Neptune
const NeptuneComponent = Planets('neptune', [18, 60, 30], -500)
scene.add(NeptuneComponent)

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

const controls = new OrbitControls(camera, renderer.domElement)

const addStars = () => {
  for(let c = 0; c < 300; c += 1) {
    const sphere = new THREE.SphereGeometry(1, 32, 16)
    const starMatrial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const star = new THREE.Mesh(sphere, starMatrial)

    star.position.x = Math.floor(Math.random() * 3000) - 2000
    star.position.y = Math.floor(Math.random() * 3000) - 2000
    star.position.z = Math.floor(Math.random() * 3000) - 2000
  
    scene.add(star)
  }
  renderer.render(scene, camera)
}


function animate() {
  requestAnimationFrame( animate )
  
  MercuryComponent.rotation.y += 0.009
  VenusComponent.rotation.y += 0.0005
  EarthComponent.rotation.y += 0.001
  MarsComponent.rotation.y += 0.001
  JupiterComponent.rotation.y += 0.005
  SaturnComponent.rotation.y += 0.005
  saturnRing.rotation.z += 0.005
  UranusComponent.rotation.y += 0.004
  NeptuneComponent.rotation.y += 0.004

  let { x, z, y } = MoonComponent.position
  const angle = 0.0054
  const holdX = x

  // X axis rotation moon
  x = x * Math.cos(angle) - z * Math.sin(angle)
  z = z * Math.cos(angle) + holdX * Math.sin(angle)

  // Y axis rotation moon
  y = y * Math.cos(0.0009) - z * Math.sin(0.0009)

  MoonComponent.position.x = x
  MoonComponent.position.y = y
  MoonComponent.position.z = z

  MoonComponent.rotation.y -= 0.005

  SunComponent[0].rotation.y += 0.0005

  // camera
  let { x: camX, y : camY, z: camZ } = camera.position

  const xAngle = 0.003;
  const yAngle = 0.0005;

  const holdCamX = camX;

  // X axis rotation camera
  camX = camX * Math.cos(xAngle) + camZ * Math.sin(xAngle)
  camZ = camZ * Math.cos(xAngle) - holdCamX * Math.sin(xAngle)

  // Y axis rotation camera
  camY = camY * Math.cos(yAngle) + camZ * Math.sin(yAngle)

  camera.position.x = camX
  camera.position.y = camY
  camera.position.z = camZ
  
  controls.update()
  composer.render()
}


window.onload = () => {
  addStars()
  animate()
}

