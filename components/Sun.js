import * as THREE from 'https://cdn.skypack.dev/three@0.135.0';

const Sun = () => {
  const sunTexture = new THREE.TextureLoader().load('./images/sun.png')
  const geometrical = new THREE.SphereGeometry(60, 60, 30)
  const material = new THREE.MeshBasicMaterial({ map: sunTexture })
  const sun = new THREE.Mesh(geometrical, material)
  sun.position.x = 0 

  const sunLight = new THREE.PointLight(0xffffff, 1, 0, 2)
  sunLight.position.set(0, 5, 5)
  sunLight.castShadow = true;

  return [sun, sunLight]
}

export default Sun;
