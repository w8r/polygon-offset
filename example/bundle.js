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
    if (margin === 0) return;
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
          type: 'Polygon',
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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4YW1wbGUvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgT2Zmc2V0ID0gZ2xvYmFsLk9mZnNldCA9IHJlcXVpcmUoJy4uL3NyYy9vZmZzZXQnKTtcbnJlcXVpcmUoJy4vbGVhZmxldF9tdWx0aXBvbHlnb24nKTtcbnJlcXVpcmUoJy4vcG9seWdvbl9jb250cm9sJyk7XG52YXIgT2Zmc2V0Q29udHJvbCA9IHJlcXVpcmUoJy4vb2Zmc2V0X2NvbnRyb2wnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9kZW1vLmpzb24nKTtcbnZhciBwcm9qZWN0ID0gcmVxdWlyZSgnZ2VvanNvbi1wcm9qZWN0Jyk7XG5cbnZhciBhcmNTZWdtZW50cyA9IDU7XG5cbnZhciBzdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAzLFxuICAgICAgICBjb2xvcjogJyM0OGYnLFxuICAgICAgICBvcGFjaXR5OiAwLjgsXG4gICAgICAgIGRhc2hBcnJheTogWzIsIDRdXG4gICAgfSxcbiAgICBtYXJnaW5TdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAyLFxuICAgICAgICBjb2xvcjogJyMyNzZEOEYnXG4gICAgfSxcbiAgICBwYWRkaW5nU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjRDgxNzA2J1xuICAgIH0sXG4gICAgY2VudGVyID0gWzIyLjI2NzAsIDExNC4xODhdLFxuICAgIHpvb20gPSAxNyxcbiAgICBtYXAsIHZlcnRpY2VzLCByZXN1bHQ7XG5cbm1hcCA9IGdsb2JhbC5tYXAgPSBMLm1hcCgnbWFwJywge1xuICBlZGl0YWJsZTogdHJ1ZSxcbiAgbWF4Wm9vbTogMjJcbn0pLnNldFZpZXcoY2VudGVyLCB6b29tKTtcblxuXG5tYXAuYWRkQ29udHJvbChuZXcgTC5OZXdQb2x5Z29uQ29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0UG9seWdvblxufSkpO1xuXG5tYXAuYWRkQ29udHJvbChuZXcgTC5OZXdMaW5lQ29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0UG9seWxpbmVcbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9pbnRDb250cm9sKHtcbiAgY2FsbGJhY2s6IG1hcC5lZGl0VG9vbHMuc3RhcnRNYXJrZXJcbn0pKTtcblxudmFyIGxheWVycyA9IGdsb2JhbC5sYXllcnMgPSBMLmdlb0pzb24oZGF0YSkuYWRkVG8obWFwKTtcbnZhciByZXN1bHRzID0gZ2xvYmFsLnJlc3VsdHMgPSBMLmdlb0pzb24obnVsbCwge1xuICBzdHlsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiBtYXJnaW5TdHlsZTtcbiAgfVxufSkuYWRkVG8obWFwKTtcbm1hcC5maXRCb3VuZHMobGF5ZXJzLmdldEJvdW5kcygpLCB7IGFuaW1hdGU6IGZhbHNlIH0pO1xuXG5tYXAuYWRkQ29udHJvbChuZXcgT2Zmc2V0Q29udHJvbCh7XG4gIGNsZWFyOiBmdW5jdGlvbigpIHtcbiAgICBsYXllcnMuY2xlYXJMYXllcnMoKTtcbiAgfSxcbiAgY2FsbGJhY2s6IHJ1blxufSkpO1xuXG5tYXAub24oJ2VkaXRhYmxlOmNyZWF0ZWQnLCBmdW5jdGlvbihldnQpIHtcbiAgbGF5ZXJzLmFkZExheWVyKGV2dC5sYXllcik7XG4gIGV2dC5sYXllci5vbignY2xpY2snLCBmdW5jdGlvbihlKSB7XG4gICAgaWYgKChlLm9yaWdpbmFsRXZlbnQuY3RybEtleSB8fCBlLm9yaWdpbmFsRXZlbnQubWV0YUtleSkgJiYgdGhpcy5lZGl0RW5hYmxlZCgpKSB7XG4gICAgICB0aGlzLmVkaXRvci5uZXdIb2xlKGUubGF0bG5nKTtcbiAgICB9XG4gIH0pO1xufSk7XG5cbmZ1bmN0aW9uIHJ1biAobWFyZ2luKSB7XG4gIHJlc3VsdHMuY2xlYXJMYXllcnMoKTtcbiAgbGF5ZXJzLmVhY2hMYXllcihmdW5jdGlvbihsYXllcikge1xuICAgIHZhciBnaiA9IGxheWVyLnRvR2VvSlNPTigpO1xuICAgIGNvbnNvbGUubG9nKGdqLCBtYXJnaW4pO1xuICAgIGlmIChtYXJnaW4gPT09IDApIHJldHVybjtcbiAgICB2YXIgc2hhcGUgPSBwcm9qZWN0KGdqLCBmdW5jdGlvbihjb29yZCkge1xuICAgICAgdmFyIHB0ID0gbWFwLm9wdGlvbnMuY3JzLmxhdExuZ1RvUG9pbnQoTC5sYXRMbmcoY29vcmQuc2xpY2UoKS5yZXZlcnNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbiAgICAgIHJldHVybiBbcHQueCwgcHQueV07XG4gICAgfSk7XG5cbiAgICB2YXIgbWFyZ2luZWQ7XG4gICAgY29uc29sZS5sb2coZ2ouZ2VvbWV0cnkudHlwZSk7XG4gICAgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgaWYgKG1hcmdpbiA8IDApIHJldHVybjtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpXG4gICAgICAgIC5vZmZzZXRMaW5lKG1hcmdpbik7XG5cbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2UgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdQb2ludCcpIHtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKVxuICAgICAgICAuYXJjU2VnbWVudHMoYXJjU2VnbWVudHMpXG4gICAgICAgIC5vZmZzZXQobWFyZ2luKTtcblxuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHJlc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykub2Zmc2V0KG1hcmdpbik7XG4gICAgICBtYXJnaW5lZCA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogcmVzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ21hcmdpbmVkJywgbWFyZ2luZWQpO1xuICAgIHJlc3VsdHMuYWRkRGF0YShwcm9qZWN0KG1hcmdpbmVkLCBmdW5jdGlvbihwdCkge1xuICAgICAgdmFyIGxsID0gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwdC5zbGljZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW2xsLmxuZywgbGwubGF0XTtcbiAgICB9KSk7XG4gIH0pO1xufVxuXG5ydW4gKDIwKTtcbiJdfQ==
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
  }

  for (i = 0, len = resultEvents.length; i < len; i++) {
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

      //console.log(pos, resultEvents[pos]);
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
var utils = require('./utils');


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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9hcHAuanMiLCJleGFtcGxlL2xlYWZsZXRfbXVsdGlwb2x5Z29uLmpzIiwiZXhhbXBsZS9vZmZzZXRfY29udHJvbC5qcyIsImV4YW1wbGUvcG9seWdvbl9jb250cm9sLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9iaW50cmVlLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9yYnRyZWUuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL3RyZWViYXNlLmpzIiwibm9kZV9tb2R1bGVzL2dlb2pzb24tcHJvamVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfc2VnbWVudHMuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvZWRnZV90eXBlLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2VxdWFscy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zZWdtZW50X2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zaWduZWRfYXJlYS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zd2VlcF9ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW55cXVldWUvaW5kZXguanMiLCJzcmMvZWRnZS5qcyIsInNyYy9vZmZzZXQuanMiLCJzcmMvdXRpbHMuanMiLCJ0ZXN0L2ZpeHR1cmVzL2RlbW8uanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbElBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDakRBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM29CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0dBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdFpBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPZmZzZXQgPSBnbG9iYWwuT2Zmc2V0ID0gcmVxdWlyZSgnLi4vc3JjL29mZnNldCcpO1xucmVxdWlyZSgnLi9sZWFmbGV0X211bHRpcG9seWdvbicpO1xucmVxdWlyZSgnLi9wb2x5Z29uX2NvbnRyb2wnKTtcbnZhciBPZmZzZXRDb250cm9sID0gcmVxdWlyZSgnLi9vZmZzZXRfY29udHJvbCcpO1xudmFyIGRhdGEgPSByZXF1aXJlKCcuLi90ZXN0L2ZpeHR1cmVzL2RlbW8uanNvbicpO1xudmFyIHByb2plY3QgPSByZXF1aXJlKCdnZW9qc29uLXByb2plY3QnKTtcblxudmFyIGFyY1NlZ21lbnRzID0gNTtcblxudmFyIHN0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDMsXG4gICAgICAgIGNvbG9yOiAnIzQ4ZicsXG4gICAgICAgIG9wYWNpdHk6IDAuOCxcbiAgICAgICAgZGFzaEFycmF5OiBbMiwgNF1cbiAgICB9LFxuICAgIG1hcmdpblN0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnIzI3NkQ4RidcbiAgICB9LFxuICAgIHBhZGRpbmdTdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAyLFxuICAgICAgICBjb2xvcjogJyNEODE3MDYnXG4gICAgfSxcbiAgICBjZW50ZXIgPSBbMjIuMjY3MCwgMTE0LjE4OF0sXG4gICAgem9vbSA9IDE3LFxuICAgIG1hcCwgdmVydGljZXMsIHJlc3VsdDtcblxubWFwID0gZ2xvYmFsLm1hcCA9IEwubWFwKCdtYXAnLCB7XG4gIGVkaXRhYmxlOiB0cnVlLFxuICBtYXhab29tOiAyMlxufSkuc2V0VmlldyhjZW50ZXIsIHpvb20pO1xuXG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld1BvbHlnb25Db250cm9sKHtcbiAgY2FsbGJhY2s6IG1hcC5lZGl0VG9vbHMuc3RhcnRQb2x5Z29uXG59KSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld0xpbmVDb250cm9sKHtcbiAgY2FsbGJhY2s6IG1hcC5lZGl0VG9vbHMuc3RhcnRQb2x5bGluZVxufSkpO1xuXG5tYXAuYWRkQ29udHJvbChuZXcgTC5OZXdQb2ludENvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydE1hcmtlclxufSkpO1xuXG52YXIgbGF5ZXJzID0gZ2xvYmFsLmxheWVycyA9IEwuZ2VvSnNvbihkYXRhKS5hZGRUbyhtYXApO1xudmFyIHJlc3VsdHMgPSBnbG9iYWwucmVzdWx0cyA9IEwuZ2VvSnNvbihudWxsLCB7XG4gIHN0eWxlOiBmdW5jdGlvbihmZWF0dXJlKSB7XG4gICAgcmV0dXJuIG1hcmdpblN0eWxlO1xuICB9XG59KS5hZGRUbyhtYXApO1xubWFwLmZpdEJvdW5kcyhsYXllcnMuZ2V0Qm91bmRzKCksIHsgYW5pbWF0ZTogZmFsc2UgfSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBPZmZzZXRDb250cm9sKHtcbiAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGxheWVycy5jbGVhckxheWVycygpO1xuICB9LFxuICBjYWxsYmFjazogcnVuXG59KSk7XG5cbm1hcC5vbignZWRpdGFibGU6Y3JlYXRlZCcsIGZ1bmN0aW9uKGV2dCkge1xuICBsYXllcnMuYWRkTGF5ZXIoZXZ0LmxheWVyKTtcbiAgZXZ0LmxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoKGUub3JpZ2luYWxFdmVudC5jdHJsS2V5IHx8IGUub3JpZ2luYWxFdmVudC5tZXRhS2V5KSAmJiB0aGlzLmVkaXRFbmFibGVkKCkpIHtcbiAgICAgIHRoaXMuZWRpdG9yLm5ld0hvbGUoZS5sYXRsbmcpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuZnVuY3Rpb24gcnVuIChtYXJnaW4pIHtcbiAgcmVzdWx0cy5jbGVhckxheWVycygpO1xuICBsYXllcnMuZWFjaExheWVyKGZ1bmN0aW9uKGxheWVyKSB7XG4gICAgdmFyIGdqID0gbGF5ZXIudG9HZW9KU09OKCk7XG4gICAgY29uc29sZS5sb2coZ2osIG1hcmdpbik7XG4gICAgaWYgKG1hcmdpbiA9PT0gMCkgcmV0dXJuO1xuICAgIHZhciBzaGFwZSA9IHByb2plY3QoZ2osIGZ1bmN0aW9uKGNvb3JkKSB7XG4gICAgICB2YXIgcHQgPSBtYXAub3B0aW9ucy5jcnMubGF0TG5nVG9Qb2ludChMLmxhdExuZyhjb29yZC5zbGljZSgpLnJldmVyc2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtwdC54LCBwdC55XTtcbiAgICB9KTtcblxuICAgIHZhciBtYXJnaW5lZDtcbiAgICBjb25zb2xlLmxvZyhnai5nZW9tZXRyeS50eXBlKTtcbiAgICBpZiAoZ2ouZ2VvbWV0cnkudHlwZSA9PT0gJ0xpbmVTdHJpbmcnKSB7XG4gICAgICBpZiAobWFyZ2luIDwgMCkgcmV0dXJuO1xuICAgICAgdmFyIHJlcyA9IG5ldyBPZmZzZXQoc2hhcGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpXG4gICAgICAgIC5hcmNTZWdtZW50cyhhcmNTZWdtZW50cylcbiAgICAgICAgLm9mZnNldExpbmUobWFyZ2luKTtcblxuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IHJlc1xuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSBpZiAoZ2ouZ2VvbWV0cnkudHlwZSA9PT0gJ1BvaW50Jykge1xuICAgICAgdmFyIHJlcyA9IG5ldyBPZmZzZXQoc2hhcGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXMpXG4gICAgICAgIC5hcmNTZWdtZW50cyhhcmNTZWdtZW50cylcbiAgICAgICAgLm9mZnNldChtYXJnaW4pO1xuXG4gICAgICBtYXJnaW5lZCA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogcmVzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKS5vZmZzZXQobWFyZ2luKTtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbiAgICBjb25zb2xlLmxvZygnbWFyZ2luZWQnLCBtYXJnaW5lZCk7XG4gICAgcmVzdWx0cy5hZGREYXRhKHByb2plY3QobWFyZ2luZWQsIGZ1bmN0aW9uKHB0KSB7XG4gICAgICB2YXIgbGwgPSBtYXAub3B0aW9ucy5jcnMucG9pbnRUb0xhdExuZyhMLnBvaW50KHB0LnNsaWNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbiAgICAgIHJldHVybiBbbGwubG5nLCBsbC5sYXRdO1xuICAgIH0pKTtcbiAgfSk7XG59XG5cbnJ1biAoMjApO1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVjRZVzF3YkdVdllYQndMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnVDJabWMyVjBJRDBnWjJ4dlltRnNMazltWm5ObGRDQTlJSEpsY1hWcGNtVW9KeTR1TDNOeVl5OXZabVp6WlhRbktUdGNibkpsY1hWcGNtVW9KeTR2YkdWaFpteGxkRjl0ZFd4MGFYQnZiSGxuYjI0bktUdGNibkpsY1hWcGNtVW9KeTR2Y0c5c2VXZHZibDlqYjI1MGNtOXNKeWs3WEc1MllYSWdUMlptYzJWMFEyOXVkSEp2YkNBOUlISmxjWFZwY21Vb0p5NHZiMlptYzJWMFgyTnZiblJ5YjJ3bktUdGNiblpoY2lCa1lYUmhJRDBnY21WeGRXbHlaU2duTGk0dmRHVnpkQzltYVhoMGRYSmxjeTlrWlcxdkxtcHpiMjRuS1R0Y2JuWmhjaUJ3Y205cVpXTjBJRDBnY21WeGRXbHlaU2duWjJWdmFuTnZiaTF3Y205cVpXTjBKeWs3WEc1Y2JuWmhjaUJoY21OVFpXZHRaVzUwY3lBOUlEVTdYRzVjYm5aaGNpQnpkSGxzWlNBOUlIdGNiaUFnSUNBZ0lDQWdkMlZwWjJoME9pQXpMRnh1SUNBZ0lDQWdJQ0JqYjJ4dmNqb2dKeU0wT0dZbkxGeHVJQ0FnSUNBZ0lDQnZjR0ZqYVhSNU9pQXdMamdzWEc0Z0lDQWdJQ0FnSUdSaGMyaEJjbkpoZVRvZ1d6SXNJRFJkWEc0Z0lDQWdmU3hjYmlBZ0lDQnRZWEpuYVc1VGRIbHNaU0E5SUh0Y2JpQWdJQ0FnSUNBZ2QyVnBaMmgwT2lBeUxGeHVJQ0FnSUNBZ0lDQmpiMnh2Y2pvZ0p5TXlOelpFT0VZblhHNGdJQ0FnZlN4Y2JpQWdJQ0J3WVdSa2FXNW5VM1I1YkdVZ1BTQjdYRzRnSUNBZ0lDQWdJSGRsYVdkb2REb2dNaXhjYmlBZ0lDQWdJQ0FnWTI5c2IzSTZJQ2NqUkRneE56QTJKMXh1SUNBZ0lIMHNYRzRnSUNBZ1kyVnVkR1Z5SUQwZ1d6SXlMakkyTnpBc0lERXhOQzR4T0RoZExGeHVJQ0FnSUhwdmIyMGdQU0F4Tnl4Y2JpQWdJQ0J0WVhBc0lIWmxjblJwWTJWekxDQnlaWE4xYkhRN1hHNWNibTFoY0NBOUlHZHNiMkpoYkM1dFlYQWdQU0JNTG0xaGNDZ25iV0Z3Snl3Z2UxeHVJQ0JsWkdsMFlXSnNaVG9nZEhKMVpTeGNiaUFnYldGNFdtOXZiVG9nTWpKY2JuMHBMbk5sZEZacFpYY29ZMlZ1ZEdWeUxDQjZiMjl0S1R0Y2JseHVYRzV0WVhBdVlXUmtRMjl1ZEhKdmJDaHVaWGNnVEM1T1pYZFFiMng1WjI5dVEyOXVkSEp2YkNoN1hHNGdJR05oYkd4aVlXTnJPaUJ0WVhBdVpXUnBkRlJ2YjJ4ekxuTjBZWEowVUc5c2VXZHZibHh1ZlNrcE8xeHVYRzV0WVhBdVlXUmtRMjl1ZEhKdmJDaHVaWGNnVEM1T1pYZE1hVzVsUTI5dWRISnZiQ2g3WEc0Z0lHTmhiR3hpWVdOck9pQnRZWEF1WldScGRGUnZiMnh6TG5OMFlYSjBVRzlzZVd4cGJtVmNibjBwS1R0Y2JseHViV0Z3TG1Ga1pFTnZiblJ5YjJ3b2JtVjNJRXd1VG1WM1VHOXBiblJEYjI1MGNtOXNLSHRjYmlBZ1kyRnNiR0poWTJzNklHMWhjQzVsWkdsMFZHOXZiSE11YzNSaGNuUk5ZWEpyWlhKY2JuMHBLVHRjYmx4dWRtRnlJR3hoZVdWeWN5QTlJR2RzYjJKaGJDNXNZWGxsY25NZ1BTQk1MbWRsYjBwemIyNG9aR0YwWVNrdVlXUmtWRzhvYldGd0tUdGNiblpoY2lCeVpYTjFiSFJ6SUQwZ1oyeHZZbUZzTG5KbGMzVnNkSE1nUFNCTUxtZGxiMHB6YjI0b2JuVnNiQ3dnZTF4dUlDQnpkSGxzWlRvZ1puVnVZM1JwYjI0b1ptVmhkSFZ5WlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ0WVhKbmFXNVRkSGxzWlR0Y2JpQWdmVnh1ZlNrdVlXUmtWRzhvYldGd0tUdGNibTFoY0M1bWFYUkNiM1Z1WkhNb2JHRjVaWEp6TG1kbGRFSnZkVzVrY3lncExDQjdJR0Z1YVcxaGRHVTZJR1poYkhObElIMHBPMXh1WEc1dFlYQXVZV1JrUTI5dWRISnZiQ2h1WlhjZ1QyWm1jMlYwUTI5dWRISnZiQ2g3WEc0Z0lHTnNaV0Z5T2lCbWRXNWpkR2x2YmlncElIdGNiaUFnSUNCc1lYbGxjbk11WTJ4bFlYSk1ZWGxsY25Nb0tUdGNiaUFnZlN4Y2JpQWdZMkZzYkdKaFkyczZJSEoxYmx4dWZTa3BPMXh1WEc1dFlYQXViMjRvSjJWa2FYUmhZbXhsT21OeVpXRjBaV1FuTENCbWRXNWpkR2x2YmlobGRuUXBJSHRjYmlBZ2JHRjVaWEp6TG1Ga1pFeGhlV1Z5S0dWMmRDNXNZWGxsY2lrN1hHNGdJR1YyZEM1c1lYbGxjaTV2YmlnblkyeHBZMnNuTENCbWRXNWpkR2x2YmlobEtTQjdYRzRnSUNBZ2FXWWdLQ2hsTG05eWFXZHBibUZzUlhabGJuUXVZM1J5YkV0bGVTQjhmQ0JsTG05eWFXZHBibUZzUlhabGJuUXViV1YwWVV0bGVTa2dKaVlnZEdocGN5NWxaR2wwUlc1aFlteGxaQ2dwS1NCN1hHNGdJQ0FnSUNCMGFHbHpMbVZrYVhSdmNpNXVaWGRJYjJ4bEtHVXViR0YwYkc1bktUdGNiaUFnSUNCOVhHNGdJSDBwTzF4dWZTazdYRzVjYm1aMWJtTjBhVzl1SUhKMWJpQW9iV0Z5WjJsdUtTQjdYRzRnSUhKbGMzVnNkSE11WTJ4bFlYSk1ZWGxsY25Nb0tUdGNiaUFnYkdGNVpYSnpMbVZoWTJoTVlYbGxjaWhtZFc1amRHbHZiaWhzWVhsbGNpa2dlMXh1SUNBZ0lIWmhjaUJuYWlBOUlHeGhlV1Z5TG5SdlIyVnZTbE5QVGlncE8xeHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktHZHFMQ0J0WVhKbmFXNHBPMXh1SUNBZ0lHbG1JQ2h0WVhKbmFXNGdQVDA5SURBcElISmxkSFZ5Ymp0Y2JpQWdJQ0IyWVhJZ2MyaGhjR1VnUFNCd2NtOXFaV04wS0dkcUxDQm1kVzVqZEdsdmJpaGpiMjl5WkNrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEIwSUQwZ2JXRndMbTl3ZEdsdmJuTXVZM0p6TG14aGRFeHVaMVJ2VUc5cGJuUW9UQzVzWVhSTWJtY29ZMjl2Y21RdWMyeHBZMlVvS1M1eVpYWmxjbk5sS0NrcExDQnRZWEF1WjJWMFdtOXZiU2dwS1R0Y2JpQWdJQ0FnSUhKbGRIVnliaUJiY0hRdWVDd2djSFF1ZVYwN1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCMllYSWdiV0Z5WjJsdVpXUTdYRzRnSUNBZ1kyOXVjMjlzWlM1c2IyY29aMm91WjJWdmJXVjBjbmt1ZEhsd1pTazdYRzRnSUNBZ2FXWWdLR2RxTG1kbGIyMWxkSEo1TG5SNWNHVWdQVDA5SUNkTWFXNWxVM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdhV1lnS0cxaGNtZHBiaUE4SURBcElISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUhaaGNpQnlaWE1nUFNCdVpYY2dUMlptYzJWMEtITm9ZWEJsTG1kbGIyMWxkSEo1TG1OdmIzSmthVzVoZEdWektWeHVJQ0FnSUNBZ0lDQXVZWEpqVTJWbmJXVnVkSE1vWVhKalUyVm5iV1Z1ZEhNcFhHNGdJQ0FnSUNBZ0lDNXZabVp6WlhSTWFXNWxLRzFoY21kcGJpazdYRzVjYmlBZ0lDQWdJRzFoY21kcGJtVmtJRDBnZTF4dUlDQWdJQ0FnSUNCMGVYQmxPaUFuUm1WaGRIVnlaU2NzWEc0Z0lDQWdJQ0FnSUdkbGIyMWxkSEo1T2lCN1hHNGdJQ0FnSUNBZ0lDQWdkSGx3WlRvZ0oxQnZiSGxuYjI0bkxGeHVJQ0FnSUNBZ0lDQWdJR052YjNKa2FXNWhkR1Z6T2lCeVpYTmNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVHRjYmlBZ0lDQjlJR1ZzYzJVZ2FXWWdLR2RxTG1kbGIyMWxkSEo1TG5SNWNHVWdQVDA5SUNkUWIybHVkQ2NwSUh0Y2JpQWdJQ0FnSUhaaGNpQnlaWE1nUFNCdVpYY2dUMlptYzJWMEtITm9ZWEJsTG1kbGIyMWxkSEo1TG1OdmIzSmthVzVoZEdWektWeHVJQ0FnSUNBZ0lDQXVZWEpqVTJWbmJXVnVkSE1vWVhKalUyVm5iV1Z1ZEhNcFhHNGdJQ0FnSUNBZ0lDNXZabVp6WlhRb2JXRnlaMmx1S1R0Y2JseHVJQ0FnSUNBZ2JXRnlaMmx1WldRZ1BTQjdYRzRnSUNBZ0lDQWdJSFI1Y0dVNklDZEdaV0YwZFhKbEp5eGNiaUFnSUNBZ0lDQWdaMlZ2YldWMGNuazZJSHRjYmlBZ0lDQWdJQ0FnSUNCMGVYQmxPaUFuVUc5c2VXZHZiaWNzWEc0Z0lDQWdJQ0FnSUNBZ1kyOXZjbVJwYm1GMFpYTTZJSEpsYzF4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOU8xeHVJQ0FnSUgwZ1pXeHpaU0I3WEc0Z0lDQWdJQ0IyWVhJZ2NtVnpJRDBnYm1WM0lFOW1abk5sZENoemFHRndaUzVuWlc5dFpYUnllUzVqYjI5eVpHbHVZWFJsY3lrdWIyWm1jMlYwS0cxaGNtZHBiaWs3WEc0Z0lDQWdJQ0J0WVhKbmFXNWxaQ0E5SUh0Y2JpQWdJQ0FnSUNBZ2RIbHdaVG9nSjBabFlYUjFjbVVuTEZ4dUlDQWdJQ0FnSUNCblpXOXRaWFJ5ZVRvZ2UxeHVJQ0FnSUNBZ0lDQWdJSFI1Y0dVNklDZFFiMng1WjI5dUp5eGNiaUFnSUNBZ0lDQWdJQ0JqYjI5eVpHbHVZWFJsY3pvZ2NtVnpYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdZMjl1YzI5c1pTNXNiMmNvSjIxaGNtZHBibVZrSnl3Z2JXRnlaMmx1WldRcE8xeHVJQ0FnSUhKbGMzVnNkSE11WVdSa1JHRjBZU2h3Y205cVpXTjBLRzFoY21kcGJtVmtMQ0JtZFc1amRHbHZiaWh3ZENrZ2UxeHVJQ0FnSUNBZ2RtRnlJR3hzSUQwZ2JXRndMbTl3ZEdsdmJuTXVZM0p6TG5CdmFXNTBWRzlNWVhSTWJtY29UQzV3YjJsdWRDaHdkQzV6YkdsalpTZ3BLU3dnYldGd0xtZGxkRnB2YjIwb0tTazdYRzRnSUNBZ0lDQnlaWFIxY200Z1cyeHNMbXh1Wnl3Z2JHd3ViR0YwWFR0Y2JpQWdJQ0I5S1NrN1hHNGdJSDBwTzF4dWZWeHVYRzV5ZFc0Z0tESXdLVHRjYmlKZGZRPT0iLCJMLlBvbHlnb24ucHJvdG90eXBlLl9wcm9qZWN0TGF0bG5ncyA9IGZ1bmN0aW9uIChsYXRsbmdzLCByZXN1bHQsIHByb2plY3RlZEJvdW5kcywgaXNIb2xlKSB7XG4gIHZhciBmbGF0ID0gbGF0bG5nc1swXSBpbnN0YW5jZW9mIEwuTGF0TG5nLFxuICAgICAgbGVuID0gbGF0bG5ncy5sZW5ndGgsXG4gICAgICBpLCByaW5nLCBhcmVhO1xuXG4gIGlmIChmbGF0KSB7XG4gICAgYXJlYSA9IDA7XG4gICAgcmluZyA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgcmluZ1tpXSA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQobGF0bG5nc1tpXSk7XG4gICAgICBwcm9qZWN0ZWRCb3VuZHMuZXh0ZW5kKHJpbmdbaV0pO1xuXG4gICAgICBpZiAoaSkge1xuICAgICAgICBhcmVhICs9IHJpbmdbaSAtIDFdLnggKiByaW5nW2ldLnk7XG4gICAgICAgIGFyZWEgLT0gcmluZ1tpXS54ICogcmluZ1tpIC0gMV0ueTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXJlYSArPSByaW5nW2xlbiAtIDFdLnggKiByaW5nWzBdLnk7XG4gICAgYXJlYSAtPSByaW5nWzBdLnggKiByaW5nW2xlbiAtIDFdLnk7XG5cbiAgICBpZiAoKCFpc0hvbGUgJiYgYXJlYSA+IDApIHx8IChpc0hvbGUgJiYgYXJlYSA8IDApKSB7XG4gICAgICByaW5nLnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICByZXN1bHQucHVzaChyaW5nKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMuX3Byb2plY3RMYXRsbmdzKGxhdGxuZ3NbaV0sIHJlc3VsdCwgcHJvamVjdGVkQm91bmRzLCBpICE9PSAwKTtcbiAgICB9XG4gIH1cbn07XG5cblxuTC5Qb2x5Z29uLnByb3RvdHlwZS5fcHJvamVjdCA9IGZ1bmN0aW9uKCkge1xuICBMLlBvbHlsaW5lLnByb3RvdHlwZS5fcHJvamVjdC5jYWxsKHRoaXMpO1xuICBpZiAoKHRoaXMuX2xhdGxuZ3MubGVuZ3RoID4gMSkgJiZcbiAgICAhTC5Qb2x5bGluZS5fZmxhdCh0aGlzLl9sYXRsbmdzKSAmJlxuICAgICEodGhpcy5fbGF0bG5nc1swXVswXSBpbnN0YW5jZW9mIEwuTGF0TG5nKSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsbFJ1bGUgIT09ICdub256ZXJvJykge1xuICAgICAgdGhpcy5zZXRTdHlsZSh7XG4gICAgICAgIGZpbGxSdWxlOiAnbm9uemVybydcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IEwuQ29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3ByaWdodCcsXG4gICAgZGVmYXVsdE1hcmdpbjogMjBcbiAgfSxcblxuICBvbkFkZDogZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2NvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWJhcicpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kID0gJyNmZmZmZmYnO1xuICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5wYWRkaW5nID0gJzEwcHgnO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBbXG4gICAgICAnPGZvcm0+JyxcbiAgICAgICAgJzxkaXY+JyxcbiAgICAgICAgICAnPGxhYmVsPicsXG4gICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMDBcIiB2YWx1ZT1cIicsICB0aGlzLm9wdGlvbnMuZGVmYXVsdE1hcmdpbiwgJ1wiIG5hbWU9XCJtYXJnaW5cIj4nLFxuICAgICAgICAgICc8L2xhYmVsPicsXG4gICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAnPGRpdj4nLFxuICAgICAgICAgICc8bGFiZWw+JywgJzxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwib3BlcmF0aW9uXCIgdmFsdWU9XCIxXCIgY2hlY2tlZD4nLCAnIG1hcmdpbjwvbGFiZWw+JyxcbiAgICAgICAgICAnPGxhYmVsPicsICc8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm9wZXJhdGlvblwiIHZhbHVlPVwiLTFcIj4nLCAnIHBhZGRpbmc8L2xhYmVsPicsXG4gICAgICAgICc8L2Rpdj4nLCAnPGJyPicsXG4gICAgICAgICc8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiUnVuXCI+JywgJzxpbnB1dCBuYW1lPVwiY2xlYXJcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJDbGVhciBsYXllcnNcIj4nLFxuICAgICAgJzwvZm9ybT4nXS5qb2luKCcnKTtcblxuICAgIHZhciBmb3JtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICBMLkRvbUV2ZW50XG4gICAgICAub24oZm9ybSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgTC5Eb21FdmVudC5zdG9wKGV2dCk7XG4gICAgICAgIHZhciBtYXJnaW4gPSBwYXJzZUZsb2F0KGZvcm1bJ21hcmdpbiddLnZhbHVlKTtcbiAgICAgICAgdmFyIHJhZGlvcyA9IEFycmF5LnByb3RvdHlwZS5zbGljZS5jYWxsKFxuICAgICAgICAgIGZvcm0ucXVlcnlTZWxlY3RvckFsbCgnaW5wdXRbdHlwZT1yYWRpb10nKSk7XG4gICAgICAgIHZhciBrID0gMTtcbiAgICAgICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHJhZGlvcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICAgIGlmIChyYWRpb3NbaV0uY2hlY2tlZCkge1xuICAgICAgICAgICAgayAqPSBwYXJzZUludChyYWRpb3NbaV0udmFsdWUpO1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHRoaXMub3B0aW9ucy5jYWxsYmFjayhtYXJnaW4gKiBrKTtcbiAgICAgIH0sIHRoaXMpXG4gICAgICAub24oZm9ybVsnY2xlYXInXSwgJ2NsaWNrJywgZnVuY3Rpb24oZXZ0KSB7XG4gICAgICAgIEwuRG9tRXZlbnQuc3RvcChldnQpO1xuICAgICAgICB0aGlzLm9wdGlvbnMuY2xlYXIoKTtcbiAgICAgIH0sIHRoaXMpO1xuXG4gICAgTC5Eb21FdmVudFxuICAgICAgLmRpc2FibGVDbGlja1Byb3BhZ2F0aW9uKHRoaXMuX2NvbnRhaW5lcilcbiAgICAgIC5kaXNhYmxlU2Nyb2xsUHJvcGFnYXRpb24odGhpcy5fY29udGFpbmVyKTtcbiAgICByZXR1cm4gdGhpcy5fY29udGFpbmVyO1xuICB9XG5cbn0pOyIsIkwuRWRpdENvbnRyb2wgPSBMLkNvbnRyb2wuZXh0ZW5kKHtcblxuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcbiAgICBjYWxsYmFjazogbnVsbCxcbiAgICBraW5kOiAnJyxcbiAgICBodG1sOiAnJ1xuICB9LFxuXG4gIG9uQWRkOiBmdW5jdGlvbiAobWFwKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWNvbnRyb2wgbGVhZmxldC1iYXInKSxcbiAgICAgICAgbGluayA9IEwuRG9tVXRpbC5jcmVhdGUoJ2EnLCAnJywgY29udGFpbmVyKTtcblxuICAgIGxpbmsuaHJlZiA9ICcjJztcbiAgICBsaW5rLnRpdGxlID0gJ0NyZWF0ZSBhIG5ldyAnICsgdGhpcy5vcHRpb25zLmtpbmQ7XG4gICAgbGluay5pbm5lckhUTUwgPSB0aGlzLm9wdGlvbnMuaHRtbDtcbiAgICBMLkRvbUV2ZW50Lm9uKGxpbmssICdjbGljaycsIEwuRG9tRXZlbnQuc3RvcClcbiAgICAgICAgICAgICAgLm9uKGxpbmssICdjbGljaycsIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICB3aW5kb3cuTEFZRVIgPSB0aGlzLm9wdGlvbnMuY2FsbGJhY2suY2FsbChtYXAuZWRpdFRvb2xzKTtcbiAgICAgICAgICAgICAgfSwgdGhpcyk7XG5cbiAgICByZXR1cm4gY29udGFpbmVyO1xuICB9XG5cbn0pO1xuXG5MLk5ld1BvbHlnb25Db250cm9sID0gTC5FZGl0Q29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcbiAgICBraW5kOiAncG9seWdvbicsXG4gICAgaHRtbDogJ+KWsCdcbiAgfVxufSk7XG5cbkwuTmV3TGluZUNvbnRyb2wgPSBMLkVkaXRDb250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGtpbmQ6ICdwb2x5bGluZScsXG4gICAgaHRtbDogJy8nXG4gIH1cbn0pO1xuXG5MLk5ld1BvaW50Q29udHJvbCA9IEwuRWRpdENvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAga2luZDogJ3BvaW50JyxcbiAgICBodG1sOiAnJiM5Njc5OydcbiAgfVxufSk7XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSQlRyZWU6IHJlcXVpcmUoJy4vbGliL3JidHJlZScpLFxuICAgIEJpblRyZWU6IHJlcXVpcmUoJy4vbGliL2JpbnRyZWUnKVxufTtcbiIsIlxudmFyIFRyZWVCYXNlID0gcmVxdWlyZSgnLi90cmVlYmFzZScpO1xuXG5mdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMubGVmdCA9IG51bGw7XG4gICAgdGhpcy5yaWdodCA9IG51bGw7XG59XG5cbk5vZGUucHJvdG90eXBlLmdldF9jaGlsZCA9IGZ1bmN0aW9uKGRpcikge1xuICAgIHJldHVybiBkaXIgPyB0aGlzLnJpZ2h0IDogdGhpcy5sZWZ0O1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyLCB2YWwpIHtcbiAgICBpZihkaXIpIHtcbiAgICAgICAgdGhpcy5yaWdodCA9IHZhbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMubGVmdCA9IHZhbDtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBCaW5UcmVlKGNvbXBhcmF0b3IpIHtcbiAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgICB0aGlzLnNpemUgPSAwO1xufVxuXG5CaW5UcmVlLnByb3RvdHlwZSA9IG5ldyBUcmVlQmFzZSgpO1xuXG4vLyByZXR1cm5zIHRydWUgaWYgaW5zZXJ0ZWQsIGZhbHNlIGlmIGR1cGxpY2F0ZVxuQmluVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgLy8gZW1wdHkgdHJlZVxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgZGlyID0gMDtcblxuICAgIC8vIHNldHVwXG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG5cbiAgICAvLyBzZWFyY2ggZG93blxuICAgIHdoaWxlKHRydWUpIHtcbiAgICAgICAgaWYobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gaW5zZXJ0IG5ldyBub2RlIGF0IHRoZSBib3R0b21cbiAgICAgICAgICAgIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgICAgIHAuc2V0X2NoaWxkKGRpciwgbm9kZSk7XG4gICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3AgaWYgZm91bmRcbiAgICAgICAgaWYodGhpcy5fY29tcGFyYXRvcihub2RlLmRhdGEsIGRhdGEpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBkaXIgPSB0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSkgPCAwO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBoZWxwZXJzXG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcbiAgICB9XG59O1xuXG4vLyByZXR1cm5zIHRydWUgaWYgcmVtb3ZlZCwgZmFsc2UgaWYgbm90IGZvdW5kXG5CaW5UcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGhlYWQgPSBuZXcgTm9kZSh1bmRlZmluZWQpOyAvLyBmYWtlIHRyZWUgcm9vdFxuICAgIHZhciBub2RlID0gaGVhZDtcbiAgICBub2RlLnJpZ2h0ID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgcCA9IG51bGw7IC8vIHBhcmVudFxuICAgIHZhciBmb3VuZCA9IG51bGw7IC8vIGZvdW5kIGl0ZW1cbiAgICB2YXIgZGlyID0gMTtcblxuICAgIHdoaWxlKG5vZGUuZ2V0X2NoaWxkKGRpcikgIT09IG51bGwpIHtcbiAgICAgICAgcCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCBub2RlLmRhdGEpO1xuICAgICAgICBkaXIgPSBjbXAgPiAwO1xuXG4gICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgZm91bmQgPSBub2RlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYoZm91bmQgIT09IG51bGwpIHtcbiAgICAgICAgZm91bmQuZGF0YSA9IG5vZGUuZGF0YTtcbiAgICAgICAgcC5zZXRfY2hpbGQocC5yaWdodCA9PT0gbm9kZSwgbm9kZS5nZXRfY2hpbGQobm9kZS5sZWZ0ID09PSBudWxsKSk7XG5cbiAgICAgICAgdGhpcy5fcm9vdCA9IGhlYWQucmlnaHQ7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJpblRyZWU7XG5cbiIsIlxudmFyIFRyZWVCYXNlID0gcmVxdWlyZSgnLi90cmVlYmFzZScpO1xuXG5mdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMubGVmdCA9IG51bGw7XG4gICAgdGhpcy5yaWdodCA9IG51bGw7XG4gICAgdGhpcy5yZWQgPSB0cnVlO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIpIHtcbiAgICByZXR1cm4gZGlyID8gdGhpcy5yaWdodCA6IHRoaXMubGVmdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldF9jaGlsZCA9IGZ1bmN0aW9uKGRpciwgdmFsKSB7XG4gICAgaWYoZGlyKSB7XG4gICAgICAgIHRoaXMucmlnaHQgPSB2YWw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmxlZnQgPSB2YWw7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gUkJUcmVlKGNvbXBhcmF0b3IpIHtcbiAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgICB0aGlzLnNpemUgPSAwO1xufVxuXG5SQlRyZWUucHJvdG90eXBlID0gbmV3IFRyZWVCYXNlKCk7XG5cbi8vIHJldHVybnMgdHJ1ZSBpZiBpbnNlcnRlZCwgZmFsc2UgaWYgZHVwbGljYXRlXG5SQlRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmV0ID0gZmFsc2U7XG5cbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGVtcHR5IHRyZWVcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcblxuICAgICAgICB2YXIgZGlyID0gMDtcbiAgICAgICAgdmFyIGxhc3QgPSAwO1xuXG4gICAgICAgIC8vIHNldHVwXG4gICAgICAgIHZhciBncCA9IG51bGw7IC8vIGdyYW5kcGFyZW50XG4gICAgICAgIHZhciBnZ3AgPSBoZWFkOyAvLyBncmFuZC1ncmFuZC1wYXJlbnRcbiAgICAgICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICAgICAgICBnZ3AucmlnaHQgPSB0aGlzLl9yb290O1xuXG4gICAgICAgIC8vIHNlYXJjaCBkb3duXG4gICAgICAgIHdoaWxlKHRydWUpIHtcbiAgICAgICAgICAgIGlmKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBpbnNlcnQgbmV3IG5vZGUgYXQgdGhlIGJvdHRvbVxuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgICAgICAgICBwLnNldF9jaGlsZChkaXIsIG5vZGUpO1xuICAgICAgICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGlzX3JlZChub2RlLmxlZnQpICYmIGlzX3JlZChub2RlLnJpZ2h0KSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbG9yIGZsaXBcbiAgICAgICAgICAgICAgICBub2RlLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbm9kZS5sZWZ0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG5vZGUucmlnaHQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpeCByZWQgdmlvbGF0aW9uXG4gICAgICAgICAgICBpZihpc19yZWQobm9kZSkgJiYgaXNfcmVkKHApKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpcjIgPSBnZ3AucmlnaHQgPT09IGdwO1xuXG4gICAgICAgICAgICAgICAgaWYobm9kZSA9PT0gcC5nZXRfY2hpbGQobGFzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2dwLnNldF9jaGlsZChkaXIyLCBzaW5nbGVfcm90YXRlKGdwLCAhbGFzdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2dwLnNldF9jaGlsZChkaXIyLCBkb3VibGVfcm90YXRlKGdwLCAhbGFzdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3Iobm9kZS5kYXRhLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gc3RvcCBpZiBmb3VuZFxuICAgICAgICAgICAgaWYoY21wID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhc3QgPSBkaXI7XG4gICAgICAgICAgICBkaXIgPSBjbXAgPCAwO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICAgICAgaWYoZ3AgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBnZ3AgPSBncDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdwID0gcDtcbiAgICAgICAgICAgIHAgPSBub2RlO1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgcm9vdFxuICAgICAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcbiAgICB9XG5cbiAgICAvLyBtYWtlIHJvb3QgYmxhY2tcbiAgICB0aGlzLl9yb290LnJlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbi8vIHJldHVybnMgdHJ1ZSBpZiByZW1vdmVkLCBmYWxzZSBpZiBub3QgZm91bmRcblJCVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcbiAgICB2YXIgbm9kZSA9IGhlYWQ7XG4gICAgbm9kZS5yaWdodCA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgZ3AgPSBudWxsOyAvLyBncmFuZCBwYXJlbnRcbiAgICB2YXIgZm91bmQgPSBudWxsOyAvLyBmb3VuZCBpdGVtXG4gICAgdmFyIGRpciA9IDE7XG5cbiAgICB3aGlsZShub2RlLmdldF9jaGlsZChkaXIpICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBsYXN0ID0gZGlyO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBoZWxwZXJzXG4gICAgICAgIGdwID0gcDtcbiAgICAgICAgcCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuXG4gICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIG5vZGUuZGF0YSk7XG5cbiAgICAgICAgZGlyID0gY21wID4gMDtcblxuICAgICAgICAvLyBzYXZlIGZvdW5kIG5vZGVcbiAgICAgICAgaWYoY21wID09PSAwKSB7XG4gICAgICAgICAgICBmb3VuZCA9IG5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwdXNoIHRoZSByZWQgbm9kZSBkb3duXG4gICAgICAgIGlmKCFpc19yZWQobm9kZSkgJiYgIWlzX3JlZChub2RlLmdldF9jaGlsZChkaXIpKSkge1xuICAgICAgICAgICAgaWYoaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKCFkaXIpKSkge1xuICAgICAgICAgICAgICAgIHZhciBzciA9IHNpbmdsZV9yb3RhdGUobm9kZSwgZGlyKTtcbiAgICAgICAgICAgICAgICBwLnNldF9jaGlsZChsYXN0LCBzcik7XG4gICAgICAgICAgICAgICAgcCA9IHNyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZighaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKCFkaXIpKSkge1xuICAgICAgICAgICAgICAgIHZhciBzaWJsaW5nID0gcC5nZXRfY2hpbGQoIWxhc3QpO1xuICAgICAgICAgICAgICAgIGlmKHNpYmxpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpICYmICFpc19yZWQoc2libGluZy5nZXRfY2hpbGQobGFzdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2xvciBmbGlwXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2libGluZy5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpcjIgPSBncC5yaWdodCA9PT0gcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKGxhc3QpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwLnNldF9jaGlsZChkaXIyLCBkb3VibGVfcm90YXRlKHAsIGxhc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKCFsYXN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncC5zZXRfY2hpbGQoZGlyMiwgc2luZ2xlX3JvdGF0ZShwLCBsYXN0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSBjb3JyZWN0IGNvbG9yaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3BjID0gZ3AuZ2V0X2NoaWxkKGRpcjIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBncGMubGVmdC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5yaWdodC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlcGxhY2UgYW5kIHJlbW92ZSBpZiBmb3VuZFxuICAgIGlmKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgIGZvdW5kLmRhdGEgPSBub2RlLmRhdGE7XG4gICAgICAgIHAuc2V0X2NoaWxkKHAucmlnaHQgPT09IG5vZGUsIG5vZGUuZ2V0X2NoaWxkKG5vZGUubGVmdCA9PT0gbnVsbCkpO1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgcm9vdCBhbmQgbWFrZSBpdCBibGFja1xuICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xuICAgIGlmKHRoaXMuX3Jvb3QgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcm9vdC5yZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmQgIT09IG51bGw7XG59O1xuXG5mdW5jdGlvbiBpc19yZWQobm9kZSkge1xuICAgIHJldHVybiBub2RlICE9PSBudWxsICYmIG5vZGUucmVkO1xufVxuXG5mdW5jdGlvbiBzaW5nbGVfcm90YXRlKHJvb3QsIGRpcikge1xuICAgIHZhciBzYXZlID0gcm9vdC5nZXRfY2hpbGQoIWRpcik7XG5cbiAgICByb290LnNldF9jaGlsZCghZGlyLCBzYXZlLmdldF9jaGlsZChkaXIpKTtcbiAgICBzYXZlLnNldF9jaGlsZChkaXIsIHJvb3QpO1xuXG4gICAgcm9vdC5yZWQgPSB0cnVlO1xuICAgIHNhdmUucmVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gc2F2ZTtcbn1cblxuZnVuY3Rpb24gZG91YmxlX3JvdGF0ZShyb290LCBkaXIpIHtcbiAgICByb290LnNldF9jaGlsZCghZGlyLCBzaW5nbGVfcm90YXRlKHJvb3QuZ2V0X2NoaWxkKCFkaXIpLCAhZGlyKSk7XG4gICAgcmV0dXJuIHNpbmdsZV9yb3RhdGUocm9vdCwgZGlyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSQlRyZWU7XG4iLCJcbmZ1bmN0aW9uIFRyZWVCYXNlKCkge31cblxuLy8gcmVtb3ZlcyBhbGwgbm9kZXMgZnJvbSB0aGUgdHJlZVxuVHJlZUJhc2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5zaXplID0gMDtcbn07XG5cbi8vIHJldHVybnMgbm9kZSBkYXRhIGlmIGZvdW5kLCBudWxsIG90aGVyd2lzZVxuVHJlZUJhc2UucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG5cbiAgICB3aGlsZShyZXMgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIHJlcy5kYXRhKTtcbiAgICAgICAgaWYoYyA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcmVzLmdldF9jaGlsZChjID4gMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIHJldHVybnMgaXRlcmF0b3IgdG8gbm9kZSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2VcblRyZWVCYXNlLnByb3RvdHlwZS5maW5kSXRlciA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgaXRlciA9IHRoaXMuaXRlcmF0b3IoKTtcblxuICAgIHdoaWxlKHJlcyAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgYyA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgcmVzLmRhdGEpO1xuICAgICAgICBpZihjID09PSAwKSB7XG4gICAgICAgICAgICBpdGVyLl9jdXJzb3IgPSByZXM7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5wdXNoKHJlcyk7XG4gICAgICAgICAgICByZXMgPSByZXMuZ2V0X2NoaWxkKGMgPiAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufTtcblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciB0byB0aGUgdHJlZSBub2RlIGF0IG9yIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBpdGVtXG5UcmVlQmFzZS5wcm90b3R5cGUubG93ZXJCb3VuZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY3VyID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgaXRlciA9IHRoaXMuaXRlcmF0b3IoKTtcbiAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgIHdoaWxlKGN1ciAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgYyA9IGNtcChpdGVtLCBjdXIuZGF0YSk7XG4gICAgICAgIGlmKGMgPT09IDApIHtcbiAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IGN1cjtcbiAgICAgICAgICAgIHJldHVybiBpdGVyO1xuICAgICAgICB9XG4gICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5wdXNoKGN1cik7XG4gICAgICAgIGN1ciA9IGN1ci5nZXRfY2hpbGQoYyA+IDApO1xuICAgIH1cblxuICAgIGZvcih2YXIgaT1pdGVyLl9hbmNlc3RvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgY3VyID0gaXRlci5fYW5jZXN0b3JzW2ldO1xuICAgICAgICBpZihjbXAoaXRlbSwgY3VyLmRhdGEpIDwgMCkge1xuICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gY3VyO1xuICAgICAgICAgICAgaXRlci5fYW5jZXN0b3JzLmxlbmd0aCA9IGk7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggPSAwO1xuICAgIHJldHVybiBpdGVyO1xufTtcblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciB0byB0aGUgdHJlZSBub2RlIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBpdGVtXG5UcmVlQmFzZS5wcm90b3R5cGUudXBwZXJCb3VuZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgaXRlciA9IHRoaXMubG93ZXJCb3VuZChpdGVtKTtcbiAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgIHdoaWxlKGl0ZXIuZGF0YSgpICE9PSBudWxsICYmIGNtcChpdGVyLmRhdGEoKSwgaXRlbSkgPT09IDApIHtcbiAgICAgICAgaXRlci5uZXh0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXI7XG59O1xuXG4vLyByZXR1cm5zIG51bGwgaWYgdHJlZSBpcyBlbXB0eVxuVHJlZUJhc2UucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuICAgIGlmKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB3aGlsZShyZXMubGVmdCAhPT0gbnVsbCkge1xuICAgICAgICByZXMgPSByZXMubGVmdDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLmRhdGE7XG59O1xuXG4vLyByZXR1cm5zIG51bGwgaWYgdHJlZSBpcyBlbXB0eVxuVHJlZUJhc2UucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuICAgIGlmKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB3aGlsZShyZXMucmlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgcmVzID0gcmVzLnJpZ2h0O1xuICAgIH1cblxuICAgIHJldHVybiByZXMuZGF0YTtcbn07XG5cbi8vIHJldHVybnMgYSBudWxsIGl0ZXJhdG9yXG4vLyBjYWxsIG5leHQoKSBvciBwcmV2KCkgdG8gcG9pbnQgdG8gYW4gZWxlbWVudFxuVHJlZUJhc2UucHJvdG90eXBlLml0ZXJhdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcih0aGlzKTtcbn07XG5cbi8vIGNhbGxzIGNiIG9uIGVhY2ggbm9kZSdzIGRhdGEsIGluIG9yZGVyXG5UcmVlQmFzZS5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGl0PXRoaXMuaXRlcmF0b3IoKSwgZGF0YTtcbiAgICB3aGlsZSgoZGF0YSA9IGl0Lm5leHQoKSkgIT09IG51bGwpIHtcbiAgICAgICAgY2IoZGF0YSk7XG4gICAgfVxufTtcblxuLy8gY2FsbHMgY2Igb24gZWFjaCBub2RlJ3MgZGF0YSwgaW4gcmV2ZXJzZSBvcmRlclxuVHJlZUJhc2UucHJvdG90eXBlLnJlYWNoID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgaXQ9dGhpcy5pdGVyYXRvcigpLCBkYXRhO1xuICAgIHdoaWxlKChkYXRhID0gaXQucHJldigpKSAhPT0gbnVsbCkge1xuICAgICAgICBjYihkYXRhKTtcbiAgICB9XG59O1xuXG5cbmZ1bmN0aW9uIEl0ZXJhdG9yKHRyZWUpIHtcbiAgICB0aGlzLl90cmVlID0gdHJlZTtcbiAgICB0aGlzLl9hbmNlc3RvcnMgPSBbXTtcbiAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xufVxuXG5JdGVyYXRvci5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XG59O1xuXG4vLyBpZiBudWxsLWl0ZXJhdG9yLCByZXR1cm5zIGZpcnN0IG5vZGVcbi8vIG90aGVyd2lzZSwgcmV0dXJucyBuZXh0IG5vZGVcbkl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5fY3Vyc29yID09PSBudWxsKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5fdHJlZS5fcm9vdDtcbiAgICAgICAgaWYocm9vdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fbWluTm9kZShyb290KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yLnJpZ2h0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBubyBncmVhdGVyIG5vZGUgaW4gc3VidHJlZSwgZ28gdXAgdG8gcGFyZW50XG4gICAgICAgICAgICAvLyBpZiBjb21pbmcgZnJvbSBhIHJpZ2h0IGNoaWxkLCBjb250aW51ZSB1cCB0aGUgc3RhY2tcbiAgICAgICAgICAgIHZhciBzYXZlO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHNhdmUgPSB0aGlzLl9jdXJzb3I7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSB0aGlzLl9hbmNlc3RvcnMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlKHRoaXMuX2N1cnNvci5yaWdodCA9PT0gc2F2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIG5leHQgbm9kZSBmcm9tIHRoZSBzdWJ0cmVlXG4gICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaCh0aGlzLl9jdXJzb3IpO1xuICAgICAgICAgICAgdGhpcy5fbWluTm9kZSh0aGlzLl9jdXJzb3IucmlnaHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XG59O1xuXG4vLyBpZiBudWxsLWl0ZXJhdG9yLCByZXR1cm5zIGxhc3Qgbm9kZVxuLy8gb3RoZXJ3aXNlLCByZXR1cm5zIHByZXZpb3VzIG5vZGVcbkl0ZXJhdG9yLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5fY3Vyc29yID09PSBudWxsKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5fdHJlZS5fcm9vdDtcbiAgICAgICAgaWYocm9vdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fbWF4Tm9kZShyb290KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yLmxlZnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzYXZlO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHNhdmUgPSB0aGlzLl9jdXJzb3I7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSB0aGlzLl9hbmNlc3RvcnMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlKHRoaXMuX2N1cnNvci5sZWZ0ID09PSBzYXZlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHRoaXMuX2N1cnNvcik7XG4gICAgICAgICAgICB0aGlzLl9tYXhOb2RlKHRoaXMuX2N1cnNvci5sZWZ0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuSXRlcmF0b3IucHJvdG90eXBlLl9taW5Ob2RlID0gZnVuY3Rpb24oc3RhcnQpIHtcbiAgICB3aGlsZShzdGFydC5sZWZ0ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHN0YXJ0KTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5sZWZ0O1xuICAgIH1cbiAgICB0aGlzLl9jdXJzb3IgPSBzdGFydDtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5fbWF4Tm9kZSA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgd2hpbGUoc3RhcnQucmlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2goc3RhcnQpO1xuICAgICAgICBzdGFydCA9IHN0YXJ0LnJpZ2h0O1xuICAgIH1cbiAgICB0aGlzLl9jdXJzb3IgPSBzdGFydDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZUJhc2U7XG5cbiIsIlxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBkYXRhIEdlb0pTT05cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgaWYgKGRhdGEudHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJykge1xuICAgIC8vIFRoYXQncyBhIGh1Z2UgaGFjayB0byBnZXQgdGhpbmdzIHdvcmtpbmcgd2l0aCBib3RoIEFyY0dJUyBzZXJ2ZXJcbiAgICAvLyBhbmQgR2VvU2VydmVyLiBHZW9zZXJ2ZXIgcHJvdmlkZXMgY3JzIHJlZmVyZW5jZSBpbiBHZW9KU09OLCBBcmNHSVMg4oCUXG4gICAgLy8gZG9lc24ndC5cbiAgICAvL2lmIChkYXRhLmNycykgZGVsZXRlIGRhdGEuY3JzO1xuICAgIGZvciAodmFyIGkgPSBkYXRhLmZlYXR1cmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBkYXRhLmZlYXR1cmVzW2ldID0gcHJvamVjdEZlYXR1cmUoZGF0YS5mZWF0dXJlc1tpXSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRhdGEgPSBwcm9qZWN0RmVhdHVyZShkYXRhLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnByb2plY3RGZWF0dXJlICA9IHByb2plY3RGZWF0dXJlO1xubW9kdWxlLmV4cG9ydHMucHJvamVjdEdlb21ldHJ5ID0gcHJvamVjdEdlb21ldHJ5O1xuXG5cbi8qKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIHByb2plY3RGZWF0dXJlKGZlYXR1cmUsIHByb2plY3QsIGNvbnRleHQpIHtcbiAgaWYgKGZlYXR1cmUudHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZmVhdHVyZS5nZW9tZXRyaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBmZWF0dXJlLmdlb21ldHJpZXNbaV0gPVxuICAgICAgICBwcm9qZWN0R2VvbWV0cnkoZmVhdHVyZS5nZW9tZXRyaWVzW2ldLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZmVhdHVyZS5nZW9tZXRyeSA9IHByb2plY3RHZW9tZXRyeShmZWF0dXJlLmdlb21ldHJ5LCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgfVxuICByZXR1cm4gZmVhdHVyZTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gICAgIGRhdGEgR2VvSlNPTlxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBwcm9qZWN0R2VvbWV0cnkoZ2VvbWV0cnksIHByb2plY3QsIGNvbnRleHQpIHtcbiAgdmFyIGNvb3JkcyA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICBzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcbiAgICBjYXNlICdQb2ludCc6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3QuY2FsbChjb250ZXh0LCBjb29yZHMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29vcmRzW2ldID0gcHJvamVjdC5jYWxsKGNvbnRleHQsIGNvb3Jkc1tpXSk7XG4gICAgICB9XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IGNvb3JkcztcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnUG9seWdvbic6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3RDb29yZHMoY29vcmRzLCAxLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdENvb3Jkcyhjb29yZHMsIDEsIHByb2plY3QsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0Q29vcmRzKGNvb3JkcywgMiwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZ2VvbWV0cnk7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHsqfSAgICAgICAgIGNvb3JkcyBDb29yZHMgYXJyYXlzXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIGxldmVsc0RlZXBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7Kn1cbiAqL1xuZnVuY3Rpb24gcHJvamVjdENvb3Jkcyhjb29yZHMsIGxldmVsc0RlZXAsIHByb2plY3QsIGNvbnRleHQpIHtcbiAgdmFyIGNvb3JkLCBpLCBsZW47XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBjb29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb29yZCA9IGxldmVsc0RlZXAgP1xuICAgICAgcHJvamVjdENvb3Jkcyhjb29yZHNbaV0sIGxldmVsc0RlZXAgLSAxLCBwcm9qZWN0LCBjb250ZXh0KSA6XG4gICAgICBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzW2ldKTtcblxuICAgIHJlc3VsdC5wdXNoKGNvb3JkKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2luZGV4Jyk7XG4iLCJ2YXIgc2lnbmVkQXJlYSA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gZTJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzd2VlcEV2ZW50c0NvbXAoZTEsIGUyKSB7XG4gIHZhciBwMSA9IGUxLnBvaW50O1xuICB2YXIgcDIgPSBlMi5wb2ludDtcblxuICAvLyBEaWZmZXJlbnQgeC1jb29yZGluYXRlXG4gIGlmIChwMVswXSA+IHAyWzBdKSByZXR1cm4gMTtcbiAgaWYgKHAxWzBdIDwgcDJbMF0pIHJldHVybiAtMTtcblxuICAvLyBEaWZmZXJlbnQgcG9pbnRzLCBidXQgc2FtZSB4LWNvb3JkaW5hdGVcbiAgLy8gRXZlbnQgd2l0aCBsb3dlciB5LWNvb3JkaW5hdGUgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gIGlmIChwMVsxXSAhPT0gcDJbMV0pIHJldHVybiBwMVsxXSA+IHAyWzFdID8gMSA6IC0xO1xuXG4gIHJldHVybiBzcGVjaWFsQ2FzZXMoZTEsIGUyLCBwMSwgcDIpO1xufTtcblxuXG5mdW5jdGlvbiBzcGVjaWFsQ2FzZXMoZTEsIGUyLCBwMSwgcDIpIHtcbiAgLy8gU2FtZSBjb29yZGluYXRlcywgYnV0IG9uZSBpcyBhIGxlZnQgZW5kcG9pbnQgYW5kIHRoZSBvdGhlciBpc1xuICAvLyBhIHJpZ2h0IGVuZHBvaW50LiBUaGUgcmlnaHQgZW5kcG9pbnQgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gIGlmIChlMS5sZWZ0ICE9PSBlMi5sZWZ0KVxuICAgIHJldHVybiBlMS5sZWZ0ID8gMSA6IC0xO1xuXG4gIC8vIFNhbWUgY29vcmRpbmF0ZXMsIGJvdGggZXZlbnRzXG4gIC8vIGFyZSBsZWZ0IGVuZHBvaW50cyBvciByaWdodCBlbmRwb2ludHMuXG4gIC8vIG5vdCBjb2xsaW5lYXJcbiAgaWYgKHNpZ25lZEFyZWEgKHAxLCBlMS5vdGhlckV2ZW50LnBvaW50LCBlMi5vdGhlckV2ZW50LnBvaW50KSAhPT0gMCkge1xuICAgIC8vIHRoZSBldmVudCBhc3NvY2lhdGUgdG8gdGhlIGJvdHRvbSBzZWdtZW50IGlzIHByb2Nlc3NlZCBmaXJzdFxuICAgIHJldHVybiAoIWUxLmlzQmVsb3coZTIub3RoZXJFdmVudC5wb2ludCkpID8gMSA6IC0xO1xuICB9XG5cbiAgaWYgKGUxLmlzU3ViamVjdCA9PT0gZTIuaXNTdWJqZWN0KSB7XG4gICAgaWYoZTEuY29udG91cklkID09PSBlMi5jb250b3VySWQpe1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlMS5jb250b3VySWQgPiBlMi5jb250b3VySWQgPyAxIDogLTE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICghZTEuaXNTdWJqZWN0ICYmIGUyLmlzU3ViamVjdCkgPyAxIDogLTE7XG4gIC8vcmV0dXJuIGUxLmlzU3ViamVjdCA/IC0xIDogMTtcbn1cbiIsInZhciBzaWduZWRBcmVhICAgID0gcmVxdWlyZSgnLi9zaWduZWRfYXJlYScpO1xudmFyIGNvbXBhcmVFdmVudHMgPSByZXF1aXJlKCcuL2NvbXBhcmVfZXZlbnRzJyk7XG52YXIgZXF1YWxzICAgICAgICA9IHJlcXVpcmUoJy4vZXF1YWxzJyk7XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBsZTFcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGxlMlxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBhcmVTZWdtZW50cyhsZTEsIGxlMikge1xuICBpZiAobGUxID09PSBsZTIpIHJldHVybiAwO1xuXG4gIC8vIFNlZ21lbnRzIGFyZSBub3QgY29sbGluZWFyXG4gIGlmIChzaWduZWRBcmVhKGxlMS5wb2ludCwgbGUxLm90aGVyRXZlbnQucG9pbnQsIGxlMi5wb2ludCkgIT09IDAgfHxcbiAgICBzaWduZWRBcmVhKGxlMS5wb2ludCwgbGUxLm90aGVyRXZlbnQucG9pbnQsIGxlMi5vdGhlckV2ZW50LnBvaW50KSAhPT0gMCkge1xuXG4gICAgLy8gSWYgdGhleSBzaGFyZSB0aGVpciBsZWZ0IGVuZHBvaW50IHVzZSB0aGUgcmlnaHQgZW5kcG9pbnQgdG8gc29ydFxuICAgIGlmIChlcXVhbHMobGUxLnBvaW50LCBsZTIucG9pbnQpKSByZXR1cm4gbGUxLmlzQmVsb3cobGUyLm90aGVyRXZlbnQucG9pbnQpID8gLTEgOiAxO1xuXG4gICAgLy8gRGlmZmVyZW50IGxlZnQgZW5kcG9pbnQ6IHVzZSB0aGUgbGVmdCBlbmRwb2ludCB0byBzb3J0XG4gICAgaWYgKGxlMS5wb2ludFswXSA9PT0gbGUyLnBvaW50WzBdKSByZXR1cm4gbGUxLnBvaW50WzFdIDwgbGUyLnBvaW50WzFdID8gLTEgOiAxO1xuXG4gICAgLy8gaGFzIHRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMSBiZWVuIGluc2VydGVkXG4gICAgLy8gaW50byBTIGFmdGVyIHRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMiA/XG4gICAgaWYgKGNvbXBhcmVFdmVudHMobGUxLCBsZTIpID09PSAxKSByZXR1cm4gbGUyLmlzQWJvdmUobGUxLnBvaW50KSA/IC0xIDogMTtcblxuICAgIC8vIFRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMiBoYXMgYmVlbiBpbnNlcnRlZFxuICAgIC8vIGludG8gUyBhZnRlciB0aGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTFcbiAgICByZXR1cm4gbGUxLmlzQmVsb3cobGUyLnBvaW50KSA/IC0xIDogMTtcbiAgfVxuXG4gIGlmIChsZTEuaXNTdWJqZWN0ID09PSBsZTIuaXNTdWJqZWN0KXtcbiAgICBpZiAoZXF1YWxzKGxlMS5wb2ludCwgbGUyLnBvaW50KSkge1xuICAgICAgaWYgKGxlMS5jb250b3VySWQgPT09IGxlMi5jb250b3VySWQpe1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsZTEuY29udG91cklkID4gbGUyLmNvbnRvdXJJZCA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VnbWVudHMgYXJlIGNvbGxpbmVhclxuICAgICAgaWYgKGxlMS5pc1N1YmplY3QgIT09IGxlMi5pc1N1YmplY3QpIHJldHVybiAobGUxLmlzU3ViamVjdCAmJiAhbGUyLmlzU3ViamVjdCkgPyAxIDogLTE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbXBhcmVFdmVudHMobGUxLCBsZTIpID09PSAxID8gMSA6IC0xO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcbiAgTk9STUFMOiAgICAgICAgICAgICAgIDAsIFxuICBOT05fQ09OVFJJQlVUSU5HOiAgICAgMSwgXG4gIFNBTUVfVFJBTlNJVElPTjogICAgICAyLCBcbiAgRElGRkVSRU5UX1RSQU5TSVRJT046IDNcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVxdWFscyhwMSwgcDIpIHtcbiAgcmV0dXJuIHAxWzBdID09PSBwMlswXSAmJiBwMVsxXSA9PT0gcDJbMV07XG59OyIsInZhciBJTlRFUlNFQ1RJT04gICAgPSAwO1xudmFyIFVOSU9OICAgICAgICAgICA9IDE7XG52YXIgRElGRkVSRU5DRSAgICAgID0gMjtcbnZhciBYT1IgICAgICAgICAgICAgPSAzO1xuXG52YXIgRU1QVFkgICAgICAgICAgID0gW107XG5cbnZhciBlZGdlVHlwZSAgICAgICAgPSByZXF1aXJlKCcuL2VkZ2VfdHlwZScpO1xuXG52YXIgUXVldWUgICAgICAgICAgID0gcmVxdWlyZSgndGlueXF1ZXVlJyk7XG52YXIgVHJlZSAgICAgICAgICAgID0gcmVxdWlyZSgnYmludHJlZXMnKS5SQlRyZWU7XG52YXIgU3dlZXBFdmVudCAgICAgID0gcmVxdWlyZSgnLi9zd2VlcF9ldmVudCcpO1xuXG52YXIgY29tcGFyZUV2ZW50cyAgID0gcmVxdWlyZSgnLi9jb21wYXJlX2V2ZW50cycpO1xudmFyIGNvbXBhcmVTZWdtZW50cyA9IHJlcXVpcmUoJy4vY29tcGFyZV9zZWdtZW50cycpO1xudmFyIGludGVyc2VjdGlvbiAgICA9IHJlcXVpcmUoJy4vc2VnbWVudF9pbnRlcnNlY3Rpb24nKTtcbnZhciBlcXVhbHMgICAgICAgICAgPSByZXF1aXJlKCcuL2VxdWFscycpO1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQHBhcmFtICB7PEFycmF5LjxOdW1iZXI+fSBzMVxuICogQHBhcmFtICB7PEFycmF5LjxOdW1iZXI+fSBzMlxuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgICBpc1N1YmplY3RcbiAqIEBwYXJhbSAge1F1ZXVlfSAgICAgICAgICAgZXZlbnRRdWV1ZVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBiYm94XG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NTZWdtZW50KHMxLCBzMiwgaXNTdWJqZWN0LCBkZXB0aCwgZXZlbnRRdWV1ZSwgYmJveCkge1xuICAvLyBQb3NzaWJsZSBkZWdlbmVyYXRlIGNvbmRpdGlvbi5cbiAgLy8gaWYgKGVxdWFscyhzMSwgczIpKSByZXR1cm47XG5cbiAgdmFyIGUxID0gbmV3IFN3ZWVwRXZlbnQoczEsIGZhbHNlLCB1bmRlZmluZWQsIGlzU3ViamVjdCk7XG4gIHZhciBlMiA9IG5ldyBTd2VlcEV2ZW50KHMyLCBmYWxzZSwgZTEsICAgICAgICBpc1N1YmplY3QpO1xuICBlMS5vdGhlckV2ZW50ID0gZTI7XG5cbiAgZTEuY29udG91cklkID0gZTIuY29udG91cklkID0gZGVwdGg7XG5cbiAgaWYgKGNvbXBhcmVFdmVudHMoZTEsIGUyKSA+IDApIHtcbiAgICBlMi5sZWZ0ID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBlMS5sZWZ0ID0gdHJ1ZTtcbiAgfVxuXG4gIGJib3hbMF0gPSBtaW4oYmJveFswXSwgczFbMF0pO1xuICBiYm94WzFdID0gbWluKGJib3hbMV0sIHMxWzFdKTtcbiAgYmJveFsyXSA9IG1heChiYm94WzJdLCBzMVswXSk7XG4gIGJib3hbM10gPSBtYXgoYmJveFszXSwgczFbMV0pO1xuXG4gIC8vIFB1c2hpbmcgaXQgc28gdGhlIHF1ZXVlIGlzIHNvcnRlZCBmcm9tIGxlZnQgdG8gcmlnaHQsXG4gIC8vIHdpdGggb2JqZWN0IG9uIHRoZSBsZWZ0IGhhdmluZyB0aGUgaGlnaGVzdCBwcmlvcml0eS5cbiAgZXZlbnRRdWV1ZS5wdXNoKGUxKTtcbiAgZXZlbnRRdWV1ZS5wdXNoKGUyKTtcbn1cblxudmFyIGNvbnRvdXJJZCA9IDA7XG5cbmZ1bmN0aW9uIHByb2Nlc3NQb2x5Z29uKHBvbHlnb24sIGlzU3ViamVjdCwgZGVwdGgsIHF1ZXVlLCBiYm94KSB7XG4gIHZhciBpLCBsZW47XG4gIGlmICh0eXBlb2YgcG9seWdvblswXVswXSA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBwb2x5Z29uLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgcHJvY2Vzc1NlZ21lbnQocG9seWdvbltpXSwgcG9seWdvbltpICsgMV0sIGlzU3ViamVjdCwgZGVwdGggKyAxLCBxdWV1ZSwgYmJveCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBvbHlnb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnRvdXJJZCsrO1xuICAgICAgcHJvY2Vzc1BvbHlnb24ocG9seWdvbltpXSwgaXNTdWJqZWN0LCBjb250b3VySWQsIHF1ZXVlLCBiYm94KTtcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBmaWxsUXVldWUoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCkge1xuICB2YXIgZXZlbnRRdWV1ZSA9IG5ldyBRdWV1ZShudWxsLCBjb21wYXJlRXZlbnRzKTtcbiAgY29udG91cklkID0gMDtcblxuICBwcm9jZXNzUG9seWdvbihzdWJqZWN0LCAgdHJ1ZSwgIDAsIGV2ZW50UXVldWUsIHNiYm94KTtcbiAgcHJvY2Vzc1BvbHlnb24oY2xpcHBpbmcsIGZhbHNlLCAwLCBldmVudFF1ZXVlLCBjYmJveCk7XG5cbiAgcmV0dXJuIGV2ZW50UXVldWU7XG59XG5cblxuZnVuY3Rpb24gY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldiwgc3dlZXBMaW5lLCBvcGVyYXRpb24pIHtcbiAgLy8gY29tcHV0ZSBpbk91dCBhbmQgb3RoZXJJbk91dCBmaWVsZHNcbiAgaWYgKHByZXYgPT09IG51bGwpIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gZmFsc2U7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHRydWU7XG5cbiAgLy8gcHJldmlvdXMgbGluZSBzZWdtZW50IGluIHN3ZWVwbGluZSBiZWxvbmdzIHRvIHRoZSBzYW1lIHBvbHlnb25cbiAgfSBlbHNlIGlmIChldmVudC5pc1N1YmplY3QgPT09IHByZXYuaXNTdWJqZWN0KSB7XG4gICAgZXZlbnQuaW5PdXQgICAgICA9ICFwcmV2LmluT3V0O1xuICAgIGV2ZW50Lm90aGVySW5PdXQgPSBwcmV2Lm90aGVySW5PdXQ7XG5cbiAgLy8gcHJldmlvdXMgbGluZSBzZWdtZW50IGluIHN3ZWVwbGluZSBiZWxvbmdzIHRvIHRoZSBjbGlwcGluZyBwb2x5Z29uXG4gIH0gZWxzZSB7XG4gICAgZXZlbnQuaW5PdXQgICAgICA9ICFwcmV2Lm90aGVySW5PdXQ7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHByZXYuaXNWZXJ0aWNhbCgpID8gIXByZXYuaW5PdXQgOiBwcmV2LmluT3V0O1xuICB9XG5cbiAgLy8gY29tcHV0ZSBwcmV2SW5SZXN1bHQgZmllbGRcbiAgaWYgKHByZXYpIHtcbiAgICBldmVudC5wcmV2SW5SZXN1bHQgPSAoIWluUmVzdWx0KHByZXYsIG9wZXJhdGlvbikgfHwgcHJldi5pc1ZlcnRpY2FsKCkpID9cbiAgICAgICBwcmV2LnByZXZJblJlc3VsdCA6IHByZXY7XG4gIH1cbiAgLy8gY2hlY2sgaWYgdGhlIGxpbmUgc2VnbWVudCBiZWxvbmdzIHRvIHRoZSBCb29sZWFuIG9wZXJhdGlvblxuICBldmVudC5pblJlc3VsdCA9IGluUmVzdWx0KGV2ZW50LCBvcGVyYXRpb24pO1xufVxuXG5cbmZ1bmN0aW9uIGluUmVzdWx0KGV2ZW50LCBvcGVyYXRpb24pIHtcbiAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgY2FzZSBlZGdlVHlwZS5OT1JNQUw6XG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICBjYXNlIElOVEVSU0VDVElPTjpcbiAgICAgICAgICByZXR1cm4gIWV2ZW50Lm90aGVySW5PdXQ7XG4gICAgICAgIGNhc2UgVU5JT046XG4gICAgICAgICAgcmV0dXJuIGV2ZW50Lm90aGVySW5PdXQ7XG4gICAgICAgIGNhc2UgRElGRkVSRU5DRTpcbiAgICAgICAgICByZXR1cm4gKGV2ZW50LmlzU3ViamVjdCAmJiBldmVudC5vdGhlckluT3V0KSB8fFxuICAgICAgICAgICAgICAgICAoIWV2ZW50LmlzU3ViamVjdCAmJiAhZXZlbnQub3RoZXJJbk91dCk7XG4gICAgICAgIGNhc2UgWE9SOlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIGNhc2UgZWRnZVR5cGUuU0FNRV9UUkFOU0lUSU9OOlxuICAgICAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OIHx8IG9wZXJhdGlvbiA9PT0gVU5JT047XG4gICAgY2FzZSBlZGdlVHlwZS5ESUZGRVJFTlRfVFJBTlNJVElPTjpcbiAgICAgIHJldHVybiBvcGVyYXRpb24gPT09IERJRkZFUkVOQ0U7XG4gICAgY2FzZSBlZGdlVHlwZS5OT05fQ09OVFJJQlVUSU5HOlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IHNlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2UyXG4gKiBAcGFyYW0gIHtRdWV1ZX0gICAgICBxdWV1ZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBwb3NzaWJsZUludGVyc2VjdGlvbihzZTEsIHNlMiwgcXVldWUpIHtcbiAgLy8gdGhhdCBkaXNhbGxvd3Mgc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvbnMsXG4gIC8vIGRpZCBjb3N0IHVzIGhhbGYgYSBkYXksIHNvIEknbGwgbGVhdmUgaXRcbiAgLy8gb3V0IG9mIHJlc3BlY3RcbiAgLy8gaWYgKHNlMS5pc1N1YmplY3QgPT09IHNlMi5pc1N1YmplY3QpIHJldHVybjtcblxuICB2YXIgaW50ZXIgPSBpbnRlcnNlY3Rpb24oXG4gICAgc2UxLnBvaW50LCBzZTEub3RoZXJFdmVudC5wb2ludCxcbiAgICBzZTIucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50XG4gICk7XG5cbiAgdmFyIG5pbnRlcnNlY3Rpb25zID0gaW50ZXIgPyBpbnRlci5sZW5ndGggOiAwO1xuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDApIHJldHVybiAwOyAvLyBubyBpbnRlcnNlY3Rpb25cblxuICAvLyB0aGUgbGluZSBzZWdtZW50cyBpbnRlcnNlY3QgYXQgYW4gZW5kcG9pbnQgb2YgYm90aCBsaW5lIHNlZ21lbnRzXG4gIGlmICgobmludGVyc2VjdGlvbnMgPT09IDEpICYmXG4gICAgICAoZXF1YWxzKHNlMS5wb2ludCwgc2UyLnBvaW50KSB8fFxuICAgICAgIGVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpKSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKG5pbnRlcnNlY3Rpb25zID09PSAyICYmIHNlMS5pc1N1YmplY3QgPT09IHNlMi5pc1N1YmplY3Qpe1xuICAgIGlmKHNlMS5jb250b3VySWQgPT09IHNlMi5jb250b3VySWQpe1xuICAgIGNvbnNvbGUud2FybignRWRnZXMgb2YgdGhlIHNhbWUgcG9seWdvbiBvdmVybGFwJyxcbiAgICAgIHNlMS5wb2ludCwgc2UxLm90aGVyRXZlbnQucG9pbnQsIHNlMi5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpO1xuICAgIH1cbiAgICAvL3Rocm93IG5ldyBFcnJvcignRWRnZXMgb2YgdGhlIHNhbWUgcG9seWdvbiBvdmVybGFwJyk7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvLyBUaGUgbGluZSBzZWdtZW50cyBhc3NvY2lhdGVkIHRvIHNlMSBhbmQgc2UyIGludGVyc2VjdFxuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDEpIHtcblxuICAgIC8vIGlmIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgaXMgbm90IGFuIGVuZHBvaW50IG9mIHNlMVxuICAgIGlmICghZXF1YWxzKHNlMS5wb2ludCwgaW50ZXJbMF0pICYmICFlcXVhbHMoc2UxLm90aGVyRXZlbnQucG9pbnQsIGludGVyWzBdKSkge1xuICAgICAgZGl2aWRlU2VnbWVudChzZTEsIGludGVyWzBdLCBxdWV1ZSk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGludGVyc2VjdGlvbiBwb2ludCBpcyBub3QgYW4gZW5kcG9pbnQgb2Ygc2UyXG4gICAgaWYgKCFlcXVhbHMoc2UyLnBvaW50LCBpbnRlclswXSkgJiYgIWVxdWFscyhzZTIub3RoZXJFdmVudC5wb2ludCwgaW50ZXJbMF0pKSB7XG4gICAgICBkaXZpZGVTZWdtZW50KHNlMiwgaW50ZXJbMF0sIHF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICAvLyBUaGUgbGluZSBzZWdtZW50cyBhc3NvY2lhdGVkIHRvIHNlMSBhbmQgc2UyIG92ZXJsYXBcbiAgdmFyIGV2ZW50cyAgICAgICAgPSBbXTtcbiAgdmFyIGxlZnRDb2luY2lkZSAgPSBmYWxzZTtcbiAgdmFyIHJpZ2h0Q29pbmNpZGUgPSBmYWxzZTtcblxuICBpZiAoZXF1YWxzKHNlMS5wb2ludCwgc2UyLnBvaW50KSkge1xuICAgIGxlZnRDb2luY2lkZSA9IHRydWU7IC8vIGxpbmtlZFxuICB9IGVsc2UgaWYgKGNvbXBhcmVFdmVudHMoc2UxLCBzZTIpID09PSAxKSB7XG4gICAgZXZlbnRzLnB1c2goc2UyLCBzZTEpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5wdXNoKHNlMSwgc2UyKTtcbiAgfVxuXG4gIGlmIChlcXVhbHMoc2UxLm90aGVyRXZlbnQucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50KSkge1xuICAgIHJpZ2h0Q29pbmNpZGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGNvbXBhcmVFdmVudHMoc2UxLm90aGVyRXZlbnQsIHNlMi5vdGhlckV2ZW50KSA9PT0gMSkge1xuICAgIGV2ZW50cy5wdXNoKHNlMi5vdGhlckV2ZW50LCBzZTEub3RoZXJFdmVudCk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLnB1c2goc2UxLm90aGVyRXZlbnQsIHNlMi5vdGhlckV2ZW50KTtcbiAgfVxuXG4gIGlmICgobGVmdENvaW5jaWRlICYmIHJpZ2h0Q29pbmNpZGUpIHx8IGxlZnRDb2luY2lkZSkge1xuICAgIC8vIGJvdGggbGluZSBzZWdtZW50cyBhcmUgZXF1YWwgb3Igc2hhcmUgdGhlIGxlZnQgZW5kcG9pbnRcbiAgICBzZTEudHlwZSA9IGVkZ2VUeXBlLk5PTl9DT05UUklCVVRJTkc7XG4gICAgc2UyLnR5cGUgPSAoc2UxLmluT3V0ID09PSBzZTIuaW5PdXQpID9cbiAgICAgIGVkZ2VUeXBlLlNBTUVfVFJBTlNJVElPTiA6XG4gICAgICBlZGdlVHlwZS5ESUZGRVJFTlRfVFJBTlNJVElPTjtcblxuICAgIGlmIChsZWZ0Q29pbmNpZGUgJiYgIXJpZ2h0Q29pbmNpZGUpIHtcbiAgICAgIC8vIGhvbmVzdGx5IG5vIGlkZWEsIGJ1dCBjaGFuZ2luZyBldmVudHMgc2VsZWN0aW9uIGZyb20gWzIsIDFdXG4gICAgICAvLyB0byBbMCwgMV0gZml4ZXMgdGhlIG92ZXJsYXBwaW5nIHNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25zIGlzc3VlXG4gICAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXS5vdGhlckV2ZW50LCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIDI7XG4gIH1cblxuICAvLyB0aGUgbGluZSBzZWdtZW50cyBzaGFyZSB0aGUgcmlnaHQgZW5kcG9pbnRcbiAgaWYgKHJpZ2h0Q29pbmNpZGUpIHtcbiAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gICAgcmV0dXJuIDM7XG4gIH1cblxuICAvLyBubyBsaW5lIHNlZ21lbnQgaW5jbHVkZXMgdG90YWxseSB0aGUgb3RoZXIgb25lXG4gIGlmIChldmVudHNbMF0gIT09IGV2ZW50c1szXS5vdGhlckV2ZW50KSB7XG4gICAgZGl2aWRlU2VnbWVudChldmVudHNbMF0sIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzFdLCBldmVudHNbMl0ucG9pbnQsIHF1ZXVlKTtcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIC8vIG9uZSBsaW5lIHNlZ21lbnQgaW5jbHVkZXMgdGhlIG90aGVyIG9uZVxuICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzNdLm90aGVyRXZlbnQsIGV2ZW50c1syXS5wb2ludCwgcXVldWUpO1xuXG4gIHJldHVybiAzO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2VcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwXG4gKiBAcGFyYW0gIHtRdWV1ZX0gcXVldWVcbiAqIEByZXR1cm4ge1F1ZXVlfVxuICovXG5mdW5jdGlvbiBkaXZpZGVTZWdtZW50KHNlLCBwLCBxdWV1ZSkgIHtcbiAgdmFyIHIgPSBuZXcgU3dlZXBFdmVudChwLCBmYWxzZSwgc2UsICAgICAgICAgICAgc2UuaXNTdWJqZWN0KTtcbiAgdmFyIGwgPSBuZXcgU3dlZXBFdmVudChwLCB0cnVlLCAgc2Uub3RoZXJFdmVudCwgc2UuaXNTdWJqZWN0KTtcblxuICAvLyBhdm9pZCBhIHJvdW5kaW5nIGVycm9yLiBUaGUgbGVmdCBldmVudCB3b3VsZCBiZSBwcm9jZXNzZWQgYWZ0ZXIgdGhlIHJpZ2h0IGV2ZW50XG4gIGlmIChjb21wYXJlRXZlbnRzKGwsIHNlLm90aGVyRXZlbnQpID4gMCkge1xuICAgIHNlLm90aGVyRXZlbnQubGVmdCA9IHRydWU7XG4gICAgbC5sZWZ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBhdm9pZCBhIHJvdW5kaW5nIGVycm9yLiBUaGUgbGVmdCBldmVudCB3b3VsZCBiZSBwcm9jZXNzZWQgYWZ0ZXIgdGhlIHJpZ2h0IGV2ZW50XG4gIC8vIGlmIChjb21wYXJlRXZlbnRzKHNlLCByKSA+IDApIHt9XG5cbiAgc2Uub3RoZXJFdmVudC5vdGhlckV2ZW50ID0gbDtcbiAgc2Uub3RoZXJFdmVudCA9IHI7XG5cbiAgcXVldWUucHVzaChsKTtcbiAgcXVldWUucHVzaChyKTtcblxuICByZXR1cm4gcXVldWU7XG59XG5cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMsIG5vLWRlYnVnZ2VyICovXG5mdW5jdGlvbiBpdGVyYXRvckVxdWFscyhpdDEsIGl0Mikge1xuICByZXR1cm4gaXQxLl9jdXJzb3IgPT09IGl0Mi5fY3Vyc29yO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBwb3MsIGV2ZW50KSB7XG4gIHZhciBtYXAgPSB3aW5kb3cubWFwO1xuICBpZiAoIW1hcCkgcmV0dXJuO1xuICBpZiAod2luZG93LnN3cykgd2luZG93LnN3cy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICBtYXAucmVtb3ZlTGF5ZXIocCk7XG4gIH0pO1xuICB3aW5kb3cuc3dzID0gW107XG4gIHN3ZWVwTGluZS5lYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgcG9seSA9IEwucG9seWxpbmUoW2UucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCksIGUub3RoZXJFdmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKV0sIHsgY29sb3I6ICdncmVlbicgfSkuYWRkVG8obWFwKTtcbiAgICB3aW5kb3cuc3dzLnB1c2gocG9seSk7XG4gIH0pO1xuXG4gIGlmICh3aW5kb3cudnQpIG1hcC5yZW1vdmVMYXllcih3aW5kb3cudnQpO1xuICB2YXIgdiA9IHBvcy5zbGljZSgpO1xuICB2YXIgYiA9IG1hcC5nZXRCb3VuZHMoKTtcbiAgd2luZG93LnZ0ID0gTC5wb2x5bGluZShbW2IuZ2V0Tm9ydGgoKSwgdlswXV0sIFtiLmdldFNvdXRoKCksIHZbMF1dXSwge2NvbG9yOiAnZ3JlZW4nLCB3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xuXG4gIGlmICh3aW5kb3cucHMpIG1hcC5yZW1vdmVMYXllcih3aW5kb3cucHMpO1xuICB3aW5kb3cucHMgPSBMLnBvbHlsaW5lKFtldmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKSwgZXZlbnQub3RoZXJFdmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKV0sIHtjb2xvcjogJ2JsYWNrJywgd2VpZ2h0OiA5LCBvcGFjaXR5OiAwLjR9KS5hZGRUbyhtYXApO1xuICBkZWJ1Z2dlcjtcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMsIG5vLWRlYnVnZ2VyICovXG5cblxuZnVuY3Rpb24gc3ViZGl2aWRlU2VnbWVudHMoZXZlbnRRdWV1ZSwgc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKSB7XG4gIHZhciBzb3J0ZWRFdmVudHMgPSBbXTtcbiAgdmFyIHByZXYsIG5leHQ7XG5cbiAgdmFyIHN3ZWVwTGluZSA9IG5ldyBUcmVlKGNvbXBhcmVTZWdtZW50cyk7XG4gIHZhciBzb3J0ZWRFdmVudHMgPSBbXTtcblxuICB2YXIgcmlnaHRib3VuZCA9IG1pbihzYmJveFsyXSwgY2Jib3hbMl0pO1xuXG4gIHZhciBwcmV2LCBuZXh0O1xuXG4gIHdoaWxlIChldmVudFF1ZXVlLmxlbmd0aCkge1xuICAgIHZhciBldmVudCA9IGV2ZW50UXVldWUucG9wKCk7XG4gICAgc29ydGVkRXZlbnRzLnB1c2goZXZlbnQpO1xuXG4gICAgLy8gb3B0aW1pemF0aW9uIGJ5IGJib3hlcyBmb3IgaW50ZXJzZWN0aW9uIGFuZCBkaWZmZXJlbmNlIGdvZXMgaGVyZVxuICAgIGlmICgob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04gJiYgZXZlbnQucG9pbnRbMF0gPiByaWdodGJvdW5kKSB8fFxuICAgICAgICAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFICAgJiYgZXZlbnQucG9pbnRbMF0gPiBzYmJveFsyXSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChldmVudC5sZWZ0KSB7XG4gICAgICBzd2VlcExpbmUuaW5zZXJ0KGV2ZW50KTtcbiAgICAgIC8vIF9yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBldmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBuZXh0ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcbiAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuICAgICAgZXZlbnQuaXRlcmF0b3IgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuXG4gICAgICBpZiAocHJldi5kYXRhKCkgIT09IHN3ZWVwTGluZS5taW4oKSkge1xuICAgICAgICBwcmV2LnByZXYoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoc3dlZXBMaW5lLm1heCgpKTtcbiAgICAgICAgcHJldi5uZXh0KCk7XG4gICAgICB9XG4gICAgICBuZXh0Lm5leHQoKTtcblxuICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcblxuICAgICAgaWYgKG5leHQuZGF0YSgpKSB7XG4gICAgICAgIGlmIChwb3NzaWJsZUludGVyc2VjdGlvbihldmVudCwgbmV4dC5kYXRhKCksIGV2ZW50UXVldWUpID09PSAyKSB7XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBuZXh0LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSkge1xuICAgICAgICBpZiAocG9zc2libGVJbnRlcnNlY3Rpb24ocHJldi5kYXRhKCksIGV2ZW50LCBldmVudFF1ZXVlKSA9PT0gMikge1xuICAgICAgICAgIHZhciBwcmV2cHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihwcmV2LmRhdGEoKSk7XG4gICAgICAgICAgaWYgKHByZXZwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgICAgICBwcmV2cHJldi5wcmV2KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZXZwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgICAgICBwcmV2cHJldi5uZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbXB1dGVGaWVsZHMocHJldi5kYXRhKCksIHByZXZwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQgPSBldmVudC5vdGhlckV2ZW50O1xuICAgICAgbmV4dCA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG4gICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcblxuICAgICAgLy8gX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIGV2ZW50Lm90aGVyRXZlbnQucG9pbnQsIGV2ZW50KTtcblxuICAgICAgaWYgKCEocHJldiAmJiBuZXh0KSkgY29udGludWU7XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgIHByZXYucHJldigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihzd2VlcExpbmUubWF4KCkpO1xuICAgICAgICBwcmV2Lm5leHQoKTtcbiAgICAgIH1cbiAgICAgIG5leHQubmV4dCgpO1xuICAgICAgc3dlZXBMaW5lLnJlbW92ZShldmVudCk7XG5cbiAgICAgIC8vX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIGV2ZW50Lm90aGVyRXZlbnQucG9pbnQsIGV2ZW50KTtcblxuICAgICAgaWYgKG5leHQuZGF0YSgpICYmIHByZXYuZGF0YSgpKSB7XG4gICAgICAgIHBvc3NpYmxlSW50ZXJzZWN0aW9uKHByZXYuZGF0YSgpLCBuZXh0LmRhdGEoKSwgZXZlbnRRdWV1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzb3J0ZWRFdmVudHM7XG59XG5cblxuZnVuY3Rpb24gc3dhcCAoYXJyLCBpLCBuKSB7XG4gIHZhciB0ZW1wID0gYXJyW2ldO1xuICBhcnJbaV0gPSBhcnJbbl07XG4gIGFycltuXSA9IHRlbXA7XG59XG5cblxuZnVuY3Rpb24gY2hhbmdlT3JpZW50YXRpb24oY29udG91cikge1xuICByZXR1cm4gY29udG91ci5yZXZlcnNlKCk7XG59XG5cblxuZnVuY3Rpb24gaXNBcnJheSAoYXJyKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuXG5mdW5jdGlvbiBhZGRIb2xlKGNvbnRvdXIsIGlkeCkge1xuICBpZiAoIWlzQXJyYXkoY29udG91clswXVswXSkpIHtcbiAgICBjb250b3VyID0gW2NvbnRvdXJdO1xuICB9XG4gIGNvbnRvdXJbaWR4XSA9IFtdO1xuICByZXR1cm4gY29udG91cjtcbn1cblxuXG5mdW5jdGlvbiBjb25uZWN0RWRnZXMoc29ydGVkRXZlbnRzKSB7XG4gIC8vIGNvcHkgdGhlIGV2ZW50cyBpbiB0aGUgcmVzdWx0IHBvbHlnb24gdG8gcmVzdWx0RXZlbnRzIGFycmF5XG4gIHZhciByZXN1bHRFdmVudHMgPSBbXTtcbiAgdmFyIGV2ZW50LCBpLCBsZW47XG5cbiAgZm9yIChpID0gMCwgbGVuID0gc29ydGVkRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZXZlbnQgPSBzb3J0ZWRFdmVudHNbaV07XG4gICAgaWYgKChldmVudC5sZWZ0ICYmIGV2ZW50LmluUmVzdWx0KSB8fFxuICAgICAgKCFldmVudC5sZWZ0ICYmIGV2ZW50Lm90aGVyRXZlbnQuaW5SZXN1bHQpKSB7XG4gICAgICByZXN1bHRFdmVudHMucHVzaChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRHVlIHRvIG92ZXJsYXBwaW5nIGVkZ2VzIHRoZSByZXN1bHRFdmVudHMgYXJyYXkgY2FuIGJlIG5vdCB3aG9sbHkgc29ydGVkXG4gIHZhciBzb3J0ZWQgPSBmYWxzZTtcbiAgd2hpbGUgKCFzb3J0ZWQpIHtcbiAgICBzb3J0ZWQgPSB0cnVlO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKChpICsgMSkgPCBsZW4gJiZcbiAgICAgICAgY29tcGFyZUV2ZW50cyhyZXN1bHRFdmVudHNbaV0sIHJlc3VsdEV2ZW50c1tpICsgMV0pID09PSAxKSB7XG4gICAgICAgIHN3YXAocmVzdWx0RXZlbnRzLCBpLCBpICsgMSk7XG4gICAgICAgIHNvcnRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJlc3VsdEV2ZW50c1tpXS5wb3MgPSBpO1xuICB9XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKCFyZXN1bHRFdmVudHNbaV0ubGVmdCkge1xuICAgICAgdmFyIHRlbXAgPSByZXN1bHRFdmVudHNbaV0ucG9zO1xuICAgICAgcmVzdWx0RXZlbnRzW2ldLnBvcyA9IHJlc3VsdEV2ZW50c1tpXS5vdGhlckV2ZW50LnBvcztcbiAgICAgIHJlc3VsdEV2ZW50c1tpXS5vdGhlckV2ZW50LnBvcyA9IHRlbXA7XG4gICAgfVxuICB9XG5cbiAgLy8gXCJmYWxzZVwiLWZpbGxlZCBhcnJheVxuICB2YXIgcHJvY2Vzc2VkID0gQXJyYXkocmVzdWx0RXZlbnRzLmxlbmd0aCk7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICB2YXIgZGVwdGggID0gW107XG4gIHZhciBob2xlT2YgPSBbXTtcbiAgdmFyIGlzSG9sZSA9IHt9O1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChwcm9jZXNzZWRbaV0pIGNvbnRpbnVlO1xuXG4gICAgdmFyIGNvbnRvdXIgPSBbXTtcbiAgICByZXN1bHQucHVzaChjb250b3VyKTtcblxuICAgIHZhciBjb250b3VySWQgPSByZXN1bHQubGVuZ3RoIC0gMTtcbiAgICBkZXB0aC5wdXNoKDApO1xuICAgIGhvbGVPZi5wdXNoKC0xKTtcblxuXG4gICAgaWYgKHJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQpIHtcbiAgICAgIHZhciBsb3dlckNvbnRvdXJJZCA9IHJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQuY29udG91cklkO1xuICAgICAgaWYgKCFyZXN1bHRFdmVudHNbaV0ucHJldkluUmVzdWx0LnJlc3VsdEluT3V0KSB7XG4gICAgICAgIGFkZEhvbGUocmVzdWx0W2xvd2VyQ29udG91cklkXSwgY29udG91cklkKTtcbiAgICAgICAgaG9sZU9mW2NvbnRvdXJJZF0gPSBsb3dlckNvbnRvdXJJZDtcbiAgICAgICAgZGVwdGhbY29udG91cklkXSAgPSBkZXB0aFtsb3dlckNvbnRvdXJJZF0gKyAxO1xuICAgICAgICBpc0hvbGVbY29udG91cklkXSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGlzSG9sZVtsb3dlckNvbnRvdXJJZF0pIHtcbiAgICAgICAgYWRkSG9sZShyZXN1bHRbaG9sZU9mW2xvd2VyQ29udG91cklkXV0sIGNvbnRvdXJJZCk7XG4gICAgICAgIGhvbGVPZltjb250b3VySWRdID0gaG9sZU9mW2xvd2VyQ29udG91cklkXTtcbiAgICAgICAgZGVwdGhbY29udG91cklkXSAgPSBkZXB0aFtsb3dlckNvbnRvdXJJZF07XG4gICAgICAgIGlzSG9sZVtjb250b3VySWRdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcG9zID0gaTtcbiAgICB2YXIgaW5pdGlhbCA9IHJlc3VsdEV2ZW50c1tpXS5wb2ludDtcbiAgICBjb250b3VyLnB1c2goaW5pdGlhbCk7XG5cbiAgICB3aGlsZSAocG9zID49IGkpIHtcbiAgICAgIHByb2Nlc3NlZFtwb3NdID0gdHJ1ZTtcblxuICAgICAgaWYgKHJlc3VsdEV2ZW50c1twb3NdLmxlZnQpIHtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ucmVzdWx0SW5PdXQgPSBmYWxzZTtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10uY29udG91cklkICAgPSBjb250b3VySWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LnJlc3VsdEluT3V0ID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5jb250b3VySWQgICA9IGNvbnRvdXJJZDtcbiAgICAgIH1cblxuICAgICAgLy9jb25zb2xlLmxvZyhwb3MsIHJlc3VsdEV2ZW50c1twb3NdKTtcbiAgICAgIHBvcyA9IHJlc3VsdEV2ZW50c1twb3NdLnBvcztcbiAgICAgIHByb2Nlc3NlZFtwb3NdID0gdHJ1ZTtcblxuICAgICAgY29udG91ci5wdXNoKHJlc3VsdEV2ZW50c1twb3NdLnBvaW50KTtcbiAgICAgIHBvcyA9IG5leHRQb3MocG9zLCByZXN1bHRFdmVudHMsIHByb2Nlc3NlZCk7XG4gICAgfVxuXG4gICAgcG9zID0gcG9zID09PSAtMSA/IGkgOiBwb3M7XG5cbiAgICBwcm9jZXNzZWRbcG9zXSA9IHByb2Nlc3NlZFtyZXN1bHRFdmVudHNbcG9zXS5wb3NdID0gdHJ1ZTtcbiAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LnJlc3VsdEluT3V0ID0gdHJ1ZTtcbiAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LmNvbnRvdXJJZCAgID0gY29udG91cklkO1xuXG5cblxuXG4gICAgLy8gZGVwdGggaXMgZXZlblxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UgKi9cbiAgICBpZiAoZGVwdGhbY29udG91cklkXSAmIDEpIHtcbiAgICAgIGNoYW5nZU9yaWVudGF0aW9uKGNvbnRvdXIpO1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWJpdHdpc2UgKi9cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHBvc1xuICogQHBhcmFtICB7QXJyYXkuPFN3ZWVwRXZlbnQ+fSByZXN1bHRFdmVudHNcbiAqIEBwYXJhbSAge0FycmF5LjxCb29sZWFuPn0gICAgcHJvY2Vzc2VkXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIG5leHRQb3MocG9zLCByZXN1bHRFdmVudHMsIHByb2Nlc3NlZCkge1xuICB2YXIgbmV3UG9zID0gcG9zICsgMTtcbiAgdmFyIGxlbmd0aCA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7XG4gIHdoaWxlIChuZXdQb3MgPCBsZW5ndGggJiZcbiAgICAgICAgIGVxdWFscyhyZXN1bHRFdmVudHNbbmV3UG9zXS5wb2ludCwgcmVzdWx0RXZlbnRzW3Bvc10ucG9pbnQpKSB7XG4gICAgaWYgKCFwcm9jZXNzZWRbbmV3UG9zXSkge1xuICAgICAgcmV0dXJuIG5ld1BvcztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3UG9zID0gbmV3UG9zICsgMTtcbiAgICB9XG4gIH1cblxuICBuZXdQb3MgPSBwb3MgLSAxO1xuXG4gIHdoaWxlIChwcm9jZXNzZWRbbmV3UG9zXSkge1xuICAgIG5ld1BvcyA9IG5ld1BvcyAtIDE7XG4gIH1cbiAgcmV0dXJuIG5ld1Bvcztcbn1cblxuXG5mdW5jdGlvbiB0cml2aWFsT3BlcmF0aW9uKHN1YmplY3QsIGNsaXBwaW5nLCBvcGVyYXRpb24pIHtcbiAgdmFyIHJlc3VsdCA9IG51bGw7XG4gIGlmIChzdWJqZWN0Lmxlbmd0aCAqIGNsaXBwaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChvcGVyYXRpb24gPT09IElOVEVSU0VDVElPTikge1xuICAgICAgcmVzdWx0ID0gRU1QVFk7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IERJRkZFUkVOQ0UpIHtcbiAgICAgIHJlc3VsdCA9IHN1YmplY3Q7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFVOSU9OIHx8IG9wZXJhdGlvbiA9PT0gWE9SKSB7XG4gICAgICByZXN1bHQgPSAoc3ViamVjdC5sZW5ndGggPT09IDApID8gY2xpcHBpbmcgOiBzdWJqZWN0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmZ1bmN0aW9uIGNvbXBhcmVCQm94ZXMoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKSB7XG4gIHZhciByZXN1bHQgPSBudWxsO1xuICBpZiAoc2Jib3hbMF0gPiBjYmJveFsyXSB8fFxuICAgICAgY2Jib3hbMF0gPiBzYmJveFsyXSB8fFxuICAgICAgc2Jib3hbMV0gPiBjYmJveFszXSB8fFxuICAgICAgY2Jib3hbMV0gPiBzYmJveFszXSkge1xuICAgIGlmIChvcGVyYXRpb24gPT09IElOVEVSU0VDVElPTikge1xuICAgICAgcmVzdWx0ID0gRU1QVFk7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IERJRkZFUkVOQ0UpIHtcbiAgICAgIHJlc3VsdCA9IHN1YmplY3Q7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFVOSU9OIHx8IG9wZXJhdGlvbiA9PT0gWE9SKSB7XG4gICAgICByZXN1bHQgPSBzdWJqZWN0LmNvbmNhdChjbGlwcGluZyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgb3BlcmF0aW9uKSB7XG4gIHZhciB0cml2aWFsID0gdHJpdmlhbE9wZXJhdGlvbihzdWJqZWN0LCBjbGlwcGluZywgb3BlcmF0aW9uKTtcbiAgaWYgKHRyaXZpYWwpIHtcbiAgICByZXR1cm4gdHJpdmlhbCA9PT0gRU1QVFkgPyBudWxsIDogdHJpdmlhbDtcbiAgfVxuICB2YXIgc2Jib3ggPSBbSW5maW5pdHksIEluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eV07XG4gIHZhciBjYmJveCA9IFtJbmZpbml0eSwgSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5XTtcblxuICB2YXIgZXZlbnRRdWV1ZSA9IGZpbGxRdWV1ZShzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94KTtcblxuICB0cml2aWFsID0gY29tcGFyZUJCb3hlcyhzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pO1xuICBpZiAodHJpdmlhbCkge1xuICAgIHJldHVybiB0cml2aWFsID09PSBFTVBUWSA/IG51bGwgOiB0cml2aWFsO1xuICB9XG4gIHZhciBzb3J0ZWRFdmVudHMgPSBzdWJkaXZpZGVTZWdtZW50cyhldmVudFF1ZXVlLCBzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pO1xuICByZXR1cm4gY29ubmVjdEVkZ2VzKHNvcnRlZEV2ZW50cyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBib29sZWFuO1xuXG5cbm1vZHVsZS5leHBvcnRzLnVuaW9uID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIFVOSU9OKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMuZGlmZiA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBESUZGRVJFTkNFKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMueG9yID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIFhPUik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBJTlRFUlNFQ1RJT04pO1xufTtcblxuXG4vKipcbiAqIEBlbnVtIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzLm9wZXJhdGlvbnMgPSB7XG4gIElOVEVSU0VDVElPTjogSU5URVJTRUNUSU9OLFxuICBESUZGRVJFTkNFOiAgIERJRkZFUkVOQ0UsXG4gIFVOSU9OOiAgICAgICAgVU5JT04sXG4gIFhPUjogICAgICAgICAgWE9SXG59O1xuXG5cbi8vIGZvciB0ZXN0aW5nXG5tb2R1bGUuZXhwb3J0cy5maWxsUXVldWUgICAgICAgICAgICA9IGZpbGxRdWV1ZTtcbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVGaWVsZHMgICAgICAgID0gY29tcHV0ZUZpZWxkcztcbm1vZHVsZS5leHBvcnRzLnN1YmRpdmlkZVNlZ21lbnRzICAgID0gc3ViZGl2aWRlU2VnbWVudHM7XG5tb2R1bGUuZXhwb3J0cy5kaXZpZGVTZWdtZW50ICAgICAgICA9IGRpdmlkZVNlZ21lbnQ7XG5tb2R1bGUuZXhwb3J0cy5wb3NzaWJsZUludGVyc2VjdGlvbiA9IHBvc3NpYmxlSW50ZXJzZWN0aW9uO1xuIiwidmFyIEVQU0lMT04gPSAxZS05O1xuXG4vKipcbiAqIEZpbmRzIHRoZSBtYWduaXR1ZGUgb2YgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMgKGlmIHdlIHByZXRlbmRcbiAqIHRoZXkncmUgaW4gdGhyZWUgZGltZW5zaW9ucylcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBGaXJzdCB2ZWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFNlY29uZCB2ZWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbWFnbml0dWRlIG9mIHRoZSBjcm9zcyBwcm9kdWN0XG4gKi9cbmZ1bmN0aW9uIGtyb3NzUHJvZHVjdChhLCBiKSB7XG4gIHJldHVybiBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBGaXJzdCB2ZWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFNlY29uZCB2ZWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgZG90IHByb2R1Y3RcbiAqL1xuZnVuY3Rpb24gZG90UHJvZHVjdChhLCBiKSB7XG4gIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBpbnRlcnNlY3Rpb24gKGlmIGFueSkgYmV0d2VlbiB0d28gbGluZSBzZWdtZW50cyBhIGFuZCBiLCBnaXZlbiB0aGVcbiAqIGxpbmUgc2VnbWVudHMnIGVuZCBwb2ludHMgYTEsIGEyIGFuZCBiMSwgYjIuXG4gKlxuICogVGhpcyBhbGdvcml0aG0gaXMgYmFzZWQgb24gU2NobmVpZGVyIGFuZCBFYmVybHkuXG4gKiBodHRwOi8vd3d3LmNpbWVjLm9yZy5hci9+bmNhbHZvL1NjaG5laWRlcl9FYmVybHkucGRmXG4gKiBQYWdlIDI0NC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBhMSBwb2ludCBvZiBmaXJzdCBsaW5lXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBhMiBwb2ludCBvZiBmaXJzdCBsaW5lXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBiMSBwb2ludCBvZiBzZWNvbmQgbGluZVxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYjIgcG9pbnQgb2Ygc2Vjb25kIGxpbmVcbiAqIEBwYXJhbSB7Qm9vbGVhbj19ICAgICAgIG5vRW5kcG9pbnRUb3VjaCB3aGV0aGVyIHRvIHNraXAgc2luZ2xlIHRvdWNocG9pbnRzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1lYW5pbmcgY29ubmVjdGVkIHNlZ21lbnRzKSBhc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdGlvbnNcbiAqIEByZXR1cm5zIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fE51bGx9IElmIHRoZSBsaW5lcyBpbnRlcnNlY3QsIHRoZSBwb2ludCBvZlxuICogaW50ZXJzZWN0aW9uLiBJZiB0aGV5IG92ZXJsYXAsIHRoZSB0d28gZW5kIHBvaW50cyBvZiB0aGUgb3ZlcmxhcHBpbmcgc2VnbWVudC5cbiAqIE90aGVyd2lzZSwgbnVsbC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhMSwgYTIsIGIxLCBiMiwgbm9FbmRwb2ludFRvdWNoKSB7XG4gIC8vIFRoZSBhbGdvcml0aG0gZXhwZWN0cyBvdXIgbGluZXMgaW4gdGhlIGZvcm0gUCArIHNkLCB3aGVyZSBQIGlzIGEgcG9pbnQsXG4gIC8vIHMgaXMgb24gdGhlIGludGVydmFsIFswLCAxXSwgYW5kIGQgaXMgYSB2ZWN0b3IuXG4gIC8vIFdlIGFyZSBwYXNzZWQgdHdvIHBvaW50cy4gUCBjYW4gYmUgdGhlIGZpcnN0IHBvaW50IG9mIGVhY2ggcGFpci4gVGhlXG4gIC8vIHZlY3RvciwgdGhlbiwgY291bGQgYmUgdGhvdWdodCBvZiBhcyB0aGUgZGlzdGFuY2UgKGluIHggYW5kIHkgY29tcG9uZW50cylcbiAgLy8gZnJvbSB0aGUgZmlyc3QgcG9pbnQgdG8gdGhlIHNlY29uZCBwb2ludC5cbiAgLy8gU28gZmlyc3QsIGxldCdzIG1ha2Ugb3VyIHZlY3RvcnM6XG4gIHZhciB2YSA9IFthMlswXSAtIGExWzBdLCBhMlsxXSAtIGExWzFdXTtcbiAgdmFyIHZiID0gW2IyWzBdIC0gYjFbMF0sIGIyWzFdIC0gYjFbMV1dO1xuICAvLyBXZSBhbHNvIGRlZmluZSBhIGZ1bmN0aW9uIHRvIGNvbnZlcnQgYmFjayB0byByZWd1bGFyIHBvaW50IGZvcm06XG5cbiAgLyogZXNsaW50LWRpc2FibGUgYXJyb3ctYm9keS1zdHlsZSAqL1xuXG4gIGZ1bmN0aW9uIHRvUG9pbnQocCwgcywgZCkge1xuICAgIHJldHVybiBbXG4gICAgICBwWzBdICsgcyAqIGRbMF0sXG4gICAgICBwWzFdICsgcyAqIGRbMV1cbiAgICBdO1xuICB9XG5cbiAgLyogZXNsaW50LWVuYWJsZSBhcnJvdy1ib2R5LXN0eWxlICovXG5cbiAgLy8gVGhlIHJlc3QgaXMgcHJldHR5IG11Y2ggYSBzdHJhaWdodCBwb3J0IG9mIHRoZSBhbGdvcml0aG0uXG4gIHZhciBlID0gW2IxWzBdIC0gYTFbMF0sIGIxWzFdIC0gYTFbMV1dO1xuICB2YXIga3Jvc3MgPSBrcm9zc1Byb2R1Y3QodmEsIHZiKTtcbiAgdmFyIHNxcktyb3NzID0ga3Jvc3MgKiBrcm9zcztcbiAgdmFyIHNxckxlbkEgPSBkb3RQcm9kdWN0KHZhLCB2YSk7XG4gIHZhciBzcXJMZW5CID0gZG90UHJvZHVjdCh2YiwgdmIpO1xuXG4gIC8vIENoZWNrIGZvciBsaW5lIGludGVyc2VjdGlvbi4gVGhpcyB3b3JrcyBiZWNhdXNlIG9mIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZVxuICAvLyBjcm9zcyBwcm9kdWN0IC0tIHNwZWNpZmljYWxseSwgdHdvIHZlY3RvcnMgYXJlIHBhcmFsbGVsIGlmIGFuZCBvbmx5IGlmIHRoZVxuICAvLyBjcm9zcyBwcm9kdWN0IGlzIHRoZSAwIHZlY3Rvci4gVGhlIGZ1bGwgY2FsY3VsYXRpb24gaW52b2x2ZXMgcmVsYXRpdmUgZXJyb3JcbiAgLy8gdG8gYWNjb3VudCBmb3IgcG9zc2libGUgdmVyeSBzbWFsbCBsaW5lIHNlZ21lbnRzLiBTZWUgU2NobmVpZGVyICYgRWJlcmx5XG4gIC8vIGZvciBkZXRhaWxzLlxuICBpZiAoc3FyS3Jvc3MgPiBFUFNJTE9OICogc3FyTGVuQSAqIHNxckxlbkIpIHtcbiAgICAvLyBJZiB0aGV5J3JlIG5vdCBwYXJhbGxlbCwgdGhlbiAoYmVjYXVzZSB0aGVzZSBhcmUgbGluZSBzZWdtZW50cykgdGhleVxuICAgIC8vIHN0aWxsIG1pZ2h0IG5vdCBhY3R1YWxseSBpbnRlcnNlY3QuIFRoaXMgY29kZSBjaGVja3MgdGhhdCB0aGVcbiAgICAvLyBpbnRlcnNlY3Rpb24gcG9pbnQgb2YgdGhlIGxpbmVzIGlzIGFjdHVhbGx5IG9uIGJvdGggbGluZSBzZWdtZW50cy5cbiAgICB2YXIgcyA9IGtyb3NzUHJvZHVjdChlLCB2YikgLyBrcm9zcztcbiAgICBpZiAocyA8IDAgfHwgcyA+IDEpIHtcbiAgICAgIC8vIG5vdCBvbiBsaW5lIHNlZ21lbnQgYVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciB0ID0ga3Jvc3NQcm9kdWN0KGUsIHZhKSAvIGtyb3NzO1xuICAgIGlmICh0IDwgMCB8fCB0ID4gMSkge1xuICAgICAgLy8gbm90IG9uIGxpbmUgc2VnbWVudCBiXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5vRW5kcG9pbnRUb3VjaCA/IG51bGwgOiBbdG9Qb2ludChhMSwgcywgdmEpXTtcbiAgfVxuXG4gIC8vIElmIHdlJ3ZlIHJlYWNoZWQgdGhpcyBwb2ludCwgdGhlbiB0aGUgbGluZXMgYXJlIGVpdGhlciBwYXJhbGxlbCBvciB0aGVcbiAgLy8gc2FtZSwgYnV0IHRoZSBzZWdtZW50cyBjb3VsZCBvdmVybGFwIHBhcnRpYWxseSBvciBmdWxseSwgb3Igbm90IGF0IGFsbC5cbiAgLy8gU28gd2UgbmVlZCB0byBmaW5kIHRoZSBvdmVybGFwLCBpZiBhbnkuIFRvIGRvIHRoYXQsIHdlIGNhbiB1c2UgZSwgd2hpY2ggaXNcbiAgLy8gdGhlICh2ZWN0b3IpIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgdHdvIGluaXRpYWwgcG9pbnRzLiBJZiB0aGlzIGlzIHBhcmFsbGVsXG4gIC8vIHdpdGggdGhlIGxpbmUgaXRzZWxmLCB0aGVuIHRoZSB0d28gbGluZXMgYXJlIHRoZSBzYW1lIGxpbmUsIGFuZCB0aGVyZSB3aWxsXG4gIC8vIGJlIG92ZXJsYXAuXG4gIHZhciBzcXJMZW5FID0gZG90UHJvZHVjdChlLCBlKTtcbiAga3Jvc3MgPSBrcm9zc1Byb2R1Y3QoZSwgdmEpO1xuICBzcXJLcm9zcyA9IGtyb3NzICoga3Jvc3M7XG5cbiAgaWYgKHNxcktyb3NzID4gRVBTSUxPTiAqIHNxckxlbkEgKiBzcXJMZW5FKSB7XG4gICAgLy8gTGluZXMgYXJlIGp1c3QgcGFyYWxsZWwsIG5vdCB0aGUgc2FtZS4gTm8gb3ZlcmxhcC5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBzYSA9IGRvdFByb2R1Y3QodmEsIGUpIC8gc3FyTGVuQTtcbiAgdmFyIHNiID0gc2EgKyBkb3RQcm9kdWN0KHZhLCB2YikgLyBzcXJMZW5BO1xuICB2YXIgc21pbiA9IE1hdGgubWluKHNhLCBzYik7XG4gIHZhciBzbWF4ID0gTWF0aC5tYXgoc2EsIHNiKTtcblxuICAvLyB0aGlzIGlzLCBlc3NlbnRpYWxseSwgdGhlIEZpbmRJbnRlcnNlY3Rpb24gYWN0aW5nIG9uIGZsb2F0cyBmcm9tXG4gIC8vIFNjaG5laWRlciAmIEViZXJseSwganVzdCBpbmxpbmVkIGludG8gdGhpcyBmdW5jdGlvbi5cbiAgaWYgKHNtaW4gPD0gMSAmJiBzbWF4ID49IDApIHtcblxuICAgIC8vIG92ZXJsYXAgb24gYW4gZW5kIHBvaW50XG4gICAgaWYgKHNtaW4gPT09IDEpIHtcbiAgICAgIHJldHVybiBub0VuZHBvaW50VG91Y2ggPyBudWxsIDogW3RvUG9pbnQoYTEsIHNtaW4gPiAwID8gc21pbiA6IDAsIHZhKV07XG4gICAgfVxuXG4gICAgaWYgKHNtYXggPT09IDApIHtcbiAgICAgIHJldHVybiBub0VuZHBvaW50VG91Y2ggPyBudWxsIDogW3RvUG9pbnQoYTEsIHNtYXggPCAxID8gc21heCA6IDEsIHZhKV07XG4gICAgfVxuXG4gICAgaWYgKG5vRW5kcG9pbnRUb3VjaCAmJiBzbWluID09PSAwICYmIHNtYXggPT09IDEpIHJldHVybiBudWxsO1xuXG4gICAgLy8gVGhlcmUncyBvdmVybGFwIG9uIGEgc2VnbWVudCAtLSB0d28gcG9pbnRzIG9mIGludGVyc2VjdGlvbi4gUmV0dXJuIGJvdGguXG4gICAgcmV0dXJuIFtcbiAgICAgIHRvUG9pbnQoYTEsIHNtaW4gPiAwID8gc21pbiA6IDAsIHZhKSxcbiAgICAgIHRvUG9pbnQoYTEsIHNtYXggPCAxID8gc21heCA6IDEsIHZhKSxcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIiwiLyoqXG4gKiBTaWduZWQgYXJlYSBvZiB0aGUgdHJpYW5nbGUgKHAwLCBwMSwgcDIpXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDBcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2lnbmVkQXJlYShwMCwgcDEsIHAyKSB7XG4gIHJldHVybiAocDBbMF0gLSBwMlswXSkgKiAocDFbMV0gLSBwMlsxXSkgLSAocDFbMF0gLSBwMlswXSkgKiAocDBbMV0gLSBwMlsxXSk7XG59O1xuIiwidmFyIHNpZ25lZEFyZWEgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG52YXIgRWRnZVR5cGUgICA9IHJlcXVpcmUoJy4vZWRnZV90eXBlJyk7XG5cblxuLyoqXG4gKiBTd2VlcGxpbmUgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSAgcG9pbnRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gICAgICAgICBsZWZ0XG4gKiBAcGFyYW0ge1N3ZWVwRXZlbnQ9fSAgICAgb3RoZXJFdmVudFxuICogQHBhcmFtIHtCb29sZWFufSAgICAgICAgIGlzU3ViamVjdFxuICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgIGVkZ2VUeXBlXG4gKi9cbmZ1bmN0aW9uIFN3ZWVwRXZlbnQocG9pbnQsIGxlZnQsIG90aGVyRXZlbnQsIGlzU3ViamVjdCwgZWRnZVR5cGUpIHtcblxuICAvKipcbiAgICogSXMgbGVmdCBlbmRwb2ludD9cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmxlZnQgPSBsZWZ0O1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPE51bWJlcj59XG4gICAqL1xuICB0aGlzLnBvaW50ID0gcG9pbnQ7XG5cbiAgLyoqXG4gICAqIE90aGVyIGVkZ2UgcmVmZXJlbmNlXG4gICAqIEB0eXBlIHtTd2VlcEV2ZW50fVxuICAgKi9cbiAgdGhpcy5vdGhlckV2ZW50ID0gb3RoZXJFdmVudDtcblxuICAvKipcbiAgICogQmVsb25ncyB0byBzb3VyY2Ugb3IgY2xpcHBpbmcgcG9seWdvblxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuaXNTdWJqZWN0ID0gaXNTdWJqZWN0O1xuXG4gIC8qKlxuICAgKiBFZGdlIGNvbnRyaWJ1dGlvbiB0eXBlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLnR5cGUgPSBlZGdlVHlwZSB8fCBFZGdlVHlwZS5OT1JNQUw7XG5cblxuICAvKipcbiAgICogSW4tb3V0IHRyYW5zaXRpb24gZm9yIHRoZSBzd2VlcGxpbmUgY3Jvc3NpbmcgcG9seWdvblxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuaW5PdXQgPSBmYWxzZTtcblxuXG4gIC8qKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMub3RoZXJJbk91dCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBQcmV2aW91cyBldmVudCBpbiByZXN1bHQ/XG4gICAqIEB0eXBlIHtTd2VlcEV2ZW50fVxuICAgKi9cbiAgdGhpcy5wcmV2SW5SZXN1bHQgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBEb2VzIGV2ZW50IGJlbG9uZyB0byByZXN1bHQ/XG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5pblJlc3VsdCA9IGZhbHNlO1xuXG5cbiAgLy8gY29ubmVjdGlvbiBzdGVwXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5yZXN1bHRJbk91dCA9IGZhbHNlO1xufVxuXG5cblN3ZWVwRXZlbnQucHJvdG90eXBlID0ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gIHBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQmVsb3c6IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gdGhpcy5sZWZ0ID9cbiAgICAgIHNpZ25lZEFyZWEgKHRoaXMucG9pbnQsIHRoaXMub3RoZXJFdmVudC5wb2ludCwgcCkgPiAwIDpcbiAgICAgIHNpZ25lZEFyZWEgKHRoaXMub3RoZXJFdmVudC5wb2ludCwgdGhpcy5wb2ludCwgcCkgPiAwO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgcFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNBYm92ZTogZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhdGhpcy5pc0JlbG93KHApO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc1ZlcnRpY2FsOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludFswXSA9PT0gdGhpcy5vdGhlckV2ZW50LnBvaW50WzBdO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN3ZWVwRXZlbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gVGlueVF1ZXVlO1xuXG5mdW5jdGlvbiBUaW55UXVldWUoZGF0YSwgY29tcGFyZSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUaW55UXVldWUpKSByZXR1cm4gbmV3IFRpbnlRdWV1ZShkYXRhLCBjb21wYXJlKTtcblxuICAgIHRoaXMuZGF0YSA9IGRhdGEgfHwgW107XG4gICAgdGhpcy5sZW5ndGggPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgIHRoaXMuY29tcGFyZSA9IGNvbXBhcmUgfHwgZGVmYXVsdENvbXBhcmU7XG5cbiAgICBpZiAoZGF0YSkgZm9yICh2YXIgaSA9IE1hdGguZmxvb3IodGhpcy5sZW5ndGggLyAyKTsgaSA+PSAwOyBpLS0pIHRoaXMuX2Rvd24oaSk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKGEsIGIpIHtcbiAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IDA7XG59XG5cblRpbnlRdWV1ZS5wcm90b3R5cGUgPSB7XG5cbiAgICBwdXNoOiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB0aGlzLmRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgICAgdGhpcy5fdXAodGhpcy5sZW5ndGggLSAxKTtcbiAgICB9LFxuXG4gICAgcG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0b3AgPSB0aGlzLmRhdGFbMF07XG4gICAgICAgIHRoaXMuZGF0YVswXSA9IHRoaXMuZGF0YVt0aGlzLmxlbmd0aCAtIDFdO1xuICAgICAgICB0aGlzLmxlbmd0aC0tO1xuICAgICAgICB0aGlzLmRhdGEucG9wKCk7XG4gICAgICAgIHRoaXMuX2Rvd24oMCk7XG4gICAgICAgIHJldHVybiB0b3A7XG4gICAgfSxcblxuICAgIHBlZWs6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVswXTtcbiAgICB9LFxuXG4gICAgX3VwOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgY29tcGFyZSA9IHRoaXMuY29tcGFyZTtcblxuICAgICAgICB3aGlsZSAocG9zID4gMCkge1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IE1hdGguZmxvb3IoKHBvcyAtIDEpIC8gMik7XG4gICAgICAgICAgICBpZiAoY29tcGFyZShkYXRhW3Bvc10sIGRhdGFbcGFyZW50XSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgc3dhcChkYXRhLCBwYXJlbnQsIHBvcyk7XG4gICAgICAgICAgICAgICAgcG9zID0gcGFyZW50O1xuXG4gICAgICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rvd246IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEsXG4gICAgICAgICAgICBjb21wYXJlID0gdGhpcy5jb21wYXJlLFxuICAgICAgICAgICAgbGVuID0gdGhpcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gMiAqIHBvcyArIDEsXG4gICAgICAgICAgICAgICAgcmlnaHQgPSBsZWZ0ICsgMSxcbiAgICAgICAgICAgICAgICBtaW4gPSBwb3M7XG5cbiAgICAgICAgICAgIGlmIChsZWZ0IDwgbGVuICYmIGNvbXBhcmUoZGF0YVtsZWZ0XSwgZGF0YVttaW5dKSA8IDApIG1pbiA9IGxlZnQ7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBsZW4gJiYgY29tcGFyZShkYXRhW3JpZ2h0XSwgZGF0YVttaW5dKSA8IDApIG1pbiA9IHJpZ2h0O1xuXG4gICAgICAgICAgICBpZiAobWluID09PSBwb3MpIHJldHVybjtcblxuICAgICAgICAgICAgc3dhcChkYXRhLCBtaW4sIHBvcyk7XG4gICAgICAgICAgICBwb3MgPSBtaW47XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBzd2FwKGRhdGEsIGksIGopIHtcbiAgICB2YXIgdG1wID0gZGF0YVtpXTtcbiAgICBkYXRhW2ldID0gZGF0YVtqXTtcbiAgICBkYXRhW2pdID0gdG1wO1xufVxuIiwiLyoqXG4gKiBPZmZzZXQgZWRnZSBvZiB0aGUgcG9seWdvblxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gY3VycmVudFxuICogQHBhcmFtICB7T2JqZWN0fSBuZXh0XG4gKiBAY29uc3RydWN0b3JcbiAqL1xuZnVuY3Rpb24gRWRnZShjdXJyZW50LCBuZXh0KSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLmN1cnJlbnQgPSBjdXJyZW50O1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5uZXh0ID0gbmV4dDtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMuX2luTm9ybWFsICA9IHRoaXMuaW53YXJkc05vcm1hbCgpO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5fb3V0Tm9ybWFsID0gdGhpcy5vdXR3YXJkc05vcm1hbCgpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgb3V0d2FyZHMgbm9ybWFsXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbkVkZ2UucHJvdG90eXBlLm91dHdhcmRzTm9ybWFsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpbndhcmRzID0gdGhpcy5pbndhcmRzTm9ybWFsKCk7XG4gIHJldHVybiBbXG4gICAgLWlud2FyZHNbMF0sXG4gICAgLWlud2FyZHNbMV1cbiAgXTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBpbndhcmRzIG5vcm1hbFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5FZGdlLnByb3RvdHlwZS5pbndhcmRzTm9ybWFsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkeCA9IHRoaXMubmV4dFswXSAtIHRoaXMuY3VycmVudFswXSxcbiAgICAgIGR5ID0gdGhpcy5uZXh0WzFdIC0gdGhpcy5jdXJyZW50WzFdLFxuICAgICAgZWRnZUxlbmd0aCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgaWYgKGVkZ2VMZW5ndGggPT09IDApIHRocm93IG5ldyBFcnJvcignVmVydGljZXMgb3ZlcmxhcCcpO1xuXG4gIHJldHVybiBbXG4gICAgLWR5IC8gZWRnZUxlbmd0aCxcbiAgICAgZHggLyBlZGdlTGVuZ3RoXG4gIF07XG59O1xuXG4vKipcbiAqIE9mZnNldHMgdGhlIGVkZ2UgYnkgZHgsIGR5XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGR4XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGR5XG4gKiBAcmV0dXJuIHtFZGdlfVxuICovXG5FZGdlLnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihkeCwgZHkpIHtcbiAgcmV0dXJuIEVkZ2Uub2Zmc2V0RWRnZSh0aGlzLmN1cnJlbnQsIHRoaXMubmV4dCwgZHgsIGR5KTtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGR4XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGR5XG4gKiBAcmV0dXJuIHtFZGdlfVxuICovXG5FZGdlLnByb3RvdHlwZS5pbnZlcnNlT2Zmc2V0ID0gZnVuY3Rpb24oZHgsIGR5KSB7XG4gIHJldHVybiBFZGdlLm9mZnNldEVkZ2UodGhpcy5uZXh0LCB0aGlzLmN1cnJlbnQsIGR4LCBkeSk7XG59O1xuXG5cbi8qKlxuICogQHN0YXRpY1xuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IGN1cnJlbnRcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBuZXh0XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgZHhcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICBkeVxuICogQHJldHVybiB7RWRnZX1cbiAqL1xuRWRnZS5vZmZzZXRFZGdlID0gZnVuY3Rpb24oY3VycmVudCwgbmV4dCwgZHgsIGR5KSB7XG4gIHJldHVybiBuZXcgRWRnZShbXG4gICAgY3VycmVudFswXSArIGR4LFxuICAgIGN1cnJlbnRbMV0gKyBkeVxuICBdLCBbXG4gICAgbmV4dFswXSArIGR4LFxuICAgIG5leHRbMV0gKyBkeVxuICBdKTtcbn07XG5cblxuLyoqXG4gKlxuICogQHJldHVybiB7RWRnZX1cbiAqL1xuRWRnZS5wcm90b3R5cGUuaW52ZXJzZSA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIG5ldyBFZGdlKHRoaXMubmV4dCwgdGhpcy5jdXJyZW50KTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMgPSBFZGdlO1xuIiwidmFyIEVkZ2UgICAgID0gcmVxdWlyZSgnLi9lZGdlJyk7XG52YXIgbWFydGluZXogPSByZXF1aXJlKCdtYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nJyk7XG52YXIgdXRpbHMgPSByZXF1aXJlKCcuL3V0aWxzJyk7XG5cblxudmFyIGlzQXJyYXkgICAgID0gdXRpbHMuaXNBcnJheTtcbnZhciBlcXVhbHMgICAgICA9IHV0aWxzLmVxdWFscztcbnZhciBvcmllbnRSaW5ncyA9IHV0aWxzLm9yaWVudFJpbmdzO1xuXG5cblxuLyoqXG4gKiBPZmZzZXQgYnVpbGRlclxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD49fSB2ZXJ0aWNlc1xuICogQHBhcmFtIHtOdW1iZXI9fSAgICAgICAgYXJjU2VnbWVudHNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPZmZzZXQodmVydGljZXMsIGFyY1NlZ21lbnRzKSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn1cbiAgICovXG4gIHRoaXMudmVydGljZXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPEVkZ2U+fVxuICAgKi9cbiAgdGhpcy5lZGdlcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5fY2xvc2VkID0gZmFsc2U7XG5cblxuICAvKipcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMuX2Rpc3RhbmNlID0gMDtcblxuICBpZiAodmVydGljZXMpIHtcbiAgICB0aGlzLmRhdGEodmVydGljZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZ21lbnRzIGluIGVkZ2UgYm91bmRpbmcgYXJjaGVzXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBhcmNTZWdtZW50cyA6IDU7XG59XG5cbi8qKlxuICogQ2hhbmdlIGRhdGEgc2V0XG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXk+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB0aGlzLl9lZGdlcyA9IFtdO1xuICBpZiAoIWlzQXJyYXkgKHZlcnRpY2VzKSkge1xuICAgIHRocm93IG5ldyBFcnJvcignT2Zmc2V0IHJlcXVpcmVzIGF0IGxlYXN0IG9uZSBjb29kaW5hdGUgdG8gd29yayB3aXRoJyk7XG4gIH1cblxuICBpZiAoaXNBcnJheSh2ZXJ0aWNlcykgJiYgdHlwZW9mIHZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykge1xuICAgIHRoaXMudmVydGljZXMgPSB2ZXJ0aWNlcztcbiAgfSBlbHNlIHtcbiAgICB0aGlzLnZlcnRpY2VzID0gb3JpZW50UmluZ3ModmVydGljZXMpO1xuICAgIHRoaXMuX3Byb2Nlc3NDb250b3VyKHRoaXMudmVydGljZXMsIHRoaXMuX2VkZ2VzKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFJlY3Vyc2l2ZWx5IHByb2Nlc3MgY29udG91ciB0byBjcmVhdGUgbm9ybWFsc1xuICogQHBhcmFtICB7Kn0gY29udG91clxuICogQHBhcmFtICB7QXJyYXl9IGVkZ2VzXG4gKi9cbk9mZnNldC5wcm90b3R5cGUuX3Byb2Nlc3NDb250b3VyID0gZnVuY3Rpb24oY29udG91ciwgZWRnZXMpIHtcbiAgdmFyIGksIGxlbjtcbiAgaWYgKGlzQXJyYXkoY29udG91clswXSkgJiYgdHlwZW9mIGNvbnRvdXJbMF1bMF0gPT09ICdudW1iZXInKSB7XG4gICAgbGVuID0gY29udG91ci5sZW5ndGg7XG4gICAgaWYgKGVxdWFscyhjb250b3VyWzBdLCBjb250b3VyW2xlbiAtIDFdKSkge1xuICAgICAgbGVuIC09IDE7IC8vIG90aGVyd2lzZSB3ZSBnZXQgZGl2aXNpb24gYnkgemVybyBpbiBub3JtYWxzXG4gICAgfVxuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgZWRnZXMucHVzaChuZXcgRWRnZShjb250b3VyW2ldLCBjb250b3VyWyhpICsgMSkgJSBsZW5dKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvbnRvdXIubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGVkZ2VzLnB1c2goW10pO1xuICAgICAgdGhpcy5fcHJvY2Vzc0NvbnRvdXIoY29udG91cltpXSwgZWRnZXNbZWRnZXMubGVuZ3RoIC0gMV0pO1xuICAgIH1cbiAgfVxufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gYXJjU2VnbWVudHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5hcmNTZWdtZW50cyA9IGZ1bmN0aW9uKGFyY1NlZ21lbnRzKSB7XG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuXG4vKipcbiAqIFZhbGlkYXRlcyBpZiB0aGUgZmlyc3QgYW5kIGxhc3QgcG9pbnRzIHJlcGVhdFxuICogVE9ETzogY2hlY2sgQ0NXXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IHZlcnRpY2VzXG4gKi9cbk9mZnNldC5wcm90b3R5cGUudmFsaWRhdGUgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2YXIgbGVuID0gdmVydGljZXMubGVuZ3RoO1xuICBpZiAodHlwZW9mIHZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykgcmV0dXJuIFt2ZXJ0aWNlc107XG4gIGlmICh2ZXJ0aWNlc1swXVswXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMF0gJiZcbiAgICB2ZXJ0aWNlc1swXVsxXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMV0pIHtcbiAgICBpZiAobGVuID4gMSkge1xuICAgICAgdmVydGljZXMgPSB2ZXJ0aWNlcy5zbGljZSgwLCBsZW4gLSAxKTtcbiAgICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gICAgfVxuICB9XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIGFyY2ggYmV0d2VlbiB0d28gZWRnZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICByYWRpdXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBzdGFydFZlcnRleFxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGVuZFZlcnRleFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHNlZ21lbnRzXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgb3V0d2FyZHNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5jcmVhdGVBcmMgPSBmdW5jdGlvbih2ZXJ0aWNlcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0VmVydGV4LFxuICAgIGVuZFZlcnRleCwgc2VnbWVudHMsIG91dHdhcmRzKSB7XG5cbiAgdmFyIFBJMiA9IE1hdGguUEkgKiAyLFxuICAgICAgc3RhcnRBbmdsZSA9IE1hdGguYXRhbjIoc3RhcnRWZXJ0ZXhbMV0gLSBjZW50ZXJbMV0sIHN0YXJ0VmVydGV4WzBdIC0gY2VudGVyWzBdKSxcbiAgICAgIGVuZEFuZ2xlICAgPSBNYXRoLmF0YW4yKGVuZFZlcnRleFsxXSAtIGNlbnRlclsxXSwgZW5kVmVydGV4WzBdIC0gY2VudGVyWzBdKTtcblxuICAvLyBvZGQgbnVtYmVyIHBsZWFzZVxuICBpZiAoc2VnbWVudHMgJSAyID09PSAwKSB7XG4gICAgc2VnbWVudHMgLT0gMTtcbiAgfVxuXG4gIGlmIChzdGFydEFuZ2xlIDwgMCkge1xuICAgIHN0YXJ0QW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgaWYgKGVuZEFuZ2xlIDwgMCkge1xuICAgIGVuZEFuZ2xlICs9IFBJMjtcbiAgfVxuXG4gIHZhciBhbmdsZSA9ICgoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSA/XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSA6XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSArIFBJMiAtIGVuZEFuZ2xlKSksXG4gICAgICBzZWdtZW50QW5nbGUgPSAoKG91dHdhcmRzKSA/IC1hbmdsZSA6IFBJMiAtIGFuZ2xlKSAvIHNlZ21lbnRzO1xuXG4gIHZlcnRpY2VzLnB1c2goc3RhcnRWZXJ0ZXgpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNlZ21lbnRzOyArK2kpIHtcbiAgICBhbmdsZSA9IHN0YXJ0QW5nbGUgKyBzZWdtZW50QW5nbGUgKiBpO1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLFxuICAgICAgY2VudGVyWzFdICsgTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzXG4gICAgXSk7XG4gIH1cbiAgdmVydGljZXMucHVzaChlbmRWZXJ0ZXgpO1xuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSAgZGlzdFxuICogQHBhcmFtICB7U3RyaW5nPX0gdW5pdHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5kaXN0YW5jZSA9IGZ1bmN0aW9uKGRpc3QsIHVuaXRzKSB7XG4gIHRoaXMuX2Rpc3RhbmNlID0gZGlzdCB8fCAwO1xuICByZXR1cm4gdGhpcztcbn07XG5cblxuLyoqXG4gKiBAc3RhdGljXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICBkZWdyZWVzXG4gKiBAcGFyYW0gIHtTdHJpbmc9fSB1bml0c1xuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5PZmZzZXQuZGVncmVlc1RvVW5pdHMgPSBmdW5jdGlvbihkZWdyZWVzLCB1bml0cykge1xuICBzd2l0Y2ggKHVuaXRzKSB7XG4gICAgY2FzZSAnbWlsZXMnOlxuICAgICAgZGVncmVlcyA9IGRlZ3JlZXMgLyA2OS4wNDc7XG4gICAgYnJlYWs7XG4gICAgY2FzZSAnZmVldCc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDM2NDU2OC4wO1xuICAgICAgYnJlYWs7XG4gICAgY2FzZSAna2lsb21ldGVycyc6XG4gICAgICBkZWdyZWVzID0gZGVncmVlcyAvIDExMS4xMjtcbiAgICAgIGJyZWFrO1xuICAgIGNhc2UgJ21ldGVycyc6XG4gICAgY2FzZSAnbWV0cmVzJzpcbiAgICAgIGRlZ3JlZXMgPSBkZWdyZWVzIC8gMTExMTIwLjA7XG4gICAgICBicmVhaztcbiAgICBjYXNlICdkZWdyZWVzJzpcbiAgICBjYXNlICdwaXhlbHMnOlxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZGVncmVlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmVuc3VyZUxhc3RQb2ludCA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIGlmICghZXF1YWxzKHZlcnRpY2VzWzBdLCB2ZXJ0aWNlc1t2ZXJ0aWNlcy5sZW5ndGggLSAxXSkpIHtcbiAgICB2ZXJ0aWNlcy5wdXNoKFtcbiAgICAgIHZlcnRpY2VzWzBdWzBdLFxuICAgICAgdmVydGljZXNbMF1bMV1cbiAgICBdKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogRGVjaWRlcyBieSB0aGUgc2lnbiBpZiBpdCdzIGEgcGFkZGluZyBvciBhIG1hcmdpblxuICpcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oZGlzdCkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3QpO1xuICByZXR1cm4gdGhpcy5fZGlzdGFuY2UgPT09IDAgPyB0aGlzLnZlcnRpY2VzIDpcbiAgICAgICh0aGlzLl9kaXN0YW5jZSA+IDAgPyB0aGlzLm1hcmdpbih0aGlzLl9kaXN0YW5jZSkgOlxuICAgICAgICB0aGlzLnBhZGRpbmcoLXRoaXMuX2Rpc3RhbmNlKSk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgICAgICAgIHB0MVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICAgICAgICAgcHQyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLl9vZmZzZXRTZWdtZW50ID0gZnVuY3Rpb24odjEsIHYyLCBlMSwgZGlzdCkge1xuICB2YXIgdmVydGljZXMgPSBbXTtcbiAgdmFyIG9mZnNldHMgPSBbXG4gICAgZTEub2Zmc2V0KGUxLl9pbk5vcm1hbFswXSAqIGRpc3QsIGUxLl9pbk5vcm1hbFsxXSAqIGRpc3QpLFxuICAgIGUxLmludmVyc2VPZmZzZXQoZTEuX291dE5vcm1hbFswXSAqIGRpc3QsIGUxLl9vdXROb3JtYWxbMV0gKiBkaXN0KVxuICBdO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSAyOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgdGhpc0VkZ2UgPSBvZmZzZXRzW2ldLFxuICAgICAgICBwcmV2RWRnZSA9IG9mZnNldHNbKGkgKyBsZW4gLSAxKSAlIGxlbl07XG4gICAgdGhpcy5jcmVhdGVBcmMoXG4gICAgICAgICAgICAgIHZlcnRpY2VzLFxuICAgICAgICAgICAgICBpID09PSAwID8gdjEgOiB2MiwgLy8gZWRnZXNbaV0uY3VycmVudCwgLy8gcDEgb3IgcDJcbiAgICAgICAgICAgICAgZGlzdCxcbiAgICAgICAgICAgICAgcHJldkVkZ2UubmV4dCxcbiAgICAgICAgICAgICAgdGhpc0VkZ2UuY3VycmVudCxcbiAgICAgICAgICAgICAgdGhpcy5fYXJjU2VnbWVudHMsXG4gICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICk7XG4gIH1cblxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5tYXJnaW4gPSBmdW5jdGlvbihkaXN0KSB7XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG5cbiAgaWYgKHR5cGVvZiB0aGlzLnZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykgeyAvLyBwb2ludFxuICAgIHJldHVybiB0aGlzLm9mZnNldFBvaW50KHRoaXMuX2Rpc3RhbmNlKTtcbiAgfVxuXG4gIGlmIChkaXN0ID09PSAwKSByZXR1cm4gdGhpcy52ZXJ0aWNlcztcblxuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmVzKHRoaXMuX2Rpc3RhbmNlKTtcbiAgLy9yZXR1cm4gdW5pb247XG4gIHVuaW9uID0gbWFydGluZXoudW5pb24odGhpcy52ZXJ0aWNlcywgdW5pb24pO1xuICByZXR1cm4gb3JpZW50UmluZ3ModW5pb24pO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUucGFkZGluZyA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgdGhpcy5kaXN0YW5jZShkaXN0KTtcblxuICBpZiAodGhpcy5fZGlzdGFuY2UgPT09IDApIHJldHVybiB0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKTtcbiAgaWYgKHRoaXMudmVydGljZXMubGVuZ3RoID09PSAyICYmIHR5cGVvZiB0aGlzLnZlcnRpY2VzWzBdID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuICB9XG5cbiAgdmFyIHVuaW9uID0gdGhpcy5vZmZzZXRMaW5lcyh0aGlzLl9kaXN0YW5jZSk7XG4gIHZhciBkaWZmID0gbWFydGluZXouZGlmZih0aGlzLnZlcnRpY2VzLCB1bmlvbik7XG4gIHJldHVybiBvcmllbnRSaW5ncyhkaWZmKTtcbn07XG5cblxuLyoqXG4gKiBDcmVhdGVzIG1hcmdpbiBwb2x5Z29uXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldExpbmUgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHJldHVybiBvcmllbnRSaW5ncyh0aGlzLm9mZnNldExpbmVzKGRpc3QpKTtcbn07XG5cblxuLyoqXG4gKiBKdXN0IG9mZnNldHMgbGluZXMsIG5vIGZpbGxcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPEFycmF5LjxBcnJheS48TnVtYmVyPj4+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldExpbmVzID0gZnVuY3Rpb24oZGlzdCkge1xuICBpZiAoZGlzdCA8IDApIHRocm93IG5ldyBFcnJvcignQ2Fubm90IGFwcGx5IG5lZ2F0aXZlIG1hcmdpbiB0byB0aGUgbGluZScpO1xuICB2YXIgdW5pb247XG4gIHRoaXMuZGlzdGFuY2UoZGlzdCk7XG4gIGlmIChpc0FycmF5KHRoaXMudmVydGljZXNbMF0pICYmIHR5cGVvZiB0aGlzLnZlcnRpY2VzWzBdWzBdICE9PSAnbnVtYmVyJykge1xuICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLl9lZGdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdW5pb24gPSAoaSA9PT0gMCkgP1xuICAgICAgICB0aGlzLm9mZnNldENvbnRvdXIodGhpcy52ZXJ0aWNlc1tpXSwgdGhpcy5fZWRnZXNbaV0pOlxuICAgICAgICBtYXJ0aW5lei51bmlvbih1bmlvbiwgdGhpcy5vZmZzZXRDb250b3VyKHRoaXMudmVydGljZXNbaV0sIHRoaXMuX2VkZ2VzW2ldKSk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHVuaW9uID0gKHRoaXMudmVydGljZXMubGVuZ3RoID09PSAxKSA/XG4gICAgICB0aGlzLm9mZnNldFBvaW50KCkgOlxuICAgICAgdGhpcy5vZmZzZXRDb250b3VyKHRoaXMudmVydGljZXMsIHRoaXMuX2VkZ2VzKTtcbiAgfVxuXG4gIHJldHVybiB1bmlvbjtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fEFycmF5LjxBcnJheS48Li4uPj59IGN1cnZlXG4gKiBAcGFyYW0gIHtBcnJheS48RWRnZT58QXJyYXkuPEFycmF5LjwuLi4+Pn0gZWRnZXNcbiAqIEByZXR1cm4ge1BvbHlnb259XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0Q29udG91ciA9IGZ1bmN0aW9uKGN1cnZlLCBlZGdlcykge1xuICB2YXIgdW5pb24sIGksIGxlbjtcbiAgaWYgKGlzQXJyYXkoY3VydmVbMF0pICYmIHR5cGVvZiBjdXJ2ZVswXVswXSA9PT0gJ251bWJlcicpIHtcbiAgICAvLyB3ZSBoYXZlIDEgbGVzcyBlZGdlIHRoYW4gdmVydGljZXNcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBjdXJ2ZS5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHZhciBzZWdtZW50ID0gdGhpcy5lbnN1cmVMYXN0UG9pbnQoXG4gICAgICAgIHRoaXMuX29mZnNldFNlZ21lbnQoY3VydmVbaV0sIGN1cnZlW2kgKyAxXSwgZWRnZXNbaV0sIHRoaXMuX2Rpc3RhbmNlKVxuICAgICAgKTtcbiAgICAgIHVuaW9uID0gKGkgPT09IDApID9cbiAgICAgICAgICAgICAgICBbdGhpcy5lbnN1cmVMYXN0UG9pbnQoc2VnbWVudCldIDpcbiAgICAgICAgICAgICAgICBtYXJ0aW5lei51bmlvbih1bmlvbiwgdGhpcy5lbnN1cmVMYXN0UG9pbnQoc2VnbWVudCkpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBlZGdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgdW5pb24gPSAoaSA9PT0gMCkgP1xuICAgICAgICB0aGlzLm9mZnNldENvbnRvdXIoY3VydmVbaV0sIGVkZ2VzW2ldKSA6XG4gICAgICAgIG1hcnRpbmV6LnVuaW9uKHVuaW9uLCB0aGlzLm9mZnNldENvbnRvdXIoY3VydmVbaV0sIGVkZ2VzW2ldKSk7XG4gICAgfVxuICB9XG4gIHJldHVybiB1bmlvbjtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0UG9pbnQgPSBmdW5jdGlvbihkaXN0YW5jZSkge1xuICB0aGlzLmRpc3RhbmNlKGRpc3RhbmNlKTtcbiAgdmFyIHZlcnRpY2VzID0gdGhpcy5fYXJjU2VnbWVudHMgKiAyO1xuICB2YXIgcG9pbnRzICAgPSBbXTtcbiAgdmFyIGNlbnRlciAgID0gdGhpcy52ZXJ0aWNlcztcbiAgdmFyIHJhZGl1cyAgID0gdGhpcy5fZGlzdGFuY2U7XG4gIHZhciBhbmdsZSAgICA9IDA7XG5cbiAgaWYgKHZlcnRpY2VzICUgMiA9PT0gMCkgdmVydGljZXMrKztcblxuICBmb3IgKHZhciBpID0gMDsgaSA8IHZlcnRpY2VzOyBpKyspIHtcbiAgICBhbmdsZSArPSAoMiAqIE1hdGguUEkgLyB2ZXJ0aWNlcyk7IC8vIGNvdW50ZXItY2xvY2t3aXNlXG4gICAgcG9pbnRzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgKHJhZGl1cyAqIE1hdGguY29zKGFuZ2xlKSksXG4gICAgICBjZW50ZXJbMV0gKyAocmFkaXVzICogTWF0aC5zaW4oYW5nbGUpKVxuICAgIF0pO1xuICB9XG5cbiAgcmV0dXJuIG9yaWVudFJpbmdzKFt0aGlzLmVuc3VyZUxhc3RQb2ludChwb2ludHMpXSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9mZnNldDtcbiIsIi8qKlxuICogQHBhcmFtICB7Kn0gYXJyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG52YXIgaXNBcnJheSA9IG1vZHVsZS5leHBvcnRzLmlzQXJyYXkgPSBBcnJheS5pc0FycmF5IHx8IGZ1bmN0aW9uIChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAyXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5tb2R1bGUuZXhwb3J0cy5lcXVhbHMgPSBmdW5jdGlvbiBlcXVhbHMocDEsIHAyKSB7XG4gIHJldHVybiBwMVswXSA9PT0gcDJbMF0gJiYgcDFbMV0gPT09IHAyWzFdO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAgeyp9ICAgICAgIGNvb3JkaW5hdGVzXG4gKiBAcGFyYW0gIHtOdW1iZXI9fSBkZXB0aFxuICogQHJldHVybiB7Kn1cbiAqL1xubW9kdWxlLmV4cG9ydHMub3JpZW50UmluZ3MgPSBmdW5jdGlvbiBvcmllbnRSaW5ncyhjb29yZGluYXRlcywgZGVwdGgsIGlzSG9sZSkge1xuICBkZXB0aCA9IGRlcHRoIHx8IDA7XG4gIHZhciBpLCBsZW47XG4gIGlmIChpc0FycmF5KGNvb3JkaW5hdGVzKSAmJiB0eXBlb2YgY29vcmRpbmF0ZXNbMF1bMF0gPT09ICdudW1iZXInKSB7XG4gICAgdmFyIGFyZWEgPSAwO1xuICAgIHZhciByaW5nID0gY29vcmRpbmF0ZXM7XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByaW5nLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICB2YXIgcHQxID0gcmluZ1tpXTtcbiAgICAgIHZhciBwdDIgPSByaW5nWyhpICsgMSkgJSBsZW5dO1xuICAgICAgYXJlYSArPSBwdDFbMF0gKiBwdDJbMV07XG4gICAgICBhcmVhIC09IHB0MlswXSAqIHB0MVsxXTtcbiAgICB9XG4gICAgaWYgKCghaXNIb2xlICYmIGFyZWEgPiAwKSB8fCAoaXNIb2xlICYmIGFyZWEgPCAwKSkge1xuICAgICAgcmluZy5yZXZlcnNlKCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IGNvb3JkaW5hdGVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBvcmllbnRSaW5ncyhjb29yZGluYXRlc1tpXSwgZGVwdGggKyAxLCBpID4gMCk7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvb3JkaW5hdGVzO1xufTsiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gIFwiZmVhdHVyZXNcIjogW1xuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJQb2x5Z29uXCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NDY2MzI5NTc0NTg2LFxuICAgICAgICAgICAgICAyMi4yNjc4OTAzMTU5MDU1MDdcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODg0MDc2NTk1MzA2NSxcbiAgICAgICAgICAgICAgMjIuMjY5MjYwNDcwMjYxNzhcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODY1MTkzODQzODQxNyxcbiAgICAgICAgICAgICAgMjIuMjY3Mjg0NjYzNjg5MzI0XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTg3NjI0NDU0NDk4MyxcbiAgICAgICAgICAgICAgMjIuMjY1NDM3OTA0NjgzNFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NDk5NTg4OTY2MzcxLFxuICAgICAgICAgICAgICAyMi4yNjYyNzE5Mjc4OTc1OTVcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODQ2NjMyOTU3NDU4NixcbiAgICAgICAgICAgICAgMjIuMjY3ODkwMzE1OTA1NTA3XG4gICAgICAgICAgICBdXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg4MzY0NzQ0MTg2NDIsXG4gICAgICAgICAgICAyMi4yNzA3NDk3NTMyNTY4MzNcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xOTA0NzgzMjQ4OTAxNSxcbiAgICAgICAgICAgIDIyLjI2OTc3Njc1NjgyODY0XG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg5MjU1MjM3NTc5MzUsXG4gICAgICAgICAgICAyMi4yNjc1OTI0NTQ0ODc0NTZcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xOTIwNDQ3MzQ5NTQ4MyxcbiAgICAgICAgICAgIDIyLjI2OTI4MDMyNzQ3MjY2XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTkxMjE4NjE0NTc4MjYsXG4gICAgICAgICAgICAyMi4yNjQ4ODE4ODY0NDU3OFxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE5MzU3ODk1ODUxMTM3LFxuICAgICAgICAgICAgMjIuMjY2OTI3MjI4MzY0NDc3XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg5MzUxNzk3MTAzOSxcbiAgICAgICAgICAgIDIyLjI2NjUzMDA3NjkzMjY5XG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiUG9pbnRcIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgMTE0LjE4OTQ5MTI3MTk3MjY3LFxuICAgICAgICAgIDIyLjI3MTgwMjE3MDM0Njg4NFxuICAgICAgICBdXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODY0NjU3NDAyMDM4NixcbiAgICAgICAgICAgICAgMjIuMjYzOTE4Nzc4MTk5ODFcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xOTIyNTkzMTE2NzYwNCxcbiAgICAgICAgICAgICAgMjIuMjYzNzU5OTE0MzQ3MTc2XG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTkyNDUyNDMwNzI1MTEsXG4gICAgICAgICAgICAgIDIyLjI2MDA0NjQyMDQyMTM4NlxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NTU4NTk3NTY0Njk5LFxuICAgICAgICAgICAgICAyMi4yNjA1MDMxNjU2Mjk2NDNcbiAgICAgICAgICAgIF0sXG4gICAgICAgICAgICBbXG4gICAgICAgICAgICAgIDExNC4xODY0NjU3NDAyMDM4NixcbiAgICAgICAgICAgICAgMjIuMjYzOTE4Nzc4MTk5ODFcbiAgICAgICAgICAgIF1cbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NzMyNDA0NzA4ODY0LFxuICAgICAgICAgICAgICAyMi4yNjMyNDM2MDU1ODA3NFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NzM4ODQyMDEwNSxcbiAgICAgICAgICAgICAgMjIuMjYxMjE4MDY4MTgxXG4gICAgICAgICAgICBdLFxuICAgICAgICAgICAgW1xuICAgICAgICAgICAgICAxMTQuMTkwOTI4OTM2MDA0NjUsXG4gICAgICAgICAgICAgIDIyLjI2MDk1OTkwOTM0NzU0NVxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE5MTAxNDc2NjY5MzEyLFxuICAgICAgICAgICAgICAyMi4yNjI2ODc1Nzg2MjUyNFxuICAgICAgICAgICAgXSxcbiAgICAgICAgICAgIFtcbiAgICAgICAgICAgICAgMTE0LjE4NzMyNDA0NzA4ODY0LFxuICAgICAgICAgICAgICAyMi4yNjMyNDM2MDU1ODA3NFxuICAgICAgICAgICAgXVxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1cbiAgXVxufSJdfQ==
