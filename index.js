import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { PCFSoftShadowMap } from './node_modules/three/build/three.module.js';
import { ShaderPass } from './node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from './node_modules/three/examples/jsm/shaders/LuminosityShader.js';
import Sun from './components/Sum.js';
import Earth from './components/Earth.js';
import Moon from './components/Moon.js';
import Planets from './components/Planets.js';

// INITIAL SETUP
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#canvas") })
camera.position.z = 40
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = PCFSoftShadowMap

// Post-Processing Effects 
const composer = new EffectComposer( renderer )
const renderPass = new RenderPass(scene, camera)
const shaders = new ShaderPass(LuminosityShader)
composer.addPass(renderPass, shaders)

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

// Saturn Ring
const textureRing = new THREE.TextureLoader().load('./images/saturn_ring.png')
const SaturnShape = new THREE.TorusGeometry(30, 5, 2, 100)
const material = new THREE.MeshStandardMaterial({ map: textureRing })
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

const gridHelper = new THREE.GridHelper(1000, 50)
// scene.add(gridHelper)

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
  // EarthComponent.rotation.y += 0.001
  MarsComponent.rotation.y += 0.001
  JupiterComponent.rotation.y += 0.005
  SaturnComponent.rotation.y += 0.005
  saturnRing.rotation.z += 0.005
  UranusComponent.rotation.y += 0.004
  NeptuneComponent.rotation.y += 0.004

  let { x, z, y } = MoonComponent.position
  const angle = 0.005
  const holdX = x

  // X axis rotation
  x = x * Math.cos(angle) - z * Math.sin(angle)
  z = z * Math.cos(angle) + holdX * Math.sin(angle)

  // Y axis rotation
  y = y * Math.cos(0.0009) - z * Math.sin(0.0009)

  MoonComponent.position.x = x
  MoonComponent.position.y = y
  MoonComponent.position.z = z

  MoonComponent.rotation.y += 0.0005

  SunComponent[0].rotation.y += 0.0005
  
  controls.update()
  composer.render()
}


window.onload = () => {
  addStars()
  animate()
}

