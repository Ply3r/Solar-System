import * as THREE from 'three'

// Retorna um pivo (inclinado) que orbita a Terra, com a Lua como filha.
// Animar `orbit.rotation.y` faz a Lua girar em volta da Terra.
const Moon = () => {
  const moonTexture = new THREE.TextureLoader().load('./images/moon.jpg')
  const geometry = new THREE.SphereGeometry(3, 60, 30)
  const material = new THREE.MeshStandardMaterial({ map: moonTexture })
  const moon = new THREE.Mesh(geometry, material)
  moon.castShadow = true
  moon.receiveShadow = true
  moon.position.x = 25

  const orbit = new THREE.Group()
  orbit.add(moon)

  const tilt = new THREE.Group()
  tilt.rotation.x = 0.2
  tilt.add(orbit)

  return { tilt, orbit, moon }
}

export default Moon
