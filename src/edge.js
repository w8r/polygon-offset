const invert = ([a, b]) => [-a, -b];

/**
 * Offset edge of the polygon
 *
 * @param  {Object} current
 * @param  {Object} next
 */
export default class Edge {

  constructor (current, next) {

    /**
     * @type {Object}
     */
    this.current = current;

    /**
     * @type {Object}
     */
    this.next = next;

    /**
     * @type {Object}
     */
    this.inNormal  = this.inwardsNormal();

    /**
     * @type {Object}
     */
    this.outNormal = invert(this.inNormal);
  }

  /**
   * Creates inwards normal
   * @return {Object}
   */
  inwardsNormal () {
    const dx = this.next[0] - this.current[0];
    const dy = this.next[1] - this.current[1];
    const edgeLength = Math.sqrt(dx * dx + dy * dy);

    if (edgeLength === 0) throw new Error('Vertices overlap');

    return [
      -dy / edgeLength,
      dx / edgeLength
    ];
  }

  /**
   * Offsets the edge by dx, dy
   * @param  {Number} dx
   * @param  {Number} dy
   * @return {Edge}
   */
  offset (dx, dy) {
    return offsetEdge(this.current, this.next, dx, dy);
  }


  /**
   * @param  {Number} dx
   * @param  {Number} dy
   * @return {Edge}
   */
  inverseOffset (dx, dy) {
    return offsetEdge(this.next, this.current, dx, dy);
  }


  /**
   * @return {Edge}
   */
  inverse () {
    return new Edge(this.next, this.current);
  }
}


const offsetEdge = (current, next, dx, dy) => new Edge([
    current[0] + dx,
    current[1] + dy
  ], [
    next[0] + dx,
    next[1] + dy
  ]);
