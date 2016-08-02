/**
 * @param  {*} arr
 * @return {Boolean}
 */
var isArray = module.exports.isArray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};


/**
 * @param  {Array.<Number>} p1
 * @param  {Array.<Number>} p2
 * @return {Boolean}
 */
module.exports.equals = function equals(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
};


/**
 * @param  {*}       coordinates
 * @param  {Number=} depth
 * @return {*}
 */
module.exports.orientRings = function orientRings(coordinates, depth, isHole) {
  depth = depth || 0;
  var i, len;
  if (isArray(coordinates) && typeof coordinates[0][0] === 'number') {
    var area = 0;
    var ring = coordinates;

    for (i = 0, len = ring.length; i < len; i++) {
      var pt1 = ring[i];
      var pt2 = ring[(i + 1) % len];
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

  return coordinates;
};