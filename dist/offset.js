!function(e){if("object"==typeof exports&&"undefined"!=typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var f;"undefined"!=typeof window?f=window:"undefined"!=typeof global?f=global:"undefined"!=typeof self&&(f=self),f.Offset=e()}}(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(_dereq_,module,exports){
var Polygon = _dereq_('./polygon');

/**
 * Clip driver
 * @api
 * @param  {Array.<Array.<Number>>} polygonA
 * @param  {Array.<Array.<Number>>} polygonB
 * @param  {Boolean}                sourceForwards
 * @param  {Boolean}                clipForwards
 * @return {Array.<Array.<Number>>}
 */
module.exports = function(polygonA, polygonB, eA, eB) {
    var result, source = new Polygon(polygonA),
        clip = new Polygon(polygonB),
        result = source.clip(clip, eA, eB);

    return result;
};

},{"./polygon":4}],2:[function(_dereq_,module,exports){
var clip = _dereq_('./clip');

module.exports = {
    /**
     * @api
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
     * @return {Array.<Array.<Number>>|Array.<Array.<Object>|Null}
     */
    union: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, false, false);
    },

    /**
     * @api
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
     * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
     */
    intersection: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, true, true);
    },

    /**
     * @api
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonA
     * @param  {Array.<Array.<Number>|Array.<Object>} polygonB
     * @return {Array.<Array.<Number>>|Array.<Array.<Object>>|Null}
     */
    diff: function(polygonA, polygonB) {
        return clip(polygonA, polygonB, false, true);
    },

    clip: clip
};

},{"./clip":1}],3:[function(_dereq_,module,exports){
/**
 * Intersection
 * @param {Vertex} s1
 * @param {Vertex} s2
 * @param {Vertex} c1
 * @param {Vertex} c2
 * @constructor
 */
var Intersection = function(s1, s2, c1, c2) {

    /**
     * @type {Number}
     */
    this.x = 0.0;

    /**
     * @type {Number}
     */
    this.y = 0.0;

    /**
     * @type {Number}
     */
    this.toSource = 0.0;

    /**
     * @type {Number}
     */
    this.toClip = 0.0;

    var d = (c2.y - c1.y) * (s2.x - s1.x) - (c2.x - c1.x) * (s2.y - s1.y);

    if (d === 0) {
        return;
    }

    /**
     * @type {Number}
     */
    this.toSource = ((c2.x - c1.x) * (s1.y - c1.y) - (c2.y - c1.y) * (s1.x - c1.x)) / d;

    /**
     * @type {Number}
     */
    this.toClip = ((s2.x - s1.x) * (s1.y - c1.y) - (s2.y - s1.y) * (s1.x - c1.x)) / d;

    if (this.valid()) {
        this.x = s1.x + this.toSource * (s2.x - s1.x);
        this.y = s1.y + this.toSource * (s2.y - s1.y);
    }
};

/**
 * @return {Boolean}
 */
Intersection.prototype.valid = function() {
    return (0 < this.toSource && this.toSource < 1) && (0 < this.toClip && this.toClip < 1);
};

module.exports = Intersection;

},{}],4:[function(_dereq_,module,exports){
var Vertex = _dereq_('./vertex');
var Intersection = _dereq_('./intersection');

/**
 * Polygon representation
 * @param {Array.<Array.<Number>>} p
 * @param {Boolean=}               arrayVertices
 *
 * @constructor
 */
var Polygon = function(p, arrayVertices) {

    /**
     * @type {Vertex}
     */
    this.first = null;

    /**
     * @type {Number}
     */
    this.vertices = 0;

    /**
     * @type {Vertex}
     */
    this._lastUnprocessed = null;

    /**
     * Whether to handle input and output as [x,y] or {x:x,y:y}
     * @type {Boolean}
     */
    this._arrayVertices = (typeof arrayVertices === "undefined") ?
        Array.isArray(p[0]) :
        arrayVertices;

    for (var i = 0, len = p.length; i < len; i++) {
        this.addVertex(new Vertex(p[i]));
    }
};

/**
 * Add a vertex object to the polygon
 * (vertex is added at the 'end' of the list')
 *
 * @param vertex
 */
Polygon.prototype.addVertex = function(vertex) {
    if (this.first == null) {
        this.first = vertex;
        this.first.next = vertex;
        this.first.prev = vertex;
    } else {
        var next = this.first,
            prev = next.prev;

        next.prev = vertex;
        vertex.next = next;
        vertex.prev = prev;
        prev.next = vertex;
    }
    this.vertices++;
};

/**
 * Inserts a vertex inbetween start and end
 *
 * @param {Vertex} vertex
 * @param {Vertex} start
 * @param {Vertex} end
 */
Polygon.prototype.insertVertex = function(vertex, start, end) {
    var prev, curr = start;

    while (!curr.equals(end) && curr._distance < vertex._distance) {
        curr = curr.next;
    }

    vertex.next = curr;
    prev = curr.prev;

    vertex.prev = prev;
    prev.next = vertex;
    curr.prev = vertex;

    this.vertices++;
};

/**
 * Get next non-intersection point
 * @param  {Vertex} v
 * @return {Vertex}
 */
Polygon.prototype.getNext = function(v) {
    var c = v;
    while (c._isIntersection) {
        c = c.next;
    }
    return c;
};

/**
 * Unvisited intersection
 * @return {Vertex}
 */
Polygon.prototype.getFirstIntersect = function() {
    var v = this._firstIntersect || this.first;

    do {
        if (v._isIntersection && !v._visited) {
            break;
        }

        v = v.next;
    } while (!v.equals(this.first));

    this._firstIntersect = v;
    return v;
};

/**
 * Does the polygon have unvisited vertices
 * @return {Boolean} [description]
 */
Polygon.prototype.hasUnprocessed = function() {
    var v = this._lastUnprocessed || this.first;
    do {
        if (v._isIntersection && !v._visited) {
            this._lastUnprocessed = v;
            return true;
        }

        v = v.next;
    } while (!v.equals(this.first));

    this._lastUnprocessed = null;
    return false;
};

/**
 * The output depends on what you put in, arrays or objects
 * @return {Array.<Array<Number>|Array.<Object>}
 */
Polygon.prototype.getPoints = function() {
    var points = [],
        v = this.first;

    if (this._arrayVertices) {
        do {
            points.push([v.x, v.y]);
            v = v.next;
        } while (v !== this.first);
    } else {
        do {
            points.push({
                x: v.x,
                y: v.y
            });
            v = v.next;
        } while (v !== this.first);
    }

    return points;
};

/**
 * Clip polygon against another one.
 * Result depends on algorithm direction:
 *
 * Intersection: forwards forwards
 * Union:        backwars backwards
 * Diff:         backwards forwards
 *
 * @param {Polygon} clip
 * @param {Boolean} sourceForwards
 * @param {Boolean} clipForwards
 */
Polygon.prototype.clip = function(clip, sourceForwards, clipForwards) {
    var sourceVertex = this.first,
        clipVertex = clip.first,
        sourceInClip, clipInSource;

    // calculate and mark intersections
    do {
        if (!sourceVertex._isIntersection) {
            do {
                if (!clipVertex._isIntersection) {
                    var i = new Intersection(
                        sourceVertex,
                        this.getNext(sourceVertex.next),
                        clipVertex, clip.getNext(clipVertex.next));

                    if (i.valid()) {
                        var sourceIntersection =
                            Vertex.createIntersection(i.x, i.y, i.toSource),
                            clipIntersection =
                            Vertex.createIntersection(i.x, i.y, i.toClip);

                        sourceIntersection._corresponding = clipIntersection;
                        clipIntersection._corresponding = sourceIntersection;

                        this.insertVertex(
                            sourceIntersection,
                            sourceVertex,
                            this.getNext(sourceVertex.next));
                        clip.insertVertex(
                            clipIntersection,
                            clipVertex,
                            clip.getNext(clipVertex.next));
                    }
                }
                clipVertex = clipVertex.next;
            } while (!clipVertex.equals(clip.first));
        }

        sourceVertex = sourceVertex.next;
    } while (!sourceVertex.equals(this.first));

    // phase two - identify entry/exit points
    sourceVertex = this.first;
    clipVertex = clip.first;

    sourceInClip = sourceVertex.isInside(clip);
    clipInSource = clipVertex.isInside(this);

    sourceForwards ^= sourceInClip;
    clipForwards ^= clipInSource;

    do {
        if (sourceVertex._isIntersection) {
            sourceVertex._isEntry = sourceForwards;
            sourceForwards = !sourceForwards;
        }
        sourceVertex = sourceVertex.next;
    } while (!sourceVertex.equals(this.first));

    do {
        if (clipVertex._isIntersection) {
            clipVertex._isEntry = clipForwards;
            clipForwards = !clipForwards;
        }
        clipVertex = clipVertex.next;
    } while (!clipVertex.equals(clip.first));

    // phase three - construct a list of clipped polygons
    var list = [];

    while (this.hasUnprocessed()) {
        var current = this.getFirstIntersect(),
            // keep format
            clipped = new Polygon([], this._arrayVertices);

        clipped.addVertex(new Vertex(current.x, current.y));
        do {
            current.visit();
            if (current._isEntry) {
                do {
                    current = current.next;
                    clipped.addVertex(new Vertex(current.x, current.y));
                } while (!current._isIntersection);

            } else {
                do {
                    current = current.prev;
                    clipped.addVertex(new Vertex(current.x, current.y));
                } while (!current._isIntersection);
            }
            current = current._corresponding;
        } while (!current._visited);

        list.push(clipped.getPoints());
    }

    if (list.length === 0) {
        if (sourceInClip) {
            list.push(this.getPoints());
        }
        if (clipInSource) {
            list.push(clip.getPoints());
        }
        if (list.length === 0) {
            list = null;
        }
    }

    return list;
};

module.exports = Polygon;

},{"./intersection":3,"./vertex":5}],5:[function(_dereq_,module,exports){
/**
 * Vertex representation
 *
 * @param {Number|Array.<Number>} x
 * @param {Number=}               y
 *
 * @constructor
 */
var Vertex = function(x, y) {

    if (arguments.length === 1) {
        // Coords
        if (Array.isArray(x)) {
            y = x[1];
            x = x[0];
        } else {
            y = x.y;
            x = x.x;
        }
    }

    /**
     * X coordinate
     * @type {Number}
     */
    this.x = x;

    /**
     * Y coordinate
     * @type {Number}
     */
    this.y = y;

    /**
     * Next node
     * @type {Vertex}
     */
    this.next = null;

    /**
     * Previous vertex
     * @type {Vertex}
     */
    this.prev = null;

    /**
     * Corresponding intersection in other polygon
     */
    this._corresponding = null;

    /**
     * Distance from previous
     */
    this._distance = 0.0;

    /**
     * Entry/exit point in another polygon
     * @type {Boolean}
     */
    this._isEntry = true;

    /**
     * Intersection vertex flag
     * @type {Boolean}
     */
    this._isIntersection = false;

    /**
     * Loop check
     * @type {Boolean}
     */
    this._visited = false;
};

/**
 * Creates intersection vertex
 * @param  {Number} x
 * @param  {Number} y
 * @param  {Number} distance
 * @return {Vertex}
 */
Vertex.createIntersection = function(x, y, distance) {
    var vertex = new Vertex(x, y);
    vertex._distance = distance;
    vertex._isIntersection = true;
    vertex._isEntry = false;
    return vertex;
};

/**
 * Mark as visited
 */
Vertex.prototype.visit = function() {
    this._visited = true;
    if (this._corresponding !== null && !this._corresponding._visited) {
        this._corresponding.visit();
    }
};

/**
 * Convenience
 * @param  {Vertex}  v
 * @return {Boolean}
 */
Vertex.prototype.equals = function(v) {
    return this.x === v.x && this.y === v.y;
};

/**
 * Check if vertex is inside a polygon by odd-even rule:
 * If the number of intersections of a ray out of the point and polygon
 * segments is odd - the point is inside.
 * @param {Polygon} poly
 * @return {Boolean}
 */
Vertex.prototype.isInside = function(poly) {
    var oddNodes = false,
        vertex = poly.first,
        next = vertex.next,
        x = this.x,
        y = this.y;

    do {
        if ((vertex.y < y && next.y >= y ||
                next.y < y && vertex.y >= y) &&
            (vertex.x <= x || next.x <= x)) {

            oddNodes ^= (vertex.x + (y - vertex.y) /
                (next.y - vertex.y) * (next.x - vertex.x) < x);
        }

        vertex = vertex.next;
        next = vertex.next || poly.first;
    } while (!vertex.equals(poly.first));

    return oddNodes;
};

module.exports = Vertex;

},{}],6:[function(_dereq_,module,exports){
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

},{}],7:[function(_dereq_,module,exports){
"use strict";

/**
 * Vector intersection, if present
 *
 * @param  {Object} A0
 * @param  {Object} A1
 * @param  {Object} B0
 * @param  {Object} B1
 *
 * @return {Object|null}
 */
module.exports = function intersection(A0, A1, B0, B1) {
    var den = (B1[1] - B0[1]) * (A1[0] - A0[0]) -
        (B1[0] - B0[0]) * (A1[1] - A0[1]);

    // lines are parallel or conincident
    if (den == 0) {
        return null;
    }

    var ua = ((B1[0] - B0[0]) * (A0[1] - B0[1]) -
        (B1[1] - B0[1]) * (A0[0] - B0[0])) / den;

    var ub = ((A1[0] - A0[0]) * (A0[1] - B0[1]) -
        (A1[1] - A0[1]) * (A0[0] - B0[0])) / den;

    if (ua < 0 || ub < 0 || ua > 1 || ub > 1) {
        return null;
    }

    return [
        A0[0] + ua * (A1[0] - A0[0]),
        A0[1] + ua * (A1[1] - A0[1])
    ];
};

},{}],8:[function(_dereq_,module,exports){
var GreinerHormann = _dereq_('greiner-hormann');
var Edge = _dereq_('./edge');
var intersection = _dereq_('./intersection');

"use strict";

var min = Math.min,
    max = Math.max,
    atan2 = Math.atan2;

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
    this._arcSegments = arcSegments || 5;
};

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
};

/**
 * Create padding polygon
 *
 * @param  {Number} distance
 * @return {Array.<Number>}
 */
Offset.prototype.padding = function(dist) {
    var offsetEdges = [],
        vertices = [],
        i, len, union;

    for (i = 0, len = this.edges.length; i < len; i++) {
        var edge = this.edges[i],
            dx = edge._outNormal[0] * dist,
            dy = edge._outNormal[1] * dist;
        offsetEdges.push(edge.offset(dx, dy));
    }

    for (i = 0, len = offsetEdges.length; i < len; i++) {
        var thisEdge = offsetEdges[i],
            prevEdge = offsetEdges[(i + len - 1) % len],
            vertex = intersection(
                prevEdge.current,
                prevEdge.next,
                thisEdge.current,
                thisEdge.next);

        if (vertex)
            vertices.push(vertex);
        else {
            this.createArc(
                vertices,
                this.edges[i].current,
                dist,
                prevEdge.next,
                thisEdge.current,
                this._arcSegments,
                false);
        }
    }
    union = GreinerHormann.union(vertices, vertices);
    vertices = union ? union[0] : vertices;

    vertices = this.ensureLastPoint(vertices);
    return vertices;
};

/**
 * Creates margin polygon
 * @param  {Number} dist
 * @return {Array.<Object>}
 */
Offset.prototype.margin = function(dist) {
    var offsetEdges = [],
        vertices = [],
        i, len, union;
    for (i = 0, len = this.edges.length; i < len; i++) {
        var edge = this.edges[i],
            dx = edge._inNormal[0] * dist,
            dy = edge._inNormal[1] * dist;

        offsetEdges.push(edge.offset(dx, dy));
    }

    for (i = 0, len = offsetEdges.length; i < len; i++) {
        var thisEdge = offsetEdges[i],
            prevEdge = offsetEdges[(i + len - 1) % len],
            vertex = intersection(
                prevEdge.current,
                prevEdge.next,
                thisEdge.current,
                thisEdge.next
            );

        if (vertex) {
            vertices.push(vertex);
        } else {
            this.createArc(
                vertices,
                this.edges[i].current,
                dist,
                prevEdge.next,
                thisEdge.current,
                this._arcSegments,
                true
            );
        }
    }

    union = GreinerHormann.union(vertices, vertices);
    if (union) {
        union = union[0];
        // that's the toll
        vertices = union.slice(0, union.length / 2);
    }

    vertices = this.ensureLastPoint(vertices);
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
    return dist === 0 ?
        this.vertices :
        (dist > 0 ? this.margin(dist) : this.padding(-dist));
};

module.exports = Offset;

},{"./edge":6,"./intersection":7,"greiner-hormann":2}]},{},[8])
(8)
});