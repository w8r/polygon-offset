/**
 * @param  {*} arr
 * @return {Boolean}
 */
export const isArray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}


/**
 * @param  {*} arr
 * @return {Boolean}
 */
export const isNonEmptyArray = (arr) => isArray(arr) && arr.length;


/**
 * @param  {Array.<Number>} p1
 * @param  {Array.<Number>} p2
 * @return {Boolean}
 */
export function equals(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
}


/**
 * @param  {*}       coordinates
 * @param  {Number=} depth
 * @return {*}
 */
export function orientRings(coordinates, depth, isHole) {
  depth = depth || 0;
  let i, len;
  if (isNonEmptyArray(coordinates) && typeof coordinates[0][0] === 'number') {
    let area = 0;
    const ring = coordinates;

    for (i = 0, len = ring.length; i < len; i++) {
      const pt1 = ring[i];
      const pt2 = ring[(i + 1) % len];
      area += pt1[0] * pt2[1];
      area -= pt2[0] * pt1[1];
    }
    if ((!isHole && area > 0) || (isHole && area < 0)) {
      ring.reverse();
    }
  } else {
    for (i = 0, len = coordinates.length; i < len; i++) {
      orientRings(coordinates[i], depth + 1, i > 0);
    }
  }

  if (depth === 0 && isNonEmptyArray(coordinates)
  && isNonEmptyArray(coordinates[0])
  && typeof coordinates[0][0][0] === 'number') {
    var clone = coordinates[0].slice(0, 1)[0];
    coordinates[0].pop();
    coordinates[0].push([clone[0], clone[1]]);
  }

  return coordinates;
}
