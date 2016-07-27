(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Offset = require('../src/offset');
require('./leaflet_multipolygon');
require('./polygon_control');
var OffsetControl = require('./offset_control');
var data = require('../test/fixtures/demo.json');
var project = require('geojson-project');

var arcSegments = 50;

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
    if (margin === 0) return;
    var shape = project(gj, function(coord) {
      var pt = map.options.crs.latLngToPoint(L.latLng(coord.slice().reverse()), map.getZoom());
      return [pt.x, pt.y];
    });

    var margined;
    if (gj.geometry.type === 'LineString') {
      if (margin < 0) return;
      var res = new Offset(shape.geometry.coordinates).arcSegments(arcSegments).offsetLine(margin);
      margined = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: res
        }
      };
    } else if (gj.geometry.type === 'Point') {
      if (margin < 0) return;
      var res = new Offset(shape.geometry.coordinates).arcSegments(arcSegments).offset(margin);
      margined = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: [res]
        }
      };
    } else {
      margined = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: new Offset(shape.geometry.coordinates[0]).offset(margin)
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4YW1wbGUvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE9mZnNldCA9IHJlcXVpcmUoJy4uL3NyYy9vZmZzZXQnKTtcbnJlcXVpcmUoJy4vbGVhZmxldF9tdWx0aXBvbHlnb24nKTtcbnJlcXVpcmUoJy4vcG9seWdvbl9jb250cm9sJyk7XG52YXIgT2Zmc2V0Q29udHJvbCA9IHJlcXVpcmUoJy4vb2Zmc2V0X2NvbnRyb2wnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9kZW1vLmpzb24nKTtcbnZhciBwcm9qZWN0ID0gcmVxdWlyZSgnZ2VvanNvbi1wcm9qZWN0Jyk7XG5cbnZhciBhcmNTZWdtZW50cyA9IDUwO1xuXG52YXIgc3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgY29sb3I6ICcjNDhmJyxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICBkYXNoQXJyYXk6IFsyLCA0XVxuICAgIH0sXG4gICAgbWFyZ2luU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjMjc2RDhGJ1xuICAgIH0sXG4gICAgcGFkZGluZ1N0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnI0Q4MTcwNidcbiAgICB9LFxuICAgIGNlbnRlciA9IFsyMi4yNjcwLCAxMTQuMTg4XSxcbiAgICB6b29tID0gMTcsXG4gICAgbWFwLCB2ZXJ0aWNlcywgcmVzdWx0O1xuXG5tYXAgPSBnbG9iYWwubWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgem9vbSk7XG5cblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld1BvaW50Q29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0TWFya2VyXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKGRhdGEpLmFkZFRvKG1hcCk7XG52YXIgcmVzdWx0cyA9IGdsb2JhbC5yZXN1bHRzID0gTC5nZW9Kc29uKG51bGwsIHtcbiAgc3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFyZ2luU3R5bGU7XG4gIH1cbn0pLmFkZFRvKG1hcCk7XG5tYXAuZml0Qm91bmRzKGxheWVycy5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBydW4gKG1hcmdpbikge1xuICByZXN1bHRzLmNsZWFyTGF5ZXJzKCk7XG4gIGxheWVycy5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgZ2ogPSBsYXllci50b0dlb0pTT04oKTtcbiAgICBjb25zb2xlLmxvZyhnaiwgbWFyZ2luKTtcbiAgICBpZiAobWFyZ2luID09PSAwKSByZXR1cm47XG4gICAgdmFyIHNoYXBlID0gcHJvamVjdChnaiwgZnVuY3Rpb24oY29vcmQpIHtcbiAgICAgIHZhciBwdCA9IG1hcC5vcHRpb25zLmNycy5sYXRMbmdUb1BvaW50KEwubGF0TG5nKGNvb3JkLnNsaWNlKCkucmV2ZXJzZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW3B0LngsIHB0LnldO1xuICAgIH0pO1xuXG4gICAgdmFyIG1hcmdpbmVkO1xuICAgIGlmIChnai5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpLm9mZnNldExpbmUobWFyZ2luKTtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpLm9mZnNldChtYXJnaW4pO1xuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtyZXNdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdKS5vZmZzZXQobWFyZ2luKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdtYXJnaW5lZCcsIG1hcmdpbmVkKTtcbiAgICByZXN1bHRzLmFkZERhdGEocHJvamVjdChtYXJnaW5lZCwgZnVuY3Rpb24ocHQpIHtcbiAgICAgIHZhciBsbCA9IG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocHQuc2xpY2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtsbC5sbmcsIGxsLmxhdF07XG4gICAgfSkpO1xuICB9KTtcbn1cblxucnVuICgyMCk7XG4iXX0=
},{"../src/offset":21,"../test/fixtures/demo.json":22,"./leaflet_multipolygon":2,"./offset_control":3,"./polygon_control":4,"geojson-project":9}],2:[function(require,module,exports){
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
    html: '▰'
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
 * @param  {Object}     data GeoJSON
 * @param  {Function}   project
 * @param  {*=}         context
 * @return {Object}
 */
module.exports = function(data, project, context) {
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

module.exports.projectFeature  = projectFeature;
module.exports.projectGeometry = projectGeometry;


/**
 * @param  {Object}     data GeoJSON
 * @param  {Function}   project
 * @param  {*=}         context
 * @return {Object}
 */
function projectFeature(feature, project, context) {
  if (feature.type === 'GeometryCollection') {
    for (var i = 0, len = feature.geometries.length; i < len; i++) {
      feature.geometries[i] =
        projectGeometry(feature.geometries[i], project, context);
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
function projectGeometry(geometry, project, context) {
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
function projectCoords(coords, levelsDeep, project, context) {
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

},{}],10:[function(require,module,exports){
module.exports = require('./src/index');

},{"./src/index":15}],11:[function(require,module,exports){
var signedArea = require('./signed_area');

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

  if (e1.isSubject === e2.isSubject) {
    if(e1.contourId === e2.contourId){
      return 0;
    } else {
      return e1.contourId > e2.contourId ? 1 : -1;
    }
  }

  return (!e1.isSubject && e2.isSubject) ? 1 : -1;
  //return e1.isSubject ? -1 : 1;
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

  if (le1.isSubject === le2.isSubject){
    if (equals(le1.point, le2.point)) {
      if (le1.contourId === le2.contourId){
        return 0;
      } else {
        return le1.contourId > le2.contourId ? 1 : -1;
      }
    } else {
      // Segments are collinear
      if (le1.isSubject !== le2.isSubject) return (le1.isSubject && !le2.isSubject) ? 1 : -1;
    }
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

      if (prev.data() !== sweepLine.min()) {
        prev.prev();
      } else {
        prev = sweepLine.findIter(sweepLine.max());
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
        prev = sweepLine.findIter(sweepLine.max());
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
  if (!isArray(contour[0][0])) {
    contour = [contour];
  }
  contour[idx] = [];
  return contour;
}


function connectEdges(sortedEvents) {
  // copy the events in the result polygon to resultEvents array
  var resultEvents = [];
  var event, i, len;

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
    if (!resultEvents[i].left) {
      var temp = resultEvents[i].pos;
      resultEvents[i].pos = resultEvents[i].otherEvent.pos;
      resultEvents[i].otherEvent.pos = temp;
    }
  }

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

    var contourId = result.length - 1;
    depth.push(0);
    holeOf.push(-1);


    if (resultEvents[i].prevInResult) {
      var lowerContourId = resultEvents[i].prevInResult.contourId;
      if (!resultEvents[i].prevInResult.resultInOut) {
        addHole(result[lowerContourId], contourId);
        holeOf[contourId] = lowerContourId;
        depth[contourId]  = depth[lowerContourId] + 1;
        isHole[contourId] = true;
      } else if (isHole[lowerContourId]) {
        addHole(result[holeOf[lowerContourId]], contourId);
        holeOf[contourId] = holeOf[lowerContourId];
        depth[contourId]  = depth[lowerContourId];
        isHole[contourId] = true;
      }
    }

    var pos = i;
    var initial = resultEvents[i].point;
    contour.push(initial);

    while (pos >= i) {
      processed[pos] = true;

      if (resultEvents[pos].left) {
        resultEvents[pos].resultInOut = false;
        resultEvents[pos].contourId   = contourId;
      } else {
        resultEvents[pos].otherEvent.resultInOut = true;
        resultEvents[pos].otherEvent.contourId   = contourId;
      }

      pos = resultEvents[pos].pos;
      processed[pos] = true;

      contour.push(resultEvents[pos].point);
      pos = nextPos(pos, resultEvents, processed);
    }

    pos = pos === -1 ? i : pos;

    processed[pos] = processed[resultEvents[pos].pos] = true;
    resultEvents[pos].otherEvent.resultInOut = true;
    resultEvents[pos].otherEvent.contourId   = contourId;




    // depth is even
    /* eslint-disable no-bitwise */
    if (depth[contourId] & 1) {
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

},{}],21:[function(require,module,exports){
(function (global){
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


/**
 * @param  {Number} dist
 * @return {Array.<Number>}
 */
Offset.prototype.margin = function(dist) {
  this.distance(dist);

  if (dist === 0) return this.ensureLastPoint(this.vertices);
  if (this.vertices.length === 1) return this.offsetPoint(this._distance);

  this.ensureLastPoint(this.vertices);
  var union = this.offsetLine(this._distance);
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
  var union = this.offsetLine(this._distance);
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vZmZzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBFZGdlID0gcmVxdWlyZSgnLi9lZGdlJyk7XG52YXIgbWFydGluZXogPSBnbG9iYWwubWFydGluZXogPSByZXF1aXJlKCdtYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nJyk7XG5cbnZhciBhdGFuMiA9IE1hdGguYXRhbjI7XG5cbi8qKlxuICogT2Zmc2V0IGJ1aWxkZXJcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+PX0gdmVydGljZXNcbiAqIEBwYXJhbSB7TnVtYmVyPX0gICAgICAgIGFyY1NlZ21lbnRzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gT2Zmc2V0KHZlcnRpY2VzLCBhcmNTZWdtZW50cykge1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59XG4gICAqL1xuICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcblxuICAvKipcbiAgICogQHR5cGUge0FycmF5LjxFZGdlPn1cbiAgICovXG4gIHRoaXMuZWRnZXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuX2Nsb3NlZCA9IGZhbHNlO1xuXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9kaXN0YW5jZSA9IDA7XG5cbiAgaWYgKHZlcnRpY2VzKSB7XG4gICAgICB0aGlzLmRhdGEodmVydGljZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZ21lbnRzIGluIGVkZ2UgYm91bmRpbmcgYXJjaGVzXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBhcmNTZWdtZW50cyA6IDU7XG59XG5cbi8qKlxuICogQ2hhbmdlIGRhdGEgc2V0XG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXk+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2ZXJ0aWNlcyA9IHRoaXMudmFsaWRhdGUodmVydGljZXMpO1xuXG4gIGlmICh2ZXJ0aWNlcy5sZW5ndGggPiAxKSB7XG4gICAgdmFyIGVkZ2VzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZlcnRpY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBlZGdlcy5wdXNoKG5ldyBFZGdlKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbGVuXSkpO1xuICAgIH1cbiAgICB0aGlzLmVkZ2VzID0gZWRnZXM7XG4gIH1cbiAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gYXJjU2VnbWVudHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5hcmNTZWdtZW50cyA9IGZ1bmN0aW9uKGFyY1NlZ21lbnRzKSB7XG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFZhbGlkYXRlcyBpZiB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnRzIHJlcGVhdFxuICogVE9ETzogY2hlY2sgQ0NXXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IHZlcnRpY2VzXG4gKi9cbk9mZnNldC5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2YXIgbGVuID0gdmVydGljZXMubGVuZ3RoO1xuICBpZiAodHlwZW9mIHZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykgcmV0dXJuIFt2ZXJ0aWNlc107XG4gIGlmICh2ZXJ0aWNlc1swXVswXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMF0gJiZcbiAgICB2ZXJ0aWNlc1swXVsxXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMV0pIHtcbiAgICBpZiAobGVuID4gMSkge1xuICAgICAgdmVydGljZXMgPSB2ZXJ0aWNlcy5zbGljZSgwLCBsZW4gLSAxKTtcbiAgICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIGFyY2ggYmV0d2VlbiB0d28gZWRnZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICByYWRpdXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBzdGFydFZlcnRleFxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGVuZFZlcnRleFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHNlZ21lbnRzXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgb3V0d2FyZHNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5jcmVhdGVBcmMgPSBmdW5jdGlvbih2ZXJ0aWNlcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0VmVydGV4LFxuICAgIGVuZFZlcnRleCwgc2VnbWVudHMsIG91dHdhcmRzKSB7XG5cbiAgdmFyIFBJMiA9IE1hdGguUEkgKiAyLFxuICAgICAgc3RhcnRBbmdsZSA9IGF0YW4yKHN0YXJ0VmVydGV4WzFdIC0gY2VudGVyWzFdLCBzdGFydFZlcnRleFswXSAtIGNlbnRlclswXSksXG4gICAgICBlbmRBbmdsZSA9IGF0YW4yKGVuZFZlcnRleFsxXSAtIGNlbnRlclsxXSwgZW5kVmVydGV4WzBdIC0gY2VudGVyWzBdKTtcblxuICAvLyBvZGQgbnVtYmVyIHBsZWFzZVxuICBpZiAoc2VnbWVudHMgJSAyID09PSAwKSB7XG4gICAgc2VnbWVudHMgLT0gMTtcbiAgfVxuXG4gIGlmIChzdGFydEFuZ2xlIDwgMCkge1xuICAgIHN0YXJ0QW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgaWYgKGVuZEFuZ2xlIDwgMCkge1xuICAgIGVuZEFuZ2xlICs9IFBJMjtcbiAgfVxuXG4gIHZhciBhbmdsZSA9ICgoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSA/XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSA6XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSArIFBJMiAtIGVuZEFuZ2xlKSksXG4gICAgICBzZWdtZW50QW5nbGUgPSAoKG91dHdhcmRzKSA/IC1hbmdsZSA6IFBJMiAtIGFuZ2xlKSAvIHNlZ21lbnRzO1xuXG4gIHZlcnRpY2VzLnB1c2goc3RhcnRWZXJ0ZXgpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNlZ21lbnRzOyArK2kpIHtcbiAgICBhbmdsZSA9IHN0YXJ0QW5nbGUgKyBzZWdtZW50QW5nbGUgKiBpO1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLFxuICAgICAgY2VudGVyWzFdICsgTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzXG4gICAgXSk7XG4gIH1cbiAgdmVydGljZXMucHVzaChlbmRWZXJ0ZXgpO1xuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSAgZGlzdFxuICogQHBhcmFtICB7U3RyaW5nPX0gdW5pdHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uKGRpc3QsIHVuaXRzKSB7XG4gIHRoaXMuX2Rpc3RhbmNlID0gZGlzdCB8fCAwO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICBkZWdyZWVzXG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB1bml0c1xuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5PZmZzZXQuZGVncmVlc1RvVW5pdHMgPSBmdW5jdGlvbihkZWdyZWVzLCB1bml0cykge1xuICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgY2FzZSAnbWlsZXMnOlxuICAgICAgZGVncmVlcyA9IGRlZ3JlZXMgLyA2OS4wNDc7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnZmVldCc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDM2NDU2OC4wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAna2lsb21ldGVycyc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDExMS4xMjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21ldGVycyc6XG4gICAgY2FzZSAnbWV0cmVzJzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMTExMTIwLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdkZWdyZWVzJzpcbiAgICBjYXNlICdwaXhlbHMnOlxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZGVncmVlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmVuc3VyZUxhc3RQb2ludCA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIGlmICh0aGlzLl9jbG9zZWQpIHtcbiAgICB2ZXJ0aWNlcy5wdXNoKFtcbiAgICAgIHZlcnRpY2VzWzBdWzBdLFxuICAgICAgdmVydGljZXNbMF1bMV1cbiAgICBdKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogRGVjaWRlcyBieSB0aGUgc2lnbiBpZiBpdCdzIGEgcGFkZGluZyBvciBhIG1hcmdpblxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuICByZXR1cm4gdGhpcy5fZGlzdGFuY2UgPT09IDAgPyB0aGlzLnZlcnRpY2VzIDpcbiAgICAgICh0aGlzLl9kaXN0YW5jZSA+IDAgPyB0aGlzLm1hcmdpbih0aGlzLl9kaXN0YW5jZSkgOlxuICAgICAgICB0aGlzLnBhZGRpbmcoLXRoaXMuX2Rpc3RhbmNlKSk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgICAgICAgIHB0MVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICAgICAgICAgcHQyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLl9vZmZzZXRTZWdtZW50ID0gZnVuY3Rpb24odmVydGljZXMsIHB0MSwgcHQyLCBkaXN0KSB7XG4gIHZhciBlZGdlcyA9IFtuZXcgRWRnZShwdDEsIHB0MiksIG5ldyBFZGdlKHB0MiwgcHQxKV07XG4gIHZhciBpLCBsZW4gPSAyO1xuXG4gIHZhciBvZmZzZXRzID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcbiAgICB2YXIgZHggPSBlZGdlLl9pbk5vcm1hbFswXSAqIGRpc3Q7XG4gICAgdmFyIGR5ID0gZWRnZS5faW5Ob3JtYWxbMV0gKiBkaXN0O1xuXG4gICAgb2Zmc2V0cy5wdXNoKGVkZ2Uub2Zmc2V0KGR4LCBkeSkpO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIHRoaXNFZGdlID0gb2Zmc2V0c1tpXSxcbiAgICAgICAgcHJldkVkZ2UgPSBvZmZzZXRzWyhpICsgbGVuIC0gMSkgJSBsZW5dO1xuICAgIHRoaXMuY3JlYXRlQXJjKFxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLFxuICAgICAgICAgICAgICAgIGVkZ2VzW2ldLmN1cnJlbnQsIC8vIHAxIG9yIHAyXG4gICAgICAgICAgICAgICAgZGlzdCxcbiAgICAgICAgICAgICAgICBwcmV2RWRnZS5uZXh0LFxuICAgICAgICAgICAgICAgIHRoaXNFZGdlLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5fYXJjU2VnbWVudHMsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5tYXJnaW4gPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG5cbiAgaWYgKGRpc3QgPT09IDApIHJldHVybiB0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKTtcbiAgaWYgKHRoaXMudmVydGljZXMubGVuZ3RoID09PSAxKSByZXR1cm4gdGhpcy5vZmZzZXRQb2ludCh0aGlzLl9kaXN0YW5jZSk7XG5cbiAgdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG4gIHZhciB1bmlvbiA9IHRoaXMub2Zmc2V0TGluZSh0aGlzLl9kaXN0YW5jZSk7XG4gIHVuaW9uID0gbWFydGluZXoudW5pb24odW5pb24sIFt0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKV0pO1xuICByZXR1cm4gdW5pb247XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5wYWRkaW5nID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuXG4gIGlmICh0aGlzLl9kaXN0YW5jZSA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICBpZiAodGhpcy52ZXJ0aWNlcy5sZW5ndGggPT09IDEpIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuXG4gIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmUodGhpcy5fZGlzdGFuY2UpO1xuICB2YXIgZGlmZiA9IG1hcnRpbmV6LmRpZmYodGhpcy52ZXJ0aWNlcywgdW5pb24pO1xuICByZXR1cm4gZGlmZjtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIG1hcmdpbiBwb2x5Z29uXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldExpbmUgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG4gIGlmICh0aGlzLl9kaXN0YW5jZSA9PT0gMCkgcmV0dXJuIHRoaXMudmVydGljZXM7XG5cbiAgdmFyIHZlcnRpY2VzID0gW107XG4gIHZhciB1bmlvbiAgICA9IFtdO1xuICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBzZWdtZW50ID0gdGhpcy5lbnN1cmVMYXN0UG9pbnQoXG4gICAgICAgIHRoaXMuX29mZnNldFNlZ21lbnQoW10sIHRoaXMudmVydGljZXNbaV0sIHRoaXMudmVydGljZXNbaSArIDFdLCB0aGlzLl9kaXN0YW5jZSlcbiAgICApO1xuICAgIHZlcnRpY2VzLnB1c2goc2VnbWVudCk7XG4gICAgdW5pb24gPSAoaSA9PT0gMCkgPyBzZWdtZW50IDogbWFydGluZXoudW5pb24odW5pb24sIHNlZ21lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMudmVydGljZXMubGVuZ3RoID4gMiA/IHVuaW9uIDogW3VuaW9uXTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0UG9pbnQgPSBmdW5jdGlvbihkaXN0YW5jZSkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3RhbmNlKTtcbiAgdmFyIHZlcnRpY2VzID0gdGhpcy5fYXJjU2VnbWVudHMgKiAyO1xuICB2YXIgcG9pbnRzICAgPSBbXTtcbiAgdmFyIGNlbnRlciAgID0gdGhpcy52ZXJ0aWNlc1swXTtcbiAgdmFyIHJhZGl1cyAgID0gdGhpcy5fZGlzdGFuY2U7XG4gIHZhciBhbmdsZSAgICA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZXJ0aWNlcyAtIDE7IGkrKykge1xuICAgIGFuZ2xlICs9ICgyICogTWF0aC5QSSAvIHZlcnRpY2VzKTsgLy8gY291bnRlci1jbG9ja3dpc2VcbiAgICBwb2ludHMucHVzaChbXG4gICAgICBjZW50ZXJbMF0gKyAocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpKSxcbiAgICAgIGNlbnRlclsxXSArIChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpXG4gICAgXSk7XG4gIH1cblxuICByZXR1cm4gcG9pbnRzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPZmZzZXQ7XG4iXX0=
},{"./edge":20,"martinez-polygon-clipping":10}],22:[function(require,module,exports){
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
        "coordinates": [114.18949127197267, 22.271802170346884]
      }
    }
  ]
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9hcHAuanMiLCJleGFtcGxlL2xlYWZsZXRfbXVsdGlwb2x5Z29uLmpzIiwiZXhhbXBsZS9vZmZzZXRfY29udHJvbC5qcyIsImV4YW1wbGUvcG9seWdvbl9jb250cm9sLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9iaW50cmVlLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9yYnRyZWUuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL3RyZWViYXNlLmpzIiwibm9kZV9tb2R1bGVzL2dlb2pzb24tcHJvamVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfc2VnbWVudHMuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvZWRnZV90eXBlLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2VxdWFscy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zZWdtZW50X2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zaWduZWRfYXJlYS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zd2VlcF9ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW55cXVldWUvaW5kZXguanMiLCJzcmMvZWRnZS5qcyIsInNyYy9vZmZzZXQuanMiLCJ0ZXN0L2ZpeHR1cmVzL2RlbW8uanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2b0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9mZnNldCA9IHJlcXVpcmUoJy4uL3NyYy9vZmZzZXQnKTtcbnJlcXVpcmUoJy4vbGVhZmxldF9tdWx0aXBvbHlnb24nKTtcbnJlcXVpcmUoJy4vcG9seWdvbl9jb250cm9sJyk7XG52YXIgT2Zmc2V0Q29udHJvbCA9IHJlcXVpcmUoJy4vb2Zmc2V0X2NvbnRyb2wnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9kZW1vLmpzb24nKTtcbnZhciBwcm9qZWN0ID0gcmVxdWlyZSgnZ2VvanNvbi1wcm9qZWN0Jyk7XG5cbnZhciBhcmNTZWdtZW50cyA9IDUwO1xuXG52YXIgc3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgY29sb3I6ICcjNDhmJyxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICBkYXNoQXJyYXk6IFsyLCA0XVxuICAgIH0sXG4gICAgbWFyZ2luU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjMjc2RDhGJ1xuICAgIH0sXG4gICAgcGFkZGluZ1N0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnI0Q4MTcwNidcbiAgICB9LFxuICAgIGNlbnRlciA9IFsyMi4yNjcwLCAxMTQuMTg4XSxcbiAgICB6b29tID0gMTcsXG4gICAgbWFwLCB2ZXJ0aWNlcywgcmVzdWx0O1xuXG5tYXAgPSBnbG9iYWwubWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgem9vbSk7XG5cblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld1BvaW50Q29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0TWFya2VyXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKGRhdGEpLmFkZFRvKG1hcCk7XG52YXIgcmVzdWx0cyA9IGdsb2JhbC5yZXN1bHRzID0gTC5nZW9Kc29uKG51bGwsIHtcbiAgc3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFyZ2luU3R5bGU7XG4gIH1cbn0pLmFkZFRvKG1hcCk7XG5tYXAuZml0Qm91bmRzKGxheWVycy5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBydW4gKG1hcmdpbikge1xuICByZXN1bHRzLmNsZWFyTGF5ZXJzKCk7XG4gIGxheWVycy5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgZ2ogPSBsYXllci50b0dlb0pTT04oKTtcbiAgICBjb25zb2xlLmxvZyhnaiwgbWFyZ2luKTtcbiAgICBpZiAobWFyZ2luID09PSAwKSByZXR1cm47XG4gICAgdmFyIHNoYXBlID0gcHJvamVjdChnaiwgZnVuY3Rpb24oY29vcmQpIHtcbiAgICAgIHZhciBwdCA9IG1hcC5vcHRpb25zLmNycy5sYXRMbmdUb1BvaW50KEwubGF0TG5nKGNvb3JkLnNsaWNlKCkucmV2ZXJzZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW3B0LngsIHB0LnldO1xuICAgIH0pO1xuXG4gICAgdmFyIG1hcmdpbmVkO1xuICAgIGlmIChnai5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpLm9mZnNldExpbmUobWFyZ2luKTtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpLm9mZnNldChtYXJnaW4pO1xuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtyZXNdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdKS5vZmZzZXQobWFyZ2luKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdtYXJnaW5lZCcsIG1hcmdpbmVkKTtcbiAgICByZXN1bHRzLmFkZERhdGEocHJvamVjdChtYXJnaW5lZCwgZnVuY3Rpb24ocHQpIHtcbiAgICAgIHZhciBsbCA9IG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocHQuc2xpY2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtsbC5sbmcsIGxsLmxhdF07XG4gICAgfSkpO1xuICB9KTtcbn1cblxucnVuICgyMCk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1WNFlXMXdiR1V2WVhCd0xtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU0lzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJRTltWm5ObGRDQTlJSEpsY1hWcGNtVW9KeTR1TDNOeVl5OXZabVp6WlhRbktUdGNibkpsY1hWcGNtVW9KeTR2YkdWaFpteGxkRjl0ZFd4MGFYQnZiSGxuYjI0bktUdGNibkpsY1hWcGNtVW9KeTR2Y0c5c2VXZHZibDlqYjI1MGNtOXNKeWs3WEc1MllYSWdUMlptYzJWMFEyOXVkSEp2YkNBOUlISmxjWFZwY21Vb0p5NHZiMlptYzJWMFgyTnZiblJ5YjJ3bktUdGNiblpoY2lCa1lYUmhJRDBnY21WeGRXbHlaU2duTGk0dmRHVnpkQzltYVhoMGRYSmxjeTlrWlcxdkxtcHpiMjRuS1R0Y2JuWmhjaUJ3Y205cVpXTjBJRDBnY21WeGRXbHlaU2duWjJWdmFuTnZiaTF3Y205cVpXTjBKeWs3WEc1Y2JuWmhjaUJoY21OVFpXZHRaVzUwY3lBOUlEVXdPMXh1WEc1MllYSWdjM1I1YkdVZ1BTQjdYRzRnSUNBZ0lDQWdJSGRsYVdkb2REb2dNeXhjYmlBZ0lDQWdJQ0FnWTI5c2IzSTZJQ2NqTkRobUp5eGNiaUFnSUNBZ0lDQWdiM0JoWTJsMGVUb2dNQzQ0TEZ4dUlDQWdJQ0FnSUNCa1lYTm9RWEp5WVhrNklGc3lMQ0EwWFZ4dUlDQWdJSDBzWEc0Z0lDQWdiV0Z5WjJsdVUzUjViR1VnUFNCN1hHNGdJQ0FnSUNBZ0lIZGxhV2RvZERvZ01peGNiaUFnSUNBZ0lDQWdZMjlzYjNJNklDY2pNamMyUkRoR0oxeHVJQ0FnSUgwc1hHNGdJQ0FnY0dGa1pHbHVaMU4wZVd4bElEMGdlMXh1SUNBZ0lDQWdJQ0IzWldsbmFIUTZJRElzWEc0Z0lDQWdJQ0FnSUdOdmJHOXlPaUFuSTBRNE1UY3dOaWRjYmlBZ0lDQjlMRnh1SUNBZ0lHTmxiblJsY2lBOUlGc3lNaTR5Tmpjd0xDQXhNVFF1TVRnNFhTeGNiaUFnSUNCNmIyOXRJRDBnTVRjc1hHNGdJQ0FnYldGd0xDQjJaWEowYVdObGN5d2djbVZ6ZFd4ME8xeHVYRzV0WVhBZ1BTQm5iRzlpWVd3dWJXRndJRDBnVEM1dFlYQW9KMjFoY0Njc0lIdGNiaUFnWldScGRHRmliR1U2SUhSeWRXVXNYRzRnSUcxaGVGcHZiMjA2SURJeVhHNTlLUzV6WlhSV2FXVjNLR05sYm5SbGNpd2dlbTl2YlNrN1hHNWNibHh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUV3dVRtVjNVRzlzZVdkdmJrTnZiblJ5YjJ3b2UxeHVJQ0JqWVd4c1ltRmphem9nYldGd0xtVmthWFJVYjI5c2N5NXpkR0Z5ZEZCdmJIbG5iMjVjYm4wcEtUdGNibHh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUV3dVRtVjNUR2x1WlVOdmJuUnliMndvZTF4dUlDQmpZV3hzWW1GamF6b2diV0Z3TG1Wa2FYUlViMjlzY3k1emRHRnlkRkJ2Ykhsc2FXNWxYRzU5S1NrN1hHNWNibTFoY0M1aFpHUkRiMjUwY205c0tHNWxkeUJNTGs1bGQxQnZhVzUwUTI5dWRISnZiQ2g3WEc0Z0lHTmhiR3hpWVdOck9pQnRZWEF1WldScGRGUnZiMnh6TG5OMFlYSjBUV0Z5YTJWeVhHNTlLU2s3WEc1Y2JuWmhjaUJzWVhsbGNuTWdQU0JuYkc5aVlXd3ViR0Y1WlhKeklEMGdUQzVuWlc5S2MyOXVLR1JoZEdFcExtRmtaRlJ2S0cxaGNDazdYRzUyWVhJZ2NtVnpkV3gwY3lBOUlHZHNiMkpoYkM1eVpYTjFiSFJ6SUQwZ1RDNW5aVzlLYzI5dUtHNTFiR3dzSUh0Y2JpQWdjM1I1YkdVNklHWjFibU4wYVc5dUtHWmxZWFIxY21VcElIdGNiaUFnSUNCeVpYUjFjbTRnYldGeVoybHVVM1I1YkdVN1hHNGdJSDFjYm4wcExtRmtaRlJ2S0cxaGNDazdYRzV0WVhBdVptbDBRbTkxYm1SektHeGhlV1Z5Y3k1blpYUkNiM1Z1WkhNb0tTd2dleUJoYm1sdFlYUmxPaUJtWVd4elpTQjlLVHRjYmx4dWJXRndMbUZrWkVOdmJuUnliMndvYm1WM0lFOW1abk5sZEVOdmJuUnliMndvZTF4dUlDQmpiR1ZoY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2JHRjVaWEp6TG1Oc1pXRnlUR0Y1WlhKektDazdYRzRnSUgwc1hHNGdJR05oYkd4aVlXTnJPaUJ5ZFc1Y2JuMHBLVHRjYmx4dWJXRndMbTl1S0NkbFpHbDBZV0pzWlRwamNtVmhkR1ZrSnl3Z1puVnVZM1JwYjI0b1pYWjBLU0I3WEc0Z0lHeGhlV1Z5Y3k1aFpHUk1ZWGxsY2lobGRuUXViR0Y1WlhJcE8xeHVJQ0JsZG5RdWJHRjVaWEl1YjI0b0oyTnNhV05ySnl3Z1puVnVZM1JwYjI0b1pTa2dlMXh1SUNBZ0lHbG1JQ2dvWlM1dmNtbG5hVzVoYkVWMlpXNTBMbU4wY214TFpYa2dmSHdnWlM1dmNtbG5hVzVoYkVWMlpXNTBMbTFsZEdGTFpYa3BJQ1ltSUhSb2FYTXVaV1JwZEVWdVlXSnNaV1FvS1NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVsWkdsMGIzSXVibVYzU0c5c1pTaGxMbXhoZEd4dVp5azdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JuMHBPMXh1WEc1bWRXNWpkR2x2YmlCeWRXNGdLRzFoY21kcGJpa2dlMXh1SUNCeVpYTjFiSFJ6TG1Oc1pXRnlUR0Y1WlhKektDazdYRzRnSUd4aGVXVnljeTVsWVdOb1RHRjVaWElvWm5WdVkzUnBiMjRvYkdGNVpYSXBJSHRjYmlBZ0lDQjJZWElnWjJvZ1BTQnNZWGxsY2k1MGIwZGxiMHBUVDA0b0tUdGNiaUFnSUNCamIyNXpiMnhsTG14dlp5aG5haXdnYldGeVoybHVLVHRjYmlBZ0lDQnBaaUFvYldGeVoybHVJRDA5UFNBd0tTQnlaWFIxY200N1hHNGdJQ0FnZG1GeUlITm9ZWEJsSUQwZ2NISnZhbVZqZENobmFpd2dablZ1WTNScGIyNG9ZMjl2Y21RcElIdGNiaUFnSUNBZ0lIWmhjaUJ3ZENBOUlHMWhjQzV2Y0hScGIyNXpMbU55Y3k1c1lYUk1ibWRVYjFCdmFXNTBLRXd1YkdGMFRHNW5LR052YjNKa0xuTnNhV05sS0NrdWNtVjJaWEp6WlNncEtTd2diV0Z3TG1kbGRGcHZiMjBvS1NrN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVzNCMExuZ3NJSEIwTG5sZE8xeHVJQ0FnSUgwcE8xeHVYRzRnSUNBZ2RtRnlJRzFoY21kcGJtVmtPMXh1SUNBZ0lHbG1JQ2huYWk1blpXOXRaWFJ5ZVM1MGVYQmxJRDA5UFNBblRHbHVaVk4wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJR2xtSUNodFlYSm5hVzRnUENBd0tTQnlaWFIxY200N1hHNGdJQ0FnSUNCMllYSWdjbVZ6SUQwZ2JtVjNJRTltWm5ObGRDaHphR0Z3WlM1blpXOXRaWFJ5ZVM1amIyOXlaR2x1WVhSbGN5a3VZWEpqVTJWbmJXVnVkSE1vWVhKalUyVm5iV1Z1ZEhNcExtOW1abk5sZEV4cGJtVW9iV0Z5WjJsdUtUdGNiaUFnSUNBZ0lHMWhjbWRwYm1Wa0lEMGdlMXh1SUNBZ0lDQWdJQ0IwZVhCbE9pQW5SbVZoZEhWeVpTY3NYRzRnSUNBZ0lDQWdJR2RsYjIxbGRISjVPaUI3WEc0Z0lDQWdJQ0FnSUNBZ2RIbHdaVG9nSjFCdmJIbG5iMjRuTEZ4dUlDQWdJQ0FnSUNBZ0lHTnZiM0prYVc1aGRHVnpPaUJ5WlhOY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tHZHFMbWRsYjIxbGRISjVMblI1Y0dVZ1BUMDlJQ2RRYjJsdWRDY3BJSHRjYmlBZ0lDQWdJR2xtSUNodFlYSm5hVzRnUENBd0tTQnlaWFIxY200N1hHNGdJQ0FnSUNCMllYSWdjbVZ6SUQwZ2JtVjNJRTltWm5ObGRDaHphR0Z3WlM1blpXOXRaWFJ5ZVM1amIyOXlaR2x1WVhSbGN5a3VZWEpqVTJWbmJXVnVkSE1vWVhKalUyVm5iV1Z1ZEhNcExtOW1abk5sZENodFlYSm5hVzRwTzF4dUlDQWdJQ0FnYldGeVoybHVaV1FnUFNCN1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUNkR1pXRjBkWEpsSnl4Y2JpQWdJQ0FnSUNBZ1oyVnZiV1YwY25rNklIdGNiaUFnSUNBZ0lDQWdJQ0IwZVhCbE9pQW5VRzlzZVdkdmJpY3NYRzRnSUNBZ0lDQWdJQ0FnWTI5dmNtUnBibUYwWlhNNklGdHlaWE5kWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJRzFoY21kcGJtVmtJRDBnZTF4dUlDQWdJQ0FnSUNCMGVYQmxPaUFuUm1WaGRIVnlaU2NzWEc0Z0lDQWdJQ0FnSUdkbGIyMWxkSEo1T2lCN1hHNGdJQ0FnSUNBZ0lDQWdkSGx3WlRvZ0oxQnZiSGxuYjI0bkxGeHVJQ0FnSUNBZ0lDQWdJR052YjNKa2FXNWhkR1Z6T2lCdVpYY2dUMlptYzJWMEtITm9ZWEJsTG1kbGIyMWxkSEo1TG1OdmIzSmthVzVoZEdWeld6QmRLUzV2Wm1aelpYUW9iV0Z5WjJsdUtWeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlPMXh1SUNBZ0lIMWNibHh1SUNBZ0lHTnZibk52YkdVdWJHOW5LQ2R0WVhKbmFXNWxaQ2NzSUcxaGNtZHBibVZrS1R0Y2JpQWdJQ0J5WlhOMWJIUnpMbUZrWkVSaGRHRW9jSEp2YW1WamRDaHRZWEpuYVc1bFpDd2dablZ1WTNScGIyNG9jSFFwSUh0Y2JpQWdJQ0FnSUhaaGNpQnNiQ0E5SUcxaGNDNXZjSFJwYjI1ekxtTnljeTV3YjJsdWRGUnZUR0YwVEc1bktFd3VjRzlwYm5Rb2NIUXVjMnhwWTJVb0tTa3NJRzFoY0M1blpYUmFiMjl0S0NrcE8xeHVJQ0FnSUNBZ2NtVjBkWEp1SUZ0c2JDNXNibWNzSUd4c0xteGhkRjA3WEc0Z0lDQWdmU2twTzF4dUlDQjlLVHRjYm4xY2JseHVjblZ1SUNneU1DazdYRzRpWFgwPSIsIkwuUG9seWdvbi5wcm90b3R5cGUuX3Byb2plY3RMYXRsbmdzID0gZnVuY3Rpb24gKGxhdGxuZ3MsIHJlc3VsdCwgcHJvamVjdGVkQm91bmRzLCBpc0hvbGUpIHtcbiAgdmFyIGZsYXQgPSBsYXRsbmdzWzBdIGluc3RhbmNlb2YgTC5MYXRMbmcsXG4gICAgICBsZW4gPSBsYXRsbmdzLmxlbmd0aCxcbiAgICAgIGksIHJpbmcsIGFyZWE7XG5cbiAgaWYgKGZsYXQpIHtcbiAgICBhcmVhID0gMDtcbiAgICByaW5nID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICByaW5nW2ldID0gdGhpcy5fbWFwLmxhdExuZ1RvTGF5ZXJQb2ludChsYXRsbmdzW2ldKTtcbiAgICAgIHByb2plY3RlZEJvdW5kcy5leHRlbmQocmluZ1tpXSk7XG5cbiAgICAgIGlmIChpKSB7XG4gICAgICAgIGFyZWEgKz0gcmluZ1tpIC0gMV0ueCAqIHJpbmdbaV0ueTtcbiAgICAgICAgYXJlYSAtPSByaW5nW2ldLnggKiByaW5nW2kgLSAxXS55O1xuICAgICAgfVxuICAgIH1cbiAgICBhcmVhICs9IHJpbmdbbGVuIC0gMV0ueCAqIHJpbmdbMF0ueTtcbiAgICBhcmVhIC09IHJpbmdbMF0ueCAqIHJpbmdbbGVuIC0gMV0ueTtcblxuICAgIGlmICgoIWlzSG9sZSAmJiBhcmVhID4gMCkgfHwgKGlzSG9sZSAmJiBhcmVhIDwgMCkpIHtcbiAgICAgIHJpbmcucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKHJpbmcpO1xuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGhpcy5fcHJvamVjdExhdGxuZ3MobGF0bG5nc1tpXSwgcmVzdWx0LCBwcm9qZWN0ZWRCb3VuZHMsIGkgIT09IDApO1xuICAgIH1cbiAgfVxufTtcblxuXG5MLlBvbHlnb24ucHJvdG90eXBlLl9wcm9qZWN0ID0gZnVuY3Rpb24oKSB7XG4gIEwuUG9seWxpbmUucHJvdG90eXBlLl9wcm9qZWN0LmNhbGwodGhpcyk7XG4gIGlmICgodGhpcy5fbGF0bG5ncy5sZW5ndGggPiAxKSAmJlxuICAgICFMLlBvbHlsaW5lLl9mbGF0KHRoaXMuX2xhdGxuZ3MpICYmXG4gICAgISh0aGlzLl9sYXRsbmdzWzBdWzBdIGluc3RhbmNlb2YgTC5MYXRMbmcpKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5maWxsUnVsZSAhPT0gJ25vbnplcm8nKSB7XG4gICAgICB0aGlzLnNldFN0eWxlKHtcbiAgICAgICAgZmlsbFJ1bGU6ICdub256ZXJvJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gTC5Db250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcHJpZ2h0JyxcbiAgICBkZWZhdWx0TWFyZ2luOiAyMFxuICB9LFxuXG4gIG9uQWRkOiBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgJ2xlYWZsZXQtYmFyJyk7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmQgPSAnI2ZmZmZmZic7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLnBhZGRpbmcgPSAnMTBweCc7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFtcbiAgICAgICc8Zm9ybT4nLFxuICAgICAgICAnPGRpdj4nLFxuICAgICAgICAgICc8bGFiZWw+JyxcbiAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMFwiIG1heD1cIjEwMFwiIHZhbHVlPVwiJywgIHRoaXMub3B0aW9ucy5kZWZhdWx0TWFyZ2luLCAnXCIgbmFtZT1cIm1hcmdpblwiPicsXG4gICAgICAgICAgJzwvbGFiZWw+JyxcbiAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICc8ZGl2PicsXG4gICAgICAgICAgJzxsYWJlbD4nLCAnPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJvcGVyYXRpb25cIiB2YWx1ZT1cIjFcIiBjaGVja2VkPicsICcgbWFyZ2luPC9sYWJlbD4nLFxuICAgICAgICAgICc8bGFiZWw+JywgJzxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwib3BlcmF0aW9uXCIgdmFsdWU9XCItMVwiPicsICcgcGFkZGluZzwvbGFiZWw+JyxcbiAgICAgICAgJzwvZGl2PicsICc8YnI+JyxcbiAgICAgICAgJzxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJSdW5cIj4nLCAnPGlucHV0IG5hbWU9XCJjbGVhclwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIkNsZWFyIGxheWVyc1wiPicsXG4gICAgICAnPC9mb3JtPiddLmpvaW4oJycpO1xuXG4gICAgdmFyIGZvcm0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIEwuRG9tRXZlbnRcbiAgICAgIC5vbihmb3JtLCAnc3VibWl0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBMLkRvbUV2ZW50LnN0b3AoZXZ0KTtcbiAgICAgICAgdmFyIG1hcmdpbiA9IHBhcnNlRmxvYXQoZm9ybVsnbWFyZ2luJ10udmFsdWUpO1xuICAgICAgICB2YXIgcmFkaW9zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoXG4gICAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPXJhZGlvXScpKTtcbiAgICAgICAgdmFyIGsgPSAxO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmFkaW9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKHJhZGlvc1tpXS5jaGVja2VkKSB7XG4gICAgICAgICAgICBrICo9IHBhcnNlSW50KHJhZGlvc1tpXS52YWx1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRpb25zLmNhbGxiYWNrKG1hcmdpbiAqIGspO1xuICAgICAgfSwgdGhpcylcbiAgICAgIC5vbihmb3JtWydjbGVhciddLCAnY2xpY2snLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgTC5Eb21FdmVudC5zdG9wKGV2dCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5jbGVhcigpO1xuICAgICAgfSwgdGhpcyk7XG5cbiAgICBMLkRvbUV2ZW50XG4gICAgICAuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24odGhpcy5fY29udGFpbmVyKVxuICAgICAgLmRpc2FibGVTY3JvbGxQcm9wYWdhdGlvbih0aGlzLl9jb250YWluZXIpO1xuICAgIHJldHVybiB0aGlzLl9jb250YWluZXI7XG4gIH1cblxufSk7IiwiTC5FZGl0Q29udHJvbCA9IEwuQ29udHJvbC5leHRlbmQoe1xuXG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGNhbGxiYWNrOiBudWxsLFxuICAgIGtpbmQ6ICcnLFxuICAgIGh0bWw6ICcnXG4gIH0sXG5cbiAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcbiAgICB2YXIgY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgJ2xlYWZsZXQtY29udHJvbCBsZWFmbGV0LWJhcicpLFxuICAgICAgICBsaW5rID0gTC5Eb21VdGlsLmNyZWF0ZSgnYScsICcnLCBjb250YWluZXIpO1xuXG4gICAgbGluay5ocmVmID0gJyMnO1xuICAgIGxpbmsudGl0bGUgPSAnQ3JlYXRlIGEgbmV3ICcgKyB0aGlzLm9wdGlvbnMua2luZDtcbiAgICBsaW5rLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5odG1sO1xuICAgIEwuRG9tRXZlbnQub24obGluaywgJ2NsaWNrJywgTC5Eb21FdmVudC5zdG9wKVxuICAgICAgICAgICAgICAub24obGluaywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5MQVlFUiA9IHRoaXMub3B0aW9ucy5jYWxsYmFjay5jYWxsKG1hcC5lZGl0VG9vbHMpO1xuICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cblxufSk7XG5cbkwuTmV3UG9seWdvbkNvbnRyb2wgPSBMLkVkaXRDb250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGtpbmQ6ICdwb2x5Z29uJyxcbiAgICBodG1sOiAn4pawJ1xuICB9XG59KTtcblxuTC5OZXdMaW5lQ29udHJvbCA9IEwuRWRpdENvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAga2luZDogJ3BvbHlsaW5lJyxcbiAgICBodG1sOiAnLydcbiAgfVxufSk7XG5cbkwuTmV3UG9pbnRDb250cm9sID0gTC5FZGl0Q29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcbiAgICBraW5kOiAncG9pbnQnLFxuICAgIGh0bWw6ICcmIzk2Nzk7J1xuICB9XG59KTtcbiIsIm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFJCVHJlZTogcmVxdWlyZSgnLi9saWIvcmJ0cmVlJyksXG4gICAgQmluVHJlZTogcmVxdWlyZSgnLi9saWIvYmludHJlZScpXG59O1xuIiwiXG52YXIgVHJlZUJhc2UgPSByZXF1aXJlKCcuL3RyZWViYXNlJyk7XG5cbmZ1bmN0aW9uIE5vZGUoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5sZWZ0ID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0ID0gbnVsbDtcbn1cblxuTm9kZS5wcm90b3R5cGUuZ2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgcmV0dXJuIGRpciA/IHRoaXMucmlnaHQgOiB0aGlzLmxlZnQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIsIHZhbCkge1xuICAgIGlmKGRpcikge1xuICAgICAgICB0aGlzLnJpZ2h0ID0gdmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5sZWZ0ID0gdmFsO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIEJpblRyZWUoY29tcGFyYXRvcikge1xuICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICAgIHRoaXMuc2l6ZSA9IDA7XG59XG5cbkJpblRyZWUucHJvdG90eXBlID0gbmV3IFRyZWVCYXNlKCk7XG5cbi8vIHJldHVybnMgdHJ1ZSBpZiBpbnNlcnRlZCwgZmFsc2UgaWYgZHVwbGljYXRlXG5CaW5UcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBlbXB0eSB0cmVlXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHZhciBkaXIgPSAwO1xuXG4gICAgLy8gc2V0dXBcbiAgICB2YXIgcCA9IG51bGw7IC8vIHBhcmVudFxuICAgIHZhciBub2RlID0gdGhpcy5fcm9vdDtcblxuICAgIC8vIHNlYXJjaCBkb3duXG4gICAgd2hpbGUodHJ1ZSkge1xuICAgICAgICBpZihub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBpbnNlcnQgbmV3IG5vZGUgYXQgdGhlIGJvdHRvbVxuICAgICAgICAgICAgbm9kZSA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICAgICAgcC5zZXRfY2hpbGQoZGlyLCBub2RlKTtcbiAgICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gc3RvcCBpZiBmb3VuZFxuICAgICAgICBpZih0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSkgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuXG4gICAgICAgIGRpciA9IHRoaXMuX2NvbXBhcmF0b3Iobm9kZS5kYXRhLCBkYXRhKSA8IDA7XG5cbiAgICAgICAgLy8gdXBkYXRlIGhlbHBlcnNcbiAgICAgICAgcCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuICAgIH1cbn07XG5cbi8vIHJldHVybnMgdHJ1ZSBpZiByZW1vdmVkLCBmYWxzZSBpZiBub3QgZm91bmRcbkJpblRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG4gICAgdmFyIG5vZGUgPSBoZWFkO1xuICAgIG5vZGUucmlnaHQgPSB0aGlzLl9yb290O1xuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIGZvdW5kID0gbnVsbDsgLy8gZm91bmQgaXRlbVxuICAgIHZhciBkaXIgPSAxO1xuXG4gICAgd2hpbGUobm9kZS5nZXRfY2hpbGQoZGlyKSAhPT0gbnVsbCkge1xuICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG4gICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIG5vZGUuZGF0YSk7XG4gICAgICAgIGRpciA9IGNtcCA+IDA7XG5cbiAgICAgICAgaWYoY21wID09PSAwKSB7XG4gICAgICAgICAgICBmb3VuZCA9IG5vZGU7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpZihmb3VuZCAhPT0gbnVsbCkge1xuICAgICAgICBmb3VuZC5kYXRhID0gbm9kZS5kYXRhO1xuICAgICAgICBwLnNldF9jaGlsZChwLnJpZ2h0ID09PSBub2RlLCBub2RlLmdldF9jaGlsZChub2RlLmxlZnQgPT09IG51bGwpKTtcblxuICAgICAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gQmluVHJlZTtcblxuIiwiXG52YXIgVHJlZUJhc2UgPSByZXF1aXJlKCcuL3RyZWViYXNlJyk7XG5cbmZ1bmN0aW9uIE5vZGUoZGF0YSkge1xuICAgIHRoaXMuZGF0YSA9IGRhdGE7XG4gICAgdGhpcy5sZWZ0ID0gbnVsbDtcbiAgICB0aGlzLnJpZ2h0ID0gbnVsbDtcbiAgICB0aGlzLnJlZCA9IHRydWU7XG59XG5cbk5vZGUucHJvdG90eXBlLmdldF9jaGlsZCA9IGZ1bmN0aW9uKGRpcikge1xuICAgIHJldHVybiBkaXIgPyB0aGlzLnJpZ2h0IDogdGhpcy5sZWZ0O1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyLCB2YWwpIHtcbiAgICBpZihkaXIpIHtcbiAgICAgICAgdGhpcy5yaWdodCA9IHZhbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMubGVmdCA9IHZhbDtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBSQlRyZWUoY29tcGFyYXRvcikge1xuICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgIHRoaXMuX2NvbXBhcmF0b3IgPSBjb21wYXJhdG9yO1xuICAgIHRoaXMuc2l6ZSA9IDA7XG59XG5cblJCVHJlZS5wcm90b3R5cGUgPSBuZXcgVHJlZUJhc2UoKTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIGluc2VydGVkLCBmYWxzZSBpZiBkdXBsaWNhdGVcblJCVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXQgPSBmYWxzZTtcblxuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgLy8gZW1wdHkgdHJlZVxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdmFyIGhlYWQgPSBuZXcgTm9kZSh1bmRlZmluZWQpOyAvLyBmYWtlIHRyZWUgcm9vdFxuXG4gICAgICAgIHZhciBkaXIgPSAwO1xuICAgICAgICB2YXIgbGFzdCA9IDA7XG5cbiAgICAgICAgLy8gc2V0dXBcbiAgICAgICAgdmFyIGdwID0gbnVsbDsgLy8gZ3JhbmRwYXJlbnRcbiAgICAgICAgdmFyIGdncCA9IGhlYWQ7IC8vIGdyYW5kLWdyYW5kLXBhcmVudFxuICAgICAgICB2YXIgcCA9IG51bGw7IC8vIHBhcmVudFxuICAgICAgICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG4gICAgICAgIGdncC5yaWdodCA9IHRoaXMuX3Jvb3Q7XG5cbiAgICAgICAgLy8gc2VhcmNoIGRvd25cbiAgICAgICAgd2hpbGUodHJ1ZSkge1xuICAgICAgICAgICAgaWYobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIC8vIGluc2VydCBuZXcgbm9kZSBhdCB0aGUgYm90dG9tXG4gICAgICAgICAgICAgICAgbm9kZSA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICAgICAgICAgIHAuc2V0X2NoaWxkKGRpciwgbm9kZSk7XG4gICAgICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoaXNfcmVkKG5vZGUubGVmdCkgJiYgaXNfcmVkKG5vZGUucmlnaHQpKSB7XG4gICAgICAgICAgICAgICAgLy8gY29sb3IgZmxpcFxuICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICBub2RlLmxlZnQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgbm9kZS5yaWdodC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgLy8gZml4IHJlZCB2aW9sYXRpb25cbiAgICAgICAgICAgIGlmKGlzX3JlZChub2RlKSAmJiBpc19yZWQocCkpIHtcbiAgICAgICAgICAgICAgICB2YXIgZGlyMiA9IGdncC5yaWdodCA9PT0gZ3A7XG5cbiAgICAgICAgICAgICAgICBpZihub2RlID09PSBwLmdldF9jaGlsZChsYXN0KSkge1xuICAgICAgICAgICAgICAgICAgICBnZ3Auc2V0X2NoaWxkKGRpcjIsIHNpbmdsZV9yb3RhdGUoZ3AsICFsYXN0KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICBnZ3Auc2V0X2NoaWxkKGRpcjIsIGRvdWJsZV9yb3RhdGUoZ3AsICFsYXN0KSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcihub2RlLmRhdGEsIGRhdGEpO1xuXG4gICAgICAgICAgICAvLyBzdG9wIGlmIGZvdW5kXG4gICAgICAgICAgICBpZihjbXAgPT09IDApIHtcbiAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgbGFzdCA9IGRpcjtcbiAgICAgICAgICAgIGRpciA9IGNtcCA8IDA7XG5cbiAgICAgICAgICAgIC8vIHVwZGF0ZSBoZWxwZXJzXG4gICAgICAgICAgICBpZihncCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIGdncCA9IGdwO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZ3AgPSBwO1xuICAgICAgICAgICAgcCA9IG5vZGU7XG4gICAgICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHVwZGF0ZSByb290XG4gICAgICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xuICAgIH1cblxuICAgIC8vIG1ha2Ugcm9vdCBibGFja1xuICAgIHRoaXMuX3Jvb3QucmVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gcmV0O1xufTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIHJlbW92ZWQsIGZhbHNlIGlmIG5vdCBmb3VuZFxuUkJUcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGhlYWQgPSBuZXcgTm9kZSh1bmRlZmluZWQpOyAvLyBmYWtlIHRyZWUgcm9vdFxuICAgIHZhciBub2RlID0gaGVhZDtcbiAgICBub2RlLnJpZ2h0ID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgcCA9IG51bGw7IC8vIHBhcmVudFxuICAgIHZhciBncCA9IG51bGw7IC8vIGdyYW5kIHBhcmVudFxuICAgIHZhciBmb3VuZCA9IG51bGw7IC8vIGZvdW5kIGl0ZW1cbiAgICB2YXIgZGlyID0gMTtcblxuICAgIHdoaWxlKG5vZGUuZ2V0X2NoaWxkKGRpcikgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGxhc3QgPSBkaXI7XG5cbiAgICAgICAgLy8gdXBkYXRlIGhlbHBlcnNcbiAgICAgICAgZ3AgPSBwO1xuICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG5cbiAgICAgICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgbm9kZS5kYXRhKTtcblxuICAgICAgICBkaXIgPSBjbXAgPiAwO1xuXG4gICAgICAgIC8vIHNhdmUgZm91bmQgbm9kZVxuICAgICAgICBpZihjbXAgPT09IDApIHtcbiAgICAgICAgICAgIGZvdW5kID0gbm9kZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHB1c2ggdGhlIHJlZCBub2RlIGRvd25cbiAgICAgICAgaWYoIWlzX3JlZChub2RlKSAmJiAhaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKGRpcikpKSB7XG4gICAgICAgICAgICBpZihpc19yZWQobm9kZS5nZXRfY2hpbGQoIWRpcikpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNyID0gc2luZ2xlX3JvdGF0ZShub2RlLCBkaXIpO1xuICAgICAgICAgICAgICAgIHAuc2V0X2NoaWxkKGxhc3QsIHNyKTtcbiAgICAgICAgICAgICAgICBwID0gc3I7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKCFpc19yZWQobm9kZS5nZXRfY2hpbGQoIWRpcikpKSB7XG4gICAgICAgICAgICAgICAgdmFyIHNpYmxpbmcgPSBwLmdldF9jaGlsZCghbGFzdCk7XG4gICAgICAgICAgICAgICAgaWYoc2libGluZyAhPT0gbnVsbCkge1xuICAgICAgICAgICAgICAgICAgICBpZighaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKCFsYXN0KSkgJiYgIWlzX3JlZChzaWJsaW5nLmdldF9jaGlsZChsYXN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGNvbG9yIGZsaXBcbiAgICAgICAgICAgICAgICAgICAgICAgIHAucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBzaWJsaW5nLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZGlyMiA9IGdwLnJpZ2h0ID09PSBwO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihpc19yZWQoc2libGluZy5nZXRfY2hpbGQobGFzdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Auc2V0X2NoaWxkKGRpcjIsIGRvdWJsZV9yb3RhdGUocCwgbGFzdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgZWxzZSBpZihpc19yZWQoc2libGluZy5nZXRfY2hpbGQoIWxhc3QpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwLnNldF9jaGlsZChkaXIyLCBzaW5nbGVfcm90YXRlKHAsIGxhc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gZW5zdXJlIGNvcnJlY3QgY29sb3JpbmdcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBncGMgPSBncC5nZXRfY2hpbGQoZGlyMik7XG4gICAgICAgICAgICAgICAgICAgICAgICBncGMucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5sZWZ0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLnJpZ2h0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgfVxuXG4gICAgLy8gcmVwbGFjZSBhbmQgcmVtb3ZlIGlmIGZvdW5kXG4gICAgaWYoZm91bmQgIT09IG51bGwpIHtcbiAgICAgICAgZm91bmQuZGF0YSA9IG5vZGUuZGF0YTtcbiAgICAgICAgcC5zZXRfY2hpbGQocC5yaWdodCA9PT0gbm9kZSwgbm9kZS5nZXRfY2hpbGQobm9kZS5sZWZ0ID09PSBudWxsKSk7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgIH1cblxuICAgIC8vIHVwZGF0ZSByb290IGFuZCBtYWtlIGl0IGJsYWNrXG4gICAgdGhpcy5fcm9vdCA9IGhlYWQucmlnaHQ7XG4gICAgaWYodGhpcy5fcm9vdCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9yb290LnJlZCA9IGZhbHNlO1xuICAgIH1cblxuICAgIHJldHVybiBmb3VuZCAhPT0gbnVsbDtcbn07XG5cbmZ1bmN0aW9uIGlzX3JlZChub2RlKSB7XG4gICAgcmV0dXJuIG5vZGUgIT09IG51bGwgJiYgbm9kZS5yZWQ7XG59XG5cbmZ1bmN0aW9uIHNpbmdsZV9yb3RhdGUocm9vdCwgZGlyKSB7XG4gICAgdmFyIHNhdmUgPSByb290LmdldF9jaGlsZCghZGlyKTtcblxuICAgIHJvb3Quc2V0X2NoaWxkKCFkaXIsIHNhdmUuZ2V0X2NoaWxkKGRpcikpO1xuICAgIHNhdmUuc2V0X2NoaWxkKGRpciwgcm9vdCk7XG5cbiAgICByb290LnJlZCA9IHRydWU7XG4gICAgc2F2ZS5yZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiBzYXZlO1xufVxuXG5mdW5jdGlvbiBkb3VibGVfcm90YXRlKHJvb3QsIGRpcikge1xuICAgIHJvb3Quc2V0X2NoaWxkKCFkaXIsIHNpbmdsZV9yb3RhdGUocm9vdC5nZXRfY2hpbGQoIWRpciksICFkaXIpKTtcbiAgICByZXR1cm4gc2luZ2xlX3JvdGF0ZShyb290LCBkaXIpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJCVHJlZTtcbiIsIlxuZnVuY3Rpb24gVHJlZUJhc2UoKSB7fVxuXG4vLyByZW1vdmVzIGFsbCBub2RlcyBmcm9tIHRoZSB0cmVlXG5UcmVlQmFzZS5wcm90b3R5cGUuY2xlYXIgPSBmdW5jdGlvbigpIHtcbiAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICB0aGlzLnNpemUgPSAwO1xufTtcblxuLy8gcmV0dXJucyBub2RlIGRhdGEgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlXG5UcmVlQmFzZS5wcm90b3R5cGUuZmluZCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcblxuICAgIHdoaWxlKHJlcyAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgYyA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgcmVzLmRhdGEpO1xuICAgICAgICBpZihjID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gcmVzLmRhdGE7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICByZXMgPSByZXMuZ2V0X2NoaWxkKGMgPiAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufTtcblxuLy8gcmV0dXJucyBpdGVyYXRvciB0byBub2RlIGlmIGZvdW5kLCBudWxsIG90aGVyd2lzZVxuVHJlZUJhc2UucHJvdG90eXBlLmZpbmRJdGVyID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuICAgIHZhciBpdGVyID0gdGhpcy5pdGVyYXRvcigpO1xuXG4gICAgd2hpbGUocmVzICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBjID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCByZXMuZGF0YSk7XG4gICAgICAgIGlmKGMgPT09IDApIHtcbiAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IHJlcztcbiAgICAgICAgICAgIHJldHVybiBpdGVyO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgaXRlci5fYW5jZXN0b3JzLnB1c2gocmVzKTtcbiAgICAgICAgICAgIHJlcyA9IHJlcy5nZXRfY2hpbGQoYyA+IDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyBSZXR1cm5zIGFuIGl0ZXJhdG9yIHRvIHRoZSB0cmVlIG5vZGUgYXQgb3IgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGl0ZW1cblRyZWVCYXNlLnByb3RvdHlwZS5sb3dlckJvdW5kID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBjdXIgPSB0aGlzLl9yb290O1xuICAgIHZhciBpdGVyID0gdGhpcy5pdGVyYXRvcigpO1xuICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gICAgd2hpbGUoY3VyICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBjID0gY21wKGl0ZW0sIGN1ci5kYXRhKTtcbiAgICAgICAgaWYoYyA9PT0gMCkge1xuICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gY3VyO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgaXRlci5fYW5jZXN0b3JzLnB1c2goY3VyKTtcbiAgICAgICAgY3VyID0gY3VyLmdldF9jaGlsZChjID4gMCk7XG4gICAgfVxuXG4gICAgZm9yKHZhciBpPWl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggLSAxOyBpID49IDA7IC0taSkge1xuICAgICAgICBjdXIgPSBpdGVyLl9hbmNlc3RvcnNbaV07XG4gICAgICAgIGlmKGNtcChpdGVtLCBjdXIuZGF0YSkgPCAwKSB7XG4gICAgICAgICAgICBpdGVyLl9jdXJzb3IgPSBjdXI7XG4gICAgICAgICAgICBpdGVyLl9hbmNlc3RvcnMubGVuZ3RoID0gaTtcbiAgICAgICAgICAgIHJldHVybiBpdGVyO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaXRlci5fYW5jZXN0b3JzLmxlbmd0aCA9IDA7XG4gICAgcmV0dXJuIGl0ZXI7XG59O1xuXG4vLyBSZXR1cm5zIGFuIGl0ZXJhdG9yIHRvIHRoZSB0cmVlIG5vZGUgaW1tZWRpYXRlbHkgYWZ0ZXIgdGhlIGl0ZW1cblRyZWVCYXNlLnByb3RvdHlwZS51cHBlckJvdW5kID0gZnVuY3Rpb24oaXRlbSkge1xuICAgIHZhciBpdGVyID0gdGhpcy5sb3dlckJvdW5kKGl0ZW0pO1xuICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yO1xuXG4gICAgd2hpbGUoaXRlci5kYXRhKCkgIT09IG51bGwgJiYgY21wKGl0ZXIuZGF0YSgpLCBpdGVtKSA9PT0gMCkge1xuICAgICAgICBpdGVyLm5leHQoKTtcbiAgICB9XG5cbiAgICByZXR1cm4gaXRlcjtcbn07XG5cbi8vIHJldHVybnMgbnVsbCBpZiB0cmVlIGlzIGVtcHR5XG5UcmVlQmFzZS5wcm90b3R5cGUubWluID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG4gICAgaWYocmVzID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHdoaWxlKHJlcy5sZWZ0ICE9PSBudWxsKSB7XG4gICAgICAgIHJlcyA9IHJlcy5sZWZ0O1xuICAgIH1cblxuICAgIHJldHVybiByZXMuZGF0YTtcbn07XG5cbi8vIHJldHVybnMgbnVsbCBpZiB0cmVlIGlzIGVtcHR5XG5UcmVlQmFzZS5wcm90b3R5cGUubWF4ID0gZnVuY3Rpb24oKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG4gICAgaWYocmVzID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBudWxsO1xuICAgIH1cblxuICAgIHdoaWxlKHJlcy5yaWdodCAhPT0gbnVsbCkge1xuICAgICAgICByZXMgPSByZXMucmlnaHQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5kYXRhO1xufTtcblxuLy8gcmV0dXJucyBhIG51bGwgaXRlcmF0b3Jcbi8vIGNhbGwgbmV4dCgpIG9yIHByZXYoKSB0byBwb2ludCB0byBhbiBlbGVtZW50XG5UcmVlQmFzZS5wcm90b3R5cGUuaXRlcmF0b3IgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gbmV3IEl0ZXJhdG9yKHRoaXMpO1xufTtcblxuLy8gY2FsbHMgY2Igb24gZWFjaCBub2RlJ3MgZGF0YSwgaW4gb3JkZXJcblRyZWVCYXNlLnByb3RvdHlwZS5lYWNoID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgaXQ9dGhpcy5pdGVyYXRvcigpLCBkYXRhO1xuICAgIHdoaWxlKChkYXRhID0gaXQubmV4dCgpKSAhPT0gbnVsbCkge1xuICAgICAgICBjYihkYXRhKTtcbiAgICB9XG59O1xuXG4vLyBjYWxscyBjYiBvbiBlYWNoIG5vZGUncyBkYXRhLCBpbiByZXZlcnNlIG9yZGVyXG5UcmVlQmFzZS5wcm90b3R5cGUucmVhY2ggPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBpdD10aGlzLml0ZXJhdG9yKCksIGRhdGE7XG4gICAgd2hpbGUoKGRhdGEgPSBpdC5wcmV2KCkpICE9PSBudWxsKSB7XG4gICAgICAgIGNiKGRhdGEpO1xuICAgIH1cbn07XG5cblxuZnVuY3Rpb24gSXRlcmF0b3IodHJlZSkge1xuICAgIHRoaXMuX3RyZWUgPSB0cmVlO1xuICAgIHRoaXMuX2FuY2VzdG9ycyA9IFtdO1xuICAgIHRoaXMuX2N1cnNvciA9IG51bGw7XG59XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMuX2N1cnNvciAhPT0gbnVsbCA/IHRoaXMuX2N1cnNvci5kYXRhIDogbnVsbDtcbn07XG5cbi8vIGlmIG51bGwtaXRlcmF0b3IsIHJldHVybnMgZmlyc3Qgbm9kZVxuLy8gb3RoZXJ3aXNlLCByZXR1cm5zIG5leHQgbm9kZVxuSXRlcmF0b3IucHJvdG90eXBlLm5leHQgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLl9jdXJzb3IgPT09IG51bGwpIHtcbiAgICAgICAgdmFyIHJvb3QgPSB0aGlzLl90cmVlLl9yb290O1xuICAgICAgICBpZihyb290ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9taW5Ob2RlKHJvb3QpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZih0aGlzLl9jdXJzb3IucmlnaHQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIG5vIGdyZWF0ZXIgbm9kZSBpbiBzdWJ0cmVlLCBnbyB1cCB0byBwYXJlbnRcbiAgICAgICAgICAgIC8vIGlmIGNvbWluZyBmcm9tIGEgcmlnaHQgY2hpbGQsIGNvbnRpbnVlIHVwIHRoZSBzdGFja1xuICAgICAgICAgICAgdmFyIHNhdmU7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgc2F2ZSA9IHRoaXMuX2N1cnNvcjtcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9hbmNlc3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvciA9IHRoaXMuX2FuY2VzdG9ycy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUodGhpcy5fY3Vyc29yLnJpZ2h0ID09PSBzYXZlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIC8vIGdldCB0aGUgbmV4dCBub2RlIGZyb20gdGhlIHN1YnRyZWVcbiAgICAgICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHRoaXMuX2N1cnNvcik7XG4gICAgICAgICAgICB0aGlzLl9taW5Ob2RlKHRoaXMuX2N1cnNvci5yaWdodCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnNvciAhPT0gbnVsbCA/IHRoaXMuX2N1cnNvci5kYXRhIDogbnVsbDtcbn07XG5cbi8vIGlmIG51bGwtaXRlcmF0b3IsIHJldHVybnMgbGFzdCBub2RlXG4vLyBvdGhlcndpc2UsIHJldHVybnMgcHJldmlvdXMgbm9kZVxuSXRlcmF0b3IucHJvdG90eXBlLnByZXYgPSBmdW5jdGlvbigpIHtcbiAgICBpZih0aGlzLl9jdXJzb3IgPT09IG51bGwpIHtcbiAgICAgICAgdmFyIHJvb3QgPSB0aGlzLl90cmVlLl9yb290O1xuICAgICAgICBpZihyb290ICE9PSBudWxsKSB7XG4gICAgICAgICAgICB0aGlzLl9tYXhOb2RlKHJvb3QpO1xuICAgICAgICB9XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICBpZih0aGlzLl9jdXJzb3IubGVmdCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgdmFyIHNhdmU7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgc2F2ZSA9IHRoaXMuX2N1cnNvcjtcbiAgICAgICAgICAgICAgICBpZih0aGlzLl9hbmNlc3RvcnMubGVuZ3RoKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvciA9IHRoaXMuX2FuY2VzdG9ycy5wb3AoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2N1cnNvciA9IG51bGw7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0gd2hpbGUodGhpcy5fY3Vyc29yLmxlZnQgPT09IHNhdmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2godGhpcy5fY3Vyc29yKTtcbiAgICAgICAgICAgIHRoaXMuX21heE5vZGUodGhpcy5fY3Vyc29yLmxlZnQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XG59O1xuXG5JdGVyYXRvci5wcm90b3R5cGUuX21pbk5vZGUgPSBmdW5jdGlvbihzdGFydCkge1xuICAgIHdoaWxlKHN0YXJ0LmxlZnQgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2goc3RhcnQpO1xuICAgICAgICBzdGFydCA9IHN0YXJ0LmxlZnQ7XG4gICAgfVxuICAgIHRoaXMuX2N1cnNvciA9IHN0YXJ0O1xufTtcblxuSXRlcmF0b3IucHJvdG90eXBlLl9tYXhOb2RlID0gZnVuY3Rpb24oc3RhcnQpIHtcbiAgICB3aGlsZShzdGFydC5yaWdodCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaChzdGFydCk7XG4gICAgICAgIHN0YXJ0ID0gc3RhcnQucmlnaHQ7XG4gICAgfVxuICAgIHRoaXMuX2N1cnNvciA9IHN0YXJ0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBUcmVlQmFzZTtcblxuIiwiXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gICAgIGRhdGEgR2VvSlNPTlxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRhdGEsIHByb2plY3QsIGNvbnRleHQpIHtcbiAgZGF0YSA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkoZGF0YSkpO1xuICBpZiAoZGF0YS50eXBlID09PSAnRmVhdHVyZUNvbGxlY3Rpb24nKSB7XG4gICAgLy8gVGhhdCdzIGEgaHVnZSBoYWNrIHRvIGdldCB0aGluZ3Mgd29ya2luZyB3aXRoIGJvdGggQXJjR0lTIHNlcnZlclxuICAgIC8vIGFuZCBHZW9TZXJ2ZXIuIEdlb3NlcnZlciBwcm92aWRlcyBjcnMgcmVmZXJlbmNlIGluIEdlb0pTT04sIEFyY0dJUyDigJRcbiAgICAvLyBkb2Vzbid0LlxuICAgIC8vaWYgKGRhdGEuY3JzKSBkZWxldGUgZGF0YS5jcnM7XG4gICAgZm9yICh2YXIgaSA9IGRhdGEuZmVhdHVyZXMubGVuZ3RoIC0gMTsgaSA+PSAwOyBpLS0pIHtcbiAgICAgIGRhdGEuZmVhdHVyZXNbaV0gPSBwcm9qZWN0RmVhdHVyZShkYXRhLmZlYXR1cmVzW2ldLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZGF0YSA9IHByb2plY3RGZWF0dXJlKGRhdGEsIHByb2plY3QsIGNvbnRleHQpO1xuICB9XG4gIHJldHVybiBkYXRhO1xufTtcblxubW9kdWxlLmV4cG9ydHMucHJvamVjdEZlYXR1cmUgID0gcHJvamVjdEZlYXR1cmU7XG5tb2R1bGUuZXhwb3J0cy5wcm9qZWN0R2VvbWV0cnkgPSBwcm9qZWN0R2VvbWV0cnk7XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBkYXRhIEdlb0pTT05cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gcHJvamVjdEZlYXR1cmUoZmVhdHVyZSwgcHJvamVjdCwgY29udGV4dCkge1xuICBpZiAoZmVhdHVyZS50eXBlID09PSAnR2VvbWV0cnlDb2xsZWN0aW9uJykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBmZWF0dXJlLmdlb21ldHJpZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGZlYXR1cmUuZ2VvbWV0cmllc1tpXSA9XG4gICAgICAgIHByb2plY3RHZW9tZXRyeShmZWF0dXJlLmdlb21ldHJpZXNbaV0sIHByb2plY3QsIGNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmZWF0dXJlLmdlb21ldHJ5ID0gcHJvamVjdEdlb21ldHJ5KGZlYXR1cmUuZ2VvbWV0cnksIHByb2plY3QsIGNvbnRleHQpO1xuICB9XG4gIHJldHVybiBmZWF0dXJlO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIHByb2plY3RHZW9tZXRyeShnZW9tZXRyeSwgcHJvamVjdCwgY29udGV4dCkge1xuICB2YXIgY29vcmRzID0gZ2VvbWV0cnkuY29vcmRpbmF0ZXM7XG4gIHN3aXRjaCAoZ2VvbWV0cnkudHlwZSkge1xuICAgIGNhc2UgJ1BvaW50JzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdC5jYWxsKGNvbnRleHQsIGNvb3Jkcyk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ011bHRpUG9pbnQnOlxuICAgIGNhc2UgJ0xpbmVTdHJpbmcnOlxuICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGNvb3Jkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICBjb29yZHNbaV0gPSBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzW2ldKTtcbiAgICAgIH1cbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gY29vcmRzO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdQb2x5Z29uJzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdENvb3Jkcyhjb29yZHMsIDEsIHByb2plY3QsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNdWx0aUxpbmVTdHJpbmcnOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0Q29vcmRzKGNvb3JkcywgMSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ011bHRpUG9seWdvbic6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3RDb29yZHMoY29vcmRzLCAyLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBnZW9tZXRyeTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAgeyp9ICAgICAgICAgY29vcmRzIENvb3JkcyBhcnJheXNcbiAqIEBwYXJhbSAge051bWJlcn0gICAgbGV2ZWxzRGVlcFxuICogQHBhcmFtICB7RnVuY3Rpb259ICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHsqfVxuICovXG5mdW5jdGlvbiBwcm9qZWN0Q29vcmRzKGNvb3JkcywgbGV2ZWxzRGVlcCwgcHJvamVjdCwgY29udGV4dCkge1xuICB2YXIgY29vcmQsIGksIGxlbjtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IGNvb3Jkcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGNvb3JkID0gbGV2ZWxzRGVlcCA/XG4gICAgICBwcm9qZWN0Q29vcmRzKGNvb3Jkc1tpXSwgbGV2ZWxzRGVlcCAtIDEsIHByb2plY3QsIGNvbnRleHQpIDpcbiAgICAgIHByb2plY3QuY2FsbChjb250ZXh0LCBjb29yZHNbaV0pO1xuXG4gICAgcmVzdWx0LnB1c2goY29vcmQpO1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvaW5kZXgnKTtcbiIsInZhciBzaWduZWRBcmVhID0gcmVxdWlyZSgnLi9zaWduZWRfYXJlYScpO1xuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGUxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBlMlxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN3ZWVwRXZlbnRzQ29tcChlMSwgZTIpIHtcbiAgdmFyIHAxID0gZTEucG9pbnQ7XG4gIHZhciBwMiA9IGUyLnBvaW50O1xuXG4gIC8vIERpZmZlcmVudCB4LWNvb3JkaW5hdGVcbiAgaWYgKHAxWzBdID4gcDJbMF0pIHJldHVybiAxO1xuICBpZiAocDFbMF0gPCBwMlswXSkgcmV0dXJuIC0xO1xuXG4gIC8vIERpZmZlcmVudCBwb2ludHMsIGJ1dCBzYW1lIHgtY29vcmRpbmF0ZVxuICAvLyBFdmVudCB3aXRoIGxvd2VyIHktY29vcmRpbmF0ZSBpcyBwcm9jZXNzZWQgZmlyc3RcbiAgaWYgKHAxWzFdICE9PSBwMlsxXSkgcmV0dXJuIHAxWzFdID4gcDJbMV0gPyAxIDogLTE7XG5cbiAgcmV0dXJuIHNwZWNpYWxDYXNlcyhlMSwgZTIsIHAxLCBwMik7XG59O1xuXG5cbmZ1bmN0aW9uIHNwZWNpYWxDYXNlcyhlMSwgZTIsIHAxLCBwMikge1xuICAvLyBTYW1lIGNvb3JkaW5hdGVzLCBidXQgb25lIGlzIGEgbGVmdCBlbmRwb2ludCBhbmQgdGhlIG90aGVyIGlzXG4gIC8vIGEgcmlnaHQgZW5kcG9pbnQuIFRoZSByaWdodCBlbmRwb2ludCBpcyBwcm9jZXNzZWQgZmlyc3RcbiAgaWYgKGUxLmxlZnQgIT09IGUyLmxlZnQpXG4gICAgcmV0dXJuIGUxLmxlZnQgPyAxIDogLTE7XG5cbiAgLy8gU2FtZSBjb29yZGluYXRlcywgYm90aCBldmVudHNcbiAgLy8gYXJlIGxlZnQgZW5kcG9pbnRzIG9yIHJpZ2h0IGVuZHBvaW50cy5cbiAgLy8gbm90IGNvbGxpbmVhclxuICBpZiAoc2lnbmVkQXJlYSAocDEsIGUxLm90aGVyRXZlbnQucG9pbnQsIGUyLm90aGVyRXZlbnQucG9pbnQpICE9PSAwKSB7XG4gICAgLy8gdGhlIGV2ZW50IGFzc29jaWF0ZSB0byB0aGUgYm90dG9tIHNlZ21lbnQgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gICAgcmV0dXJuICghZTEuaXNCZWxvdyhlMi5vdGhlckV2ZW50LnBvaW50KSkgPyAxIDogLTE7XG4gIH1cblxuICBpZiAoZTEuaXNTdWJqZWN0ID09PSBlMi5pc1N1YmplY3QpIHtcbiAgICBpZihlMS5jb250b3VySWQgPT09IGUyLmNvbnRvdXJJZCl7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGUxLmNvbnRvdXJJZCA+IGUyLmNvbnRvdXJJZCA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKCFlMS5pc1N1YmplY3QgJiYgZTIuaXNTdWJqZWN0KSA/IDEgOiAtMTtcbiAgLy9yZXR1cm4gZTEuaXNTdWJqZWN0ID8gLTEgOiAxO1xufVxuIiwidmFyIHNpZ25lZEFyZWEgICAgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG52YXIgY29tcGFyZUV2ZW50cyA9IHJlcXVpcmUoJy4vY29tcGFyZV9ldmVudHMnKTtcbnZhciBlcXVhbHMgICAgICAgID0gcmVxdWlyZSgnLi9lcXVhbHMnKTtcblxuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGxlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gbGUyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcGFyZVNlZ21lbnRzKGxlMSwgbGUyKSB7XG4gIGlmIChsZTEgPT09IGxlMikgcmV0dXJuIDA7XG5cbiAgLy8gU2VnbWVudHMgYXJlIG5vdCBjb2xsaW5lYXJcbiAgaWYgKHNpZ25lZEFyZWEobGUxLnBvaW50LCBsZTEub3RoZXJFdmVudC5wb2ludCwgbGUyLnBvaW50KSAhPT0gMCB8fFxuICAgIHNpZ25lZEFyZWEobGUxLnBvaW50LCBsZTEub3RoZXJFdmVudC5wb2ludCwgbGUyLm90aGVyRXZlbnQucG9pbnQpICE9PSAwKSB7XG5cbiAgICAvLyBJZiB0aGV5IHNoYXJlIHRoZWlyIGxlZnQgZW5kcG9pbnQgdXNlIHRoZSByaWdodCBlbmRwb2ludCB0byBzb3J0XG4gICAgaWYgKGVxdWFscyhsZTEucG9pbnQsIGxlMi5wb2ludCkpIHJldHVybiBsZTEuaXNCZWxvdyhsZTIub3RoZXJFdmVudC5wb2ludCkgPyAtMSA6IDE7XG5cbiAgICAvLyBEaWZmZXJlbnQgbGVmdCBlbmRwb2ludDogdXNlIHRoZSBsZWZ0IGVuZHBvaW50IHRvIHNvcnRcbiAgICBpZiAobGUxLnBvaW50WzBdID09PSBsZTIucG9pbnRbMF0pIHJldHVybiBsZTEucG9pbnRbMV0gPCBsZTIucG9pbnRbMV0gPyAtMSA6IDE7XG5cbiAgICAvLyBoYXMgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUxIGJlZW4gaW5zZXJ0ZWRcbiAgICAvLyBpbnRvIFMgYWZ0ZXIgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUyID9cbiAgICBpZiAoY29tcGFyZUV2ZW50cyhsZTEsIGxlMikgPT09IDEpIHJldHVybiBsZTIuaXNBYm92ZShsZTEucG9pbnQpID8gLTEgOiAxO1xuXG4gICAgLy8gVGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUyIGhhcyBiZWVuIGluc2VydGVkXG4gICAgLy8gaW50byBTIGFmdGVyIHRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMVxuICAgIHJldHVybiBsZTEuaXNCZWxvdyhsZTIucG9pbnQpID8gLTEgOiAxO1xuICB9XG5cbiAgaWYgKGxlMS5pc1N1YmplY3QgPT09IGxlMi5pc1N1YmplY3Qpe1xuICAgIGlmIChlcXVhbHMobGUxLnBvaW50LCBsZTIucG9pbnQpKSB7XG4gICAgICBpZiAobGUxLmNvbnRvdXJJZCA9PT0gbGUyLmNvbnRvdXJJZCl7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxlMS5jb250b3VySWQgPiBsZTIuY29udG91cklkID8gMSA6IC0xO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZWdtZW50cyBhcmUgY29sbGluZWFyXG4gICAgICBpZiAobGUxLmlzU3ViamVjdCAhPT0gbGUyLmlzU3ViamVjdCkgcmV0dXJuIChsZTEuaXNTdWJqZWN0ICYmICFsZTIuaXNTdWJqZWN0KSA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29tcGFyZUV2ZW50cyhsZTEsIGxlMikgPT09IDEgPyAxIDogLTE7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFxuICBOT1JNQUw6ICAgICAgICAgICAgICAgMCwgXG4gIE5PTl9DT05UUklCVVRJTkc6ICAgICAxLCBcbiAgU0FNRV9UUkFOU0lUSU9OOiAgICAgIDIsIFxuICBESUZGRVJFTlRfVFJBTlNJVElPTjogM1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXF1YWxzKHAxLCBwMikge1xuICByZXR1cm4gcDFbMF0gPT09IHAyWzBdICYmIHAxWzFdID09PSBwMlsxXTtcbn07IiwidmFyIElOVEVSU0VDVElPTiAgICA9IDA7XG52YXIgVU5JT04gICAgICAgICAgID0gMTtcbnZhciBESUZGRVJFTkNFICAgICAgPSAyO1xudmFyIFhPUiAgICAgICAgICAgICA9IDM7XG5cbnZhciBFTVBUWSAgICAgICAgICAgPSBbXTtcblxudmFyIGVkZ2VUeXBlICAgICAgICA9IHJlcXVpcmUoJy4vZWRnZV90eXBlJyk7XG5cbnZhciBRdWV1ZSAgICAgICAgICAgPSByZXF1aXJlKCd0aW55cXVldWUnKTtcbnZhciBUcmVlICAgICAgICAgICAgPSByZXF1aXJlKCdiaW50cmVlcycpLlJCVHJlZTtcbnZhciBTd2VlcEV2ZW50ICAgICAgPSByZXF1aXJlKCcuL3N3ZWVwX2V2ZW50Jyk7XG5cbnZhciBjb21wYXJlRXZlbnRzICAgPSByZXF1aXJlKCcuL2NvbXBhcmVfZXZlbnRzJyk7XG52YXIgY29tcGFyZVNlZ21lbnRzID0gcmVxdWlyZSgnLi9jb21wYXJlX3NlZ21lbnRzJyk7XG52YXIgaW50ZXJzZWN0aW9uICAgID0gcmVxdWlyZSgnLi9zZWdtZW50X2ludGVyc2VjdGlvbicpO1xudmFyIGVxdWFscyAgICAgICAgICA9IHJlcXVpcmUoJy4vZXF1YWxzJyk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBAcGFyYW0gIHs8QXJyYXkuPE51bWJlcj59IHMxXG4gKiBAcGFyYW0gIHs8QXJyYXkuPE51bWJlcj59IHMyXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgIGlzU3ViamVjdFxuICogQHBhcmFtICB7UXVldWV9ICAgICAgICAgICBldmVudFF1ZXVlXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gIGJib3hcbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc1NlZ21lbnQoczEsIHMyLCBpc1N1YmplY3QsIGRlcHRoLCBldmVudFF1ZXVlLCBiYm94KSB7XG4gIC8vIFBvc3NpYmxlIGRlZ2VuZXJhdGUgY29uZGl0aW9uLlxuICAvLyBpZiAoZXF1YWxzKHMxLCBzMikpIHJldHVybjtcblxuICB2YXIgZTEgPSBuZXcgU3dlZXBFdmVudChzMSwgZmFsc2UsIHVuZGVmaW5lZCwgaXNTdWJqZWN0KTtcbiAgdmFyIGUyID0gbmV3IFN3ZWVwRXZlbnQoczIsIGZhbHNlLCBlMSwgICAgICAgIGlzU3ViamVjdCk7XG4gIGUxLm90aGVyRXZlbnQgPSBlMjtcblxuICBlMS5jb250b3VySWQgPSBlMi5jb250b3VySWQgPSBkZXB0aDtcblxuICBpZiAoY29tcGFyZUV2ZW50cyhlMSwgZTIpID4gMCkge1xuICAgIGUyLmxlZnQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGUxLmxlZnQgPSB0cnVlO1xuICB9XG5cbiAgYmJveFswXSA9IG1pbihiYm94WzBdLCBzMVswXSk7XG4gIGJib3hbMV0gPSBtaW4oYmJveFsxXSwgczFbMV0pO1xuICBiYm94WzJdID0gbWF4KGJib3hbMl0sIHMxWzBdKTtcbiAgYmJveFszXSA9IG1heChiYm94WzNdLCBzMVsxXSk7XG5cbiAgLy8gUHVzaGluZyBpdCBzbyB0aGUgcXVldWUgaXMgc29ydGVkIGZyb20gbGVmdCB0byByaWdodCxcbiAgLy8gd2l0aCBvYmplY3Qgb24gdGhlIGxlZnQgaGF2aW5nIHRoZSBoaWdoZXN0IHByaW9yaXR5LlxuICBldmVudFF1ZXVlLnB1c2goZTEpO1xuICBldmVudFF1ZXVlLnB1c2goZTIpO1xufVxuXG52YXIgY29udG91cklkID0gMDtcblxuZnVuY3Rpb24gcHJvY2Vzc1BvbHlnb24ocG9seWdvbiwgaXNTdWJqZWN0LCBkZXB0aCwgcXVldWUsIGJib3gpIHtcbiAgdmFyIGksIGxlbjtcbiAgaWYgKHR5cGVvZiBwb2x5Z29uWzBdWzBdID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBvbHlnb24ubGVuZ3RoIC0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBwcm9jZXNzU2VnbWVudChwb2x5Z29uW2ldLCBwb2x5Z29uW2kgKyAxXSwgaXNTdWJqZWN0LCBkZXB0aCArIDEsIHF1ZXVlLCBiYm94KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcG9seWdvbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29udG91cklkKys7XG4gICAgICBwcm9jZXNzUG9seWdvbihwb2x5Z29uW2ldLCBpc1N1YmplY3QsIGNvbnRvdXJJZCwgcXVldWUsIGJib3gpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGZpbGxRdWV1ZShzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94KSB7XG4gIHZhciBldmVudFF1ZXVlID0gbmV3IFF1ZXVlKG51bGwsIGNvbXBhcmVFdmVudHMpO1xuICBjb250b3VySWQgPSAwO1xuXG4gIHByb2Nlc3NQb2x5Z29uKHN1YmplY3QsICB0cnVlLCAgMCwgZXZlbnRRdWV1ZSwgc2Jib3gpO1xuICBwcm9jZXNzUG9seWdvbihjbGlwcGluZywgZmFsc2UsIDAsIGV2ZW50UXVldWUsIGNiYm94KTtcblxuICByZXR1cm4gZXZlbnRRdWV1ZTtcbn1cblxuXG5mdW5jdGlvbiBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LCBzd2VlcExpbmUsIG9wZXJhdGlvbikge1xuICAvLyBjb21wdXRlIGluT3V0IGFuZCBvdGhlckluT3V0IGZpZWxkc1xuICBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgIGV2ZW50LmluT3V0ICAgICAgPSBmYWxzZTtcbiAgICBldmVudC5vdGhlckluT3V0ID0gdHJ1ZTtcblxuICAvLyBwcmV2aW91cyBsaW5lIHNlZ21lbnQgaW4gc3dlZXBsaW5lIGJlbG9uZ3MgdG8gdGhlIHNhbWUgcG9seWdvblxuICB9IGVsc2UgaWYgKGV2ZW50LmlzU3ViamVjdCA9PT0gcHJldi5pc1N1YmplY3QpIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gIXByZXYuaW5PdXQ7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHByZXYub3RoZXJJbk91dDtcblxuICAvLyBwcmV2aW91cyBsaW5lIHNlZ21lbnQgaW4gc3dlZXBsaW5lIGJlbG9uZ3MgdG8gdGhlIGNsaXBwaW5nIHBvbHlnb25cbiAgfSBlbHNlIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gIXByZXYub3RoZXJJbk91dDtcbiAgICBldmVudC5vdGhlckluT3V0ID0gcHJldi5pc1ZlcnRpY2FsKCkgPyAhcHJldi5pbk91dCA6IHByZXYuaW5PdXQ7XG4gIH1cblxuICAvLyBjb21wdXRlIHByZXZJblJlc3VsdCBmaWVsZFxuICBpZiAocHJldikge1xuICAgIGV2ZW50LnByZXZJblJlc3VsdCA9ICghaW5SZXN1bHQocHJldiwgb3BlcmF0aW9uKSB8fCBwcmV2LmlzVmVydGljYWwoKSkgP1xuICAgICAgIHByZXYucHJldkluUmVzdWx0IDogcHJldjtcbiAgfVxuICAvLyBjaGVjayBpZiB0aGUgbGluZSBzZWdtZW50IGJlbG9uZ3MgdG8gdGhlIEJvb2xlYW4gb3BlcmF0aW9uXG4gIGV2ZW50LmluUmVzdWx0ID0gaW5SZXN1bHQoZXZlbnQsIG9wZXJhdGlvbik7XG59XG5cblxuZnVuY3Rpb24gaW5SZXN1bHQoZXZlbnQsIG9wZXJhdGlvbikge1xuICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICBjYXNlIGVkZ2VUeXBlLk5PUk1BTDpcbiAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgICAgIGNhc2UgSU5URVJTRUNUSU9OOlxuICAgICAgICAgIHJldHVybiAhZXZlbnQub3RoZXJJbk91dDtcbiAgICAgICAgY2FzZSBVTklPTjpcbiAgICAgICAgICByZXR1cm4gZXZlbnQub3RoZXJJbk91dDtcbiAgICAgICAgY2FzZSBESUZGRVJFTkNFOlxuICAgICAgICAgIHJldHVybiAoZXZlbnQuaXNTdWJqZWN0ICYmIGV2ZW50Lm90aGVySW5PdXQpIHx8XG4gICAgICAgICAgICAgICAgICghZXZlbnQuaXNTdWJqZWN0ICYmICFldmVudC5vdGhlckluT3V0KTtcbiAgICAgICAgY2FzZSBYT1I6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgY2FzZSBlZGdlVHlwZS5TQU1FX1RSQU5TSVRJT046XG4gICAgICByZXR1cm4gb3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04gfHwgb3BlcmF0aW9uID09PSBVTklPTjtcbiAgICBjYXNlIGVkZ2VUeXBlLkRJRkZFUkVOVF9UUkFOU0lUSU9OOlxuICAgICAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRTtcbiAgICBjYXNlIGVkZ2VUeXBlLk5PTl9DT05UUklCVVRJTkc6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2UxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBzZTJcbiAqIEBwYXJhbSAge1F1ZXVlfSAgICAgIHF1ZXVlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIHBvc3NpYmxlSW50ZXJzZWN0aW9uKHNlMSwgc2UyLCBxdWV1ZSkge1xuICAvLyB0aGF0IGRpc2FsbG93cyBzZWxmLWludGVyc2VjdGluZyBwb2x5Z29ucyxcbiAgLy8gZGlkIGNvc3QgdXMgaGFsZiBhIGRheSwgc28gSSdsbCBsZWF2ZSBpdFxuICAvLyBvdXQgb2YgcmVzcGVjdFxuICAvLyBpZiAoc2UxLmlzU3ViamVjdCA9PT0gc2UyLmlzU3ViamVjdCkgcmV0dXJuO1xuXG4gIHZhciBpbnRlciA9IGludGVyc2VjdGlvbihcbiAgICBzZTEucG9pbnQsIHNlMS5vdGhlckV2ZW50LnBvaW50LFxuICAgIHNlMi5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnRcbiAgKTtcblxuICB2YXIgbmludGVyc2VjdGlvbnMgPSBpbnRlciA/IGludGVyLmxlbmd0aCA6IDA7XG4gIGlmIChuaW50ZXJzZWN0aW9ucyA9PT0gMCkgcmV0dXJuIDA7IC8vIG5vIGludGVyc2VjdGlvblxuXG4gIC8vIHRoZSBsaW5lIHNlZ21lbnRzIGludGVyc2VjdCBhdCBhbiBlbmRwb2ludCBvZiBib3RoIGxpbmUgc2VnbWVudHNcbiAgaWYgKChuaW50ZXJzZWN0aW9ucyA9PT0gMSkgJiZcbiAgICAgIChlcXVhbHMoc2UxLnBvaW50LCBzZTIucG9pbnQpIHx8XG4gICAgICAgZXF1YWxzKHNlMS5vdGhlckV2ZW50LnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludCkpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDIgJiYgc2UxLmlzU3ViamVjdCA9PT0gc2UyLmlzU3ViamVjdCl7XG4gICAgaWYoc2UxLmNvbnRvdXJJZCA9PT0gc2UyLmNvbnRvdXJJZCl7XG4gICAgY29uc29sZS53YXJuKCdFZGdlcyBvZiB0aGUgc2FtZSBwb2x5Z29uIG92ZXJsYXAnLFxuICAgICAgc2UxLnBvaW50LCBzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludCk7XG4gICAgfVxuICAgIC8vdGhyb3cgbmV3IEVycm9yKCdFZGdlcyBvZiB0aGUgc2FtZSBwb2x5Z29uIG92ZXJsYXAnKTtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFRoZSBsaW5lIHNlZ21lbnRzIGFzc29jaWF0ZWQgdG8gc2UxIGFuZCBzZTIgaW50ZXJzZWN0XG4gIGlmIChuaW50ZXJzZWN0aW9ucyA9PT0gMSkge1xuXG4gICAgLy8gaWYgdGhlIGludGVyc2VjdGlvbiBwb2ludCBpcyBub3QgYW4gZW5kcG9pbnQgb2Ygc2UxXG4gICAgaWYgKCFlcXVhbHMoc2UxLnBvaW50LCBpbnRlclswXSkgJiYgIWVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgaW50ZXJbMF0pKSB7XG4gICAgICBkaXZpZGVTZWdtZW50KHNlMSwgaW50ZXJbMF0sIHF1ZXVlKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50IGlzIG5vdCBhbiBlbmRwb2ludCBvZiBzZTJcbiAgICBpZiAoIWVxdWFscyhzZTIucG9pbnQsIGludGVyWzBdKSAmJiAhZXF1YWxzKHNlMi5vdGhlckV2ZW50LnBvaW50LCBpbnRlclswXSkpIHtcbiAgICAgIGRpdmlkZVNlZ21lbnQoc2UyLCBpbnRlclswXSwgcXVldWUpO1xuICAgIH1cbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIC8vIFRoZSBsaW5lIHNlZ21lbnRzIGFzc29jaWF0ZWQgdG8gc2UxIGFuZCBzZTIgb3ZlcmxhcFxuICB2YXIgZXZlbnRzICAgICAgICA9IFtdO1xuICB2YXIgbGVmdENvaW5jaWRlICA9IGZhbHNlO1xuICB2YXIgcmlnaHRDb2luY2lkZSA9IGZhbHNlO1xuXG4gIGlmIChlcXVhbHMoc2UxLnBvaW50LCBzZTIucG9pbnQpKSB7XG4gICAgbGVmdENvaW5jaWRlID0gdHJ1ZTsgLy8gbGlua2VkXG4gIH0gZWxzZSBpZiAoY29tcGFyZUV2ZW50cyhzZTEsIHNlMikgPT09IDEpIHtcbiAgICBldmVudHMucHVzaChzZTIsIHNlMSk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLnB1c2goc2UxLCBzZTIpO1xuICB9XG5cbiAgaWYgKGVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpKSB7XG4gICAgcmlnaHRDb2luY2lkZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoY29tcGFyZUV2ZW50cyhzZTEub3RoZXJFdmVudCwgc2UyLm90aGVyRXZlbnQpID09PSAxKSB7XG4gICAgZXZlbnRzLnB1c2goc2UyLm90aGVyRXZlbnQsIHNlMS5vdGhlckV2ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHMucHVzaChzZTEub3RoZXJFdmVudCwgc2UyLm90aGVyRXZlbnQpO1xuICB9XG5cbiAgaWYgKChsZWZ0Q29pbmNpZGUgJiYgcmlnaHRDb2luY2lkZSkgfHwgbGVmdENvaW5jaWRlKSB7XG4gICAgLy8gYm90aCBsaW5lIHNlZ21lbnRzIGFyZSBlcXVhbCBvciBzaGFyZSB0aGUgbGVmdCBlbmRwb2ludFxuICAgIHNlMS50eXBlID0gZWRnZVR5cGUuTk9OX0NPTlRSSUJVVElORztcbiAgICBzZTIudHlwZSA9IChzZTEuaW5PdXQgPT09IHNlMi5pbk91dCkgP1xuICAgICAgZWRnZVR5cGUuU0FNRV9UUkFOU0lUSU9OIDpcbiAgICAgIGVkZ2VUeXBlLkRJRkZFUkVOVF9UUkFOU0lUSU9OO1xuXG4gICAgaWYgKGxlZnRDb2luY2lkZSAmJiAhcmlnaHRDb2luY2lkZSkge1xuICAgICAgLy8gaG9uZXN0bHkgbm8gaWRlYSwgYnV0IGNoYW5naW5nIGV2ZW50cyBzZWxlY3Rpb24gZnJvbSBbMiwgMV1cbiAgICAgIC8vIHRvIFswLCAxXSBmaXhlcyB0aGUgb3ZlcmxhcHBpbmcgc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvbnMgaXNzdWVcbiAgICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLm90aGVyRXZlbnQsIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICAgIH1cbiAgICByZXR1cm4gMjtcbiAgfVxuXG4gIC8vIHRoZSBsaW5lIHNlZ21lbnRzIHNoYXJlIHRoZSByaWdodCBlbmRwb2ludFxuICBpZiAocmlnaHRDb2luY2lkZSkge1xuICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIC8vIG5vIGxpbmUgc2VnbWVudCBpbmNsdWRlcyB0b3RhbGx5IHRoZSBvdGhlciBvbmVcbiAgaWYgKGV2ZW50c1swXSAhPT0gZXZlbnRzWzNdLm90aGVyRXZlbnQpIHtcbiAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gICAgZGl2aWRlU2VnbWVudChldmVudHNbMV0sIGV2ZW50c1syXS5wb2ludCwgcXVldWUpO1xuICAgIHJldHVybiAzO1xuICB9XG5cbiAgLy8gb25lIGxpbmUgc2VnbWVudCBpbmNsdWRlcyB0aGUgb3RoZXIgb25lXG4gIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgZGl2aWRlU2VnbWVudChldmVudHNbM10ub3RoZXJFdmVudCwgZXZlbnRzWzJdLnBvaW50LCBxdWV1ZSk7XG5cbiAgcmV0dXJuIDM7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBzZVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHBcbiAqIEBwYXJhbSAge1F1ZXVlfSBxdWV1ZVxuICogQHJldHVybiB7UXVldWV9XG4gKi9cbmZ1bmN0aW9uIGRpdmlkZVNlZ21lbnQoc2UsIHAsIHF1ZXVlKSAge1xuICB2YXIgciA9IG5ldyBTd2VlcEV2ZW50KHAsIGZhbHNlLCBzZSwgICAgICAgICAgICBzZS5pc1N1YmplY3QpO1xuICB2YXIgbCA9IG5ldyBTd2VlcEV2ZW50KHAsIHRydWUsICBzZS5vdGhlckV2ZW50LCBzZS5pc1N1YmplY3QpO1xuXG4gIC8vIGF2b2lkIGEgcm91bmRpbmcgZXJyb3IuIFRoZSBsZWZ0IGV2ZW50IHdvdWxkIGJlIHByb2Nlc3NlZCBhZnRlciB0aGUgcmlnaHQgZXZlbnRcbiAgaWYgKGNvbXBhcmVFdmVudHMobCwgc2Uub3RoZXJFdmVudCkgPiAwKSB7XG4gICAgc2Uub3RoZXJFdmVudC5sZWZ0ID0gdHJ1ZTtcbiAgICBsLmxlZnQgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGF2b2lkIGEgcm91bmRpbmcgZXJyb3IuIFRoZSBsZWZ0IGV2ZW50IHdvdWxkIGJlIHByb2Nlc3NlZCBhZnRlciB0aGUgcmlnaHQgZXZlbnRcbiAgLy8gaWYgKGNvbXBhcmVFdmVudHMoc2UsIHIpID4gMCkge31cblxuICBzZS5vdGhlckV2ZW50Lm90aGVyRXZlbnQgPSBsO1xuICBzZS5vdGhlckV2ZW50ID0gcjtcblxuICBxdWV1ZS5wdXNoKGwpO1xuICBxdWV1ZS5wdXNoKHIpO1xuXG4gIHJldHVybiBxdWV1ZTtcbn1cblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycywgbm8tZGVidWdnZXIgKi9cbmZ1bmN0aW9uIGl0ZXJhdG9yRXF1YWxzKGl0MSwgaXQyKSB7XG4gIHJldHVybiBpdDEuX2N1cnNvciA9PT0gaXQyLl9jdXJzb3I7XG59XG5cblxuZnVuY3Rpb24gX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIHBvcywgZXZlbnQpIHtcbiAgdmFyIG1hcCA9IHdpbmRvdy5tYXA7XG4gIGlmICghbWFwKSByZXR1cm47XG4gIGlmICh3aW5kb3cuc3dzKSB3aW5kb3cuc3dzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuICAgIG1hcC5yZW1vdmVMYXllcihwKTtcbiAgfSk7XG4gIHdpbmRvdy5zd3MgPSBbXTtcbiAgc3dlZXBMaW5lLmVhY2goZnVuY3Rpb24oZSkge1xuICAgIHZhciBwb2x5ID0gTC5wb2x5bGluZShbZS5wb2ludC5zbGljZSgpLnJldmVyc2UoKSwgZS5vdGhlckV2ZW50LnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpXSwgeyBjb2xvcjogJ2dyZWVuJyB9KS5hZGRUbyhtYXApO1xuICAgIHdpbmRvdy5zd3MucHVzaChwb2x5KTtcbiAgfSk7XG5cbiAgaWYgKHdpbmRvdy52dCkgbWFwLnJlbW92ZUxheWVyKHdpbmRvdy52dCk7XG4gIHZhciB2ID0gcG9zLnNsaWNlKCk7XG4gIHZhciBiID0gbWFwLmdldEJvdW5kcygpO1xuICB3aW5kb3cudnQgPSBMLnBvbHlsaW5lKFtbYi5nZXROb3J0aCgpLCB2WzBdXSwgW2IuZ2V0U291dGgoKSwgdlswXV1dLCB7Y29sb3I6ICdncmVlbicsIHdlaWdodDogMX0pLmFkZFRvKG1hcCk7XG5cbiAgaWYgKHdpbmRvdy5wcykgbWFwLnJlbW92ZUxheWVyKHdpbmRvdy5wcyk7XG4gIHdpbmRvdy5wcyA9IEwucG9seWxpbmUoW2V2ZW50LnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpLCBldmVudC5vdGhlckV2ZW50LnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpXSwge2NvbG9yOiAnYmxhY2snLCB3ZWlnaHQ6IDksIG9wYWNpdHk6IDAuNH0pLmFkZFRvKG1hcCk7XG4gIGRlYnVnZ2VyO1xufVxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycywgbm8tZGVidWdnZXIgKi9cblxuXG5mdW5jdGlvbiBzdWJkaXZpZGVTZWdtZW50cyhldmVudFF1ZXVlLCBzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pIHtcbiAgdmFyIHNvcnRlZEV2ZW50cyA9IFtdO1xuICB2YXIgcHJldiwgbmV4dDtcblxuICB2YXIgc3dlZXBMaW5lID0gbmV3IFRyZWUoY29tcGFyZVNlZ21lbnRzKTtcbiAgdmFyIHNvcnRlZEV2ZW50cyA9IFtdO1xuXG4gIHZhciByaWdodGJvdW5kID0gbWluKHNiYm94WzJdLCBjYmJveFsyXSk7XG5cbiAgdmFyIHByZXYsIG5leHQ7XG5cbiAgd2hpbGUgKGV2ZW50UXVldWUubGVuZ3RoKSB7XG4gICAgdmFyIGV2ZW50ID0gZXZlbnRRdWV1ZS5wb3AoKTtcbiAgICBzb3J0ZWRFdmVudHMucHVzaChldmVudCk7XG5cbiAgICAvLyBvcHRpbWl6YXRpb24gYnkgYmJveGVzIGZvciBpbnRlcnNlY3Rpb24gYW5kIGRpZmZlcmVuY2UgZ29lcyBoZXJlXG4gICAgaWYgKChvcGVyYXRpb24gPT09IElOVEVSU0VDVElPTiAmJiBldmVudC5wb2ludFswXSA+IHJpZ2h0Ym91bmQpIHx8XG4gICAgICAgIChvcGVyYXRpb24gPT09IERJRkZFUkVOQ0UgICAmJiBldmVudC5wb2ludFswXSA+IHNiYm94WzJdKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmxlZnQpIHtcbiAgICAgIHN3ZWVwTGluZS5pbnNlcnQoZXZlbnQpO1xuICAgICAgLy8gX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIGV2ZW50LnBvaW50LCBldmVudCk7XG5cbiAgICAgIG5leHQgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG4gICAgICBldmVudC5pdGVyYXRvciA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgIHByZXYucHJldigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihzd2VlcExpbmUubWF4KCkpO1xuICAgICAgICBwcmV2Lm5leHQoKTtcbiAgICAgIH1cbiAgICAgIG5leHQubmV4dCgpO1xuXG4gICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuXG4gICAgICBpZiAobmV4dC5kYXRhKCkpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlSW50ZXJzZWN0aW9uKGV2ZW50LCBuZXh0LmRhdGEoKSwgZXZlbnRRdWV1ZSkgPT09IDIpIHtcbiAgICAgICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIG5leHQuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYuZGF0YSgpKSB7XG4gICAgICAgIGlmIChwb3NzaWJsZUludGVyc2VjdGlvbihwcmV2LmRhdGEoKSwgZXZlbnQsIGV2ZW50UXVldWUpID09PSAyKSB7XG4gICAgICAgICAgdmFyIHByZXZwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHByZXYuZGF0YSgpKTtcbiAgICAgICAgICBpZiAocHJldnByZXYuZGF0YSgpICE9PSBzd2VlcExpbmUubWluKCkpIHtcbiAgICAgICAgICAgIHByZXZwcmV2LnByZXYoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJldnByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoc3dlZXBMaW5lLm1heCgpKTtcbiAgICAgICAgICAgIHByZXZwcmV2Lm5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhwcmV2LmRhdGEoKSwgcHJldnByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudCA9IGV2ZW50Lm90aGVyRXZlbnQ7XG4gICAgICBuZXh0ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcbiAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuXG4gICAgICAvLyBfcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgZXZlbnQub3RoZXJFdmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBpZiAoIShwcmV2ICYmIG5leHQpKSBjb250aW51ZTtcblxuICAgICAgaWYgKHByZXYuZGF0YSgpICE9PSBzd2VlcExpbmUubWluKCkpIHtcbiAgICAgICAgcHJldi5wcmV2KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgIHByZXYubmV4dCgpO1xuICAgICAgfVxuICAgICAgbmV4dC5uZXh0KCk7XG4gICAgICBzd2VlcExpbmUucmVtb3ZlKGV2ZW50KTtcblxuICAgICAgLy9fcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgZXZlbnQub3RoZXJFdmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBpZiAobmV4dC5kYXRhKCkgJiYgcHJldi5kYXRhKCkpIHtcbiAgICAgICAgcG9zc2libGVJbnRlcnNlY3Rpb24ocHJldi5kYXRhKCksIG5leHQuZGF0YSgpLCBldmVudFF1ZXVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNvcnRlZEV2ZW50cztcbn1cblxuXG5mdW5jdGlvbiBzd2FwIChhcnIsIGksIG4pIHtcbiAgdmFyIHRlbXAgPSBhcnJbaV07XG4gIGFycltpXSA9IGFycltuXTtcbiAgYXJyW25dID0gdGVtcDtcbn1cblxuXG5mdW5jdGlvbiBjaGFuZ2VPcmllbnRhdGlvbihjb250b3VyKSB7XG4gIHJldHVybiBjb250b3VyLnJldmVyc2UoKTtcbn1cblxuXG5mdW5jdGlvbiBpc0FycmF5IChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5cbmZ1bmN0aW9uIGFkZEhvbGUoY29udG91ciwgaWR4KSB7XG4gIGlmICghaXNBcnJheShjb250b3VyWzBdWzBdKSkge1xuICAgIGNvbnRvdXIgPSBbY29udG91cl07XG4gIH1cbiAgY29udG91cltpZHhdID0gW107XG4gIHJldHVybiBjb250b3VyO1xufVxuXG5cbmZ1bmN0aW9uIGNvbm5lY3RFZGdlcyhzb3J0ZWRFdmVudHMpIHtcbiAgLy8gY29weSB0aGUgZXZlbnRzIGluIHRoZSByZXN1bHQgcG9seWdvbiB0byByZXN1bHRFdmVudHMgYXJyYXlcbiAgdmFyIHJlc3VsdEV2ZW50cyA9IFtdO1xuICB2YXIgZXZlbnQsIGksIGxlbjtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBzb3J0ZWRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBldmVudCA9IHNvcnRlZEV2ZW50c1tpXTtcbiAgICBpZiAoKGV2ZW50LmxlZnQgJiYgZXZlbnQuaW5SZXN1bHQpIHx8XG4gICAgICAoIWV2ZW50LmxlZnQgJiYgZXZlbnQub3RoZXJFdmVudC5pblJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdEV2ZW50cy5wdXNoKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBEdWUgdG8gb3ZlcmxhcHBpbmcgZWRnZXMgdGhlIHJlc3VsdEV2ZW50cyBhcnJheSBjYW4gYmUgbm90IHdob2xseSBzb3J0ZWRcbiAgdmFyIHNvcnRlZCA9IGZhbHNlO1xuICB3aGlsZSAoIXNvcnRlZCkge1xuICAgIHNvcnRlZCA9IHRydWU7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoKGkgKyAxKSA8IGxlbiAmJlxuICAgICAgICBjb21wYXJlRXZlbnRzKHJlc3VsdEV2ZW50c1tpXSwgcmVzdWx0RXZlbnRzW2kgKyAxXSkgPT09IDEpIHtcbiAgICAgICAgc3dhcChyZXN1bHRFdmVudHMsIGksIGkgKyAxKTtcbiAgICAgICAgc29ydGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcmVzdWx0RXZlbnRzW2ldLnBvcyA9IGk7XG4gICAgaWYgKCFyZXN1bHRFdmVudHNbaV0ubGVmdCkge1xuICAgICAgdmFyIHRlbXAgPSByZXN1bHRFdmVudHNbaV0ucG9zO1xuICAgICAgcmVzdWx0RXZlbnRzW2ldLnBvcyA9IHJlc3VsdEV2ZW50c1tpXS5vdGhlckV2ZW50LnBvcztcbiAgICAgIHJlc3VsdEV2ZW50c1tpXS5vdGhlckV2ZW50LnBvcyA9IHRlbXA7XG4gICAgfVxuICB9XG5cbiAgLy8gXCJmYWxzZVwiLWZpbGxlZCBhcnJheVxuICB2YXIgcHJvY2Vzc2VkID0gQXJyYXkocmVzdWx0RXZlbnRzLmxlbmd0aCk7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICB2YXIgZGVwdGggID0gW107XG4gIHZhciBob2xlT2YgPSBbXTtcbiAgdmFyIGlzSG9sZSA9IHt9O1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChwcm9jZXNzZWRbaV0pIGNvbnRpbnVlO1xuXG4gICAgdmFyIGNvbnRvdXIgPSBbXTtcbiAgICByZXN1bHQucHVzaChjb250b3VyKTtcblxuICAgIHZhciBjb250b3VySWQgPSByZXN1bHQubGVuZ3RoIC0gMTtcbiAgICBkZXB0aC5wdXNoKDApO1xuICAgIGhvbGVPZi5wdXNoKC0xKTtcblxuXG4gICAgaWYgKHJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQpIHtcbiAgICAgIHZhciBsb3dlckNvbnRvdXJJZCA9IHJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQuY29udG91cklkO1xuICAgICAgaWYgKCFyZXN1bHRFdmVudHNbaV0ucHJldkluUmVzdWx0LnJlc3VsdEluT3V0KSB7XG4gICAgICAgIGFkZEhvbGUocmVzdWx0W2xvd2VyQ29udG91cklkXSwgY29udG91cklkKTtcbiAgICAgICAgaG9sZU9mW2NvbnRvdXJJZF0gPSBsb3dlckNvbnRvdXJJZDtcbiAgICAgICAgZGVwdGhbY29udG91cklkXSAgPSBkZXB0aFtsb3dlckNvbnRvdXJJZF0gKyAxO1xuICAgICAgICBpc0hvbGVbY29udG91cklkXSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGlzSG9sZVtsb3dlckNvbnRvdXJJZF0pIHtcbiAgICAgICAgYWRkSG9sZShyZXN1bHRbaG9sZU9mW2xvd2VyQ29udG91cklkXV0sIGNvbnRvdXJJZCk7XG4gICAgICAgIGhvbGVPZltjb250b3VySWRdID0gaG9sZU9mW2xvd2VyQ29udG91cklkXTtcbiAgICAgICAgZGVwdGhbY29udG91cklkXSAgPSBkZXB0aFtsb3dlckNvbnRvdXJJZF07XG4gICAgICAgIGlzSG9sZVtjb250b3VySWRdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcG9zID0gaTtcbiAgICB2YXIgaW5pdGlhbCA9IHJlc3VsdEV2ZW50c1tpXS5wb2ludDtcbiAgICBjb250b3VyLnB1c2goaW5pdGlhbCk7XG5cbiAgICB3aGlsZSAocG9zID49IGkpIHtcbiAgICAgIHByb2Nlc3NlZFtwb3NdID0gdHJ1ZTtcblxuICAgICAgaWYgKHJlc3VsdEV2ZW50c1twb3NdLmxlZnQpIHtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ucmVzdWx0SW5PdXQgPSBmYWxzZTtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10uY29udG91cklkICAgPSBjb250b3VySWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LnJlc3VsdEluT3V0ID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5jb250b3VySWQgICA9IGNvbnRvdXJJZDtcbiAgICAgIH1cblxuICAgICAgcG9zID0gcmVzdWx0RXZlbnRzW3Bvc10ucG9zO1xuICAgICAgcHJvY2Vzc2VkW3Bvc10gPSB0cnVlO1xuXG4gICAgICBjb250b3VyLnB1c2gocmVzdWx0RXZlbnRzW3Bvc10ucG9pbnQpO1xuICAgICAgcG9zID0gbmV4dFBvcyhwb3MsIHJlc3VsdEV2ZW50cywgcHJvY2Vzc2VkKTtcbiAgICB9XG5cbiAgICBwb3MgPSBwb3MgPT09IC0xID8gaSA6IHBvcztcblxuICAgIHByb2Nlc3NlZFtwb3NdID0gcHJvY2Vzc2VkW3Jlc3VsdEV2ZW50c1twb3NdLnBvc10gPSB0cnVlO1xuICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQucmVzdWx0SW5PdXQgPSB0cnVlO1xuICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQuY29udG91cklkICAgPSBjb250b3VySWQ7XG5cblxuXG5cbiAgICAvLyBkZXB0aCBpcyBldmVuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSAqL1xuICAgIGlmIChkZXB0aFtjb250b3VySWRdICYgMSkge1xuICAgICAgY2hhbmdlT3JpZW50YXRpb24oY29udG91cik7XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgbm8tYml0d2lzZSAqL1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gcG9zXG4gKiBAcGFyYW0gIHtBcnJheS48U3dlZXBFdmVudD59IHJlc3VsdEV2ZW50c1xuICogQHBhcmFtICB7QXJyYXkuPEJvb2xlYW4+fSAgICBwcm9jZXNzZWRcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gbmV4dFBvcyhwb3MsIHJlc3VsdEV2ZW50cywgcHJvY2Vzc2VkKSB7XG4gIHZhciBuZXdQb3MgPSBwb3MgKyAxO1xuICB2YXIgbGVuZ3RoID0gcmVzdWx0RXZlbnRzLmxlbmd0aDtcbiAgd2hpbGUgKG5ld1BvcyA8IGxlbmd0aCAmJlxuICAgICAgICAgZXF1YWxzKHJlc3VsdEV2ZW50c1tuZXdQb3NdLnBvaW50LCByZXN1bHRFdmVudHNbcG9zXS5wb2ludCkpIHtcbiAgICBpZiAoIXByb2Nlc3NlZFtuZXdQb3NdKSB7XG4gICAgICByZXR1cm4gbmV3UG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdQb3MgPSBuZXdQb3MgKyAxO1xuICAgIH1cbiAgfVxuXG4gIG5ld1BvcyA9IHBvcyAtIDE7XG5cbiAgd2hpbGUgKHByb2Nlc3NlZFtuZXdQb3NdKSB7XG4gICAgbmV3UG9zID0gbmV3UG9zIC0gMTtcbiAgfVxuICByZXR1cm4gbmV3UG9zO1xufVxuXG5cbmZ1bmN0aW9uIHRyaXZpYWxPcGVyYXRpb24oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbikge1xuICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgaWYgKHN1YmplY3QubGVuZ3RoICogY2xpcHBpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OKSB7XG4gICAgICByZXN1bHQgPSBFTVBUWTtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSkge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gVU5JT04gfHwgb3BlcmF0aW9uID09PSBYT1IpIHtcbiAgICAgIHJlc3VsdCA9IChzdWJqZWN0Lmxlbmd0aCA9PT0gMCkgPyBjbGlwcGluZyA6IHN1YmplY3Q7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gY29tcGFyZUJCb3hlcyhzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pIHtcbiAgdmFyIHJlc3VsdCA9IG51bGw7XG4gIGlmIChzYmJveFswXSA+IGNiYm94WzJdIHx8XG4gICAgICBjYmJveFswXSA+IHNiYm94WzJdIHx8XG4gICAgICBzYmJveFsxXSA+IGNiYm94WzNdIHx8XG4gICAgICBjYmJveFsxXSA+IHNiYm94WzNdKSB7XG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OKSB7XG4gICAgICByZXN1bHQgPSBFTVBUWTtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSkge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gVU5JT04gfHwgb3BlcmF0aW9uID09PSBYT1IpIHtcbiAgICAgIHJlc3VsdCA9IHN1YmplY3QuY29uY2F0KGNsaXBwaW5nKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5mdW5jdGlvbiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBvcGVyYXRpb24pIHtcbiAgdmFyIHRyaXZpYWwgPSB0cml2aWFsT3BlcmF0aW9uKHN1YmplY3QsIGNsaXBwaW5nLCBvcGVyYXRpb24pO1xuICBpZiAodHJpdmlhbCkge1xuICAgIHJldHVybiB0cml2aWFsID09PSBFTVBUWSA/IG51bGwgOiB0cml2aWFsO1xuICB9XG4gIHZhciBzYmJveCA9IFtJbmZpbml0eSwgSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5XTtcbiAgdmFyIGNiYm94ID0gW0luZmluaXR5LCBJbmZpbml0eSwgLUluZmluaXR5LCAtSW5maW5pdHldO1xuXG4gIHZhciBldmVudFF1ZXVlID0gZmlsbFF1ZXVlKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gpO1xuXG4gIHRyaXZpYWwgPSBjb21wYXJlQkJveGVzKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbik7XG4gIGlmICh0cml2aWFsKSB7XG4gICAgcmV0dXJuIHRyaXZpYWwgPT09IEVNUFRZID8gbnVsbCA6IHRyaXZpYWw7XG4gIH1cbiAgdmFyIHNvcnRlZEV2ZW50cyA9IHN1YmRpdmlkZVNlZ21lbnRzKGV2ZW50UXVldWUsIHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbik7XG4gIHJldHVybiBjb25uZWN0RWRnZXMoc29ydGVkRXZlbnRzKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGJvb2xlYW47XG5cblxubW9kdWxlLmV4cG9ydHMudW5pb24gPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgVU5JT04pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy5kaWZmID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIERJRkZFUkVOQ0UpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy54b3IgPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgWE9SKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIElOVEVSU0VDVElPTik7XG59O1xuXG5cbi8qKlxuICogQGVudW0ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMub3BlcmF0aW9ucyA9IHtcbiAgSU5URVJTRUNUSU9OOiBJTlRFUlNFQ1RJT04sXG4gIERJRkZFUkVOQ0U6ICAgRElGRkVSRU5DRSxcbiAgVU5JT046ICAgICAgICBVTklPTixcbiAgWE9SOiAgICAgICAgICBYT1Jcbn07XG5cblxuLy8gZm9yIHRlc3Rpbmdcbm1vZHVsZS5leHBvcnRzLmZpbGxRdWV1ZSAgICAgICAgICAgID0gZmlsbFF1ZXVlO1xubW9kdWxlLmV4cG9ydHMuY29tcHV0ZUZpZWxkcyAgICAgICAgPSBjb21wdXRlRmllbGRzO1xubW9kdWxlLmV4cG9ydHMuc3ViZGl2aWRlU2VnbWVudHMgICAgPSBzdWJkaXZpZGVTZWdtZW50cztcbm1vZHVsZS5leHBvcnRzLmRpdmlkZVNlZ21lbnQgICAgICAgID0gZGl2aWRlU2VnbWVudDtcbm1vZHVsZS5leHBvcnRzLnBvc3NpYmxlSW50ZXJzZWN0aW9uID0gcG9zc2libGVJbnRlcnNlY3Rpb247XG4iLCJ2YXIgRVBTSUxPTiA9IDFlLTk7XG5cbi8qKlxuICogRmluZHMgdGhlIG1hZ25pdHVkZSBvZiB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9ycyAoaWYgd2UgcHJldGVuZFxuICogdGhleSdyZSBpbiB0aHJlZSBkaW1lbnNpb25zKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIEZpcnN0IHZlY3RvclxuICogQHBhcmFtIHtPYmplY3R9IGIgU2Vjb25kIHZlY3RvclxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBtYWduaXR1ZGUgb2YgdGhlIGNyb3NzIHByb2R1Y3RcbiAqL1xuZnVuY3Rpb24ga3Jvc3NQcm9kdWN0KGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF07XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIEZpcnN0IHZlY3RvclxuICogQHBhcmFtIHtPYmplY3R9IGIgU2Vjb25kIHZlY3RvclxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBkb3QgcHJvZHVjdFxuICovXG5mdW5jdGlvbiBkb3RQcm9kdWN0KGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV07XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGludGVyc2VjdGlvbiAoaWYgYW55KSBiZXR3ZWVuIHR3byBsaW5lIHNlZ21lbnRzIGEgYW5kIGIsIGdpdmVuIHRoZVxuICogbGluZSBzZWdtZW50cycgZW5kIHBvaW50cyBhMSwgYTIgYW5kIGIxLCBiMi5cbiAqXG4gKiBUaGlzIGFsZ29yaXRobSBpcyBiYXNlZCBvbiBTY2huZWlkZXIgYW5kIEViZXJseS5cbiAqIGh0dHA6Ly93d3cuY2ltZWMub3JnLmFyL35uY2Fsdm8vU2NobmVpZGVyX0ViZXJseS5wZGZcbiAqIFBhZ2UgMjQ0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGExIHBvaW50IG9mIGZpcnN0IGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGEyIHBvaW50IG9mIGZpcnN0IGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGIxIHBvaW50IG9mIHNlY29uZCBsaW5lXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBiMiBwb2ludCBvZiBzZWNvbmQgbGluZVxuICogQHBhcmFtIHtCb29sZWFuPX0gICAgICAgbm9FbmRwb2ludFRvdWNoIHdoZXRoZXIgdG8gc2tpcCBzaW5nbGUgdG91Y2hwb2ludHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobWVhbmluZyBjb25uZWN0ZWQgc2VnbWVudHMpIGFzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0aW9uc1xuICogQHJldHVybnMge0FycmF5LjxBcnJheS48TnVtYmVyPj58TnVsbH0gSWYgdGhlIGxpbmVzIGludGVyc2VjdCwgdGhlIHBvaW50IG9mXG4gKiBpbnRlcnNlY3Rpb24uIElmIHRoZXkgb3ZlcmxhcCwgdGhlIHR3byBlbmQgcG9pbnRzIG9mIHRoZSBvdmVybGFwcGluZyBzZWdtZW50LlxuICogT3RoZXJ3aXNlLCBudWxsLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGExLCBhMiwgYjEsIGIyLCBub0VuZHBvaW50VG91Y2gpIHtcbiAgLy8gVGhlIGFsZ29yaXRobSBleHBlY3RzIG91ciBsaW5lcyBpbiB0aGUgZm9ybSBQICsgc2QsIHdoZXJlIFAgaXMgYSBwb2ludCxcbiAgLy8gcyBpcyBvbiB0aGUgaW50ZXJ2YWwgWzAsIDFdLCBhbmQgZCBpcyBhIHZlY3Rvci5cbiAgLy8gV2UgYXJlIHBhc3NlZCB0d28gcG9pbnRzLiBQIGNhbiBiZSB0aGUgZmlyc3QgcG9pbnQgb2YgZWFjaCBwYWlyLiBUaGVcbiAgLy8gdmVjdG9yLCB0aGVuLCBjb3VsZCBiZSB0aG91Z2h0IG9mIGFzIHRoZSBkaXN0YW5jZSAoaW4geCBhbmQgeSBjb21wb25lbnRzKVxuICAvLyBmcm9tIHRoZSBmaXJzdCBwb2ludCB0byB0aGUgc2Vjb25kIHBvaW50LlxuICAvLyBTbyBmaXJzdCwgbGV0J3MgbWFrZSBvdXIgdmVjdG9yczpcbiAgdmFyIHZhID0gW2EyWzBdIC0gYTFbMF0sIGEyWzFdIC0gYTFbMV1dO1xuICB2YXIgdmIgPSBbYjJbMF0gLSBiMVswXSwgYjJbMV0gLSBiMVsxXV07XG4gIC8vIFdlIGFsc28gZGVmaW5lIGEgZnVuY3Rpb24gdG8gY29udmVydCBiYWNrIHRvIHJlZ3VsYXIgcG9pbnQgZm9ybTpcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBhcnJvdy1ib2R5LXN0eWxlICovXG5cbiAgZnVuY3Rpb24gdG9Qb2ludChwLCBzLCBkKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHBbMF0gKyBzICogZFswXSxcbiAgICAgIHBbMV0gKyBzICogZFsxXVxuICAgIF07XG4gIH1cblxuICAvKiBlc2xpbnQtZW5hYmxlIGFycm93LWJvZHktc3R5bGUgKi9cblxuICAvLyBUaGUgcmVzdCBpcyBwcmV0dHkgbXVjaCBhIHN0cmFpZ2h0IHBvcnQgb2YgdGhlIGFsZ29yaXRobS5cbiAgdmFyIGUgPSBbYjFbMF0gLSBhMVswXSwgYjFbMV0gLSBhMVsxXV07XG4gIHZhciBrcm9zcyA9IGtyb3NzUHJvZHVjdCh2YSwgdmIpO1xuICB2YXIgc3FyS3Jvc3MgPSBrcm9zcyAqIGtyb3NzO1xuICB2YXIgc3FyTGVuQSA9IGRvdFByb2R1Y3QodmEsIHZhKTtcbiAgdmFyIHNxckxlbkIgPSBkb3RQcm9kdWN0KHZiLCB2Yik7XG5cbiAgLy8gQ2hlY2sgZm9yIGxpbmUgaW50ZXJzZWN0aW9uLiBUaGlzIHdvcmtzIGJlY2F1c2Ugb2YgdGhlIHByb3BlcnRpZXMgb2YgdGhlXG4gIC8vIGNyb3NzIHByb2R1Y3QgLS0gc3BlY2lmaWNhbGx5LCB0d28gdmVjdG9ycyBhcmUgcGFyYWxsZWwgaWYgYW5kIG9ubHkgaWYgdGhlXG4gIC8vIGNyb3NzIHByb2R1Y3QgaXMgdGhlIDAgdmVjdG9yLiBUaGUgZnVsbCBjYWxjdWxhdGlvbiBpbnZvbHZlcyByZWxhdGl2ZSBlcnJvclxuICAvLyB0byBhY2NvdW50IGZvciBwb3NzaWJsZSB2ZXJ5IHNtYWxsIGxpbmUgc2VnbWVudHMuIFNlZSBTY2huZWlkZXIgJiBFYmVybHlcbiAgLy8gZm9yIGRldGFpbHMuXG4gIGlmIChzcXJLcm9zcyA+IEVQU0lMT04gKiBzcXJMZW5BICogc3FyTGVuQikge1xuICAgIC8vIElmIHRoZXkncmUgbm90IHBhcmFsbGVsLCB0aGVuIChiZWNhdXNlIHRoZXNlIGFyZSBsaW5lIHNlZ21lbnRzKSB0aGV5XG4gICAgLy8gc3RpbGwgbWlnaHQgbm90IGFjdHVhbGx5IGludGVyc2VjdC4gVGhpcyBjb2RlIGNoZWNrcyB0aGF0IHRoZVxuICAgIC8vIGludGVyc2VjdGlvbiBwb2ludCBvZiB0aGUgbGluZXMgaXMgYWN0dWFsbHkgb24gYm90aCBsaW5lIHNlZ21lbnRzLlxuICAgIHZhciBzID0ga3Jvc3NQcm9kdWN0KGUsIHZiKSAvIGtyb3NzO1xuICAgIGlmIChzIDwgMCB8fCBzID4gMSkge1xuICAgICAgLy8gbm90IG9uIGxpbmUgc2VnbWVudCBhXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHQgPSBrcm9zc1Byb2R1Y3QoZSwgdmEpIC8ga3Jvc3M7XG4gICAgaWYgKHQgPCAwIHx8IHQgPiAxKSB7XG4gICAgICAvLyBub3Qgb24gbGluZSBzZWdtZW50IGJcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzLCB2YSldO1xuICB9XG5cbiAgLy8gSWYgd2UndmUgcmVhY2hlZCB0aGlzIHBvaW50LCB0aGVuIHRoZSBsaW5lcyBhcmUgZWl0aGVyIHBhcmFsbGVsIG9yIHRoZVxuICAvLyBzYW1lLCBidXQgdGhlIHNlZ21lbnRzIGNvdWxkIG92ZXJsYXAgcGFydGlhbGx5IG9yIGZ1bGx5LCBvciBub3QgYXQgYWxsLlxuICAvLyBTbyB3ZSBuZWVkIHRvIGZpbmQgdGhlIG92ZXJsYXAsIGlmIGFueS4gVG8gZG8gdGhhdCwgd2UgY2FuIHVzZSBlLCB3aGljaCBpc1xuICAvLyB0aGUgKHZlY3RvcikgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSB0d28gaW5pdGlhbCBwb2ludHMuIElmIHRoaXMgaXMgcGFyYWxsZWxcbiAgLy8gd2l0aCB0aGUgbGluZSBpdHNlbGYsIHRoZW4gdGhlIHR3byBsaW5lcyBhcmUgdGhlIHNhbWUgbGluZSwgYW5kIHRoZXJlIHdpbGxcbiAgLy8gYmUgb3ZlcmxhcC5cbiAgdmFyIHNxckxlbkUgPSBkb3RQcm9kdWN0KGUsIGUpO1xuICBrcm9zcyA9IGtyb3NzUHJvZHVjdChlLCB2YSk7XG4gIHNxcktyb3NzID0ga3Jvc3MgKiBrcm9zcztcblxuICBpZiAoc3FyS3Jvc3MgPiBFUFNJTE9OICogc3FyTGVuQSAqIHNxckxlbkUpIHtcbiAgICAvLyBMaW5lcyBhcmUganVzdCBwYXJhbGxlbCwgbm90IHRoZSBzYW1lLiBObyBvdmVybGFwLlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIHNhID0gZG90UHJvZHVjdCh2YSwgZSkgLyBzcXJMZW5BO1xuICB2YXIgc2IgPSBzYSArIGRvdFByb2R1Y3QodmEsIHZiKSAvIHNxckxlbkE7XG4gIHZhciBzbWluID0gTWF0aC5taW4oc2EsIHNiKTtcbiAgdmFyIHNtYXggPSBNYXRoLm1heChzYSwgc2IpO1xuXG4gIC8vIHRoaXMgaXMsIGVzc2VudGlhbGx5LCB0aGUgRmluZEludGVyc2VjdGlvbiBhY3Rpbmcgb24gZmxvYXRzIGZyb21cbiAgLy8gU2NobmVpZGVyICYgRWJlcmx5LCBqdXN0IGlubGluZWQgaW50byB0aGlzIGZ1bmN0aW9uLlxuICBpZiAoc21pbiA8PSAxICYmIHNtYXggPj0gMCkge1xuXG4gICAgLy8gb3ZlcmxhcCBvbiBhbiBlbmQgcG9pbnRcbiAgICBpZiAoc21pbiA9PT0gMSkge1xuICAgICAgcmV0dXJuIG5vRW5kcG9pbnRUb3VjaCA/IG51bGwgOiBbdG9Qb2ludChhMSwgc21pbiA+IDAgPyBzbWluIDogMCwgdmEpXTtcbiAgICB9XG5cbiAgICBpZiAoc21heCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5vRW5kcG9pbnRUb3VjaCA/IG51bGwgOiBbdG9Qb2ludChhMSwgc21heCA8IDEgPyBzbWF4IDogMSwgdmEpXTtcbiAgICB9XG5cbiAgICBpZiAobm9FbmRwb2ludFRvdWNoICYmIHNtaW4gPT09IDAgJiYgc21heCA9PT0gMSkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBUaGVyZSdzIG92ZXJsYXAgb24gYSBzZWdtZW50IC0tIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLiBSZXR1cm4gYm90aC5cbiAgICByZXR1cm4gW1xuICAgICAgdG9Qb2ludChhMSwgc21pbiA+IDAgPyBzbWluIDogMCwgdmEpLFxuICAgICAgdG9Qb2ludChhMSwgc21heCA8IDEgPyBzbWF4IDogMSwgdmEpLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG4iLCIvKipcbiAqIFNpZ25lZCBhcmVhIG9mIHRoZSB0cmlhbmdsZSAocDAsIHAxLCBwMilcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMFxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAxXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaWduZWRBcmVhKHAwLCBwMSwgcDIpIHtcbiAgcmV0dXJuIChwMFswXSAtIHAyWzBdKSAqIChwMVsxXSAtIHAyWzFdKSAtIChwMVswXSAtIHAyWzBdKSAqIChwMFsxXSAtIHAyWzFdKTtcbn07XG4iLCJ2YXIgc2lnbmVkQXJlYSA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcbnZhciBFZGdlVHlwZSAgID0gcmVxdWlyZSgnLi9lZGdlX3R5cGUnKTtcblxuXG4vKipcbiAqIFN3ZWVwbGluZSBldmVudFxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59ICBwb2ludFxuICogQHBhcmFtIHtCb29sZWFufSAgICAgICAgIGxlZnRcbiAqIEBwYXJhbSB7U3dlZXBFdmVudD19ICAgICBvdGhlckV2ZW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgaXNTdWJqZWN0XG4gKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgZWRnZVR5cGVcbiAqL1xuZnVuY3Rpb24gU3dlZXBFdmVudChwb2ludCwgbGVmdCwgb3RoZXJFdmVudCwgaXNTdWJqZWN0LCBlZGdlVHlwZSkge1xuXG4gIC8qKlxuICAgKiBJcyBsZWZ0IGVuZHBvaW50P1xuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMubGVmdCA9IGxlZnQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48TnVtYmVyPn1cbiAgICovXG4gIHRoaXMucG9pbnQgPSBwb2ludDtcblxuICAvKipcbiAgICogT3RoZXIgZWRnZSByZWZlcmVuY2VcbiAgICogQHR5cGUge1N3ZWVwRXZlbnR9XG4gICAqL1xuICB0aGlzLm90aGVyRXZlbnQgPSBvdGhlckV2ZW50O1xuXG4gIC8qKlxuICAgKiBCZWxvbmdzIHRvIHNvdXJjZSBvciBjbGlwcGluZyBwb2x5Z29uXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5pc1N1YmplY3QgPSBpc1N1YmplY3Q7XG5cbiAgLyoqXG4gICAqIEVkZ2UgY29udHJpYnV0aW9uIHR5cGVcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMudHlwZSA9IGVkZ2VUeXBlIHx8IEVkZ2VUeXBlLk5PUk1BTDtcblxuXG4gIC8qKlxuICAgKiBJbi1vdXQgdHJhbnNpdGlvbiBmb3IgdGhlIHN3ZWVwbGluZSBjcm9zc2luZyBwb2x5Z29uXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5pbk91dCA9IGZhbHNlO1xuXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5vdGhlckluT3V0ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFByZXZpb3VzIGV2ZW50IGluIHJlc3VsdD9cbiAgICogQHR5cGUge1N3ZWVwRXZlbnR9XG4gICAqL1xuICB0aGlzLnByZXZJblJlc3VsdCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIERvZXMgZXZlbnQgYmVsb25nIHRvIHJlc3VsdD9cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmluUmVzdWx0ID0gZmFsc2U7XG5cblxuICAvLyBjb25uZWN0aW9uIHN0ZXBcblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLnJlc3VsdEluT3V0ID0gZmFsc2U7XG59XG5cblxuU3dlZXBFdmVudC5wcm90b3R5cGUgPSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgcFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNCZWxvdzogZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiB0aGlzLmxlZnQgP1xuICAgICAgc2lnbmVkQXJlYSAodGhpcy5wb2ludCwgdGhpcy5vdGhlckV2ZW50LnBvaW50LCBwKSA+IDAgOlxuICAgICAgc2lnbmVkQXJlYSAodGhpcy5vdGhlckV2ZW50LnBvaW50LCB0aGlzLnBvaW50LCBwKSA+IDA7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc0Fib3ZlOiBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzQmVsb3cocCk7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzVmVydGljYWw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50WzBdID09PSB0aGlzLm90aGVyRXZlbnQucG9pbnRbMF07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3dlZXBFdmVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBUaW55UXVldWU7XG5cbmZ1bmN0aW9uIFRpbnlRdWV1ZShkYXRhLCBjb21wYXJlKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFRpbnlRdWV1ZSkpIHJldHVybiBuZXcgVGlueVF1ZXVlKGRhdGEsIGNvbXBhcmUpO1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YSB8fCBbXTtcbiAgICB0aGlzLmxlbmd0aCA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgdGhpcy5jb21wYXJlID0gY29tcGFyZSB8fCBkZWZhdWx0Q29tcGFyZTtcblxuICAgIGlmIChkYXRhKSBmb3IgKHZhciBpID0gTWF0aC5mbG9vcih0aGlzLmxlbmd0aCAvIDIpOyBpID49IDA7IGktLSkgdGhpcy5fZG93bihpKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoYSwgYikge1xuICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMDtcbn1cblxuVGlueVF1ZXVlLnByb3RvdHlwZSA9IHtcblxuICAgIHB1c2g6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICB0aGlzLl91cCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgIH0sXG5cbiAgICBwb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvcCA9IHRoaXMuZGF0YVswXTtcbiAgICAgICAgdGhpcy5kYXRhWzBdID0gdGhpcy5kYXRhW3RoaXMubGVuZ3RoIC0gMV07XG4gICAgICAgIHRoaXMubGVuZ3RoLS07XG4gICAgICAgIHRoaXMuZGF0YS5wb3AoKTtcbiAgICAgICAgdGhpcy5fZG93bigwKTtcbiAgICAgICAgcmV0dXJuIHRvcDtcbiAgICB9LFxuXG4gICAgcGVlazogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xuICAgIH0sXG5cbiAgICBfdXA6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEsXG4gICAgICAgICAgICBjb21wYXJlID0gdGhpcy5jb21wYXJlO1xuXG4gICAgICAgIHdoaWxlIChwb3MgPiAwKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gTWF0aC5mbG9vcigocG9zIC0gMSkgLyAyKTtcbiAgICAgICAgICAgIGlmIChjb21wYXJlKGRhdGFbcG9zXSwgZGF0YVtwYXJlbnRdKSA8IDApIHtcbiAgICAgICAgICAgICAgICBzd2FwKGRhdGEsIHBhcmVudCwgcG9zKTtcbiAgICAgICAgICAgICAgICBwb3MgPSBwYXJlbnQ7XG5cbiAgICAgICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZG93bjogZnVuY3Rpb24gKHBvcykge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIGNvbXBhcmUgPSB0aGlzLmNvbXBhcmUsXG4gICAgICAgICAgICBsZW4gPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGxlZnQgPSAyICogcG9zICsgMSxcbiAgICAgICAgICAgICAgICByaWdodCA9IGxlZnQgKyAxLFxuICAgICAgICAgICAgICAgIG1pbiA9IHBvcztcblxuICAgICAgICAgICAgaWYgKGxlZnQgPCBsZW4gJiYgY29tcGFyZShkYXRhW2xlZnRdLCBkYXRhW21pbl0pIDwgMCkgbWluID0gbGVmdDtcbiAgICAgICAgICAgIGlmIChyaWdodCA8IGxlbiAmJiBjb21wYXJlKGRhdGFbcmlnaHRdLCBkYXRhW21pbl0pIDwgMCkgbWluID0gcmlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChtaW4gPT09IHBvcykgcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2FwKGRhdGEsIG1pbiwgcG9zKTtcbiAgICAgICAgICAgIHBvcyA9IG1pbjtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHN3YXAoZGF0YSwgaSwgaikge1xuICAgIHZhciB0bXAgPSBkYXRhW2ldO1xuICAgIGRhdGFbaV0gPSBkYXRhW2pdO1xuICAgIGRhdGFbal0gPSB0bXA7XG59XG4iLCIvKipcbiAqIE9mZnNldCBlZGdlIG9mIHRoZSBwb2x5Z29uXG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBjdXJyZW50XG4gKiBAcGFyYW0gIHtPYmplY3R9IG5leHRcbiAqIEBjb3NudHJ1Y3RvclxuICovXG5mdW5jdGlvbiBFZGdlKGN1cnJlbnQsIG5leHQpIHtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMuY3VycmVudCA9IGN1cnJlbnQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLm5leHQgPSBuZXh0O1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5faW5Ob3JtYWwgPSB0aGlzLmlud2FyZHNOb3JtYWwoKTtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMuX291dE5vcm1hbCA9IHRoaXMub3V0d2FyZHNOb3JtYWwoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIG91dHdhcmRzIG5vcm1hbFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5FZGdlLnByb3RvdHlwZS5vdXR3YXJkc05vcm1hbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaW53YXJkcyA9IHRoaXMuaW53YXJkc05vcm1hbCgpO1xuICByZXR1cm4gW1xuICAgIC1pbndhcmRzWzBdLFxuICAgIC1pbndhcmRzWzFdXG4gIF07XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgaW53YXJkcyBub3JtYWxcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuRWRnZS5wcm90b3R5cGUuaW53YXJkc05vcm1hbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZHggPSB0aGlzLm5leHRbMF0gLSB0aGlzLmN1cnJlbnRbMF0sXG4gICAgICBkeSA9IHRoaXMubmV4dFsxXSAtIHRoaXMuY3VycmVudFsxXSxcbiAgICAgIGVkZ2VMZW5ndGggPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gIHJldHVybiBbXG4gICAgLWR5IC8gZWRnZUxlbmd0aCxcbiAgICAgZHggLyBlZGdlTGVuZ3RoXG4gIF07XG59O1xuXG4vKipcbiAqIE9mZnNldHMgdGhlIGVkZ2UgYnkgZHgsIGR5XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGR4XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGR5XG4gKiBAcmV0dXJuIHtFZGdlfVxuICovXG5FZGdlLnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihkeCwgZHkpIHtcbiAgdmFyIGN1cnJlbnQgPSB0aGlzLmN1cnJlbnQsXG4gICAgICBuZXh0ID0gdGhpcy5uZXh0O1xuXG4gIHJldHVybiBuZXcgRWRnZShbXG4gICAgY3VycmVudFswXSArIGR4LFxuICAgIGN1cnJlbnRbMV0gKyBkeVxuICBdLCBbXG4gICAgbmV4dFswXSArIGR4LFxuICAgIG5leHRbMV0gKyBkeVxuICBdKTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gRWRnZTtcbiIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBFZGdlID0gcmVxdWlyZSgnLi9lZGdlJyk7XG52YXIgbWFydGluZXogPSBnbG9iYWwubWFydGluZXogPSByZXF1aXJlKCdtYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nJyk7XG5cbnZhciBhdGFuMiA9IE1hdGguYXRhbjI7XG5cbi8qKlxuICogT2Zmc2V0IGJ1aWxkZXJcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+PX0gdmVydGljZXNcbiAqIEBwYXJhbSB7TnVtYmVyPX0gICAgICAgIGFyY1NlZ21lbnRzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gT2Zmc2V0KHZlcnRpY2VzLCBhcmNTZWdtZW50cykge1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59XG4gICAqL1xuICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcblxuICAvKipcbiAgICogQHR5cGUge0FycmF5LjxFZGdlPn1cbiAgICovXG4gIHRoaXMuZWRnZXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuX2Nsb3NlZCA9IGZhbHNlO1xuXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9kaXN0YW5jZSA9IDA7XG5cbiAgaWYgKHZlcnRpY2VzKSB7XG4gICAgICB0aGlzLmRhdGEodmVydGljZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZ21lbnRzIGluIGVkZ2UgYm91bmRpbmcgYXJjaGVzXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBhcmNTZWdtZW50cyA6IDU7XG59XG5cbi8qKlxuICogQ2hhbmdlIGRhdGEgc2V0XG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXk+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2ZXJ0aWNlcyA9IHRoaXMudmFsaWRhdGUodmVydGljZXMpO1xuXG4gIGlmICh2ZXJ0aWNlcy5sZW5ndGggPiAxKSB7XG4gICAgdmFyIGVkZ2VzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZlcnRpY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBlZGdlcy5wdXNoKG5ldyBFZGdlKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbGVuXSkpO1xuICAgIH1cbiAgICB0aGlzLmVkZ2VzID0gZWRnZXM7XG4gIH1cbiAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gYXJjU2VnbWVudHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5hcmNTZWdtZW50cyA9IGZ1bmN0aW9uKGFyY1NlZ21lbnRzKSB7XG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFZhbGlkYXRlcyBpZiB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnRzIHJlcGVhdFxuICogVE9ETzogY2hlY2sgQ0NXXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IHZlcnRpY2VzXG4gKi9cbk9mZnNldC5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2YXIgbGVuID0gdmVydGljZXMubGVuZ3RoO1xuICBpZiAodHlwZW9mIHZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykgcmV0dXJuIFt2ZXJ0aWNlc107XG4gIGlmICh2ZXJ0aWNlc1swXVswXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMF0gJiZcbiAgICB2ZXJ0aWNlc1swXVsxXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMV0pIHtcbiAgICBpZiAobGVuID4gMSkge1xuICAgICAgdmVydGljZXMgPSB2ZXJ0aWNlcy5zbGljZSgwLCBsZW4gLSAxKTtcbiAgICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIGFyY2ggYmV0d2VlbiB0d28gZWRnZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICByYWRpdXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBzdGFydFZlcnRleFxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGVuZFZlcnRleFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHNlZ21lbnRzXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgb3V0d2FyZHNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5jcmVhdGVBcmMgPSBmdW5jdGlvbih2ZXJ0aWNlcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0VmVydGV4LFxuICAgIGVuZFZlcnRleCwgc2VnbWVudHMsIG91dHdhcmRzKSB7XG5cbiAgdmFyIFBJMiA9IE1hdGguUEkgKiAyLFxuICAgICAgc3RhcnRBbmdsZSA9IGF0YW4yKHN0YXJ0VmVydGV4WzFdIC0gY2VudGVyWzFdLCBzdGFydFZlcnRleFswXSAtIGNlbnRlclswXSksXG4gICAgICBlbmRBbmdsZSA9IGF0YW4yKGVuZFZlcnRleFsxXSAtIGNlbnRlclsxXSwgZW5kVmVydGV4WzBdIC0gY2VudGVyWzBdKTtcblxuICAvLyBvZGQgbnVtYmVyIHBsZWFzZVxuICBpZiAoc2VnbWVudHMgJSAyID09PSAwKSB7XG4gICAgc2VnbWVudHMgLT0gMTtcbiAgfVxuXG4gIGlmIChzdGFydEFuZ2xlIDwgMCkge1xuICAgIHN0YXJ0QW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgaWYgKGVuZEFuZ2xlIDwgMCkge1xuICAgIGVuZEFuZ2xlICs9IFBJMjtcbiAgfVxuXG4gIHZhciBhbmdsZSA9ICgoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSA/XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSA6XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSArIFBJMiAtIGVuZEFuZ2xlKSksXG4gICAgICBzZWdtZW50QW5nbGUgPSAoKG91dHdhcmRzKSA/IC1hbmdsZSA6IFBJMiAtIGFuZ2xlKSAvIHNlZ21lbnRzO1xuXG4gIHZlcnRpY2VzLnB1c2goc3RhcnRWZXJ0ZXgpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNlZ21lbnRzOyArK2kpIHtcbiAgICBhbmdsZSA9IHN0YXJ0QW5nbGUgKyBzZWdtZW50QW5nbGUgKiBpO1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLFxuICAgICAgY2VudGVyWzFdICsgTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzXG4gICAgXSk7XG4gIH1cbiAgdmVydGljZXMucHVzaChlbmRWZXJ0ZXgpO1xuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSAgZGlzdFxuICogQHBhcmFtICB7U3RyaW5nPX0gdW5pdHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uKGRpc3QsIHVuaXRzKSB7XG4gIHRoaXMuX2Rpc3RhbmNlID0gZGlzdCB8fCAwO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICBkZWdyZWVzXG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB1bml0c1xuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5PZmZzZXQuZGVncmVlc1RvVW5pdHMgPSBmdW5jdGlvbihkZWdyZWVzLCB1bml0cykge1xuICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgY2FzZSAnbWlsZXMnOlxuICAgICAgZGVncmVlcyA9IGRlZ3JlZXMgLyA2OS4wNDc7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnZmVldCc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDM2NDU2OC4wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAna2lsb21ldGVycyc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDExMS4xMjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21ldGVycyc6XG4gICAgY2FzZSAnbWV0cmVzJzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMTExMTIwLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdkZWdyZWVzJzpcbiAgICBjYXNlICdwaXhlbHMnOlxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZGVncmVlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmVuc3VyZUxhc3RQb2ludCA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIGlmICh0aGlzLl9jbG9zZWQpIHtcbiAgICB2ZXJ0aWNlcy5wdXNoKFtcbiAgICAgIHZlcnRpY2VzWzBdWzBdLFxuICAgICAgdmVydGljZXNbMF1bMV1cbiAgICBdKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogRGVjaWRlcyBieSB0aGUgc2lnbiBpZiBpdCdzIGEgcGFkZGluZyBvciBhIG1hcmdpblxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuICByZXR1cm4gdGhpcy5fZGlzdGFuY2UgPT09IDAgPyB0aGlzLnZlcnRpY2VzIDpcbiAgICAgICh0aGlzLl9kaXN0YW5jZSA+IDAgPyB0aGlzLm1hcmdpbih0aGlzLl9kaXN0YW5jZSkgOlxuICAgICAgICB0aGlzLnBhZGRpbmcoLXRoaXMuX2Rpc3RhbmNlKSk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgICAgICAgIHB0MVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICAgICAgICAgcHQyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLl9vZmZzZXRTZWdtZW50ID0gZnVuY3Rpb24odmVydGljZXMsIHB0MSwgcHQyLCBkaXN0KSB7XG4gIHZhciBlZGdlcyA9IFtuZXcgRWRnZShwdDEsIHB0MiksIG5ldyBFZGdlKHB0MiwgcHQxKV07XG4gIHZhciBpLCBsZW4gPSAyO1xuXG4gIHZhciBvZmZzZXRzID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcbiAgICB2YXIgZHggPSBlZGdlLl9pbk5vcm1hbFswXSAqIGRpc3Q7XG4gICAgdmFyIGR5ID0gZWRnZS5faW5Ob3JtYWxbMV0gKiBkaXN0O1xuXG4gICAgb2Zmc2V0cy5wdXNoKGVkZ2Uub2Zmc2V0KGR4LCBkeSkpO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIHRoaXNFZGdlID0gb2Zmc2V0c1tpXSxcbiAgICAgICAgcHJldkVkZ2UgPSBvZmZzZXRzWyhpICsgbGVuIC0gMSkgJSBsZW5dO1xuICAgIHRoaXMuY3JlYXRlQXJjKFxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLFxuICAgICAgICAgICAgICAgIGVkZ2VzW2ldLmN1cnJlbnQsIC8vIHAxIG9yIHAyXG4gICAgICAgICAgICAgICAgZGlzdCxcbiAgICAgICAgICAgICAgICBwcmV2RWRnZS5uZXh0LFxuICAgICAgICAgICAgICAgIHRoaXNFZGdlLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5fYXJjU2VnbWVudHMsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5tYXJnaW4gPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG5cbiAgaWYgKGRpc3QgPT09IDApIHJldHVybiB0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKTtcbiAgaWYgKHRoaXMudmVydGljZXMubGVuZ3RoID09PSAxKSByZXR1cm4gdGhpcy5vZmZzZXRQb2ludCh0aGlzLl9kaXN0YW5jZSk7XG5cbiAgdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG4gIHZhciB1bmlvbiA9IHRoaXMub2Zmc2V0TGluZSh0aGlzLl9kaXN0YW5jZSk7XG4gIHVuaW9uID0gbWFydGluZXoudW5pb24odW5pb24sIFt0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKV0pO1xuICByZXR1cm4gdW5pb247XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5wYWRkaW5nID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuXG4gIGlmICh0aGlzLl9kaXN0YW5jZSA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICBpZiAodGhpcy52ZXJ0aWNlcy5sZW5ndGggPT09IDEpIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuXG4gIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmUodGhpcy5fZGlzdGFuY2UpO1xuICB2YXIgZGlmZiA9IG1hcnRpbmV6LmRpZmYodGhpcy52ZXJ0aWNlcywgdW5pb24pO1xuICByZXR1cm4gZGlmZjtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIG1hcmdpbiBwb2x5Z29uXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldExpbmUgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG4gIGlmICh0aGlzLl9kaXN0YW5jZSA9PT0gMCkgcmV0dXJuIHRoaXMudmVydGljZXM7XG5cbiAgdmFyIHZlcnRpY2VzID0gW107XG4gIHZhciB1bmlvbiAgICA9IFtdO1xuICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBzZWdtZW50ID0gdGhpcy5lbnN1cmVMYXN0UG9pbnQoXG4gICAgICAgIHRoaXMuX29mZnNldFNlZ21lbnQoW10sIHRoaXMudmVydGljZXNbaV0sIHRoaXMudmVydGljZXNbaSArIDFdLCB0aGlzLl9kaXN0YW5jZSlcbiAgICApO1xuICAgIHZlcnRpY2VzLnB1c2goc2VnbWVudCk7XG4gICAgdW5pb24gPSAoaSA9PT0gMCkgPyBzZWdtZW50IDogbWFydGluZXoudW5pb24odW5pb24sIHNlZ21lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMudmVydGljZXMubGVuZ3RoID4gMiA/IHVuaW9uIDogW3VuaW9uXTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0UG9pbnQgPSBmdW5jdGlvbihkaXN0YW5jZSkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3RhbmNlKTtcbiAgdmFyIHZlcnRpY2VzID0gdGhpcy5fYXJjU2VnbWVudHMgKiAyO1xuICB2YXIgcG9pbnRzICAgPSBbXTtcbiAgdmFyIGNlbnRlciAgID0gdGhpcy52ZXJ0aWNlc1swXTtcbiAgdmFyIHJhZGl1cyAgID0gdGhpcy5fZGlzdGFuY2U7XG4gIHZhciBhbmdsZSAgICA9IDA7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZXJ0aWNlcyAtIDE7IGkrKykge1xuICAgIGFuZ2xlICs9ICgyICogTWF0aC5QSSAvIHZlcnRpY2VzKTsgLy8gY291bnRlci1jbG9ja3dpc2VcbiAgICBwb2ludHMucHVzaChbXG4gICAgICBjZW50ZXJbMF0gKyAocmFkaXVzICogTWF0aC5jb3MoYW5nbGUpKSxcbiAgICAgIGNlbnRlclsxXSArIChyYWRpdXMgKiBNYXRoLnNpbihhbmdsZSkpXG4gICAgXSk7XG4gIH1cblxuICByZXR1cm4gcG9pbnRzO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPZmZzZXQ7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW5OeVl5OXZabVp6WlhRdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCRlpHZGxJRDBnY21WeGRXbHlaU2duTGk5bFpHZGxKeWs3WEc1MllYSWdiV0Z5ZEdsdVpYb2dQU0JuYkc5aVlXd3ViV0Z5ZEdsdVpYb2dQU0J5WlhGMWFYSmxLQ2R0WVhKMGFXNWxlaTF3YjJ4NVoyOXVMV05zYVhCd2FXNW5KeWs3WEc1Y2JuWmhjaUJoZEdGdU1pQTlJRTFoZEdndVlYUmhiakk3WEc1Y2JpOHFLbHh1SUNvZ1QyWm1jMlYwSUdKMWFXeGtaWEpjYmlBcVhHNGdLaUJBY0dGeVlXMGdlMEZ5Y21GNUxqeFBZbXBsWTNRK1BYMGdkbVZ5ZEdsalpYTmNiaUFxSUVCd1lYSmhiU0I3VG5WdFltVnlQWDBnSUNBZ0lDQWdJR0Z5WTFObFoyMWxiblJ6WEc0Z0tpQkFZMjl1YzNSeWRXTjBiM0pjYmlBcUwxeHVablZ1WTNScGIyNGdUMlptYzJWMEtIWmxjblJwWTJWekxDQmhjbU5UWldkdFpXNTBjeWtnZTF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBZEhsd1pTQjdRWEp5WVhrdVBFOWlhbVZqZEQ1OVhHNGdJQ0FxTDF4dUlDQjBhR2x6TG5abGNuUnBZMlZ6SUQwZ2JuVnNiRHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRSFI1Y0dVZ2UwRnljbUY1TGp4RlpHZGxQbjFjYmlBZ0lDb3ZYRzRnSUhSb2FYTXVaV1JuWlhNZ1BTQnVkV3hzTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBZEhsd1pTQjdRbTl2YkdWaGJuMWNiaUFnSUNvdlhHNGdJSFJvYVhNdVgyTnNiM05sWkNBOUlHWmhiSE5sTzF4dVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBcUwxeHVJQ0IwYUdsekxsOWthWE4wWVc1alpTQTlJREE3WEc1Y2JpQWdhV1lnS0habGNuUnBZMlZ6S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbVJoZEdFb2RtVnlkR2xqWlhNcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRk5sWjIxbGJuUnpJR2x1SUdWa1oyVWdZbTkxYm1ScGJtY2dZWEpqYUdWelhHNGdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBcUwxeHVJQ0IwYUdsekxsOWhjbU5UWldkdFpXNTBjeUE5SUdGeVkxTmxaMjFsYm5SeklDRTlQU0IxYm1SbFptbHVaV1FnUHlCaGNtTlRaV2R0Wlc1MGN5QTZJRFU3WEc1OVhHNWNiaThxS2x4dUlDb2dRMmhoYm1kbElHUmhkR0VnYzJWMFhHNGdLaUJBY0dGeVlXMGdJSHRCY25KaGVTNDhRWEp5WVhrK2ZTQjJaWEowYVdObGMxeHVJQ29nUUhKbGRIVnliaUI3VDJabWMyVjBmVnh1SUNvdlhHNVBabVp6WlhRdWNISnZkRzkwZVhCbExtUmhkR0VnUFNCbWRXNWpkR2x2YmloMlpYSjBhV05sY3lrZ2UxeHVJQ0IyWlhKMGFXTmxjeUE5SUhSb2FYTXVkbUZzYVdSaGRHVW9kbVZ5ZEdsalpYTXBPMXh1WEc0Z0lHbG1JQ2gyWlhKMGFXTmxjeTVzWlc1bmRHZ2dQaUF4S1NCN1hHNGdJQ0FnZG1GeUlHVmtaMlZ6SUQwZ1cxMDdYRzRnSUNBZ1ptOXlJQ2gyWVhJZ2FTQTlJREFzSUd4bGJpQTlJSFpsY25ScFkyVnpMbXhsYm1kMGFEc2dhU0E4SUd4bGJqc2dhU3NyS1NCN1hHNGdJQ0FnSUNCbFpHZGxjeTV3ZFhOb0tHNWxkeUJGWkdkbEtIWmxjblJwWTJWelcybGRMQ0IyWlhKMGFXTmxjMXNvYVNBcklERXBJQ1VnYkdWdVhTa3BPMXh1SUNBZ0lIMWNiaUFnSUNCMGFHbHpMbVZrWjJWeklEMGdaV1JuWlhNN1hHNGdJSDFjYmlBZ2RHaHBjeTUyWlhKMGFXTmxjeUE5SUhabGNuUnBZMlZ6TzF4dVhHNGdJSEpsZEhWeWJpQjBhR2x6TzF4dWZUdGNibHh1WEc0dktpcGNiaUFxSUVCd1lYSmhiU0FnZTA1MWJXSmxjbjBnWVhKalUyVm5iV1Z1ZEhOY2JpQXFJRUJ5WlhSMWNtNGdlMDltWm5ObGRIMWNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1aGNtTlRaV2R0Wlc1MGN5QTlJR1oxYm1OMGFXOXVLR0Z5WTFObFoyMWxiblJ6S1NCN1hHNGdJSFJvYVhNdVgyRnlZMU5sWjIxbGJuUnpJRDBnWVhKalUyVm5iV1Z1ZEhNN1hHNGdJSEpsZEhWeWJpQjBhR2x6TzF4dWZUdGNibHh1WEc0dktpcGNiaUFxSUZaaGJHbGtZWFJsY3lCcFppQjBhR1VnWm1seWMzUWdZVzVrSUd4aGMzUWdjRzlwYm5SeklISmxjR1ZoZEZ4dUlDb2dWRTlFVHpvZ1kyaGxZMnNnUTBOWFhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUNCN1FYSnlZWGt1UEU5aWFtVmpkRDU5SUhabGNuUnBZMlZ6WEc0Z0tpOWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXVkbUZzYVdSaGRHVWdQU0JtZFc1amRHbHZiaWgyWlhKMGFXTmxjeWtnZTF4dUlDQjJZWElnYkdWdUlEMGdkbVZ5ZEdsalpYTXViR1Z1WjNSb08xeHVJQ0JwWmlBb2RIbHdaVzltSUhabGNuUnBZMlZ6V3pCZElEMDlQU0FuYm5WdFltVnlKeWtnY21WMGRYSnVJRnQyWlhKMGFXTmxjMTA3WEc0Z0lHbG1JQ2gyWlhKMGFXTmxjMXN3WFZzd1hTQTlQVDBnZG1WeWRHbGpaWE5iYkdWdUlDMGdNVjFiTUYwZ0ppWmNiaUFnSUNCMlpYSjBhV05sYzFzd1hWc3hYU0E5UFQwZ2RtVnlkR2xqWlhOYmJHVnVJQzBnTVYxYk1WMHBJSHRjYmlBZ0lDQnBaaUFvYkdWdUlENGdNU2tnZTF4dUlDQWdJQ0FnZG1WeWRHbGpaWE1nUFNCMlpYSjBhV05sY3k1emJHbGpaU2d3TENCc1pXNGdMU0F4S1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMk5zYjNObFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnZlZ4dUlDQjlYRzRnSUhKbGRIVnliaUIyWlhKMGFXTmxjenRjYm4wN1hHNWNibHh1THlvcVhHNGdLaUJEY21WaGRHVnpJR0Z5WTJnZ1ltVjBkMlZsYmlCMGQyOGdaV1JuWlhOY2JpQXFYRzRnS2lCQWNHRnlZVzBnSUh0QmNuSmhlUzQ4VDJKcVpXTjBQbjBnZG1WeWRHbGpaWE5jYmlBcUlFQndZWEpoYlNBZ2UwOWlhbVZqZEgwZ0lDQWdJQ0FnSUNCalpXNTBaWEpjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ0lDQWdJQ0FnSUNCeVlXUnBkWE5jYmlBcUlFQndZWEpoYlNBZ2UwOWlhbVZqZEgwZ0lDQWdJQ0FnSUNCemRHRnlkRlpsY25SbGVGeHVJQ29nUUhCaGNtRnRJQ0I3VDJKcVpXTjBmU0FnSUNBZ0lDQWdJR1Z1WkZabGNuUmxlRnh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNBZ0lDQWdJQ0FnSUhObFoyMWxiblJ6WEc0Z0tpQkFjR0Z5WVcwZ0lIdENiMjlzWldGdWZTQWdJQ0FnSUNBZ2IzVjBkMkZ5WkhOY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzVqY21WaGRHVkJjbU1nUFNCbWRXNWpkR2x2YmloMlpYSjBhV05sY3l3Z1kyVnVkR1Z5TENCeVlXUnBkWE1zSUhOMFlYSjBWbVZ5ZEdWNExGeHVJQ0FnSUdWdVpGWmxjblJsZUN3Z2MyVm5iV1Z1ZEhNc0lHOTFkSGRoY21SektTQjdYRzVjYmlBZ2RtRnlJRkJKTWlBOUlFMWhkR2d1VUVrZ0tpQXlMRnh1SUNBZ0lDQWdjM1JoY25SQmJtZHNaU0E5SUdGMFlXNHlLSE4wWVhKMFZtVnlkR1Y0V3pGZElDMGdZMlZ1ZEdWeVd6RmRMQ0J6ZEdGeWRGWmxjblJsZUZzd1hTQXRJR05sYm5SbGNsc3dYU2tzWEc0Z0lDQWdJQ0JsYm1SQmJtZHNaU0E5SUdGMFlXNHlLR1Z1WkZabGNuUmxlRnN4WFNBdElHTmxiblJsY2xzeFhTd2daVzVrVm1WeWRHVjRXekJkSUMwZ1kyVnVkR1Z5V3pCZEtUdGNibHh1SUNBdkx5QnZaR1FnYm5WdFltVnlJSEJzWldGelpWeHVJQ0JwWmlBb2MyVm5iV1Z1ZEhNZ0pTQXlJRDA5UFNBd0tTQjdYRzRnSUNBZ2MyVm5iV1Z1ZEhNZ0xUMGdNVHRjYmlBZ2ZWeHVYRzRnSUdsbUlDaHpkR0Z5ZEVGdVoyeGxJRHdnTUNrZ2UxeHVJQ0FnSUhOMFlYSjBRVzVuYkdVZ0t6MGdVRWt5TzF4dUlDQjlYRzVjYmlBZ2FXWWdLR1Z1WkVGdVoyeGxJRHdnTUNrZ2UxeHVJQ0FnSUdWdVpFRnVaMnhsSUNzOUlGQkpNanRjYmlBZ2ZWeHVYRzRnSUhaaGNpQmhibWRzWlNBOUlDZ29jM1JoY25SQmJtZHNaU0ErSUdWdVpFRnVaMnhsS1NBL1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBb2MzUmhjblJCYm1kc1pTQXRJR1Z1WkVGdVoyeGxLU0E2WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FvYzNSaGNuUkJibWRzWlNBcklGQkpNaUF0SUdWdVpFRnVaMnhsS1Nrc1hHNGdJQ0FnSUNCelpXZHRaVzUwUVc1bmJHVWdQU0FvS0c5MWRIZGhjbVJ6S1NBL0lDMWhibWRzWlNBNklGQkpNaUF0SUdGdVoyeGxLU0F2SUhObFoyMWxiblJ6TzF4dVhHNGdJSFpsY25ScFkyVnpMbkIxYzJnb2MzUmhjblJXWlhKMFpYZ3BPMXh1SUNCbWIzSWdLSFpoY2lCcElEMGdNVHNnYVNBOElITmxaMjFsYm5Sek95QXJLMmtwSUh0Y2JpQWdJQ0JoYm1kc1pTQTlJSE4wWVhKMFFXNW5iR1VnS3lCelpXZHRaVzUwUVc1bmJHVWdLaUJwTzF4dUlDQWdJSFpsY25ScFkyVnpMbkIxYzJnb1cxeHVJQ0FnSUNBZ1kyVnVkR1Z5V3pCZElDc2dUV0YwYUM1amIzTW9ZVzVuYkdVcElDb2djbUZrYVhWekxGeHVJQ0FnSUNBZ1kyVnVkR1Z5V3pGZElDc2dUV0YwYUM1emFXNG9ZVzVuYkdVcElDb2djbUZrYVhWelhHNGdJQ0FnWFNrN1hHNGdJSDFjYmlBZ2RtVnlkR2xqWlhNdWNIVnphQ2hsYm1SV1pYSjBaWGdwTzF4dUlDQnlaWFIxY200Z2RtVnlkR2xqWlhNN1hHNTlPMXh1WEc1Y2JpOHFLbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNBZ1pHbHpkRnh1SUNvZ1FIQmhjbUZ0SUNCN1UzUnlhVzVuUFgwZ2RXNXBkSE5jYmlBcUlFQnlaWFIxY200Z2UwOW1abk5sZEgxY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzVrYVhOMFlXNWpaU0E5SUdaMWJtTjBhVzl1S0dScGMzUXNJSFZ1YVhSektTQjdYRzRnSUhSb2FYTXVYMlJwYzNSaGJtTmxJRDBnWkdsemRDQjhmQ0F3TzF4dUlDQnlaWFIxY200Z2RHaHBjenRjYm4wN1hHNWNibHh1THlvcVhHNGdLaUJBYzNSaGRHbGpYRzRnS2lCQWNHRnlZVzBnSUh0T2RXMWlaWEo5SUNCa1pXZHlaV1Z6WEc0Z0tpQkFjR0Z5WVcwZ0lIdFRkSEpwYm1jOWZTQjFibWwwYzF4dUlDb2dRSEpsZEhWeWJpQjdUblZ0WW1WeWZWeHVJQ292WEc1UFptWnpaWFF1WkdWbmNtVmxjMVJ2Vlc1cGRITWdQU0JtZFc1amRHbHZiaWhrWldkeVpXVnpMQ0IxYm1sMGN5a2dlMXh1SUNCemQybDBZMmdnS0hWdWFYUnpLU0I3WEc0Z0lDQWdZMkZ6WlNBbmJXbHNaWE1uT2x4dUlDQWdJQ0FnWkdWbmNtVmxjeUE5SUdSbFozSmxaWE1nTHlBMk9TNHdORGM3WEc0Z0lDQWdZbkpsWVdzN1hHNGdJQ0FnWTJGelpTQW5abVZsZENjNlhHNGdJQ0FnSUNCa1pXZHlaV1Z6SUQwZ1pHVm5jbVZsY3lBdklETTJORFUyT0M0d08xeHVJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdZMkZ6WlNBbmEybHNiMjFsZEdWeWN5YzZYRzRnSUNBZ0lDQmtaV2R5WldWeklEMGdaR1ZuY21WbGN5QXZJREV4TVM0eE1qdGNiaUFnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJR05oYzJVZ0oyMWxkR1Z5Y3ljNlhHNGdJQ0FnWTJGelpTQW5iV1YwY21Wekp6cGNiaUFnSUNBZ0lHUmxaM0psWlhNZ1BTQmtaV2R5WldWeklDOGdNVEV4TVRJd0xqQTdYRzRnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0JqWVhObElDZGtaV2R5WldWekp6cGNiaUFnSUNCallYTmxJQ2R3YVhobGJITW5PbHh1SUNBZ0lHUmxabUYxYkhRNlhHNGdJQ0FnSUNCaWNtVmhhenRjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdaR1ZuY21WbGN6dGNibjA3WEc1Y2JseHVMeW9xWEc0Z0tpQkFjR0Z5WVcwZ0lIdEJjbkpoZVM0OFQySnFaV04wUG4wZ2RtVnlkR2xqWlhOY2JpQXFJRUJ5WlhSMWNtNGdlMEZ5Y21GNUxqeFBZbXBsWTNRK2ZWeHVJQ292WEc1UFptWnpaWFF1Y0hKdmRHOTBlWEJsTG1WdWMzVnlaVXhoYzNSUWIybHVkQ0E5SUdaMWJtTjBhVzl1S0habGNuUnBZMlZ6S1NCN1hHNGdJR2xtSUNoMGFHbHpMbDlqYkc5elpXUXBJSHRjYmlBZ0lDQjJaWEowYVdObGN5NXdkWE5vS0Z0Y2JpQWdJQ0FnSUhabGNuUnBZMlZ6V3pCZFd6QmRMRnh1SUNBZ0lDQWdkbVZ5ZEdsalpYTmJNRjFiTVYxY2JpQWdJQ0JkS1R0Y2JpQWdmVnh1SUNCeVpYUjFjbTRnZG1WeWRHbGpaWE03WEc1OU8xeHVYRzVjYmk4cUtseHVJQ29nUkdWamFXUmxjeUJpZVNCMGFHVWdjMmxuYmlCcFppQnBkQ2R6SUdFZ2NHRmtaR2x1WnlCdmNpQmhJRzFoY21kcGJseHVJQ3BjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ1pHbHpkRnh1SUNvZ1FISmxkSFZ5YmlCN1FYSnlZWGt1UEU5aWFtVmpkRDU5WEc0Z0tpOWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXViMlptYzJWMElEMGdablZ1WTNScGIyNG9aR2x6ZENrZ2UxeHVJQ0IwYUdsekxtUnBjM1JoYm1ObEtHUnBjM1FwTzF4dUlDQnlaWFIxY200Z2RHaHBjeTVmWkdsemRHRnVZMlVnUFQwOUlEQWdQeUIwYUdsekxuWmxjblJwWTJWeklEcGNiaUFnSUNBZ0lDaDBhR2x6TGw5a2FYTjBZVzVqWlNBK0lEQWdQeUIwYUdsekxtMWhjbWRwYmloMGFHbHpMbDlrYVhOMFlXNWpaU2tnT2x4dUlDQWdJQ0FnSUNCMGFHbHpMbkJoWkdScGJtY29MWFJvYVhNdVgyUnBjM1JoYm1ObEtTazdYRzU5TzF4dVhHNWNiaThxS2x4dUlDb2dRSEJoY21GdElDQjdRWEp5WVhrdVBFRnljbUY1TGp4T2RXMWlaWEkrUG4wZ2RtVnlkR2xqWlhOY2JpQXFJRUJ3WVhKaGJTQWdlMEZ5Y21GNUxqeE9kVzFpWlhJK2ZTQWdJQ0FnSUNBZ0lIQjBNVnh1SUNvZ1FIQmhjbUZ0SUNCN1FYSnlZWGt1UEU1MWJXSmxjajU5SUNBZ0lDQWdJQ0FnY0hReVhHNGdLaUJBY0dGeVlXMGdJSHRPZFcxaVpYSjlJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmthWE4wWEc0Z0tpQkFjbVYwZFhKdUlIdEJjbkpoZVM0OFFYSnlZWGt1UEU1MWJXSmxjajQrZlZ4dUlDb3ZYRzVQWm1aelpYUXVjSEp2ZEc5MGVYQmxMbDl2Wm1aelpYUlRaV2R0Wlc1MElEMGdablZ1WTNScGIyNG9kbVZ5ZEdsalpYTXNJSEIwTVN3Z2NIUXlMQ0JrYVhOMEtTQjdYRzRnSUhaaGNpQmxaR2RsY3lBOUlGdHVaWGNnUldSblpTaHdkREVzSUhCME1pa3NJRzVsZHlCRlpHZGxLSEIwTWl3Z2NIUXhLVjA3WEc0Z0lIWmhjaUJwTENCc1pXNGdQU0F5TzF4dVhHNGdJSFpoY2lCdlptWnpaWFJ6SUQwZ1cxMDdYRzVjYmlBZ1ptOXlJQ2hwSUQwZ01Ec2dhU0E4SUd4bGJqc2dhU3NyS1NCN1hHNGdJQ0FnZG1GeUlHVmtaMlVnUFNCbFpHZGxjMXRwWFR0Y2JpQWdJQ0IyWVhJZ1pIZ2dQU0JsWkdkbExsOXBiazV2Y20xaGJGc3dYU0FxSUdScGMzUTdYRzRnSUNBZ2RtRnlJR1I1SUQwZ1pXUm5aUzVmYVc1T2IzSnRZV3hiTVYwZ0tpQmthWE4wTzF4dVhHNGdJQ0FnYjJabWMyVjBjeTV3ZFhOb0tHVmtaMlV1YjJabWMyVjBLR1I0TENCa2VTa3BPMXh1SUNCOVhHNWNiaUFnWm05eUlDaHBJRDBnTURzZ2FTQThJR3hsYmpzZ2FTc3JLU0I3WEc0Z0lDQWdkbUZ5SUhSb2FYTkZaR2RsSUQwZ2IyWm1jMlYwYzF0cFhTeGNiaUFnSUNBZ0lDQWdjSEpsZGtWa1oyVWdQU0J2Wm1aelpYUnpXeWhwSUNzZ2JHVnVJQzBnTVNrZ0pTQnNaVzVkTzF4dUlDQWdJSFJvYVhNdVkzSmxZWFJsUVhKaktGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmxjblJwWTJWekxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVmtaMlZ6VzJsZExtTjFjbkpsYm5Rc0lDOHZJSEF4SUc5eUlIQXlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdaR2x6ZEN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2NtVjJSV1JuWlM1dVpYaDBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJvYVhORlpHZGxMbU4xY25KbGJuUXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZllYSmpVMlZuYldWdWRITXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkSEoxWlZ4dUlDQWdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdkbVZ5ZEdsalpYTTdYRzU5TzF4dVhHNWNiaThxS2x4dUlDb2dRSEJoY21GdElDQjdUblZ0WW1WeWZTQmthWE4wWEc0Z0tpQkFjbVYwZFhKdUlIdEJjbkpoZVM0OFRuVnRZbVZ5UG4xY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzV0WVhKbmFXNGdQU0JtZFc1amRHbHZiaWhrYVhOMEtTQjdYRzRnSUhSb2FYTXVaR2x6ZEdGdVkyVW9aR2x6ZENrN1hHNWNiaUFnYVdZZ0tHUnBjM1FnUFQwOUlEQXBJSEpsZEhWeWJpQjBhR2x6TG1WdWMzVnlaVXhoYzNSUWIybHVkQ2gwYUdsekxuWmxjblJwWTJWektUdGNiaUFnYVdZZ0tIUm9hWE11ZG1WeWRHbGpaWE11YkdWdVozUm9JRDA5UFNBeEtTQnlaWFIxY200Z2RHaHBjeTV2Wm1aelpYUlFiMmx1ZENoMGFHbHpMbDlrYVhOMFlXNWpaU2s3WEc1Y2JpQWdkR2hwY3k1bGJuTjFjbVZNWVhOMFVHOXBiblFvZEdocGN5NTJaWEowYVdObGN5azdYRzRnSUhaaGNpQjFibWx2YmlBOUlIUm9hWE11YjJabWMyVjBUR2x1WlNoMGFHbHpMbDlrYVhOMFlXNWpaU2s3WEc0Z0lIVnVhVzl1SUQwZ2JXRnlkR2x1WlhvdWRXNXBiMjRvZFc1cGIyNHNJRnQwYUdsekxtVnVjM1Z5WlV4aGMzUlFiMmx1ZENoMGFHbHpMblpsY25ScFkyVnpLVjBwTzF4dUlDQnlaWFIxY200Z2RXNXBiMjQ3WEc1OU8xeHVYRzVjYmk4cUtseHVJQ29nUUhCaGNtRnRJQ0I3VG5WdFltVnlmU0JrYVhOMFhHNGdLaUJBY21WMGRYSnVJSHRCY25KaGVTNDhUblZ0WW1WeVBuMWNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1d1lXUmthVzVuSUQwZ1puVnVZM1JwYjI0b1pHbHpkQ2tnZTF4dUlDQjBhR2x6TG1ScGMzUmhibU5sS0dScGMzUXBPMXh1WEc0Z0lHbG1JQ2gwYUdsekxsOWthWE4wWVc1alpTQTlQVDBnTUNrZ2NtVjBkWEp1SUhSb2FYTXVaVzV6ZFhKbFRHRnpkRkJ2YVc1MEtIUm9hWE11ZG1WeWRHbGpaWE1wTzF4dUlDQnBaaUFvZEdocGN5NTJaWEowYVdObGN5NXNaVzVuZEdnZ1BUMDlJREVwSUhKbGRIVnliaUIwYUdsekxuWmxjblJwWTJWek8xeHVYRzRnSUhSb2FYTXVaVzV6ZFhKbFRHRnpkRkJ2YVc1MEtIUm9hWE11ZG1WeWRHbGpaWE1wTzF4dUlDQjJZWElnZFc1cGIyNGdQU0IwYUdsekxtOW1abk5sZEV4cGJtVW9kR2hwY3k1ZlpHbHpkR0Z1WTJVcE8xeHVJQ0IyWVhJZ1pHbG1aaUE5SUcxaGNuUnBibVY2TG1ScFptWW9kR2hwY3k1MlpYSjBhV05sY3l3Z2RXNXBiMjRwTzF4dUlDQnlaWFIxY200Z1pHbG1aanRjYm4wN1hHNWNibHh1THlvcVhHNGdLaUJEY21WaGRHVnpJRzFoY21kcGJpQndiMng1WjI5dVhHNGdLaUJBY0dGeVlXMGdJSHRPZFcxaVpYSjlJR1JwYzNSY2JpQXFJRUJ5WlhSMWNtNGdlMEZ5Y21GNUxqeFBZbXBsWTNRK2ZWeHVJQ292WEc1UFptWnpaWFF1Y0hKdmRHOTBlWEJsTG05bVpuTmxkRXhwYm1VZ1BTQm1kVzVqZEdsdmJpaGthWE4wS1NCN1hHNGdJSFJvYVhNdVpHbHpkR0Z1WTJVb1pHbHpkQ2s3WEc0Z0lHbG1JQ2gwYUdsekxsOWthWE4wWVc1alpTQTlQVDBnTUNrZ2NtVjBkWEp1SUhSb2FYTXVkbVZ5ZEdsalpYTTdYRzVjYmlBZ2RtRnlJSFpsY25ScFkyVnpJRDBnVzEwN1hHNGdJSFpoY2lCMWJtbHZiaUFnSUNBOUlGdGRPMXh1SUNCMGFHbHpMbDlqYkc5elpXUWdQU0IwY25WbE8xeHVYRzRnSUdadmNpQW9kbUZ5SUdrZ1BTQXdMQ0JzWlc0Z1BTQjBhR2x6TG5abGNuUnBZMlZ6TG14bGJtZDBhQ0F0SURFN0lHa2dQQ0JzWlc0N0lHa3JLeWtnZTF4dUlDQWdJSFpoY2lCelpXZHRaVzUwSUQwZ2RHaHBjeTVsYm5OMWNtVk1ZWE4wVUc5cGJuUW9YRzRnSUNBZ0lDQWdJSFJvYVhNdVgyOW1abk5sZEZObFoyMWxiblFvVzEwc0lIUm9hWE11ZG1WeWRHbGpaWE5iYVYwc0lIUm9hWE11ZG1WeWRHbGpaWE5iYVNBcklERmRMQ0IwYUdsekxsOWthWE4wWVc1alpTbGNiaUFnSUNBcE8xeHVJQ0FnSUhabGNuUnBZMlZ6TG5CMWMyZ29jMlZuYldWdWRDazdYRzRnSUNBZ2RXNXBiMjRnUFNBb2FTQTlQVDBnTUNrZ1B5QnpaV2R0Wlc1MElEb2diV0Z5ZEdsdVpYb3VkVzVwYjI0b2RXNXBiMjRzSUhObFoyMWxiblFwTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUhSb2FYTXVkbVZ5ZEdsalpYTXViR1Z1WjNSb0lENGdNaUEvSUhWdWFXOXVJRG9nVzNWdWFXOXVYVHRjYm4wN1hHNWNibHh1THlvcVhHNGdLaUJBY0dGeVlXMGdJSHRPZFcxaVpYSjlJR1JwYzNSaGJtTmxYRzRnS2lCQWNtVjBkWEp1SUh0QmNuSmhlUzQ4UVhKeVlYa3VQRTUxYldKbGNqNTlYRzRnS2k5Y2JrOW1abk5sZEM1d2NtOTBiM1I1Y0dVdWIyWm1jMlYwVUc5cGJuUWdQU0JtZFc1amRHbHZiaWhrYVhOMFlXNWpaU2tnZTF4dUlDQjBhR2x6TG1ScGMzUmhibU5sS0dScGMzUmhibU5sS1R0Y2JpQWdkbUZ5SUhabGNuUnBZMlZ6SUQwZ2RHaHBjeTVmWVhKalUyVm5iV1Z1ZEhNZ0tpQXlPMXh1SUNCMllYSWdjRzlwYm5SeklDQWdQU0JiWFR0Y2JpQWdkbUZ5SUdObGJuUmxjaUFnSUQwZ2RHaHBjeTUyWlhKMGFXTmxjMXN3WFR0Y2JpQWdkbUZ5SUhKaFpHbDFjeUFnSUQwZ2RHaHBjeTVmWkdsemRHRnVZMlU3WEc0Z0lIWmhjaUJoYm1kc1pTQWdJQ0E5SURBN1hHNWNiaUFnWm05eUlDaDJZWElnYVNBOUlEQTdJR2tnUENCMlpYSjBhV05sY3lBdElERTdJR2tyS3lrZ2UxeHVJQ0FnSUdGdVoyeGxJQ3M5SUNneUlDb2dUV0YwYUM1UVNTQXZJSFpsY25ScFkyVnpLVHNnTHk4Z1kyOTFiblJsY2kxamJHOWphM2RwYzJWY2JpQWdJQ0J3YjJsdWRITXVjSFZ6YUNoYlhHNGdJQ0FnSUNCalpXNTBaWEpiTUYwZ0t5QW9jbUZrYVhWeklDb2dUV0YwYUM1amIzTW9ZVzVuYkdVcEtTeGNiaUFnSUNBZ0lHTmxiblJsY2xzeFhTQXJJQ2h5WVdScGRYTWdLaUJOWVhSb0xuTnBiaWhoYm1kc1pTa3BYRzRnSUNBZ1hTazdYRzRnSUgxY2JseHVJQ0J5WlhSMWNtNGdjRzlwYm5Sek8xeHVmVHRjYmx4dWJXOWtkV3hsTG1WNGNHOXlkSE1nUFNCUFptWnpaWFE3WEc0aVhYMD0iLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gIFwiZmVhdHVyZXNcIjogW1xuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJQb2x5Z29uXCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NDY2MzI5NTc0NTg2LFxuICAgICAgICAgICAgICAyMi4yNjc4OTAzMTU5MDU1MDdcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODg0MDc2NTk1MzA2NSxcbiAgICAgICAgICAgICAgMjIuMjY5MjYwNDcwMjYxNzhcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODY1MTkzODQzODQxNyxcbiAgICAgICAgICAgICAgMjIuMjY3Mjg0NjYzNjg5MzI0XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg3NjI0NDU0NDk4MyxcbiAgICAgICAgICAgICAgMjIuMjY1NDM3OTA0NjgzNFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NDk5NTg4OTY2MzcxLFxuICAgICAgICAgICAgICAyMi4yNjYyNzE5Mjc4OTc1OTVcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODQ2NjMyOTU3NDU4NixcbiAgICAgICAgICAgICAgMjIuMjY3ODkwMzE1OTA1NTA3XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg5MjU1MjM3NTc5MzUsXG4gICAgICAgICAgICAyMi4yNjc1OTI0NTQ0ODc0NTZcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xOTIwNDQ3MzQ5NTQ4MyxcbiAgICAgICAgICAgIDIyLjI2OTI4MDMyNzQ3MjY2XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTkxMjE4NjE0NTc4MjYsXG4gICAgICAgICAgICAyMi4yNjQ4ODE4ODY0NDU3OFxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE5MzU3ODk1ODUxMTM3LFxuICAgICAgICAgICAgMjIuMjY2OTI3MjI4MzY0NDc3XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg5MzUxNzk3MTAzOSxcbiAgICAgICAgICAgIDIyLjI2NjUzMDA3NjkzMjY5XG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiUG9pbnRcIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbMTE0LjE4OTQ5MTI3MTk3MjY3LCAyMi4yNzE4MDIxNzAzNDY4ODRdXG4gICAgICB9XG4gICAgfVxuICBdXG59XG4iXX0=
