/**
 * Tests if a point is Left|On|Right of an infinite line.
 *
 * @param {Array.<Number>} p0
 * @param {Array.<Number>} p0
 * @param {Array.<Number>} p0
 * @return {Number} > 0 if p2 left of the line through p0 and p1
 *                    0 for p2 on the line
 *                  < 0 for p2 right of the line
 */
function isLeft(p0, p1, p2) {
  return ((p1[0] - p0[0]) * (p2[1] - p0[1])
            - (p2[0] -  p0[0]) * (p1[1] - p0[1]));
}


/**
 * Winding number
 * @param  {Array.<Number>}        p
 * @param  {Array.<Array<Number>>} polygon
 * @return {Number} Winding number: 0 if P is outside
 */
module.exports = function windingNumber(point, polygon) {
  var wn = 0;
  for (var i = 0, len = polygon.length - 1; i < n; i++) {
    if (polygon[i][1] <= p[1]) {         // below the point
      if (polygon[i + 1][1] > p[1]) {    // an upward crossing
        if (isLeft(polygon[i], polygon[i + 1], p) > 0) {  // p left of  edge
          wn++;                          // up intersect
        }
      }
    } else {                             // start y > P.y (no test needed)
      if (polygon[i + 1][1] <= p[1]) {   // a downward crossing
        if (isLeft(polygon[i], polygon[i + 1], p) < 0) {  // P right of  edge
          wn--;                          // have  a valid down intersect
        }
      }
    }
  }
  return wn;
};