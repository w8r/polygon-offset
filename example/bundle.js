(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
var Offset = require('../src/offset');
require('./leaflet_multipolygon');
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
  maxZoom: 22
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
    if (margin === 0) return;
    var shape = project(gj, function(coord) {
      var pt = map.options.crs.latLngToPoint(L.latLng(coord.slice().reverse()), map.getZoom());
      return [pt.x, pt.y];
    });

    var margined;
    if (gj.geometry.type === 'LineString') {
      if (margin < 0) return;
      var res = new Offset(shape.geometry.coordinates).arcSegments(100).offsetLine(margin);
      margined = {
        type: 'Feature',
        geometry: {
          type: 'Polygon',
          coordinates: res
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

// L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
//   attribution: '&copy; ' +
//     '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
// }).addTo(map);

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
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImV4YW1wbGUvYXBwLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbInZhciBPZmZzZXQgPSByZXF1aXJlKCcuLi9zcmMvb2Zmc2V0Jyk7XG5yZXF1aXJlKCcuL2xlYWZsZXRfbXVsdGlwb2x5Z29uJyk7XG5yZXF1aXJlKCcuL3BvbHlnb25fY29udHJvbCcpO1xudmFyIE9mZnNldENvbnRyb2wgPSByZXF1aXJlKCcuL29mZnNldF9jb250cm9sJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL3Rlc3QvZml4dHVyZXMvcG9seWdvbl9wb2x5bGluZS5qc29uJyk7XG52YXIgcHJvamVjdCA9IHJlcXVpcmUoJ2dlb2pzb24tcHJvamVjdCcpO1xuXG52YXIgc3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgY29sb3I6ICcjNDhmJyxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICBkYXNoQXJyYXk6IFsyLCA0XVxuICAgIH0sXG4gICAgbWFyZ2luU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjMjc2RDhGJ1xuICAgIH0sXG4gICAgcGFkZGluZ1N0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnI0Q4MTcwNidcbiAgICB9LFxuICAgIGNlbnRlciA9IFsyMi4yNjcwLCAxMTQuMTg4XSxcbiAgICB6b29tID0gMTcsXG4gICAgbWFwLCB2ZXJ0aWNlcywgcmVzdWx0O1xuXG5tYXAgPSBnbG9iYWwubWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgem9vbSk7XG5cblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKCkuYWRkVG8obWFwKTtcbnZhciByZXN1bHRzID0gZ2xvYmFsLnJlc3VsdHMgPSBMLmdlb0pzb24obnVsbCwge1xuICBzdHlsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiBtYXJnaW5TdHlsZTtcbiAgfVxufSkuYWRkVG8obWFwKTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5cbmZ1bmN0aW9uIHJ1biAobWFyZ2luKSB7XG4gIHJlc3VsdHMuY2xlYXJMYXllcnMoKTtcbiAgbGF5ZXJzLmVhY2hMYXllcihmdW5jdGlvbihsYXllcikge1xuICAgIHZhciBnaiA9IGxheWVyLnRvR2VvSlNPTigpO1xuICAgIGNvbnNvbGUubG9nKGdqLCBtYXJnaW4pO1xuICAgIGlmIChtYXJnaW4gPT09IDApIHJldHVybjtcbiAgICB2YXIgc2hhcGUgPSBwcm9qZWN0KGdqLCBmdW5jdGlvbihjb29yZCkge1xuICAgICAgdmFyIHB0ID0gbWFwLm9wdGlvbnMuY3JzLmxhdExuZ1RvUG9pbnQoTC5sYXRMbmcoY29vcmQuc2xpY2UoKS5yZXZlcnNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbiAgICAgIHJldHVybiBbcHQueCwgcHQueV07XG4gICAgfSk7XG5cbiAgICB2YXIgbWFyZ2luZWQ7XG4gICAgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgaWYgKG1hcmdpbiA8IDApIHJldHVybjtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKS5hcmNTZWdtZW50cygxMDApLm9mZnNldExpbmUobWFyZ2luKTtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IG5ldyBPZmZzZXQoc2hhcGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0pLm9mZnNldChtYXJnaW4pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ21hcmdpbmVkJywgbWFyZ2luZWQpO1xuICAgIHJlc3VsdHMuYWRkRGF0YShwcm9qZWN0KG1hcmdpbmVkLCBmdW5jdGlvbihwdCkge1xuICAgICAgdmFyIGxsID0gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwdC5zbGljZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW2xsLmxuZywgbGwubGF0XTtcbiAgICB9KSk7XG4gIH0pO1xufVxuXG4vLyBMLnRpbGVMYXllcignaHR0cDovL3tzfS50aWxlLm9zbS5vcmcve3p9L3t4fS97eX0ucG5nJywge1xuLy8gICBhdHRyaWJ1dGlvbjogJyZjb3B5OyAnICtcbi8vICAgICAnPGEgaHJlZj1cImh0dHA6Ly9vc20ub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcbi8vIH0pLmFkZFRvKG1hcCk7XG5cbi8vIGNvbnNvbGUubG9nKHBvbHlnb24pO1xuXG4vLyBmdW5jdGlvbiBwcm9qZWN0KGxsKSB7XG4vLyAgIHZhciBwdCA9IG1hcC5vcHRpb25zLmNycy5sYXRMbmdUb1BvaW50KEwubGF0TG5nKGxsLnNsaWNlKCkucmV2ZXJzZSgpKSwgbWFwLmdldFpvb20oKSk7XG4vLyAgIHJldHVybiBbcHQueCwgcHQueV07XG4vLyB9XG5cbi8vIHZlcnRpY2VzID0gcG9seWdvbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXS5tYXAocHJvamVjdCk7XG5cbi8vIGNvbnNvbGUudGltZSgnbWFyZ2luJyk7XG4vLyByZXN1bHQgPSBuZXcgT2Zmc2V0KHZlcnRpY2VzKS5tYXJnaW4oNDApO1xuLy8gY29uc29sZS50aW1lRW5kKCdtYXJnaW4nKTtcbi8vIHJlc3VsdCA9IHJlc3VsdC5tYXAoZnVuY3Rpb24ocCkge1xuLy8gICByZXR1cm4gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwKSwgbWFwLmdldFpvb20oKSk7XG4vLyB9KTtcblxuLy8gTC5wb2x5Z29uKHJlc3VsdCwgbWFyZ2luU3R5bGUpLmFkZFRvKG1hcCk7XG4vLyBjb25zb2xlLnRpbWUoJ3BhZGRpbmcnKTtcbi8vIHJlc3VsdCA9IG5ldyBPZmZzZXQodmVydGljZXMpLnBhZGRpbmcoMTApO1xuLy8gY29uc29sZS50aW1lRW5kKCdwYWRkaW5nJyk7XG4vLyByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKHApIHtcbi8vICAgICByZXR1cm4gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwKSwgbWFwLmdldFpvb20oKSk7XG4vLyB9KTtcblxuLy8gTC5wb2x5Z29uKHJlc3VsdCwgcGFkZGluZ1N0eWxlKS5hZGRUbyhsYXllcnMpO1xuXG4vLyB2YXIgbGluZVBvaW50cyA9IGRhdGEuZmVhdHVyZXNbMV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXMubWFwKHByb2plY3QpOyJdfQ==
},{"../src/offset":21,"../test/fixtures/polygon_polyline.json":22,"./leaflet_multipolygon":2,"./offset_control":3,"./polygon_control":4,"geojson-project":9}],2:[function(require,module,exports){
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
  return dist === 0 ? this.vertices :
      (dist > 0 ? this.margin(dist) : this.padding(-dist));
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
  if (dist === 0) return this.ensureLastPoint(this.vertices);

  this.ensureLastPoint(this.vertices);
  var union = this.offsetLine(dist);
  union = martinez.union(union, [this.ensureLastPoint(this.vertices)]);
  return union;
};


/**
 * @param  {Number} dist
 * @return {Array.<Number>}
 */
Offset.prototype.padding = function(dist) {
  if (dist === 0) return this.ensureLastPoint(this.vertices);

  this.ensureLastPoint(this.vertices);
  var union = this.offsetLine(dist);
  var diff = martinez.diff(this.vertices, union);
  return diff;
};


/**
 * Creates margin polygon
 * @param  {Number} dist
 * @return {Array.<Object>}
 */
Offset.prototype.offsetLine = function(dist) {
  if (dist === 0) return this.vertices;

  var vertices = [];
  var union    = [];
  this._closed = true;

  for (var i = 0, len = this.vertices.length - 1; i < len; i++) {
    var segment = this.ensureLastPoint(
        this._offsetSegment([], this.vertices[i], this.vertices[i + 1], dist)
    );
    vertices.push(segment);
    union = (i === 0) ? segment : martinez.union(union, segment);
  }

  return this.vertices.length > 2 ? union : [union];
};

module.exports = Offset;

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
//# sourceMappingURL=data:application/json;charset:utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInNyYy9vZmZzZXQuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsidmFyIEVkZ2UgPSByZXF1aXJlKCcuL2VkZ2UnKTtcbnZhciBtYXJ0aW5leiA9IGdsb2JhbC5tYXJ0aW5leiA9IHJlcXVpcmUoJ21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcnKTtcblxudmFyIGF0YW4yID0gTWF0aC5hdGFuMjtcblxuLyoqXG4gKiBPZmZzZXQgYnVpbGRlclxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD49fSB2ZXJ0aWNlc1xuICogQHBhcmFtIHtOdW1iZXI9fSAgICAgICAgYXJjU2VnbWVudHNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPZmZzZXQodmVydGljZXMsIGFyY1NlZ21lbnRzKSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn1cbiAgICovXG4gIHRoaXMudmVydGljZXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPEVkZ2U+fVxuICAgKi9cbiAgdGhpcy5lZGdlcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5fY2xvc2VkID0gZmFsc2U7XG5cbiAgaWYgKHZlcnRpY2VzKSB7XG4gICAgICB0aGlzLmRhdGEodmVydGljZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZ21lbnRzIGluIGVkZ2UgYm91bmRpbmcgYXJjaGVzXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBhcmNTZWdtZW50cyA6IDU7XG59XG5cbi8qKlxuICogQ2hhbmdlIGRhdGEgc2V0XG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXk+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2ZXJ0aWNlcyA9IHRoaXMudmFsaWRhdGUodmVydGljZXMpO1xuXG4gIHZhciBlZGdlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmVydGljZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBlZGdlcy5wdXNoKG5ldyBFZGdlKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbGVuXSkpO1xuICB9XG5cbiAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuICB0aGlzLmVkZ2VzID0gZWRnZXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGFyY1NlZ21lbnRzXG4gKiBAcmV0dXJuIHtPZmZzZXR9XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuYXJjU2VnbWVudHMgPSBmdW5jdGlvbihhcmNTZWdtZW50cykge1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVmFsaWRhdGVzIGlmIHRoZSBmaXJzdCBhbmQgbGFzdCBwb2ludHMgcmVwZWF0XG4gKiBUT0RPOiBjaGVjayBDQ1dcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIHZhciBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gIGlmICh2ZXJ0aWNlc1swXVswXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMF0gJiZcbiAgICB2ZXJ0aWNlc1swXVsxXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMV0pIHtcbiAgICB2ZXJ0aWNlcyA9IHZlcnRpY2VzLnNsaWNlKDAsIGxlbiAtIDEpO1xuICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFyY2ggYmV0d2VlbiB0d28gZWRnZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICByYWRpdXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBzdGFydFZlcnRleFxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGVuZFZlcnRleFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHNlZ21lbnRzXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgb3V0d2FyZHNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5jcmVhdGVBcmMgPSBmdW5jdGlvbih2ZXJ0aWNlcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0VmVydGV4LFxuICAgIGVuZFZlcnRleCwgc2VnbWVudHMsIG91dHdhcmRzKSB7XG5cbiAgdmFyIFBJMiA9IE1hdGguUEkgKiAyLFxuICAgICAgc3RhcnRBbmdsZSA9IGF0YW4yKHN0YXJ0VmVydGV4WzFdIC0gY2VudGVyWzFdLCBzdGFydFZlcnRleFswXSAtIGNlbnRlclswXSksXG4gICAgICBlbmRBbmdsZSA9IGF0YW4yKGVuZFZlcnRleFsxXSAtIGNlbnRlclsxXSwgZW5kVmVydGV4WzBdIC0gY2VudGVyWzBdKTtcblxuICAvLyBvZGQgbnVtYmVyIHBsZWFzZVxuICBpZiAoc2VnbWVudHMgJSAyID09PSAwKSB7XG4gICAgc2VnbWVudHMgLT0gMTtcbiAgfVxuXG4gIGlmIChzdGFydEFuZ2xlIDwgMCkge1xuICAgIHN0YXJ0QW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgaWYgKGVuZEFuZ2xlIDwgMCkge1xuICAgIGVuZEFuZ2xlICs9IFBJMjtcbiAgfVxuXG4gIHZhciBhbmdsZSA9ICgoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSA/XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSA6XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSArIFBJMiAtIGVuZEFuZ2xlKSksXG4gICAgICBzZWdtZW50QW5nbGUgPSAoKG91dHdhcmRzKSA/IC1hbmdsZSA6IFBJMiAtIGFuZ2xlKSAvIHNlZ21lbnRzO1xuXG4gIHZlcnRpY2VzLnB1c2goc3RhcnRWZXJ0ZXgpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNlZ21lbnRzOyArK2kpIHtcbiAgICBhbmdsZSA9IHN0YXJ0QW5nbGUgKyBzZWdtZW50QW5nbGUgKiBpO1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLFxuICAgICAgY2VudGVyWzFdICsgTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzXG4gICAgXSk7XG4gIH1cbiAgdmVydGljZXMucHVzaChlbmRWZXJ0ZXgpO1xuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IHZlcnRpY2VzXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5lbnN1cmVMYXN0UG9pbnQgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICBpZiAodGhpcy5fY2xvc2VkKSB7XG4gICAgdmVydGljZXMucHVzaChbXG4gICAgICB2ZXJ0aWNlc1swXVswXSxcbiAgICAgIHZlcnRpY2VzWzBdWzFdXG4gICAgXSk7XG4gIH1cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuLyoqXG4gKiBEZWNpZGVzIGJ5IHRoZSBzaWduIGlmIGl0J3MgYSBwYWRkaW5nIG9yIGEgbWFyZ2luXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHJldHVybiBkaXN0ID09PSAwID8gdGhpcy52ZXJ0aWNlcyA6XG4gICAgICAoZGlzdCA+IDAgPyB0aGlzLm1hcmdpbihkaXN0KSA6IHRoaXMucGFkZGluZygtZGlzdCkpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxBcnJheS48TnVtYmVyPj59IHZlcnRpY2VzXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gICAgICAgICBwdDFcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgICAgICAgIHB0MlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgZGlzdFxuICogQHJldHVybiB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5fb2Zmc2V0U2VnbWVudCA9IGZ1bmN0aW9uKHZlcnRpY2VzLCBwdDEsIHB0MiwgZGlzdCkge1xuICB2YXIgZWRnZXMgPSBbbmV3IEVkZ2UocHQxLCBwdDIpLCBuZXcgRWRnZShwdDIsIHB0MSldO1xuICB2YXIgaSwgbGVuID0gMjtcblxuICB2YXIgb2Zmc2V0cyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgdmFyIGR4ID0gZWRnZS5faW5Ob3JtYWxbMF0gKiBkaXN0O1xuICAgIHZhciBkeSA9IGVkZ2UuX2luTm9ybWFsWzFdICogZGlzdDtcblxuICAgIG9mZnNldHMucHVzaChlZGdlLm9mZnNldChkeCwgZHkpKTtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciB0aGlzRWRnZSA9IG9mZnNldHNbaV0sXG4gICAgICAgIHByZXZFZGdlID0gb2Zmc2V0c1soaSArIGxlbiAtIDEpICUgbGVuXTtcbiAgICB0aGlzLmNyZWF0ZUFyYyhcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlcyxcbiAgICAgICAgICAgICAgICBlZGdlc1tpXS5jdXJyZW50LCAvLyBwMSBvciBwMlxuICAgICAgICAgICAgICAgIGRpc3QsXG4gICAgICAgICAgICAgICAgcHJldkVkZ2UubmV4dCxcbiAgICAgICAgICAgICAgICB0aGlzRWRnZS5jdXJyZW50LFxuICAgICAgICAgICAgICAgIHRoaXMuX2FyY1NlZ21lbnRzLFxuICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICk7XG4gIH1cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUubWFyZ2luID0gZnVuY3Rpb24oZGlzdCkge1xuICBpZiAoZGlzdCA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuXG4gIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmUoZGlzdCk7XG4gIHVuaW9uID0gbWFydGluZXoudW5pb24odW5pb24sIFt0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKV0pO1xuICByZXR1cm4gdW5pb247XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5wYWRkaW5nID0gZnVuY3Rpb24oZGlzdCkge1xuICBpZiAoZGlzdCA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuXG4gIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmUoZGlzdCk7XG4gIHZhciBkaWZmID0gbWFydGluZXouZGlmZih0aGlzLnZlcnRpY2VzLCB1bmlvbik7XG4gIHJldHVybiBkaWZmO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZXMgbWFyZ2luIHBvbHlnb25cbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0TGluZSA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgaWYgKGRpc3QgPT09IDApIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuXG4gIHZhciB2ZXJ0aWNlcyA9IFtdO1xuICB2YXIgdW5pb24gICAgPSBbXTtcbiAgdGhpcy5fY2xvc2VkID0gdHJ1ZTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgc2VnbWVudCA9IHRoaXMuZW5zdXJlTGFzdFBvaW50KFxuICAgICAgICB0aGlzLl9vZmZzZXRTZWdtZW50KFtdLCB0aGlzLnZlcnRpY2VzW2ldLCB0aGlzLnZlcnRpY2VzW2kgKyAxXSwgZGlzdClcbiAgICApO1xuICAgIHZlcnRpY2VzLnB1c2goc2VnbWVudCk7XG4gICAgdW5pb24gPSAoaSA9PT0gMCkgPyBzZWdtZW50IDogbWFydGluZXoudW5pb24odW5pb24sIHNlZ21lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMudmVydGljZXMubGVuZ3RoID4gMiA/IHVuaW9uIDogW3VuaW9uXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2Zmc2V0O1xuIl19
},{"./edge":20,"martinez-polygon-clipping":10}],22:[function(require,module,exports){
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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9hcHAuanMiLCJleGFtcGxlL2xlYWZsZXRfbXVsdGlwb2x5Z29uLmpzIiwiZXhhbXBsZS9vZmZzZXRfY29udHJvbC5qcyIsImV4YW1wbGUvcG9seWdvbl9jb250cm9sLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9iaW50cmVlLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9yYnRyZWUuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL3RyZWViYXNlLmpzIiwibm9kZV9tb2R1bGVzL2dlb2pzb24tcHJvamVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfc2VnbWVudHMuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvZWRnZV90eXBlLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2VxdWFscy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zZWdtZW50X2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zaWduZWRfYXJlYS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zd2VlcF9ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW55cXVldWUvaW5kZXguanMiLCJzcmMvZWRnZS5qcyIsInNyYy9vZmZzZXQuanMiLCJ0ZXN0L2ZpeHR1cmVzL3BvbHlnb25fcG9seWxpbmUuanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDeENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDNUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdk9BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzR0E7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9DQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZvQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0lBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzlHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQy9FQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDN0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzUEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgT2Zmc2V0ID0gcmVxdWlyZSgnLi4vc3JjL29mZnNldCcpO1xucmVxdWlyZSgnLi9sZWFmbGV0X211bHRpcG9seWdvbicpO1xucmVxdWlyZSgnLi9wb2x5Z29uX2NvbnRyb2wnKTtcbnZhciBPZmZzZXRDb250cm9sID0gcmVxdWlyZSgnLi9vZmZzZXRfY29udHJvbCcpO1xudmFyIGRhdGEgPSByZXF1aXJlKCcuLi90ZXN0L2ZpeHR1cmVzL3BvbHlnb25fcG9seWxpbmUuanNvbicpO1xudmFyIHByb2plY3QgPSByZXF1aXJlKCdnZW9qc29uLXByb2plY3QnKTtcblxudmFyIHN0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDMsXG4gICAgICAgIGNvbG9yOiAnIzQ4ZicsXG4gICAgICAgIG9wYWNpdHk6IDAuOCxcbiAgICAgICAgZGFzaEFycmF5OiBbMiwgNF1cbiAgICB9LFxuICAgIG1hcmdpblN0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnIzI3NkQ4RidcbiAgICB9LFxuICAgIHBhZGRpbmdTdHlsZSA9IHtcbiAgICAgICAgd2VpZ2h0OiAyLFxuICAgICAgICBjb2xvcjogJyNEODE3MDYnXG4gICAgfSxcbiAgICBjZW50ZXIgPSBbMjIuMjY3MCwgMTE0LjE4OF0sXG4gICAgem9vbSA9IDE3LFxuICAgIG1hcCwgdmVydGljZXMsIHJlc3VsdDtcblxubWFwID0gZ2xvYmFsLm1hcCA9IEwubWFwKCdtYXAnLCB7XG4gIGVkaXRhYmxlOiB0cnVlLFxuICBtYXhab29tOiAyMlxufSkuc2V0VmlldyhjZW50ZXIsIHpvb20pO1xuXG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld1BvbHlnb25Db250cm9sKHtcbiAgY2FsbGJhY2s6IG1hcC5lZGl0VG9vbHMuc3RhcnRQb2x5Z29uXG59KSk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBMLk5ld0xpbmVDb250cm9sKHtcbiAgY2FsbGJhY2s6IG1hcC5lZGl0VG9vbHMuc3RhcnRQb2x5bGluZVxufSkpO1xuXG52YXIgbGF5ZXJzID0gZ2xvYmFsLmxheWVycyA9IEwuZ2VvSnNvbigpLmFkZFRvKG1hcCk7XG52YXIgcmVzdWx0cyA9IGdsb2JhbC5yZXN1bHRzID0gTC5nZW9Kc29uKG51bGwsIHtcbiAgc3R5bGU6IGZ1bmN0aW9uKGZlYXR1cmUpIHtcbiAgICByZXR1cm4gbWFyZ2luU3R5bGU7XG4gIH1cbn0pLmFkZFRvKG1hcCk7XG5cbm1hcC5hZGRDb250cm9sKG5ldyBPZmZzZXRDb250cm9sKHtcbiAgY2xlYXI6IGZ1bmN0aW9uKCkge1xuICAgIGxheWVycy5jbGVhckxheWVycygpO1xuICB9LFxuICBjYWxsYmFjazogcnVuXG59KSk7XG5cbm1hcC5vbignZWRpdGFibGU6Y3JlYXRlZCcsIGZ1bmN0aW9uKGV2dCkge1xuICBsYXllcnMuYWRkTGF5ZXIoZXZ0LmxheWVyKTtcbiAgZXZ0LmxheWVyLm9uKCdjbGljaycsIGZ1bmN0aW9uKGUpIHtcbiAgICBpZiAoKGUub3JpZ2luYWxFdmVudC5jdHJsS2V5IHx8IGUub3JpZ2luYWxFdmVudC5tZXRhS2V5KSAmJiB0aGlzLmVkaXRFbmFibGVkKCkpIHtcbiAgICAgIHRoaXMuZWRpdG9yLm5ld0hvbGUoZS5sYXRsbmcpO1xuICAgIH1cbiAgfSk7XG59KTtcblxuXG5mdW5jdGlvbiBydW4gKG1hcmdpbikge1xuICByZXN1bHRzLmNsZWFyTGF5ZXJzKCk7XG4gIGxheWVycy5lYWNoTGF5ZXIoZnVuY3Rpb24obGF5ZXIpIHtcbiAgICB2YXIgZ2ogPSBsYXllci50b0dlb0pTT04oKTtcbiAgICBjb25zb2xlLmxvZyhnaiwgbWFyZ2luKTtcbiAgICBpZiAobWFyZ2luID09PSAwKSByZXR1cm47XG4gICAgdmFyIHNoYXBlID0gcHJvamVjdChnaiwgZnVuY3Rpb24oY29vcmQpIHtcbiAgICAgIHZhciBwdCA9IG1hcC5vcHRpb25zLmNycy5sYXRMbmdUb1BvaW50KEwubGF0TG5nKGNvb3JkLnNsaWNlKCkucmV2ZXJzZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW3B0LngsIHB0LnldO1xuICAgIH0pO1xuXG4gICAgdmFyIG1hcmdpbmVkO1xuICAgIGlmIChnai5nZW9tZXRyeS50eXBlID09PSAnTGluZVN0cmluZycpIHtcbiAgICAgIGlmIChtYXJnaW4gPCAwKSByZXR1cm47XG4gICAgICB2YXIgcmVzID0gbmV3IE9mZnNldChzaGFwZS5nZW9tZXRyeS5jb29yZGluYXRlcykuYXJjU2VnbWVudHMoMTAwKS5vZmZzZXRMaW5lKG1hcmdpbik7XG4gICAgICBtYXJnaW5lZCA9IHtcbiAgICAgICAgdHlwZTogJ0ZlYXR1cmUnLFxuICAgICAgICBnZW9tZXRyeToge1xuICAgICAgICAgIHR5cGU6ICdQb2x5Z29uJyxcbiAgICAgICAgICBjb29yZGluYXRlczogcmVzXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfSBlbHNlIHtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzWzBdKS5vZmZzZXQobWFyZ2luKVxuICAgICAgICB9XG4gICAgICB9O1xuICAgIH1cblxuICAgIGNvbnNvbGUubG9nKCdtYXJnaW5lZCcsIG1hcmdpbmVkKTtcbiAgICByZXN1bHRzLmFkZERhdGEocHJvamVjdChtYXJnaW5lZCwgZnVuY3Rpb24ocHQpIHtcbiAgICAgIHZhciBsbCA9IG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocHQuc2xpY2UoKSksIG1hcC5nZXRab29tKCkpO1xuICAgICAgcmV0dXJuIFtsbC5sbmcsIGxsLmxhdF07XG4gICAgfSkpO1xuICB9KTtcbn1cblxuLy8gTC50aWxlTGF5ZXIoJ2h0dHA6Ly97c30udGlsZS5vc20ub3JnL3t6fS97eH0ve3l9LnBuZycsIHtcbi8vICAgYXR0cmlidXRpb246ICcmY29weTsgJyArXG4vLyAgICAgJzxhIGhyZWY9XCJodHRwOi8vb3NtLm9yZy9jb3B5cmlnaHRcIj5PcGVuU3RyZWV0TWFwPC9hPiBjb250cmlidXRvcnMnXG4vLyB9KS5hZGRUbyhtYXApO1xuXG4vLyBjb25zb2xlLmxvZyhwb2x5Z29uKTtcblxuLy8gZnVuY3Rpb24gcHJvamVjdChsbCkge1xuLy8gICB2YXIgcHQgPSBtYXAub3B0aW9ucy5jcnMubGF0TG5nVG9Qb2ludChMLmxhdExuZyhsbC5zbGljZSgpLnJldmVyc2UoKSksIG1hcC5nZXRab29tKCkpO1xuLy8gICByZXR1cm4gW3B0LngsIHB0LnldO1xuLy8gfVxuXG4vLyB2ZXJ0aWNlcyA9IHBvbHlnb24uZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0ubWFwKHByb2plY3QpO1xuXG4vLyBjb25zb2xlLnRpbWUoJ21hcmdpbicpO1xuLy8gcmVzdWx0ID0gbmV3IE9mZnNldCh2ZXJ0aWNlcykubWFyZ2luKDQwKTtcbi8vIGNvbnNvbGUudGltZUVuZCgnbWFyZ2luJyk7XG4vLyByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKHApIHtcbi8vICAgcmV0dXJuIG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocCksIG1hcC5nZXRab29tKCkpO1xuLy8gfSk7XG5cbi8vIEwucG9seWdvbihyZXN1bHQsIG1hcmdpblN0eWxlKS5hZGRUbyhtYXApO1xuLy8gY29uc29sZS50aW1lKCdwYWRkaW5nJyk7XG4vLyByZXN1bHQgPSBuZXcgT2Zmc2V0KHZlcnRpY2VzKS5wYWRkaW5nKDEwKTtcbi8vIGNvbnNvbGUudGltZUVuZCgncGFkZGluZycpO1xuLy8gcmVzdWx0ID0gcmVzdWx0Lm1hcChmdW5jdGlvbihwKSB7XG4vLyAgICAgcmV0dXJuIG1hcC5vcHRpb25zLmNycy5wb2ludFRvTGF0TG5nKEwucG9pbnQocCksIG1hcC5nZXRab29tKCkpO1xuLy8gfSk7XG5cbi8vIEwucG9seWdvbihyZXN1bHQsIHBhZGRpbmdTdHlsZSkuYWRkVG8obGF5ZXJzKTtcblxuLy8gdmFyIGxpbmVQb2ludHMgPSBkYXRhLmZlYXR1cmVzWzFdLmdlb21ldHJ5LmNvb3JkaW5hdGVzLm1hcChwcm9qZWN0KTtcbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW1WNFlXMXdiR1V2WVhCd0xtcHpJbDBzSW01aGJXVnpJanBiWFN3aWJXRndjR2x1WjNNaU9pSTdRVUZCUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRWlMQ0ptYVd4bElqb2laMlZ1WlhKaGRHVmtMbXB6SWl3aWMyOTFjbU5sVW05dmRDSTZJaUlzSW5OdmRYSmpaWE5EYjI1MFpXNTBJanBiSW5aaGNpQlBabVp6WlhRZ1BTQnlaWEYxYVhKbEtDY3VMaTl6Y21NdmIyWm1jMlYwSnlrN1hHNXlaWEYxYVhKbEtDY3VMMnhsWVdac1pYUmZiWFZzZEdsd2IyeDVaMjl1SnlrN1hHNXlaWEYxYVhKbEtDY3VMM0J2YkhsbmIyNWZZMjl1ZEhKdmJDY3BPMXh1ZG1GeUlFOW1abk5sZEVOdmJuUnliMndnUFNCeVpYRjFhWEpsS0NjdUwyOW1abk5sZEY5amIyNTBjbTlzSnlrN1hHNTJZWElnWkdGMFlTQTlJSEpsY1hWcGNtVW9KeTR1TDNSbGMzUXZabWw0ZEhWeVpYTXZjRzlzZVdkdmJsOXdiMng1YkdsdVpTNXFjMjl1SnlrN1hHNTJZWElnY0hKdmFtVmpkQ0E5SUhKbGNYVnBjbVVvSjJkbGIycHpiMjR0Y0hKdmFtVmpkQ2NwTzF4dVhHNTJZWElnYzNSNWJHVWdQU0I3WEc0Z0lDQWdJQ0FnSUhkbGFXZG9kRG9nTXl4Y2JpQWdJQ0FnSUNBZ1kyOXNiM0k2SUNjak5EaG1KeXhjYmlBZ0lDQWdJQ0FnYjNCaFkybDBlVG9nTUM0NExGeHVJQ0FnSUNBZ0lDQmtZWE5vUVhKeVlYazZJRnN5TENBMFhWeHVJQ0FnSUgwc1hHNGdJQ0FnYldGeVoybHVVM1I1YkdVZ1BTQjdYRzRnSUNBZ0lDQWdJSGRsYVdkb2REb2dNaXhjYmlBZ0lDQWdJQ0FnWTI5c2IzSTZJQ2NqTWpjMlJEaEdKMXh1SUNBZ0lIMHNYRzRnSUNBZ2NHRmtaR2x1WjFOMGVXeGxJRDBnZTF4dUlDQWdJQ0FnSUNCM1pXbG5hSFE2SURJc1hHNGdJQ0FnSUNBZ0lHTnZiRzl5T2lBbkkwUTRNVGN3TmlkY2JpQWdJQ0I5TEZ4dUlDQWdJR05sYm5SbGNpQTlJRnN5TWk0eU5qY3dMQ0F4TVRRdU1UZzRYU3hjYmlBZ0lDQjZiMjl0SUQwZ01UY3NYRzRnSUNBZ2JXRndMQ0IyWlhKMGFXTmxjeXdnY21WemRXeDBPMXh1WEc1dFlYQWdQU0JuYkc5aVlXd3ViV0Z3SUQwZ1RDNXRZWEFvSjIxaGNDY3NJSHRjYmlBZ1pXUnBkR0ZpYkdVNklIUnlkV1VzWEc0Z0lHMWhlRnB2YjIwNklESXlYRzU5S1M1elpYUldhV1YzS0dObGJuUmxjaXdnZW05dmJTazdYRzVjYmx4dWJXRndMbUZrWkVOdmJuUnliMndvYm1WM0lFd3VUbVYzVUc5c2VXZHZia052Ym5SeWIyd29lMXh1SUNCallXeHNZbUZqYXpvZ2JXRndMbVZrYVhSVWIyOXNjeTV6ZEdGeWRGQnZiSGxuYjI1Y2JuMHBLVHRjYmx4dWJXRndMbUZrWkVOdmJuUnliMndvYm1WM0lFd3VUbVYzVEdsdVpVTnZiblJ5YjJ3b2UxeHVJQ0JqWVd4c1ltRmphem9nYldGd0xtVmthWFJVYjI5c2N5NXpkR0Z5ZEZCdmJIbHNhVzVsWEc1OUtTazdYRzVjYm5aaGNpQnNZWGxsY25NZ1BTQm5iRzlpWVd3dWJHRjVaWEp6SUQwZ1RDNW5aVzlLYzI5dUtDa3VZV1JrVkc4b2JXRndLVHRjYm5aaGNpQnlaWE4xYkhSeklEMGdaMnh2WW1Gc0xuSmxjM1ZzZEhNZ1BTQk1MbWRsYjBwemIyNG9iblZzYkN3Z2UxeHVJQ0J6ZEhsc1pUb2dablZ1WTNScGIyNG9abVZoZEhWeVpTa2dlMXh1SUNBZ0lISmxkSFZ5YmlCdFlYSm5hVzVUZEhsc1pUdGNiaUFnZlZ4dWZTa3VZV1JrVkc4b2JXRndLVHRjYmx4dWJXRndMbUZrWkVOdmJuUnliMndvYm1WM0lFOW1abk5sZEVOdmJuUnliMndvZTF4dUlDQmpiR1ZoY2pvZ1puVnVZM1JwYjI0b0tTQjdYRzRnSUNBZ2JHRjVaWEp6TG1Oc1pXRnlUR0Y1WlhKektDazdYRzRnSUgwc1hHNGdJR05oYkd4aVlXTnJPaUJ5ZFc1Y2JuMHBLVHRjYmx4dWJXRndMbTl1S0NkbFpHbDBZV0pzWlRwamNtVmhkR1ZrSnl3Z1puVnVZM1JwYjI0b1pYWjBLU0I3WEc0Z0lHeGhlV1Z5Y3k1aFpHUk1ZWGxsY2lobGRuUXViR0Y1WlhJcE8xeHVJQ0JsZG5RdWJHRjVaWEl1YjI0b0oyTnNhV05ySnl3Z1puVnVZM1JwYjI0b1pTa2dlMXh1SUNBZ0lHbG1JQ2dvWlM1dmNtbG5hVzVoYkVWMlpXNTBMbU4wY214TFpYa2dmSHdnWlM1dmNtbG5hVzVoYkVWMlpXNTBMbTFsZEdGTFpYa3BJQ1ltSUhSb2FYTXVaV1JwZEVWdVlXSnNaV1FvS1NrZ2UxeHVJQ0FnSUNBZ2RHaHBjeTVsWkdsMGIzSXVibVYzU0c5c1pTaGxMbXhoZEd4dVp5azdYRzRnSUNBZ2ZWeHVJQ0I5S1R0Y2JuMHBPMXh1WEc1Y2JtWjFibU4wYVc5dUlISjFiaUFvYldGeVoybHVLU0I3WEc0Z0lISmxjM1ZzZEhNdVkyeGxZWEpNWVhsbGNuTW9LVHRjYmlBZ2JHRjVaWEp6TG1WaFkyaE1ZWGxsY2lobWRXNWpkR2x2Ymloc1lYbGxjaWtnZTF4dUlDQWdJSFpoY2lCbmFpQTlJR3hoZVdWeUxuUnZSMlZ2U2xOUFRpZ3BPMXh1SUNBZ0lHTnZibk52YkdVdWJHOW5LR2RxTENCdFlYSm5hVzRwTzF4dUlDQWdJR2xtSUNodFlYSm5hVzRnUFQwOUlEQXBJSEpsZEhWeWJqdGNiaUFnSUNCMllYSWdjMmhoY0dVZ1BTQndjbTlxWldOMEtHZHFMQ0JtZFc1amRHbHZiaWhqYjI5eVpDa2dlMXh1SUNBZ0lDQWdkbUZ5SUhCMElEMGdiV0Z3TG05d2RHbHZibk11WTNKekxteGhkRXh1WjFSdlVHOXBiblFvVEM1c1lYUk1ibWNvWTI5dmNtUXVjMnhwWTJVb0tTNXlaWFpsY25ObEtDa3BMQ0J0WVhBdVoyVjBXbTl2YlNncEtUdGNiaUFnSUNBZ0lISmxkSFZ5YmlCYmNIUXVlQ3dnY0hRdWVWMDdYRzRnSUNBZ2ZTazdYRzVjYmlBZ0lDQjJZWElnYldGeVoybHVaV1E3WEc0Z0lDQWdhV1lnS0dkcUxtZGxiMjFsZEhKNUxuUjVjR1VnUFQwOUlDZE1hVzVsVTNSeWFXNW5KeWtnZTF4dUlDQWdJQ0FnYVdZZ0tHMWhjbWRwYmlBOElEQXBJSEpsZEhWeWJqdGNiaUFnSUNBZ0lIWmhjaUJ5WlhNZ1BTQnVaWGNnVDJabWMyVjBLSE5vWVhCbExtZGxiMjFsZEhKNUxtTnZiM0prYVc1aGRHVnpLUzVoY21OVFpXZHRaVzUwY3lneE1EQXBMbTltWm5ObGRFeHBibVVvYldGeVoybHVLVHRjYmlBZ0lDQWdJRzFoY21kcGJtVmtJRDBnZTF4dUlDQWdJQ0FnSUNCMGVYQmxPaUFuUm1WaGRIVnlaU2NzWEc0Z0lDQWdJQ0FnSUdkbGIyMWxkSEo1T2lCN1hHNGdJQ0FnSUNBZ0lDQWdkSGx3WlRvZ0oxQnZiSGxuYjI0bkxGeHVJQ0FnSUNBZ0lDQWdJR052YjNKa2FXNWhkR1Z6T2lCeVpYTmNiaUFnSUNBZ0lDQWdmVnh1SUNBZ0lDQWdmVHRjYmlBZ0lDQjlJR1ZzYzJVZ2UxeHVJQ0FnSUNBZ2JXRnlaMmx1WldRZ1BTQjdYRzRnSUNBZ0lDQWdJSFI1Y0dVNklDZEdaV0YwZFhKbEp5eGNiaUFnSUNBZ0lDQWdaMlZ2YldWMGNuazZJSHRjYmlBZ0lDQWdJQ0FnSUNCMGVYQmxPaUFuVUc5c2VXZHZiaWNzWEc0Z0lDQWdJQ0FnSUNBZ1kyOXZjbVJwYm1GMFpYTTZJRzVsZHlCUFptWnpaWFFvYzJoaGNHVXVaMlZ2YldWMGNua3VZMjl2Y21ScGJtRjBaWE5iTUYwcExtOW1abk5sZENodFlYSm5hVzRwWEc0Z0lDQWdJQ0FnSUgxY2JpQWdJQ0FnSUgwN1hHNGdJQ0FnZlZ4dVhHNGdJQ0FnWTI5dWMyOXNaUzVzYjJjb0oyMWhjbWRwYm1Wa0p5d2diV0Z5WjJsdVpXUXBPMXh1SUNBZ0lISmxjM1ZzZEhNdVlXUmtSR0YwWVNod2NtOXFaV04wS0cxaGNtZHBibVZrTENCbWRXNWpkR2x2Ymlod2RDa2dlMXh1SUNBZ0lDQWdkbUZ5SUd4c0lEMGdiV0Z3TG05d2RHbHZibk11WTNKekxuQnZhVzUwVkc5TVlYUk1ibWNvVEM1d2IybHVkQ2h3ZEM1emJHbGpaU2dwS1N3Z2JXRndMbWRsZEZwdmIyMG9LU2s3WEc0Z0lDQWdJQ0J5WlhSMWNtNGdXMnhzTG14dVp5d2diR3d1YkdGMFhUdGNiaUFnSUNCOUtTazdYRzRnSUgwcE8xeHVmVnh1WEc0dkx5Qk1MblJwYkdWTVlYbGxjaWduYUhSMGNEb3ZMM3R6ZlM1MGFXeGxMbTl6YlM1dmNtY3ZlM3A5TDN0NGZTOTdlWDB1Y0c1bkp5d2dlMXh1THk4Z0lDQmhkSFJ5YVdKMWRHbHZiam9nSnlaamIzQjVPeUFuSUN0Y2JpOHZJQ0FnSUNBblBHRWdhSEpsWmoxY0ltaDBkSEE2THk5dmMyMHViM0puTDJOdmNIbHlhV2RvZEZ3aVBrOXdaVzVUZEhKbFpYUk5ZWEE4TDJFK0lHTnZiblJ5YVdKMWRHOXljeWRjYmk4dklIMHBMbUZrWkZSdktHMWhjQ2s3WEc1Y2JpOHZJR052Ym5OdmJHVXViRzluS0hCdmJIbG5iMjRwTzF4dVhHNHZMeUJtZFc1amRHbHZiaUJ3Y205cVpXTjBLR3hzS1NCN1hHNHZMeUFnSUhaaGNpQndkQ0E5SUcxaGNDNXZjSFJwYjI1ekxtTnljeTVzWVhSTWJtZFViMUJ2YVc1MEtFd3ViR0YwVEc1bktHeHNMbk5zYVdObEtDa3VjbVYyWlhKelpTZ3BLU3dnYldGd0xtZGxkRnB2YjIwb0tTazdYRzR2THlBZ0lISmxkSFZ5YmlCYmNIUXVlQ3dnY0hRdWVWMDdYRzR2THlCOVhHNWNiaTh2SUhabGNuUnBZMlZ6SUQwZ2NHOXNlV2R2Ymk1blpXOXRaWFJ5ZVM1amIyOXlaR2x1WVhSbGMxc3dYUzV0WVhBb2NISnZhbVZqZENrN1hHNWNiaTh2SUdOdmJuTnZiR1V1ZEdsdFpTZ25iV0Z5WjJsdUp5azdYRzR2THlCeVpYTjFiSFFnUFNCdVpYY2dUMlptYzJWMEtIWmxjblJwWTJWektTNXRZWEpuYVc0b05EQXBPMXh1THk4Z1kyOXVjMjlzWlM1MGFXMWxSVzVrS0NkdFlYSm5hVzRuS1R0Y2JpOHZJSEpsYzNWc2RDQTlJSEpsYzNWc2RDNXRZWEFvWm5WdVkzUnBiMjRvY0NrZ2UxeHVMeThnSUNCeVpYUjFjbTRnYldGd0xtOXdkR2x2Ym5NdVkzSnpMbkJ2YVc1MFZHOU1ZWFJNYm1jb1RDNXdiMmx1ZENod0tTd2diV0Z3TG1kbGRGcHZiMjBvS1NrN1hHNHZMeUI5S1R0Y2JseHVMeThnVEM1d2IyeDVaMjl1S0hKbGMzVnNkQ3dnYldGeVoybHVVM1I1YkdVcExtRmtaRlJ2S0cxaGNDazdYRzR2THlCamIyNXpiMnhsTG5ScGJXVW9KM0JoWkdScGJtY25LVHRjYmk4dklISmxjM1ZzZENBOUlHNWxkeUJQWm1aelpYUW9kbVZ5ZEdsalpYTXBMbkJoWkdScGJtY29NVEFwTzF4dUx5OGdZMjl1YzI5c1pTNTBhVzFsUlc1a0tDZHdZV1JrYVc1bkp5azdYRzR2THlCeVpYTjFiSFFnUFNCeVpYTjFiSFF1YldGd0tHWjFibU4wYVc5dUtIQXBJSHRjYmk4dklDQWdJQ0J5WlhSMWNtNGdiV0Z3TG05d2RHbHZibk11WTNKekxuQnZhVzUwVkc5TVlYUk1ibWNvVEM1d2IybHVkQ2h3S1N3Z2JXRndMbWRsZEZwdmIyMG9LU2s3WEc0dkx5QjlLVHRjYmx4dUx5OGdUQzV3YjJ4NVoyOXVLSEpsYzNWc2RDd2djR0ZrWkdsdVoxTjBlV3hsS1M1aFpHUlVieWhzWVhsbGNuTXBPMXh1WEc0dkx5QjJZWElnYkdsdVpWQnZhVzUwY3lBOUlHUmhkR0V1Wm1WaGRIVnlaWE5iTVYwdVoyVnZiV1YwY25rdVkyOXZjbVJwYm1GMFpYTXViV0Z3S0hCeWIycGxZM1FwT3lKZGZRPT0iLCJMLlBvbHlnb24ucHJvdG90eXBlLl9wcm9qZWN0TGF0bG5ncyA9IGZ1bmN0aW9uIChsYXRsbmdzLCByZXN1bHQsIHByb2plY3RlZEJvdW5kcywgaXNIb2xlKSB7XG4gIHZhciBmbGF0ID0gbGF0bG5nc1swXSBpbnN0YW5jZW9mIEwuTGF0TG5nLFxuICAgICAgbGVuID0gbGF0bG5ncy5sZW5ndGgsXG4gICAgICBpLCByaW5nLCBhcmVhO1xuXG4gIGlmIChmbGF0KSB7XG4gICAgYXJlYSA9IDA7XG4gICAgcmluZyA9IFtdO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgcmluZ1tpXSA9IHRoaXMuX21hcC5sYXRMbmdUb0xheWVyUG9pbnQobGF0bG5nc1tpXSk7XG4gICAgICBwcm9qZWN0ZWRCb3VuZHMuZXh0ZW5kKHJpbmdbaV0pO1xuXG4gICAgICBpZiAoaSkge1xuICAgICAgICBhcmVhICs9IHJpbmdbaSAtIDFdLnggKiByaW5nW2ldLnk7XG4gICAgICAgIGFyZWEgLT0gcmluZ1tpXS54ICogcmluZ1tpIC0gMV0ueTtcbiAgICAgIH1cbiAgICB9XG4gICAgYXJlYSArPSByaW5nW2xlbiAtIDFdLnggKiByaW5nWzBdLnk7XG4gICAgYXJlYSAtPSByaW5nWzBdLnggKiByaW5nW2xlbiAtIDFdLnk7XG5cbiAgICBpZiAoKCFpc0hvbGUgJiYgYXJlYSA+IDApIHx8IChpc0hvbGUgJiYgYXJlYSA8IDApKSB7XG4gICAgICByaW5nLnJldmVyc2UoKTtcbiAgICB9XG5cbiAgICByZXN1bHQucHVzaChyaW5nKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGkgPSAwOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHRoaXMuX3Byb2plY3RMYXRsbmdzKGxhdGxuZ3NbaV0sIHJlc3VsdCwgcHJvamVjdGVkQm91bmRzLCBpICE9PSAwKTtcbiAgICB9XG4gIH1cbn07XG5cblxuTC5Qb2x5Z29uLnByb3RvdHlwZS5fcHJvamVjdCA9IGZ1bmN0aW9uKCkge1xuICBMLlBvbHlsaW5lLnByb3RvdHlwZS5fcHJvamVjdC5jYWxsKHRoaXMpO1xuICBpZiAoKHRoaXMuX2xhdGxuZ3MubGVuZ3RoID4gMSkgJiZcbiAgICAhTC5Qb2x5bGluZS5fZmxhdCh0aGlzLl9sYXRsbmdzKSAmJlxuICAgICEodGhpcy5fbGF0bG5nc1swXVswXSBpbnN0YW5jZW9mIEwuTGF0TG5nKSkge1xuICAgIGlmICh0aGlzLm9wdGlvbnMuZmlsbFJ1bGUgIT09ICdub256ZXJvJykge1xuICAgICAgdGhpcy5zZXRTdHlsZSh7XG4gICAgICAgIGZpbGxSdWxlOiAnbm9uemVybydcbiAgICAgIH0pO1xuICAgIH1cbiAgfVxufTsiLCJtb2R1bGUuZXhwb3J0cyA9IEwuQ29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3ByaWdodCcsXG4gICAgZGVmYXVsdE1hcmdpbjogMjBcbiAgfSxcblxuICBvbkFkZDogZnVuY3Rpb24obWFwKSB7XG4gICAgdmFyIGNvbnRhaW5lciA9IHRoaXMuX2NvbnRhaW5lciA9IEwuRG9tVXRpbC5jcmVhdGUoJ2RpdicsICdsZWFmbGV0LWJhcicpO1xuICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5iYWNrZ3JvdW5kID0gJyNmZmZmZmYnO1xuICAgIHRoaXMuX2NvbnRhaW5lci5zdHlsZS5wYWRkaW5nID0gJzEwcHgnO1xuICAgIGNvbnRhaW5lci5pbm5lckhUTUwgPSBbXG4gICAgICAnPGZvcm0+JyxcbiAgICAgICAgJzxkaXY+JyxcbiAgICAgICAgICAnPGxhYmVsPicsXG4gICAgICAgICAgICAnPGlucHV0IHR5cGU9XCJyYW5nZVwiIG1pbj1cIjBcIiBtYXg9XCIxMDBcIiB2YWx1ZT1cIicsICB0aGlzLm9wdGlvbnMuZGVmYXVsdE1hcmdpbiwgJ1wiIG5hbWU9XCJtYXJnaW5cIj4nLFxuICAgICAgICAgICc8L2xhYmVsPicsXG4gICAgICAgICc8L2Rpdj4nLFxuICAgICAgICAnPGRpdj4nLFxuICAgICAgICAgICc8bGFiZWw+JywgJzxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwib3BlcmF0aW9uXCIgdmFsdWU9XCIxXCIgY2hlY2tlZD4nLCAnIG1hcmdpbjwvbGFiZWw+JyxcbiAgICAgICAgICAnPGxhYmVsPicsICc8aW5wdXQgdHlwZT1cInJhZGlvXCIgbmFtZT1cIm9wZXJhdGlvblwiIHZhbHVlPVwiLTFcIj4nLCAnIHBhZGRpbmc8L2xhYmVsPicsXG4gICAgICAgICc8L2Rpdj4nLCAnPGJyPicsXG4gICAgICAgICc8aW5wdXQgdHlwZT1cInN1Ym1pdFwiIHZhbHVlPVwiUnVuXCI+JywgJzxpbnB1dCBuYW1lPVwiY2xlYXJcIiB0eXBlPVwiYnV0dG9uXCIgdmFsdWU9XCJDbGVhciBsYXllcnNcIj4nLFxuICAgICAgJzwvZm9ybT4nXS5qb2luKCcnKTtcbiAgICB2YXIgZm9ybSA9IGNvbnRhaW5lci5xdWVyeVNlbGVjdG9yKCdmb3JtJyk7XG4gICAgTC5Eb21FdmVudFxuICAgICAgLm9uKGZvcm0sICdzdWJtaXQnLCBmdW5jdGlvbiAoZXZ0KSB7XG4gICAgICAgIEwuRG9tRXZlbnQuc3RvcChldnQpO1xuICAgICAgICB2YXIgbWFyZ2luID0gcGFyc2VGbG9hdChmb3JtWydtYXJnaW4nXS52YWx1ZSk7XG4gICAgICAgIHZhciByYWRpb3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChcbiAgICAgICAgICBmb3JtLnF1ZXJ5U2VsZWN0b3JBbGwoJ2lucHV0W3R5cGU9cmFkaW9dJykpO1xuICAgICAgICB2YXIgayA9IDE7XG4gICAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSByYWRpb3MubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgICBpZiAocmFkaW9zW2ldLmNoZWNrZWQpIHtcbiAgICAgICAgICAgIGsgKj0gcGFyc2VJbnQocmFkaW9zW2ldLnZhbHVlKTtcbiAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9wdGlvbnMuY2FsbGJhY2sobWFyZ2luICogayk7XG4gICAgICB9LCB0aGlzKVxuICAgICAgLm9uKGZvcm1bJ2NsZWFyJ10sICdjbGljaycsIGZ1bmN0aW9uKGV2dCkge1xuICAgICAgICBMLkRvbUV2ZW50LnN0b3AoZXZ0KTtcbiAgICAgICAgdGhpcy5vcHRpb25zLmNsZWFyKCk7XG4gICAgICB9LCB0aGlzKTtcblxuICAgIEwuRG9tRXZlbnRcbiAgICAgIC5kaXNhYmxlQ2xpY2tQcm9wYWdhdGlvbih0aGlzLl9jb250YWluZXIpXG4gICAgICAuZGlzYWJsZVNjcm9sbFByb3BhZ2F0aW9uKHRoaXMuX2NvbnRhaW5lcik7XG4gICAgcmV0dXJuIHRoaXMuX2NvbnRhaW5lcjtcbiAgfVxuXG59KTsiLCJMLkVkaXRDb250cm9sID0gTC5Db250cm9sLmV4dGVuZCh7XG5cbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAgY2FsbGJhY2s6IG51bGwsXG4gICAga2luZDogJycsXG4gICAgaHRtbDogJydcbiAgfSxcblxuICBvbkFkZDogZnVuY3Rpb24gKG1hcCkge1xuICAgIHZhciBjb250YWluZXIgPSBMLkRvbVV0aWwuY3JlYXRlKCdkaXYnLCAnbGVhZmxldC1jb250cm9sIGxlYWZsZXQtYmFyJyksXG4gICAgICAgIGxpbmsgPSBMLkRvbVV0aWwuY3JlYXRlKCdhJywgJycsIGNvbnRhaW5lcik7XG5cbiAgICBsaW5rLmhyZWYgPSAnIyc7XG4gICAgbGluay50aXRsZSA9ICdDcmVhdGUgYSBuZXcgJyArIHRoaXMub3B0aW9ucy5raW5kO1xuICAgIGxpbmsuaW5uZXJIVE1MID0gdGhpcy5vcHRpb25zLmh0bWw7XG4gICAgTC5Eb21FdmVudC5vbihsaW5rLCAnY2xpY2snLCBMLkRvbUV2ZW50LnN0b3ApXG4gICAgICAgICAgICAgIC5vbihsaW5rLCAnY2xpY2snLCBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICAgICAgd2luZG93LkxBWUVSID0gdGhpcy5vcHRpb25zLmNhbGxiYWNrLmNhbGwobWFwLmVkaXRUb29scyk7XG4gICAgICAgICAgICAgIH0sIHRoaXMpO1xuXG4gICAgcmV0dXJuIGNvbnRhaW5lcjtcbiAgfVxuXG59KTtcblxuTC5OZXdQb2x5Z29uQ29udHJvbCA9IEwuRWRpdENvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAga2luZDogJ3BvbHlnb24nLFxuICAgIGh0bWw6ICfilrAnXG4gIH1cbn0pO1xuXG5MLk5ld0xpbmVDb250cm9sID0gTC5FZGl0Q29udHJvbC5leHRlbmQoe1xuICBvcHRpb25zOiB7XG4gICAgcG9zaXRpb246ICd0b3BsZWZ0JyxcbiAgICBraW5kOiAncG9seWxpbmUnLFxuICAgIGh0bWw6ICcvJ1xuICB9XG59KTsiLCJtb2R1bGUuZXhwb3J0cyA9IHtcbiAgICBSQlRyZWU6IHJlcXVpcmUoJy4vbGliL3JidHJlZScpLFxuICAgIEJpblRyZWU6IHJlcXVpcmUoJy4vbGliL2JpbnRyZWUnKVxufTtcbiIsIlxudmFyIFRyZWVCYXNlID0gcmVxdWlyZSgnLi90cmVlYmFzZScpO1xuXG5mdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMubGVmdCA9IG51bGw7XG4gICAgdGhpcy5yaWdodCA9IG51bGw7XG59XG5cbk5vZGUucHJvdG90eXBlLmdldF9jaGlsZCA9IGZ1bmN0aW9uKGRpcikge1xuICAgIHJldHVybiBkaXIgPyB0aGlzLnJpZ2h0IDogdGhpcy5sZWZ0O1xufTtcblxuTm9kZS5wcm90b3R5cGUuc2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyLCB2YWwpIHtcbiAgICBpZihkaXIpIHtcbiAgICAgICAgdGhpcy5yaWdodCA9IHZhbDtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHRoaXMubGVmdCA9IHZhbDtcbiAgICB9XG59O1xuXG5mdW5jdGlvbiBCaW5UcmVlKGNvbXBhcmF0b3IpIHtcbiAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgICB0aGlzLnNpemUgPSAwO1xufVxuXG5CaW5UcmVlLnByb3RvdHlwZSA9IG5ldyBUcmVlQmFzZSgpO1xuXG4vLyByZXR1cm5zIHRydWUgaWYgaW5zZXJ0ZWQsIGZhbHNlIGlmIGR1cGxpY2F0ZVxuQmluVHJlZS5wcm90b3R5cGUuaW5zZXJ0ID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgLy8gZW1wdHkgdHJlZVxuICAgICAgICB0aGlzLl9yb290ID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICB2YXIgZGlyID0gMDtcblxuICAgIC8vIHNldHVwXG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgbm9kZSA9IHRoaXMuX3Jvb3Q7XG5cbiAgICAvLyBzZWFyY2ggZG93blxuICAgIHdoaWxlKHRydWUpIHtcbiAgICAgICAgaWYobm9kZSA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gaW5zZXJ0IG5ldyBub2RlIGF0IHRoZSBib3R0b21cbiAgICAgICAgICAgIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgICAgIHAuc2V0X2NoaWxkKGRpciwgbm9kZSk7XG4gICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHN0b3AgaWYgZm91bmRcbiAgICAgICAgaWYodGhpcy5fY29tcGFyYXRvcihub2RlLmRhdGEsIGRhdGEpID09PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICBkaXIgPSB0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSkgPCAwO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBoZWxwZXJzXG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcbiAgICB9XG59O1xuXG4vLyByZXR1cm5zIHRydWUgaWYgcmVtb3ZlZCwgZmFsc2UgaWYgbm90IGZvdW5kXG5CaW5UcmVlLnByb3RvdHlwZS5yZW1vdmUgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgdmFyIGhlYWQgPSBuZXcgTm9kZSh1bmRlZmluZWQpOyAvLyBmYWtlIHRyZWUgcm9vdFxuICAgIHZhciBub2RlID0gaGVhZDtcbiAgICBub2RlLnJpZ2h0ID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgcCA9IG51bGw7IC8vIHBhcmVudFxuICAgIHZhciBmb3VuZCA9IG51bGw7IC8vIGZvdW5kIGl0ZW1cbiAgICB2YXIgZGlyID0gMTtcblxuICAgIHdoaWxlKG5vZGUuZ2V0X2NoaWxkKGRpcikgIT09IG51bGwpIHtcbiAgICAgICAgcCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCBub2RlLmRhdGEpO1xuICAgICAgICBkaXIgPSBjbXAgPiAwO1xuXG4gICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgZm91bmQgPSBub2RlO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgaWYoZm91bmQgIT09IG51bGwpIHtcbiAgICAgICAgZm91bmQuZGF0YSA9IG5vZGUuZGF0YTtcbiAgICAgICAgcC5zZXRfY2hpbGQocC5yaWdodCA9PT0gbm9kZSwgbm9kZS5nZXRfY2hpbGQobm9kZS5sZWZ0ID09PSBudWxsKSk7XG5cbiAgICAgICAgdGhpcy5fcm9vdCA9IGhlYWQucmlnaHQ7XG4gICAgICAgIHRoaXMuc2l6ZS0tO1xuICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEJpblRyZWU7XG5cbiIsIlxudmFyIFRyZWVCYXNlID0gcmVxdWlyZSgnLi90cmVlYmFzZScpO1xuXG5mdW5jdGlvbiBOb2RlKGRhdGEpIHtcbiAgICB0aGlzLmRhdGEgPSBkYXRhO1xuICAgIHRoaXMubGVmdCA9IG51bGw7XG4gICAgdGhpcy5yaWdodCA9IG51bGw7XG4gICAgdGhpcy5yZWQgPSB0cnVlO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIpIHtcbiAgICByZXR1cm4gZGlyID8gdGhpcy5yaWdodCA6IHRoaXMubGVmdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldF9jaGlsZCA9IGZ1bmN0aW9uKGRpciwgdmFsKSB7XG4gICAgaWYoZGlyKSB7XG4gICAgICAgIHRoaXMucmlnaHQgPSB2YWw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmxlZnQgPSB2YWw7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gUkJUcmVlKGNvbXBhcmF0b3IpIHtcbiAgICB0aGlzLl9yb290ID0gbnVsbDtcbiAgICB0aGlzLl9jb21wYXJhdG9yID0gY29tcGFyYXRvcjtcbiAgICB0aGlzLnNpemUgPSAwO1xufVxuXG5SQlRyZWUucHJvdG90eXBlID0gbmV3IFRyZWVCYXNlKCk7XG5cbi8vIHJldHVybnMgdHJ1ZSBpZiBpbnNlcnRlZCwgZmFsc2UgaWYgZHVwbGljYXRlXG5SQlRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmV0ID0gZmFsc2U7XG5cbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGVtcHR5IHRyZWVcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcblxuICAgICAgICB2YXIgZGlyID0gMDtcbiAgICAgICAgdmFyIGxhc3QgPSAwO1xuXG4gICAgICAgIC8vIHNldHVwXG4gICAgICAgIHZhciBncCA9IG51bGw7IC8vIGdyYW5kcGFyZW50XG4gICAgICAgIHZhciBnZ3AgPSBoZWFkOyAvLyBncmFuZC1ncmFuZC1wYXJlbnRcbiAgICAgICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICAgICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuICAgICAgICBnZ3AucmlnaHQgPSB0aGlzLl9yb290O1xuXG4gICAgICAgIC8vIHNlYXJjaCBkb3duXG4gICAgICAgIHdoaWxlKHRydWUpIHtcbiAgICAgICAgICAgIGlmKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAvLyBpbnNlcnQgbmV3IG5vZGUgYXQgdGhlIGJvdHRvbVxuICAgICAgICAgICAgICAgIG5vZGUgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgICAgICAgICBwLnNldF9jaGlsZChkaXIsIG5vZGUpO1xuICAgICAgICAgICAgICAgIHJldCA9IHRydWU7XG4gICAgICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBlbHNlIGlmKGlzX3JlZChub2RlLmxlZnQpICYmIGlzX3JlZChub2RlLnJpZ2h0KSkge1xuICAgICAgICAgICAgICAgIC8vIGNvbG9yIGZsaXBcbiAgICAgICAgICAgICAgICBub2RlLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgbm9kZS5sZWZ0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgIG5vZGUucmlnaHQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIC8vIGZpeCByZWQgdmlvbGF0aW9uXG4gICAgICAgICAgICBpZihpc19yZWQobm9kZSkgJiYgaXNfcmVkKHApKSB7XG4gICAgICAgICAgICAgICAgdmFyIGRpcjIgPSBnZ3AucmlnaHQgPT09IGdwO1xuXG4gICAgICAgICAgICAgICAgaWYobm9kZSA9PT0gcC5nZXRfY2hpbGQobGFzdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgZ2dwLnNldF9jaGlsZChkaXIyLCBzaW5nbGVfcm90YXRlKGdwLCAhbGFzdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgZ2dwLnNldF9jaGlsZChkaXIyLCBkb3VibGVfcm90YXRlKGdwLCAhbGFzdCkpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3Iobm9kZS5kYXRhLCBkYXRhKTtcblxuICAgICAgICAgICAgLy8gc3RvcCBpZiBmb3VuZFxuICAgICAgICAgICAgaWYoY21wID09PSAwKSB7XG4gICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGxhc3QgPSBkaXI7XG4gICAgICAgICAgICBkaXIgPSBjbXAgPCAwO1xuXG4gICAgICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICAgICAgaWYoZ3AgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICBnZ3AgPSBncDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGdwID0gcDtcbiAgICAgICAgICAgIHAgPSBub2RlO1xuICAgICAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB1cGRhdGUgcm9vdFxuICAgICAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcbiAgICB9XG5cbiAgICAvLyBtYWtlIHJvb3QgYmxhY2tcbiAgICB0aGlzLl9yb290LnJlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHJldDtcbn07XG5cbi8vIHJldHVybnMgdHJ1ZSBpZiByZW1vdmVkLCBmYWxzZSBpZiBub3QgZm91bmRcblJCVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcbiAgICB2YXIgbm9kZSA9IGhlYWQ7XG4gICAgbm9kZS5yaWdodCA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgZ3AgPSBudWxsOyAvLyBncmFuZCBwYXJlbnRcbiAgICB2YXIgZm91bmQgPSBudWxsOyAvLyBmb3VuZCBpdGVtXG4gICAgdmFyIGRpciA9IDE7XG5cbiAgICB3aGlsZShub2RlLmdldF9jaGlsZChkaXIpICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBsYXN0ID0gZGlyO1xuXG4gICAgICAgIC8vIHVwZGF0ZSBoZWxwZXJzXG4gICAgICAgIGdwID0gcDtcbiAgICAgICAgcCA9IG5vZGU7XG4gICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuXG4gICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIG5vZGUuZGF0YSk7XG5cbiAgICAgICAgZGlyID0gY21wID4gMDtcblxuICAgICAgICAvLyBzYXZlIGZvdW5kIG5vZGVcbiAgICAgICAgaWYoY21wID09PSAwKSB7XG4gICAgICAgICAgICBmb3VuZCA9IG5vZGU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwdXNoIHRoZSByZWQgbm9kZSBkb3duXG4gICAgICAgIGlmKCFpc19yZWQobm9kZSkgJiYgIWlzX3JlZChub2RlLmdldF9jaGlsZChkaXIpKSkge1xuICAgICAgICAgICAgaWYoaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKCFkaXIpKSkge1xuICAgICAgICAgICAgICAgIHZhciBzciA9IHNpbmdsZV9yb3RhdGUobm9kZSwgZGlyKTtcbiAgICAgICAgICAgICAgICBwLnNldF9jaGlsZChsYXN0LCBzcik7XG4gICAgICAgICAgICAgICAgcCA9IHNyO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZighaXNfcmVkKG5vZGUuZ2V0X2NoaWxkKCFkaXIpKSkge1xuICAgICAgICAgICAgICAgIHZhciBzaWJsaW5nID0gcC5nZXRfY2hpbGQoIWxhc3QpO1xuICAgICAgICAgICAgICAgIGlmKHNpYmxpbmcgIT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYoIWlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpICYmICFpc19yZWQoc2libGluZy5nZXRfY2hpbGQobGFzdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBjb2xvciBmbGlwXG4gICAgICAgICAgICAgICAgICAgICAgICBwLnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgICAgICAgICAgICAgc2libGluZy5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGRpcjIgPSBncC5yaWdodCA9PT0gcDtcblxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKGxhc3QpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdwLnNldF9jaGlsZChkaXIyLCBkb3VibGVfcm90YXRlKHAsIGxhc3QpKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGVsc2UgaWYoaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKCFsYXN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncC5zZXRfY2hpbGQoZGlyMiwgc2luZ2xlX3JvdGF0ZShwLCBsYXN0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIC8vIGVuc3VyZSBjb3JyZWN0IGNvbG9yaW5nXG4gICAgICAgICAgICAgICAgICAgICAgICB2YXIgZ3BjID0gZ3AuZ2V0X2NoaWxkKGRpcjIpO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBub2RlLnJlZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBncGMubGVmdC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5yaWdodC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH1cblxuICAgIC8vIHJlcGxhY2UgYW5kIHJlbW92ZSBpZiBmb3VuZFxuICAgIGlmKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgIGZvdW5kLmRhdGEgPSBub2RlLmRhdGE7XG4gICAgICAgIHAuc2V0X2NoaWxkKHAucmlnaHQgPT09IG5vZGUsIG5vZGUuZ2V0X2NoaWxkKG5vZGUubGVmdCA9PT0gbnVsbCkpO1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICB9XG5cbiAgICAvLyB1cGRhdGUgcm9vdCBhbmQgbWFrZSBpdCBibGFja1xuICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xuICAgIGlmKHRoaXMuX3Jvb3QgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fcm9vdC5yZWQgPSBmYWxzZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZm91bmQgIT09IG51bGw7XG59O1xuXG5mdW5jdGlvbiBpc19yZWQobm9kZSkge1xuICAgIHJldHVybiBub2RlICE9PSBudWxsICYmIG5vZGUucmVkO1xufVxuXG5mdW5jdGlvbiBzaW5nbGVfcm90YXRlKHJvb3QsIGRpcikge1xuICAgIHZhciBzYXZlID0gcm9vdC5nZXRfY2hpbGQoIWRpcik7XG5cbiAgICByb290LnNldF9jaGlsZCghZGlyLCBzYXZlLmdldF9jaGlsZChkaXIpKTtcbiAgICBzYXZlLnNldF9jaGlsZChkaXIsIHJvb3QpO1xuXG4gICAgcm9vdC5yZWQgPSB0cnVlO1xuICAgIHNhdmUucmVkID0gZmFsc2U7XG5cbiAgICByZXR1cm4gc2F2ZTtcbn1cblxuZnVuY3Rpb24gZG91YmxlX3JvdGF0ZShyb290LCBkaXIpIHtcbiAgICByb290LnNldF9jaGlsZCghZGlyLCBzaW5nbGVfcm90YXRlKHJvb3QuZ2V0X2NoaWxkKCFkaXIpLCAhZGlyKSk7XG4gICAgcmV0dXJuIHNpbmdsZV9yb3RhdGUocm9vdCwgZGlyKTtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSBSQlRyZWU7XG4iLCJcbmZ1bmN0aW9uIFRyZWVCYXNlKCkge31cblxuLy8gcmVtb3ZlcyBhbGwgbm9kZXMgZnJvbSB0aGUgdHJlZVxuVHJlZUJhc2UucHJvdG90eXBlLmNsZWFyID0gZnVuY3Rpb24oKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5zaXplID0gMDtcbn07XG5cbi8vIHJldHVybnMgbm9kZSBkYXRhIGlmIGZvdW5kLCBudWxsIG90aGVyd2lzZVxuVHJlZUJhc2UucHJvdG90eXBlLmZpbmQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG5cbiAgICB3aGlsZShyZXMgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIHJlcy5kYXRhKTtcbiAgICAgICAgaWYoYyA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHJlcy5kYXRhO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgcmVzID0gcmVzLmdldF9jaGlsZChjID4gMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIHJldHVybnMgaXRlcmF0b3IgdG8gbm9kZSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2VcblRyZWVCYXNlLnByb3RvdHlwZS5maW5kSXRlciA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgaXRlciA9IHRoaXMuaXRlcmF0b3IoKTtcblxuICAgIHdoaWxlKHJlcyAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgYyA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgcmVzLmRhdGEpO1xuICAgICAgICBpZihjID09PSAwKSB7XG4gICAgICAgICAgICBpdGVyLl9jdXJzb3IgPSByZXM7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5wdXNoKHJlcyk7XG4gICAgICAgICAgICByZXMgPSByZXMuZ2V0X2NoaWxkKGMgPiAwKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBudWxsO1xufTtcblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciB0byB0aGUgdHJlZSBub2RlIGF0IG9yIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBpdGVtXG5UcmVlQmFzZS5wcm90b3R5cGUubG93ZXJCb3VuZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgY3VyID0gdGhpcy5fcm9vdDtcbiAgICB2YXIgaXRlciA9IHRoaXMuaXRlcmF0b3IoKTtcbiAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgIHdoaWxlKGN1ciAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgYyA9IGNtcChpdGVtLCBjdXIuZGF0YSk7XG4gICAgICAgIGlmKGMgPT09IDApIHtcbiAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IGN1cjtcbiAgICAgICAgICAgIHJldHVybiBpdGVyO1xuICAgICAgICB9XG4gICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5wdXNoKGN1cik7XG4gICAgICAgIGN1ciA9IGN1ci5nZXRfY2hpbGQoYyA+IDApO1xuICAgIH1cblxuICAgIGZvcih2YXIgaT1pdGVyLl9hbmNlc3RvcnMubGVuZ3RoIC0gMTsgaSA+PSAwOyAtLWkpIHtcbiAgICAgICAgY3VyID0gaXRlci5fYW5jZXN0b3JzW2ldO1xuICAgICAgICBpZihjbXAoaXRlbSwgY3VyLmRhdGEpIDwgMCkge1xuICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gY3VyO1xuICAgICAgICAgICAgaXRlci5fYW5jZXN0b3JzLmxlbmd0aCA9IGk7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggPSAwO1xuICAgIHJldHVybiBpdGVyO1xufTtcblxuLy8gUmV0dXJucyBhbiBpdGVyYXRvciB0byB0aGUgdHJlZSBub2RlIGltbWVkaWF0ZWx5IGFmdGVyIHRoZSBpdGVtXG5UcmVlQmFzZS5wcm90b3R5cGUudXBwZXJCb3VuZCA9IGZ1bmN0aW9uKGl0ZW0pIHtcbiAgICB2YXIgaXRlciA9IHRoaXMubG93ZXJCb3VuZChpdGVtKTtcbiAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcjtcblxuICAgIHdoaWxlKGl0ZXIuZGF0YSgpICE9PSBudWxsICYmIGNtcChpdGVyLmRhdGEoKSwgaXRlbSkgPT09IDApIHtcbiAgICAgICAgaXRlci5uZXh0KCk7XG4gICAgfVxuXG4gICAgcmV0dXJuIGl0ZXI7XG59O1xuXG4vLyByZXR1cm5zIG51bGwgaWYgdHJlZSBpcyBlbXB0eVxuVHJlZUJhc2UucHJvdG90eXBlLm1pbiA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuICAgIGlmKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB3aGlsZShyZXMubGVmdCAhPT0gbnVsbCkge1xuICAgICAgICByZXMgPSByZXMubGVmdDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLmRhdGE7XG59O1xuXG4vLyByZXR1cm5zIG51bGwgaWYgdHJlZSBpcyBlbXB0eVxuVHJlZUJhc2UucHJvdG90eXBlLm1heCA9IGZ1bmN0aW9uKCkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuICAgIGlmKHJlcyA9PT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG5cbiAgICB3aGlsZShyZXMucmlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgcmVzID0gcmVzLnJpZ2h0O1xuICAgIH1cblxuICAgIHJldHVybiByZXMuZGF0YTtcbn07XG5cbi8vIHJldHVybnMgYSBudWxsIGl0ZXJhdG9yXG4vLyBjYWxsIG5leHQoKSBvciBwcmV2KCkgdG8gcG9pbnQgdG8gYW4gZWxlbWVudFxuVHJlZUJhc2UucHJvdG90eXBlLml0ZXJhdG9yID0gZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIG5ldyBJdGVyYXRvcih0aGlzKTtcbn07XG5cbi8vIGNhbGxzIGNiIG9uIGVhY2ggbm9kZSdzIGRhdGEsIGluIG9yZGVyXG5UcmVlQmFzZS5wcm90b3R5cGUuZWFjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGl0PXRoaXMuaXRlcmF0b3IoKSwgZGF0YTtcbiAgICB3aGlsZSgoZGF0YSA9IGl0Lm5leHQoKSkgIT09IG51bGwpIHtcbiAgICAgICAgY2IoZGF0YSk7XG4gICAgfVxufTtcblxuLy8gY2FsbHMgY2Igb24gZWFjaCBub2RlJ3MgZGF0YSwgaW4gcmV2ZXJzZSBvcmRlclxuVHJlZUJhc2UucHJvdG90eXBlLnJlYWNoID0gZnVuY3Rpb24oY2IpIHtcbiAgICB2YXIgaXQ9dGhpcy5pdGVyYXRvcigpLCBkYXRhO1xuICAgIHdoaWxlKChkYXRhID0gaXQucHJldigpKSAhPT0gbnVsbCkge1xuICAgICAgICBjYihkYXRhKTtcbiAgICB9XG59O1xuXG5cbmZ1bmN0aW9uIEl0ZXJhdG9yKHRyZWUpIHtcbiAgICB0aGlzLl90cmVlID0gdHJlZTtcbiAgICB0aGlzLl9hbmNlc3RvcnMgPSBbXTtcbiAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xufVxuXG5JdGVyYXRvci5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XG59O1xuXG4vLyBpZiBudWxsLWl0ZXJhdG9yLCByZXR1cm5zIGZpcnN0IG5vZGVcbi8vIG90aGVyd2lzZSwgcmV0dXJucyBuZXh0IG5vZGVcbkl0ZXJhdG9yLnByb3RvdHlwZS5uZXh0ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5fY3Vyc29yID09PSBudWxsKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5fdHJlZS5fcm9vdDtcbiAgICAgICAgaWYocm9vdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fbWluTm9kZShyb290KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yLnJpZ2h0ID09PSBudWxsKSB7XG4gICAgICAgICAgICAvLyBubyBncmVhdGVyIG5vZGUgaW4gc3VidHJlZSwgZ28gdXAgdG8gcGFyZW50XG4gICAgICAgICAgICAvLyBpZiBjb21pbmcgZnJvbSBhIHJpZ2h0IGNoaWxkLCBjb250aW51ZSB1cCB0aGUgc3RhY2tcbiAgICAgICAgICAgIHZhciBzYXZlO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHNhdmUgPSB0aGlzLl9jdXJzb3I7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSB0aGlzLl9hbmNlc3RvcnMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlKHRoaXMuX2N1cnNvci5yaWdodCA9PT0gc2F2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAvLyBnZXQgdGhlIG5leHQgbm9kZSBmcm9tIHRoZSBzdWJ0cmVlXG4gICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaCh0aGlzLl9jdXJzb3IpO1xuICAgICAgICAgICAgdGhpcy5fbWluTm9kZSh0aGlzLl9jdXJzb3IucmlnaHQpO1xuICAgICAgICB9XG4gICAgfVxuICAgIHJldHVybiB0aGlzLl9jdXJzb3IgIT09IG51bGwgPyB0aGlzLl9jdXJzb3IuZGF0YSA6IG51bGw7XG59O1xuXG4vLyBpZiBudWxsLWl0ZXJhdG9yLCByZXR1cm5zIGxhc3Qgbm9kZVxuLy8gb3RoZXJ3aXNlLCByZXR1cm5zIHByZXZpb3VzIG5vZGVcbkl0ZXJhdG9yLnByb3RvdHlwZS5wcmV2ID0gZnVuY3Rpb24oKSB7XG4gICAgaWYodGhpcy5fY3Vyc29yID09PSBudWxsKSB7XG4gICAgICAgIHZhciByb290ID0gdGhpcy5fdHJlZS5fcm9vdDtcbiAgICAgICAgaWYocm9vdCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgdGhpcy5fbWF4Tm9kZShyb290KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgaWYodGhpcy5fY3Vyc29yLmxlZnQgPT09IG51bGwpIHtcbiAgICAgICAgICAgIHZhciBzYXZlO1xuICAgICAgICAgICAgZG8ge1xuICAgICAgICAgICAgICAgIHNhdmUgPSB0aGlzLl9jdXJzb3I7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5fYW5jZXN0b3JzLmxlbmd0aCkge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSB0aGlzLl9hbmNlc3RvcnMucG9wKCk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgICAgICAgICB0aGlzLl9jdXJzb3IgPSBudWxsO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IHdoaWxlKHRoaXMuX2N1cnNvci5sZWZ0ID09PSBzYXZlKTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHRoaXMuX2N1cnNvcik7XG4gICAgICAgICAgICB0aGlzLl9tYXhOb2RlKHRoaXMuX2N1cnNvci5sZWZ0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuSXRlcmF0b3IucHJvdG90eXBlLl9taW5Ob2RlID0gZnVuY3Rpb24oc3RhcnQpIHtcbiAgICB3aGlsZShzdGFydC5sZWZ0ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHN0YXJ0KTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5sZWZ0O1xuICAgIH1cbiAgICB0aGlzLl9jdXJzb3IgPSBzdGFydDtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5fbWF4Tm9kZSA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgd2hpbGUoc3RhcnQucmlnaHQgIT09IG51bGwpIHtcbiAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2goc3RhcnQpO1xuICAgICAgICBzdGFydCA9IHN0YXJ0LnJpZ2h0O1xuICAgIH1cbiAgICB0aGlzLl9jdXJzb3IgPSBzdGFydDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZUJhc2U7XG5cbiIsIlxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBkYXRhIEdlb0pTT05cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihkYXRhLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIGRhdGEgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEpKTtcbiAgaWYgKGRhdGEudHlwZSA9PT0gJ0ZlYXR1cmVDb2xsZWN0aW9uJykge1xuICAgIC8vIFRoYXQncyBhIGh1Z2UgaGFjayB0byBnZXQgdGhpbmdzIHdvcmtpbmcgd2l0aCBib3RoIEFyY0dJUyBzZXJ2ZXJcbiAgICAvLyBhbmQgR2VvU2VydmVyLiBHZW9zZXJ2ZXIgcHJvdmlkZXMgY3JzIHJlZmVyZW5jZSBpbiBHZW9KU09OLCBBcmNHSVMg4oCUXG4gICAgLy8gZG9lc24ndC5cbiAgICAvL2lmIChkYXRhLmNycykgZGVsZXRlIGRhdGEuY3JzO1xuICAgIGZvciAodmFyIGkgPSBkYXRhLmZlYXR1cmVzLmxlbmd0aCAtIDE7IGkgPj0gMDsgaS0tKSB7XG4gICAgICBkYXRhLmZlYXR1cmVzW2ldID0gcHJvamVjdEZlYXR1cmUoZGF0YS5mZWF0dXJlc1tpXSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGRhdGEgPSBwcm9qZWN0RmVhdHVyZShkYXRhLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgfVxuICByZXR1cm4gZGF0YTtcbn07XG5cbm1vZHVsZS5leHBvcnRzLnByb2plY3RGZWF0dXJlICA9IHByb2plY3RGZWF0dXJlO1xubW9kdWxlLmV4cG9ydHMucHJvamVjdEdlb21ldHJ5ID0gcHJvamVjdEdlb21ldHJ5O1xuXG5cbi8qKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbmZ1bmN0aW9uIHByb2plY3RGZWF0dXJlKGZlYXR1cmUsIHByb2plY3QsIGNvbnRleHQpIHtcbiAgaWYgKGZlYXR1cmUudHlwZSA9PT0gJ0dlb21ldHJ5Q29sbGVjdGlvbicpIHtcbiAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gZmVhdHVyZS5nZW9tZXRyaWVzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBmZWF0dXJlLmdlb21ldHJpZXNbaV0gPVxuICAgICAgICBwcm9qZWN0R2VvbWV0cnkoZmVhdHVyZS5nZW9tZXRyaWVzW2ldLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgZmVhdHVyZS5nZW9tZXRyeSA9IHByb2plY3RHZW9tZXRyeShmZWF0dXJlLmdlb21ldHJ5LCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgfVxuICByZXR1cm4gZmVhdHVyZTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gICAgIGRhdGEgR2VvSlNPTlxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBwcm9qZWN0R2VvbWV0cnkoZ2VvbWV0cnksIHByb2plY3QsIGNvbnRleHQpIHtcbiAgdmFyIGNvb3JkcyA9IGdlb21ldHJ5LmNvb3JkaW5hdGVzO1xuICBzd2l0Y2ggKGdlb21ldHJ5LnR5cGUpIHtcbiAgICBjYXNlICdQb2ludCc6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3QuY2FsbChjb250ZXh0LCBjb29yZHMpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNdWx0aVBvaW50JzpcbiAgICBjYXNlICdMaW5lU3RyaW5nJzpcbiAgICAgIGZvciAodmFyIGkgPSAwLCBsZW4gPSBjb29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgICAgY29vcmRzW2ldID0gcHJvamVjdC5jYWxsKGNvbnRleHQsIGNvb3Jkc1tpXSk7XG4gICAgICB9XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IGNvb3JkcztcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnUG9seWdvbic6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3RDb29yZHMoY29vcmRzLCAxLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlMaW5lU3RyaW5nJzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdENvb3Jkcyhjb29yZHMsIDEsIHByb2plY3QsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBjYXNlICdNdWx0aVBvbHlnb24nOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0Q29vcmRzKGNvb3JkcywgMiwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgICBicmVhaztcblxuICAgIGRlZmF1bHQ6XG4gICAgICBicmVhaztcbiAgfVxuICByZXR1cm4gZ2VvbWV0cnk7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHsqfSAgICAgICAgIGNvb3JkcyBDb29yZHMgYXJyYXlzXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgIGxldmVsc0RlZXBcbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7Kn1cbiAqL1xuZnVuY3Rpb24gcHJvamVjdENvb3Jkcyhjb29yZHMsIGxldmVsc0RlZXAsIHByb2plY3QsIGNvbnRleHQpIHtcbiAgdmFyIGNvb3JkLCBpLCBsZW47XG4gIHZhciByZXN1bHQgPSBbXTtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSBjb29yZHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBjb29yZCA9IGxldmVsc0RlZXAgP1xuICAgICAgcHJvamVjdENvb3Jkcyhjb29yZHNbaV0sIGxldmVsc0RlZXAgLSAxLCBwcm9qZWN0LCBjb250ZXh0KSA6XG4gICAgICBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzW2ldKTtcblxuICAgIHJlc3VsdC5wdXNoKGNvb3JkKTtcbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL2luZGV4Jyk7XG4iLCJ2YXIgc2lnbmVkQXJlYSA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gZTJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBzd2VlcEV2ZW50c0NvbXAoZTEsIGUyKSB7XG4gIHZhciBwMSA9IGUxLnBvaW50O1xuICB2YXIgcDIgPSBlMi5wb2ludDtcblxuICAvLyBEaWZmZXJlbnQgeC1jb29yZGluYXRlXG4gIGlmIChwMVswXSA+IHAyWzBdKSByZXR1cm4gMTtcbiAgaWYgKHAxWzBdIDwgcDJbMF0pIHJldHVybiAtMTtcblxuICAvLyBEaWZmZXJlbnQgcG9pbnRzLCBidXQgc2FtZSB4LWNvb3JkaW5hdGVcbiAgLy8gRXZlbnQgd2l0aCBsb3dlciB5LWNvb3JkaW5hdGUgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gIGlmIChwMVsxXSAhPT0gcDJbMV0pIHJldHVybiBwMVsxXSA+IHAyWzFdID8gMSA6IC0xO1xuXG4gIHJldHVybiBzcGVjaWFsQ2FzZXMoZTEsIGUyLCBwMSwgcDIpO1xufTtcblxuXG5mdW5jdGlvbiBzcGVjaWFsQ2FzZXMoZTEsIGUyLCBwMSwgcDIpIHtcbiAgLy8gU2FtZSBjb29yZGluYXRlcywgYnV0IG9uZSBpcyBhIGxlZnQgZW5kcG9pbnQgYW5kIHRoZSBvdGhlciBpc1xuICAvLyBhIHJpZ2h0IGVuZHBvaW50LiBUaGUgcmlnaHQgZW5kcG9pbnQgaXMgcHJvY2Vzc2VkIGZpcnN0XG4gIGlmIChlMS5sZWZ0ICE9PSBlMi5sZWZ0KVxuICAgIHJldHVybiBlMS5sZWZ0ID8gMSA6IC0xO1xuXG4gIC8vIFNhbWUgY29vcmRpbmF0ZXMsIGJvdGggZXZlbnRzXG4gIC8vIGFyZSBsZWZ0IGVuZHBvaW50cyBvciByaWdodCBlbmRwb2ludHMuXG4gIC8vIG5vdCBjb2xsaW5lYXJcbiAgaWYgKHNpZ25lZEFyZWEgKHAxLCBlMS5vdGhlckV2ZW50LnBvaW50LCBlMi5vdGhlckV2ZW50LnBvaW50KSAhPT0gMCkge1xuICAgIC8vIHRoZSBldmVudCBhc3NvY2lhdGUgdG8gdGhlIGJvdHRvbSBzZWdtZW50IGlzIHByb2Nlc3NlZCBmaXJzdFxuICAgIHJldHVybiAoIWUxLmlzQmVsb3coZTIub3RoZXJFdmVudC5wb2ludCkpID8gMSA6IC0xO1xuICB9XG5cbiAgaWYgKGUxLmlzU3ViamVjdCA9PT0gZTIuaXNTdWJqZWN0KSB7XG4gICAgaWYoZTEuY29udG91cklkID09PSBlMi5jb250b3VySWQpe1xuICAgICAgcmV0dXJuIDA7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBlMS5jb250b3VySWQgPiBlMi5jb250b3VySWQgPyAxIDogLTE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuICghZTEuaXNTdWJqZWN0ICYmIGUyLmlzU3ViamVjdCkgPyAxIDogLTE7XG4gIC8vcmV0dXJuIGUxLmlzU3ViamVjdCA/IC0xIDogMTtcbn1cbiIsInZhciBzaWduZWRBcmVhICAgID0gcmVxdWlyZSgnLi9zaWduZWRfYXJlYScpO1xudmFyIGNvbXBhcmVFdmVudHMgPSByZXF1aXJlKCcuL2NvbXBhcmVfZXZlbnRzJyk7XG52YXIgZXF1YWxzICAgICAgICA9IHJlcXVpcmUoJy4vZXF1YWxzJyk7XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBsZTFcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGxlMlxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNvbXBhcmVTZWdtZW50cyhsZTEsIGxlMikge1xuICBpZiAobGUxID09PSBsZTIpIHJldHVybiAwO1xuXG4gIC8vIFNlZ21lbnRzIGFyZSBub3QgY29sbGluZWFyXG4gIGlmIChzaWduZWRBcmVhKGxlMS5wb2ludCwgbGUxLm90aGVyRXZlbnQucG9pbnQsIGxlMi5wb2ludCkgIT09IDAgfHxcbiAgICBzaWduZWRBcmVhKGxlMS5wb2ludCwgbGUxLm90aGVyRXZlbnQucG9pbnQsIGxlMi5vdGhlckV2ZW50LnBvaW50KSAhPT0gMCkge1xuXG4gICAgLy8gSWYgdGhleSBzaGFyZSB0aGVpciBsZWZ0IGVuZHBvaW50IHVzZSB0aGUgcmlnaHQgZW5kcG9pbnQgdG8gc29ydFxuICAgIGlmIChlcXVhbHMobGUxLnBvaW50LCBsZTIucG9pbnQpKSByZXR1cm4gbGUxLmlzQmVsb3cobGUyLm90aGVyRXZlbnQucG9pbnQpID8gLTEgOiAxO1xuXG4gICAgLy8gRGlmZmVyZW50IGxlZnQgZW5kcG9pbnQ6IHVzZSB0aGUgbGVmdCBlbmRwb2ludCB0byBzb3J0XG4gICAgaWYgKGxlMS5wb2ludFswXSA9PT0gbGUyLnBvaW50WzBdKSByZXR1cm4gbGUxLnBvaW50WzFdIDwgbGUyLnBvaW50WzFdID8gLTEgOiAxO1xuXG4gICAgLy8gaGFzIHRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMSBiZWVuIGluc2VydGVkXG4gICAgLy8gaW50byBTIGFmdGVyIHRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMiA/XG4gICAgaWYgKGNvbXBhcmVFdmVudHMobGUxLCBsZTIpID09PSAxKSByZXR1cm4gbGUyLmlzQWJvdmUobGUxLnBvaW50KSA/IC0xIDogMTtcblxuICAgIC8vIFRoZSBsaW5lIHNlZ21lbnQgYXNzb2NpYXRlZCB0byBlMiBoYXMgYmVlbiBpbnNlcnRlZFxuICAgIC8vIGludG8gUyBhZnRlciB0aGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTFcbiAgICByZXR1cm4gbGUxLmlzQmVsb3cobGUyLnBvaW50KSA/IC0xIDogMTtcbiAgfVxuXG4gIGlmIChsZTEuaXNTdWJqZWN0ID09PSBsZTIuaXNTdWJqZWN0KXtcbiAgICBpZiAoZXF1YWxzKGxlMS5wb2ludCwgbGUyLnBvaW50KSkge1xuICAgICAgaWYgKGxlMS5jb250b3VySWQgPT09IGxlMi5jb250b3VySWQpe1xuICAgICAgICByZXR1cm4gMDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJldHVybiBsZTEuY29udG91cklkID4gbGUyLmNvbnRvdXJJZCA/IDEgOiAtMTtcbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2VnbWVudHMgYXJlIGNvbGxpbmVhclxuICAgICAgaWYgKGxlMS5pc1N1YmplY3QgIT09IGxlMi5pc1N1YmplY3QpIHJldHVybiAobGUxLmlzU3ViamVjdCAmJiAhbGUyLmlzU3ViamVjdCkgPyAxIDogLTE7XG4gICAgfVxuICB9XG5cbiAgcmV0dXJuIGNvbXBhcmVFdmVudHMobGUxLCBsZTIpID09PSAxID8gMSA6IC0xO1xufTtcbiIsIm1vZHVsZS5leHBvcnRzID0geyBcbiAgTk9STUFMOiAgICAgICAgICAgICAgIDAsIFxuICBOT05fQ09OVFJJQlVUSU5HOiAgICAgMSwgXG4gIFNBTUVfVFJBTlNJVElPTjogICAgICAyLCBcbiAgRElGRkVSRU5UX1RSQU5TSVRJT046IDNcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGVxdWFscyhwMSwgcDIpIHtcbiAgcmV0dXJuIHAxWzBdID09PSBwMlswXSAmJiBwMVsxXSA9PT0gcDJbMV07XG59OyIsInZhciBJTlRFUlNFQ1RJT04gICAgPSAwO1xudmFyIFVOSU9OICAgICAgICAgICA9IDE7XG52YXIgRElGRkVSRU5DRSAgICAgID0gMjtcbnZhciBYT1IgICAgICAgICAgICAgPSAzO1xuXG52YXIgRU1QVFkgICAgICAgICAgID0gW107XG5cbnZhciBlZGdlVHlwZSAgICAgICAgPSByZXF1aXJlKCcuL2VkZ2VfdHlwZScpO1xuXG52YXIgUXVldWUgICAgICAgICAgID0gcmVxdWlyZSgndGlueXF1ZXVlJyk7XG52YXIgVHJlZSAgICAgICAgICAgID0gcmVxdWlyZSgnYmludHJlZXMnKS5SQlRyZWU7XG52YXIgU3dlZXBFdmVudCAgICAgID0gcmVxdWlyZSgnLi9zd2VlcF9ldmVudCcpO1xuXG52YXIgY29tcGFyZUV2ZW50cyAgID0gcmVxdWlyZSgnLi9jb21wYXJlX2V2ZW50cycpO1xudmFyIGNvbXBhcmVTZWdtZW50cyA9IHJlcXVpcmUoJy4vY29tcGFyZV9zZWdtZW50cycpO1xudmFyIGludGVyc2VjdGlvbiAgICA9IHJlcXVpcmUoJy4vc2VnbWVudF9pbnRlcnNlY3Rpb24nKTtcbnZhciBlcXVhbHMgICAgICAgICAgPSByZXF1aXJlKCcuL2VxdWFscycpO1xuXG52YXIgbWF4ID0gTWF0aC5tYXg7XG52YXIgbWluID0gTWF0aC5taW47XG5cbi8qKlxuICogQHBhcmFtICB7PEFycmF5LjxOdW1iZXI+fSBzMVxuICogQHBhcmFtICB7PEFycmF5LjxOdW1iZXI+fSBzMlxuICogQHBhcmFtICB7Qm9vbGVhbn0gICAgICAgICBpc1N1YmplY3RcbiAqIEBwYXJhbSAge1F1ZXVlfSAgICAgICAgICAgZXZlbnRRdWV1ZVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBiYm94XG4gKi9cbmZ1bmN0aW9uIHByb2Nlc3NTZWdtZW50KHMxLCBzMiwgaXNTdWJqZWN0LCBkZXB0aCwgZXZlbnRRdWV1ZSwgYmJveCkge1xuICAvLyBQb3NzaWJsZSBkZWdlbmVyYXRlIGNvbmRpdGlvbi5cbiAgLy8gaWYgKGVxdWFscyhzMSwgczIpKSByZXR1cm47XG5cbiAgdmFyIGUxID0gbmV3IFN3ZWVwRXZlbnQoczEsIGZhbHNlLCB1bmRlZmluZWQsIGlzU3ViamVjdCk7XG4gIHZhciBlMiA9IG5ldyBTd2VlcEV2ZW50KHMyLCBmYWxzZSwgZTEsICAgICAgICBpc1N1YmplY3QpO1xuICBlMS5vdGhlckV2ZW50ID0gZTI7XG5cbiAgZTEuY29udG91cklkID0gZTIuY29udG91cklkID0gZGVwdGg7XG5cbiAgaWYgKGNvbXBhcmVFdmVudHMoZTEsIGUyKSA+IDApIHtcbiAgICBlMi5sZWZ0ID0gdHJ1ZTtcbiAgfSBlbHNlIHtcbiAgICBlMS5sZWZ0ID0gdHJ1ZTtcbiAgfVxuXG4gIGJib3hbMF0gPSBtaW4oYmJveFswXSwgczFbMF0pO1xuICBiYm94WzFdID0gbWluKGJib3hbMV0sIHMxWzFdKTtcbiAgYmJveFsyXSA9IG1heChiYm94WzJdLCBzMVswXSk7XG4gIGJib3hbM10gPSBtYXgoYmJveFszXSwgczFbMV0pO1xuXG4gIC8vIFB1c2hpbmcgaXQgc28gdGhlIHF1ZXVlIGlzIHNvcnRlZCBmcm9tIGxlZnQgdG8gcmlnaHQsXG4gIC8vIHdpdGggb2JqZWN0IG9uIHRoZSBsZWZ0IGhhdmluZyB0aGUgaGlnaGVzdCBwcmlvcml0eS5cbiAgZXZlbnRRdWV1ZS5wdXNoKGUxKTtcbiAgZXZlbnRRdWV1ZS5wdXNoKGUyKTtcbn1cblxudmFyIGNvbnRvdXJJZCA9IDA7XG5cbmZ1bmN0aW9uIHByb2Nlc3NQb2x5Z29uKHBvbHlnb24sIGlzU3ViamVjdCwgZGVwdGgsIHF1ZXVlLCBiYm94KSB7XG4gIHZhciBpLCBsZW47XG4gIGlmICh0eXBlb2YgcG9seWdvblswXVswXSA9PT0gJ251bWJlcicpIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBwb2x5Z29uLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgICAgcHJvY2Vzc1NlZ21lbnQocG9seWdvbltpXSwgcG9seWdvbltpICsgMV0sIGlzU3ViamVjdCwgZGVwdGggKyAxLCBxdWV1ZSwgYmJveCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHBvbHlnb24ubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGNvbnRvdXJJZCsrO1xuICAgICAgcHJvY2Vzc1BvbHlnb24ocG9seWdvbltpXSwgaXNTdWJqZWN0LCBjb250b3VySWQsIHF1ZXVlLCBiYm94KTtcbiAgICB9XG4gIH1cbn1cblxuXG5mdW5jdGlvbiBmaWxsUXVldWUoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCkge1xuICB2YXIgZXZlbnRRdWV1ZSA9IG5ldyBRdWV1ZShudWxsLCBjb21wYXJlRXZlbnRzKTtcbiAgY29udG91cklkID0gMDtcblxuICBwcm9jZXNzUG9seWdvbihzdWJqZWN0LCAgdHJ1ZSwgIDAsIGV2ZW50UXVldWUsIHNiYm94KTtcbiAgcHJvY2Vzc1BvbHlnb24oY2xpcHBpbmcsIGZhbHNlLCAwLCBldmVudFF1ZXVlLCBjYmJveCk7XG5cbiAgcmV0dXJuIGV2ZW50UXVldWU7XG59XG5cblxuZnVuY3Rpb24gY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldiwgc3dlZXBMaW5lLCBvcGVyYXRpb24pIHtcbiAgLy8gY29tcHV0ZSBpbk91dCBhbmQgb3RoZXJJbk91dCBmaWVsZHNcbiAgaWYgKHByZXYgPT09IG51bGwpIHtcbiAgICBldmVudC5pbk91dCAgICAgID0gZmFsc2U7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHRydWU7XG5cbiAgLy8gcHJldmlvdXMgbGluZSBzZWdtZW50IGluIHN3ZWVwbGluZSBiZWxvbmdzIHRvIHRoZSBzYW1lIHBvbHlnb25cbiAgfSBlbHNlIGlmIChldmVudC5pc1N1YmplY3QgPT09IHByZXYuaXNTdWJqZWN0KSB7XG4gICAgZXZlbnQuaW5PdXQgICAgICA9ICFwcmV2LmluT3V0O1xuICAgIGV2ZW50Lm90aGVySW5PdXQgPSBwcmV2Lm90aGVySW5PdXQ7XG5cbiAgLy8gcHJldmlvdXMgbGluZSBzZWdtZW50IGluIHN3ZWVwbGluZSBiZWxvbmdzIHRvIHRoZSBjbGlwcGluZyBwb2x5Z29uXG4gIH0gZWxzZSB7XG4gICAgZXZlbnQuaW5PdXQgICAgICA9ICFwcmV2Lm90aGVySW5PdXQ7XG4gICAgZXZlbnQub3RoZXJJbk91dCA9IHByZXYuaXNWZXJ0aWNhbCgpID8gIXByZXYuaW5PdXQgOiBwcmV2LmluT3V0O1xuICB9XG5cbiAgLy8gY29tcHV0ZSBwcmV2SW5SZXN1bHQgZmllbGRcbiAgaWYgKHByZXYpIHtcbiAgICBldmVudC5wcmV2SW5SZXN1bHQgPSAoIWluUmVzdWx0KHByZXYsIG9wZXJhdGlvbikgfHwgcHJldi5pc1ZlcnRpY2FsKCkpID9cbiAgICAgICBwcmV2LnByZXZJblJlc3VsdCA6IHByZXY7XG4gIH1cbiAgLy8gY2hlY2sgaWYgdGhlIGxpbmUgc2VnbWVudCBiZWxvbmdzIHRvIHRoZSBCb29sZWFuIG9wZXJhdGlvblxuICBldmVudC5pblJlc3VsdCA9IGluUmVzdWx0KGV2ZW50LCBvcGVyYXRpb24pO1xufVxuXG5cbmZ1bmN0aW9uIGluUmVzdWx0KGV2ZW50LCBvcGVyYXRpb24pIHtcbiAgc3dpdGNoIChldmVudC50eXBlKSB7XG4gICAgY2FzZSBlZGdlVHlwZS5OT1JNQUw6XG4gICAgICBzd2l0Y2ggKG9wZXJhdGlvbikge1xuICAgICAgICBjYXNlIElOVEVSU0VDVElPTjpcbiAgICAgICAgICByZXR1cm4gIWV2ZW50Lm90aGVySW5PdXQ7XG4gICAgICAgIGNhc2UgVU5JT046XG4gICAgICAgICAgcmV0dXJuIGV2ZW50Lm90aGVySW5PdXQ7XG4gICAgICAgIGNhc2UgRElGRkVSRU5DRTpcbiAgICAgICAgICByZXR1cm4gKGV2ZW50LmlzU3ViamVjdCAmJiBldmVudC5vdGhlckluT3V0KSB8fFxuICAgICAgICAgICAgICAgICAoIWV2ZW50LmlzU3ViamVjdCAmJiAhZXZlbnQub3RoZXJJbk91dCk7XG4gICAgICAgIGNhc2UgWE9SOlxuICAgICAgICAgIHJldHVybiB0cnVlO1xuICAgICAgfVxuICAgIGNhc2UgZWRnZVR5cGUuU0FNRV9UUkFOU0lUSU9OOlxuICAgICAgcmV0dXJuIG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OIHx8IG9wZXJhdGlvbiA9PT0gVU5JT047XG4gICAgY2FzZSBlZGdlVHlwZS5ESUZGRVJFTlRfVFJBTlNJVElPTjpcbiAgICAgIHJldHVybiBvcGVyYXRpb24gPT09IERJRkZFUkVOQ0U7XG4gICAgY2FzZSBlZGdlVHlwZS5OT05fQ09OVFJJQlVUSU5HOlxuICAgICAgcmV0dXJuIGZhbHNlO1xuICB9XG4gIHJldHVybiBmYWxzZTtcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IHNlMVxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2UyXG4gKiBAcGFyYW0gIHtRdWV1ZX0gICAgICBxdWV1ZVxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBwb3NzaWJsZUludGVyc2VjdGlvbihzZTEsIHNlMiwgcXVldWUpIHtcbiAgLy8gdGhhdCBkaXNhbGxvd3Mgc2VsZi1pbnRlcnNlY3RpbmcgcG9seWdvbnMsXG4gIC8vIGRpZCBjb3N0IHVzIGhhbGYgYSBkYXksIHNvIEknbGwgbGVhdmUgaXRcbiAgLy8gb3V0IG9mIHJlc3BlY3RcbiAgLy8gaWYgKHNlMS5pc1N1YmplY3QgPT09IHNlMi5pc1N1YmplY3QpIHJldHVybjtcblxuICB2YXIgaW50ZXIgPSBpbnRlcnNlY3Rpb24oXG4gICAgc2UxLnBvaW50LCBzZTEub3RoZXJFdmVudC5wb2ludCxcbiAgICBzZTIucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50XG4gICk7XG5cbiAgdmFyIG5pbnRlcnNlY3Rpb25zID0gaW50ZXIgPyBpbnRlci5sZW5ndGggOiAwO1xuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDApIHJldHVybiAwOyAvLyBubyBpbnRlcnNlY3Rpb25cblxuICAvLyB0aGUgbGluZSBzZWdtZW50cyBpbnRlcnNlY3QgYXQgYW4gZW5kcG9pbnQgb2YgYm90aCBsaW5lIHNlZ21lbnRzXG4gIGlmICgobmludGVyc2VjdGlvbnMgPT09IDEpICYmXG4gICAgICAoZXF1YWxzKHNlMS5wb2ludCwgc2UyLnBvaW50KSB8fFxuICAgICAgIGVxdWFscyhzZTEub3RoZXJFdmVudC5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpKSkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgaWYgKG5pbnRlcnNlY3Rpb25zID09PSAyICYmIHNlMS5pc1N1YmplY3QgPT09IHNlMi5pc1N1YmplY3Qpe1xuICAgIGlmKHNlMS5jb250b3VySWQgPT09IHNlMi5jb250b3VySWQpe1xuICAgIGNvbnNvbGUud2FybignRWRnZXMgb2YgdGhlIHNhbWUgcG9seWdvbiBvdmVybGFwJyxcbiAgICAgIHNlMS5wb2ludCwgc2UxLm90aGVyRXZlbnQucG9pbnQsIHNlMi5wb2ludCwgc2UyLm90aGVyRXZlbnQucG9pbnQpO1xuICAgIH1cbiAgICAvL3Rocm93IG5ldyBFcnJvcignRWRnZXMgb2YgdGhlIHNhbWUgcG9seWdvbiBvdmVybGFwJyk7XG4gICAgcmV0dXJuIDA7XG4gIH1cblxuICAvLyBUaGUgbGluZSBzZWdtZW50cyBhc3NvY2lhdGVkIHRvIHNlMSBhbmQgc2UyIGludGVyc2VjdFxuICBpZiAobmludGVyc2VjdGlvbnMgPT09IDEpIHtcblxuICAgIC8vIGlmIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgaXMgbm90IGFuIGVuZHBvaW50IG9mIHNlMVxuICAgIGlmICghZXF1YWxzKHNlMS5wb2ludCwgaW50ZXJbMF0pICYmICFlcXVhbHMoc2UxLm90aGVyRXZlbnQucG9pbnQsIGludGVyWzBdKSkge1xuICAgICAgZGl2aWRlU2VnbWVudChzZTEsIGludGVyWzBdLCBxdWV1ZSk7XG4gICAgfVxuXG4gICAgLy8gaWYgdGhlIGludGVyc2VjdGlvbiBwb2ludCBpcyBub3QgYW4gZW5kcG9pbnQgb2Ygc2UyXG4gICAgaWYgKCFlcXVhbHMoc2UyLnBvaW50LCBpbnRlclswXSkgJiYgIWVxdWFscyhzZTIub3RoZXJFdmVudC5wb2ludCwgaW50ZXJbMF0pKSB7XG4gICAgICBkaXZpZGVTZWdtZW50KHNlMiwgaW50ZXJbMF0sIHF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICAvLyBUaGUgbGluZSBzZWdtZW50cyBhc3NvY2lhdGVkIHRvIHNlMSBhbmQgc2UyIG92ZXJsYXBcbiAgdmFyIGV2ZW50cyAgICAgICAgPSBbXTtcbiAgdmFyIGxlZnRDb2luY2lkZSAgPSBmYWxzZTtcbiAgdmFyIHJpZ2h0Q29pbmNpZGUgPSBmYWxzZTtcblxuICBpZiAoZXF1YWxzKHNlMS5wb2ludCwgc2UyLnBvaW50KSkge1xuICAgIGxlZnRDb2luY2lkZSA9IHRydWU7IC8vIGxpbmtlZFxuICB9IGVsc2UgaWYgKGNvbXBhcmVFdmVudHMoc2UxLCBzZTIpID09PSAxKSB7XG4gICAgZXZlbnRzLnB1c2goc2UyLCBzZTEpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5wdXNoKHNlMSwgc2UyKTtcbiAgfVxuXG4gIGlmIChlcXVhbHMoc2UxLm90aGVyRXZlbnQucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50KSkge1xuICAgIHJpZ2h0Q29pbmNpZGUgPSB0cnVlO1xuICB9IGVsc2UgaWYgKGNvbXBhcmVFdmVudHMoc2UxLm90aGVyRXZlbnQsIHNlMi5vdGhlckV2ZW50KSA9PT0gMSkge1xuICAgIGV2ZW50cy5wdXNoKHNlMi5vdGhlckV2ZW50LCBzZTEub3RoZXJFdmVudCk7XG4gIH0gZWxzZSB7XG4gICAgZXZlbnRzLnB1c2goc2UxLm90aGVyRXZlbnQsIHNlMi5vdGhlckV2ZW50KTtcbiAgfVxuXG4gIGlmICgobGVmdENvaW5jaWRlICYmIHJpZ2h0Q29pbmNpZGUpIHx8IGxlZnRDb2luY2lkZSkge1xuICAgIC8vIGJvdGggbGluZSBzZWdtZW50cyBhcmUgZXF1YWwgb3Igc2hhcmUgdGhlIGxlZnQgZW5kcG9pbnRcbiAgICBzZTEudHlwZSA9IGVkZ2VUeXBlLk5PTl9DT05UUklCVVRJTkc7XG4gICAgc2UyLnR5cGUgPSAoc2UxLmluT3V0ID09PSBzZTIuaW5PdXQpID9cbiAgICAgIGVkZ2VUeXBlLlNBTUVfVFJBTlNJVElPTiA6XG4gICAgICBlZGdlVHlwZS5ESUZGRVJFTlRfVFJBTlNJVElPTjtcblxuICAgIGlmIChsZWZ0Q29pbmNpZGUgJiYgIXJpZ2h0Q29pbmNpZGUpIHtcbiAgICAgIC8vIGhvbmVzdGx5IG5vIGlkZWEsIGJ1dCBjaGFuZ2luZyBldmVudHMgc2VsZWN0aW9uIGZyb20gWzIsIDFdXG4gICAgICAvLyB0byBbMCwgMV0gZml4ZXMgdGhlIG92ZXJsYXBwaW5nIHNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25zIGlzc3VlXG4gICAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXS5vdGhlckV2ZW50LCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgICB9XG4gICAgcmV0dXJuIDI7XG4gIH1cblxuICAvLyB0aGUgbGluZSBzZWdtZW50cyBzaGFyZSB0aGUgcmlnaHQgZW5kcG9pbnRcbiAgaWYgKHJpZ2h0Q29pbmNpZGUpIHtcbiAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gICAgcmV0dXJuIDM7XG4gIH1cblxuICAvLyBubyBsaW5lIHNlZ21lbnQgaW5jbHVkZXMgdG90YWxseSB0aGUgb3RoZXIgb25lXG4gIGlmIChldmVudHNbMF0gIT09IGV2ZW50c1szXS5vdGhlckV2ZW50KSB7XG4gICAgZGl2aWRlU2VnbWVudChldmVudHNbMF0sIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzFdLCBldmVudHNbMl0ucG9pbnQsIHF1ZXVlKTtcbiAgICByZXR1cm4gMztcbiAgfVxuXG4gIC8vIG9uZSBsaW5lIHNlZ21lbnQgaW5jbHVkZXMgdGhlIG90aGVyIG9uZVxuICBkaXZpZGVTZWdtZW50KGV2ZW50c1swXSwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzNdLm90aGVyRXZlbnQsIGV2ZW50c1syXS5wb2ludCwgcXVldWUpO1xuXG4gIHJldHVybiAzO1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gc2VcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwXG4gKiBAcGFyYW0gIHtRdWV1ZX0gcXVldWVcbiAqIEByZXR1cm4ge1F1ZXVlfVxuICovXG5mdW5jdGlvbiBkaXZpZGVTZWdtZW50KHNlLCBwLCBxdWV1ZSkgIHtcbiAgdmFyIHIgPSBuZXcgU3dlZXBFdmVudChwLCBmYWxzZSwgc2UsICAgICAgICAgICAgc2UuaXNTdWJqZWN0KTtcbiAgdmFyIGwgPSBuZXcgU3dlZXBFdmVudChwLCB0cnVlLCAgc2Uub3RoZXJFdmVudCwgc2UuaXNTdWJqZWN0KTtcblxuICAvLyBhdm9pZCBhIHJvdW5kaW5nIGVycm9yLiBUaGUgbGVmdCBldmVudCB3b3VsZCBiZSBwcm9jZXNzZWQgYWZ0ZXIgdGhlIHJpZ2h0IGV2ZW50XG4gIGlmIChjb21wYXJlRXZlbnRzKGwsIHNlLm90aGVyRXZlbnQpID4gMCkge1xuICAgIHNlLm90aGVyRXZlbnQubGVmdCA9IHRydWU7XG4gICAgbC5sZWZ0ID0gZmFsc2U7XG4gIH1cblxuICAvLyBhdm9pZCBhIHJvdW5kaW5nIGVycm9yLiBUaGUgbGVmdCBldmVudCB3b3VsZCBiZSBwcm9jZXNzZWQgYWZ0ZXIgdGhlIHJpZ2h0IGV2ZW50XG4gIC8vIGlmIChjb21wYXJlRXZlbnRzKHNlLCByKSA+IDApIHt9XG5cbiAgc2Uub3RoZXJFdmVudC5vdGhlckV2ZW50ID0gbDtcbiAgc2Uub3RoZXJFdmVudCA9IHI7XG5cbiAgcXVldWUucHVzaChsKTtcbiAgcXVldWUucHVzaChyKTtcblxuICByZXR1cm4gcXVldWU7XG59XG5cblxuLyogZXNsaW50LWRpc2FibGUgbm8tdW51c2VkLXZhcnMsIG5vLWRlYnVnZ2VyICovXG5mdW5jdGlvbiBpdGVyYXRvckVxdWFscyhpdDEsIGl0Mikge1xuICByZXR1cm4gaXQxLl9jdXJzb3IgPT09IGl0Mi5fY3Vyc29yO1xufVxuXG5cbmZ1bmN0aW9uIF9yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBwb3MsIGV2ZW50KSB7XG4gIHZhciBtYXAgPSB3aW5kb3cubWFwO1xuICBpZiAoIW1hcCkgcmV0dXJuO1xuICBpZiAod2luZG93LnN3cykgd2luZG93LnN3cy5mb3JFYWNoKGZ1bmN0aW9uKHApIHtcbiAgICBtYXAucmVtb3ZlTGF5ZXIocCk7XG4gIH0pO1xuICB3aW5kb3cuc3dzID0gW107XG4gIHN3ZWVwTGluZS5lYWNoKGZ1bmN0aW9uKGUpIHtcbiAgICB2YXIgcG9seSA9IEwucG9seWxpbmUoW2UucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCksIGUub3RoZXJFdmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKV0sIHsgY29sb3I6ICdncmVlbicgfSkuYWRkVG8obWFwKTtcbiAgICB3aW5kb3cuc3dzLnB1c2gocG9seSk7XG4gIH0pO1xuXG4gIGlmICh3aW5kb3cudnQpIG1hcC5yZW1vdmVMYXllcih3aW5kb3cudnQpO1xuICB2YXIgdiA9IHBvcy5zbGljZSgpO1xuICB2YXIgYiA9IG1hcC5nZXRCb3VuZHMoKTtcbiAgd2luZG93LnZ0ID0gTC5wb2x5bGluZShbW2IuZ2V0Tm9ydGgoKSwgdlswXV0sIFtiLmdldFNvdXRoKCksIHZbMF1dXSwge2NvbG9yOiAnZ3JlZW4nLCB3ZWlnaHQ6IDF9KS5hZGRUbyhtYXApO1xuXG4gIGlmICh3aW5kb3cucHMpIG1hcC5yZW1vdmVMYXllcih3aW5kb3cucHMpO1xuICB3aW5kb3cucHMgPSBMLnBvbHlsaW5lKFtldmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKSwgZXZlbnQub3RoZXJFdmVudC5wb2ludC5zbGljZSgpLnJldmVyc2UoKV0sIHtjb2xvcjogJ2JsYWNrJywgd2VpZ2h0OiA5LCBvcGFjaXR5OiAwLjR9KS5hZGRUbyhtYXApO1xuICBkZWJ1Z2dlcjtcbn1cbi8qIGVzbGludC1lbmFibGUgbm8tdW51c2VkLXZhcnMsIG5vLWRlYnVnZ2VyICovXG5cblxuZnVuY3Rpb24gc3ViZGl2aWRlU2VnbWVudHMoZXZlbnRRdWV1ZSwgc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKSB7XG4gIHZhciBzb3J0ZWRFdmVudHMgPSBbXTtcbiAgdmFyIHByZXYsIG5leHQ7XG5cbiAgdmFyIHN3ZWVwTGluZSA9IG5ldyBUcmVlKGNvbXBhcmVTZWdtZW50cyk7XG4gIHZhciBzb3J0ZWRFdmVudHMgPSBbXTtcblxuICB2YXIgcmlnaHRib3VuZCA9IG1pbihzYmJveFsyXSwgY2Jib3hbMl0pO1xuXG4gIHZhciBwcmV2LCBuZXh0O1xuXG4gIHdoaWxlIChldmVudFF1ZXVlLmxlbmd0aCkge1xuICAgIHZhciBldmVudCA9IGV2ZW50UXVldWUucG9wKCk7XG4gICAgc29ydGVkRXZlbnRzLnB1c2goZXZlbnQpO1xuXG4gICAgLy8gb3B0aW1pemF0aW9uIGJ5IGJib3hlcyBmb3IgaW50ZXJzZWN0aW9uIGFuZCBkaWZmZXJlbmNlIGdvZXMgaGVyZVxuICAgIGlmICgob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04gJiYgZXZlbnQucG9pbnRbMF0gPiByaWdodGJvdW5kKSB8fFxuICAgICAgICAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFICAgJiYgZXZlbnQucG9pbnRbMF0gPiBzYmJveFsyXSkpIHtcbiAgICAgIGJyZWFrO1xuICAgIH1cblxuICAgIGlmIChldmVudC5sZWZ0KSB7XG4gICAgICBzd2VlcExpbmUuaW5zZXJ0KGV2ZW50KTtcbiAgICAgIC8vIF9yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBldmVudC5wb2ludCwgZXZlbnQpO1xuXG4gICAgICBuZXh0ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcbiAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuICAgICAgZXZlbnQuaXRlcmF0b3IgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuXG4gICAgICBpZiAocHJldi5kYXRhKCkgIT09IHN3ZWVwTGluZS5taW4oKSkge1xuICAgICAgICBwcmV2LnByZXYoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoc3dlZXBMaW5lLm1heCgpKTtcbiAgICAgICAgcHJldi5uZXh0KCk7XG4gICAgICB9XG4gICAgICBuZXh0Lm5leHQoKTtcblxuICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcblxuICAgICAgaWYgKG5leHQuZGF0YSgpKSB7XG4gICAgICAgIGlmIChwb3NzaWJsZUludGVyc2VjdGlvbihldmVudCwgbmV4dC5kYXRhKCksIGV2ZW50UXVldWUpID09PSAyKSB7XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgcHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBuZXh0LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSkge1xuICAgICAgICBpZiAocG9zc2libGVJbnRlcnNlY3Rpb24ocHJldi5kYXRhKCksIGV2ZW50LCBldmVudFF1ZXVlKSA9PT0gMikge1xuICAgICAgICAgIHZhciBwcmV2cHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihwcmV2LmRhdGEoKSk7XG4gICAgICAgICAgaWYgKHByZXZwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgICAgICBwcmV2cHJldi5wcmV2KCk7XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHByZXZwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgICAgICBwcmV2cHJldi5uZXh0KCk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGNvbXB1dGVGaWVsZHMocHJldi5kYXRhKCksIHByZXZwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9IGVsc2Uge1xuICAgICAgZXZlbnQgPSBldmVudC5vdGhlckV2ZW50O1xuICAgICAgbmV4dCA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG4gICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcblxuICAgICAgLy8gX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIGV2ZW50Lm90aGVyRXZlbnQucG9pbnQsIGV2ZW50KTtcblxuICAgICAgaWYgKCEocHJldiAmJiBuZXh0KSkgY29udGludWU7XG5cbiAgICAgIGlmIChwcmV2LmRhdGEoKSAhPT0gc3dlZXBMaW5lLm1pbigpKSB7XG4gICAgICAgIHByZXYucHJldigpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihzd2VlcExpbmUubWF4KCkpO1xuICAgICAgICBwcmV2Lm5leHQoKTtcbiAgICAgIH1cbiAgICAgIG5leHQubmV4dCgpO1xuICAgICAgc3dlZXBMaW5lLnJlbW92ZShldmVudCk7XG5cbiAgICAgIC8vX3JlbmRlclN3ZWVwTGluZShzd2VlcExpbmUsIGV2ZW50Lm90aGVyRXZlbnQucG9pbnQsIGV2ZW50KTtcblxuICAgICAgaWYgKG5leHQuZGF0YSgpICYmIHByZXYuZGF0YSgpKSB7XG4gICAgICAgIHBvc3NpYmxlSW50ZXJzZWN0aW9uKHByZXYuZGF0YSgpLCBuZXh0LmRhdGEoKSwgZXZlbnRRdWV1ZSk7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBzb3J0ZWRFdmVudHM7XG59XG5cblxuZnVuY3Rpb24gc3dhcCAoYXJyLCBpLCBuKSB7XG4gIHZhciB0ZW1wID0gYXJyW2ldO1xuICBhcnJbaV0gPSBhcnJbbl07XG4gIGFycltuXSA9IHRlbXA7XG59XG5cblxuZnVuY3Rpb24gY2hhbmdlT3JpZW50YXRpb24oY29udG91cikge1xuICByZXR1cm4gY29udG91ci5yZXZlcnNlKCk7XG59XG5cblxuZnVuY3Rpb24gaXNBcnJheSAoYXJyKSB7XG4gIHJldHVybiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nLmNhbGwoYXJyKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcbn1cblxuXG5mdW5jdGlvbiBhZGRIb2xlKGNvbnRvdXIsIGlkeCkge1xuICBpZiAoIWlzQXJyYXkoY29udG91clswXVswXSkpIHtcbiAgICBjb250b3VyID0gW2NvbnRvdXJdO1xuICB9XG4gIGNvbnRvdXJbaWR4XSA9IFtdO1xuICByZXR1cm4gY29udG91cjtcbn1cblxuXG5mdW5jdGlvbiBjb25uZWN0RWRnZXMoc29ydGVkRXZlbnRzKSB7XG4gIC8vIGNvcHkgdGhlIGV2ZW50cyBpbiB0aGUgcmVzdWx0IHBvbHlnb24gdG8gcmVzdWx0RXZlbnRzIGFycmF5XG4gIHZhciByZXN1bHRFdmVudHMgPSBbXTtcbiAgdmFyIGV2ZW50LCBpLCBsZW47XG5cbiAgZm9yIChpID0gMCwgbGVuID0gc29ydGVkRXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgZXZlbnQgPSBzb3J0ZWRFdmVudHNbaV07XG4gICAgaWYgKChldmVudC5sZWZ0ICYmIGV2ZW50LmluUmVzdWx0KSB8fFxuICAgICAgKCFldmVudC5sZWZ0ICYmIGV2ZW50Lm90aGVyRXZlbnQuaW5SZXN1bHQpKSB7XG4gICAgICByZXN1bHRFdmVudHMucHVzaChldmVudCk7XG4gICAgfVxuICB9XG5cbiAgLy8gRHVlIHRvIG92ZXJsYXBwaW5nIGVkZ2VzIHRoZSByZXN1bHRFdmVudHMgYXJyYXkgY2FuIGJlIG5vdCB3aG9sbHkgc29ydGVkXG4gIHZhciBzb3J0ZWQgPSBmYWxzZTtcbiAgd2hpbGUgKCFzb3J0ZWQpIHtcbiAgICBzb3J0ZWQgPSB0cnVlO1xuICAgIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgaWYgKChpICsgMSkgPCBsZW4gJiZcbiAgICAgICAgY29tcGFyZUV2ZW50cyhyZXN1bHRFdmVudHNbaV0sIHJlc3VsdEV2ZW50c1tpICsgMV0pID09PSAxKSB7XG4gICAgICAgIHN3YXAocmVzdWx0RXZlbnRzLCBpLCBpICsgMSk7XG4gICAgICAgIHNvcnRlZCA9IGZhbHNlO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIHJlc3VsdEV2ZW50c1tpXS5wb3MgPSBpO1xuICAgIGlmICghcmVzdWx0RXZlbnRzW2ldLmxlZnQpIHtcbiAgICAgIHZhciB0ZW1wID0gcmVzdWx0RXZlbnRzW2ldLnBvcztcbiAgICAgIHJlc3VsdEV2ZW50c1tpXS5wb3MgPSByZXN1bHRFdmVudHNbaV0ub3RoZXJFdmVudC5wb3M7XG4gICAgICByZXN1bHRFdmVudHNbaV0ub3RoZXJFdmVudC5wb3MgPSB0ZW1wO1xuICAgIH1cbiAgfVxuXG4gIC8vIFwiZmFsc2VcIi1maWxsZWQgYXJyYXlcbiAgdmFyIHByb2Nlc3NlZCA9IEFycmF5KHJlc3VsdEV2ZW50cy5sZW5ndGgpO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgdmFyIGRlcHRoICA9IFtdO1xuICB2YXIgaG9sZU9mID0gW107XG4gIHZhciBpc0hvbGUgPSB7fTtcblxuICBmb3IgKGkgPSAwLCBsZW4gPSByZXN1bHRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBpZiAocHJvY2Vzc2VkW2ldKSBjb250aW51ZTtcblxuICAgIHZhciBjb250b3VyID0gW107XG4gICAgcmVzdWx0LnB1c2goY29udG91cik7XG5cbiAgICB2YXIgY29udG91cklkID0gcmVzdWx0Lmxlbmd0aCAtIDE7XG4gICAgZGVwdGgucHVzaCgwKTtcbiAgICBob2xlT2YucHVzaCgtMSk7XG5cblxuICAgIGlmIChyZXN1bHRFdmVudHNbaV0ucHJldkluUmVzdWx0KSB7XG4gICAgICB2YXIgbG93ZXJDb250b3VySWQgPSByZXN1bHRFdmVudHNbaV0ucHJldkluUmVzdWx0LmNvbnRvdXJJZDtcbiAgICAgIGlmICghcmVzdWx0RXZlbnRzW2ldLnByZXZJblJlc3VsdC5yZXN1bHRJbk91dCkge1xuICAgICAgICBhZGRIb2xlKHJlc3VsdFtsb3dlckNvbnRvdXJJZF0sIGNvbnRvdXJJZCk7XG4gICAgICAgIGhvbGVPZltjb250b3VySWRdID0gbG93ZXJDb250b3VySWQ7XG4gICAgICAgIGRlcHRoW2NvbnRvdXJJZF0gID0gZGVwdGhbbG93ZXJDb250b3VySWRdICsgMTtcbiAgICAgICAgaXNIb2xlW2NvbnRvdXJJZF0gPSB0cnVlO1xuICAgICAgfSBlbHNlIGlmIChpc0hvbGVbbG93ZXJDb250b3VySWRdKSB7XG4gICAgICAgIGFkZEhvbGUocmVzdWx0W2hvbGVPZltsb3dlckNvbnRvdXJJZF1dLCBjb250b3VySWQpO1xuICAgICAgICBob2xlT2ZbY29udG91cklkXSA9IGhvbGVPZltsb3dlckNvbnRvdXJJZF07XG4gICAgICAgIGRlcHRoW2NvbnRvdXJJZF0gID0gZGVwdGhbbG93ZXJDb250b3VySWRdO1xuICAgICAgICBpc0hvbGVbY29udG91cklkXSA9IHRydWU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFyIHBvcyA9IGk7XG4gICAgdmFyIGluaXRpYWwgPSByZXN1bHRFdmVudHNbaV0ucG9pbnQ7XG4gICAgY29udG91ci5wdXNoKGluaXRpYWwpO1xuXG4gICAgd2hpbGUgKHBvcyA+PSBpKSB7XG4gICAgICBwcm9jZXNzZWRbcG9zXSA9IHRydWU7XG5cbiAgICAgIGlmIChyZXN1bHRFdmVudHNbcG9zXS5sZWZ0KSB7XG4gICAgICAgIHJlc3VsdEV2ZW50c1twb3NdLnJlc3VsdEluT3V0ID0gZmFsc2U7XG4gICAgICAgIHJlc3VsdEV2ZW50c1twb3NdLmNvbnRvdXJJZCAgID0gY29udG91cklkO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5yZXN1bHRJbk91dCA9IHRydWU7XG4gICAgICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQuY29udG91cklkICAgPSBjb250b3VySWQ7XG4gICAgICB9XG5cbiAgICAgIHBvcyA9IHJlc3VsdEV2ZW50c1twb3NdLnBvcztcbiAgICAgIHByb2Nlc3NlZFtwb3NdID0gdHJ1ZTtcblxuICAgICAgY29udG91ci5wdXNoKHJlc3VsdEV2ZW50c1twb3NdLnBvaW50KTtcbiAgICAgIHBvcyA9IG5leHRQb3MocG9zLCByZXN1bHRFdmVudHMsIHByb2Nlc3NlZCk7XG4gICAgfVxuXG4gICAgcG9zID0gcG9zID09PSAtMSA/IGkgOiBwb3M7XG5cbiAgICBwcm9jZXNzZWRbcG9zXSA9IHByb2Nlc3NlZFtyZXN1bHRFdmVudHNbcG9zXS5wb3NdID0gdHJ1ZTtcbiAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LnJlc3VsdEluT3V0ID0gdHJ1ZTtcbiAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LmNvbnRvdXJJZCAgID0gY29udG91cklkO1xuXG5cblxuXG4gICAgLy8gZGVwdGggaXMgZXZlblxuICAgIC8qIGVzbGludC1kaXNhYmxlIG5vLWJpdHdpc2UgKi9cbiAgICBpZiAoZGVwdGhbY29udG91cklkXSAmIDEpIHtcbiAgICAgIGNoYW5nZU9yaWVudGF0aW9uKGNvbnRvdXIpO1xuICAgIH1cbiAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLWJpdHdpc2UgKi9cbiAgfVxuXG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IHBvc1xuICogQHBhcmFtICB7QXJyYXkuPFN3ZWVwRXZlbnQ+fSByZXN1bHRFdmVudHNcbiAqIEBwYXJhbSAge0FycmF5LjxCb29sZWFuPn0gICAgcHJvY2Vzc2VkXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbmZ1bmN0aW9uIG5leHRQb3MocG9zLCByZXN1bHRFdmVudHMsIHByb2Nlc3NlZCkge1xuICB2YXIgbmV3UG9zID0gcG9zICsgMTtcbiAgdmFyIGxlbmd0aCA9IHJlc3VsdEV2ZW50cy5sZW5ndGg7XG4gIHdoaWxlIChuZXdQb3MgPCBsZW5ndGggJiZcbiAgICAgICAgIGVxdWFscyhyZXN1bHRFdmVudHNbbmV3UG9zXS5wb2ludCwgcmVzdWx0RXZlbnRzW3Bvc10ucG9pbnQpKSB7XG4gICAgaWYgKCFwcm9jZXNzZWRbbmV3UG9zXSkge1xuICAgICAgcmV0dXJuIG5ld1BvcztcbiAgICB9IGVsc2Uge1xuICAgICAgbmV3UG9zID0gbmV3UG9zICsgMTtcbiAgICB9XG4gIH1cblxuICBuZXdQb3MgPSBwb3MgLSAxO1xuXG4gIHdoaWxlIChwcm9jZXNzZWRbbmV3UG9zXSkge1xuICAgIG5ld1BvcyA9IG5ld1BvcyAtIDE7XG4gIH1cbiAgcmV0dXJuIG5ld1Bvcztcbn1cblxuXG5mdW5jdGlvbiB0cml2aWFsT3BlcmF0aW9uKHN1YmplY3QsIGNsaXBwaW5nLCBvcGVyYXRpb24pIHtcbiAgdmFyIHJlc3VsdCA9IG51bGw7XG4gIGlmIChzdWJqZWN0Lmxlbmd0aCAqIGNsaXBwaW5nLmxlbmd0aCA9PT0gMCkge1xuICAgIGlmIChvcGVyYXRpb24gPT09IElOVEVSU0VDVElPTikge1xuICAgICAgcmVzdWx0ID0gRU1QVFk7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IERJRkZFUkVOQ0UpIHtcbiAgICAgIHJlc3VsdCA9IHN1YmplY3Q7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFVOSU9OIHx8IG9wZXJhdGlvbiA9PT0gWE9SKSB7XG4gICAgICByZXN1bHQgPSAoc3ViamVjdC5sZW5ndGggPT09IDApID8gY2xpcHBpbmcgOiBzdWJqZWN0O1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmZ1bmN0aW9uIGNvbXBhcmVCQm94ZXMoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKSB7XG4gIHZhciByZXN1bHQgPSBudWxsO1xuICBpZiAoc2Jib3hbMF0gPiBjYmJveFsyXSB8fFxuICAgICAgY2Jib3hbMF0gPiBzYmJveFsyXSB8fFxuICAgICAgc2Jib3hbMV0gPiBjYmJveFszXSB8fFxuICAgICAgY2Jib3hbMV0gPiBzYmJveFszXSkge1xuICAgIGlmIChvcGVyYXRpb24gPT09IElOVEVSU0VDVElPTikge1xuICAgICAgcmVzdWx0ID0gRU1QVFk7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IERJRkZFUkVOQ0UpIHtcbiAgICAgIHJlc3VsdCA9IHN1YmplY3Q7XG4gICAgfSBlbHNlIGlmIChvcGVyYXRpb24gPT09IFVOSU9OIHx8IG9wZXJhdGlvbiA9PT0gWE9SKSB7XG4gICAgICByZXN1bHQgPSBzdWJqZWN0LmNvbmNhdChjbGlwcGluZyk7XG4gICAgfVxuICB9XG4gIHJldHVybiByZXN1bHQ7XG59XG5cblxuZnVuY3Rpb24gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgb3BlcmF0aW9uKSB7XG4gIHZhciB0cml2aWFsID0gdHJpdmlhbE9wZXJhdGlvbihzdWJqZWN0LCBjbGlwcGluZywgb3BlcmF0aW9uKTtcbiAgaWYgKHRyaXZpYWwpIHtcbiAgICByZXR1cm4gdHJpdmlhbCA9PT0gRU1QVFkgPyBudWxsIDogdHJpdmlhbDtcbiAgfVxuICB2YXIgc2Jib3ggPSBbSW5maW5pdHksIEluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eV07XG4gIHZhciBjYmJveCA9IFtJbmZpbml0eSwgSW5maW5pdHksIC1JbmZpbml0eSwgLUluZmluaXR5XTtcblxuICB2YXIgZXZlbnRRdWV1ZSA9IGZpbGxRdWV1ZShzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94KTtcblxuICB0cml2aWFsID0gY29tcGFyZUJCb3hlcyhzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pO1xuICBpZiAodHJpdmlhbCkge1xuICAgIHJldHVybiB0cml2aWFsID09PSBFTVBUWSA/IG51bGwgOiB0cml2aWFsO1xuICB9XG4gIHZhciBzb3J0ZWRFdmVudHMgPSBzdWJkaXZpZGVTZWdtZW50cyhldmVudFF1ZXVlLCBzdWJqZWN0LCBjbGlwcGluZywgc2Jib3gsIGNiYm94LCBvcGVyYXRpb24pO1xuICByZXR1cm4gY29ubmVjdEVkZ2VzKHNvcnRlZEV2ZW50cyk7XG59XG5cblxubW9kdWxlLmV4cG9ydHMgPSBib29sZWFuO1xuXG5cbm1vZHVsZS5leHBvcnRzLnVuaW9uID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIFVOSU9OKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMuZGlmZiA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBESUZGRVJFTkNFKTtcbn07XG5cblxubW9kdWxlLmV4cG9ydHMueG9yID0gZnVuY3Rpb24oc3ViamVjdCwgY2xpcHBpbmcpIHtcbiAgcmV0dXJuIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIFhPUik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLmludGVyc2VjdGlvbiA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBJTlRFUlNFQ1RJT04pO1xufTtcblxuXG4vKipcbiAqIEBlbnVtIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzLm9wZXJhdGlvbnMgPSB7XG4gIElOVEVSU0VDVElPTjogSU5URVJTRUNUSU9OLFxuICBESUZGRVJFTkNFOiAgIERJRkZFUkVOQ0UsXG4gIFVOSU9OOiAgICAgICAgVU5JT04sXG4gIFhPUjogICAgICAgICAgWE9SXG59O1xuXG5cbi8vIGZvciB0ZXN0aW5nXG5tb2R1bGUuZXhwb3J0cy5maWxsUXVldWUgICAgICAgICAgICA9IGZpbGxRdWV1ZTtcbm1vZHVsZS5leHBvcnRzLmNvbXB1dGVGaWVsZHMgICAgICAgID0gY29tcHV0ZUZpZWxkcztcbm1vZHVsZS5leHBvcnRzLnN1YmRpdmlkZVNlZ21lbnRzICAgID0gc3ViZGl2aWRlU2VnbWVudHM7XG5tb2R1bGUuZXhwb3J0cy5kaXZpZGVTZWdtZW50ICAgICAgICA9IGRpdmlkZVNlZ21lbnQ7XG5tb2R1bGUuZXhwb3J0cy5wb3NzaWJsZUludGVyc2VjdGlvbiA9IHBvc3NpYmxlSW50ZXJzZWN0aW9uO1xuIiwidmFyIEVQU0lMT04gPSAxZS05O1xuXG4vKipcbiAqIEZpbmRzIHRoZSBtYWduaXR1ZGUgb2YgdGhlIGNyb3NzIHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMgKGlmIHdlIHByZXRlbmRcbiAqIHRoZXkncmUgaW4gdGhyZWUgZGltZW5zaW9ucylcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBGaXJzdCB2ZWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFNlY29uZCB2ZWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgbWFnbml0dWRlIG9mIHRoZSBjcm9zcyBwcm9kdWN0XG4gKi9cbmZ1bmN0aW9uIGtyb3NzUHJvZHVjdChhLCBiKSB7XG4gIHJldHVybiBhWzBdICogYlsxXSAtIGFbMV0gKiBiWzBdO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBkb3QgcHJvZHVjdCBvZiB0d28gdmVjdG9ycy5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gYSBGaXJzdCB2ZWN0b3JcbiAqIEBwYXJhbSB7T2JqZWN0fSBiIFNlY29uZCB2ZWN0b3JcbiAqIEBwcml2YXRlXG4gKiBAcmV0dXJucyB7TnVtYmVyfSBUaGUgZG90IHByb2R1Y3RcbiAqL1xuZnVuY3Rpb24gZG90UHJvZHVjdChhLCBiKSB7XG4gIHJldHVybiBhWzBdICogYlswXSArIGFbMV0gKiBiWzFdO1xufVxuXG4vKipcbiAqIEZpbmRzIHRoZSBpbnRlcnNlY3Rpb24gKGlmIGFueSkgYmV0d2VlbiB0d28gbGluZSBzZWdtZW50cyBhIGFuZCBiLCBnaXZlbiB0aGVcbiAqIGxpbmUgc2VnbWVudHMnIGVuZCBwb2ludHMgYTEsIGEyIGFuZCBiMSwgYjIuXG4gKlxuICogVGhpcyBhbGdvcml0aG0gaXMgYmFzZWQgb24gU2NobmVpZGVyIGFuZCBFYmVybHkuXG4gKiBodHRwOi8vd3d3LmNpbWVjLm9yZy5hci9+bmNhbHZvL1NjaG5laWRlcl9FYmVybHkucGRmXG4gKiBQYWdlIDI0NC5cbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBhMSBwb2ludCBvZiBmaXJzdCBsaW5lXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBhMiBwb2ludCBvZiBmaXJzdCBsaW5lXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSBiMSBwb2ludCBvZiBzZWNvbmQgbGluZVxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYjIgcG9pbnQgb2Ygc2Vjb25kIGxpbmVcbiAqIEBwYXJhbSB7Qm9vbGVhbj19ICAgICAgIG5vRW5kcG9pbnRUb3VjaCB3aGV0aGVyIHRvIHNraXAgc2luZ2xlIHRvdWNocG9pbnRzXG4gKiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKG1lYW5pbmcgY29ubmVjdGVkIHNlZ21lbnRzKSBhc1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGludGVyc2VjdGlvbnNcbiAqIEByZXR1cm5zIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fE51bGx9IElmIHRoZSBsaW5lcyBpbnRlcnNlY3QsIHRoZSBwb2ludCBvZlxuICogaW50ZXJzZWN0aW9uLiBJZiB0aGV5IG92ZXJsYXAsIHRoZSB0d28gZW5kIHBvaW50cyBvZiB0aGUgb3ZlcmxhcHBpbmcgc2VnbWVudC5cbiAqIE90aGVyd2lzZSwgbnVsbC5cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihhMSwgYTIsIGIxLCBiMiwgbm9FbmRwb2ludFRvdWNoKSB7XG4gIC8vIFRoZSBhbGdvcml0aG0gZXhwZWN0cyBvdXIgbGluZXMgaW4gdGhlIGZvcm0gUCArIHNkLCB3aGVyZSBQIGlzIGEgcG9pbnQsXG4gIC8vIHMgaXMgb24gdGhlIGludGVydmFsIFswLCAxXSwgYW5kIGQgaXMgYSB2ZWN0b3IuXG4gIC8vIFdlIGFyZSBwYXNzZWQgdHdvIHBvaW50cy4gUCBjYW4gYmUgdGhlIGZpcnN0IHBvaW50IG9mIGVhY2ggcGFpci4gVGhlXG4gIC8vIHZlY3RvciwgdGhlbiwgY291bGQgYmUgdGhvdWdodCBvZiBhcyB0aGUgZGlzdGFuY2UgKGluIHggYW5kIHkgY29tcG9uZW50cylcbiAgLy8gZnJvbSB0aGUgZmlyc3QgcG9pbnQgdG8gdGhlIHNlY29uZCBwb2ludC5cbiAgLy8gU28gZmlyc3QsIGxldCdzIG1ha2Ugb3VyIHZlY3RvcnM6XG4gIHZhciB2YSA9IFthMlswXSAtIGExWzBdLCBhMlsxXSAtIGExWzFdXTtcbiAgdmFyIHZiID0gW2IyWzBdIC0gYjFbMF0sIGIyWzFdIC0gYjFbMV1dO1xuICAvLyBXZSBhbHNvIGRlZmluZSBhIGZ1bmN0aW9uIHRvIGNvbnZlcnQgYmFjayB0byByZWd1bGFyIHBvaW50IGZvcm06XG5cbiAgLyogZXNsaW50LWRpc2FibGUgYXJyb3ctYm9keS1zdHlsZSAqL1xuXG4gIGZ1bmN0aW9uIHRvUG9pbnQocCwgcywgZCkge1xuICAgIHJldHVybiBbXG4gICAgICBwWzBdICsgcyAqIGRbMF0sXG4gICAgICBwWzFdICsgcyAqIGRbMV1cbiAgICBdO1xuICB9XG5cbiAgLyogZXNsaW50LWVuYWJsZSBhcnJvdy1ib2R5LXN0eWxlICovXG5cbiAgLy8gVGhlIHJlc3QgaXMgcHJldHR5IG11Y2ggYSBzdHJhaWdodCBwb3J0IG9mIHRoZSBhbGdvcml0aG0uXG4gIHZhciBlID0gW2IxWzBdIC0gYTFbMF0sIGIxWzFdIC0gYTFbMV1dO1xuICB2YXIga3Jvc3MgPSBrcm9zc1Byb2R1Y3QodmEsIHZiKTtcbiAgdmFyIHNxcktyb3NzID0ga3Jvc3MgKiBrcm9zcztcbiAgdmFyIHNxckxlbkEgPSBkb3RQcm9kdWN0KHZhLCB2YSk7XG4gIHZhciBzcXJMZW5CID0gZG90UHJvZHVjdCh2YiwgdmIpO1xuXG4gIC8vIENoZWNrIGZvciBsaW5lIGludGVyc2VjdGlvbi4gVGhpcyB3b3JrcyBiZWNhdXNlIG9mIHRoZSBwcm9wZXJ0aWVzIG9mIHRoZVxuICAvLyBjcm9zcyBwcm9kdWN0IC0tIHNwZWNpZmljYWxseSwgdHdvIHZlY3RvcnMgYXJlIHBhcmFsbGVsIGlmIGFuZCBvbmx5IGlmIHRoZVxuICAvLyBjcm9zcyBwcm9kdWN0IGlzIHRoZSAwIHZlY3Rvci4gVGhlIGZ1bGwgY2FsY3VsYXRpb24gaW52b2x2ZXMgcmVsYXRpdmUgZXJyb3JcbiAgLy8gdG8gYWNjb3VudCBmb3IgcG9zc2libGUgdmVyeSBzbWFsbCBsaW5lIHNlZ21lbnRzLiBTZWUgU2NobmVpZGVyICYgRWJlcmx5XG4gIC8vIGZvciBkZXRhaWxzLlxuICBpZiAoc3FyS3Jvc3MgPiBFUFNJTE9OICogc3FyTGVuQSAqIHNxckxlbkIpIHtcbiAgICAvLyBJZiB0aGV5J3JlIG5vdCBwYXJhbGxlbCwgdGhlbiAoYmVjYXVzZSB0aGVzZSBhcmUgbGluZSBzZWdtZW50cykgdGhleVxuICAgIC8vIHN0aWxsIG1pZ2h0IG5vdCBhY3R1YWxseSBpbnRlcnNlY3QuIFRoaXMgY29kZSBjaGVja3MgdGhhdCB0aGVcbiAgICAvLyBpbnRlcnNlY3Rpb24gcG9pbnQgb2YgdGhlIGxpbmVzIGlzIGFjdHVhbGx5IG9uIGJvdGggbGluZSBzZWdtZW50cy5cbiAgICB2YXIgcyA9IGtyb3NzUHJvZHVjdChlLCB2YikgLyBrcm9zcztcbiAgICBpZiAocyA8IDAgfHwgcyA+IDEpIHtcbiAgICAgIC8vIG5vdCBvbiBsaW5lIHNlZ21lbnQgYVxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHZhciB0ID0ga3Jvc3NQcm9kdWN0KGUsIHZhKSAvIGtyb3NzO1xuICAgIGlmICh0IDwgMCB8fCB0ID4gMSkge1xuICAgICAgLy8gbm90IG9uIGxpbmUgc2VnbWVudCBiXG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIG5vRW5kcG9pbnRUb3VjaCA/IG51bGwgOiBbdG9Qb2ludChhMSwgcywgdmEpXTtcbiAgfVxuXG4gIC8vIElmIHdlJ3ZlIHJlYWNoZWQgdGhpcyBwb2ludCwgdGhlbiB0aGUgbGluZXMgYXJlIGVpdGhlciBwYXJhbGxlbCBvciB0aGVcbiAgLy8gc2FtZSwgYnV0IHRoZSBzZWdtZW50cyBjb3VsZCBvdmVybGFwIHBhcnRpYWxseSBvciBmdWxseSwgb3Igbm90IGF0IGFsbC5cbiAgLy8gU28gd2UgbmVlZCB0byBmaW5kIHRoZSBvdmVybGFwLCBpZiBhbnkuIFRvIGRvIHRoYXQsIHdlIGNhbiB1c2UgZSwgd2hpY2ggaXNcbiAgLy8gdGhlICh2ZWN0b3IpIGRpZmZlcmVuY2UgYmV0d2VlbiB0aGUgdHdvIGluaXRpYWwgcG9pbnRzLiBJZiB0aGlzIGlzIHBhcmFsbGVsXG4gIC8vIHdpdGggdGhlIGxpbmUgaXRzZWxmLCB0aGVuIHRoZSB0d28gbGluZXMgYXJlIHRoZSBzYW1lIGxpbmUsIGFuZCB0aGVyZSB3aWxsXG4gIC8vIGJlIG92ZXJsYXAuXG4gIHZhciBzcXJMZW5FID0gZG90UHJvZHVjdChlLCBlKTtcbiAga3Jvc3MgPSBrcm9zc1Byb2R1Y3QoZSwgdmEpO1xuICBzcXJLcm9zcyA9IGtyb3NzICoga3Jvc3M7XG5cbiAgaWYgKHNxcktyb3NzID4gRVBTSUxPTiAqIHNxckxlbkEgKiBzcXJMZW5FKSB7XG4gICAgLy8gTGluZXMgYXJlIGp1c3QgcGFyYWxsZWwsIG5vdCB0aGUgc2FtZS4gTm8gb3ZlcmxhcC5cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIHZhciBzYSA9IGRvdFByb2R1Y3QodmEsIGUpIC8gc3FyTGVuQTtcbiAgdmFyIHNiID0gc2EgKyBkb3RQcm9kdWN0KHZhLCB2YikgLyBzcXJMZW5BO1xuICB2YXIgc21pbiA9IE1hdGgubWluKHNhLCBzYik7XG4gIHZhciBzbWF4ID0gTWF0aC5tYXgoc2EsIHNiKTtcblxuICAvLyB0aGlzIGlzLCBlc3NlbnRpYWxseSwgdGhlIEZpbmRJbnRlcnNlY3Rpb24gYWN0aW5nIG9uIGZsb2F0cyBmcm9tXG4gIC8vIFNjaG5laWRlciAmIEViZXJseSwganVzdCBpbmxpbmVkIGludG8gdGhpcyBmdW5jdGlvbi5cbiAgaWYgKHNtaW4gPD0gMSAmJiBzbWF4ID49IDApIHtcblxuICAgIC8vIG92ZXJsYXAgb24gYW4gZW5kIHBvaW50XG4gICAgaWYgKHNtaW4gPT09IDEpIHtcbiAgICAgIHJldHVybiBub0VuZHBvaW50VG91Y2ggPyBudWxsIDogW3RvUG9pbnQoYTEsIHNtaW4gPiAwID8gc21pbiA6IDAsIHZhKV07XG4gICAgfVxuXG4gICAgaWYgKHNtYXggPT09IDApIHtcbiAgICAgIHJldHVybiBub0VuZHBvaW50VG91Y2ggPyBudWxsIDogW3RvUG9pbnQoYTEsIHNtYXggPCAxID8gc21heCA6IDEsIHZhKV07XG4gICAgfVxuXG4gICAgaWYgKG5vRW5kcG9pbnRUb3VjaCAmJiBzbWluID09PSAwICYmIHNtYXggPT09IDEpIHJldHVybiBudWxsO1xuXG4gICAgLy8gVGhlcmUncyBvdmVybGFwIG9uIGEgc2VnbWVudCAtLSB0d28gcG9pbnRzIG9mIGludGVyc2VjdGlvbi4gUmV0dXJuIGJvdGguXG4gICAgcmV0dXJuIFtcbiAgICAgIHRvUG9pbnQoYTEsIHNtaW4gPiAwID8gc21pbiA6IDAsIHZhKSxcbiAgICAgIHRvUG9pbnQoYTEsIHNtYXggPCAxID8gc21heCA6IDEsIHZhKSxcbiAgICBdO1xuICB9XG5cbiAgcmV0dXJuIG51bGw7XG59O1xuIiwiLyoqXG4gKiBTaWduZWQgYXJlYSBvZiB0aGUgdHJpYW5nbGUgKHAwLCBwMSwgcDIpXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDBcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc2lnbmVkQXJlYShwMCwgcDEsIHAyKSB7XG4gIHJldHVybiAocDBbMF0gLSBwMlswXSkgKiAocDFbMV0gLSBwMlsxXSkgLSAocDFbMF0gLSBwMlswXSkgKiAocDBbMV0gLSBwMlsxXSk7XG59O1xuIiwidmFyIHNpZ25lZEFyZWEgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG52YXIgRWRnZVR5cGUgICA9IHJlcXVpcmUoJy4vZWRnZV90eXBlJyk7XG5cblxuLyoqXG4gKiBTd2VlcGxpbmUgZXZlbnRcbiAqXG4gKiBAcGFyYW0ge0FycmF5LjxOdW1iZXI+fSAgcG9pbnRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gICAgICAgICBsZWZ0XG4gKiBAcGFyYW0ge1N3ZWVwRXZlbnQ9fSAgICAgb3RoZXJFdmVudFxuICogQHBhcmFtIHtCb29sZWFufSAgICAgICAgIGlzU3ViamVjdFxuICogQHBhcmFtIHtOdW1iZXJ9ICAgICAgICAgIGVkZ2VUeXBlXG4gKi9cbmZ1bmN0aW9uIFN3ZWVwRXZlbnQocG9pbnQsIGxlZnQsIG90aGVyRXZlbnQsIGlzU3ViamVjdCwgZWRnZVR5cGUpIHtcblxuICAvKipcbiAgICogSXMgbGVmdCBlbmRwb2ludD9cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmxlZnQgPSBsZWZ0O1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPE51bWJlcj59XG4gICAqL1xuICB0aGlzLnBvaW50ID0gcG9pbnQ7XG5cbiAgLyoqXG4gICAqIE90aGVyIGVkZ2UgcmVmZXJlbmNlXG4gICAqIEB0eXBlIHtTd2VlcEV2ZW50fVxuICAgKi9cbiAgdGhpcy5vdGhlckV2ZW50ID0gb3RoZXJFdmVudDtcblxuICAvKipcbiAgICogQmVsb25ncyB0byBzb3VyY2Ugb3IgY2xpcHBpbmcgcG9seWdvblxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuaXNTdWJqZWN0ID0gaXNTdWJqZWN0O1xuXG4gIC8qKlxuICAgKiBFZGdlIGNvbnRyaWJ1dGlvbiB0eXBlXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLnR5cGUgPSBlZGdlVHlwZSB8fCBFZGdlVHlwZS5OT1JNQUw7XG5cblxuICAvKipcbiAgICogSW4tb3V0IHRyYW5zaXRpb24gZm9yIHRoZSBzd2VlcGxpbmUgY3Jvc3NpbmcgcG9seWdvblxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuaW5PdXQgPSBmYWxzZTtcblxuXG4gIC8qKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMub3RoZXJJbk91dCA9IGZhbHNlO1xuXG4gIC8qKlxuICAgKiBQcmV2aW91cyBldmVudCBpbiByZXN1bHQ/XG4gICAqIEB0eXBlIHtTd2VlcEV2ZW50fVxuICAgKi9cbiAgdGhpcy5wcmV2SW5SZXN1bHQgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBEb2VzIGV2ZW50IGJlbG9uZyB0byByZXN1bHQ/XG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5pblJlc3VsdCA9IGZhbHNlO1xuXG5cbiAgLy8gY29ubmVjdGlvbiBzdGVwXG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5yZXN1bHRJbk91dCA9IGZhbHNlO1xufVxuXG5cblN3ZWVwRXZlbnQucHJvdG90eXBlID0ge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gIHBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQmVsb3c6IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gdGhpcy5sZWZ0ID9cbiAgICAgIHNpZ25lZEFyZWEgKHRoaXMucG9pbnQsIHRoaXMub3RoZXJFdmVudC5wb2ludCwgcCkgPiAwIDpcbiAgICAgIHNpZ25lZEFyZWEgKHRoaXMub3RoZXJFdmVudC5wb2ludCwgdGhpcy5wb2ludCwgcCkgPiAwO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgcFxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNBYm92ZTogZnVuY3Rpb24ocCkge1xuICAgIHJldHVybiAhdGhpcy5pc0JlbG93KHApO1xuICB9LFxuXG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc1ZlcnRpY2FsOiBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5wb2ludFswXSA9PT0gdGhpcy5vdGhlckV2ZW50LnBvaW50WzBdO1xuICB9XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFN3ZWVwRXZlbnQ7XG4iLCIndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gVGlueVF1ZXVlO1xuXG5mdW5jdGlvbiBUaW55UXVldWUoZGF0YSwgY29tcGFyZSkge1xuICAgIGlmICghKHRoaXMgaW5zdGFuY2VvZiBUaW55UXVldWUpKSByZXR1cm4gbmV3IFRpbnlRdWV1ZShkYXRhLCBjb21wYXJlKTtcblxuICAgIHRoaXMuZGF0YSA9IGRhdGEgfHwgW107XG4gICAgdGhpcy5sZW5ndGggPSB0aGlzLmRhdGEubGVuZ3RoO1xuICAgIHRoaXMuY29tcGFyZSA9IGNvbXBhcmUgfHwgZGVmYXVsdENvbXBhcmU7XG5cbiAgICBpZiAoZGF0YSkgZm9yICh2YXIgaSA9IE1hdGguZmxvb3IodGhpcy5sZW5ndGggLyAyKTsgaSA+PSAwOyBpLS0pIHRoaXMuX2Rvd24oaSk7XG59XG5cbmZ1bmN0aW9uIGRlZmF1bHRDb21wYXJlKGEsIGIpIHtcbiAgICByZXR1cm4gYSA8IGIgPyAtMSA6IGEgPiBiID8gMSA6IDA7XG59XG5cblRpbnlRdWV1ZS5wcm90b3R5cGUgPSB7XG5cbiAgICBwdXNoOiBmdW5jdGlvbiAoaXRlbSkge1xuICAgICAgICB0aGlzLmRhdGEucHVzaChpdGVtKTtcbiAgICAgICAgdGhpcy5sZW5ndGgrKztcbiAgICAgICAgdGhpcy5fdXAodGhpcy5sZW5ndGggLSAxKTtcbiAgICB9LFxuXG4gICAgcG9wOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHZhciB0b3AgPSB0aGlzLmRhdGFbMF07XG4gICAgICAgIHRoaXMuZGF0YVswXSA9IHRoaXMuZGF0YVt0aGlzLmxlbmd0aCAtIDFdO1xuICAgICAgICB0aGlzLmxlbmd0aC0tO1xuICAgICAgICB0aGlzLmRhdGEucG9wKCk7XG4gICAgICAgIHRoaXMuX2Rvd24oMCk7XG4gICAgICAgIHJldHVybiB0b3A7XG4gICAgfSxcblxuICAgIHBlZWs6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZGF0YVswXTtcbiAgICB9LFxuXG4gICAgX3VwOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgY29tcGFyZSA9IHRoaXMuY29tcGFyZTtcblxuICAgICAgICB3aGlsZSAocG9zID4gMCkge1xuICAgICAgICAgICAgdmFyIHBhcmVudCA9IE1hdGguZmxvb3IoKHBvcyAtIDEpIC8gMik7XG4gICAgICAgICAgICBpZiAoY29tcGFyZShkYXRhW3Bvc10sIGRhdGFbcGFyZW50XSkgPCAwKSB7XG4gICAgICAgICAgICAgICAgc3dhcChkYXRhLCBwYXJlbnQsIHBvcyk7XG4gICAgICAgICAgICAgICAgcG9zID0gcGFyZW50O1xuXG4gICAgICAgICAgICB9IGVsc2UgYnJlYWs7XG4gICAgICAgIH1cbiAgICB9LFxuXG4gICAgX2Rvd246IGZ1bmN0aW9uIChwb3MpIHtcbiAgICAgICAgdmFyIGRhdGEgPSB0aGlzLmRhdGEsXG4gICAgICAgICAgICBjb21wYXJlID0gdGhpcy5jb21wYXJlLFxuICAgICAgICAgICAgbGVuID0gdGhpcy5sZW5ndGg7XG5cbiAgICAgICAgd2hpbGUgKHRydWUpIHtcbiAgICAgICAgICAgIHZhciBsZWZ0ID0gMiAqIHBvcyArIDEsXG4gICAgICAgICAgICAgICAgcmlnaHQgPSBsZWZ0ICsgMSxcbiAgICAgICAgICAgICAgICBtaW4gPSBwb3M7XG5cbiAgICAgICAgICAgIGlmIChsZWZ0IDwgbGVuICYmIGNvbXBhcmUoZGF0YVtsZWZ0XSwgZGF0YVttaW5dKSA8IDApIG1pbiA9IGxlZnQ7XG4gICAgICAgICAgICBpZiAocmlnaHQgPCBsZW4gJiYgY29tcGFyZShkYXRhW3JpZ2h0XSwgZGF0YVttaW5dKSA8IDApIG1pbiA9IHJpZ2h0O1xuXG4gICAgICAgICAgICBpZiAobWluID09PSBwb3MpIHJldHVybjtcblxuICAgICAgICAgICAgc3dhcChkYXRhLCBtaW4sIHBvcyk7XG4gICAgICAgICAgICBwb3MgPSBtaW47XG4gICAgICAgIH1cbiAgICB9XG59O1xuXG5mdW5jdGlvbiBzd2FwKGRhdGEsIGksIGopIHtcbiAgICB2YXIgdG1wID0gZGF0YVtpXTtcbiAgICBkYXRhW2ldID0gZGF0YVtqXTtcbiAgICBkYXRhW2pdID0gdG1wO1xufVxuIiwiLyoqXG4gKiBPZmZzZXQgZWRnZSBvZiB0aGUgcG9seWdvblxuICpcbiAqIEBwYXJhbSAge09iamVjdH0gY3VycmVudFxuICogQHBhcmFtICB7T2JqZWN0fSBuZXh0XG4gKiBAY29zbnRydWN0b3JcbiAqL1xuZnVuY3Rpb24gRWRnZShjdXJyZW50LCBuZXh0KSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLmN1cnJlbnQgPSBjdXJyZW50O1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5uZXh0ID0gbmV4dDtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMuX2luTm9ybWFsID0gdGhpcy5pbndhcmRzTm9ybWFsKCk7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLl9vdXROb3JtYWwgPSB0aGlzLm91dHdhcmRzTm9ybWFsKCk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBvdXR3YXJkcyBub3JtYWxcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuRWRnZS5wcm90b3R5cGUub3V0d2FyZHNOb3JtYWwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGlud2FyZHMgPSB0aGlzLmlud2FyZHNOb3JtYWwoKTtcbiAgcmV0dXJuIFtcbiAgICAtaW53YXJkc1swXSxcbiAgICAtaW53YXJkc1sxXVxuICBdO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGlud2FyZHMgbm9ybWFsXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbkVkZ2UucHJvdG90eXBlLmlud2FyZHNOb3JtYWwgPSBmdW5jdGlvbigpIHtcbiAgdmFyIGR4ID0gdGhpcy5uZXh0WzBdIC0gdGhpcy5jdXJyZW50WzBdLFxuICAgICAgZHkgPSB0aGlzLm5leHRbMV0gLSB0aGlzLmN1cnJlbnRbMV0sXG4gICAgICBlZGdlTGVuZ3RoID0gTWF0aC5zcXJ0KGR4ICogZHggKyBkeSAqIGR5KTtcblxuICByZXR1cm4gW1xuICAgIC1keSAvIGVkZ2VMZW5ndGgsXG4gICAgIGR4IC8gZWRnZUxlbmd0aFxuICBdO1xufTtcblxuLyoqXG4gKiBPZmZzZXRzIHRoZSBlZGdlIGJ5IGR4LCBkeVxuICogQHBhcmFtICB7TnVtYmVyfSBkeFxuICogQHBhcmFtICB7TnVtYmVyfSBkeVxuICogQHJldHVybiB7RWRnZX1cbiAqL1xuRWRnZS5wcm90b3R5cGUub2Zmc2V0ID0gZnVuY3Rpb24oZHgsIGR5KSB7XG4gIHZhciBjdXJyZW50ID0gdGhpcy5jdXJyZW50LFxuICAgICAgbmV4dCA9IHRoaXMubmV4dDtcblxuICByZXR1cm4gbmV3IEVkZ2UoW1xuICAgIGN1cnJlbnRbMF0gKyBkeCxcbiAgICBjdXJyZW50WzFdICsgZHlcbiAgXSwgW1xuICAgIG5leHRbMF0gKyBkeCxcbiAgICBuZXh0WzFdICsgZHlcbiAgXSk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEVkZ2U7XG4iLCIoZnVuY3Rpb24gKGdsb2JhbCl7XG52YXIgRWRnZSA9IHJlcXVpcmUoJy4vZWRnZScpO1xudmFyIG1hcnRpbmV6ID0gZ2xvYmFsLm1hcnRpbmV6ID0gcmVxdWlyZSgnbWFydGluZXotcG9seWdvbi1jbGlwcGluZycpO1xuXG52YXIgYXRhbjIgPSBNYXRoLmF0YW4yO1xuXG4vKipcbiAqIE9mZnNldCBidWlsZGVyXG4gKlxuICogQHBhcmFtIHtBcnJheS48T2JqZWN0Pj19IHZlcnRpY2VzXG4gKiBAcGFyYW0ge051bWJlcj19ICAgICAgICBhcmNTZWdtZW50c1xuICogQGNvbnN0cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIE9mZnNldCh2ZXJ0aWNlcywgYXJjU2VnbWVudHMpIHtcblxuICAvKipcbiAgICogQHR5cGUge0FycmF5LjxPYmplY3Q+fVxuICAgKi9cbiAgdGhpcy52ZXJ0aWNlcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48RWRnZT59XG4gICAqL1xuICB0aGlzLmVkZ2VzID0gbnVsbDtcblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLl9jbG9zZWQgPSBmYWxzZTtcblxuICBpZiAodmVydGljZXMpIHtcbiAgICAgIHRoaXMuZGF0YSh2ZXJ0aWNlcyk7XG4gIH1cblxuICAvKipcbiAgICogU2VnbWVudHMgaW4gZWRnZSBib3VuZGluZyBhcmNoZXNcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHMgIT09IHVuZGVmaW5lZCA/IGFyY1NlZ21lbnRzIDogNTtcbn1cblxuLyoqXG4gKiBDaGFuZ2UgZGF0YSBzZXRcbiAqIEBwYXJhbSAge0FycmF5LjxBcnJheT59IHZlcnRpY2VzXG4gKiBAcmV0dXJuIHtPZmZzZXR9XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuZGF0YSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIHZlcnRpY2VzID0gdGhpcy52YWxpZGF0ZSh2ZXJ0aWNlcyk7XG5cbiAgdmFyIGVkZ2VzID0gW107XG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGVkZ2VzLnB1c2gobmV3IEVkZ2UodmVydGljZXNbaV0sIHZlcnRpY2VzWyhpICsgMSkgJSBsZW5dKSk7XG4gIH1cblxuICB0aGlzLnZlcnRpY2VzID0gdmVydGljZXM7XG4gIHRoaXMuZWRnZXMgPSBlZGdlcztcbiAgcmV0dXJuIHRoaXM7XG59O1xuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gYXJjU2VnbWVudHNcbiAqIEByZXR1cm4ge09mZnNldH1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5hcmNTZWdtZW50cyA9IGZ1bmN0aW9uKGFyY1NlZ21lbnRzKSB7XG4gIHRoaXMuX2FyY1NlZ21lbnRzID0gYXJjU2VnbWVudHM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBWYWxpZGF0ZXMgaWYgdGhlIGZpcnN0IGFuZCBsYXN0IHBvaW50cyByZXBlYXRcbiAqIFRPRE86IGNoZWNrIENDV1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxPYmplY3Q+fSB2ZXJ0aWNlc1xuICovXG5PZmZzZXQucHJvdG90eXBlLnZhbGlkYXRlID0gZnVuY3Rpb24odmVydGljZXMpIHtcbiAgdmFyIGxlbiA9IHZlcnRpY2VzLmxlbmd0aDtcbiAgaWYgKHZlcnRpY2VzWzBdWzBdID09PSB2ZXJ0aWNlc1tsZW4gLSAxXVswXSAmJlxuICAgIHZlcnRpY2VzWzBdWzFdID09PSB2ZXJ0aWNlc1tsZW4gLSAxXVsxXSkge1xuICAgIHZlcnRpY2VzID0gdmVydGljZXMuc2xpY2UoMCwgbGVuIC0gMSk7XG4gICAgdGhpcy5fY2xvc2VkID0gdHJ1ZTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG4vKipcbiAqIENyZWF0ZXMgYXJjaCBiZXR3ZWVuIHR3byBlZGdlc1xuICpcbiAqIEBwYXJhbSAge0FycmF5LjxPYmplY3Q+fSB2ZXJ0aWNlc1xuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGNlbnRlclxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHJhZGl1c1xuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIHN0YXJ0VmVydGV4XG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICAgICAgZW5kVmVydGV4XG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgc2VnbWVudHNcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICBvdXR3YXJkc1xuICovXG5PZmZzZXQucHJvdG90eXBlLmNyZWF0ZUFyYyA9IGZ1bmN0aW9uKHZlcnRpY2VzLCBjZW50ZXIsIHJhZGl1cywgc3RhcnRWZXJ0ZXgsXG4gICAgZW5kVmVydGV4LCBzZWdtZW50cywgb3V0d2FyZHMpIHtcblxuICB2YXIgUEkyID0gTWF0aC5QSSAqIDIsXG4gICAgICBzdGFydEFuZ2xlID0gYXRhbjIoc3RhcnRWZXJ0ZXhbMV0gLSBjZW50ZXJbMV0sIHN0YXJ0VmVydGV4WzBdIC0gY2VudGVyWzBdKSxcbiAgICAgIGVuZEFuZ2xlID0gYXRhbjIoZW5kVmVydGV4WzFdIC0gY2VudGVyWzFdLCBlbmRWZXJ0ZXhbMF0gLSBjZW50ZXJbMF0pO1xuXG4gIC8vIG9kZCBudW1iZXIgcGxlYXNlXG4gIGlmIChzZWdtZW50cyAlIDIgPT09IDApIHtcbiAgICBzZWdtZW50cyAtPSAxO1xuICB9XG5cbiAgaWYgKHN0YXJ0QW5nbGUgPCAwKSB7XG4gICAgc3RhcnRBbmdsZSArPSBQSTI7XG4gIH1cblxuICBpZiAoZW5kQW5nbGUgPCAwKSB7XG4gICAgZW5kQW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgdmFyIGFuZ2xlID0gKChzdGFydEFuZ2xlID4gZW5kQW5nbGUpID9cbiAgICAgICAgICAgICAgIChzdGFydEFuZ2xlIC0gZW5kQW5nbGUpIDpcbiAgICAgICAgICAgICAgIChzdGFydEFuZ2xlICsgUEkyIC0gZW5kQW5nbGUpKSxcbiAgICAgIHNlZ21lbnRBbmdsZSA9ICgob3V0d2FyZHMpID8gLWFuZ2xlIDogUEkyIC0gYW5nbGUpIC8gc2VnbWVudHM7XG5cbiAgdmVydGljZXMucHVzaChzdGFydFZlcnRleCk7XG4gIGZvciAodmFyIGkgPSAxOyBpIDwgc2VnbWVudHM7ICsraSkge1xuICAgIGFuZ2xlID0gc3RhcnRBbmdsZSArIHNlZ21lbnRBbmdsZSAqIGk7XG4gICAgdmVydGljZXMucHVzaChbXG4gICAgICBjZW50ZXJbMF0gKyBNYXRoLmNvcyhhbmdsZSkgKiByYWRpdXMsXG4gICAgICBjZW50ZXJbMV0gKyBNYXRoLnNpbihhbmdsZSkgKiByYWRpdXNcbiAgICBdKTtcbiAgfVxuICB2ZXJ0aWNlcy5wdXNoKGVuZFZlcnRleCk7XG4gIHJldHVybiB2ZXJ0aWNlcztcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmVuc3VyZUxhc3RQb2ludCA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIGlmICh0aGlzLl9jbG9zZWQpIHtcbiAgICB2ZXJ0aWNlcy5wdXNoKFtcbiAgICAgIHZlcnRpY2VzWzBdWzBdLFxuICAgICAgdmVydGljZXNbMF1bMV1cbiAgICBdKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG4vKipcbiAqIERlY2lkZXMgYnkgdGhlIHNpZ24gaWYgaXQncyBhIHBhZGRpbmcgb3IgYSBtYXJnaW5cbiAqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxPYmplY3Q+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgcmV0dXJuIGRpc3QgPT09IDAgPyB0aGlzLnZlcnRpY2VzIDpcbiAgICAgIChkaXN0ID4gMCA/IHRoaXMubWFyZ2luKGRpc3QpIDogdGhpcy5wYWRkaW5nKC1kaXN0KSk7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgICAgICAgIHB0MVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICAgICAgICAgcHQyXG4gKiBAcGFyYW0gIHtOdW1iZXJ9ICAgICAgICAgICAgICAgICBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48QXJyYXkuPE51bWJlcj4+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLl9vZmZzZXRTZWdtZW50ID0gZnVuY3Rpb24odmVydGljZXMsIHB0MSwgcHQyLCBkaXN0KSB7XG4gIHZhciBlZGdlcyA9IFtuZXcgRWRnZShwdDEsIHB0MiksIG5ldyBFZGdlKHB0MiwgcHQxKV07XG4gIHZhciBpLCBsZW4gPSAyO1xuXG4gIHZhciBvZmZzZXRzID0gW107XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIGVkZ2UgPSBlZGdlc1tpXTtcbiAgICB2YXIgZHggPSBlZGdlLl9pbk5vcm1hbFswXSAqIGRpc3Q7XG4gICAgdmFyIGR5ID0gZWRnZS5faW5Ob3JtYWxbMV0gKiBkaXN0O1xuXG4gICAgb2Zmc2V0cy5wdXNoKGVkZ2Uub2Zmc2V0KGR4LCBkeSkpO1xuICB9XG5cbiAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgdmFyIHRoaXNFZGdlID0gb2Zmc2V0c1tpXSxcbiAgICAgICAgcHJldkVkZ2UgPSBvZmZzZXRzWyhpICsgbGVuIC0gMSkgJSBsZW5dO1xuICAgIHRoaXMuY3JlYXRlQXJjKFxuICAgICAgICAgICAgICAgIHZlcnRpY2VzLFxuICAgICAgICAgICAgICAgIGVkZ2VzW2ldLmN1cnJlbnQsIC8vIHAxIG9yIHAyXG4gICAgICAgICAgICAgICAgZGlzdCxcbiAgICAgICAgICAgICAgICBwcmV2RWRnZS5uZXh0LFxuICAgICAgICAgICAgICAgIHRoaXNFZGdlLmN1cnJlbnQsXG4gICAgICAgICAgICAgICAgdGhpcy5fYXJjU2VnbWVudHMsXG4gICAgICAgICAgICAgICAgdHJ1ZVxuICAgICAgICAgICAgKTtcbiAgfVxuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5tYXJnaW4gPSBmdW5jdGlvbihkaXN0KSB7XG4gIGlmIChkaXN0ID09PSAwKSByZXR1cm4gdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG5cbiAgdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG4gIHZhciB1bmlvbiA9IHRoaXMub2Zmc2V0TGluZShkaXN0KTtcbiAgdW5pb24gPSBtYXJ0aW5lei51bmlvbih1bmlvbiwgW3RoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpXSk7XG4gIHJldHVybiB1bmlvbjtcbn07XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGRpc3RcbiAqIEByZXR1cm4ge0FycmF5LjxOdW1iZXI+fVxuICovXG5PZmZzZXQucHJvdG90eXBlLnBhZGRpbmcgPSBmdW5jdGlvbihkaXN0KSB7XG4gIGlmIChkaXN0ID09PSAwKSByZXR1cm4gdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG5cbiAgdGhpcy5lbnN1cmVMYXN0UG9pbnQodGhpcy52ZXJ0aWNlcyk7XG4gIHZhciB1bmlvbiA9IHRoaXMub2Zmc2V0TGluZShkaXN0KTtcbiAgdmFyIGRpZmYgPSBtYXJ0aW5lei5kaWZmKHRoaXMudmVydGljZXMsIHVuaW9uKTtcbiAgcmV0dXJuIGRpZmY7XG59O1xuXG5cbi8qKlxuICogQ3JlYXRlcyBtYXJnaW4gcG9seWdvblxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXRMaW5lID0gZnVuY3Rpb24oZGlzdCkge1xuICBpZiAoZGlzdCA9PT0gMCkgcmV0dXJuIHRoaXMudmVydGljZXM7XG5cbiAgdmFyIHZlcnRpY2VzID0gW107XG4gIHZhciB1bmlvbiAgICA9IFtdO1xuICB0aGlzLl9jbG9zZWQgPSB0cnVlO1xuXG4gIGZvciAodmFyIGkgPSAwLCBsZW4gPSB0aGlzLnZlcnRpY2VzLmxlbmd0aCAtIDE7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBzZWdtZW50ID0gdGhpcy5lbnN1cmVMYXN0UG9pbnQoXG4gICAgICAgIHRoaXMuX29mZnNldFNlZ21lbnQoW10sIHRoaXMudmVydGljZXNbaV0sIHRoaXMudmVydGljZXNbaSArIDFdLCBkaXN0KVxuICAgICk7XG4gICAgdmVydGljZXMucHVzaChzZWdtZW50KTtcbiAgICB1bmlvbiA9IChpID09PSAwKSA/IHNlZ21lbnQgOiBtYXJ0aW5lei51bmlvbih1bmlvbiwgc2VnbWVudCk7XG4gIH1cblxuICByZXR1cm4gdGhpcy52ZXJ0aWNlcy5sZW5ndGggPiAyID8gdW5pb24gOiBbdW5pb25dO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBPZmZzZXQ7XG5cbn0pLmNhbGwodGhpcyx0eXBlb2YgZ2xvYmFsICE9PSBcInVuZGVmaW5lZFwiID8gZ2xvYmFsIDogdHlwZW9mIHNlbGYgIT09IFwidW5kZWZpbmVkXCIgPyBzZWxmIDogdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiA/IHdpbmRvdyA6IHt9KVxuLy8jIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ6dXRmLTg7YmFzZTY0LGV5SjJaWEp6YVc5dUlqb3pMQ0p6YjNWeVkyVnpJanBiSW5OeVl5OXZabVp6WlhRdWFuTWlYU3dpYm1GdFpYTWlPbHRkTENKdFlYQndhVzVuY3lJNklqdEJRVUZCTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRU0lzSW1acGJHVWlPaUpuWlc1bGNtRjBaV1F1YW5NaUxDSnpiM1Z5WTJWU2IyOTBJam9pSWl3aWMyOTFjbU5sYzBOdmJuUmxiblFpT2xzaWRtRnlJRVZrWjJVZ1BTQnlaWEYxYVhKbEtDY3VMMlZrWjJVbktUdGNiblpoY2lCdFlYSjBhVzVsZWlBOUlHZHNiMkpoYkM1dFlYSjBhVzVsZWlBOUlISmxjWFZwY21Vb0oyMWhjblJwYm1WNkxYQnZiSGxuYjI0dFkyeHBjSEJwYm1jbktUdGNibHh1ZG1GeUlHRjBZVzR5SUQwZ1RXRjBhQzVoZEdGdU1qdGNibHh1THlvcVhHNGdLaUJQWm1aelpYUWdZblZwYkdSbGNseHVJQ3BjYmlBcUlFQndZWEpoYlNCN1FYSnlZWGt1UEU5aWFtVmpkRDQ5ZlNCMlpYSjBhV05sYzF4dUlDb2dRSEJoY21GdElIdE9kVzFpWlhJOWZTQWdJQ0FnSUNBZ1lYSmpVMlZuYldWdWRITmNiaUFxSUVCamIyNXpkSEoxWTNSdmNseHVJQ292WEc1bWRXNWpkR2x2YmlCUFptWnpaWFFvZG1WeWRHbGpaWE1zSUdGeVkxTmxaMjFsYm5SektTQjdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQjBlWEJsSUh0QmNuSmhlUzQ4VDJKcVpXTjBQbjFjYmlBZ0lDb3ZYRzRnSUhSb2FYTXVkbVZ5ZEdsalpYTWdQU0J1ZFd4c08xeHVYRzRnSUM4cUtseHVJQ0FnS2lCQWRIbHdaU0I3UVhKeVlYa3VQRVZrWjJVK2ZWeHVJQ0FnS2k5Y2JpQWdkR2hwY3k1bFpHZGxjeUE5SUc1MWJHdzdYRzVjYmlBZ0x5b3FYRzRnSUNBcUlFQjBlWEJsSUh0Q2IyOXNaV0Z1ZlZ4dUlDQWdLaTljYmlBZ2RHaHBjeTVmWTJ4dmMyVmtJRDBnWm1Gc2MyVTdYRzVjYmlBZ2FXWWdLSFpsY25ScFkyVnpLU0I3WEc0Z0lDQWdJQ0IwYUdsekxtUmhkR0VvZG1WeWRHbGpaWE1wTzF4dUlDQjlYRzVjYmlBZ0x5b3FYRzRnSUNBcUlGTmxaMjFsYm5SeklHbHVJR1ZrWjJVZ1ltOTFibVJwYm1jZ1lYSmphR1Z6WEc0Z0lDQXFJRUIwZVhCbElIdE9kVzFpWlhKOVhHNGdJQ0FxTDF4dUlDQjBhR2x6TGw5aGNtTlRaV2R0Wlc1MGN5QTlJR0Z5WTFObFoyMWxiblJ6SUNFOVBTQjFibVJsWm1sdVpXUWdQeUJoY21OVFpXZHRaVzUwY3lBNklEVTdYRzU5WEc1Y2JpOHFLbHh1SUNvZ1EyaGhibWRsSUdSaGRHRWdjMlYwWEc0Z0tpQkFjR0Z5WVcwZ0lIdEJjbkpoZVM0OFFYSnlZWGsrZlNCMlpYSjBhV05sYzF4dUlDb2dRSEpsZEhWeWJpQjdUMlptYzJWMGZWeHVJQ292WEc1UFptWnpaWFF1Y0hKdmRHOTBlWEJsTG1SaGRHRWdQU0JtZFc1amRHbHZiaWgyWlhKMGFXTmxjeWtnZTF4dUlDQjJaWEowYVdObGN5QTlJSFJvYVhNdWRtRnNhV1JoZEdVb2RtVnlkR2xqWlhNcE8xeHVYRzRnSUhaaGNpQmxaR2RsY3lBOUlGdGRPMXh1SUNCbWIzSWdLSFpoY2lCcElEMGdNQ3dnYkdWdUlEMGdkbVZ5ZEdsalpYTXViR1Z1WjNSb095QnBJRHdnYkdWdU95QnBLeXNwSUh0Y2JpQWdJQ0JsWkdkbGN5NXdkWE5vS0c1bGR5QkZaR2RsS0habGNuUnBZMlZ6VzJsZExDQjJaWEowYVdObGMxc29hU0FySURFcElDVWdiR1Z1WFNrcE8xeHVJQ0I5WEc1Y2JpQWdkR2hwY3k1MlpYSjBhV05sY3lBOUlIWmxjblJwWTJWek8xeHVJQ0IwYUdsekxtVmtaMlZ6SUQwZ1pXUm5aWE03WEc0Z0lISmxkSFZ5YmlCMGFHbHpPMXh1ZlR0Y2JseHVMeW9xWEc0Z0tpQkFjR0Z5WVcwZ0lIdE9kVzFpWlhKOUlHRnlZMU5sWjIxbGJuUnpYRzRnS2lCQWNtVjBkWEp1SUh0UFptWnpaWFI5WEc0Z0tpOWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXVZWEpqVTJWbmJXVnVkSE1nUFNCbWRXNWpkR2x2YmloaGNtTlRaV2R0Wlc1MGN5a2dlMXh1SUNCMGFHbHpMbDloY21OVFpXZHRaVzUwY3lBOUlHRnlZMU5sWjIxbGJuUnpPMXh1SUNCeVpYUjFjbTRnZEdocGN6dGNibjA3WEc1Y2JpOHFLbHh1SUNvZ1ZtRnNhV1JoZEdWeklHbG1JSFJvWlNCbWFYSnpkQ0JoYm1RZ2JHRnpkQ0J3YjJsdWRITWdjbVZ3WldGMFhHNGdLaUJVVDBSUE9pQmphR1ZqYXlCRFExZGNiaUFxWEc0Z0tpQkFjR0Z5WVcwZ0lIdEJjbkpoZVM0OFQySnFaV04wUG4wZ2RtVnlkR2xqWlhOY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzUyWVd4cFpHRjBaU0E5SUdaMWJtTjBhVzl1S0habGNuUnBZMlZ6S1NCN1hHNGdJSFpoY2lCc1pXNGdQU0IyWlhKMGFXTmxjeTVzWlc1bmRHZzdYRzRnSUdsbUlDaDJaWEowYVdObGMxc3dYVnN3WFNBOVBUMGdkbVZ5ZEdsalpYTmJiR1Z1SUMwZ01WMWJNRjBnSmlaY2JpQWdJQ0IyWlhKMGFXTmxjMXN3WFZzeFhTQTlQVDBnZG1WeWRHbGpaWE5iYkdWdUlDMGdNVjFiTVYwcElIdGNiaUFnSUNCMlpYSjBhV05sY3lBOUlIWmxjblJwWTJWekxuTnNhV05sS0RBc0lHeGxiaUF0SURFcE8xeHVJQ0FnSUhSb2FYTXVYMk5zYjNObFpDQTlJSFJ5ZFdVN1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUhabGNuUnBZMlZ6TzF4dWZUdGNibHh1THlvcVhHNGdLaUJEY21WaGRHVnpJR0Z5WTJnZ1ltVjBkMlZsYmlCMGQyOGdaV1JuWlhOY2JpQXFYRzRnS2lCQWNHRnlZVzBnSUh0QmNuSmhlUzQ4VDJKcVpXTjBQbjBnZG1WeWRHbGpaWE5jYmlBcUlFQndZWEpoYlNBZ2UwOWlhbVZqZEgwZ0lDQWdJQ0FnSUNCalpXNTBaWEpjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ0lDQWdJQ0FnSUNCeVlXUnBkWE5jYmlBcUlFQndZWEpoYlNBZ2UwOWlhbVZqZEgwZ0lDQWdJQ0FnSUNCemRHRnlkRlpsY25SbGVGeHVJQ29nUUhCaGNtRnRJQ0I3VDJKcVpXTjBmU0FnSUNBZ0lDQWdJR1Z1WkZabGNuUmxlRnh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNBZ0lDQWdJQ0FnSUhObFoyMWxiblJ6WEc0Z0tpQkFjR0Z5WVcwZ0lIdENiMjlzWldGdWZTQWdJQ0FnSUNBZ2IzVjBkMkZ5WkhOY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzVqY21WaGRHVkJjbU1nUFNCbWRXNWpkR2x2YmloMlpYSjBhV05sY3l3Z1kyVnVkR1Z5TENCeVlXUnBkWE1zSUhOMFlYSjBWbVZ5ZEdWNExGeHVJQ0FnSUdWdVpGWmxjblJsZUN3Z2MyVm5iV1Z1ZEhNc0lHOTFkSGRoY21SektTQjdYRzVjYmlBZ2RtRnlJRkJKTWlBOUlFMWhkR2d1VUVrZ0tpQXlMRnh1SUNBZ0lDQWdjM1JoY25SQmJtZHNaU0E5SUdGMFlXNHlLSE4wWVhKMFZtVnlkR1Y0V3pGZElDMGdZMlZ1ZEdWeVd6RmRMQ0J6ZEdGeWRGWmxjblJsZUZzd1hTQXRJR05sYm5SbGNsc3dYU2tzWEc0Z0lDQWdJQ0JsYm1SQmJtZHNaU0E5SUdGMFlXNHlLR1Z1WkZabGNuUmxlRnN4WFNBdElHTmxiblJsY2xzeFhTd2daVzVrVm1WeWRHVjRXekJkSUMwZ1kyVnVkR1Z5V3pCZEtUdGNibHh1SUNBdkx5QnZaR1FnYm5WdFltVnlJSEJzWldGelpWeHVJQ0JwWmlBb2MyVm5iV1Z1ZEhNZ0pTQXlJRDA5UFNBd0tTQjdYRzRnSUNBZ2MyVm5iV1Z1ZEhNZ0xUMGdNVHRjYmlBZ2ZWeHVYRzRnSUdsbUlDaHpkR0Z5ZEVGdVoyeGxJRHdnTUNrZ2UxeHVJQ0FnSUhOMFlYSjBRVzVuYkdVZ0t6MGdVRWt5TzF4dUlDQjlYRzVjYmlBZ2FXWWdLR1Z1WkVGdVoyeGxJRHdnTUNrZ2UxeHVJQ0FnSUdWdVpFRnVaMnhsSUNzOUlGQkpNanRjYmlBZ2ZWeHVYRzRnSUhaaGNpQmhibWRzWlNBOUlDZ29jM1JoY25SQmJtZHNaU0ErSUdWdVpFRnVaMnhsS1NBL1hHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBb2MzUmhjblJCYm1kc1pTQXRJR1Z1WkVGdVoyeGxLU0E2WEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FvYzNSaGNuUkJibWRzWlNBcklGQkpNaUF0SUdWdVpFRnVaMnhsS1Nrc1hHNGdJQ0FnSUNCelpXZHRaVzUwUVc1bmJHVWdQU0FvS0c5MWRIZGhjbVJ6S1NBL0lDMWhibWRzWlNBNklGQkpNaUF0SUdGdVoyeGxLU0F2SUhObFoyMWxiblJ6TzF4dVhHNGdJSFpsY25ScFkyVnpMbkIxYzJnb2MzUmhjblJXWlhKMFpYZ3BPMXh1SUNCbWIzSWdLSFpoY2lCcElEMGdNVHNnYVNBOElITmxaMjFsYm5Sek95QXJLMmtwSUh0Y2JpQWdJQ0JoYm1kc1pTQTlJSE4wWVhKMFFXNW5iR1VnS3lCelpXZHRaVzUwUVc1bmJHVWdLaUJwTzF4dUlDQWdJSFpsY25ScFkyVnpMbkIxYzJnb1cxeHVJQ0FnSUNBZ1kyVnVkR1Z5V3pCZElDc2dUV0YwYUM1amIzTW9ZVzVuYkdVcElDb2djbUZrYVhWekxGeHVJQ0FnSUNBZ1kyVnVkR1Z5V3pGZElDc2dUV0YwYUM1emFXNG9ZVzVuYkdVcElDb2djbUZrYVhWelhHNGdJQ0FnWFNrN1hHNGdJSDFjYmlBZ2RtVnlkR2xqWlhNdWNIVnphQ2hsYm1SV1pYSjBaWGdwTzF4dUlDQnlaWFIxY200Z2RtVnlkR2xqWlhNN1hHNTlPMXh1WEc1Y2JpOHFLbHh1SUNvZ1FIQmhjbUZ0SUNCN1FYSnlZWGt1UEU5aWFtVmpkRDU5SUhabGNuUnBZMlZ6WEc0Z0tpQkFjbVYwZFhKdUlIdEJjbkpoZVM0OFQySnFaV04wUG4xY2JpQXFMMXh1VDJabWMyVjBMbkJ5YjNSdmRIbHdaUzVsYm5OMWNtVk1ZWE4wVUc5cGJuUWdQU0JtZFc1amRHbHZiaWgyWlhKMGFXTmxjeWtnZTF4dUlDQnBaaUFvZEdocGN5NWZZMnh2YzJWa0tTQjdYRzRnSUNBZ2RtVnlkR2xqWlhNdWNIVnphQ2hiWEc0Z0lDQWdJQ0IyWlhKMGFXTmxjMXN3WFZzd1hTeGNiaUFnSUNBZ0lIWmxjblJwWTJWeld6QmRXekZkWEc0Z0lDQWdYU2s3WEc0Z0lIMWNiaUFnY21WMGRYSnVJSFpsY25ScFkyVnpPMXh1ZlR0Y2JseHVMeW9xWEc0Z0tpQkVaV05wWkdWeklHSjVJSFJvWlNCemFXZHVJR2xtSUdsMEozTWdZU0J3WVdSa2FXNW5JRzl5SUdFZ2JXRnlaMmx1WEc0Z0tseHVJQ29nUUhCaGNtRnRJQ0I3VG5WdFltVnlmU0JrYVhOMFhHNGdLaUJBY21WMGRYSnVJSHRCY25KaGVTNDhUMkpxWldOMFBuMWNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1dlptWnpaWFFnUFNCbWRXNWpkR2x2Ymloa2FYTjBLU0I3WEc0Z0lISmxkSFZ5YmlCa2FYTjBJRDA5UFNBd0lEOGdkR2hwY3k1MlpYSjBhV05sY3lBNlhHNGdJQ0FnSUNBb1pHbHpkQ0ErSURBZ1B5QjBhR2x6TG0xaGNtZHBiaWhrYVhOMEtTQTZJSFJvYVhNdWNHRmtaR2x1WnlndFpHbHpkQ2twTzF4dWZUdGNibHh1WEc0dktpcGNiaUFxSUVCd1lYSmhiU0FnZTBGeWNtRjVManhCY25KaGVTNDhUblZ0WW1WeVBqNTlJSFpsY25ScFkyVnpYRzRnS2lCQWNHRnlZVzBnSUh0QmNuSmhlUzQ4VG5WdFltVnlQbjBnSUNBZ0lDQWdJQ0J3ZERGY2JpQXFJRUJ3WVhKaGJTQWdlMEZ5Y21GNUxqeE9kVzFpWlhJK2ZTQWdJQ0FnSUNBZ0lIQjBNbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnWkdsemRGeHVJQ29nUUhKbGRIVnliaUI3UVhKeVlYa3VQRUZ5Y21GNUxqeE9kVzFpWlhJK1BuMWNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1ZmIyWm1jMlYwVTJWbmJXVnVkQ0E5SUdaMWJtTjBhVzl1S0habGNuUnBZMlZ6TENCd2RERXNJSEIwTWl3Z1pHbHpkQ2tnZTF4dUlDQjJZWElnWldSblpYTWdQU0JiYm1WM0lFVmtaMlVvY0hReExDQndkRElwTENCdVpYY2dSV1JuWlNod2RESXNJSEIwTVNsZE8xeHVJQ0IyWVhJZ2FTd2diR1Z1SUQwZ01qdGNibHh1SUNCMllYSWdiMlptYzJWMGN5QTlJRnRkTzF4dVhHNGdJR1p2Y2lBb2FTQTlJREE3SUdrZ1BDQnNaVzQ3SUdrckt5a2dlMXh1SUNBZ0lIWmhjaUJsWkdkbElEMGdaV1JuWlhOYmFWMDdYRzRnSUNBZ2RtRnlJR1I0SUQwZ1pXUm5aUzVmYVc1T2IzSnRZV3hiTUYwZ0tpQmthWE4wTzF4dUlDQWdJSFpoY2lCa2VTQTlJR1ZrWjJVdVgybHVUbTl5YldGc1d6RmRJQ29nWkdsemREdGNibHh1SUNBZ0lHOW1abk5sZEhNdWNIVnphQ2hsWkdkbExtOW1abk5sZENoa2VDd2daSGtwS1R0Y2JpQWdmVnh1WEc0Z0lHWnZjaUFvYVNBOUlEQTdJR2tnUENCc1pXNDdJR2tyS3lrZ2UxeHVJQ0FnSUhaaGNpQjBhR2x6UldSblpTQTlJRzltWm5ObGRITmJhVjBzWEc0Z0lDQWdJQ0FnSUhCeVpYWkZaR2RsSUQwZ2IyWm1jMlYwYzFzb2FTQXJJR3hsYmlBdElERXBJQ1VnYkdWdVhUdGNiaUFnSUNCMGFHbHpMbU55WldGMFpVRnlZeWhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0IyWlhKMGFXTmxjeXhjYmlBZ0lDQWdJQ0FnSUNBZ0lDQWdJQ0JsWkdkbGMxdHBYUzVqZFhKeVpXNTBMQ0F2THlCd01TQnZjaUJ3TWx4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUdScGMzUXNYRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQWdjSEpsZGtWa1oyVXVibVY0ZEN4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMGFHbHpSV1JuWlM1amRYSnlaVzUwTEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSb2FYTXVYMkZ5WTFObFoyMWxiblJ6TEZ4dUlDQWdJQ0FnSUNBZ0lDQWdJQ0FnSUhSeWRXVmNiaUFnSUNBZ0lDQWdJQ0FnSUNrN1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUhabGNuUnBZMlZ6TzF4dWZUdGNibHh1WEc0dktpcGNiaUFxSUVCd1lYSmhiU0FnZTA1MWJXSmxjbjBnWkdsemRGeHVJQ29nUUhKbGRIVnliaUI3UVhKeVlYa3VQRTUxYldKbGNqNTlYRzRnS2k5Y2JrOW1abk5sZEM1d2NtOTBiM1I1Y0dVdWJXRnlaMmx1SUQwZ1puVnVZM1JwYjI0b1pHbHpkQ2tnZTF4dUlDQnBaaUFvWkdsemRDQTlQVDBnTUNrZ2NtVjBkWEp1SUhSb2FYTXVaVzV6ZFhKbFRHRnpkRkJ2YVc1MEtIUm9hWE11ZG1WeWRHbGpaWE1wTzF4dVhHNGdJSFJvYVhNdVpXNXpkWEpsVEdGemRGQnZhVzUwS0hSb2FYTXVkbVZ5ZEdsalpYTXBPMXh1SUNCMllYSWdkVzVwYjI0Z1BTQjBhR2x6TG05bVpuTmxkRXhwYm1Vb1pHbHpkQ2s3WEc0Z0lIVnVhVzl1SUQwZ2JXRnlkR2x1WlhvdWRXNXBiMjRvZFc1cGIyNHNJRnQwYUdsekxtVnVjM1Z5WlV4aGMzUlFiMmx1ZENoMGFHbHpMblpsY25ScFkyVnpLVjBwTzF4dUlDQnlaWFIxY200Z2RXNXBiMjQ3WEc1OU8xeHVYRzVjYmk4cUtseHVJQ29nUUhCaGNtRnRJQ0I3VG5WdFltVnlmU0JrYVhOMFhHNGdLaUJBY21WMGRYSnVJSHRCY25KaGVTNDhUblZ0WW1WeVBuMWNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1d1lXUmthVzVuSUQwZ1puVnVZM1JwYjI0b1pHbHpkQ2tnZTF4dUlDQnBaaUFvWkdsemRDQTlQVDBnTUNrZ2NtVjBkWEp1SUhSb2FYTXVaVzV6ZFhKbFRHRnpkRkJ2YVc1MEtIUm9hWE11ZG1WeWRHbGpaWE1wTzF4dVhHNGdJSFJvYVhNdVpXNXpkWEpsVEdGemRGQnZhVzUwS0hSb2FYTXVkbVZ5ZEdsalpYTXBPMXh1SUNCMllYSWdkVzVwYjI0Z1BTQjBhR2x6TG05bVpuTmxkRXhwYm1Vb1pHbHpkQ2s3WEc0Z0lIWmhjaUJrYVdabUlEMGdiV0Z5ZEdsdVpYb3VaR2xtWmloMGFHbHpMblpsY25ScFkyVnpMQ0IxYm1sdmJpazdYRzRnSUhKbGRIVnliaUJrYVdabU8xeHVmVHRjYmx4dVhHNHZLaXBjYmlBcUlFTnlaV0YwWlhNZ2JXRnlaMmx1SUhCdmJIbG5iMjVjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ1pHbHpkRnh1SUNvZ1FISmxkSFZ5YmlCN1FYSnlZWGt1UEU5aWFtVmpkRDU5WEc0Z0tpOWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXViMlptYzJWMFRHbHVaU0E5SUdaMWJtTjBhVzl1S0dScGMzUXBJSHRjYmlBZ2FXWWdLR1JwYzNRZ1BUMDlJREFwSUhKbGRIVnliaUIwYUdsekxuWmxjblJwWTJWek8xeHVYRzRnSUhaaGNpQjJaWEowYVdObGN5QTlJRnRkTzF4dUlDQjJZWElnZFc1cGIyNGdJQ0FnUFNCYlhUdGNiaUFnZEdocGN5NWZZMnh2YzJWa0lEMGdkSEoxWlR0Y2JseHVJQ0JtYjNJZ0tIWmhjaUJwSUQwZ01Dd2diR1Z1SUQwZ2RHaHBjeTUyWlhKMGFXTmxjeTVzWlc1bmRHZ2dMU0F4T3lCcElEd2diR1Z1T3lCcEt5c3BJSHRjYmlBZ0lDQjJZWElnYzJWbmJXVnVkQ0E5SUhSb2FYTXVaVzV6ZFhKbFRHRnpkRkJ2YVc1MEtGeHVJQ0FnSUNBZ0lDQjBhR2x6TGw5dlptWnpaWFJUWldkdFpXNTBLRnRkTENCMGFHbHpMblpsY25ScFkyVnpXMmxkTENCMGFHbHpMblpsY25ScFkyVnpXMmtnS3lBeFhTd2daR2x6ZENsY2JpQWdJQ0FwTzF4dUlDQWdJSFpsY25ScFkyVnpMbkIxYzJnb2MyVm5iV1Z1ZENrN1hHNGdJQ0FnZFc1cGIyNGdQU0FvYVNBOVBUMGdNQ2tnUHlCelpXZHRaVzUwSURvZ2JXRnlkR2x1WlhvdWRXNXBiMjRvZFc1cGIyNHNJSE5sWjIxbGJuUXBPMXh1SUNCOVhHNWNiaUFnY21WMGRYSnVJSFJvYVhNdWRtVnlkR2xqWlhNdWJHVnVaM1JvSUQ0Z01pQS9JSFZ1YVc5dUlEb2dXM1Z1YVc5dVhUdGNibjA3WEc1Y2JtMXZaSFZzWlM1bGVIQnZjblJ6SUQwZ1QyWm1jMlYwTzF4dUlsMTkiLCJtb2R1bGUuZXhwb3J0cz17XG4gIFwidHlwZVwiOiBcIkZlYXR1cmVDb2xsZWN0aW9uXCIsXG4gIFwiZmVhdHVyZXNcIjogW1xuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwicHJvcGVydGllc1wiOiB7fSxcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJQb2x5Z29uXCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjpcbiAgICAgICAgICBbW1xuICBbXG4gICAgMTE0LjE4NzA3NzI4Mzg1OTI1LFxuICAgIDIyLjI2NjU3NDc1NjUyNTAzNVxuICBdLFxuICBbXG4gICAgMTE0LjE4NzI3NTc2NzMyNjM1LFxuICAgIDIyLjI2NjM3NjE4MDQ0OTg2XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg3NTcwODEwMzE4LFxuICAgIDIyLjI2NjY5MzkwMjAzNDg3N1xuICBdLFxuICBbXG4gICAgMTE0LjE4NzYyOTgxODkxNjMyLFxuICAgIDIyLjI2NjcxODcyNDAwMzMyNlxuICBdLFxuICBbXG4gICAgMTE0LjE4NzgxMjIwOTEyOTMzLFxuICAgIDIyLjI2NjU4NDY4NTMyMTRcbiAgXSxcbiAgW1xuICAgIDExNC4xODgxNzE2MjUxMzczMyxcbiAgICAyMi4yNjY0MzU3NTMzMDE5OThcbiAgXSxcbiAgW1xuICAgIDExNC4xODgzMzc5MjIwOTYyNSxcbiAgICAyMi4yNjY4Nzc1ODQ0OTcxNFxuICBdLFxuICBbXG4gICAgMTE0LjE4ODI0NjcyNjk4OTc1LFxuICAgIDIyLjI2NjkwNzM3MDgxOTY2XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MTg3NzE4MzkxNDIsXG4gICAgMjIuMjY2Nzg4MjI1NDkxNTY3XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MTQ0ODAzMDQ3MTgsXG4gICAgMjIuMjY2ODA4MDgzMDUzMjlcbiAgXSxcbiAgW1xuICAgIDExNC4xODgxNzY5ODk1NTUzNixcbiAgICAyMi4yNjY4Nzc1ODQ0OTcxNFxuICBdLFxuICBbXG4gICAgMTE0LjE4ODEzNDA3NDIxMTEyLFxuICAgIDIyLjI2Njg5MjQ3NzY1OTE5XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MTgyMzUzOTczMzksXG4gICAgMjIuMjY2OTUyMDUwMjkxNTI1XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MTIzMzQ1Mzc1MDYsXG4gICAgMjIuMjY2OTkxNzY1MzY1NjYzXG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MDQ4MjQzNTIyNjQsXG4gICAgMjIuMjY2ODYyNjkxMzMzNTA3XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg3OTUxNjgzOTk4MTEsXG4gICAgMjIuMjY3MDExNjIyODk4NTJcbiAgXSxcbiAgW1xuICAgIDExNC4xODgxMzQwNzQyMTExMixcbiAgICAyMi4yNjcxODA0MTE4MTM4OVxuICBdLFxuICBbXG4gICAgMTE0LjE4ODM1OTM3OTc2ODM3LFxuICAgIDIyLjI2Njk2Njk0MzQ0NTY1XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4NDIzNzUyNzg0NzMsXG4gICAgMjIuMjY3MDE2NTg3MjgxMjc2XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MDU4OTcyMzU4NjksXG4gICAgMjIuMjY3MzkzODc5ODU2NDdcbiAgXSxcbiAgW1xuICAgIDExNC4xODc2MjQ0NTQ0OTgyOSxcbiAgICAyMi4yNjcwNjEyNjY3MTgyODNcbiAgXSxcbiAgW1xuICAgIDExNC4xODc0MDQ1MTMzNTkwNyxcbiAgICAyMi4yNjY5NTcwMTQ2NzY0MlxuICBdLFxuICBbXG4gICAgMTE0LjE4NzQ1ODE1NzUzOTM3LFxuICAgIDIyLjI2NjkwMjQwNjQzMzAxXG4gIF1cbl1dXG5cbiAgICAgIH1cbiAgICB9LFxuICAgIHtcbiAgICAgIFwidHlwZVwiOiBcIkZlYXR1cmVcIixcbiAgICAgIFwiZ2VvbWV0cnlcIjoge1xuICAgICAgICBcInR5cGVcIjogXCJMaW5lU3RyaW5nXCIsXG4gICAgICAgIFwiY29vcmRpbmF0ZXNcIjogW1xuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODYxNzA2OTcyMTIyMixcbiAgICAgICAgICAgIDIyLjI2ODc4ODg2MDY3NTJcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODYyODMzNDk5OTA4NCxcbiAgICAgICAgICAgIDIyLjI2ODY3OTY0NTU5Njg4M1xuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NjUxNDAxOTk2NjEzLFxuICAgICAgICAgICAgMjIuMjY4MzE3MjQ5NDk4OTk1XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg2NzMzOTYxMTA1MzUsXG4gICAgICAgICAgICAyMi4yNjc5NDQ5MjM3NjMzOFxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NjkzMjQ0NDU3MjQzLFxuICAgICAgICAgICAgMjIuMjY3NjAyMzgzMjExNTk2XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg2NzQ0Njg5OTQxNCxcbiAgICAgICAgICAgIDIyLjI2NzQ4ODIwMjg0MTMxN1xuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4Njc0NDY4OTk0MTQsXG4gICAgICAgICAgICAyMi4yNjczODg5MTU0ODcwODZcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODY4NTczNDI3MjAwMyxcbiAgICAgICAgICAgIDIyLjI2NzIyMDEyNjgyMzIyXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg3MTIwMTk5MjAzNDksXG4gICAgICAgICAgICAyMi4yNjcyNDk5MTMwNzI4MTNcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODcyMTY3NTg3MjgwMyxcbiAgICAgICAgICAgIDIyLjI2NzI1NDg3NzQ0NzEzM1xuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NzU5MjI2Nzk5MDExLFxuICAgICAgICAgICAgMjIuMjY3NDU4NDE2NjQyNDQ4XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg3MTYzMTE0NTQ3NzMsXG4gICAgICAgICAgICAyMi4yNjgxODMyMTIzNDgzMTJcbiAgICAgICAgICBdXG4gICAgICAgIF1cbiAgICAgIH1cbiAgICB9XG4gIF1cbn0iXX0=
