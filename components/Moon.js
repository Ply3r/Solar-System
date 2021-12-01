import * as THREE from '../node_modules/three/build/three.module.js';

const Moon = () => {
  const moonTexture = new THREE.TextureLoader().load('../images/moon.jpg')
  const geometrical = new THREE.SphereGeometry(3, 60, 30)
  const material = new THREE.MeshStandardMaterial({ map: moonTexture })
  const moon = new THREE.Mesh(geometrical, material)

  moon.position.x = 25
  moon.position.y = 5
  moon.position.z = 0

  return moon
}

export default Moon
