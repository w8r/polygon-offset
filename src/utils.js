/**
 * @param  {*} arr
 * @return {Boolean}
 */
export const isArray =
  Array.isArray ||
  function (arr) {
    return Object.prototype.toString.call(arr) === '[object Array]';
  };

/**
 * @param  {*} arr
 * @return {Boolean}
 */
export const isNonEmptyArray = arr => isArray(arr) && arr.length;

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

  if (
    depth === 0 &&
    isNonEmptyArray(coordinates) &&
    isNonEmptyArray(coordinates[0]) &&
    typeof coordinates[0][0][0] === 'number'
  ) {
    const clone = coordinates[0].slice(0, 1)[0];
    coordinates[0].pop();
    coordinates[0].push([clone[0], clone[1]]);
  }

  return coordinates;
}

/**
 * Creates arch between two edges
 *
 * @param  {Array.<Object>} vertices
 * @param  {Object}         center
 * @param  {Number}         radius
 * @param  {Object}         startVertex
 * @param  {Object}         endVertex
 * @param  {Number}         segments
 * @param  {Boolean}        outwards
 */
export function arc(
  vertices,
  center,
  radius,
  startVertex,
  endVertex,
  segments,
  outwards
) {
  const PI2 = Math.PI * 2;
  let startAngle = Math.atan2(
    startVertex[1] - center[1],
    startVertex[0] - center[0]
  );
  let endAngle = Math.atan2(endVertex[1] - center[1], endVertex[0] - center[0]);

  // odd number please
  if (segments % 2 === 0) segments -= 1;

  if (startAngle < 0) startAngle += PI2;

  if (endAngle < 0) endAngle += PI2;

  let angle =
    startAngle > endAngle ? startAngle - endAngle : startAngle + PI2 - endAngle;
  const segmentAngle = (outwards ? -angle : PI2 - angle) / segments;

  vertices.push(startVertex);
  for (let i = 1; i < segments; ++i) {
    angle = startAngle + segmentAngle * i;
    vertices.push([
      center[0] + Math.cos(angle) * radius,
      center[1] + Math.sin(angle) * radius
    ]);
  }
  vertices.push(endVertex);
  return vertices;
}

/**
 * @param  {Array.<Array.<Number>>} vertices
 * @param  {Array.<Number>}         pt1
 * @param  {Array.<Number>}         pt2
 * @param  {Number}                 dist
 * @param  {Number}                 arcSegments
 * @return {Array.<Array.<Number>>}
 */
export function offsetSegment(v1, v2, e1, dist, arcSegments) {
  const vertices = [];
  const offsets = [
    e1.offset(e1.inNormal[0] * dist, e1.inNormal[1] * dist),
    e1.inverseOffset(e1.outNormal[0] * dist, e1.outNormal[1] * dist)
  ];

  for (let i = 0, len = 2; i < len; i++) {
    const thisEdge = offsets[i];
    const prevEdge = offsets[(i + len - 1) % len];
    arc(
      vertices,
      i === 0 ? v1 : v2, // edges[i].current, // p1 or p2
      dist,
      prevEdge.next,
      thisEdge.current,
      arcSegments,
      true
    );
  }

  return vertices;
}

/**
 * @param  {Array.<Object>} vertices
 * @return {Array.<Object>}
 */
export function ensureLastPoint(vertices) {
  if (!equals(vertices[0], vertices[vertices.length - 1])) {
    vertices.push([vertices[0][0], vertices[0][1]]);
  }
  return vertices;
}
