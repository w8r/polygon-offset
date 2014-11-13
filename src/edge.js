"use strict";

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
};

/**
 * Creates outwards normal
 * @return {Object}
 */
Edge.prototype.outwardsNormal = function() {
    var inwards = this.inwardsNormal();
    return {
        x: -inwards.x,
        y: -inwards.y
    };
};

/**
 * Creates inwards normal
 * @return {Object}
 */
Edge.prototype.inwardsNormal = function() {
    var dx = this.next.x - this.current.x,
        dy = this.next.y - this.current.y,
        edgeLength = Math.sqrt(dx * dx + dy * dy);

    return {
        x: -dy / edgeLength,
        y: dx / edgeLength
    };
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

    return new Edge({
        x: current.x + dx,
        y: current.y + dy
    }, {
        x: next.x + dx,
        y: next.y + dy
    });
};

module.exports = Edge;
