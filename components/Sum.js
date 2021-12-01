import * as THREE from '../node_modules/three/build/three.module.js';

const Sun = () => {
  const sunTexture = new THREE.TextureLoader().load('../images/sun.png')
  const geometrical = new THREE.SphereGeometry(60, 60, 30)
  const material = new THREE.MeshBasicMaterial({ map: sunTexture })
  const sun = new THREE.Mesh(geometrical, material)
  sun.position.x = 300

  const sunLight = new THREE.PointLight(0xffffff, 1, 0, 2)
  sunLight.position.set(300, 5, 5)
  sunLight.castShadow = true;

  return [sun, sunLight]
}

export default Sun;
