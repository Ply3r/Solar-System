import * as THREE from 'three'

const Earth = () => {
  const earthTexture = new THREE.TextureLoader().load('./images/earth.jpg')
  const geometry = new THREE.SphereGeometry(15, 60, 30)
  const material = new THREE.MeshStandardMaterial({ map: earthTexture })
  const earth = new THREE.Mesh(geometry, material)
  earth.castShadow = true
  earth.receiveShadow = true

  return earth
}

export default Earth
