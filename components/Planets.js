import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';

const Planet = (name, geometria, positon) => {
  const PlanetsTexture = new THREE.TextureLoader().load(`./images/${name}.jpg`)
  const geometrical = new THREE.SphereGeometry(...geometria)
  const material = new THREE.MeshStandardMaterial({ map: PlanetsTexture })
  const Planets = new THREE.Mesh(geometrical, material)
  Planets.castShadow = false
  Planets.position.x = positon

  return Planets
}

export default Planet
