import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';

const Earth = () => {
  const earthTexture = new THREE.TextureLoader().load('./images/earth.jpg')
  const geometrical = new THREE.SphereGeometry(15, 60, 30)
  const material = new THREE.MeshStandardMaterial({ map: earthTexture })
  const earth = new THREE.Mesh(geometrical, material)
  earth.castShadow = true

  return earth
}

export default Earth
