import Edge from './edge';
import martinez from 'martinez-polygon-clipping';
import {
  isArray,
  equals,
  orientRings,
  offsetSegment,
  ensureLastPoint
} from './utils';

/**
 * Offset builder
 *
 * @param {Array.<Object>=} vertices
 * @param {Number=}        arcSegments
 */
export default class Offset {
  constructor(vertices, arcSegments = 5) {
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
  data(vertices) {
    this._edges = [];
    if (!isArray(vertices)) {
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
  _processContour(contour, edges) {
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
  }

  /**
   * @param  {Number} arcSegments
   * @return {Offset}
   */
  arcSegments(arcSegments) {
    this._arcSegments = arcSegments;
    return this;
  }

  /**
   * Validates if the first and last points repeat
   * TODO: check CCW
   *
   * @param  {Array.<Object>} vertices
   */
  validate(vertices) {
    const len = vertices.length;
    if (typeof vertices[0] === 'number') return [vertices];
    if (
      vertices[0][0] === vertices[len - 1][0] &&
      vertices[0][1] === vertices[len - 1][1]
    ) {
      if (len > 1) {
        vertices = vertices.slice(0, len - 1);
        this._closed = true;
      }
    }
    return vertices;
  }

  /**
   * @param  {Number}  dist
   * @param  {String=} units
   * @return {Offset}
   */
  distance(dist, units) {
    this._distance = dist || 0;
    return this;
  }

  /**
   * Decides by the sign if it's a padding or a margin
   *
   * @param  {Number} dist
   * @return {Array.<Object>}
   */
  offset(dist) {
    this.distance(dist);
    return this._distance === 0
      ? this.vertices
      : this._distance > 0
        ? this.margin(this._distance)
        : this.padding(-this._distance);
  }

  /**
   * @param  {Number} dist
   * @return {Array.<Number>}
   */
  margin(dist) {
    this.distance(dist);

    if (typeof this.vertices[0] === 'number') {
      // point
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
  padding(dist) {
    this.distance(dist);

    if (this._distance === 0) return ensureLastPoint(this.vertices);
    if (this.vertices.length === 2 && typeof this.vertices[0] === 'number') {
      return this.vertices;
    }

    const union = this.offsetLines(this._distance);
    const diff = martinez.diff(this.vertices, union);
    return orientRings(diff);
  }

  /**
   * Creates margin polygon
   * @param  {Number} dist
   * @return {Array.<Object>}
   */
  offsetLine(dist) {
    if (dist === 0) return this.vertices;
    return orientRings(this.offsetLines(dist));
  }

  /**
   * Just offsets lines, no fill
   * @param  {Number} dist
   * @return {Array.<Array.<Array.<Number>>>}
   */
  offsetLines(dist) {
    if (dist < 0) throw new Error('Cannot apply negative margin to the line');
    let union;
    this.distance(dist);
    if (isArray(this.vertices[0]) && typeof this.vertices[0][0] !== 'number') {
      for (let i = 0, len = this._edges.length; i < len; i++) {
        union =
          i === 0
            ? this.offsetContour(this.vertices[i], this._edges[i])
            : martinez.union(
              union,
              this.offsetContour(this.vertices[i], this._edges[i])
            );
      }
    } else {
      union =
        this.vertices.length === 1
          ? this.offsetPoint()
          : this.offsetContour(this.vertices, this._edges);
    }

    return union;
  }

  /**
   * @param  {Array.<Array.<Number>>|Array.<Array.<...>>} curve
   * @param  {Array.<Edge>|Array.<Array.<...>>} edges
   * @return {Polygon}
   */
  offsetContour(curve, edges) {
    let union, i, len;
    if (isArray(curve[0]) && typeof curve[0][0] === 'number') {
      // we have 1 less edge than vertices
      for (i = 0, len = curve.length - 1; i < len; i++) {
        const segment = ensureLastPoint(
          offsetSegment(
            curve[i],
            curve[i + 1],
            edges[i],
            this._distance,
            this._arcSegments
          )
        );
        union =
          i === 0
            ? [ensureLastPoint(segment)]
            : martinez.union(union, ensureLastPoint(segment));
      }
    } else {
      for (i = 0, len = edges.length; i < len; i++) {
        union =
          i === 0
            ? this.offsetContour(curve[i], edges[i])
            : martinez.union(union, this.offsetContour(curve[i], edges[i]));
      }
    }
    return union;
  }

  /**
   * @param  {Number} distance
   * @return {Array.<Array.<Number>}
   */
  offsetPoint(distance) {
    this.distance(distance);
    let vertices = this._arcSegments * 2;
    const points = [];
    const center = this.vertices;
    const radius = this._distance;
    let angle = 0;

    if (vertices % 2 === 0) vertices++;

    for (let i = 0; i < vertices; i++) {
      angle += (2 * Math.PI) / vertices; // counter-clockwise
      points.push([
        center[0] + radius * Math.cos(angle),
        center[1] + radius * Math.sin(angle)
      ]);
    }

    return orientRings([ensureLastPoint(points)]);
  }
}

Offset.orientRings = orientRings;
