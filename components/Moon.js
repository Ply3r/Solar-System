import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';

const Moon = () => {
  const moonTexture = new THREE.TextureLoader().load('./images/moon.jpg')
  const geometrical = new THREE.SphereGeometry(3, 60, 30)
  const material = new THREE.MeshStandardMaterial({ map: moonTexture })
  const moon = new THREE.Mesh(geometrical, material)
  moon.castShadow = true
  moon.receiveShadow = true

  moon.position.x = 25
  moon.position.y = 5
  moon.position.z = 0

  return moon
}

export default Moon
