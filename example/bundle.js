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
          coordinates: new Offset(shape.geometry.coordinates).offset(margin)
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4YW1wbGUvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE9mZnNldCA9IHJlcXVpcmUoJy4uL3NyYy9vZmZzZXQnKTtcbnJlcXVpcmUoJy4vbGVhZmxldF9tdWx0aXBvbHlnb24nKTtcbnJlcXVpcmUoJy4vcG9seWdvbl9jb250cm9sJyk7XG52YXIgT2Zmc2V0Q29udHJvbCA9IHJlcXVpcmUoJy4vb2Zmc2V0X2NvbnRyb2wnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9kZW1vLmpzb24nKTtcbnZhciBwcm9qZWN0ID0gcmVxdWlyZSgnZ2VvanNvbi1wcm9qZWN0Jyk7XG5cbnZhciBhcmNTZWdtZW50cyA9IDUwO1xuXG52YXIgc3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgY29sb3I6ICcjNDhmJyxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICBkYXNoQXJyYXk6IFsyLCA0XVxuICAgIH0sXG4gICAgbWFyZ2luU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjMjc2RDhGJ1xuICAgIH0sXG4gICAgcGFkZGluZ1N0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnI0Q4MTcwNidcbiAgICB9LFxuICAgIGNlbnRlciA9IFsyMi4yNjcwLCAxMTQuMTg4XSxcbiAgICB6b29tID0gMTcsXG4gICAgbWFwLCB2ZXJ0aWNlcywgcmVzdWx0O1xuXG5tYXAgPSBnbG9iYWwubWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgem9vbSk7XG5cblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld1BvaW50Q29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0TWFya2VyXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKGRhdGEpLmFkZFRvKG1hcCk7XG52YXIgcmVzdWx0cyA9IGdsb2JhbC5yZXN1bHRzID0gTC5nZW9Kc29uKG51bGwsIHtcbiAgc3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFyZ2luU3R5bGU7XG4gIH1cbn0pLmFkZFRvKG1hcCk7XG5tYXAuZml0Qm91bmRzKGxheWVycy5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBydW4gKG1hcmdpbikge1xuICByZXN1bHRzLmNsZWFyTGF5ZXJzKCk7XG4gIGxheWVycy5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgZ2ogPSBsYXllci50b0dlb0pTT04oKTtcbiAgICBjb25zb2xlLmxvZyhnaiwgbWFyZ2luKTtcbiAgICBpZiAobWFyZ2luID09PSAwKSByZXR1cm47XG4gICAgdmFyIHNoYXBlID0gcHJvamVjdChnaiwgZnVuY3Rpb24oY29vcmQpIHtcbiAgICAgIHZhciBwdCA9IG1hcC5vcHRpb25zLmNycy5sYXRMbmdUb1BvaW50KEwubGF0TG5nKGNvb3JkLnNsaWNlKCkucmV2ZXJzZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW3B0LngsIHB0LnldO1xuICAgIH0pO1xuXG4gICAgdmFyIG1hcmdpbmVkO1xuICAgIGlmIChnai5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpLm9mZnNldExpbmUobWFyZ2luKTtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpLm9mZnNldChtYXJnaW4pO1xuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtyZXNdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKS5vZmZzZXQobWFyZ2luKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdtYXJnaW5lZCcsIG1hcmdpbmVkKTtcbiAgICByZXN1bHRzLmFkZERhdGEocHJvamVjdChtYXJnaW5lZCwgZnVuY3Rpb24ocHQpIHtcbiAgICAgIHZhciBsbCA9IG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocHQuc2xpY2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtsbC5sbmcsIGxsLmxhdF07XG4gICAgfSkpO1xuICB9KTtcbn1cblxucnVuICgyMCk7XG4iXX0=
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

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vZmZzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBFZGdlID0gcmVxdWlyZSgnLi9lZGdlJyk7XG52YXIgbWFydGluZXogPSBnbG9iYWwubWFydGluZXogPSByZXF1aXJlKCdtYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nJyk7XG5cbnZhciBhdGFuMiA9IE1hdGguYXRhbjI7XG5cbnZhciBpc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cbi8qKlxuICogT2Zmc2V0IGJ1aWxkZXJcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxPYmplY3Q+PX0gdmVydGljZXNcbiAqIEBwYXJhbSB7TnVtYmVyPX0gICAgICAgIGFyY1NlZ21lbnRzXG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gT2Zmc2V0KHZlcnRpY2VzLCBhcmNTZWdtZW50cykge1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPE9iamVjdD59XG4gICAqL1xuICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcblxuICAvKipcbiAgICogQHR5cGUge0FycmF5LjxFZGdlPn1cbiAgICovXG4gIHRoaXMuZWRnZXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuX2Nsb3NlZCA9IGZhbHNlO1xuXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9kaXN0YW5jZSA9IDA7XG5cbiAgaWYgKHZlcnRpY2VzKSB7XG4gICAgICB0aGlzLmRhdGEodmVydGljZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZ21lbnRzIGluIGVkZ2UgYm91bmRpbmcgYXJjaGVzXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBhcmNTZWdtZW50cyA6IDU7XG59XG5cbi8qKlxuICogQ2hhbmdlIGRhdGEgc2V0XG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXk+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuXG4gIHZlcnRpY2VzID0gdGhpcy52YWxpZGF0ZSh2ZXJ0aWNlcyk7XG5cbiAgaWYgKHZlcnRpY2VzLmxlbmd0aCA+IDEpIHtcbiAgICB2YXIgZWRnZXMgPSBbXTtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmVydGljZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGVkZ2VzLnB1c2gobmV3IEVkZ2UodmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSkgJSBsZW5dKSk7XG4gICAgfVxuICAgIHRoaXMuZWRnZXMgPSBlZGdlcztcbiAgfVxuICB0aGlzLnZlcnRpY2VzID0gdmVydGljZXM7XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbk9mZnNldC5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIHRoaXMuX2VkZ2VzID0gW107XG4gIGlmICghaXNBcnJheSAodmVydGljZXMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdPZmZzZXQgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIGNvb2RpbmF0ZSB0byB3b3JrIHdpdGgnKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KHZlcnRpY2VzKSAmJiB0eXBlb2YgdmVydGljZXNbMF0gPT09ICdudW1iZXInKSB7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudmVydGljZXMgPSB2ZXJ0aWNlcztcbiAgICB0aGlzLl9wcm9jZXNzQ29udG91cih2ZXJ0aWNlcywgdGhpcy5fZWRnZXMpO1xuICB9XG59O1xuXG5cbk9mZnNldC5wcm90b3R5cGUuX3Byb2Nlc3NDb250b3VyID0gZnVuY3Rpb24oY29udG91ciwgZWRnZXMpIHtcbiAgdmFyIGksIGxlbjtcbiAgLy8gY29uc29sZS5sb2coY29udG91ciwgZWRnZXMsIGlzQXJyYXkoY29udG91clswXSksIGNvbnRvdXJbMF1bMF0pO1xuICBpZiAoaXNBcnJheShjb250b3VyWzBdKSAmJiB0eXBlb2YgY29udG91clswXVswXSA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjb250b3VyLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBlZGdlcy5wdXNoKG5ldyBFZGdlKGNvbnRvdXJbaV0sIGNvbnRvdXJbKGkgKyAxKSAlIGxlbl0pKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdmFyIHByb2Nlc3NlZCA9IFtdO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvbnRvdXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMuX3Byb2Nlc3NDb250b3VyKGNvbnRvdXJbaV0sIHByb2Nlc3NlZCk7XG4gICAgfVxuICAgIGVkZ2VzLnB1c2gocHJvY2Vzc2VkKTtcbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gYXJjU2VnbWVudHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5hcmNTZWdtZW50cyA9IGZ1bmN0aW9uKGFyY1NlZ21lbnRzKSB7XG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFZhbGlkYXRlcyBpZiB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnRzIHJlcGVhdFxuICogVE9ETzogY2hlY2sgQ0NXXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IHZlcnRpY2VzXG4gKi9cbk9mZnNldC5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2YXIgbGVuID0gdmVydGljZXMubGVuZ3RoO1xuICBpZiAodHlwZW9mIHZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykgcmV0dXJuIFt2ZXJ0aWNlc107XG4gIGlmICh2ZXJ0aWNlc1swXVswXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMF0gJiZcbiAgICB2ZXJ0aWNlc1swXVsxXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMV0pIHtcbiAgICBpZiAobGVuID4gMSkge1xuICAgICAgdmVydGljZXMgPSB2ZXJ0aWNlcy5zbGljZSgwLCBsZW4gLSAxKTtcbiAgICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIGFyY2ggYmV0d2VlbiB0d28gZWRnZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICByYWRpdXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBzdGFydFZlcnRleFxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGVuZFZlcnRleFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHNlZ21lbnRzXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgb3V0d2FyZHNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5jcmVhdGVBcmMgPSBmdW5jdGlvbih2ZXJ0aWNlcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0VmVydGV4LFxuICAgIGVuZFZlcnRleCwgc2VnbWVudHMsIG91dHdhcmRzKSB7XG5cbiAgdmFyIFBJMiA9IE1hdGguUEkgKiAyLFxuICAgICAgc3RhcnRBbmdsZSA9IGF0YW4yKHN0YXJ0VmVydGV4WzFdIC0gY2VudGVyWzFdLCBzdGFydFZlcnRleFswXSAtIGNlbnRlclswXSksXG4gICAgICBlbmRBbmdsZSA9IGF0YW4yKGVuZFZlcnRleFsxXSAtIGNlbnRlclsxXSwgZW5kVmVydGV4WzBdIC0gY2VudGVyWzBdKTtcblxuICAvLyBvZGQgbnVtYmVyIHBsZWFzZVxuICBpZiAoc2VnbWVudHMgJSAyID09PSAwKSB7XG4gICAgc2VnbWVudHMgLT0gMTtcbiAgfVxuXG4gIGlmIChzdGFydEFuZ2xlIDwgMCkge1xuICAgIHN0YXJ0QW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgaWYgKGVuZEFuZ2xlIDwgMCkge1xuICAgIGVuZEFuZ2xlICs9IFBJMjtcbiAgfVxuXG4gIHZhciBhbmdsZSA9ICgoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSA/XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSA6XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSArIFBJMiAtIGVuZEFuZ2xlKSksXG4gICAgICBzZWdtZW50QW5nbGUgPSAoKG91dHdhcmRzKSA/IC1hbmdsZSA6IFBJMiAtIGFuZ2xlKSAvIHNlZ21lbnRzO1xuXG4gIHZlcnRpY2VzLnB1c2goc3RhcnRWZXJ0ZXgpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNlZ21lbnRzOyArK2kpIHtcbiAgICBhbmdsZSA9IHN0YXJ0QW5nbGUgKyBzZWdtZW50QW5nbGUgKiBpO1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLFxuICAgICAgY2VudGVyWzFdICsgTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzXG4gICAgXSk7XG4gIH1cbiAgdmVydGljZXMucHVzaChlbmRWZXJ0ZXgpO1xuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSAgZGlzdFxuICogQHBhcmFtICB7U3RyaW5nPX0gdW5pdHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uKGRpc3QsIHVuaXRzKSB7XG4gIHRoaXMuX2Rpc3RhbmNlID0gZGlzdCB8fCAwO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICBkZWdyZWVzXG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB1bml0c1xuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5PZmZzZXQuZGVncmVlc1RvVW5pdHMgPSBmdW5jdGlvbihkZWdyZWVzLCB1bml0cykge1xuICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgY2FzZSAnbWlsZXMnOlxuICAgICAgZGVncmVlcyA9IGRlZ3JlZXMgLyA2OS4wNDc7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnZmVldCc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDM2NDU2OC4wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAna2lsb21ldGVycyc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDExMS4xMjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21ldGVycyc6XG4gICAgY2FzZSAnbWV0cmVzJzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMTExMTIwLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdkZWdyZWVzJzpcbiAgICBjYXNlICdwaXhlbHMnOlxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZGVncmVlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmVuc3VyZUxhc3RQb2ludCA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIGlmICh0aGlzLl9jbG9zZWQpIHtcbiAgICB2ZXJ0aWNlcy5wdXNoKFtcbiAgICAgIHZlcnRpY2VzWzBdWzBdLFxuICAgICAgdmVydGljZXNbMF1bMV1cbiAgICBdKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogRGVjaWRlcyBieSB0aGUgc2lnbiBpZiBpdCdzIGEgcGFkZGluZyBvciBhIG1hcmdpblxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuICByZXR1cm4gdGhpcy5fZGlzdGFuY2UgPT09IDAgPyB0aGlzLnZlcnRpY2VzIDpcbiAgICAgICh0aGlzLl9kaXN0YW5jZSA+IDAgPyB0aGlzLm1hcmdpbih0aGlzLl9kaXN0YW5jZSkgOlxuICAgICAgICB0aGlzLnBhZGRpbmcoLXRoaXMuX2Rpc3RhbmNlKSk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgICAgICAgIHB0MVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICAgICAgICAgcHQyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLl9vZmZzZXRTZWdtZW50ID0gZnVuY3Rpb24odmVydGljZXMsIHB0MSwgcHQyLCBkaXN0KSB7XG4gIHZhciBlZGdlcyA9IFtuZXcgRWRnZShwdDEsIHB0MiksIG5ldyBFZGdlKHB0MiwgcHQxKV07XG4gIHZhciBpLCBsZW4gPSAyO1xuXG4gIHZhciBvZmZzZXRzID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcbiAgICB2YXIgZHggPSBlZGdlLl9pbk5vcm1hbFswXSAqIGRpc3Q7XG4gICAgdmFyIGR5ID0gZWRnZS5faW5Ob3JtYWxbMV0gKiBkaXN0O1xuXG4gICAgb2Zmc2V0cy5wdXNoKGVkZ2Uub2Zmc2V0KGR4LCBkeSkpO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIHRoaXNFZGdlID0gb2Zmc2V0c1tpXSxcbiAgICAgICAgcHJldkVkZ2UgPSBvZmZzZXRzWyhpICsgbGVuIC0gMSkgJSBsZW5dO1xuICAgIHRoaXMuY3JlYXRlQXJjKFxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLFxuICAgICAgICAgICAgICAgIGVkZ2VzW2ldLmN1cnJlbnQsIC8vIHAxIG9yIHAyXG4gICAgICAgICAgICAgICAgZGlzdCxcbiAgICAgICAgICAgICAgICBwcmV2RWRnZS5uZXh0LFxuICAgICAgICAgICAgICAgIHRoaXNFZGdlLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5fYXJjU2VnbWVudHMsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbk9mZnNldC5wcm90b3R5cGUuX29mZnNldFNlZ21lbnQgPSBmdW5jdGlvbih2MSwgdjIsIGUxLCBlMiwgZGlzdCkge1xuICB2YXIgdmVydGljZXMgPSBbXTtcbiAgdmFyIGVkZ2VzICAgID0gW2UxLCBlMl07XG5cbiAgdmFyIG9mZnNldHMgPSBbXG4gICAgZTEub2Zmc2V0KGUxLl9pbk5vcm1hbFswXSAqIGRpc3QsIGUxLl9pbk5vcm1hbFsxXSAqIGRpc3QpLFxuICAgIGUyLm9mZnNldChlMi5faW5Ob3JtYWxbMF0gKiBkaXN0LCBlMi5faW5Ob3JtYWxbMV0gKiBkaXN0KVxuICBdO1xuXG4gIGNvbnNvbGUubG9nKG9mZnNldHMpO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSAyOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgdGhpc0VkZ2UgPSBvZmZzZXRzW2ldLFxuICAgICAgICBwcmV2RWRnZSA9IG9mZnNldHNbKGkgKyBsZW4gLSAxKSAlIGxlbl07XG4gICAgdGhpcy5jcmVhdGVBcmMoXG4gICAgICAgICAgICAgIHZlcnRpY2VzLFxuICAgICAgICAgICAgICBlZGdlc1tpXS5jdXJyZW50LCAvLyBwMSBvciBwMlxuICAgICAgICAgICAgICBkaXN0LFxuICAgICAgICAgICAgICBwcmV2RWRnZS5uZXh0LFxuICAgICAgICAgICAgICB0aGlzRWRnZS5jdXJyZW50LFxuICAgICAgICAgICAgICB0aGlzLl9hcmNTZWdtZW50cyxcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgfVxuXG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxOdW1iZXI+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm1hcmdpbiA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgdGhpcy5kaXN0YW5jZShkaXN0KTtcblxuICBpZiAoZGlzdCA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICBpZiAodGhpcy52ZXJ0aWNlcy5sZW5ndGggPT09IDEgJiZcbiAgICAgIHR5cGVvZiB0aGlzLnZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykgeyAvLyBwb2ludFxuICAgIHJldHVybiB0aGlzLm9mZnNldFBvaW50KHRoaXMuX2Rpc3RhbmNlKTtcbiAgfVxuXG4gIC8vdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG4gIHJldHVybiB0aGlzLm9mZnNldExpbmVzKHRoaXMuX2Rpc3RhbmNlKTtcbiAgdmFyIHVuaW9uID0gdGhpcy5vZmZzZXRMaW5lcyh0aGlzLl9kaXN0YW5jZSk7XG4gIHVuaW9uID0gbWFydGluZXoudW5pb24odW5pb24sIFt0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKV0pO1xuICByZXR1cm4gdW5pb247XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5wYWRkaW5nID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuXG4gIGlmICh0aGlzLl9kaXN0YW5jZSA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICBpZiAodGhpcy52ZXJ0aWNlcy5sZW5ndGggPT09IDEpIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuXG4gIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmVzKHRoaXMuX2Rpc3RhbmNlKTtcbiAgdmFyIGRpZmYgPSBtYXJ0aW5lei5kaWZmKHRoaXMudmVydGljZXMsIHVuaW9uKTtcbiAgcmV0dXJuIGRpZmY7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyBtYXJnaW4gcG9seWdvblxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXRMaW5lID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuICBpZiAodGhpcy5fZGlzdGFuY2UgPT09IDApIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuXG4gIHZhciB2ZXJ0aWNlcyA9IFtdO1xuICB2YXIgdW5pb24gICAgPSBbXTtcbiAgdGhpcy5fY2xvc2VkID0gdHJ1ZTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgc2VnbWVudCA9IHRoaXMuZW5zdXJlTGFzdFBvaW50KFxuICAgICAgICB0aGlzLl9vZmZzZXRTZWdtZW50KFtdLCB0aGlzLnZlcnRpY2VzW2ldLCB0aGlzLnZlcnRpY2VzW2kgKyAxXSwgdGhpcy5fZGlzdGFuY2UpXG4gICAgKTtcbiAgICB2ZXJ0aWNlcy5wdXNoKHNlZ21lbnQpO1xuICAgIHVuaW9uID0gKGkgPT09IDApID8gc2VnbWVudCA6IG1hcnRpbmV6LnVuaW9uKHVuaW9uLCBzZWdtZW50KTtcbiAgfVxuXG4gIHJldHVybiB0aGlzLnZlcnRpY2VzLmxlbmd0aCA+IDIgPyB1bmlvbiA6IFt1bmlvbl07XG59O1xuXG5cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0TGluZXMgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG4gIHZhciB1bmlvbiA9IFtdO1xuICBpZiAoaXNBcnJheSh0aGlzLnZlcnRpY2VzWzBdKSkge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9lZGdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdW5pb24gPSAoaSA9PT0gMCkgP1xuICAgICAgICB0aGlzLm9mZnNldENvbnRvdXIodGhpcy52ZXJ0aWNlc1tpXSwgdGhpcy5fZWRnZXNbaV0pOlxuICAgICAgICBtYXJ0aW5lei51bmlvbih1bmlvbiwgdGhpcy5vZmZzZXRDb250b3VyKHRoaXMudmVydGljZXNbaV0sIHRoaXMuX2VkZ2VzW2ldKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHVuaW9uID0gdGhpcy5vZmZzZXRDb250b3VyKHRoaXMuZGF0YSwgdGhpcy5lZGdlcyk7XG4gIH1cbiAgcmV0dXJuIHVuaW9uO1xufTtcblxuXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldENvbnRvdXIgPSBmdW5jdGlvbihjdXJ2ZSwgZWRnZXMpIHtcbiAgY29uc29sZS5sb2coJ29mZnNldCBjb250b3VyJywgY3VydmUpO1xuICB2YXIgdW5pb247XG4gIGlmIChpc0FycmF5KGN1cnZlWzBdKSAmJiB0eXBlb2YgY3VydmVbMF1bMF0gPT09ICdudW1iZXInKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGN1cnZlLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIHNlZ21lbnQgPSB0aGlzLmVuc3VyZUxhc3RQb2ludChcbiAgICAgICAgdGhpcy5fb2Zmc2V0U2VnbWVudChjdXJ2ZVtpXSwgY3VydmVbaSArIDFdLCBlZGdlc1tpXSwgZWRnZXNbaSArIDFdLCB0aGlzLl9kaXN0YW5jZSlcbiAgICAgICk7XG4gICAgICBjb25zb2xlLmxvZygnc2VnbWVudCcsIHNlZ21lbnQsIHVuaW9uKTtcbiAgICAgIHVuaW9uID0gKGkgPT09IDApID8gc2VnbWVudCA6IG1hcnRpbmV6LnVuaW9uKHVuaW9uLCBzZWdtZW50KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGN1cnZlLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB1bmlvbiA9IChpID09PSAwKSA/XG4gICAgICAgIHRoaXMub2Zmc2V0Q29udG91cihjdXJ2ZVtpXSwgZWRnZXNbaV0pIDpcbiAgICAgICAgbWFydGluZXoudW5pb24odW5pb24sIHRoaXMub2Zmc2V0Q29udG91cihjdXJ2ZVtpXSwgZWRnZXNbaV0pKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHVuaW9uO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdGFuY2VcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXRQb2ludCA9IGZ1bmN0aW9uKGRpc3RhbmNlKSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdGFuY2UpO1xuICB2YXIgdmVydGljZXMgPSB0aGlzLl9hcmNTZWdtZW50cyAqIDI7XG4gIHZhciBwb2ludHMgICA9IFtdO1xuICB2YXIgY2VudGVyICAgPSB0aGlzLnZlcnRpY2VzWzBdO1xuICB2YXIgcmFkaXVzICAgPSB0aGlzLl9kaXN0YW5jZTtcbiAgdmFyIGFuZ2xlICAgID0gMDtcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZlcnRpY2VzIC0gMTsgaSsrKSB7XG4gICAgYW5nbGUgKz0gKDIgKiBNYXRoLlBJIC8gdmVydGljZXMpOyAvLyBjb3VudGVyLWNsb2Nrd2lzZVxuICAgIHBvaW50cy5wdXNoKFtcbiAgICAgIGNlbnRlclswXSArIChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSkpLFxuICAgICAgY2VudGVyWzFdICsgKHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKSlcbiAgICBdKTtcbiAgfVxuXG4gIHJldHVybiBwb2ludHM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9mZnNldDtcbiJdfQ==
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9hcHAuanMiLCJleGFtcGxlL2xlYWZsZXRfbXVsdGlwb2x5Z29uLmpzIiwiZXhhbXBsZS9vZmZzZXRfY29udHJvbC5qcyIsImV4YW1wbGUvcG9seWdvbl9jb250cm9sLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9iaW50cmVlLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9yYnRyZWUuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL3RyZWViYXNlLmpzIiwibm9kZV9tb2R1bGVzL2dlb2pzb24tcHJvamVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfc2VnbWVudHMuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvZWRnZV90eXBlLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2VxdWFscy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zZWdtZW50X2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zaWduZWRfYXJlYS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zd2VlcF9ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW55cXVldWUvaW5kZXguanMiLCJzcmMvZWRnZS5qcyIsInNyYy9vZmZzZXQuanMiLCJ0ZXN0L2ZpeHR1cmVzL2RlbW8uanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2b0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hjQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9mZnNldCA9IHJlcXVpcmUoJy4uL3NyYy9vZmZzZXQnKTtcbnJlcXVpcmUoJy4vbGVhZmxldF9tdWx0aXBvbHlnb24nKTtcbnJlcXVpcmUoJy4vcG9seWdvbl9jb250cm9sJyk7XG52YXIgT2Zmc2V0Q29udHJvbCA9IHJlcXVpcmUoJy4vb2Zmc2V0X2NvbnRyb2wnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9kZW1vLmpzb24nKTtcbnZhciBwcm9qZWN0ID0gcmVxdWlyZSgnZ2VvanNvbi1wcm9qZWN0Jyk7XG5cbnZhciBhcmNTZWdtZW50cyA9IDUwO1xuXG52YXIgc3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgY29sb3I6ICcjNDhmJyxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICBkYXNoQXJyYXk6IFsyLCA0XVxuICAgIH0sXG4gICAgbWFyZ2luU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjMjc2RDhGJ1xuICAgIH0sXG4gICAgcGFkZGluZ1N0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnI0Q4MTcwNidcbiAgICB9LFxuICAgIGNlbnRlciA9IFsyMi4yNjcwLCAxMTQuMTg4XSxcbiAgICB6b29tID0gMTcsXG4gICAgbWFwLCB2ZXJ0aWNlcywgcmVzdWx0O1xuXG5tYXAgPSBnbG9iYWwubWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgem9vbSk7XG5cblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld1BvaW50Q29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0TWFya2VyXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKGRhdGEpLmFkZFRvKG1hcCk7XG52YXIgcmVzdWx0cyA9IGdsb2JhbC5yZXN1bHRzID0gTC5nZW9Kc29uKG51bGwsIHtcbiAgc3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFyZ2luU3R5bGU7XG4gIH1cbn0pLmFkZFRvKG1hcCk7XG5tYXAuZml0Qm91bmRzKGxheWVycy5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBydW4gKG1hcmdpbikge1xuICByZXN1bHRzLmNsZWFyTGF5ZXJzKCk7XG4gIGxheWVycy5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgZ2ogPSBsYXllci50b0dlb0pTT04oKTtcbiAgICBjb25zb2xlLmxvZyhnaiwgbWFyZ2luKTtcbiAgICBpZiAobWFyZ2luID09PSAwKSByZXR1cm47XG4gICAgdmFyIHNoYXBlID0gcHJvamVjdChnaiwgZnVuY3Rpb24oY29vcmQpIHtcbiAgICAgIHZhciBwdCA9IG1hcC5vcHRpb25zLmNycy5sYXRMbmdUb1BvaW50KEwubGF0TG5nKGNvb3JkLnNsaWNlKCkucmV2ZXJzZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW3B0LngsIHB0LnldO1xuICAgIH0pO1xuXG4gICAgdmFyIG1hcmdpbmVkO1xuICAgIGlmIChnai5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpLm9mZnNldExpbmUobWFyZ2luKTtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpLm9mZnNldChtYXJnaW4pO1xuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IFtyZXNdXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKS5vZmZzZXQobWFyZ2luKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdtYXJnaW5lZCcsIG1hcmdpbmVkKTtcbiAgICByZXN1bHRzLmFkZERhdGEocHJvamVjdChtYXJnaW5lZCwgZnVuY3Rpb24ocHQpIHtcbiAgICAgIHZhciBsbCA9IG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocHQuc2xpY2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtsbC5sbmcsIGxsLmxhdF07XG4gICAgfSkpO1xuICB9KTtcbn1cblxucnVuICgyMCk7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1WNFlXMXdiR1V2WVhCd0xtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU0lzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJRTltWm5ObGRDQTlJSEpsY1hWcGNtVW9KeTR1TDNOeVl5OXZabVp6WlhRbktUdGNibkpsY1hWcGNtVW9KeTR2YkdWaFpteGxkRjl0ZFd4MGFYQnZiSGxuYjI0bktUdGNibkpsY1hWcGNtVW9KeTR2Y0c5c2VXZHZibDlqYjI1MGNtOXNKeWs3WEc1MllYSWdUMlptYzJWMFEyOXVkSEp2YkNBOUlISmxjWFZwY21Vb0p5NHZiMlptYzJWMFgyTnZiblJ5YjJ3bktUdGNiblpoY2lCa1lYUmhJRDBnY21WeGRXbHlaU2duTGk0dmRHVnpkQzltYVhoMGRYSmxjeTlrWlcxdkxtcHpiMjRuS1R0Y2JuWmhjaUJ3Y205cVpXTjBJRDBnY21WeGRXbHlaU2duWjJWdmFuTnZiaTF3Y205cVpXTjBKeWs3WEc1Y2JuWmhjaUJoY21OVFpXZHRaVzUwY3lBOUlEVXdPMXh1WEc1MllYSWdjM1I1YkdVZ1BTQjdYRzRnSUNBZ0lDQWdJSGRsYVdkb2REb2dNeXhjYmlBZ0lDQWdJQ0FnWTI5c2IzSTZJQ2NqTkRobUp5eGNiaUFnSUNBZ0lDQWdiM0JoWTJsMGVUb2dNQzQ0TEZ4dUlDQWdJQ0FnSUNCa1lYTm9RWEp5WVhrNklGc3lMQ0EwWFZ4dUlDQWdJSDBzWEc0Z0lDQWdiV0Z5WjJsdVUzUjViR1VnUFNCN1hHNGdJQ0FnSUNBZ0lIZGxhV2RvZERvZ01peGNiaUFnSUNBZ0lDQWdZMjlzYjNJNklDY2pNamMyUkRoR0oxeHVJQ0FnSUgwc1hHNGdJQ0FnY0dGa1pHbHVaMU4wZVd4bElEMGdlMXh1SUNBZ0lDQWdJQ0IzWldsbmFIUTZJRElzWEc0Z0lDQWdJQ0FnSUdOdmJHOXlPaUFuSTBRNE1UY3dOaWRjYmlBZ0lDQjlMRnh1SUNBZ0lHTmxiblJsY2lBOUlGc3lNaTR5Tmpjd0xDQXhNVFF1TVRnNFhTeGNiaUFnSUNCNmIyOXRJRDBnTVRjc1hHNGdJQ0FnYldGd0xDQjJaWEowYVdObGN5d2djbVZ6ZFd4ME8xeHVYRzV0WVhBZ1BTQm5iRzlpWVd3dWJXRndJRDBnVEM1dFlYQW9KMjFoY0Njc0lIdGNiaUFnWldScGRHRmliR1U2SUhSeWRXVXNYRzRnSUcxaGVGcHZiMjA2SURJeVhHNTlLUzV6WlhSV2FXVjNLR05sYm5SbGNpd2dlbTl2YlNrN1hHNWNibHh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUV3dVRtVjNVRzlzZVdkdmJrTnZiblJ5YjJ3b2UxeHVJQ0JqWVd4c1ltRmphem9nYldGd0xtVmthWFJVYjI5c2N5NXpkR0Z5ZEZCdmJIbG5iMjVjYm4wcEtUdGNibHh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUV3dVRtVjNUR2x1WlVOdmJuUnliMndvZTF4dUlDQmpZV3hzWW1GamF6b2diV0Z3TG1Wa2FYUlViMjlzY3k1emRHRnlkRkJ2Ykhsc2FXNWxYRzU5S1NrN1hHNWNibTFoY0M1aFpHUkRiMjUwY205c0tHNWxkeUJNTGs1bGQxQnZhVzUwUTI5dWRISnZiQ2g3WEc0Z0lHTmhiR3hpWVdOck9pQnRZWEF1WldScGRGUnZiMnh6TG5OMFlYSjBUV0Z5YTJWeVhHNTlLU2s3WEc1Y2JuWmhjaUJzWVhsbGNuTWdQU0JuYkc5aVlXd3ViR0Y1WlhKeklEMGdUQzVuWlc5S2MyOXVLR1JoZEdFcExtRmtaRlJ2S0cxaGNDazdYRzUyWVhJZ2NtVnpkV3gwY3lBOUlHZHNiMkpoYkM1eVpYTjFiSFJ6SUQwZ1RDNW5aVzlLYzI5dUtHNTFiR3dzSUh0Y2JpQWdjM1I1YkdVNklHWjFibU4wYVc5dUtHWmxZWFIxY21VcElIdGNiaUFnSUNCeVpYUjFjbTRnYldGeVoybHVVM1I1YkdVN1hHNGdJSDFjYm4wcExtRmtaRlJ2S0cxaGNDazdYRzV0WVhBdVptbDBRbTkxYm1SektHeGhlV1Z5Y3k1blpYUkNiM1Z1WkhNb0tTd2dleUJoYm1sdFlYUmxPaUJtWVd4elpTQjlLVHRjYmx4dWJXRndMbUZrWkVOdmJuUnliMndvYm1WM0lFOW1abk5sZEVOdmJuUnliMndvZTF4dUlDQmpiR1ZoY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2JHRjVaWEp6TG1Oc1pXRnlUR0Y1WlhKektDazdYRzRnSUgwc1hHNGdJR05oYkd4aVlXTnJPaUJ5ZFc1Y2JuMHBLVHRjYmx4dWJXRndMbTl1S0NkbFpHbDBZV0pzWlRwamNtVmhkR1ZrSnl3Z1puVnVZM1JwYjI0b1pYWjBLU0I3WEc0Z0lHeGhlV1Z5Y3k1aFpHUk1ZWGxsY2lobGRuUXViR0Y1WlhJcE8xeHVJQ0JsZG5RdWJHRjVaWEl1YjI0b0oyTnNhV05ySnl3Z1puVnVZM1JwYjI0b1pTa2dlMXh1SUNBZ0lHbG1JQ2dvWlM1dmNtbG5hVzVoYkVWMlpXNTBMbU4wY214TFpYa2dmSHdnWlM1dmNtbG5hVzVoYkVWMlpXNTBMbTFsZEdGTFpYa3BJQ1ltSUhSb2FYTXVaV1JwZEVWdVlXSnNaV1FvS1NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVsWkdsMGIzSXVibVYzU0c5c1pTaGxMbXhoZEd4dVp5azdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JuMHBPMXh1WEc1bWRXNWpkR2x2YmlCeWRXNGdLRzFoY21kcGJpa2dlMXh1SUNCeVpYTjFiSFJ6TG1Oc1pXRnlUR0Y1WlhKektDazdYRzRnSUd4aGVXVnljeTVsWVdOb1RHRjVaWElvWm5WdVkzUnBiMjRvYkdGNVpYSXBJSHRjYmlBZ0lDQjJZWElnWjJvZ1BTQnNZWGxsY2k1MGIwZGxiMHBUVDA0b0tUdGNiaUFnSUNCamIyNXpiMnhsTG14dlp5aG5haXdnYldGeVoybHVLVHRjYmlBZ0lDQnBaaUFvYldGeVoybHVJRDA5UFNBd0tTQnlaWFIxY200N1hHNGdJQ0FnZG1GeUlITm9ZWEJsSUQwZ2NISnZhbVZqZENobmFpd2dablZ1WTNScGIyNG9ZMjl2Y21RcElIdGNiaUFnSUNBZ0lIWmhjaUJ3ZENBOUlHMWhjQzV2Y0hScGIyNXpMbU55Y3k1c1lYUk1ibWRVYjFCdmFXNTBLRXd1YkdGMFRHNW5LR052YjNKa0xuTnNhV05sS0NrdWNtVjJaWEp6WlNncEtTd2diV0Z3TG1kbGRGcHZiMjBvS1NrN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVzNCMExuZ3NJSEIwTG5sZE8xeHVJQ0FnSUgwcE8xeHVYRzRnSUNBZ2RtRnlJRzFoY21kcGJtVmtPMXh1SUNBZ0lHbG1JQ2huYWk1blpXOXRaWFJ5ZVM1MGVYQmxJRDA5UFNBblRHbHVaVk4wY21sdVp5Y3BJSHRjYmlBZ0lDQWdJR2xtSUNodFlYSm5hVzRnUENBd0tTQnlaWFIxY200N1hHNGdJQ0FnSUNCMllYSWdjbVZ6SUQwZ2JtVjNJRTltWm5ObGRDaHphR0Z3WlM1blpXOXRaWFJ5ZVM1amIyOXlaR2x1WVhSbGN5a3VZWEpqVTJWbmJXVnVkSE1vWVhKalUyVm5iV1Z1ZEhNcExtOW1abk5sZEV4cGJtVW9iV0Z5WjJsdUtUdGNiaUFnSUNBZ0lHMWhjbWRwYm1Wa0lEMGdlMXh1SUNBZ0lDQWdJQ0IwZVhCbE9pQW5SbVZoZEhWeVpTY3NYRzRnSUNBZ0lDQWdJR2RsYjIxbGRISjVPaUI3WEc0Z0lDQWdJQ0FnSUNBZ2RIbHdaVG9nSjFCdmJIbG5iMjRuTEZ4dUlDQWdJQ0FnSUNBZ0lHTnZiM0prYVc1aGRHVnpPaUJ5WlhOY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOUlHVnNjMlVnYVdZZ0tHZHFMbWRsYjIxbGRISjVMblI1Y0dVZ1BUMDlJQ2RRYjJsdWRDY3BJSHRjYmlBZ0lDQWdJR2xtSUNodFlYSm5hVzRnUENBd0tTQnlaWFIxY200N1hHNGdJQ0FnSUNCMllYSWdjbVZ6SUQwZ2JtVjNJRTltWm5ObGRDaHphR0Z3WlM1blpXOXRaWFJ5ZVM1amIyOXlaR2x1WVhSbGN5a3VZWEpqVTJWbmJXVnVkSE1vWVhKalUyVm5iV1Z1ZEhNcExtOW1abk5sZENodFlYSm5hVzRwTzF4dUlDQWdJQ0FnYldGeVoybHVaV1FnUFNCN1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUNkR1pXRjBkWEpsSnl4Y2JpQWdJQ0FnSUNBZ1oyVnZiV1YwY25rNklIdGNiaUFnSUNBZ0lDQWdJQ0IwZVhCbE9pQW5VRzlzZVdkdmJpY3NYRzRnSUNBZ0lDQWdJQ0FnWTI5dmNtUnBibUYwWlhNNklGdHlaWE5kWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlNCbGJITmxJSHRjYmlBZ0lDQWdJRzFoY21kcGJtVmtJRDBnZTF4dUlDQWdJQ0FnSUNCMGVYQmxPaUFuUm1WaGRIVnlaU2NzWEc0Z0lDQWdJQ0FnSUdkbGIyMWxkSEo1T2lCN1hHNGdJQ0FnSUNBZ0lDQWdkSGx3WlRvZ0oxQnZiSGxuYjI0bkxGeHVJQ0FnSUNBZ0lDQWdJR052YjNKa2FXNWhkR1Z6T2lCdVpYY2dUMlptYzJWMEtITm9ZWEJsTG1kbGIyMWxkSEo1TG1OdmIzSmthVzVoZEdWektTNXZabVp6WlhRb2JXRnlaMmx1S1Z4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOU8xeHVJQ0FnSUgxY2JseHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktDZHRZWEpuYVc1bFpDY3NJRzFoY21kcGJtVmtLVHRjYmlBZ0lDQnlaWE4xYkhSekxtRmtaRVJoZEdFb2NISnZhbVZqZENodFlYSm5hVzVsWkN3Z1puVnVZM1JwYjI0b2NIUXBJSHRjYmlBZ0lDQWdJSFpoY2lCc2JDQTlJRzFoY0M1dmNIUnBiMjV6TG1OeWN5NXdiMmx1ZEZSdlRHRjBURzVuS0V3dWNHOXBiblFvY0hRdWMyeHBZMlVvS1Nrc0lHMWhjQzVuWlhSYWIyOXRLQ2twTzF4dUlDQWdJQ0FnY21WMGRYSnVJRnRzYkM1c2JtY3NJR3hzTG14aGRGMDdYRzRnSUNBZ2ZTa3BPMXh1SUNCOUtUdGNibjFjYmx4dWNuVnVJQ2d5TUNrN1hHNGlYWDA9IiwiTC5Qb2x5Z29uLnByb3RvdHlwZS5fcHJvamVjdExhdGxuZ3MgPSBmdW5jdGlvbiAobGF0bG5ncywgcmVzdWx0LCBwcm9qZWN0ZWRCb3VuZHMsIGlzSG9sZSkge1xuICB2YXIgZmxhdCA9IGxhdGxuZ3NbMF0gaW5zdGFuY2VvZiBMLkxhdExuZyxcbiAgICAgIGxlbiA9IGxhdGxuZ3MubGVuZ3RoLFxuICAgICAgaSwgcmluZywgYXJlYTtcblxuICBpZiAoZmxhdCkge1xuICAgIGFyZWEgPSAwO1xuICAgIHJpbmcgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHJpbmdbaV0gPSB0aGlzLl9tYXAubGF0TG5nVG9MYXllclBvaW50KGxhdGxuZ3NbaV0pO1xuICAgICAgcHJvamVjdGVkQm91bmRzLmV4dGVuZChyaW5nW2ldKTtcblxuICAgICAgaWYgKGkpIHtcbiAgICAgICAgYXJlYSArPSByaW5nW2kgLSAxXS54ICogcmluZ1tpXS55O1xuICAgICAgICBhcmVhIC09IHJpbmdbaV0ueCAqIHJpbmdbaSAtIDFdLnk7XG4gICAgICB9XG4gICAgfVxuICAgIGFyZWEgKz0gcmluZ1tsZW4gLSAxXS54ICogcmluZ1swXS55O1xuICAgIGFyZWEgLT0gcmluZ1swXS54ICogcmluZ1tsZW4gLSAxXS55O1xuXG4gICAgaWYgKCghaXNIb2xlICYmIGFyZWEgPiAwKSB8fCAoaXNIb2xlICYmIGFyZWEgPCAwKSkge1xuICAgICAgcmluZy5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2gocmluZyk7XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0aGlzLl9wcm9qZWN0TGF0bG5ncyhsYXRsbmdzW2ldLCByZXN1bHQsIHByb2plY3RlZEJvdW5kcywgaSAhPT0gMCk7XG4gICAgfVxuICB9XG59O1xuXG5cbkwuUG9seWdvbi5wcm90b3R5cGUuX3Byb2plY3QgPSBmdW5jdGlvbigpIHtcbiAgTC5Qb2x5bGluZS5wcm90b3R5cGUuX3Byb2plY3QuY2FsbCh0aGlzKTtcbiAgaWYgKCh0aGlzLl9sYXRsbmdzLmxlbmd0aCA+IDEpICYmXG4gICAgIUwuUG9seWxpbmUuX2ZsYXQodGhpcy5fbGF0bG5ncykgJiZcbiAgICAhKHRoaXMuX2xhdGxuZ3NbMF1bMF0gaW5zdGFuY2VvZiBMLkxhdExuZykpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmZpbGxSdWxlICE9PSAnbm9uemVybycpIHtcbiAgICAgIHRoaXMuc2V0U3R5bGUoe1xuICAgICAgICBmaWxsUnVsZTogJ25vbnplcm8nXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBMLkNvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wcmlnaHQnLFxuICAgIGRlZmF1bHRNYXJnaW46IDIwXG4gIH0sXG5cbiAgb25BZGQ6IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1iYXInKTtcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZCA9ICcjZmZmZmZmJztcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUucGFkZGluZyA9ICcxMHB4JztcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gW1xuICAgICAgJzxmb3JtPicsXG4gICAgICAgICc8ZGl2PicsXG4gICAgICAgICAgJzxsYWJlbD4nLFxuICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgdmFsdWU9XCInLCAgdGhpcy5vcHRpb25zLmRlZmF1bHRNYXJnaW4sICdcIiBuYW1lPVwibWFyZ2luXCI+JyxcbiAgICAgICAgICAnPC9sYWJlbD4nLFxuICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgJzxkaXY+JyxcbiAgICAgICAgICAnPGxhYmVsPicsICc8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm9wZXJhdGlvblwiIHZhbHVlPVwiMVwiIGNoZWNrZWQ+JywgJyBtYXJnaW48L2xhYmVsPicsXG4gICAgICAgICAgJzxsYWJlbD4nLCAnPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJvcGVyYXRpb25cIiB2YWx1ZT1cIi0xXCI+JywgJyBwYWRkaW5nPC9sYWJlbD4nLFxuICAgICAgICAnPC9kaXY+JywgJzxicj4nLFxuICAgICAgICAnPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlJ1blwiPicsICc8aW5wdXQgbmFtZT1cImNsZWFyXCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiQ2xlYXIgbGF5ZXJzXCI+JyxcbiAgICAgICc8L2Zvcm0+J10uam9pbignJyk7XG5cbiAgICB2YXIgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgTC5Eb21FdmVudFxuICAgICAgLm9uKGZvcm0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIEwuRG9tRXZlbnQuc3RvcChldnQpO1xuICAgICAgICB2YXIgbWFyZ2luID0gcGFyc2VGbG9hdChmb3JtWydtYXJnaW4nXS52YWx1ZSk7XG4gICAgICAgIHZhciByYWRpb3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChcbiAgICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9cmFkaW9dJykpO1xuICAgICAgICB2YXIgayA9IDE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByYWRpb3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZiAocmFkaW9zW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGsgKj0gcGFyc2VJbnQocmFkaW9zW2ldLnZhbHVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMuY2FsbGJhY2sobWFyZ2luICogayk7XG4gICAgICB9LCB0aGlzKVxuICAgICAgLm9uKGZvcm1bJ2NsZWFyJ10sICdjbGljaycsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBMLkRvbUV2ZW50LnN0b3AoZXZ0KTtcbiAgICAgICAgdGhpcy5vcHRpb25zLmNsZWFyKCk7XG4gICAgICB9LCB0aGlzKTtcblxuICAgIEwuRG9tRXZlbnRcbiAgICAgIC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbih0aGlzLl9jb250YWluZXIpXG4gICAgICAuZGlzYWJsZVNjcm9sbFByb3BhZ2F0aW9uKHRoaXMuX2NvbnRhaW5lcik7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgfVxuXG59KTsiLCJMLkVkaXRDb250cm9sID0gTC5Db250cm9sLmV4dGVuZCh7XG5cbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAgY2FsbGJhY2s6IG51bGwsXG4gICAga2luZDogJycsXG4gICAgaHRtbDogJydcbiAgfSxcblxuICBvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xuICAgIHZhciBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1jb250cm9sIGxlYWZsZXQtYmFyJyksXG4gICAgICAgIGxpbmsgPSBMLkRvbVV0aWwuY3JlYXRlKCdhJywgJycsIGNvbnRhaW5lcik7XG5cbiAgICBsaW5rLmhyZWYgPSAnIyc7XG4gICAgbGluay50aXRsZSA9ICdDcmVhdGUgYSBuZXcgJyArIHRoaXMub3B0aW9ucy5raW5kO1xuICAgIGxpbmsuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmh0bWw7XG4gICAgTC5Eb21FdmVudC5vbihsaW5rLCAnY2xpY2snLCBMLkRvbUV2ZW50LnN0b3ApXG4gICAgICAgICAgICAgIC5vbihsaW5rLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkxBWUVSID0gdGhpcy5vcHRpb25zLmNhbGxiYWNrLmNhbGwobWFwLmVkaXRUb29scyk7XG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG59KTtcblxuTC5OZXdQb2x5Z29uQ29udHJvbCA9IEwuRWRpdENvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAga2luZDogJ3BvbHlnb24nLFxuICAgIGh0bWw6ICfilrAnXG4gIH1cbn0pO1xuXG5MLk5ld0xpbmVDb250cm9sID0gTC5FZGl0Q29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcbiAgICBraW5kOiAncG9seWxpbmUnLFxuICAgIGh0bWw6ICcvJ1xuICB9XG59KTtcblxuTC5OZXdQb2ludENvbnRyb2wgPSBMLkVkaXRDb250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGtpbmQ6ICdwb2ludCcsXG4gICAgaHRtbDogJyYjOTY3OTsnXG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUkJUcmVlOiByZXF1aXJlKCcuL2xpYi9yYnRyZWUnKSxcbiAgICBCaW5UcmVlOiByZXF1aXJlKCcuL2xpYi9iaW50cmVlJylcbn07XG4iLCJcbnZhciBUcmVlQmFzZSA9IHJlcXVpcmUoJy4vdHJlZWJhc2UnKTtcblxuZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIpIHtcbiAgICByZXR1cm4gZGlyID8gdGhpcy5yaWdodCA6IHRoaXMubGVmdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldF9jaGlsZCA9IGZ1bmN0aW9uKGRpciwgdmFsKSB7XG4gICAgaWYoZGlyKSB7XG4gICAgICAgIHRoaXMucmlnaHQgPSB2YWw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmxlZnQgPSB2YWw7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gQmluVHJlZShjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5zaXplID0gMDtcbn1cblxuQmluVHJlZS5wcm90b3R5cGUgPSBuZXcgVHJlZUJhc2UoKTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIGluc2VydGVkLCBmYWxzZSBpZiBkdXBsaWNhdGVcbkJpblRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGVtcHR5IHRyZWVcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGRpciA9IDA7XG5cbiAgICAvLyBzZXR1cFxuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuXG4gICAgLy8gc2VhcmNoIGRvd25cbiAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgIGlmKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGluc2VydCBuZXcgbm9kZSBhdCB0aGUgYm90dG9tXG4gICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICBwLnNldF9jaGlsZChkaXIsIG5vZGUpO1xuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9wIGlmIGZvdW5kXG4gICAgICAgIGlmKHRoaXMuX2NvbXBhcmF0b3Iobm9kZS5kYXRhLCBkYXRhKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlyID0gdGhpcy5fY29tcGFyYXRvcihub2RlLmRhdGEsIGRhdGEpIDwgMDtcblxuICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG4gICAgfVxufTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIHJlbW92ZWQsIGZhbHNlIGlmIG5vdCBmb3VuZFxuQmluVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcbiAgICB2YXIgbm9kZSA9IGhlYWQ7XG4gICAgbm9kZS5yaWdodCA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgZm91bmQgPSBudWxsOyAvLyBmb3VuZCBpdGVtXG4gICAgdmFyIGRpciA9IDE7XG5cbiAgICB3aGlsZShub2RlLmdldF9jaGlsZChkaXIpICE9PSBudWxsKSB7XG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcbiAgICAgICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgbm9kZS5kYXRhKTtcbiAgICAgICAgZGlyID0gY21wID4gMDtcblxuICAgICAgICBpZihjbXAgPT09IDApIHtcbiAgICAgICAgICAgIGZvdW5kID0gbm9kZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgIGZvdW5kLmRhdGEgPSBub2RlLmRhdGE7XG4gICAgICAgIHAuc2V0X2NoaWxkKHAucmlnaHQgPT09IG5vZGUsIG5vZGUuZ2V0X2NoaWxkKG5vZGUubGVmdCA9PT0gbnVsbCkpO1xuXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCaW5UcmVlO1xuXG4iLCJcbnZhciBUcmVlQmFzZSA9IHJlcXVpcmUoJy4vdHJlZWJhc2UnKTtcblxuZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xuICAgIHRoaXMucmVkID0gdHJ1ZTtcbn1cblxuTm9kZS5wcm90b3R5cGUuZ2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgcmV0dXJuIGRpciA/IHRoaXMucmlnaHQgOiB0aGlzLmxlZnQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIsIHZhbCkge1xuICAgIGlmKGRpcikge1xuICAgICAgICB0aGlzLnJpZ2h0ID0gdmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5sZWZ0ID0gdmFsO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIFJCVHJlZShjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5zaXplID0gMDtcbn1cblxuUkJUcmVlLnByb3RvdHlwZSA9IG5ldyBUcmVlQmFzZSgpO1xuXG4vLyByZXR1cm5zIHRydWUgaWYgaW5zZXJ0ZWQsIGZhbHNlIGlmIGR1cGxpY2F0ZVxuUkJUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJldCA9IGZhbHNlO1xuXG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBlbXB0eSB0cmVlXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaXplKys7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG5cbiAgICAgICAgdmFyIGRpciA9IDA7XG4gICAgICAgIHZhciBsYXN0ID0gMDtcblxuICAgICAgICAvLyBzZXR1cFxuICAgICAgICB2YXIgZ3AgPSBudWxsOyAvLyBncmFuZHBhcmVudFxuICAgICAgICB2YXIgZ2dwID0gaGVhZDsgLy8gZ3JhbmQtZ3JhbmQtcGFyZW50XG4gICAgICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgICAgICAgZ2dwLnJpZ2h0ID0gdGhpcy5fcm9vdDtcblxuICAgICAgICAvLyBzZWFyY2ggZG93blxuICAgICAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgICAgICBpZihub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5zZXJ0IG5ldyBub2RlIGF0IHRoZSBib3R0b21cbiAgICAgICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQoZGlyLCBub2RlKTtcbiAgICAgICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpc19yZWQobm9kZS5sZWZ0KSAmJiBpc19yZWQobm9kZS5yaWdodCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb2xvciBmbGlwXG4gICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG5vZGUubGVmdC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBub2RlLnJpZ2h0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXggcmVkIHZpb2xhdGlvblxuICAgICAgICAgICAgaWYoaXNfcmVkKG5vZGUpICYmIGlzX3JlZChwKSkge1xuICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ2dwLnJpZ2h0ID09PSBncDtcblxuICAgICAgICAgICAgICAgIGlmKG5vZGUgPT09IHAuZ2V0X2NoaWxkKGxhc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgc2luZ2xlX3JvdGF0ZShncCwgIWxhc3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgZG91YmxlX3JvdGF0ZShncCwgIWxhc3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgaWYgZm91bmRcbiAgICAgICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYXN0ID0gZGlyO1xuICAgICAgICAgICAgZGlyID0gY21wIDwgMDtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIGhlbHBlcnNcbiAgICAgICAgICAgIGlmKGdwICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZ2dwID0gZ3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncCA9IHA7XG4gICAgICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHJvb3RcbiAgICAgICAgdGhpcy5fcm9vdCA9IGhlYWQucmlnaHQ7XG4gICAgfVxuXG4gICAgLy8gbWFrZSByb290IGJsYWNrXG4gICAgdGhpcy5fcm9vdC5yZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiByZXQ7XG59O1xuXG4vLyByZXR1cm5zIHRydWUgaWYgcmVtb3ZlZCwgZmFsc2UgaWYgbm90IGZvdW5kXG5SQlRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG4gICAgdmFyIG5vZGUgPSBoZWFkO1xuICAgIG5vZGUucmlnaHQgPSB0aGlzLl9yb290O1xuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIGdwID0gbnVsbDsgLy8gZ3JhbmQgcGFyZW50XG4gICAgdmFyIGZvdW5kID0gbnVsbDsgLy8gZm91bmQgaXRlbVxuICAgIHZhciBkaXIgPSAxO1xuXG4gICAgd2hpbGUobm9kZS5nZXRfY2hpbGQoZGlyKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbGFzdCA9IGRpcjtcblxuICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICBncCA9IHA7XG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcblxuICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCBub2RlLmRhdGEpO1xuXG4gICAgICAgIGRpciA9IGNtcCA+IDA7XG5cbiAgICAgICAgLy8gc2F2ZSBmb3VuZCBub2RlXG4gICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgZm91bmQgPSBub2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHVzaCB0aGUgcmVkIG5vZGUgZG93blxuICAgICAgICBpZighaXNfcmVkKG5vZGUpICYmICFpc19yZWQobm9kZS5nZXRfY2hpbGQoZGlyKSkpIHtcbiAgICAgICAgICAgIGlmKGlzX3JlZChub2RlLmdldF9jaGlsZCghZGlyKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3IgPSBzaW5nbGVfcm90YXRlKG5vZGUsIGRpcik7XG4gICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQobGFzdCwgc3IpO1xuICAgICAgICAgICAgICAgIHAgPSBzcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIWlzX3JlZChub2RlLmdldF9jaGlsZCghZGlyKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2libGluZyA9IHAuZ2V0X2NoaWxkKCFsYXN0KTtcbiAgICAgICAgICAgICAgICBpZihzaWJsaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc19yZWQoc2libGluZy5nZXRfY2hpbGQoIWxhc3QpKSAmJiAhaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKGxhc3QpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29sb3IgZmxpcFxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmcucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ3AucmlnaHQgPT09IHA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzX3JlZChzaWJsaW5nLmdldF9jaGlsZChsYXN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncC5zZXRfY2hpbGQoZGlyMiwgZG91YmxlX3JvdGF0ZShwLCBsYXN0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Auc2V0X2NoaWxkKGRpcjIsIHNpbmdsZV9yb3RhdGUocCwgbGFzdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgY29ycmVjdCBjb2xvcmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdwYyA9IGdwLmdldF9jaGlsZChkaXIyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLmxlZnQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBncGMucmlnaHQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXBsYWNlIGFuZCByZW1vdmUgaWYgZm91bmRcbiAgICBpZihmb3VuZCAhPT0gbnVsbCkge1xuICAgICAgICBmb3VuZC5kYXRhID0gbm9kZS5kYXRhO1xuICAgICAgICBwLnNldF9jaGlsZChwLnJpZ2h0ID09PSBub2RlLCBub2RlLmdldF9jaGlsZChub2RlLmxlZnQgPT09IG51bGwpKTtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHJvb3QgYW5kIG1ha2UgaXQgYmxhY2tcbiAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcbiAgICBpZih0aGlzLl9yb290ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Jvb3QucmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvdW5kICE9PSBudWxsO1xufTtcblxuZnVuY3Rpb24gaXNfcmVkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAhPT0gbnVsbCAmJiBub2RlLnJlZDtcbn1cblxuZnVuY3Rpb24gc2luZ2xlX3JvdGF0ZShyb290LCBkaXIpIHtcbiAgICB2YXIgc2F2ZSA9IHJvb3QuZ2V0X2NoaWxkKCFkaXIpO1xuXG4gICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgc2F2ZS5nZXRfY2hpbGQoZGlyKSk7XG4gICAgc2F2ZS5zZXRfY2hpbGQoZGlyLCByb290KTtcblxuICAgIHJvb3QucmVkID0gdHJ1ZTtcbiAgICBzYXZlLnJlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHNhdmU7XG59XG5cbmZ1bmN0aW9uIGRvdWJsZV9yb3RhdGUocm9vdCwgZGlyKSB7XG4gICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgc2luZ2xlX3JvdGF0ZShyb290LmdldF9jaGlsZCghZGlyKSwgIWRpcikpO1xuICAgIHJldHVybiBzaW5nbGVfcm90YXRlKHJvb3QsIGRpcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUkJUcmVlO1xuIiwiXG5mdW5jdGlvbiBUcmVlQmFzZSgpIHt9XG5cbi8vIHJlbW92ZXMgYWxsIG5vZGVzIGZyb20gdGhlIHRyZWVcblRyZWVCYXNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgIHRoaXMuc2l6ZSA9IDA7XG59O1xuXG4vLyByZXR1cm5zIG5vZGUgZGF0YSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2VcblRyZWVCYXNlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuXG4gICAgd2hpbGUocmVzICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBjID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCByZXMuZGF0YSk7XG4gICAgICAgIGlmKGMgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IHJlcy5nZXRfY2hpbGQoYyA+IDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyByZXR1cm5zIGl0ZXJhdG9yIHRvIG5vZGUgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlXG5UcmVlQmFzZS5wcm90b3R5cGUuZmluZEl0ZXIgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XG5cbiAgICB3aGlsZShyZXMgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIHJlcy5kYXRhKTtcbiAgICAgICAgaWYoYyA9PT0gMCkge1xuICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gcmVzO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVyLl9hbmNlc3RvcnMucHVzaChyZXMpO1xuICAgICAgICAgICAgcmVzID0gcmVzLmdldF9jaGlsZChjID4gMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIFJldHVybnMgYW4gaXRlcmF0b3IgdG8gdGhlIHRyZWUgbm9kZSBhdCBvciBpbW1lZGlhdGVseSBhZnRlciB0aGUgaXRlbVxuVHJlZUJhc2UucHJvdG90eXBlLmxvd2VyQm91bmQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGN1ciA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XG4gICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICB3aGlsZShjdXIgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSBjbXAoaXRlbSwgY3VyLmRhdGEpO1xuICAgICAgICBpZihjID09PSAwKSB7XG4gICAgICAgICAgICBpdGVyLl9jdXJzb3IgPSBjdXI7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgICAgICBpdGVyLl9hbmNlc3RvcnMucHVzaChjdXIpO1xuICAgICAgICBjdXIgPSBjdXIuZ2V0X2NoaWxkKGMgPiAwKTtcbiAgICB9XG5cbiAgICBmb3IodmFyIGk9aXRlci5fYW5jZXN0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGN1ciA9IGl0ZXIuX2FuY2VzdG9yc1tpXTtcbiAgICAgICAgaWYoY21wKGl0ZW0sIGN1ci5kYXRhKSA8IDApIHtcbiAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IGN1cjtcbiAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggPSBpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpdGVyLl9hbmNlc3RvcnMubGVuZ3RoID0gMDtcbiAgICByZXR1cm4gaXRlcjtcbn07XG5cbi8vIFJldHVybnMgYW4gaXRlcmF0b3IgdG8gdGhlIHRyZWUgbm9kZSBpbW1lZGlhdGVseSBhZnRlciB0aGUgaXRlbVxuVHJlZUJhc2UucHJvdG90eXBlLnVwcGVyQm91bmQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLmxvd2VyQm91bmQoaXRlbSk7XG4gICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICB3aGlsZShpdGVyLmRhdGEoKSAhPT0gbnVsbCAmJiBjbXAoaXRlci5kYXRhKCksIGl0ZW0pID09PSAwKSB7XG4gICAgICAgIGl0ZXIubmV4dCgpO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVyO1xufTtcblxuLy8gcmV0dXJucyBudWxsIGlmIHRyZWUgaXMgZW1wdHlcblRyZWVCYXNlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICBpZihyZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgd2hpbGUocmVzLmxlZnQgIT09IG51bGwpIHtcbiAgICAgICAgcmVzID0gcmVzLmxlZnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5kYXRhO1xufTtcblxuLy8gcmV0dXJucyBudWxsIGlmIHRyZWUgaXMgZW1wdHlcblRyZWVCYXNlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICBpZihyZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgd2hpbGUocmVzLnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIHJlcyA9IHJlcy5yaWdodDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLmRhdGE7XG59O1xuXG4vLyByZXR1cm5zIGEgbnVsbCBpdGVyYXRvclxuLy8gY2FsbCBuZXh0KCkgb3IgcHJldigpIHRvIHBvaW50IHRvIGFuIGVsZW1lbnRcblRyZWVCYXNlLnByb3RvdHlwZS5pdGVyYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IodGhpcyk7XG59O1xuXG4vLyBjYWxscyBjYiBvbiBlYWNoIG5vZGUncyBkYXRhLCBpbiBvcmRlclxuVHJlZUJhc2UucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBpdD10aGlzLml0ZXJhdG9yKCksIGRhdGE7XG4gICAgd2hpbGUoKGRhdGEgPSBpdC5uZXh0KCkpICE9PSBudWxsKSB7XG4gICAgICAgIGNiKGRhdGEpO1xuICAgIH1cbn07XG5cbi8vIGNhbGxzIGNiIG9uIGVhY2ggbm9kZSdzIGRhdGEsIGluIHJldmVyc2Ugb3JkZXJcblRyZWVCYXNlLnByb3RvdHlwZS5yZWFjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGl0PXRoaXMuaXRlcmF0b3IoKSwgZGF0YTtcbiAgICB3aGlsZSgoZGF0YSA9IGl0LnByZXYoKSkgIT09IG51bGwpIHtcbiAgICAgICAgY2IoZGF0YSk7XG4gICAgfVxufTtcblxuXG5mdW5jdGlvbiBJdGVyYXRvcih0cmVlKSB7XG4gICAgdGhpcy5fdHJlZSA9IHRyZWU7XG4gICAgdGhpcy5fYW5jZXN0b3JzID0gW107XG4gICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbn1cblxuSXRlcmF0b3IucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuLy8gaWYgbnVsbC1pdGVyYXRvciwgcmV0dXJucyBmaXJzdCBub2RlXG4vLyBvdGhlcndpc2UsIHJldHVybnMgbmV4dCBub2RlXG5JdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XG4gICAgICAgIGlmKHJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21pbk5vZGUocm9vdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvci5yaWdodCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm8gZ3JlYXRlciBub2RlIGluIHN1YnRyZWUsIGdvIHVwIHRvIHBhcmVudFxuICAgICAgICAgICAgLy8gaWYgY29taW5nIGZyb20gYSByaWdodCBjaGlsZCwgY29udGludWUgdXAgdGhlIHN0YWNrXG4gICAgICAgICAgICB2YXIgc2F2ZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSh0aGlzLl9jdXJzb3IucmlnaHQgPT09IHNhdmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBuZXh0IG5vZGUgZnJvbSB0aGUgc3VidHJlZVxuICAgICAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2godGhpcy5fY3Vyc29yKTtcbiAgICAgICAgICAgIHRoaXMuX21pbk5vZGUodGhpcy5fY3Vyc29yLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuLy8gaWYgbnVsbC1pdGVyYXRvciwgcmV0dXJucyBsYXN0IG5vZGVcbi8vIG90aGVyd2lzZSwgcmV0dXJucyBwcmV2aW91cyBub2RlXG5JdGVyYXRvci5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XG4gICAgICAgIGlmKHJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21heE5vZGUocm9vdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvci5sZWZ0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgc2F2ZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSh0aGlzLl9jdXJzb3IubGVmdCA9PT0gc2F2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaCh0aGlzLl9jdXJzb3IpO1xuICAgICAgICAgICAgdGhpcy5fbWF4Tm9kZSh0aGlzLl9jdXJzb3IubGVmdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnNvciAhPT0gbnVsbCA/IHRoaXMuX2N1cnNvci5kYXRhIDogbnVsbDtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5fbWluTm9kZSA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgd2hpbGUoc3RhcnQubGVmdCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaChzdGFydCk7XG4gICAgICAgIHN0YXJ0ID0gc3RhcnQubGVmdDtcbiAgICB9XG4gICAgdGhpcy5fY3Vyc29yID0gc3RhcnQ7XG59O1xuXG5JdGVyYXRvci5wcm90b3R5cGUuX21heE5vZGUgPSBmdW5jdGlvbihzdGFydCkge1xuICAgIHdoaWxlKHN0YXJ0LnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHN0YXJ0KTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5yaWdodDtcbiAgICB9XG4gICAgdGhpcy5fY3Vyc29yID0gc3RhcnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVCYXNlO1xuXG4iLCJcbi8qKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSwgcHJvamVjdCwgY29udGV4dCkge1xuICBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIGlmIChkYXRhLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicpIHtcbiAgICAvLyBUaGF0J3MgYSBodWdlIGhhY2sgdG8gZ2V0IHRoaW5ncyB3b3JraW5nIHdpdGggYm90aCBBcmNHSVMgc2VydmVyXG4gICAgLy8gYW5kIEdlb1NlcnZlci4gR2Vvc2VydmVyIHByb3ZpZGVzIGNycyByZWZlcmVuY2UgaW4gR2VvSlNPTiwgQXJjR0lTIOKAlFxuICAgIC8vIGRvZXNuJ3QuXG4gICAgLy9pZiAoZGF0YS5jcnMpIGRlbGV0ZSBkYXRhLmNycztcbiAgICBmb3IgKHZhciBpID0gZGF0YS5mZWF0dXJlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgZGF0YS5mZWF0dXJlc1tpXSA9IHByb2plY3RGZWF0dXJlKGRhdGEuZmVhdHVyZXNbaV0sIHByb2plY3QsIGNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkYXRhID0gcHJvamVjdEZlYXR1cmUoZGF0YSwgcHJvamVjdCwgY29udGV4dCk7XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5wcm9qZWN0RmVhdHVyZSAgPSBwcm9qZWN0RmVhdHVyZTtcbm1vZHVsZS5leHBvcnRzLnByb2plY3RHZW9tZXRyeSA9IHByb2plY3RHZW9tZXRyeTtcblxuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gICAgIGRhdGEgR2VvSlNPTlxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBwcm9qZWN0RmVhdHVyZShmZWF0dXJlLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIGlmIChmZWF0dXJlLnR5cGUgPT09ICdHZW9tZXRyeUNvbGxlY3Rpb24nKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGZlYXR1cmUuZ2VvbWV0cmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZmVhdHVyZS5nZW9tZXRyaWVzW2ldID1cbiAgICAgICAgcHJvamVjdEdlb21ldHJ5KGZlYXR1cmUuZ2VvbWV0cmllc1tpXSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBwcm9qZWN0R2VvbWV0cnkoZmVhdHVyZS5nZW9tZXRyeSwgcHJvamVjdCwgY29udGV4dCk7XG4gIH1cbiAgcmV0dXJuIGZlYXR1cmU7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBkYXRhIEdlb0pTT05cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gcHJvamVjdEdlb21ldHJ5KGdlb21ldHJ5LCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIHZhciBjb29yZHMgPSBnZW9tZXRyeS5jb29yZGluYXRlcztcbiAgc3dpdGNoIChnZW9tZXRyeS50eXBlKSB7XG4gICAgY2FzZSAnUG9pbnQnOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29vcmRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvb3Jkc1tpXSA9IHByb2plY3QuY2FsbChjb250ZXh0LCBjb29yZHNbaV0pO1xuICAgICAgfVxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBjb29yZHM7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0Q29vcmRzKGNvb3JkcywgMSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3RDb29yZHMoY29vcmRzLCAxLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdENvb3Jkcyhjb29yZHMsIDIsIHByb2plY3QsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGdlb21ldHJ5O1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7Kn0gICAgICAgICBjb29yZHMgQ29vcmRzIGFycmF5c1xuICogQHBhcmFtICB7TnVtYmVyfSAgICBsZXZlbHNEZWVwXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4geyp9XG4gKi9cbmZ1bmN0aW9uIHByb2plY3RDb29yZHMoY29vcmRzLCBsZXZlbHNEZWVwLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIHZhciBjb29yZCwgaSwgbGVuO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgZm9yIChpID0gMCwgbGVuID0gY29vcmRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29vcmQgPSBsZXZlbHNEZWVwID9cbiAgICAgIHByb2plY3RDb29yZHMoY29vcmRzW2ldLCBsZXZlbHNEZWVwIC0gMSwgcHJvamVjdCwgY29udGV4dCkgOlxuICAgICAgcHJvamVjdC5jYWxsKGNvbnRleHQsIGNvb3Jkc1tpXSk7XG5cbiAgICByZXN1bHQucHVzaChjb29yZCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9pbmRleCcpO1xuIiwidmFyIHNpZ25lZEFyZWEgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gZTFcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGUyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3dlZXBFdmVudHNDb21wKGUxLCBlMikge1xuICB2YXIgcDEgPSBlMS5wb2ludDtcbiAgdmFyIHAyID0gZTIucG9pbnQ7XG5cbiAgLy8gRGlmZmVyZW50IHgtY29vcmRpbmF0ZVxuICBpZiAocDFbMF0gPiBwMlswXSkgcmV0dXJuIDE7XG4gIGlmIChwMVswXSA8IHAyWzBdKSByZXR1cm4gLTE7XG5cbiAgLy8gRGlmZmVyZW50IHBvaW50cywgYnV0IHNhbWUgeC1jb29yZGluYXRlXG4gIC8vIEV2ZW50IHdpdGggbG93ZXIgeS1jb29yZGluYXRlIGlzIHByb2Nlc3NlZCBmaXJzdFxuICBpZiAocDFbMV0gIT09IHAyWzFdKSByZXR1cm4gcDFbMV0gPiBwMlsxXSA/IDEgOiAtMTtcblxuICByZXR1cm4gc3BlY2lhbENhc2VzKGUxLCBlMiwgcDEsIHAyKTtcbn07XG5cblxuZnVuY3Rpb24gc3BlY2lhbENhc2VzKGUxLCBlMiwgcDEsIHAyKSB7XG4gIC8vIFNhbWUgY29vcmRpbmF0ZXMsIGJ1dCBvbmUgaXMgYSBsZWZ0IGVuZHBvaW50IGFuZCB0aGUgb3RoZXIgaXNcbiAgLy8gYSByaWdodCBlbmRwb2ludC4gVGhlIHJpZ2h0IGVuZHBvaW50IGlzIHByb2Nlc3NlZCBmaXJzdFxuICBpZiAoZTEubGVmdCAhPT0gZTIubGVmdClcbiAgICByZXR1cm4gZTEubGVmdCA/IDEgOiAtMTtcblxuICAvLyBTYW1lIGNvb3JkaW5hdGVzLCBib3RoIGV2ZW50c1xuICAvLyBhcmUgbGVmdCBlbmRwb2ludHMgb3IgcmlnaHQgZW5kcG9pbnRzLlxuICAvLyBub3QgY29sbGluZWFyXG4gIGlmIChzaWduZWRBcmVhIChwMSwgZTEub3RoZXJFdmVudC5wb2ludCwgZTIub3RoZXJFdmVudC5wb2ludCkgIT09IDApIHtcbiAgICAvLyB0aGUgZXZlbnQgYXNzb2NpYXRlIHRvIHRoZSBib3R0b20gc2VnbWVudCBpcyBwcm9jZXNzZWQgZmlyc3RcbiAgICByZXR1cm4gKCFlMS5pc0JlbG93KGUyLm90aGVyRXZlbnQucG9pbnQpKSA/IDEgOiAtMTtcbiAgfVxuXG4gIGlmIChlMS5pc1N1YmplY3QgPT09IGUyLmlzU3ViamVjdCkge1xuICAgIGlmKGUxLmNvbnRvdXJJZCA9PT0gZTIuY29udG91cklkKXtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZTEuY29udG91cklkID4gZTIuY29udG91cklkID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoIWUxLmlzU3ViamVjdCAmJiBlMi5pc1N1YmplY3QpID8gMSA6IC0xO1xuICAvL3JldHVybiBlMS5pc1N1YmplY3QgPyAtMSA6IDE7XG59XG4iLCJ2YXIgc2lnbmVkQXJlYSAgICA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcbnZhciBjb21wYXJlRXZlbnRzID0gcmVxdWlyZSgnLi9jb21wYXJlX2V2ZW50cycpO1xudmFyIGVxdWFscyAgICAgICAgPSByZXF1aXJlKCcuL2VxdWFscycpO1xuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gbGUxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBsZTJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wYXJlU2VnbWVudHMobGUxLCBsZTIpIHtcbiAgaWYgKGxlMSA9PT0gbGUyKSByZXR1cm4gMDtcblxuICAvLyBTZWdtZW50cyBhcmUgbm90IGNvbGxpbmVhclxuICBpZiAoc2lnbmVkQXJlYShsZTEucG9pbnQsIGxlMS5vdGhlckV2ZW50LnBvaW50LCBsZTIucG9pbnQpICE9PSAwIHx8XG4gICAgc2lnbmVkQXJlYShsZTEucG9pbnQsIGxlMS5vdGhlckV2ZW50LnBvaW50LCBsZTIub3RoZXJFdmVudC5wb2ludCkgIT09IDApIHtcblxuICAgIC8vIElmIHRoZXkgc2hhcmUgdGhlaXIgbGVmdCBlbmRwb2ludCB1c2UgdGhlIHJpZ2h0IGVuZHBvaW50IHRvIHNvcnRcbiAgICBpZiAoZXF1YWxzKGxlMS5wb2ludCwgbGUyLnBvaW50KSkgcmV0dXJuIGxlMS5pc0JlbG93KGxlMi5vdGhlckV2ZW50LnBvaW50KSA/IC0xIDogMTtcblxuICAgIC8vIERpZmZlcmVudCBsZWZ0IGVuZHBvaW50OiB1c2UgdGhlIGxlZnQgZW5kcG9pbnQgdG8gc29ydFxuICAgIGlmIChsZTEucG9pbnRbMF0gPT09IGxlMi5wb2ludFswXSkgcmV0dXJuIGxlMS5wb2ludFsxXSA8IGxlMi5wb2ludFsxXSA/IC0xIDogMTtcblxuICAgIC8vIGhhcyB0aGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTEgYmVlbiBpbnNlcnRlZFxuICAgIC8vIGludG8gUyBhZnRlciB0aGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTIgP1xuICAgIGlmIChjb21wYXJlRXZlbnRzKGxlMSwgbGUyKSA9PT0gMSkgcmV0dXJuIGxlMi5pc0Fib3ZlKGxlMS5wb2ludCkgPyAtMSA6IDE7XG5cbiAgICAvLyBUaGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTIgaGFzIGJlZW4gaW5zZXJ0ZWRcbiAgICAvLyBpbnRvIFMgYWZ0ZXIgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUxXG4gICAgcmV0dXJuIGxlMS5pc0JlbG93KGxlMi5wb2ludCkgPyAtMSA6IDE7XG4gIH1cblxuICBpZiAobGUxLmlzU3ViamVjdCA9PT0gbGUyLmlzU3ViamVjdCl7XG4gICAgaWYgKGVxdWFscyhsZTEucG9pbnQsIGxlMi5wb2ludCkpIHtcbiAgICAgIGlmIChsZTEuY29udG91cklkID09PSBsZTIuY29udG91cklkKXtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGUxLmNvbnRvdXJJZCA+IGxlMi5jb250b3VySWQgPyAxIDogLTE7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlZ21lbnRzIGFyZSBjb2xsaW5lYXJcbiAgICAgIGlmIChsZTEuaXNTdWJqZWN0ICE9PSBsZTIuaXNTdWJqZWN0KSByZXR1cm4gKGxlMS5pc1N1YmplY3QgJiYgIWxlMi5pc1N1YmplY3QpID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb21wYXJlRXZlbnRzKGxlMSwgbGUyKSA9PT0gMSA/IDEgOiAtMTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXG4gIE5PUk1BTDogICAgICAgICAgICAgICAwLCBcbiAgTk9OX0NPTlRSSUJVVElORzogICAgIDEsIFxuICBTQU1FX1RSQU5TSVRJT046ICAgICAgMiwgXG4gIERJRkZFUkVOVF9UUkFOU0lUSU9OOiAzXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlcXVhbHMocDEsIHAyKSB7XG4gIHJldHVybiBwMVswXSA9PT0gcDJbMF0gJiYgcDFbMV0gPT09IHAyWzFdO1xufTsiLCJ2YXIgSU5URVJTRUNUSU9OICAgID0gMDtcbnZhciBVTklPTiAgICAgICAgICAgPSAxO1xudmFyIERJRkZFUkVOQ0UgICAgICA9IDI7XG52YXIgWE9SICAgICAgICAgICAgID0gMztcblxudmFyIEVNUFRZICAgICAgICAgICA9IFtdO1xuXG52YXIgZWRnZVR5cGUgICAgICAgID0gcmVxdWlyZSgnLi9lZGdlX3R5cGUnKTtcblxudmFyIFF1ZXVlICAgICAgICAgICA9IHJlcXVpcmUoJ3RpbnlxdWV1ZScpO1xudmFyIFRyZWUgICAgICAgICAgICA9IHJlcXVpcmUoJ2JpbnRyZWVzJykuUkJUcmVlO1xudmFyIFN3ZWVwRXZlbnQgICAgICA9IHJlcXVpcmUoJy4vc3dlZXBfZXZlbnQnKTtcblxudmFyIGNvbXBhcmVFdmVudHMgICA9IHJlcXVpcmUoJy4vY29tcGFyZV9ldmVudHMnKTtcbnZhciBjb21wYXJlU2VnbWVudHMgPSByZXF1aXJlKCcuL2NvbXBhcmVfc2VnbWVudHMnKTtcbnZhciBpbnRlcnNlY3Rpb24gICAgPSByZXF1aXJlKCcuL3NlZ21lbnRfaW50ZXJzZWN0aW9uJyk7XG52YXIgZXF1YWxzICAgICAgICAgID0gcmVxdWlyZSgnLi9lcXVhbHMnKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEBwYXJhbSAgezxBcnJheS48TnVtYmVyPn0gczFcbiAqIEBwYXJhbSAgezxBcnJheS48TnVtYmVyPn0gczJcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgaXNTdWJqZWN0XG4gKiBAcGFyYW0gIHtRdWV1ZX0gICAgICAgICAgIGV2ZW50UXVldWVcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgYmJveFxuICovXG5mdW5jdGlvbiBwcm9jZXNzU2VnbWVudChzMSwgczIsIGlzU3ViamVjdCwgZGVwdGgsIGV2ZW50UXVldWUsIGJib3gpIHtcbiAgLy8gUG9zc2libGUgZGVnZW5lcmF0ZSBjb25kaXRpb24uXG4gIC8vIGlmIChlcXVhbHMoczEsIHMyKSkgcmV0dXJuO1xuXG4gIHZhciBlMSA9IG5ldyBTd2VlcEV2ZW50KHMxLCBmYWxzZSwgdW5kZWZpbmVkLCBpc1N1YmplY3QpO1xuICB2YXIgZTIgPSBuZXcgU3dlZXBFdmVudChzMiwgZmFsc2UsIGUxLCAgICAgICAgaXNTdWJqZWN0KTtcbiAgZTEub3RoZXJFdmVudCA9IGUyO1xuXG4gIGUxLmNvbnRvdXJJZCA9IGUyLmNvbnRvdXJJZCA9IGRlcHRoO1xuXG4gIGlmIChjb21wYXJlRXZlbnRzKGUxLCBlMikgPiAwKSB7XG4gICAgZTIubGVmdCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgZTEubGVmdCA9IHRydWU7XG4gIH1cblxuICBiYm94WzBdID0gbWluKGJib3hbMF0sIHMxWzBdKTtcbiAgYmJveFsxXSA9IG1pbihiYm94WzFdLCBzMVsxXSk7XG4gIGJib3hbMl0gPSBtYXgoYmJveFsyXSwgczFbMF0pO1xuICBiYm94WzNdID0gbWF4KGJib3hbM10sIHMxWzFdKTtcblxuICAvLyBQdXNoaW5nIGl0IHNvIHRoZSBxdWV1ZSBpcyBzb3J0ZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LFxuICAvLyB3aXRoIG9iamVjdCBvbiB0aGUgbGVmdCBoYXZpbmcgdGhlIGhpZ2hlc3QgcHJpb3JpdHkuXG4gIGV2ZW50UXVldWUucHVzaChlMSk7XG4gIGV2ZW50UXVldWUucHVzaChlMik7XG59XG5cbnZhciBjb250b3VySWQgPSAwO1xuXG5mdW5jdGlvbiBwcm9jZXNzUG9seWdvbihwb2x5Z29uLCBpc1N1YmplY3QsIGRlcHRoLCBxdWV1ZSwgYmJveCkge1xuICB2YXIgaSwgbGVuO1xuICBpZiAodHlwZW9mIHBvbHlnb25bMF1bMF0gPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcG9seWdvbi5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHByb2Nlc3NTZWdtZW50KHBvbHlnb25baV0sIHBvbHlnb25baSArIDFdLCBpc1N1YmplY3QsIGRlcHRoICsgMSwgcXVldWUsIGJib3gpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBwb2x5Z29uLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb250b3VySWQrKztcbiAgICAgIHByb2Nlc3NQb2x5Z29uKHBvbHlnb25baV0sIGlzU3ViamVjdCwgY29udG91cklkLCBxdWV1ZSwgYmJveCk7XG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gZmlsbFF1ZXVlKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gpIHtcbiAgdmFyIGV2ZW50UXVldWUgPSBuZXcgUXVldWUobnVsbCwgY29tcGFyZUV2ZW50cyk7XG4gIGNvbnRvdXJJZCA9IDA7XG5cbiAgcHJvY2Vzc1BvbHlnb24oc3ViamVjdCwgIHRydWUsICAwLCBldmVudFF1ZXVlLCBzYmJveCk7XG4gIHByb2Nlc3NQb2x5Z29uKGNsaXBwaW5nLCBmYWxzZSwgMCwgZXZlbnRRdWV1ZSwgY2Jib3gpO1xuXG4gIHJldHVybiBldmVudFF1ZXVlO1xufVxuXG5cbmZ1bmN0aW9uIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYsIHN3ZWVwTGluZSwgb3BlcmF0aW9uKSB7XG4gIC8vIGNvbXB1dGUgaW5PdXQgYW5kIG90aGVySW5PdXQgZmllbGRzXG4gIGlmIChwcmV2ID09PSBudWxsKSB7XG4gICAgZXZlbnQuaW5PdXQgICAgICA9IGZhbHNlO1xuICAgIGV2ZW50Lm90aGVySW5PdXQgPSB0cnVlO1xuXG4gIC8vIHByZXZpb3VzIGxpbmUgc2VnbWVudCBpbiBzd2VlcGxpbmUgYmVsb25ncyB0byB0aGUgc2FtZSBwb2x5Z29uXG4gIH0gZWxzZSBpZiAoZXZlbnQuaXNTdWJqZWN0ID09PSBwcmV2LmlzU3ViamVjdCkge1xuICAgIGV2ZW50LmluT3V0ICAgICAgPSAhcHJldi5pbk91dDtcbiAgICBldmVudC5vdGhlckluT3V0ID0gcHJldi5vdGhlckluT3V0O1xuXG4gIC8vIHByZXZpb3VzIGxpbmUgc2VnbWVudCBpbiBzd2VlcGxpbmUgYmVsb25ncyB0byB0aGUgY2xpcHBpbmcgcG9seWdvblxuICB9IGVsc2Uge1xuICAgIGV2ZW50LmluT3V0ICAgICAgPSAhcHJldi5vdGhlckluT3V0O1xuICAgIGV2ZW50Lm90aGVySW5PdXQgPSBwcmV2LmlzVmVydGljYWwoKSA/ICFwcmV2LmluT3V0IDogcHJldi5pbk91dDtcbiAgfVxuXG4gIC8vIGNvbXB1dGUgcHJldkluUmVzdWx0IGZpZWxkXG4gIGlmIChwcmV2KSB7XG4gICAgZXZlbnQucHJldkluUmVzdWx0ID0gKCFpblJlc3VsdChwcmV2LCBvcGVyYXRpb24pIHx8IHByZXYuaXNWZXJ0aWNhbCgpKSA/XG4gICAgICAgcHJldi5wcmV2SW5SZXN1bHQgOiBwcmV2O1xuICB9XG4gIC8vIGNoZWNrIGlmIHRoZSBsaW5lIHNlZ21lbnQgYmVsb25ncyB0byB0aGUgQm9vbGVhbiBvcGVyYXRpb25cbiAgZXZlbnQuaW5SZXN1bHQgPSBpblJlc3VsdChldmVudCwgb3BlcmF0aW9uKTtcbn1cblxuXG5mdW5jdGlvbiBpblJlc3VsdChldmVudCwgb3BlcmF0aW9uKSB7XG4gIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgIGNhc2UgZWRnZVR5cGUuTk9STUFMOlxuICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICAgICAgY2FzZSBJTlRFUlNFQ1RJT046XG4gICAgICAgICAgcmV0dXJuICFldmVudC5vdGhlckluT3V0O1xuICAgICAgICBjYXNlIFVOSU9OOlxuICAgICAgICAgIHJldHVybiBldmVudC5vdGhlckluT3V0O1xuICAgICAgICBjYXNlIERJRkZFUkVOQ0U6XG4gICAgICAgICAgcmV0dXJuIChldmVudC5pc1N1YmplY3QgJiYgZXZlbnQub3RoZXJJbk91dCkgfHxcbiAgICAgICAgICAgICAgICAgKCFldmVudC5pc1N1YmplY3QgJiYgIWV2ZW50Lm90aGVySW5PdXQpO1xuICAgICAgICBjYXNlIFhPUjpcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICBjYXNlIGVkZ2VUeXBlLlNBTUVfVFJBTlNJVElPTjpcbiAgICAgIHJldHVybiBvcGVyYXRpb24gPT09IElOVEVSU0VDVElPTiB8fCBvcGVyYXRpb24gPT09IFVOSU9OO1xuICAgIGNhc2UgZWRnZVR5cGUuRElGRkVSRU5UX1RSQU5TSVRJT046XG4gICAgICByZXR1cm4gb3BlcmF0aW9uID09PSBESUZGRVJFTkNFO1xuICAgIGNhc2UgZWRnZVR5cGUuTk9OX0NPTlRSSUJVVElORzpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBzZTFcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IHNlMlxuICogQHBhcmFtICB7UXVldWV9ICAgICAgcXVldWVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gcG9zc2libGVJbnRlcnNlY3Rpb24oc2UxLCBzZTIsIHF1ZXVlKSB7XG4gIC8vIHRoYXQgZGlzYWxsb3dzIHNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25zLFxuICAvLyBkaWQgY29zdCB1cyBoYWxmIGEgZGF5LCBzbyBJJ2xsIGxlYXZlIGl0XG4gIC8vIG91dCBvZiByZXNwZWN0XG4gIC8vIGlmIChzZTEuaXNTdWJqZWN0ID09PSBzZTIuaXNTdWJqZWN0KSByZXR1cm47XG5cbiAgdmFyIGludGVyID0gaW50ZXJzZWN0aW9uKFxuICAgIHNlMS5wb2ludCwgc2UxLm90aGVyRXZlbnQucG9pbnQsXG4gICAgc2UyLnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludFxuICApO1xuXG4gIHZhciBuaW50ZXJzZWN0aW9ucyA9IGludGVyID8gaW50ZXIubGVuZ3RoIDogMDtcbiAgaWYgKG5pbnRlcnNlY3Rpb25zID09PSAwKSByZXR1cm4gMDsgLy8gbm8gaW50ZXJzZWN0aW9uXG5cbiAgLy8gdGhlIGxpbmUgc2VnbWVudHMgaW50ZXJzZWN0IGF0IGFuIGVuZHBvaW50IG9mIGJvdGggbGluZSBzZWdtZW50c1xuICBpZiAoKG5pbnRlcnNlY3Rpb25zID09PSAxKSAmJlxuICAgICAgKGVxdWFscyhzZTEucG9pbnQsIHNlMi5wb2ludCkgfHxcbiAgICAgICBlcXVhbHMoc2UxLm90aGVyRXZlbnQucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50KSkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChuaW50ZXJzZWN0aW9ucyA9PT0gMiAmJiBzZTEuaXNTdWJqZWN0ID09PSBzZTIuaXNTdWJqZWN0KXtcbiAgICBpZihzZTEuY29udG91cklkID09PSBzZTIuY29udG91cklkKXtcbiAgICBjb25zb2xlLndhcm4oJ0VkZ2VzIG9mIHRoZSBzYW1lIHBvbHlnb24gb3ZlcmxhcCcsXG4gICAgICBzZTEucG9pbnQsIHNlMS5vdGhlckV2ZW50LnBvaW50LCBzZTIucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50KTtcbiAgICB9XG4gICAgLy90aHJvdyBuZXcgRXJyb3IoJ0VkZ2VzIG9mIHRoZSBzYW1lIHBvbHlnb24gb3ZlcmxhcCcpO1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLy8gVGhlIGxpbmUgc2VnbWVudHMgYXNzb2NpYXRlZCB0byBzZTEgYW5kIHNlMiBpbnRlcnNlY3RcbiAgaWYgKG5pbnRlcnNlY3Rpb25zID09PSAxKSB7XG5cbiAgICAvLyBpZiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50IGlzIG5vdCBhbiBlbmRwb2ludCBvZiBzZTFcbiAgICBpZiAoIWVxdWFscyhzZTEucG9pbnQsIGludGVyWzBdKSAmJiAhZXF1YWxzKHNlMS5vdGhlckV2ZW50LnBvaW50LCBpbnRlclswXSkpIHtcbiAgICAgIGRpdmlkZVNlZ21lbnQoc2UxLCBpbnRlclswXSwgcXVldWUpO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgaXMgbm90IGFuIGVuZHBvaW50IG9mIHNlMlxuICAgIGlmICghZXF1YWxzKHNlMi5wb2ludCwgaW50ZXJbMF0pICYmICFlcXVhbHMoc2UyLm90aGVyRXZlbnQucG9pbnQsIGludGVyWzBdKSkge1xuICAgICAgZGl2aWRlU2VnbWVudChzZTIsIGludGVyWzBdLCBxdWV1ZSk7XG4gICAgfVxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gVGhlIGxpbmUgc2VnbWVudHMgYXNzb2NpYXRlZCB0byBzZTEgYW5kIHNlMiBvdmVybGFwXG4gIHZhciBldmVudHMgICAgICAgID0gW107XG4gIHZhciBsZWZ0Q29pbmNpZGUgID0gZmFsc2U7XG4gIHZhciByaWdodENvaW5jaWRlID0gZmFsc2U7XG5cbiAgaWYgKGVxdWFscyhzZTEucG9pbnQsIHNlMi5wb2ludCkpIHtcbiAgICBsZWZ0Q29pbmNpZGUgPSB0cnVlOyAvLyBsaW5rZWRcbiAgfSBlbHNlIGlmIChjb21wYXJlRXZlbnRzKHNlMSwgc2UyKSA9PT0gMSkge1xuICAgIGV2ZW50cy5wdXNoKHNlMiwgc2UxKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHMucHVzaChzZTEsIHNlMik7XG4gIH1cblxuICBpZiAoZXF1YWxzKHNlMS5vdGhlckV2ZW50LnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludCkpIHtcbiAgICByaWdodENvaW5jaWRlID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChjb21wYXJlRXZlbnRzKHNlMS5vdGhlckV2ZW50LCBzZTIub3RoZXJFdmVudCkgPT09IDEpIHtcbiAgICBldmVudHMucHVzaChzZTIub3RoZXJFdmVudCwgc2UxLm90aGVyRXZlbnQpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5wdXNoKHNlMS5vdGhlckV2ZW50LCBzZTIub3RoZXJFdmVudCk7XG4gIH1cblxuICBpZiAoKGxlZnRDb2luY2lkZSAmJiByaWdodENvaW5jaWRlKSB8fCBsZWZ0Q29pbmNpZGUpIHtcbiAgICAvLyBib3RoIGxpbmUgc2VnbWVudHMgYXJlIGVxdWFsIG9yIHNoYXJlIHRoZSBsZWZ0IGVuZHBvaW50XG4gICAgc2UxLnR5cGUgPSBlZGdlVHlwZS5OT05fQ09OVFJJQlVUSU5HO1xuICAgIHNlMi50eXBlID0gKHNlMS5pbk91dCA9PT0gc2UyLmluT3V0KSA/XG4gICAgICBlZGdlVHlwZS5TQU1FX1RSQU5TSVRJT04gOlxuICAgICAgZWRnZVR5cGUuRElGRkVSRU5UX1RSQU5TSVRJT047XG5cbiAgICBpZiAobGVmdENvaW5jaWRlICYmICFyaWdodENvaW5jaWRlKSB7XG4gICAgICAvLyBob25lc3RseSBubyBpZGVhLCBidXQgY2hhbmdpbmcgZXZlbnRzIHNlbGVjdGlvbiBmcm9tIFsyLCAxXVxuICAgICAgLy8gdG8gWzAsIDFdIGZpeGVzIHRoZSBvdmVybGFwcGluZyBzZWxmLWludGVyc2VjdGluZyBwb2x5Z29ucyBpc3N1ZVxuICAgICAgZGl2aWRlU2VnbWVudChldmVudHNbMF0ub3RoZXJFdmVudCwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gICAgfVxuICAgIHJldHVybiAyO1xuICB9XG5cbiAgLy8gdGhlIGxpbmUgc2VnbWVudHMgc2hhcmUgdGhlIHJpZ2h0IGVuZHBvaW50XG4gIGlmIChyaWdodENvaW5jaWRlKSB7XG4gICAgZGl2aWRlU2VnbWVudChldmVudHNbMF0sIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICAgIHJldHVybiAzO1xuICB9XG5cbiAgLy8gbm8gbGluZSBzZWdtZW50IGluY2x1ZGVzIHRvdGFsbHkgdGhlIG90aGVyIG9uZVxuICBpZiAoZXZlbnRzWzBdICE9PSBldmVudHNbM10ub3RoZXJFdmVudCkge1xuICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1sxXSwgZXZlbnRzWzJdLnBvaW50LCBxdWV1ZSk7XG4gICAgcmV0dXJuIDM7XG4gIH1cblxuICAvLyBvbmUgbGluZSBzZWdtZW50IGluY2x1ZGVzIHRoZSBvdGhlciBvbmVcbiAgZGl2aWRlU2VnbWVudChldmVudHNbMF0sIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICBkaXZpZGVTZWdtZW50KGV2ZW50c1szXS5vdGhlckV2ZW50LCBldmVudHNbMl0ucG9pbnQsIHF1ZXVlKTtcblxuICByZXR1cm4gMztcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IHNlXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcFxuICogQHBhcmFtICB7UXVldWV9IHF1ZXVlXG4gKiBAcmV0dXJuIHtRdWV1ZX1cbiAqL1xuZnVuY3Rpb24gZGl2aWRlU2VnbWVudChzZSwgcCwgcXVldWUpICB7XG4gIHZhciByID0gbmV3IFN3ZWVwRXZlbnQocCwgZmFsc2UsIHNlLCAgICAgICAgICAgIHNlLmlzU3ViamVjdCk7XG4gIHZhciBsID0gbmV3IFN3ZWVwRXZlbnQocCwgdHJ1ZSwgIHNlLm90aGVyRXZlbnQsIHNlLmlzU3ViamVjdCk7XG5cbiAgLy8gYXZvaWQgYSByb3VuZGluZyBlcnJvci4gVGhlIGxlZnQgZXZlbnQgd291bGQgYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSByaWdodCBldmVudFxuICBpZiAoY29tcGFyZUV2ZW50cyhsLCBzZS5vdGhlckV2ZW50KSA+IDApIHtcbiAgICBzZS5vdGhlckV2ZW50LmxlZnQgPSB0cnVlO1xuICAgIGwubGVmdCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gYXZvaWQgYSByb3VuZGluZyBlcnJvci4gVGhlIGxlZnQgZXZlbnQgd291bGQgYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSByaWdodCBldmVudFxuICAvLyBpZiAoY29tcGFyZUV2ZW50cyhzZSwgcikgPiAwKSB7fVxuXG4gIHNlLm90aGVyRXZlbnQub3RoZXJFdmVudCA9IGw7XG4gIHNlLm90aGVyRXZlbnQgPSByO1xuXG4gIHF1ZXVlLnB1c2gobCk7XG4gIHF1ZXVlLnB1c2gocik7XG5cbiAgcmV0dXJuIHF1ZXVlO1xufVxuXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzLCBuby1kZWJ1Z2dlciAqL1xuZnVuY3Rpb24gaXRlcmF0b3JFcXVhbHMoaXQxLCBpdDIpIHtcbiAgcmV0dXJuIGl0MS5fY3Vyc29yID09PSBpdDIuX2N1cnNvcjtcbn1cblxuXG5mdW5jdGlvbiBfcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgcG9zLCBldmVudCkge1xuICB2YXIgbWFwID0gd2luZG93Lm1hcDtcbiAgaWYgKCFtYXApIHJldHVybjtcbiAgaWYgKHdpbmRvdy5zd3MpIHdpbmRvdy5zd3MuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgbWFwLnJlbW92ZUxheWVyKHApO1xuICB9KTtcbiAgd2luZG93LnN3cyA9IFtdO1xuICBzd2VlcExpbmUuZWFjaChmdW5jdGlvbihlKSB7XG4gICAgdmFyIHBvbHkgPSBMLnBvbHlsaW5lKFtlLnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpLCBlLm90aGVyRXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCldLCB7IGNvbG9yOiAnZ3JlZW4nIH0pLmFkZFRvKG1hcCk7XG4gICAgd2luZG93LnN3cy5wdXNoKHBvbHkpO1xuICB9KTtcblxuICBpZiAod2luZG93LnZ0KSBtYXAucmVtb3ZlTGF5ZXIod2luZG93LnZ0KTtcbiAgdmFyIHYgPSBwb3Muc2xpY2UoKTtcbiAgdmFyIGIgPSBtYXAuZ2V0Qm91bmRzKCk7XG4gIHdpbmRvdy52dCA9IEwucG9seWxpbmUoW1tiLmdldE5vcnRoKCksIHZbMF1dLCBbYi5nZXRTb3V0aCgpLCB2WzBdXV0sIHtjb2xvcjogJ2dyZWVuJywgd2VpZ2h0OiAxfSkuYWRkVG8obWFwKTtcblxuICBpZiAod2luZG93LnBzKSBtYXAucmVtb3ZlTGF5ZXIod2luZG93LnBzKTtcbiAgd2luZG93LnBzID0gTC5wb2x5bGluZShbZXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCksIGV2ZW50Lm90aGVyRXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCldLCB7Y29sb3I6ICdibGFjaycsIHdlaWdodDogOSwgb3BhY2l0eTogMC40fSkuYWRkVG8obWFwKTtcbiAgZGVidWdnZXI7XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzLCBuby1kZWJ1Z2dlciAqL1xuXG5cbmZ1bmN0aW9uIHN1YmRpdmlkZVNlZ21lbnRzKGV2ZW50UXVldWUsIHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbikge1xuICB2YXIgc29ydGVkRXZlbnRzID0gW107XG4gIHZhciBwcmV2LCBuZXh0O1xuXG4gIHZhciBzd2VlcExpbmUgPSBuZXcgVHJlZShjb21wYXJlU2VnbWVudHMpO1xuICB2YXIgc29ydGVkRXZlbnRzID0gW107XG5cbiAgdmFyIHJpZ2h0Ym91bmQgPSBtaW4oc2Jib3hbMl0sIGNiYm94WzJdKTtcblxuICB2YXIgcHJldiwgbmV4dDtcblxuICB3aGlsZSAoZXZlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICB2YXIgZXZlbnQgPSBldmVudFF1ZXVlLnBvcCgpO1xuICAgIHNvcnRlZEV2ZW50cy5wdXNoKGV2ZW50KTtcblxuICAgIC8vIG9wdGltaXphdGlvbiBieSBiYm94ZXMgZm9yIGludGVyc2VjdGlvbiBhbmQgZGlmZmVyZW5jZSBnb2VzIGhlcmVcbiAgICBpZiAoKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OICYmIGV2ZW50LnBvaW50WzBdID4gcmlnaHRib3VuZCkgfHxcbiAgICAgICAgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSAgICYmIGV2ZW50LnBvaW50WzBdID4gc2Jib3hbMl0pKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQubGVmdCkge1xuICAgICAgc3dlZXBMaW5lLmluc2VydChldmVudCk7XG4gICAgICAvLyBfcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgZXZlbnQucG9pbnQsIGV2ZW50KTtcblxuICAgICAgbmV4dCA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG4gICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcbiAgICAgIGV2ZW50Lml0ZXJhdG9yID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcblxuICAgICAgaWYgKHByZXYuZGF0YSgpICE9PSBzd2VlcExpbmUubWluKCkpIHtcbiAgICAgICAgcHJldi5wcmV2KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgIHByZXYubmV4dCgpO1xuICAgICAgfVxuICAgICAgbmV4dC5uZXh0KCk7XG5cbiAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG5cbiAgICAgIGlmIChuZXh0LmRhdGEoKSkge1xuICAgICAgICBpZiAocG9zc2libGVJbnRlcnNlY3Rpb24oZXZlbnQsIG5leHQuZGF0YSgpLCBldmVudFF1ZXVlKSA9PT0gMikge1xuICAgICAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgbmV4dC5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldi5kYXRhKCkpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlSW50ZXJzZWN0aW9uKHByZXYuZGF0YSgpLCBldmVudCwgZXZlbnRRdWV1ZSkgPT09IDIpIHtcbiAgICAgICAgICB2YXIgcHJldnByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIocHJldi5kYXRhKCkpO1xuICAgICAgICAgIGlmIChwcmV2cHJldi5kYXRhKCkgIT09IHN3ZWVwTGluZS5taW4oKSkge1xuICAgICAgICAgICAgcHJldnByZXYucHJldigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmV2cHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihzd2VlcExpbmUubWF4KCkpO1xuICAgICAgICAgICAgcHJldnByZXYubmV4dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb21wdXRlRmllbGRzKHByZXYuZGF0YSgpLCBwcmV2cHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50ID0gZXZlbnQub3RoZXJFdmVudDtcbiAgICAgIG5leHQgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG5cbiAgICAgIC8vIF9yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBldmVudC5vdGhlckV2ZW50LnBvaW50LCBldmVudCk7XG5cbiAgICAgIGlmICghKHByZXYgJiYgbmV4dCkpIGNvbnRpbnVlO1xuXG4gICAgICBpZiAocHJldi5kYXRhKCkgIT09IHN3ZWVwTGluZS5taW4oKSkge1xuICAgICAgICBwcmV2LnByZXYoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoc3dlZXBMaW5lLm1heCgpKTtcbiAgICAgICAgcHJldi5uZXh0KCk7XG4gICAgICB9XG4gICAgICBuZXh0Lm5leHQoKTtcbiAgICAgIHN3ZWVwTGluZS5yZW1vdmUoZXZlbnQpO1xuXG4gICAgICAvL19yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBldmVudC5vdGhlckV2ZW50LnBvaW50LCBldmVudCk7XG5cbiAgICAgIGlmIChuZXh0LmRhdGEoKSAmJiBwcmV2LmRhdGEoKSkge1xuICAgICAgICBwb3NzaWJsZUludGVyc2VjdGlvbihwcmV2LmRhdGEoKSwgbmV4dC5kYXRhKCksIGV2ZW50UXVldWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc29ydGVkRXZlbnRzO1xufVxuXG5cbmZ1bmN0aW9uIHN3YXAgKGFyciwgaSwgbikge1xuICB2YXIgdGVtcCA9IGFycltpXTtcbiAgYXJyW2ldID0gYXJyW25dO1xuICBhcnJbbl0gPSB0ZW1wO1xufVxuXG5cbmZ1bmN0aW9uIGNoYW5nZU9yaWVudGF0aW9uKGNvbnRvdXIpIHtcbiAgcmV0dXJuIGNvbnRvdXIucmV2ZXJzZSgpO1xufVxuXG5cbmZ1bmN0aW9uIGlzQXJyYXkgKGFycikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cblxuZnVuY3Rpb24gYWRkSG9sZShjb250b3VyLCBpZHgpIHtcbiAgaWYgKCFpc0FycmF5KGNvbnRvdXJbMF1bMF0pKSB7XG4gICAgY29udG91ciA9IFtjb250b3VyXTtcbiAgfVxuICBjb250b3VyW2lkeF0gPSBbXTtcbiAgcmV0dXJuIGNvbnRvdXI7XG59XG5cblxuZnVuY3Rpb24gY29ubmVjdEVkZ2VzKHNvcnRlZEV2ZW50cykge1xuICAvLyBjb3B5IHRoZSBldmVudHMgaW4gdGhlIHJlc3VsdCBwb2x5Z29uIHRvIHJlc3VsdEV2ZW50cyBhcnJheVxuICB2YXIgcmVzdWx0RXZlbnRzID0gW107XG4gIHZhciBldmVudCwgaSwgbGVuO1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHNvcnRlZEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGV2ZW50ID0gc29ydGVkRXZlbnRzW2ldO1xuICAgIGlmICgoZXZlbnQubGVmdCAmJiBldmVudC5pblJlc3VsdCkgfHxcbiAgICAgICghZXZlbnQubGVmdCAmJiBldmVudC5vdGhlckV2ZW50LmluUmVzdWx0KSkge1xuICAgICAgcmVzdWx0RXZlbnRzLnB1c2goZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIER1ZSB0byBvdmVybGFwcGluZyBlZGdlcyB0aGUgcmVzdWx0RXZlbnRzIGFycmF5IGNhbiBiZSBub3Qgd2hvbGx5IHNvcnRlZFxuICB2YXIgc29ydGVkID0gZmFsc2U7XG4gIHdoaWxlICghc29ydGVkKSB7XG4gICAgc29ydGVkID0gdHJ1ZTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZXN1bHRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICgoaSArIDEpIDwgbGVuICYmXG4gICAgICAgIGNvbXBhcmVFdmVudHMocmVzdWx0RXZlbnRzW2ldLCByZXN1bHRFdmVudHNbaSArIDFdKSA9PT0gMSkge1xuICAgICAgICBzd2FwKHJlc3VsdEV2ZW50cywgaSwgaSArIDEpO1xuICAgICAgICBzb3J0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwLCBsZW4gPSByZXN1bHRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICByZXN1bHRFdmVudHNbaV0ucG9zID0gaTtcbiAgICBpZiAoIXJlc3VsdEV2ZW50c1tpXS5sZWZ0KSB7XG4gICAgICB2YXIgdGVtcCA9IHJlc3VsdEV2ZW50c1tpXS5wb3M7XG4gICAgICByZXN1bHRFdmVudHNbaV0ucG9zID0gcmVzdWx0RXZlbnRzW2ldLm90aGVyRXZlbnQucG9zO1xuICAgICAgcmVzdWx0RXZlbnRzW2ldLm90aGVyRXZlbnQucG9zID0gdGVtcDtcbiAgICB9XG4gIH1cblxuICAvLyBcImZhbHNlXCItZmlsbGVkIGFycmF5XG4gIHZhciBwcm9jZXNzZWQgPSBBcnJheShyZXN1bHRFdmVudHMubGVuZ3RoKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIHZhciBkZXB0aCAgPSBbXTtcbiAgdmFyIGhvbGVPZiA9IFtdO1xuICB2YXIgaXNIb2xlID0ge307XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKHByb2Nlc3NlZFtpXSkgY29udGludWU7XG5cbiAgICB2YXIgY29udG91ciA9IFtdO1xuICAgIHJlc3VsdC5wdXNoKGNvbnRvdXIpO1xuXG4gICAgdmFyIGNvbnRvdXJJZCA9IHJlc3VsdC5sZW5ndGggLSAxO1xuICAgIGRlcHRoLnB1c2goMCk7XG4gICAgaG9sZU9mLnB1c2goLTEpO1xuXG5cbiAgICBpZiAocmVzdWx0RXZlbnRzW2ldLnByZXZJblJlc3VsdCkge1xuICAgICAgdmFyIGxvd2VyQ29udG91cklkID0gcmVzdWx0RXZlbnRzW2ldLnByZXZJblJlc3VsdC5jb250b3VySWQ7XG4gICAgICBpZiAoIXJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQucmVzdWx0SW5PdXQpIHtcbiAgICAgICAgYWRkSG9sZShyZXN1bHRbbG93ZXJDb250b3VySWRdLCBjb250b3VySWQpO1xuICAgICAgICBob2xlT2ZbY29udG91cklkXSA9IGxvd2VyQ29udG91cklkO1xuICAgICAgICBkZXB0aFtjb250b3VySWRdICA9IGRlcHRoW2xvd2VyQ29udG91cklkXSArIDE7XG4gICAgICAgIGlzSG9sZVtjb250b3VySWRdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNIb2xlW2xvd2VyQ29udG91cklkXSkge1xuICAgICAgICBhZGRIb2xlKHJlc3VsdFtob2xlT2ZbbG93ZXJDb250b3VySWRdXSwgY29udG91cklkKTtcbiAgICAgICAgaG9sZU9mW2NvbnRvdXJJZF0gPSBob2xlT2ZbbG93ZXJDb250b3VySWRdO1xuICAgICAgICBkZXB0aFtjb250b3VySWRdICA9IGRlcHRoW2xvd2VyQ29udG91cklkXTtcbiAgICAgICAgaXNIb2xlW2NvbnRvdXJJZF0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwb3MgPSBpO1xuICAgIHZhciBpbml0aWFsID0gcmVzdWx0RXZlbnRzW2ldLnBvaW50O1xuICAgIGNvbnRvdXIucHVzaChpbml0aWFsKTtcblxuICAgIHdoaWxlIChwb3MgPj0gaSkge1xuICAgICAgcHJvY2Vzc2VkW3Bvc10gPSB0cnVlO1xuXG4gICAgICBpZiAocmVzdWx0RXZlbnRzW3Bvc10ubGVmdCkge1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5yZXN1bHRJbk91dCA9IGZhbHNlO1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5jb250b3VySWQgICA9IGNvbnRvdXJJZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQucmVzdWx0SW5PdXQgPSB0cnVlO1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LmNvbnRvdXJJZCAgID0gY29udG91cklkO1xuICAgICAgfVxuXG4gICAgICBwb3MgPSByZXN1bHRFdmVudHNbcG9zXS5wb3M7XG4gICAgICBwcm9jZXNzZWRbcG9zXSA9IHRydWU7XG5cbiAgICAgIGNvbnRvdXIucHVzaChyZXN1bHRFdmVudHNbcG9zXS5wb2ludCk7XG4gICAgICBwb3MgPSBuZXh0UG9zKHBvcywgcmVzdWx0RXZlbnRzLCBwcm9jZXNzZWQpO1xuICAgIH1cblxuICAgIHBvcyA9IHBvcyA9PT0gLTEgPyBpIDogcG9zO1xuXG4gICAgcHJvY2Vzc2VkW3Bvc10gPSBwcm9jZXNzZWRbcmVzdWx0RXZlbnRzW3Bvc10ucG9zXSA9IHRydWU7XG4gICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5yZXN1bHRJbk91dCA9IHRydWU7XG4gICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5jb250b3VySWQgICA9IGNvbnRvdXJJZDtcblxuXG5cblxuICAgIC8vIGRlcHRoIGlzIGV2ZW5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlICovXG4gICAgaWYgKGRlcHRoW2NvbnRvdXJJZF0gJiAxKSB7XG4gICAgICBjaGFuZ2VPcmllbnRhdGlvbihjb250b3VyKTtcbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1iaXR3aXNlICovXG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBwb3NcbiAqIEBwYXJhbSAge0FycmF5LjxTd2VlcEV2ZW50Pn0gcmVzdWx0RXZlbnRzXG4gKiBAcGFyYW0gIHtBcnJheS48Qm9vbGVhbj59ICAgIHByb2Nlc3NlZFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBuZXh0UG9zKHBvcywgcmVzdWx0RXZlbnRzLCBwcm9jZXNzZWQpIHtcbiAgdmFyIG5ld1BvcyA9IHBvcyArIDE7XG4gIHZhciBsZW5ndGggPSByZXN1bHRFdmVudHMubGVuZ3RoO1xuICB3aGlsZSAobmV3UG9zIDwgbGVuZ3RoICYmXG4gICAgICAgICBlcXVhbHMocmVzdWx0RXZlbnRzW25ld1Bvc10ucG9pbnQsIHJlc3VsdEV2ZW50c1twb3NdLnBvaW50KSkge1xuICAgIGlmICghcHJvY2Vzc2VkW25ld1Bvc10pIHtcbiAgICAgIHJldHVybiBuZXdQb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1BvcyA9IG5ld1BvcyArIDE7XG4gICAgfVxuICB9XG5cbiAgbmV3UG9zID0gcG9zIC0gMTtcblxuICB3aGlsZSAocHJvY2Vzc2VkW25ld1Bvc10pIHtcbiAgICBuZXdQb3MgPSBuZXdQb3MgLSAxO1xuICB9XG4gIHJldHVybiBuZXdQb3M7XG59XG5cblxuZnVuY3Rpb24gdHJpdmlhbE9wZXJhdGlvbihzdWJqZWN0LCBjbGlwcGluZywgb3BlcmF0aW9uKSB7XG4gIHZhciByZXN1bHQgPSBudWxsO1xuICBpZiAoc3ViamVjdC5sZW5ndGggKiBjbGlwcGluZy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04pIHtcbiAgICAgIHJlc3VsdCA9IEVNUFRZO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFKSB7XG4gICAgICByZXN1bHQgPSBzdWJqZWN0O1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBVTklPTiB8fCBvcGVyYXRpb24gPT09IFhPUikge1xuICAgICAgcmVzdWx0ID0gKHN1YmplY3QubGVuZ3RoID09PSAwKSA/IGNsaXBwaW5nIDogc3ViamVjdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5mdW5jdGlvbiBjb21wYXJlQkJveGVzKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbikge1xuICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgaWYgKHNiYm94WzBdID4gY2Jib3hbMl0gfHxcbiAgICAgIGNiYm94WzBdID4gc2Jib3hbMl0gfHxcbiAgICAgIHNiYm94WzFdID4gY2Jib3hbM10gfHxcbiAgICAgIGNiYm94WzFdID4gc2Jib3hbM10pIHtcbiAgICBpZiAob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04pIHtcbiAgICAgIHJlc3VsdCA9IEVNUFRZO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFKSB7XG4gICAgICByZXN1bHQgPSBzdWJqZWN0O1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBVTklPTiB8fCBvcGVyYXRpb24gPT09IFhPUikge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdC5jb25jYXQoY2xpcHBpbmcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmZ1bmN0aW9uIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbikge1xuICB2YXIgdHJpdmlhbCA9IHRyaXZpYWxPcGVyYXRpb24oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbik7XG4gIGlmICh0cml2aWFsKSB7XG4gICAgcmV0dXJuIHRyaXZpYWwgPT09IEVNUFRZID8gbnVsbCA6IHRyaXZpYWw7XG4gIH1cbiAgdmFyIHNiYm94ID0gW0luZmluaXR5LCBJbmZpbml0eSwgLUluZmluaXR5LCAtSW5maW5pdHldO1xuICB2YXIgY2Jib3ggPSBbSW5maW5pdHksIEluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eV07XG5cbiAgdmFyIGV2ZW50UXVldWUgPSBmaWxsUXVldWUoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCk7XG5cbiAgdHJpdmlhbCA9IGNvbXBhcmVCQm94ZXMoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKTtcbiAgaWYgKHRyaXZpYWwpIHtcbiAgICByZXR1cm4gdHJpdmlhbCA9PT0gRU1QVFkgPyBudWxsIDogdHJpdmlhbDtcbiAgfVxuICB2YXIgc29ydGVkRXZlbnRzID0gc3ViZGl2aWRlU2VnbWVudHMoZXZlbnRRdWV1ZSwgc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKTtcbiAgcmV0dXJuIGNvbm5lY3RFZGdlcyhzb3J0ZWRFdmVudHMpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gYm9vbGVhbjtcblxuXG5tb2R1bGUuZXhwb3J0cy51bmlvbiA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBVTklPTik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLmRpZmYgPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgRElGRkVSRU5DRSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLnhvciA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBYT1IpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgSU5URVJTRUNUSU9OKTtcbn07XG5cblxuLyoqXG4gKiBAZW51bSB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cy5vcGVyYXRpb25zID0ge1xuICBJTlRFUlNFQ1RJT046IElOVEVSU0VDVElPTixcbiAgRElGRkVSRU5DRTogICBESUZGRVJFTkNFLFxuICBVTklPTjogICAgICAgIFVOSU9OLFxuICBYT1I6ICAgICAgICAgIFhPUlxufTtcblxuXG4vLyBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMuZmlsbFF1ZXVlICAgICAgICAgICAgPSBmaWxsUXVldWU7XG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlRmllbGRzICAgICAgICA9IGNvbXB1dGVGaWVsZHM7XG5tb2R1bGUuZXhwb3J0cy5zdWJkaXZpZGVTZWdtZW50cyAgICA9IHN1YmRpdmlkZVNlZ21lbnRzO1xubW9kdWxlLmV4cG9ydHMuZGl2aWRlU2VnbWVudCAgICAgICAgPSBkaXZpZGVTZWdtZW50O1xubW9kdWxlLmV4cG9ydHMucG9zc2libGVJbnRlcnNlY3Rpb24gPSBwb3NzaWJsZUludGVyc2VjdGlvbjtcbiIsInZhciBFUFNJTE9OID0gMWUtOTtcblxuLyoqXG4gKiBGaW5kcyB0aGUgbWFnbml0dWRlIG9mIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzIChpZiB3ZSBwcmV0ZW5kXG4gKiB0aGV5J3JlIGluIHRocmVlIGRpbWVuc2lvbnMpXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgRmlyc3QgdmVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gYiBTZWNvbmQgdmVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge051bWJlcn0gVGhlIG1hZ25pdHVkZSBvZiB0aGUgY3Jvc3MgcHJvZHVjdFxuICovXG5mdW5jdGlvbiBrcm9zc1Byb2R1Y3QoYSwgYikge1xuICByZXR1cm4gYVswXSAqIGJbMV0gLSBhWzFdICogYlswXTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgRmlyc3QgdmVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gYiBTZWNvbmQgdmVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge051bWJlcn0gVGhlIGRvdCBwcm9kdWN0XG4gKi9cbmZ1bmN0aW9uIGRvdFByb2R1Y3QoYSwgYikge1xuICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgaW50ZXJzZWN0aW9uIChpZiBhbnkpIGJldHdlZW4gdHdvIGxpbmUgc2VnbWVudHMgYSBhbmQgYiwgZ2l2ZW4gdGhlXG4gKiBsaW5lIHNlZ21lbnRzJyBlbmQgcG9pbnRzIGExLCBhMiBhbmQgYjEsIGIyLlxuICpcbiAqIFRoaXMgYWxnb3JpdGhtIGlzIGJhc2VkIG9uIFNjaG5laWRlciBhbmQgRWJlcmx5LlxuICogaHR0cDovL3d3dy5jaW1lYy5vcmcuYXIvfm5jYWx2by9TY2huZWlkZXJfRWJlcmx5LnBkZlxuICogUGFnZSAyNDQuXG4gKlxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYTEgcG9pbnQgb2YgZmlyc3QgbGluZVxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYTIgcG9pbnQgb2YgZmlyc3QgbGluZVxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYjEgcG9pbnQgb2Ygc2Vjb25kIGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGIyIHBvaW50IG9mIHNlY29uZCBsaW5lXG4gKiBAcGFyYW0ge0Jvb2xlYW49fSAgICAgICBub0VuZHBvaW50VG91Y2ggd2hldGhlciB0byBza2lwIHNpbmdsZSB0b3VjaHBvaW50c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtZWFuaW5nIGNvbm5lY3RlZCBzZWdtZW50cykgYXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3Rpb25zXG4gKiBAcmV0dXJucyB7QXJyYXkuPEFycmF5LjxOdW1iZXI+PnxOdWxsfSBJZiB0aGUgbGluZXMgaW50ZXJzZWN0LCB0aGUgcG9pbnQgb2ZcbiAqIGludGVyc2VjdGlvbi4gSWYgdGhleSBvdmVybGFwLCB0aGUgdHdvIGVuZCBwb2ludHMgb2YgdGhlIG92ZXJsYXBwaW5nIHNlZ21lbnQuXG4gKiBPdGhlcndpc2UsIG51bGwuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYTEsIGEyLCBiMSwgYjIsIG5vRW5kcG9pbnRUb3VjaCkge1xuICAvLyBUaGUgYWxnb3JpdGhtIGV4cGVjdHMgb3VyIGxpbmVzIGluIHRoZSBmb3JtIFAgKyBzZCwgd2hlcmUgUCBpcyBhIHBvaW50LFxuICAvLyBzIGlzIG9uIHRoZSBpbnRlcnZhbCBbMCwgMV0sIGFuZCBkIGlzIGEgdmVjdG9yLlxuICAvLyBXZSBhcmUgcGFzc2VkIHR3byBwb2ludHMuIFAgY2FuIGJlIHRoZSBmaXJzdCBwb2ludCBvZiBlYWNoIHBhaXIuIFRoZVxuICAvLyB2ZWN0b3IsIHRoZW4sIGNvdWxkIGJlIHRob3VnaHQgb2YgYXMgdGhlIGRpc3RhbmNlIChpbiB4IGFuZCB5IGNvbXBvbmVudHMpXG4gIC8vIGZyb20gdGhlIGZpcnN0IHBvaW50IHRvIHRoZSBzZWNvbmQgcG9pbnQuXG4gIC8vIFNvIGZpcnN0LCBsZXQncyBtYWtlIG91ciB2ZWN0b3JzOlxuICB2YXIgdmEgPSBbYTJbMF0gLSBhMVswXSwgYTJbMV0gLSBhMVsxXV07XG4gIHZhciB2YiA9IFtiMlswXSAtIGIxWzBdLCBiMlsxXSAtIGIxWzFdXTtcbiAgLy8gV2UgYWxzbyBkZWZpbmUgYSBmdW5jdGlvbiB0byBjb252ZXJ0IGJhY2sgdG8gcmVndWxhciBwb2ludCBmb3JtOlxuXG4gIC8qIGVzbGludC1kaXNhYmxlIGFycm93LWJvZHktc3R5bGUgKi9cblxuICBmdW5jdGlvbiB0b1BvaW50KHAsIHMsIGQpIHtcbiAgICByZXR1cm4gW1xuICAgICAgcFswXSArIHMgKiBkWzBdLFxuICAgICAgcFsxXSArIHMgKiBkWzFdXG4gICAgXTtcbiAgfVxuXG4gIC8qIGVzbGludC1lbmFibGUgYXJyb3ctYm9keS1zdHlsZSAqL1xuXG4gIC8vIFRoZSByZXN0IGlzIHByZXR0eSBtdWNoIGEgc3RyYWlnaHQgcG9ydCBvZiB0aGUgYWxnb3JpdGhtLlxuICB2YXIgZSA9IFtiMVswXSAtIGExWzBdLCBiMVsxXSAtIGExWzFdXTtcbiAgdmFyIGtyb3NzID0ga3Jvc3NQcm9kdWN0KHZhLCB2Yik7XG4gIHZhciBzcXJLcm9zcyA9IGtyb3NzICoga3Jvc3M7XG4gIHZhciBzcXJMZW5BID0gZG90UHJvZHVjdCh2YSwgdmEpO1xuICB2YXIgc3FyTGVuQiA9IGRvdFByb2R1Y3QodmIsIHZiKTtcblxuICAvLyBDaGVjayBmb3IgbGluZSBpbnRlcnNlY3Rpb24uIFRoaXMgd29ya3MgYmVjYXVzZSBvZiB0aGUgcHJvcGVydGllcyBvZiB0aGVcbiAgLy8gY3Jvc3MgcHJvZHVjdCAtLSBzcGVjaWZpY2FsbHksIHR3byB2ZWN0b3JzIGFyZSBwYXJhbGxlbCBpZiBhbmQgb25seSBpZiB0aGVcbiAgLy8gY3Jvc3MgcHJvZHVjdCBpcyB0aGUgMCB2ZWN0b3IuIFRoZSBmdWxsIGNhbGN1bGF0aW9uIGludm9sdmVzIHJlbGF0aXZlIGVycm9yXG4gIC8vIHRvIGFjY291bnQgZm9yIHBvc3NpYmxlIHZlcnkgc21hbGwgbGluZSBzZWdtZW50cy4gU2VlIFNjaG5laWRlciAmIEViZXJseVxuICAvLyBmb3IgZGV0YWlscy5cbiAgaWYgKHNxcktyb3NzID4gRVBTSUxPTiAqIHNxckxlbkEgKiBzcXJMZW5CKSB7XG4gICAgLy8gSWYgdGhleSdyZSBub3QgcGFyYWxsZWwsIHRoZW4gKGJlY2F1c2UgdGhlc2UgYXJlIGxpbmUgc2VnbWVudHMpIHRoZXlcbiAgICAvLyBzdGlsbCBtaWdodCBub3QgYWN0dWFsbHkgaW50ZXJzZWN0LiBUaGlzIGNvZGUgY2hlY2tzIHRoYXQgdGhlXG4gICAgLy8gaW50ZXJzZWN0aW9uIHBvaW50IG9mIHRoZSBsaW5lcyBpcyBhY3R1YWxseSBvbiBib3RoIGxpbmUgc2VnbWVudHMuXG4gICAgdmFyIHMgPSBrcm9zc1Byb2R1Y3QoZSwgdmIpIC8ga3Jvc3M7XG4gICAgaWYgKHMgPCAwIHx8IHMgPiAxKSB7XG4gICAgICAvLyBub3Qgb24gbGluZSBzZWdtZW50IGFcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgdCA9IGtyb3NzUHJvZHVjdChlLCB2YSkgLyBrcm9zcztcbiAgICBpZiAodCA8IDAgfHwgdCA+IDEpIHtcbiAgICAgIC8vIG5vdCBvbiBsaW5lIHNlZ21lbnQgYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBub0VuZHBvaW50VG91Y2ggPyBudWxsIDogW3RvUG9pbnQoYTEsIHMsIHZhKV07XG4gIH1cblxuICAvLyBJZiB3ZSd2ZSByZWFjaGVkIHRoaXMgcG9pbnQsIHRoZW4gdGhlIGxpbmVzIGFyZSBlaXRoZXIgcGFyYWxsZWwgb3IgdGhlXG4gIC8vIHNhbWUsIGJ1dCB0aGUgc2VnbWVudHMgY291bGQgb3ZlcmxhcCBwYXJ0aWFsbHkgb3IgZnVsbHksIG9yIG5vdCBhdCBhbGwuXG4gIC8vIFNvIHdlIG5lZWQgdG8gZmluZCB0aGUgb3ZlcmxhcCwgaWYgYW55LiBUbyBkbyB0aGF0LCB3ZSBjYW4gdXNlIGUsIHdoaWNoIGlzXG4gIC8vIHRoZSAodmVjdG9yKSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHR3byBpbml0aWFsIHBvaW50cy4gSWYgdGhpcyBpcyBwYXJhbGxlbFxuICAvLyB3aXRoIHRoZSBsaW5lIGl0c2VsZiwgdGhlbiB0aGUgdHdvIGxpbmVzIGFyZSB0aGUgc2FtZSBsaW5lLCBhbmQgdGhlcmUgd2lsbFxuICAvLyBiZSBvdmVybGFwLlxuICB2YXIgc3FyTGVuRSA9IGRvdFByb2R1Y3QoZSwgZSk7XG4gIGtyb3NzID0ga3Jvc3NQcm9kdWN0KGUsIHZhKTtcbiAgc3FyS3Jvc3MgPSBrcm9zcyAqIGtyb3NzO1xuXG4gIGlmIChzcXJLcm9zcyA+IEVQU0lMT04gKiBzcXJMZW5BICogc3FyTGVuRSkge1xuICAgIC8vIExpbmVzIGFyZSBqdXN0IHBhcmFsbGVsLCBub3QgdGhlIHNhbWUuIE5vIG92ZXJsYXAuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgc2EgPSBkb3RQcm9kdWN0KHZhLCBlKSAvIHNxckxlbkE7XG4gIHZhciBzYiA9IHNhICsgZG90UHJvZHVjdCh2YSwgdmIpIC8gc3FyTGVuQTtcbiAgdmFyIHNtaW4gPSBNYXRoLm1pbihzYSwgc2IpO1xuICB2YXIgc21heCA9IE1hdGgubWF4KHNhLCBzYik7XG5cbiAgLy8gdGhpcyBpcywgZXNzZW50aWFsbHksIHRoZSBGaW5kSW50ZXJzZWN0aW9uIGFjdGluZyBvbiBmbG9hdHMgZnJvbVxuICAvLyBTY2huZWlkZXIgJiBFYmVybHksIGp1c3QgaW5saW5lZCBpbnRvIHRoaXMgZnVuY3Rpb24uXG4gIGlmIChzbWluIDw9IDEgJiYgc21heCA+PSAwKSB7XG5cbiAgICAvLyBvdmVybGFwIG9uIGFuIGVuZCBwb2ludFxuICAgIGlmIChzbWluID09PSAxKSB7XG4gICAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzbWluID4gMCA/IHNtaW4gOiAwLCB2YSldO1xuICAgIH1cblxuICAgIGlmIChzbWF4ID09PSAwKSB7XG4gICAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzbWF4IDwgMSA/IHNtYXggOiAxLCB2YSldO1xuICAgIH1cblxuICAgIGlmIChub0VuZHBvaW50VG91Y2ggJiYgc21pbiA9PT0gMCAmJiBzbWF4ID09PSAxKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIFRoZXJlJ3Mgb3ZlcmxhcCBvbiBhIHNlZ21lbnQgLS0gdHdvIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24uIFJldHVybiBib3RoLlxuICAgIHJldHVybiBbXG4gICAgICB0b1BvaW50KGExLCBzbWluID4gMCA/IHNtaW4gOiAwLCB2YSksXG4gICAgICB0b1BvaW50KGExLCBzbWF4IDwgMSA/IHNtYXggOiAxLCB2YSksXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcbiIsIi8qKlxuICogU2lnbmVkIGFyZWEgb2YgdGhlIHRyaWFuZ2xlIChwMCwgcDEsIHAyKVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAwXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDFcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMlxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNpZ25lZEFyZWEocDAsIHAxLCBwMikge1xuICByZXR1cm4gKHAwWzBdIC0gcDJbMF0pICogKHAxWzFdIC0gcDJbMV0pIC0gKHAxWzBdIC0gcDJbMF0pICogKHAwWzFdIC0gcDJbMV0pO1xufTtcbiIsInZhciBzaWduZWRBcmVhID0gcmVxdWlyZSgnLi9zaWduZWRfYXJlYScpO1xudmFyIEVkZ2VUeXBlICAgPSByZXF1aXJlKCcuL2VkZ2VfdHlwZScpO1xuXG5cbi8qKlxuICogU3dlZXBsaW5lIGV2ZW50XG4gKlxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gIHBvaW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgbGVmdFxuICogQHBhcmFtIHtTd2VlcEV2ZW50PX0gICAgIG90aGVyRXZlbnRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gICAgICAgICBpc1N1YmplY3RcbiAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICBlZGdlVHlwZVxuICovXG5mdW5jdGlvbiBTd2VlcEV2ZW50KHBvaW50LCBsZWZ0LCBvdGhlckV2ZW50LCBpc1N1YmplY3QsIGVkZ2VUeXBlKSB7XG5cbiAgLyoqXG4gICAqIElzIGxlZnQgZW5kcG9pbnQ/XG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5sZWZ0ID0gbGVmdDtcblxuICAvKipcbiAgICogQHR5cGUge0FycmF5LjxOdW1iZXI+fVxuICAgKi9cbiAgdGhpcy5wb2ludCA9IHBvaW50O1xuXG4gIC8qKlxuICAgKiBPdGhlciBlZGdlIHJlZmVyZW5jZVxuICAgKiBAdHlwZSB7U3dlZXBFdmVudH1cbiAgICovXG4gIHRoaXMub3RoZXJFdmVudCA9IG90aGVyRXZlbnQ7XG5cbiAgLyoqXG4gICAqIEJlbG9uZ3MgdG8gc291cmNlIG9yIGNsaXBwaW5nIHBvbHlnb25cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmlzU3ViamVjdCA9IGlzU3ViamVjdDtcblxuICAvKipcbiAgICogRWRnZSBjb250cmlidXRpb24gdHlwZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgdGhpcy50eXBlID0gZWRnZVR5cGUgfHwgRWRnZVR5cGUuTk9STUFMO1xuXG5cbiAgLyoqXG4gICAqIEluLW91dCB0cmFuc2l0aW9uIGZvciB0aGUgc3dlZXBsaW5lIGNyb3NzaW5nIHBvbHlnb25cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmluT3V0ID0gZmFsc2U7XG5cblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLm90aGVySW5PdXQgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJldmlvdXMgZXZlbnQgaW4gcmVzdWx0P1xuICAgKiBAdHlwZSB7U3dlZXBFdmVudH1cbiAgICovXG4gIHRoaXMucHJldkluUmVzdWx0ID0gbnVsbDtcblxuICAvKipcbiAgICogRG9lcyBldmVudCBiZWxvbmcgdG8gcmVzdWx0P1xuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuaW5SZXN1bHQgPSBmYWxzZTtcblxuXG4gIC8vIGNvbm5lY3Rpb24gc3RlcFxuXG4gIC8qKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMucmVzdWx0SW5PdXQgPSBmYWxzZTtcbn1cblxuXG5Td2VlcEV2ZW50LnByb3RvdHlwZSA9IHtcblxuICAvKipcbiAgICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc0JlbG93OiBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdCA/XG4gICAgICBzaWduZWRBcmVhICh0aGlzLnBvaW50LCB0aGlzLm90aGVyRXZlbnQucG9pbnQsIHApID4gMCA6XG4gICAgICBzaWduZWRBcmVhICh0aGlzLm90aGVyRXZlbnQucG9pbnQsIHRoaXMucG9pbnQsIHApID4gMDtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gIHBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQWJvdmU6IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gIXRoaXMuaXNCZWxvdyhwKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNWZXJ0aWNhbDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRbMF0gPT09IHRoaXMub3RoZXJFdmVudC5wb2ludFswXTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTd2VlcEV2ZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbnlRdWV1ZTtcblxuZnVuY3Rpb24gVGlueVF1ZXVlKGRhdGEsIGNvbXBhcmUpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVGlueVF1ZXVlKSkgcmV0dXJuIG5ldyBUaW55UXVldWUoZGF0YSwgY29tcGFyZSk7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhIHx8IFtdO1xuICAgIHRoaXMubGVuZ3RoID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICB0aGlzLmNvbXBhcmUgPSBjb21wYXJlIHx8IGRlZmF1bHRDb21wYXJlO1xuXG4gICAgaWYgKGRhdGEpIGZvciAodmFyIGkgPSBNYXRoLmZsb29yKHRoaXMubGVuZ3RoIC8gMik7IGkgPj0gMDsgaS0tKSB0aGlzLl9kb3duKGkpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xufVxuXG5UaW55UXVldWUucHJvdG90eXBlID0ge1xuXG4gICAgcHVzaDogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5kYXRhLnB1c2goaXRlbSk7XG4gICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgIHRoaXMuX3VwKHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgfSxcblxuICAgIHBvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9wID0gdGhpcy5kYXRhWzBdO1xuICAgICAgICB0aGlzLmRhdGFbMF0gPSB0aGlzLmRhdGFbdGhpcy5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgdGhpcy5kYXRhLnBvcCgpO1xuICAgICAgICB0aGlzLl9kb3duKDApO1xuICAgICAgICByZXR1cm4gdG9wO1xuICAgIH0sXG5cbiAgICBwZWVrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF07XG4gICAgfSxcblxuICAgIF91cDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIGNvbXBhcmUgPSB0aGlzLmNvbXBhcmU7XG5cbiAgICAgICAgd2hpbGUgKHBvcyA+IDApIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBNYXRoLmZsb29yKChwb3MgLSAxKSAvIDIpO1xuICAgICAgICAgICAgaWYgKGNvbXBhcmUoZGF0YVtwb3NdLCBkYXRhW3BhcmVudF0pIDwgMCkge1xuICAgICAgICAgICAgICAgIHN3YXAoZGF0YSwgcGFyZW50LCBwb3MpO1xuICAgICAgICAgICAgICAgIHBvcyA9IHBhcmVudDtcblxuICAgICAgICAgICAgfSBlbHNlIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kb3duOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgY29tcGFyZSA9IHRoaXMuY29tcGFyZSxcbiAgICAgICAgICAgIGxlbiA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IDIgKiBwb3MgKyAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0ID0gbGVmdCArIDEsXG4gICAgICAgICAgICAgICAgbWluID0gcG9zO1xuXG4gICAgICAgICAgICBpZiAobGVmdCA8IGxlbiAmJiBjb21wYXJlKGRhdGFbbGVmdF0sIGRhdGFbbWluXSkgPCAwKSBtaW4gPSBsZWZ0O1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgbGVuICYmIGNvbXBhcmUoZGF0YVtyaWdodF0sIGRhdGFbbWluXSkgPCAwKSBtaW4gPSByaWdodDtcblxuICAgICAgICAgICAgaWYgKG1pbiA9PT0gcG9zKSByZXR1cm47XG5cbiAgICAgICAgICAgIHN3YXAoZGF0YSwgbWluLCBwb3MpO1xuICAgICAgICAgICAgcG9zID0gbWluO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZnVuY3Rpb24gc3dhcChkYXRhLCBpLCBqKSB7XG4gICAgdmFyIHRtcCA9IGRhdGFbaV07XG4gICAgZGF0YVtpXSA9IGRhdGFbal07XG4gICAgZGF0YVtqXSA9IHRtcDtcbn1cbiIsIi8qKlxuICogT2Zmc2V0IGVkZ2Ugb2YgdGhlIHBvbHlnb25cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGN1cnJlbnRcbiAqIEBwYXJhbSAge09iamVjdH0gbmV4dFxuICogQGNvc250cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEVkZ2UoY3VycmVudCwgbmV4dCkge1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5jdXJyZW50ID0gY3VycmVudDtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMubmV4dCA9IG5leHQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLl9pbk5vcm1hbCA9IHRoaXMuaW53YXJkc05vcm1hbCgpO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5fb3V0Tm9ybWFsID0gdGhpcy5vdXR3YXJkc05vcm1hbCgpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgb3V0d2FyZHMgbm9ybWFsXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbkVkZ2UucHJvdG90eXBlLm91dHdhcmRzTm9ybWFsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpbndhcmRzID0gdGhpcy5pbndhcmRzTm9ybWFsKCk7XG4gIHJldHVybiBbXG4gICAgLWlud2FyZHNbMF0sXG4gICAgLWlud2FyZHNbMV1cbiAgXTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBpbndhcmRzIG5vcm1hbFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5FZGdlLnByb3RvdHlwZS5pbndhcmRzTm9ybWFsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkeCA9IHRoaXMubmV4dFswXSAtIHRoaXMuY3VycmVudFswXSxcbiAgICAgIGR5ID0gdGhpcy5uZXh0WzFdIC0gdGhpcy5jdXJyZW50WzFdLFxuICAgICAgZWRnZUxlbmd0aCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgcmV0dXJuIFtcbiAgICAtZHkgLyBlZGdlTGVuZ3RoLFxuICAgICBkeCAvIGVkZ2VMZW5ndGhcbiAgXTtcbn07XG5cbi8qKlxuICogT2Zmc2V0cyB0aGUgZWRnZSBieSBkeCwgZHlcbiAqIEBwYXJhbSAge051bWJlcn0gZHhcbiAqIEBwYXJhbSAge051bWJlcn0gZHlcbiAqIEByZXR1cm4ge0VkZ2V9XG4gKi9cbkVkZ2UucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKGR4LCBkeSkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudCxcbiAgICAgIG5leHQgPSB0aGlzLm5leHQ7XG5cbiAgcmV0dXJuIG5ldyBFZGdlKFtcbiAgICBjdXJyZW50WzBdICsgZHgsXG4gICAgY3VycmVudFsxXSArIGR5XG4gIF0sIFtcbiAgICBuZXh0WzBdICsgZHgsXG4gICAgbmV4dFsxXSArIGR5XG4gIF0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGdlO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIEVkZ2UgPSByZXF1aXJlKCcuL2VkZ2UnKTtcbnZhciBtYXJ0aW5leiA9IGdsb2JhbC5tYXJ0aW5leiA9IHJlcXVpcmUoJ21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcnKTtcblxudmFyIGF0YW4yID0gTWF0aC5hdGFuMjtcblxudmFyIGlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuLyoqXG4gKiBPZmZzZXQgYnVpbGRlclxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD49fSB2ZXJ0aWNlc1xuICogQHBhcmFtIHtOdW1iZXI9fSAgICAgICAgYXJjU2VnbWVudHNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPZmZzZXQodmVydGljZXMsIGFyY1NlZ21lbnRzKSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn1cbiAgICovXG4gIHRoaXMudmVydGljZXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPEVkZ2U+fVxuICAgKi9cbiAgdGhpcy5lZGdlcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5fY2xvc2VkID0gZmFsc2U7XG5cblxuICAvKipcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMuX2Rpc3RhbmNlID0gMDtcblxuICBpZiAodmVydGljZXMpIHtcbiAgICAgIHRoaXMuZGF0YSh2ZXJ0aWNlcyk7XG4gIH1cblxuICAvKipcbiAgICogU2VnbWVudHMgaW4gZWRnZSBib3VuZGluZyBhcmNoZXNcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHMgIT09IHVuZGVmaW5lZCA/IGFyY1NlZ21lbnRzIDogNTtcbn1cblxuLyoqXG4gKiBDaGFuZ2UgZGF0YSBzZXRcbiAqIEBwYXJhbSAge0FycmF5LjxBcnJheT59IHZlcnRpY2VzXG4gKiBAcmV0dXJuIHtPZmZzZXR9XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG5cbiAgdmVydGljZXMgPSB0aGlzLnZhbGlkYXRlKHZlcnRpY2VzKTtcblxuICBpZiAodmVydGljZXMubGVuZ3RoID4gMSkge1xuICAgIHZhciBlZGdlcyA9IFtdO1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZWRnZXMucHVzaChuZXcgRWRnZSh2ZXJ0aWNlc1tpXSwgdmVydGljZXNbKGkgKyAxKSAlIGxlbl0pKTtcbiAgICB9XG4gICAgdGhpcy5lZGdlcyA9IGVkZ2VzO1xuICB9XG4gIHRoaXMudmVydGljZXMgPSB2ZXJ0aWNlcztcblxuICByZXR1cm4gdGhpcztcbn07XG5cblxuT2Zmc2V0LnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24odmVydGljZXMpIHtcbiAgdGhpcy5fZWRnZXMgPSBbXTtcbiAgaWYgKCFpc0FycmF5ICh2ZXJ0aWNlcykpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ09mZnNldCByZXF1aXJlcyBhdCBsZWFzdCBvbmUgY29vZGluYXRlIHRvIHdvcmsgd2l0aCcpO1xuICB9XG5cbiAgaWYgKGlzQXJyYXkodmVydGljZXMpICYmIHR5cGVvZiB2ZXJ0aWNlc1swXSA9PT0gJ251bWJlcicpIHtcbiAgICB0aGlzLnZlcnRpY2VzID0gdmVydGljZXM7XG4gIH0gZWxzZSB7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuICAgIHRoaXMuX3Byb2Nlc3NDb250b3VyKHZlcnRpY2VzLCB0aGlzLl9lZGdlcyk7XG4gIH1cbn07XG5cblxuT2Zmc2V0LnByb3RvdHlwZS5fcHJvY2Vzc0NvbnRvdXIgPSBmdW5jdGlvbihjb250b3VyLCBlZGdlcykge1xuICB2YXIgaSwgbGVuO1xuICAvLyBjb25zb2xlLmxvZyhjb250b3VyLCBlZGdlcywgaXNBcnJheShjb250b3VyWzBdKSwgY29udG91clswXVswXSk7XG4gIGlmIChpc0FycmF5KGNvbnRvdXJbMF0pICYmIHR5cGVvZiBjb250b3VyWzBdWzBdID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvbnRvdXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGVkZ2VzLnB1c2gobmV3IEVkZ2UoY29udG91cltpXSwgY29udG91clsoaSArIDEpICUgbGVuXSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB2YXIgcHJvY2Vzc2VkID0gW107XG4gICAgZm9yIChpID0gMCwgbGVuID0gY29udG91ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGhpcy5fcHJvY2Vzc0NvbnRvdXIoY29udG91cltpXSwgcHJvY2Vzc2VkKTtcbiAgICB9XG4gICAgZWRnZXMucHVzaChwcm9jZXNzZWQpO1xuICB9XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBhcmNTZWdtZW50c1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmFyY1NlZ21lbnRzID0gZnVuY3Rpb24oYXJjU2VnbWVudHMpIHtcbiAgdGhpcy5fYXJjU2VnbWVudHMgPSBhcmNTZWdtZW50cztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogVmFsaWRhdGVzIGlmIHRoZSBmaXJzdCBhbmQgbGFzdCBwb2ludHMgcmVwZWF0XG4gKiBUT0RPOiBjaGVjayBDQ1dcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIHZhciBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gIGlmICh0eXBlb2YgdmVydGljZXNbMF0gPT09ICdudW1iZXInKSByZXR1cm4gW3ZlcnRpY2VzXTtcbiAgaWYgKHZlcnRpY2VzWzBdWzBdID09PSB2ZXJ0aWNlc1tsZW4gLSAxXVswXSAmJlxuICAgIHZlcnRpY2VzWzBdWzFdID09PSB2ZXJ0aWNlc1tsZW4gLSAxXVsxXSkge1xuICAgIGlmIChsZW4gPiAxKSB7XG4gICAgICB2ZXJ0aWNlcyA9IHZlcnRpY2VzLnNsaWNlKDAsIGxlbiAtIDEpO1xuICAgICAgdGhpcy5fY2xvc2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZXMgYXJjaCBiZXR3ZWVuIHR3byBlZGdlc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxPYmplY3Q+fSB2ZXJ0aWNlc1xuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGNlbnRlclxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHJhZGl1c1xuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIHN0YXJ0VmVydGV4XG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgZW5kVmVydGV4XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgc2VnbWVudHNcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICBvdXR3YXJkc1xuICovXG5PZmZzZXQucHJvdG90eXBlLmNyZWF0ZUFyYyA9IGZ1bmN0aW9uKHZlcnRpY2VzLCBjZW50ZXIsIHJhZGl1cywgc3RhcnRWZXJ0ZXgsXG4gICAgZW5kVmVydGV4LCBzZWdtZW50cywgb3V0d2FyZHMpIHtcblxuICB2YXIgUEkyID0gTWF0aC5QSSAqIDIsXG4gICAgICBzdGFydEFuZ2xlID0gYXRhbjIoc3RhcnRWZXJ0ZXhbMV0gLSBjZW50ZXJbMV0sIHN0YXJ0VmVydGV4WzBdIC0gY2VudGVyWzBdKSxcbiAgICAgIGVuZEFuZ2xlID0gYXRhbjIoZW5kVmVydGV4WzFdIC0gY2VudGVyWzFdLCBlbmRWZXJ0ZXhbMF0gLSBjZW50ZXJbMF0pO1xuXG4gIC8vIG9kZCBudW1iZXIgcGxlYXNlXG4gIGlmIChzZWdtZW50cyAlIDIgPT09IDApIHtcbiAgICBzZWdtZW50cyAtPSAxO1xuICB9XG5cbiAgaWYgKHN0YXJ0QW5nbGUgPCAwKSB7XG4gICAgc3RhcnRBbmdsZSArPSBQSTI7XG4gIH1cblxuICBpZiAoZW5kQW5nbGUgPCAwKSB7XG4gICAgZW5kQW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgdmFyIGFuZ2xlID0gKChzdGFydEFuZ2xlID4gZW5kQW5nbGUpID9cbiAgICAgICAgICAgICAgIChzdGFydEFuZ2xlIC0gZW5kQW5nbGUpIDpcbiAgICAgICAgICAgICAgIChzdGFydEFuZ2xlICsgUEkyIC0gZW5kQW5nbGUpKSxcbiAgICAgIHNlZ21lbnRBbmdsZSA9ICgob3V0d2FyZHMpID8gLWFuZ2xlIDogUEkyIC0gYW5nbGUpIC8gc2VnbWVudHM7XG5cbiAgdmVydGljZXMucHVzaChzdGFydFZlcnRleCk7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgc2VnbWVudHM7ICsraSkge1xuICAgIGFuZ2xlID0gc3RhcnRBbmdsZSArIHNlZ21lbnRBbmdsZSAqIGk7XG4gICAgdmVydGljZXMucHVzaChbXG4gICAgICBjZW50ZXJbMF0gKyBNYXRoLmNvcyhhbmdsZSkgKiByYWRpdXMsXG4gICAgICBjZW50ZXJbMV0gKyBNYXRoLnNpbihhbmdsZSkgKiByYWRpdXNcbiAgICBdKTtcbiAgfVxuICB2ZXJ0aWNlcy5wdXNoKGVuZFZlcnRleCk7XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICBkaXN0XG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB1bml0c1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24oZGlzdCwgdW5pdHMpIHtcbiAgdGhpcy5fZGlzdGFuY2UgPSBkaXN0IHx8IDA7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSAge051bWJlcn0gIGRlZ3JlZXNcbiAqIEBwYXJhbSAge1N0cmluZz19IHVuaXRzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbk9mZnNldC5kZWdyZWVzVG9Vbml0cyA9IGZ1bmN0aW9uKGRlZ3JlZXMsIHVuaXRzKSB7XG4gIHN3aXRjaCAodW5pdHMpIHtcbiAgICBjYXNlICdtaWxlcyc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDY5LjA0NztcbiAgICBicmVhaztcbiAgICBjYXNlICdmZWV0JzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMzY0NTY4LjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdraWxvbWV0ZXJzJzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMTExLjEyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbWV0ZXJzJzpcbiAgICBjYXNlICdtZXRyZXMnOlxuICAgICAgZGVncmVlcyA9IGRlZ3JlZXMgLyAxMTExMjAuMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2RlZ3JlZXMnOlxuICAgIGNhc2UgJ3BpeGVscyc6XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBkZWdyZWVzO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxPYmplY3Q+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuZW5zdXJlTGFzdFBvaW50ID0gZnVuY3Rpb24odmVydGljZXMpIHtcbiAgaWYgKHRoaXMuX2Nsb3NlZCkge1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgdmVydGljZXNbMF1bMF0sXG4gICAgICB2ZXJ0aWNlc1swXVsxXVxuICAgIF0pO1xuICB9XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBEZWNpZGVzIGJ5IHRoZSBzaWduIGlmIGl0J3MgYSBwYWRkaW5nIG9yIGEgbWFyZ2luXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG4gIHJldHVybiB0aGlzLl9kaXN0YW5jZSA9PT0gMCA/IHRoaXMudmVydGljZXMgOlxuICAgICAgKHRoaXMuX2Rpc3RhbmNlID4gMCA/IHRoaXMubWFyZ2luKHRoaXMuX2Rpc3RhbmNlKSA6XG4gICAgICAgIHRoaXMucGFkZGluZygtdGhpcy5fZGlzdGFuY2UpKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fSB2ZXJ0aWNlc1xuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICAgICAgICAgcHQxXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gICAgICAgICBwdDJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48TnVtYmVyPj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuX29mZnNldFNlZ21lbnQgPSBmdW5jdGlvbih2ZXJ0aWNlcywgcHQxLCBwdDIsIGRpc3QpIHtcbiAgdmFyIGVkZ2VzID0gW25ldyBFZGdlKHB0MSwgcHQyKSwgbmV3IEVkZ2UocHQyLCBwdDEpXTtcbiAgdmFyIGksIGxlbiA9IDI7XG5cbiAgdmFyIG9mZnNldHMgPSBbXTtcblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgZWRnZSA9IGVkZ2VzW2ldO1xuICAgIHZhciBkeCA9IGVkZ2UuX2luTm9ybWFsWzBdICogZGlzdDtcbiAgICB2YXIgZHkgPSBlZGdlLl9pbk5vcm1hbFsxXSAqIGRpc3Q7XG5cbiAgICBvZmZzZXRzLnB1c2goZWRnZS5vZmZzZXQoZHgsIGR5KSk7XG4gIH1cblxuICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgdGhpc0VkZ2UgPSBvZmZzZXRzW2ldLFxuICAgICAgICBwcmV2RWRnZSA9IG9mZnNldHNbKGkgKyBsZW4gLSAxKSAlIGxlbl07XG4gICAgdGhpcy5jcmVhdGVBcmMoXG4gICAgICAgICAgICAgICAgdmVydGljZXMsXG4gICAgICAgICAgICAgICAgZWRnZXNbaV0uY3VycmVudCwgLy8gcDEgb3IgcDJcbiAgICAgICAgICAgICAgICBkaXN0LFxuICAgICAgICAgICAgICAgIHByZXZFZGdlLm5leHQsXG4gICAgICAgICAgICAgICAgdGhpc0VkZ2UuY3VycmVudCxcbiAgICAgICAgICAgICAgICB0aGlzLl9hcmNTZWdtZW50cyxcbiAgICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICB9XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuT2Zmc2V0LnByb3RvdHlwZS5fb2Zmc2V0U2VnbWVudCA9IGZ1bmN0aW9uKHYxLCB2MiwgZTEsIGUyLCBkaXN0KSB7XG4gIHZhciB2ZXJ0aWNlcyA9IFtdO1xuICB2YXIgZWRnZXMgICAgPSBbZTEsIGUyXTtcblxuICB2YXIgb2Zmc2V0cyA9IFtcbiAgICBlMS5vZmZzZXQoZTEuX2luTm9ybWFsWzBdICogZGlzdCwgZTEuX2luTm9ybWFsWzFdICogZGlzdCksXG4gICAgZTIub2Zmc2V0KGUyLl9pbk5vcm1hbFswXSAqIGRpc3QsIGUyLl9pbk5vcm1hbFsxXSAqIGRpc3QpXG4gIF07XG5cbiAgY29uc29sZS5sb2cob2Zmc2V0cyk7XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IDI7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciB0aGlzRWRnZSA9IG9mZnNldHNbaV0sXG4gICAgICAgIHByZXZFZGdlID0gb2Zmc2V0c1soaSArIGxlbiAtIDEpICUgbGVuXTtcbiAgICB0aGlzLmNyZWF0ZUFyYyhcbiAgICAgICAgICAgICAgdmVydGljZXMsXG4gICAgICAgICAgICAgIGVkZ2VzW2ldLmN1cnJlbnQsIC8vIHAxIG9yIHAyXG4gICAgICAgICAgICAgIGRpc3QsXG4gICAgICAgICAgICAgIHByZXZFZGdlLm5leHQsXG4gICAgICAgICAgICAgIHRoaXNFZGdlLmN1cnJlbnQsXG4gICAgICAgICAgICAgIHRoaXMuX2FyY1NlZ21lbnRzLFxuICAgICAgICAgICAgICB0cnVlXG4gICAgICAgICAgICApO1xuICB9XG5cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUubWFyZ2luID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuXG4gIGlmIChkaXN0ID09PSAwKSByZXR1cm4gdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG4gIGlmICh0aGlzLnZlcnRpY2VzLmxlbmd0aCA9PT0gMSAmJlxuICAgICAgdHlwZW9mIHRoaXMudmVydGljZXNbMF0gPT09ICdudW1iZXInKSB7IC8vIHBvaW50XG4gICAgcmV0dXJuIHRoaXMub2Zmc2V0UG9pbnQodGhpcy5fZGlzdGFuY2UpO1xuICB9XG5cbiAgLy90aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKTtcbiAgcmV0dXJuIHRoaXMub2Zmc2V0TGluZXModGhpcy5fZGlzdGFuY2UpO1xuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmVzKHRoaXMuX2Rpc3RhbmNlKTtcbiAgdW5pb24gPSBtYXJ0aW5lei51bmlvbih1bmlvbiwgW3RoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpXSk7XG4gIHJldHVybiB1bmlvbjtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxOdW1iZXI+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLnBhZGRpbmcgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG5cbiAgaWYgKHRoaXMuX2Rpc3RhbmNlID09PSAwKSByZXR1cm4gdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG4gIGlmICh0aGlzLnZlcnRpY2VzLmxlbmd0aCA9PT0gMSkgcmV0dXJuIHRoaXMudmVydGljZXM7XG5cbiAgdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG4gIHZhciB1bmlvbiA9IHRoaXMub2Zmc2V0TGluZXModGhpcy5fZGlzdGFuY2UpO1xuICB2YXIgZGlmZiA9IG1hcnRpbmV6LmRpZmYodGhpcy52ZXJ0aWNlcywgdW5pb24pO1xuICByZXR1cm4gZGlmZjtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIG1hcmdpbiBwb2x5Z29uXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldExpbmUgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG4gIGlmICh0aGlzLl9kaXN0YW5jZSA9PT0gMCkgcmV0dXJuIHRoaXMudmVydGljZXM7XG5cbiAgdmFyIHZlcnRpY2VzID0gW107XG4gIHZhciB1bmlvbiAgICA9IFtdO1xuICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBzZWdtZW50ID0gdGhpcy5lbnN1cmVMYXN0UG9pbnQoXG4gICAgICAgIHRoaXMuX29mZnNldFNlZ21lbnQoW10sIHRoaXMudmVydGljZXNbaV0sIHRoaXMudmVydGljZXNbaSArIDFdLCB0aGlzLl9kaXN0YW5jZSlcbiAgICApO1xuICAgIHZlcnRpY2VzLnB1c2goc2VnbWVudCk7XG4gICAgdW5pb24gPSAoaSA9PT0gMCkgPyBzZWdtZW50IDogbWFydGluZXoudW5pb24odW5pb24sIHNlZ21lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMudmVydGljZXMubGVuZ3RoID4gMiA/IHVuaW9uIDogW3VuaW9uXTtcbn07XG5cblxuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXRMaW5lcyA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgdGhpcy5kaXN0YW5jZShkaXN0KTtcbiAgdmFyIHVuaW9uID0gW107XG4gIGlmIChpc0FycmF5KHRoaXMudmVydGljZXNbMF0pKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHRoaXMuX2VkZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB1bmlvbiA9IChpID09PSAwKSA/XG4gICAgICAgIHRoaXMub2Zmc2V0Q29udG91cih0aGlzLnZlcnRpY2VzW2ldLCB0aGlzLl9lZGdlc1tpXSk6XG4gICAgICAgIG1hcnRpbmV6LnVuaW9uKHVuaW9uLCB0aGlzLm9mZnNldENvbnRvdXIodGhpcy52ZXJ0aWNlc1tpXSwgdGhpcy5fZWRnZXNbaV0pKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgdW5pb24gPSB0aGlzLm9mZnNldENvbnRvdXIodGhpcy5kYXRhLCB0aGlzLmVkZ2VzKTtcbiAgfVxuICByZXR1cm4gdW5pb247XG59O1xuXG5cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0Q29udG91ciA9IGZ1bmN0aW9uKGN1cnZlLCBlZGdlcykge1xuICBjb25zb2xlLmxvZygnb2Zmc2V0IGNvbnRvdXInLCBjdXJ2ZSk7XG4gIHZhciB1bmlvbjtcbiAgaWYgKGlzQXJyYXkoY3VydmVbMF0pICYmIHR5cGVvZiBjdXJ2ZVswXVswXSA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY3VydmUubGVuZ3RoIC0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgc2VnbWVudCA9IHRoaXMuZW5zdXJlTGFzdFBvaW50KFxuICAgICAgICB0aGlzLl9vZmZzZXRTZWdtZW50KGN1cnZlW2ldLCBjdXJ2ZVtpICsgMV0sIGVkZ2VzW2ldLCBlZGdlc1tpICsgMV0sIHRoaXMuX2Rpc3RhbmNlKVxuICAgICAgKTtcbiAgICAgIGNvbnNvbGUubG9nKCdzZWdtZW50Jywgc2VnbWVudCwgdW5pb24pO1xuICAgICAgdW5pb24gPSAoaSA9PT0gMCkgPyBzZWdtZW50IDogbWFydGluZXoudW5pb24odW5pb24sIHNlZ21lbnQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY3VydmUubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHVuaW9uID0gKGkgPT09IDApID9cbiAgICAgICAgdGhpcy5vZmZzZXRDb250b3VyKGN1cnZlW2ldLCBlZGdlc1tpXSkgOlxuICAgICAgICBtYXJ0aW5lei51bmlvbih1bmlvbiwgdGhpcy5vZmZzZXRDb250b3VyKGN1cnZlW2ldLCBlZGdlc1tpXSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5pb247XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0YW5jZVxuICogQHJldHVybiB7QXJyYXkuPEFycmF5LjxOdW1iZXI+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldFBvaW50ID0gZnVuY3Rpb24oZGlzdGFuY2UpIHtcbiAgdGhpcy5kaXN0YW5jZShkaXN0YW5jZSk7XG4gIHZhciB2ZXJ0aWNlcyA9IHRoaXMuX2FyY1NlZ21lbnRzICogMjtcbiAgdmFyIHBvaW50cyAgID0gW107XG4gIHZhciBjZW50ZXIgICA9IHRoaXMudmVydGljZXNbMF07XG4gIHZhciByYWRpdXMgICA9IHRoaXMuX2Rpc3RhbmNlO1xuICB2YXIgYW5nbGUgICAgPSAwO1xuXG4gIGZvciAodmFyIGkgPSAwOyBpIDwgdmVydGljZXMgLSAxOyBpKyspIHtcbiAgICBhbmdsZSArPSAoMiAqIE1hdGguUEkgLyB2ZXJ0aWNlcyk7IC8vIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgcG9pbnRzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKSksXG4gICAgICBjZW50ZXJbMV0gKyAocmFkaXVzICogTWF0aC5zaW4oYW5nbGUpKVxuICAgIF0pO1xuICB9XG5cbiAgcmV0dXJuIHBvaW50cztcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2Zmc2V0O1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluTnlZeTl2Wm1aelpYUXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5aaGNpQkZaR2RsSUQwZ2NtVnhkV2x5WlNnbkxpOWxaR2RsSnlrN1hHNTJZWElnYldGeWRHbHVaWG9nUFNCbmJHOWlZV3d1YldGeWRHbHVaWG9nUFNCeVpYRjFhWEpsS0NkdFlYSjBhVzVsZWkxd2IyeDVaMjl1TFdOc2FYQndhVzVuSnlrN1hHNWNiblpoY2lCaGRHRnVNaUE5SUUxaGRHZ3VZWFJoYmpJN1hHNWNiblpoY2lCcGMwRnljbUY1SUQwZ1FYSnlZWGt1YVhOQmNuSmhlU0I4ZkNCbWRXNWpkR2x2YmlBb1lYSnlLU0I3WEc0Z0lISmxkSFZ5YmlCUFltcGxZM1F1Y0hKdmRHOTBlWEJsTG5SdlUzUnlhVzVuTG1OaGJHd29ZWEp5S1NBOVBUMGdKMXR2WW1wbFkzUWdRWEp5WVhsZEp6dGNibjA3WEc1Y2JpOHFLbHh1SUNvZ1QyWm1jMlYwSUdKMWFXeGtaWEpjYmlBcVhHNGdLaUJBY0dGeVlXMGdlMEZ5Y21GNUxqeFBZbXBsWTNRK1BYMGdkbVZ5ZEdsalpYTmNiaUFxSUVCd1lYSmhiU0I3VG5WdFltVnlQWDBnSUNBZ0lDQWdJR0Z5WTFObFoyMWxiblJ6WEc0Z0tpQkFZMjl1YzNSeWRXTjBiM0pjYmlBcUwxeHVablZ1WTNScGIyNGdUMlptYzJWMEtIWmxjblJwWTJWekxDQmhjbU5UWldkdFpXNTBjeWtnZTF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBZEhsd1pTQjdRWEp5WVhrdVBFOWlhbVZqZEQ1OVhHNGdJQ0FxTDF4dUlDQjBhR2x6TG5abGNuUnBZMlZ6SUQwZ2JuVnNiRHRjYmx4dUlDQXZLaXBjYmlBZ0lDb2dRSFI1Y0dVZ2UwRnljbUY1TGp4RlpHZGxQbjFjYmlBZ0lDb3ZYRzRnSUhSb2FYTXVaV1JuWlhNZ1BTQnVkV3hzTzF4dVhHNGdJQzhxS2x4dUlDQWdLaUJBZEhsd1pTQjdRbTl2YkdWaGJuMWNiaUFnSUNvdlhHNGdJSFJvYVhNdVgyTnNiM05sWkNBOUlHWmhiSE5sTzF4dVhHNWNiaUFnTHlvcVhHNGdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBcUwxeHVJQ0IwYUdsekxsOWthWE4wWVc1alpTQTlJREE3WEc1Y2JpQWdhV1lnS0habGNuUnBZMlZ6S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbVJoZEdFb2RtVnlkR2xqWlhNcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRk5sWjIxbGJuUnpJR2x1SUdWa1oyVWdZbTkxYm1ScGJtY2dZWEpqYUdWelhHNGdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBcUwxeHVJQ0IwYUdsekxsOWhjbU5UWldkdFpXNTBjeUE5SUdGeVkxTmxaMjFsYm5SeklDRTlQU0IxYm1SbFptbHVaV1FnUHlCaGNtTlRaV2R0Wlc1MGN5QTZJRFU3WEc1OVhHNWNiaThxS2x4dUlDb2dRMmhoYm1kbElHUmhkR0VnYzJWMFhHNGdLaUJBY0dGeVlXMGdJSHRCY25KaGVTNDhRWEp5WVhrK2ZTQjJaWEowYVdObGMxeHVJQ29nUUhKbGRIVnliaUI3VDJabWMyVjBmVnh1SUNvdlhHNVBabVp6WlhRdWNISnZkRzkwZVhCbExtUmhkR0VnUFNCbWRXNWpkR2x2YmloMlpYSjBhV05sY3lrZ2UxeHVYRzRnSUhabGNuUnBZMlZ6SUQwZ2RHaHBjeTUyWVd4cFpHRjBaU2gyWlhKMGFXTmxjeWs3WEc1Y2JpQWdhV1lnS0habGNuUnBZMlZ6TG14bGJtZDBhQ0ErSURFcElIdGNiaUFnSUNCMllYSWdaV1JuWlhNZ1BTQmJYVHRjYmlBZ0lDQm1iM0lnS0haaGNpQnBJRDBnTUN3Z2JHVnVJRDBnZG1WeWRHbGpaWE11YkdWdVozUm9PeUJwSUR3Z2JHVnVPeUJwS3lzcElIdGNiaUFnSUNBZ0lHVmtaMlZ6TG5CMWMyZ29ibVYzSUVWa1oyVW9kbVZ5ZEdsalpYTmJhVjBzSUhabGNuUnBZMlZ6V3locElDc2dNU2tnSlNCc1pXNWRLU2s3WEc0Z0lDQWdmVnh1SUNBZ0lIUm9hWE11WldSblpYTWdQU0JsWkdkbGN6dGNiaUFnZlZ4dUlDQjBhR2x6TG5abGNuUnBZMlZ6SUQwZ2RtVnlkR2xqWlhNN1hHNWNiaUFnY21WMGRYSnVJSFJvYVhNN1hHNTlPMXh1WEc1Y2JrOW1abk5sZEM1d2NtOTBiM1I1Y0dVdVpHRjBZU0E5SUdaMWJtTjBhVzl1S0habGNuUnBZMlZ6S1NCN1hHNGdJSFJvYVhNdVgyVmtaMlZ6SUQwZ1cxMDdYRzRnSUdsbUlDZ2hhWE5CY25KaGVTQW9kbVZ5ZEdsalpYTXBLU0I3WEc0Z0lDQWdkR2h5YjNjZ2JtVjNJRVZ5Y205eUtDZFBabVp6WlhRZ2NtVnhkV2x5WlhNZ1lYUWdiR1ZoYzNRZ2IyNWxJR052YjJScGJtRjBaU0IwYnlCM2IzSnJJSGRwZEdnbktUdGNiaUFnZlZ4dVhHNGdJR2xtSUNocGMwRnljbUY1S0habGNuUnBZMlZ6S1NBbUppQjBlWEJsYjJZZ2RtVnlkR2xqWlhOYk1GMGdQVDA5SUNkdWRXMWlaWEluS1NCN1hHNGdJQ0FnZEdocGN5NTJaWEowYVdObGN5QTlJSFpsY25ScFkyVnpPMXh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJSFJvYVhNdWRtVnlkR2xqWlhNZ1BTQjJaWEowYVdObGN6dGNiaUFnSUNCMGFHbHpMbDl3Y205alpYTnpRMjl1ZEc5MWNpaDJaWEowYVdObGN5d2dkR2hwY3k1ZlpXUm5aWE1wTzF4dUlDQjlYRzU5TzF4dVhHNWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXVYM0J5YjJObGMzTkRiMjUwYjNWeUlEMGdablZ1WTNScGIyNG9ZMjl1ZEc5MWNpd2daV1JuWlhNcElIdGNiaUFnZG1GeUlHa3NJR3hsYmp0Y2JpQWdMeThnWTI5dWMyOXNaUzVzYjJjb1kyOXVkRzkxY2l3Z1pXUm5aWE1zSUdselFYSnlZWGtvWTI5dWRHOTFjbHN3WFNrc0lHTnZiblJ2ZFhKYk1GMWJNRjBwTzF4dUlDQnBaaUFvYVhOQmNuSmhlU2hqYjI1MGIzVnlXekJkS1NBbUppQjBlWEJsYjJZZ1kyOXVkRzkxY2xzd1hWc3dYU0E5UFQwZ0oyNTFiV0psY2ljcElIdGNiaUFnSUNCbWIzSWdLR2tnUFNBd0xDQnNaVzRnUFNCamIyNTBiM1Z5TG14bGJtZDBhRHNnYVNBOElHeGxianNnYVNzcktTQjdYRzRnSUNBZ0lDQmxaR2RsY3k1d2RYTm9LRzVsZHlCRlpHZGxLR052Ym5SdmRYSmJhVjBzSUdOdmJuUnZkWEpiS0drZ0t5QXhLU0FsSUd4bGJsMHBLVHRjYmlBZ0lDQjlYRzRnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdkbUZ5SUhCeWIyTmxjM05sWkNBOUlGdGRPMXh1SUNBZ0lHWnZjaUFvYVNBOUlEQXNJR3hsYmlBOUlHTnZiblJ2ZFhJdWJHVnVaM1JvT3lCcElEd2diR1Z1T3lCcEt5c3BJSHRjYmlBZ0lDQWdJSFJvYVhNdVgzQnliMk5sYzNORGIyNTBiM1Z5S0dOdmJuUnZkWEpiYVYwc0lIQnliMk5sYzNObFpDazdYRzRnSUNBZ2ZWeHVJQ0FnSUdWa1oyVnpMbkIxYzJnb2NISnZZMlZ6YzJWa0tUdGNiaUFnZlZ4dWZUdGNibHh1WEc0dktpcGNiaUFxSUVCd1lYSmhiU0FnZTA1MWJXSmxjbjBnWVhKalUyVm5iV1Z1ZEhOY2JpQXFJRUJ5WlhSMWNtNGdlMDltWm5ObGRIMWNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1aGNtTlRaV2R0Wlc1MGN5QTlJR1oxYm1OMGFXOXVLR0Z5WTFObFoyMWxiblJ6S1NCN1hHNGdJSFJvYVhNdVgyRnlZMU5sWjIxbGJuUnpJRDBnWVhKalUyVm5iV1Z1ZEhNN1hHNGdJSEpsZEhWeWJpQjBhR2x6TzF4dWZUdGNibHh1WEc0dktpcGNiaUFxSUZaaGJHbGtZWFJsY3lCcFppQjBhR1VnWm1seWMzUWdZVzVrSUd4aGMzUWdjRzlwYm5SeklISmxjR1ZoZEZ4dUlDb2dWRTlFVHpvZ1kyaGxZMnNnUTBOWFhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUNCN1FYSnlZWGt1UEU5aWFtVmpkRDU5SUhabGNuUnBZMlZ6WEc0Z0tpOWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXVkbUZzYVdSaGRHVWdQU0JtZFc1amRHbHZiaWgyWlhKMGFXTmxjeWtnZTF4dUlDQjJZWElnYkdWdUlEMGdkbVZ5ZEdsalpYTXViR1Z1WjNSb08xeHVJQ0JwWmlBb2RIbHdaVzltSUhabGNuUnBZMlZ6V3pCZElEMDlQU0FuYm5WdFltVnlKeWtnY21WMGRYSnVJRnQyWlhKMGFXTmxjMTA3WEc0Z0lHbG1JQ2gyWlhKMGFXTmxjMXN3WFZzd1hTQTlQVDBnZG1WeWRHbGpaWE5iYkdWdUlDMGdNVjFiTUYwZ0ppWmNiaUFnSUNCMlpYSjBhV05sYzFzd1hWc3hYU0E5UFQwZ2RtVnlkR2xqWlhOYmJHVnVJQzBnTVYxYk1WMHBJSHRjYmlBZ0lDQnBaaUFvYkdWdUlENGdNU2tnZTF4dUlDQWdJQ0FnZG1WeWRHbGpaWE1nUFNCMlpYSjBhV05sY3k1emJHbGpaU2d3TENCc1pXNGdMU0F4S1R0Y2JpQWdJQ0FnSUhSb2FYTXVYMk5zYjNObFpDQTlJSFJ5ZFdVN1hHNGdJQ0FnZlZ4dUlDQjlYRzRnSUhKbGRIVnliaUIyWlhKMGFXTmxjenRjYm4wN1hHNWNibHh1THlvcVhHNGdLaUJEY21WaGRHVnpJR0Z5WTJnZ1ltVjBkMlZsYmlCMGQyOGdaV1JuWlhOY2JpQXFYRzRnS2lCQWNHRnlZVzBnSUh0QmNuSmhlUzQ4VDJKcVpXTjBQbjBnZG1WeWRHbGpaWE5jYmlBcUlFQndZWEpoYlNBZ2UwOWlhbVZqZEgwZ0lDQWdJQ0FnSUNCalpXNTBaWEpjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ0lDQWdJQ0FnSUNCeVlXUnBkWE5jYmlBcUlFQndZWEpoYlNBZ2UwOWlhbVZqZEgwZ0lDQWdJQ0FnSUNCemRHRnlkRlpsY25SbGVGeHVJQ29nUUhCaGNtRnRJQ0I3VDJKcVpXTjBmU0FnSUNBZ0lDQWdJR1Z1WkZabGNuUmxlRnh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNBZ0lDQWdJQ0FnSUhObFoyMWxiblJ6WEc0Z0tpQkFjR0Z5WVcwZ0lIdENiMjlzWldGdWZTQWdJQ0FnSUNBZ2IzVjBkMkZ5WkhOY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzVqY21WaGRHVkJjbU1nUFNCbWRXNWpkR2x2YmloMlpYSjBhV05sY3l3Z1kyVnVkR1Z5TENCeVlXUnBkWE1zSUhOMFlYSjBWbVZ5ZEdWNExGeHVJQ0FnSUdWdVpGWmxjblJsZUN3Z2MyVm5iV1Z1ZEhNc0lHOTFkSGRoY21SektTQjdYRzVjYmlBZ2RtRnlJRkJKTWlBOUlFMWhkR2d1VUVrZ0tpQXlMRnh1SUNBZ0lDQWdjM1JoY25SQmJtZHNaU0E5SUdGMFlXNHlLSE4wWVhKMFZtVnlkR1Y0V3pGZElDMGdZMlZ1ZEdWeVd6RmRMQ0J6ZEdGeWRGWmxjblJsZUZzd1hTQXRJR05sYm5SbGNsc3dYU2tzWEc0Z0lDQWdJQ0JsYm1SQmJtZHNaU0E5SUdGMFlXNHlLR1Z1WkZabGNuUmxlRnN4WFNBdElHTmxiblJsY2xzeFhTd2daVzVrVm1WeWRHVjRXekJkSUMwZ1kyVnVkR1Z5V3pCZEtUdGNibHh1SUNBdkx5QnZaR1FnYm5WdFltVnlJSEJzWldGelpWeHVJQ0JwWmlBb2MyVm5iV1Z1ZEhNZ0pTQXlJRDA5UFNBd0tTQjdYRzRnSUNBZ2MyVm5iV1Z1ZEhNZ0xUMGdNVHRjYmlBZ2ZWeHVYRzRnSUdsbUlDaHpkR0Z5ZEVGdVoyeGxJRHdnTUNrZ2UxeHVJQ0FnSUhOMFlYSjBRVzVuYkdVZ0t6MGdVRWt5TzF4dUlDQjlYRzVjYmlBZ2FXWWdLR1Z1WkVGdVoyeGxJRHdnTUNrZ2UxeHVJQ0FnSUdWdVpFRnVaMnhsSUNzOUlGQkpNanRjYmlBZ2ZWeHVYRzRnSUhaaGNpQmhibWRzWlNBOUlDZ29jM1JoY25SQmJtZHNaU0ErSUdWdVpFRnVaMnhsS1NBL1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBb2MzUmhjblJCYm1kc1pTQXRJR1Z1WkVGdVoyeGxLU0E2WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FvYzNSaGNuUkJibWRzWlNBcklGQkpNaUF0SUdWdVpFRnVaMnhsS1Nrc1hHNGdJQ0FnSUNCelpXZHRaVzUwUVc1bmJHVWdQU0FvS0c5MWRIZGhjbVJ6S1NBL0lDMWhibWRzWlNBNklGQkpNaUF0SUdGdVoyeGxLU0F2SUhObFoyMWxiblJ6TzF4dVhHNGdJSFpsY25ScFkyVnpMbkIxYzJnb2MzUmhjblJXWlhKMFpYZ3BPMXh1SUNCbWIzSWdLSFpoY2lCcElEMGdNVHNnYVNBOElITmxaMjFsYm5Sek95QXJLMmtwSUh0Y2JpQWdJQ0JoYm1kc1pTQTlJSE4wWVhKMFFXNW5iR1VnS3lCelpXZHRaVzUwUVc1bmJHVWdLaUJwTzF4dUlDQWdJSFpsY25ScFkyVnpMbkIxYzJnb1cxeHVJQ0FnSUNBZ1kyVnVkR1Z5V3pCZElDc2dUV0YwYUM1amIzTW9ZVzVuYkdVcElDb2djbUZrYVhWekxGeHVJQ0FnSUNBZ1kyVnVkR1Z5V3pGZElDc2dUV0YwYUM1emFXNG9ZVzVuYkdVcElDb2djbUZrYVhWelhHNGdJQ0FnWFNrN1hHNGdJSDFjYmlBZ2RtVnlkR2xqWlhNdWNIVnphQ2hsYm1SV1pYSjBaWGdwTzF4dUlDQnlaWFIxY200Z2RtVnlkR2xqWlhNN1hHNTlPMXh1WEc1Y2JpOHFLbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNBZ1pHbHpkRnh1SUNvZ1FIQmhjbUZ0SUNCN1UzUnlhVzVuUFgwZ2RXNXBkSE5jYmlBcUlFQnlaWFIxY200Z2UwOW1abk5sZEgxY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzVrYVhOMFlXNWpaU0E5SUdaMWJtTjBhVzl1S0dScGMzUXNJSFZ1YVhSektTQjdYRzRnSUhSb2FYTXVYMlJwYzNSaGJtTmxJRDBnWkdsemRDQjhmQ0F3TzF4dUlDQnlaWFIxY200Z2RHaHBjenRjYm4wN1hHNWNibHh1THlvcVhHNGdLaUJBYzNSaGRHbGpYRzRnS2lCQWNHRnlZVzBnSUh0T2RXMWlaWEo5SUNCa1pXZHlaV1Z6WEc0Z0tpQkFjR0Z5WVcwZ0lIdFRkSEpwYm1jOWZTQjFibWwwYzF4dUlDb2dRSEpsZEhWeWJpQjdUblZ0WW1WeWZWeHVJQ292WEc1UFptWnpaWFF1WkdWbmNtVmxjMVJ2Vlc1cGRITWdQU0JtZFc1amRHbHZiaWhrWldkeVpXVnpMQ0IxYm1sMGN5a2dlMXh1SUNCemQybDBZMmdnS0hWdWFYUnpLU0I3WEc0Z0lDQWdZMkZ6WlNBbmJXbHNaWE1uT2x4dUlDQWdJQ0FnWkdWbmNtVmxjeUE5SUdSbFozSmxaWE1nTHlBMk9TNHdORGM3WEc0Z0lDQWdZbkpsWVdzN1hHNGdJQ0FnWTJGelpTQW5abVZsZENjNlhHNGdJQ0FnSUNCa1pXZHlaV1Z6SUQwZ1pHVm5jbVZsY3lBdklETTJORFUyT0M0d08xeHVJQ0FnSUNBZ1luSmxZV3M3WEc0Z0lDQWdZMkZ6WlNBbmEybHNiMjFsZEdWeWN5YzZYRzRnSUNBZ0lDQmtaV2R5WldWeklEMGdaR1ZuY21WbGN5QXZJREV4TVM0eE1qdGNiaUFnSUNBZ0lHSnlaV0ZyTzF4dUlDQWdJR05oYzJVZ0oyMWxkR1Z5Y3ljNlhHNGdJQ0FnWTJGelpTQW5iV1YwY21Wekp6cGNiaUFnSUNBZ0lHUmxaM0psWlhNZ1BTQmtaV2R5WldWeklDOGdNVEV4TVRJd0xqQTdYRzRnSUNBZ0lDQmljbVZoYXp0Y2JpQWdJQ0JqWVhObElDZGtaV2R5WldWekp6cGNiaUFnSUNCallYTmxJQ2R3YVhobGJITW5PbHh1SUNBZ0lHUmxabUYxYkhRNlhHNGdJQ0FnSUNCaWNtVmhhenRjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdaR1ZuY21WbGN6dGNibjA3WEc1Y2JseHVMeW9xWEc0Z0tpQkFjR0Z5WVcwZ0lIdEJjbkpoZVM0OFQySnFaV04wUG4wZ2RtVnlkR2xqWlhOY2JpQXFJRUJ5WlhSMWNtNGdlMEZ5Y21GNUxqeFBZbXBsWTNRK2ZWeHVJQ292WEc1UFptWnpaWFF1Y0hKdmRHOTBlWEJsTG1WdWMzVnlaVXhoYzNSUWIybHVkQ0E5SUdaMWJtTjBhVzl1S0habGNuUnBZMlZ6S1NCN1hHNGdJR2xtSUNoMGFHbHpMbDlqYkc5elpXUXBJSHRjYmlBZ0lDQjJaWEowYVdObGN5NXdkWE5vS0Z0Y2JpQWdJQ0FnSUhabGNuUnBZMlZ6V3pCZFd6QmRMRnh1SUNBZ0lDQWdkbVZ5ZEdsalpYTmJNRjFiTVYxY2JpQWdJQ0JkS1R0Y2JpQWdmVnh1SUNCeVpYUjFjbTRnZG1WeWRHbGpaWE03WEc1OU8xeHVYRzVjYmk4cUtseHVJQ29nUkdWamFXUmxjeUJpZVNCMGFHVWdjMmxuYmlCcFppQnBkQ2R6SUdFZ2NHRmtaR2x1WnlCdmNpQmhJRzFoY21kcGJseHVJQ3BjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ1pHbHpkRnh1SUNvZ1FISmxkSFZ5YmlCN1FYSnlZWGt1UEU5aWFtVmpkRDU5WEc0Z0tpOWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXViMlptYzJWMElEMGdablZ1WTNScGIyNG9aR2x6ZENrZ2UxeHVJQ0IwYUdsekxtUnBjM1JoYm1ObEtHUnBjM1FwTzF4dUlDQnlaWFIxY200Z2RHaHBjeTVmWkdsemRHRnVZMlVnUFQwOUlEQWdQeUIwYUdsekxuWmxjblJwWTJWeklEcGNiaUFnSUNBZ0lDaDBhR2x6TGw5a2FYTjBZVzVqWlNBK0lEQWdQeUIwYUdsekxtMWhjbWRwYmloMGFHbHpMbDlrYVhOMFlXNWpaU2tnT2x4dUlDQWdJQ0FnSUNCMGFHbHpMbkJoWkdScGJtY29MWFJvYVhNdVgyUnBjM1JoYm1ObEtTazdYRzU5TzF4dVhHNWNiaThxS2x4dUlDb2dRSEJoY21GdElDQjdRWEp5WVhrdVBFRnljbUY1TGp4T2RXMWlaWEkrUG4wZ2RtVnlkR2xqWlhOY2JpQXFJRUJ3WVhKaGJTQWdlMEZ5Y21GNUxqeE9kVzFpWlhJK2ZTQWdJQ0FnSUNBZ0lIQjBNVnh1SUNvZ1FIQmhjbUZ0SUNCN1FYSnlZWGt1UEU1MWJXSmxjajU5SUNBZ0lDQWdJQ0FnY0hReVhHNGdLaUJBY0dGeVlXMGdJSHRPZFcxaVpYSjlJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lDQmthWE4wWEc0Z0tpQkFjbVYwZFhKdUlIdEJjbkpoZVM0OFFYSnlZWGt1UEU1MWJXSmxjajQrZlZ4dUlDb3ZYRzVQWm1aelpYUXVjSEp2ZEc5MGVYQmxMbDl2Wm1aelpYUlRaV2R0Wlc1MElEMGdablZ1WTNScGIyNG9kbVZ5ZEdsalpYTXNJSEIwTVN3Z2NIUXlMQ0JrYVhOMEtTQjdYRzRnSUhaaGNpQmxaR2RsY3lBOUlGdHVaWGNnUldSblpTaHdkREVzSUhCME1pa3NJRzVsZHlCRlpHZGxLSEIwTWl3Z2NIUXhLVjA3WEc0Z0lIWmhjaUJwTENCc1pXNGdQU0F5TzF4dVhHNGdJSFpoY2lCdlptWnpaWFJ6SUQwZ1cxMDdYRzVjYmlBZ1ptOXlJQ2hwSUQwZ01Ec2dhU0E4SUd4bGJqc2dhU3NyS1NCN1hHNGdJQ0FnZG1GeUlHVmtaMlVnUFNCbFpHZGxjMXRwWFR0Y2JpQWdJQ0IyWVhJZ1pIZ2dQU0JsWkdkbExsOXBiazV2Y20xaGJGc3dYU0FxSUdScGMzUTdYRzRnSUNBZ2RtRnlJR1I1SUQwZ1pXUm5aUzVmYVc1T2IzSnRZV3hiTVYwZ0tpQmthWE4wTzF4dVhHNGdJQ0FnYjJabWMyVjBjeTV3ZFhOb0tHVmtaMlV1YjJabWMyVjBLR1I0TENCa2VTa3BPMXh1SUNCOVhHNWNiaUFnWm05eUlDaHBJRDBnTURzZ2FTQThJR3hsYmpzZ2FTc3JLU0I3WEc0Z0lDQWdkbUZ5SUhSb2FYTkZaR2RsSUQwZ2IyWm1jMlYwYzF0cFhTeGNiaUFnSUNBZ0lDQWdjSEpsZGtWa1oyVWdQU0J2Wm1aelpYUnpXeWhwSUNzZ2JHVnVJQzBnTVNrZ0pTQnNaVzVkTzF4dUlDQWdJSFJvYVhNdVkzSmxZWFJsUVhKaktGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIWmxjblJwWTJWekxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHVmtaMlZ6VzJsZExtTjFjbkpsYm5Rc0lDOHZJSEF4SUc5eUlIQXlYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdaR2x6ZEN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2NtVjJSV1JuWlM1dVpYaDBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQWdJSFJvYVhORlpHZGxMbU4xY25KbGJuUXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkR2hwY3k1ZllYSmpVMlZuYldWdWRITXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdkSEoxWlZ4dUlDQWdJQ0FnSUNBZ0lDQWdLVHRjYmlBZ2ZWeHVJQ0J5WlhSMWNtNGdkbVZ5ZEdsalpYTTdYRzU5TzF4dVhHNWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXVYMjltWm5ObGRGTmxaMjFsYm5RZ1BTQm1kVzVqZEdsdmJpaDJNU3dnZGpJc0lHVXhMQ0JsTWl3Z1pHbHpkQ2tnZTF4dUlDQjJZWElnZG1WeWRHbGpaWE1nUFNCYlhUdGNiaUFnZG1GeUlHVmtaMlZ6SUNBZ0lEMGdXMlV4TENCbE1sMDdYRzVjYmlBZ2RtRnlJRzltWm5ObGRITWdQU0JiWEc0Z0lDQWdaVEV1YjJabWMyVjBLR1V4TGw5cGJrNXZjbTFoYkZzd1hTQXFJR1JwYzNRc0lHVXhMbDlwYms1dmNtMWhiRnN4WFNBcUlHUnBjM1FwTEZ4dUlDQWdJR1V5TG05bVpuTmxkQ2hsTWk1ZmFXNU9iM0p0WVd4Yk1GMGdLaUJrYVhOMExDQmxNaTVmYVc1T2IzSnRZV3hiTVYwZ0tpQmthWE4wS1Z4dUlDQmRPMXh1WEc0Z0lHTnZibk52YkdVdWJHOW5LRzltWm5ObGRITXBPMXh1WEc0Z0lHWnZjaUFvZG1GeUlHa2dQU0F3TENCc1pXNGdQU0F5T3lCcElEd2diR1Z1T3lCcEt5c3BJSHRjYmlBZ0lDQjJZWElnZEdocGMwVmtaMlVnUFNCdlptWnpaWFJ6VzJsZExGeHVJQ0FnSUNBZ0lDQndjbVYyUldSblpTQTlJRzltWm5ObGRITmJLR2tnS3lCc1pXNGdMU0F4S1NBbElHeGxibDA3WEc0Z0lDQWdkR2hwY3k1amNtVmhkR1ZCY21Nb1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUhabGNuUnBZMlZ6TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JsWkdkbGMxdHBYUzVqZFhKeVpXNTBMQ0F2THlCd01TQnZjaUJ3TWx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0JrYVhOMExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCd2NtVjJSV1JuWlM1dVpYaDBMRnh1SUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6UldSblpTNWpkWEp5Wlc1MExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpMbDloY21OVFpXZHRaVzUwY3l4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnZEhKMVpWeHVJQ0FnSUNBZ0lDQWdJQ0FnS1R0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCMlpYSjBhV05sY3p0Y2JuMDdYRzVjYmx4dUx5b3FYRzRnS2lCQWNHRnlZVzBnSUh0T2RXMWlaWEo5SUdScGMzUmNiaUFxSUVCeVpYUjFjbTRnZTBGeWNtRjVManhPZFcxaVpYSStmVnh1SUNvdlhHNVBabVp6WlhRdWNISnZkRzkwZVhCbExtMWhjbWRwYmlBOUlHWjFibU4wYVc5dUtHUnBjM1FwSUh0Y2JpQWdkR2hwY3k1a2FYTjBZVzVqWlNoa2FYTjBLVHRjYmx4dUlDQnBaaUFvWkdsemRDQTlQVDBnTUNrZ2NtVjBkWEp1SUhSb2FYTXVaVzV6ZFhKbFRHRnpkRkJ2YVc1MEtIUm9hWE11ZG1WeWRHbGpaWE1wTzF4dUlDQnBaaUFvZEdocGN5NTJaWEowYVdObGN5NXNaVzVuZEdnZ1BUMDlJREVnSmlaY2JpQWdJQ0FnSUhSNWNHVnZaaUIwYUdsekxuWmxjblJwWTJWeld6QmRJRDA5UFNBbmJuVnRZbVZ5SnlrZ2V5QXZMeUJ3YjJsdWRGeHVJQ0FnSUhKbGRIVnliaUIwYUdsekxtOW1abk5sZEZCdmFXNTBLSFJvYVhNdVgyUnBjM1JoYm1ObEtUdGNiaUFnZlZ4dVhHNGdJQzh2ZEdocGN5NWxibk4xY21WTVlYTjBVRzlwYm5Rb2RHaHBjeTUyWlhKMGFXTmxjeWs3WEc0Z0lISmxkSFZ5YmlCMGFHbHpMbTltWm5ObGRFeHBibVZ6S0hSb2FYTXVYMlJwYzNSaGJtTmxLVHRjYmlBZ2RtRnlJSFZ1YVc5dUlEMGdkR2hwY3k1dlptWnpaWFJNYVc1bGN5aDBhR2x6TGw5a2FYTjBZVzVqWlNrN1hHNGdJSFZ1YVc5dUlEMGdiV0Z5ZEdsdVpYb3VkVzVwYjI0b2RXNXBiMjRzSUZ0MGFHbHpMbVZ1YzNWeVpVeGhjM1JRYjJsdWRDaDBhR2x6TG5abGNuUnBZMlZ6S1YwcE8xeHVJQ0J5WlhSMWNtNGdkVzVwYjI0N1hHNTlPMXh1WEc1Y2JpOHFLbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCa2FYTjBYRzRnS2lCQWNtVjBkWEp1SUh0QmNuSmhlUzQ4VG5WdFltVnlQbjFjYmlBcUwxeHVUMlptYzJWMExuQnliM1J2ZEhsd1pTNXdZV1JrYVc1bklEMGdablZ1WTNScGIyNG9aR2x6ZENrZ2UxeHVJQ0IwYUdsekxtUnBjM1JoYm1ObEtHUnBjM1FwTzF4dVhHNGdJR2xtSUNoMGFHbHpMbDlrYVhOMFlXNWpaU0E5UFQwZ01Da2djbVYwZFhKdUlIUm9hWE11Wlc1emRYSmxUR0Z6ZEZCdmFXNTBLSFJvYVhNdWRtVnlkR2xqWlhNcE8xeHVJQ0JwWmlBb2RHaHBjeTUyWlhKMGFXTmxjeTVzWlc1bmRHZ2dQVDA5SURFcElISmxkSFZ5YmlCMGFHbHpMblpsY25ScFkyVnpPMXh1WEc0Z0lIUm9hWE11Wlc1emRYSmxUR0Z6ZEZCdmFXNTBLSFJvYVhNdWRtVnlkR2xqWlhNcE8xeHVJQ0IyWVhJZ2RXNXBiMjRnUFNCMGFHbHpMbTltWm5ObGRFeHBibVZ6S0hSb2FYTXVYMlJwYzNSaGJtTmxLVHRjYmlBZ2RtRnlJR1JwWm1ZZ1BTQnRZWEowYVc1bGVpNWthV1ptS0hSb2FYTXVkbVZ5ZEdsalpYTXNJSFZ1YVc5dUtUdGNiaUFnY21WMGRYSnVJR1JwWm1ZN1hHNTlPMXh1WEc1Y2JpOHFLbHh1SUNvZ1EzSmxZWFJsY3lCdFlYSm5hVzRnY0c5c2VXZHZibHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCa2FYTjBYRzRnS2lCQWNtVjBkWEp1SUh0QmNuSmhlUzQ4VDJKcVpXTjBQbjFjYmlBcUwxeHVUMlptYzJWMExuQnliM1J2ZEhsd1pTNXZabVp6WlhSTWFXNWxJRDBnWm5WdVkzUnBiMjRvWkdsemRDa2dlMXh1SUNCMGFHbHpMbVJwYzNSaGJtTmxLR1JwYzNRcE8xeHVJQ0JwWmlBb2RHaHBjeTVmWkdsemRHRnVZMlVnUFQwOUlEQXBJSEpsZEhWeWJpQjBhR2x6TG5abGNuUnBZMlZ6TzF4dVhHNGdJSFpoY2lCMlpYSjBhV05sY3lBOUlGdGRPMXh1SUNCMllYSWdkVzVwYjI0Z0lDQWdQU0JiWFR0Y2JpQWdkR2hwY3k1ZlkyeHZjMlZrSUQwZ2RISjFaVHRjYmx4dUlDQm1iM0lnS0haaGNpQnBJRDBnTUN3Z2JHVnVJRDBnZEdocGN5NTJaWEowYVdObGN5NXNaVzVuZEdnZ0xTQXhPeUJwSUR3Z2JHVnVPeUJwS3lzcElIdGNiaUFnSUNCMllYSWdjMlZuYldWdWRDQTlJSFJvYVhNdVpXNXpkWEpsVEdGemRGQnZhVzUwS0Z4dUlDQWdJQ0FnSUNCMGFHbHpMbDl2Wm1aelpYUlRaV2R0Wlc1MEtGdGRMQ0IwYUdsekxuWmxjblJwWTJWelcybGRMQ0IwYUdsekxuWmxjblJwWTJWelcya2dLeUF4WFN3Z2RHaHBjeTVmWkdsemRHRnVZMlVwWEc0Z0lDQWdLVHRjYmlBZ0lDQjJaWEowYVdObGN5NXdkWE5vS0hObFoyMWxiblFwTzF4dUlDQWdJSFZ1YVc5dUlEMGdLR2tnUFQwOUlEQXBJRDhnYzJWbmJXVnVkQ0E2SUcxaGNuUnBibVY2TG5WdWFXOXVLSFZ1YVc5dUxDQnpaV2R0Wlc1MEtUdGNiaUFnZlZ4dVhHNGdJSEpsZEhWeWJpQjBhR2x6TG5abGNuUnBZMlZ6TG14bGJtZDBhQ0ErSURJZ1B5QjFibWx2YmlBNklGdDFibWx2YmwwN1hHNTlPMXh1WEc1Y2JrOW1abk5sZEM1d2NtOTBiM1I1Y0dVdWIyWm1jMlYwVEdsdVpYTWdQU0JtZFc1amRHbHZiaWhrYVhOMEtTQjdYRzRnSUhSb2FYTXVaR2x6ZEdGdVkyVW9aR2x6ZENrN1hHNGdJSFpoY2lCMWJtbHZiaUE5SUZ0ZE8xeHVJQ0JwWmlBb2FYTkJjbkpoZVNoMGFHbHpMblpsY25ScFkyVnpXekJkS1NrZ2UxeHVJQ0FnSUdadmNpQW9kbUZ5SUdrZ1BTQXdMQ0JzWlc0Z1BTQjBhR2x6TGw5bFpHZGxjeTVzWlc1bmRHZzdJR2tnUENCc1pXNDdJR2tyS3lrZ2UxeHVJQ0FnSUNBZ2RXNXBiMjRnUFNBb2FTQTlQVDBnTUNrZ1AxeHVJQ0FnSUNBZ0lDQjBhR2x6TG05bVpuTmxkRU52Ym5SdmRYSW9kR2hwY3k1MlpYSjBhV05sYzF0cFhTd2dkR2hwY3k1ZlpXUm5aWE5iYVYwcE9seHVJQ0FnSUNBZ0lDQnRZWEowYVc1bGVpNTFibWx2YmloMWJtbHZiaXdnZEdocGN5NXZabVp6WlhSRGIyNTBiM1Z5S0hSb2FYTXVkbVZ5ZEdsalpYTmJhVjBzSUhSb2FYTXVYMlZrWjJWelcybGRLU2s3WEc0Z0lDQWdmVnh1SUNCOUlHVnNjMlVnZTF4dUlDQWdJSFZ1YVc5dUlEMGdkR2hwY3k1dlptWnpaWFJEYjI1MGIzVnlLSFJvYVhNdVpHRjBZU3dnZEdocGN5NWxaR2RsY3lrN1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUhWdWFXOXVPMXh1ZlR0Y2JseHVYRzVQWm1aelpYUXVjSEp2ZEc5MGVYQmxMbTltWm5ObGRFTnZiblJ2ZFhJZ1BTQm1kVzVqZEdsdmJpaGpkWEoyWlN3Z1pXUm5aWE1wSUh0Y2JpQWdZMjl1YzI5c1pTNXNiMmNvSjI5bVpuTmxkQ0JqYjI1MGIzVnlKeXdnWTNWeWRtVXBPMXh1SUNCMllYSWdkVzVwYjI0N1hHNGdJR2xtSUNocGMwRnljbUY1S0dOMWNuWmxXekJkS1NBbUppQjBlWEJsYjJZZ1kzVnlkbVZiTUYxYk1GMGdQVDA5SUNkdWRXMWlaWEluS1NCN1hHNGdJQ0FnWm05eUlDaDJZWElnYVNBOUlEQXNJR3hsYmlBOUlHTjFjblpsTG14bGJtZDBhQ0F0SURFN0lHa2dQQ0JzWlc0N0lHa3JLeWtnZTF4dUlDQWdJQ0FnZG1GeUlITmxaMjFsYm5RZ1BTQjBhR2x6TG1WdWMzVnlaVXhoYzNSUWIybHVkQ2hjYmlBZ0lDQWdJQ0FnZEdocGN5NWZiMlptYzJWMFUyVm5iV1Z1ZENoamRYSjJaVnRwWFN3Z1kzVnlkbVZiYVNBcklERmRMQ0JsWkdkbGMxdHBYU3dnWldSblpYTmJhU0FySURGZExDQjBhR2x6TGw5a2FYTjBZVzVqWlNsY2JpQWdJQ0FnSUNrN1hHNGdJQ0FnSUNCamIyNXpiMnhsTG14dlp5Z25jMlZuYldWdWRDY3NJSE5sWjIxbGJuUXNJSFZ1YVc5dUtUdGNiaUFnSUNBZ0lIVnVhVzl1SUQwZ0tHa2dQVDA5SURBcElEOGdjMlZuYldWdWRDQTZJRzFoY25ScGJtVjZMblZ1YVc5dUtIVnVhVzl1TENCelpXZHRaVzUwS1R0Y2JpQWdJQ0I5WEc0Z0lIMGdaV3h6WlNCN1hHNGdJQ0FnWm05eUlDaDJZWElnYVNBOUlEQXNJR3hsYmlBOUlHTjFjblpsTG14bGJtZDBhRHNnYVNBOElHeGxianNnYVNzcktTQjdYRzRnSUNBZ0lDQjFibWx2YmlBOUlDaHBJRDA5UFNBd0tTQS9YRzRnSUNBZ0lDQWdJSFJvYVhNdWIyWm1jMlYwUTI5dWRHOTFjaWhqZFhKMlpWdHBYU3dnWldSblpYTmJhVjBwSURwY2JpQWdJQ0FnSUNBZ2JXRnlkR2x1WlhvdWRXNXBiMjRvZFc1cGIyNHNJSFJvYVhNdWIyWm1jMlYwUTI5dWRHOTFjaWhqZFhKMlpWdHBYU3dnWldSblpYTmJhVjBwS1R0Y2JpQWdJQ0I5WEc0Z0lIMWNiaUFnY21WMGRYSnVJSFZ1YVc5dU8xeHVmVHRjYmx4dVhHNHZLaXBjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ1pHbHpkR0Z1WTJWY2JpQXFJRUJ5WlhSMWNtNGdlMEZ5Y21GNUxqeEJjbkpoZVM0OFRuVnRZbVZ5UG4xY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzV2Wm1aelpYUlFiMmx1ZENBOUlHWjFibU4wYVc5dUtHUnBjM1JoYm1ObEtTQjdYRzRnSUhSb2FYTXVaR2x6ZEdGdVkyVW9aR2x6ZEdGdVkyVXBPMXh1SUNCMllYSWdkbVZ5ZEdsalpYTWdQU0IwYUdsekxsOWhjbU5UWldkdFpXNTBjeUFxSURJN1hHNGdJSFpoY2lCd2IybHVkSE1nSUNBOUlGdGRPMXh1SUNCMllYSWdZMlZ1ZEdWeUlDQWdQU0IwYUdsekxuWmxjblJwWTJWeld6QmRPMXh1SUNCMllYSWdjbUZrYVhWeklDQWdQU0IwYUdsekxsOWthWE4wWVc1alpUdGNiaUFnZG1GeUlHRnVaMnhsSUNBZ0lEMGdNRHRjYmx4dUlDQm1iM0lnS0haaGNpQnBJRDBnTURzZ2FTQThJSFpsY25ScFkyVnpJQzBnTVRzZ2FTc3JLU0I3WEc0Z0lDQWdZVzVuYkdVZ0t6MGdLRElnS2lCTllYUm9MbEJKSUM4Z2RtVnlkR2xqWlhNcE95QXZMeUJqYjNWdWRHVnlMV05zYjJOcmQybHpaVnh1SUNBZ0lIQnZhVzUwY3k1d2RYTm9LRnRjYmlBZ0lDQWdJR05sYm5SbGNsc3dYU0FySUNoeVlXUnBkWE1nS2lCTllYUm9MbU52Y3loaGJtZHNaU2twTEZ4dUlDQWdJQ0FnWTJWdWRHVnlXekZkSUNzZ0tISmhaR2wxY3lBcUlFMWhkR2d1YzJsdUtHRnVaMnhsS1NsY2JpQWdJQ0JkS1R0Y2JpQWdmVnh1WEc0Z0lISmxkSFZ5YmlCd2IybHVkSE03WEc1OU8xeHVYRzV0YjJSMWJHVXVaWGh3YjNKMGN5QTlJRTltWm5ObGREdGNiaUpkZlE9PSIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJ0eXBlXCI6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgXCJmZWF0dXJlc1wiOiBbXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHt9LFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg0NjYzMjk1NzQ1ODYsXG4gICAgICAgICAgICAgIDIyLjI2Nzg5MDMxNTkwNTUwN1xuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4ODQwNzY1OTUzMDY1LFxuICAgICAgICAgICAgICAyMi4yNjkyNjA0NzAyNjE3OFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NjUxOTM4NDM4NDE3LFxuICAgICAgICAgICAgICAyMi4yNjcyODQ2NjM2ODkzMjRcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODc2MjQ0NTQ0OTgzLFxuICAgICAgICAgICAgICAyMi4yNjU0Mzc5MDQ2ODM0XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg0OTk1ODg5NjYzNzEsXG4gICAgICAgICAgICAgIDIyLjI2NjI3MTkyNzg5NzU5NVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NDY2MzI5NTc0NTg2LFxuICAgICAgICAgICAgICAyMi4yNjc4OTAzMTU5MDU1MDdcbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODkyNTUyMzc1NzkzNSxcbiAgICAgICAgICAgIDIyLjI2NzU5MjQ1NDQ4NzQ1NlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE5MjA0NDczNDk1NDgzLFxuICAgICAgICAgICAgMjIuMjY5MjgwMzI3NDcyNjZcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xOTEyMTg2MTQ1NzgyNixcbiAgICAgICAgICAgIDIyLjI2NDg4MTg4NjQ0NTc4XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTkzNTc4OTU4NTExMzcsXG4gICAgICAgICAgICAyMi4yNjY5MjcyMjgzNjQ0NzdcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODkzNTE3OTcxMDM5LFxuICAgICAgICAgICAgMjIuMjY2NTMwMDc2OTMyNjlcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJQb2ludFwiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFsxMTQuMTg5NDkxMjcxOTcyNjcsIDIyLjI3MTgwMjE3MDM0Njg4NF1cbiAgICAgIH1cbiAgICB9XG4gIF1cbn1cbiJdfQ==
