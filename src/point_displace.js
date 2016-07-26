// https://github.com/tmcw/point-displace/
var sin = Math.sin;
var cos = Math.cos;


module.exports.dx = function(v, dx, dy, a) {
  return [
    v[0] + (dx * cos(a) - dy * sin(a)),
    v[1] + (dx * sin(a) + dy * cos(a))
  ];
};


module.exports.a = function(v, a, offset) {
  return [
    v[0] + (offset * sin(a)),
    v[1] - (offset * cos(a))
  ];
};


module.exports.ua = function(u, a, offset) {
  return [
    u[0] + (offset * sin(a)),
    u[1] - (offset * cos(a))
  ];
};


module.exports.ab = function(v, a, b, offset) {
  var sa = offset * sin(a),
      ca = offset * cos(a),
      h = tan(0.5 * (b - a));
  return [
    v[0] + sa + h * ca,
    v[1] - ca + h * sa
  ];
};
