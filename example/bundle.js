(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Offset = require('../src/offset');
require('./polygon_control');
var OffsetControl = require('./offset_control');
var data = require('../test/fixtures/polygon_polyline.json');
var project = require('geojson-project');

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
  maxZoom: 22,
  crs: L.CRS.EPSG4326
}).setView(center, zoom);

map.addControl(new L.NewPolygonControl({
  callback: map.editTools.startPolygon
}));
map.addControl(new L.NewLineControl({
  callback: map.editTools.startPolyline
}));

var layers = global.layers = L.geoJson().addTo(map);
var results = global.results = L.geoJson(null, {
  style: function(feature) {
    return marginStyle;
  }
}).addTo(map);

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

    console.log(shape);
    var margined;
    if (gj.geometry.type === 'LineString') {
      margined = {
        type: 'Feature',
        geometry: {
          type: 'LineString',
          coordinates: Offset.lineOffset(shape.geometry.coordinates, margin)
        }
      };
    } else {
      margined = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: new Offset(shape.geometry.coordinates[0]).margin(margin)
        }
      };
    }

console.log(margined);
    results.addData(project(margined, function(pt) {
      var ll = map.options.crs.pointToLatLng(L.point(pt.slice()), map.getZoom());
      return [ll.lng, ll.lat];
    }));
  });
}





// var polygon = data.features[0];

// // L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
// //     attribution: '&copy; ' +
// //         '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// // }).addTo(map);

// console.log(polygon);

// function project(ll) {
//   var pt = map.options.crs.latLngToPoint(L.latLng(ll.slice().reverse()), map.getZoom());
//   return [pt.x, pt.y];
// }

// vertices = polygon.geometry.coordinates[0].map(project);

// console.time('margin');
// result = new Offset(vertices).margin(40);
// console.timeEnd('margin');
// result = result.map(function(p) {
//   return map.options.crs.pointToLatLng(L.point(p), map.getZoom());
// });

// L.polygon(result, marginStyle).addTo(map);
// console.time('padding');
// result = new Offset(vertices).padding(10);
// console.timeEnd('padding');
// result = result.map(function(p) {
//     return map.options.crs.pointToLatLng(L.point(p), map.getZoom());
// });

// L.polygon(result, paddingStyle).addTo(layers);

// var linePoints = data.features[1].geometry.coordinates.map(project);
}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4YW1wbGUvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyJ2YXIgT2Zmc2V0ID0gcmVxdWlyZSgnLi4vc3JjL29mZnNldCcpO1xucmVxdWlyZSgnLi9wb2x5Z29uX2NvbnRyb2wnKTtcbnZhciBPZmZzZXRDb250cm9sID0gcmVxdWlyZSgnLi9vZmZzZXRfY29udHJvbCcpO1xudmFyIGRhdGEgPSByZXF1aXJlKCcuLi90ZXN0L2ZpeHR1cmVzL3BvbHlnb25fcG9seWxpbmUuanNvbicpO1xudmFyIHByb2plY3QgPSByZXF1aXJlKCdnZW9qc29uLXByb2plY3QnKTtcblxudmFyIHN0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDMsXG4gICAgICAgIGNvbG9yOiAnIzQ4ZicsXG4gICAgICAgIG9wYWNpdHk6IDAuOCxcbiAgICAgICAgZGFzaEFycmF5OiBbMiwgNF1cbiAgICB9LFxuICAgIG1hcmdpblN0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnIzI3NkQ4RidcbiAgICB9LFxuICAgIHBhZGRpbmdTdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAyLFxuICAgICAgICBjb2xvcjogJyNEODE3MDYnXG4gICAgfSxcbiAgICBjZW50ZXIgPSBbMjIuMjY3MCwgMTE0LjE4OF0sXG4gICAgem9vbSA9IDE3LFxuICAgIG1hcCwgdmVydGljZXMsIHJlc3VsdDtcblxubWFwID0gZ2xvYmFsLm1hcCA9IEwubWFwKCdtYXAnLCB7XG4gIGVkaXRhYmxlOiB0cnVlLFxuICBtYXhab29tOiAyMixcbiAgY3JzOiBMLkNSUy5FUFNHNDMyNlxufSkuc2V0VmlldyhjZW50ZXIsIHpvb20pO1xuXG5tYXAuYWRkQ29udHJvbChuZXcgTC5OZXdQb2x5Z29uQ29udHJvbCh7XG4gIGNhbGxiYWNrOiBtYXAuZWRpdFRvb2xzLnN0YXJ0UG9seWdvblxufSkpO1xubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKCkuYWRkVG8obWFwKTtcbnZhciByZXN1bHRzID0gZ2xvYmFsLnJlc3VsdHMgPSBMLmdlb0pzb24obnVsbCwge1xuICBzdHlsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiBtYXJnaW5TdHlsZTtcbiAgfVxufSkuYWRkVG8obWFwKTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5cbmZ1bmN0aW9uIHJ1biAobWFyZ2luKSB7XG4gIHJlc3VsdHMuY2xlYXJMYXllcnMoKTtcbiAgbGF5ZXJzLmVhY2hMYXllcihmdW5jdGlvbihsYXllcikge1xuICAgIHZhciBnaiA9IGxheWVyLnRvR2VvSlNPTigpO1xuICAgIGNvbnNvbGUubG9nKGdqLCBtYXJnaW4pO1xuICAgIHZhciBzaGFwZSA9IHByb2plY3QoZ2osIGZ1bmN0aW9uKGNvb3JkKSB7XG4gICAgICB2YXIgcHQgPSBtYXAub3B0aW9ucy5jcnMubGF0TG5nVG9Qb2ludChMLmxhdExuZyhjb29yZC5zbGljZSgpLnJldmVyc2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtwdC54LCBwdC55XTtcbiAgICB9KTtcblxuICAgIGNvbnNvbGUubG9nKHNoYXBlKTtcbiAgICB2YXIgbWFyZ2luZWQ7XG4gICAgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnTGluZVN0cmluZycsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IE9mZnNldC5saW5lT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzLCBtYXJnaW4pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdKS5tYXJnaW4obWFyZ2luKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuY29uc29sZS5sb2cobWFyZ2luZWQpO1xuICAgIHJlc3VsdHMuYWRkRGF0YShwcm9qZWN0KG1hcmdpbmVkLCBmdW5jdGlvbihwdCkge1xuICAgICAgdmFyIGxsID0gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwdC5zbGljZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW2xsLmxuZywgbGwubGF0XTtcbiAgICB9KSk7XG4gIH0pO1xufVxuXG5cblxuXG5cbi8vIHZhciBwb2x5Z29uID0gZGF0YS5mZWF0dXJlc1swXTtcblxuLy8gLy8gTC50aWxlTGF5ZXIoJ2h0dHA6Ly97c30udGlsZS5vc20ub3JnL3t6fS97eH0ve3l9LnBuZycsIHtcbi8vIC8vICAgICBhdHRyaWJ1dGlvbjogJyZjb3B5OyAnICtcbi8vIC8vICAgICAgICAgJzxhIGhyZWY9XCJodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnXG4vLyAvLyB9KS5hZGRUbyhtYXApO1xuXG4vLyBjb25zb2xlLmxvZyhwb2x5Z29uKTtcblxuLy8gZnVuY3Rpb24gcHJvamVjdChsbCkge1xuLy8gICB2YXIgcHQgPSBtYXAub3B0aW9ucy5jcnMubGF0TG5nVG9Qb2ludChMLmxhdExuZyhsbC5zbGljZSgpLnJldmVyc2UoKSksIG1hcC5nZXRab29tKCkpO1xuLy8gICByZXR1cm4gW3B0LngsIHB0LnldO1xuLy8gfVxuXG4vLyB2ZXJ0aWNlcyA9IHBvbHlnb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0ubWFwKHByb2plY3QpO1xuXG4vLyBjb25zb2xlLnRpbWUoJ21hcmdpbicpO1xuLy8gcmVzdWx0ID0gbmV3IE9mZnNldCh2ZXJ0aWNlcykubWFyZ2luKDQwKTtcbi8vIGNvbnNvbGUudGltZUVuZCgnbWFyZ2luJyk7XG4vLyByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKHApIHtcbi8vICAgcmV0dXJuIG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocCksIG1hcC5nZXRab29tKCkpO1xuLy8gfSk7XG5cbi8vIEwucG9seWdvbihyZXN1bHQsIG1hcmdpblN0eWxlKS5hZGRUbyhtYXApO1xuLy8gY29uc29sZS50aW1lKCdwYWRkaW5nJyk7XG4vLyByZXN1bHQgPSBuZXcgT2Zmc2V0KHZlcnRpY2VzKS5wYWRkaW5nKDEwKTtcbi8vIGNvbnNvbGUudGltZUVuZCgncGFkZGluZycpO1xuLy8gcmVzdWx0ID0gcmVzdWx0Lm1hcChmdW5jdGlvbihwKSB7XG4vLyAgICAgcmV0dXJuIG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocCksIG1hcC5nZXRab29tKCkpO1xuLy8gfSk7XG5cbi8vIEwucG9seWdvbihyZXN1bHQsIHBhZGRpbmdTdHlsZSkuYWRkVG8obGF5ZXJzKTtcblxuLy8gdmFyIGxpbmVQb2ludHMgPSBkYXRhLmZlYXR1cmVzWzFdLmdlb21ldHJ5LmNvb3JkaW5hdGVzLm1hcChwcm9qZWN0KTsiXX0=
},{"../src/offset":27,"../test/fixtures/polygon_polyline.json":29,"./offset_control":2,"./polygon_control":3,"geojson-project":8}],2:[function(require,module,exports){
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
        '<input type="submit" value="Run">', '<input name="clear" type="button" value="Clear layers">',
      '</form>'].join('');
    var form = container.querySelector('form');
    L.DomEvent
      .on(form, 'submit', function (evt) {
        L.DomEvent.stop(evt);
        var margin = parseFloat(form['margin'].value);
        this.options.callback(margin);
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
},{}],3:[function(require,module,exports){
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
},{}],4:[function(require,module,exports){
module.exports = {
    RBTree: require('./lib/rbtree'),
    BinTree: require('./lib/bintree')
};

},{"./lib/bintree":5,"./lib/rbtree":6}],5:[function(require,module,exports){

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


},{"./treebase":7}],6:[function(require,module,exports){

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

},{"./treebase":7}],7:[function(require,module,exports){

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


},{}],8:[function(require,module,exports){

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

},{}],9:[function(require,module,exports){
var Polygon = require('./polygon');

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

},{"./polygon":12}],10:[function(require,module,exports){
var clip = require('./clip');

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

},{"./clip":9}],11:[function(require,module,exports){
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

},{}],12:[function(require,module,exports){
var Vertex = require('./vertex');
var Intersection = require('./intersection');

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

},{"./intersection":11,"./vertex":13}],13:[function(require,module,exports){
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

},{}],14:[function(require,module,exports){
module.exports = require('./src/index');

},{"./src/index":19}],15:[function(require,module,exports){
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

},{"./signed_area":21}],16:[function(require,module,exports){
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

},{"./compare_events":15,"./equals":18,"./signed_area":21}],17:[function(require,module,exports){
module.exports = { 
  NORMAL:               0, 
  NON_CONTRIBUTING:     1, 
  SAME_TRANSITION:      2, 
  DIFFERENT_TRANSITION: 3
};

},{}],18:[function(require,module,exports){
module.exports = function equals(p1, p2) {
  return p1[0] === p2[0] && p1[1] === p2[1];
};
},{}],19:[function(require,module,exports){
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

},{"./compare_events":15,"./compare_segments":16,"./edge_type":17,"./equals":18,"./segment_intersection":20,"./sweep_event":22,"bintrees":4,"tinyqueue":23}],20:[function(require,module,exports){
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

},{}],21:[function(require,module,exports){
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

},{}],22:[function(require,module,exports){
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

},{"./edge_type":17,"./signed_area":21}],23:[function(require,module,exports){
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

},{}],24:[function(require,module,exports){
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

},{}],25:[function(require,module,exports){
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

},{}],26:[function(require,module,exports){
// https://github.com/tmcw/line-offset/
var displace = require('./point_displace');
var epsilon  = 1e-7;

function clone(_) {
    console.log('clone', _);
    return _.slice();
}

function explement_reflex_angle(angle) {
    if      (angle > Math.PI)  return angle - 2 * Math.PI;
    else if (angle < -Math.PI) return angle + 2 * Math.PI;
    else                       return angle;
}


function findVt(u1, u2, v1, v2) {
    var dx = v1[0] - u1[0],
        dy = v1[1] - u1[1],
        ux = u2[0] - u1[0],
        uy = u2[1] - u1[1],
        vx = v2[0] - v1[0],
        vy = v2[1] - v1[1],
        up, dn;

    up = ux * dy - dx * uy;
    dn = vx * uy - ux * vy;
    return up / dn;
}


function findUt(u1, u2, v1, v2, vt) {
    var dx = v1[0] - u1[0],
        dy = v1[1] - u1[1],
        ux = u2[0] - u1[0],
        uy = u2[1] - u1[1],
        vx = v2[0] - v1[0],
        vy = v2[1] - v1[1],
        up, dn;

    if (ux < -epsilon || ux > epsilon) {
        up = ux * dy - dx * uy;
        dn = vx * uy - ux * vy;
        return (vt * vx + dx) / ux;
    }

    if (uy < -epsilon || uy > epsilon) {
        up = uy * dx - dy * ux;
        dn = vy * ux - uy * vx;
        return (vt * vy + dy) / uy;
    }
}


function intersection(u1, u2, ut, v1, v2, vt) {
    var dx = v1[0] - u1[0],
        dy = v1[1] - u1[1],
        ux = u2[0] - u1[0],
        uy = u2[1] - u1[1],
        vx = v2[0] - v1[0],
        vy = v2[1] - v1[1],
        up, dn;
    // the first line is not vertical
    if (ux < -epsilon || ux > epsilon) {
        up = ux * dy - dx * uy;
        dn = vx * uy - ux * vy;
        return !(dn > -epsilon && dn < epsilon);
    }
    // the first line is not horizontal
    if (uy < -epsilon || uy > epsilon) {
        up = uy * dx - dy * ux;
        dn = vy * ux - uy * vx;
        return !(dn > -epsilon && dn < epsilon);
    }
    // the first line is too short
    return false;
}

module.exports.offset = function(vertices, offset) {
    if (offset === 0 || vertices.length < 3) return vertices;

    var output = [],
        v1 = vertices[0],
        v2 = vertices[1],
        half_turn_segments = 16,
        threshold = 8,
        angle_a = 0,
        angle_b = Math.atan2(v2[1] - v1[1], v2[0] - v1[0]),
        w = [0, 0],
        joint_angle;

    // first vertex
    v1 = displace.a(v1, angle_b, offset);
    output.push(clone(v1));

    // Sometimes when the first segment is too short, it causes ugly
    // curls at the beginning of the line. To avoid this, we make up
    // a fake vertex two offset-lengths before the first, and expect
    // intersection detection smoothes it out.
    var pre_first = displace.dx(v1, -2 * Math.abs(offset), 0, angle_b);

    for (var i = 0; i < vertices.length - 1; i++) {
        v1 = vertices[i];
        v2 = vertices[i + 1];

        angle_a = angle_b;
        angle_b = Math.atan2(v2[1] - v1[1], v2[0] - v1[0]);
        joint_angle = explement_reflex_angle(angle_b - angle_a);

        var half_turns = half_turn_segments * Math.abs(joint_angle),
            bulge_steps = 0;

        if (offset < 0) {
            if (joint_angle > 0) {
                joint_angle = joint_angle - 2 * Math.PI;
            } else {
                bulge_steps = 1 + Math.floor(half_turns / Math.PI);
            }
        } else {
            if (joint_angle < 0) {
                joint_angle = joint_angle + 2 * Math.PI;
            } else {
                bulge_steps = 1 + Math.floor(half_turns / Math.PI);
            }
        }

        w = displace.ua(v1, angle_a, offset);
        output.push(clone(w));

        for (var s = 0; ++s < bulge_steps; ) {
            w = displace.ua(v1,
                angle_a + (joint_angle * s) / bulge_steps,
                offset);
            output.push(clone(w));
        }

        v1 = displace.a(v1, angle_b, offset);
    }

    // last vertex
    output.push(displace.a(v1, angle_b, offset));

    console.log(output, offset, threshold);
    //return selectVertices(output, offset, threshold);
     return output;
};


function selectVertices(output, offset, threshold) {
    var vx = [];

    for (var pos = 0; pos + 1 < output.length; pos++) {

        var pre = output[pos];
        var cur = output[++pos];

        var check_dist = offset * threshold,
            check_dist2 = check_dist * check_dist,
            t = 1, vt, ut;

        for (var i = pos; i + 1 < output.length; ++i) {
            var u0 = output[i],
                u1 = output[i + 1],
                dx = u0[0] - cur[0],
                dy = u0[1] - cur[1];

            if (dx * dx + dy * dy > check_dist2) break;
            if (!intersection(pre, cur, vt, u0, u1, ut)) {
                continue;
            } else {
                vt = findVt(pre, cur, u0, u1);
                ut = findUt(pre, cur, u0, u1, vt);
            }
            if (vt < 0 || vt > t || ut < 0 || ut > 1) continue;
            t = vt;
            pos = i + 1;
        }

        output[pos] = [
            pre[0] + t * (cur[0] - pre[0]),
            pre[1] + t * (cur[1] - pre[1])
        ];

        vx.push(clone(output[pos]));
    }

    return vx;
}
},{"./point_displace":28}],27:[function(require,module,exports){
var GreinerHormann = require('greiner-hormann');
var Edge = require('./edge');
var intersection = require('./intersection');
var martinez = require('martinez-polygon-clipping');

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
    this._arcSegments = arcSegments !== undefined ? arcSegments : 5;
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
    // union = GreinerHormann.union(vertices, vertices);
    // union = vertices;
    // vertices = union ? union[0] : vertices;

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

    if (dist === 0) {
        for (i = 0, len = offsetEdges.length; i < len; i++) {
            vertices.push(offsetEdges[i].current, offsetEdges[i].next);
        }
        return vertices;
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

    // union = GreinerHormann.union(vertices, vertices);
    // if (union) {
    //     union = union[0];
    //     // that's the toll
    //     vertices = union.slice(0, union.length / 2);
    // }

    vertices = this.ensureLastPoint(vertices);

    //console.log(JSON.stringify(vertices, 0, 2));
    console.time('martinez');
    vertices = martinez.union([vertices], [JSON.parse(JSON.stringify(vertices))]);
    console.timeEnd('martinez');
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


Offset.lineOffset = require('./line_offset').offset;

module.exports = Offset;

},{"./edge":24,"./intersection":25,"./line_offset":26,"greiner-hormann":10,"martinez-polygon-clipping":14}],28:[function(require,module,exports){
// https://github.com/tmcw/point-displace/
var sin = Math.sin;
var cos = Math.cos;


module.exports.dx = function(v, dx, dy, a) {
  return [
    v[0] + (dx * cos(a) - dy * sin(a)),
    v[1] + (dx * sin(a) + dy * cos(a))
  ];
};


module.exports.a = function(v, a, offset) {
  return [
    v[0] + (offset * sin(a)),
    v[1] - (offset * cos(a))
  ];
};


module.exports.ua = function(u, a, offset) {
  return [
    u[0] + (offset * sin(a)),
    u[1] - (offset * cos(a))
  ];
};


module.exports.ab = function(v, a, b, offset) {
  var sa = offset * sin(a),
      ca = offset * cos(a),
      h = tan(0.5 * (b - a));
  return [
    v[0] + sa + h * ca,
    v[1] - ca + h * sa
  ];
};

},{}],29:[function(require,module,exports){
module.exports={
  "type": "FeatureCollection",
  "features": [
    {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates":
          [[
  [
    114.18707728385925,
    22.266574756525035
  ],
  [
    114.18727576732635,
    22.26637618044986
  ],
  [
    114.187570810318,
    22.266693902034877
  ],
  [
    114.18762981891632,
    22.266718724003326
  ],
  [
    114.18781220912933,
    22.2665846853214
  ],
  [
    114.18817162513733,
    22.266435753301998
  ],
  [
    114.18833792209625,
    22.26687758449714
  ],
  [
    114.18824672698975,
    22.26690737081966
  ],
  [
    114.18818771839142,
    22.266788225491567
  ],
  [
    114.18814480304718,
    22.26680808305329
  ],
  [
    114.18817698955536,
    22.26687758449714
  ],
  [
    114.18813407421112,
    22.26689247765919
  ],
  [
    114.18818235397339,
    22.266952050291525
  ],
  [
    114.18812334537506,
    22.266991765365663
  ],
  [
    114.18804824352264,
    22.266862691333507
  ],
  [
    114.18795168399811,
    22.26701162289852
  ],
  [
    114.18813407421112,
    22.26718041181389
  ],
  [
    114.18835937976837,
    22.26696694344565
  ],
  [
    114.18842375278473,
    22.267016587281276
  ],
  [
    114.18805897235869,
    22.26739387985647
  ],
  [
    114.18762445449829,
    22.267061266718283
  ],
  [
    114.18740451335907,
    22.26695701467642
  ],
  [
    114.18745815753937,
    22.26690240643301
  ]
]]

      }
    },
    {
      "type": "Feature",
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            114.18617069721222,
            22.2687888606752
          ],
          [
            114.18628334999084,
            22.268679645596883
          ],
          [
            114.18651401996613,
            22.268317249498995
          ],
          [
            114.18673396110535,
            22.26794492376338
          ],
          [
            114.18693244457243,
            22.267602383211596
          ],
          [
            114.1867446899414,
            22.267488202841317
          ],
          [
            114.1867446899414,
            22.267388915487086
          ],
          [
            114.18685734272003,
            22.26722012682322
          ],
          [
            114.18712019920349,
            22.267249913072813
          ],
          [
            114.18721675872803,
            22.267254877447133
          ],
          [
            114.18759226799011,
            22.267458416642448
          ],
          [
            114.18716311454773,
            22.268183212348312
          ]
        ]
      }
    }
  ]
}
},{}]},{},[1])
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9hcHAuanMiLCJleGFtcGxlL29mZnNldF9jb250cm9sLmpzIiwiZXhhbXBsZS9wb2x5Z29uX2NvbnRyb2wuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL2JpbnRyZWUuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL3JidHJlZS5qcyIsIm5vZGVfbW9kdWxlcy9iaW50cmVlcy9saWIvdHJlZWJhc2UuanMiLCJub2RlX21vZHVsZXMvZ2VvanNvbi1wcm9qZWN0L2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2dyZWluZXItaG9ybWFubi9zcmMvY2xpcC5qcyIsIm5vZGVfbW9kdWxlcy9ncmVpbmVyLWhvcm1hbm4vc3JjL2dyZWluZXItaG9ybWFubi5qcyIsIm5vZGVfbW9kdWxlcy9ncmVpbmVyLWhvcm1hbm4vc3JjL2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9ncmVpbmVyLWhvcm1hbm4vc3JjL3BvbHlnb24uanMiLCJub2RlX21vZHVsZXMvZ3JlaW5lci1ob3JtYW5uL3NyYy92ZXJ0ZXguanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9jb21wYXJlX2V2ZW50cy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9jb21wYXJlX3NlZ21lbnRzLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2VkZ2VfdHlwZS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9lcXVhbHMuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvc2VnbWVudF9pbnRlcnNlY3Rpb24uanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvc2lnbmVkX2FyZWEuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvc3dlZXBfZXZlbnQuanMiLCJub2RlX21vZHVsZXMvdGlueXF1ZXVlL2luZGV4LmpzIiwic3JjL2VkZ2UuanMiLCJzcmMvaW50ZXJzZWN0aW9uLmpzIiwic3JjL2xpbmVfb2Zmc2V0LmpzIiwic3JjL29mZnNldC5qcyIsInNyYy9wb2ludF9kaXNwbGFjZS5qcyIsInRlc3QvZml4dHVyZXMvcG9seWdvbl9wb2x5bGluZS5qc29uIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzSUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaFNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0lBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2b0JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzdJQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM5R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMvRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDM0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIE9mZnNldCA9IHJlcXVpcmUoJy4uL3NyYy9vZmZzZXQnKTtcbnJlcXVpcmUoJy4vcG9seWdvbl9jb250cm9sJyk7XG52YXIgT2Zmc2V0Q29udHJvbCA9IHJlcXVpcmUoJy4vb2Zmc2V0X2NvbnRyb2wnKTtcbnZhciBkYXRhID0gcmVxdWlyZSgnLi4vdGVzdC9maXh0dXJlcy9wb2x5Z29uX3BvbHlsaW5lLmpzb24nKTtcbnZhciBwcm9qZWN0ID0gcmVxdWlyZSgnZ2VvanNvbi1wcm9qZWN0Jyk7XG5cbnZhciBzdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAzLFxuICAgICAgICBjb2xvcjogJyM0OGYnLFxuICAgICAgICBvcGFjaXR5OiAwLjgsXG4gICAgICAgIGRhc2hBcnJheTogWzIsIDRdXG4gICAgfSxcbiAgICBtYXJnaW5TdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAyLFxuICAgICAgICBjb2xvcjogJyMyNzZEOEYnXG4gICAgfSxcbiAgICBwYWRkaW5nU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjRDgxNzA2J1xuICAgIH0sXG4gICAgY2VudGVyID0gWzIyLjI2NzAsIDExNC4xODhdLFxuICAgIHpvb20gPSAxNyxcbiAgICBtYXAsIHZlcnRpY2VzLCByZXN1bHQ7XG5cbm1hcCA9IGdsb2JhbC5tYXAgPSBMLm1hcCgnbWFwJywge1xuICBlZGl0YWJsZTogdHJ1ZSxcbiAgbWF4Wm9vbTogMjIsXG4gIGNyczogTC5DUlMuRVBTRzQzMjZcbn0pLnNldFZpZXcoY2VudGVyLCB6b29tKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld0xpbmVDb250cm9sKHtcbiAgY2FsbGJhY2s6IG1hcC5lZGl0VG9vbHMuc3RhcnRQb2x5bGluZVxufSkpO1xuXG52YXIgbGF5ZXJzID0gZ2xvYmFsLmxheWVycyA9IEwuZ2VvSnNvbigpLmFkZFRvKG1hcCk7XG52YXIgcmVzdWx0cyA9IGdsb2JhbC5yZXN1bHRzID0gTC5nZW9Kc29uKG51bGwsIHtcbiAgc3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFyZ2luU3R5bGU7XG4gIH1cbn0pLmFkZFRvKG1hcCk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBPZmZzZXRDb250cm9sKHtcbiAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGxheWVycy5jbGVhckxheWVycygpO1xuICB9LFxuICBjYWxsYmFjazogcnVuXG59KSk7XG5cbm1hcC5vbignZWRpdGFibGU6Y3JlYXRlZCcsIGZ1bmN0aW9uKGV2dCkge1xuICBsYXllcnMuYWRkTGF5ZXIoZXZ0LmxheWVyKTtcbiAgZXZ0LmxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoKGUub3JpZ2luYWxFdmVudC5jdHJsS2V5IHx8IGUub3JpZ2luYWxFdmVudC5tZXRhS2V5KSAmJiB0aGlzLmVkaXRFbmFibGVkKCkpIHtcbiAgICAgIHRoaXMuZWRpdG9yLm5ld0hvbGUoZS5sYXRsbmcpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuXG5mdW5jdGlvbiBydW4gKG1hcmdpbikge1xuICByZXN1bHRzLmNsZWFyTGF5ZXJzKCk7XG4gIGxheWVycy5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgZ2ogPSBsYXllci50b0dlb0pTT04oKTtcbiAgICBjb25zb2xlLmxvZyhnaiwgbWFyZ2luKTtcbiAgICB2YXIgc2hhcGUgPSBwcm9qZWN0KGdqLCBmdW5jdGlvbihjb29yZCkge1xuICAgICAgdmFyIHB0ID0gbWFwLm9wdGlvbnMuY3JzLmxhdExuZ1RvUG9pbnQoTC5sYXRMbmcoY29vcmQuc2xpY2UoKS5yZXZlcnNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbiAgICAgIHJldHVybiBbcHQueCwgcHQueV07XG4gICAgfSk7XG5cbiAgICBjb25zb2xlLmxvZyhzaGFwZSk7XG4gICAgdmFyIG1hcmdpbmVkO1xuICAgIGlmIChnai5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ0xpbmVTdHJpbmcnLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBPZmZzZXQubGluZU9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcywgbWFyZ2luKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH0gZWxzZSB7XG4gICAgICBtYXJnaW5lZCA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlc1swXSkubWFyZ2luKG1hcmdpbilcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9XG5cbmNvbnNvbGUubG9nKG1hcmdpbmVkKTtcbiAgICByZXN1bHRzLmFkZERhdGEocHJvamVjdChtYXJnaW5lZCwgZnVuY3Rpb24ocHQpIHtcbiAgICAgIHZhciBsbCA9IG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocHQuc2xpY2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtsbC5sbmcsIGxsLmxhdF07XG4gICAgfSkpO1xuICB9KTtcbn1cblxuXG5cblxuXG4vLyB2YXIgcG9seWdvbiA9IGRhdGEuZmVhdHVyZXNbMF07XG5cbi8vIC8vIEwudGlsZUxheWVyKCdodHRwOi8ve3N9LnRpbGUub3NtLm9yZy97en0ve3h9L3t5fS5wbmcnLCB7XG4vLyAvLyAgICAgYXR0cmlidXRpb246ICcmY29weTsgJyArXG4vLyAvLyAgICAgICAgICc8YSBocmVmPVwiaHR0cDovL29zbS5vcmcvY29weXJpZ2h0XCI+T3BlblN0cmVldE1hcDwvYT4gY29udHJpYnV0b3JzJ1xuLy8gLy8gfSkuYWRkVG8obWFwKTtcblxuLy8gY29uc29sZS5sb2cocG9seWdvbik7XG5cbi8vIGZ1bmN0aW9uIHByb2plY3QobGwpIHtcbi8vICAgdmFyIHB0ID0gbWFwLm9wdGlvbnMuY3JzLmxhdExuZ1RvUG9pbnQoTC5sYXRMbmcobGwuc2xpY2UoKS5yZXZlcnNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbi8vICAgcmV0dXJuIFtwdC54LCBwdC55XTtcbi8vIH1cblxuLy8gdmVydGljZXMgPSBwb2x5Z29uLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdLm1hcChwcm9qZWN0KTtcblxuLy8gY29uc29sZS50aW1lKCdtYXJnaW4nKTtcbi8vIHJlc3VsdCA9IG5ldyBPZmZzZXQodmVydGljZXMpLm1hcmdpbig0MCk7XG4vLyBjb25zb2xlLnRpbWVFbmQoJ21hcmdpbicpO1xuLy8gcmVzdWx0ID0gcmVzdWx0Lm1hcChmdW5jdGlvbihwKSB7XG4vLyAgIHJldHVybiBtYXAub3B0aW9ucy5jcnMucG9pbnRUb0xhdExuZyhMLnBvaW50KHApLCBtYXAuZ2V0Wm9vbSgpKTtcbi8vIH0pO1xuXG4vLyBMLnBvbHlnb24ocmVzdWx0LCBtYXJnaW5TdHlsZSkuYWRkVG8obWFwKTtcbi8vIGNvbnNvbGUudGltZSgncGFkZGluZycpO1xuLy8gcmVzdWx0ID0gbmV3IE9mZnNldCh2ZXJ0aWNlcykucGFkZGluZygxMCk7XG4vLyBjb25zb2xlLnRpbWVFbmQoJ3BhZGRpbmcnKTtcbi8vIHJlc3VsdCA9IHJlc3VsdC5tYXAoZnVuY3Rpb24ocCkge1xuLy8gICAgIHJldHVybiBtYXAub3B0aW9ucy5jcnMucG9pbnRUb0xhdExuZyhMLnBvaW50KHApLCBtYXAuZ2V0Wm9vbSgpKTtcbi8vIH0pO1xuXG4vLyBMLnBvbHlnb24ocmVzdWx0LCBwYWRkaW5nU3R5bGUpLmFkZFRvKGxheWVycyk7XG5cbi8vIHZhciBsaW5lUG9pbnRzID0gZGF0YS5mZWF0dXJlc1sxXS5nZW9tZXRyeS5jb29yZGluYXRlcy5tYXAocHJvamVjdCk7XG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkltVjRZVzF3YkdVdllYQndMbXB6SWwwc0ltNWhiV1Z6SWpwYlhTd2liV0Z3Y0dsdVozTWlPaUk3UVVGQlFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CSWl3aVptbHNaU0k2SW1kbGJtVnlZWFJsWkM1cWN5SXNJbk52ZFhKalpWSnZiM1FpT2lJaUxDSnpiM1Z5WTJWelEyOXVkR1Z1ZENJNld5SjJZWElnVDJabWMyVjBJRDBnY21WeGRXbHlaU2duTGk0dmMzSmpMMjltWm5ObGRDY3BPMXh1Y21WeGRXbHlaU2duTGk5d2IyeDVaMjl1WDJOdmJuUnliMnduS1R0Y2JuWmhjaUJQWm1aelpYUkRiMjUwY205c0lEMGdjbVZ4ZFdseVpTZ25MaTl2Wm1aelpYUmZZMjl1ZEhKdmJDY3BPMXh1ZG1GeUlHUmhkR0VnUFNCeVpYRjFhWEpsS0NjdUxpOTBaWE4wTDJacGVIUjFjbVZ6TDNCdmJIbG5iMjVmY0c5c2VXeHBibVV1YW5OdmJpY3BPMXh1ZG1GeUlIQnliMnBsWTNRZ1BTQnlaWEYxYVhKbEtDZG5aVzlxYzI5dUxYQnliMnBsWTNRbktUdGNibHh1ZG1GeUlITjBlV3hsSUQwZ2UxeHVJQ0FnSUNBZ0lDQjNaV2xuYUhRNklETXNYRzRnSUNBZ0lDQWdJR052Ykc5eU9pQW5JelE0Wmljc1hHNGdJQ0FnSUNBZ0lHOXdZV05wZEhrNklEQXVPQ3hjYmlBZ0lDQWdJQ0FnWkdGemFFRnljbUY1T2lCYk1pd2dORjFjYmlBZ0lDQjlMRnh1SUNBZ0lHMWhjbWRwYmxOMGVXeGxJRDBnZTF4dUlDQWdJQ0FnSUNCM1pXbG5hSFE2SURJc1hHNGdJQ0FnSUNBZ0lHTnZiRzl5T2lBbkl6STNOa1E0UmlkY2JpQWdJQ0I5TEZ4dUlDQWdJSEJoWkdScGJtZFRkSGxzWlNBOUlIdGNiaUFnSUNBZ0lDQWdkMlZwWjJoME9pQXlMRnh1SUNBZ0lDQWdJQ0JqYjJ4dmNqb2dKeU5FT0RFM01EWW5YRzRnSUNBZ2ZTeGNiaUFnSUNCalpXNTBaWElnUFNCYk1qSXVNalkzTUN3Z01URTBMakU0T0Ywc1hHNGdJQ0FnZW05dmJTQTlJREUzTEZ4dUlDQWdJRzFoY0N3Z2RtVnlkR2xqWlhNc0lISmxjM1ZzZER0Y2JseHViV0Z3SUQwZ1oyeHZZbUZzTG0xaGNDQTlJRXd1YldGd0tDZHRZWEFuTENCN1hHNGdJR1ZrYVhSaFlteGxPaUIwY25WbExGeHVJQ0J0WVhoYWIyOXRPaUF5TWl4Y2JpQWdZM0p6T2lCTUxrTlNVeTVGVUZOSE5ETXlObHh1ZlNrdWMyVjBWbWxsZHloalpXNTBaWElzSUhwdmIyMHBPMXh1WEc1dFlYQXVZV1JrUTI5dWRISnZiQ2h1WlhjZ1RDNU9aWGRRYjJ4NVoyOXVRMjl1ZEhKdmJDaDdYRzRnSUdOaGJHeGlZV05yT2lCdFlYQXVaV1JwZEZSdmIyeHpMbk4wWVhKMFVHOXNlV2R2Ymx4dWZTa3BPMXh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUV3dVRtVjNUR2x1WlVOdmJuUnliMndvZTF4dUlDQmpZV3hzWW1GamF6b2diV0Z3TG1Wa2FYUlViMjlzY3k1emRHRnlkRkJ2Ykhsc2FXNWxYRzU5S1NrN1hHNWNiblpoY2lCc1lYbGxjbk1nUFNCbmJHOWlZV3d1YkdGNVpYSnpJRDBnVEM1blpXOUtjMjl1S0NrdVlXUmtWRzhvYldGd0tUdGNiblpoY2lCeVpYTjFiSFJ6SUQwZ1oyeHZZbUZzTG5KbGMzVnNkSE1nUFNCTUxtZGxiMHB6YjI0b2JuVnNiQ3dnZTF4dUlDQnpkSGxzWlRvZ1puVnVZM1JwYjI0b1ptVmhkSFZ5WlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ0WVhKbmFXNVRkSGxzWlR0Y2JpQWdmVnh1ZlNrdVlXUmtWRzhvYldGd0tUdGNibHh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUU5bVpuTmxkRU52Ym5SeWIyd29lMXh1SUNCamJHVmhjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnYkdGNVpYSnpMbU5zWldGeVRHRjVaWEp6S0NrN1hHNGdJSDBzWEc0Z0lHTmhiR3hpWVdOck9pQnlkVzVjYm4wcEtUdGNibHh1YldGd0xtOXVLQ2RsWkdsMFlXSnNaVHBqY21WaGRHVmtKeXdnWm5WdVkzUnBiMjRvWlhaMEtTQjdYRzRnSUd4aGVXVnljeTVoWkdSTVlYbGxjaWhsZG5RdWJHRjVaWElwTzF4dUlDQmxkblF1YkdGNVpYSXViMjRvSjJOc2FXTnJKeXdnWm5WdVkzUnBiMjRvWlNrZ2UxeHVJQ0FnSUdsbUlDZ29aUzV2Y21sbmFXNWhiRVYyWlc1MExtTjBjbXhMWlhrZ2ZId2daUzV2Y21sbmFXNWhiRVYyWlc1MExtMWxkR0ZMWlhrcElDWW1JSFJvYVhNdVpXUnBkRVZ1WVdKc1pXUW9LU2tnZTF4dUlDQWdJQ0FnZEdocGN5NWxaR2wwYjNJdWJtVjNTRzlzWlNobExteGhkR3h1WnlrN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYm4wcE8xeHVYRzVjYm1aMWJtTjBhVzl1SUhKMWJpQW9iV0Z5WjJsdUtTQjdYRzRnSUhKbGMzVnNkSE11WTJ4bFlYSk1ZWGxsY25Nb0tUdGNiaUFnYkdGNVpYSnpMbVZoWTJoTVlYbGxjaWhtZFc1amRHbHZiaWhzWVhsbGNpa2dlMXh1SUNBZ0lIWmhjaUJuYWlBOUlHeGhlV1Z5TG5SdlIyVnZTbE5QVGlncE8xeHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktHZHFMQ0J0WVhKbmFXNHBPMXh1SUNBZ0lIWmhjaUJ6YUdGd1pTQTlJSEJ5YjJwbFkzUW9aMm9zSUdaMWJtTjBhVzl1S0dOdmIzSmtLU0I3WEc0Z0lDQWdJQ0IyWVhJZ2NIUWdQU0J0WVhBdWIzQjBhVzl1Y3k1amNuTXViR0YwVEc1blZHOVFiMmx1ZENoTUxteGhkRXh1WnloamIyOXlaQzV6YkdsalpTZ3BMbkpsZG1WeWMyVW9LU2tzSUcxaGNDNW5aWFJhYjI5dEtDa3BPMXh1SUNBZ0lDQWdjbVYwZFhKdUlGdHdkQzU0TENCd2RDNTVYVHRjYmlBZ0lDQjlLVHRjYmx4dUlDQWdJR052Ym5OdmJHVXViRzluS0hOb1lYQmxLVHRjYmlBZ0lDQjJZWElnYldGeVoybHVaV1E3WEc0Z0lDQWdhV1lnS0dkcUxtZGxiMjFsZEhKNUxuUjVjR1VnUFQwOUlDZE1hVzVsVTNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnYldGeVoybHVaV1FnUFNCN1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUNkR1pXRjBkWEpsSnl4Y2JpQWdJQ0FnSUNBZ1oyVnZiV1YwY25rNklIdGNiaUFnSUNBZ0lDQWdJQ0IwZVhCbE9pQW5UR2x1WlZOMGNtbHVaeWNzWEc0Z0lDQWdJQ0FnSUNBZ1kyOXZjbVJwYm1GMFpYTTZJRTltWm5ObGRDNXNhVzVsVDJabWMyVjBLSE5vWVhCbExtZGxiMjFsZEhKNUxtTnZiM0prYVc1aGRHVnpMQ0J0WVhKbmFXNHBYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmU0JsYkhObElIdGNiaUFnSUNBZ0lHMWhjbWRwYm1Wa0lEMGdlMXh1SUNBZ0lDQWdJQ0IwZVhCbE9pQW5SbVZoZEhWeVpTY3NYRzRnSUNBZ0lDQWdJR2RsYjIxbGRISjVPaUI3WEc0Z0lDQWdJQ0FnSUNBZ2RIbHdaVG9nSjFCdmJIbG5iMjRuTEZ4dUlDQWdJQ0FnSUNBZ0lHTnZiM0prYVc1aGRHVnpPaUJ1WlhjZ1QyWm1jMlYwS0hOb1lYQmxMbWRsYjIxbGRISjVMbU52YjNKa2FXNWhkR1Z6V3pCZEtTNXRZWEpuYVc0b2JXRnlaMmx1S1Z4dUlDQWdJQ0FnSUNCOVhHNGdJQ0FnSUNCOU8xeHVJQ0FnSUgxY2JseHVZMjl1YzI5c1pTNXNiMmNvYldGeVoybHVaV1FwTzF4dUlDQWdJSEpsYzNWc2RITXVZV1JrUkdGMFlTaHdjbTlxWldOMEtHMWhjbWRwYm1Wa0xDQm1kVzVqZEdsdmJpaHdkQ2tnZTF4dUlDQWdJQ0FnZG1GeUlHeHNJRDBnYldGd0xtOXdkR2x2Ym5NdVkzSnpMbkJ2YVc1MFZHOU1ZWFJNYm1jb1RDNXdiMmx1ZENod2RDNXpiR2xqWlNncEtTd2diV0Z3TG1kbGRGcHZiMjBvS1NrN1hHNGdJQ0FnSUNCeVpYUjFjbTRnVzJ4c0xteHVaeXdnYkd3dWJHRjBYVHRjYmlBZ0lDQjlLU2s3WEc0Z0lIMHBPMXh1ZlZ4dVhHNWNibHh1WEc1Y2JpOHZJSFpoY2lCd2IyeDVaMjl1SUQwZ1pHRjBZUzVtWldGMGRYSmxjMXN3WFR0Y2JseHVMeThnTHk4Z1RDNTBhV3hsVEdGNVpYSW9KMmgwZEhBNkx5OTdjMzB1ZEdsc1pTNXZjMjB1YjNKbkwzdDZmUzk3ZUgwdmUzbDlMbkJ1Wnljc0lIdGNiaTh2SUM4dklDQWdJQ0JoZEhSeWFXSjFkR2x2YmpvZ0p5WmpiM0I1T3lBbklDdGNiaTh2SUM4dklDQWdJQ0FnSUNBZ0p6eGhJR2h5WldZOVhDSm9kSFJ3T2k4dmIzTnRMbTl5Wnk5amIzQjVjbWxuYUhSY0lqNVBjR1Z1VTNSeVpXVjBUV0Z3UEM5aFBpQmpiMjUwY21saWRYUnZjbk1uWEc0dkx5QXZMeUI5S1M1aFpHUlVieWh0WVhBcE8xeHVYRzR2THlCamIyNXpiMnhsTG14dlp5aHdiMng1WjI5dUtUdGNibHh1THk4Z1puVnVZM1JwYjI0Z2NISnZhbVZqZENoc2JDa2dlMXh1THk4Z0lDQjJZWElnY0hRZ1BTQnRZWEF1YjNCMGFXOXVjeTVqY25NdWJHRjBURzVuVkc5UWIybHVkQ2hNTG14aGRFeHVaeWhzYkM1emJHbGpaU2dwTG5KbGRtVnljMlVvS1Nrc0lHMWhjQzVuWlhSYWIyOXRLQ2twTzF4dUx5OGdJQ0J5WlhSMWNtNGdXM0IwTG5nc0lIQjBMbmxkTzF4dUx5OGdmVnh1WEc0dkx5QjJaWEowYVdObGN5QTlJSEJ2YkhsbmIyNHVaMlZ2YldWMGNua3VZMjl2Y21ScGJtRjBaWE5iTUYwdWJXRndLSEJ5YjJwbFkzUXBPMXh1WEc0dkx5QmpiMjV6YjJ4bExuUnBiV1VvSjIxaGNtZHBiaWNwTzF4dUx5OGdjbVZ6ZFd4MElEMGdibVYzSUU5bVpuTmxkQ2gyWlhKMGFXTmxjeWt1YldGeVoybHVLRFF3S1R0Y2JpOHZJR052Ym5OdmJHVXVkR2x0WlVWdVpDZ25iV0Z5WjJsdUp5azdYRzR2THlCeVpYTjFiSFFnUFNCeVpYTjFiSFF1YldGd0tHWjFibU4wYVc5dUtIQXBJSHRjYmk4dklDQWdjbVYwZFhKdUlHMWhjQzV2Y0hScGIyNXpMbU55Y3k1d2IybHVkRlJ2VEdGMFRHNW5LRXd1Y0c5cGJuUW9jQ2tzSUcxaGNDNW5aWFJhYjI5dEtDa3BPMXh1THk4Z2ZTazdYRzVjYmk4dklFd3VjRzlzZVdkdmJpaHlaWE4xYkhRc0lHMWhjbWRwYmxOMGVXeGxLUzVoWkdSVWJ5aHRZWEFwTzF4dUx5OGdZMjl1YzI5c1pTNTBhVzFsS0Nkd1lXUmthVzVuSnlrN1hHNHZMeUJ5WlhOMWJIUWdQU0J1WlhjZ1QyWm1jMlYwS0habGNuUnBZMlZ6S1M1d1lXUmthVzVuS0RFd0tUdGNiaTh2SUdOdmJuTnZiR1V1ZEdsdFpVVnVaQ2duY0dGa1pHbHVaeWNwTzF4dUx5OGdjbVZ6ZFd4MElEMGdjbVZ6ZFd4MExtMWhjQ2htZFc1amRHbHZiaWh3S1NCN1hHNHZMeUFnSUNBZ2NtVjBkWEp1SUcxaGNDNXZjSFJwYjI1ekxtTnljeTV3YjJsdWRGUnZUR0YwVEc1bktFd3VjRzlwYm5Rb2NDa3NJRzFoY0M1blpYUmFiMjl0S0NrcE8xeHVMeThnZlNrN1hHNWNiaTh2SUV3dWNHOXNlV2R2YmloeVpYTjFiSFFzSUhCaFpHUnBibWRUZEhsc1pTa3VZV1JrVkc4b2JHRjVaWEp6S1R0Y2JseHVMeThnZG1GeUlHeHBibVZRYjJsdWRITWdQU0JrWVhSaExtWmxZWFIxY21Weld6RmRMbWRsYjIxbGRISjVMbU52YjNKa2FXNWhkR1Z6TG0xaGNDaHdjbTlxWldOMEtUc2lYWDA9IiwibW9kdWxlLmV4cG9ydHMgPSBMLkNvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wcmlnaHQnLFxuICAgIGRlZmF1bHRNYXJnaW46IDIwXG4gIH0sXG5cbiAgb25BZGQ6IGZ1bmN0aW9uKG1hcCkge1xuICAgIHZhciBjb250YWluZXIgPSB0aGlzLl9jb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1iYXInKTtcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUuYmFja2dyb3VuZCA9ICcjZmZmZmZmJztcbiAgICB0aGlzLl9jb250YWluZXIuc3R5bGUucGFkZGluZyA9ICcxMHB4JztcbiAgICBjb250YWluZXIuaW5uZXJIVE1MID0gW1xuICAgICAgJzxmb3JtPicsXG4gICAgICAgICc8ZGl2PicsXG4gICAgICAgICAgJzxsYWJlbD4nLFxuICAgICAgICAgICAgJzxpbnB1dCB0eXBlPVwicmFuZ2VcIiBtaW49XCIwXCIgbWF4PVwiMTAwXCIgdmFsdWU9XCInLCAgdGhpcy5vcHRpb25zLmRlZmF1bHRNYXJnaW4sICdcIiBuYW1lPVwibWFyZ2luXCI+JyxcbiAgICAgICAgICAnPC9sYWJlbD4nLFxuICAgICAgICAnPC9kaXY+JyxcbiAgICAgICAgJzxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJSdW5cIj4nLCAnPGlucHV0IG5hbWU9XCJjbGVhclwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIkNsZWFyIGxheWVyc1wiPicsXG4gICAgICAnPC9mb3JtPiddLmpvaW4oJycpO1xuICAgIHZhciBmb3JtID0gY29udGFpbmVyLnF1ZXJ5U2VsZWN0b3IoJ2Zvcm0nKTtcbiAgICBMLkRvbUV2ZW50XG4gICAgICAub24oZm9ybSwgJ3N1Ym1pdCcsIGZ1bmN0aW9uIChldnQpIHtcbiAgICAgICAgTC5Eb21FdmVudC5zdG9wKGV2dCk7XG4gICAgICAgIHZhciBtYXJnaW4gPSBwYXJzZUZsb2F0KGZvcm1bJ21hcmdpbiddLnZhbHVlKTtcbiAgICAgICAgdGhpcy5vcHRpb25zLmNhbGxiYWNrKG1hcmdpbik7XG4gICAgICB9LCB0aGlzKVxuICAgICAgLm9uKGZvcm1bJ2NsZWFyJ10sICdjbGljaycsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBMLkRvbUV2ZW50LnN0b3AoZXZ0KTtcbiAgICAgICAgdGhpcy5vcHRpb25zLmNsZWFyKCk7XG4gICAgICB9LCB0aGlzKTtcblxuICAgIEwuRG9tRXZlbnRcbiAgICAgIC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbih0aGlzLl9jb250YWluZXIpXG4gICAgICAuZGlzYWJsZVNjcm9sbFByb3BhZ2F0aW9uKHRoaXMuX2NvbnRhaW5lcik7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgfVxuXG59KTsiLCJMLkVkaXRDb250cm9sID0gTC5Db250cm9sLmV4dGVuZCh7XG5cbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAgY2FsbGJhY2s6IG51bGwsXG4gICAga2luZDogJycsXG4gICAgaHRtbDogJydcbiAgfSxcblxuICBvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xuICAgIHZhciBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1jb250cm9sIGxlYWZsZXQtYmFyJyksXG4gICAgICAgIGxpbmsgPSBMLkRvbVV0aWwuY3JlYXRlKCdhJywgJycsIGNvbnRhaW5lcik7XG5cbiAgICBsaW5rLmhyZWYgPSAnIyc7XG4gICAgbGluay50aXRsZSA9ICdDcmVhdGUgYSBuZXcgJyArIHRoaXMub3B0aW9ucy5raW5kO1xuICAgIGxpbmsuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmh0bWw7XG4gICAgTC5Eb21FdmVudC5vbihsaW5rLCAnY2xpY2snLCBMLkRvbUV2ZW50LnN0b3ApXG4gICAgICAgICAgICAgIC5vbihsaW5rLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkxBWUVSID0gdGhpcy5vcHRpb25zLmNhbGxiYWNrLmNhbGwobWFwLmVkaXRUb29scyk7XG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG59KTtcblxuTC5OZXdQb2x5Z29uQ29udHJvbCA9IEwuRWRpdENvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAga2luZDogJ3BvbHlnb24nLFxuICAgIGh0bWw6ICfilrAnXG4gIH1cbn0pO1xuXG5MLk5ld0xpbmVDb250cm9sID0gTC5FZGl0Q29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcbiAgICBraW5kOiAncG9seWxpbmUnLFxuICAgIGh0bWw6ICcvJ1xuICB9XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSQlRyZWU6IHJlcXVpcmUoJy4vbGliL3JidHJlZScpLFxuICAgIEJpblRyZWU6IHJlcXVpcmUoJy4vbGliL2JpbnRyZWUnKVxufTtcbiIsIlxudmFyIFRyZWVCYXNlID0gcmVxdWlyZSgnLi90cmVlYmFzZScpO1xuXG5mdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMubGVmdCA9IG51bGw7XG4gICAgdGhpcy5yaWdodCA9IG51bGw7XG59XG5cbk5vZGUucHJvdG90eXBlLmdldF9jaGlsZCA9IGZ1bmN0aW9uKGRpcikge1xuICAgIHJldHVybiBkaXIgPyB0aGlzLnJpZ2h0IDogdGhpcy5sZWZ0O1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyLCB2YWwpIHtcbiAgICBpZihkaXIpIHtcbiAgICAgICAgdGhpcy5yaWdodCA9IHZhbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMubGVmdCA9IHZhbDtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBCaW5UcmVlKGNvbXBhcmF0b3IpIHtcbiAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgICB0aGlzLnNpemUgPSAwO1xufVxuXG5CaW5UcmVlLnByb3RvdHlwZSA9IG5ldyBUcmVlQmFzZSgpO1xuXG4vLyByZXR1cm5zIHRydWUgaWYgaW5zZXJ0ZWQsIGZhbHNlIGlmIGR1cGxpY2F0ZVxuQmluVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgLy8gZW1wdHkgdHJlZVxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgZGlyID0gMDtcblxuICAgIC8vIHNldHVwXG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG5cbiAgICAvLyBzZWFyY2ggZG93blxuICAgIHdoaWxlKHRydWUpIHtcbiAgICAgICAgaWYobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gaW5zZXJ0IG5ldyBub2RlIGF0IHRoZSBib3R0b21cbiAgICAgICAgICAgIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgICAgIHAuc2V0X2NoaWxkKGRpciwgbm9kZSk7XG4gICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3AgaWYgZm91bmRcbiAgICAgICAgaWYodGhpcy5fY29tcGFyYXRvcihub2RlLmRhdGEsIGRhdGEpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBkaXIgPSB0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSkgPCAwO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBoZWxwZXJzXG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcbiAgICB9XG59O1xuXG4vLyByZXR1cm5zIHRydWUgaWYgcmVtb3ZlZCwgZmFsc2UgaWYgbm90IGZvdW5kXG5CaW5UcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGhlYWQgPSBuZXcgTm9kZSh1bmRlZmluZWQpOyAvLyBmYWtlIHRyZWUgcm9vdFxuICAgIHZhciBub2RlID0gaGVhZDtcbiAgICBub2RlLnJpZ2h0ID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgcCA9IG51bGw7IC8vIHBhcmVudFxuICAgIHZhciBmb3VuZCA9IG51bGw7IC8vIGZvdW5kIGl0ZW1cbiAgICB2YXIgZGlyID0gMTtcblxuICAgIHdoaWxlKG5vZGUuZ2V0X2NoaWxkKGRpcikgIT09IG51bGwpIHtcbiAgICAgICAgcCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCBub2RlLmRhdGEpO1xuICAgICAgICBkaXIgPSBjbXAgPiAwO1xuXG4gICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgZm91bmQgPSBub2RlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYoZm91bmQgIT09IG51bGwpIHtcbiAgICAgICAgZm91bmQuZGF0YSA9IG5vZGUuZGF0YTtcbiAgICAgICAgcC5zZXRfY2hpbGQocC5yaWdodCA9PT0gbm9kZSwgbm9kZS5nZXRfY2hpbGQobm9kZS5sZWZ0ID09PSBudWxsKSk7XG5cbiAgICAgICAgdGhpcy5fcm9vdCA9IGhlYWQucmlnaHQ7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJpblRyZWU7XG5cbiIsIlxudmFyIFRyZWVCYXNlID0gcmVxdWlyZSgnLi90cmVlYmFzZScpO1xuXG5mdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMubGVmdCA9IG51bGw7XG4gICAgdGhpcy5yaWdodCA9IG51bGw7XG4gICAgdGhpcy5yZWQgPSB0cnVlO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIpIHtcbiAgICByZXR1cm4gZGlyID8gdGhpcy5yaWdodCA6IHRoaXMubGVmdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldF9jaGlsZCA9IGZ1bmN0aW9uKGRpciwgdmFsKSB7XG4gICAgaWYoZGlyKSB7XG4gICAgICAgIHRoaXMucmlnaHQgPSB2YWw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmxlZnQgPSB2YWw7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gUkJUcmVlKGNvbXBhcmF0b3IpIHtcbiAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgICB0aGlzLnNpemUgPSAwO1xufVxuXG5SQlRyZWUucHJvdG90eXBlID0gbmV3IFRyZWVCYXNlKCk7XG5cbi8vIHJldHVybnMgdHJ1ZSBpZiBpbnNlcnRlZCwgZmFsc2UgaWYgZHVwbGljYXRlXG5SQlRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmV0ID0gZmFsc2U7XG5cbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGVtcHR5IHRyZWVcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcblxuICAgICAgICB2YXIgZGlyID0gMDtcbiAgICAgICAgdmFyIGxhc3QgPSAwO1xuXG4gICAgICAgIC8vIHNldHVwXG4gICAgICAgIHZhciBncCA9IG51bGw7IC8vIGdyYW5kcGFyZW50XG4gICAgICAgIHZhciBnZ3AgPSBoZWFkOyAvLyBncmFuZC1ncmFuZC1wYXJlbnRcbiAgICAgICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICAgICAgICBnZ3AucmlnaHQgPSB0aGlzLl9yb290O1xuXG4gICAgICAgIC8vIHNlYXJjaCBkb3duXG4gICAgICAgIHdoaWxlKHRydWUpIHtcbiAgICAgICAgICAgIGlmKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBpbnNlcnQgbmV3IG5vZGUgYXQgdGhlIGJvdHRvbVxuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgICAgICAgICBwLnNldF9jaGlsZChkaXIsIG5vZGUpO1xuICAgICAgICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGlzX3JlZChub2RlLmxlZnQpICYmIGlzX3JlZChub2RlLnJpZ2h0KSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbG9yIGZsaXBcbiAgICAgICAgICAgICAgICBub2RlLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbm9kZS5sZWZ0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG5vZGUucmlnaHQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpeCByZWQgdmlvbGF0aW9uXG4gICAgICAgICAgICBpZihpc19yZWQobm9kZSkgJiYgaXNfcmVkKHApKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpcjIgPSBnZ3AucmlnaHQgPT09IGdwO1xuXG4gICAgICAgICAgICAgICAgaWYobm9kZSA9PT0gcC5nZXRfY2hpbGQobGFzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2dwLnNldF9jaGlsZChkaXIyLCBzaW5nbGVfcm90YXRlKGdwLCAhbGFzdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2dwLnNldF9jaGlsZChkaXIyLCBkb3VibGVfcm90YXRlKGdwLCAhbGFzdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3Iobm9kZS5kYXRhLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gc3RvcCBpZiBmb3VuZFxuICAgICAgICAgICAgaWYoY21wID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhc3QgPSBkaXI7XG4gICAgICAgICAgICBkaXIgPSBjbXAgPCAwO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICAgICAgaWYoZ3AgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBnZ3AgPSBncDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdwID0gcDtcbiAgICAgICAgICAgIHAgPSBub2RlO1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgcm9vdFxuICAgICAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcbiAgICB9XG5cbiAgICAvLyBtYWtlIHJvb3QgYmxhY2tcbiAgICB0aGlzLl9yb290LnJlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbi8vIHJldHVybnMgdHJ1ZSBpZiByZW1vdmVkLCBmYWxzZSBpZiBub3QgZm91bmRcblJCVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcbiAgICB2YXIgbm9kZSA9IGhlYWQ7XG4gICAgbm9kZS5yaWdodCA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgZ3AgPSBudWxsOyAvLyBncmFuZCBwYXJlbnRcbiAgICB2YXIgZm91bmQgPSBudWxsOyAvLyBmb3VuZCBpdGVtXG4gICAgdmFyIGRpciA9IDE7XG5cbiAgICB3aGlsZShub2RlLmdldF9jaGlsZChkaXIpICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBsYXN0ID0gZGlyO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBoZWxwZXJzXG4gICAgICAgIGdwID0gcDtcbiAgICAgICAgcCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuXG4gICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIG5vZGUuZGF0YSk7XG5cbiAgICAgICAgZGlyID0gY21wID4gMDtcblxuICAgICAgICAvLyBzYXZlIGZvdW5kIG5vZGVcbiAgICAgICAgaWYoY21wID09PSAwKSB7XG4gICAgICAgICAgICBmb3VuZCA9IG5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwdXNoIHRoZSByZWQgbm9kZSBkb3duXG4gICAgICAgIGlmKCFpc19yZWQobm9kZSkgJiYgIWlzX3JlZChub2RlLmdldF9jaGlsZChkaXIpKSkge1xuICAgICAgICAgICAgaWYoaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKCFkaXIpKSkge1xuICAgICAgICAgICAgICAgIHZhciBzciA9IHNpbmdsZV9yb3RhdGUobm9kZSwgZGlyKTtcbiAgICAgICAgICAgICAgICBwLnNldF9jaGlsZChsYXN0LCBzcik7XG4gICAgICAgICAgICAgICAgcCA9IHNyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZighaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKCFkaXIpKSkge1xuICAgICAgICAgICAgICAgIHZhciBzaWJsaW5nID0gcC5nZXRfY2hpbGQoIWxhc3QpO1xuICAgICAgICAgICAgICAgIGlmKHNpYmxpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpICYmICFpc19yZWQoc2libGluZy5nZXRfY2hpbGQobGFzdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2xvciBmbGlwXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2libGluZy5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpcjIgPSBncC5yaWdodCA9PT0gcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKGxhc3QpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwLnNldF9jaGlsZChkaXIyLCBkb3VibGVfcm90YXRlKHAsIGxhc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKCFsYXN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncC5zZXRfY2hpbGQoZGlyMiwgc2luZ2xlX3JvdGF0ZShwLCBsYXN0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSBjb3JyZWN0IGNvbG9yaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3BjID0gZ3AuZ2V0X2NoaWxkKGRpcjIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBncGMubGVmdC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5yaWdodC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlcGxhY2UgYW5kIHJlbW92ZSBpZiBmb3VuZFxuICAgIGlmKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgIGZvdW5kLmRhdGEgPSBub2RlLmRhdGE7XG4gICAgICAgIHAuc2V0X2NoaWxkKHAucmlnaHQgPT09IG5vZGUsIG5vZGUuZ2V0X2NoaWxkKG5vZGUubGVmdCA9PT0gbnVsbCkpO1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgcm9vdCBhbmQgbWFrZSBpdCBibGFja1xuICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xuICAgIGlmKHRoaXMuX3Jvb3QgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcm9vdC5yZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmQgIT09IG51bGw7XG59O1xuXG5mdW5jdGlvbiBpc19yZWQobm9kZSkge1xuICAgIHJldHVybiBub2RlICE9PSBudWxsICYmIG5vZGUucmVkO1xufVxuXG5mdW5jdGlvbiBzaW5nbGVfcm90YXRlKHJvb3QsIGRpcikge1xuICAgIHZhciBzYXZlID0gcm9vdC5nZXRfY2hpbGQoIWRpcik7XG5cbiAgICByb290LnNldF9jaGlsZCghZGlyLCBzYXZlLmdldF9jaGlsZChkaXIpKTtcbiAgICBzYXZlLnNldF9jaGlsZChkaXIsIHJvb3QpO1xuXG4gICAgcm9vdC5yZWQgPSB0cnVlO1xuICAgIHNhdmUucmVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gc2F2ZTtcbn1cblxuZnVuY3Rpb24gZG91YmxlX3JvdGF0ZShyb290LCBkaXIpIHtcbiAgICByb290LnNldF9jaGlsZCghZGlyLCBzaW5nbGVfcm90YXRlKHJvb3QuZ2V0X2NoaWxkKCFkaXIpLCAhZGlyKSk7XG4gICAgcmV0dXJuIHNpbmdsZV9yb3RhdGUocm9vdCwgZGlyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSQlRyZWU7XG4iLCJcbmZ1bmN0aW9uIFRyZWVCYXNlKCkge31cblxuLy8gcmVtb3ZlcyBhbGwgbm9kZXMgZnJvbSB0aGUgdHJlZVxuVHJlZUJhc2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5zaXplID0gMDtcbn07XG5cbi8vIHJldHVybnMgbm9kZSBkYXRhIGlmIGZvdW5kLCBudWxsIG90aGVyd2lzZVxuVHJlZUJhc2UucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG5cbiAgICB3aGlsZShyZXMgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIHJlcy5kYXRhKTtcbiAgICAgICAgaWYoYyA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcmVzLmdldF9jaGlsZChjID4gMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIHJldHVybnMgaXRlcmF0b3IgdG8gbm9kZSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2VcblRyZWVCYXNlLnByb3RvdHlwZS5maW5kSXRlciA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgaXRlciA9IHRoaXMuaXRlcmF0b3IoKTtcblxuICAgIHdoaWxlKHJlcyAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgYyA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgcmVzLmRhdGEpO1xuICAgICAgICBpZihjID09PSAwKSB7XG4gICAgICAgICAgICBpdGVyLl9jdXJzb3IgPSByZXM7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5wdXNoKHJlcyk7XG4gICAgICAgICAgICByZXMgPSByZXMuZ2V0X2NoaWxkKGMgPiAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufTtcblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciB0byB0aGUgdHJlZSBub2RlIGF0IG9yIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBpdGVtXG5UcmVlQmFzZS5wcm90b3R5cGUubG93ZXJCb3VuZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY3VyID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgaXRlciA9IHRoaXMuaXRlcmF0b3IoKTtcbiAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgIHdoaWxlKGN1ciAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgYyA9IGNtcChpdGVtLCBjdXIuZGF0YSk7XG4gICAgICAgIGlmKGMgPT09IDApIHtcbiAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IGN1cjtcbiAgICAgICAgICAgIHJldHVybiBpdGVyO1xuICAgICAgICB9XG4gICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5wdXNoKGN1cik7XG4gICAgICAgIGN1ciA9IGN1ci5nZXRfY2hpbGQoYyA+IDApO1xuICAgIH1cblxuICAgIGZvcih2YXIgaT1pdGVyLl9hbmNlc3RvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgY3VyID0gaXRlci5fYW5jZXN0b3JzW2ldO1xuICAgICAgICBpZihjbXAoaXRlbSwgY3VyLmRhdGEpIDwgMCkge1xuICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gY3VyO1xuICAgICAgICAgICAgaXRlci5fYW5jZXN0b3JzLmxlbmd0aCA9IGk7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggPSAwO1xuICAgIHJldHVybiBpdGVyO1xufTtcblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciB0byB0aGUgdHJlZSBub2RlIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBpdGVtXG5UcmVlQmFzZS5wcm90b3R5cGUudXBwZXJCb3VuZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgaXRlciA9IHRoaXMubG93ZXJCb3VuZChpdGVtKTtcbiAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgIHdoaWxlKGl0ZXIuZGF0YSgpICE9PSBudWxsICYmIGNtcChpdGVyLmRhdGEoKSwgaXRlbSkgPT09IDApIHtcbiAgICAgICAgaXRlci5uZXh0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXI7XG59O1xuXG4vLyByZXR1cm5zIG51bGwgaWYgdHJlZSBpcyBlbXB0eVxuVHJlZUJhc2UucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuICAgIGlmKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB3aGlsZShyZXMubGVmdCAhPT0gbnVsbCkge1xuICAgICAgICByZXMgPSByZXMubGVmdDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLmRhdGE7XG59O1xuXG4vLyByZXR1cm5zIG51bGwgaWYgdHJlZSBpcyBlbXB0eVxuVHJlZUJhc2UucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuICAgIGlmKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB3aGlsZShyZXMucmlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgcmVzID0gcmVzLnJpZ2h0O1xuICAgIH1cblxuICAgIHJldHVybiByZXMuZGF0YTtcbn07XG5cbi8vIHJldHVybnMgYSBudWxsIGl0ZXJhdG9yXG4vLyBjYWxsIG5leHQoKSBvciBwcmV2KCkgdG8gcG9pbnQgdG8gYW4gZWxlbWVudFxuVHJlZUJhc2UucHJvdG90eXBlLml0ZXJhdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcih0aGlzKTtcbn07XG5cbi8vIGNhbGxzIGNiIG9uIGVhY2ggbm9kZSdzIGRhdGEsIGluIG9yZGVyXG5UcmVlQmFzZS5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGl0PXRoaXMuaXRlcmF0b3IoKSwgZGF0YTtcbiAgICB3aGlsZSgoZGF0YSA9IGl0Lm5leHQoKSkgIT09IG51bGwpIHtcbiAgICAgICAgY2IoZGF0YSk7XG4gICAgfVxufTtcblxuLy8gY2FsbHMgY2Igb24gZWFjaCBub2RlJ3MgZGF0YSwgaW4gcmV2ZXJzZSBvcmRlclxuVHJlZUJhc2UucHJvdG90eXBlLnJlYWNoID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgaXQ9dGhpcy5pdGVyYXRvcigpLCBkYXRhO1xuICAgIHdoaWxlKChkYXRhID0gaXQucHJldigpKSAhPT0gbnVsbCkge1xuICAgICAgICBjYihkYXRhKTtcbiAgICB9XG59O1xuXG5cbmZ1bmN0aW9uIEl0ZXJhdG9yKHRyZWUpIHtcbiAgICB0aGlzLl90cmVlID0gdHJlZTtcbiAgICB0aGlzLl9hbmNlc3RvcnMgPSBbXTtcbiAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xufVxuXG5JdGVyYXRvci5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XG59O1xuXG4vLyBpZiBudWxsLWl0ZXJhdG9yLCByZXR1cm5zIGZpcnN0IG5vZGVcbi8vIG90aGVyd2lzZSwgcmV0dXJucyBuZXh0IG5vZGVcbkl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5fY3Vyc29yID09PSBudWxsKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5fdHJlZS5fcm9vdDtcbiAgICAgICAgaWYocm9vdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fbWluTm9kZShyb290KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yLnJpZ2h0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBubyBncmVhdGVyIG5vZGUgaW4gc3VidHJlZSwgZ28gdXAgdG8gcGFyZW50XG4gICAgICAgICAgICAvLyBpZiBjb21pbmcgZnJvbSBhIHJpZ2h0IGNoaWxkLCBjb250aW51ZSB1cCB0aGUgc3RhY2tcbiAgICAgICAgICAgIHZhciBzYXZlO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHNhdmUgPSB0aGlzLl9jdXJzb3I7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSB0aGlzLl9hbmNlc3RvcnMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlKHRoaXMuX2N1cnNvci5yaWdodCA9PT0gc2F2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIG5leHQgbm9kZSBmcm9tIHRoZSBzdWJ0cmVlXG4gICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaCh0aGlzLl9jdXJzb3IpO1xuICAgICAgICAgICAgdGhpcy5fbWluTm9kZSh0aGlzLl9jdXJzb3IucmlnaHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XG59O1xuXG4vLyBpZiBudWxsLWl0ZXJhdG9yLCByZXR1cm5zIGxhc3Qgbm9kZVxuLy8gb3RoZXJ3aXNlLCByZXR1cm5zIHByZXZpb3VzIG5vZGVcbkl0ZXJhdG9yLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5fY3Vyc29yID09PSBudWxsKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5fdHJlZS5fcm9vdDtcbiAgICAgICAgaWYocm9vdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fbWF4Tm9kZShyb290KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yLmxlZnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzYXZlO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHNhdmUgPSB0aGlzLl9jdXJzb3I7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSB0aGlzLl9hbmNlc3RvcnMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlKHRoaXMuX2N1cnNvci5sZWZ0ID09PSBzYXZlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHRoaXMuX2N1cnNvcik7XG4gICAgICAgICAgICB0aGlzLl9tYXhOb2RlKHRoaXMuX2N1cnNvci5sZWZ0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuSXRlcmF0b3IucHJvdG90eXBlLl9taW5Ob2RlID0gZnVuY3Rpb24oc3RhcnQpIHtcbiAgICB3aGlsZShzdGFydC5sZWZ0ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHN0YXJ0KTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5sZWZ0O1xuICAgIH1cbiAgICB0aGlzLl9jdXJzb3IgPSBzdGFydDtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5fbWF4Tm9kZSA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgd2hpbGUoc3RhcnQucmlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2goc3RhcnQpO1xuICAgICAgICBzdGFydCA9IHN0YXJ0LnJpZ2h0O1xuICAgIH1cbiAgICB0aGlzLl9jdXJzb3IgPSBzdGFydDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZUJhc2U7XG5cbiIsIlxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBkYXRhIEdlb0pTT05cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgaWYgKGRhdGEudHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJykge1xuICAgIC8vIFRoYXQncyBhIGh1Z2UgaGFjayB0byBnZXQgdGhpbmdzIHdvcmtpbmcgd2l0aCBib3RoIEFyY0dJUyBzZXJ2ZXJcbiAgICAvLyBhbmQgR2VvU2VydmVyLiBHZW9zZXJ2ZXIgcHJvdmlkZXMgY3JzIHJlZmVyZW5jZSBpbiBHZW9KU09OLCBBcmNHSVMg4oCUXG4gICAgLy8gZG9lc24ndC5cbiAgICAvL2lmIChkYXRhLmNycykgZGVsZXRlIGRhdGEuY3JzO1xuICAgIGZvciAodmFyIGkgPSBkYXRhLmZlYXR1cmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBkYXRhLmZlYXR1cmVzW2ldID0gcHJvamVjdEZlYXR1cmUoZGF0YS5mZWF0dXJlc1tpXSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRhdGEgPSBwcm9qZWN0RmVhdHVyZShkYXRhLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnByb2plY3RGZWF0dXJlICA9IHByb2plY3RGZWF0dXJlO1xubW9kdWxlLmV4cG9ydHMucHJvamVjdEdlb21ldHJ5ID0gcHJvamVjdEdlb21ldHJ5O1xuXG5cbi8qKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIHByb2plY3RGZWF0dXJlKGZlYXR1cmUsIHByb2plY3QsIGNvbnRleHQpIHtcbiAgaWYgKGZlYXR1cmUudHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZmVhdHVyZS5nZW9tZXRyaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBmZWF0dXJlLmdlb21ldHJpZXNbaV0gPVxuICAgICAgICBwcm9qZWN0R2VvbWV0cnkoZmVhdHVyZS5nZW9tZXRyaWVzW2ldLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZmVhdHVyZS5nZW9tZXRyeSA9IHByb2plY3RHZW9tZXRyeShmZWF0dXJlLmdlb21ldHJ5LCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgfVxuICByZXR1cm4gZmVhdHVyZTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gICAgIGRhdGEgR2VvSlNPTlxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBwcm9qZWN0R2VvbWV0cnkoZ2VvbWV0cnksIHByb2plY3QsIGNvbnRleHQpIHtcbiAgdmFyIGNvb3JkcyA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICBzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcbiAgICBjYXNlICdQb2ludCc6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3QuY2FsbChjb250ZXh0LCBjb29yZHMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29vcmRzW2ldID0gcHJvamVjdC5jYWxsKGNvbnRleHQsIGNvb3Jkc1tpXSk7XG4gICAgICB9XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IGNvb3JkcztcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnUG9seWdvbic6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3RDb29yZHMoY29vcmRzLCAxLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdENvb3Jkcyhjb29yZHMsIDEsIHByb2plY3QsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0Q29vcmRzKGNvb3JkcywgMiwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZ2VvbWV0cnk7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHsqfSAgICAgICAgIGNvb3JkcyBDb29yZHMgYXJyYXlzXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIGxldmVsc0RlZXBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7Kn1cbiAqL1xuZnVuY3Rpb24gcHJvamVjdENvb3Jkcyhjb29yZHMsIGxldmVsc0RlZXAsIHByb2plY3QsIGNvbnRleHQpIHtcbiAgdmFyIGNvb3JkLCBpLCBsZW47XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBjb29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb29yZCA9IGxldmVsc0RlZXAgP1xuICAgICAgcHJvamVjdENvb3Jkcyhjb29yZHNbaV0sIGxldmVsc0RlZXAgLSAxLCBwcm9qZWN0LCBjb250ZXh0KSA6XG4gICAgICBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzW2ldKTtcblxuICAgIHJlc3VsdC5wdXNoKGNvb3JkKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJ2YXIgUG9seWdvbiA9IHJlcXVpcmUoJy4vcG9seWdvbicpO1xuXG4vKipcbiAqIENsaXAgZHJpdmVyXG4gKiBAYXBpXG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fSBwb2x5Z29uQVxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gcG9seWdvbkJcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgICAgICAgIHNvdXJjZUZvcndhcmRzXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgICAgICAgICBjbGlwRm9yd2FyZHNcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48TnVtYmVyPj59XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24ocG9seWdvbkEsIHBvbHlnb25CLCBlQSwgZUIpIHtcbiAgICB2YXIgcmVzdWx0LCBzb3VyY2UgPSBuZXcgUG9seWdvbihwb2x5Z29uQSksXG4gICAgICAgIGNsaXAgPSBuZXcgUG9seWdvbihwb2x5Z29uQiksXG4gICAgICAgIHJlc3VsdCA9IHNvdXJjZS5jbGlwKGNsaXAsIGVBLCBlQik7XG5cbiAgICByZXR1cm4gcmVzdWx0O1xufTtcbiIsInZhciBjbGlwID0gcmVxdWlyZSgnLi9jbGlwJyk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIC8qKlxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0gIHtBcnJheS48QXJyYXkuPE51bWJlcj58QXJyYXkuPE9iamVjdD59IHBvbHlnb25BXG4gICAgICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+fEFycmF5LjxPYmplY3Q+fSBwb2x5Z29uQlxuICAgICAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48TnVtYmVyPj58QXJyYXkuPEFycmF5LjxPYmplY3Q+fE51bGx9XG4gICAgICovXG4gICAgdW5pb246IGZ1bmN0aW9uKHBvbHlnb25BLCBwb2x5Z29uQikge1xuICAgICAgICByZXR1cm4gY2xpcChwb2x5Z29uQSwgcG9seWdvbkIsIGZhbHNlLCBmYWxzZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0gIHtBcnJheS48QXJyYXkuPE51bWJlcj58QXJyYXkuPE9iamVjdD59IHBvbHlnb25BXG4gICAgICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+fEFycmF5LjxPYmplY3Q+fSBwb2x5Z29uQlxuICAgICAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48TnVtYmVyPj58QXJyYXkuPEFycmF5LjxPYmplY3Q+PnxOdWxsfVxuICAgICAqL1xuICAgIGludGVyc2VjdGlvbjogZnVuY3Rpb24ocG9seWdvbkEsIHBvbHlnb25CKSB7XG4gICAgICAgIHJldHVybiBjbGlwKHBvbHlnb25BLCBwb2x5Z29uQiwgdHJ1ZSwgdHJ1ZSk7XG4gICAgfSxcblxuICAgIC8qKlxuICAgICAqIEBhcGlcbiAgICAgKiBAcGFyYW0gIHtBcnJheS48QXJyYXkuPE51bWJlcj58QXJyYXkuPE9iamVjdD59IHBvbHlnb25BXG4gICAgICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+fEFycmF5LjxPYmplY3Q+fSBwb2x5Z29uQlxuICAgICAqIEByZXR1cm4ge0FycmF5LjxBcnJheS48TnVtYmVyPj58QXJyYXkuPEFycmF5LjxPYmplY3Q+PnxOdWxsfVxuICAgICAqL1xuICAgIGRpZmY6IGZ1bmN0aW9uKHBvbHlnb25BLCBwb2x5Z29uQikge1xuICAgICAgICByZXR1cm4gY2xpcChwb2x5Z29uQSwgcG9seWdvbkIsIGZhbHNlLCB0cnVlKTtcbiAgICB9LFxuXG4gICAgY2xpcDogY2xpcFxufTtcbiIsIi8qKlxuICogSW50ZXJzZWN0aW9uXG4gKiBAcGFyYW0ge1ZlcnRleH0gczFcbiAqIEBwYXJhbSB7VmVydGV4fSBzMlxuICogQHBhcmFtIHtWZXJ0ZXh9IGMxXG4gKiBAcGFyYW0ge1ZlcnRleH0gYzJcbiAqIEBjb25zdHJ1Y3RvclxuICovXG52YXIgSW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oczEsIHMyLCBjMSwgYzIpIHtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy54ID0gMC4wO1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnkgPSAwLjA7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMudG9Tb3VyY2UgPSAwLjA7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMudG9DbGlwID0gMC4wO1xuXG4gICAgdmFyIGQgPSAoYzIueSAtIGMxLnkpICogKHMyLnggLSBzMS54KSAtIChjMi54IC0gYzEueCkgKiAoczIueSAtIHMxLnkpO1xuXG4gICAgaWYgKGQgPT09IDApIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy50b1NvdXJjZSA9ICgoYzIueCAtIGMxLngpICogKHMxLnkgLSBjMS55KSAtIChjMi55IC0gYzEueSkgKiAoczEueCAtIGMxLngpKSAvIGQ7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgICAqL1xuICAgIHRoaXMudG9DbGlwID0gKChzMi54IC0gczEueCkgKiAoczEueSAtIGMxLnkpIC0gKHMyLnkgLSBzMS55KSAqIChzMS54IC0gYzEueCkpIC8gZDtcblxuICAgIGlmICh0aGlzLnZhbGlkKCkpIHtcbiAgICAgICAgdGhpcy54ID0gczEueCArIHRoaXMudG9Tb3VyY2UgKiAoczIueCAtIHMxLngpO1xuICAgICAgICB0aGlzLnkgPSBzMS55ICsgdGhpcy50b1NvdXJjZSAqIChzMi55IC0gczEueSk7XG4gICAgfVxufTtcblxuLyoqXG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5JbnRlcnNlY3Rpb24ucHJvdG90eXBlLnZhbGlkID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuICgwIDwgdGhpcy50b1NvdXJjZSAmJiB0aGlzLnRvU291cmNlIDwgMSkgJiYgKDAgPCB0aGlzLnRvQ2xpcCAmJiB0aGlzLnRvQ2xpcCA8IDEpO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBJbnRlcnNlY3Rpb247XG4iLCJ2YXIgVmVydGV4ID0gcmVxdWlyZSgnLi92ZXJ0ZXgnKTtcbnZhciBJbnRlcnNlY3Rpb24gPSByZXF1aXJlKCcuL2ludGVyc2VjdGlvbicpO1xuXG4vKipcbiAqIFBvbHlnb24gcmVwcmVzZW50YXRpb25cbiAqIEBwYXJhbSB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gcFxuICogQHBhcmFtIHtCb29sZWFuPX0gICAgICAgICAgICAgICBhcnJheVZlcnRpY2VzXG4gKlxuICogQGNvbnN0cnVjdG9yXG4gKi9cbnZhciBQb2x5Z29uID0gZnVuY3Rpb24ocCwgYXJyYXlWZXJ0aWNlcykge1xuXG4gICAgLyoqXG4gICAgICogQHR5cGUge1ZlcnRleH1cbiAgICAgKi9cbiAgICB0aGlzLmZpcnN0ID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICovXG4gICAgdGhpcy52ZXJ0aWNlcyA9IDA7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7VmVydGV4fVxuICAgICAqL1xuICAgIHRoaXMuX2xhc3RVbnByb2Nlc3NlZCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBXaGV0aGVyIHRvIGhhbmRsZSBpbnB1dCBhbmQgb3V0cHV0IGFzIFt4LHldIG9yIHt4OngseTp5fVxuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX2FycmF5VmVydGljZXMgPSAodHlwZW9mIGFycmF5VmVydGljZXMgPT09IFwidW5kZWZpbmVkXCIpID9cbiAgICAgICAgQXJyYXkuaXNBcnJheShwWzBdKSA6XG4gICAgICAgIGFycmF5VmVydGljZXM7XG5cbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcC5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB0aGlzLmFkZFZlcnRleChuZXcgVmVydGV4KHBbaV0pKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIEFkZCBhIHZlcnRleCBvYmplY3QgdG8gdGhlIHBvbHlnb25cbiAqICh2ZXJ0ZXggaXMgYWRkZWQgYXQgdGhlICdlbmQnIG9mIHRoZSBsaXN0JylcbiAqXG4gKiBAcGFyYW0gdmVydGV4XG4gKi9cblBvbHlnb24ucHJvdG90eXBlLmFkZFZlcnRleCA9IGZ1bmN0aW9uKHZlcnRleCkge1xuICAgIGlmICh0aGlzLmZpcnN0ID09IG51bGwpIHtcbiAgICAgICAgdGhpcy5maXJzdCA9IHZlcnRleDtcbiAgICAgICAgdGhpcy5maXJzdC5uZXh0ID0gdmVydGV4O1xuICAgICAgICB0aGlzLmZpcnN0LnByZXYgPSB2ZXJ0ZXg7XG4gICAgfSBlbHNlIHtcbiAgICAgICAgdmFyIG5leHQgPSB0aGlzLmZpcnN0LFxuICAgICAgICAgICAgcHJldiA9IG5leHQucHJldjtcblxuICAgICAgICBuZXh0LnByZXYgPSB2ZXJ0ZXg7XG4gICAgICAgIHZlcnRleC5uZXh0ID0gbmV4dDtcbiAgICAgICAgdmVydGV4LnByZXYgPSBwcmV2O1xuICAgICAgICBwcmV2Lm5leHQgPSB2ZXJ0ZXg7XG4gICAgfVxuICAgIHRoaXMudmVydGljZXMrKztcbn07XG5cbi8qKlxuICogSW5zZXJ0cyBhIHZlcnRleCBpbmJldHdlZW4gc3RhcnQgYW5kIGVuZFxuICpcbiAqIEBwYXJhbSB7VmVydGV4fSB2ZXJ0ZXhcbiAqIEBwYXJhbSB7VmVydGV4fSBzdGFydFxuICogQHBhcmFtIHtWZXJ0ZXh9IGVuZFxuICovXG5Qb2x5Z29uLnByb3RvdHlwZS5pbnNlcnRWZXJ0ZXggPSBmdW5jdGlvbih2ZXJ0ZXgsIHN0YXJ0LCBlbmQpIHtcbiAgICB2YXIgcHJldiwgY3VyciA9IHN0YXJ0O1xuXG4gICAgd2hpbGUgKCFjdXJyLmVxdWFscyhlbmQpICYmIGN1cnIuX2Rpc3RhbmNlIDwgdmVydGV4Ll9kaXN0YW5jZSkge1xuICAgICAgICBjdXJyID0gY3Vyci5uZXh0O1xuICAgIH1cblxuICAgIHZlcnRleC5uZXh0ID0gY3VycjtcbiAgICBwcmV2ID0gY3Vyci5wcmV2O1xuXG4gICAgdmVydGV4LnByZXYgPSBwcmV2O1xuICAgIHByZXYubmV4dCA9IHZlcnRleDtcbiAgICBjdXJyLnByZXYgPSB2ZXJ0ZXg7XG5cbiAgICB0aGlzLnZlcnRpY2VzKys7XG59O1xuXG4vKipcbiAqIEdldCBuZXh0IG5vbi1pbnRlcnNlY3Rpb24gcG9pbnRcbiAqIEBwYXJhbSAge1ZlcnRleH0gdlxuICogQHJldHVybiB7VmVydGV4fVxuICovXG5Qb2x5Z29uLnByb3RvdHlwZS5nZXROZXh0ID0gZnVuY3Rpb24odikge1xuICAgIHZhciBjID0gdjtcbiAgICB3aGlsZSAoYy5faXNJbnRlcnNlY3Rpb24pIHtcbiAgICAgICAgYyA9IGMubmV4dDtcbiAgICB9XG4gICAgcmV0dXJuIGM7XG59O1xuXG4vKipcbiAqIFVudmlzaXRlZCBpbnRlcnNlY3Rpb25cbiAqIEByZXR1cm4ge1ZlcnRleH1cbiAqL1xuUG9seWdvbi5wcm90b3R5cGUuZ2V0Rmlyc3RJbnRlcnNlY3QgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHRoaXMuX2ZpcnN0SW50ZXJzZWN0IHx8IHRoaXMuZmlyc3Q7XG5cbiAgICBkbyB7XG4gICAgICAgIGlmICh2Ll9pc0ludGVyc2VjdGlvbiAmJiAhdi5fdmlzaXRlZCkge1xuICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgIH1cblxuICAgICAgICB2ID0gdi5uZXh0O1xuICAgIH0gd2hpbGUgKCF2LmVxdWFscyh0aGlzLmZpcnN0KSk7XG5cbiAgICB0aGlzLl9maXJzdEludGVyc2VjdCA9IHY7XG4gICAgcmV0dXJuIHY7XG59O1xuXG4vKipcbiAqIERvZXMgdGhlIHBvbHlnb24gaGF2ZSB1bnZpc2l0ZWQgdmVydGljZXNcbiAqIEByZXR1cm4ge0Jvb2xlYW59IFtkZXNjcmlwdGlvbl1cbiAqL1xuUG9seWdvbi5wcm90b3R5cGUuaGFzVW5wcm9jZXNzZWQgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgdiA9IHRoaXMuX2xhc3RVbnByb2Nlc3NlZCB8fCB0aGlzLmZpcnN0O1xuICAgIGRvIHtcbiAgICAgICAgaWYgKHYuX2lzSW50ZXJzZWN0aW9uICYmICF2Ll92aXNpdGVkKSB7XG4gICAgICAgICAgICB0aGlzLl9sYXN0VW5wcm9jZXNzZWQgPSB2O1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICB2ID0gdi5uZXh0O1xuICAgIH0gd2hpbGUgKCF2LmVxdWFscyh0aGlzLmZpcnN0KSk7XG5cbiAgICB0aGlzLl9sYXN0VW5wcm9jZXNzZWQgPSBudWxsO1xuICAgIHJldHVybiBmYWxzZTtcbn07XG5cbi8qKlxuICogVGhlIG91dHB1dCBkZXBlbmRzIG9uIHdoYXQgeW91IHB1dCBpbiwgYXJyYXlzIG9yIG9iamVjdHNcbiAqIEByZXR1cm4ge0FycmF5LjxBcnJheTxOdW1iZXI+fEFycmF5LjxPYmplY3Q+fVxuICovXG5Qb2x5Z29uLnByb3RvdHlwZS5nZXRQb2ludHMgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcG9pbnRzID0gW10sXG4gICAgICAgIHYgPSB0aGlzLmZpcnN0O1xuXG4gICAgaWYgKHRoaXMuX2FycmF5VmVydGljZXMpIHtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgcG9pbnRzLnB1c2goW3YueCwgdi55XSk7XG4gICAgICAgICAgICB2ID0gdi5uZXh0O1xuICAgICAgICB9IHdoaWxlICh2ICE9PSB0aGlzLmZpcnN0KTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBwb2ludHMucHVzaCh7XG4gICAgICAgICAgICAgICAgeDogdi54LFxuICAgICAgICAgICAgICAgIHk6IHYueVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICB2ID0gdi5uZXh0O1xuICAgICAgICB9IHdoaWxlICh2ICE9PSB0aGlzLmZpcnN0KTtcbiAgICB9XG5cbiAgICByZXR1cm4gcG9pbnRzO1xufTtcblxuLyoqXG4gKiBDbGlwIHBvbHlnb24gYWdhaW5zdCBhbm90aGVyIG9uZS5cbiAqIFJlc3VsdCBkZXBlbmRzIG9uIGFsZ29yaXRobSBkaXJlY3Rpb246XG4gKlxuICogSW50ZXJzZWN0aW9uOiBmb3J3YXJkcyBmb3J3YXJkc1xuICogVW5pb246ICAgICAgICBiYWNrd2FycyBiYWNrd2FyZHNcbiAqIERpZmY6ICAgICAgICAgYmFja3dhcmRzIGZvcndhcmRzXG4gKlxuICogQHBhcmFtIHtQb2x5Z29ufSBjbGlwXG4gKiBAcGFyYW0ge0Jvb2xlYW59IHNvdXJjZUZvcndhcmRzXG4gKiBAcGFyYW0ge0Jvb2xlYW59IGNsaXBGb3J3YXJkc1xuICovXG5Qb2x5Z29uLnByb3RvdHlwZS5jbGlwID0gZnVuY3Rpb24oY2xpcCwgc291cmNlRm9yd2FyZHMsIGNsaXBGb3J3YXJkcykge1xuICAgIHZhciBzb3VyY2VWZXJ0ZXggPSB0aGlzLmZpcnN0LFxuICAgICAgICBjbGlwVmVydGV4ID0gY2xpcC5maXJzdCxcbiAgICAgICAgc291cmNlSW5DbGlwLCBjbGlwSW5Tb3VyY2U7XG5cbiAgICAvLyBjYWxjdWxhdGUgYW5kIG1hcmsgaW50ZXJzZWN0aW9uc1xuICAgIGRvIHtcbiAgICAgICAgaWYgKCFzb3VyY2VWZXJ0ZXguX2lzSW50ZXJzZWN0aW9uKSB7XG4gICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgaWYgKCFjbGlwVmVydGV4Ll9pc0ludGVyc2VjdGlvbikge1xuICAgICAgICAgICAgICAgICAgICB2YXIgaSA9IG5ldyBJbnRlcnNlY3Rpb24oXG4gICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VWZXJ0ZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLmdldE5leHQoc291cmNlVmVydGV4Lm5leHQpLFxuICAgICAgICAgICAgICAgICAgICAgICAgY2xpcFZlcnRleCwgY2xpcC5nZXROZXh0KGNsaXBWZXJ0ZXgubmV4dCkpO1xuXG4gICAgICAgICAgICAgICAgICAgIGlmIChpLnZhbGlkKCkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBzb3VyY2VJbnRlcnNlY3Rpb24gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlcnRleC5jcmVhdGVJbnRlcnNlY3Rpb24oaS54LCBpLnksIGkudG9Tb3VyY2UpLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBJbnRlcnNlY3Rpb24gPVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFZlcnRleC5jcmVhdGVJbnRlcnNlY3Rpb24oaS54LCBpLnksIGkudG9DbGlwKTtcblxuICAgICAgICAgICAgICAgICAgICAgICAgc291cmNlSW50ZXJzZWN0aW9uLl9jb3JyZXNwb25kaW5nID0gY2xpcEludGVyc2VjdGlvbjtcbiAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBJbnRlcnNlY3Rpb24uX2NvcnJlc3BvbmRpbmcgPSBzb3VyY2VJbnRlcnNlY3Rpb247XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuaW5zZXJ0VmVydGV4KFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNvdXJjZUludGVyc2VjdGlvbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3VyY2VWZXJ0ZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdGhpcy5nZXROZXh0KHNvdXJjZVZlcnRleC5uZXh0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICBjbGlwLmluc2VydFZlcnRleChcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjbGlwSW50ZXJzZWN0aW9uLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNsaXBWZXJ0ZXgsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY2xpcC5nZXROZXh0KGNsaXBWZXJ0ZXgubmV4dCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGNsaXBWZXJ0ZXggPSBjbGlwVmVydGV4Lm5leHQ7XG4gICAgICAgICAgICB9IHdoaWxlICghY2xpcFZlcnRleC5lcXVhbHMoY2xpcC5maXJzdCkpO1xuICAgICAgICB9XG5cbiAgICAgICAgc291cmNlVmVydGV4ID0gc291cmNlVmVydGV4Lm5leHQ7XG4gICAgfSB3aGlsZSAoIXNvdXJjZVZlcnRleC5lcXVhbHModGhpcy5maXJzdCkpO1xuXG4gICAgLy8gcGhhc2UgdHdvIC0gaWRlbnRpZnkgZW50cnkvZXhpdCBwb2ludHNcbiAgICBzb3VyY2VWZXJ0ZXggPSB0aGlzLmZpcnN0O1xuICAgIGNsaXBWZXJ0ZXggPSBjbGlwLmZpcnN0O1xuXG4gICAgc291cmNlSW5DbGlwID0gc291cmNlVmVydGV4LmlzSW5zaWRlKGNsaXApO1xuICAgIGNsaXBJblNvdXJjZSA9IGNsaXBWZXJ0ZXguaXNJbnNpZGUodGhpcyk7XG5cbiAgICBzb3VyY2VGb3J3YXJkcyBePSBzb3VyY2VJbkNsaXA7XG4gICAgY2xpcEZvcndhcmRzIF49IGNsaXBJblNvdXJjZTtcblxuICAgIGRvIHtcbiAgICAgICAgaWYgKHNvdXJjZVZlcnRleC5faXNJbnRlcnNlY3Rpb24pIHtcbiAgICAgICAgICAgIHNvdXJjZVZlcnRleC5faXNFbnRyeSA9IHNvdXJjZUZvcndhcmRzO1xuICAgICAgICAgICAgc291cmNlRm9yd2FyZHMgPSAhc291cmNlRm9yd2FyZHM7XG4gICAgICAgIH1cbiAgICAgICAgc291cmNlVmVydGV4ID0gc291cmNlVmVydGV4Lm5leHQ7XG4gICAgfSB3aGlsZSAoIXNvdXJjZVZlcnRleC5lcXVhbHModGhpcy5maXJzdCkpO1xuXG4gICAgZG8ge1xuICAgICAgICBpZiAoY2xpcFZlcnRleC5faXNJbnRlcnNlY3Rpb24pIHtcbiAgICAgICAgICAgIGNsaXBWZXJ0ZXguX2lzRW50cnkgPSBjbGlwRm9yd2FyZHM7XG4gICAgICAgICAgICBjbGlwRm9yd2FyZHMgPSAhY2xpcEZvcndhcmRzO1xuICAgICAgICB9XG4gICAgICAgIGNsaXBWZXJ0ZXggPSBjbGlwVmVydGV4Lm5leHQ7XG4gICAgfSB3aGlsZSAoIWNsaXBWZXJ0ZXguZXF1YWxzKGNsaXAuZmlyc3QpKTtcblxuICAgIC8vIHBoYXNlIHRocmVlIC0gY29uc3RydWN0IGEgbGlzdCBvZiBjbGlwcGVkIHBvbHlnb25zXG4gICAgdmFyIGxpc3QgPSBbXTtcblxuICAgIHdoaWxlICh0aGlzLmhhc1VucHJvY2Vzc2VkKCkpIHtcbiAgICAgICAgdmFyIGN1cnJlbnQgPSB0aGlzLmdldEZpcnN0SW50ZXJzZWN0KCksXG4gICAgICAgICAgICAvLyBrZWVwIGZvcm1hdFxuICAgICAgICAgICAgY2xpcHBlZCA9IG5ldyBQb2x5Z29uKFtdLCB0aGlzLl9hcnJheVZlcnRpY2VzKTtcblxuICAgICAgICBjbGlwcGVkLmFkZFZlcnRleChuZXcgVmVydGV4KGN1cnJlbnQueCwgY3VycmVudC55KSk7XG4gICAgICAgIGRvIHtcbiAgICAgICAgICAgIGN1cnJlbnQudmlzaXQoKTtcbiAgICAgICAgICAgIGlmIChjdXJyZW50Ll9pc0VudHJ5KSB7XG4gICAgICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgICAgICBjdXJyZW50ID0gY3VycmVudC5uZXh0O1xuICAgICAgICAgICAgICAgICAgICBjbGlwcGVkLmFkZFZlcnRleChuZXcgVmVydGV4KGN1cnJlbnQueCwgY3VycmVudC55KSk7XG4gICAgICAgICAgICAgICAgfSB3aGlsZSAoIWN1cnJlbnQuX2lzSW50ZXJzZWN0aW9uKTtcblxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkbyB7XG4gICAgICAgICAgICAgICAgICAgIGN1cnJlbnQgPSBjdXJyZW50LnByZXY7XG4gICAgICAgICAgICAgICAgICAgIGNsaXBwZWQuYWRkVmVydGV4KG5ldyBWZXJ0ZXgoY3VycmVudC54LCBjdXJyZW50LnkpKTtcbiAgICAgICAgICAgICAgICB9IHdoaWxlICghY3VycmVudC5faXNJbnRlcnNlY3Rpb24pO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgY3VycmVudCA9IGN1cnJlbnQuX2NvcnJlc3BvbmRpbmc7XG4gICAgICAgIH0gd2hpbGUgKCFjdXJyZW50Ll92aXNpdGVkKTtcblxuICAgICAgICBsaXN0LnB1c2goY2xpcHBlZC5nZXRQb2ludHMoKSk7XG4gICAgfVxuXG4gICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgIGlmIChzb3VyY2VJbkNsaXApIHtcbiAgICAgICAgICAgIGxpc3QucHVzaCh0aGlzLmdldFBvaW50cygpKTtcbiAgICAgICAgfVxuICAgICAgICBpZiAoY2xpcEluU291cmNlKSB7XG4gICAgICAgICAgICBsaXN0LnB1c2goY2xpcC5nZXRQb2ludHMoKSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKGxpc3QubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICBsaXN0ID0gbnVsbDtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBsaXN0O1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBQb2x5Z29uO1xuIiwiLyoqXG4gKiBWZXJ0ZXggcmVwcmVzZW50YXRpb25cbiAqXG4gKiBAcGFyYW0ge051bWJlcnxBcnJheS48TnVtYmVyPn0geFxuICogQHBhcmFtIHtOdW1iZXI9fSAgICAgICAgICAgICAgIHlcbiAqXG4gKiBAY29uc3RydWN0b3JcbiAqL1xudmFyIFZlcnRleCA9IGZ1bmN0aW9uKHgsIHkpIHtcblxuICAgIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAxKSB7XG4gICAgICAgIC8vIENvb3Jkc1xuICAgICAgICBpZiAoQXJyYXkuaXNBcnJheSh4KSkge1xuICAgICAgICAgICAgeSA9IHhbMV07XG4gICAgICAgICAgICB4ID0geFswXTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHkgPSB4Lnk7XG4gICAgICAgICAgICB4ID0geC54O1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogWCBjb29yZGluYXRlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnggPSB4O1xuXG4gICAgLyoqXG4gICAgICogWSBjb29yZGluYXRlXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLnkgPSB5O1xuXG4gICAgLyoqXG4gICAgICogTmV4dCBub2RlXG4gICAgICogQHR5cGUge1ZlcnRleH1cbiAgICAgKi9cbiAgICB0aGlzLm5leHQgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogUHJldmlvdXMgdmVydGV4XG4gICAgICogQHR5cGUge1ZlcnRleH1cbiAgICAgKi9cbiAgICB0aGlzLnByZXYgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogQ29ycmVzcG9uZGluZyBpbnRlcnNlY3Rpb24gaW4gb3RoZXIgcG9seWdvblxuICAgICAqL1xuICAgIHRoaXMuX2NvcnJlc3BvbmRpbmcgPSBudWxsO1xuXG4gICAgLyoqXG4gICAgICogRGlzdGFuY2UgZnJvbSBwcmV2aW91c1xuICAgICAqL1xuICAgIHRoaXMuX2Rpc3RhbmNlID0gMC4wO1xuXG4gICAgLyoqXG4gICAgICogRW50cnkvZXhpdCBwb2ludCBpbiBhbm90aGVyIHBvbHlnb25cbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9pc0VudHJ5ID0gdHJ1ZTtcblxuICAgIC8qKlxuICAgICAqIEludGVyc2VjdGlvbiB2ZXJ0ZXggZmxhZ1xuICAgICAqIEB0eXBlIHtCb29sZWFufVxuICAgICAqL1xuICAgIHRoaXMuX2lzSW50ZXJzZWN0aW9uID0gZmFsc2U7XG5cbiAgICAvKipcbiAgICAgKiBMb29wIGNoZWNrXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICovXG4gICAgdGhpcy5fdmlzaXRlZCA9IGZhbHNlO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGludGVyc2VjdGlvbiB2ZXJ0ZXhcbiAqIEBwYXJhbSAge051bWJlcn0geFxuICogQHBhcmFtICB7TnVtYmVyfSB5XG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RhbmNlXG4gKiBAcmV0dXJuIHtWZXJ0ZXh9XG4gKi9cblZlcnRleC5jcmVhdGVJbnRlcnNlY3Rpb24gPSBmdW5jdGlvbih4LCB5LCBkaXN0YW5jZSkge1xuICAgIHZhciB2ZXJ0ZXggPSBuZXcgVmVydGV4KHgsIHkpO1xuICAgIHZlcnRleC5fZGlzdGFuY2UgPSBkaXN0YW5jZTtcbiAgICB2ZXJ0ZXguX2lzSW50ZXJzZWN0aW9uID0gdHJ1ZTtcbiAgICB2ZXJ0ZXguX2lzRW50cnkgPSBmYWxzZTtcbiAgICByZXR1cm4gdmVydGV4O1xufTtcblxuLyoqXG4gKiBNYXJrIGFzIHZpc2l0ZWRcbiAqL1xuVmVydGV4LnByb3RvdHlwZS52aXNpdCA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Zpc2l0ZWQgPSB0cnVlO1xuICAgIGlmICh0aGlzLl9jb3JyZXNwb25kaW5nICE9PSBudWxsICYmICF0aGlzLl9jb3JyZXNwb25kaW5nLl92aXNpdGVkKSB7XG4gICAgICAgIHRoaXMuX2NvcnJlc3BvbmRpbmcudmlzaXQoKTtcbiAgICB9XG59O1xuXG4vKipcbiAqIENvbnZlbmllbmNlXG4gKiBAcGFyYW0gIHtWZXJ0ZXh9ICB2XG4gKiBAcmV0dXJuIHtCb29sZWFufVxuICovXG5WZXJ0ZXgucHJvdG90eXBlLmVxdWFscyA9IGZ1bmN0aW9uKHYpIHtcbiAgICByZXR1cm4gdGhpcy54ID09PSB2LnggJiYgdGhpcy55ID09PSB2Lnk7XG59O1xuXG4vKipcbiAqIENoZWNrIGlmIHZlcnRleCBpcyBpbnNpZGUgYSBwb2x5Z29uIGJ5IG9kZC1ldmVuIHJ1bGU6XG4gKiBJZiB0aGUgbnVtYmVyIG9mIGludGVyc2VjdGlvbnMgb2YgYSByYXkgb3V0IG9mIHRoZSBwb2ludCBhbmQgcG9seWdvblxuICogc2VnbWVudHMgaXMgb2RkIC0gdGhlIHBvaW50IGlzIGluc2lkZS5cbiAqIEBwYXJhbSB7UG9seWdvbn0gcG9seVxuICogQHJldHVybiB7Qm9vbGVhbn1cbiAqL1xuVmVydGV4LnByb3RvdHlwZS5pc0luc2lkZSA9IGZ1bmN0aW9uKHBvbHkpIHtcbiAgICB2YXIgb2RkTm9kZXMgPSBmYWxzZSxcbiAgICAgICAgdmVydGV4ID0gcG9seS5maXJzdCxcbiAgICAgICAgbmV4dCA9IHZlcnRleC5uZXh0LFxuICAgICAgICB4ID0gdGhpcy54LFxuICAgICAgICB5ID0gdGhpcy55O1xuXG4gICAgZG8ge1xuICAgICAgICBpZiAoKHZlcnRleC55IDwgeSAmJiBuZXh0LnkgPj0geSB8fFxuICAgICAgICAgICAgICAgIG5leHQueSA8IHkgJiYgdmVydGV4LnkgPj0geSkgJiZcbiAgICAgICAgICAgICh2ZXJ0ZXgueCA8PSB4IHx8IG5leHQueCA8PSB4KSkge1xuXG4gICAgICAgICAgICBvZGROb2RlcyBePSAodmVydGV4LnggKyAoeSAtIHZlcnRleC55KSAvXG4gICAgICAgICAgICAgICAgKG5leHQueSAtIHZlcnRleC55KSAqIChuZXh0LnggLSB2ZXJ0ZXgueCkgPCB4KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZlcnRleCA9IHZlcnRleC5uZXh0O1xuICAgICAgICBuZXh0ID0gdmVydGV4Lm5leHQgfHwgcG9seS5maXJzdDtcbiAgICB9IHdoaWxlICghdmVydGV4LmVxdWFscyhwb2x5LmZpcnN0KSk7XG5cbiAgICByZXR1cm4gb2RkTm9kZXM7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFZlcnRleDtcbiIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9zcmMvaW5kZXgnKTtcbiIsInZhciBzaWduZWRBcmVhID0gcmVxdWlyZSgnLi9zaWduZWRfYXJlYScpO1xuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGUxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBlMlxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN3ZWVwRXZlbnRzQ29tcChlMSwgZTIpIHtcbiAgdmFyIHAxID0gZTEucG9pbnQ7XG4gIHZhciBwMiA9IGUyLnBvaW50O1xuXG4gIC8vIERpZmZlcmVudCB4LWNvb3JkaW5hdGVcbiAgaWYgKHAxWzBdID4gcDJbMF0pIHJldHVybiAxO1xuICBpZiAocDFbMF0gPCBwMlswXSkgcmV0dXJuIC0xO1xuXG4gIC8vIERpZmZlcmVudCBwb2ludHMsIGJ1dCBzYW1lIHgtY29vcmRpbmF0ZVxuICAvLyBFdmVudCB3aXRoIGxvd2VyIHktY29vcmRpbmF0ZSBpcyBwcm9jZXNzZWQgZmlyc3RcbiAgaWYgKHAxWzFdICE9PSBwMlsxXSkgcmV0dXJuIHAxWzFdID4gcDJbMV0gPyAxIDogLTE7XG5cbiAgcmV0dXJuIHNwZWNpYWxDYXNlcyhlMSwgZTIsIHAxLCBwMik7XG59O1xuXG5cbmZ1bmN0aW9uIHNwZWNpYWxDYXNlcyhlMSwgZTIsIHAxLCBwMikge1xuICAvLyBTYW1lIGNvb3JkaW5hdGVzLCBidXQgb25lIGlzIGEgbGVmdCBlbmRwb2ludCBhbmQgdGhlIG90aGVyIGlzXG4gIC8vIGEgcmlnaHQgZW5kcG9pbnQuIFRoZSByaWdodCBlbmRwb2ludCBpcyBwcm9jZXNzZWQgZmlyc3RcbiAgaWYgKGUxLmxlZnQgIT09IGUyLmxlZnQpXG4gICAgcmV0dXJuIGUxLmxlZnQgPyAxIDogLTE7XG5cbiAgLy8gU2FtZSBjb29yZGluYXRlcywgYm90aCBldmVudHNcbiAgLy8gYXJlIGxlZnQgZW5kcG9pbnRzIG9yIHJpZ2h0IGVuZHBvaW50cy5cbiAgLy8gbm90IGNvbGxpbmVhclxuICBpZiAoc2lnbmVkQXJlYSAocDEsIGUxLm90aGVyRXZlbnQucG9pbnQsIGUyLm90aGVyRXZlbnQucG9pbnQpICE9PSAwKSB7XG4gICAgLy8gdGhlIGV2ZW50IGFzc29jaWF0ZSB0byB0aGUgYm90dG9tIHNlZ21lbnQgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gICAgcmV0dXJuICghZTEuaXNCZWxvdyhlMi5vdGhlckV2ZW50LnBvaW50KSkgPyAxIDogLTE7XG4gIH1cblxuICBpZiAoZTEuaXNTdWJqZWN0ID09PSBlMi5pc1N1YmplY3QpIHtcbiAgICBpZihlMS5jb250b3VySWQgPT09IGUyLmNvbnRvdXJJZCl7XG4gICAgICByZXR1cm4gMDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGUxLmNvbnRvdXJJZCA+IGUyLmNvbnRvdXJJZCA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gKCFlMS5pc1N1YmplY3QgJiYgZTIuaXNTdWJqZWN0KSA/IDEgOiAtMTtcbiAgLy9yZXR1cm4gZTEuaXNTdWJqZWN0ID8gLTEgOiAxO1xufVxuIiwidmFyIHNpZ25lZEFyZWEgICAgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG52YXIgY29tcGFyZUV2ZW50cyA9IHJlcXVpcmUoJy4vY29tcGFyZV9ldmVudHMnKTtcbnZhciBlcXVhbHMgICAgICAgID0gcmVxdWlyZSgnLi9lcXVhbHMnKTtcblxuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGxlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gbGUyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY29tcGFyZVNlZ21lbnRzKGxlMSwgbGUyKSB7XG4gIGlmIChsZTEgPT09IGxlMikgcmV0dXJuIDA7XG5cbiAgLy8gU2VnbWVudHMgYXJlIG5vdCBjb2xsaW5lYXJcbiAgaWYgKHNpZ25lZEFyZWEobGUxLnBvaW50LCBsZTEub3RoZXJFdmVudC5wb2ludCwgbGUyLnBvaW50KSAhPT0gMCB8fFxuICAgIHNpZ25lZEFyZWEobGUxLnBvaW50LCBsZTEub3RoZXJFdmVudC5wb2ludCwgbGUyLm90aGVyRXZlbnQucG9pbnQpICE9PSAwKSB7XG5cbiAgICAvLyBJZiB0aGV5IHNoYXJlIHRoZWlyIGxlZnQgZW5kcG9pbnQgdXNlIHRoZSByaWdodCBlbmRwb2ludCB0byBzb3J0XG4gICAgaWYgKGVxdWFscyhsZTEucG9pbnQsIGxlMi5wb2ludCkpIHJldHVybiBsZTEuaXNCZWxvdyhsZTIub3RoZXJFdmVudC5wb2ludCkgPyAtMSA6IDE7XG5cbiAgICAvLyBEaWZmZXJlbnQgbGVmdCBlbmRwb2ludDogdXNlIHRoZSBsZWZ0IGVuZHBvaW50IHRvIHNvcnRcbiAgICBpZiAobGUxLnBvaW50WzBdID09PSBsZTIucG9pbnRbMF0pIHJldHVybiBsZTEucG9pbnRbMV0gPCBsZTIucG9pbnRbMV0gPyAtMSA6IDE7XG5cbiAgICAvLyBoYXMgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUxIGJlZW4gaW5zZXJ0ZWRcbiAgICAvLyBpbnRvIFMgYWZ0ZXIgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUyID9cbiAgICBpZiAoY29tcGFyZUV2ZW50cyhsZTEsIGxlMikgPT09IDEpIHJldHVybiBsZTIuaXNBYm92ZShsZTEucG9pbnQpID8gLTEgOiAxO1xuXG4gICAgLy8gVGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUyIGhhcyBiZWVuIGluc2VydGVkXG4gICAgLy8gaW50byBTIGFmdGVyIHRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMVxuICAgIHJldHVybiBsZTEuaXNCZWxvdyhsZTIucG9pbnQpID8gLTEgOiAxO1xuICB9XG5cbiAgaWYgKGxlMS5pc1N1YmplY3QgPT09IGxlMi5pc1N1YmplY3Qpe1xuICAgIGlmIChlcXVhbHMobGUxLnBvaW50LCBsZTIucG9pbnQpKSB7XG4gICAgICBpZiAobGUxLmNvbnRvdXJJZCA9PT0gbGUyLmNvbnRvdXJJZCl7XG4gICAgICAgIHJldHVybiAwO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmV0dXJuIGxlMS5jb250b3VySWQgPiBsZTIuY29udG91cklkID8gMSA6IC0xO1xuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBTZWdtZW50cyBhcmUgY29sbGluZWFyXG4gICAgICBpZiAobGUxLmlzU3ViamVjdCAhPT0gbGUyLmlzU3ViamVjdCkgcmV0dXJuIChsZTEuaXNTdWJqZWN0ICYmICFsZTIuaXNTdWJqZWN0KSA/IDEgOiAtMTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gY29tcGFyZUV2ZW50cyhsZTEsIGxlMikgPT09IDEgPyAxIDogLTE7XG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSB7IFxuICBOT1JNQUw6ICAgICAgICAgICAgICAgMCwgXG4gIE5PTl9DT05UUklCVVRJTkc6ICAgICAxLCBcbiAgU0FNRV9UUkFOU0lUSU9OOiAgICAgIDIsIFxuICBESUZGRVJFTlRfVFJBTlNJVElPTjogM1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZXF1YWxzKHAxLCBwMikge1xuICByZXR1cm4gcDFbMF0gPT09IHAyWzBdICYmIHAxWzFdID09PSBwMlsxXTtcbn07IiwidmFyIElOVEVSU0VDVElPTiAgICA9IDA7XG52YXIgVU5JT04gICAgICAgICAgID0gMTtcbnZhciBESUZGRVJFTkNFICAgICAgPSAyO1xudmFyIFhPUiAgICAgICAgICAgICA9IDM7XG5cbnZhciBFTVBUWSAgICAgICAgICAgPSBbXTtcblxudmFyIGVkZ2VUeXBlICAgICAgICA9IHJlcXVpcmUoJy4vZWRnZV90eXBlJyk7XG5cbnZhciBRdWV1ZSAgICAgICAgICAgPSByZXF1aXJlKCd0aW55cXVldWUnKTtcbnZhciBUcmVlICAgICAgICAgICAgPSByZXF1aXJlKCdiaW50cmVlcycpLlJCVHJlZTtcbnZhciBTd2VlcEV2ZW50ICAgICAgPSByZXF1aXJlKCcuL3N3ZWVwX2V2ZW50Jyk7XG5cbnZhciBjb21wYXJlRXZlbnRzICAgPSByZXF1aXJlKCcuL2NvbXBhcmVfZXZlbnRzJyk7XG52YXIgY29tcGFyZVNlZ21lbnRzID0gcmVxdWlyZSgnLi9jb21wYXJlX3NlZ21lbnRzJyk7XG52YXIgaW50ZXJzZWN0aW9uICAgID0gcmVxdWlyZSgnLi9zZWdtZW50X2ludGVyc2VjdGlvbicpO1xudmFyIGVxdWFscyAgICAgICAgICA9IHJlcXVpcmUoJy4vZXF1YWxzJyk7XG5cbnZhciBtYXggPSBNYXRoLm1heDtcbnZhciBtaW4gPSBNYXRoLm1pbjtcblxuLyoqXG4gKiBAcGFyYW0gIHs8QXJyYXkuPE51bWJlcj59IHMxXG4gKiBAcGFyYW0gIHs8QXJyYXkuPE51bWJlcj59IHMyXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgIGlzU3ViamVjdFxuICogQHBhcmFtICB7UXVldWV9ICAgICAgICAgICBldmVudFF1ZXVlXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gIGJib3hcbiAqL1xuZnVuY3Rpb24gcHJvY2Vzc1NlZ21lbnQoczEsIHMyLCBpc1N1YmplY3QsIGRlcHRoLCBldmVudFF1ZXVlLCBiYm94KSB7XG4gIC8vIFBvc3NpYmxlIGRlZ2VuZXJhdGUgY29uZGl0aW9uLlxuICAvLyBpZiAoZXF1YWxzKHMxLCBzMikpIHJldHVybjtcblxuICB2YXIgZTEgPSBuZXcgU3dlZXBFdmVudChzMSwgZmFsc2UsIHVuZGVmaW5lZCwgaXNTdWJqZWN0KTtcbiAgdmFyIGUyID0gbmV3IFN3ZWVwRXZlbnQoczIsIGZhbHNlLCBlMSwgICAgICAgIGlzU3ViamVjdCk7XG4gIGUxLm90aGVyRXZlbnQgPSBlMjtcblxuICBlMS5jb250b3VySWQgPSBlMi5jb250b3VySWQgPSBkZXB0aDtcblxuICBpZiAoY29tcGFyZUV2ZW50cyhlMSwgZTIpID4gMCkge1xuICAgIGUyLmxlZnQgPSB0cnVlO1xuICB9IGVsc2Uge1xuICAgIGUxLmxlZnQgPSB0cnVlO1xuICB9XG5cbiAgYmJveFswXSA9IG1pbihiYm94WzBdLCBzMVswXSk7XG4gIGJib3hbMV0gPSBtaW4oYmJveFsxXSwgczFbMV0pO1xuICBiYm94WzJdID0gbWF4KGJib3hbMl0sIHMxWzBdKTtcbiAgYmJveFszXSA9IG1heChiYm94WzNdLCBzMVsxXSk7XG5cbiAgLy8gUHVzaGluZyBpdCBzbyB0aGUgcXVldWUgaXMgc29ydGVkIGZyb20gbGVmdCB0byByaWdodCxcbiAgLy8gd2l0aCBvYmplY3Qgb24gdGhlIGxlZnQgaGF2aW5nIHRoZSBoaWdoZXN0IHByaW9yaXR5LlxuICBldmVudFF1ZXVlLnB1c2goZTEpO1xuICBldmVudFF1ZXVlLnB1c2goZTIpO1xufVxuXG52YXIgY29udG91cklkID0gMDtcblxuZnVuY3Rpb24gcHJvY2Vzc1BvbHlnb24ocG9seWdvbiwgaXNTdWJqZWN0LCBkZXB0aCwgcXVldWUsIGJib3gpIHtcbiAgdmFyIGksIGxlbjtcbiAgaWYgKHR5cGVvZiBwb2x5Z29uWzBdWzBdID09PSAnbnVtYmVyJykge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBvbHlnb24ubGVuZ3RoIC0gMTsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBwcm9jZXNzU2VnbWVudChwb2x5Z29uW2ldLCBwb2x5Z29uW2kgKyAxXSwgaXNTdWJqZWN0LCBkZXB0aCArIDEsIHF1ZXVlLCBiYm94KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcG9seWdvbi5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgY29udG91cklkKys7XG4gICAgICBwcm9jZXNzUG9seWdvbihwb2x5Z29uW2ldLCBpc1N1YmplY3QsIGNvbnRvdXJJZCwgcXVldWUsIGJib3gpO1xuICAgIH1cbiAgfVxufVxuXG5cbmZ1bmN0aW9uIGZpbGxRdWV1ZShzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94KSB7XG4gIHZhciBldmVudFF1ZXVlID0gbmV3IFF1ZXVlKG51bGwsIGNvbXBhcmVFdmVudHMpO1xuICBjb250b3VySWQgPSAwO1xuXG4gIHByb2Nlc3NQb2x5Z29uKHN1YmplY3QsICB0cnVlLCAgMCwgZXZlbnRRdWV1ZSwgc2Jib3gpO1xuICBwcm9jZXNzUG9seWdvbihjbGlwcGluZywgZmFsc2UsIDAsIGV2ZW50UXVldWUsIGNiYm94KTtcblxuICByZXR1cm4gZXZlbnRRdWV1ZTtcbn1cblxuXG5mdW5jdGlvbiBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LCBzd2VlcExpbmUsIG9wZXJhdGlvbikge1xuICAvLyBjb21wdXRlIGluT3V0IGFuZCBvdGhlckluT3V0IGZpZWxkc1xuICBpZiAocHJldiA9PT0gbnVsbCkge1xuICAgIGV2ZW50LmluT3V0ICAgICAgPSBmYWxzZTtcbiAgICBldmVudC5vdGhlckluT3V0ID0gdHJ1ZTtcblxuICAvLyBwcmV2aW91cyBsaW5lIHNlZ21lbnQgaW4gc3dlZXBsaW5lIGJlbG9uZ3MgdG8gdGhlIHNhbWUgcG9seWdvblxuICB9IGVsc2UgaWYgKGV2ZW50LmlzU3ViamVjdCA9PT0gcHJldi5pc1N1YmplY3QpIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gIXByZXYuaW5PdXQ7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHByZXYub3RoZXJJbk91dDtcblxuICAvLyBwcmV2aW91cyBsaW5lIHNlZ21lbnQgaW4gc3dlZXBsaW5lIGJlbG9uZ3MgdG8gdGhlIGNsaXBwaW5nIHBvbHlnb25cbiAgfSBlbHNlIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gIXByZXYub3RoZXJJbk91dDtcbiAgICBldmVudC5vdGhlckluT3V0ID0gcHJldi5pc1ZlcnRpY2FsKCkgPyAhcHJldi5pbk91dCA6IHByZXYuaW5PdXQ7XG4gIH1cblxuICAvLyBjb21wdXRlIHByZXZJblJlc3VsdCBmaWVsZFxuICBpZiAocHJldikge1xuICAgIGV2ZW50LnByZXZJblJlc3VsdCA9ICghaW5SZXN1bHQocHJldiwgb3BlcmF0aW9uKSB8fCBwcmV2LmlzVmVydGljYWwoKSkgP1xuICAgICAgIHByZXYucHJldkluUmVzdWx0IDogcHJldjtcbiAgfVxuICAvLyBjaGVjayBpZiB0aGUgbGluZSBzZWdtZW50IGJlbG9uZ3MgdG8gdGhlIEJvb2xlYW4gb3BlcmF0aW9uXG4gIGV2ZW50LmluUmVzdWx0ID0gaW5SZXN1bHQoZXZlbnQsIG9wZXJhdGlvbik7XG59XG5cblxuZnVuY3Rpb24gaW5SZXN1bHQoZXZlbnQsIG9wZXJhdGlvbikge1xuICBzd2l0Y2ggKGV2ZW50LnR5cGUpIHtcbiAgICBjYXNlIGVkZ2VUeXBlLk5PUk1BTDpcbiAgICAgIHN3aXRjaCAob3BlcmF0aW9uKSB7XG4gICAgICAgIGNhc2UgSU5URVJTRUNUSU9OOlxuICAgICAgICAgIHJldHVybiAhZXZlbnQub3RoZXJJbk91dDtcbiAgICAgICAgY2FzZSBVTklPTjpcbiAgICAgICAgICByZXR1cm4gZXZlbnQub3RoZXJJbk91dDtcbiAgICAgICAgY2FzZSBESUZGRVJFTkNFOlxuICAgICAgICAgIHJldHVybiAoZXZlbnQuaXNTdWJqZWN0ICYmIGV2ZW50Lm90aGVySW5PdXQpIHx8XG4gICAgICAgICAgICAgICAgICghZXZlbnQuaXNTdWJqZWN0ICYmICFldmVudC5vdGhlckluT3V0KTtcbiAgICAgICAgY2FzZSBYT1I6XG4gICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG4gICAgY2FzZSBlZGdlVHlwZS5TQU1FX1RSQU5TSVRJT046XG4gICAgICByZXR1cm4gb3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04gfHwgb3BlcmF0aW9uID09PSBVTklPTjtcbiAgICBjYXNlIGVkZ2VUeXBlLkRJRkZFUkVOVF9UUkFOU0lUSU9OOlxuICAgICAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRTtcbiAgICBjYXNlIGVkZ2VUeXBlLk5PTl9DT05UUklCVVRJTkc6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2UxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBzZTJcbiAqIEBwYXJhbSAge1F1ZXVlfSAgICAgIHF1ZXVlXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIHBvc3NpYmxlSW50ZXJzZWN0aW9uKHNlMSwgc2UyLCBxdWV1ZSkge1xuICAvLyB0aGF0IGRpc2FsbG93cyBzZWxmLWludGVyc2VjdGluZyBwb2x5Z29ucyxcbiAgLy8gZGlkIGNvc3QgdXMgaGFsZiBhIGRheSwgc28gSSdsbCBsZWF2ZSBpdFxuICAvLyBvdXQgb2YgcmVzcGVjdFxuICAvLyBpZiAoc2UxLmlzU3ViamVjdCA9PT0gc2UyLmlzU3ViamVjdCkgcmV0dXJuO1xuXG4gIHZhciBpbnRlciA9IGludGVyc2VjdGlvbihcbiAgICBzZTEucG9pbnQsIHNlMS5vdGhlckV2ZW50LnBvaW50LFxuICAgIHNlMi5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnRcbiAgKTtcblxuICB2YXIgbmludGVyc2VjdGlvbnMgPSBpbnRlciA/IGludGVyLmxlbmd0aCA6IDA7XG4gIGlmIChuaW50ZXJzZWN0aW9ucyA9PT0gMCkgcmV0dXJuIDA7IC8vIG5vIGludGVyc2VjdGlvblxuXG4gIC8vIHRoZSBsaW5lIHNlZ21lbnRzIGludGVyc2VjdCBhdCBhbiBlbmRwb2ludCBvZiBib3RoIGxpbmUgc2VnbWVudHNcbiAgaWYgKChuaW50ZXJzZWN0aW9ucyA9PT0gMSkgJiZcbiAgICAgIChlcXVhbHMoc2UxLnBvaW50LCBzZTIucG9pbnQpIHx8XG4gICAgICAgZXF1YWxzKHNlMS5vdGhlckV2ZW50LnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludCkpKSB7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDIgJiYgc2UxLmlzU3ViamVjdCA9PT0gc2UyLmlzU3ViamVjdCl7XG4gICAgaWYoc2UxLmNvbnRvdXJJZCA9PT0gc2UyLmNvbnRvdXJJZCl7XG4gICAgY29uc29sZS53YXJuKCdFZGdlcyBvZiB0aGUgc2FtZSBwb2x5Z29uIG92ZXJsYXAnLFxuICAgICAgc2UxLnBvaW50LCBzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludCk7XG4gICAgfVxuICAgIC8vdGhyb3cgbmV3IEVycm9yKCdFZGdlcyBvZiB0aGUgc2FtZSBwb2x5Z29uIG92ZXJsYXAnKTtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8vIFRoZSBsaW5lIHNlZ21lbnRzIGFzc29jaWF0ZWQgdG8gc2UxIGFuZCBzZTIgaW50ZXJzZWN0XG4gIGlmIChuaW50ZXJzZWN0aW9ucyA9PT0gMSkge1xuXG4gICAgLy8gaWYgdGhlIGludGVyc2VjdGlvbiBwb2ludCBpcyBub3QgYW4gZW5kcG9pbnQgb2Ygc2UxXG4gICAgaWYgKCFlcXVhbHMoc2UxLnBvaW50LCBpbnRlclswXSkgJiYgIWVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgaW50ZXJbMF0pKSB7XG4gICAgICBkaXZpZGVTZWdtZW50KHNlMSwgaW50ZXJbMF0sIHF1ZXVlKTtcbiAgICB9XG5cbiAgICAvLyBpZiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50IGlzIG5vdCBhbiBlbmRwb2ludCBvZiBzZTJcbiAgICBpZiAoIWVxdWFscyhzZTIucG9pbnQsIGludGVyWzBdKSAmJiAhZXF1YWxzKHNlMi5vdGhlckV2ZW50LnBvaW50LCBpbnRlclswXSkpIHtcbiAgICAgIGRpdmlkZVNlZ21lbnQoc2UyLCBpbnRlclswXSwgcXVldWUpO1xuICAgIH1cbiAgICByZXR1cm4gMTtcbiAgfVxuXG4gIC8vIFRoZSBsaW5lIHNlZ21lbnRzIGFzc29jaWF0ZWQgdG8gc2UxIGFuZCBzZTIgb3ZlcmxhcFxuICB2YXIgZXZlbnRzICAgICAgICA9IFtdO1xuICB2YXIgbGVmdENvaW5jaWRlICA9IGZhbHNlO1xuICB2YXIgcmlnaHRDb2luY2lkZSA9IGZhbHNlO1xuXG4gIGlmIChlcXVhbHMoc2UxLnBvaW50LCBzZTIucG9pbnQpKSB7XG4gICAgbGVmdENvaW5jaWRlID0gdHJ1ZTsgLy8gbGlua2VkXG4gIH0gZWxzZSBpZiAoY29tcGFyZUV2ZW50cyhzZTEsIHNlMikgPT09IDEpIHtcbiAgICBldmVudHMucHVzaChzZTIsIHNlMSk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLnB1c2goc2UxLCBzZTIpO1xuICB9XG5cbiAgaWYgKGVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpKSB7XG4gICAgcmlnaHRDb2luY2lkZSA9IHRydWU7XG4gIH0gZWxzZSBpZiAoY29tcGFyZUV2ZW50cyhzZTEub3RoZXJFdmVudCwgc2UyLm90aGVyRXZlbnQpID09PSAxKSB7XG4gICAgZXZlbnRzLnB1c2goc2UyLm90aGVyRXZlbnQsIHNlMS5vdGhlckV2ZW50KTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHMucHVzaChzZTEub3RoZXJFdmVudCwgc2UyLm90aGVyRXZlbnQpO1xuICB9XG5cbiAgaWYgKChsZWZ0Q29pbmNpZGUgJiYgcmlnaHRDb2luY2lkZSkgfHwgbGVmdENvaW5jaWRlKSB7XG4gICAgLy8gYm90aCBsaW5lIHNlZ21lbnRzIGFyZSBlcXVhbCBvciBzaGFyZSB0aGUgbGVmdCBlbmRwb2ludFxuICAgIHNlMS50eXBlID0gZWRnZVR5cGUuTk9OX0NPTlRSSUJVVElORztcbiAgICBzZTIudHlwZSA9IChzZTEuaW5PdXQgPT09IHNlMi5pbk91dCkgP1xuICAgICAgZWRnZVR5cGUuU0FNRV9UUkFOU0lUSU9OIDpcbiAgICAgIGVkZ2VUeXBlLkRJRkZFUkVOVF9UUkFOU0lUSU9OO1xuXG4gICAgaWYgKGxlZnRDb2luY2lkZSAmJiAhcmlnaHRDb2luY2lkZSkge1xuICAgICAgLy8gaG9uZXN0bHkgbm8gaWRlYSwgYnV0IGNoYW5naW5nIGV2ZW50cyBzZWxlY3Rpb24gZnJvbSBbMiwgMV1cbiAgICAgIC8vIHRvIFswLCAxXSBmaXhlcyB0aGUgb3ZlcmxhcHBpbmcgc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvbnMgaXNzdWVcbiAgICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLm90aGVyRXZlbnQsIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICAgIH1cbiAgICByZXR1cm4gMjtcbiAgfVxuXG4gIC8vIHRoZSBsaW5lIHNlZ21lbnRzIHNoYXJlIHRoZSByaWdodCBlbmRwb2ludFxuICBpZiAocmlnaHRDb2luY2lkZSkge1xuICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIC8vIG5vIGxpbmUgc2VnbWVudCBpbmNsdWRlcyB0b3RhbGx5IHRoZSBvdGhlciBvbmVcbiAgaWYgKGV2ZW50c1swXSAhPT0gZXZlbnRzWzNdLm90aGVyRXZlbnQpIHtcbiAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gICAgZGl2aWRlU2VnbWVudChldmVudHNbMV0sIGV2ZW50c1syXS5wb2ludCwgcXVldWUpO1xuICAgIHJldHVybiAzO1xuICB9XG5cbiAgLy8gb25lIGxpbmUgc2VnbWVudCBpbmNsdWRlcyB0aGUgb3RoZXIgb25lXG4gIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgZGl2aWRlU2VnbWVudChldmVudHNbM10ub3RoZXJFdmVudCwgZXZlbnRzWzJdLnBvaW50LCBxdWV1ZSk7XG5cbiAgcmV0dXJuIDM7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBzZVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHBcbiAqIEBwYXJhbSAge1F1ZXVlfSBxdWV1ZVxuICogQHJldHVybiB7UXVldWV9XG4gKi9cbmZ1bmN0aW9uIGRpdmlkZVNlZ21lbnQoc2UsIHAsIHF1ZXVlKSAge1xuICB2YXIgciA9IG5ldyBTd2VlcEV2ZW50KHAsIGZhbHNlLCBzZSwgICAgICAgICAgICBzZS5pc1N1YmplY3QpO1xuICB2YXIgbCA9IG5ldyBTd2VlcEV2ZW50KHAsIHRydWUsICBzZS5vdGhlckV2ZW50LCBzZS5pc1N1YmplY3QpO1xuXG4gIC8vIGF2b2lkIGEgcm91bmRpbmcgZXJyb3IuIFRoZSBsZWZ0IGV2ZW50IHdvdWxkIGJlIHByb2Nlc3NlZCBhZnRlciB0aGUgcmlnaHQgZXZlbnRcbiAgaWYgKGNvbXBhcmVFdmVudHMobCwgc2Uub3RoZXJFdmVudCkgPiAwKSB7XG4gICAgc2Uub3RoZXJFdmVudC5sZWZ0ID0gdHJ1ZTtcbiAgICBsLmxlZnQgPSBmYWxzZTtcbiAgfVxuXG4gIC8vIGF2b2lkIGEgcm91bmRpbmcgZXJyb3IuIFRoZSBsZWZ0IGV2ZW50IHdvdWxkIGJlIHByb2Nlc3NlZCBhZnRlciB0aGUgcmlnaHQgZXZlbnRcbiAgLy8gaWYgKGNvbXBhcmVFdmVudHMoc2UsIHIpID4gMCkge31cblxuICBzZS5vdGhlckV2ZW50Lm90aGVyRXZlbnQgPSBsO1xuICBzZS5vdGhlckV2ZW50ID0gcjtcblxuICBxdWV1ZS5wdXNoKGwpO1xuICBxdWV1ZS5wdXNoKHIpO1xuXG4gIHJldHVybiBxdWV1ZTtcbn1cblxuXG4vKiBlc2xpbnQtZGlzYWJsZSBuby11bnVzZWQtdmFycywgbm8tZGVidWdnZXIgKi9cbmZ1bmN0aW9uIGl0ZXJhdG9yRXF1YWxzKGl0MSwgaXQyKSB7XG4gIHJldHVybiBpdDEuX2N1cnNvciA9PT0gaXQyLl9jdXJzb3I7XG59XG5cblxuZnVuY3Rpb24gX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIHBvcywgZXZlbnQpIHtcbiAgdmFyIG1hcCA9IHdpbmRvdy5tYXA7XG4gIGlmICghbWFwKSByZXR1cm47XG4gIGlmICh3aW5kb3cuc3dzKSB3aW5kb3cuc3dzLmZvckVhY2goZnVuY3Rpb24ocCkge1xuICAgIG1hcC5yZW1vdmVMYXllcihwKTtcbiAgfSk7XG4gIHdpbmRvdy5zd3MgPSBbXTtcbiAgc3dlZXBMaW5lLmVhY2goZnVuY3Rpb24oZSkge1xuICAgIHZhciBwb2x5ID0gTC5wb2x5bGluZShbZS5wb2ludC5zbGljZSgpLnJldmVyc2UoKSwgZS5vdGhlckV2ZW50LnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpXSwgeyBjb2xvcjogJ2dyZWVuJyB9KS5hZGRUbyhtYXApO1xuICAgIHdpbmRvdy5zd3MucHVzaChwb2x5KTtcbiAgfSk7XG5cbiAgaWYgKHdpbmRvdy52dCkgbWFwLnJlbW92ZUxheWVyKHdpbmRvdy52dCk7XG4gIHZhciB2ID0gcG9zLnNsaWNlKCk7XG4gIHZhciBiID0gbWFwLmdldEJvdW5kcygpO1xuICB3aW5kb3cudnQgPSBMLnBvbHlsaW5lKFtbYi5nZXROb3J0aCgpLCB2WzBdXSwgW2IuZ2V0U291dGgoKSwgdlswXV1dLCB7Y29sb3I6ICdncmVlbicsIHdlaWdodDogMX0pLmFkZFRvKG1hcCk7XG5cbiAgaWYgKHdpbmRvdy5wcykgbWFwLnJlbW92ZUxheWVyKHdpbmRvdy5wcyk7XG4gIHdpbmRvdy5wcyA9IEwucG9seWxpbmUoW2V2ZW50LnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpLCBldmVudC5vdGhlckV2ZW50LnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpXSwge2NvbG9yOiAnYmxhY2snLCB3ZWlnaHQ6IDksIG9wYWNpdHk6IDAuNH0pLmFkZFRvKG1hcCk7XG4gIGRlYnVnZ2VyO1xufVxuLyogZXNsaW50LWVuYWJsZSBuby11bnVzZWQtdmFycywgbm8tZGVidWdnZXIgKi9cblxuXG5mdW5jdGlvbiBzdWJkaXZpZGVTZWdtZW50cyhldmVudFF1ZXVlLCBzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pIHtcbiAgdmFyIHNvcnRlZEV2ZW50cyA9IFtdO1xuICB2YXIgcHJldiwgbmV4dDtcblxuICB2YXIgc3dlZXBMaW5lID0gbmV3IFRyZWUoY29tcGFyZVNlZ21lbnRzKTtcbiAgdmFyIHNvcnRlZEV2ZW50cyA9IFtdO1xuXG4gIHZhciByaWdodGJvdW5kID0gbWluKHNiYm94WzJdLCBjYmJveFsyXSk7XG5cbiAgdmFyIHByZXYsIG5leHQ7XG5cbiAgd2hpbGUgKGV2ZW50UXVldWUubGVuZ3RoKSB7XG4gICAgdmFyIGV2ZW50ID0gZXZlbnRRdWV1ZS5wb3AoKTtcbiAgICBzb3J0ZWRFdmVudHMucHVzaChldmVudCk7XG5cbiAgICAvLyBvcHRpbWl6YXRpb24gYnkgYmJveGVzIGZvciBpbnRlcnNlY3Rpb24gYW5kIGRpZmZlcmVuY2UgZ29lcyBoZXJlXG4gICAgaWYgKChvcGVyYXRpb24gPT09IElOVEVSU0VDVElPTiAmJiBldmVudC5wb2ludFswXSA+IHJpZ2h0Ym91bmQpIHx8XG4gICAgICAgIChvcGVyYXRpb24gPT09IERJRkZFUkVOQ0UgICAmJiBldmVudC5wb2ludFswXSA+IHNiYm94WzJdKSkge1xuICAgICAgYnJlYWs7XG4gICAgfVxuXG4gICAgaWYgKGV2ZW50LmxlZnQpIHtcbiAgICAgIHN3ZWVwTGluZS5pbnNlcnQoZXZlbnQpO1xuICAgICAgLy8gX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIGV2ZW50LnBvaW50LCBldmVudCk7XG5cbiAgICAgIG5leHQgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG4gICAgICBldmVudC5pdGVyYXRvciA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgIHByZXYucHJldigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihzd2VlcExpbmUubWF4KCkpO1xuICAgICAgICBwcmV2Lm5leHQoKTtcbiAgICAgIH1cbiAgICAgIG5leHQubmV4dCgpO1xuXG4gICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuXG4gICAgICBpZiAobmV4dC5kYXRhKCkpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlSW50ZXJzZWN0aW9uKGV2ZW50LCBuZXh0LmRhdGEoKSwgZXZlbnRRdWV1ZSkgPT09IDIpIHtcbiAgICAgICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIG5leHQuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgaWYgKHByZXYuZGF0YSgpKSB7XG4gICAgICAgIGlmIChwb3NzaWJsZUludGVyc2VjdGlvbihwcmV2LmRhdGEoKSwgZXZlbnQsIGV2ZW50UXVldWUpID09PSAyKSB7XG4gICAgICAgICAgdmFyIHByZXZwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHByZXYuZGF0YSgpKTtcbiAgICAgICAgICBpZiAocHJldnByZXYuZGF0YSgpICE9PSBzd2VlcExpbmUubWluKCkpIHtcbiAgICAgICAgICAgIHByZXZwcmV2LnByZXYoKTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcHJldnByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoc3dlZXBMaW5lLm1heCgpKTtcbiAgICAgICAgICAgIHByZXZwcmV2Lm5leHQoKTtcbiAgICAgICAgICB9XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhwcmV2LmRhdGEoKSwgcHJldnByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH0gZWxzZSB7XG4gICAgICBldmVudCA9IGV2ZW50Lm90aGVyRXZlbnQ7XG4gICAgICBuZXh0ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcbiAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuXG4gICAgICAvLyBfcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgZXZlbnQub3RoZXJFdmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBpZiAoIShwcmV2ICYmIG5leHQpKSBjb250aW51ZTtcblxuICAgICAgaWYgKHByZXYuZGF0YSgpICE9PSBzd2VlcExpbmUubWluKCkpIHtcbiAgICAgICAgcHJldi5wcmV2KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgIHByZXYubmV4dCgpO1xuICAgICAgfVxuICAgICAgbmV4dC5uZXh0KCk7XG4gICAgICBzd2VlcExpbmUucmVtb3ZlKGV2ZW50KTtcblxuICAgICAgLy9fcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgZXZlbnQub3RoZXJFdmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBpZiAobmV4dC5kYXRhKCkgJiYgcHJldi5kYXRhKCkpIHtcbiAgICAgICAgcG9zc2libGVJbnRlcnNlY3Rpb24ocHJldi5kYXRhKCksIG5leHQuZGF0YSgpLCBldmVudFF1ZXVlKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIHNvcnRlZEV2ZW50cztcbn1cblxuXG5mdW5jdGlvbiBzd2FwIChhcnIsIGksIG4pIHtcbiAgdmFyIHRlbXAgPSBhcnJbaV07XG4gIGFycltpXSA9IGFycltuXTtcbiAgYXJyW25dID0gdGVtcDtcbn1cblxuXG5mdW5jdGlvbiBjaGFuZ2VPcmllbnRhdGlvbihjb250b3VyKSB7XG4gIHJldHVybiBjb250b3VyLnJldmVyc2UoKTtcbn1cblxuXG5mdW5jdGlvbiBpc0FycmF5IChhcnIpIHtcbiAgcmV0dXJuIE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChhcnIpID09PSAnW29iamVjdCBBcnJheV0nO1xufVxuXG5cbmZ1bmN0aW9uIGFkZEhvbGUoY29udG91ciwgaWR4KSB7XG4gIGlmICghaXNBcnJheShjb250b3VyWzBdWzBdKSkge1xuICAgIGNvbnRvdXIgPSBbY29udG91cl07XG4gIH1cbiAgY29udG91cltpZHhdID0gW107XG4gIHJldHVybiBjb250b3VyO1xufVxuXG5cbmZ1bmN0aW9uIGNvbm5lY3RFZGdlcyhzb3J0ZWRFdmVudHMpIHtcbiAgLy8gY29weSB0aGUgZXZlbnRzIGluIHRoZSByZXN1bHQgcG9seWdvbiB0byByZXN1bHRFdmVudHMgYXJyYXlcbiAgdmFyIHJlc3VsdEV2ZW50cyA9IFtdO1xuICB2YXIgZXZlbnQsIGksIGxlbjtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBzb3J0ZWRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBldmVudCA9IHNvcnRlZEV2ZW50c1tpXTtcbiAgICBpZiAoKGV2ZW50LmxlZnQgJiYgZXZlbnQuaW5SZXN1bHQpIHx8XG4gICAgICAoIWV2ZW50LmxlZnQgJiYgZXZlbnQub3RoZXJFdmVudC5pblJlc3VsdCkpIHtcbiAgICAgIHJlc3VsdEV2ZW50cy5wdXNoKGV2ZW50KTtcbiAgICB9XG4gIH1cblxuICAvLyBEdWUgdG8gb3ZlcmxhcHBpbmcgZWRnZXMgdGhlIHJlc3VsdEV2ZW50cyBhcnJheSBjYW4gYmUgbm90IHdob2xseSBzb3J0ZWRcbiAgdmFyIHNvcnRlZCA9IGZhbHNlO1xuICB3aGlsZSAoIXNvcnRlZCkge1xuICAgIHNvcnRlZCA9IHRydWU7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBpZiAoKGkgKyAxKSA8IGxlbiAmJlxuICAgICAgICBjb21wYXJlRXZlbnRzKHJlc3VsdEV2ZW50c1tpXSwgcmVzdWx0RXZlbnRzW2kgKyAxXSkgPT09IDEpIHtcbiAgICAgICAgc3dhcChyZXN1bHRFdmVudHMsIGksIGkgKyAxKTtcbiAgICAgICAgc29ydGVkID0gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgcmVzdWx0RXZlbnRzW2ldLnBvcyA9IGk7XG4gICAgaWYgKCFyZXN1bHRFdmVudHNbaV0ubGVmdCkge1xuICAgICAgdmFyIHRlbXAgPSByZXN1bHRFdmVudHNbaV0ucG9zO1xuICAgICAgcmVzdWx0RXZlbnRzW2ldLnBvcyA9IHJlc3VsdEV2ZW50c1tpXS5vdGhlckV2ZW50LnBvcztcbiAgICAgIHJlc3VsdEV2ZW50c1tpXS5vdGhlckV2ZW50LnBvcyA9IHRlbXA7XG4gICAgfVxuICB9XG5cbiAgLy8gXCJmYWxzZVwiLWZpbGxlZCBhcnJheVxuICB2YXIgcHJvY2Vzc2VkID0gQXJyYXkocmVzdWx0RXZlbnRzLmxlbmd0aCk7XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICB2YXIgZGVwdGggID0gW107XG4gIHZhciBob2xlT2YgPSBbXTtcbiAgdmFyIGlzSG9sZSA9IHt9O1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGlmIChwcm9jZXNzZWRbaV0pIGNvbnRpbnVlO1xuXG4gICAgdmFyIGNvbnRvdXIgPSBbXTtcbiAgICByZXN1bHQucHVzaChjb250b3VyKTtcblxuICAgIHZhciBjb250b3VySWQgPSByZXN1bHQubGVuZ3RoIC0gMTtcbiAgICBkZXB0aC5wdXNoKDApO1xuICAgIGhvbGVPZi5wdXNoKC0xKTtcblxuXG4gICAgaWYgKHJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQpIHtcbiAgICAgIHZhciBsb3dlckNvbnRvdXJJZCA9IHJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQuY29udG91cklkO1xuICAgICAgaWYgKCFyZXN1bHRFdmVudHNbaV0ucHJldkluUmVzdWx0LnJlc3VsdEluT3V0KSB7XG4gICAgICAgIGFkZEhvbGUocmVzdWx0W2xvd2VyQ29udG91cklkXSwgY29udG91cklkKTtcbiAgICAgICAgaG9sZU9mW2NvbnRvdXJJZF0gPSBsb3dlckNvbnRvdXJJZDtcbiAgICAgICAgZGVwdGhbY29udG91cklkXSAgPSBkZXB0aFtsb3dlckNvbnRvdXJJZF0gKyAxO1xuICAgICAgICBpc0hvbGVbY29udG91cklkXSA9IHRydWU7XG4gICAgICB9IGVsc2UgaWYgKGlzSG9sZVtsb3dlckNvbnRvdXJJZF0pIHtcbiAgICAgICAgYWRkSG9sZShyZXN1bHRbaG9sZU9mW2xvd2VyQ29udG91cklkXV0sIGNvbnRvdXJJZCk7XG4gICAgICAgIGhvbGVPZltjb250b3VySWRdID0gaG9sZU9mW2xvd2VyQ29udG91cklkXTtcbiAgICAgICAgZGVwdGhbY29udG91cklkXSAgPSBkZXB0aFtsb3dlckNvbnRvdXJJZF07XG4gICAgICAgIGlzSG9sZVtjb250b3VySWRdID0gdHJ1ZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgcG9zID0gaTtcbiAgICB2YXIgaW5pdGlhbCA9IHJlc3VsdEV2ZW50c1tpXS5wb2ludDtcbiAgICBjb250b3VyLnB1c2goaW5pdGlhbCk7XG5cbiAgICB3aGlsZSAocG9zID49IGkpIHtcbiAgICAgIHByb2Nlc3NlZFtwb3NdID0gdHJ1ZTtcblxuICAgICAgaWYgKHJlc3VsdEV2ZW50c1twb3NdLmxlZnQpIHtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ucmVzdWx0SW5PdXQgPSBmYWxzZTtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10uY29udG91cklkICAgPSBjb250b3VySWQ7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LnJlc3VsdEluT3V0ID0gdHJ1ZTtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5jb250b3VySWQgICA9IGNvbnRvdXJJZDtcbiAgICAgIH1cblxuICAgICAgcG9zID0gcmVzdWx0RXZlbnRzW3Bvc10ucG9zO1xuICAgICAgcHJvY2Vzc2VkW3Bvc10gPSB0cnVlO1xuXG4gICAgICBjb250b3VyLnB1c2gocmVzdWx0RXZlbnRzW3Bvc10ucG9pbnQpO1xuICAgICAgcG9zID0gbmV4dFBvcyhwb3MsIHJlc3VsdEV2ZW50cywgcHJvY2Vzc2VkKTtcbiAgICB9XG5cbiAgICBwb3MgPSBwb3MgPT09IC0xID8gaSA6IHBvcztcblxuICAgIHByb2Nlc3NlZFtwb3NdID0gcHJvY2Vzc2VkW3Jlc3VsdEV2ZW50c1twb3NdLnBvc10gPSB0cnVlO1xuICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQucmVzdWx0SW5PdXQgPSB0cnVlO1xuICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQuY29udG91cklkICAgPSBjb250b3VySWQ7XG5cblxuXG5cbiAgICAvLyBkZXB0aCBpcyBldmVuXG4gICAgLyogZXNsaW50LWRpc2FibGUgbm8tYml0d2lzZSAqL1xuICAgIGlmIChkZXB0aFtjb250b3VySWRdICYgMSkge1xuICAgICAgY2hhbmdlT3JpZW50YXRpb24oY29udG91cik7XG4gICAgfVxuICAgIC8qIGVzbGludC1lbmFibGUgbm8tYml0d2lzZSAqL1xuICB9XG5cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gcG9zXG4gKiBAcGFyYW0gIHtBcnJheS48U3dlZXBFdmVudD59IHJlc3VsdEV2ZW50c1xuICogQHBhcmFtICB7QXJyYXkuPEJvb2xlYW4+fSAgICBwcm9jZXNzZWRcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gbmV4dFBvcyhwb3MsIHJlc3VsdEV2ZW50cywgcHJvY2Vzc2VkKSB7XG4gIHZhciBuZXdQb3MgPSBwb3MgKyAxO1xuICB2YXIgbGVuZ3RoID0gcmVzdWx0RXZlbnRzLmxlbmd0aDtcbiAgd2hpbGUgKG5ld1BvcyA8IGxlbmd0aCAmJlxuICAgICAgICAgZXF1YWxzKHJlc3VsdEV2ZW50c1tuZXdQb3NdLnBvaW50LCByZXN1bHRFdmVudHNbcG9zXS5wb2ludCkpIHtcbiAgICBpZiAoIXByb2Nlc3NlZFtuZXdQb3NdKSB7XG4gICAgICByZXR1cm4gbmV3UG9zO1xuICAgIH0gZWxzZSB7XG4gICAgICBuZXdQb3MgPSBuZXdQb3MgKyAxO1xuICAgIH1cbiAgfVxuXG4gIG5ld1BvcyA9IHBvcyAtIDE7XG5cbiAgd2hpbGUgKHByb2Nlc3NlZFtuZXdQb3NdKSB7XG4gICAgbmV3UG9zID0gbmV3UG9zIC0gMTtcbiAgfVxuICByZXR1cm4gbmV3UG9zO1xufVxuXG5cbmZ1bmN0aW9uIHRyaXZpYWxPcGVyYXRpb24oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbikge1xuICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgaWYgKHN1YmplY3QubGVuZ3RoICogY2xpcHBpbmcubGVuZ3RoID09PSAwKSB7XG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OKSB7XG4gICAgICByZXN1bHQgPSBFTVBUWTtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSkge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gVU5JT04gfHwgb3BlcmF0aW9uID09PSBYT1IpIHtcbiAgICAgIHJlc3VsdCA9IChzdWJqZWN0Lmxlbmd0aCA9PT0gMCkgPyBjbGlwcGluZyA6IHN1YmplY3Q7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gY29tcGFyZUJCb3hlcyhzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pIHtcbiAgdmFyIHJlc3VsdCA9IG51bGw7XG4gIGlmIChzYmJveFswXSA+IGNiYm94WzJdIHx8XG4gICAgICBjYmJveFswXSA+IHNiYm94WzJdIHx8XG4gICAgICBzYmJveFsxXSA+IGNiYm94WzNdIHx8XG4gICAgICBjYmJveFsxXSA+IHNiYm94WzNdKSB7XG4gICAgaWYgKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OKSB7XG4gICAgICByZXN1bHQgPSBFTVBUWTtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSkge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdDtcbiAgICB9IGVsc2UgaWYgKG9wZXJhdGlvbiA9PT0gVU5JT04gfHwgb3BlcmF0aW9uID09PSBYT1IpIHtcbiAgICAgIHJlc3VsdCA9IHN1YmplY3QuY29uY2F0KGNsaXBwaW5nKTtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5mdW5jdGlvbiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBvcGVyYXRpb24pIHtcbiAgdmFyIHRyaXZpYWwgPSB0cml2aWFsT3BlcmF0aW9uKHN1YmplY3QsIGNsaXBwaW5nLCBvcGVyYXRpb24pO1xuICBpZiAodHJpdmlhbCkge1xuICAgIHJldHVybiB0cml2aWFsID09PSBFTVBUWSA/IG51bGwgOiB0cml2aWFsO1xuICB9XG4gIHZhciBzYmJveCA9IFtJbmZpbml0eSwgSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5XTtcbiAgdmFyIGNiYm94ID0gW0luZmluaXR5LCBJbmZpbml0eSwgLUluZmluaXR5LCAtSW5maW5pdHldO1xuXG4gIHZhciBldmVudFF1ZXVlID0gZmlsbFF1ZXVlKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gpO1xuXG4gIHRyaXZpYWwgPSBjb21wYXJlQkJveGVzKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbik7XG4gIGlmICh0cml2aWFsKSB7XG4gICAgcmV0dXJuIHRyaXZpYWwgPT09IEVNUFRZID8gbnVsbCA6IHRyaXZpYWw7XG4gIH1cbiAgdmFyIHNvcnRlZEV2ZW50cyA9IHN1YmRpdmlkZVNlZ21lbnRzKGV2ZW50UXVldWUsIHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbik7XG4gIHJldHVybiBjb25uZWN0RWRnZXMoc29ydGVkRXZlbnRzKTtcbn1cblxuXG5tb2R1bGUuZXhwb3J0cyA9IGJvb2xlYW47XG5cblxubW9kdWxlLmV4cG9ydHMudW5pb24gPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgVU5JT04pO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy5kaWZmID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIERJRkZFUkVOQ0UpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy54b3IgPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgWE9SKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMuaW50ZXJzZWN0aW9uID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIElOVEVSU0VDVElPTik7XG59O1xuXG5cbi8qKlxuICogQGVudW0ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMub3BlcmF0aW9ucyA9IHtcbiAgSU5URVJTRUNUSU9OOiBJTlRFUlNFQ1RJT04sXG4gIERJRkZFUkVOQ0U6ICAgRElGRkVSRU5DRSxcbiAgVU5JT046ICAgICAgICBVTklPTixcbiAgWE9SOiAgICAgICAgICBYT1Jcbn07XG5cblxuLy8gZm9yIHRlc3Rpbmdcbm1vZHVsZS5leHBvcnRzLmZpbGxRdWV1ZSAgICAgICAgICAgID0gZmlsbFF1ZXVlO1xubW9kdWxlLmV4cG9ydHMuY29tcHV0ZUZpZWxkcyAgICAgICAgPSBjb21wdXRlRmllbGRzO1xubW9kdWxlLmV4cG9ydHMuc3ViZGl2aWRlU2VnbWVudHMgICAgPSBzdWJkaXZpZGVTZWdtZW50cztcbm1vZHVsZS5leHBvcnRzLmRpdmlkZVNlZ21lbnQgICAgICAgID0gZGl2aWRlU2VnbWVudDtcbm1vZHVsZS5leHBvcnRzLnBvc3NpYmxlSW50ZXJzZWN0aW9uID0gcG9zc2libGVJbnRlcnNlY3Rpb247XG4iLCJ2YXIgRVBTSUxPTiA9IDFlLTk7XG5cbi8qKlxuICogRmluZHMgdGhlIG1hZ25pdHVkZSBvZiB0aGUgY3Jvc3MgcHJvZHVjdCBvZiB0d28gdmVjdG9ycyAoaWYgd2UgcHJldGVuZFxuICogdGhleSdyZSBpbiB0aHJlZSBkaW1lbnNpb25zKVxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIEZpcnN0IHZlY3RvclxuICogQHBhcmFtIHtPYmplY3R9IGIgU2Vjb25kIHZlY3RvclxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBtYWduaXR1ZGUgb2YgdGhlIGNyb3NzIHByb2R1Y3RcbiAqL1xuZnVuY3Rpb24ga3Jvc3NQcm9kdWN0KGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gKiBiWzFdIC0gYVsxXSAqIGJbMF07XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGRvdCBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBhIEZpcnN0IHZlY3RvclxuICogQHBhcmFtIHtPYmplY3R9IGIgU2Vjb25kIHZlY3RvclxuICogQHByaXZhdGVcbiAqIEByZXR1cm5zIHtOdW1iZXJ9IFRoZSBkb3QgcHJvZHVjdFxuICovXG5mdW5jdGlvbiBkb3RQcm9kdWN0KGEsIGIpIHtcbiAgcmV0dXJuIGFbMF0gKiBiWzBdICsgYVsxXSAqIGJbMV07XG59XG5cbi8qKlxuICogRmluZHMgdGhlIGludGVyc2VjdGlvbiAoaWYgYW55KSBiZXR3ZWVuIHR3byBsaW5lIHNlZ21lbnRzIGEgYW5kIGIsIGdpdmVuIHRoZVxuICogbGluZSBzZWdtZW50cycgZW5kIHBvaW50cyBhMSwgYTIgYW5kIGIxLCBiMi5cbiAqXG4gKiBUaGlzIGFsZ29yaXRobSBpcyBiYXNlZCBvbiBTY2huZWlkZXIgYW5kIEViZXJseS5cbiAqIGh0dHA6Ly93d3cuY2ltZWMub3JnLmFyL35uY2Fsdm8vU2NobmVpZGVyX0ViZXJseS5wZGZcbiAqIFBhZ2UgMjQ0LlxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGExIHBvaW50IG9mIGZpcnN0IGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGEyIHBvaW50IG9mIGZpcnN0IGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGIxIHBvaW50IG9mIHNlY29uZCBsaW5lXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBiMiBwb2ludCBvZiBzZWNvbmQgbGluZVxuICogQHBhcmFtIHtCb29sZWFuPX0gICAgICAgbm9FbmRwb2ludFRvdWNoIHdoZXRoZXIgdG8gc2tpcCBzaW5nbGUgdG91Y2hwb2ludHNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAobWVhbmluZyBjb25uZWN0ZWQgc2VnbWVudHMpIGFzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaW50ZXJzZWN0aW9uc1xuICogQHJldHVybnMge0FycmF5LjxBcnJheS48TnVtYmVyPj58TnVsbH0gSWYgdGhlIGxpbmVzIGludGVyc2VjdCwgdGhlIHBvaW50IG9mXG4gKiBpbnRlcnNlY3Rpb24uIElmIHRoZXkgb3ZlcmxhcCwgdGhlIHR3byBlbmQgcG9pbnRzIG9mIHRoZSBvdmVybGFwcGluZyBzZWdtZW50LlxuICogT3RoZXJ3aXNlLCBudWxsLlxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGExLCBhMiwgYjEsIGIyLCBub0VuZHBvaW50VG91Y2gpIHtcbiAgLy8gVGhlIGFsZ29yaXRobSBleHBlY3RzIG91ciBsaW5lcyBpbiB0aGUgZm9ybSBQICsgc2QsIHdoZXJlIFAgaXMgYSBwb2ludCxcbiAgLy8gcyBpcyBvbiB0aGUgaW50ZXJ2YWwgWzAsIDFdLCBhbmQgZCBpcyBhIHZlY3Rvci5cbiAgLy8gV2UgYXJlIHBhc3NlZCB0d28gcG9pbnRzLiBQIGNhbiBiZSB0aGUgZmlyc3QgcG9pbnQgb2YgZWFjaCBwYWlyLiBUaGVcbiAgLy8gdmVjdG9yLCB0aGVuLCBjb3VsZCBiZSB0aG91Z2h0IG9mIGFzIHRoZSBkaXN0YW5jZSAoaW4geCBhbmQgeSBjb21wb25lbnRzKVxuICAvLyBmcm9tIHRoZSBmaXJzdCBwb2ludCB0byB0aGUgc2Vjb25kIHBvaW50LlxuICAvLyBTbyBmaXJzdCwgbGV0J3MgbWFrZSBvdXIgdmVjdG9yczpcbiAgdmFyIHZhID0gW2EyWzBdIC0gYTFbMF0sIGEyWzFdIC0gYTFbMV1dO1xuICB2YXIgdmIgPSBbYjJbMF0gLSBiMVswXSwgYjJbMV0gLSBiMVsxXV07XG4gIC8vIFdlIGFsc28gZGVmaW5lIGEgZnVuY3Rpb24gdG8gY29udmVydCBiYWNrIHRvIHJlZ3VsYXIgcG9pbnQgZm9ybTpcblxuICAvKiBlc2xpbnQtZGlzYWJsZSBhcnJvdy1ib2R5LXN0eWxlICovXG5cbiAgZnVuY3Rpb24gdG9Qb2ludChwLCBzLCBkKSB7XG4gICAgcmV0dXJuIFtcbiAgICAgIHBbMF0gKyBzICogZFswXSxcbiAgICAgIHBbMV0gKyBzICogZFsxXVxuICAgIF07XG4gIH1cblxuICAvKiBlc2xpbnQtZW5hYmxlIGFycm93LWJvZHktc3R5bGUgKi9cblxuICAvLyBUaGUgcmVzdCBpcyBwcmV0dHkgbXVjaCBhIHN0cmFpZ2h0IHBvcnQgb2YgdGhlIGFsZ29yaXRobS5cbiAgdmFyIGUgPSBbYjFbMF0gLSBhMVswXSwgYjFbMV0gLSBhMVsxXV07XG4gIHZhciBrcm9zcyA9IGtyb3NzUHJvZHVjdCh2YSwgdmIpO1xuICB2YXIgc3FyS3Jvc3MgPSBrcm9zcyAqIGtyb3NzO1xuICB2YXIgc3FyTGVuQSA9IGRvdFByb2R1Y3QodmEsIHZhKTtcbiAgdmFyIHNxckxlbkIgPSBkb3RQcm9kdWN0KHZiLCB2Yik7XG5cbiAgLy8gQ2hlY2sgZm9yIGxpbmUgaW50ZXJzZWN0aW9uLiBUaGlzIHdvcmtzIGJlY2F1c2Ugb2YgdGhlIHByb3BlcnRpZXMgb2YgdGhlXG4gIC8vIGNyb3NzIHByb2R1Y3QgLS0gc3BlY2lmaWNhbGx5LCB0d28gdmVjdG9ycyBhcmUgcGFyYWxsZWwgaWYgYW5kIG9ubHkgaWYgdGhlXG4gIC8vIGNyb3NzIHByb2R1Y3QgaXMgdGhlIDAgdmVjdG9yLiBUaGUgZnVsbCBjYWxjdWxhdGlvbiBpbnZvbHZlcyByZWxhdGl2ZSBlcnJvclxuICAvLyB0byBhY2NvdW50IGZvciBwb3NzaWJsZSB2ZXJ5IHNtYWxsIGxpbmUgc2VnbWVudHMuIFNlZSBTY2huZWlkZXIgJiBFYmVybHlcbiAgLy8gZm9yIGRldGFpbHMuXG4gIGlmIChzcXJLcm9zcyA+IEVQU0lMT04gKiBzcXJMZW5BICogc3FyTGVuQikge1xuICAgIC8vIElmIHRoZXkncmUgbm90IHBhcmFsbGVsLCB0aGVuIChiZWNhdXNlIHRoZXNlIGFyZSBsaW5lIHNlZ21lbnRzKSB0aGV5XG4gICAgLy8gc3RpbGwgbWlnaHQgbm90IGFjdHVhbGx5IGludGVyc2VjdC4gVGhpcyBjb2RlIGNoZWNrcyB0aGF0IHRoZVxuICAgIC8vIGludGVyc2VjdGlvbiBwb2ludCBvZiB0aGUgbGluZXMgaXMgYWN0dWFsbHkgb24gYm90aCBsaW5lIHNlZ21lbnRzLlxuICAgIHZhciBzID0ga3Jvc3NQcm9kdWN0KGUsIHZiKSAvIGtyb3NzO1xuICAgIGlmIChzIDwgMCB8fCBzID4gMSkge1xuICAgICAgLy8gbm90IG9uIGxpbmUgc2VnbWVudCBhXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgdmFyIHQgPSBrcm9zc1Byb2R1Y3QoZSwgdmEpIC8ga3Jvc3M7XG4gICAgaWYgKHQgPCAwIHx8IHQgPiAxKSB7XG4gICAgICAvLyBub3Qgb24gbGluZSBzZWdtZW50IGJcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzLCB2YSldO1xuICB9XG5cbiAgLy8gSWYgd2UndmUgcmVhY2hlZCB0aGlzIHBvaW50LCB0aGVuIHRoZSBsaW5lcyBhcmUgZWl0aGVyIHBhcmFsbGVsIG9yIHRoZVxuICAvLyBzYW1lLCBidXQgdGhlIHNlZ21lbnRzIGNvdWxkIG92ZXJsYXAgcGFydGlhbGx5IG9yIGZ1bGx5LCBvciBub3QgYXQgYWxsLlxuICAvLyBTbyB3ZSBuZWVkIHRvIGZpbmQgdGhlIG92ZXJsYXAsIGlmIGFueS4gVG8gZG8gdGhhdCwgd2UgY2FuIHVzZSBlLCB3aGljaCBpc1xuICAvLyB0aGUgKHZlY3RvcikgZGlmZmVyZW5jZSBiZXR3ZWVuIHRoZSB0d28gaW5pdGlhbCBwb2ludHMuIElmIHRoaXMgaXMgcGFyYWxsZWxcbiAgLy8gd2l0aCB0aGUgbGluZSBpdHNlbGYsIHRoZW4gdGhlIHR3byBsaW5lcyBhcmUgdGhlIHNhbWUgbGluZSwgYW5kIHRoZXJlIHdpbGxcbiAgLy8gYmUgb3ZlcmxhcC5cbiAgdmFyIHNxckxlbkUgPSBkb3RQcm9kdWN0KGUsIGUpO1xuICBrcm9zcyA9IGtyb3NzUHJvZHVjdChlLCB2YSk7XG4gIHNxcktyb3NzID0ga3Jvc3MgKiBrcm9zcztcblxuICBpZiAoc3FyS3Jvc3MgPiBFUFNJTE9OICogc3FyTGVuQSAqIHNxckxlbkUpIHtcbiAgICAvLyBMaW5lcyBhcmUganVzdCBwYXJhbGxlbCwgbm90IHRoZSBzYW1lLiBObyBvdmVybGFwLlxuICAgIHJldHVybiBudWxsO1xuICB9XG5cbiAgdmFyIHNhID0gZG90UHJvZHVjdCh2YSwgZSkgLyBzcXJMZW5BO1xuICB2YXIgc2IgPSBzYSArIGRvdFByb2R1Y3QodmEsIHZiKSAvIHNxckxlbkE7XG4gIHZhciBzbWluID0gTWF0aC5taW4oc2EsIHNiKTtcbiAgdmFyIHNtYXggPSBNYXRoLm1heChzYSwgc2IpO1xuXG4gIC8vIHRoaXMgaXMsIGVzc2VudGlhbGx5LCB0aGUgRmluZEludGVyc2VjdGlvbiBhY3Rpbmcgb24gZmxvYXRzIGZyb21cbiAgLy8gU2NobmVpZGVyICYgRWJlcmx5LCBqdXN0IGlubGluZWQgaW50byB0aGlzIGZ1bmN0aW9uLlxuICBpZiAoc21pbiA8PSAxICYmIHNtYXggPj0gMCkge1xuXG4gICAgLy8gb3ZlcmxhcCBvbiBhbiBlbmQgcG9pbnRcbiAgICBpZiAoc21pbiA9PT0gMSkge1xuICAgICAgcmV0dXJuIG5vRW5kcG9pbnRUb3VjaCA/IG51bGwgOiBbdG9Qb2ludChhMSwgc21pbiA+IDAgPyBzbWluIDogMCwgdmEpXTtcbiAgICB9XG5cbiAgICBpZiAoc21heCA9PT0gMCkge1xuICAgICAgcmV0dXJuIG5vRW5kcG9pbnRUb3VjaCA/IG51bGwgOiBbdG9Qb2ludChhMSwgc21heCA8IDEgPyBzbWF4IDogMSwgdmEpXTtcbiAgICB9XG5cbiAgICBpZiAobm9FbmRwb2ludFRvdWNoICYmIHNtaW4gPT09IDAgJiYgc21heCA9PT0gMSkgcmV0dXJuIG51bGw7XG5cbiAgICAvLyBUaGVyZSdzIG92ZXJsYXAgb24gYSBzZWdtZW50IC0tIHR3byBwb2ludHMgb2YgaW50ZXJzZWN0aW9uLiBSZXR1cm4gYm90aC5cbiAgICByZXR1cm4gW1xuICAgICAgdG9Qb2ludChhMSwgc21pbiA+IDAgPyBzbWluIDogMCwgdmEpLFxuICAgICAgdG9Qb2ludChhMSwgc21heCA8IDEgPyBzbWF4IDogMSwgdmEpLFxuICAgIF07XG4gIH1cblxuICByZXR1cm4gbnVsbDtcbn07XG4iLCIvKipcbiAqIFNpZ25lZCBhcmVhIG9mIHRoZSB0cmlhbmdsZSAocDAsIHAxLCBwMilcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMFxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAxXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzaWduZWRBcmVhKHAwLCBwMSwgcDIpIHtcbiAgcmV0dXJuIChwMFswXSAtIHAyWzBdKSAqIChwMVsxXSAtIHAyWzFdKSAtIChwMVswXSAtIHAyWzBdKSAqIChwMFsxXSAtIHAyWzFdKTtcbn07XG4iLCJ2YXIgc2lnbmVkQXJlYSA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcbnZhciBFZGdlVHlwZSAgID0gcmVxdWlyZSgnLi9lZGdlX3R5cGUnKTtcblxuXG4vKipcbiAqIFN3ZWVwbGluZSBldmVudFxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59ICBwb2ludFxuICogQHBhcmFtIHtCb29sZWFufSAgICAgICAgIGxlZnRcbiAqIEBwYXJhbSB7U3dlZXBFdmVudD19ICAgICBvdGhlckV2ZW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgaXNTdWJqZWN0XG4gKiBAcGFyYW0ge051bWJlcn0gICAgICAgICAgZWRnZVR5cGVcbiAqL1xuZnVuY3Rpb24gU3dlZXBFdmVudChwb2ludCwgbGVmdCwgb3RoZXJFdmVudCwgaXNTdWJqZWN0LCBlZGdlVHlwZSkge1xuXG4gIC8qKlxuICAgKiBJcyBsZWZ0IGVuZHBvaW50P1xuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMubGVmdCA9IGxlZnQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48TnVtYmVyPn1cbiAgICovXG4gIHRoaXMucG9pbnQgPSBwb2ludDtcblxuICAvKipcbiAgICogT3RoZXIgZWRnZSByZWZlcmVuY2VcbiAgICogQHR5cGUge1N3ZWVwRXZlbnR9XG4gICAqL1xuICB0aGlzLm90aGVyRXZlbnQgPSBvdGhlckV2ZW50O1xuXG4gIC8qKlxuICAgKiBCZWxvbmdzIHRvIHNvdXJjZSBvciBjbGlwcGluZyBwb2x5Z29uXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5pc1N1YmplY3QgPSBpc1N1YmplY3Q7XG5cbiAgLyoqXG4gICAqIEVkZ2UgY29udHJpYnV0aW9uIHR5cGVcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMudHlwZSA9IGVkZ2VUeXBlIHx8IEVkZ2VUeXBlLk5PUk1BTDtcblxuXG4gIC8qKlxuICAgKiBJbi1vdXQgdHJhbnNpdGlvbiBmb3IgdGhlIHN3ZWVwbGluZSBjcm9zc2luZyBwb2x5Z29uXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5pbk91dCA9IGZhbHNlO1xuXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5vdGhlckluT3V0ID0gZmFsc2U7XG5cbiAgLyoqXG4gICAqIFByZXZpb3VzIGV2ZW50IGluIHJlc3VsdD9cbiAgICogQHR5cGUge1N3ZWVwRXZlbnR9XG4gICAqL1xuICB0aGlzLnByZXZJblJlc3VsdCA9IG51bGw7XG5cbiAgLyoqXG4gICAqIERvZXMgZXZlbnQgYmVsb25nIHRvIHJlc3VsdD9cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmluUmVzdWx0ID0gZmFsc2U7XG5cblxuICAvLyBjb25uZWN0aW9uIHN0ZXBcblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLnJlc3VsdEluT3V0ID0gZmFsc2U7XG59XG5cblxuU3dlZXBFdmVudC5wcm90b3R5cGUgPSB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgcFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNCZWxvdzogZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiB0aGlzLmxlZnQgP1xuICAgICAgc2lnbmVkQXJlYSAodGhpcy5wb2ludCwgdGhpcy5vdGhlckV2ZW50LnBvaW50LCBwKSA+IDAgOlxuICAgICAgc2lnbmVkQXJlYSAodGhpcy5vdGhlckV2ZW50LnBvaW50LCB0aGlzLnBvaW50LCBwKSA+IDA7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc0Fib3ZlOiBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuICF0aGlzLmlzQmVsb3cocCk7XG4gIH0sXG5cblxuICAvKipcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzVmVydGljYWw6IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBvaW50WzBdID09PSB0aGlzLm90aGVyRXZlbnQucG9pbnRbMF07XG4gIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gU3dlZXBFdmVudDtcbiIsIid1c2Ugc3RyaWN0JztcblxubW9kdWxlLmV4cG9ydHMgPSBUaW55UXVldWU7XG5cbmZ1bmN0aW9uIFRpbnlRdWV1ZShkYXRhLCBjb21wYXJlKSB7XG4gICAgaWYgKCEodGhpcyBpbnN0YW5jZW9mIFRpbnlRdWV1ZSkpIHJldHVybiBuZXcgVGlueVF1ZXVlKGRhdGEsIGNvbXBhcmUpO1xuXG4gICAgdGhpcy5kYXRhID0gZGF0YSB8fCBbXTtcbiAgICB0aGlzLmxlbmd0aCA9IHRoaXMuZGF0YS5sZW5ndGg7XG4gICAgdGhpcy5jb21wYXJlID0gY29tcGFyZSB8fCBkZWZhdWx0Q29tcGFyZTtcblxuICAgIGlmIChkYXRhKSBmb3IgKHZhciBpID0gTWF0aC5mbG9vcih0aGlzLmxlbmd0aCAvIDIpOyBpID49IDA7IGktLSkgdGhpcy5fZG93bihpKTtcbn1cblxuZnVuY3Rpb24gZGVmYXVsdENvbXBhcmUoYSwgYikge1xuICAgIHJldHVybiBhIDwgYiA/IC0xIDogYSA+IGIgPyAxIDogMDtcbn1cblxuVGlueVF1ZXVlLnByb3RvdHlwZSA9IHtcblxuICAgIHB1c2g6IGZ1bmN0aW9uIChpdGVtKSB7XG4gICAgICAgIHRoaXMuZGF0YS5wdXNoKGl0ZW0pO1xuICAgICAgICB0aGlzLmxlbmd0aCsrO1xuICAgICAgICB0aGlzLl91cCh0aGlzLmxlbmd0aCAtIDEpO1xuICAgIH0sXG5cbiAgICBwb3A6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgdmFyIHRvcCA9IHRoaXMuZGF0YVswXTtcbiAgICAgICAgdGhpcy5kYXRhWzBdID0gdGhpcy5kYXRhW3RoaXMubGVuZ3RoIC0gMV07XG4gICAgICAgIHRoaXMubGVuZ3RoLS07XG4gICAgICAgIHRoaXMuZGF0YS5wb3AoKTtcbiAgICAgICAgdGhpcy5fZG93bigwKTtcbiAgICAgICAgcmV0dXJuIHRvcDtcbiAgICB9LFxuXG4gICAgcGVlazogZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gdGhpcy5kYXRhWzBdO1xuICAgIH0sXG5cbiAgICBfdXA6IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEsXG4gICAgICAgICAgICBjb21wYXJlID0gdGhpcy5jb21wYXJlO1xuXG4gICAgICAgIHdoaWxlIChwb3MgPiAwKSB7XG4gICAgICAgICAgICB2YXIgcGFyZW50ID0gTWF0aC5mbG9vcigocG9zIC0gMSkgLyAyKTtcbiAgICAgICAgICAgIGlmIChjb21wYXJlKGRhdGFbcG9zXSwgZGF0YVtwYXJlbnRdKSA8IDApIHtcbiAgICAgICAgICAgICAgICBzd2FwKGRhdGEsIHBhcmVudCwgcG9zKTtcbiAgICAgICAgICAgICAgICBwb3MgPSBwYXJlbnQ7XG5cbiAgICAgICAgICAgIH0gZWxzZSBicmVhaztcbiAgICAgICAgfVxuICAgIH0sXG5cbiAgICBfZG93bjogZnVuY3Rpb24gKHBvcykge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIGNvbXBhcmUgPSB0aGlzLmNvbXBhcmUsXG4gICAgICAgICAgICBsZW4gPSB0aGlzLmxlbmd0aDtcblxuICAgICAgICB3aGlsZSAodHJ1ZSkge1xuICAgICAgICAgICAgdmFyIGxlZnQgPSAyICogcG9zICsgMSxcbiAgICAgICAgICAgICAgICByaWdodCA9IGxlZnQgKyAxLFxuICAgICAgICAgICAgICAgIG1pbiA9IHBvcztcblxuICAgICAgICAgICAgaWYgKGxlZnQgPCBsZW4gJiYgY29tcGFyZShkYXRhW2xlZnRdLCBkYXRhW21pbl0pIDwgMCkgbWluID0gbGVmdDtcbiAgICAgICAgICAgIGlmIChyaWdodCA8IGxlbiAmJiBjb21wYXJlKGRhdGFbcmlnaHRdLCBkYXRhW21pbl0pIDwgMCkgbWluID0gcmlnaHQ7XG5cbiAgICAgICAgICAgIGlmIChtaW4gPT09IHBvcykgcmV0dXJuO1xuXG4gICAgICAgICAgICBzd2FwKGRhdGEsIG1pbiwgcG9zKTtcbiAgICAgICAgICAgIHBvcyA9IG1pbjtcbiAgICAgICAgfVxuICAgIH1cbn07XG5cbmZ1bmN0aW9uIHN3YXAoZGF0YSwgaSwgaikge1xuICAgIHZhciB0bXAgPSBkYXRhW2ldO1xuICAgIGRhdGFbaV0gPSBkYXRhW2pdO1xuICAgIGRhdGFbal0gPSB0bXA7XG59XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBPZmZzZXQgZWRnZSBvZiB0aGUgcG9seWdvblxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gY3VycmVudFxuICogQHBhcmFtICB7T2JqZWN0fSBuZXh0XG4gKiBAY29zbnRydWN0b3JcbiAqL1xuZnVuY3Rpb24gRWRnZShjdXJyZW50LCBuZXh0KSB7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuY3VycmVudCA9IGN1cnJlbnQ7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMubmV4dCA9IG5leHQ7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX2luTm9ybWFsID0gdGhpcy5pbndhcmRzTm9ybWFsKCk7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqL1xuICAgIHRoaXMuX291dE5vcm1hbCA9IHRoaXMub3V0d2FyZHNOb3JtYWwoKTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBvdXR3YXJkcyBub3JtYWxcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuRWRnZS5wcm90b3R5cGUub3V0d2FyZHNOb3JtYWwgPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgaW53YXJkcyA9IHRoaXMuaW53YXJkc05vcm1hbCgpO1xuICAgIHJldHVybiBbXG4gICAgICAgIC1pbndhcmRzWzBdLFxuICAgICAgICAtaW53YXJkc1sxXVxuICAgIF07XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgaW53YXJkcyBub3JtYWxcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuRWRnZS5wcm90b3R5cGUuaW53YXJkc05vcm1hbCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciBkeCA9IHRoaXMubmV4dFswXSAtIHRoaXMuY3VycmVudFswXSxcbiAgICAgICAgZHkgPSB0aGlzLm5leHRbMV0gLSB0aGlzLmN1cnJlbnRbMV0sXG4gICAgICAgIGVkZ2VMZW5ndGggPSBNYXRoLnNxcnQoZHggKiBkeCArIGR5ICogZHkpO1xuXG4gICAgcmV0dXJuIFtcbiAgICAgICAgLWR5IC8gZWRnZUxlbmd0aCxcbiAgICAgICAgZHggLyBlZGdlTGVuZ3RoXG4gICAgXTtcbn07XG5cbi8qKlxuICogT2Zmc2V0cyB0aGUgZWRnZSBieSBkeCwgZHlcbiAqIEBwYXJhbSAge051bWJlcn0gZHhcbiAqIEBwYXJhbSAge051bWJlcn0gZHlcbiAqIEByZXR1cm4ge0VkZ2V9XG4gKi9cbkVkZ2UucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKGR4LCBkeSkge1xuICAgIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50LFxuICAgICAgICBuZXh0ID0gdGhpcy5uZXh0O1xuXG4gICAgcmV0dXJuIG5ldyBFZGdlKFtcbiAgICAgICAgY3VycmVudFswXSArIGR4LFxuICAgICAgICBjdXJyZW50WzFdICsgZHlcbiAgICBdLCBbXG4gICAgICAgIG5leHRbMF0gKyBkeCxcbiAgICAgICAgbmV4dFsxXSArIGR5XG4gICAgXSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVkZ2U7XG4iLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBWZWN0b3IgaW50ZXJzZWN0aW9uLCBpZiBwcmVzZW50XG4gKlxuICogQHBhcmFtICB7T2JqZWN0fSBBMFxuICogQHBhcmFtICB7T2JqZWN0fSBBMVxuICogQHBhcmFtICB7T2JqZWN0fSBCMFxuICogQHBhcmFtICB7T2JqZWN0fSBCMVxuICpcbiAqIEByZXR1cm4ge09iamVjdHxudWxsfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGludGVyc2VjdGlvbihBMCwgQTEsIEIwLCBCMSkge1xuICAgIHZhciBkZW4gPSAoQjFbMV0gLSBCMFsxXSkgKiAoQTFbMF0gLSBBMFswXSkgLVxuICAgICAgICAoQjFbMF0gLSBCMFswXSkgKiAoQTFbMV0gLSBBMFsxXSk7XG5cbiAgICAvLyBsaW5lcyBhcmUgcGFyYWxsZWwgb3IgY29uaW5jaWRlbnRcbiAgICBpZiAoZGVuID09IDApIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgdmFyIHVhID0gKChCMVswXSAtIEIwWzBdKSAqIChBMFsxXSAtIEIwWzFdKSAtXG4gICAgICAgIChCMVsxXSAtIEIwWzFdKSAqIChBMFswXSAtIEIwWzBdKSkgLyBkZW47XG5cbiAgICB2YXIgdWIgPSAoKEExWzBdIC0gQTBbMF0pICogKEEwWzFdIC0gQjBbMV0pIC1cbiAgICAgICAgKEExWzFdIC0gQTBbMV0pICogKEEwWzBdIC0gQjBbMF0pKSAvIGRlbjtcblxuICAgIGlmICh1YSA8IDAgfHwgdWIgPCAwIHx8IHVhID4gMSB8fCB1YiA+IDEpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgcmV0dXJuIFtcbiAgICAgICAgQTBbMF0gKyB1YSAqIChBMVswXSAtIEEwWzBdKSxcbiAgICAgICAgQTBbMV0gKyB1YSAqIChBMVsxXSAtIEEwWzFdKVxuICAgIF07XG59O1xuIiwiLy8gaHR0cHM6Ly9naXRodWIuY29tL3RtY3cvbGluZS1vZmZzZXQvXG52YXIgZGlzcGxhY2UgPSByZXF1aXJlKCcuL3BvaW50X2Rpc3BsYWNlJyk7XG52YXIgZXBzaWxvbiAgPSAxZS03O1xuXG5mdW5jdGlvbiBjbG9uZShfKSB7XG4gICAgY29uc29sZS5sb2coJ2Nsb25lJywgXyk7XG4gICAgcmV0dXJuIF8uc2xpY2UoKTtcbn1cblxuZnVuY3Rpb24gZXhwbGVtZW50X3JlZmxleF9hbmdsZShhbmdsZSkge1xuICAgIGlmICAgICAgKGFuZ2xlID4gTWF0aC5QSSkgIHJldHVybiBhbmdsZSAtIDIgKiBNYXRoLlBJO1xuICAgIGVsc2UgaWYgKGFuZ2xlIDwgLU1hdGguUEkpIHJldHVybiBhbmdsZSArIDIgKiBNYXRoLlBJO1xuICAgIGVsc2UgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBhbmdsZTtcbn1cblxuXG5mdW5jdGlvbiBmaW5kVnQodTEsIHUyLCB2MSwgdjIpIHtcbiAgICB2YXIgZHggPSB2MVswXSAtIHUxWzBdLFxuICAgICAgICBkeSA9IHYxWzFdIC0gdTFbMV0sXG4gICAgICAgIHV4ID0gdTJbMF0gLSB1MVswXSxcbiAgICAgICAgdXkgPSB1MlsxXSAtIHUxWzFdLFxuICAgICAgICB2eCA9IHYyWzBdIC0gdjFbMF0sXG4gICAgICAgIHZ5ID0gdjJbMV0gLSB2MVsxXSxcbiAgICAgICAgdXAsIGRuO1xuXG4gICAgdXAgPSB1eCAqIGR5IC0gZHggKiB1eTtcbiAgICBkbiA9IHZ4ICogdXkgLSB1eCAqIHZ5O1xuICAgIHJldHVybiB1cCAvIGRuO1xufVxuXG5cbmZ1bmN0aW9uIGZpbmRVdCh1MSwgdTIsIHYxLCB2MiwgdnQpIHtcbiAgICB2YXIgZHggPSB2MVswXSAtIHUxWzBdLFxuICAgICAgICBkeSA9IHYxWzFdIC0gdTFbMV0sXG4gICAgICAgIHV4ID0gdTJbMF0gLSB1MVswXSxcbiAgICAgICAgdXkgPSB1MlsxXSAtIHUxWzFdLFxuICAgICAgICB2eCA9IHYyWzBdIC0gdjFbMF0sXG4gICAgICAgIHZ5ID0gdjJbMV0gLSB2MVsxXSxcbiAgICAgICAgdXAsIGRuO1xuXG4gICAgaWYgKHV4IDwgLWVwc2lsb24gfHwgdXggPiBlcHNpbG9uKSB7XG4gICAgICAgIHVwID0gdXggKiBkeSAtIGR4ICogdXk7XG4gICAgICAgIGRuID0gdnggKiB1eSAtIHV4ICogdnk7XG4gICAgICAgIHJldHVybiAodnQgKiB2eCArIGR4KSAvIHV4O1xuICAgIH1cblxuICAgIGlmICh1eSA8IC1lcHNpbG9uIHx8IHV5ID4gZXBzaWxvbikge1xuICAgICAgICB1cCA9IHV5ICogZHggLSBkeSAqIHV4O1xuICAgICAgICBkbiA9IHZ5ICogdXggLSB1eSAqIHZ4O1xuICAgICAgICByZXR1cm4gKHZ0ICogdnkgKyBkeSkgLyB1eTtcbiAgICB9XG59XG5cblxuZnVuY3Rpb24gaW50ZXJzZWN0aW9uKHUxLCB1MiwgdXQsIHYxLCB2MiwgdnQpIHtcbiAgICB2YXIgZHggPSB2MVswXSAtIHUxWzBdLFxuICAgICAgICBkeSA9IHYxWzFdIC0gdTFbMV0sXG4gICAgICAgIHV4ID0gdTJbMF0gLSB1MVswXSxcbiAgICAgICAgdXkgPSB1MlsxXSAtIHUxWzFdLFxuICAgICAgICB2eCA9IHYyWzBdIC0gdjFbMF0sXG4gICAgICAgIHZ5ID0gdjJbMV0gLSB2MVsxXSxcbiAgICAgICAgdXAsIGRuO1xuICAgIC8vIHRoZSBmaXJzdCBsaW5lIGlzIG5vdCB2ZXJ0aWNhbFxuICAgIGlmICh1eCA8IC1lcHNpbG9uIHx8IHV4ID4gZXBzaWxvbikge1xuICAgICAgICB1cCA9IHV4ICogZHkgLSBkeCAqIHV5O1xuICAgICAgICBkbiA9IHZ4ICogdXkgLSB1eCAqIHZ5O1xuICAgICAgICByZXR1cm4gIShkbiA+IC1lcHNpbG9uICYmIGRuIDwgZXBzaWxvbik7XG4gICAgfVxuICAgIC8vIHRoZSBmaXJzdCBsaW5lIGlzIG5vdCBob3Jpem9udGFsXG4gICAgaWYgKHV5IDwgLWVwc2lsb24gfHwgdXkgPiBlcHNpbG9uKSB7XG4gICAgICAgIHVwID0gdXkgKiBkeCAtIGR5ICogdXg7XG4gICAgICAgIGRuID0gdnkgKiB1eCAtIHV5ICogdng7XG4gICAgICAgIHJldHVybiAhKGRuID4gLWVwc2lsb24gJiYgZG4gPCBlcHNpbG9uKTtcbiAgICB9XG4gICAgLy8gdGhlIGZpcnN0IGxpbmUgaXMgdG9vIHNob3J0XG4gICAgcmV0dXJuIGZhbHNlO1xufVxuXG5tb2R1bGUuZXhwb3J0cy5vZmZzZXQgPSBmdW5jdGlvbih2ZXJ0aWNlcywgb2Zmc2V0KSB7XG4gICAgaWYgKG9mZnNldCA9PT0gMCB8fCB2ZXJ0aWNlcy5sZW5ndGggPCAzKSByZXR1cm4gdmVydGljZXM7XG5cbiAgICB2YXIgb3V0cHV0ID0gW10sXG4gICAgICAgIHYxID0gdmVydGljZXNbMF0sXG4gICAgICAgIHYyID0gdmVydGljZXNbMV0sXG4gICAgICAgIGhhbGZfdHVybl9zZWdtZW50cyA9IDE2LFxuICAgICAgICB0aHJlc2hvbGQgPSA4LFxuICAgICAgICBhbmdsZV9hID0gMCxcbiAgICAgICAgYW5nbGVfYiA9IE1hdGguYXRhbjIodjJbMV0gLSB2MVsxXSwgdjJbMF0gLSB2MVswXSksXG4gICAgICAgIHcgPSBbMCwgMF0sXG4gICAgICAgIGpvaW50X2FuZ2xlO1xuXG4gICAgLy8gZmlyc3QgdmVydGV4XG4gICAgdjEgPSBkaXNwbGFjZS5hKHYxLCBhbmdsZV9iLCBvZmZzZXQpO1xuICAgIG91dHB1dC5wdXNoKGNsb25lKHYxKSk7XG5cbiAgICAvLyBTb21ldGltZXMgd2hlbiB0aGUgZmlyc3Qgc2VnbWVudCBpcyB0b28gc2hvcnQsIGl0IGNhdXNlcyB1Z2x5XG4gICAgLy8gY3VybHMgYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgbGluZS4gVG8gYXZvaWQgdGhpcywgd2UgbWFrZSB1cFxuICAgIC8vIGEgZmFrZSB2ZXJ0ZXggdHdvIG9mZnNldC1sZW5ndGhzIGJlZm9yZSB0aGUgZmlyc3QsIGFuZCBleHBlY3RcbiAgICAvLyBpbnRlcnNlY3Rpb24gZGV0ZWN0aW9uIHNtb290aGVzIGl0IG91dC5cbiAgICB2YXIgcHJlX2ZpcnN0ID0gZGlzcGxhY2UuZHgodjEsIC0yICogTWF0aC5hYnMob2Zmc2V0KSwgMCwgYW5nbGVfYik7XG5cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHZlcnRpY2VzLmxlbmd0aCAtIDE7IGkrKykge1xuICAgICAgICB2MSA9IHZlcnRpY2VzW2ldO1xuICAgICAgICB2MiA9IHZlcnRpY2VzW2kgKyAxXTtcblxuICAgICAgICBhbmdsZV9hID0gYW5nbGVfYjtcbiAgICAgICAgYW5nbGVfYiA9IE1hdGguYXRhbjIodjJbMV0gLSB2MVsxXSwgdjJbMF0gLSB2MVswXSk7XG4gICAgICAgIGpvaW50X2FuZ2xlID0gZXhwbGVtZW50X3JlZmxleF9hbmdsZShhbmdsZV9iIC0gYW5nbGVfYSk7XG5cbiAgICAgICAgdmFyIGhhbGZfdHVybnMgPSBoYWxmX3R1cm5fc2VnbWVudHMgKiBNYXRoLmFicyhqb2ludF9hbmdsZSksXG4gICAgICAgICAgICBidWxnZV9zdGVwcyA9IDA7XG5cbiAgICAgICAgaWYgKG9mZnNldCA8IDApIHtcbiAgICAgICAgICAgIGlmIChqb2ludF9hbmdsZSA+IDApIHtcbiAgICAgICAgICAgICAgICBqb2ludF9hbmdsZSA9IGpvaW50X2FuZ2xlIC0gMiAqIE1hdGguUEk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGJ1bGdlX3N0ZXBzID0gMSArIE1hdGguZmxvb3IoaGFsZl90dXJucyAvIE1hdGguUEkpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaWYgKGpvaW50X2FuZ2xlIDwgMCkge1xuICAgICAgICAgICAgICAgIGpvaW50X2FuZ2xlID0gam9pbnRfYW5nbGUgKyAyICogTWF0aC5QSTtcbiAgICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICAgICAgYnVsZ2Vfc3RlcHMgPSAxICsgTWF0aC5mbG9vcihoYWxmX3R1cm5zIC8gTWF0aC5QSSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB3ID0gZGlzcGxhY2UudWEodjEsIGFuZ2xlX2EsIG9mZnNldCk7XG4gICAgICAgIG91dHB1dC5wdXNoKGNsb25lKHcpKTtcblxuICAgICAgICBmb3IgKHZhciBzID0gMDsgKytzIDwgYnVsZ2Vfc3RlcHM7ICkge1xuICAgICAgICAgICAgdyA9IGRpc3BsYWNlLnVhKHYxLFxuICAgICAgICAgICAgICAgIGFuZ2xlX2EgKyAoam9pbnRfYW5nbGUgKiBzKSAvIGJ1bGdlX3N0ZXBzLFxuICAgICAgICAgICAgICAgIG9mZnNldCk7XG4gICAgICAgICAgICBvdXRwdXQucHVzaChjbG9uZSh3KSk7XG4gICAgICAgIH1cblxuICAgICAgICB2MSA9IGRpc3BsYWNlLmEodjEsIGFuZ2xlX2IsIG9mZnNldCk7XG4gICAgfVxuXG4gICAgLy8gbGFzdCB2ZXJ0ZXhcbiAgICBvdXRwdXQucHVzaChkaXNwbGFjZS5hKHYxLCBhbmdsZV9iLCBvZmZzZXQpKTtcblxuICAgIGNvbnNvbGUubG9nKG91dHB1dCwgb2Zmc2V0LCB0aHJlc2hvbGQpO1xuICAgIC8vcmV0dXJuIHNlbGVjdFZlcnRpY2VzKG91dHB1dCwgb2Zmc2V0LCB0aHJlc2hvbGQpO1xuICAgICByZXR1cm4gb3V0cHV0O1xufTtcblxuXG5mdW5jdGlvbiBzZWxlY3RWZXJ0aWNlcyhvdXRwdXQsIG9mZnNldCwgdGhyZXNob2xkKSB7XG4gICAgdmFyIHZ4ID0gW107XG5cbiAgICBmb3IgKHZhciBwb3MgPSAwOyBwb3MgKyAxIDwgb3V0cHV0Lmxlbmd0aDsgcG9zKyspIHtcblxuICAgICAgICB2YXIgcHJlID0gb3V0cHV0W3Bvc107XG4gICAgICAgIHZhciBjdXIgPSBvdXRwdXRbKytwb3NdO1xuXG4gICAgICAgIHZhciBjaGVja19kaXN0ID0gb2Zmc2V0ICogdGhyZXNob2xkLFxuICAgICAgICAgICAgY2hlY2tfZGlzdDIgPSBjaGVja19kaXN0ICogY2hlY2tfZGlzdCxcbiAgICAgICAgICAgIHQgPSAxLCB2dCwgdXQ7XG5cbiAgICAgICAgZm9yICh2YXIgaSA9IHBvczsgaSArIDEgPCBvdXRwdXQubGVuZ3RoOyArK2kpIHtcbiAgICAgICAgICAgIHZhciB1MCA9IG91dHB1dFtpXSxcbiAgICAgICAgICAgICAgICB1MSA9IG91dHB1dFtpICsgMV0sXG4gICAgICAgICAgICAgICAgZHggPSB1MFswXSAtIGN1clswXSxcbiAgICAgICAgICAgICAgICBkeSA9IHUwWzFdIC0gY3VyWzFdO1xuXG4gICAgICAgICAgICBpZiAoZHggKiBkeCArIGR5ICogZHkgPiBjaGVja19kaXN0MikgYnJlYWs7XG4gICAgICAgICAgICBpZiAoIWludGVyc2VjdGlvbihwcmUsIGN1ciwgdnQsIHUwLCB1MSwgdXQpKSB7XG4gICAgICAgICAgICAgICAgY29udGludWU7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHZ0ID0gZmluZFZ0KHByZSwgY3VyLCB1MCwgdTEpO1xuICAgICAgICAgICAgICAgIHV0ID0gZmluZFV0KHByZSwgY3VyLCB1MCwgdTEsIHZ0KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmICh2dCA8IDAgfHwgdnQgPiB0IHx8IHV0IDwgMCB8fCB1dCA+IDEpIGNvbnRpbnVlO1xuICAgICAgICAgICAgdCA9IHZ0O1xuICAgICAgICAgICAgcG9zID0gaSArIDE7XG4gICAgICAgIH1cblxuICAgICAgICBvdXRwdXRbcG9zXSA9IFtcbiAgICAgICAgICAgIHByZVswXSArIHQgKiAoY3VyWzBdIC0gcHJlWzBdKSxcbiAgICAgICAgICAgIHByZVsxXSArIHQgKiAoY3VyWzFdIC0gcHJlWzFdKVxuICAgICAgICBdO1xuXG4gICAgICAgIHZ4LnB1c2goY2xvbmUob3V0cHV0W3Bvc10pKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdng7XG59IiwidmFyIEdyZWluZXJIb3JtYW5uID0gcmVxdWlyZSgnZ3JlaW5lci1ob3JtYW5uJyk7XG52YXIgRWRnZSA9IHJlcXVpcmUoJy4vZWRnZScpO1xudmFyIGludGVyc2VjdGlvbiA9IHJlcXVpcmUoJy4vaW50ZXJzZWN0aW9uJyk7XG52YXIgbWFydGluZXogPSByZXF1aXJlKCdtYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nJyk7XG5cblwidXNlIHN0cmljdFwiO1xuXG52YXIgbWluID0gTWF0aC5taW4sXG4gICAgbWF4ID0gTWF0aC5tYXgsXG4gICAgYXRhbjIgPSBNYXRoLmF0YW4yO1xuXG4vKipcbiAqIE9mZnNldCBidWlsZGVyXG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pj19IHZlcnRpY2VzXG4gKiBAcGFyYW0ge051bWJlcj19ICAgICAgICBhcmNTZWdtZW50c1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE9mZnNldCh2ZXJ0aWNlcywgYXJjU2VnbWVudHMpIHtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn1cbiAgICAgKi9cbiAgICB0aGlzLnZlcnRpY2VzID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIEB0eXBlIHtBcnJheS48RWRnZT59XG4gICAgICovXG4gICAgdGhpcy5lZGdlcyA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKi9cbiAgICB0aGlzLl9jbG9zZWQgPSBmYWxzZTtcblxuICAgIGlmICh2ZXJ0aWNlcykge1xuICAgICAgICB0aGlzLmRhdGEodmVydGljZXMpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIFNlZ21lbnRzIGluIGVkZ2UgYm91bmRpbmcgYXJjaGVzXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKi9cbiAgICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBhcmNTZWdtZW50cyA6IDU7XG59O1xuXG4vKipcbiAqIENoYW5nZSBkYXRhIHNldFxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5Pn0gdmVydGljZXNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5kYXRhID0gZnVuY3Rpb24odmVydGljZXMpIHtcbiAgICB2ZXJ0aWNlcyA9IHRoaXMudmFsaWRhdGUodmVydGljZXMpO1xuXG4gICAgdmFyIGVkZ2VzID0gW107XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IHZlcnRpY2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGVkZ2VzLnB1c2gobmV3IEVkZ2UodmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSkgJSBsZW5dKSk7XG4gICAgfVxuXG4gICAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuICAgIHRoaXMuZWRnZXMgPSBlZGdlcztcbiAgICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBhcmNTZWdtZW50c1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmFyY1NlZ21lbnRzID0gZnVuY3Rpb24oYXJjU2VnbWVudHMpIHtcbiAgICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzO1xuICAgIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBWYWxpZGF0ZXMgaWYgdGhlIGZpcnN0IGFuZCBsYXN0IHBvaW50cyByZXBlYXRcbiAqIFRPRE86IGNoZWNrIENDV1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxPYmplY3Q+fSB2ZXJ0aWNlc1xuICovXG5PZmZzZXQucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24odmVydGljZXMpIHtcbiAgICB2YXIgbGVuID0gdmVydGljZXMubGVuZ3RoO1xuICAgIGlmICh2ZXJ0aWNlc1swXVswXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMF0gJiZcbiAgICAgICAgdmVydGljZXNbMF1bMV0gPT09IHZlcnRpY2VzW2xlbiAtIDFdWzFdKSB7XG4gICAgICAgIHZlcnRpY2VzID0gdmVydGljZXMuc2xpY2UoMCwgbGVuIC0gMSk7XG4gICAgICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gICAgfVxuICAgIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBhcmNoIGJldHdlZW4gdHdvIGVkZ2VzXG4gKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IHZlcnRpY2VzXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgY2VudGVyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgcmFkaXVzXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgc3RhcnRWZXJ0ZXhcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBlbmRWZXJ0ZXhcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICBzZWdtZW50c1xuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgIG91dHdhcmRzXG4gKi9cbk9mZnNldC5wcm90b3R5cGUuY3JlYXRlQXJjID0gZnVuY3Rpb24odmVydGljZXMsIGNlbnRlciwgcmFkaXVzLCBzdGFydFZlcnRleCxcbiAgICBlbmRWZXJ0ZXgsIHNlZ21lbnRzLCBvdXR3YXJkcykge1xuXG4gICAgdmFyIFBJMiA9IE1hdGguUEkgKiAyLFxuICAgICAgICBzdGFydEFuZ2xlID0gYXRhbjIoc3RhcnRWZXJ0ZXhbMV0gLSBjZW50ZXJbMV0sIHN0YXJ0VmVydGV4WzBdIC0gY2VudGVyWzBdKSxcbiAgICAgICAgZW5kQW5nbGUgPSBhdGFuMihlbmRWZXJ0ZXhbMV0gLSBjZW50ZXJbMV0sIGVuZFZlcnRleFswXSAtIGNlbnRlclswXSk7XG5cbiAgICAvLyBvZGQgbnVtYmVyIHBsZWFzZVxuICAgIGlmIChzZWdtZW50cyAlIDIgPT09IDApIHtcbiAgICAgICAgc2VnbWVudHMgLT0gMTtcbiAgICB9XG5cbiAgICBpZiAoc3RhcnRBbmdsZSA8IDApIHtcbiAgICAgICAgc3RhcnRBbmdsZSArPSBQSTI7XG4gICAgfVxuXG4gICAgaWYgKGVuZEFuZ2xlIDwgMCkge1xuICAgICAgICBlbmRBbmdsZSArPSBQSTI7XG4gICAgfVxuXG4gICAgdmFyIGFuZ2xlID0gKChzdGFydEFuZ2xlID4gZW5kQW5nbGUpID9cbiAgICAgICAgICAgIChzdGFydEFuZ2xlIC0gZW5kQW5nbGUpIDpcbiAgICAgICAgICAgIChzdGFydEFuZ2xlICsgUEkyIC0gZW5kQW5nbGUpKSxcbiAgICAgICAgc2VnbWVudEFuZ2xlID0gKChvdXR3YXJkcykgPyAtYW5nbGUgOiBQSTIgLSBhbmdsZSkgLyBzZWdtZW50cztcblxuICAgIHZlcnRpY2VzLnB1c2goc3RhcnRWZXJ0ZXgpO1xuICAgIGZvciAodmFyIGkgPSAxOyBpIDwgc2VnbWVudHM7ICsraSkge1xuICAgICAgICBhbmdsZSA9IHN0YXJ0QW5nbGUgKyBzZWdtZW50QW5nbGUgKiBpO1xuICAgICAgICB2ZXJ0aWNlcy5wdXNoKFtcbiAgICAgICAgICAgIGNlbnRlclswXSArIE1hdGguY29zKGFuZ2xlKSAqIHJhZGl1cyxcbiAgICAgICAgICAgIGNlbnRlclsxXSArIE1hdGguc2luKGFuZ2xlKSAqIHJhZGl1c1xuICAgICAgICBdKTtcbiAgICB9XG4gICAgdmVydGljZXMucHVzaChlbmRWZXJ0ZXgpO1xufTtcblxuLyoqXG4gKiBDcmVhdGUgcGFkZGluZyBwb2x5Z29uXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0YW5jZVxuICogQHJldHVybiB7QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUucGFkZGluZyA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgICB2YXIgb2Zmc2V0RWRnZXMgPSBbXSxcbiAgICAgICAgdmVydGljZXMgPSBbXSxcbiAgICAgICAgaSwgbGVuLCB1bmlvbjtcblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IHRoaXMuZWRnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIGVkZ2UgPSB0aGlzLmVkZ2VzW2ldLFxuICAgICAgICAgICAgZHggPSBlZGdlLl9vdXROb3JtYWxbMF0gKiBkaXN0LFxuICAgICAgICAgICAgZHkgPSBlZGdlLl9vdXROb3JtYWxbMV0gKiBkaXN0O1xuICAgICAgICBvZmZzZXRFZGdlcy5wdXNoKGVkZ2Uub2Zmc2V0KGR4LCBkeSkpO1xuICAgIH1cblxuICAgIGZvciAoaSA9IDAsIGxlbiA9IG9mZnNldEVkZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIHZhciB0aGlzRWRnZSA9IG9mZnNldEVkZ2VzW2ldLFxuICAgICAgICAgICAgcHJldkVkZ2UgPSBvZmZzZXRFZGdlc1soaSArIGxlbiAtIDEpICUgbGVuXSxcbiAgICAgICAgICAgIHZlcnRleCA9IGludGVyc2VjdGlvbihcbiAgICAgICAgICAgICAgICBwcmV2RWRnZS5jdXJyZW50LFxuICAgICAgICAgICAgICAgIHByZXZFZGdlLm5leHQsXG4gICAgICAgICAgICAgICAgdGhpc0VkZ2UuY3VycmVudCxcbiAgICAgICAgICAgICAgICB0aGlzRWRnZS5uZXh0KTtcblxuICAgICAgICBpZiAodmVydGV4KVxuICAgICAgICAgICAgdmVydGljZXMucHVzaCh2ZXJ0ZXgpO1xuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY3JlYXRlQXJjKFxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLFxuICAgICAgICAgICAgICAgIHRoaXMuZWRnZXNbaV0uY3VycmVudCxcbiAgICAgICAgICAgICAgICBkaXN0LFxuICAgICAgICAgICAgICAgIHByZXZFZGdlLm5leHQsXG4gICAgICAgICAgICAgICAgdGhpc0VkZ2UuY3VycmVudCxcbiAgICAgICAgICAgICAgICB0aGlzLl9hcmNTZWdtZW50cyxcbiAgICAgICAgICAgICAgICBmYWxzZSk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgLy8gdW5pb24gPSBHcmVpbmVySG9ybWFubi51bmlvbih2ZXJ0aWNlcywgdmVydGljZXMpO1xuICAgIC8vIHVuaW9uID0gdmVydGljZXM7XG4gICAgLy8gdmVydGljZXMgPSB1bmlvbiA/IHVuaW9uWzBdIDogdmVydGljZXM7XG5cbiAgICB2ZXJ0aWNlcyA9IHRoaXMuZW5zdXJlTGFzdFBvaW50KHZlcnRpY2VzKTtcbiAgICByZXR1cm4gdmVydGljZXM7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgbWFyZ2luIHBvbHlnb25cbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUubWFyZ2luID0gZnVuY3Rpb24oZGlzdCkge1xuICAgIHZhciBvZmZzZXRFZGdlcyA9IFtdLFxuICAgICAgICB2ZXJ0aWNlcyA9IFtdLFxuICAgICAgICBpLCBsZW4sIHVuaW9uO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHRoaXMuZWRnZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgdmFyIGVkZ2UgPSB0aGlzLmVkZ2VzW2ldLFxuICAgICAgICAgICAgZHggPSBlZGdlLl9pbk5vcm1hbFswXSAqIGRpc3QsXG4gICAgICAgICAgICBkeSA9IGVkZ2UuX2luTm9ybWFsWzFdICogZGlzdDtcblxuICAgICAgICBvZmZzZXRFZGdlcy5wdXNoKGVkZ2Uub2Zmc2V0KGR4LCBkeSkpO1xuICAgIH1cblxuICAgIGlmIChkaXN0ID09PSAwKSB7XG4gICAgICAgIGZvciAoaSA9IDAsIGxlbiA9IG9mZnNldEVkZ2VzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKG9mZnNldEVkZ2VzW2ldLmN1cnJlbnQsIG9mZnNldEVkZ2VzW2ldLm5leHQpO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiB2ZXJ0aWNlcztcbiAgICB9XG5cbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBvZmZzZXRFZGdlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgICB2YXIgdGhpc0VkZ2UgPSBvZmZzZXRFZGdlc1tpXSxcbiAgICAgICAgICAgIHByZXZFZGdlID0gb2Zmc2V0RWRnZXNbKGkgKyBsZW4gLSAxKSAlIGxlbl0sXG4gICAgICAgICAgICB2ZXJ0ZXggPSBpbnRlcnNlY3Rpb24oXG4gICAgICAgICAgICAgICAgcHJldkVkZ2UuY3VycmVudCxcbiAgICAgICAgICAgICAgICBwcmV2RWRnZS5uZXh0LFxuICAgICAgICAgICAgICAgIHRoaXNFZGdlLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgdGhpc0VkZ2UubmV4dFxuICAgICAgICAgICAgKTtcblxuICAgICAgICBpZiAodmVydGV4KSB7XG4gICAgICAgICAgICB2ZXJ0aWNlcy5wdXNoKHZlcnRleCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmNyZWF0ZUFyYyhcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlcyxcbiAgICAgICAgICAgICAgICB0aGlzLmVkZ2VzW2ldLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgZGlzdCxcbiAgICAgICAgICAgICAgICBwcmV2RWRnZS5uZXh0LFxuICAgICAgICAgICAgICAgIHRoaXNFZGdlLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5fYXJjU2VnbWVudHMsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHVuaW9uID0gR3JlaW5lckhvcm1hbm4udW5pb24odmVydGljZXMsIHZlcnRpY2VzKTtcbiAgICAvLyBpZiAodW5pb24pIHtcbiAgICAvLyAgICAgdW5pb24gPSB1bmlvblswXTtcbiAgICAvLyAgICAgLy8gdGhhdCdzIHRoZSB0b2xsXG4gICAgLy8gICAgIHZlcnRpY2VzID0gdW5pb24uc2xpY2UoMCwgdW5pb24ubGVuZ3RoIC8gMik7XG4gICAgLy8gfVxuXG4gICAgdmVydGljZXMgPSB0aGlzLmVuc3VyZUxhc3RQb2ludCh2ZXJ0aWNlcyk7XG5cbiAgICAvL2NvbnNvbGUubG9nKEpTT04uc3RyaW5naWZ5KHZlcnRpY2VzLCAwLCAyKSk7XG4gICAgY29uc29sZS50aW1lKCdtYXJ0aW5leicpO1xuICAgIHZlcnRpY2VzID0gbWFydGluZXoudW5pb24oW3ZlcnRpY2VzXSwgW0pTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkodmVydGljZXMpKV0pO1xuICAgIGNvbnNvbGUudGltZUVuZCgnbWFydGluZXonKTtcbiAgICByZXR1cm4gdmVydGljZXM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxPYmplY3Q+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuZW5zdXJlTGFzdFBvaW50ID0gZnVuY3Rpb24odmVydGljZXMpIHtcbiAgICBpZiAodGhpcy5fY2xvc2VkKSB7XG4gICAgICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgICAgICAgdmVydGljZXNbMF1bMF0sXG4gICAgICAgICAgICB2ZXJ0aWNlc1swXVsxXVxuICAgICAgICBdKTtcbiAgICB9XG4gICAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuLyoqXG4gKiBEZWNpZGVzIGJ5IHRoZSBzaWduIGlmIGl0J3MgYSBwYWRkaW5nIG9yIGEgbWFyZ2luXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihkaXN0KSB7XG4gICAgcmV0dXJuIGRpc3QgPT09IDAgP1xuICAgICAgICB0aGlzLnZlcnRpY2VzIDpcbiAgICAgICAgKGRpc3QgPiAwID8gdGhpcy5tYXJnaW4oZGlzdCkgOiB0aGlzLnBhZGRpbmcoLWRpc3QpKTtcbn07XG5cblxuT2Zmc2V0LmxpbmVPZmZzZXQgPSByZXF1aXJlKCcuL2xpbmVfb2Zmc2V0Jykub2Zmc2V0O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9mZnNldDtcbiIsIi8vIGh0dHBzOi8vZ2l0aHViLmNvbS90bWN3L3BvaW50LWRpc3BsYWNlL1xudmFyIHNpbiA9IE1hdGguc2luO1xudmFyIGNvcyA9IE1hdGguY29zO1xuXG5cbm1vZHVsZS5leHBvcnRzLmR4ID0gZnVuY3Rpb24odiwgZHgsIGR5LCBhKSB7XG4gIHJldHVybiBbXG4gICAgdlswXSArIChkeCAqIGNvcyhhKSAtIGR5ICogc2luKGEpKSxcbiAgICB2WzFdICsgKGR4ICogc2luKGEpICsgZHkgKiBjb3MoYSkpXG4gIF07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLmEgPSBmdW5jdGlvbih2LCBhLCBvZmZzZXQpIHtcbiAgcmV0dXJuIFtcbiAgICB2WzBdICsgKG9mZnNldCAqIHNpbihhKSksXG4gICAgdlsxXSAtIChvZmZzZXQgKiBjb3MoYSkpXG4gIF07XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLnVhID0gZnVuY3Rpb24odSwgYSwgb2Zmc2V0KSB7XG4gIHJldHVybiBbXG4gICAgdVswXSArIChvZmZzZXQgKiBzaW4oYSkpLFxuICAgIHVbMV0gLSAob2Zmc2V0ICogY29zKGEpKVxuICBdO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy5hYiA9IGZ1bmN0aW9uKHYsIGEsIGIsIG9mZnNldCkge1xuICB2YXIgc2EgPSBvZmZzZXQgKiBzaW4oYSksXG4gICAgICBjYSA9IG9mZnNldCAqIGNvcyhhKSxcbiAgICAgIGggPSB0YW4oMC41ICogKGIgLSBhKSk7XG4gIHJldHVybiBbXG4gICAgdlswXSArIHNhICsgaCAqIGNhLFxuICAgIHZbMV0gLSBjYSArIGggKiBzYVxuICBdO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzPXtcbiAgXCJ0eXBlXCI6IFwiRmVhdHVyZUNvbGxlY3Rpb25cIixcbiAgXCJmZWF0dXJlc1wiOiBbXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJwcm9wZXJ0aWVzXCI6IHt9LFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIlBvbHlnb25cIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOlxuICAgICAgICAgIFtbXG4gIFtcbiAgICAxMTQuMTg3MDc3MjgzODU5MjUsXG4gICAgMjIuMjY2NTc0NzU2NTI1MDM1XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg3Mjc1NzY3MzI2MzUsXG4gICAgMjIuMjY2Mzc2MTgwNDQ5ODZcbiAgXSxcbiAgW1xuICAgIDExNC4xODc1NzA4MTAzMTgsXG4gICAgMjIuMjY2NjkzOTAyMDM0ODc3XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg3NjI5ODE4OTE2MzIsXG4gICAgMjIuMjY2NzE4NzI0MDAzMzI2XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg3ODEyMjA5MTI5MzMsXG4gICAgMjIuMjY2NTg0Njg1MzIxNFxuICBdLFxuICBbXG4gICAgMTE0LjE4ODE3MTYyNTEzNzMzLFxuICAgIDIyLjI2NjQzNTc1MzMwMTk5OFxuICBdLFxuICBbXG4gICAgMTE0LjE4ODMzNzkyMjA5NjI1LFxuICAgIDIyLjI2Njg3NzU4NDQ5NzE0XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MjQ2NzI2OTg5NzUsXG4gICAgMjIuMjY2OTA3MzcwODE5NjZcbiAgXSxcbiAgW1xuICAgIDExNC4xODgxODc3MTgzOTE0MixcbiAgICAyMi4yNjY3ODgyMjU0OTE1NjdcbiAgXSxcbiAgW1xuICAgIDExNC4xODgxNDQ4MDMwNDcxOCxcbiAgICAyMi4yNjY4MDgwODMwNTMyOVxuICBdLFxuICBbXG4gICAgMTE0LjE4ODE3Njk4OTU1NTM2LFxuICAgIDIyLjI2Njg3NzU4NDQ5NzE0XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MTM0MDc0MjExMTIsXG4gICAgMjIuMjY2ODkyNDc3NjU5MTlcbiAgXSxcbiAgW1xuICAgIDExNC4xODgxODIzNTM5NzMzOSxcbiAgICAyMi4yNjY5NTIwNTAyOTE1MjVcbiAgXSxcbiAgW1xuICAgIDExNC4xODgxMjMzNDUzNzUwNixcbiAgICAyMi4yNjY5OTE3NjUzNjU2NjNcbiAgXSxcbiAgW1xuICAgIDExNC4xODgwNDgyNDM1MjI2NCxcbiAgICAyMi4yNjY4NjI2OTEzMzM1MDdcbiAgXSxcbiAgW1xuICAgIDExNC4xODc5NTE2ODM5OTgxMSxcbiAgICAyMi4yNjcwMTE2MjI4OTg1MlxuICBdLFxuICBbXG4gICAgMTE0LjE4ODEzNDA3NDIxMTEyLFxuICAgIDIyLjI2NzE4MDQxMTgxMzg5XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MzU5Mzc5NzY4MzcsXG4gICAgMjIuMjY2OTY2OTQzNDQ1NjVcbiAgXSxcbiAgW1xuICAgIDExNC4xODg0MjM3NTI3ODQ3MyxcbiAgICAyMi4yNjcwMTY1ODcyODEyNzZcbiAgXSxcbiAgW1xuICAgIDExNC4xODgwNTg5NzIzNTg2OSxcbiAgICAyMi4yNjczOTM4Nzk4NTY0N1xuICBdLFxuICBbXG4gICAgMTE0LjE4NzYyNDQ1NDQ5ODI5LFxuICAgIDIyLjI2NzA2MTI2NjcxODI4M1xuICBdLFxuICBbXG4gICAgMTE0LjE4NzQwNDUxMzM1OTA3LFxuICAgIDIyLjI2Njk1NzAxNDY3NjQyXG4gIF0sXG4gIFtcbiAgICAxMTQuMTg3NDU4MTU3NTM5MzcsXG4gICAgMjIuMjY2OTAyNDA2NDMzMDFcbiAgXVxuXV1cblxuICAgICAgfVxuICAgIH0sXG4gICAge1xuICAgICAgXCJ0eXBlXCI6IFwiRmVhdHVyZVwiLFxuICAgICAgXCJnZW9tZXRyeVwiOiB7XG4gICAgICAgIFwidHlwZVwiOiBcIkxpbmVTdHJpbmdcIixcbiAgICAgICAgXCJjb29yZGluYXRlc1wiOiBbXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NjE3MDY5NzIxMjIyLFxuICAgICAgICAgICAgMjIuMjY4Nzg4ODYwNjc1MlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NjI4MzM0OTk5MDg0LFxuICAgICAgICAgICAgMjIuMjY4Njc5NjQ1NTk2ODgzXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg2NTE0MDE5OTY2MTMsXG4gICAgICAgICAgICAyMi4yNjgzMTcyNDk0OTg5OTVcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODY3MzM5NjExMDUzNSxcbiAgICAgICAgICAgIDIyLjI2Nzk0NDkyMzc2MzM4XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg2OTMyNDQ0NTcyNDMsXG4gICAgICAgICAgICAyMi4yNjc2MDIzODMyMTE1OTZcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODY3NDQ2ODk5NDE0LFxuICAgICAgICAgICAgMjIuMjY3NDg4MjAyODQxMzE3XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg2NzQ0Njg5OTQxNCxcbiAgICAgICAgICAgIDIyLjI2NzM4ODkxNTQ4NzA4NlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4Njg1NzM0MjcyMDAzLFxuICAgICAgICAgICAgMjIuMjY3MjIwMTI2ODIzMjJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODcxMjAxOTkyMDM0OSxcbiAgICAgICAgICAgIDIyLjI2NzI0OTkxMzA3MjgxM1xuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NzIxNjc1ODcyODAzLFxuICAgICAgICAgICAgMjIuMjY3MjU0ODc3NDQ3MTMzXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg3NTkyMjY3OTkwMTEsXG4gICAgICAgICAgICAyMi4yNjc0NTg0MTY2NDI0NDhcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODcxNjMxMTQ1NDc3MyxcbiAgICAgICAgICAgIDIyLjI2ODE4MzIxMjM0ODMxMlxuICAgICAgICAgIF1cbiAgICAgICAgXVxuICAgICAgfVxuICAgIH1cbiAgXVxufSJdfQ==
