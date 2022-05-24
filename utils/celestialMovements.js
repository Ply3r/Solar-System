
/**
 * Params: (body: the body that you wan't to orbit the axis) => (
 *  rotation: the rotation of the body in their own axis
 * )
*/
export const rotationMovement = (body) => (rotation) => {
  body.rotation.y += rotation;
}

/**
 * Params: (body: the body that you wan't to orbit the axis) => ({
 *  rotation: the rotation of the body in their own axis,
 *  angleX: the angle in the X part of the canvas that you wan't the body deslocate,
 *  angleY: the angle in the Y part of the canvas that you wan't the body deslocate,
 *  direction: true for hourly deslocation and false to anti-hourly deslocation
 * })
*/
export const orbitMovement = (body) => ({ rotation, angleX, angleY, direction = true, axisDistance = 0 }) => {
  let { x, z, y } = body.position
  const holdX = x + axisDistance

  if (direction) {
    // X axis rotation
    x = holdX * Math.cos(angleX) - z * Math.sin(angleX)
    z = z * Math.cos(angleX) + holdX * Math.sin(angleX)
  
    // Y axis rotation
    y = y * Math.cos(angleY) - z * Math.sin(angleY)
  } else {
    // X axis rotation
    x = x * Math.cos(angleX) + z * Math.sin(angleX)
    z = z * Math.cos(angleX) - holdX * Math.sin(angleX)
  
    // Y axis rotation
    y = y * Math.cos(angleY) + z * Math.sin(angleY)
  }

  body.position.x = x
  body.position.y = y
  body.position.z = z

  if (rotation) {
    body.rotation.y -= rotation
  }
}
