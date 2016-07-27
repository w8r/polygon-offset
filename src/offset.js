var Edge = require('./edge');
var martinez = global.martinez = require('martinez-polygon-clipping');

var atan2 = Math.atan2;

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

  var edges = [];
  for (var i = 0, len = vertices.length; i < len; i++) {
    edges.push(new Edge(vertices[i], vertices[(i + 1) % len]));
  }

  this.vertices = vertices;
  this.edges = edges;
  return this;
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
  if (vertices[0][0] === vertices[len - 1][0] &&
    vertices[0][1] === vertices[len - 1][1]) {
    vertices = vertices.slice(0, len - 1);
    this._closed = true;
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
  return dist === 0 ? this.vertices :
      (dist > 0 ? this.margin(dist) : this.padding(-dist));
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


/**
 * @param  {Number} dist
 * @return {Array.<Number>}
 */
Offset.prototype.margin = function(dist) {
  if (dist === 0) return this.ensureLastPoint(this.vertices);

  this.ensureLastPoint(this.vertices);
  var union = this.offsetLine(dist);
  union = martinez.union(union, [this.ensureLastPoint(this.vertices)]);
  return union;
};


/**
 * @param  {Number} dist
 * @return {Array.<Number>}
 */
Offset.prototype.padding = function(dist) {
  if (dist === 0) return this.ensureLastPoint(this.vertices);

  this.ensureLastPoint(this.vertices);
  var union = this.offsetLine(dist);
  var diff = martinez.diff(this.vertices, union);
  return diff;
};


/**
 * Creates margin polygon
 * @param  {Number} dist
 * @return {Array.<Object>}
 */
Offset.prototype.offsetLine = function(dist) {
  if (dist === 0) return this.vertices;

  var vertices = [];
  var union    = [];
  this._closed = true;

  for (var i = 0, len = this.vertices.length - 1; i < len; i++) {
    var segment = this.ensureLastPoint(
        this._offsetSegment([], this.vertices[i], this.vertices[i + 1], dist)
    );
    vertices.push(segment);
    union = (i === 0) ? segment : martinez.union(union, segment);
  }

  return this.vertices.length > 2 ? union : [union];
};

module.exports = Offset;
