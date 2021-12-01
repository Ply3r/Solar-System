import * as THREE from '../node_modules/three/build/three.module.js';

const Earth = () => {
  const earthTexture = new THREE.TextureLoader().load('./images/earth.jpg')
  const geometrical = new THREE.SphereGeometry(15, 60, 30)
  const material = new THREE.MeshStandardMaterial({ map: earthTexture })
  const earth = new THREE.Mesh(geometrical, material)

  return earth
}

export default Earth
