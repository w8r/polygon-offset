/**
 * Offset edge of the polygon
 *
 * @param  {Object} current
 * @param  {Object} next
 * @cosntructor
 */
function Edge(current, next) {

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
  this._inNormal = this.inwardsNormal();

  /**
   * @type {Object}
   */
  this._outNormal = this.outwardsNormal();
}

/**
 * Creates outwards normal
 * @return {Object}
 */
Edge.prototype.outwardsNormal = function() {
  var inwards = this.inwardsNormal();
  return [
    -inwards[0],
    -inwards[1]
  ];
};

/**
 * Creates inwards normal
 * @return {Object}
 */
Edge.prototype.inwardsNormal = function() {
  var dx = this.next[0] - this.current[0],
      dy = this.next[1] - this.current[1],
      edgeLength = Math.sqrt(dx * dx + dy * dy);

  return [
    -dy / edgeLength,
     dx / edgeLength
  ];
};

/**
 * Offsets the edge by dx, dy
 * @param  {Number} dx
 * @param  {Number} dy
 * @return {Edge}
 */
Edge.prototype.offset = function(dx, dy) {
  var current = this.current,
      next = this.next;

  return new Edge([
    current[0] + dx,
    current[1] + dy
  ], [
    next[0] + dx,
    next[1] + dy
  ]);
};

module.exports = Edge;
