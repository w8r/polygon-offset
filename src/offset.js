import Edge from './edge';
import martinez from 'martinez-polygon-clipping';
import { isArray, equals, orientRings } from './utils';

console.log( martinez.union);

/**
 * Offset builder
 *
 * @param {Array.<Object>=} vertices
 * @param {Number=}        arcSegments
 * @constructor
 */
export default class Offset {

  constructor (vertices, arcSegments = 5) {

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
    this._arcSegments = arcSegments;
  }

  /**
   * Change data set
   * @param  {Array.<Array>} vertices
   * @return {Offset}
   */
  data (vertices) {
    this._edges = [];
    if (!isArray (vertices)) {
      throw new Error('Offset requires at least one coodinate to work with');
    }

    if (isArray(vertices) && typeof vertices[0] === 'number') {
      this.vertices = vertices;
    } else {
      this.vertices = orientRings(vertices);
      this._processContour(this.vertices, this._edges);
    }

    return this;
  }


  /**
   * Recursively process contour to create normals
   * @param  {*} contour
   * @param  {Array} edges
   */
  _processContour (contour, edges) {
    let i, len;
    if (isArray(contour[0]) && typeof contour[0][0] === 'number') {
      len = contour.length;
      if (equals(contour[0], contour[len - 1])) {
        len -= 1; // otherwise we get division by zero in normals
      }
      for (i = 0; i < len; i++) {
        edges.push(new Edge(contour[i], contour[(i + 1) % len]));
      }
    } else {
      for (i = 0, len = contour.length; i < len; i++) {
        edges.push([]);
        this._processContour(contour[i], edges[edges.length - 1]);
      }
    }
  };


  /**
   * @param  {Number} arcSegments
   * @return {Offset}
   */
  arcSegments (arcSegments) {
    this._arcSegments = arcSegments;
    return this;
  }


  /**
   * Validates if the first and last points repeat
   * TODO: check CCW
   *
   * @param  {Array.<Object>} vertices
   */
  validate (vertices) {
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
  createArc (vertices, center, radius, startVertex, endVertex, segments, outwards) {
    const PI2 = Math.PI * 2;
    let startAngle = Math.atan2(startVertex[1] - center[1], startVertex[0] - center[0]);
    let endAngle   = Math.atan2(endVertex[1] - center[1], endVertex[0] - center[0]);

    // odd number please
    if (segments % 2 === 0) segments -= 1;

    if (startAngle < 0) startAngle += PI2;

    if (endAngle < 0) endAngle += PI2;

    let angle = ((startAngle > endAngle) ?
                (startAngle - endAngle) :
                (startAngle + PI2 - endAngle));
    const segmentAngle = ((outwards) ? -angle : PI2 - angle) / segments;

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
  }


  /**
   * @param  {Number}  dist
   * @param  {String=} units
   * @return {Offset}
   */
  distance (dist, units) {
    this._distance = dist || 0;
    return this;
  }


  /**
   * @static
   * @param  {Number}  degrees
   * @param  {String=} units
   * @return {Number}
   */
  static degreesToUnits (degrees, units) {
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
  }


  /**
   * @param  {Array.<Object>} vertices
   * @return {Array.<Object>}
   */
  ensureLastPoint (vertices) {
    if (!equals(vertices[0], vertices[vertices.length - 1])) {
      vertices.push([
        vertices[0][0],
        vertices[0][1]
      ]);
    }
    return vertices;
  }


  /**
   * Decides by the sign if it's a padding or a margin
   *
   * @param  {Number} dist
   * @return {Array.<Object>}
   */
  offset (dist) {
    this.distance(dist);
    return this._distance === 0 ? this.vertices :
        (this._distance > 0 ? this.margin(this._distance) :
          this.padding(-this._distance));
  }


  /**
   * @param  {Array.<Array.<Number>>} vertices
   * @param  {Array.<Number>}         pt1
   * @param  {Array.<Number>}         pt2
   * @param  {Number}                 dist
   * @return {Array.<Array.<Number>>}
   */
  _offsetSegment (v1, v2, e1, dist) {
    const vertices = [];
    const offsets = [
      e1.offset(e1._inNormal[0] * dist, e1._inNormal[1] * dist),
      e1.inverseOffset(e1._outNormal[0] * dist, e1._outNormal[1] * dist)
    ];

    for (let i = 0, len = 2; i < len; i++) {
      const thisEdge = offsets[i];
      const prevEdge = offsets[(i + len - 1) % len];
      this.createArc(
                vertices,
                i === 0 ? v1 : v2, // edges[i].current, // p1 or p2
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
  margin (dist) {
    this.distance(dist);

    if (typeof this.vertices[0] === 'number') { // point
      return this.offsetPoint(this._distance);
    }

    if (dist === 0) return this.vertices;

    let union = this.offsetLines(this._distance);
    //return union;
    union = martinez.union(this.vertices, union);
    return orientRings(union);
  }


  /**
   * @param  {Number} dist
   * @return {Array.<Number>}
   */
  padding (dist) {
    this.distance(dist);

    if (this._distance === 0) return this.ensureLastPoint(this.vertices);
    if (this.vertices.length === 2 && typeof this.vertices[0] === 'number') {
      return this.vertices;
    }

    const union = this.offsetLines(this._distance);
    const diff = martinez.diff(this.vertices, union);
    return orientRings(diff);
  };


  /**
   * Creates margin polygon
   * @param  {Number} dist
   * @return {Array.<Object>}
   */
  offsetLine (dist) {
    if (dist === 0) return this.vertices;
    return orientRings(this.offsetLines(dist));
  }


  /**
   * Just offsets lines, no fill
   * @param  {Number} dist
   * @return {Array.<Array.<Array.<Number>>>}
   */
  offsetLines (dist) {
    if (dist < 0) throw new Error('Cannot apply negative margin to the line');
    let union;
    this.distance(dist);
    if (isArray(this.vertices[0]) && typeof this.vertices[0][0] !== 'number') {
      for (let i = 0, len = this._edges.length; i < len; i++) {
        union = (i === 0) ?
          this.offsetContour(this.vertices[i], this._edges[i]):
          martinez.union(union, this.offsetContour(this.vertices[i], this._edges[i]));
      }
    } else {
      union = (this.vertices.length === 1) ?
        this.offsetPoint() :
        this.offsetContour(this.vertices, this._edges);
    }

    return union;
  }


  /**
   * @param  {Array.<Array.<Number>>|Array.<Array.<...>>} curve
   * @param  {Array.<Edge>|Array.<Array.<...>>} edges
   * @return {Polygon}
   */
  offsetContour (curve, edges) {
    let union, i, len;
    if (isArray(curve[0]) && typeof curve[0][0] === 'number') {
      // we have 1 less edge than vertices
      for (i = 0, len = curve.length - 1; i < len; i++) {
        var segment = this.ensureLastPoint(
          this._offsetSegment(curve[i], curve[i + 1], edges[i], this._distance)
        );
        union = (i === 0) ?
                  [this.ensureLastPoint(segment)] :
          martinez.union(union, this.ensureLastPoint(segment));
      }
    } else {
      for (i = 0, len = edges.length; i < len; i++) {
        union = (i === 0) ?
          this.offsetContour(curve[i], edges[i]) :
          martinez.union(union, this.offsetContour(curve[i], edges[i]));
      }
    }
    return union;
  }


  /**
   * @param  {Number} distance
   * @return {Array.<Array.<Number>}
   */
  offsetPoint (distance) {
    this.distance(distance);
    let vertices = this._arcSegments * 2;
    const points   = [];
    const center   = this.vertices;
    const radius   = this._distance;
    let angle      = 0;

    if (vertices % 2 === 0) vertices++;

    for (var i = 0; i < vertices; i++) {
      angle += (2 * Math.PI / vertices); // counter-clockwise
      points.push([
        center[0] + (radius * Math.cos(angle)),
        center[1] + (radius * Math.sin(angle))
      ]);
    }

    return orientRings([this.ensureLastPoint(points)]);
  }
}

Offset.orientRings = orientRings;
