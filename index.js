import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from './node_modules/three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from './node_modules/three/examples/jsm/postprocessing/RenderPass.js';
import { ShaderPass } from './node_modules/three/examples/jsm/postprocessing/ShaderPass.js';
import { LuminosityShader } from './node_modules/three/examples/jsm/shaders/LuminosityShader.js';
import Sun from './components/Sum.js';
import Earth from './components/Earth.js';
import Moon from './components/Moon.js';

// INITIAL SETUP
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(70, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#canvas") })
camera.position.z = 40
renderer.setPixelRatio(window.devicePixelRatio)
renderer.setSize(window.innerWidth, window.innerHeight)

// Post-Processing Effects 
const composer = new EffectComposer( renderer )
const renderPass = new RenderPass(scene, camera)
const shaderPass = new ShaderPass( LuminosityShader )
composer.addPass(shaderPass)
composer.addPass(renderPass)

// Sun
const SunComponent = Sun()
scene.add(...SunComponent)

// Earth
const EarthComponent = Earth()
scene.add(EarthComponent)

// Moon
const MoonComponent = Moon()
scene.add(MoonComponent)

// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.1)
scene.add(ambientLight)

const gridHelper = new THREE.GridHelper(200, 50)
// scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

const addStars = () => {
  for(let c = 0; c < 300; c += 1) {
    const sphere = new THREE.SphereGeometry(1, 32, 16)
    const starMatrial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const star = new THREE.Mesh(sphere, starMatrial)

    star.position.x = Math.floor(Math.random() * 2000) - 1000
    star.position.y = Math.floor(Math.random() * 2000) - 1000
    star.position.z = Math.floor(Math.random() * 2000) - 1000
  
    scene.add(star)
  }
  renderer.render(scene, camera)
}


function animate() {
  requestAnimationFrame( animate )
  
  EarthComponent.rotation.y += 0.001

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

  SunComponent[0].rotation.y += 0.0005
  
  controls.update()
  composer.render()
}


window.onload = () => {
  addStars()
  animate()
}

