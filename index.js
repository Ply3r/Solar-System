import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';
import { OrbitControls } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/controls/OrbitControls.js';
import { EffectComposer } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/RenderPass.js';
import { PCFSoftShadowMap } from 'https://cdn.skypack.dev/three@0.135.0/build/three.module.js';
import { ShaderPass } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/postprocessing/ShaderPass.js';
import { FXAAShader } from 'https://cdn.skypack.dev/three@0.135.0/examples/jsm/shaders/FXAAShader.js';
import Sun from './components/Sun.js';
import Earth from './components/Earth.js';
import Moon from './components/Moon.js';
import Planet from './components/Planets.js';
import { orbitMovement, rotationMovement } from './utils/celestialMovements.js';

// INITIAL SETUP
const scene = new THREE.Scene()
const camera = new THREE.PerspectiveCamera(90, window.innerWidth/window.innerHeight, 0.1, 1000)
const renderer = new THREE.WebGLRenderer({ canvas: document.querySelector("#canvas") })
camera.position.z = 200
camera.position.y = 50
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
const MercuryComponent = Planet('mercury', [7, 60, 30], -150)
scene.add(MercuryComponent)

// Venus
const VenusComponent = Planet('venus', [11, 60, 30], -200)
scene.add(VenusComponent)

// Earth
const EarthComponent = Earth()
scene.add(EarthComponent)

// Mars
const MarsComponent = Planet('mars', [12, 60, 30], -400)
scene.add(MarsComponent)

// Jupiter
const JupiterComponent = Planet('jupiter', [20, 60, 30], -500)
scene.add(JupiterComponent)

// Saturn
const SaturnComponent = Planet('saturn', [18, 60, 30], -600)
scene.add(SaturnComponent)

// Uranus
const UranusComponent = Planet('uranus', [16, 60, 30], -700)
scene.add(UranusComponent)

// Neptune
const NeptuneComponent = Planet('neptune', [18, 60, 30], -800)
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
  
  rotationMovement(MercuryComponent)(0.009);
  rotationMovement(VenusComponent)(0.0005);
  rotationMovement(EarthComponent)(0.001);
  rotationMovement(MarsComponent)(0.001);
  rotationMovement(JupiterComponent)(0.005);
  rotationMovement(SaturnComponent)(0.005);
  rotationMovement(UranusComponent)(0.004);
  rotationMovement(NeptuneComponent)(0.004);
  rotationMovement(SunComponent[0])(0.0005);

  // orbit movement from moon
  const angleXMoon = 0.0099;
  const angleYMoon = 0.00099;

  orbitMovement(MercuryComponent)({ 
    angleX: angleXMoon * .98, 
    angleY: angleYMoon * .98
  });

  orbitMovement(VenusComponent)({ 
    angleX: angleXMoon * .88, 
    angleY: angleYMoon * .88
  });

  orbitMovement(EarthComponent)({ 
    angleX: angleXMoon * .78, 
    angleY: angleYMoon * .78
  });

  orbitMovement(MarsComponent)({ 
    angleX: angleXMoon * .76, 
    angleY: angleYMoon * .76
  });

  orbitMovement(JupiterComponent)({ 
    angleX: angleXMoon * .40, 
    angleY: angleYMoon * .40
  });

  orbitMovement(SaturnComponent)({ 
    angleX: angleXMoon * .38, 
    angleY: angleYMoon * .38
  });

  orbitMovement(UranusComponent)({ 
    angleX: angleXMoon, 
    angleY: angleYMoon
  });

  orbitMovement(NeptuneComponent)({ 
    angleX: angleXMoon, 
    angleY: angleYMoon
  });
  
  controls.update()
  composer.render()
}


window.onload = () => {
  addStars()
  animate()
}

