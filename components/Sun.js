import * as THREE from 'three'

const Sun = () => {
  const sunTexture = new THREE.TextureLoader().load('./images/sun.png')
  const geometry = new THREE.SphereGeometry(60, 60, 30)
  const material = new THREE.MeshBasicMaterial({ map: sunTexture })
  const sun = new THREE.Mesh(geometry, material)
  sun.position.x = 300

  const sunLight = new THREE.PointLight(0xffffff, 1, 0, 2)
  sunLight.position.set(300, 5, 5)
  sunLight.castShadow = true
  sunLight.shadow.mapSize.set(2048, 2048)
  sunLight.shadow.camera.far = 1500

  return [sun, sunLight]
}

export default Sun
