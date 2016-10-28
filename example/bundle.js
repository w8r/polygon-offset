(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Offset = global.Offset = require('../src/offset');
require('./leaflet_multipolygon');
require('./polygon_control');
var OffsetControl = require('./offset_control');
var data = require('../test/fixtures/demo.json');
var project = require('geojson-project');

var arcSegments = 5;

var style = {
        weight: 3,
        color: '#48f',
        opacity: 0.8,
        dashArray: [2, 4]
    },
    marginStyle = {
        weight: 2,
        color: '#276D8F'
    },
    paddingStyle = {
        weight: 2,
        color: '#D81706'
    },
    center = [22.2670, 114.188],
    zoom = 17,
    map, vertices, result;

map = global.map = L.map('map', {
  editable: true,
  maxZoom: 22
}).setView(center, zoom);


map.addControl(new L.NewPolygonControl({
  callback: map.editTools.startPolygon
}));

map.addControl(new L.NewLineControl({
  callback: map.editTools.startPolyline
}));

map.addControl(new L.NewPointControl({
  callback: map.editTools.startMarker
}));

var layers = global.layers = L.geoJson(data).addTo(map);
var results = global.results = L.geoJson(null, {
  style: function(feature) {
    return marginStyle;
  }
}).addTo(map);
map.fitBounds(layers.getBounds(), { animate: false });

map.addControl(new OffsetControl({
  clear: function() {
    layers.clearLayers();
  },
  callback: run
}));

map.on('editable:created', function(evt) {
  layers.addLayer(evt.layer);
  evt.layer.on('click', function(e) {
    if ((e.originalEvent.ctrlKey || e.originalEvent.metaKey) && this.editEnabled()) {
      this.editor.newHole(e.latlng);
    }
  });
});

function run (margin) {
  results.clearLayers();
  layers.eachLayer(function(layer) {
    var gj = layer.toGeoJSON();
    console.log(gj, margin);
    var shape = project(gj, function(coord) {
      var pt = map.options.crs.latLngToPoint(L.latLng(coord.slice().reverse()), map.getZoom());
      return [pt.x, pt.y];
    });

    var margined;
    console.log(gj.geometry.type);
    if (gj.geometry.type === 'LineString') {
      if (margin < 0) return;
      var res = new Offset(shape.geometry.coordinates)
        .arcSegments(arcSegments)
        .offsetLine(margin);

      margined = {
        type: 'Feature',
        geometry: {
          type: margin === 0 ? 'LineString' : 'Polygon',
          coordinates: res
        }
      };
    } else if (gj.geometry.type === 'Point') {
      var res = new Offset(shape.geometry.coordinates)
        .arcSegments(arcSegments)
        .offset(margin);

      margined = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: res
        }
      };
    } else {
      var res = new Offset(shape.geometry.coordinates).offset(margin);
      margined = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: res
        }
      };
    }

    console.log('margined', margined);
    results.addData(project(margined, function(pt) {
      var ll = map.options.crs.pointToLatLng(L.point(pt.slice()), map.getZoom());
      return [ll.lng, ll.lat];
    }));
  });
}

run (20);

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{"../src/offset":21,"../test/fixtures/demo.json":23,"./leaflet_multipolygon":2,"./offset_control":3,"./polygon_control":4,"geojson-project":9}],2:[function(require,module,exports){
L.Polygon.prototype._projectLatlngs = function (latlngs, result, projectedBounds, isHole) {
  var flat = latlngs[0] instanceof L.LatLng,
      len = latlngs.length,
      i, ring, area;

  if (flat) {
    area = 0;
    ring = [];
    for (i = 0; i < len; i++) {
      ring[i] = this._map.latLngToLayerPoint(latlngs[i]);
      projectedBounds.extend(ring[i]);

      if (i) {
        area += ring[i - 1].x * ring[i].y;
        area -= ring[i].x * ring[i - 1].y;
      }
    }
    area += ring[len - 1].x * ring[0].y;
    area -= ring[0].x * ring[len - 1].y;

    if ((!isHole && area > 0) || (isHole && area < 0)) {
      ring.reverse();
    }

    result.push(ring);
  } else {
    for (i = 0; i < len; i++) {
      this._projectLatlngs(latlngs[i], result, projectedBounds, i !== 0);
    }
  }
};


L.Polygon.prototype._project = function() {
  L.Polyline.prototype._project.call(this);
  if ((this._latlngs.length > 1) &&
    !L.Polyline._flat(this._latlngs) &&
    !(this._latlngs[0][0] instanceof L.LatLng)) {
    if (this.options.fillRule !== 'nonzero') {
      this.setStyle({
        fillRule: 'nonzero'
      });
    }
  }
};
},{}],3:[function(require,module,exports){
module.exports = L.Control.extend({
  options: {
    position: 'topright',
    defaultMargin: 20
  },

  onAdd: function(map) {
    var container = this._container = L.DomUtil.create('div', 'leaflet-bar');
    this._container.style.background = '#ffffff';
    this._container.style.padding = '10px';
    container.innerHTML = [
      '<form>',
        '<div>',
          '<label>',
            '<input type="range" min="0" max="100" value="',  this.options.defaultMargin, '" name="margin">',
          '</label>',
        '</div>',
        '<div>',
          '<label>', '<input type="radio" name="operation" value="1" checked>', ' margin</label>',
          '<label>', '<input type="radio" name="operation" value="-1">', ' padding</label>',
        '</div>', '<br>',
        '<input type="submit" value="Run">', '<input name="clear" type="button" value="Clear layers">',
      '</form>'].join('');

    var form = container.querySelector('form');
    L.DomEvent
      .on(form, 'submit', function (evt) {
        L.DomEvent.stop(evt);
        var margin = parseFloat(form['margin'].value);
        var radios = Array.prototype.slice.call(
          form.querySelectorAll('input[type=radio]'));
        var k = 1;
        for (var i = 0, len = radios.length; i < len; i++) {
          if (radios[i].checked) {
            k *= parseInt(radios[i].value);
            break;
          }
        }
        this.options.callback(margin * k);
      }, this)
      .on(form['clear'], 'click', function(evt) {
        L.DomEvent.stop(evt);
        this.options.clear();
      }, this);

    L.DomEvent
      .disableClickPropagation(this._container)
      .disableScrollPropagation(this._container);
    return this._container;
  }

});
},{}],4:[function(require,module,exports){
L.EditControl = L.Control.extend({

  options: {
    position: 'topleft',
    callback: null,
    kind: '',
    html: ''
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('div', 'leaflet-control leaflet-bar'),
        link = L.DomUtil.create('a', '', container);

    link.href = '#';
    link.title = 'Create a new ' + this.options.kind;
    link.innerHTML = this.options.html;
    L.DomEvent.on(link, 'click', L.DomEvent.stop)
              .on(link, 'click', function () {
                window.LAYER = this.options.callback.call(map.editTools);
              }, this);

    return container;
  }

});

L.NewPolygonControl = L.EditControl.extend({
  options: {
    position: 'topleft',
    kind: 'polygon',
    html: '&#x2206;'
  }
});

L.NewLineControl = L.EditControl.extend({
  options: {
    position: 'topleft',
    kind: 'polyline',
    html: '/'
  }
});

L.NewPointControl = L.EditControl.extend({
  options: {
    position: 'topleft',
    kind: 'point',
    html: '&#9679;'
  }
});

},{}],5:[function(require,module,exports){
module.exports = {
    RBTree: require('./lib/rbtree'),
    BinTree: require('./lib/bintree')
};

},{"./lib/bintree":6,"./lib/rbtree":7}],6:[function(require,module,exports){

var TreeBase = require('./treebase');

function Node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
}

Node.prototype.get_child = function(dir) {
    return dir ? this.right : this.left;
};

Node.prototype.set_child = function(dir, val) {
    if(dir) {
        this.right = val;
    }
    else {
        this.left = val;
    }
};

function BinTree(comparator) {
    this._root = null;
    this._comparator = comparator;
    this.size = 0;
}

BinTree.prototype = new TreeBase();

// returns true if inserted, false if duplicate
BinTree.prototype.insert = function(data) {
    if(this._root === null) {
        // empty tree
        this._root = new Node(data);
        this.size++;
        return true;
    }

    var dir = 0;

    // setup
    var p = null; // parent
    var node = this._root;

    // search down
    while(true) {
        if(node === null) {
            // insert new node at the bottom
            node = new Node(data);
            p.set_child(dir, node);
            ret = true;
            this.size++;
            return true;
        }

        // stop if found
        if(this._comparator(node.data, data) === 0) {
            return false;
        }

        dir = this._comparator(node.data, data) < 0;

        // update helpers
        p = node;
        node = node.get_child(dir);
    }
};

// returns true if removed, false if not found
BinTree.prototype.remove = function(data) {
    if(this._root === null) {
        return false;
    }

    var head = new Node(undefined); // fake tree root
    var node = head;
    node.right = this._root;
    var p = null; // parent
    var found = null; // found item
    var dir = 1;

    while(node.get_child(dir) !== null) {
        p = node;
        node = node.get_child(dir);
        var cmp = this._comparator(data, node.data);
        dir = cmp > 0;

        if(cmp === 0) {
            found = node;
        }
    }

    if(found !== null) {
        found.data = node.data;
        p.set_child(p.right === node, node.get_child(node.left === null));

        this._root = head.right;
        this.size--;
        return true;
    }
    else {
        return false;
    }
};

module.exports = BinTree;


},{"./treebase":8}],7:[function(require,module,exports){

var TreeBase = require('./treebase');

function Node(data) {
    this.data = data;
    this.left = null;
    this.right = null;
    this.red = true;
}

Node.prototype.get_child = function(dir) {
    return dir ? this.right : this.left;
};

Node.prototype.set_child = function(dir, val) {
    if(dir) {
        this.right = val;
    }
    else {
        this.left = val;
    }
};

function RBTree(comparator) {
    this._root = null;
    this._comparator = comparator;
    this.size = 0;
}

RBTree.prototype = new TreeBase();

// returns true if inserted, false if duplicate
RBTree.prototype.insert = function(data) {
    var ret = false;

    if(this._root === null) {
        // empty tree
        this._root = new Node(data);
        ret = true;
        this.size++;
    }
    else {
        var head = new Node(undefined); // fake tree root

        var dir = 0;
        var last = 0;

        // setup
        var gp = null; // grandparent
        var ggp = head; // grand-grand-parent
        var p = null; // parent
        var node = this._root;
        ggp.right = this._root;

        // search down
        while(true) {
            if(node === null) {
                // insert new node at the bottom
                node = new Node(data);
                p.set_child(dir, node);
                ret = true;
                this.size++;
            }
            else if(is_red(node.left) && is_red(node.right)) {
                // color flip
                node.red = true;
                node.left.red = false;
                node.right.red = false;
            }

            // fix red violation
            if(is_red(node) && is_red(p)) {
                var dir2 = ggp.right === gp;

                if(node === p.get_child(last)) {
                    ggp.set_child(dir2, single_rotate(gp, !last));
                }
                else {
                    ggp.set_child(dir2, double_rotate(gp, !last));
                }
            }

            var cmp = this._comparator(node.data, data);

            // stop if found
            if(cmp === 0) {
                break;
            }

            last = dir;
            dir = cmp < 0;

            // update helpers
            if(gp !== null) {
                ggp = gp;
            }
            gp = p;
            p = node;
            node = node.get_child(dir);
        }

        // update root
        this._root = head.right;
    }

    // make root black
    this._root.red = false;

    return ret;
};

// returns true if removed, false if not found
RBTree.prototype.remove = function(data) {
    if(this._root === null) {
        return false;
    }

    var head = new Node(undefined); // fake tree root
    var node = head;
    node.right = this._root;
    var p = null; // parent
    var gp = null; // grand parent
    var found = null; // found item
    var dir = 1;

    while(node.get_child(dir) !== null) {
        var last = dir;

        // update helpers
        gp = p;
        p = node;
        node = node.get_child(dir);

        var cmp = this._comparator(data, node.data);

        dir = cmp > 0;

        // save found node
        if(cmp === 0) {
            found = node;
        }

        // push the red node down
        if(!is_red(node) && !is_red(node.get_child(dir))) {
            if(is_red(node.get_child(!dir))) {
                var sr = single_rotate(node, dir);
                p.set_child(last, sr);
                p = sr;
            }
            else if(!is_red(node.get_child(!dir))) {
                var sibling = p.get_child(!last);
                if(sibling !== null) {
                    if(!is_red(sibling.get_child(!last)) && !is_red(sibling.get_child(last))) {
                        // color flip
                        p.red = false;
                        sibling.red = true;
                        node.red = true;
                    }
                    else {
                        var dir2 = gp.right === p;

                        if(is_red(sibling.get_child(last))) {
                            gp.set_child(dir2, double_rotate(p, last));
                        }
                        else if(is_red(sibling.get_child(!last))) {
                            gp.set_child(dir2, single_rotate(p, last));
                        }

                        // ensure correct coloring
                        var gpc = gp.get_child(dir2);
                        gpc.red = true;
                        node.red = true;
                        gpc.left.red = false;
                        gpc.right.red = false;
                    }
                }
            }
        }
    }

    // replace and remove if found
    if(found !== null) {
        found.data = node.data;
        p.set_child(p.right === node, node.get_child(node.left === null));
        this.size--;
    }

    // update root and make it black
    this._root = head.right;
    if(this._root !== null) {
        this._root.red = false;
    }

    return found !== null;
};

function is_red(node) {
    return node !== null && node.red;
}

function single_rotate(root, dir) {
    var save = root.get_child(!dir);

    root.set_child(!dir, save.get_child(dir));
    save.set_child(dir, root);

    root.red = true;
    save.red = false;

    return save;
}

function double_rotate(root, dir) {
    root.set_child(!dir, single_rotate(root.get_child(!dir), !dir));
    return single_rotate(root, dir);
}

module.exports = RBTree;

},{"./treebase":8}],8:[function(require,module,exports){

function TreeBase() {}

// removes all nodes from the tree
TreeBase.prototype.clear = function() {
    this._root = null;
    this.size = 0;
};

// returns node data if found, null otherwise
TreeBase.prototype.find = function(data) {
    var res = this._root;

    while(res !== null) {
        var c = this._comparator(data, res.data);
        if(c === 0) {
            return res.data;
        }
        else {
            res = res.get_child(c > 0);
        }
    }

    return null;
};

// returns iterator to node if found, null otherwise
TreeBase.prototype.findIter = function(data) {
    var res = this._root;
    var iter = this.iterator();

    while(res !== null) {
        var c = this._comparator(data, res.data);
        if(c === 0) {
            iter._cursor = res;
            return iter;
        }
        else {
            iter._ancestors.push(res);
            res = res.get_child(c > 0);
        }
    }

    return null;
};

// Returns an iterator to the tree node at or immediately after the item
TreeBase.prototype.lowerBound = function(item) {
    var cur = this._root;
    var iter = this.iterator();
    var cmp = this._comparator;

    while(cur !== null) {
        var c = cmp(item, cur.data);
        if(c === 0) {
            iter._cursor = cur;
            return iter;
        }
        iter._ancestors.push(cur);
        cur = cur.get_child(c > 0);
    }

    for(var i=iter._ancestors.length - 1; i >= 0; --i) {
        cur = iter._ancestors[i];
        if(cmp(item, cur.data) < 0) {
            iter._cursor = cur;
            iter._ancestors.length = i;
            return iter;
        }
    }

    iter._ancestors.length = 0;
    return iter;
};

// Returns an iterator to the tree node immediately after the item
TreeBase.prototype.upperBound = function(item) {
    var iter = this.lowerBound(item);
    var cmp = this._comparator;

    while(iter.data() !== null && cmp(iter.data(), item) === 0) {
        iter.next();
    }

    return iter;
};

// returns null if tree is empty
TreeBase.prototype.min = function() {
    var res = this._root;
    if(res === null) {
        return null;
    }

    while(res.left !== null) {
        res = res.left;
    }

    return res.data;
};

// returns null if tree is empty
TreeBase.prototype.max = function() {
    var res = this._root;
    if(res === null) {
        return null;
    }

    while(res.right !== null) {
        res = res.right;
    }

    return res.data;
};

// returns a null iterator
// call next() or prev() to point to an element
TreeBase.prototype.iterator = function() {
    return new Iterator(this);
};

// calls cb on each node's data, in order
TreeBase.prototype.each = function(cb) {
    var it=this.iterator(), data;
    while((data = it.next()) !== null) {
        cb(data);
    }
};

// calls cb on each node's data, in reverse order
TreeBase.prototype.reach = function(cb) {
    var it=this.iterator(), data;
    while((data = it.prev()) !== null) {
        cb(data);
    }
};


function Iterator(tree) {
    this._tree = tree;
    this._ancestors = [];
    this._cursor = null;
}

Iterator.prototype.data = function() {
    return this._cursor !== null ? this._cursor.data : null;
};

// if null-iterator, returns first node
// otherwise, returns next node
Iterator.prototype.next = function() {
    if(this._cursor === null) {
        var root = this._tree._root;
        if(root !== null) {
            this._minNode(root);
        }
    }
    else {
        if(this._cursor.right === null) {
            // no greater node in subtree, go up to parent
            // if coming from a right child, continue up the stack
            var save;
            do {
                save = this._cursor;
                if(this._ancestors.length) {
                    this._cursor = this._ancestors.pop();
                }
                else {
                    this._cursor = null;
                    break;
                }
            } while(this._cursor.right === save);
        }
        else {
            // get the next node from the subtree
            this._ancestors.push(this._cursor);
            this._minNode(this._cursor.right);
        }
    }
    return this._cursor !== null ? this._cursor.data : null;
};

// if null-iterator, returns last node
// otherwise, returns previous node
Iterator.prototype.prev = function() {
    if(this._cursor === null) {
        var root = this._tree._root;
        if(root !== null) {
            this._maxNode(root);
        }
    }
    else {
        if(this._cursor.left === null) {
            var save;
            do {
                save = this._cursor;
                if(this._ancestors.length) {
                    this._cursor = this._ancestors.pop();
                }
                else {
                    this._cursor = null;
                    break;
                }
            } while(this._cursor.left === save);
        }
        else {
            this._ancestors.push(this._cursor);
            this._maxNode(this._cursor.left);
        }
    }
    return this._cursor !== null ? this._cursor.data : null;
};

Iterator.prototype._minNode = function(start) {
    while(start.left !== null) {
        this._ancestors.push(start);
        start = start.left;
    }
    this._cursor = start;
};

Iterator.prototype._maxNode = function(start) {
    while(start.right !== null) {
        this._ancestors.push(start);
        start = start.right;
    }
    this._cursor = start;
};

module.exports = TreeBase;


},{}],9:[function(require,module,exports){
/**
 * Node & browser script to transform/project geojson coordinates
 * @copyright Alexander Milevski <info@w8r.name>
 * @preserve
 * @license MIT
 */
(function (factory) { // UMD wrapper
	if (typeof define === 'function' && define.amd) { // AMD
		define(factory);
	} else if (typeof module         === 'object' &&
             typeof module.exports === "object") { // Node/CommonJS
		module.exports = factory();
	} else { // Browser globals
		window.geojsonProject = factory();
	}
})(function () {

/**
 * Takes in GeoJSON and applies a function to each coordinate,
 * with a given context
 *
 * @param  {Object}     data GeoJSON
 * @param  {Function}   project
 * @param  {*=}         context
 * @return {Object}
 */
function geojsonProject (data, project, context) {
  data = JSON.parse(JSON.stringify(data));
  if (data.type === 'FeatureCollection') {
    // That's a huge hack to get things working with both ArcGIS server
    // and GeoServer. Geoserver provides crs reference in GeoJSON, ArcGIS —
    // doesn't.
    //if (data.crs) delete data.crs;
    for (var i = data.features.length - 1; i >= 0; i--) {
      data.features[i] = projectFeature(data.features[i], project, context);
    }
  } else {
    data = projectFeature(data, project, context);
  }
  return data;
};

geojsonProject.projectFeature  = projectFeature;
geojsonProject.projectGeometry = projectGeometry;


/**
 * @param  {Object}     data GeoJSON
 * @param  {Function}   project
 * @param  {*=}         context
 * @return {Object}
 */
function projectFeature (feature, project, context) {
  if (feature.geometry.type === 'GeometryCollection') {
    for (var i = 0, len = feature.geometry.geometries.length; i < len; i++) {
      feature.geometry.geometries[i] =
        projectGeometry(feature.geometry.geometries[i], project, context);
    }
  } else {
    feature.geometry = projectGeometry(feature.geometry, project, context);
  }
  return feature;
}


/**
 * @param  {Object}     data GeoJSON
 * @param  {Function}   project
 * @param  {*=}         context
 * @return {Object}
 */
function projectGeometry (geometry, project, context) {
  var coords = geometry.coordinates;
  switch (geometry.type) {
    case 'Point':
      geometry.coordinates = project.call(context, coords);
      break;

    case 'MultiPoint':
    case 'LineString':
      for (var i = 0, len = coords.length; i < len; i++) {
        coords[i] = project.call(context, coords[i]);
      }
      geometry.coordinates = coords;
      break;

    case 'Polygon':
      geometry.coordinates = projectCoords(coords, 1, project, context);
      break;

    case 'MultiLineString':
      geometry.coordinates = projectCoords(coords, 1, project, context);
      break;

    case 'MultiPolygon':
      geometry.coordinates = projectCoords(coords, 2, project, context);
      break;

    default:
      break;
  }
  return geometry;
}


/**
 * @param  {*}         coords Coords arrays
 * @param  {Number}    levelsDeep
 * @param  {Function}  project
 * @param  {*=}         context
 * @return {*}
 */
function projectCoords (coords, levelsDeep, project, context) {
  var coord, i, len;
  var result = [];

  for (i = 0, len = coords.length; i < len; i++) {
    coord = levelsDeep ?
      projectCoords(coords[i], levelsDeep - 1, project, context) :
      project.call(context, coords[i]);

    result.push(coord);
  }

  return result;
}

return geojsonProject;

});

},{}],10:[function(require,module,exports){
module.exports = require('./src/index');

},{"./src/index":15}],11:[function(require,module,exports){
var signedArea = require('./signed_area');
// var equals = require('./equals');

/**
 * @param  {SweepEvent} e1
 * @param  {SweepEvent} e2
 * @return {Number}
 */
module.exports = function sweepEventsComp(e1, e2) {
  var p1 = e1.point;
  var p2 = e2.point;

  // Different x-coordinate
  if (p1[0] > p2[0]) return 1;
  if (p1[0] < p2[0]) return -1;

  // Different points, but same x-coordinate
  // Event with lower y-coordinate is processed first
  if (p1[1] !== p2[1]) return p1[1] > p2[1] ? 1 : -1;

  return specialCases(e1, e2, p1, p2);
};


function specialCases(e1, e2, p1, p2) {
  // Same coordinates, but one is a left endpoint and the other is
  // a right endpoint. The right endpoint is processed first
  if (e1.left !== e2.left)
    return e1.left ? 1 : -1;

  // Same coordinates, both events
  // are left endpoints or right endpoints.
  // not collinear
  if (signedArea (p1, e1.otherEvent.point, e2.otherEvent.point) !== 0) {
    // the event associate to the bottom segment is processed first
    return (!e1.isBelow(e2.otherEvent.point)) ? 1 : -1;
  }

  // uncomment this if you want to play with multipolygons
  // if (e1.isSubject === e2.isSubject) {
  //   if(equals(e1.point, e2.point) && e1.contourId === e2.contourId) {
  //     return 0;
  //   } else {
  //     return e1.contourId > e2.contourId ? 1 : -1;
  //   }
  // }

  return (!e1.isSubject && e2.isSubject) ? 1 : -1;
}

},{"./signed_area":17}],12:[function(require,module,exports){
var signedArea    = require('./signed_area');
var compareEvents = require('./compare_events');
var equals        = require('./equals');


/**
 * @param  {SweepEvent} le1
 * @param  {SweepEvent} le2
 * @return {Number}
 */
module.exports = function compareSegments(le1, le2) {
  if (le1 === le2) return 0;

  // Segments are not collinear
  if (signedArea(le1.point, le1.otherEvent.point, le2.point) !== 0 ||
    signedArea(le1.point, le1.otherEvent.point, le2.otherEvent.point) !== 0) {

    // If they share their left endpoint use the right endpoint to sort
    if (equals(le1.point, le2.point)) return le1.isBelow(le2.otherEvent.point) ? -1 : 1;

    // Different left endpoint: use the left endpoint to sort
    if (le1.point[0] === le2.point[0]) return le1.point[1] < le2.point[1] ? -1 : 1;

    // has the line segment associated to e1 been inserted
    // into S after the line segment associated to e2 ?
    if (compareEvents(le1, le2) === 1) return le2.isAbove(le1.point) ? -1 : 1;

    // The line segment associated to e2 has been inserted
    // into S after the line segment associated to e1
    return le1.isBelow(le2.point) ? -1 : 1;
  }

  if (le1.isSubject === le2.isSubject) { // same polygon
    if (equals(le1.point, le2.point)) {
      if (equals(le1.otherEvent.point, le2.otherEvent.point)) {
        return 0;
      } else {
        return le1.contourId > le2.contourId ? 1 : -1;
      }
    }
  } else { // Segments are collinear, but belong to separate polygons
    return le1.isSubject ? -1 : 1;
  }

  return compareEvents(le1, le2) === 1 ? 1 : -1;
};

},{"./compare_events":11,"./equals":14,"./signed_area":17}],13:[function(require,module,exports){
module.exports = { 
  NORMAL:               0, 
  NON_CONTRIBUTING:     1, 
  SAME_TRANSITION:      2, 
  DIFFERENT_TRANSITION: 3
};

},{}],14:[function(require,module,exports){
module.exports = function equals(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
};
},{}],15:[function(require,module,exports){
var INTERSECTION    = 0;
var UNION           = 1;
var DIFFERENCE      = 2;
var XOR             = 3;

var EMPTY           = [];

var edgeType        = require('./edge_type');

var Queue           = require('tinyqueue');
var Tree            = require('bintrees').RBTree;
var SweepEvent      = require('./sweep_event');

var compareEvents   = require('./compare_events');
var compareSegments = require('./compare_segments');
var intersection    = require('./segment_intersection');
var equals          = require('./equals');

var max = Math.max;
var min = Math.min;

// global.Tree = Tree;
// global.compareSegments = compareSegments;
// global.SweepEvent = SweepEvent;
// global.signedArea = require('./signed_area');

/**
 * @param  {<Array.<Number>} s1
 * @param  {<Array.<Number>} s2
 * @param  {Boolean}         isSubject
 * @param  {Queue}           eventQueue
 * @param  {Array.<Number>}  bbox
 */
function processSegment(s1, s2, isSubject, depth, eventQueue, bbox) {
  // Possible degenerate condition.
  // if (equals(s1, s2)) return;

  var e1 = new SweepEvent(s1, false, undefined, isSubject);
  var e2 = new SweepEvent(s2, false, e1,        isSubject);
  e1.otherEvent = e2;

  e1.contourId = e2.contourId = depth;

  if (compareEvents(e1, e2) > 0) {
    e2.left = true;
  } else {
    e1.left = true;
  }

  bbox[0] = min(bbox[0], s1[0]);
  bbox[1] = min(bbox[1], s1[1]);
  bbox[2] = max(bbox[2], s1[0]);
  bbox[3] = max(bbox[3], s1[1]);

  // Pushing it so the queue is sorted from left to right,
  // with object on the left having the highest priority.
  eventQueue.push(e1);
  eventQueue.push(e2);
}

var contourId = 0;

function processPolygon(polygon, isSubject, depth, queue, bbox) {
  var i, len;
  if (typeof polygon[0][0] === 'number') {
    for (i = 0, len = polygon.length - 1; i < len; i++) {
      processSegment(polygon[i], polygon[i + 1], isSubject, depth + 1, queue, bbox);
    }
  } else {
    for (i = 0, len = polygon.length; i < len; i++) {
      contourId++;
      processPolygon(polygon[i], isSubject, contourId, queue, bbox);
    }
  }
}


function fillQueue(subject, clipping, sbbox, cbbox) {
  var eventQueue = new Queue(null, compareEvents);
  contourId = 0;

  processPolygon(subject,  true,  0, eventQueue, sbbox);
  processPolygon(clipping, false, 0, eventQueue, cbbox);

  return eventQueue;
}


function computeFields(event, prev, sweepLine, operation) {
  // compute inOut and otherInOut fields
  if (prev === null) {
    event.inOut      = false;
    event.otherInOut = true;

  // previous line segment in sweepline belongs to the same polygon
  } else if (event.isSubject === prev.isSubject) {
    event.inOut      = !prev.inOut;
    event.otherInOut = prev.otherInOut;

  // previous line segment in sweepline belongs to the clipping polygon
  } else {
    event.inOut      = !prev.otherInOut;
    event.otherInOut = prev.isVertical() ? !prev.inOut : prev.inOut;
  }

  // compute prevInResult field
  if (prev) {
    event.prevInResult = (!inResult(prev, operation) || prev.isVertical()) ?
       prev.prevInResult : prev;
  }
  // check if the line segment belongs to the Boolean operation
  event.inResult = inResult(event, operation);
}


function inResult(event, operation) {
  switch (event.type) {
    case edgeType.NORMAL:
      switch (operation) {
        case INTERSECTION:
          return !event.otherInOut;
        case UNION:
          return event.otherInOut;
        case DIFFERENCE:
          return (event.isSubject && event.otherInOut) ||
                 (!event.isSubject && !event.otherInOut);
        case XOR:
          return true;
      }
    case edgeType.SAME_TRANSITION:
      return operation === INTERSECTION || operation === UNION;
    case edgeType.DIFFERENT_TRANSITION:
      return operation === DIFFERENCE;
    case edgeType.NON_CONTRIBUTING:
      return false;
  }
  return false;
}


/**
 * @param  {SweepEvent} se1
 * @param  {SweepEvent} se2
 * @param  {Queue}      queue
 * @return {Number}
 */
function possibleIntersection(se1, se2, queue) {
  // that disallows self-intersecting polygons,
  // did cost us half a day, so I'll leave it
  // out of respect
  // if (se1.isSubject === se2.isSubject) return;

  var inter = intersection(
    se1.point, se1.otherEvent.point,
    se2.point, se2.otherEvent.point
  );

  var nintersections = inter ? inter.length : 0;
  if (nintersections === 0) return 0; // no intersection

  // the line segments intersect at an endpoint of both line segments
  if ((nintersections === 1) &&
      (equals(se1.point, se2.point) ||
       equals(se1.otherEvent.point, se2.otherEvent.point))) {
    return 0;
  }

  if (nintersections === 2 && se1.isSubject === se2.isSubject){
    if(se1.contourId === se2.contourId){
    console.warn('Edges of the same polygon overlap',
      se1.point, se1.otherEvent.point, se2.point, se2.otherEvent.point);
    }
    //throw new Error('Edges of the same polygon overlap');
    return 0;
  }

  // The line segments associated to se1 and se2 intersect
  if (nintersections === 1) {

    // if the intersection point is not an endpoint of se1
    if (!equals(se1.point, inter[0]) && !equals(se1.otherEvent.point, inter[0])) {
      divideSegment(se1, inter[0], queue);
    }

    // if the intersection point is not an endpoint of se2
    if (!equals(se2.point, inter[0]) && !equals(se2.otherEvent.point, inter[0])) {
      divideSegment(se2, inter[0], queue);
    }
    return 1;
  }

  // The line segments associated to se1 and se2 overlap
  var events        = [];
  var leftCoincide  = false;
  var rightCoincide = false;

  if (equals(se1.point, se2.point)) {
    leftCoincide = true; // linked
  } else if (compareEvents(se1, se2) === 1) {
    events.push(se2, se1);
  } else {
    events.push(se1, se2);
  }

  if (equals(se1.otherEvent.point, se2.otherEvent.point)) {
    rightCoincide = true;
  } else if (compareEvents(se1.otherEvent, se2.otherEvent) === 1) {
    events.push(se2.otherEvent, se1.otherEvent);
  } else {
    events.push(se1.otherEvent, se2.otherEvent);
  }

  if ((leftCoincide && rightCoincide) || leftCoincide) {
    // both line segments are equal or share the left endpoint
    se1.type = edgeType.NON_CONTRIBUTING;
    se2.type = (se1.inOut === se2.inOut) ?
      edgeType.SAME_TRANSITION :
      edgeType.DIFFERENT_TRANSITION;

    if (leftCoincide && !rightCoincide) {
      // honestly no idea, but changing events selection from [2, 1]
      // to [0, 1] fixes the overlapping self-intersecting polygons issue
      divideSegment(events[0].otherEvent, events[1].point, queue);
    }
    return 2;
  }

  // the line segments share the right endpoint
  if (rightCoincide) {
    divideSegment(events[0], events[1].point, queue);
    return 3;
  }

  // no line segment includes totally the other one
  if (events[0] !== events[3].otherEvent) {
    divideSegment(events[0], events[1].point, queue);
    divideSegment(events[1], events[2].point, queue);
    return 3;
  }

  // one line segment includes the other one
  divideSegment(events[0], events[1].point, queue);
  divideSegment(events[3].otherEvent, events[2].point, queue);

  return 3;
}


/**
 * @param  {SweepEvent} se
 * @param  {Array.<Number>} p
 * @param  {Queue} queue
 * @return {Queue}
 */
function divideSegment(se, p, queue)  {
  var r = new SweepEvent(p, false, se,            se.isSubject);
  var l = new SweepEvent(p, true,  se.otherEvent, se.isSubject);

  if (equals(se.point, se.otherEvent.point)) {
    console.warn('what is that?', se);
  }

  r.contourId = l.contourId = se.contourId;

  // avoid a rounding error. The left event would be processed after the right event
  if (compareEvents(l, se.otherEvent) > 0) {
    se.otherEvent.left = true;
    l.left = false;
  }

  // avoid a rounding error. The left event would be processed after the right event
  // if (compareEvents(se, r) > 0) {}

  se.otherEvent.otherEvent = l;
  se.otherEvent = r;

  queue.push(l);
  queue.push(r);

  return queue;
}


/* eslint-disable no-unused-vars, no-debugger */
function iteratorEquals(it1, it2) {
  return it1._cursor === it2._cursor;
}


function _renderSweepLine(sweepLine, pos, event) {
  var map = window.map;
  if (!map) return;
  if (window.sws) window.sws.forEach(function(p) {
    map.removeLayer(p);
  });
  window.sws = [];
  sweepLine.each(function(e) {
    var poly = L.polyline([e.point.slice().reverse(), e.otherEvent.point.slice().reverse()], { color: 'green' }).addTo(map);
    window.sws.push(poly);
  });

  if (window.vt) map.removeLayer(window.vt);
  var v = pos.slice();
  var b = map.getBounds();
  window.vt = L.polyline([[b.getNorth(), v[0]], [b.getSouth(), v[0]]], {color: 'green', weight: 1}).addTo(map);

  if (window.ps) map.removeLayer(window.ps);
  window.ps = L.polyline([event.point.slice().reverse(), event.otherEvent.point.slice().reverse()], {color: 'black', weight: 9, opacity: 0.4}).addTo(map);
  debugger;
}
/* eslint-enable no-unused-vars, no-debugger */


function subdivideSegments(eventQueue, subject, clipping, sbbox, cbbox, operation) {
  var sortedEvents = [];
  var prev, next;

  var sweepLine = new Tree(compareSegments);
  var sortedEvents = [];

  var rightbound = min(sbbox[2], cbbox[2]);

  var prev, next;

  while (eventQueue.length) {
    var event = eventQueue.pop();
    sortedEvents.push(event);

    // optimization by bboxes for intersection and difference goes here
    if ((operation === INTERSECTION && event.point[0] > rightbound) ||
        (operation === DIFFERENCE   && event.point[0] > sbbox[2])) {
      break;
    }

    if (event.left) {
      sweepLine.insert(event);
      // _renderSweepLine(sweepLine, event.point, event);

      next = sweepLine.findIter(event);
      prev = sweepLine.findIter(event);
      event.iterator = sweepLine.findIter(event);

      // Cannot get out of the tree what we just put there
      if (!prev || !next) {
        console.log('brute');
        var iterators = findIterBrute(sweepLine);
        prev = iterators[0];
        next = iterators[1];
      }

      if (prev.data() !== sweepLine.min()) {
        prev.prev();
      } else {
        prev = sweepLine.iterator(); //findIter(sweepLine.max());
        prev.prev();
        prev.next();
      }
      next.next();

      computeFields(event, prev.data(), sweepLine, operation);

      if (next.data()) {
        if (possibleIntersection(event, next.data(), eventQueue) === 2) {
          computeFields(event, prev.data(), sweepLine, operation);
          computeFields(event, next.data(), sweepLine, operation);
        }
      }

      if (prev.data()) {
        if (possibleIntersection(prev.data(), event, eventQueue) === 2) {
          var prevprev = sweepLine.findIter(prev.data());
          if (prevprev.data() !== sweepLine.min()) {
            prevprev.prev();
          } else {
            prevprev = sweepLine.findIter(sweepLine.max());
            prevprev.next();
          }
          computeFields(prev.data(), prevprev.data(), sweepLine, operation);
          computeFields(event, prev.data(), sweepLine, operation);
        }
      }
    } else {
      event = event.otherEvent;
      next = sweepLine.findIter(event);
      prev = sweepLine.findIter(event);

      // _renderSweepLine(sweepLine, event.otherEvent.point, event);

      if (!(prev && next)) continue;

      if (prev.data() !== sweepLine.min()) {
        prev.prev();
      } else {
        prev = sweepLine.iterator();
        prev.prev(); // sweepLine.findIter(sweepLine.max());
        prev.next();
      }
      next.next();
      sweepLine.remove(event);

      //_renderSweepLine(sweepLine, event.otherEvent.point, event);

      if (next.data() && prev.data()) {
        possibleIntersection(prev.data(), next.data(), eventQueue);
      }
    }
  }
  return sortedEvents;
}

function findIterBrute(sweepLine, q) {
  var prev = sweepLine.iterator();
  var next = sweepLine.iterator();
  var it   = sweepLine.iterator(), data;
  while((data = it.next()) !== null) {
    prev.next();
    next.next();
    if (data === event) {
      break;
    }
  }
  return [prev, next];
}


function swap (arr, i, n) {
  var temp = arr[i];
  arr[i] = arr[n];
  arr[n] = temp;
}


function changeOrientation(contour) {
  return contour.reverse();
}


function isArray (arr) {
  return Object.prototype.toString.call(arr) === '[object Array]';
}


function addHole(contour, idx) {
  if (isArray(contour[0]) && !isArray(contour[0][0])) {
    contour = [contour];
  }
  contour[idx] = [];
  return contour;
}


/**
 * @param  {Array.<SweepEvent>} sortedEvents
 * @return {Array.<SweepEvent>}
 */
function orderEvents(sortedEvents) {
  var event, i, len;
  var resultEvents = [];
  for (i = 0, len = sortedEvents.length; i < len; i++) {
    event = sortedEvents[i];
    if ((event.left && event.inResult) ||
      (!event.left && event.otherEvent.inResult)) {
      resultEvents.push(event);
    }
  }

  // Due to overlapping edges the resultEvents array can be not wholly sorted
  var sorted = false;
  while (!sorted) {
    sorted = true;
    for (i = 0, len = resultEvents.length; i < len; i++) {
      if ((i + 1) < len &&
        compareEvents(resultEvents[i], resultEvents[i + 1]) === 1) {
        swap(resultEvents, i, i + 1);
        sorted = false;
      }
    }
  }

  for (i = 0, len = resultEvents.length; i < len; i++) {
    resultEvents[i].pos = i;
  }

  for (i = 0, len = resultEvents.length; i < len; i++) {
    if (!resultEvents[i].left) {
      var temp = resultEvents[i].pos;
      resultEvents[i].pos = resultEvents[i].otherEvent.pos;
      resultEvents[i].otherEvent.pos = temp;
    }
  }

  return resultEvents;
}


/**
 * @param  {Array.<SweepEvent>} sortedEvents
 * @return {Array.<*>} polygons
 */
function connectEdges(sortedEvents) {
  var i, len;
  var resultEvents = orderEvents(sortedEvents);


  // "false"-filled array
  var processed = Array(resultEvents.length);
  var result = [];

  var depth  = [];
  var holeOf = [];
  var isHole = {};

  for (i = 0, len = resultEvents.length; i < len; i++) {
    if (processed[i]) continue;

    var contour = [];
    result.push(contour);

    var ringId = result.length - 1;
    depth.push(0);
    holeOf.push(-1);


    if (resultEvents[i].prevInResult) {
      var lowerContourId = resultEvents[i].prevInResult.contourId;
      if (!resultEvents[i].prevInResult.resultInOut) {
        addHole(result[lowerContourId], ringId);
        holeOf[ringId] = lowerContourId;
        depth[ringId]  = depth[lowerContourId] + 1;
        isHole[ringId] = true;
      } else if (isHole[lowerContourId]) {
        addHole(result[holeOf[lowerContourId]], ringId);
        holeOf[ringId] = holeOf[lowerContourId];
        depth[ringId]  = depth[lowerContourId];
        isHole[ringId] = true;
      }
    }

    var pos = i;
    var initial = resultEvents[i].point;
    contour.push(initial);

    while (pos >= i) {
      processed[pos] = true;

      if (resultEvents[pos].left) {
        resultEvents[pos].resultInOut = false;
        resultEvents[pos].contourId   = ringId;
      } else {
        resultEvents[pos].otherEvent.resultInOut = true;
        resultEvents[pos].otherEvent.contourId   = ringId;
      }

      pos = resultEvents[pos].pos;
      processed[pos] = true;

      contour.push(resultEvents[pos].point);
      pos = nextPos(pos, resultEvents, processed);
    }

    pos = pos === -1 ? i : pos;

    processed[pos] = processed[resultEvents[pos].pos] = true;
    resultEvents[pos].otherEvent.resultInOut = true;
    resultEvents[pos].otherEvent.contourId   = ringId;


    // depth is even
    /* eslint-disable no-bitwise */
    if (depth[ringId] & 1) {
      changeOrientation(contour);
    }
    /* eslint-enable no-bitwise */
  }

  return result;
}


/**
 * @param  {Number} pos
 * @param  {Array.<SweepEvent>} resultEvents
 * @param  {Array.<Boolean>}    processed
 * @return {Number}
 */
function nextPos(pos, resultEvents, processed) {
  var newPos = pos + 1;
  var length = resultEvents.length;
  while (newPos < length &&
         equals(resultEvents[newPos].point, resultEvents[pos].point)) {
    if (!processed[newPos]) {
      return newPos;
    } else {
      newPos = newPos + 1;
    }
  }

  newPos = pos - 1;

  while (processed[newPos]) {
    newPos = newPos - 1;
  }
  return newPos;
}


function trivialOperation(subject, clipping, operation) {
  var result = null;
  if (subject.length * clipping.length === 0) {
    if (operation === INTERSECTION) {
      result = EMPTY;
    } else if (operation === DIFFERENCE) {
      result = subject;
    } else if (operation === UNION || operation === XOR) {
      result = (subject.length === 0) ? clipping : subject;
    }
  }
  return result;
}


function compareBBoxes(subject, clipping, sbbox, cbbox, operation) {
  var result = null;
  if (sbbox[0] > cbbox[2] ||
      cbbox[0] > sbbox[2] ||
      sbbox[1] > cbbox[3] ||
      cbbox[1] > sbbox[3]) {
    if (operation === INTERSECTION) {
      result = EMPTY;
    } else if (operation === DIFFERENCE) {
      result = subject;
    } else if (operation === UNION || operation === XOR) {
      result = subject.concat(clipping);
    }
  }
  return result;
}


function boolean(subject, clipping, operation) {
  var trivial = trivialOperation(subject, clipping, operation);
  if (trivial) {
    return trivial === EMPTY ? null : trivial;
  }
  var sbbox = [Infinity, Infinity, -Infinity, -Infinity];
  var cbbox = [Infinity, Infinity, -Infinity, -Infinity];

  var eventQueue = fillQueue(subject, clipping, sbbox, cbbox);

  trivial = compareBBoxes(subject, clipping, sbbox, cbbox, operation);
  if (trivial) {
    return trivial === EMPTY ? null : trivial;
  }
  var sortedEvents = subdivideSegments(eventQueue, subject, clipping, sbbox, cbbox, operation);
  return connectEdges(sortedEvents);
}


module.exports = boolean;


module.exports.union = function(subject, clipping) {
  return boolean(subject, clipping, UNION);
};


module.exports.diff = function(subject, clipping) {
  return boolean(subject, clipping, DIFFERENCE);
};


module.exports.xor = function(subject, clipping) {
  return boolean(subject, clipping, XOR);
};


module.exports.intersection = function(subject, clipping) {
  return boolean(subject, clipping, INTERSECTION);
};


/**
 * @enum {Number}
 */
module.exports.operations = {
  INTERSECTION: INTERSECTION,
  DIFFERENCE:   DIFFERENCE,
  UNION:        UNION,
  XOR:          XOR
};


// for testing
module.exports.fillQueue            = fillQueue;
module.exports.computeFields        = computeFields;
module.exports.subdivideSegments    = subdivideSegments;
module.exports.divideSegment        = divideSegment;
module.exports.possibleIntersection = possibleIntersection;

},{"./compare_events":11,"./compare_segments":12,"./edge_type":13,"./equals":14,"./segment_intersection":16,"./sweep_event":18,"bintrees":5,"tinyqueue":19}],16:[function(require,module,exports){
var EPSILON = 1e-9;

/**
 * Finds the magnitude of the cross product of two vectors (if we pretend
 * they're in three dimensions)
 *
 * @param {Object} a First vector
 * @param {Object} b Second vector
 * @private
 * @returns {Number} The magnitude of the cross product
 */
function krossProduct(a, b) {
  return a[0] * b[1] - a[1] * b[0];
}

/**
 * Finds the dot product of two vectors.
 *
 * @param {Object} a First vector
 * @param {Object} b Second vector
 * @private
 * @returns {Number} The dot product
 */
function dotProduct(a, b) {
  return a[0] * b[0] + a[1] * b[1];
}

/**
 * Finds the intersection (if any) between two line segments a and b, given the
 * line segments' end points a1, a2 and b1, b2.
 *
 * This algorithm is based on Schneider and Eberly.
 * http://www.cimec.org.ar/~ncalvo/Schneider_Eberly.pdf
 * Page 244.
 *
 * @param {Array.<Number>} a1 point of first line
 * @param {Array.<Number>} a2 point of first line
 * @param {Array.<Number>} b1 point of second line
 * @param {Array.<Number>} b2 point of second line
 * @param {Boolean=}       noEndpointTouch whether to skip single touchpoints
 *                                         (meaning connected segments) as
 *                                         intersections
 * @returns {Array.<Array.<Number>>|Null} If the lines intersect, the point of
 * intersection. If they overlap, the two end points of the overlapping segment.
 * Otherwise, null.
 */
module.exports = function(a1, a2, b1, b2, noEndpointTouch) {
  // The algorithm expects our lines in the form P + sd, where P is a point,
  // s is on the interval [0, 1], and d is a vector.
  // We are passed two points. P can be the first point of each pair. The
  // vector, then, could be thought of as the distance (in x and y components)
  // from the first point to the second point.
  // So first, let's make our vectors:
  var va = [a2[0] - a1[0], a2[1] - a1[1]];
  var vb = [b2[0] - b1[0], b2[1] - b1[1]];
  // We also define a function to convert back to regular point form:

  /* eslint-disable arrow-body-style */

  function toPoint(p, s, d) {
    return [
      p[0] + s * d[0],
      p[1] + s * d[1]
    ];
  }

  /* eslint-enable arrow-body-style */

  // The rest is pretty much a straight port of the algorithm.
  var e = [b1[0] - a1[0], b1[1] - a1[1]];
  var kross = krossProduct(va, vb);
  var sqrKross = kross * kross;
  var sqrLenA = dotProduct(va, va);
  var sqrLenB = dotProduct(vb, vb);

  // Check for line intersection. This works because of the properties of the
  // cross product -- specifically, two vectors are parallel if and only if the
  // cross product is the 0 vector. The full calculation involves relative error
  // to account for possible very small line segments. See Schneider & Eberly
  // for details.
  if (sqrKross > EPSILON * sqrLenA * sqrLenB) {
    // If they're not parallel, then (because these are line segments) they
    // still might not actually intersect. This code checks that the
    // intersection point of the lines is actually on both line segments.
    var s = krossProduct(e, vb) / kross;
    if (s < 0 || s > 1) {
      // not on line segment a
      return null;
    }
    var t = krossProduct(e, va) / kross;
    if (t < 0 || t > 1) {
      // not on line segment b
      return null;
    }
    return noEndpointTouch ? null : [toPoint(a1, s, va)];
  }

  // If we've reached this point, then the lines are either parallel or the
  // same, but the segments could overlap partially or fully, or not at all.
  // So we need to find the overlap, if any. To do that, we can use e, which is
  // the (vector) difference between the two initial points. If this is parallel
  // with the line itself, then the two lines are the same line, and there will
  // be overlap.
  var sqrLenE = dotProduct(e, e);
  kross = krossProduct(e, va);
  sqrKross = kross * kross;

  if (sqrKross > EPSILON * sqrLenA * sqrLenE) {
    // Lines are just parallel, not the same. No overlap.
    return null;
  }

  var sa = dotProduct(va, e) / sqrLenA;
  var sb = sa + dotProduct(va, vb) / sqrLenA;
  var smin = Math.min(sa, sb);
  var smax = Math.max(sa, sb);

  // this is, essentially, the FindIntersection acting on floats from
  // Schneider & Eberly, just inlined into this function.
  if (smin <= 1 && smax >= 0) {

    // overlap on an end point
    if (smin === 1) {
      return noEndpointTouch ? null : [toPoint(a1, smin > 0 ? smin : 0, va)];
    }

    if (smax === 0) {
      return noEndpointTouch ? null : [toPoint(a1, smax < 1 ? smax : 1, va)];
    }

    if (noEndpointTouch && smin === 0 && smax === 1) return null;

    // There's overlap on a segment -- two points of intersection. Return both.
    return [
      toPoint(a1, smin > 0 ? smin : 0, va),
      toPoint(a1, smax < 1 ? smax : 1, va),
    ];
  }

  return null;
};

},{}],17:[function(require,module,exports){
/**
 * Signed area of the triangle (p0, p1, p2)
 * @param  {Array.<Number>} p0
 * @param  {Array.<Number>} p1
 * @param  {Array.<Number>} p2
 * @return {Number}
 */
module.exports = function signedArea(p0, p1, p2) {
  return (p0[0] - p2[0]) * (p1[1] - p2[1]) - (p1[0] - p2[0]) * (p0[1] - p2[1]);
};

},{}],18:[function(require,module,exports){
var signedArea = require('./signed_area');
var EdgeType   = require('./edge_type');


/**
 * Sweepline event
 *
 * @param {Array.<Number>}  point
 * @param {Boolean}         left
 * @param {SweepEvent=}     otherEvent
 * @param {Boolean}         isSubject
 * @param {Number}          edgeType
 */
function SweepEvent(point, left, otherEvent, isSubject, edgeType) {

  /**
   * Is left endpoint?
   * @type {Boolean}
   */
  this.left = left;

  /**
   * @type {Array.<Number>}
   */
  this.point = point;

  /**
   * Other edge reference
   * @type {SweepEvent}
   */
  this.otherEvent = otherEvent;

  /**
   * Belongs to source or clipping polygon
   * @type {Boolean}
   */
  this.isSubject = isSubject;

  /**
   * Edge contribution type
   * @type {Number}
   */
  this.type = edgeType || EdgeType.NORMAL;


  /**
   * In-out transition for the sweepline crossing polygon
   * @type {Boolean}
   */
  this.inOut = false;


  /**
   * @type {Boolean}
   */
  this.otherInOut = false;

  /**
   * Previous event in result?
   * @type {SweepEvent}
   */
  this.prevInResult = null;

  /**
   * Does event belong to result?
   * @type {Boolean}
   */
  this.inResult = false;


  // connection step

  /**
   * @type {Boolean}
   */
  this.resultInOut = false;
}


SweepEvent.prototype = {

  /**
   * @param  {Array.<Number>}  p
   * @return {Boolean}
   */
  isBelow: function(p) {
    return this.left ?
      signedArea (this.point, this.otherEvent.point, p) > 0 :
      signedArea (this.otherEvent.point, this.point, p) > 0;
  },


  /**
   * @param  {Array.<Number>}  p
   * @return {Boolean}
   */
  isAbove: function(p) {
    return !this.isBelow(p);
  },


  /**
   * @return {Boolean}
   */
  isVertical: function() {
    return this.point[0] === this.otherEvent.point[0];
  }
};

module.exports = SweepEvent;

},{"./edge_type":13,"./signed_area":17}],19:[function(require,module,exports){
'use strict';

module.exports = TinyQueue;

function TinyQueue(data, compare) {
    if (!(this instanceof TinyQueue)) return new TinyQueue(data, compare);

    this.data = data || [];
    this.length = this.data.length;
    this.compare = compare || defaultCompare;

    if (data) for (var i = Math.floor(this.length / 2); i >= 0; i--) this._down(i);
}

function defaultCompare(a, b) {
    return a < b ? -1 : a > b ? 1 : 0;
}

TinyQueue.prototype = {

    push: function (item) {
        this.data.push(item);
        this.length++;
        this._up(this.length - 1);
    },

    pop: function () {
        var top = this.data[0];
        this.data[0] = this.data[this.length - 1];
        this.length--;
        this.data.pop();
        this._down(0);
        return top;
    },

    peek: function () {
        return this.data[0];
    },

    _up: function (pos) {
        var data = this.data,
            compare = this.compare;

        while (pos > 0) {
            var parent = Math.floor((pos - 1) / 2);
            if (compare(data[pos], data[parent]) < 0) {
                swap(data, parent, pos);
                pos = parent;

            } else break;
        }
    },

    _down: function (pos) {
        var data = this.data,
            compare = this.compare,
            len = this.length;

        while (true) {
            var left = 2 * pos + 1,
                right = left + 1,
                min = pos;

            if (left < len && compare(data[left], data[min]) < 0) min = left;
            if (right < len && compare(data[right], data[min]) < 0) min = right;

            if (min === pos) return;

            swap(data, min, pos);
            pos = min;
        }
    }
};

function swap(data, i, j) {
    var tmp = data[i];
    data[i] = data[j];
    data[j] = tmp;
}

},{}],20:[function(require,module,exports){
/**
 * Offset edge of the polygon
 *
 * @param  {Object} current
 * @param  {Object} next
 * @constructor
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
  this._inNormal  = this.inwardsNormal();

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

  if (edgeLength === 0) throw new Error('Vertices overlap');

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
  return Edge.offsetEdge(this.current, this.next, dx, dy);
};


/**
 * @param  {Number} dx
 * @param  {Number} dy
 * @return {Edge}
 */
Edge.prototype.inverseOffset = function(dx, dy) {
  return Edge.offsetEdge(this.next, this.current, dx, dy);
};


/**
 * @static
 * @param  {Array.<Number>} current
 * @param  {Array.<Number>} next
 * @param  {Number}         dx
 * @param  {Number}         dy
 * @return {Edge}
 */
Edge.offsetEdge = function(current, next, dx, dy) {
  return new Edge([
    current[0] + dx,
    current[1] + dy
  ], [
    next[0] + dx,
    next[1] + dy
  ]);
};


/**
 *
 * @return {Edge}
 */
Edge.prototype.inverse = function () {
  return new Edge(this.next, this.current);
};


module.exports = Edge;

},{}],21:[function(require,module,exports){
var Edge     = require('./edge');
var martinez = require('martinez-polygon-clipping');
var utils    = require('./utils');


var isArray     = utils.isArray;
var equals      = utils.equals;
var orientRings = utils.orientRings;


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
};


/**
 * Recursively process contour to create normals
 * @param  {*} contour
 * @param  {Array} edges
 */
Offset.prototype._processContour = function(contour, edges) {
  var i, len;
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
      startAngle = Math.atan2(startVertex[1] - center[1], startVertex[0] - center[0]),
      endAngle   = Math.atan2(endVertex[1] - center[1], endVertex[0] - center[0]);

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
  if (!equals(vertices[0], vertices[vertices.length - 1])) {
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
Offset.prototype._offsetSegment = function(v1, v2, e1, dist) {
  var vertices = [];
  var offsets = [
    e1.offset(e1._inNormal[0] * dist, e1._inNormal[1] * dist),
    e1.inverseOffset(e1._outNormal[0] * dist, e1._outNormal[1] * dist)
  ];

  for (var i = 0, len = 2; i < len; i++) {
    var thisEdge = offsets[i],
        prevEdge = offsets[(i + len - 1) % len];
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
Offset.prototype.margin = function(dist) {
  this.distance(dist);

  if (typeof this.vertices[0] === 'number') { // point
    return this.offsetPoint(this._distance);
  }

  if (dist === 0) return this.vertices;

  var union = this.offsetLines(this._distance);
  //return union;
  union = martinez.union(this.vertices, union);
  return orientRings(union);
};


/**
 * @param  {Number} dist
 * @return {Array.<Number>}
 */
Offset.prototype.padding = function(dist) {
  this.distance(dist);

  if (this._distance === 0) return this.ensureLastPoint(this.vertices);
  if (this.vertices.length === 2 && typeof this.vertices[0] === 'number') {
    return this.vertices;
  }

  var union = this.offsetLines(this._distance);
  var diff = martinez.diff(this.vertices, union);
  return orientRings(diff);
};


/**
 * Creates margin polygon
 * @param  {Number} dist
 * @return {Array.<Object>}
 */
Offset.prototype.offsetLine = function(dist) {
  if (dist === 0) return this.vertices;
  return orientRings(this.offsetLines(dist));
};


/**
 * Just offsets lines, no fill
 * @param  {Number} dist
 * @return {Array.<Array.<Array.<Number>>>}
 */
Offset.prototype.offsetLines = function(dist) {
  if (dist < 0) throw new Error('Cannot apply negative margin to the line');
  var union;
  this.distance(dist);
  if (isArray(this.vertices[0]) && typeof this.vertices[0][0] !== 'number') {
    for (var i = 0, len = this._edges.length; i < len; i++) {
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
};


/**
 * @param  {Array.<Array.<Number>>|Array.<Array.<...>>} curve
 * @param  {Array.<Edge>|Array.<Array.<...>>} edges
 * @return {Polygon}
 */
Offset.prototype.offsetContour = function(curve, edges) {
  var union, i, len;
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
};


/**
 * @param  {Number} distance
 * @return {Array.<Array.<Number>}
 */
Offset.prototype.offsetPoint = function(distance) {
  this.distance(distance);
  var vertices = this._arcSegments * 2;
  var points   = [];
  var center   = this.vertices;
  var radius   = this._distance;
  var angle    = 0;

  if (vertices % 2 === 0) vertices++;

  for (var i = 0; i < vertices; i++) {
    angle += (2 * Math.PI / vertices); // counter-clockwise
    points.push([
      center[0] + (radius * Math.cos(angle)),
      center[1] + (radius * Math.sin(angle))
    ]);
  }

  return orientRings([this.ensureLastPoint(points)]);
};


Offset.orientRings = orientRings;

module.exports = Offset;

},{"./edge":20,"./utils":22,"martinez-polygon-clipping":10}],22:[function(require,module,exports){
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
},{}],23:[function(require,module,exports){
module.exports={
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              114.18466329574586,
              22.267890315905507
            ],
            [
              114.18840765953065,
              22.26926047026178
            ],
            [
              114.18651938438417,
              22.267284663689324
            ],
            [
              114.1876244544983,
              22.2654379046834
            ],
            [
              114.18499588966371,
              22.266271927897595
            ],
            [
              114.18466329574586,
              22.267890315905507
            ]
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            114.18836474418642,
            22.270749753256833
          ],
          [
            114.19047832489015,
            22.26977675682864
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            114.18925523757935,
            22.267592454487456
          ],
          [
            114.19204473495483,
            22.26928032747266
          ],
          [
            114.19121861457826,
            22.26488188644578
          ],
          [
            114.19357895851137,
            22.266927228364477
          ],
          [
            114.1893517971039,
            22.26653007693269
          ]
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          114.18949127197267,
          22.271802170346884
        ]
      }
    },
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              114.18646574020386,
              22.26391877819981
            ],
            [
              114.19225931167604,
              22.263759914347176
            ],
            [
              114.19245243072511,
              22.260046420421386
            ],
            [
              114.18558597564699,
              22.260503165629643
            ],
            [
              114.18646574020386,
              22.26391877819981
            ]
          ],
          [
            [
              114.18732404708864,
              22.26324360558074
            ],
            [
              114.187388420105,
              22.261218068181
            ],
            [
              114.19092893600465,
              22.260959909347545
            ],
            [
              114.19101476669312,
              22.26268757862524
            ],
            [
              114.18732404708864,
              22.26324360558074
            ]
          ]
        ]
      }
    }
  ]
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJleGFtcGxlL2FwcC5qcyIsImV4YW1wbGUvbGVhZmxldF9tdWx0aXBvbHlnb24uanMiLCJleGFtcGxlL29mZnNldF9jb250cm9sLmpzIiwiZXhhbXBsZS9wb2x5Z29uX2NvbnRyb2wuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL2JpbnRyZWUuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL3JidHJlZS5qcyIsIm5vZGVfbW9kdWxlcy9iaW50cmVlcy9saWIvdHJlZWJhc2UuanMiLCJub2RlX21vZHVsZXMvZ2VvanNvbi1wcm9qZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvY29tcGFyZV9ldmVudHMuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvY29tcGFyZV9zZWdtZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9lZGdlX3R5cGUuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvZXF1YWxzLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL3NlZ21lbnRfaW50ZXJzZWN0aW9uLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL3NpZ25lZF9hcmVhLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL3N3ZWVwX2V2ZW50LmpzIiwibm9kZV9tb2R1bGVzL3RpbnlxdWV1ZS9pbmRleC5qcyIsInNyYy9lZGdlLmpzIiwic3JjL29mZnNldC5qcyIsInNyYy91dGlscy5qcyIsInRlc3QvZml4dHVyZXMvZGVtby5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDOUhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNqREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6WkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwidmFyIE9mZnNldCA9IGdsb2JhbC5PZmZzZXQgPSByZXF1aXJlKCcuLi9zcmMvb2Zmc2V0Jyk7XG5yZXF1aXJlKCcuL2xlYWZsZXRfbXVsdGlwb2x5Z29uJyk7XG5yZXF1aXJlKCcuL3BvbHlnb25fY29udHJvbCcpO1xudmFyIE9mZnNldENvbnRyb2wgPSByZXF1aXJlKCcuL29mZnNldF9jb250cm9sJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL3Rlc3QvZml4dHVyZXMvZGVtby5qc29uJyk7XG52YXIgcHJvamVjdCA9IHJlcXVpcmUoJ2dlb2pzb24tcHJvamVjdCcpO1xuXG52YXIgYXJjU2VnbWVudHMgPSA1O1xuXG52YXIgc3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgY29sb3I6ICcjNDhmJyxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICBkYXNoQXJyYXk6IFsyLCA0XVxuICAgIH0sXG4gICAgbWFyZ2luU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjMjc2RDhGJ1xuICAgIH0sXG4gICAgcGFkZGluZ1N0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnI0Q4MTcwNidcbiAgICB9LFxuICAgIGNlbnRlciA9IFsyMi4yNjcwLCAxMTQuMTg4XSxcbiAgICB6b29tID0gMTcsXG4gICAgbWFwLCB2ZXJ0aWNlcywgcmVzdWx0O1xuXG5tYXAgPSBnbG9iYWwubWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgem9vbSk7XG5cblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld1BvaW50Q29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0TWFya2VyXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKGRhdGEpLmFkZFRvKG1hcCk7XG52YXIgcmVzdWx0cyA9IGdsb2JhbC5yZXN1bHRzID0gTC5nZW9Kc29uKG51bGwsIHtcbiAgc3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFyZ2luU3R5bGU7XG4gIH1cbn0pLmFkZFRvKG1hcCk7XG5tYXAuZml0Qm91bmRzKGxheWVycy5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBydW4gKG1hcmdpbikge1xuICByZXN1bHRzLmNsZWFyTGF5ZXJzKCk7XG4gIGxheWVycy5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgZ2ogPSBsYXllci50b0dlb0pTT04oKTtcbiAgICBjb25zb2xlLmxvZyhnaiwgbWFyZ2luKTtcbiAgICB2YXIgc2hhcGUgPSBwcm9qZWN0KGdqLCBmdW5jdGlvbihjb29yZCkge1xuICAgICAgdmFyIHB0ID0gbWFwLm9wdGlvbnMuY3JzLmxhdExuZ1RvUG9pbnQoTC5sYXRMbmcoY29vcmQuc2xpY2UoKS5yZXZlcnNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbiAgICAgIHJldHVybiBbcHQueCwgcHQueV07XG4gICAgfSk7XG5cbiAgICB2YXIgbWFyZ2luZWQ7XG4gICAgY29uc29sZS5sb2coZ2ouZ2VvbWV0cnkudHlwZSk7XG4gICAgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgaWYgKG1hcmdpbiA8IDApIHJldHVybjtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpXG4gICAgICAgIC5vZmZzZXRMaW5lKG1hcmdpbik7XG5cbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogbWFyZ2luID09PSAwID8gJ0xpbmVTdHJpbmcnIDogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpXG4gICAgICAgIC5vZmZzZXQobWFyZ2luKTtcblxuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHJlc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykub2Zmc2V0KG1hcmdpbik7XG4gICAgICBtYXJnaW5lZCA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogcmVzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ21hcmdpbmVkJywgbWFyZ2luZWQpO1xuICAgIHJlc3VsdHMuYWRkRGF0YShwcm9qZWN0KG1hcmdpbmVkLCBmdW5jdGlvbihwdCkge1xuICAgICAgdmFyIGxsID0gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwdC5zbGljZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW2xsLmxuZywgbGwubGF0XTtcbiAgICB9KSk7XG4gIH0pO1xufVxuXG5ydW4gKDIwKTtcbiIsIkwuUG9seWdvbi5wcm90b3R5cGUuX3Byb2plY3RMYXRsbmdzID0gZnVuY3Rpb24gKGxhdGxuZ3MsIHJlc3VsdCwgcHJvamVjdGVkQm91bmRzLCBpc0hvbGUpIHtcbiAgdmFyIGZsYXQgPSBsYXRsbmdzWzBdIGluc3RhbmNlb2YgTC5MYXRMbmcsXG4gICAgICBsZW4gPSBsYXRsbmdzLmxlbmd0aCxcbiAgICAgIGksIHJpbmcsIGFyZWE7XG5cbiAgaWYgKGZsYXQpIHtcbiAgICBhcmVhID0gMDtcbiAgICByaW5nID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICByaW5nW2ldID0gdGhpcy5fbWFwLmxhdExuZ1RvTGF5ZXJQb2ludChsYXRsbmdzW2ldKTtcbiAgICAgIHByb2plY3RlZEJvdW5kcy5leHRlbmQocmluZ1tpXSk7XG5cbiAgICAgIGlmIChpKSB7XG4gICAgICAgIGFyZWEgKz0gcmluZ1tpIC0gMV0ueCAqIHJpbmdbaV0ueTtcbiAgICAgICAgYXJlYSAtPSByaW5nW2ldLnggKiByaW5nW2kgLSAxXS55O1xuICAgICAgfVxuICAgIH1cbiAgICBhcmVhICs9IHJpbmdbbGVuIC0gMV0ueCAqIHJpbmdbMF0ueTtcbiAgICBhcmVhIC09IHJpbmdbMF0ueCAqIHJpbmdbbGVuIC0gMV0ueTtcblxuICAgIGlmICgoIWlzSG9sZSAmJiBhcmVhID4gMCkgfHwgKGlzSG9sZSAmJiBhcmVhIDwgMCkpIHtcbiAgICAgIHJpbmcucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKHJpbmcpO1xuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGhpcy5fcHJvamVjdExhdGxuZ3MobGF0bG5nc1tpXSwgcmVzdWx0LCBwcm9qZWN0ZWRCb3VuZHMsIGkgIT09IDApO1xuICAgIH1cbiAgfVxufTtcblxuXG5MLlBvbHlnb24ucHJvdG90eXBlLl9wcm9qZWN0ID0gZnVuY3Rpb24oKSB7XG4gIEwuUG9seWxpbmUucHJvdG90eXBlLl9wcm9qZWN0LmNhbGwodGhpcyk7XG4gIGlmICgodGhpcy5fbGF0bG5ncy5sZW5ndGggPiAxKSAmJlxuICAgICFMLlBvbHlsaW5lLl9mbGF0KHRoaXMuX2xhdGxuZ3MpICYmXG4gICAgISh0aGlzLl9sYXRsbmdzWzBdWzBdIGluc3RhbmNlb2YgTC5MYXRMbmcpKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5maWxsUnVsZSAhPT0gJ25vbnplcm8nKSB7XG4gICAgICB0aGlzLnNldFN0eWxlKHtcbiAgICAgICAgZmlsbFJ1bGU6ICdub256ZXJvJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gTC5Db250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcHJpZ2h0JyxcbiAgICBkZWZhdWx0TWFyZ2luOiAyMFxuICB9LFxuXG4gIG9uQWRkOiBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgJ2xlYWZsZXQtYmFyJyk7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmQgPSAnI2ZmZmZmZic7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLnBhZGRpbmcgPSAnMTBweCc7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFtcbiAgICAgICc8Zm9ybT4nLFxuICAgICAgICAnPGRpdj4nLFxuICAgICAgICAgICc8bGFiZWw+JyxcbiAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMFwiIG1heD1cIjEwMFwiIHZhbHVlPVwiJywgIHRoaXMub3B0aW9ucy5kZWZhdWx0TWFyZ2luLCAnXCIgbmFtZT1cIm1hcmdpblwiPicsXG4gICAgICAgICAgJzwvbGFiZWw+JyxcbiAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICc8ZGl2PicsXG4gICAgICAgICAgJzxsYWJlbD4nLCAnPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJvcGVyYXRpb25cIiB2YWx1ZT1cIjFcIiBjaGVja2VkPicsICcgbWFyZ2luPC9sYWJlbD4nLFxuICAgICAgICAgICc8bGFiZWw+JywgJzxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwib3BlcmF0aW9uXCIgdmFsdWU9XCItMVwiPicsICcgcGFkZGluZzwvbGFiZWw+JyxcbiAgICAgICAgJzwvZGl2PicsICc8YnI+JyxcbiAgICAgICAgJzxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJSdW5cIj4nLCAnPGlucHV0IG5hbWU9XCJjbGVhclwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIkNsZWFyIGxheWVyc1wiPicsXG4gICAgICAnPC9mb3JtPiddLmpvaW4oJycpO1xuXG4gICAgdmFyIGZvcm0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIEwuRG9tRXZlbnRcbiAgICAgIC5vbihmb3JtLCAnc3VibWl0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBMLkRvbUV2ZW50LnN0b3AoZXZ0KTtcbiAgICAgICAgdmFyIG1hcmdpbiA9IHBhcnNlRmxvYXQoZm9ybVsnbWFyZ2luJ10udmFsdWUpO1xuICAgICAgICB2YXIgcmFkaW9zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoXG4gICAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPXJhZGlvXScpKTtcbiAgICAgICAgdmFyIGsgPSAxO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmFkaW9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKHJhZGlvc1tpXS5jaGVja2VkKSB7XG4gICAgICAgICAgICBrICo9IHBhcnNlSW50KHJhZGlvc1tpXS52YWx1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRpb25zLmNhbGxiYWNrKG1hcmdpbiAqIGspO1xuICAgICAgfSwgdGhpcylcbiAgICAgIC5vbihmb3JtWydjbGVhciddLCAnY2xpY2snLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgTC5Eb21FdmVudC5zdG9wKGV2dCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5jbGVhcigpO1xuICAgICAgfSwgdGhpcyk7XG5cbiAgICBMLkRvbUV2ZW50XG4gICAgICAuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24odGhpcy5fY29udGFpbmVyKVxuICAgICAgLmRpc2FibGVTY3JvbGxQcm9wYWdhdGlvbih0aGlzLl9jb250YWluZXIpO1xuICAgIHJldHVybiB0aGlzLl9jb250YWluZXI7XG4gIH1cblxufSk7IiwiTC5FZGl0Q29udHJvbCA9IEwuQ29udHJvbC5leHRlbmQoe1xuXG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGNhbGxiYWNrOiBudWxsLFxuICAgIGtpbmQ6ICcnLFxuICAgIGh0bWw6ICcnXG4gIH0sXG5cbiAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcbiAgICB2YXIgY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgJ2xlYWZsZXQtY29udHJvbCBsZWFmbGV0LWJhcicpLFxuICAgICAgICBsaW5rID0gTC5Eb21VdGlsLmNyZWF0ZSgnYScsICcnLCBjb250YWluZXIpO1xuXG4gICAgbGluay5ocmVmID0gJyMnO1xuICAgIGxpbmsudGl0bGUgPSAnQ3JlYXRlIGEgbmV3ICcgKyB0aGlzLm9wdGlvbnMua2luZDtcbiAgICBsaW5rLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5odG1sO1xuICAgIEwuRG9tRXZlbnQub24obGluaywgJ2NsaWNrJywgTC5Eb21FdmVudC5zdG9wKVxuICAgICAgICAgICAgICAub24obGluaywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5MQVlFUiA9IHRoaXMub3B0aW9ucy5jYWxsYmFjay5jYWxsKG1hcC5lZGl0VG9vbHMpO1xuICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cblxufSk7XG5cbkwuTmV3UG9seWdvbkNvbnRyb2wgPSBMLkVkaXRDb250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGtpbmQ6ICdwb2x5Z29uJyxcbiAgICBodG1sOiAnJiN4MjIwNjsnXG4gIH1cbn0pO1xuXG5MLk5ld0xpbmVDb250cm9sID0gTC5FZGl0Q29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcbiAgICBraW5kOiAncG9seWxpbmUnLFxuICAgIGh0bWw6ICcvJ1xuICB9XG59KTtcblxuTC5OZXdQb2ludENvbnRyb2wgPSBMLkVkaXRDb250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGtpbmQ6ICdwb2ludCcsXG4gICAgaHRtbDogJyYjOTY3OTsnXG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUkJUcmVlOiByZXF1aXJlKCcuL2xpYi9yYnRyZWUnKSxcbiAgICBCaW5UcmVlOiByZXF1aXJlKCcuL2xpYi9iaW50cmVlJylcbn07XG4iLCJcbnZhciBUcmVlQmFzZSA9IHJlcXVpcmUoJy4vdHJlZWJhc2UnKTtcblxuZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIpIHtcbiAgICByZXR1cm4gZGlyID8gdGhpcy5yaWdodCA6IHRoaXMubGVmdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldF9jaGlsZCA9IGZ1bmN0aW9uKGRpciwgdmFsKSB7XG4gICAgaWYoZGlyKSB7XG4gICAgICAgIHRoaXMucmlnaHQgPSB2YWw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmxlZnQgPSB2YWw7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gQmluVHJlZShjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5zaXplID0gMDtcbn1cblxuQmluVHJlZS5wcm90b3R5cGUgPSBuZXcgVHJlZUJhc2UoKTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIGluc2VydGVkLCBmYWxzZSBpZiBkdXBsaWNhdGVcbkJpblRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGVtcHR5IHRyZWVcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGRpciA9IDA7XG5cbiAgICAvLyBzZXR1cFxuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuXG4gICAgLy8gc2VhcmNoIGRvd25cbiAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgIGlmKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGluc2VydCBuZXcgbm9kZSBhdCB0aGUgYm90dG9tXG4gICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICBwLnNldF9jaGlsZChkaXIsIG5vZGUpO1xuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9wIGlmIGZvdW5kXG4gICAgICAgIGlmKHRoaXMuX2NvbXBhcmF0b3Iobm9kZS5kYXRhLCBkYXRhKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlyID0gdGhpcy5fY29tcGFyYXRvcihub2RlLmRhdGEsIGRhdGEpIDwgMDtcblxuICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG4gICAgfVxufTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIHJlbW92ZWQsIGZhbHNlIGlmIG5vdCBmb3VuZFxuQmluVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcbiAgICB2YXIgbm9kZSA9IGhlYWQ7XG4gICAgbm9kZS5yaWdodCA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgZm91bmQgPSBudWxsOyAvLyBmb3VuZCBpdGVtXG4gICAgdmFyIGRpciA9IDE7XG5cbiAgICB3aGlsZShub2RlLmdldF9jaGlsZChkaXIpICE9PSBudWxsKSB7XG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcbiAgICAgICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgbm9kZS5kYXRhKTtcbiAgICAgICAgZGlyID0gY21wID4gMDtcblxuICAgICAgICBpZihjbXAgPT09IDApIHtcbiAgICAgICAgICAgIGZvdW5kID0gbm9kZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgIGZvdW5kLmRhdGEgPSBub2RlLmRhdGE7XG4gICAgICAgIHAuc2V0X2NoaWxkKHAucmlnaHQgPT09IG5vZGUsIG5vZGUuZ2V0X2NoaWxkKG5vZGUubGVmdCA9PT0gbnVsbCkpO1xuXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCaW5UcmVlO1xuXG4iLCJcbnZhciBUcmVlQmFzZSA9IHJlcXVpcmUoJy4vdHJlZWJhc2UnKTtcblxuZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xuICAgIHRoaXMucmVkID0gdHJ1ZTtcbn1cblxuTm9kZS5wcm90b3R5cGUuZ2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgcmV0dXJuIGRpciA/IHRoaXMucmlnaHQgOiB0aGlzLmxlZnQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIsIHZhbCkge1xuICAgIGlmKGRpcikge1xuICAgICAgICB0aGlzLnJpZ2h0ID0gdmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5sZWZ0ID0gdmFsO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIFJCVHJlZShjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5zaXplID0gMDtcbn1cblxuUkJUcmVlLnByb3RvdHlwZSA9IG5ldyBUcmVlQmFzZSgpO1xuXG4vLyByZXR1cm5zIHRydWUgaWYgaW5zZXJ0ZWQsIGZhbHNlIGlmIGR1cGxpY2F0ZVxuUkJUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJldCA9IGZhbHNlO1xuXG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBlbXB0eSB0cmVlXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaXplKys7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG5cbiAgICAgICAgdmFyIGRpciA9IDA7XG4gICAgICAgIHZhciBsYXN0ID0gMDtcblxuICAgICAgICAvLyBzZXR1cFxuICAgICAgICB2YXIgZ3AgPSBudWxsOyAvLyBncmFuZHBhcmVudFxuICAgICAgICB2YXIgZ2dwID0gaGVhZDsgLy8gZ3JhbmQtZ3JhbmQtcGFyZW50XG4gICAgICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgICAgICAgZ2dwLnJpZ2h0ID0gdGhpcy5fcm9vdDtcblxuICAgICAgICAvLyBzZWFyY2ggZG93blxuICAgICAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgICAgICBpZihub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5zZXJ0IG5ldyBub2RlIGF0IHRoZSBib3R0b21cbiAgICAgICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQoZGlyLCBub2RlKTtcbiAgICAgICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpc19yZWQobm9kZS5sZWZ0KSAmJiBpc19yZWQobm9kZS5yaWdodCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb2xvciBmbGlwXG4gICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG5vZGUubGVmdC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBub2RlLnJpZ2h0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXggcmVkIHZpb2xhdGlvblxuICAgICAgICAgICAgaWYoaXNfcmVkKG5vZGUpICYmIGlzX3JlZChwKSkge1xuICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ2dwLnJpZ2h0ID09PSBncDtcblxuICAgICAgICAgICAgICAgIGlmKG5vZGUgPT09IHAuZ2V0X2NoaWxkKGxhc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgc2luZ2xlX3JvdGF0ZShncCwgIWxhc3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgZG91YmxlX3JvdGF0ZShncCwgIWxhc3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgaWYgZm91bmRcbiAgICAgICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYXN0ID0gZGlyO1xuICAgICAgICAgICAgZGlyID0gY21wIDwgMDtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIGhlbHBlcnNcbiAgICAgICAgICAgIGlmKGdwICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZ2dwID0gZ3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncCA9IHA7XG4gICAgICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHJvb3RcbiAgICAgICAgdGhpcy5fcm9vdCA9IGhlYWQucmlnaHQ7XG4gICAgfVxuXG4gICAgLy8gbWFrZSByb290IGJsYWNrXG4gICAgdGhpcy5fcm9vdC5yZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiByZXQ7XG59O1xuXG4vLyByZXR1cm5zIHRydWUgaWYgcmVtb3ZlZCwgZmFsc2UgaWYgbm90IGZvdW5kXG5SQlRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG4gICAgdmFyIG5vZGUgPSBoZWFkO1xuICAgIG5vZGUucmlnaHQgPSB0aGlzLl9yb290O1xuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIGdwID0gbnVsbDsgLy8gZ3JhbmQgcGFyZW50XG4gICAgdmFyIGZvdW5kID0gbnVsbDsgLy8gZm91bmQgaXRlbVxuICAgIHZhciBkaXIgPSAxO1xuXG4gICAgd2hpbGUobm9kZS5nZXRfY2hpbGQoZGlyKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbGFzdCA9IGRpcjtcblxuICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICBncCA9IHA7XG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcblxuICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCBub2RlLmRhdGEpO1xuXG4gICAgICAgIGRpciA9IGNtcCA+IDA7XG5cbiAgICAgICAgLy8gc2F2ZSBmb3VuZCBub2RlXG4gICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgZm91bmQgPSBub2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHVzaCB0aGUgcmVkIG5vZGUgZG93blxuICAgICAgICBpZighaXNfcmVkKG5vZGUpICYmICFpc19yZWQobm9kZS5nZXRfY2hpbGQoZGlyKSkpIHtcbiAgICAgICAgICAgIGlmKGlzX3JlZChub2RlLmdldF9jaGlsZCghZGlyKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3IgPSBzaW5nbGVfcm90YXRlKG5vZGUsIGRpcik7XG4gICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQobGFzdCwgc3IpO1xuICAgICAgICAgICAgICAgIHAgPSBzcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIWlzX3JlZChub2RlLmdldF9jaGlsZCghZGlyKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2libGluZyA9IHAuZ2V0X2NoaWxkKCFsYXN0KTtcbiAgICAgICAgICAgICAgICBpZihzaWJsaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc19yZWQoc2libGluZy5nZXRfY2hpbGQoIWxhc3QpKSAmJiAhaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKGxhc3QpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29sb3IgZmxpcFxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmcucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ3AucmlnaHQgPT09IHA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzX3JlZChzaWJsaW5nLmdldF9jaGlsZChsYXN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncC5zZXRfY2hpbGQoZGlyMiwgZG91YmxlX3JvdGF0ZShwLCBsYXN0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Auc2V0X2NoaWxkKGRpcjIsIHNpbmdsZV9yb3RhdGUocCwgbGFzdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgY29ycmVjdCBjb2xvcmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdwYyA9IGdwLmdldF9jaGlsZChkaXIyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLmxlZnQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBncGMucmlnaHQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXBsYWNlIGFuZCByZW1vdmUgaWYgZm91bmRcbiAgICBpZihmb3VuZCAhPT0gbnVsbCkge1xuICAgICAgICBmb3VuZC5kYXRhID0gbm9kZS5kYXRhO1xuICAgICAgICBwLnNldF9jaGlsZChwLnJpZ2h0ID09PSBub2RlLCBub2RlLmdldF9jaGlsZChub2RlLmxlZnQgPT09IG51bGwpKTtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHJvb3QgYW5kIG1ha2UgaXQgYmxhY2tcbiAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcbiAgICBpZih0aGlzLl9yb290ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Jvb3QucmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvdW5kICE9PSBudWxsO1xufTtcblxuZnVuY3Rpb24gaXNfcmVkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAhPT0gbnVsbCAmJiBub2RlLnJlZDtcbn1cblxuZnVuY3Rpb24gc2luZ2xlX3JvdGF0ZShyb290LCBkaXIpIHtcbiAgICB2YXIgc2F2ZSA9IHJvb3QuZ2V0X2NoaWxkKCFkaXIpO1xuXG4gICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgc2F2ZS5nZXRfY2hpbGQoZGlyKSk7XG4gICAgc2F2ZS5zZXRfY2hpbGQoZGlyLCByb290KTtcblxuICAgIHJvb3QucmVkID0gdHJ1ZTtcbiAgICBzYXZlLnJlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHNhdmU7XG59XG5cbmZ1bmN0aW9uIGRvdWJsZV9yb3RhdGUocm9vdCwgZGlyKSB7XG4gICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgc2luZ2xlX3JvdGF0ZShyb290LmdldF9jaGlsZCghZGlyKSwgIWRpcikpO1xuICAgIHJldHVybiBzaW5nbGVfcm90YXRlKHJvb3QsIGRpcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUkJUcmVlO1xuIiwiXG5mdW5jdGlvbiBUcmVlQmFzZSgpIHt9XG5cbi8vIHJlbW92ZXMgYWxsIG5vZGVzIGZyb20gdGhlIHRyZWVcblRyZWVCYXNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgIHRoaXMuc2l6ZSA9IDA7XG59O1xuXG4vLyByZXR1cm5zIG5vZGUgZGF0YSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2VcblRyZWVCYXNlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuXG4gICAgd2hpbGUocmVzICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBjID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCByZXMuZGF0YSk7XG4gICAgICAgIGlmKGMgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IHJlcy5nZXRfY2hpbGQoYyA+IDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyByZXR1cm5zIGl0ZXJhdG9yIHRvIG5vZGUgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlXG5UcmVlQmFzZS5wcm90b3R5cGUuZmluZEl0ZXIgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XG5cbiAgICB3aGlsZShyZXMgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIHJlcy5kYXRhKTtcbiAgICAgICAgaWYoYyA9PT0gMCkge1xuICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gcmVzO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVyLl9hbmNlc3RvcnMucHVzaChyZXMpO1xuICAgICAgICAgICAgcmVzID0gcmVzLmdldF9jaGlsZChjID4gMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIFJldHVybnMgYW4gaXRlcmF0b3IgdG8gdGhlIHRyZWUgbm9kZSBhdCBvciBpbW1lZGlhdGVseSBhZnRlciB0aGUgaXRlbVxuVHJlZUJhc2UucHJvdG90eXBlLmxvd2VyQm91bmQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGN1ciA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XG4gICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICB3aGlsZShjdXIgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSBjbXAoaXRlbSwgY3VyLmRhdGEpO1xuICAgICAgICBpZihjID09PSAwKSB7XG4gICAgICAgICAgICBpdGVyLl9jdXJzb3IgPSBjdXI7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgICAgICBpdGVyLl9hbmNlc3RvcnMucHVzaChjdXIpO1xuICAgICAgICBjdXIgPSBjdXIuZ2V0X2NoaWxkKGMgPiAwKTtcbiAgICB9XG5cbiAgICBmb3IodmFyIGk9aXRlci5fYW5jZXN0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGN1ciA9IGl0ZXIuX2FuY2VzdG9yc1tpXTtcbiAgICAgICAgaWYoY21wKGl0ZW0sIGN1ci5kYXRhKSA8IDApIHtcbiAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IGN1cjtcbiAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggPSBpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpdGVyLl9hbmNlc3RvcnMubGVuZ3RoID0gMDtcbiAgICByZXR1cm4gaXRlcjtcbn07XG5cbi8vIFJldHVybnMgYW4gaXRlcmF0b3IgdG8gdGhlIHRyZWUgbm9kZSBpbW1lZGlhdGVseSBhZnRlciB0aGUgaXRlbVxuVHJlZUJhc2UucHJvdG90eXBlLnVwcGVyQm91bmQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLmxvd2VyQm91bmQoaXRlbSk7XG4gICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICB3aGlsZShpdGVyLmRhdGEoKSAhPT0gbnVsbCAmJiBjbXAoaXRlci5kYXRhKCksIGl0ZW0pID09PSAwKSB7XG4gICAgICAgIGl0ZXIubmV4dCgpO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVyO1xufTtcblxuLy8gcmV0dXJucyBudWxsIGlmIHRyZWUgaXMgZW1wdHlcblRyZWVCYXNlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICBpZihyZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgd2hpbGUocmVzLmxlZnQgIT09IG51bGwpIHtcbiAgICAgICAgcmVzID0gcmVzLmxlZnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5kYXRhO1xufTtcblxuLy8gcmV0dXJucyBudWxsIGlmIHRyZWUgaXMgZW1wdHlcblRyZWVCYXNlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICBpZihyZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgd2hpbGUocmVzLnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIHJlcyA9IHJlcy5yaWdodDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLmRhdGE7XG59O1xuXG4vLyByZXR1cm5zIGEgbnVsbCBpdGVyYXRvclxuLy8gY2FsbCBuZXh0KCkgb3IgcHJldigpIHRvIHBvaW50IHRvIGFuIGVsZW1lbnRcblRyZWVCYXNlLnByb3RvdHlwZS5pdGVyYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IodGhpcyk7XG59O1xuXG4vLyBjYWxscyBjYiBvbiBlYWNoIG5vZGUncyBkYXRhLCBpbiBvcmRlclxuVHJlZUJhc2UucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBpdD10aGlzLml0ZXJhdG9yKCksIGRhdGE7XG4gICAgd2hpbGUoKGRhdGEgPSBpdC5uZXh0KCkpICE9PSBudWxsKSB7XG4gICAgICAgIGNiKGRhdGEpO1xuICAgIH1cbn07XG5cbi8vIGNhbGxzIGNiIG9uIGVhY2ggbm9kZSdzIGRhdGEsIGluIHJldmVyc2Ugb3JkZXJcblRyZWVCYXNlLnByb3RvdHlwZS5yZWFjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGl0PXRoaXMuaXRlcmF0b3IoKSwgZGF0YTtcbiAgICB3aGlsZSgoZGF0YSA9IGl0LnByZXYoKSkgIT09IG51bGwpIHtcbiAgICAgICAgY2IoZGF0YSk7XG4gICAgfVxufTtcblxuXG5mdW5jdGlvbiBJdGVyYXRvcih0cmVlKSB7XG4gICAgdGhpcy5fdHJlZSA9IHRyZWU7XG4gICAgdGhpcy5fYW5jZXN0b3JzID0gW107XG4gICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbn1cblxuSXRlcmF0b3IucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuLy8gaWYgbnVsbC1pdGVyYXRvciwgcmV0dXJucyBmaXJzdCBub2RlXG4vLyBvdGhlcndpc2UsIHJldHVybnMgbmV4dCBub2RlXG5JdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XG4gICAgICAgIGlmKHJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21pbk5vZGUocm9vdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvci5yaWdodCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm8gZ3JlYXRlciBub2RlIGluIHN1YnRyZWUsIGdvIHVwIHRvIHBhcmVudFxuICAgICAgICAgICAgLy8gaWYgY29taW5nIGZyb20gYSByaWdodCBjaGlsZCwgY29udGludWUgdXAgdGhlIHN0YWNrXG4gICAgICAgICAgICB2YXIgc2F2ZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSh0aGlzLl9jdXJzb3IucmlnaHQgPT09IHNhdmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBuZXh0IG5vZGUgZnJvbSB0aGUgc3VidHJlZVxuICAgICAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2godGhpcy5fY3Vyc29yKTtcbiAgICAgICAgICAgIHRoaXMuX21pbk5vZGUodGhpcy5fY3Vyc29yLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuLy8gaWYgbnVsbC1pdGVyYXRvciwgcmV0dXJucyBsYXN0IG5vZGVcbi8vIG90aGVyd2lzZSwgcmV0dXJucyBwcmV2aW91cyBub2RlXG5JdGVyYXRvci5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XG4gICAgICAgIGlmKHJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21heE5vZGUocm9vdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvci5sZWZ0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgc2F2ZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSh0aGlzLl9jdXJzb3IubGVmdCA9PT0gc2F2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaCh0aGlzLl9jdXJzb3IpO1xuICAgICAgICAgICAgdGhpcy5fbWF4Tm9kZSh0aGlzLl9jdXJzb3IubGVmdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnNvciAhPT0gbnVsbCA/IHRoaXMuX2N1cnNvci5kYXRhIDogbnVsbDtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5fbWluTm9kZSA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgd2hpbGUoc3RhcnQubGVmdCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaChzdGFydCk7XG4gICAgICAgIHN0YXJ0ID0gc3RhcnQubGVmdDtcbiAgICB9XG4gICAgdGhpcy5fY3Vyc29yID0gc3RhcnQ7XG59O1xuXG5JdGVyYXRvci5wcm90b3R5cGUuX21heE5vZGUgPSBmdW5jdGlvbihzdGFydCkge1xuICAgIHdoaWxlKHN0YXJ0LnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHN0YXJ0KTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5yaWdodDtcbiAgICB9XG4gICAgdGhpcy5fY3Vyc29yID0gc3RhcnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVCYXNlO1xuXG4iLCIvKipcbiAqIE5vZGUgJiBicm93c2VyIHNjcmlwdCB0byB0cmFuc2Zvcm0vcHJvamVjdCBnZW9qc29uIGNvb3JkaW5hdGVzXG4gKiBAY29weXJpZ2h0IEFsZXhhbmRlciBNaWxldnNraSA8aW5mb0B3OHIubmFtZT5cbiAqIEBwcmVzZXJ2ZVxuICogQGxpY2Vuc2UgTUlUXG4gKi9cbihmdW5jdGlvbiAoZmFjdG9yeSkgeyAvLyBVTUQgd3JhcHBlclxuXHRpZiAodHlwZW9mIGRlZmluZSA9PT0gJ2Z1bmN0aW9uJyAmJiBkZWZpbmUuYW1kKSB7IC8vIEFNRFxuXHRcdGRlZmluZShmYWN0b3J5KTtcblx0fSBlbHNlIGlmICh0eXBlb2YgbW9kdWxlICAgICAgICAgPT09ICdvYmplY3QnICYmXG4gICAgICAgICAgICAgdHlwZW9mIG1vZHVsZS5leHBvcnRzID09PSBcIm9iamVjdFwiKSB7IC8vIE5vZGUvQ29tbW9uSlNcblx0XHRtb2R1bGUuZXhwb3J0cyA9IGZhY3RvcnkoKTtcblx0fSBlbHNlIHsgLy8gQnJvd3NlciBnbG9iYWxzXG5cdFx0d2luZG93Lmdlb2pzb25Qcm9qZWN0ID0gZmFjdG9yeSgpO1xuXHR9XG59KShmdW5jdGlvbiAoKSB7XG5cbi8qKlxuICogVGFrZXMgaW4gR2VvSlNPTiBhbmQgYXBwbGllcyBhIGZ1bmN0aW9uIHRvIGVhY2ggY29vcmRpbmF0ZSxcbiAqIHdpdGggYSBnaXZlbiBjb250ZXh0XG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIGdlb2pzb25Qcm9qZWN0IChkYXRhLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgaWYgKGRhdGEudHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJykge1xuICAgIC8vIFRoYXQncyBhIGh1Z2UgaGFjayB0byBnZXQgdGhpbmdzIHdvcmtpbmcgd2l0aCBib3RoIEFyY0dJUyBzZXJ2ZXJcbiAgICAvLyBhbmQgR2VvU2VydmVyLiBHZW9zZXJ2ZXIgcHJvdmlkZXMgY3JzIHJlZmVyZW5jZSBpbiBHZW9KU09OLCBBcmNHSVMg4oCUXG4gICAgLy8gZG9lc24ndC5cbiAgICAvL2lmIChkYXRhLmNycykgZGVsZXRlIGRhdGEuY3JzO1xuICAgIGZvciAodmFyIGkgPSBkYXRhLmZlYXR1cmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBkYXRhLmZlYXR1cmVzW2ldID0gcHJvamVjdEZlYXR1cmUoZGF0YS5mZWF0dXJlc1tpXSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRhdGEgPSBwcm9qZWN0RmVhdHVyZShkYXRhLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn07XG5cbmdlb2pzb25Qcm9qZWN0LnByb2plY3RGZWF0dXJlICA9IHByb2plY3RGZWF0dXJlO1xuZ2VvanNvblByb2plY3QucHJvamVjdEdlb21ldHJ5ID0gcHJvamVjdEdlb21ldHJ5O1xuXG5cbi8qKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIHByb2plY3RGZWF0dXJlIChmZWF0dXJlLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIGlmIChmZWF0dXJlLmdlb21ldHJ5LnR5cGUgPT09ICdHZW9tZXRyeUNvbGxlY3Rpb24nKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGZlYXR1cmUuZ2VvbWV0cnkuZ2VvbWV0cmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZmVhdHVyZS5nZW9tZXRyeS5nZW9tZXRyaWVzW2ldID1cbiAgICAgICAgcHJvamVjdEdlb21ldHJ5KGZlYXR1cmUuZ2VvbWV0cnkuZ2VvbWV0cmllc1tpXSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBwcm9qZWN0R2VvbWV0cnkoZmVhdHVyZS5nZW9tZXRyeSwgcHJvamVjdCwgY29udGV4dCk7XG4gIH1cbiAgcmV0dXJuIGZlYXR1cmU7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBkYXRhIEdlb0pTT05cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gcHJvamVjdEdlb21ldHJ5IChnZW9tZXRyeSwgcHJvamVjdCwgY29udGV4dCkge1xuICB2YXIgY29vcmRzID0gZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gIHN3aXRjaCAoZ2VvbWV0cnkudHlwZSkge1xuICAgIGNhc2UgJ1BvaW50JzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdC5jYWxsKGNvbnRleHQsIGNvb3Jkcyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ011bHRpUG9pbnQnOlxuICAgIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvb3Jkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb29yZHNbaV0gPSBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzW2ldKTtcbiAgICAgIH1cbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gY29vcmRzO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdQb2x5Z29uJzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdENvb3Jkcyhjb29yZHMsIDEsIHByb2plY3QsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0Q29vcmRzKGNvb3JkcywgMSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3RDb29yZHMoY29vcmRzLCAyLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBnZW9tZXRyeTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAgeyp9ICAgICAgICAgY29vcmRzIENvb3JkcyBhcnJheXNcbiAqIEBwYXJhbSAge051bWJlcn0gICAgbGV2ZWxzRGVlcFxuICogQHBhcmFtICB7RnVuY3Rpb259ICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHsqfVxuICovXG5mdW5jdGlvbiBwcm9qZWN0Q29vcmRzIChjb29yZHMsIGxldmVsc0RlZXAsIHByb2plY3QsIGNvbnRleHQpIHtcbiAgdmFyIGNvb3JkLCBpLCBsZW47XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBjb29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb29yZCA9IGxldmVsc0RlZXAgP1xuICAgICAgcHJvamVjdENvb3Jkcyhjb29yZHNbaV0sIGxldmVsc0RlZXAgLSAxLCBwcm9qZWN0LCBjb250ZXh0KSA6XG4gICAgICBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzW2ldKTtcblxuICAgIHJlc3VsdC5wdXNoKGNvb3JkKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnJldHVybiBnZW9qc29uUHJvamVjdDtcblxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2luZGV4Jyk7XG4iLCJ2YXIgc2lnbmVkQXJlYSA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcbi8vIHZhciBlcXVhbHMgPSByZXF1aXJlKCcuL2VxdWFscycpO1xuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGUxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBlMlxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN3ZWVwRXZlbnRzQ29tcChlMSwgZTIpIHtcbiAgdmFyIHAxID0gZTEucG9pbnQ7XG4gIHZhciBwMiA9IGUyLnBvaW50O1xuXG4gIC8vIERpZmZlcmVudCB4LWNvb3JkaW5hdGVcbiAgaWYgKHAxWzBdID4gcDJbMF0pIHJldHVybiAxO1xuICBpZiAocDFbMF0gPCBwMlswXSkgcmV0dXJuIC0xO1xuXG4gIC8vIERpZmZlcmVudCBwb2ludHMsIGJ1dCBzYW1lIHgtY29vcmRpbmF0ZVxuICAvLyBFdmVudCB3aXRoIGxvd2VyIHktY29vcmRpbmF0ZSBpcyBwcm9jZXNzZWQgZmlyc3RcbiAgaWYgKHAxWzFdICE9PSBwMlsxXSkgcmV0dXJuIHAxWzFdID4gcDJbMV0gPyAxIDogLTE7XG5cbiAgcmV0dXJuIHNwZWNpYWxDYXNlcyhlMSwgZTIsIHAxLCBwMik7XG59O1xuXG5cbmZ1bmN0aW9uIHNwZWNpYWxDYXNlcyhlMSwgZTIsIHAxLCBwMikge1xuICAvLyBTYW1lIGNvb3JkaW5hdGVzLCBidXQgb25lIGlzIGEgbGVmdCBlbmRwb2ludCBhbmQgdGhlIG90aGVyIGlzXG4gIC8vIGEgcmlnaHQgZW5kcG9pbnQuIFRoZSByaWdodCBlbmRwb2ludCBpcyBwcm9jZXNzZWQgZmlyc3RcbiAgaWYgKGUxLmxlZnQgIT09IGUyLmxlZnQpXG4gICAgcmV0dXJuIGUxLmxlZnQgPyAxIDogLTE7XG5cbiAgLy8gU2FtZSBjb29yZGluYXRlcywgYm90aCBldmVudHNcbiAgLy8gYXJlIGxlZnQgZW5kcG9pbnRzIG9yIHJpZ2h0IGVuZHBvaW50cy5cbiAgLy8gbm90IGNvbGxpbmVhclxuICBpZiAoc2lnbmVkQXJlYSAocDEsIGUxLm90aGVyRXZlbnQucG9pbnQsIGUyLm90aGVyRXZlbnQucG9pbnQpICE9PSAwKSB7XG4gICAgLy8gdGhlIGV2ZW50IGFzc29jaWF0ZSB0byB0aGUgYm90dG9tIHNlZ21lbnQgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gICAgcmV0dXJuICghZTEuaXNCZWxvdyhlMi5vdGhlckV2ZW50LnBvaW50KSkgPyAxIDogLTE7XG4gIH1cblxuICAvLyB1bmNvbW1lbnQgdGhpcyBpZiB5b3Ugd2FudCB0byBwbGF5IHdpdGggbXVsdGlwb2x5Z29uc1xuICAvLyBpZiAoZTEuaXNTdWJqZWN0ID09PSBlMi5pc1N1YmplY3QpIHtcbiAgLy8gICBpZihlcXVhbHMoZTEucG9pbnQsIGUyLnBvaW50KSAmJiBlMS5jb250b3VySWQgPT09IGUyLmNvbnRvdXJJZCkge1xuICAvLyAgICAgcmV0dXJuIDA7XG4gIC8vICAgfSBlbHNlIHtcbiAgLy8gICAgIHJldHVybiBlMS5jb250b3VySWQgPiBlMi5jb250b3VySWQgPyAxIDogLTE7XG4gIC8vICAgfVxuICAvLyB9XG5cbiAgcmV0dXJuICghZTEuaXNTdWJqZWN0ICYmIGUyLmlzU3ViamVjdCkgPyAxIDogLTE7XG59XG4iLCJ2YXIgc2lnbmVkQXJlYSAgICA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcbnZhciBjb21wYXJlRXZlbnRzID0gcmVxdWlyZSgnLi9jb21wYXJlX2V2ZW50cycpO1xudmFyIGVxdWFscyAgICAgICAgPSByZXF1aXJlKCcuL2VxdWFscycpO1xuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gbGUxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBsZTJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wYXJlU2VnbWVudHMobGUxLCBsZTIpIHtcbiAgaWYgKGxlMSA9PT0gbGUyKSByZXR1cm4gMDtcblxuICAvLyBTZWdtZW50cyBhcmUgbm90IGNvbGxpbmVhclxuICBpZiAoc2lnbmVkQXJlYShsZTEucG9pbnQsIGxlMS5vdGhlckV2ZW50LnBvaW50LCBsZTIucG9pbnQpICE9PSAwIHx8XG4gICAgc2lnbmVkQXJlYShsZTEucG9pbnQsIGxlMS5vdGhlckV2ZW50LnBvaW50LCBsZTIub3RoZXJFdmVudC5wb2ludCkgIT09IDApIHtcblxuICAgIC8vIElmIHRoZXkgc2hhcmUgdGhlaXIgbGVmdCBlbmRwb2ludCB1c2UgdGhlIHJpZ2h0IGVuZHBvaW50IHRvIHNvcnRcbiAgICBpZiAoZXF1YWxzKGxlMS5wb2ludCwgbGUyLnBvaW50KSkgcmV0dXJuIGxlMS5pc0JlbG93KGxlMi5vdGhlckV2ZW50LnBvaW50KSA/IC0xIDogMTtcblxuICAgIC8vIERpZmZlcmVudCBsZWZ0IGVuZHBvaW50OiB1c2UgdGhlIGxlZnQgZW5kcG9pbnQgdG8gc29ydFxuICAgIGlmIChsZTEucG9pbnRbMF0gPT09IGxlMi5wb2ludFswXSkgcmV0dXJuIGxlMS5wb2ludFsxXSA8IGxlMi5wb2ludFsxXSA/IC0xIDogMTtcblxuICAgIC8vIGhhcyB0aGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTEgYmVlbiBpbnNlcnRlZFxuICAgIC8vIGludG8gUyBhZnRlciB0aGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTIgP1xuICAgIGlmIChjb21wYXJlRXZlbnRzKGxlMSwgbGUyKSA9PT0gMSkgcmV0dXJuIGxlMi5pc0Fib3ZlKGxlMS5wb2ludCkgPyAtMSA6IDE7XG5cbiAgICAvLyBUaGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTIgaGFzIGJlZW4gaW5zZXJ0ZWRcbiAgICAvLyBpbnRvIFMgYWZ0ZXIgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUxXG4gICAgcmV0dXJuIGxlMS5pc0JlbG93KGxlMi5wb2ludCkgPyAtMSA6IDE7XG4gIH1cblxuICBpZiAobGUxLmlzU3ViamVjdCA9PT0gbGUyLmlzU3ViamVjdCkgeyAvLyBzYW1lIHBvbHlnb25cbiAgICBpZiAoZXF1YWxzKGxlMS5wb2ludCwgbGUyLnBvaW50KSkge1xuICAgICAgaWYgKGVxdWFscyhsZTEub3RoZXJFdmVudC5wb2ludCwgbGUyLm90aGVyRXZlbnQucG9pbnQpKSB7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxlMS5jb250b3VySWQgPiBsZTIuY29udG91cklkID8gMSA6IC0xO1xuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHsgLy8gU2VnbWVudHMgYXJlIGNvbGxpbmVhciwgYnV0IGJlbG9uZyB0byBzZXBhcmF0ZSBwb2x5Z29uc1xuICAgIHJldHVybiBsZTEuaXNTdWJqZWN0ID8gLTEgOiAxO1xuICB9XG5cbiAgcmV0dXJuIGNvbXBhcmVFdmVudHMobGUxLCBsZTIpID09PSAxID8gMSA6IC0xO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcbiAgTk9STUFMOiAgICAgICAgICAgICAgIDAsIFxuICBOT05fQ09OVFJJQlVUSU5HOiAgICAgMSwgXG4gIFNBTUVfVFJBTlNJVElPTjogICAgICAyLCBcbiAgRElGRkVSRU5UX1RSQU5TSVRJT046IDNcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVxdWFscyhwMSwgcDIpIHtcbiAgcmV0dXJuIHAxWzBdID09PSBwMlswXSAmJiBwMVsxXSA9PT0gcDJbMV07XG59OyIsInZhciBJTlRFUlNFQ1RJT04gICAgPSAwO1xudmFyIFVOSU9OICAgICAgICAgICA9IDE7XG52YXIgRElGRkVSRU5DRSAgICAgID0gMjtcbnZhciBYT1IgICAgICAgICAgICAgPSAzO1xuXG52YXIgRU1QVFkgICAgICAgICAgID0gW107XG5cbnZhciBlZGdlVHlwZSAgICAgICAgPSByZXF1aXJlKCcuL2VkZ2VfdHlwZScpO1xuXG52YXIgUXVldWUgICAgICAgICAgID0gcmVxdWlyZSgndGlueXF1ZXVlJyk7XG52YXIgVHJlZSAgICAgICAgICAgID0gcmVxdWlyZSgnYmludHJlZXMnKS5SQlRyZWU7XG52YXIgU3dlZXBFdmVudCAgICAgID0gcmVxdWlyZSgnLi9zd2VlcF9ldmVudCcpO1xuXG52YXIgY29tcGFyZUV2ZW50cyAgID0gcmVxdWlyZSgnLi9jb21wYXJlX2V2ZW50cycpO1xudmFyIGNvbXBhcmVTZWdtZW50cyA9IHJlcXVpcmUoJy4vY29tcGFyZV9zZWdtZW50cycpO1xudmFyIGludGVyc2VjdGlvbiAgICA9IHJlcXVpcmUoJy4vc2VnbWVudF9pbnRlcnNlY3Rpb24nKTtcbnZhciBlcXVhbHMgICAgICAgICAgPSByZXF1aXJlKCcuL2VxdWFscycpO1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbi8vIGdsb2JhbC5UcmVlID0gVHJlZTtcbi8vIGdsb2JhbC5jb21wYXJlU2VnbWVudHMgPSBjb21wYXJlU2VnbWVudHM7XG4vLyBnbG9iYWwuU3dlZXBFdmVudCA9IFN3ZWVwRXZlbnQ7XG4vLyBnbG9iYWwuc2lnbmVkQXJlYSA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcblxuLyoqXG4gKiBAcGFyYW0gIHs8QXJyYXkuPE51bWJlcj59IHMxXG4gKiBAcGFyYW0gIHs8QXJyYXkuPE51bWJlcj59IHMyXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgIGlzU3ViamVjdFxuICogQHBhcmFtICB7UXVldWV9ICAgICAgICAgICBldmVudFF1ZXVlXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gIGJib3hcbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc1NlZ21lbnQoczEsIHMyLCBpc1N1YmplY3QsIGRlcHRoLCBldmVudFF1ZXVlLCBiYm94KSB7XG4gIC8vIFBvc3NpYmxlIGRlZ2VuZXJhdGUgY29uZGl0aW9uLlxuICAvLyBpZiAoZXF1YWxzKHMxLCBzMikpIHJldHVybjtcblxuICB2YXIgZTEgPSBuZXcgU3dlZXBFdmVudChzMSwgZmFsc2UsIHVuZGVmaW5lZCwgaXNTdWJqZWN0KTtcbiAgdmFyIGUyID0gbmV3IFN3ZWVwRXZlbnQoczIsIGZhbHNlLCBlMSwgICAgICAgIGlzU3ViamVjdCk7XG4gIGUxLm90aGVyRXZlbnQgPSBlMjtcblxuICBlMS5jb250b3VySWQgPSBlMi5jb250b3VySWQgPSBkZXB0aDtcblxuICBpZiAoY29tcGFyZUV2ZW50cyhlMSwgZTIpID4gMCkge1xuICAgIGUyLmxlZnQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGUxLmxlZnQgPSB0cnVlO1xuICB9XG5cbiAgYmJveFswXSA9IG1pbihiYm94WzBdLCBzMVswXSk7XG4gIGJib3hbMV0gPSBtaW4oYmJveFsxXSwgczFbMV0pO1xuICBiYm94WzJdID0gbWF4KGJib3hbMl0sIHMxWzBdKTtcbiAgYmJveFszXSA9IG1heChiYm94WzNdLCBzMVsxXSk7XG5cbiAgLy8gUHVzaGluZyBpdCBzbyB0aGUgcXVldWUgaXMgc29ydGVkIGZyb20gbGVmdCB0byByaWdodCxcbiAgLy8gd2l0aCBvYmplY3Qgb24gdGhlIGxlZnQgaGF2aW5nIHRoZSBoaWdoZXN0IHByaW9yaXR5LlxuICBldmVudFF1ZXVlLnB1c2goZTEpO1xuICBldmVudFF1ZXVlLnB1c2goZTIpO1xufVxuXG52YXIgY29udG91cklkID0gMDtcblxuZnVuY3Rpb24gcHJvY2Vzc1BvbHlnb24ocG9seWdvbiwgaXNTdWJqZWN0LCBkZXB0aCwgcXVldWUsIGJib3gpIHtcbiAgdmFyIGksIGxlbjtcbiAgaWYgKHR5cGVvZiBwb2x5Z29uWzBdWzBdID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBvbHlnb24ubGVuZ3RoIC0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBwcm9jZXNzU2VnbWVudChwb2x5Z29uW2ldLCBwb2x5Z29uW2kgKyAxXSwgaXNTdWJqZWN0LCBkZXB0aCArIDEsIHF1ZXVlLCBiYm94KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcG9seWdvbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29udG91cklkKys7XG4gICAgICBwcm9jZXNzUG9seWdvbihwb2x5Z29uW2ldLCBpc1N1YmplY3QsIGNvbnRvdXJJZCwgcXVldWUsIGJib3gpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGZpbGxRdWV1ZShzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94KSB7XG4gIHZhciBldmVudFF1ZXVlID0gbmV3IFF1ZXVlKG51bGwsIGNvbXBhcmVFdmVudHMpO1xuICBjb250b3VySWQgPSAwO1xuXG4gIHByb2Nlc3NQb2x5Z29uKHN1YmplY3QsICB0cnVlLCAgMCwgZXZlbnRRdWV1ZSwgc2Jib3gpO1xuICBwcm9jZXNzUG9seWdvbihjbGlwcGluZywgZmFsc2UsIDAsIGV2ZW50UXVldWUsIGNiYm94KTtcblxuICByZXR1cm4gZXZlbnRRdWV1ZTtcbn1cblxuXG5mdW5jdGlvbiBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LCBzd2VlcExpbmUsIG9wZXJhdGlvbikge1xuICAvLyBjb21wdXRlIGluT3V0IGFuZCBvdGhlckluT3V0IGZpZWxkc1xuICBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgIGV2ZW50LmluT3V0ICAgICAgPSBmYWxzZTtcbiAgICBldmVudC5vdGhlckluT3V0ID0gdHJ1ZTtcblxuICAvLyBwcmV2aW91cyBsaW5lIHNlZ21lbnQgaW4gc3dlZXBsaW5lIGJlbG9uZ3MgdG8gdGhlIHNhbWUgcG9seWdvblxuICB9IGVsc2UgaWYgKGV2ZW50LmlzU3ViamVjdCA9PT0gcHJldi5pc1N1YmplY3QpIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gIXByZXYuaW5PdXQ7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHByZXYub3RoZXJJbk91dDtcblxuICAvLyBwcmV2aW91cyBsaW5lIHNlZ21lbnQgaW4gc3dlZXBsaW5lIGJlbG9uZ3MgdG8gdGhlIGNsaXBwaW5nIHBvbHlnb25cbiAgfSBlbHNlIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gIXByZXYub3RoZXJJbk91dDtcbiAgICBldmVudC5vdGhlckluT3V0ID0gcHJldi5pc1ZlcnRpY2FsKCkgPyAhcHJldi5pbk91dCA6IHByZXYuaW5PdXQ7XG4gIH1cblxuICAvLyBjb21wdXRlIHByZXZJblJlc3VsdCBmaWVsZFxuICBpZiAocHJldikge1xuICAgIGV2ZW50LnByZXZJblJlc3VsdCA9ICghaW5SZXN1bHQocHJldiwgb3BlcmF0aW9uKSB8fCBwcmV2LmlzVmVydGljYWwoKSkgP1xuICAgICAgIHByZXYucHJldkluUmVzdWx0IDogcHJldjtcbiAgfVxuICAvLyBjaGVjayBpZiB0aGUgbGluZSBzZWdtZW50IGJlbG9uZ3MgdG8gdGhlIEJvb2xlYW4gb3BlcmF0aW9uXG4gIGV2ZW50LmluUmVzdWx0ID0gaW5SZXN1bHQoZXZlbnQsIG9wZXJhdGlvbik7XG59XG5cblxuZnVuY3Rpb24gaW5SZXN1bHQoZXZlbnQsIG9wZXJhdGlvbikge1xuICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICBjYXNlIGVkZ2VUeXBlLk5PUk1BTDpcbiAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgICAgIGNhc2UgSU5URVJTRUNUSU9OOlxuICAgICAgICAgIHJldHVybiAhZXZlbnQub3RoZXJJbk91dDtcbiAgICAgICAgY2FzZSBVTklPTjpcbiAgICAgICAgICByZXR1cm4gZXZlbnQub3RoZXJJbk91dDtcbiAgICAgICAgY2FzZSBESUZGRVJFTkNFOlxuICAgICAgICAgIHJldHVybiAoZXZlbnQuaXNTdWJqZWN0ICYmIGV2ZW50Lm90aGVySW5PdXQpIHx8XG4gICAgICAgICAgICAgICAgICghZXZlbnQuaXNTdWJqZWN0ICYmICFldmVudC5vdGhlckluT3V0KTtcbiAgICAgICAgY2FzZSBYT1I6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgY2FzZSBlZGdlVHlwZS5TQU1FX1RSQU5TSVRJT046XG4gICAgICByZXR1cm4gb3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04gfHwgb3BlcmF0aW9uID09PSBVTklPTjtcbiAgICBjYXNlIGVkZ2VUeXBlLkRJRkZFUkVOVF9UUkFOU0lUSU9OOlxuICAgICAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRTtcbiAgICBjYXNlIGVkZ2VUeXBlLk5PTl9DT05UUklCVVRJTkc6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2UxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBzZTJcbiAqIEBwYXJhbSAge1F1ZXVlfSAgICAgIHF1ZXVlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIHBvc3NpYmxlSW50ZXJzZWN0aW9uKHNlMSwgc2UyLCBxdWV1ZSkge1xuICAvLyB0aGF0IGRpc2FsbG93cyBzZWxmLWludGVyc2VjdGluZyBwb2x5Z29ucyxcbiAgLy8gZGlkIGNvc3QgdXMgaGFsZiBhIGRheSwgc28gSSdsbCBsZWF2ZSBpdFxuICAvLyBvdXQgb2YgcmVzcGVjdFxuICAvLyBpZiAoc2UxLmlzU3ViamVjdCA9PT0gc2UyLmlzU3ViamVjdCkgcmV0dXJuO1xuXG4gIHZhciBpbnRlciA9IGludGVyc2VjdGlvbihcbiAgICBzZTEucG9pbnQsIHNlMS5vdGhlckV2ZW50LnBvaW50LFxuICAgIHNlMi5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnRcbiAgKTtcblxuICB2YXIgbmludGVyc2VjdGlvbnMgPSBpbnRlciA/IGludGVyLmxlbmd0aCA6IDA7XG4gIGlmIChuaW50ZXJzZWN0aW9ucyA9PT0gMCkgcmV0dXJuIDA7IC8vIG5vIGludGVyc2VjdGlvblxuXG4gIC8vIHRoZSBsaW5lIHNlZ21lbnRzIGludGVyc2VjdCBhdCBhbiBlbmRwb2ludCBvZiBib3RoIGxpbmUgc2VnbWVudHNcbiAgaWYgKChuaW50ZXJzZWN0aW9ucyA9PT0gMSkgJiZcbiAgICAgIChlcXVhbHMoc2UxLnBvaW50LCBzZTIucG9pbnQpIHx8XG4gICAgICAgZXF1YWxzKHNlMS5vdGhlckV2ZW50LnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludCkpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDIgJiYgc2UxLmlzU3ViamVjdCA9PT0gc2UyLmlzU3ViamVjdCl7XG4gICAgaWYoc2UxLmNvbnRvdXJJZCA9PT0gc2UyLmNvbnRvdXJJZCl7XG4gICAgY29uc29sZS53YXJuKCdFZGdlcyBvZiB0aGUgc2FtZSBwb2x5Z29uIG92ZXJsYXAnLFxuICAgICAgc2UxLnBvaW50LCBzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludCk7XG4gICAgfVxuICAgIC8vdGhyb3cgbmV3IEVycm9yKCdFZGdlcyBvZiB0aGUgc2FtZSBwb2x5Z29uIG92ZXJsYXAnKTtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFRoZSBsaW5lIHNlZ21lbnRzIGFzc29jaWF0ZWQgdG8gc2UxIGFuZCBzZTIgaW50ZXJzZWN0XG4gIGlmIChuaW50ZXJzZWN0aW9ucyA9PT0gMSkge1xuXG4gICAgLy8gaWYgdGhlIGludGVyc2VjdGlvbiBwb2ludCBpcyBub3QgYW4gZW5kcG9pbnQgb2Ygc2UxXG4gICAgaWYgKCFlcXVhbHMoc2UxLnBvaW50LCBpbnRlclswXSkgJiYgIWVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgaW50ZXJbMF0pKSB7XG4gICAgICBkaXZpZGVTZWdtZW50KHNlMSwgaW50ZXJbMF0sIHF1ZXVlKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50IGlzIG5vdCBhbiBlbmRwb2ludCBvZiBzZTJcbiAgICBpZiAoIWVxdWFscyhzZTIucG9pbnQsIGludGVyWzBdKSAmJiAhZXF1YWxzKHNlMi5vdGhlckV2ZW50LnBvaW50LCBpbnRlclswXSkpIHtcbiAgICAgIGRpdmlkZVNlZ21lbnQoc2UyLCBpbnRlclswXSwgcXVldWUpO1xuICAgIH1cbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIC8vIFRoZSBsaW5lIHNlZ21lbnRzIGFzc29jaWF0ZWQgdG8gc2UxIGFuZCBzZTIgb3ZlcmxhcFxuICB2YXIgZXZlbnRzICAgICAgICA9IFtdO1xuICB2YXIgbGVmdENvaW5jaWRlICA9IGZhbHNlO1xuICB2YXIgcmlnaHRDb2luY2lkZSA9IGZhbHNlO1xuXG4gIGlmIChlcXVhbHMoc2UxLnBvaW50LCBzZTIucG9pbnQpKSB7XG4gICAgbGVmdENvaW5jaWRlID0gdHJ1ZTsgLy8gbGlua2VkXG4gIH0gZWxzZSBpZiAoY29tcGFyZUV2ZW50cyhzZTEsIHNlMikgPT09IDEpIHtcbiAgICBldmVudHMucHVzaChzZTIsIHNlMSk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLnB1c2goc2UxLCBzZTIpO1xuICB9XG5cbiAgaWYgKGVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpKSB7XG4gICAgcmlnaHRDb2luY2lkZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoY29tcGFyZUV2ZW50cyhzZTEub3RoZXJFdmVudCwgc2UyLm90aGVyRXZlbnQpID09PSAxKSB7XG4gICAgZXZlbnRzLnB1c2goc2UyLm90aGVyRXZlbnQsIHNlMS5vdGhlckV2ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHMucHVzaChzZTEub3RoZXJFdmVudCwgc2UyLm90aGVyRXZlbnQpO1xuICB9XG5cbiAgaWYgKChsZWZ0Q29pbmNpZGUgJiYgcmlnaHRDb2luY2lkZSkgfHwgbGVmdENvaW5jaWRlKSB7XG4gICAgLy8gYm90aCBsaW5lIHNlZ21lbnRzIGFyZSBlcXVhbCBvciBzaGFyZSB0aGUgbGVmdCBlbmRwb2ludFxuICAgIHNlMS50eXBlID0gZWRnZVR5cGUuTk9OX0NPTlRSSUJVVElORztcbiAgICBzZTIudHlwZSA9IChzZTEuaW5PdXQgPT09IHNlMi5pbk91dCkgP1xuICAgICAgZWRnZVR5cGUuU0FNRV9UUkFOU0lUSU9OIDpcbiAgICAgIGVkZ2VUeXBlLkRJRkZFUkVOVF9UUkFOU0lUSU9OO1xuXG4gICAgaWYgKGxlZnRDb2luY2lkZSAmJiAhcmlnaHRDb2luY2lkZSkge1xuICAgICAgLy8gaG9uZXN0bHkgbm8gaWRlYSwgYnV0IGNoYW5naW5nIGV2ZW50cyBzZWxlY3Rpb24gZnJvbSBbMiwgMV1cbiAgICAgIC8vIHRvIFswLCAxXSBmaXhlcyB0aGUgb3ZlcmxhcHBpbmcgc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvbnMgaXNzdWVcbiAgICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLm90aGVyRXZlbnQsIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICAgIH1cbiAgICByZXR1cm4gMjtcbiAgfVxuXG4gIC8vIHRoZSBsaW5lIHNlZ21lbnRzIHNoYXJlIHRoZSByaWdodCBlbmRwb2ludFxuICBpZiAocmlnaHRDb2luY2lkZSkge1xuICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIC8vIG5vIGxpbmUgc2VnbWVudCBpbmNsdWRlcyB0b3RhbGx5IHRoZSBvdGhlciBvbmVcbiAgaWYgKGV2ZW50c1swXSAhPT0gZXZlbnRzWzNdLm90aGVyRXZlbnQpIHtcbiAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gICAgZGl2aWRlU2VnbWVudChldmVudHNbMV0sIGV2ZW50c1syXS5wb2ludCwgcXVldWUpO1xuICAgIHJldHVybiAzO1xuICB9XG5cbiAgLy8gb25lIGxpbmUgc2VnbWVudCBpbmNsdWRlcyB0aGUgb3RoZXIgb25lXG4gIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgZGl2aWRlU2VnbWVudChldmVudHNbM10ub3RoZXJFdmVudCwgZXZlbnRzWzJdLnBvaW50LCBxdWV1ZSk7XG5cbiAgcmV0dXJuIDM7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBzZVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHBcbiAqIEBwYXJhbSAge1F1ZXVlfSBxdWV1ZVxuICogQHJldHVybiB7UXVldWV9XG4gKi9cbmZ1bmN0aW9uIGRpdmlkZVNlZ21lbnQoc2UsIHAsIHF1ZXVlKSAge1xuICB2YXIgciA9IG5ldyBTd2VlcEV2ZW50KHAsIGZhbHNlLCBzZSwgICAgICAgICAgICBzZS5pc1N1YmplY3QpO1xuICB2YXIgbCA9IG5ldyBTd2VlcEV2ZW50KHAsIHRydWUsICBzZS5vdGhlckV2ZW50LCBzZS5pc1N1YmplY3QpO1xuXG4gIGlmIChlcXVhbHMoc2UucG9pbnQsIHNlLm90aGVyRXZlbnQucG9pbnQpKSB7XG4gICAgY29uc29sZS53YXJuKCd3aGF0IGlzIHRoYXQ/Jywgc2UpO1xuICB9XG5cbiAgci5jb250b3VySWQgPSBsLmNvbnRvdXJJZCA9IHNlLmNvbnRvdXJJZDtcblxuICAvLyBhdm9pZCBhIHJvdW5kaW5nIGVycm9yLiBUaGUgbGVmdCBldmVudCB3b3VsZCBiZSBwcm9jZXNzZWQgYWZ0ZXIgdGhlIHJpZ2h0IGV2ZW50XG4gIGlmIChjb21wYXJlRXZlbnRzKGwsIHNlLm90aGVyRXZlbnQpID4gMCkge1xuICAgIHNlLm90aGVyRXZlbnQubGVmdCA9IHRydWU7XG4gICAgbC5sZWZ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBhdm9pZCBhIHJvdW5kaW5nIGVycm9yLiBUaGUgbGVmdCBldmVudCB3b3VsZCBiZSBwcm9jZXNzZWQgYWZ0ZXIgdGhlIHJpZ2h0IGV2ZW50XG4gIC8vIGlmIChjb21wYXJlRXZlbnRzKHNlLCByKSA+IDApIHt9XG5cbiAgc2Uub3RoZXJFdmVudC5vdGhlckV2ZW50ID0gbDtcbiAgc2Uub3RoZXJFdmVudCA9IHI7XG5cbiAgcXVldWUucHVzaChsKTtcbiAgcXVldWUucHVzaChyKTtcblxuICByZXR1cm4gcXVldWU7XG59XG5cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMsIG5vLWRlYnVnZ2VyICovXG5mdW5jdGlvbiBpdGVyYXRvckVxdWFscyhpdDEsIGl0Mikge1xuICByZXR1cm4gaXQxLl9jdXJzb3IgPT09IGl0Mi5fY3Vyc29yO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBwb3MsIGV2ZW50KSB7XG4gIHZhciBtYXAgPSB3aW5kb3cubWFwO1xuICBpZiAoIW1hcCkgcmV0dXJuO1xuICBpZiAod2luZG93LnN3cykgd2luZG93LnN3cy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICBtYXAucmVtb3ZlTGF5ZXIocCk7XG4gIH0pO1xuICB3aW5kb3cuc3dzID0gW107XG4gIHN3ZWVwTGluZS5lYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgcG9seSA9IEwucG9seWxpbmUoW2UucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCksIGUub3RoZXJFdmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKV0sIHsgY29sb3I6ICdncmVlbicgfSkuYWRkVG8obWFwKTtcbiAgICB3aW5kb3cuc3dzLnB1c2gocG9seSk7XG4gIH0pO1xuXG4gIGlmICh3aW5kb3cudnQpIG1hcC5yZW1vdmVMYXllcih3aW5kb3cudnQpO1xuICB2YXIgdiA9IHBvcy5zbGljZSgpO1xuICB2YXIgYiA9IG1hcC5nZXRCb3VuZHMoKTtcbiAgd2luZG93LnZ0ID0gTC5wb2x5bGluZShbW2IuZ2V0Tm9ydGgoKSwgdlswXV0sIFtiLmdldFNvdXRoKCksIHZbMF1dXSwge2NvbG9yOiAnZ3JlZW4nLCB3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xuXG4gIGlmICh3aW5kb3cucHMpIG1hcC5yZW1vdmVMYXllcih3aW5kb3cucHMpO1xuICB3aW5kb3cucHMgPSBMLnBvbHlsaW5lKFtldmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKSwgZXZlbnQub3RoZXJFdmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKV0sIHtjb2xvcjogJ2JsYWNrJywgd2VpZ2h0OiA5LCBvcGFjaXR5OiAwLjR9KS5hZGRUbyhtYXApO1xuICBkZWJ1Z2dlcjtcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMsIG5vLWRlYnVnZ2VyICovXG5cblxuZnVuY3Rpb24gc3ViZGl2aWRlU2VnbWVudHMoZXZlbnRRdWV1ZSwgc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKSB7XG4gIHZhciBzb3J0ZWRFdmVudHMgPSBbXTtcbiAgdmFyIHByZXYsIG5leHQ7XG5cbiAgdmFyIHN3ZWVwTGluZSA9IG5ldyBUcmVlKGNvbXBhcmVTZWdtZW50cyk7XG4gIHZhciBzb3J0ZWRFdmVudHMgPSBbXTtcblxuICB2YXIgcmlnaHRib3VuZCA9IG1pbihzYmJveFsyXSwgY2Jib3hbMl0pO1xuXG4gIHZhciBwcmV2LCBuZXh0O1xuXG4gIHdoaWxlIChldmVudFF1ZXVlLmxlbmd0aCkge1xuICAgIHZhciBldmVudCA9IGV2ZW50UXVldWUucG9wKCk7XG4gICAgc29ydGVkRXZlbnRzLnB1c2goZXZlbnQpO1xuXG4gICAgLy8gb3B0aW1pemF0aW9uIGJ5IGJib3hlcyBmb3IgaW50ZXJzZWN0aW9uIGFuZCBkaWZmZXJlbmNlIGdvZXMgaGVyZVxuICAgIGlmICgob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04gJiYgZXZlbnQucG9pbnRbMF0gPiByaWdodGJvdW5kKSB8fFxuICAgICAgICAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFICAgJiYgZXZlbnQucG9pbnRbMF0gPiBzYmJveFsyXSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChldmVudC5sZWZ0KSB7XG4gICAgICBzd2VlcExpbmUuaW5zZXJ0KGV2ZW50KTtcbiAgICAgIC8vIF9yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBldmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBuZXh0ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcbiAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuICAgICAgZXZlbnQuaXRlcmF0b3IgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuXG4gICAgICAvLyBDYW5ub3QgZ2V0IG91dCBvZiB0aGUgdHJlZSB3aGF0IHdlIGp1c3QgcHV0IHRoZXJlXG4gICAgICBpZiAoIXByZXYgfHwgIW5leHQpIHtcbiAgICAgICAgY29uc29sZS5sb2coJ2JydXRlJyk7XG4gICAgICAgIHZhciBpdGVyYXRvcnMgPSBmaW5kSXRlckJydXRlKHN3ZWVwTGluZSk7XG4gICAgICAgIHByZXYgPSBpdGVyYXRvcnNbMF07XG4gICAgICAgIG5leHQgPSBpdGVyYXRvcnNbMV07XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgIHByZXYucHJldigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldiA9IHN3ZWVwTGluZS5pdGVyYXRvcigpOyAvL2ZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgIHByZXYucHJldigpO1xuICAgICAgICBwcmV2Lm5leHQoKTtcbiAgICAgIH1cbiAgICAgIG5leHQubmV4dCgpO1xuXG4gICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuXG4gICAgICBpZiAobmV4dC5kYXRhKCkpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlSW50ZXJzZWN0aW9uKGV2ZW50LCBuZXh0LmRhdGEoKSwgZXZlbnRRdWV1ZSkgPT09IDIpIHtcbiAgICAgICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIG5leHQuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYuZGF0YSgpKSB7XG4gICAgICAgIGlmIChwb3NzaWJsZUludGVyc2VjdGlvbihwcmV2LmRhdGEoKSwgZXZlbnQsIGV2ZW50UXVldWUpID09PSAyKSB7XG4gICAgICAgICAgdmFyIHByZXZwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHByZXYuZGF0YSgpKTtcbiAgICAgICAgICBpZiAocHJldnByZXYuZGF0YSgpICE9PSBzd2VlcExpbmUubWluKCkpIHtcbiAgICAgICAgICAgIHByZXZwcmV2LnByZXYoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJldnByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoc3dlZXBMaW5lLm1heCgpKTtcbiAgICAgICAgICAgIHByZXZwcmV2Lm5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhwcmV2LmRhdGEoKSwgcHJldnByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudCA9IGV2ZW50Lm90aGVyRXZlbnQ7XG4gICAgICBuZXh0ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcbiAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuXG4gICAgICAvLyBfcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgZXZlbnQub3RoZXJFdmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBpZiAoIShwcmV2ICYmIG5leHQpKSBjb250aW51ZTtcblxuICAgICAgaWYgKHByZXYuZGF0YSgpICE9PSBzd2VlcExpbmUubWluKCkpIHtcbiAgICAgICAgcHJldi5wcmV2KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2ID0gc3dlZXBMaW5lLml0ZXJhdG9yKCk7XG4gICAgICAgIHByZXYucHJldigpOyAvLyBzd2VlcExpbmUuZmluZEl0ZXIoc3dlZXBMaW5lLm1heCgpKTtcbiAgICAgICAgcHJldi5uZXh0KCk7XG4gICAgICB9XG4gICAgICBuZXh0Lm5leHQoKTtcbiAgICAgIHN3ZWVwTGluZS5yZW1vdmUoZXZlbnQpO1xuXG4gICAgICAvL19yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBldmVudC5vdGhlckV2ZW50LnBvaW50LCBldmVudCk7XG5cbiAgICAgIGlmIChuZXh0LmRhdGEoKSAmJiBwcmV2LmRhdGEoKSkge1xuICAgICAgICBwb3NzaWJsZUludGVyc2VjdGlvbihwcmV2LmRhdGEoKSwgbmV4dC5kYXRhKCksIGV2ZW50UXVldWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc29ydGVkRXZlbnRzO1xufVxuXG5mdW5jdGlvbiBmaW5kSXRlckJydXRlKHN3ZWVwTGluZSwgcSkge1xuICB2YXIgcHJldiA9IHN3ZWVwTGluZS5pdGVyYXRvcigpO1xuICB2YXIgbmV4dCA9IHN3ZWVwTGluZS5pdGVyYXRvcigpO1xuICB2YXIgaXQgICA9IHN3ZWVwTGluZS5pdGVyYXRvcigpLCBkYXRhO1xuICB3aGlsZSgoZGF0YSA9IGl0Lm5leHQoKSkgIT09IG51bGwpIHtcbiAgICBwcmV2Lm5leHQoKTtcbiAgICBuZXh0Lm5leHQoKTtcbiAgICBpZiAoZGF0YSA9PT0gZXZlbnQpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuICByZXR1cm4gW3ByZXYsIG5leHRdO1xufVxuXG5cbmZ1bmN0aW9uIHN3YXAgKGFyciwgaSwgbikge1xuICB2YXIgdGVtcCA9IGFycltpXTtcbiAgYXJyW2ldID0gYXJyW25dO1xuICBhcnJbbl0gPSB0ZW1wO1xufVxuXG5cbmZ1bmN0aW9uIGNoYW5nZU9yaWVudGF0aW9uKGNvbnRvdXIpIHtcbiAgcmV0dXJuIGNvbnRvdXIucmV2ZXJzZSgpO1xufVxuXG5cbmZ1bmN0aW9uIGlzQXJyYXkgKGFycikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cblxuZnVuY3Rpb24gYWRkSG9sZShjb250b3VyLCBpZHgpIHtcbiAgaWYgKGlzQXJyYXkoY29udG91clswXSkgJiYgIWlzQXJyYXkoY29udG91clswXVswXSkpIHtcbiAgICBjb250b3VyID0gW2NvbnRvdXJdO1xuICB9XG4gIGNvbnRvdXJbaWR4XSA9IFtdO1xuICByZXR1cm4gY29udG91cjtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxTd2VlcEV2ZW50Pn0gc29ydGVkRXZlbnRzXG4gKiBAcmV0dXJuIHtBcnJheS48U3dlZXBFdmVudD59XG4gKi9cbmZ1bmN0aW9uIG9yZGVyRXZlbnRzKHNvcnRlZEV2ZW50cykge1xuICB2YXIgZXZlbnQsIGksIGxlbjtcbiAgdmFyIHJlc3VsdEV2ZW50cyA9IFtdO1xuICBmb3IgKGkgPSAwLCBsZW4gPSBzb3J0ZWRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBldmVudCA9IHNvcnRlZEV2ZW50c1tpXTtcbiAgICBpZiAoKGV2ZW50LmxlZnQgJiYgZXZlbnQuaW5SZXN1bHQpIHx8XG4gICAgICAoIWV2ZW50LmxlZnQgJiYgZXZlbnQub3RoZXJFdmVudC5pblJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdEV2ZW50cy5wdXNoKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBEdWUgdG8gb3ZlcmxhcHBpbmcgZWRnZXMgdGhlIHJlc3VsdEV2ZW50cyBhcnJheSBjYW4gYmUgbm90IHdob2xseSBzb3J0ZWRcbiAgdmFyIHNvcnRlZCA9IGZhbHNlO1xuICB3aGlsZSAoIXNvcnRlZCkge1xuICAgIHNvcnRlZCA9IHRydWU7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoKGkgKyAxKSA8IGxlbiAmJlxuICAgICAgICBjb21wYXJlRXZlbnRzKHJlc3VsdEV2ZW50c1tpXSwgcmVzdWx0RXZlbnRzW2kgKyAxXSkgPT09IDEpIHtcbiAgICAgICAgc3dhcChyZXN1bHRFdmVudHMsIGksIGkgKyAxKTtcbiAgICAgICAgc29ydGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcmVzdWx0RXZlbnRzW2ldLnBvcyA9IGk7XG4gIH1cblxuICBmb3IgKGkgPSAwLCBsZW4gPSByZXN1bHRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAoIXJlc3VsdEV2ZW50c1tpXS5sZWZ0KSB7XG4gICAgICB2YXIgdGVtcCA9IHJlc3VsdEV2ZW50c1tpXS5wb3M7XG4gICAgICByZXN1bHRFdmVudHNbaV0ucG9zID0gcmVzdWx0RXZlbnRzW2ldLm90aGVyRXZlbnQucG9zO1xuICAgICAgcmVzdWx0RXZlbnRzW2ldLm90aGVyRXZlbnQucG9zID0gdGVtcDtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gcmVzdWx0RXZlbnRzO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPFN3ZWVwRXZlbnQ+fSBzb3J0ZWRFdmVudHNcbiAqIEByZXR1cm4ge0FycmF5LjwqPn0gcG9seWdvbnNcbiAqL1xuZnVuY3Rpb24gY29ubmVjdEVkZ2VzKHNvcnRlZEV2ZW50cykge1xuICB2YXIgaSwgbGVuO1xuICB2YXIgcmVzdWx0RXZlbnRzID0gb3JkZXJFdmVudHMoc29ydGVkRXZlbnRzKTtcblxuXG4gIC8vIFwiZmFsc2VcIi1maWxsZWQgYXJyYXlcbiAgdmFyIHByb2Nlc3NlZCA9IEFycmF5KHJlc3VsdEV2ZW50cy5sZW5ndGgpO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgdmFyIGRlcHRoICA9IFtdO1xuICB2YXIgaG9sZU9mID0gW107XG4gIHZhciBpc0hvbGUgPSB7fTtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSByZXN1bHRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAocHJvY2Vzc2VkW2ldKSBjb250aW51ZTtcblxuICAgIHZhciBjb250b3VyID0gW107XG4gICAgcmVzdWx0LnB1c2goY29udG91cik7XG5cbiAgICB2YXIgcmluZ0lkID0gcmVzdWx0Lmxlbmd0aCAtIDE7XG4gICAgZGVwdGgucHVzaCgwKTtcbiAgICBob2xlT2YucHVzaCgtMSk7XG5cblxuICAgIGlmIChyZXN1bHRFdmVudHNbaV0ucHJldkluUmVzdWx0KSB7XG4gICAgICB2YXIgbG93ZXJDb250b3VySWQgPSByZXN1bHRFdmVudHNbaV0ucHJldkluUmVzdWx0LmNvbnRvdXJJZDtcbiAgICAgIGlmICghcmVzdWx0RXZlbnRzW2ldLnByZXZJblJlc3VsdC5yZXN1bHRJbk91dCkge1xuICAgICAgICBhZGRIb2xlKHJlc3VsdFtsb3dlckNvbnRvdXJJZF0sIHJpbmdJZCk7XG4gICAgICAgIGhvbGVPZltyaW5nSWRdID0gbG93ZXJDb250b3VySWQ7XG4gICAgICAgIGRlcHRoW3JpbmdJZF0gID0gZGVwdGhbbG93ZXJDb250b3VySWRdICsgMTtcbiAgICAgICAgaXNIb2xlW3JpbmdJZF0gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpc0hvbGVbbG93ZXJDb250b3VySWRdKSB7XG4gICAgICAgIGFkZEhvbGUocmVzdWx0W2hvbGVPZltsb3dlckNvbnRvdXJJZF1dLCByaW5nSWQpO1xuICAgICAgICBob2xlT2ZbcmluZ0lkXSA9IGhvbGVPZltsb3dlckNvbnRvdXJJZF07XG4gICAgICAgIGRlcHRoW3JpbmdJZF0gID0gZGVwdGhbbG93ZXJDb250b3VySWRdO1xuICAgICAgICBpc0hvbGVbcmluZ0lkXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHBvcyA9IGk7XG4gICAgdmFyIGluaXRpYWwgPSByZXN1bHRFdmVudHNbaV0ucG9pbnQ7XG4gICAgY29udG91ci5wdXNoKGluaXRpYWwpO1xuXG4gICAgd2hpbGUgKHBvcyA+PSBpKSB7XG4gICAgICBwcm9jZXNzZWRbcG9zXSA9IHRydWU7XG5cbiAgICAgIGlmIChyZXN1bHRFdmVudHNbcG9zXS5sZWZ0KSB7XG4gICAgICAgIHJlc3VsdEV2ZW50c1twb3NdLnJlc3VsdEluT3V0ID0gZmFsc2U7XG4gICAgICAgIHJlc3VsdEV2ZW50c1twb3NdLmNvbnRvdXJJZCAgID0gcmluZ0lkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5yZXN1bHRJbk91dCA9IHRydWU7XG4gICAgICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQuY29udG91cklkICAgPSByaW5nSWQ7XG4gICAgICB9XG5cbiAgICAgIHBvcyA9IHJlc3VsdEV2ZW50c1twb3NdLnBvcztcbiAgICAgIHByb2Nlc3NlZFtwb3NdID0gdHJ1ZTtcblxuICAgICAgY29udG91ci5wdXNoKHJlc3VsdEV2ZW50c1twb3NdLnBvaW50KTtcbiAgICAgIHBvcyA9IG5leHRQb3MocG9zLCByZXN1bHRFdmVudHMsIHByb2Nlc3NlZCk7XG4gICAgfVxuXG4gICAgcG9zID0gcG9zID09PSAtMSA/IGkgOiBwb3M7XG5cbiAgICBwcm9jZXNzZWRbcG9zXSA9IHByb2Nlc3NlZFtyZXN1bHRFdmVudHNbcG9zXS5wb3NdID0gdHJ1ZTtcbiAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LnJlc3VsdEluT3V0ID0gdHJ1ZTtcbiAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LmNvbnRvdXJJZCAgID0gcmluZ0lkO1xuXG5cbiAgICAvLyBkZXB0aCBpcyBldmVuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSAqL1xuICAgIGlmIChkZXB0aFtyaW5nSWRdICYgMSkge1xuICAgICAgY2hhbmdlT3JpZW50YXRpb24oY29udG91cik7XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgbm8tYml0d2lzZSAqL1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gcG9zXG4gKiBAcGFyYW0gIHtBcnJheS48U3dlZXBFdmVudD59IHJlc3VsdEV2ZW50c1xuICogQHBhcmFtICB7QXJyYXkuPEJvb2xlYW4+fSAgICBwcm9jZXNzZWRcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gbmV4dFBvcyhwb3MsIHJlc3VsdEV2ZW50cywgcHJvY2Vzc2VkKSB7XG4gIHZhciBuZXdQb3MgPSBwb3MgKyAxO1xuICB2YXIgbGVuZ3RoID0gcmVzdWx0RXZlbnRzLmxlbmd0aDtcbiAgd2hpbGUgKG5ld1BvcyA8IGxlbmd0aCAmJlxuICAgICAgICAgZXF1YWxzKHJlc3VsdEV2ZW50c1tuZXdQb3NdLnBvaW50LCByZXN1bHRFdmVudHNbcG9zXS5wb2ludCkpIHtcbiAgICBpZiAoIXByb2Nlc3NlZFtuZXdQb3NdKSB7XG4gICAgICByZXR1cm4gbmV3UG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdQb3MgPSBuZXdQb3MgKyAxO1xuICAgIH1cbiAgfVxuXG4gIG5ld1BvcyA9IHBvcyAtIDE7XG5cbiAgd2hpbGUgKHByb2Nlc3NlZFtuZXdQb3NdKSB7XG4gICAgbmV3UG9zID0gbmV3UG9zIC0gMTtcbiAgfVxuICByZXR1cm4gbmV3UG9zO1xufVxuXG5cbmZ1bmN0aW9uIHRyaXZpYWxPcGVyYXRpb24oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbikge1xuICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgaWYgKHN1YmplY3QubGVuZ3RoICogY2xpcHBpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OKSB7XG4gICAgICByZXN1bHQgPSBFTVBUWTtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSkge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gVU5JT04gfHwgb3BlcmF0aW9uID09PSBYT1IpIHtcbiAgICAgIHJlc3VsdCA9IChzdWJqZWN0Lmxlbmd0aCA9PT0gMCkgPyBjbGlwcGluZyA6IHN1YmplY3Q7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gY29tcGFyZUJCb3hlcyhzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pIHtcbiAgdmFyIHJlc3VsdCA9IG51bGw7XG4gIGlmIChzYmJveFswXSA+IGNiYm94WzJdIHx8XG4gICAgICBjYmJveFswXSA+IHNiYm94WzJdIHx8XG4gICAgICBzYmJveFsxXSA+IGNiYm94WzNdIHx8XG4gICAgICBjYmJveFsxXSA+IHNiYm94WzNdKSB7XG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OKSB7XG4gICAgICByZXN1bHQgPSBFTVBUWTtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSkge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gVU5JT04gfHwgb3BlcmF0aW9uID09PSBYT1IpIHtcbiAgICAgIHJlc3VsdCA9IHN1YmplY3QuY29uY2F0KGNsaXBwaW5nKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5mdW5jdGlvbiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBvcGVyYXRpb24pIHtcbiAgdmFyIHRyaXZpYWwgPSB0cml2aWFsT3BlcmF0aW9uKHN1YmplY3QsIGNsaXBwaW5nLCBvcGVyYXRpb24pO1xuICBpZiAodHJpdmlhbCkge1xuICAgIHJldHVybiB0cml2aWFsID09PSBFTVBUWSA/IG51bGwgOiB0cml2aWFsO1xuICB9XG4gIHZhciBzYmJveCA9IFtJbmZpbml0eSwgSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5XTtcbiAgdmFyIGNiYm94ID0gW0luZmluaXR5LCBJbmZpbml0eSwgLUluZmluaXR5LCAtSW5maW5pdHldO1xuXG4gIHZhciBldmVudFF1ZXVlID0gZmlsbFF1ZXVlKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gpO1xuXG4gIHRyaXZpYWwgPSBjb21wYXJlQkJveGVzKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbik7XG4gIGlmICh0cml2aWFsKSB7XG4gICAgcmV0dXJuIHRyaXZpYWwgPT09IEVNUFRZID8gbnVsbCA6IHRyaXZpYWw7XG4gIH1cbiAgdmFyIHNvcnRlZEV2ZW50cyA9IHN1YmRpdmlkZVNlZ21lbnRzKGV2ZW50UXVldWUsIHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbik7XG4gIHJldHVybiBjb25uZWN0RWRnZXMoc29ydGVkRXZlbnRzKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGJvb2xlYW47XG5cblxubW9kdWxlLmV4cG9ydHMudW5pb24gPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgVU5JT04pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy5kaWZmID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIERJRkZFUkVOQ0UpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy54b3IgPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgWE9SKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIElOVEVSU0VDVElPTik7XG59O1xuXG5cbi8qKlxuICogQGVudW0ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMub3BlcmF0aW9ucyA9IHtcbiAgSU5URVJTRUNUSU9OOiBJTlRFUlNFQ1RJT04sXG4gIERJRkZFUkVOQ0U6ICAgRElGRkVSRU5DRSxcbiAgVU5JT046ICAgICAgICBVTklPTixcbiAgWE9SOiAgICAgICAgICBYT1Jcbn07XG5cblxuLy8gZm9yIHRlc3Rpbmdcbm1vZHVsZS5leHBvcnRzLmZpbGxRdWV1ZSAgICAgICAgICAgID0gZmlsbFF1ZXVlO1xubW9kdWxlLmV4cG9ydHMuY29tcHV0ZUZpZWxkcyAgICAgICAgPSBjb21wdXRlRmllbGRzO1xubW9kdWxlLmV4cG9ydHMuc3ViZGl2aWRlU2VnbWVudHMgICAgPSBzdWJkaXZpZGVTZWdtZW50cztcbm1vZHVsZS5leHBvcnRzLmRpdmlkZVNlZ21lbnQgICAgICAgID0gZGl2aWRlU2VnbWVudDtcbm1vZHVsZS5leHBvcnRzLnBvc3NpYmxlSW50ZXJzZWN0aW9uID0gcG9zc2libGVJbnRlcnNlY3Rpb247XG4iLCJ2YXIgRVBTSUxPTiA9IDFlLTk7XG5cbi8qKlxuICogRmluZHMgdGhlIG1hZ25pdHVkZSBvZiB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9ycyAoaWYgd2UgcHJldGVuZFxuICogdGhleSdyZSBpbiB0aHJlZSBkaW1lbnNpb25zKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIEZpcnN0IHZlY3RvclxuICogQHBhcmFtIHtPYmplY3R9IGIgU2Vjb25kIHZlY3RvclxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBtYWduaXR1ZGUgb2YgdGhlIGNyb3NzIHByb2R1Y3RcbiAqL1xuZnVuY3Rpb24ga3Jvc3NQcm9kdWN0KGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF07XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIEZpcnN0IHZlY3RvclxuICogQHBhcmFtIHtPYmplY3R9IGIgU2Vjb25kIHZlY3RvclxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBkb3QgcHJvZHVjdFxuICovXG5mdW5jdGlvbiBkb3RQcm9kdWN0KGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV07XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGludGVyc2VjdGlvbiAoaWYgYW55KSBiZXR3ZWVuIHR3byBsaW5lIHNlZ21lbnRzIGEgYW5kIGIsIGdpdmVuIHRoZVxuICogbGluZSBzZWdtZW50cycgZW5kIHBvaW50cyBhMSwgYTIgYW5kIGIxLCBiMi5cbiAqXG4gKiBUaGlzIGFsZ29yaXRobSBpcyBiYXNlZCBvbiBTY2huZWlkZXIgYW5kIEViZXJseS5cbiAqIGh0dHA6Ly93d3cuY2ltZWMub3JnLmFyL35uY2Fsdm8vU2NobmVpZGVyX0ViZXJseS5wZGZcbiAqIFBhZ2UgMjQ0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGExIHBvaW50IG9mIGZpcnN0IGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGEyIHBvaW50IG9mIGZpcnN0IGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGIxIHBvaW50IG9mIHNlY29uZCBsaW5lXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBiMiBwb2ludCBvZiBzZWNvbmQgbGluZVxuICogQHBhcmFtIHtCb29sZWFuPX0gICAgICAgbm9FbmRwb2ludFRvdWNoIHdoZXRoZXIgdG8gc2tpcCBzaW5nbGUgdG91Y2hwb2ludHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobWVhbmluZyBjb25uZWN0ZWQgc2VnbWVudHMpIGFzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0aW9uc1xuICogQHJldHVybnMge0FycmF5LjxBcnJheS48TnVtYmVyPj58TnVsbH0gSWYgdGhlIGxpbmVzIGludGVyc2VjdCwgdGhlIHBvaW50IG9mXG4gKiBpbnRlcnNlY3Rpb24uIElmIHRoZXkgb3ZlcmxhcCwgdGhlIHR3byBlbmQgcG9pbnRzIG9mIHRoZSBvdmVybGFwcGluZyBzZWdtZW50LlxuICogT3RoZXJ3aXNlLCBudWxsLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGExLCBhMiwgYjEsIGIyLCBub0VuZHBvaW50VG91Y2gpIHtcbiAgLy8gVGhlIGFsZ29yaXRobSBleHBlY3RzIG91ciBsaW5lcyBpbiB0aGUgZm9ybSBQICsgc2QsIHdoZXJlIFAgaXMgYSBwb2ludCxcbiAgLy8gcyBpcyBvbiB0aGUgaW50ZXJ2YWwgWzAsIDFdLCBhbmQgZCBpcyBhIHZlY3Rvci5cbiAgLy8gV2UgYXJlIHBhc3NlZCB0d28gcG9pbnRzLiBQIGNhbiBiZSB0aGUgZmlyc3QgcG9pbnQgb2YgZWFjaCBwYWlyLiBUaGVcbiAgLy8gdmVjdG9yLCB0aGVuLCBjb3VsZCBiZSB0aG91Z2h0IG9mIGFzIHRoZSBkaXN0YW5jZSAoaW4geCBhbmQgeSBjb21wb25lbnRzKVxuICAvLyBmcm9tIHRoZSBmaXJzdCBwb2ludCB0byB0aGUgc2Vjb25kIHBvaW50LlxuICAvLyBTbyBmaXJzdCwgbGV0J3MgbWFrZSBvdXIgdmVjdG9yczpcbiAgdmFyIHZhID0gW2EyWzBdIC0gYTFbMF0sIGEyWzFdIC0gYTFbMV1dO1xuICB2YXIgdmIgPSBbYjJbMF0gLSBiMVswXSwgYjJbMV0gLSBiMVsxXV07XG4gIC8vIFdlIGFsc28gZGVmaW5lIGEgZnVuY3Rpb24gdG8gY29udmVydCBiYWNrIHRvIHJlZ3VsYXIgcG9pbnQgZm9ybTpcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBhcnJvdy1ib2R5LXN0eWxlICovXG5cbiAgZnVuY3Rpb24gdG9Qb2ludChwLCBzLCBkKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHBbMF0gKyBzICogZFswXSxcbiAgICAgIHBbMV0gKyBzICogZFsxXVxuICAgIF07XG4gIH1cblxuICAvKiBlc2xpbnQtZW5hYmxlIGFycm93LWJvZHktc3R5bGUgKi9cblxuICAvLyBUaGUgcmVzdCBpcyBwcmV0dHkgbXVjaCBhIHN0cmFpZ2h0IHBvcnQgb2YgdGhlIGFsZ29yaXRobS5cbiAgdmFyIGUgPSBbYjFbMF0gLSBhMVswXSwgYjFbMV0gLSBhMVsxXV07XG4gIHZhciBrcm9zcyA9IGtyb3NzUHJvZHVjdCh2YSwgdmIpO1xuICB2YXIgc3FyS3Jvc3MgPSBrcm9zcyAqIGtyb3NzO1xuICB2YXIgc3FyTGVuQSA9IGRvdFByb2R1Y3QodmEsIHZhKTtcbiAgdmFyIHNxckxlbkIgPSBkb3RQcm9kdWN0KHZiLCB2Yik7XG5cbiAgLy8gQ2hlY2sgZm9yIGxpbmUgaW50ZXJzZWN0aW9uLiBUaGlzIHdvcmtzIGJlY2F1c2Ugb2YgdGhlIHByb3BlcnRpZXMgb2YgdGhlXG4gIC8vIGNyb3NzIHByb2R1Y3QgLS0gc3BlY2lmaWNhbGx5LCB0d28gdmVjdG9ycyBhcmUgcGFyYWxsZWwgaWYgYW5kIG9ubHkgaWYgdGhlXG4gIC8vIGNyb3NzIHByb2R1Y3QgaXMgdGhlIDAgdmVjdG9yLiBUaGUgZnVsbCBjYWxjdWxhdGlvbiBpbnZvbHZlcyByZWxhdGl2ZSBlcnJvclxuICAvLyB0byBhY2NvdW50IGZvciBwb3NzaWJsZSB2ZXJ5IHNtYWxsIGxpbmUgc2VnbWVudHMuIFNlZSBTY2huZWlkZXIgJiBFYmVybHlcbiAgLy8gZm9yIGRldGFpbHMuXG4gIGlmIChzcXJLcm9zcyA+IEVQU0lMT04gKiBzcXJMZW5BICogc3FyTGVuQikge1xuICAgIC8vIElmIHRoZXkncmUgbm90IHBhcmFsbGVsLCB0aGVuIChiZWNhdXNlIHRoZXNlIGFyZSBsaW5lIHNlZ21lbnRzKSB0aGV5XG4gICAgLy8gc3RpbGwgbWlnaHQgbm90IGFjdHVhbGx5IGludGVyc2VjdC4gVGhpcyBjb2RlIGNoZWNrcyB0aGF0IHRoZVxuICAgIC8vIGludGVyc2VjdGlvbiBwb2ludCBvZiB0aGUgbGluZXMgaXMgYWN0dWFsbHkgb24gYm90aCBsaW5lIHNlZ21lbnRzLlxuICAgIHZhciBzID0ga3Jvc3NQcm9kdWN0KGUsIHZiKSAvIGtyb3NzO1xuICAgIGlmIChzIDwgMCB8fCBzID4gMSkge1xuICAgICAgLy8gbm90IG9uIGxpbmUgc2VnbWVudCBhXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHQgPSBrcm9zc1Byb2R1Y3QoZSwgdmEpIC8ga3Jvc3M7XG4gICAgaWYgKHQgPCAwIHx8IHQgPiAxKSB7XG4gICAgICAvLyBub3Qgb24gbGluZSBzZWdtZW50IGJcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzLCB2YSldO1xuICB9XG5cbiAgLy8gSWYgd2UndmUgcmVhY2hlZCB0aGlzIHBvaW50LCB0aGVuIHRoZSBsaW5lcyBhcmUgZWl0aGVyIHBhcmFsbGVsIG9yIHRoZVxuICAvLyBzYW1lLCBidXQgdGhlIHNlZ21lbnRzIGNvdWxkIG92ZXJsYXAgcGFydGlhbGx5IG9yIGZ1bGx5LCBvciBub3QgYXQgYWxsLlxuICAvLyBTbyB3ZSBuZWVkIHRvIGZpbmQgdGhlIG92ZXJsYXAsIGlmIGFueS4gVG8gZG8gdGhhdCwgd2UgY2FuIHVzZSBlLCB3aGljaCBpc1xuICAvLyB0aGUgKHZlY3RvcikgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSB0d28gaW5pdGlhbCBwb2ludHMuIElmIHRoaXMgaXMgcGFyYWxsZWxcbiAgLy8gd2l0aCB0aGUgbGluZSBpdHNlbGYsIHRoZW4gdGhlIHR3byBsaW5lcyBhcmUgdGhlIHNhbWUgbGluZSwgYW5kIHRoZXJlIHdpbGxcbiAgLy8gYmUgb3ZlcmxhcC5cbiAgdmFyIHNxckxlbkUgPSBkb3RQcm9kdWN0KGUsIGUpO1xuICBrcm9zcyA9IGtyb3NzUHJvZHVjdChlLCB2YSk7XG4gIHNxcktyb3NzID0ga3Jvc3MgKiBrcm9zcztcblxuICBpZiAoc3FyS3Jvc3MgPiBFUFNJTE9OICogc3FyTGVuQSAqIHNxckxlbkUpIHtcbiAgICAvLyBMaW5lcyBhcmUganVzdCBwYXJhbGxlbCwgbm90IHRoZSBzYW1lLiBObyBvdmVybGFwLlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIHNhID0gZG90UHJvZHVjdCh2YSwgZSkgLyBzcXJMZW5BO1xuICB2YXIgc2IgPSBzYSArIGRvdFByb2R1Y3QodmEsIHZiKSAvIHNxckxlbkE7XG4gIHZhciBzbWluID0gTWF0aC5taW4oc2EsIHNiKTtcbiAgdmFyIHNtYXggPSBNYXRoLm1heChzYSwgc2IpO1xuXG4gIC8vIHRoaXMgaXMsIGVzc2VudGlhbGx5LCB0aGUgRmluZEludGVyc2VjdGlvbiBhY3Rpbmcgb24gZmxvYXRzIGZyb21cbiAgLy8gU2NobmVpZGVyICYgRWJlcmx5LCBqdXN0IGlubGluZWQgaW50byB0aGlzIGZ1bmN0aW9uLlxuICBpZiAoc21pbiA8PSAxICYmIHNtYXggPj0gMCkge1xuXG4gICAgLy8gb3ZlcmxhcCBvbiBhbiBlbmQgcG9pbnRcbiAgICBpZiAoc21pbiA9PT0gMSkge1xuICAgICAgcmV0dXJuIG5vRW5kcG9pbnRUb3VjaCA/IG51bGwgOiBbdG9Qb2ludChhMSwgc21pbiA+IDAgPyBzbWluIDogMCwgdmEpXTtcbiAgICB9XG5cbiAgICBpZiAoc21heCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5vRW5kcG9pbnRUb3VjaCA/IG51bGwgOiBbdG9Qb2ludChhMSwgc21heCA8IDEgPyBzbWF4IDogMSwgdmEpXTtcbiAgICB9XG5cbiAgICBpZiAobm9FbmRwb2ludFRvdWNoICYmIHNtaW4gPT09IDAgJiYgc21heCA9PT0gMSkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBUaGVyZSdzIG92ZXJsYXAgb24gYSBzZWdtZW50IC0tIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLiBSZXR1cm4gYm90aC5cbiAgICByZXR1cm4gW1xuICAgICAgdG9Qb2ludChhMSwgc21pbiA+IDAgPyBzbWluIDogMCwgdmEpLFxuICAgICAgdG9Qb2ludChhMSwgc21heCA8IDEgPyBzbWF4IDogMSwgdmEpLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG4iLCIvKipcbiAqIFNpZ25lZCBhcmVhIG9mIHRoZSB0cmlhbmdsZSAocDAsIHAxLCBwMilcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMFxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAxXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaWduZWRBcmVhKHAwLCBwMSwgcDIpIHtcbiAgcmV0dXJuIChwMFswXSAtIHAyWzBdKSAqIChwMVsxXSAtIHAyWzFdKSAtIChwMVswXSAtIHAyWzBdKSAqIChwMFsxXSAtIHAyWzFdKTtcbn07XG4iLCJ2YXIgc2lnbmVkQXJlYSA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcbnZhciBFZGdlVHlwZSAgID0gcmVxdWlyZSgnLi9lZGdlX3R5cGUnKTtcblxuXG4vKipcbiAqIFN3ZWVwbGluZSBldmVudFxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59ICBwb2ludFxuICogQHBhcmFtIHtCb29sZWFufSAgICAgICAgIGxlZnRcbiAqIEBwYXJhbSB7U3dlZXBFdmVudD19ICAgICBvdGhlckV2ZW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgaXNTdWJqZWN0XG4gKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgZWRnZVR5cGVcbiAqL1xuZnVuY3Rpb24gU3dlZXBFdmVudChwb2ludCwgbGVmdCwgb3RoZXJFdmVudCwgaXNTdWJqZWN0LCBlZGdlVHlwZSkge1xuXG4gIC8qKlxuICAgKiBJcyBsZWZ0IGVuZHBvaW50P1xuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMubGVmdCA9IGxlZnQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48TnVtYmVyPn1cbiAgICovXG4gIHRoaXMucG9pbnQgPSBwb2ludDtcblxuICAvKipcbiAgICogT3RoZXIgZWRnZSByZWZlcmVuY2VcbiAgICogQHR5cGUge1N3ZWVwRXZlbnR9XG4gICAqL1xuICB0aGlzLm90aGVyRXZlbnQgPSBvdGhlckV2ZW50O1xuXG4gIC8qKlxuICAgKiBCZWxvbmdzIHRvIHNvdXJjZSBvciBjbGlwcGluZyBwb2x5Z29uXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5pc1N1YmplY3QgPSBpc1N1YmplY3Q7XG5cbiAgLyoqXG4gICAqIEVkZ2UgY29udHJpYnV0aW9uIHR5cGVcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMudHlwZSA9IGVkZ2VUeXBlIHx8IEVkZ2VUeXBlLk5PUk1BTDtcblxuXG4gIC8qKlxuICAgKiBJbi1vdXQgdHJhbnNpdGlvbiBmb3IgdGhlIHN3ZWVwbGluZSBjcm9zc2luZyBwb2x5Z29uXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5pbk91dCA9IGZhbHNlO1xuXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5vdGhlckluT3V0ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFByZXZpb3VzIGV2ZW50IGluIHJlc3VsdD9cbiAgICogQHR5cGUge1N3ZWVwRXZlbnR9XG4gICAqL1xuICB0aGlzLnByZXZJblJlc3VsdCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIERvZXMgZXZlbnQgYmVsb25nIHRvIHJlc3VsdD9cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmluUmVzdWx0ID0gZmFsc2U7XG5cblxuICAvLyBjb25uZWN0aW9uIHN0ZXBcblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLnJlc3VsdEluT3V0ID0gZmFsc2U7XG59XG5cblxuU3dlZXBFdmVudC5wcm90b3R5cGUgPSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgcFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNCZWxvdzogZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiB0aGlzLmxlZnQgP1xuICAgICAgc2lnbmVkQXJlYSAodGhpcy5wb2ludCwgdGhpcy5vdGhlckV2ZW50LnBvaW50LCBwKSA+IDAgOlxuICAgICAgc2lnbmVkQXJlYSAodGhpcy5vdGhlckV2ZW50LnBvaW50LCB0aGlzLnBvaW50LCBwKSA+IDA7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc0Fib3ZlOiBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzQmVsb3cocCk7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzVmVydGljYWw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50WzBdID09PSB0aGlzLm90aGVyRXZlbnQucG9pbnRbMF07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3dlZXBFdmVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBUaW55UXVldWU7XG5cbmZ1bmN0aW9uIFRpbnlRdWV1ZShkYXRhLCBjb21wYXJlKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFRpbnlRdWV1ZSkpIHJldHVybiBuZXcgVGlueVF1ZXVlKGRhdGEsIGNvbXBhcmUpO1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YSB8fCBbXTtcbiAgICB0aGlzLmxlbmd0aCA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgdGhpcy5jb21wYXJlID0gY29tcGFyZSB8fCBkZWZhdWx0Q29tcGFyZTtcblxuICAgIGlmIChkYXRhKSBmb3IgKHZhciBpID0gTWF0aC5mbG9vcih0aGlzLmxlbmd0aCAvIDIpOyBpID49IDA7IGktLSkgdGhpcy5fZG93bihpKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoYSwgYikge1xuICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMDtcbn1cblxuVGlueVF1ZXVlLnByb3RvdHlwZSA9IHtcblxuICAgIHB1c2g6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICB0aGlzLl91cCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgIH0sXG5cbiAgICBwb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvcCA9IHRoaXMuZGF0YVswXTtcbiAgICAgICAgdGhpcy5kYXRhWzBdID0gdGhpcy5kYXRhW3RoaXMubGVuZ3RoIC0gMV07XG4gICAgICAgIHRoaXMubGVuZ3RoLS07XG4gICAgICAgIHRoaXMuZGF0YS5wb3AoKTtcbiAgICAgICAgdGhpcy5fZG93bigwKTtcbiAgICAgICAgcmV0dXJuIHRvcDtcbiAgICB9LFxuXG4gICAgcGVlazogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xuICAgIH0sXG5cbiAgICBfdXA6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEsXG4gICAgICAgICAgICBjb21wYXJlID0gdGhpcy5jb21wYXJlO1xuXG4gICAgICAgIHdoaWxlIChwb3MgPiAwKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gTWF0aC5mbG9vcigocG9zIC0gMSkgLyAyKTtcbiAgICAgICAgICAgIGlmIChjb21wYXJlKGRhdGFbcG9zXSwgZGF0YVtwYXJlbnRdKSA8IDApIHtcbiAgICAgICAgICAgICAgICBzd2FwKGRhdGEsIHBhcmVudCwgcG9zKTtcbiAgICAgICAgICAgICAgICBwb3MgPSBwYXJlbnQ7XG5cbiAgICAgICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZG93bjogZnVuY3Rpb24gKHBvcykge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIGNvbXBhcmUgPSB0aGlzLmNvbXBhcmUsXG4gICAgICAgICAgICBsZW4gPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGxlZnQgPSAyICogcG9zICsgMSxcbiAgICAgICAgICAgICAgICByaWdodCA9IGxlZnQgKyAxLFxuICAgICAgICAgICAgICAgIG1pbiA9IHBvcztcblxuICAgICAgICAgICAgaWYgKGxlZnQgPCBsZW4gJiYgY29tcGFyZShkYXRhW2xlZnRdLCBkYXRhW21pbl0pIDwgMCkgbWluID0gbGVmdDtcbiAgICAgICAgICAgIGlmIChyaWdodCA8IGxlbiAmJiBjb21wYXJlKGRhdGFbcmlnaHRdLCBkYXRhW21pbl0pIDwgMCkgbWluID0gcmlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChtaW4gPT09IHBvcykgcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2FwKGRhdGEsIG1pbiwgcG9zKTtcbiAgICAgICAgICAgIHBvcyA9IG1pbjtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHN3YXAoZGF0YSwgaSwgaikge1xuICAgIHZhciB0bXAgPSBkYXRhW2ldO1xuICAgIGRhdGFbaV0gPSBkYXRhW2pdO1xuICAgIGRhdGFbal0gPSB0bXA7XG59XG4iLCIvKipcbiAqIE9mZnNldCBlZGdlIG9mIHRoZSBwb2x5Z29uXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBjdXJyZW50XG4gKiBAcGFyYW0gIHtPYmplY3R9IG5leHRcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBFZGdlKGN1cnJlbnQsIG5leHQpIHtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMuY3VycmVudCA9IGN1cnJlbnQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLm5leHQgPSBuZXh0O1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5faW5Ob3JtYWwgID0gdGhpcy5pbndhcmRzTm9ybWFsKCk7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLl9vdXROb3JtYWwgPSB0aGlzLm91dHdhcmRzTm9ybWFsKCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBvdXR3YXJkcyBub3JtYWxcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuRWRnZS5wcm90b3R5cGUub3V0d2FyZHNOb3JtYWwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGlud2FyZHMgPSB0aGlzLmlud2FyZHNOb3JtYWwoKTtcbiAgcmV0dXJuIFtcbiAgICAtaW53YXJkc1swXSxcbiAgICAtaW53YXJkc1sxXVxuICBdO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGlud2FyZHMgbm9ybWFsXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbkVkZ2UucHJvdG90eXBlLmlud2FyZHNOb3JtYWwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGR4ID0gdGhpcy5uZXh0WzBdIC0gdGhpcy5jdXJyZW50WzBdLFxuICAgICAgZHkgPSB0aGlzLm5leHRbMV0gLSB0aGlzLmN1cnJlbnRbMV0sXG4gICAgICBlZGdlTGVuZ3RoID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICBpZiAoZWRnZUxlbmd0aCA9PT0gMCkgdGhyb3cgbmV3IEVycm9yKCdWZXJ0aWNlcyBvdmVybGFwJyk7XG5cbiAgcmV0dXJuIFtcbiAgICAtZHkgLyBlZGdlTGVuZ3RoLFxuICAgICBkeCAvIGVkZ2VMZW5ndGhcbiAgXTtcbn07XG5cbi8qKlxuICogT2Zmc2V0cyB0aGUgZWRnZSBieSBkeCwgZHlcbiAqIEBwYXJhbSAge051bWJlcn0gZHhcbiAqIEBwYXJhbSAge051bWJlcn0gZHlcbiAqIEByZXR1cm4ge0VkZ2V9XG4gKi9cbkVkZ2UucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKGR4LCBkeSkge1xuICByZXR1cm4gRWRnZS5vZmZzZXRFZGdlKHRoaXMuY3VycmVudCwgdGhpcy5uZXh0LCBkeCwgZHkpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gZHhcbiAqIEBwYXJhbSAge051bWJlcn0gZHlcbiAqIEByZXR1cm4ge0VkZ2V9XG4gKi9cbkVkZ2UucHJvdG90eXBlLmludmVyc2VPZmZzZXQgPSBmdW5jdGlvbihkeCwgZHkpIHtcbiAgcmV0dXJuIEVkZ2Uub2Zmc2V0RWRnZSh0aGlzLm5leHQsIHRoaXMuY3VycmVudCwgZHgsIGR5KTtcbn07XG5cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gY3VycmVudFxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IG5leHRcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICBkeFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIGR5XG4gKiBAcmV0dXJuIHtFZGdlfVxuICovXG5FZGdlLm9mZnNldEVkZ2UgPSBmdW5jdGlvbihjdXJyZW50LCBuZXh0LCBkeCwgZHkpIHtcbiAgcmV0dXJuIG5ldyBFZGdlKFtcbiAgICBjdXJyZW50WzBdICsgZHgsXG4gICAgY3VycmVudFsxXSArIGR5XG4gIF0sIFtcbiAgICBuZXh0WzBdICsgZHgsXG4gICAgbmV4dFsxXSArIGR5XG4gIF0pO1xufTtcblxuXG4vKipcbiAqXG4gKiBAcmV0dXJuIHtFZGdlfVxuICovXG5FZGdlLnByb3RvdHlwZS5pbnZlcnNlID0gZnVuY3Rpb24gKCkge1xuICByZXR1cm4gbmV3IEVkZ2UodGhpcy5uZXh0LCB0aGlzLmN1cnJlbnQpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cyA9IEVkZ2U7XG4iLCJ2YXIgRWRnZSAgICAgPSByZXF1aXJlKCcuL2VkZ2UnKTtcbnZhciBtYXJ0aW5leiA9IHJlcXVpcmUoJ21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcnKTtcbnZhciB1dGlscyAgICA9IHJlcXVpcmUoJy4vdXRpbHMnKTtcblxuXG52YXIgaXNBcnJheSAgICAgPSB1dGlscy5pc0FycmF5O1xudmFyIGVxdWFscyAgICAgID0gdXRpbHMuZXF1YWxzO1xudmFyIG9yaWVudFJpbmdzID0gdXRpbHMub3JpZW50UmluZ3M7XG5cblxuLyoqXG4gKiBPZmZzZXQgYnVpbGRlclxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD49fSB2ZXJ0aWNlc1xuICogQHBhcmFtIHtOdW1iZXI9fSAgICAgICAgYXJjU2VnbWVudHNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPZmZzZXQodmVydGljZXMsIGFyY1NlZ21lbnRzKSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn1cbiAgICovXG4gIHRoaXMudmVydGljZXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPEVkZ2U+fVxuICAgKi9cbiAgdGhpcy5lZGdlcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5fY2xvc2VkID0gZmFsc2U7XG5cblxuICAvKipcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMuX2Rpc3RhbmNlID0gMDtcblxuICBpZiAodmVydGljZXMpIHtcbiAgICB0aGlzLmRhdGEodmVydGljZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZ21lbnRzIGluIGVkZ2UgYm91bmRpbmcgYXJjaGVzXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBhcmNTZWdtZW50cyA6IDU7XG59XG5cbi8qKlxuICogQ2hhbmdlIGRhdGEgc2V0XG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXk+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB0aGlzLl9lZGdlcyA9IFtdO1xuICBpZiAoIWlzQXJyYXkgKHZlcnRpY2VzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignT2Zmc2V0IHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBjb29kaW5hdGUgdG8gd29yayB3aXRoJyk7XG4gIH1cblxuICBpZiAoaXNBcnJheSh2ZXJ0aWNlcykgJiYgdHlwZW9mIHZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykge1xuICAgIHRoaXMudmVydGljZXMgPSB2ZXJ0aWNlcztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnZlcnRpY2VzID0gb3JpZW50UmluZ3ModmVydGljZXMpO1xuICAgIHRoaXMuX3Byb2Nlc3NDb250b3VyKHRoaXMudmVydGljZXMsIHRoaXMuX2VkZ2VzKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHByb2Nlc3MgY29udG91ciB0byBjcmVhdGUgbm9ybWFsc1xuICogQHBhcmFtICB7Kn0gY29udG91clxuICogQHBhcmFtICB7QXJyYXl9IGVkZ2VzXG4gKi9cbk9mZnNldC5wcm90b3R5cGUuX3Byb2Nlc3NDb250b3VyID0gZnVuY3Rpb24oY29udG91ciwgZWRnZXMpIHtcbiAgdmFyIGksIGxlbjtcbiAgaWYgKGlzQXJyYXkoY29udG91clswXSkgJiYgdHlwZW9mIGNvbnRvdXJbMF1bMF0gPT09ICdudW1iZXInKSB7XG4gICAgbGVuID0gY29udG91ci5sZW5ndGg7XG4gICAgaWYgKGVxdWFscyhjb250b3VyWzBdLCBjb250b3VyW2xlbiAtIDFdKSkge1xuICAgICAgbGVuIC09IDE7IC8vIG90aGVyd2lzZSB3ZSBnZXQgZGl2aXNpb24gYnkgemVybyBpbiBub3JtYWxzXG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgZWRnZXMucHVzaChuZXcgRWRnZShjb250b3VyW2ldLCBjb250b3VyWyhpICsgMSkgJSBsZW5dKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvbnRvdXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGVkZ2VzLnB1c2goW10pO1xuICAgICAgdGhpcy5fcHJvY2Vzc0NvbnRvdXIoY29udG91cltpXSwgZWRnZXNbZWRnZXMubGVuZ3RoIC0gMV0pO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gYXJjU2VnbWVudHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5hcmNTZWdtZW50cyA9IGZ1bmN0aW9uKGFyY1NlZ21lbnRzKSB7XG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFZhbGlkYXRlcyBpZiB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnRzIHJlcGVhdFxuICogVE9ETzogY2hlY2sgQ0NXXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IHZlcnRpY2VzXG4gKi9cbk9mZnNldC5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2YXIgbGVuID0gdmVydGljZXMubGVuZ3RoO1xuICBpZiAodHlwZW9mIHZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykgcmV0dXJuIFt2ZXJ0aWNlc107XG4gIGlmICh2ZXJ0aWNlc1swXVswXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMF0gJiZcbiAgICB2ZXJ0aWNlc1swXVsxXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMV0pIHtcbiAgICBpZiAobGVuID4gMSkge1xuICAgICAgdmVydGljZXMgPSB2ZXJ0aWNlcy5zbGljZSgwLCBsZW4gLSAxKTtcbiAgICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIGFyY2ggYmV0d2VlbiB0d28gZWRnZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICByYWRpdXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBzdGFydFZlcnRleFxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGVuZFZlcnRleFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHNlZ21lbnRzXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgb3V0d2FyZHNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5jcmVhdGVBcmMgPSBmdW5jdGlvbih2ZXJ0aWNlcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0VmVydGV4LFxuICAgIGVuZFZlcnRleCwgc2VnbWVudHMsIG91dHdhcmRzKSB7XG5cbiAgdmFyIFBJMiA9IE1hdGguUEkgKiAyLFxuICAgICAgc3RhcnRBbmdsZSA9IE1hdGguYXRhbjIoc3RhcnRWZXJ0ZXhbMV0gLSBjZW50ZXJbMV0sIHN0YXJ0VmVydGV4WzBdIC0gY2VudGVyWzBdKSxcbiAgICAgIGVuZEFuZ2xlICAgPSBNYXRoLmF0YW4yKGVuZFZlcnRleFsxXSAtIGNlbnRlclsxXSwgZW5kVmVydGV4WzBdIC0gY2VudGVyWzBdKTtcblxuICAvLyBvZGQgbnVtYmVyIHBsZWFzZVxuICBpZiAoc2VnbWVudHMgJSAyID09PSAwKSB7XG4gICAgc2VnbWVudHMgLT0gMTtcbiAgfVxuXG4gIGlmIChzdGFydEFuZ2xlIDwgMCkge1xuICAgIHN0YXJ0QW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgaWYgKGVuZEFuZ2xlIDwgMCkge1xuICAgIGVuZEFuZ2xlICs9IFBJMjtcbiAgfVxuXG4gIHZhciBhbmdsZSA9ICgoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSA/XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSA6XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSArIFBJMiAtIGVuZEFuZ2xlKSksXG4gICAgICBzZWdtZW50QW5nbGUgPSAoKG91dHdhcmRzKSA/IC1hbmdsZSA6IFBJMiAtIGFuZ2xlKSAvIHNlZ21lbnRzO1xuXG4gIHZlcnRpY2VzLnB1c2goc3RhcnRWZXJ0ZXgpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNlZ21lbnRzOyArK2kpIHtcbiAgICBhbmdsZSA9IHN0YXJ0QW5nbGUgKyBzZWdtZW50QW5nbGUgKiBpO1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLFxuICAgICAgY2VudGVyWzFdICsgTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzXG4gICAgXSk7XG4gIH1cbiAgdmVydGljZXMucHVzaChlbmRWZXJ0ZXgpO1xuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSAgZGlzdFxuICogQHBhcmFtICB7U3RyaW5nPX0gdW5pdHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uKGRpc3QsIHVuaXRzKSB7XG4gIHRoaXMuX2Rpc3RhbmNlID0gZGlzdCB8fCAwO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICBkZWdyZWVzXG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB1bml0c1xuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5PZmZzZXQuZGVncmVlc1RvVW5pdHMgPSBmdW5jdGlvbihkZWdyZWVzLCB1bml0cykge1xuICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgY2FzZSAnbWlsZXMnOlxuICAgICAgZGVncmVlcyA9IGRlZ3JlZXMgLyA2OS4wNDc7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnZmVldCc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDM2NDU2OC4wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAna2lsb21ldGVycyc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDExMS4xMjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21ldGVycyc6XG4gICAgY2FzZSAnbWV0cmVzJzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMTExMTIwLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdkZWdyZWVzJzpcbiAgICBjYXNlICdwaXhlbHMnOlxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZGVncmVlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmVuc3VyZUxhc3RQb2ludCA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIGlmICghZXF1YWxzKHZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAxXSkpIHtcbiAgICB2ZXJ0aWNlcy5wdXNoKFtcbiAgICAgIHZlcnRpY2VzWzBdWzBdLFxuICAgICAgdmVydGljZXNbMF1bMV1cbiAgICBdKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogRGVjaWRlcyBieSB0aGUgc2lnbiBpZiBpdCdzIGEgcGFkZGluZyBvciBhIG1hcmdpblxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuICByZXR1cm4gdGhpcy5fZGlzdGFuY2UgPT09IDAgPyB0aGlzLnZlcnRpY2VzIDpcbiAgICAgICh0aGlzLl9kaXN0YW5jZSA+IDAgPyB0aGlzLm1hcmdpbih0aGlzLl9kaXN0YW5jZSkgOlxuICAgICAgICB0aGlzLnBhZGRpbmcoLXRoaXMuX2Rpc3RhbmNlKSk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgICAgICAgIHB0MVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICAgICAgICAgcHQyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLl9vZmZzZXRTZWdtZW50ID0gZnVuY3Rpb24odjEsIHYyLCBlMSwgZGlzdCkge1xuICB2YXIgdmVydGljZXMgPSBbXTtcbiAgdmFyIG9mZnNldHMgPSBbXG4gICAgZTEub2Zmc2V0KGUxLl9pbk5vcm1hbFswXSAqIGRpc3QsIGUxLl9pbk5vcm1hbFsxXSAqIGRpc3QpLFxuICAgIGUxLmludmVyc2VPZmZzZXQoZTEuX291dE5vcm1hbFswXSAqIGRpc3QsIGUxLl9vdXROb3JtYWxbMV0gKiBkaXN0KVxuICBdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSAyOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgdGhpc0VkZ2UgPSBvZmZzZXRzW2ldLFxuICAgICAgICBwcmV2RWRnZSA9IG9mZnNldHNbKGkgKyBsZW4gLSAxKSAlIGxlbl07XG4gICAgdGhpcy5jcmVhdGVBcmMoXG4gICAgICAgICAgICAgIHZlcnRpY2VzLFxuICAgICAgICAgICAgICBpID09PSAwID8gdjEgOiB2MiwgLy8gZWRnZXNbaV0uY3VycmVudCwgLy8gcDEgb3IgcDJcbiAgICAgICAgICAgICAgZGlzdCxcbiAgICAgICAgICAgICAgcHJldkVkZ2UubmV4dCxcbiAgICAgICAgICAgICAgdGhpc0VkZ2UuY3VycmVudCxcbiAgICAgICAgICAgICAgdGhpcy5fYXJjU2VnbWVudHMsXG4gICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICk7XG4gIH1cblxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5tYXJnaW4gPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG5cbiAgaWYgKHR5cGVvZiB0aGlzLnZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykgeyAvLyBwb2ludFxuICAgIHJldHVybiB0aGlzLm9mZnNldFBvaW50KHRoaXMuX2Rpc3RhbmNlKTtcbiAgfVxuXG4gIGlmIChkaXN0ID09PSAwKSByZXR1cm4gdGhpcy52ZXJ0aWNlcztcblxuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmVzKHRoaXMuX2Rpc3RhbmNlKTtcbiAgLy9yZXR1cm4gdW5pb247XG4gIHVuaW9uID0gbWFydGluZXoudW5pb24odGhpcy52ZXJ0aWNlcywgdW5pb24pO1xuICByZXR1cm4gb3JpZW50UmluZ3ModW5pb24pO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUucGFkZGluZyA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgdGhpcy5kaXN0YW5jZShkaXN0KTtcblxuICBpZiAodGhpcy5fZGlzdGFuY2UgPT09IDApIHJldHVybiB0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKTtcbiAgaWYgKHRoaXMudmVydGljZXMubGVuZ3RoID09PSAyICYmIHR5cGVvZiB0aGlzLnZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuICB9XG5cbiAgdmFyIHVuaW9uID0gdGhpcy5vZmZzZXRMaW5lcyh0aGlzLl9kaXN0YW5jZSk7XG4gIHZhciBkaWZmID0gbWFydGluZXouZGlmZih0aGlzLnZlcnRpY2VzLCB1bmlvbik7XG4gIHJldHVybiBvcmllbnRSaW5ncyhkaWZmKTtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIG1hcmdpbiBwb2x5Z29uXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldExpbmUgPSBmdW5jdGlvbihkaXN0KSB7XG4gIGlmIChkaXN0ID09PSAwKSByZXR1cm4gdGhpcy52ZXJ0aWNlcztcbiAgcmV0dXJuIG9yaWVudFJpbmdzKHRoaXMub2Zmc2V0TGluZXMoZGlzdCkpO1xufTtcblxuXG4vKipcbiAqIEp1c3Qgb2Zmc2V0cyBsaW5lcywgbm8gZmlsbFxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPEFycmF5LjxOdW1iZXI+Pj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0TGluZXMgPSBmdW5jdGlvbihkaXN0KSB7XG4gIGlmIChkaXN0IDwgMCkgdGhyb3cgbmV3IEVycm9yKCdDYW5ub3QgYXBwbHkgbmVnYXRpdmUgbWFyZ2luIHRvIHRoZSBsaW5lJyk7XG4gIHZhciB1bmlvbjtcbiAgdGhpcy5kaXN0YW5jZShkaXN0KTtcbiAgaWYgKGlzQXJyYXkodGhpcy52ZXJ0aWNlc1swXSkgJiYgdHlwZW9mIHRoaXMudmVydGljZXNbMF1bMF0gIT09ICdudW1iZXInKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX2VkZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB1bmlvbiA9IChpID09PSAwKSA/XG4gICAgICAgIHRoaXMub2Zmc2V0Q29udG91cih0aGlzLnZlcnRpY2VzW2ldLCB0aGlzLl9lZGdlc1tpXSk6XG4gICAgICAgIG1hcnRpbmV6LnVuaW9uKHVuaW9uLCB0aGlzLm9mZnNldENvbnRvdXIodGhpcy52ZXJ0aWNlc1tpXSwgdGhpcy5fZWRnZXNbaV0pKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdW5pb24gPSAodGhpcy52ZXJ0aWNlcy5sZW5ndGggPT09IDEpID9cbiAgICAgIHRoaXMub2Zmc2V0UG9pbnQoKSA6XG4gICAgICB0aGlzLm9mZnNldENvbnRvdXIodGhpcy52ZXJ0aWNlcywgdGhpcy5fZWRnZXMpO1xuICB9XG5cbiAgcmV0dXJuIHVuaW9uO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxBcnJheS48TnVtYmVyPj58QXJyYXkuPEFycmF5LjwuLi4+Pn0gY3VydmVcbiAqIEBwYXJhbSAge0FycmF5LjxFZGdlPnxBcnJheS48QXJyYXkuPC4uLj4+fSBlZGdlc1xuICogQHJldHVybiB7UG9seWdvbn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXRDb250b3VyID0gZnVuY3Rpb24oY3VydmUsIGVkZ2VzKSB7XG4gIHZhciB1bmlvbiwgaSwgbGVuO1xuICBpZiAoaXNBcnJheShjdXJ2ZVswXSkgJiYgdHlwZW9mIGN1cnZlWzBdWzBdID09PSAnbnVtYmVyJykge1xuICAgIC8vIHdlIGhhdmUgMSBsZXNzIGVkZ2UgdGhhbiB2ZXJ0aWNlc1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGN1cnZlLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIHNlZ21lbnQgPSB0aGlzLmVuc3VyZUxhc3RQb2ludChcbiAgICAgICAgdGhpcy5fb2Zmc2V0U2VnbWVudChjdXJ2ZVtpXSwgY3VydmVbaSArIDFdLCBlZGdlc1tpXSwgdGhpcy5fZGlzdGFuY2UpXG4gICAgICApO1xuICAgICAgdW5pb24gPSAoaSA9PT0gMCkgP1xuICAgICAgICAgICAgICAgIFt0aGlzLmVuc3VyZUxhc3RQb2ludChzZWdtZW50KV0gOlxuICAgICAgICAgICAgICAgIG1hcnRpbmV6LnVuaW9uKHVuaW9uLCB0aGlzLmVuc3VyZUxhc3RQb2ludChzZWdtZW50KSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGVkZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB1bmlvbiA9IChpID09PSAwKSA/XG4gICAgICAgIHRoaXMub2Zmc2V0Q29udG91cihjdXJ2ZVtpXSwgZWRnZXNbaV0pIDpcbiAgICAgICAgbWFydGluZXoudW5pb24odW5pb24sIHRoaXMub2Zmc2V0Q29udG91cihjdXJ2ZVtpXSwgZWRnZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuaW9uO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdGFuY2VcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXRQb2ludCA9IGZ1bmN0aW9uKGRpc3RhbmNlKSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdGFuY2UpO1xuICB2YXIgdmVydGljZXMgPSB0aGlzLl9hcmNTZWdtZW50cyAqIDI7XG4gIHZhciBwb2ludHMgICA9IFtdO1xuICB2YXIgY2VudGVyICAgPSB0aGlzLnZlcnRpY2VzO1xuICB2YXIgcmFkaXVzICAgPSB0aGlzLl9kaXN0YW5jZTtcbiAgdmFyIGFuZ2xlICAgID0gMDtcblxuICBpZiAodmVydGljZXMgJSAyID09PSAwKSB2ZXJ0aWNlcysrO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmVydGljZXM7IGkrKykge1xuICAgIGFuZ2xlICs9ICgyICogTWF0aC5QSSAvIHZlcnRpY2VzKTsgLy8gY291bnRlci1jbG9ja3dpc2VcbiAgICBwb2ludHMucHVzaChbXG4gICAgICBjZW50ZXJbMF0gKyAocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpKSxcbiAgICAgIGNlbnRlclsxXSArIChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpXG4gICAgXSk7XG4gIH1cblxuICByZXR1cm4gb3JpZW50UmluZ3MoW3RoaXMuZW5zdXJlTGFzdFBvaW50KHBvaW50cyldKTtcbn07XG5cblxuT2Zmc2V0Lm9yaWVudFJpbmdzID0gb3JpZW50UmluZ3M7XG5cbm1vZHVsZS5leHBvcnRzID0gT2Zmc2V0O1xuIiwiLyoqXG4gKiBAcGFyYW0gIHsqfSBhcnJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbnZhciBpc0FycmF5ID0gbW9kdWxlLmV4cG9ydHMuaXNBcnJheSA9IEFycmF5LmlzQXJyYXkgfHwgZnVuY3Rpb24gKGFycikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAxXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDJcbiAqIEByZXR1cm4ge0Jvb2xlYW59XG4gKi9cbm1vZHVsZS5leHBvcnRzLmVxdWFscyA9IGZ1bmN0aW9uIGVxdWFscyhwMSwgcDIpIHtcbiAgcmV0dXJuIHAxWzBdID09PSBwMlswXSAmJiBwMVsxXSA9PT0gcDJbMV07XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7Kn0gICAgICAgY29vcmRpbmF0ZXNcbiAqIEBwYXJhbSAge051bWJlcj19IGRlcHRoXG4gKiBAcmV0dXJuIHsqfVxuICovXG5tb2R1bGUuZXhwb3J0cy5vcmllbnRSaW5ncyA9IGZ1bmN0aW9uIG9yaWVudFJpbmdzKGNvb3JkaW5hdGVzLCBkZXB0aCwgaXNIb2xlKSB7XG4gIGRlcHRoID0gZGVwdGggfHwgMDtcbiAgdmFyIGksIGxlbjtcbiAgaWYgKGlzQXJyYXkoY29vcmRpbmF0ZXMpICYmIHR5cGVvZiBjb29yZGluYXRlc1swXVswXSA9PT0gJ251bWJlcicpIHtcbiAgICB2YXIgYXJlYSA9IDA7XG4gICAgdmFyIHJpbmcgPSBjb29yZGluYXRlcztcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJpbmcubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBwdDEgPSByaW5nW2ldO1xuICAgICAgdmFyIHB0MiA9IHJpbmdbKGkgKyAxKSAlIGxlbl07XG4gICAgICBhcmVhICs9IHB0MVswXSAqIHB0MlsxXTtcbiAgICAgIGFyZWEgLT0gcHQyWzBdICogcHQxWzFdO1xuICAgIH1cbiAgICBpZiAoKCFpc0hvbGUgJiYgYXJlYSA+IDApIHx8IChpc0hvbGUgJiYgYXJlYSA8IDApKSB7XG4gICAgICByaW5nLnJldmVyc2UoKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY29vcmRpbmF0ZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIG9yaWVudFJpbmdzKGNvb3JkaW5hdGVzW2ldLCBkZXB0aCArIDEsIGkgPiAwKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29vcmRpbmF0ZXM7XG59OyIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJ0eXBlXCI6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgXCJmZWF0dXJlc1wiOiBbXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHt9LFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg0NjYzMjk1NzQ1ODYsXG4gICAgICAgICAgICAgIDIyLjI2Nzg5MDMxNTkwNTUwN1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4ODQwNzY1OTUzMDY1LFxuICAgICAgICAgICAgICAyMi4yNjkyNjA0NzAyNjE3OFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NjUxOTM4NDM4NDE3LFxuICAgICAgICAgICAgICAyMi4yNjcyODQ2NjM2ODkzMjRcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODc2MjQ0NTQ0OTgzLFxuICAgICAgICAgICAgICAyMi4yNjU0Mzc5MDQ2ODM0XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg0OTk1ODg5NjYzNzEsXG4gICAgICAgICAgICAgIDIyLjI2NjI3MTkyNzg5NzU5NVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NDY2MzI5NTc0NTg2LFxuICAgICAgICAgICAgICAyMi4yNjc4OTAzMTU5MDU1MDdcbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODgzNjQ3NDQxODY0MixcbiAgICAgICAgICAgIDIyLjI3MDc0OTc1MzI1NjgzM1xuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE5MDQ3ODMyNDg5MDE1LFxuICAgICAgICAgICAgMjIuMjY5Nzc2NzU2ODI4NjRcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODkyNTUyMzc1NzkzNSxcbiAgICAgICAgICAgIDIyLjI2NzU5MjQ1NDQ4NzQ1NlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE5MjA0NDczNDk1NDgzLFxuICAgICAgICAgICAgMjIuMjY5MjgwMzI3NDcyNjZcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xOTEyMTg2MTQ1NzgyNixcbiAgICAgICAgICAgIDIyLjI2NDg4MTg4NjQ0NTc4XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTkzNTc4OTU4NTExMzcsXG4gICAgICAgICAgICAyMi4yNjY5MjcyMjgzNjQ0NzdcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODkzNTE3OTcxMDM5LFxuICAgICAgICAgICAgMjIuMjY2NTMwMDc2OTMyNjlcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJQb2ludFwiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICAxMTQuMTg5NDkxMjcxOTcyNjcsXG4gICAgICAgICAgMjIuMjcxODAyMTcwMzQ2ODg0XG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJQb2x5Z29uXCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NjQ2NTc0MDIwMzg2LFxuICAgICAgICAgICAgICAyMi4yNjM5MTg3NzgxOTk4MVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE5MjI1OTMxMTY3NjA0LFxuICAgICAgICAgICAgICAyMi4yNjM3NTk5MTQzNDcxNzZcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xOTI0NTI0MzA3MjUxMSxcbiAgICAgICAgICAgICAgMjIuMjYwMDQ2NDIwNDIxMzg2XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg1NTg1OTc1NjQ2OTksXG4gICAgICAgICAgICAgIDIyLjI2MDUwMzE2NTYyOTY0M1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NjQ2NTc0MDIwMzg2LFxuICAgICAgICAgICAgICAyMi4yNjM5MTg3NzgxOTk4MVxuICAgICAgICAgICAgXVxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg3MzI0MDQ3MDg4NjQsXG4gICAgICAgICAgICAgIDIyLjI2MzI0MzYwNTU4MDc0XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg3Mzg4NDIwMTA1LFxuICAgICAgICAgICAgICAyMi4yNjEyMTgwNjgxODFcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xOTA5Mjg5MzYwMDQ2NSxcbiAgICAgICAgICAgICAgMjIuMjYwOTU5OTA5MzQ3NTQ1XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTkxMDE0NzY2NjkzMTIsXG4gICAgICAgICAgICAgIDIyLjI2MjY4NzU3ODYyNTI0XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg3MzI0MDQ3MDg4NjQsXG4gICAgICAgICAgICAgIDIyLjI2MzI0MzYwNTU4MDc0XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuICBdXG59Il19
