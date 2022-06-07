export const getRouteToCoords = route => {
  const points = route
    .getPaths()
    .toArray()
    .map(path => path.properties.get('coordinates'))
    .reduce((acc, val) => acc.concat(val), [])
  return { type: 'LineString', coordinates: points }
}

/**
 * Вычисляет азимут между двумя точками
 * @param x1
 * @param y1
 * @param x2
 * @param y2
 * @returns {number}
 */
export const getAzimuth = ([x1, y1], [x2, y2]) => {
  let a = 90 - (Math.atan2(y2 - y1, x2 - x1) * 180) / Math.PI
  if (a < 0) a += 360
  return a
}

/**
 * Вычисляет точку на расстоянии и в направлении от переданной
 * @param point
 * @param azimuth
 * @param distance
 * @returns [number, number]
 */
export const getPoint = (point, azimuth, distance) => {
  const azimuthInRadians = (azimuth * Math.PI) / 180
  const direction = [Math.sin(azimuthInRadians), Math.cos(azimuthInRadians)]
  const path = ymaps.coordSystem.geo.solveDirectProblem(
    point,
    direction,
    distance
  ).pathFunction
  return path(1).point
}
