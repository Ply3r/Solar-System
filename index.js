import * as THREE from './node_modules/three/build/three.module.js';
import { OrbitControls } from './node_modules/three/examples/jsm/controls/OrbitControls.js';
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
scene.add(gridHelper)

const controls = new OrbitControls(camera, renderer.domElement)

const addStars = () => {
  for(let c = 0; c < 150; c += 1) {
    const sphere = new THREE.SphereGeometry(1, 32, 16)
    const starMatrial = new THREE.MeshBasicMaterial({ color: 0xffffff })
    const star = new THREE.Mesh(sphere, starMatrial)

    star.position.x = Math.floor(Math.random() * 1000) - 500
    star.position.y = Math.floor(Math.random() * 1000) - 500
    star.position.z = Math.floor(Math.random() * 1000) - 500
  
    scene.add(star)
  }
  renderer.render(scene, camera)
}


function animate() {
  requestAnimationFrame( animate )
  
  EarthComponent.rotation.y += 0.001

  let { x, y, z } = MoonComponent.position
  x = x * Math.cos(30) - y * Math.sin(30)
  y = x * Math.sin(30) - y * Math.cos(30)

  console.log(MoonComponent)

  MoonComponent.position.x = x
  MoonComponent.position.y = y
  console.log(MoonComponent)

  SunComponent[0].rotation.y += 0.0005
  
  controls.update()
  renderer.render(scene, camera)
}


window.onload = () => {
  addStars()
  animate()
}

