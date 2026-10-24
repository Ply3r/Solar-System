import * as THREE from 'three'

const Planets = (name, geometry, positionX) => {
  const texture = new THREE.TextureLoader().load(`./images/${name}.jpg`)
  const sphere = new THREE.SphereGeometry(...geometry)
  const material = new THREE.MeshStandardMaterial({ map: texture })
  const planet = new THREE.Mesh(sphere, material)
  planet.castShadow = true
  planet.receiveShadow = true
  planet.position.x = positionX

  return planet
}

export default Planets
