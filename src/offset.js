var Edge = require('./edge');
var martinez = global.martinez = require('martinez-polygon-clipping');

var atan2 = Math.atan2;

var isArray = Array.isArray || function (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
};

/**
 * Offset builder
 *
 * @param {Array.<Object>=} vertices
 * @param {Number=}        arcSegments
 * @constructor
 */
function Offset(vertices, arcSegments) {

  /**
   * @type {Array.<Object>}
   */
  this.vertices = null;

  /**
   * @type {Array.<Edge>}
   */
  this.edges = null;

  /**
   * @type {Boolean}
   */
  this._closed = false;


  /**
   * @type {Number}
   */
  this._distance = 0;

  if (vertices) {
      this.data(vertices);
  }

  /**
   * Segments in edge bounding arches
   * @type {Number}
   */
  this._arcSegments = arcSegments !== undefined ? arcSegments : 5;
}

/**
 * Change data set
 * @param  {Array.<Array>} vertices
 * @return {Offset}
 */
Offset.prototype.data = function(vertices) {

  vertices = this.validate(vertices);

  if (vertices.length > 1) {
    var edges = [];
    for (var i = 0, len = vertices.length; i < len; i++) {
      edges.push(new Edge(vertices[i], vertices[(i + 1) % len]));
    }
    this.edges = edges;
  }
  this.vertices = vertices;

  return this;
};


Offset.prototype.data = function(vertices) {
  this._edges = [];
  if (!isArray (vertices)) {
    throw new Error('Offset requires at least one coodinate to work with');
  }

  if (isArray(vertices) && typeof vertices[0] === 'number') {
    this.vertices = vertices;
  } else {
    this.vertices = vertices;
    this._processContour(vertices, this._edges);
  }
};


Offset.prototype._processContour = function(contour, edges) {
  var i, len;
  // console.log(contour, edges, isArray(contour[0]), contour[0][0]);
  if (isArray(contour[0]) && typeof contour[0][0] === 'number') {
    for (i = 0, len = contour.length; i < len; i++) {
      edges.push(new Edge(contour[i], contour[(i + 1) % len]));
    }
  } else {
    var processed = [];
    for (i = 0, len = contour.length; i < len; i++) {
      this._processContour(contour[i], processed);
    }
    edges.push(processed);
  }
};


/**
 * @param  {Number} arcSegments
 * @return {Offset}
 */
Offset.prototype.arcSegments = function(arcSegments) {
  this._arcSegments = arcSegments;
  return this;
};


/**
 * Validates if the first and last points repeat
 * TODO: check CCW
 *
 * @param  {Array.<Object>} vertices
 */
Offset.prototype.validate = function(vertices) {
  var len = vertices.length;
  if (typeof vertices[0] === 'number') return [vertices];
  if (vertices[0][0] === vertices[len - 1][0] &&
    vertices[0][1] === vertices[len - 1][1]) {
    if (len > 1) {
      vertices = vertices.slice(0, len - 1);
      this._closed = true;
    }
  }
  return vertices;
};


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
Offset.prototype.createArc = function(vertices, center, radius, startVertex,
    endVertex, segments, outwards) {

  var PI2 = Math.PI * 2,
      startAngle = atan2(startVertex[1] - center[1], startVertex[0] - center[0]),
      endAngle = atan2(endVertex[1] - center[1], endVertex[0] - center[0]);

  // odd number please
  if (segments % 2 === 0) {
    segments -= 1;
  }

  if (startAngle < 0) {
    startAngle += PI2;
  }

  if (endAngle < 0) {
    endAngle += PI2;
  }

  var angle = ((startAngle > endAngle) ?
               (startAngle - endAngle) :
               (startAngle + PI2 - endAngle)),
      segmentAngle = ((outwards) ? -angle : PI2 - angle) / segments;

  vertices.push(startVertex);
  for (var i = 1; i < segments; ++i) {
    angle = startAngle + segmentAngle * i;
    vertices.push([
      center[0] + Math.cos(angle) * radius,
      center[1] + Math.sin(angle) * radius
    ]);
  }
  vertices.push(endVertex);
  return vertices;
};


/**
 * @param  {Number}  dist
 * @param  {String=} units
 * @return {Offset}
 */
Offset.prototype.distance = function(dist, units) {
  this._distance = dist || 0;
  return this;
};


/**
 * @static
 * @param  {Number}  degrees
 * @param  {String=} units
 * @return {Number}
 */
Offset.degreesToUnits = function(degrees, units) {
  switch (units) {
    case 'miles':
      degrees = degrees / 69.047;
    break;
    case 'feet':
      degrees = degrees / 364568.0;
      break;
    case 'kilometers':
      degrees = degrees / 111.12;
      break;
    case 'meters':
    case 'metres':
      degrees = degrees / 111120.0;
      break;
    case 'degrees':
    case 'pixels':
    default:
      break;
  }
  return degrees;
};


/**
 * @param  {Array.<Object>} vertices
 * @return {Array.<Object>}
 */
Offset.prototype.ensureLastPoint = function(vertices) {
  if (this._closed) {
    vertices.push([
      vertices[0][0],
      vertices[0][1]
    ]);
  }
  return vertices;
};


/**
 * Decides by the sign if it's a padding or a margin
 *
 * @param  {Number} dist
 * @return {Array.<Object>}
 */
Offset.prototype.offset = function(dist) {
  this.distance(dist);
  return this._distance === 0 ? this.vertices :
      (this._distance > 0 ? this.margin(this._distance) :
        this.padding(-this._distance));
};


/**
 * @param  {Array.<Array.<Number>>} vertices
 * @param  {Array.<Number>}         pt1
 * @param  {Array.<Number>}         pt2
 * @param  {Number}                 dist
 * @return {Array.<Array.<Number>>}
 */
Offset.prototype._offsetSegment = function(vertices, pt1, pt2, dist) {
  var edges = [new Edge(pt1, pt2), new Edge(pt2, pt1)];
  var i, len = 2;

  var offsets = [];

  for (i = 0; i < len; i++) {
    var edge = edges[i];
    var dx = edge._inNormal[0] * dist;
    var dy = edge._inNormal[1] * dist;

    offsets.push(edge.offset(dx, dy));
  }

  for (i = 0; i < len; i++) {
    var thisEdge = offsets[i],
        prevEdge = offsets[(i + len - 1) % len];
    this.createArc(
                vertices,
                edges[i].current, // p1 or p2
                dist,
                prevEdge.next,
                thisEdge.current,
                this._arcSegments,
                true
            );
  }
  return vertices;
};


Offset.prototype._offsetSegment = function(v1, v2, e1, e2, dist) {
  var vertices = [];
  var edges    = [e1, e2];

  var offsets = [
    e1.offset(e1._inNormal[0] * dist, e1._inNormal[1] * dist),
    e2.offset(e2._inNormal[0] * dist, e2._inNormal[1] * dist)
  ];

  console.log(offsets);

  for (var i = 0, len = 2; i < len; i++) {
    var thisEdge = offsets[i],
        prevEdge = offsets[(i + len - 1) % len];
    this.createArc(
              vertices,
              edges[i].current, // p1 or p2
              dist,
              prevEdge.next,
              thisEdge.current,
              this._arcSegments,
              true
            );
  }

  return vertices;
};


/**
 * @param  {Number} dist
 * @return {Array.<Number>}
 */
Offset.prototype.margin = function(dist) {
  this.distance(dist);

  if (dist === 0) return this.ensureLastPoint(this.vertices);
  if (this.vertices.length === 1 &&
      typeof this.vertices[0] === 'number') { // point
    return this.offsetPoint(this._distance);
  }

  //this.ensureLastPoint(this.vertices);
  return this.offsetLines(this._distance);
  var union = this.offsetLines(this._distance);
  union = martinez.union(union, [this.ensureLastPoint(this.vertices)]);
  return union;
};


/**
 * @param  {Number} dist
 * @return {Array.<Number>}
 */
Offset.prototype.padding = function(dist) {
  this.distance(dist);

  if (this._distance === 0) return this.ensureLastPoint(this.vertices);
  if (this.vertices.length === 1) return this.vertices;

  this.ensureLastPoint(this.vertices);
  var union = this.offsetLines(this._distance);
  var diff = martinez.diff(this.vertices, union);
  return diff;
};


/**
 * Creates margin polygon
 * @param  {Number} dist
 * @return {Array.<Object>}
 */
Offset.prototype.offsetLine = function(dist) {
  this.distance(dist);
  if (this._distance === 0) return this.vertices;

  var vertices = [];
  var union    = [];
  this._closed = true;

  for (var i = 0, len = this.vertices.length - 1; i < len; i++) {
    var segment = this.ensureLastPoint(
        this._offsetSegment([], this.vertices[i], this.vertices[i + 1], this._distance)
    );
    vertices.push(segment);
    union = (i === 0) ? segment : martinez.union(union, segment);
  }

  return this.vertices.length > 2 ? union : [union];
};


Offset.prototype.offsetLines = function(dist) {
  this.distance(dist);
  var union = [];
  if (isArray(this.vertices[0])) {
    for (var i = 0, len = this._edges.length; i < len; i++) {
      union = (i === 0) ?
        this.offsetContour(this.vertices[i], this._edges[i]):
        martinez.union(union, this.offsetContour(this.vertices[i], this._edges[i]));
    }
  } else {
    union = this.offsetContour(this.data, this.edges);
  }
  return union;
};


Offset.prototype.offsetContour = function(curve, edges) {
  console.log('offset contour', curve);
  var union;
  if (isArray(curve[0]) && typeof curve[0][0] === 'number') {
    for (var i = 0, len = curve.length - 1; i < len; i++) {
      var segment = this.ensureLastPoint(
        this._offsetSegment(curve[i], curve[i + 1], edges[i], edges[i + 1], this._distance)
      );
      console.log('segment', segment, union);
      union = (i === 0) ? segment : martinez.union(union, segment);
    }
  } else {
    for (var i = 0, len = curve.length; i < len; i++) {
      union = (i === 0) ?
        this.offsetContour(curve[i], edges[i]) :
        martinez.union(union, this.offsetContour(curve[i], edges[i]));
    }
  }
  return union;
};


/**
 * @param  {Number} distance
 * @return {Array.<Array.<Number>}
 */
Offset.prototype.offsetPoint = function(distance) {
  this.distance(distance);
  var vertices = this._arcSegments * 2;
  var points   = [];
  var center   = this.vertices[0];
  var radius   = this._distance;
  var angle    = 0;

  for (var i = 0; i < vertices - 1; i++) {
    angle += (2 * Math.PI / vertices); // counter-clockwise
    points.push([
      center[0] + (radius * Math.cos(angle)),
      center[1] + (radius * Math.sin(angle))
    ]);
  }

  return points;
};

module.exports = Offset;
