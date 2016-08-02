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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4YW1wbGUvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIE9mZnNldCA9IGdsb2JhbC5PZmZzZXQgPSByZXF1aXJlKCcuLi9zcmMvb2Zmc2V0Jyk7XG5yZXF1aXJlKCcuL2xlYWZsZXRfbXVsdGlwb2x5Z29uJyk7XG5yZXF1aXJlKCcuL3BvbHlnb25fY29udHJvbCcpO1xudmFyIE9mZnNldENvbnRyb2wgPSByZXF1aXJlKCcuL29mZnNldF9jb250cm9sJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL3Rlc3QvZml4dHVyZXMvZGVtby5qc29uJyk7XG52YXIgcHJvamVjdCA9IHJlcXVpcmUoJ2dlb2pzb24tcHJvamVjdCcpO1xuXG52YXIgYXJjU2VnbWVudHMgPSA1O1xuXG52YXIgc3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgY29sb3I6ICcjNDhmJyxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICBkYXNoQXJyYXk6IFsyLCA0XVxuICAgIH0sXG4gICAgbWFyZ2luU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjMjc2RDhGJ1xuICAgIH0sXG4gICAgcGFkZGluZ1N0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnI0Q4MTcwNidcbiAgICB9LFxuICAgIGNlbnRlciA9IFsyMi4yNjcwLCAxMTQuMTg4XSxcbiAgICB6b29tID0gMTcsXG4gICAgbWFwLCB2ZXJ0aWNlcywgcmVzdWx0O1xuXG5tYXAgPSBnbG9iYWwubWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgem9vbSk7XG5cblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld1BvaW50Q29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0TWFya2VyXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKGRhdGEpLmFkZFRvKG1hcCk7XG52YXIgcmVzdWx0cyA9IGdsb2JhbC5yZXN1bHRzID0gTC5nZW9Kc29uKG51bGwsIHtcbiAgc3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFyZ2luU3R5bGU7XG4gIH1cbn0pLmFkZFRvKG1hcCk7XG5tYXAuZml0Qm91bmRzKGxheWVycy5nZXRCb3VuZHMoKSwgeyBhbmltYXRlOiBmYWxzZSB9KTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5mdW5jdGlvbiBydW4gKG1hcmdpbikge1xuICByZXN1bHRzLmNsZWFyTGF5ZXJzKCk7XG4gIGxheWVycy5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgZ2ogPSBsYXllci50b0dlb0pTT04oKTtcbiAgICBjb25zb2xlLmxvZyhnaiwgbWFyZ2luKTtcbiAgICB2YXIgc2hhcGUgPSBwcm9qZWN0KGdqLCBmdW5jdGlvbihjb29yZCkge1xuICAgICAgdmFyIHB0ID0gbWFwLm9wdGlvbnMuY3JzLmxhdExuZ1RvUG9pbnQoTC5sYXRMbmcoY29vcmQuc2xpY2UoKS5yZXZlcnNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbiAgICAgIHJldHVybiBbcHQueCwgcHQueV07XG4gICAgfSk7XG5cbiAgICB2YXIgbWFyZ2luZWQ7XG4gICAgY29uc29sZS5sb2coZ2ouZ2VvbWV0cnkudHlwZSk7XG4gICAgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgaWYgKG1hcmdpbiA8IDApIHJldHVybjtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpXG4gICAgICAgIC5vZmZzZXRMaW5lKG1hcmdpbik7XG5cbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogbWFyZ2luID09PSAwID8gJ0xpbmVTdHJpbmcnIDogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpXG4gICAgICAgIC5vZmZzZXQobWFyZ2luKTtcblxuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHJlc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykub2Zmc2V0KG1hcmdpbik7XG4gICAgICBtYXJnaW5lZCA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogcmVzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ21hcmdpbmVkJywgbWFyZ2luZWQpO1xuICAgIHJlc3VsdHMuYWRkRGF0YShwcm9qZWN0KG1hcmdpbmVkLCBmdW5jdGlvbihwdCkge1xuICAgICAgdmFyIGxsID0gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwdC5zbGljZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW2xsLmxuZywgbGwubGF0XTtcbiAgICB9KSk7XG4gIH0pO1xufVxuXG5ydW4gKDIwKTtcbiJdfQ==
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
var equals = require('./equals');

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

  return (!e1.isSubject && e2.isSubject) ? 1 : -1;

  // uncomment this if you want to play with multipolygons
  // if (e1.isSubject === e2.isSubject) {
  //   if(equals(e1.point, e2.point) && e1.contourId === e2.contourId) {
  //     return 0;
  //   } else {
  //     return e1.contourId > e2.contourId ? 1 : -1;
  //   }
  // }
  //
  // return e1.isSubject ? -1 : 1;
}

},{"./equals":14,"./signed_area":17}],12:[function(require,module,exports){
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
      var ins = sweepLine.insert(event);
      // _renderSweepLine(sweepLine, event.point, event);

      next = sweepLine.findIter(event);
      prev = sweepLine.findIter(event);
      event.iterator = sweepLine.findIter(event);

      // Cannot get out of the tree what we just put there
      if (!prev || !next) {
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
  if (!isArray(contour[0][0])) {
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
  var i, len;
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
  var event, i, len;
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9hcHAuanMiLCJleGFtcGxlL2xlYWZsZXRfbXVsdGlwb2x5Z29uLmpzIiwiZXhhbXBsZS9vZmZzZXRfY29udHJvbC5qcyIsImV4YW1wbGUvcG9seWdvbl9jb250cm9sLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9iaW50cmVlLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9yYnRyZWUuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL3RyZWViYXNlLmpzIiwibm9kZV9tb2R1bGVzL2dlb2pzb24tcHJvamVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfc2VnbWVudHMuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvZWRnZV90eXBlLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2VxdWFscy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zZWdtZW50X2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zaWduZWRfYXJlYS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zd2VlcF9ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW55cXVldWUvaW5kZXguanMiLCJzcmMvZWRnZS5qcyIsInNyYy9vZmZzZXQuanMiLCJzcmMvdXRpbHMuanMiLCJ0ZXN0L2ZpeHR1cmVzL2RlbW8uanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25EQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMU5BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZPQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0dBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pyQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3paQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgT2Zmc2V0ID0gZ2xvYmFsLk9mZnNldCA9IHJlcXVpcmUoJy4uL3NyYy9vZmZzZXQnKTtcbnJlcXVpcmUoJy4vbGVhZmxldF9tdWx0aXBvbHlnb24nKTtcbnJlcXVpcmUoJy4vcG9seWdvbl9jb250cm9sJyk7XG52YXIgT2Zmc2V0Q29udHJvbCA9IHJlcXVpcmUoJy4vb2Zmc2V0X2NvbnRyb2wnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9kZW1vLmpzb24nKTtcbnZhciBwcm9qZWN0ID0gcmVxdWlyZSgnZ2VvanNvbi1wcm9qZWN0Jyk7XG5cbnZhciBhcmNTZWdtZW50cyA9IDU7XG5cbnZhciBzdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAzLFxuICAgICAgICBjb2xvcjogJyM0OGYnLFxuICAgICAgICBvcGFjaXR5OiAwLjgsXG4gICAgICAgIGRhc2hBcnJheTogWzIsIDRdXG4gICAgfSxcbiAgICBtYXJnaW5TdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAyLFxuICAgICAgICBjb2xvcjogJyMyNzZEOEYnXG4gICAgfSxcbiAgICBwYWRkaW5nU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjRDgxNzA2J1xuICAgIH0sXG4gICAgY2VudGVyID0gWzIyLjI2NzAsIDExNC4xODhdLFxuICAgIHpvb20gPSAxNyxcbiAgICBtYXAsIHZlcnRpY2VzLCByZXN1bHQ7XG5cbm1hcCA9IGdsb2JhbC5tYXAgPSBMLm1hcCgnbWFwJywge1xuICBlZGl0YWJsZTogdHJ1ZSxcbiAgbWF4Wm9vbTogMjJcbn0pLnNldFZpZXcoY2VudGVyLCB6b29tKTtcblxuXG5tYXAuYWRkQ29udHJvbChuZXcgTC5OZXdQb2x5Z29uQ29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0UG9seWdvblxufSkpO1xuXG5tYXAuYWRkQ29udHJvbChuZXcgTC5OZXdMaW5lQ29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0UG9seWxpbmVcbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9pbnRDb250cm9sKHtcbiAgY2FsbGJhY2s6IG1hcC5lZGl0VG9vbHMuc3RhcnRNYXJrZXJcbn0pKTtcblxudmFyIGxheWVycyA9IGdsb2JhbC5sYXllcnMgPSBMLmdlb0pzb24oZGF0YSkuYWRkVG8obWFwKTtcbnZhciByZXN1bHRzID0gZ2xvYmFsLnJlc3VsdHMgPSBMLmdlb0pzb24obnVsbCwge1xuICBzdHlsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiBtYXJnaW5TdHlsZTtcbiAgfVxufSkuYWRkVG8obWFwKTtcbm1hcC5maXRCb3VuZHMobGF5ZXJzLmdldEJvdW5kcygpLCB7IGFuaW1hdGU6IGZhbHNlIH0pO1xuXG5tYXAuYWRkQ29udHJvbChuZXcgT2Zmc2V0Q29udHJvbCh7XG4gIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICBsYXllcnMuY2xlYXJMYXllcnMoKTtcbiAgfSxcbiAgY2FsbGJhY2s6IHJ1blxufSkpO1xuXG5tYXAub24oJ2VkaXRhYmxlOmNyZWF0ZWQnLCBmdW5jdGlvbihldnQpIHtcbiAgbGF5ZXJzLmFkZExheWVyKGV2dC5sYXllcik7XG4gIGV2dC5sYXllci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKChlLm9yaWdpbmFsRXZlbnQuY3RybEtleSB8fCBlLm9yaWdpbmFsRXZlbnQubWV0YUtleSkgJiYgdGhpcy5lZGl0RW5hYmxlZCgpKSB7XG4gICAgICB0aGlzLmVkaXRvci5uZXdIb2xlKGUubGF0bG5nKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIHJ1biAobWFyZ2luKSB7XG4gIHJlc3VsdHMuY2xlYXJMYXllcnMoKTtcbiAgbGF5ZXJzLmVhY2hMYXllcihmdW5jdGlvbihsYXllcikge1xuICAgIHZhciBnaiA9IGxheWVyLnRvR2VvSlNPTigpO1xuICAgIGNvbnNvbGUubG9nKGdqLCBtYXJnaW4pO1xuICAgIHZhciBzaGFwZSA9IHByb2plY3QoZ2osIGZ1bmN0aW9uKGNvb3JkKSB7XG4gICAgICB2YXIgcHQgPSBtYXAub3B0aW9ucy5jcnMubGF0TG5nVG9Qb2ludChMLmxhdExuZyhjb29yZC5zbGljZSgpLnJldmVyc2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtwdC54LCBwdC55XTtcbiAgICB9KTtcblxuICAgIHZhciBtYXJnaW5lZDtcbiAgICBjb25zb2xlLmxvZyhnai5nZW9tZXRyeS50eXBlKTtcbiAgICBpZiAoZ2ouZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICBpZiAobWFyZ2luIDwgMCkgcmV0dXJuO1xuICAgICAgdmFyIHJlcyA9IG5ldyBPZmZzZXQoc2hhcGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpXG4gICAgICAgIC5hcmNTZWdtZW50cyhhcmNTZWdtZW50cylcbiAgICAgICAgLm9mZnNldExpbmUobWFyZ2luKTtcblxuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiBtYXJnaW4gPT09IDAgPyAnTGluZVN0cmluZycgOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHJlc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZ2ouZ2VvbWV0cnkudHlwZSA9PT0gJ1BvaW50Jykge1xuICAgICAgdmFyIHJlcyA9IG5ldyBPZmZzZXQoc2hhcGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpXG4gICAgICAgIC5hcmNTZWdtZW50cyhhcmNTZWdtZW50cylcbiAgICAgICAgLm9mZnNldChtYXJnaW4pO1xuXG4gICAgICBtYXJnaW5lZCA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogcmVzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKS5vZmZzZXQobWFyZ2luKTtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnbWFyZ2luZWQnLCBtYXJnaW5lZCk7XG4gICAgcmVzdWx0cy5hZGREYXRhKHByb2plY3QobWFyZ2luZWQsIGZ1bmN0aW9uKHB0KSB7XG4gICAgICB2YXIgbGwgPSBtYXAub3B0aW9ucy5jcnMucG9pbnRUb0xhdExuZyhMLnBvaW50KHB0LnNsaWNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbiAgICAgIHJldHVybiBbbGwubG5nLCBsbC5sYXRdO1xuICAgIH0pKTtcbiAgfSk7XG59XG5cbnJ1biAoMjApO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVjRZVzF3YkdVdllYQndMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFTSXNJbVpwYkdVaU9pSm5aVzVsY21GMFpXUXVhbk1pTENKemIzVnlZMlZTYjI5MElqb2lJaXdpYzI5MWNtTmxjME52Ym5SbGJuUWlPbHNpZG1GeUlFOW1abk5sZENBOUlHZHNiMkpoYkM1UFptWnpaWFFnUFNCeVpYRjFhWEpsS0NjdUxpOXpjbU12YjJabWMyVjBKeWs3WEc1eVpYRjFhWEpsS0NjdUwyeGxZV1pzWlhSZmJYVnNkR2x3YjJ4NVoyOXVKeWs3WEc1eVpYRjFhWEpsS0NjdUwzQnZiSGxuYjI1ZlkyOXVkSEp2YkNjcE8xeHVkbUZ5SUU5bVpuTmxkRU52Ym5SeWIyd2dQU0J5WlhGMWFYSmxLQ2N1TDI5bVpuTmxkRjlqYjI1MGNtOXNKeWs3WEc1MllYSWdaR0YwWVNBOUlISmxjWFZwY21Vb0p5NHVMM1JsYzNRdlptbDRkSFZ5WlhNdlpHVnRieTVxYzI5dUp5azdYRzUyWVhJZ2NISnZhbVZqZENBOUlISmxjWFZwY21Vb0oyZGxiMnB6YjI0dGNISnZhbVZqZENjcE8xeHVYRzUyWVhJZ1lYSmpVMlZuYldWdWRITWdQU0ExTzF4dVhHNTJZWElnYzNSNWJHVWdQU0I3WEc0Z0lDQWdJQ0FnSUhkbGFXZG9kRG9nTXl4Y2JpQWdJQ0FnSUNBZ1kyOXNiM0k2SUNjak5EaG1KeXhjYmlBZ0lDQWdJQ0FnYjNCaFkybDBlVG9nTUM0NExGeHVJQ0FnSUNBZ0lDQmtZWE5vUVhKeVlYazZJRnN5TENBMFhWeHVJQ0FnSUgwc1hHNGdJQ0FnYldGeVoybHVVM1I1YkdVZ1BTQjdYRzRnSUNBZ0lDQWdJSGRsYVdkb2REb2dNaXhjYmlBZ0lDQWdJQ0FnWTI5c2IzSTZJQ2NqTWpjMlJEaEdKMXh1SUNBZ0lIMHNYRzRnSUNBZ2NHRmtaR2x1WjFOMGVXeGxJRDBnZTF4dUlDQWdJQ0FnSUNCM1pXbG5hSFE2SURJc1hHNGdJQ0FnSUNBZ0lHTnZiRzl5T2lBbkkwUTRNVGN3TmlkY2JpQWdJQ0I5TEZ4dUlDQWdJR05sYm5SbGNpQTlJRnN5TWk0eU5qY3dMQ0F4TVRRdU1UZzRYU3hjYmlBZ0lDQjZiMjl0SUQwZ01UY3NYRzRnSUNBZ2JXRndMQ0IyWlhKMGFXTmxjeXdnY21WemRXeDBPMXh1WEc1dFlYQWdQU0JuYkc5aVlXd3ViV0Z3SUQwZ1RDNXRZWEFvSjIxaGNDY3NJSHRjYmlBZ1pXUnBkR0ZpYkdVNklIUnlkV1VzWEc0Z0lHMWhlRnB2YjIwNklESXlYRzU5S1M1elpYUldhV1YzS0dObGJuUmxjaXdnZW05dmJTazdYRzVjYmx4dWJXRndMbUZrWkVOdmJuUnliMndvYm1WM0lFd3VUbVYzVUc5c2VXZHZia052Ym5SeWIyd29lMXh1SUNCallXeHNZbUZqYXpvZ2JXRndMbVZrYVhSVWIyOXNjeTV6ZEdGeWRGQnZiSGxuYjI1Y2JuMHBLVHRjYmx4dWJXRndMbUZrWkVOdmJuUnliMndvYm1WM0lFd3VUbVYzVEdsdVpVTnZiblJ5YjJ3b2UxeHVJQ0JqWVd4c1ltRmphem9nYldGd0xtVmthWFJVYjI5c2N5NXpkR0Z5ZEZCdmJIbHNhVzVsWEc1OUtTazdYRzVjYm0xaGNDNWhaR1JEYjI1MGNtOXNLRzVsZHlCTUxrNWxkMUJ2YVc1MFEyOXVkSEp2YkNoN1hHNGdJR05oYkd4aVlXTnJPaUJ0WVhBdVpXUnBkRlJ2YjJ4ekxuTjBZWEowVFdGeWEyVnlYRzU5S1NrN1hHNWNiblpoY2lCc1lYbGxjbk1nUFNCbmJHOWlZV3d1YkdGNVpYSnpJRDBnVEM1blpXOUtjMjl1S0dSaGRHRXBMbUZrWkZSdktHMWhjQ2s3WEc1MllYSWdjbVZ6ZFd4MGN5QTlJR2RzYjJKaGJDNXlaWE4xYkhSeklEMGdUQzVuWlc5S2MyOXVLRzUxYkd3c0lIdGNiaUFnYzNSNWJHVTZJR1oxYm1OMGFXOXVLR1psWVhSMWNtVXBJSHRjYmlBZ0lDQnlaWFIxY200Z2JXRnlaMmx1VTNSNWJHVTdYRzRnSUgxY2JuMHBMbUZrWkZSdktHMWhjQ2s3WEc1dFlYQXVabWwwUW05MWJtUnpLR3hoZVdWeWN5NW5aWFJDYjNWdVpITW9LU3dnZXlCaGJtbHRZWFJsT2lCbVlXeHpaU0I5S1R0Y2JseHViV0Z3TG1Ga1pFTnZiblJ5YjJ3b2JtVjNJRTltWm5ObGRFTnZiblJ5YjJ3b2UxeHVJQ0JqYkdWaGNqb2dablZ1WTNScGIyNG9LU0I3WEc0Z0lDQWdiR0Y1WlhKekxtTnNaV0Z5VEdGNVpYSnpLQ2s3WEc0Z0lIMHNYRzRnSUdOaGJHeGlZV05yT2lCeWRXNWNibjBwS1R0Y2JseHViV0Z3TG05dUtDZGxaR2wwWVdKc1pUcGpjbVZoZEdWa0p5d2dablZ1WTNScGIyNG9aWFowS1NCN1hHNGdJR3hoZVdWeWN5NWhaR1JNWVhsbGNpaGxkblF1YkdGNVpYSXBPMXh1SUNCbGRuUXViR0Y1WlhJdWIyNG9KMk5zYVdOckp5d2dablZ1WTNScGIyNG9aU2tnZTF4dUlDQWdJR2xtSUNnb1pTNXZjbWxuYVc1aGJFVjJaVzUwTG1OMGNteExaWGtnZkh3Z1pTNXZjbWxuYVc1aGJFVjJaVzUwTG0xbGRHRkxaWGtwSUNZbUlIUm9hWE11WldScGRFVnVZV0pzWldRb0tTa2dlMXh1SUNBZ0lDQWdkR2hwY3k1bFpHbDBiM0l1Ym1WM1NHOXNaU2hsTG14aGRHeHVaeWs3WEc0Z0lDQWdmVnh1SUNCOUtUdGNibjBwTzF4dVhHNW1kVzVqZEdsdmJpQnlkVzRnS0cxaGNtZHBiaWtnZTF4dUlDQnlaWE4xYkhSekxtTnNaV0Z5VEdGNVpYSnpLQ2s3WEc0Z0lHeGhlV1Z5Y3k1bFlXTm9UR0Y1WlhJb1puVnVZM1JwYjI0b2JHRjVaWElwSUh0Y2JpQWdJQ0IyWVhJZ1oyb2dQU0JzWVhsbGNpNTBiMGRsYjBwVFQwNG9LVHRjYmlBZ0lDQmpiMjV6YjJ4bExteHZaeWhuYWl3Z2JXRnlaMmx1S1R0Y2JpQWdJQ0IyWVhJZ2MyaGhjR1VnUFNCd2NtOXFaV04wS0dkcUxDQm1kVzVqZEdsdmJpaGpiMjl5WkNrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEIwSUQwZ2JXRndMbTl3ZEdsdmJuTXVZM0p6TG14aGRFeHVaMVJ2VUc5cGJuUW9UQzVzWVhSTWJtY29ZMjl2Y21RdWMyeHBZMlVvS1M1eVpYWmxjbk5sS0NrcExDQnRZWEF1WjJWMFdtOXZiU2dwS1R0Y2JpQWdJQ0FnSUhKbGRIVnliaUJiY0hRdWVDd2djSFF1ZVYwN1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCMllYSWdiV0Z5WjJsdVpXUTdYRzRnSUNBZ1kyOXVjMjlzWlM1c2IyY29aMm91WjJWdmJXVjBjbmt1ZEhsd1pTazdYRzRnSUNBZ2FXWWdLR2RxTG1kbGIyMWxkSEo1TG5SNWNHVWdQVDA5SUNkTWFXNWxVM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdhV1lnS0cxaGNtZHBiaUE4SURBcElISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUhaaGNpQnlaWE1nUFNCdVpYY2dUMlptYzJWMEtITm9ZWEJsTG1kbGIyMWxkSEo1TG1OdmIzSmthVzVoZEdWektWeHVJQ0FnSUNBZ0lDQXVZWEpqVTJWbmJXVnVkSE1vWVhKalUyVm5iV1Z1ZEhNcFhHNGdJQ0FnSUNBZ0lDNXZabVp6WlhSTWFXNWxLRzFoY21kcGJpazdYRzVjYmlBZ0lDQWdJRzFoY21kcGJtVmtJRDBnZTF4dUlDQWdJQ0FnSUNCMGVYQmxPaUFuUm1WaGRIVnlaU2NzWEc0Z0lDQWdJQ0FnSUdkbGIyMWxkSEo1T2lCN1hHNGdJQ0FnSUNBZ0lDQWdkSGx3WlRvZ2JXRnlaMmx1SUQwOVBTQXdJRDhnSjB4cGJtVlRkSEpwYm1jbklEb2dKMUJ2YkhsbmIyNG5MRnh1SUNBZ0lDQWdJQ0FnSUdOdmIzSmthVzVoZEdWek9pQnlaWE5jYmlBZ0lDQWdJQ0FnZlZ4dUlDQWdJQ0FnZlR0Y2JpQWdJQ0I5SUdWc2MyVWdhV1lnS0dkcUxtZGxiMjFsZEhKNUxuUjVjR1VnUFQwOUlDZFFiMmx1ZENjcElIdGNiaUFnSUNBZ0lIWmhjaUJ5WlhNZ1BTQnVaWGNnVDJabWMyVjBLSE5vWVhCbExtZGxiMjFsZEhKNUxtTnZiM0prYVc1aGRHVnpLVnh1SUNBZ0lDQWdJQ0F1WVhKalUyVm5iV1Z1ZEhNb1lYSmpVMlZuYldWdWRITXBYRzRnSUNBZ0lDQWdJQzV2Wm1aelpYUW9iV0Z5WjJsdUtUdGNibHh1SUNBZ0lDQWdiV0Z5WjJsdVpXUWdQU0I3WEc0Z0lDQWdJQ0FnSUhSNWNHVTZJQ2RHWldGMGRYSmxKeXhjYmlBZ0lDQWdJQ0FnWjJWdmJXVjBjbms2SUh0Y2JpQWdJQ0FnSUNBZ0lDQjBlWEJsT2lBblVHOXNlV2R2Ymljc1hHNGdJQ0FnSUNBZ0lDQWdZMjl2Y21ScGJtRjBaWE02SUhKbGMxeHVJQ0FnSUNBZ0lDQjlYRzRnSUNBZ0lDQjlPMXh1SUNBZ0lIMGdaV3h6WlNCN1hHNGdJQ0FnSUNCMllYSWdjbVZ6SUQwZ2JtVjNJRTltWm5ObGRDaHphR0Z3WlM1blpXOXRaWFJ5ZVM1amIyOXlaR2x1WVhSbGN5a3ViMlptYzJWMEtHMWhjbWRwYmlrN1hHNGdJQ0FnSUNCdFlYSm5hVzVsWkNBOUlIdGNiaUFnSUNBZ0lDQWdkSGx3WlRvZ0owWmxZWFIxY21VbkxGeHVJQ0FnSUNBZ0lDQm5aVzl0WlhSeWVUb2dlMXh1SUNBZ0lDQWdJQ0FnSUhSNWNHVTZJQ2RRYjJ4NVoyOXVKeXhjYmlBZ0lDQWdJQ0FnSUNCamIyOXlaR2x1WVhSbGN6b2djbVZ6WEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWTI5dWMyOXNaUzVzYjJjb0oyMWhjbWRwYm1Wa0p5d2diV0Z5WjJsdVpXUXBPMXh1SUNBZ0lISmxjM1ZzZEhNdVlXUmtSR0YwWVNod2NtOXFaV04wS0cxaGNtZHBibVZrTENCbWRXNWpkR2x2Ymlod2RDa2dlMXh1SUNBZ0lDQWdkbUZ5SUd4c0lEMGdiV0Z3TG05d2RHbHZibk11WTNKekxuQnZhVzUwVkc5TVlYUk1ibWNvVEM1d2IybHVkQ2h3ZEM1emJHbGpaU2dwS1N3Z2JXRndMbWRsZEZwdmIyMG9LU2s3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdXMnhzTG14dVp5d2diR3d1YkdGMFhUdGNiaUFnSUNCOUtTazdYRzRnSUgwcE8xeHVmVnh1WEc1eWRXNGdLREl3S1R0Y2JpSmRmUT09IiwiTC5Qb2x5Z29uLnByb3RvdHlwZS5fcHJvamVjdExhdGxuZ3MgPSBmdW5jdGlvbiAobGF0bG5ncywgcmVzdWx0LCBwcm9qZWN0ZWRCb3VuZHMsIGlzSG9sZSkge1xuICB2YXIgZmxhdCA9IGxhdGxuZ3NbMF0gaW5zdGFuY2VvZiBMLkxhdExuZyxcbiAgICAgIGxlbiA9IGxhdGxuZ3MubGVuZ3RoLFxuICAgICAgaSwgcmluZywgYXJlYTtcblxuICBpZiAoZmxhdCkge1xuICAgIGFyZWEgPSAwO1xuICAgIHJpbmcgPSBbXTtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHJpbmdbaV0gPSB0aGlzLl9tYXAubGF0TG5nVG9MYXllclBvaW50KGxhdGxuZ3NbaV0pO1xuICAgICAgcHJvamVjdGVkQm91bmRzLmV4dGVuZChyaW5nW2ldKTtcblxuICAgICAgaWYgKGkpIHtcbiAgICAgICAgYXJlYSArPSByaW5nW2kgLSAxXS54ICogcmluZ1tpXS55O1xuICAgICAgICBhcmVhIC09IHJpbmdbaV0ueCAqIHJpbmdbaSAtIDFdLnk7XG4gICAgICB9XG4gICAgfVxuICAgIGFyZWEgKz0gcmluZ1tsZW4gLSAxXS54ICogcmluZ1swXS55O1xuICAgIGFyZWEgLT0gcmluZ1swXS54ICogcmluZ1tsZW4gLSAxXS55O1xuXG4gICAgaWYgKCghaXNIb2xlICYmIGFyZWEgPiAwKSB8fCAoaXNIb2xlICYmIGFyZWEgPCAwKSkge1xuICAgICAgcmluZy5yZXZlcnNlKCk7XG4gICAgfVxuXG4gICAgcmVzdWx0LnB1c2gocmluZyk7XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB0aGlzLl9wcm9qZWN0TGF0bG5ncyhsYXRsbmdzW2ldLCByZXN1bHQsIHByb2plY3RlZEJvdW5kcywgaSAhPT0gMCk7XG4gICAgfVxuICB9XG59O1xuXG5cbkwuUG9seWdvbi5wcm90b3R5cGUuX3Byb2plY3QgPSBmdW5jdGlvbigpIHtcbiAgTC5Qb2x5bGluZS5wcm90b3R5cGUuX3Byb2plY3QuY2FsbCh0aGlzKTtcbiAgaWYgKCh0aGlzLl9sYXRsbmdzLmxlbmd0aCA+IDEpICYmXG4gICAgIUwuUG9seWxpbmUuX2ZsYXQodGhpcy5fbGF0bG5ncykgJiZcbiAgICAhKHRoaXMuX2xhdGxuZ3NbMF1bMF0gaW5zdGFuY2VvZiBMLkxhdExuZykpIHtcbiAgICBpZiAodGhpcy5vcHRpb25zLmZpbGxSdWxlICE9PSAnbm9uemVybycpIHtcbiAgICAgIHRoaXMuc2V0U3R5bGUoe1xuICAgICAgICBmaWxsUnVsZTogJ25vbnplcm8nXG4gICAgICB9KTtcbiAgICB9XG4gIH1cbn07IiwibW9kdWxlLmV4cG9ydHMgPSBMLkNvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wcmlnaHQnLFxuICAgIGRlZmF1bHRNYXJnaW46IDIwXG4gIH0sXG5cbiAgb25BZGQ6IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1iYXInKTtcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZCA9ICcjZmZmZmZmJztcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUucGFkZGluZyA9ICcxMHB4JztcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gW1xuICAgICAgJzxmb3JtPicsXG4gICAgICAgICc8ZGl2PicsXG4gICAgICAgICAgJzxsYWJlbD4nLFxuICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgdmFsdWU9XCInLCAgdGhpcy5vcHRpb25zLmRlZmF1bHRNYXJnaW4sICdcIiBuYW1lPVwibWFyZ2luXCI+JyxcbiAgICAgICAgICAnPC9sYWJlbD4nLFxuICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgJzxkaXY+JyxcbiAgICAgICAgICAnPGxhYmVsPicsICc8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm9wZXJhdGlvblwiIHZhbHVlPVwiMVwiIGNoZWNrZWQ+JywgJyBtYXJnaW48L2xhYmVsPicsXG4gICAgICAgICAgJzxsYWJlbD4nLCAnPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJvcGVyYXRpb25cIiB2YWx1ZT1cIi0xXCI+JywgJyBwYWRkaW5nPC9sYWJlbD4nLFxuICAgICAgICAnPC9kaXY+JywgJzxicj4nLFxuICAgICAgICAnPGlucHV0IHR5cGU9XCJzdWJtaXRcIiB2YWx1ZT1cIlJ1blwiPicsICc8aW5wdXQgbmFtZT1cImNsZWFyXCIgdHlwZT1cImJ1dHRvblwiIHZhbHVlPVwiQ2xlYXIgbGF5ZXJzXCI+JyxcbiAgICAgICc8L2Zvcm0+J10uam9pbignJyk7XG5cbiAgICB2YXIgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgTC5Eb21FdmVudFxuICAgICAgLm9uKGZvcm0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIEwuRG9tRXZlbnQuc3RvcChldnQpO1xuICAgICAgICB2YXIgbWFyZ2luID0gcGFyc2VGbG9hdChmb3JtWydtYXJnaW4nXS52YWx1ZSk7XG4gICAgICAgIHZhciByYWRpb3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChcbiAgICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9cmFkaW9dJykpO1xuICAgICAgICB2YXIgayA9IDE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByYWRpb3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZiAocmFkaW9zW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGsgKj0gcGFyc2VJbnQocmFkaW9zW2ldLnZhbHVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMuY2FsbGJhY2sobWFyZ2luICogayk7XG4gICAgICB9LCB0aGlzKVxuICAgICAgLm9uKGZvcm1bJ2NsZWFyJ10sICdjbGljaycsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBMLkRvbUV2ZW50LnN0b3AoZXZ0KTtcbiAgICAgICAgdGhpcy5vcHRpb25zLmNsZWFyKCk7XG4gICAgICB9LCB0aGlzKTtcblxuICAgIEwuRG9tRXZlbnRcbiAgICAgIC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbih0aGlzLl9jb250YWluZXIpXG4gICAgICAuZGlzYWJsZVNjcm9sbFByb3BhZ2F0aW9uKHRoaXMuX2NvbnRhaW5lcik7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgfVxuXG59KTsiLCJMLkVkaXRDb250cm9sID0gTC5Db250cm9sLmV4dGVuZCh7XG5cbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAgY2FsbGJhY2s6IG51bGwsXG4gICAga2luZDogJycsXG4gICAgaHRtbDogJydcbiAgfSxcblxuICBvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xuICAgIHZhciBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1jb250cm9sIGxlYWZsZXQtYmFyJyksXG4gICAgICAgIGxpbmsgPSBMLkRvbVV0aWwuY3JlYXRlKCdhJywgJycsIGNvbnRhaW5lcik7XG5cbiAgICBsaW5rLmhyZWYgPSAnIyc7XG4gICAgbGluay50aXRsZSA9ICdDcmVhdGUgYSBuZXcgJyArIHRoaXMub3B0aW9ucy5raW5kO1xuICAgIGxpbmsuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmh0bWw7XG4gICAgTC5Eb21FdmVudC5vbihsaW5rLCAnY2xpY2snLCBMLkRvbUV2ZW50LnN0b3ApXG4gICAgICAgICAgICAgIC5vbihsaW5rLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkxBWUVSID0gdGhpcy5vcHRpb25zLmNhbGxiYWNrLmNhbGwobWFwLmVkaXRUb29scyk7XG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG59KTtcblxuTC5OZXdQb2x5Z29uQ29udHJvbCA9IEwuRWRpdENvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAga2luZDogJ3BvbHlnb24nLFxuICAgIGh0bWw6ICfilrAnXG4gIH1cbn0pO1xuXG5MLk5ld0xpbmVDb250cm9sID0gTC5FZGl0Q29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcbiAgICBraW5kOiAncG9seWxpbmUnLFxuICAgIGh0bWw6ICcvJ1xuICB9XG59KTtcblxuTC5OZXdQb2ludENvbnRyb2wgPSBMLkVkaXRDb250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGtpbmQ6ICdwb2ludCcsXG4gICAgaHRtbDogJyYjOTY3OTsnXG4gIH1cbn0pO1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUkJUcmVlOiByZXF1aXJlKCcuL2xpYi9yYnRyZWUnKSxcbiAgICBCaW5UcmVlOiByZXF1aXJlKCcuL2xpYi9iaW50cmVlJylcbn07XG4iLCJcbnZhciBUcmVlQmFzZSA9IHJlcXVpcmUoJy4vdHJlZWJhc2UnKTtcblxuZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIpIHtcbiAgICByZXR1cm4gZGlyID8gdGhpcy5yaWdodCA6IHRoaXMubGVmdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldF9jaGlsZCA9IGZ1bmN0aW9uKGRpciwgdmFsKSB7XG4gICAgaWYoZGlyKSB7XG4gICAgICAgIHRoaXMucmlnaHQgPSB2YWw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmxlZnQgPSB2YWw7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gQmluVHJlZShjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5zaXplID0gMDtcbn1cblxuQmluVHJlZS5wcm90b3R5cGUgPSBuZXcgVHJlZUJhc2UoKTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIGluc2VydGVkLCBmYWxzZSBpZiBkdXBsaWNhdGVcbkJpblRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGVtcHR5IHRyZWVcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGRpciA9IDA7XG5cbiAgICAvLyBzZXR1cFxuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuXG4gICAgLy8gc2VhcmNoIGRvd25cbiAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgIGlmKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGluc2VydCBuZXcgbm9kZSBhdCB0aGUgYm90dG9tXG4gICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICBwLnNldF9jaGlsZChkaXIsIG5vZGUpO1xuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9wIGlmIGZvdW5kXG4gICAgICAgIGlmKHRoaXMuX2NvbXBhcmF0b3Iobm9kZS5kYXRhLCBkYXRhKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlyID0gdGhpcy5fY29tcGFyYXRvcihub2RlLmRhdGEsIGRhdGEpIDwgMDtcblxuICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG4gICAgfVxufTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIHJlbW92ZWQsIGZhbHNlIGlmIG5vdCBmb3VuZFxuQmluVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcbiAgICB2YXIgbm9kZSA9IGhlYWQ7XG4gICAgbm9kZS5yaWdodCA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgZm91bmQgPSBudWxsOyAvLyBmb3VuZCBpdGVtXG4gICAgdmFyIGRpciA9IDE7XG5cbiAgICB3aGlsZShub2RlLmdldF9jaGlsZChkaXIpICE9PSBudWxsKSB7XG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcbiAgICAgICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgbm9kZS5kYXRhKTtcbiAgICAgICAgZGlyID0gY21wID4gMDtcblxuICAgICAgICBpZihjbXAgPT09IDApIHtcbiAgICAgICAgICAgIGZvdW5kID0gbm9kZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgIGZvdW5kLmRhdGEgPSBub2RlLmRhdGE7XG4gICAgICAgIHAuc2V0X2NoaWxkKHAucmlnaHQgPT09IG5vZGUsIG5vZGUuZ2V0X2NoaWxkKG5vZGUubGVmdCA9PT0gbnVsbCkpO1xuXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCaW5UcmVlO1xuXG4iLCJcbnZhciBUcmVlQmFzZSA9IHJlcXVpcmUoJy4vdHJlZWJhc2UnKTtcblxuZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xuICAgIHRoaXMucmVkID0gdHJ1ZTtcbn1cblxuTm9kZS5wcm90b3R5cGUuZ2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgcmV0dXJuIGRpciA/IHRoaXMucmlnaHQgOiB0aGlzLmxlZnQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIsIHZhbCkge1xuICAgIGlmKGRpcikge1xuICAgICAgICB0aGlzLnJpZ2h0ID0gdmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5sZWZ0ID0gdmFsO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIFJCVHJlZShjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5zaXplID0gMDtcbn1cblxuUkJUcmVlLnByb3RvdHlwZSA9IG5ldyBUcmVlQmFzZSgpO1xuXG4vLyByZXR1cm5zIHRydWUgaWYgaW5zZXJ0ZWQsIGZhbHNlIGlmIGR1cGxpY2F0ZVxuUkJUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJldCA9IGZhbHNlO1xuXG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBlbXB0eSB0cmVlXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaXplKys7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG5cbiAgICAgICAgdmFyIGRpciA9IDA7XG4gICAgICAgIHZhciBsYXN0ID0gMDtcblxuICAgICAgICAvLyBzZXR1cFxuICAgICAgICB2YXIgZ3AgPSBudWxsOyAvLyBncmFuZHBhcmVudFxuICAgICAgICB2YXIgZ2dwID0gaGVhZDsgLy8gZ3JhbmQtZ3JhbmQtcGFyZW50XG4gICAgICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgICAgICAgZ2dwLnJpZ2h0ID0gdGhpcy5fcm9vdDtcblxuICAgICAgICAvLyBzZWFyY2ggZG93blxuICAgICAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgICAgICBpZihub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5zZXJ0IG5ldyBub2RlIGF0IHRoZSBib3R0b21cbiAgICAgICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQoZGlyLCBub2RlKTtcbiAgICAgICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpc19yZWQobm9kZS5sZWZ0KSAmJiBpc19yZWQobm9kZS5yaWdodCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb2xvciBmbGlwXG4gICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG5vZGUubGVmdC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBub2RlLnJpZ2h0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXggcmVkIHZpb2xhdGlvblxuICAgICAgICAgICAgaWYoaXNfcmVkKG5vZGUpICYmIGlzX3JlZChwKSkge1xuICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ2dwLnJpZ2h0ID09PSBncDtcblxuICAgICAgICAgICAgICAgIGlmKG5vZGUgPT09IHAuZ2V0X2NoaWxkKGxhc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgc2luZ2xlX3JvdGF0ZShncCwgIWxhc3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgZG91YmxlX3JvdGF0ZShncCwgIWxhc3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgaWYgZm91bmRcbiAgICAgICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYXN0ID0gZGlyO1xuICAgICAgICAgICAgZGlyID0gY21wIDwgMDtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIGhlbHBlcnNcbiAgICAgICAgICAgIGlmKGdwICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZ2dwID0gZ3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncCA9IHA7XG4gICAgICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHJvb3RcbiAgICAgICAgdGhpcy5fcm9vdCA9IGhlYWQucmlnaHQ7XG4gICAgfVxuXG4gICAgLy8gbWFrZSByb290IGJsYWNrXG4gICAgdGhpcy5fcm9vdC5yZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiByZXQ7XG59O1xuXG4vLyByZXR1cm5zIHRydWUgaWYgcmVtb3ZlZCwgZmFsc2UgaWYgbm90IGZvdW5kXG5SQlRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG4gICAgdmFyIG5vZGUgPSBoZWFkO1xuICAgIG5vZGUucmlnaHQgPSB0aGlzLl9yb290O1xuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIGdwID0gbnVsbDsgLy8gZ3JhbmQgcGFyZW50XG4gICAgdmFyIGZvdW5kID0gbnVsbDsgLy8gZm91bmQgaXRlbVxuICAgIHZhciBkaXIgPSAxO1xuXG4gICAgd2hpbGUobm9kZS5nZXRfY2hpbGQoZGlyKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbGFzdCA9IGRpcjtcblxuICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICBncCA9IHA7XG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcblxuICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCBub2RlLmRhdGEpO1xuXG4gICAgICAgIGRpciA9IGNtcCA+IDA7XG5cbiAgICAgICAgLy8gc2F2ZSBmb3VuZCBub2RlXG4gICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgZm91bmQgPSBub2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHVzaCB0aGUgcmVkIG5vZGUgZG93blxuICAgICAgICBpZighaXNfcmVkKG5vZGUpICYmICFpc19yZWQobm9kZS5nZXRfY2hpbGQoZGlyKSkpIHtcbiAgICAgICAgICAgIGlmKGlzX3JlZChub2RlLmdldF9jaGlsZCghZGlyKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3IgPSBzaW5nbGVfcm90YXRlKG5vZGUsIGRpcik7XG4gICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQobGFzdCwgc3IpO1xuICAgICAgICAgICAgICAgIHAgPSBzcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIWlzX3JlZChub2RlLmdldF9jaGlsZCghZGlyKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2libGluZyA9IHAuZ2V0X2NoaWxkKCFsYXN0KTtcbiAgICAgICAgICAgICAgICBpZihzaWJsaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc19yZWQoc2libGluZy5nZXRfY2hpbGQoIWxhc3QpKSAmJiAhaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKGxhc3QpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29sb3IgZmxpcFxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmcucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ3AucmlnaHQgPT09IHA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzX3JlZChzaWJsaW5nLmdldF9jaGlsZChsYXN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncC5zZXRfY2hpbGQoZGlyMiwgZG91YmxlX3JvdGF0ZShwLCBsYXN0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Auc2V0X2NoaWxkKGRpcjIsIHNpbmdsZV9yb3RhdGUocCwgbGFzdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgY29ycmVjdCBjb2xvcmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdwYyA9IGdwLmdldF9jaGlsZChkaXIyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLmxlZnQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBncGMucmlnaHQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXBsYWNlIGFuZCByZW1vdmUgaWYgZm91bmRcbiAgICBpZihmb3VuZCAhPT0gbnVsbCkge1xuICAgICAgICBmb3VuZC5kYXRhID0gbm9kZS5kYXRhO1xuICAgICAgICBwLnNldF9jaGlsZChwLnJpZ2h0ID09PSBub2RlLCBub2RlLmdldF9jaGlsZChub2RlLmxlZnQgPT09IG51bGwpKTtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHJvb3QgYW5kIG1ha2UgaXQgYmxhY2tcbiAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcbiAgICBpZih0aGlzLl9yb290ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Jvb3QucmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvdW5kICE9PSBudWxsO1xufTtcblxuZnVuY3Rpb24gaXNfcmVkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAhPT0gbnVsbCAmJiBub2RlLnJlZDtcbn1cblxuZnVuY3Rpb24gc2luZ2xlX3JvdGF0ZShyb290LCBkaXIpIHtcbiAgICB2YXIgc2F2ZSA9IHJvb3QuZ2V0X2NoaWxkKCFkaXIpO1xuXG4gICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgc2F2ZS5nZXRfY2hpbGQoZGlyKSk7XG4gICAgc2F2ZS5zZXRfY2hpbGQoZGlyLCByb290KTtcblxuICAgIHJvb3QucmVkID0gdHJ1ZTtcbiAgICBzYXZlLnJlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHNhdmU7XG59XG5cbmZ1bmN0aW9uIGRvdWJsZV9yb3RhdGUocm9vdCwgZGlyKSB7XG4gICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgc2luZ2xlX3JvdGF0ZShyb290LmdldF9jaGlsZCghZGlyKSwgIWRpcikpO1xuICAgIHJldHVybiBzaW5nbGVfcm90YXRlKHJvb3QsIGRpcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUkJUcmVlO1xuIiwiXG5mdW5jdGlvbiBUcmVlQmFzZSgpIHt9XG5cbi8vIHJlbW92ZXMgYWxsIG5vZGVzIGZyb20gdGhlIHRyZWVcblRyZWVCYXNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgIHRoaXMuc2l6ZSA9IDA7XG59O1xuXG4vLyByZXR1cm5zIG5vZGUgZGF0YSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2VcblRyZWVCYXNlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuXG4gICAgd2hpbGUocmVzICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBjID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCByZXMuZGF0YSk7XG4gICAgICAgIGlmKGMgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IHJlcy5nZXRfY2hpbGQoYyA+IDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyByZXR1cm5zIGl0ZXJhdG9yIHRvIG5vZGUgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlXG5UcmVlQmFzZS5wcm90b3R5cGUuZmluZEl0ZXIgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XG5cbiAgICB3aGlsZShyZXMgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIHJlcy5kYXRhKTtcbiAgICAgICAgaWYoYyA9PT0gMCkge1xuICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gcmVzO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVyLl9hbmNlc3RvcnMucHVzaChyZXMpO1xuICAgICAgICAgICAgcmVzID0gcmVzLmdldF9jaGlsZChjID4gMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIFJldHVybnMgYW4gaXRlcmF0b3IgdG8gdGhlIHRyZWUgbm9kZSBhdCBvciBpbW1lZGlhdGVseSBhZnRlciB0aGUgaXRlbVxuVHJlZUJhc2UucHJvdG90eXBlLmxvd2VyQm91bmQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGN1ciA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XG4gICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICB3aGlsZShjdXIgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSBjbXAoaXRlbSwgY3VyLmRhdGEpO1xuICAgICAgICBpZihjID09PSAwKSB7XG4gICAgICAgICAgICBpdGVyLl9jdXJzb3IgPSBjdXI7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgICAgICBpdGVyLl9hbmNlc3RvcnMucHVzaChjdXIpO1xuICAgICAgICBjdXIgPSBjdXIuZ2V0X2NoaWxkKGMgPiAwKTtcbiAgICB9XG5cbiAgICBmb3IodmFyIGk9aXRlci5fYW5jZXN0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGN1ciA9IGl0ZXIuX2FuY2VzdG9yc1tpXTtcbiAgICAgICAgaWYoY21wKGl0ZW0sIGN1ci5kYXRhKSA8IDApIHtcbiAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IGN1cjtcbiAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggPSBpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpdGVyLl9hbmNlc3RvcnMubGVuZ3RoID0gMDtcbiAgICByZXR1cm4gaXRlcjtcbn07XG5cbi8vIFJldHVybnMgYW4gaXRlcmF0b3IgdG8gdGhlIHRyZWUgbm9kZSBpbW1lZGlhdGVseSBhZnRlciB0aGUgaXRlbVxuVHJlZUJhc2UucHJvdG90eXBlLnVwcGVyQm91bmQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLmxvd2VyQm91bmQoaXRlbSk7XG4gICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICB3aGlsZShpdGVyLmRhdGEoKSAhPT0gbnVsbCAmJiBjbXAoaXRlci5kYXRhKCksIGl0ZW0pID09PSAwKSB7XG4gICAgICAgIGl0ZXIubmV4dCgpO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVyO1xufTtcblxuLy8gcmV0dXJucyBudWxsIGlmIHRyZWUgaXMgZW1wdHlcblRyZWVCYXNlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICBpZihyZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgd2hpbGUocmVzLmxlZnQgIT09IG51bGwpIHtcbiAgICAgICAgcmVzID0gcmVzLmxlZnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5kYXRhO1xufTtcblxuLy8gcmV0dXJucyBudWxsIGlmIHRyZWUgaXMgZW1wdHlcblRyZWVCYXNlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICBpZihyZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgd2hpbGUocmVzLnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIHJlcyA9IHJlcy5yaWdodDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLmRhdGE7XG59O1xuXG4vLyByZXR1cm5zIGEgbnVsbCBpdGVyYXRvclxuLy8gY2FsbCBuZXh0KCkgb3IgcHJldigpIHRvIHBvaW50IHRvIGFuIGVsZW1lbnRcblRyZWVCYXNlLnByb3RvdHlwZS5pdGVyYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IodGhpcyk7XG59O1xuXG4vLyBjYWxscyBjYiBvbiBlYWNoIG5vZGUncyBkYXRhLCBpbiBvcmRlclxuVHJlZUJhc2UucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBpdD10aGlzLml0ZXJhdG9yKCksIGRhdGE7XG4gICAgd2hpbGUoKGRhdGEgPSBpdC5uZXh0KCkpICE9PSBudWxsKSB7XG4gICAgICAgIGNiKGRhdGEpO1xuICAgIH1cbn07XG5cbi8vIGNhbGxzIGNiIG9uIGVhY2ggbm9kZSdzIGRhdGEsIGluIHJldmVyc2Ugb3JkZXJcblRyZWVCYXNlLnByb3RvdHlwZS5yZWFjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGl0PXRoaXMuaXRlcmF0b3IoKSwgZGF0YTtcbiAgICB3aGlsZSgoZGF0YSA9IGl0LnByZXYoKSkgIT09IG51bGwpIHtcbiAgICAgICAgY2IoZGF0YSk7XG4gICAgfVxufTtcblxuXG5mdW5jdGlvbiBJdGVyYXRvcih0cmVlKSB7XG4gICAgdGhpcy5fdHJlZSA9IHRyZWU7XG4gICAgdGhpcy5fYW5jZXN0b3JzID0gW107XG4gICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbn1cblxuSXRlcmF0b3IucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuLy8gaWYgbnVsbC1pdGVyYXRvciwgcmV0dXJucyBmaXJzdCBub2RlXG4vLyBvdGhlcndpc2UsIHJldHVybnMgbmV4dCBub2RlXG5JdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XG4gICAgICAgIGlmKHJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21pbk5vZGUocm9vdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvci5yaWdodCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm8gZ3JlYXRlciBub2RlIGluIHN1YnRyZWUsIGdvIHVwIHRvIHBhcmVudFxuICAgICAgICAgICAgLy8gaWYgY29taW5nIGZyb20gYSByaWdodCBjaGlsZCwgY29udGludWUgdXAgdGhlIHN0YWNrXG4gICAgICAgICAgICB2YXIgc2F2ZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSh0aGlzLl9jdXJzb3IucmlnaHQgPT09IHNhdmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBuZXh0IG5vZGUgZnJvbSB0aGUgc3VidHJlZVxuICAgICAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2godGhpcy5fY3Vyc29yKTtcbiAgICAgICAgICAgIHRoaXMuX21pbk5vZGUodGhpcy5fY3Vyc29yLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuLy8gaWYgbnVsbC1pdGVyYXRvciwgcmV0dXJucyBsYXN0IG5vZGVcbi8vIG90aGVyd2lzZSwgcmV0dXJucyBwcmV2aW91cyBub2RlXG5JdGVyYXRvci5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XG4gICAgICAgIGlmKHJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21heE5vZGUocm9vdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvci5sZWZ0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgc2F2ZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSh0aGlzLl9jdXJzb3IubGVmdCA9PT0gc2F2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaCh0aGlzLl9jdXJzb3IpO1xuICAgICAgICAgICAgdGhpcy5fbWF4Tm9kZSh0aGlzLl9jdXJzb3IubGVmdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnNvciAhPT0gbnVsbCA/IHRoaXMuX2N1cnNvci5kYXRhIDogbnVsbDtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5fbWluTm9kZSA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgd2hpbGUoc3RhcnQubGVmdCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaChzdGFydCk7XG4gICAgICAgIHN0YXJ0ID0gc3RhcnQubGVmdDtcbiAgICB9XG4gICAgdGhpcy5fY3Vyc29yID0gc3RhcnQ7XG59O1xuXG5JdGVyYXRvci5wcm90b3R5cGUuX21heE5vZGUgPSBmdW5jdGlvbihzdGFydCkge1xuICAgIHdoaWxlKHN0YXJ0LnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHN0YXJ0KTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5yaWdodDtcbiAgICB9XG4gICAgdGhpcy5fY3Vyc29yID0gc3RhcnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVCYXNlO1xuXG4iLCJcbi8qKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSwgcHJvamVjdCwgY29udGV4dCkge1xuICBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIGlmIChkYXRhLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicpIHtcbiAgICAvLyBUaGF0J3MgYSBodWdlIGhhY2sgdG8gZ2V0IHRoaW5ncyB3b3JraW5nIHdpdGggYm90aCBBcmNHSVMgc2VydmVyXG4gICAgLy8gYW5kIEdlb1NlcnZlci4gR2Vvc2VydmVyIHByb3ZpZGVzIGNycyByZWZlcmVuY2UgaW4gR2VvSlNPTiwgQXJjR0lTIOKAlFxuICAgIC8vIGRvZXNuJ3QuXG4gICAgLy9pZiAoZGF0YS5jcnMpIGRlbGV0ZSBkYXRhLmNycztcbiAgICBmb3IgKHZhciBpID0gZGF0YS5mZWF0dXJlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgZGF0YS5mZWF0dXJlc1tpXSA9IHByb2plY3RGZWF0dXJlKGRhdGEuZmVhdHVyZXNbaV0sIHByb2plY3QsIGNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkYXRhID0gcHJvamVjdEZlYXR1cmUoZGF0YSwgcHJvamVjdCwgY29udGV4dCk7XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5wcm9qZWN0RmVhdHVyZSAgPSBwcm9qZWN0RmVhdHVyZTtcbm1vZHVsZS5leHBvcnRzLnByb2plY3RHZW9tZXRyeSA9IHByb2plY3RHZW9tZXRyeTtcblxuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gICAgIGRhdGEgR2VvSlNPTlxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBwcm9qZWN0RmVhdHVyZShmZWF0dXJlLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIGlmIChmZWF0dXJlLnR5cGUgPT09ICdHZW9tZXRyeUNvbGxlY3Rpb24nKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGZlYXR1cmUuZ2VvbWV0cmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZmVhdHVyZS5nZW9tZXRyaWVzW2ldID1cbiAgICAgICAgcHJvamVjdEdlb21ldHJ5KGZlYXR1cmUuZ2VvbWV0cmllc1tpXSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBwcm9qZWN0R2VvbWV0cnkoZmVhdHVyZS5nZW9tZXRyeSwgcHJvamVjdCwgY29udGV4dCk7XG4gIH1cbiAgcmV0dXJuIGZlYXR1cmU7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBkYXRhIEdlb0pTT05cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gcHJvamVjdEdlb21ldHJ5KGdlb21ldHJ5LCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIHZhciBjb29yZHMgPSBnZW9tZXRyeS5jb29yZGluYXRlcztcbiAgc3dpdGNoIChnZW9tZXRyeS50eXBlKSB7XG4gICAgY2FzZSAnUG9pbnQnOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29vcmRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvb3Jkc1tpXSA9IHByb2plY3QuY2FsbChjb250ZXh0LCBjb29yZHNbaV0pO1xuICAgICAgfVxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBjb29yZHM7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0Q29vcmRzKGNvb3JkcywgMSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3RDb29yZHMoY29vcmRzLCAxLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdENvb3Jkcyhjb29yZHMsIDIsIHByb2plY3QsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGdlb21ldHJ5O1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7Kn0gICAgICAgICBjb29yZHMgQ29vcmRzIGFycmF5c1xuICogQHBhcmFtICB7TnVtYmVyfSAgICBsZXZlbHNEZWVwXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4geyp9XG4gKi9cbmZ1bmN0aW9uIHByb2plY3RDb29yZHMoY29vcmRzLCBsZXZlbHNEZWVwLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIHZhciBjb29yZCwgaSwgbGVuO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgZm9yIChpID0gMCwgbGVuID0gY29vcmRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29vcmQgPSBsZXZlbHNEZWVwID9cbiAgICAgIHByb2plY3RDb29yZHMoY29vcmRzW2ldLCBsZXZlbHNEZWVwIC0gMSwgcHJvamVjdCwgY29udGV4dCkgOlxuICAgICAgcHJvamVjdC5jYWxsKGNvbnRleHQsIGNvb3Jkc1tpXSk7XG5cbiAgICByZXN1bHQucHVzaChjb29yZCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9pbmRleCcpO1xuIiwidmFyIHNpZ25lZEFyZWEgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG52YXIgZXF1YWxzID0gcmVxdWlyZSgnLi9lcXVhbHMnKTtcblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gZTJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzd2VlcEV2ZW50c0NvbXAoZTEsIGUyKSB7XG4gIHZhciBwMSA9IGUxLnBvaW50O1xuICB2YXIgcDIgPSBlMi5wb2ludDtcblxuICAvLyBEaWZmZXJlbnQgeC1jb29yZGluYXRlXG4gIGlmIChwMVswXSA+IHAyWzBdKSByZXR1cm4gMTtcbiAgaWYgKHAxWzBdIDwgcDJbMF0pIHJldHVybiAtMTtcblxuICAvLyBEaWZmZXJlbnQgcG9pbnRzLCBidXQgc2FtZSB4LWNvb3JkaW5hdGVcbiAgLy8gRXZlbnQgd2l0aCBsb3dlciB5LWNvb3JkaW5hdGUgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gIGlmIChwMVsxXSAhPT0gcDJbMV0pIHJldHVybiBwMVsxXSA+IHAyWzFdID8gMSA6IC0xO1xuXG4gIHJldHVybiBzcGVjaWFsQ2FzZXMoZTEsIGUyLCBwMSwgcDIpO1xufTtcblxuXG5mdW5jdGlvbiBzcGVjaWFsQ2FzZXMoZTEsIGUyLCBwMSwgcDIpIHtcbiAgLy8gU2FtZSBjb29yZGluYXRlcywgYnV0IG9uZSBpcyBhIGxlZnQgZW5kcG9pbnQgYW5kIHRoZSBvdGhlciBpc1xuICAvLyBhIHJpZ2h0IGVuZHBvaW50LiBUaGUgcmlnaHQgZW5kcG9pbnQgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gIGlmIChlMS5sZWZ0ICE9PSBlMi5sZWZ0KVxuICAgIHJldHVybiBlMS5sZWZ0ID8gMSA6IC0xO1xuXG4gIC8vIFNhbWUgY29vcmRpbmF0ZXMsIGJvdGggZXZlbnRzXG4gIC8vIGFyZSBsZWZ0IGVuZHBvaW50cyBvciByaWdodCBlbmRwb2ludHMuXG4gIC8vIG5vdCBjb2xsaW5lYXJcbiAgaWYgKHNpZ25lZEFyZWEgKHAxLCBlMS5vdGhlckV2ZW50LnBvaW50LCBlMi5vdGhlckV2ZW50LnBvaW50KSAhPT0gMCkge1xuICAgIC8vIHRoZSBldmVudCBhc3NvY2lhdGUgdG8gdGhlIGJvdHRvbSBzZWdtZW50IGlzIHByb2Nlc3NlZCBmaXJzdFxuICAgIHJldHVybiAoIWUxLmlzQmVsb3coZTIub3RoZXJFdmVudC5wb2ludCkpID8gMSA6IC0xO1xuICB9XG5cbiAgcmV0dXJuICghZTEuaXNTdWJqZWN0ICYmIGUyLmlzU3ViamVjdCkgPyAxIDogLTE7XG5cbiAgLy8gdW5jb21tZW50IHRoaXMgaWYgeW91IHdhbnQgdG8gcGxheSB3aXRoIG11bHRpcG9seWdvbnNcbiAgLy8gaWYgKGUxLmlzU3ViamVjdCA9PT0gZTIuaXNTdWJqZWN0KSB7XG4gIC8vICAgaWYoZXF1YWxzKGUxLnBvaW50LCBlMi5wb2ludCkgJiYgZTEuY29udG91cklkID09PSBlMi5jb250b3VySWQpIHtcbiAgLy8gICAgIHJldHVybiAwO1xuICAvLyAgIH0gZWxzZSB7XG4gIC8vICAgICByZXR1cm4gZTEuY29udG91cklkID4gZTIuY29udG91cklkID8gMSA6IC0xO1xuICAvLyAgIH1cbiAgLy8gfVxuICAvL1xuICAvLyByZXR1cm4gZTEuaXNTdWJqZWN0ID8gLTEgOiAxO1xufVxuIiwidmFyIHNpZ25lZEFyZWEgICAgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG52YXIgY29tcGFyZUV2ZW50cyA9IHJlcXVpcmUoJy4vY29tcGFyZV9ldmVudHMnKTtcbnZhciBlcXVhbHMgICAgICAgID0gcmVxdWlyZSgnLi9lcXVhbHMnKTtcblxuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGxlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gbGUyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcGFyZVNlZ21lbnRzKGxlMSwgbGUyKSB7XG4gIGlmIChsZTEgPT09IGxlMikgcmV0dXJuIDA7XG5cbiAgLy8gU2VnbWVudHMgYXJlIG5vdCBjb2xsaW5lYXJcbiAgaWYgKHNpZ25lZEFyZWEobGUxLnBvaW50LCBsZTEub3RoZXJFdmVudC5wb2ludCwgbGUyLnBvaW50KSAhPT0gMCB8fFxuICAgIHNpZ25lZEFyZWEobGUxLnBvaW50LCBsZTEub3RoZXJFdmVudC5wb2ludCwgbGUyLm90aGVyRXZlbnQucG9pbnQpICE9PSAwKSB7XG5cbiAgICAvLyBJZiB0aGV5IHNoYXJlIHRoZWlyIGxlZnQgZW5kcG9pbnQgdXNlIHRoZSByaWdodCBlbmRwb2ludCB0byBzb3J0XG4gICAgaWYgKGVxdWFscyhsZTEucG9pbnQsIGxlMi5wb2ludCkpIHJldHVybiBsZTEuaXNCZWxvdyhsZTIub3RoZXJFdmVudC5wb2ludCkgPyAtMSA6IDE7XG5cbiAgICAvLyBEaWZmZXJlbnQgbGVmdCBlbmRwb2ludDogdXNlIHRoZSBsZWZ0IGVuZHBvaW50IHRvIHNvcnRcbiAgICBpZiAobGUxLnBvaW50WzBdID09PSBsZTIucG9pbnRbMF0pIHJldHVybiBsZTEucG9pbnRbMV0gPCBsZTIucG9pbnRbMV0gPyAtMSA6IDE7XG5cbiAgICAvLyBoYXMgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUxIGJlZW4gaW5zZXJ0ZWRcbiAgICAvLyBpbnRvIFMgYWZ0ZXIgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUyID9cbiAgICBpZiAoY29tcGFyZUV2ZW50cyhsZTEsIGxlMikgPT09IDEpIHJldHVybiBsZTIuaXNBYm92ZShsZTEucG9pbnQpID8gLTEgOiAxO1xuXG4gICAgLy8gVGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUyIGhhcyBiZWVuIGluc2VydGVkXG4gICAgLy8gaW50byBTIGFmdGVyIHRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMVxuICAgIHJldHVybiBsZTEuaXNCZWxvdyhsZTIucG9pbnQpID8gLTEgOiAxO1xuICB9XG5cbiAgaWYgKGxlMS5pc1N1YmplY3QgPT09IGxlMi5pc1N1YmplY3QpIHsgLy8gc2FtZSBwb2x5Z29uXG4gICAgaWYgKGVxdWFscyhsZTEucG9pbnQsIGxlMi5wb2ludCkpIHtcbiAgICAgIGlmIChlcXVhbHMobGUxLm90aGVyRXZlbnQucG9pbnQsIGxlMi5vdGhlckV2ZW50LnBvaW50KSkge1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsZTEuY29udG91cklkID4gbGUyLmNvbnRvdXJJZCA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICB9XG4gIH0gZWxzZSB7IC8vIFNlZ21lbnRzIGFyZSBjb2xsaW5lYXIsIGJ1dCBiZWxvbmcgdG8gc2VwYXJhdGUgcG9seWdvbnNcbiAgICByZXR1cm4gbGUxLmlzU3ViamVjdCA/IC0xIDogMTtcbiAgfVxuXG4gIHJldHVybiBjb21wYXJlRXZlbnRzKGxlMSwgbGUyKSA9PT0gMSA/IDEgOiAtMTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXG4gIE5PUk1BTDogICAgICAgICAgICAgICAwLCBcbiAgTk9OX0NPTlRSSUJVVElORzogICAgIDEsIFxuICBTQU1FX1RSQU5TSVRJT046ICAgICAgMiwgXG4gIERJRkZFUkVOVF9UUkFOU0lUSU9OOiAzXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlcXVhbHMocDEsIHAyKSB7XG4gIHJldHVybiBwMVswXSA9PT0gcDJbMF0gJiYgcDFbMV0gPT09IHAyWzFdO1xufTsiLCJ2YXIgSU5URVJTRUNUSU9OICAgID0gMDtcbnZhciBVTklPTiAgICAgICAgICAgPSAxO1xudmFyIERJRkZFUkVOQ0UgICAgICA9IDI7XG52YXIgWE9SICAgICAgICAgICAgID0gMztcblxudmFyIEVNUFRZICAgICAgICAgICA9IFtdO1xuXG52YXIgZWRnZVR5cGUgICAgICAgID0gcmVxdWlyZSgnLi9lZGdlX3R5cGUnKTtcblxudmFyIFF1ZXVlICAgICAgICAgICA9IHJlcXVpcmUoJ3RpbnlxdWV1ZScpO1xudmFyIFRyZWUgICAgICAgICAgICA9IHJlcXVpcmUoJ2JpbnRyZWVzJykuUkJUcmVlO1xudmFyIFN3ZWVwRXZlbnQgICAgICA9IHJlcXVpcmUoJy4vc3dlZXBfZXZlbnQnKTtcblxudmFyIGNvbXBhcmVFdmVudHMgICA9IHJlcXVpcmUoJy4vY29tcGFyZV9ldmVudHMnKTtcbnZhciBjb21wYXJlU2VnbWVudHMgPSByZXF1aXJlKCcuL2NvbXBhcmVfc2VnbWVudHMnKTtcbnZhciBpbnRlcnNlY3Rpb24gICAgPSByZXF1aXJlKCcuL3NlZ21lbnRfaW50ZXJzZWN0aW9uJyk7XG52YXIgZXF1YWxzICAgICAgICAgID0gcmVxdWlyZSgnLi9lcXVhbHMnKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vLyBnbG9iYWwuVHJlZSA9IFRyZWU7XG4vLyBnbG9iYWwuY29tcGFyZVNlZ21lbnRzID0gY29tcGFyZVNlZ21lbnRzO1xuLy8gZ2xvYmFsLlN3ZWVwRXZlbnQgPSBTd2VlcEV2ZW50O1xuLy8gZ2xvYmFsLnNpZ25lZEFyZWEgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG5cbi8qKlxuICogQHBhcmFtICB7PEFycmF5LjxOdW1iZXI+fSBzMVxuICogQHBhcmFtICB7PEFycmF5LjxOdW1iZXI+fSBzMlxuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgICBpc1N1YmplY3RcbiAqIEBwYXJhbSAge1F1ZXVlfSAgICAgICAgICAgZXZlbnRRdWV1ZVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBiYm94XG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NTZWdtZW50KHMxLCBzMiwgaXNTdWJqZWN0LCBkZXB0aCwgZXZlbnRRdWV1ZSwgYmJveCkge1xuICAvLyBQb3NzaWJsZSBkZWdlbmVyYXRlIGNvbmRpdGlvbi5cbiAgLy8gaWYgKGVxdWFscyhzMSwgczIpKSByZXR1cm47XG5cbiAgdmFyIGUxID0gbmV3IFN3ZWVwRXZlbnQoczEsIGZhbHNlLCB1bmRlZmluZWQsIGlzU3ViamVjdCk7XG4gIHZhciBlMiA9IG5ldyBTd2VlcEV2ZW50KHMyLCBmYWxzZSwgZTEsICAgICAgICBpc1N1YmplY3QpO1xuICBlMS5vdGhlckV2ZW50ID0gZTI7XG5cbiAgZTEuY29udG91cklkID0gZTIuY29udG91cklkID0gZGVwdGg7XG5cbiAgaWYgKGNvbXBhcmVFdmVudHMoZTEsIGUyKSA+IDApIHtcbiAgICBlMi5sZWZ0ID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBlMS5sZWZ0ID0gdHJ1ZTtcbiAgfVxuXG4gIGJib3hbMF0gPSBtaW4oYmJveFswXSwgczFbMF0pO1xuICBiYm94WzFdID0gbWluKGJib3hbMV0sIHMxWzFdKTtcbiAgYmJveFsyXSA9IG1heChiYm94WzJdLCBzMVswXSk7XG4gIGJib3hbM10gPSBtYXgoYmJveFszXSwgczFbMV0pO1xuXG4gIC8vIFB1c2hpbmcgaXQgc28gdGhlIHF1ZXVlIGlzIHNvcnRlZCBmcm9tIGxlZnQgdG8gcmlnaHQsXG4gIC8vIHdpdGggb2JqZWN0IG9uIHRoZSBsZWZ0IGhhdmluZyB0aGUgaGlnaGVzdCBwcmlvcml0eS5cbiAgZXZlbnRRdWV1ZS5wdXNoKGUxKTtcbiAgZXZlbnRRdWV1ZS5wdXNoKGUyKTtcbn1cblxudmFyIGNvbnRvdXJJZCA9IDA7XG5cbmZ1bmN0aW9uIHByb2Nlc3NQb2x5Z29uKHBvbHlnb24sIGlzU3ViamVjdCwgZGVwdGgsIHF1ZXVlLCBiYm94KSB7XG4gIHZhciBpLCBsZW47XG4gIGlmICh0eXBlb2YgcG9seWdvblswXVswXSA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBwb2x5Z29uLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgcHJvY2Vzc1NlZ21lbnQocG9seWdvbltpXSwgcG9seWdvbltpICsgMV0sIGlzU3ViamVjdCwgZGVwdGggKyAxLCBxdWV1ZSwgYmJveCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBvbHlnb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnRvdXJJZCsrO1xuICAgICAgcHJvY2Vzc1BvbHlnb24ocG9seWdvbltpXSwgaXNTdWJqZWN0LCBjb250b3VySWQsIHF1ZXVlLCBiYm94KTtcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBmaWxsUXVldWUoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCkge1xuICB2YXIgZXZlbnRRdWV1ZSA9IG5ldyBRdWV1ZShudWxsLCBjb21wYXJlRXZlbnRzKTtcbiAgY29udG91cklkID0gMDtcblxuICBwcm9jZXNzUG9seWdvbihzdWJqZWN0LCAgdHJ1ZSwgIDAsIGV2ZW50UXVldWUsIHNiYm94KTtcbiAgcHJvY2Vzc1BvbHlnb24oY2xpcHBpbmcsIGZhbHNlLCAwLCBldmVudFF1ZXVlLCBjYmJveCk7XG5cbiAgcmV0dXJuIGV2ZW50UXVldWU7XG59XG5cblxuZnVuY3Rpb24gY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldiwgc3dlZXBMaW5lLCBvcGVyYXRpb24pIHtcbiAgLy8gY29tcHV0ZSBpbk91dCBhbmQgb3RoZXJJbk91dCBmaWVsZHNcbiAgaWYgKHByZXYgPT09IG51bGwpIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gZmFsc2U7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHRydWU7XG5cbiAgLy8gcHJldmlvdXMgbGluZSBzZWdtZW50IGluIHN3ZWVwbGluZSBiZWxvbmdzIHRvIHRoZSBzYW1lIHBvbHlnb25cbiAgfSBlbHNlIGlmIChldmVudC5pc1N1YmplY3QgPT09IHByZXYuaXNTdWJqZWN0KSB7XG4gICAgZXZlbnQuaW5PdXQgICAgICA9ICFwcmV2LmluT3V0O1xuICAgIGV2ZW50Lm90aGVySW5PdXQgPSBwcmV2Lm90aGVySW5PdXQ7XG5cbiAgLy8gcHJldmlvdXMgbGluZSBzZWdtZW50IGluIHN3ZWVwbGluZSBiZWxvbmdzIHRvIHRoZSBjbGlwcGluZyBwb2x5Z29uXG4gIH0gZWxzZSB7XG4gICAgZXZlbnQuaW5PdXQgICAgICA9ICFwcmV2Lm90aGVySW5PdXQ7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHByZXYuaXNWZXJ0aWNhbCgpID8gIXByZXYuaW5PdXQgOiBwcmV2LmluT3V0O1xuICB9XG5cbiAgLy8gY29tcHV0ZSBwcmV2SW5SZXN1bHQgZmllbGRcbiAgaWYgKHByZXYpIHtcbiAgICBldmVudC5wcmV2SW5SZXN1bHQgPSAoIWluUmVzdWx0KHByZXYsIG9wZXJhdGlvbikgfHwgcHJldi5pc1ZlcnRpY2FsKCkpID9cbiAgICAgICBwcmV2LnByZXZJblJlc3VsdCA6IHByZXY7XG4gIH1cbiAgLy8gY2hlY2sgaWYgdGhlIGxpbmUgc2VnbWVudCBiZWxvbmdzIHRvIHRoZSBCb29sZWFuIG9wZXJhdGlvblxuICBldmVudC5pblJlc3VsdCA9IGluUmVzdWx0KGV2ZW50LCBvcGVyYXRpb24pO1xufVxuXG5cbmZ1bmN0aW9uIGluUmVzdWx0KGV2ZW50LCBvcGVyYXRpb24pIHtcbiAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgY2FzZSBlZGdlVHlwZS5OT1JNQUw6XG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICBjYXNlIElOVEVSU0VDVElPTjpcbiAgICAgICAgICByZXR1cm4gIWV2ZW50Lm90aGVySW5PdXQ7XG4gICAgICAgIGNhc2UgVU5JT046XG4gICAgICAgICAgcmV0dXJuIGV2ZW50Lm90aGVySW5PdXQ7XG4gICAgICAgIGNhc2UgRElGRkVSRU5DRTpcbiAgICAgICAgICByZXR1cm4gKGV2ZW50LmlzU3ViamVjdCAmJiBldmVudC5vdGhlckluT3V0KSB8fFxuICAgICAgICAgICAgICAgICAoIWV2ZW50LmlzU3ViamVjdCAmJiAhZXZlbnQub3RoZXJJbk91dCk7XG4gICAgICAgIGNhc2UgWE9SOlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIGNhc2UgZWRnZVR5cGUuU0FNRV9UUkFOU0lUSU9OOlxuICAgICAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OIHx8IG9wZXJhdGlvbiA9PT0gVU5JT047XG4gICAgY2FzZSBlZGdlVHlwZS5ESUZGRVJFTlRfVFJBTlNJVElPTjpcbiAgICAgIHJldHVybiBvcGVyYXRpb24gPT09IERJRkZFUkVOQ0U7XG4gICAgY2FzZSBlZGdlVHlwZS5OT05fQ09OVFJJQlVUSU5HOlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IHNlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2UyXG4gKiBAcGFyYW0gIHtRdWV1ZX0gICAgICBxdWV1ZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBwb3NzaWJsZUludGVyc2VjdGlvbihzZTEsIHNlMiwgcXVldWUpIHtcbiAgLy8gdGhhdCBkaXNhbGxvd3Mgc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvbnMsXG4gIC8vIGRpZCBjb3N0IHVzIGhhbGYgYSBkYXksIHNvIEknbGwgbGVhdmUgaXRcbiAgLy8gb3V0IG9mIHJlc3BlY3RcbiAgLy8gaWYgKHNlMS5pc1N1YmplY3QgPT09IHNlMi5pc1N1YmplY3QpIHJldHVybjtcblxuICB2YXIgaW50ZXIgPSBpbnRlcnNlY3Rpb24oXG4gICAgc2UxLnBvaW50LCBzZTEub3RoZXJFdmVudC5wb2ludCxcbiAgICBzZTIucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50XG4gICk7XG5cbiAgdmFyIG5pbnRlcnNlY3Rpb25zID0gaW50ZXIgPyBpbnRlci5sZW5ndGggOiAwO1xuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDApIHJldHVybiAwOyAvLyBubyBpbnRlcnNlY3Rpb25cblxuICAvLyB0aGUgbGluZSBzZWdtZW50cyBpbnRlcnNlY3QgYXQgYW4gZW5kcG9pbnQgb2YgYm90aCBsaW5lIHNlZ21lbnRzXG4gIGlmICgobmludGVyc2VjdGlvbnMgPT09IDEpICYmXG4gICAgICAoZXF1YWxzKHNlMS5wb2ludCwgc2UyLnBvaW50KSB8fFxuICAgICAgIGVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpKSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKG5pbnRlcnNlY3Rpb25zID09PSAyICYmIHNlMS5pc1N1YmplY3QgPT09IHNlMi5pc1N1YmplY3Qpe1xuICAgIGlmKHNlMS5jb250b3VySWQgPT09IHNlMi5jb250b3VySWQpe1xuICAgIGNvbnNvbGUud2FybignRWRnZXMgb2YgdGhlIHNhbWUgcG9seWdvbiBvdmVybGFwJyxcbiAgICAgIHNlMS5wb2ludCwgc2UxLm90aGVyRXZlbnQucG9pbnQsIHNlMi5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpO1xuICAgIH1cbiAgICAvL3Rocm93IG5ldyBFcnJvcignRWRnZXMgb2YgdGhlIHNhbWUgcG9seWdvbiBvdmVybGFwJyk7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvLyBUaGUgbGluZSBzZWdtZW50cyBhc3NvY2lhdGVkIHRvIHNlMSBhbmQgc2UyIGludGVyc2VjdFxuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDEpIHtcblxuICAgIC8vIGlmIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgaXMgbm90IGFuIGVuZHBvaW50IG9mIHNlMVxuICAgIGlmICghZXF1YWxzKHNlMS5wb2ludCwgaW50ZXJbMF0pICYmICFlcXVhbHMoc2UxLm90aGVyRXZlbnQucG9pbnQsIGludGVyWzBdKSkge1xuICAgICAgZGl2aWRlU2VnbWVudChzZTEsIGludGVyWzBdLCBxdWV1ZSk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGludGVyc2VjdGlvbiBwb2ludCBpcyBub3QgYW4gZW5kcG9pbnQgb2Ygc2UyXG4gICAgaWYgKCFlcXVhbHMoc2UyLnBvaW50LCBpbnRlclswXSkgJiYgIWVxdWFscyhzZTIub3RoZXJFdmVudC5wb2ludCwgaW50ZXJbMF0pKSB7XG4gICAgICBkaXZpZGVTZWdtZW50KHNlMiwgaW50ZXJbMF0sIHF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICAvLyBUaGUgbGluZSBzZWdtZW50cyBhc3NvY2lhdGVkIHRvIHNlMSBhbmQgc2UyIG92ZXJsYXBcbiAgdmFyIGV2ZW50cyAgICAgICAgPSBbXTtcbiAgdmFyIGxlZnRDb2luY2lkZSAgPSBmYWxzZTtcbiAgdmFyIHJpZ2h0Q29pbmNpZGUgPSBmYWxzZTtcblxuICBpZiAoZXF1YWxzKHNlMS5wb2ludCwgc2UyLnBvaW50KSkge1xuICAgIGxlZnRDb2luY2lkZSA9IHRydWU7IC8vIGxpbmtlZFxuICB9IGVsc2UgaWYgKGNvbXBhcmVFdmVudHMoc2UxLCBzZTIpID09PSAxKSB7XG4gICAgZXZlbnRzLnB1c2goc2UyLCBzZTEpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5wdXNoKHNlMSwgc2UyKTtcbiAgfVxuXG4gIGlmIChlcXVhbHMoc2UxLm90aGVyRXZlbnQucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50KSkge1xuICAgIHJpZ2h0Q29pbmNpZGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGNvbXBhcmVFdmVudHMoc2UxLm90aGVyRXZlbnQsIHNlMi5vdGhlckV2ZW50KSA9PT0gMSkge1xuICAgIGV2ZW50cy5wdXNoKHNlMi5vdGhlckV2ZW50LCBzZTEub3RoZXJFdmVudCk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLnB1c2goc2UxLm90aGVyRXZlbnQsIHNlMi5vdGhlckV2ZW50KTtcbiAgfVxuXG4gIGlmICgobGVmdENvaW5jaWRlICYmIHJpZ2h0Q29pbmNpZGUpIHx8IGxlZnRDb2luY2lkZSkge1xuICAgIC8vIGJvdGggbGluZSBzZWdtZW50cyBhcmUgZXF1YWwgb3Igc2hhcmUgdGhlIGxlZnQgZW5kcG9pbnRcbiAgICBzZTEudHlwZSA9IGVkZ2VUeXBlLk5PTl9DT05UUklCVVRJTkc7XG4gICAgc2UyLnR5cGUgPSAoc2UxLmluT3V0ID09PSBzZTIuaW5PdXQpID9cbiAgICAgIGVkZ2VUeXBlLlNBTUVfVFJBTlNJVElPTiA6XG4gICAgICBlZGdlVHlwZS5ESUZGRVJFTlRfVFJBTlNJVElPTjtcblxuICAgIGlmIChsZWZ0Q29pbmNpZGUgJiYgIXJpZ2h0Q29pbmNpZGUpIHtcbiAgICAgIC8vIGhvbmVzdGx5IG5vIGlkZWEsIGJ1dCBjaGFuZ2luZyBldmVudHMgc2VsZWN0aW9uIGZyb20gWzIsIDFdXG4gICAgICAvLyB0byBbMCwgMV0gZml4ZXMgdGhlIG92ZXJsYXBwaW5nIHNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25zIGlzc3VlXG4gICAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXS5vdGhlckV2ZW50LCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIDI7XG4gIH1cblxuICAvLyB0aGUgbGluZSBzZWdtZW50cyBzaGFyZSB0aGUgcmlnaHQgZW5kcG9pbnRcbiAgaWYgKHJpZ2h0Q29pbmNpZGUpIHtcbiAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gICAgcmV0dXJuIDM7XG4gIH1cblxuICAvLyBubyBsaW5lIHNlZ21lbnQgaW5jbHVkZXMgdG90YWxseSB0aGUgb3RoZXIgb25lXG4gIGlmIChldmVudHNbMF0gIT09IGV2ZW50c1szXS5vdGhlckV2ZW50KSB7XG4gICAgZGl2aWRlU2VnbWVudChldmVudHNbMF0sIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzFdLCBldmVudHNbMl0ucG9pbnQsIHF1ZXVlKTtcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIC8vIG9uZSBsaW5lIHNlZ21lbnQgaW5jbHVkZXMgdGhlIG90aGVyIG9uZVxuICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzNdLm90aGVyRXZlbnQsIGV2ZW50c1syXS5wb2ludCwgcXVldWUpO1xuXG4gIHJldHVybiAzO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2VcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwXG4gKiBAcGFyYW0gIHtRdWV1ZX0gcXVldWVcbiAqIEByZXR1cm4ge1F1ZXVlfVxuICovXG5mdW5jdGlvbiBkaXZpZGVTZWdtZW50KHNlLCBwLCBxdWV1ZSkgIHtcbiAgdmFyIHIgPSBuZXcgU3dlZXBFdmVudChwLCBmYWxzZSwgc2UsICAgICAgICAgICAgc2UuaXNTdWJqZWN0KTtcbiAgdmFyIGwgPSBuZXcgU3dlZXBFdmVudChwLCB0cnVlLCAgc2Uub3RoZXJFdmVudCwgc2UuaXNTdWJqZWN0KTtcblxuICBpZiAoZXF1YWxzKHNlLnBvaW50LCBzZS5vdGhlckV2ZW50LnBvaW50KSkge1xuICAgIGNvbnNvbGUud2Fybignd2hhdCBpcyB0aGF0PycsIHNlKTtcbiAgfVxuXG4gIHIuY29udG91cklkID0gbC5jb250b3VySWQgPSBzZS5jb250b3VySWQ7XG5cbiAgLy8gYXZvaWQgYSByb3VuZGluZyBlcnJvci4gVGhlIGxlZnQgZXZlbnQgd291bGQgYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSByaWdodCBldmVudFxuICBpZiAoY29tcGFyZUV2ZW50cyhsLCBzZS5vdGhlckV2ZW50KSA+IDApIHtcbiAgICBzZS5vdGhlckV2ZW50LmxlZnQgPSB0cnVlO1xuICAgIGwubGVmdCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gYXZvaWQgYSByb3VuZGluZyBlcnJvci4gVGhlIGxlZnQgZXZlbnQgd291bGQgYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSByaWdodCBldmVudFxuICAvLyBpZiAoY29tcGFyZUV2ZW50cyhzZSwgcikgPiAwKSB7fVxuXG4gIHNlLm90aGVyRXZlbnQub3RoZXJFdmVudCA9IGw7XG4gIHNlLm90aGVyRXZlbnQgPSByO1xuXG4gIHF1ZXVlLnB1c2gobCk7XG4gIHF1ZXVlLnB1c2gocik7XG5cbiAgcmV0dXJuIHF1ZXVlO1xufVxuXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzLCBuby1kZWJ1Z2dlciAqL1xuZnVuY3Rpb24gaXRlcmF0b3JFcXVhbHMoaXQxLCBpdDIpIHtcbiAgcmV0dXJuIGl0MS5fY3Vyc29yID09PSBpdDIuX2N1cnNvcjtcbn1cblxuXG5mdW5jdGlvbiBfcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgcG9zLCBldmVudCkge1xuICB2YXIgbWFwID0gd2luZG93Lm1hcDtcbiAgaWYgKCFtYXApIHJldHVybjtcbiAgaWYgKHdpbmRvdy5zd3MpIHdpbmRvdy5zd3MuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgbWFwLnJlbW92ZUxheWVyKHApO1xuICB9KTtcbiAgd2luZG93LnN3cyA9IFtdO1xuICBzd2VlcExpbmUuZWFjaChmdW5jdGlvbihlKSB7XG4gICAgdmFyIHBvbHkgPSBMLnBvbHlsaW5lKFtlLnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpLCBlLm90aGVyRXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCldLCB7IGNvbG9yOiAnZ3JlZW4nIH0pLmFkZFRvKG1hcCk7XG4gICAgd2luZG93LnN3cy5wdXNoKHBvbHkpO1xuICB9KTtcblxuICBpZiAod2luZG93LnZ0KSBtYXAucmVtb3ZlTGF5ZXIod2luZG93LnZ0KTtcbiAgdmFyIHYgPSBwb3Muc2xpY2UoKTtcbiAgdmFyIGIgPSBtYXAuZ2V0Qm91bmRzKCk7XG4gIHdpbmRvdy52dCA9IEwucG9seWxpbmUoW1tiLmdldE5vcnRoKCksIHZbMF1dLCBbYi5nZXRTb3V0aCgpLCB2WzBdXV0sIHtjb2xvcjogJ2dyZWVuJywgd2VpZ2h0OiAxfSkuYWRkVG8obWFwKTtcblxuICBpZiAod2luZG93LnBzKSBtYXAucmVtb3ZlTGF5ZXIod2luZG93LnBzKTtcbiAgd2luZG93LnBzID0gTC5wb2x5bGluZShbZXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCksIGV2ZW50Lm90aGVyRXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCldLCB7Y29sb3I6ICdibGFjaycsIHdlaWdodDogOSwgb3BhY2l0eTogMC40fSkuYWRkVG8obWFwKTtcbiAgZGVidWdnZXI7XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzLCBuby1kZWJ1Z2dlciAqL1xuXG5cbmZ1bmN0aW9uIHN1YmRpdmlkZVNlZ21lbnRzKGV2ZW50UXVldWUsIHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbikge1xuICB2YXIgc29ydGVkRXZlbnRzID0gW107XG4gIHZhciBwcmV2LCBuZXh0O1xuXG4gIHZhciBzd2VlcExpbmUgPSBuZXcgVHJlZShjb21wYXJlU2VnbWVudHMpO1xuICB2YXIgc29ydGVkRXZlbnRzID0gW107XG5cbiAgdmFyIHJpZ2h0Ym91bmQgPSBtaW4oc2Jib3hbMl0sIGNiYm94WzJdKTtcblxuICB2YXIgcHJldiwgbmV4dDtcblxuICB3aGlsZSAoZXZlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICB2YXIgZXZlbnQgPSBldmVudFF1ZXVlLnBvcCgpO1xuICAgIHNvcnRlZEV2ZW50cy5wdXNoKGV2ZW50KTtcblxuICAgIC8vIG9wdGltaXphdGlvbiBieSBiYm94ZXMgZm9yIGludGVyc2VjdGlvbiBhbmQgZGlmZmVyZW5jZSBnb2VzIGhlcmVcbiAgICBpZiAoKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OICYmIGV2ZW50LnBvaW50WzBdID4gcmlnaHRib3VuZCkgfHxcbiAgICAgICAgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSAgICYmIGV2ZW50LnBvaW50WzBdID4gc2Jib3hbMl0pKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQubGVmdCkge1xuICAgICAgdmFyIGlucyA9IHN3ZWVwTGluZS5pbnNlcnQoZXZlbnQpO1xuICAgICAgLy8gX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIGV2ZW50LnBvaW50LCBldmVudCk7XG5cbiAgICAgIG5leHQgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG4gICAgICBldmVudC5pdGVyYXRvciA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG5cbiAgICAgIC8vIENhbm5vdCBnZXQgb3V0IG9mIHRoZSB0cmVlIHdoYXQgd2UganVzdCBwdXQgdGhlcmVcbiAgICAgIGlmICghcHJldiB8fCAhbmV4dCkge1xuICAgICAgICB2YXIgaXRlcmF0b3JzID0gZmluZEl0ZXJCcnV0ZShzd2VlcExpbmUpO1xuICAgICAgICBwcmV2ID0gaXRlcmF0b3JzWzBdO1xuICAgICAgICBuZXh0ID0gaXRlcmF0b3JzWzFdO1xuICAgICAgfVxuXG4gICAgICBpZiAocHJldi5kYXRhKCkgIT09IHN3ZWVwTGluZS5taW4oKSkge1xuICAgICAgICBwcmV2LnByZXYoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXYgPSBzd2VlcExpbmUuaXRlcmF0b3IoKTsgLy9maW5kSXRlcihzd2VlcExpbmUubWF4KCkpO1xuICAgICAgICBwcmV2LnByZXYoKTtcbiAgICAgICAgcHJldi5uZXh0KCk7XG4gICAgICB9XG4gICAgICBuZXh0Lm5leHQoKTtcblxuICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcblxuICAgICAgaWYgKG5leHQuZGF0YSgpKSB7XG4gICAgICAgIGlmIChwb3NzaWJsZUludGVyc2VjdGlvbihldmVudCwgbmV4dC5kYXRhKCksIGV2ZW50UXVldWUpID09PSAyKSB7XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBuZXh0LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSkge1xuICAgICAgICBpZiAocG9zc2libGVJbnRlcnNlY3Rpb24ocHJldi5kYXRhKCksIGV2ZW50LCBldmVudFF1ZXVlKSA9PT0gMikge1xuICAgICAgICAgIHZhciBwcmV2cHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihwcmV2LmRhdGEoKSk7XG4gICAgICAgICAgaWYgKHByZXZwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgICAgICBwcmV2cHJldi5wcmV2KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZXZwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgICAgICBwcmV2cHJldi5uZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbXB1dGVGaWVsZHMocHJldi5kYXRhKCksIHByZXZwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQgPSBldmVudC5vdGhlckV2ZW50O1xuICAgICAgbmV4dCA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG4gICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcblxuICAgICAgLy8gX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIGV2ZW50Lm90aGVyRXZlbnQucG9pbnQsIGV2ZW50KTtcblxuICAgICAgaWYgKCEocHJldiAmJiBuZXh0KSkgY29udGludWU7XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgIHByZXYucHJldigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldiA9IHN3ZWVwTGluZS5pdGVyYXRvcigpO1xuICAgICAgICBwcmV2LnByZXYoKTsgLy8gc3dlZXBMaW5lLmZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgIHByZXYubmV4dCgpO1xuICAgICAgfVxuICAgICAgbmV4dC5uZXh0KCk7XG4gICAgICBzd2VlcExpbmUucmVtb3ZlKGV2ZW50KTtcblxuICAgICAgLy9fcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgZXZlbnQub3RoZXJFdmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBpZiAobmV4dC5kYXRhKCkgJiYgcHJldi5kYXRhKCkpIHtcbiAgICAgICAgcG9zc2libGVJbnRlcnNlY3Rpb24ocHJldi5kYXRhKCksIG5leHQuZGF0YSgpLCBldmVudFF1ZXVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNvcnRlZEV2ZW50cztcbn1cblxuZnVuY3Rpb24gZmluZEl0ZXJCcnV0ZShzd2VlcExpbmUsIHEpIHtcbiAgdmFyIHByZXYgPSBzd2VlcExpbmUuaXRlcmF0b3IoKTtcbiAgdmFyIG5leHQgPSBzd2VlcExpbmUuaXRlcmF0b3IoKTtcbiAgdmFyIGl0ICAgPSBzd2VlcExpbmUuaXRlcmF0b3IoKSwgZGF0YTtcbiAgd2hpbGUoKGRhdGEgPSBpdC5uZXh0KCkpICE9PSBudWxsKSB7XG4gICAgcHJldi5uZXh0KCk7XG4gICAgbmV4dC5uZXh0KCk7XG4gICAgaWYgKGRhdGEgPT09IGV2ZW50KSB7XG4gICAgICBicmVhaztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIFtwcmV2LCBuZXh0XTtcbn1cblxuXG5mdW5jdGlvbiBzd2FwIChhcnIsIGksIG4pIHtcbiAgdmFyIHRlbXAgPSBhcnJbaV07XG4gIGFycltpXSA9IGFycltuXTtcbiAgYXJyW25dID0gdGVtcDtcbn1cblxuXG5mdW5jdGlvbiBjaGFuZ2VPcmllbnRhdGlvbihjb250b3VyKSB7XG4gIHJldHVybiBjb250b3VyLnJldmVyc2UoKTtcbn1cblxuXG5mdW5jdGlvbiBpc0FycmF5IChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5cbmZ1bmN0aW9uIGFkZEhvbGUoY29udG91ciwgaWR4KSB7XG4gIGlmICghaXNBcnJheShjb250b3VyWzBdWzBdKSkge1xuICAgIGNvbnRvdXIgPSBbY29udG91cl07XG4gIH1cbiAgY29udG91cltpZHhdID0gW107XG4gIHJldHVybiBjb250b3VyO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPFN3ZWVwRXZlbnQ+fSBzb3J0ZWRFdmVudHNcbiAqIEByZXR1cm4ge0FycmF5LjxTd2VlcEV2ZW50Pn1cbiAqL1xuZnVuY3Rpb24gb3JkZXJFdmVudHMoc29ydGVkRXZlbnRzKSB7XG4gIHZhciBpLCBsZW47XG4gIHZhciByZXN1bHRFdmVudHMgPSBbXTtcbiAgZm9yIChpID0gMCwgbGVuID0gc29ydGVkRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZXZlbnQgPSBzb3J0ZWRFdmVudHNbaV07XG4gICAgaWYgKChldmVudC5sZWZ0ICYmIGV2ZW50LmluUmVzdWx0KSB8fFxuICAgICAgKCFldmVudC5sZWZ0ICYmIGV2ZW50Lm90aGVyRXZlbnQuaW5SZXN1bHQpKSB7XG4gICAgICByZXN1bHRFdmVudHMucHVzaChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRHVlIHRvIG92ZXJsYXBwaW5nIGVkZ2VzIHRoZSByZXN1bHRFdmVudHMgYXJyYXkgY2FuIGJlIG5vdCB3aG9sbHkgc29ydGVkXG4gIHZhciBzb3J0ZWQgPSBmYWxzZTtcbiAgd2hpbGUgKCFzb3J0ZWQpIHtcbiAgICBzb3J0ZWQgPSB0cnVlO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKChpICsgMSkgPCBsZW4gJiZcbiAgICAgICAgY29tcGFyZUV2ZW50cyhyZXN1bHRFdmVudHNbaV0sIHJlc3VsdEV2ZW50c1tpICsgMV0pID09PSAxKSB7XG4gICAgICAgIHN3YXAocmVzdWx0RXZlbnRzLCBpLCBpICsgMSk7XG4gICAgICAgIHNvcnRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJlc3VsdEV2ZW50c1tpXS5wb3MgPSBpO1xuICB9XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFyZXN1bHRFdmVudHNbaV0ubGVmdCkge1xuICAgICAgdmFyIHRlbXAgPSByZXN1bHRFdmVudHNbaV0ucG9zO1xuICAgICAgcmVzdWx0RXZlbnRzW2ldLnBvcyA9IHJlc3VsdEV2ZW50c1tpXS5vdGhlckV2ZW50LnBvcztcbiAgICAgIHJlc3VsdEV2ZW50c1tpXS5vdGhlckV2ZW50LnBvcyA9IHRlbXA7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIHJlc3VsdEV2ZW50cztcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxTd2VlcEV2ZW50Pn0gc29ydGVkRXZlbnRzXG4gKiBAcmV0dXJuIHtBcnJheS48Kj59IHBvbHlnb25zXG4gKi9cbmZ1bmN0aW9uIGNvbm5lY3RFZGdlcyhzb3J0ZWRFdmVudHMpIHtcbiAgdmFyIGV2ZW50LCBpLCBsZW47XG4gIHZhciByZXN1bHRFdmVudHMgPSBvcmRlckV2ZW50cyhzb3J0ZWRFdmVudHMpO1xuXG5cbiAgLy8gXCJmYWxzZVwiLWZpbGxlZCBhcnJheVxuICB2YXIgcHJvY2Vzc2VkID0gQXJyYXkocmVzdWx0RXZlbnRzLmxlbmd0aCk7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICB2YXIgZGVwdGggID0gW107XG4gIHZhciBob2xlT2YgPSBbXTtcbiAgdmFyIGlzSG9sZSA9IHt9O1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChwcm9jZXNzZWRbaV0pIGNvbnRpbnVlO1xuXG4gICAgdmFyIGNvbnRvdXIgPSBbXTtcbiAgICByZXN1bHQucHVzaChjb250b3VyKTtcblxuICAgIHZhciBjb250b3VySWQgPSByZXN1bHQubGVuZ3RoIC0gMTtcbiAgICBkZXB0aC5wdXNoKDApO1xuICAgIGhvbGVPZi5wdXNoKC0xKTtcblxuXG4gICAgaWYgKHJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQpIHtcbiAgICAgIHZhciBsb3dlckNvbnRvdXJJZCA9IHJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQuY29udG91cklkO1xuICAgICAgaWYgKCFyZXN1bHRFdmVudHNbaV0ucHJldkluUmVzdWx0LnJlc3VsdEluT3V0KSB7XG4gICAgICAgIGFkZEhvbGUocmVzdWx0W2xvd2VyQ29udG91cklkXSwgY29udG91cklkKTtcbiAgICAgICAgaG9sZU9mW2NvbnRvdXJJZF0gPSBsb3dlckNvbnRvdXJJZDtcbiAgICAgICAgZGVwdGhbY29udG91cklkXSAgPSBkZXB0aFtsb3dlckNvbnRvdXJJZF0gKyAxO1xuICAgICAgICBpc0hvbGVbY29udG91cklkXSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGlzSG9sZVtsb3dlckNvbnRvdXJJZF0pIHtcbiAgICAgICAgYWRkSG9sZShyZXN1bHRbaG9sZU9mW2xvd2VyQ29udG91cklkXV0sIGNvbnRvdXJJZCk7XG4gICAgICAgIGhvbGVPZltjb250b3VySWRdID0gaG9sZU9mW2xvd2VyQ29udG91cklkXTtcbiAgICAgICAgZGVwdGhbY29udG91cklkXSAgPSBkZXB0aFtsb3dlckNvbnRvdXJJZF07XG4gICAgICAgIGlzSG9sZVtjb250b3VySWRdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcG9zID0gaTtcbiAgICB2YXIgaW5pdGlhbCA9IHJlc3VsdEV2ZW50c1tpXS5wb2ludDtcbiAgICBjb250b3VyLnB1c2goaW5pdGlhbCk7XG5cbiAgICB3aGlsZSAocG9zID49IGkpIHtcbiAgICAgIHByb2Nlc3NlZFtwb3NdID0gdHJ1ZTtcblxuICAgICAgaWYgKHJlc3VsdEV2ZW50c1twb3NdLmxlZnQpIHtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ucmVzdWx0SW5PdXQgPSBmYWxzZTtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10uY29udG91cklkICAgPSBjb250b3VySWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LnJlc3VsdEluT3V0ID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5jb250b3VySWQgICA9IGNvbnRvdXJJZDtcbiAgICAgIH1cblxuICAgICAgcG9zID0gcmVzdWx0RXZlbnRzW3Bvc10ucG9zO1xuICAgICAgcHJvY2Vzc2VkW3Bvc10gPSB0cnVlO1xuXG4gICAgICBjb250b3VyLnB1c2gocmVzdWx0RXZlbnRzW3Bvc10ucG9pbnQpO1xuICAgICAgcG9zID0gbmV4dFBvcyhwb3MsIHJlc3VsdEV2ZW50cywgcHJvY2Vzc2VkKTtcbiAgICB9XG5cbiAgICBwb3MgPSBwb3MgPT09IC0xID8gaSA6IHBvcztcblxuICAgIHByb2Nlc3NlZFtwb3NdID0gcHJvY2Vzc2VkW3Jlc3VsdEV2ZW50c1twb3NdLnBvc10gPSB0cnVlO1xuICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQucmVzdWx0SW5PdXQgPSB0cnVlO1xuICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQuY29udG91cklkICAgPSBjb250b3VySWQ7XG5cblxuICAgIC8vIGRlcHRoIGlzIGV2ZW5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlICovXG4gICAgaWYgKGRlcHRoW2NvbnRvdXJJZF0gJiAxKSB7XG4gICAgICBjaGFuZ2VPcmllbnRhdGlvbihjb250b3VyKTtcbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1iaXR3aXNlICovXG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBwb3NcbiAqIEBwYXJhbSAge0FycmF5LjxTd2VlcEV2ZW50Pn0gcmVzdWx0RXZlbnRzXG4gKiBAcGFyYW0gIHtBcnJheS48Qm9vbGVhbj59ICAgIHByb2Nlc3NlZFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBuZXh0UG9zKHBvcywgcmVzdWx0RXZlbnRzLCBwcm9jZXNzZWQpIHtcbiAgdmFyIG5ld1BvcyA9IHBvcyArIDE7XG4gIHZhciBsZW5ndGggPSByZXN1bHRFdmVudHMubGVuZ3RoO1xuICB3aGlsZSAobmV3UG9zIDwgbGVuZ3RoICYmXG4gICAgICAgICBlcXVhbHMocmVzdWx0RXZlbnRzW25ld1Bvc10ucG9pbnQsIHJlc3VsdEV2ZW50c1twb3NdLnBvaW50KSkge1xuICAgIGlmICghcHJvY2Vzc2VkW25ld1Bvc10pIHtcbiAgICAgIHJldHVybiBuZXdQb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1BvcyA9IG5ld1BvcyArIDE7XG4gICAgfVxuICB9XG5cbiAgbmV3UG9zID0gcG9zIC0gMTtcblxuICB3aGlsZSAocHJvY2Vzc2VkW25ld1Bvc10pIHtcbiAgICBuZXdQb3MgPSBuZXdQb3MgLSAxO1xuICB9XG4gIHJldHVybiBuZXdQb3M7XG59XG5cblxuZnVuY3Rpb24gdHJpdmlhbE9wZXJhdGlvbihzdWJqZWN0LCBjbGlwcGluZywgb3BlcmF0aW9uKSB7XG4gIHZhciByZXN1bHQgPSBudWxsO1xuICBpZiAoc3ViamVjdC5sZW5ndGggKiBjbGlwcGluZy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04pIHtcbiAgICAgIHJlc3VsdCA9IEVNUFRZO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFKSB7XG4gICAgICByZXN1bHQgPSBzdWJqZWN0O1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBVTklPTiB8fCBvcGVyYXRpb24gPT09IFhPUikge1xuICAgICAgcmVzdWx0ID0gKHN1YmplY3QubGVuZ3RoID09PSAwKSA/IGNsaXBwaW5nIDogc3ViamVjdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5mdW5jdGlvbiBjb21wYXJlQkJveGVzKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbikge1xuICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgaWYgKHNiYm94WzBdID4gY2Jib3hbMl0gfHxcbiAgICAgIGNiYm94WzBdID4gc2Jib3hbMl0gfHxcbiAgICAgIHNiYm94WzFdID4gY2Jib3hbM10gfHxcbiAgICAgIGNiYm94WzFdID4gc2Jib3hbM10pIHtcbiAgICBpZiAob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04pIHtcbiAgICAgIHJlc3VsdCA9IEVNUFRZO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFKSB7XG4gICAgICByZXN1bHQgPSBzdWJqZWN0O1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBVTklPTiB8fCBvcGVyYXRpb24gPT09IFhPUikge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdC5jb25jYXQoY2xpcHBpbmcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmZ1bmN0aW9uIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbikge1xuICB2YXIgdHJpdmlhbCA9IHRyaXZpYWxPcGVyYXRpb24oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbik7XG4gIGlmICh0cml2aWFsKSB7XG4gICAgcmV0dXJuIHRyaXZpYWwgPT09IEVNUFRZID8gbnVsbCA6IHRyaXZpYWw7XG4gIH1cbiAgdmFyIHNiYm94ID0gW0luZmluaXR5LCBJbmZpbml0eSwgLUluZmluaXR5LCAtSW5maW5pdHldO1xuICB2YXIgY2Jib3ggPSBbSW5maW5pdHksIEluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eV07XG5cbiAgdmFyIGV2ZW50UXVldWUgPSBmaWxsUXVldWUoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCk7XG5cbiAgdHJpdmlhbCA9IGNvbXBhcmVCQm94ZXMoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKTtcbiAgaWYgKHRyaXZpYWwpIHtcbiAgICByZXR1cm4gdHJpdmlhbCA9PT0gRU1QVFkgPyBudWxsIDogdHJpdmlhbDtcbiAgfVxuICB2YXIgc29ydGVkRXZlbnRzID0gc3ViZGl2aWRlU2VnbWVudHMoZXZlbnRRdWV1ZSwgc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKTtcbiAgcmV0dXJuIGNvbm5lY3RFZGdlcyhzb3J0ZWRFdmVudHMpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gYm9vbGVhbjtcblxuXG5tb2R1bGUuZXhwb3J0cy51bmlvbiA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBVTklPTik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLmRpZmYgPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgRElGRkVSRU5DRSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLnhvciA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBYT1IpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgSU5URVJTRUNUSU9OKTtcbn07XG5cblxuLyoqXG4gKiBAZW51bSB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cy5vcGVyYXRpb25zID0ge1xuICBJTlRFUlNFQ1RJT046IElOVEVSU0VDVElPTixcbiAgRElGRkVSRU5DRTogICBESUZGRVJFTkNFLFxuICBVTklPTjogICAgICAgIFVOSU9OLFxuICBYT1I6ICAgICAgICAgIFhPUlxufTtcblxuXG4vLyBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMuZmlsbFF1ZXVlICAgICAgICAgICAgPSBmaWxsUXVldWU7XG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlRmllbGRzICAgICAgICA9IGNvbXB1dGVGaWVsZHM7XG5tb2R1bGUuZXhwb3J0cy5zdWJkaXZpZGVTZWdtZW50cyAgICA9IHN1YmRpdmlkZVNlZ21lbnRzO1xubW9kdWxlLmV4cG9ydHMuZGl2aWRlU2VnbWVudCAgICAgICAgPSBkaXZpZGVTZWdtZW50O1xubW9kdWxlLmV4cG9ydHMucG9zc2libGVJbnRlcnNlY3Rpb24gPSBwb3NzaWJsZUludGVyc2VjdGlvbjtcbiIsInZhciBFUFNJTE9OID0gMWUtOTtcblxuLyoqXG4gKiBGaW5kcyB0aGUgbWFnbml0dWRlIG9mIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzIChpZiB3ZSBwcmV0ZW5kXG4gKiB0aGV5J3JlIGluIHRocmVlIGRpbWVuc2lvbnMpXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgRmlyc3QgdmVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gYiBTZWNvbmQgdmVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge051bWJlcn0gVGhlIG1hZ25pdHVkZSBvZiB0aGUgY3Jvc3MgcHJvZHVjdFxuICovXG5mdW5jdGlvbiBrcm9zc1Byb2R1Y3QoYSwgYikge1xuICByZXR1cm4gYVswXSAqIGJbMV0gLSBhWzFdICogYlswXTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgRmlyc3QgdmVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gYiBTZWNvbmQgdmVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge051bWJlcn0gVGhlIGRvdCBwcm9kdWN0XG4gKi9cbmZ1bmN0aW9uIGRvdFByb2R1Y3QoYSwgYikge1xuICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgaW50ZXJzZWN0aW9uIChpZiBhbnkpIGJldHdlZW4gdHdvIGxpbmUgc2VnbWVudHMgYSBhbmQgYiwgZ2l2ZW4gdGhlXG4gKiBsaW5lIHNlZ21lbnRzJyBlbmQgcG9pbnRzIGExLCBhMiBhbmQgYjEsIGIyLlxuICpcbiAqIFRoaXMgYWxnb3JpdGhtIGlzIGJhc2VkIG9uIFNjaG5laWRlciBhbmQgRWJlcmx5LlxuICogaHR0cDovL3d3dy5jaW1lYy5vcmcuYXIvfm5jYWx2by9TY2huZWlkZXJfRWJlcmx5LnBkZlxuICogUGFnZSAyNDQuXG4gKlxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYTEgcG9pbnQgb2YgZmlyc3QgbGluZVxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYTIgcG9pbnQgb2YgZmlyc3QgbGluZVxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYjEgcG9pbnQgb2Ygc2Vjb25kIGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGIyIHBvaW50IG9mIHNlY29uZCBsaW5lXG4gKiBAcGFyYW0ge0Jvb2xlYW49fSAgICAgICBub0VuZHBvaW50VG91Y2ggd2hldGhlciB0byBza2lwIHNpbmdsZSB0b3VjaHBvaW50c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtZWFuaW5nIGNvbm5lY3RlZCBzZWdtZW50cykgYXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3Rpb25zXG4gKiBAcmV0dXJucyB7QXJyYXkuPEFycmF5LjxOdW1iZXI+PnxOdWxsfSBJZiB0aGUgbGluZXMgaW50ZXJzZWN0LCB0aGUgcG9pbnQgb2ZcbiAqIGludGVyc2VjdGlvbi4gSWYgdGhleSBvdmVybGFwLCB0aGUgdHdvIGVuZCBwb2ludHMgb2YgdGhlIG92ZXJsYXBwaW5nIHNlZ21lbnQuXG4gKiBPdGhlcndpc2UsIG51bGwuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYTEsIGEyLCBiMSwgYjIsIG5vRW5kcG9pbnRUb3VjaCkge1xuICAvLyBUaGUgYWxnb3JpdGhtIGV4cGVjdHMgb3VyIGxpbmVzIGluIHRoZSBmb3JtIFAgKyBzZCwgd2hlcmUgUCBpcyBhIHBvaW50LFxuICAvLyBzIGlzIG9uIHRoZSBpbnRlcnZhbCBbMCwgMV0sIGFuZCBkIGlzIGEgdmVjdG9yLlxuICAvLyBXZSBhcmUgcGFzc2VkIHR3byBwb2ludHMuIFAgY2FuIGJlIHRoZSBmaXJzdCBwb2ludCBvZiBlYWNoIHBhaXIuIFRoZVxuICAvLyB2ZWN0b3IsIHRoZW4sIGNvdWxkIGJlIHRob3VnaHQgb2YgYXMgdGhlIGRpc3RhbmNlIChpbiB4IGFuZCB5IGNvbXBvbmVudHMpXG4gIC8vIGZyb20gdGhlIGZpcnN0IHBvaW50IHRvIHRoZSBzZWNvbmQgcG9pbnQuXG4gIC8vIFNvIGZpcnN0LCBsZXQncyBtYWtlIG91ciB2ZWN0b3JzOlxuICB2YXIgdmEgPSBbYTJbMF0gLSBhMVswXSwgYTJbMV0gLSBhMVsxXV07XG4gIHZhciB2YiA9IFtiMlswXSAtIGIxWzBdLCBiMlsxXSAtIGIxWzFdXTtcbiAgLy8gV2UgYWxzbyBkZWZpbmUgYSBmdW5jdGlvbiB0byBjb252ZXJ0IGJhY2sgdG8gcmVndWxhciBwb2ludCBmb3JtOlxuXG4gIC8qIGVzbGludC1kaXNhYmxlIGFycm93LWJvZHktc3R5bGUgKi9cblxuICBmdW5jdGlvbiB0b1BvaW50KHAsIHMsIGQpIHtcbiAgICByZXR1cm4gW1xuICAgICAgcFswXSArIHMgKiBkWzBdLFxuICAgICAgcFsxXSArIHMgKiBkWzFdXG4gICAgXTtcbiAgfVxuXG4gIC8qIGVzbGludC1lbmFibGUgYXJyb3ctYm9keS1zdHlsZSAqL1xuXG4gIC8vIFRoZSByZXN0IGlzIHByZXR0eSBtdWNoIGEgc3RyYWlnaHQgcG9ydCBvZiB0aGUgYWxnb3JpdGhtLlxuICB2YXIgZSA9IFtiMVswXSAtIGExWzBdLCBiMVsxXSAtIGExWzFdXTtcbiAgdmFyIGtyb3NzID0ga3Jvc3NQcm9kdWN0KHZhLCB2Yik7XG4gIHZhciBzcXJLcm9zcyA9IGtyb3NzICoga3Jvc3M7XG4gIHZhciBzcXJMZW5BID0gZG90UHJvZHVjdCh2YSwgdmEpO1xuICB2YXIgc3FyTGVuQiA9IGRvdFByb2R1Y3QodmIsIHZiKTtcblxuICAvLyBDaGVjayBmb3IgbGluZSBpbnRlcnNlY3Rpb24uIFRoaXMgd29ya3MgYmVjYXVzZSBvZiB0aGUgcHJvcGVydGllcyBvZiB0aGVcbiAgLy8gY3Jvc3MgcHJvZHVjdCAtLSBzcGVjaWZpY2FsbHksIHR3byB2ZWN0b3JzIGFyZSBwYXJhbGxlbCBpZiBhbmQgb25seSBpZiB0aGVcbiAgLy8gY3Jvc3MgcHJvZHVjdCBpcyB0aGUgMCB2ZWN0b3IuIFRoZSBmdWxsIGNhbGN1bGF0aW9uIGludm9sdmVzIHJlbGF0aXZlIGVycm9yXG4gIC8vIHRvIGFjY291bnQgZm9yIHBvc3NpYmxlIHZlcnkgc21hbGwgbGluZSBzZWdtZW50cy4gU2VlIFNjaG5laWRlciAmIEViZXJseVxuICAvLyBmb3IgZGV0YWlscy5cbiAgaWYgKHNxcktyb3NzID4gRVBTSUxPTiAqIHNxckxlbkEgKiBzcXJMZW5CKSB7XG4gICAgLy8gSWYgdGhleSdyZSBub3QgcGFyYWxsZWwsIHRoZW4gKGJlY2F1c2UgdGhlc2UgYXJlIGxpbmUgc2VnbWVudHMpIHRoZXlcbiAgICAvLyBzdGlsbCBtaWdodCBub3QgYWN0dWFsbHkgaW50ZXJzZWN0LiBUaGlzIGNvZGUgY2hlY2tzIHRoYXQgdGhlXG4gICAgLy8gaW50ZXJzZWN0aW9uIHBvaW50IG9mIHRoZSBsaW5lcyBpcyBhY3R1YWxseSBvbiBib3RoIGxpbmUgc2VnbWVudHMuXG4gICAgdmFyIHMgPSBrcm9zc1Byb2R1Y3QoZSwgdmIpIC8ga3Jvc3M7XG4gICAgaWYgKHMgPCAwIHx8IHMgPiAxKSB7XG4gICAgICAvLyBub3Qgb24gbGluZSBzZWdtZW50IGFcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgdCA9IGtyb3NzUHJvZHVjdChlLCB2YSkgLyBrcm9zcztcbiAgICBpZiAodCA8IDAgfHwgdCA+IDEpIHtcbiAgICAgIC8vIG5vdCBvbiBsaW5lIHNlZ21lbnQgYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBub0VuZHBvaW50VG91Y2ggPyBudWxsIDogW3RvUG9pbnQoYTEsIHMsIHZhKV07XG4gIH1cblxuICAvLyBJZiB3ZSd2ZSByZWFjaGVkIHRoaXMgcG9pbnQsIHRoZW4gdGhlIGxpbmVzIGFyZSBlaXRoZXIgcGFyYWxsZWwgb3IgdGhlXG4gIC8vIHNhbWUsIGJ1dCB0aGUgc2VnbWVudHMgY291bGQgb3ZlcmxhcCBwYXJ0aWFsbHkgb3IgZnVsbHksIG9yIG5vdCBhdCBhbGwuXG4gIC8vIFNvIHdlIG5lZWQgdG8gZmluZCB0aGUgb3ZlcmxhcCwgaWYgYW55LiBUbyBkbyB0aGF0LCB3ZSBjYW4gdXNlIGUsIHdoaWNoIGlzXG4gIC8vIHRoZSAodmVjdG9yKSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHR3byBpbml0aWFsIHBvaW50cy4gSWYgdGhpcyBpcyBwYXJhbGxlbFxuICAvLyB3aXRoIHRoZSBsaW5lIGl0c2VsZiwgdGhlbiB0aGUgdHdvIGxpbmVzIGFyZSB0aGUgc2FtZSBsaW5lLCBhbmQgdGhlcmUgd2lsbFxuICAvLyBiZSBvdmVybGFwLlxuICB2YXIgc3FyTGVuRSA9IGRvdFByb2R1Y3QoZSwgZSk7XG4gIGtyb3NzID0ga3Jvc3NQcm9kdWN0KGUsIHZhKTtcbiAgc3FyS3Jvc3MgPSBrcm9zcyAqIGtyb3NzO1xuXG4gIGlmIChzcXJLcm9zcyA+IEVQU0lMT04gKiBzcXJMZW5BICogc3FyTGVuRSkge1xuICAgIC8vIExpbmVzIGFyZSBqdXN0IHBhcmFsbGVsLCBub3QgdGhlIHNhbWUuIE5vIG92ZXJsYXAuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgc2EgPSBkb3RQcm9kdWN0KHZhLCBlKSAvIHNxckxlbkE7XG4gIHZhciBzYiA9IHNhICsgZG90UHJvZHVjdCh2YSwgdmIpIC8gc3FyTGVuQTtcbiAgdmFyIHNtaW4gPSBNYXRoLm1pbihzYSwgc2IpO1xuICB2YXIgc21heCA9IE1hdGgubWF4KHNhLCBzYik7XG5cbiAgLy8gdGhpcyBpcywgZXNzZW50aWFsbHksIHRoZSBGaW5kSW50ZXJzZWN0aW9uIGFjdGluZyBvbiBmbG9hdHMgZnJvbVxuICAvLyBTY2huZWlkZXIgJiBFYmVybHksIGp1c3QgaW5saW5lZCBpbnRvIHRoaXMgZnVuY3Rpb24uXG4gIGlmIChzbWluIDw9IDEgJiYgc21heCA+PSAwKSB7XG5cbiAgICAvLyBvdmVybGFwIG9uIGFuIGVuZCBwb2ludFxuICAgIGlmIChzbWluID09PSAxKSB7XG4gICAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzbWluID4gMCA/IHNtaW4gOiAwLCB2YSldO1xuICAgIH1cblxuICAgIGlmIChzbWF4ID09PSAwKSB7XG4gICAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzbWF4IDwgMSA/IHNtYXggOiAxLCB2YSldO1xuICAgIH1cblxuICAgIGlmIChub0VuZHBvaW50VG91Y2ggJiYgc21pbiA9PT0gMCAmJiBzbWF4ID09PSAxKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIFRoZXJlJ3Mgb3ZlcmxhcCBvbiBhIHNlZ21lbnQgLS0gdHdvIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24uIFJldHVybiBib3RoLlxuICAgIHJldHVybiBbXG4gICAgICB0b1BvaW50KGExLCBzbWluID4gMCA/IHNtaW4gOiAwLCB2YSksXG4gICAgICB0b1BvaW50KGExLCBzbWF4IDwgMSA/IHNtYXggOiAxLCB2YSksXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcbiIsIi8qKlxuICogU2lnbmVkIGFyZWEgb2YgdGhlIHRyaWFuZ2xlIChwMCwgcDEsIHAyKVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAwXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDFcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMlxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNpZ25lZEFyZWEocDAsIHAxLCBwMikge1xuICByZXR1cm4gKHAwWzBdIC0gcDJbMF0pICogKHAxWzFdIC0gcDJbMV0pIC0gKHAxWzBdIC0gcDJbMF0pICogKHAwWzFdIC0gcDJbMV0pO1xufTtcbiIsInZhciBzaWduZWRBcmVhID0gcmVxdWlyZSgnLi9zaWduZWRfYXJlYScpO1xudmFyIEVkZ2VUeXBlICAgPSByZXF1aXJlKCcuL2VkZ2VfdHlwZScpO1xuXG5cbi8qKlxuICogU3dlZXBsaW5lIGV2ZW50XG4gKlxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gIHBvaW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgbGVmdFxuICogQHBhcmFtIHtTd2VlcEV2ZW50PX0gICAgIG90aGVyRXZlbnRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gICAgICAgICBpc1N1YmplY3RcbiAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICBlZGdlVHlwZVxuICovXG5mdW5jdGlvbiBTd2VlcEV2ZW50KHBvaW50LCBsZWZ0LCBvdGhlckV2ZW50LCBpc1N1YmplY3QsIGVkZ2VUeXBlKSB7XG5cbiAgLyoqXG4gICAqIElzIGxlZnQgZW5kcG9pbnQ/XG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5sZWZ0ID0gbGVmdDtcblxuICAvKipcbiAgICogQHR5cGUge0FycmF5LjxOdW1iZXI+fVxuICAgKi9cbiAgdGhpcy5wb2ludCA9IHBvaW50O1xuXG4gIC8qKlxuICAgKiBPdGhlciBlZGdlIHJlZmVyZW5jZVxuICAgKiBAdHlwZSB7U3dlZXBFdmVudH1cbiAgICovXG4gIHRoaXMub3RoZXJFdmVudCA9IG90aGVyRXZlbnQ7XG5cbiAgLyoqXG4gICAqIEJlbG9uZ3MgdG8gc291cmNlIG9yIGNsaXBwaW5nIHBvbHlnb25cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmlzU3ViamVjdCA9IGlzU3ViamVjdDtcblxuICAvKipcbiAgICogRWRnZSBjb250cmlidXRpb24gdHlwZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgdGhpcy50eXBlID0gZWRnZVR5cGUgfHwgRWRnZVR5cGUuTk9STUFMO1xuXG5cbiAgLyoqXG4gICAqIEluLW91dCB0cmFuc2l0aW9uIGZvciB0aGUgc3dlZXBsaW5lIGNyb3NzaW5nIHBvbHlnb25cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmluT3V0ID0gZmFsc2U7XG5cblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLm90aGVySW5PdXQgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJldmlvdXMgZXZlbnQgaW4gcmVzdWx0P1xuICAgKiBAdHlwZSB7U3dlZXBFdmVudH1cbiAgICovXG4gIHRoaXMucHJldkluUmVzdWx0ID0gbnVsbDtcblxuICAvKipcbiAgICogRG9lcyBldmVudCBiZWxvbmcgdG8gcmVzdWx0P1xuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuaW5SZXN1bHQgPSBmYWxzZTtcblxuXG4gIC8vIGNvbm5lY3Rpb24gc3RlcFxuXG4gIC8qKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMucmVzdWx0SW5PdXQgPSBmYWxzZTtcbn1cblxuXG5Td2VlcEV2ZW50LnByb3RvdHlwZSA9IHtcblxuICAvKipcbiAgICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc0JlbG93OiBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdCA/XG4gICAgICBzaWduZWRBcmVhICh0aGlzLnBvaW50LCB0aGlzLm90aGVyRXZlbnQucG9pbnQsIHApID4gMCA6XG4gICAgICBzaWduZWRBcmVhICh0aGlzLm90aGVyRXZlbnQucG9pbnQsIHRoaXMucG9pbnQsIHApID4gMDtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gIHBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQWJvdmU6IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gIXRoaXMuaXNCZWxvdyhwKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNWZXJ0aWNhbDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRbMF0gPT09IHRoaXMub3RoZXJFdmVudC5wb2ludFswXTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTd2VlcEV2ZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbnlRdWV1ZTtcblxuZnVuY3Rpb24gVGlueVF1ZXVlKGRhdGEsIGNvbXBhcmUpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVGlueVF1ZXVlKSkgcmV0dXJuIG5ldyBUaW55UXVldWUoZGF0YSwgY29tcGFyZSk7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhIHx8IFtdO1xuICAgIHRoaXMubGVuZ3RoID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICB0aGlzLmNvbXBhcmUgPSBjb21wYXJlIHx8IGRlZmF1bHRDb21wYXJlO1xuXG4gICAgaWYgKGRhdGEpIGZvciAodmFyIGkgPSBNYXRoLmZsb29yKHRoaXMubGVuZ3RoIC8gMik7IGkgPj0gMDsgaS0tKSB0aGlzLl9kb3duKGkpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xufVxuXG5UaW55UXVldWUucHJvdG90eXBlID0ge1xuXG4gICAgcHVzaDogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5kYXRhLnB1c2goaXRlbSk7XG4gICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgIHRoaXMuX3VwKHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgfSxcblxuICAgIHBvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9wID0gdGhpcy5kYXRhWzBdO1xuICAgICAgICB0aGlzLmRhdGFbMF0gPSB0aGlzLmRhdGFbdGhpcy5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgdGhpcy5kYXRhLnBvcCgpO1xuICAgICAgICB0aGlzLl9kb3duKDApO1xuICAgICAgICByZXR1cm4gdG9wO1xuICAgIH0sXG5cbiAgICBwZWVrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF07XG4gICAgfSxcblxuICAgIF91cDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIGNvbXBhcmUgPSB0aGlzLmNvbXBhcmU7XG5cbiAgICAgICAgd2hpbGUgKHBvcyA+IDApIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBNYXRoLmZsb29yKChwb3MgLSAxKSAvIDIpO1xuICAgICAgICAgICAgaWYgKGNvbXBhcmUoZGF0YVtwb3NdLCBkYXRhW3BhcmVudF0pIDwgMCkge1xuICAgICAgICAgICAgICAgIHN3YXAoZGF0YSwgcGFyZW50LCBwb3MpO1xuICAgICAgICAgICAgICAgIHBvcyA9IHBhcmVudDtcblxuICAgICAgICAgICAgfSBlbHNlIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kb3duOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgY29tcGFyZSA9IHRoaXMuY29tcGFyZSxcbiAgICAgICAgICAgIGxlbiA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IDIgKiBwb3MgKyAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0ID0gbGVmdCArIDEsXG4gICAgICAgICAgICAgICAgbWluID0gcG9zO1xuXG4gICAgICAgICAgICBpZiAobGVmdCA8IGxlbiAmJiBjb21wYXJlKGRhdGFbbGVmdF0sIGRhdGFbbWluXSkgPCAwKSBtaW4gPSBsZWZ0O1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgbGVuICYmIGNvbXBhcmUoZGF0YVtyaWdodF0sIGRhdGFbbWluXSkgPCAwKSBtaW4gPSByaWdodDtcblxuICAgICAgICAgICAgaWYgKG1pbiA9PT0gcG9zKSByZXR1cm47XG5cbiAgICAgICAgICAgIHN3YXAoZGF0YSwgbWluLCBwb3MpO1xuICAgICAgICAgICAgcG9zID0gbWluO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZnVuY3Rpb24gc3dhcChkYXRhLCBpLCBqKSB7XG4gICAgdmFyIHRtcCA9IGRhdGFbaV07XG4gICAgZGF0YVtpXSA9IGRhdGFbal07XG4gICAgZGF0YVtqXSA9IHRtcDtcbn1cbiIsIi8qKlxuICogT2Zmc2V0IGVkZ2Ugb2YgdGhlIHBvbHlnb25cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGN1cnJlbnRcbiAqIEBwYXJhbSAge09iamVjdH0gbmV4dFxuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEVkZ2UoY3VycmVudCwgbmV4dCkge1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5jdXJyZW50ID0gY3VycmVudDtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMubmV4dCA9IG5leHQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLl9pbk5vcm1hbCAgPSB0aGlzLmlud2FyZHNOb3JtYWwoKTtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMuX291dE5vcm1hbCA9IHRoaXMub3V0d2FyZHNOb3JtYWwoKTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIG91dHdhcmRzIG5vcm1hbFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5FZGdlLnByb3RvdHlwZS5vdXR3YXJkc05vcm1hbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgaW53YXJkcyA9IHRoaXMuaW53YXJkc05vcm1hbCgpO1xuICByZXR1cm4gW1xuICAgIC1pbndhcmRzWzBdLFxuICAgIC1pbndhcmRzWzFdXG4gIF07XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgaW53YXJkcyBub3JtYWxcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuRWRnZS5wcm90b3R5cGUuaW53YXJkc05vcm1hbCA9IGZ1bmN0aW9uKCkge1xuICB2YXIgZHggPSB0aGlzLm5leHRbMF0gLSB0aGlzLmN1cnJlbnRbMF0sXG4gICAgICBkeSA9IHRoaXMubmV4dFsxXSAtIHRoaXMuY3VycmVudFsxXSxcbiAgICAgIGVkZ2VMZW5ndGggPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gIGlmIChlZGdlTGVuZ3RoID09PSAwKSB0aHJvdyBuZXcgRXJyb3IoJ1ZlcnRpY2VzIG92ZXJsYXAnKTtcblxuICByZXR1cm4gW1xuICAgIC1keSAvIGVkZ2VMZW5ndGgsXG4gICAgIGR4IC8gZWRnZUxlbmd0aFxuICBdO1xufTtcblxuLyoqXG4gKiBPZmZzZXRzIHRoZSBlZGdlIGJ5IGR4LCBkeVxuICogQHBhcmFtICB7TnVtYmVyfSBkeFxuICogQHBhcmFtICB7TnVtYmVyfSBkeVxuICogQHJldHVybiB7RWRnZX1cbiAqL1xuRWRnZS5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oZHgsIGR5KSB7XG4gIHJldHVybiBFZGdlLm9mZnNldEVkZ2UodGhpcy5jdXJyZW50LCB0aGlzLm5leHQsIGR4LCBkeSk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkeFxuICogQHBhcmFtICB7TnVtYmVyfSBkeVxuICogQHJldHVybiB7RWRnZX1cbiAqL1xuRWRnZS5wcm90b3R5cGUuaW52ZXJzZU9mZnNldCA9IGZ1bmN0aW9uKGR4LCBkeSkge1xuICByZXR1cm4gRWRnZS5vZmZzZXRFZGdlKHRoaXMubmV4dCwgdGhpcy5jdXJyZW50LCBkeCwgZHkpO1xufTtcblxuXG4vKipcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBjdXJyZW50XG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gbmV4dFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIGR4XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgZHlcbiAqIEByZXR1cm4ge0VkZ2V9XG4gKi9cbkVkZ2Uub2Zmc2V0RWRnZSA9IGZ1bmN0aW9uKGN1cnJlbnQsIG5leHQsIGR4LCBkeSkge1xuICByZXR1cm4gbmV3IEVkZ2UoW1xuICAgIGN1cnJlbnRbMF0gKyBkeCxcbiAgICBjdXJyZW50WzFdICsgZHlcbiAgXSwgW1xuICAgIG5leHRbMF0gKyBkeCxcbiAgICBuZXh0WzFdICsgZHlcbiAgXSk7XG59O1xuXG5cbi8qKlxuICpcbiAqIEByZXR1cm4ge0VkZ2V9XG4gKi9cbkVkZ2UucHJvdG90eXBlLmludmVyc2UgPSBmdW5jdGlvbiAoKSB7XG4gIHJldHVybiBuZXcgRWRnZSh0aGlzLm5leHQsIHRoaXMuY3VycmVudCk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzID0gRWRnZTtcbiIsInZhciBFZGdlICAgICA9IHJlcXVpcmUoJy4vZWRnZScpO1xudmFyIG1hcnRpbmV6ID0gcmVxdWlyZSgnbWFydGluZXotcG9seWdvbi1jbGlwcGluZycpO1xudmFyIHV0aWxzICAgID0gcmVxdWlyZSgnLi91dGlscycpO1xuXG5cbnZhciBpc0FycmF5ICAgICA9IHV0aWxzLmlzQXJyYXk7XG52YXIgZXF1YWxzICAgICAgPSB1dGlscy5lcXVhbHM7XG52YXIgb3JpZW50UmluZ3MgPSB1dGlscy5vcmllbnRSaW5ncztcblxuXG4vKipcbiAqIE9mZnNldCBidWlsZGVyXG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pj19IHZlcnRpY2VzXG4gKiBAcGFyYW0ge051bWJlcj19ICAgICAgICBhcmNTZWdtZW50c1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE9mZnNldCh2ZXJ0aWNlcywgYXJjU2VnbWVudHMpIHtcblxuICAvKipcbiAgICogQHR5cGUge0FycmF5LjxPYmplY3Q+fVxuICAgKi9cbiAgdGhpcy52ZXJ0aWNlcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48RWRnZT59XG4gICAqL1xuICB0aGlzLmVkZ2VzID0gbnVsbDtcblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLl9jbG9zZWQgPSBmYWxzZTtcblxuXG4gIC8qKlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgdGhpcy5fZGlzdGFuY2UgPSAwO1xuXG4gIGlmICh2ZXJ0aWNlcykge1xuICAgIHRoaXMuZGF0YSh2ZXJ0aWNlcyk7XG4gIH1cblxuICAvKipcbiAgICogU2VnbWVudHMgaW4gZWRnZSBib3VuZGluZyBhcmNoZXNcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHMgIT09IHVuZGVmaW5lZCA/IGFyY1NlZ21lbnRzIDogNTtcbn1cblxuLyoqXG4gKiBDaGFuZ2UgZGF0YSBzZXRcbiAqIEBwYXJhbSAge0FycmF5LjxBcnJheT59IHZlcnRpY2VzXG4gKiBAcmV0dXJuIHtPZmZzZXR9XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIHRoaXMuX2VkZ2VzID0gW107XG4gIGlmICghaXNBcnJheSAodmVydGljZXMpKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKCdPZmZzZXQgcmVxdWlyZXMgYXQgbGVhc3Qgb25lIGNvb2RpbmF0ZSB0byB3b3JrIHdpdGgnKTtcbiAgfVxuXG4gIGlmIChpc0FycmF5KHZlcnRpY2VzKSAmJiB0eXBlb2YgdmVydGljZXNbMF0gPT09ICdudW1iZXInKSB7XG4gICAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuICB9IGVsc2Uge1xuICAgIHRoaXMudmVydGljZXMgPSBvcmllbnRSaW5ncyh2ZXJ0aWNlcyk7XG4gICAgdGhpcy5fcHJvY2Vzc0NvbnRvdXIodGhpcy52ZXJ0aWNlcywgdGhpcy5fZWRnZXMpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogUmVjdXJzaXZlbHkgcHJvY2VzcyBjb250b3VyIHRvIGNyZWF0ZSBub3JtYWxzXG4gKiBAcGFyYW0gIHsqfSBjb250b3VyXG4gKiBAcGFyYW0gIHtBcnJheX0gZWRnZXNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5fcHJvY2Vzc0NvbnRvdXIgPSBmdW5jdGlvbihjb250b3VyLCBlZGdlcykge1xuICB2YXIgaSwgbGVuO1xuICBpZiAoaXNBcnJheShjb250b3VyWzBdKSAmJiB0eXBlb2YgY29udG91clswXVswXSA9PT0gJ251bWJlcicpIHtcbiAgICBsZW4gPSBjb250b3VyLmxlbmd0aDtcbiAgICBpZiAoZXF1YWxzKGNvbnRvdXJbMF0sIGNvbnRvdXJbbGVuIC0gMV0pKSB7XG4gICAgICBsZW4gLT0gMTsgLy8gb3RoZXJ3aXNlIHdlIGdldCBkaXZpc2lvbiBieSB6ZXJvIGluIG5vcm1hbHNcbiAgICB9XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBlZGdlcy5wdXNoKG5ldyBFZGdlKGNvbnRvdXJbaV0sIGNvbnRvdXJbKGkgKyAxKSAlIGxlbl0pKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gY29udG91ci5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZWRnZXMucHVzaChbXSk7XG4gICAgICB0aGlzLl9wcm9jZXNzQ29udG91cihjb250b3VyW2ldLCBlZGdlc1tlZGdlcy5sZW5ndGggLSAxXSk7XG4gICAgfVxuICB9XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBhcmNTZWdtZW50c1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmFyY1NlZ21lbnRzID0gZnVuY3Rpb24oYXJjU2VnbWVudHMpIHtcbiAgdGhpcy5fYXJjU2VnbWVudHMgPSBhcmNTZWdtZW50cztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG5cbi8qKlxuICogVmFsaWRhdGVzIGlmIHRoZSBmaXJzdCBhbmQgbGFzdCBwb2ludHMgcmVwZWF0XG4gKiBUT0RPOiBjaGVjayBDQ1dcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIHZhciBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gIGlmICh0eXBlb2YgdmVydGljZXNbMF0gPT09ICdudW1iZXInKSByZXR1cm4gW3ZlcnRpY2VzXTtcbiAgaWYgKHZlcnRpY2VzWzBdWzBdID09PSB2ZXJ0aWNlc1tsZW4gLSAxXVswXSAmJlxuICAgIHZlcnRpY2VzWzBdWzFdID09PSB2ZXJ0aWNlc1tsZW4gLSAxXVsxXSkge1xuICAgIGlmIChsZW4gPiAxKSB7XG4gICAgICB2ZXJ0aWNlcyA9IHZlcnRpY2VzLnNsaWNlKDAsIGxlbiAtIDEpO1xuICAgICAgdGhpcy5fY2xvc2VkID0gdHJ1ZTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZXMgYXJjaCBiZXR3ZWVuIHR3byBlZGdlc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxPYmplY3Q+fSB2ZXJ0aWNlc1xuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGNlbnRlclxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHJhZGl1c1xuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIHN0YXJ0VmVydGV4XG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgZW5kVmVydGV4XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgc2VnbWVudHNcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICBvdXR3YXJkc1xuICovXG5PZmZzZXQucHJvdG90eXBlLmNyZWF0ZUFyYyA9IGZ1bmN0aW9uKHZlcnRpY2VzLCBjZW50ZXIsIHJhZGl1cywgc3RhcnRWZXJ0ZXgsXG4gICAgZW5kVmVydGV4LCBzZWdtZW50cywgb3V0d2FyZHMpIHtcblxuICB2YXIgUEkyID0gTWF0aC5QSSAqIDIsXG4gICAgICBzdGFydEFuZ2xlID0gTWF0aC5hdGFuMihzdGFydFZlcnRleFsxXSAtIGNlbnRlclsxXSwgc3RhcnRWZXJ0ZXhbMF0gLSBjZW50ZXJbMF0pLFxuICAgICAgZW5kQW5nbGUgICA9IE1hdGguYXRhbjIoZW5kVmVydGV4WzFdIC0gY2VudGVyWzFdLCBlbmRWZXJ0ZXhbMF0gLSBjZW50ZXJbMF0pO1xuXG4gIC8vIG9kZCBudW1iZXIgcGxlYXNlXG4gIGlmIChzZWdtZW50cyAlIDIgPT09IDApIHtcbiAgICBzZWdtZW50cyAtPSAxO1xuICB9XG5cbiAgaWYgKHN0YXJ0QW5nbGUgPCAwKSB7XG4gICAgc3RhcnRBbmdsZSArPSBQSTI7XG4gIH1cblxuICBpZiAoZW5kQW5nbGUgPCAwKSB7XG4gICAgZW5kQW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgdmFyIGFuZ2xlID0gKChzdGFydEFuZ2xlID4gZW5kQW5nbGUpID9cbiAgICAgICAgICAgICAgIChzdGFydEFuZ2xlIC0gZW5kQW5nbGUpIDpcbiAgICAgICAgICAgICAgIChzdGFydEFuZ2xlICsgUEkyIC0gZW5kQW5nbGUpKSxcbiAgICAgIHNlZ21lbnRBbmdsZSA9ICgob3V0d2FyZHMpID8gLWFuZ2xlIDogUEkyIC0gYW5nbGUpIC8gc2VnbWVudHM7XG5cbiAgdmVydGljZXMucHVzaChzdGFydFZlcnRleCk7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgc2VnbWVudHM7ICsraSkge1xuICAgIGFuZ2xlID0gc3RhcnRBbmdsZSArIHNlZ21lbnRBbmdsZSAqIGk7XG4gICAgdmVydGljZXMucHVzaChbXG4gICAgICBjZW50ZXJbMF0gKyBNYXRoLmNvcyhhbmdsZSkgKiByYWRpdXMsXG4gICAgICBjZW50ZXJbMV0gKyBNYXRoLnNpbihhbmdsZSkgKiByYWRpdXNcbiAgICBdKTtcbiAgfVxuICB2ZXJ0aWNlcy5wdXNoKGVuZFZlcnRleCk7XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICBkaXN0XG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB1bml0c1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRpc3RhbmNlID0gZnVuY3Rpb24oZGlzdCwgdW5pdHMpIHtcbiAgdGhpcy5fZGlzdGFuY2UgPSBkaXN0IHx8IDA7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIEBzdGF0aWNcbiAqIEBwYXJhbSAge051bWJlcn0gIGRlZ3JlZXNcbiAqIEBwYXJhbSAge1N0cmluZz19IHVuaXRzXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbk9mZnNldC5kZWdyZWVzVG9Vbml0cyA9IGZ1bmN0aW9uKGRlZ3JlZXMsIHVuaXRzKSB7XG4gIHN3aXRjaCAodW5pdHMpIHtcbiAgICBjYXNlICdtaWxlcyc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDY5LjA0NztcbiAgICBicmVhaztcbiAgICBjYXNlICdmZWV0JzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMzY0NTY4LjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdraWxvbWV0ZXJzJzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMTExLjEyO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAnbWV0ZXJzJzpcbiAgICBjYXNlICdtZXRyZXMnOlxuICAgICAgZGVncmVlcyA9IGRlZ3JlZXMgLyAxMTExMjAuMDtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ2RlZ3JlZXMnOlxuICAgIGNhc2UgJ3BpeGVscyc6XG4gICAgZGVmYXVsdDpcbiAgICAgIGJyZWFrO1xuICB9XG4gIHJldHVybiBkZWdyZWVzO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxPYmplY3Q+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuZW5zdXJlTGFzdFBvaW50ID0gZnVuY3Rpb24odmVydGljZXMpIHtcbiAgaWYgKCFlcXVhbHModmVydGljZXNbMF0sIHZlcnRpY2VzW3ZlcnRpY2VzLmxlbmd0aCAtIDFdKSkge1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgdmVydGljZXNbMF1bMF0sXG4gICAgICB2ZXJ0aWNlc1swXVsxXVxuICAgIF0pO1xuICB9XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBEZWNpZGVzIGJ5IHRoZSBzaWduIGlmIGl0J3MgYSBwYWRkaW5nIG9yIGEgbWFyZ2luXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG4gIHJldHVybiB0aGlzLl9kaXN0YW5jZSA9PT0gMCA/IHRoaXMudmVydGljZXMgOlxuICAgICAgKHRoaXMuX2Rpc3RhbmNlID4gMCA/IHRoaXMubWFyZ2luKHRoaXMuX2Rpc3RhbmNlKSA6XG4gICAgICAgIHRoaXMucGFkZGluZygtdGhpcy5fZGlzdGFuY2UpKTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fSB2ZXJ0aWNlc1xuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICAgICAgICAgcHQxXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gICAgICAgICBwdDJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICAgICAgICAgIGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48TnVtYmVyPj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuX29mZnNldFNlZ21lbnQgPSBmdW5jdGlvbih2MSwgdjIsIGUxLCBkaXN0KSB7XG4gIHZhciB2ZXJ0aWNlcyA9IFtdO1xuICB2YXIgb2Zmc2V0cyA9IFtcbiAgICBlMS5vZmZzZXQoZTEuX2luTm9ybWFsWzBdICogZGlzdCwgZTEuX2luTm9ybWFsWzFdICogZGlzdCksXG4gICAgZTEuaW52ZXJzZU9mZnNldChlMS5fb3V0Tm9ybWFsWzBdICogZGlzdCwgZTEuX291dE5vcm1hbFsxXSAqIGRpc3QpXG4gIF07XG5cbiAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IDI7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciB0aGlzRWRnZSA9IG9mZnNldHNbaV0sXG4gICAgICAgIHByZXZFZGdlID0gb2Zmc2V0c1soaSArIGxlbiAtIDEpICUgbGVuXTtcbiAgICB0aGlzLmNyZWF0ZUFyYyhcbiAgICAgICAgICAgICAgdmVydGljZXMsXG4gICAgICAgICAgICAgIGkgPT09IDAgPyB2MSA6IHYyLCAvLyBlZGdlc1tpXS5jdXJyZW50LCAvLyBwMSBvciBwMlxuICAgICAgICAgICAgICBkaXN0LFxuICAgICAgICAgICAgICBwcmV2RWRnZS5uZXh0LFxuICAgICAgICAgICAgICB0aGlzRWRnZS5jdXJyZW50LFxuICAgICAgICAgICAgICB0aGlzLl9hcmNTZWdtZW50cyxcbiAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgfVxuXG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxOdW1iZXI+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm1hcmdpbiA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgdGhpcy5kaXN0YW5jZShkaXN0KTtcblxuICBpZiAodHlwZW9mIHRoaXMudmVydGljZXNbMF0gPT09ICdudW1iZXInKSB7IC8vIHBvaW50XG4gICAgcmV0dXJuIHRoaXMub2Zmc2V0UG9pbnQodGhpcy5fZGlzdGFuY2UpO1xuICB9XG5cbiAgaWYgKGRpc3QgPT09IDApIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuXG4gIHZhciB1bmlvbiA9IHRoaXMub2Zmc2V0TGluZXModGhpcy5fZGlzdGFuY2UpO1xuICAvL3JldHVybiB1bmlvbjtcbiAgdW5pb24gPSBtYXJ0aW5lei51bmlvbih0aGlzLnZlcnRpY2VzLCB1bmlvbik7XG4gIHJldHVybiBvcmllbnRSaW5ncyh1bmlvbik7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5wYWRkaW5nID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuXG4gIGlmICh0aGlzLl9kaXN0YW5jZSA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICBpZiAodGhpcy52ZXJ0aWNlcy5sZW5ndGggPT09IDIgJiYgdHlwZW9mIHRoaXMudmVydGljZXNbMF0gPT09ICdudW1iZXInKSB7XG4gICAgcmV0dXJuIHRoaXMudmVydGljZXM7XG4gIH1cblxuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmVzKHRoaXMuX2Rpc3RhbmNlKTtcbiAgdmFyIGRpZmYgPSBtYXJ0aW5lei5kaWZmKHRoaXMudmVydGljZXMsIHVuaW9uKTtcbiAgcmV0dXJuIG9yaWVudFJpbmdzKGRpZmYpO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZXMgbWFyZ2luIHBvbHlnb25cbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0TGluZSA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgaWYgKGRpc3QgPT09IDApIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuICByZXR1cm4gb3JpZW50UmluZ3ModGhpcy5vZmZzZXRMaW5lcyhkaXN0KSk7XG59O1xuXG5cbi8qKlxuICogSnVzdCBvZmZzZXRzIGxpbmVzLCBubyBmaWxsXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48QXJyYXkuPE51bWJlcj4+Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXRMaW5lcyA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgaWYgKGRpc3QgPCAwKSB0aHJvdyBuZXcgRXJyb3IoJ0Nhbm5vdCBhcHBseSBuZWdhdGl2ZSBtYXJnaW4gdG8gdGhlIGxpbmUnKTtcbiAgdmFyIHVuaW9uO1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuICBpZiAoaXNBcnJheSh0aGlzLnZlcnRpY2VzWzBdKSAmJiB0eXBlb2YgdGhpcy52ZXJ0aWNlc1swXVswXSAhPT0gJ251bWJlcicpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy5fZWRnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHVuaW9uID0gKGkgPT09IDApID9cbiAgICAgICAgdGhpcy5vZmZzZXRDb250b3VyKHRoaXMudmVydGljZXNbaV0sIHRoaXMuX2VkZ2VzW2ldKTpcbiAgICAgICAgbWFydGluZXoudW5pb24odW5pb24sIHRoaXMub2Zmc2V0Q29udG91cih0aGlzLnZlcnRpY2VzW2ldLCB0aGlzLl9lZGdlc1tpXSkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICB1bmlvbiA9ICh0aGlzLnZlcnRpY2VzLmxlbmd0aCA9PT0gMSkgP1xuICAgICAgdGhpcy5vZmZzZXRQb2ludCgpIDpcbiAgICAgIHRoaXMub2Zmc2V0Q29udG91cih0aGlzLnZlcnRpY2VzLCB0aGlzLl9lZGdlcyk7XG4gIH1cblxuICByZXR1cm4gdW5pb247XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+PnxBcnJheS48QXJyYXkuPC4uLj4+fSBjdXJ2ZVxuICogQHBhcmFtICB7QXJyYXkuPEVkZ2U+fEFycmF5LjxBcnJheS48Li4uPj59IGVkZ2VzXG4gKiBAcmV0dXJuIHtQb2x5Z29ufVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldENvbnRvdXIgPSBmdW5jdGlvbihjdXJ2ZSwgZWRnZXMpIHtcbiAgdmFyIHVuaW9uLCBpLCBsZW47XG4gIGlmIChpc0FycmF5KGN1cnZlWzBdKSAmJiB0eXBlb2YgY3VydmVbMF1bMF0gPT09ICdudW1iZXInKSB7XG4gICAgLy8gd2UgaGF2ZSAxIGxlc3MgZWRnZSB0aGFuIHZlcnRpY2VzXG4gICAgZm9yIChpID0gMCwgbGVuID0gY3VydmUubGVuZ3RoIC0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgc2VnbWVudCA9IHRoaXMuZW5zdXJlTGFzdFBvaW50KFxuICAgICAgICB0aGlzLl9vZmZzZXRTZWdtZW50KGN1cnZlW2ldLCBjdXJ2ZVtpICsgMV0sIGVkZ2VzW2ldLCB0aGlzLl9kaXN0YW5jZSlcbiAgICAgICk7XG4gICAgICB1bmlvbiA9IChpID09PSAwKSA/XG4gICAgICAgICAgICAgICAgW3RoaXMuZW5zdXJlTGFzdFBvaW50KHNlZ21lbnQpXSA6XG4gICAgICAgICAgICAgICAgbWFydGluZXoudW5pb24odW5pb24sIHRoaXMuZW5zdXJlTGFzdFBvaW50KHNlZ21lbnQpKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gZWRnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHVuaW9uID0gKGkgPT09IDApID9cbiAgICAgICAgdGhpcy5vZmZzZXRDb250b3VyKGN1cnZlW2ldLCBlZGdlc1tpXSkgOlxuICAgICAgICBtYXJ0aW5lei51bmlvbih1bmlvbiwgdGhpcy5vZmZzZXRDb250b3VyKGN1cnZlW2ldLCBlZGdlc1tpXSkpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gdW5pb247XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0YW5jZVxuICogQHJldHVybiB7QXJyYXkuPEFycmF5LjxOdW1iZXI+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldFBvaW50ID0gZnVuY3Rpb24oZGlzdGFuY2UpIHtcbiAgdGhpcy5kaXN0YW5jZShkaXN0YW5jZSk7XG4gIHZhciB2ZXJ0aWNlcyA9IHRoaXMuX2FyY1NlZ21lbnRzICogMjtcbiAgdmFyIHBvaW50cyAgID0gW107XG4gIHZhciBjZW50ZXIgICA9IHRoaXMudmVydGljZXM7XG4gIHZhciByYWRpdXMgICA9IHRoaXMuX2Rpc3RhbmNlO1xuICB2YXIgYW5nbGUgICAgPSAwO1xuXG4gIGlmICh2ZXJ0aWNlcyAlIDIgPT09IDApIHZlcnRpY2VzKys7XG5cbiAgZm9yICh2YXIgaSA9IDA7IGkgPCB2ZXJ0aWNlczsgaSsrKSB7XG4gICAgYW5nbGUgKz0gKDIgKiBNYXRoLlBJIC8gdmVydGljZXMpOyAvLyBjb3VudGVyLWNsb2Nrd2lzZVxuICAgIHBvaW50cy5wdXNoKFtcbiAgICAgIGNlbnRlclswXSArIChyYWRpdXMgKiBNYXRoLmNvcyhhbmdsZSkpLFxuICAgICAgY2VudGVyWzFdICsgKHJhZGl1cyAqIE1hdGguc2luKGFuZ2xlKSlcbiAgICBdKTtcbiAgfVxuXG4gIHJldHVybiBvcmllbnRSaW5ncyhbdGhpcy5lbnN1cmVMYXN0UG9pbnQocG9pbnRzKV0pO1xufTtcblxuXG5PZmZzZXQub3JpZW50UmluZ3MgPSBvcmllbnRSaW5ncztcblxubW9kdWxlLmV4cG9ydHMgPSBPZmZzZXQ7XG4iLCIvKipcbiAqIEBwYXJhbSAgeyp9IGFyclxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xudmFyIGlzQXJyYXkgPSBtb2R1bGUuZXhwb3J0cy5pc0FycmF5ID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiAoYXJyKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDFcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMlxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xubW9kdWxlLmV4cG9ydHMuZXF1YWxzID0gZnVuY3Rpb24gZXF1YWxzKHAxLCBwMikge1xuICByZXR1cm4gcDFbMF0gPT09IHAyWzBdICYmIHAxWzFdID09PSBwMlsxXTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHsqfSAgICAgICBjb29yZGluYXRlc1xuICogQHBhcmFtICB7TnVtYmVyPX0gZGVwdGhcbiAqIEByZXR1cm4geyp9XG4gKi9cbm1vZHVsZS5leHBvcnRzLm9yaWVudFJpbmdzID0gZnVuY3Rpb24gb3JpZW50UmluZ3MoY29vcmRpbmF0ZXMsIGRlcHRoLCBpc0hvbGUpIHtcbiAgZGVwdGggPSBkZXB0aCB8fCAwO1xuICB2YXIgaSwgbGVuO1xuICBpZiAoaXNBcnJheShjb29yZGluYXRlcykgJiYgdHlwZW9mIGNvb3JkaW5hdGVzWzBdWzBdID09PSAnbnVtYmVyJykge1xuICAgIHZhciBhcmVhID0gMDtcbiAgICB2YXIgcmluZyA9IGNvb3JkaW5hdGVzO1xuXG4gICAgZm9yIChpID0gMCwgbGVuID0gcmluZy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdmFyIHB0MSA9IHJpbmdbaV07XG4gICAgICB2YXIgcHQyID0gcmluZ1soaSArIDEpICUgbGVuXTtcbiAgICAgIGFyZWEgKz0gcHQxWzBdICogcHQyWzFdO1xuICAgICAgYXJlYSAtPSBwdDJbMF0gKiBwdDFbMV07XG4gICAgfVxuICAgIGlmICgoIWlzSG9sZSAmJiBhcmVhID4gMCkgfHwgKGlzSG9sZSAmJiBhcmVhIDwgMCkpIHtcbiAgICAgIHJpbmcucmV2ZXJzZSgpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjb29yZGluYXRlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgb3JpZW50UmluZ3MoY29vcmRpbmF0ZXNbaV0sIGRlcHRoICsgMSwgaSA+IDApO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb29yZGluYXRlcztcbn07IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInR5cGVcIjogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxuICBcImZlYXR1cmVzXCI6IFtcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODQ2NjMyOTU3NDU4NixcbiAgICAgICAgICAgICAgMjIuMjY3ODkwMzE1OTA1NTA3XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg4NDA3NjU5NTMwNjUsXG4gICAgICAgICAgICAgIDIyLjI2OTI2MDQ3MDI2MTc4XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg2NTE5Mzg0Mzg0MTcsXG4gICAgICAgICAgICAgIDIyLjI2NzI4NDY2MzY4OTMyNFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NzYyNDQ1NDQ5ODMsXG4gICAgICAgICAgICAgIDIyLjI2NTQzNzkwNDY4MzRcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODQ5OTU4ODk2NjM3MSxcbiAgICAgICAgICAgICAgMjIuMjY2MjcxOTI3ODk3NTk1XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg0NjYzMjk1NzQ1ODYsXG4gICAgICAgICAgICAgIDIyLjI2Nzg5MDMxNTkwNTUwN1xuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHt9LFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4ODM2NDc0NDE4NjQyLFxuICAgICAgICAgICAgMjIuMjcwNzQ5NzUzMjU2ODMzXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTkwNDc4MzI0ODkwMTUsXG4gICAgICAgICAgICAyMi4yNjk3NzY3NTY4Mjg2NFxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHt9LFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4OTI1NTIzNzU3OTM1LFxuICAgICAgICAgICAgMjIuMjY3NTkyNDU0NDg3NDU2XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTkyMDQ0NzM0OTU0ODMsXG4gICAgICAgICAgICAyMi4yNjkyODAzMjc0NzI2NlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE5MTIxODYxNDU3ODI2LFxuICAgICAgICAgICAgMjIuMjY0ODgxODg2NDQ1NzhcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xOTM1Nzg5NTg1MTEzNyxcbiAgICAgICAgICAgIDIyLjI2NjkyNzIyODM2NDQ3N1xuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4OTM1MTc5NzEwMzksXG4gICAgICAgICAgICAyMi4yNjY1MzAwNzY5MzI2OVxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHt9LFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIlBvaW50XCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIDExNC4xODk0OTEyNzE5NzI2NyxcbiAgICAgICAgICAyMi4yNzE4MDIxNzAzNDY4ODRcbiAgICAgICAgXVxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHt9LFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg2NDY1NzQwMjAzODYsXG4gICAgICAgICAgICAgIDIyLjI2MzkxODc3ODE5OTgxXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTkyMjU5MzExNjc2MDQsXG4gICAgICAgICAgICAgIDIyLjI2Mzc1OTkxNDM0NzE3NlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE5MjQ1MjQzMDcyNTExLFxuICAgICAgICAgICAgICAyMi4yNjAwNDY0MjA0MjEzODZcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODU1ODU5NzU2NDY5OSxcbiAgICAgICAgICAgICAgMjIuMjYwNTAzMTY1NjI5NjQzXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg2NDY1NzQwMjAzODYsXG4gICAgICAgICAgICAgIDIyLjI2MzkxODc3ODE5OTgxXG4gICAgICAgICAgICBdXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODczMjQwNDcwODg2NCxcbiAgICAgICAgICAgICAgMjIuMjYzMjQzNjA1NTgwNzRcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODczODg0MjAxMDUsXG4gICAgICAgICAgICAgIDIyLjI2MTIxODA2ODE4MVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE5MDkyODkzNjAwNDY1LFxuICAgICAgICAgICAgICAyMi4yNjA5NTk5MDkzNDc1NDVcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xOTEwMTQ3NjY2OTMxMixcbiAgICAgICAgICAgICAgMjIuMjYyNjg3NTc4NjI1MjRcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODczMjQwNDcwODg2NCxcbiAgICAgICAgICAgICAgMjIuMjYzMjQzNjA1NTgwNzRcbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9XG4gIF1cbn0iXX0=
