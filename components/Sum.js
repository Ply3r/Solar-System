import * as THREE from '../node_modules/three/build/three.module.js';

const Sun = () => {
  const sunTexture = new THREE.TextureLoader().load('../images/sun.png')
  const geometrical = new THREE.SphereGeometry(60, 60, 30)
  const material = new THREE.MeshBasicMaterial({ map: sunTexture })
  const sun = new THREE.Mesh(geometrical, material)
  sun.position.x = 700

  const sunLight = new THREE.PointLight(0xffffff, 2, 100)
  sunLight.position.set(70, 5, 5)

  return [sun, sunLight]
}

export default Sun;
