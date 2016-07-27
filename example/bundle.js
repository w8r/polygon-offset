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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy93YXRjaGlmeS9ub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvYnJvd3Nlci1wYWNrL19wcmVsdWRlLmpzIiwiZXhhbXBsZS9hcHAuanMiLCJleGFtcGxlL2xlYWZsZXRfbXVsdGlwb2x5Z29uLmpzIiwiZXhhbXBsZS9vZmZzZXRfY29udHJvbC5qcyIsImV4YW1wbGUvcG9seWdvbl9jb250cm9sLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9iaW50cmVlLmpzIiwibm9kZV9tb2R1bGVzL2JpbnRyZWVzL2xpYi9yYnRyZWUuanMiLCJub2RlX21vZHVsZXMvYmludHJlZXMvbGliL3RyZWViYXNlLmpzIiwibm9kZV9tb2R1bGVzL2dlb2pzb24tcHJvamVjdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfZXZlbnRzLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2NvbXBhcmVfc2VnbWVudHMuanMiLCJub2RlX21vZHVsZXMvbWFydGluZXotcG9seWdvbi1jbGlwcGluZy9zcmMvZWRnZV90eXBlLmpzIiwibm9kZV9tb2R1bGVzL21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcvc3JjL2VxdWFscy5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zZWdtZW50X2ludGVyc2VjdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zaWduZWRfYXJlYS5qcyIsIm5vZGVfbW9kdWxlcy9tYXJ0aW5lei1wb2x5Z29uLWNsaXBwaW5nL3NyYy9zd2VlcF9ldmVudC5qcyIsIm5vZGVfbW9kdWxlcy90aW55cXVldWUvaW5kZXguanMiLCJzcmMvZWRnZS5qcyIsInNyYy9vZmZzZXQuanMiLCJ0ZXN0L2ZpeHR1cmVzL3BvbHlnb25fcG9seWxpbmUuanNvbiJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTtBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1R0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN2T0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNHQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0NBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdm9CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3SUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDOUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDL0VBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM3RUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzNQQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIihmdW5jdGlvbiAoZ2xvYmFsKXtcbnZhciBPZmZzZXQgPSByZXF1aXJlKCcuLi9zcmMvb2Zmc2V0Jyk7XG5yZXF1aXJlKCcuL2xlYWZsZXRfbXVsdGlwb2x5Z29uJyk7XG5yZXF1aXJlKCcuL3BvbHlnb25fY29udHJvbCcpO1xudmFyIE9mZnNldENvbnRyb2wgPSByZXF1aXJlKCcuL29mZnNldF9jb250cm9sJyk7XG52YXIgZGF0YSA9IHJlcXVpcmUoJy4uL3Rlc3QvZml4dHVyZXMvcG9seWdvbl9wb2x5bGluZS5qc29uJyk7XG52YXIgcHJvamVjdCA9IHJlcXVpcmUoJ2dlb2pzb24tcHJvamVjdCcpO1xuXG52YXIgc3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMyxcbiAgICAgICAgY29sb3I6ICcjNDhmJyxcbiAgICAgICAgb3BhY2l0eTogMC44LFxuICAgICAgICBkYXNoQXJyYXk6IFsyLCA0XVxuICAgIH0sXG4gICAgbWFyZ2luU3R5bGUgPSB7XG4gICAgICAgIHdlaWdodDogMixcbiAgICAgICAgY29sb3I6ICcjMjc2RDhGJ1xuICAgIH0sXG4gICAgcGFkZGluZ1N0eWxlID0ge1xuICAgICAgICB3ZWlnaHQ6IDIsXG4gICAgICAgIGNvbG9yOiAnI0Q4MTcwNidcbiAgICB9LFxuICAgIGNlbnRlciA9IFsyMi4yNjcwLCAxMTQuMTg4XSxcbiAgICB6b29tID0gMTcsXG4gICAgbWFwLCB2ZXJ0aWNlcywgcmVzdWx0O1xuXG5tYXAgPSBnbG9iYWwubWFwID0gTC5tYXAoJ21hcCcsIHtcbiAgZWRpdGFibGU6IHRydWUsXG4gIG1heFpvb206IDIyXG59KS5zZXRWaWV3KGNlbnRlciwgem9vbSk7XG5cblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3UG9seWdvbkNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlnb25cbn0pKTtcblxubWFwLmFkZENvbnRyb2wobmV3IEwuTmV3TGluZUNvbnRyb2woe1xuICBjYWxsYmFjazogbWFwLmVkaXRUb29scy5zdGFydFBvbHlsaW5lXG59KSk7XG5cbnZhciBsYXllcnMgPSBnbG9iYWwubGF5ZXJzID0gTC5nZW9Kc29uKCkuYWRkVG8obWFwKTtcbnZhciByZXN1bHRzID0gZ2xvYmFsLnJlc3VsdHMgPSBMLmdlb0pzb24obnVsbCwge1xuICBzdHlsZTogZnVuY3Rpb24oZmVhdHVyZSkge1xuICAgIHJldHVybiBtYXJnaW5TdHlsZTtcbiAgfVxufSkuYWRkVG8obWFwKTtcblxubWFwLmFkZENvbnRyb2wobmV3IE9mZnNldENvbnRyb2woe1xuICBjbGVhcjogZnVuY3Rpb24oKSB7XG4gICAgbGF5ZXJzLmNsZWFyTGF5ZXJzKCk7XG4gIH0sXG4gIGNhbGxiYWNrOiBydW5cbn0pKTtcblxubWFwLm9uKCdlZGl0YWJsZTpjcmVhdGVkJywgZnVuY3Rpb24oZXZ0KSB7XG4gIGxheWVycy5hZGRMYXllcihldnQubGF5ZXIpO1xuICBldnQubGF5ZXIub24oJ2NsaWNrJywgZnVuY3Rpb24oZSkge1xuICAgIGlmICgoZS5vcmlnaW5hbEV2ZW50LmN0cmxLZXkgfHwgZS5vcmlnaW5hbEV2ZW50Lm1ldGFLZXkpICYmIHRoaXMuZWRpdEVuYWJsZWQoKSkge1xuICAgICAgdGhpcy5lZGl0b3IubmV3SG9sZShlLmxhdGxuZyk7XG4gICAgfVxuICB9KTtcbn0pO1xuXG5cbmZ1bmN0aW9uIHJ1biAobWFyZ2luKSB7XG4gIHJlc3VsdHMuY2xlYXJMYXllcnMoKTtcbiAgbGF5ZXJzLmVhY2hMYXllcihmdW5jdGlvbihsYXllcikge1xuICAgIHZhciBnaiA9IGxheWVyLnRvR2VvSlNPTigpO1xuICAgIGNvbnNvbGUubG9nKGdqLCBtYXJnaW4pO1xuICAgIGlmIChtYXJnaW4gPT09IDApIHJldHVybjtcbiAgICB2YXIgc2hhcGUgPSBwcm9qZWN0KGdqLCBmdW5jdGlvbihjb29yZCkge1xuICAgICAgdmFyIHB0ID0gbWFwLm9wdGlvbnMuY3JzLmxhdExuZ1RvUG9pbnQoTC5sYXRMbmcoY29vcmQuc2xpY2UoKS5yZXZlcnNlKCkpLCBtYXAuZ2V0Wm9vbSgpKTtcbiAgICAgIHJldHVybiBbcHQueCwgcHQueV07XG4gICAgfSk7XG5cbiAgICB2YXIgbWFyZ2luZWQ7XG4gICAgaWYgKGdqLmdlb21ldHJ5LnR5cGUgPT09ICdMaW5lU3RyaW5nJykge1xuICAgICAgaWYgKG1hcmdpbiA8IDApIHJldHVybjtcbiAgICAgIHZhciByZXMgPSBuZXcgT2Zmc2V0KHNoYXBlLmdlb21ldHJ5LmNvb3JkaW5hdGVzKS5hcmNTZWdtZW50cygxMDApLm9mZnNldExpbmUobWFyZ2luKTtcbiAgICAgIG1hcmdpbmVkID0ge1xuICAgICAgICB0eXBlOiAnRmVhdHVyZScsXG4gICAgICAgIGdlb21ldHJ5OiB7XG4gICAgICAgICAgdHlwZTogJ1BvbHlnb24nLFxuICAgICAgICAgIGNvb3JkaW5hdGVzOiByZXNcbiAgICAgICAgfVxuICAgICAgfTtcbiAgICB9IGVsc2Uge1xuICAgICAgbWFyZ2luZWQgPSB7XG4gICAgICAgIHR5cGU6ICdGZWF0dXJlJyxcbiAgICAgICAgZ2VvbWV0cnk6IHtcbiAgICAgICAgICB0eXBlOiAnUG9seWdvbicsXG4gICAgICAgICAgY29vcmRpbmF0ZXM6IG5ldyBPZmZzZXQoc2hhcGUuZ2VvbWV0cnkuY29vcmRpbmF0ZXNbMF0pLm9mZnNldChtYXJnaW4pXG4gICAgICAgIH1cbiAgICAgIH07XG4gICAgfVxuXG4gICAgY29uc29sZS5sb2coJ21hcmdpbmVkJywgbWFyZ2luZWQpO1xuICAgIHJlc3VsdHMuYWRkRGF0YShwcm9qZWN0KG1hcmdpbmVkLCBmdW5jdGlvbihwdCkge1xuICAgICAgdmFyIGxsID0gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwdC5zbGljZSgpKSwgbWFwLmdldFpvb20oKSk7XG4gICAgICByZXR1cm4gW2xsLmxuZywgbGwubGF0XTtcbiAgICB9KSk7XG4gIH0pO1xufVxuXG4vLyBMLnRpbGVMYXllcignaHR0cDovL3tzfS50aWxlLm9zbS5vcmcve3p9L3t4fS97eX0ucG5nJywge1xuLy8gICBhdHRyaWJ1dGlvbjogJyZjb3B5OyAnICtcbi8vICAgICAnPGEgaHJlZj1cImh0dHA6Ly9vc20ub3JnL2NvcHlyaWdodFwiPk9wZW5TdHJlZXRNYXA8L2E+IGNvbnRyaWJ1dG9ycydcbi8vIH0pLmFkZFRvKG1hcCk7XG5cbi8vIGNvbnNvbGUubG9nKHBvbHlnb24pO1xuXG4vLyBmdW5jdGlvbiBwcm9qZWN0KGxsKSB7XG4vLyAgIHZhciBwdCA9IG1hcC5vcHRpb25zLmNycy5sYXRMbmdUb1BvaW50KEwubGF0TG5nKGxsLnNsaWNlKCkucmV2ZXJzZSgpKSwgbWFwLmdldFpvb20oKSk7XG4vLyAgIHJldHVybiBbcHQueCwgcHQueV07XG4vLyB9XG5cbi8vIHZlcnRpY2VzID0gcG9seWdvbi5nZW9tZXRyeS5jb29yZGluYXRlc1swXS5tYXAocHJvamVjdCk7XG5cbi8vIGNvbnNvbGUudGltZSgnbWFyZ2luJyk7XG4vLyByZXN1bHQgPSBuZXcgT2Zmc2V0KHZlcnRpY2VzKS5tYXJnaW4oNDApO1xuLy8gY29uc29sZS50aW1lRW5kKCdtYXJnaW4nKTtcbi8vIHJlc3VsdCA9IHJlc3VsdC5tYXAoZnVuY3Rpb24ocCkge1xuLy8gICByZXR1cm4gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwKSwgbWFwLmdldFpvb20oKSk7XG4vLyB9KTtcblxuLy8gTC5wb2x5Z29uKHJlc3VsdCwgbWFyZ2luU3R5bGUpLmFkZFRvKG1hcCk7XG4vLyBjb25zb2xlLnRpbWUoJ3BhZGRpbmcnKTtcbi8vIHJlc3VsdCA9IG5ldyBPZmZzZXQodmVydGljZXMpLnBhZGRpbmcoMTApO1xuLy8gY29uc29sZS50aW1lRW5kKCdwYWRkaW5nJyk7XG4vLyByZXN1bHQgPSByZXN1bHQubWFwKGZ1bmN0aW9uKHApIHtcbi8vICAgICByZXR1cm4gbWFwLm9wdGlvbnMuY3JzLnBvaW50VG9MYXRMbmcoTC5wb2ludChwKSwgbWFwLmdldFpvb20oKSk7XG4vLyB9KTtcblxuLy8gTC5wb2x5Z29uKHJlc3VsdCwgcGFkZGluZ1N0eWxlKS5hZGRUbyhsYXllcnMpO1xuXG4vLyB2YXIgbGluZVBvaW50cyA9IGRhdGEuZmVhdHVyZXNbMV0uZ2VvbWV0cnkuY29vcmRpbmF0ZXMubWFwKHByb2plY3QpO1xufSkuY2FsbCh0aGlzLHR5cGVvZiBnbG9iYWwgIT09IFwidW5kZWZpbmVkXCIgPyBnbG9iYWwgOiB0eXBlb2Ygc2VsZiAhPT0gXCJ1bmRlZmluZWRcIiA/IHNlbGYgOiB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiID8gd2luZG93IDoge30pXG4vLyMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldDp1dGYtODtiYXNlNjQsZXlKMlpYSnphVzl1SWpvekxDSnpiM1Z5WTJWeklqcGJJbVY0WVcxd2JHVXZZWEJ3TG1weklsMHNJbTVoYldWeklqcGJYU3dpYldGd2NHbHVaM01pT2lJN1FVRkJRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFaUxDSm1hV3hsSWpvaVoyVnVaWEpoZEdWa0xtcHpJaXdpYzI5MWNtTmxVbTl2ZENJNklpSXNJbk52ZFhKalpYTkRiMjUwWlc1MElqcGJJblpoY2lCUFptWnpaWFFnUFNCeVpYRjFhWEpsS0NjdUxpOXpjbU12YjJabWMyVjBKeWs3WEc1eVpYRjFhWEpsS0NjdUwyeGxZV1pzWlhSZmJYVnNkR2x3YjJ4NVoyOXVKeWs3WEc1eVpYRjFhWEpsS0NjdUwzQnZiSGxuYjI1ZlkyOXVkSEp2YkNjcE8xeHVkbUZ5SUU5bVpuTmxkRU52Ym5SeWIyd2dQU0J5WlhGMWFYSmxLQ2N1TDI5bVpuTmxkRjlqYjI1MGNtOXNKeWs3WEc1MllYSWdaR0YwWVNBOUlISmxjWFZwY21Vb0p5NHVMM1JsYzNRdlptbDRkSFZ5WlhNdmNHOXNlV2R2Ymw5d2IyeDViR2x1WlM1cWMyOXVKeWs3WEc1MllYSWdjSEp2YW1WamRDQTlJSEpsY1hWcGNtVW9KMmRsYjJwemIyNHRjSEp2YW1WamRDY3BPMXh1WEc1MllYSWdjM1I1YkdVZ1BTQjdYRzRnSUNBZ0lDQWdJSGRsYVdkb2REb2dNeXhjYmlBZ0lDQWdJQ0FnWTI5c2IzSTZJQ2NqTkRobUp5eGNiaUFnSUNBZ0lDQWdiM0JoWTJsMGVUb2dNQzQ0TEZ4dUlDQWdJQ0FnSUNCa1lYTm9RWEp5WVhrNklGc3lMQ0EwWFZ4dUlDQWdJSDBzWEc0Z0lDQWdiV0Z5WjJsdVUzUjViR1VnUFNCN1hHNGdJQ0FnSUNBZ0lIZGxhV2RvZERvZ01peGNiaUFnSUNBZ0lDQWdZMjlzYjNJNklDY2pNamMyUkRoR0oxeHVJQ0FnSUgwc1hHNGdJQ0FnY0dGa1pHbHVaMU4wZVd4bElEMGdlMXh1SUNBZ0lDQWdJQ0IzWldsbmFIUTZJRElzWEc0Z0lDQWdJQ0FnSUdOdmJHOXlPaUFuSTBRNE1UY3dOaWRjYmlBZ0lDQjlMRnh1SUNBZ0lHTmxiblJsY2lBOUlGc3lNaTR5Tmpjd0xDQXhNVFF1TVRnNFhTeGNiaUFnSUNCNmIyOXRJRDBnTVRjc1hHNGdJQ0FnYldGd0xDQjJaWEowYVdObGN5d2djbVZ6ZFd4ME8xeHVYRzV0WVhBZ1BTQm5iRzlpWVd3dWJXRndJRDBnVEM1dFlYQW9KMjFoY0Njc0lIdGNiaUFnWldScGRHRmliR1U2SUhSeWRXVXNYRzRnSUcxaGVGcHZiMjA2SURJeVhHNTlLUzV6WlhSV2FXVjNLR05sYm5SbGNpd2dlbTl2YlNrN1hHNWNibHh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUV3dVRtVjNVRzlzZVdkdmJrTnZiblJ5YjJ3b2UxeHVJQ0JqWVd4c1ltRmphem9nYldGd0xtVmthWFJVYjI5c2N5NXpkR0Z5ZEZCdmJIbG5iMjVjYm4wcEtUdGNibHh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUV3dVRtVjNUR2x1WlVOdmJuUnliMndvZTF4dUlDQmpZV3hzWW1GamF6b2diV0Z3TG1Wa2FYUlViMjlzY3k1emRHRnlkRkJ2Ykhsc2FXNWxYRzU5S1NrN1hHNWNiblpoY2lCc1lYbGxjbk1nUFNCbmJHOWlZV3d1YkdGNVpYSnpJRDBnVEM1blpXOUtjMjl1S0NrdVlXUmtWRzhvYldGd0tUdGNiblpoY2lCeVpYTjFiSFJ6SUQwZ1oyeHZZbUZzTG5KbGMzVnNkSE1nUFNCTUxtZGxiMHB6YjI0b2JuVnNiQ3dnZTF4dUlDQnpkSGxzWlRvZ1puVnVZM1JwYjI0b1ptVmhkSFZ5WlNrZ2UxeHVJQ0FnSUhKbGRIVnliaUJ0WVhKbmFXNVRkSGxzWlR0Y2JpQWdmVnh1ZlNrdVlXUmtWRzhvYldGd0tUdGNibHh1YldGd0xtRmtaRU52Ym5SeWIyd29ibVYzSUU5bVpuTmxkRU52Ym5SeWIyd29lMXh1SUNCamJHVmhjam9nWm5WdVkzUnBiMjRvS1NCN1hHNGdJQ0FnYkdGNVpYSnpMbU5zWldGeVRHRjVaWEp6S0NrN1hHNGdJSDBzWEc0Z0lHTmhiR3hpWVdOck9pQnlkVzVjYm4wcEtUdGNibHh1YldGd0xtOXVLQ2RsWkdsMFlXSnNaVHBqY21WaGRHVmtKeXdnWm5WdVkzUnBiMjRvWlhaMEtTQjdYRzRnSUd4aGVXVnljeTVoWkdSTVlYbGxjaWhsZG5RdWJHRjVaWElwTzF4dUlDQmxkblF1YkdGNVpYSXViMjRvSjJOc2FXTnJKeXdnWm5WdVkzUnBiMjRvWlNrZ2UxeHVJQ0FnSUdsbUlDZ29aUzV2Y21sbmFXNWhiRVYyWlc1MExtTjBjbXhMWlhrZ2ZId2daUzV2Y21sbmFXNWhiRVYyWlc1MExtMWxkR0ZMWlhrcElDWW1JSFJvYVhNdVpXUnBkRVZ1WVdKc1pXUW9LU2tnZTF4dUlDQWdJQ0FnZEdocGN5NWxaR2wwYjNJdWJtVjNTRzlzWlNobExteGhkR3h1WnlrN1hHNGdJQ0FnZlZ4dUlDQjlLVHRjYm4wcE8xeHVYRzVjYm1aMWJtTjBhVzl1SUhKMWJpQW9iV0Z5WjJsdUtTQjdYRzRnSUhKbGMzVnNkSE11WTJ4bFlYSk1ZWGxsY25Nb0tUdGNiaUFnYkdGNVpYSnpMbVZoWTJoTVlYbGxjaWhtZFc1amRHbHZiaWhzWVhsbGNpa2dlMXh1SUNBZ0lIWmhjaUJuYWlBOUlHeGhlV1Z5TG5SdlIyVnZTbE5QVGlncE8xeHVJQ0FnSUdOdmJuTnZiR1V1Ykc5bktHZHFMQ0J0WVhKbmFXNHBPMXh1SUNBZ0lHbG1JQ2h0WVhKbmFXNGdQVDA5SURBcElISmxkSFZ5Ymp0Y2JpQWdJQ0IyWVhJZ2MyaGhjR1VnUFNCd2NtOXFaV04wS0dkcUxDQm1kVzVqZEdsdmJpaGpiMjl5WkNrZ2UxeHVJQ0FnSUNBZ2RtRnlJSEIwSUQwZ2JXRndMbTl3ZEdsdmJuTXVZM0p6TG14aGRFeHVaMVJ2VUc5cGJuUW9UQzVzWVhSTWJtY29ZMjl2Y21RdWMyeHBZMlVvS1M1eVpYWmxjbk5sS0NrcExDQnRZWEF1WjJWMFdtOXZiU2dwS1R0Y2JpQWdJQ0FnSUhKbGRIVnliaUJiY0hRdWVDd2djSFF1ZVYwN1hHNGdJQ0FnZlNrN1hHNWNiaUFnSUNCMllYSWdiV0Z5WjJsdVpXUTdYRzRnSUNBZ2FXWWdLR2RxTG1kbGIyMWxkSEo1TG5SNWNHVWdQVDA5SUNkTWFXNWxVM1J5YVc1bkp5a2dlMXh1SUNBZ0lDQWdhV1lnS0cxaGNtZHBiaUE4SURBcElISmxkSFZ5Ymp0Y2JpQWdJQ0FnSUhaaGNpQnlaWE1nUFNCdVpYY2dUMlptYzJWMEtITm9ZWEJsTG1kbGIyMWxkSEo1TG1OdmIzSmthVzVoZEdWektTNWhjbU5UWldkdFpXNTBjeWd4TURBcExtOW1abk5sZEV4cGJtVW9iV0Z5WjJsdUtUdGNiaUFnSUNBZ0lHMWhjbWRwYm1Wa0lEMGdlMXh1SUNBZ0lDQWdJQ0IwZVhCbE9pQW5SbVZoZEhWeVpTY3NYRzRnSUNBZ0lDQWdJR2RsYjIxbGRISjVPaUI3WEc0Z0lDQWdJQ0FnSUNBZ2RIbHdaVG9nSjFCdmJIbG5iMjRuTEZ4dUlDQWdJQ0FnSUNBZ0lHTnZiM0prYVc1aGRHVnpPaUJ5WlhOY2JpQWdJQ0FnSUNBZ2ZWeHVJQ0FnSUNBZ2ZUdGNiaUFnSUNCOUlHVnNjMlVnZTF4dUlDQWdJQ0FnYldGeVoybHVaV1FnUFNCN1hHNGdJQ0FnSUNBZ0lIUjVjR1U2SUNkR1pXRjBkWEpsSnl4Y2JpQWdJQ0FnSUNBZ1oyVnZiV1YwY25rNklIdGNiaUFnSUNBZ0lDQWdJQ0IwZVhCbE9pQW5VRzlzZVdkdmJpY3NYRzRnSUNBZ0lDQWdJQ0FnWTI5dmNtUnBibUYwWlhNNklHNWxkeUJQWm1aelpYUW9jMmhoY0dVdVoyVnZiV1YwY25rdVkyOXZjbVJwYm1GMFpYTmJNRjBwTG05bVpuTmxkQ2h0WVhKbmFXNHBYRzRnSUNBZ0lDQWdJSDFjYmlBZ0lDQWdJSDA3WEc0Z0lDQWdmVnh1WEc0Z0lDQWdZMjl1YzI5c1pTNXNiMmNvSjIxaGNtZHBibVZrSnl3Z2JXRnlaMmx1WldRcE8xeHVJQ0FnSUhKbGMzVnNkSE11WVdSa1JHRjBZU2h3Y205cVpXTjBLRzFoY21kcGJtVmtMQ0JtZFc1amRHbHZiaWh3ZENrZ2UxeHVJQ0FnSUNBZ2RtRnlJR3hzSUQwZ2JXRndMbTl3ZEdsdmJuTXVZM0p6TG5CdmFXNTBWRzlNWVhSTWJtY29UQzV3YjJsdWRDaHdkQzV6YkdsalpTZ3BLU3dnYldGd0xtZGxkRnB2YjIwb0tTazdYRzRnSUNBZ0lDQnlaWFIxY200Z1cyeHNMbXh1Wnl3Z2JHd3ViR0YwWFR0Y2JpQWdJQ0I5S1NrN1hHNGdJSDBwTzF4dWZWeHVYRzR2THlCTUxuUnBiR1ZNWVhsbGNpZ25hSFIwY0RvdkwzdHpmUzUwYVd4bExtOXpiUzV2Y21jdmUzcDlMM3Q0ZlM5N2VYMHVjRzVuSnl3Z2UxeHVMeThnSUNCaGRIUnlhV0oxZEdsdmJqb2dKeVpqYjNCNU95QW5JQ3RjYmk4dklDQWdJQ0FuUEdFZ2FISmxaajFjSW1oMGRIQTZMeTl2YzIwdWIzSm5MMk52Y0hseWFXZG9kRndpUGs5d1pXNVRkSEpsWlhSTllYQThMMkUrSUdOdmJuUnlhV0oxZEc5eWN5ZGNiaTh2SUgwcExtRmtaRlJ2S0cxaGNDazdYRzVjYmk4dklHTnZibk52YkdVdWJHOW5LSEJ2YkhsbmIyNHBPMXh1WEc0dkx5Qm1kVzVqZEdsdmJpQndjbTlxWldOMEtHeHNLU0I3WEc0dkx5QWdJSFpoY2lCd2RDQTlJRzFoY0M1dmNIUnBiMjV6TG1OeWN5NXNZWFJNYm1kVWIxQnZhVzUwS0V3dWJHRjBURzVuS0d4c0xuTnNhV05sS0NrdWNtVjJaWEp6WlNncEtTd2diV0Z3TG1kbGRGcHZiMjBvS1NrN1hHNHZMeUFnSUhKbGRIVnliaUJiY0hRdWVDd2djSFF1ZVYwN1hHNHZMeUI5WEc1Y2JpOHZJSFpsY25ScFkyVnpJRDBnY0c5c2VXZHZiaTVuWlc5dFpYUnllUzVqYjI5eVpHbHVZWFJsYzFzd1hTNXRZWEFvY0hKdmFtVmpkQ2s3WEc1Y2JpOHZJR052Ym5OdmJHVXVkR2x0WlNnbmJXRnlaMmx1SnlrN1hHNHZMeUJ5WlhOMWJIUWdQU0J1WlhjZ1QyWm1jMlYwS0habGNuUnBZMlZ6S1M1dFlYSm5hVzRvTkRBcE8xeHVMeThnWTI5dWMyOXNaUzUwYVcxbFJXNWtLQ2R0WVhKbmFXNG5LVHRjYmk4dklISmxjM1ZzZENBOUlISmxjM1ZzZEM1dFlYQW9ablZ1WTNScGIyNG9jQ2tnZTF4dUx5OGdJQ0J5WlhSMWNtNGdiV0Z3TG05d2RHbHZibk11WTNKekxuQnZhVzUwVkc5TVlYUk1ibWNvVEM1d2IybHVkQ2h3S1N3Z2JXRndMbWRsZEZwdmIyMG9LU2s3WEc0dkx5QjlLVHRjYmx4dUx5OGdUQzV3YjJ4NVoyOXVLSEpsYzNWc2RDd2diV0Z5WjJsdVUzUjViR1VwTG1Ga1pGUnZLRzFoY0NrN1hHNHZMeUJqYjI1emIyeGxMblJwYldVb0ozQmhaR1JwYm1jbktUdGNiaTh2SUhKbGMzVnNkQ0E5SUc1bGR5QlBabVp6WlhRb2RtVnlkR2xqWlhNcExuQmhaR1JwYm1jb01UQXBPMXh1THk4Z1kyOXVjMjlzWlM1MGFXMWxSVzVrS0Nkd1lXUmthVzVuSnlrN1hHNHZMeUJ5WlhOMWJIUWdQU0J5WlhOMWJIUXViV0Z3S0daMWJtTjBhVzl1S0hBcElIdGNiaTh2SUNBZ0lDQnlaWFIxY200Z2JXRndMbTl3ZEdsdmJuTXVZM0p6TG5CdmFXNTBWRzlNWVhSTWJtY29UQzV3YjJsdWRDaHdLU3dnYldGd0xtZGxkRnB2YjIwb0tTazdYRzR2THlCOUtUdGNibHh1THk4Z1RDNXdiMng1WjI5dUtISmxjM1ZzZEN3Z2NHRmtaR2x1WjFOMGVXeGxLUzVoWkdSVWJ5aHNZWGxsY25NcE8xeHVYRzR2THlCMllYSWdiR2x1WlZCdmFXNTBjeUE5SUdSaGRHRXVabVZoZEhWeVpYTmJNVjB1WjJWdmJXVjBjbmt1WTI5dmNtUnBibUYwWlhNdWJXRndLSEJ5YjJwbFkzUXBPeUpkZlE9PSIsIkwuUG9seWdvbi5wcm90b3R5cGUuX3Byb2plY3RMYXRsbmdzID0gZnVuY3Rpb24gKGxhdGxuZ3MsIHJlc3VsdCwgcHJvamVjdGVkQm91bmRzLCBpc0hvbGUpIHtcbiAgdmFyIGZsYXQgPSBsYXRsbmdzWzBdIGluc3RhbmNlb2YgTC5MYXRMbmcsXG4gICAgICBsZW4gPSBsYXRsbmdzLmxlbmd0aCxcbiAgICAgIGksIHJpbmcsIGFyZWE7XG5cbiAgaWYgKGZsYXQpIHtcbiAgICBhcmVhID0gMDtcbiAgICByaW5nID0gW107XG4gICAgZm9yIChpID0gMDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICByaW5nW2ldID0gdGhpcy5fbWFwLmxhdExuZ1RvTGF5ZXJQb2ludChsYXRsbmdzW2ldKTtcbiAgICAgIHByb2plY3RlZEJvdW5kcy5leHRlbmQocmluZ1tpXSk7XG5cbiAgICAgIGlmIChpKSB7XG4gICAgICAgIGFyZWEgKz0gcmluZ1tpIC0gMV0ueCAqIHJpbmdbaV0ueTtcbiAgICAgICAgYXJlYSAtPSByaW5nW2ldLnggKiByaW5nW2kgLSAxXS55O1xuICAgICAgfVxuICAgIH1cbiAgICBhcmVhICs9IHJpbmdbbGVuIC0gMV0ueCAqIHJpbmdbMF0ueTtcbiAgICBhcmVhIC09IHJpbmdbMF0ueCAqIHJpbmdbbGVuIC0gMV0ueTtcblxuICAgIGlmICgoIWlzSG9sZSAmJiBhcmVhID4gMCkgfHwgKGlzSG9sZSAmJiBhcmVhIDwgMCkpIHtcbiAgICAgIHJpbmcucmV2ZXJzZSgpO1xuICAgIH1cblxuICAgIHJlc3VsdC5wdXNoKHJpbmcpO1xuICB9IGVsc2Uge1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgICAgdGhpcy5fcHJvamVjdExhdGxuZ3MobGF0bG5nc1tpXSwgcmVzdWx0LCBwcm9qZWN0ZWRCb3VuZHMsIGkgIT09IDApO1xuICAgIH1cbiAgfVxufTtcblxuXG5MLlBvbHlnb24ucHJvdG90eXBlLl9wcm9qZWN0ID0gZnVuY3Rpb24oKSB7XG4gIEwuUG9seWxpbmUucHJvdG90eXBlLl9wcm9qZWN0LmNhbGwodGhpcyk7XG4gIGlmICgodGhpcy5fbGF0bG5ncy5sZW5ndGggPiAxKSAmJlxuICAgICFMLlBvbHlsaW5lLl9mbGF0KHRoaXMuX2xhdGxuZ3MpICYmXG4gICAgISh0aGlzLl9sYXRsbmdzWzBdWzBdIGluc3RhbmNlb2YgTC5MYXRMbmcpKSB7XG4gICAgaWYgKHRoaXMub3B0aW9ucy5maWxsUnVsZSAhPT0gJ25vbnplcm8nKSB7XG4gICAgICB0aGlzLnNldFN0eWxlKHtcbiAgICAgICAgZmlsbFJ1bGU6ICdub256ZXJvJ1xuICAgICAgfSk7XG4gICAgfVxuICB9XG59OyIsIm1vZHVsZS5leHBvcnRzID0gTC5Db250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcHJpZ2h0JyxcbiAgICBkZWZhdWx0TWFyZ2luOiAyMFxuICB9LFxuXG4gIG9uQWRkOiBmdW5jdGlvbihtYXApIHtcbiAgICB2YXIgY29udGFpbmVyID0gdGhpcy5fY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgJ2xlYWZsZXQtYmFyJyk7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLmJhY2tncm91bmQgPSAnI2ZmZmZmZic7XG4gICAgdGhpcy5fY29udGFpbmVyLnN0eWxlLnBhZGRpbmcgPSAnMTBweCc7XG4gICAgY29udGFpbmVyLmlubmVySFRNTCA9IFtcbiAgICAgICc8Zm9ybT4nLFxuICAgICAgICAnPGRpdj4nLFxuICAgICAgICAgICc8bGFiZWw+JyxcbiAgICAgICAgICAgICc8aW5wdXQgdHlwZT1cInJhbmdlXCIgbWluPVwiMFwiIG1heD1cIjEwMFwiIHZhbHVlPVwiJywgIHRoaXMub3B0aW9ucy5kZWZhdWx0TWFyZ2luLCAnXCIgbmFtZT1cIm1hcmdpblwiPicsXG4gICAgICAgICAgJzwvbGFiZWw+JyxcbiAgICAgICAgJzwvZGl2PicsXG4gICAgICAgICc8ZGl2PicsXG4gICAgICAgICAgJzxsYWJlbD4nLCAnPGlucHV0IHR5cGU9XCJyYWRpb1wiIG5hbWU9XCJvcGVyYXRpb25cIiB2YWx1ZT1cIjFcIiBjaGVja2VkPicsICcgbWFyZ2luPC9sYWJlbD4nLFxuICAgICAgICAgICc8bGFiZWw+JywgJzxpbnB1dCB0eXBlPVwicmFkaW9cIiBuYW1lPVwib3BlcmF0aW9uXCIgdmFsdWU9XCItMVwiPicsICcgcGFkZGluZzwvbGFiZWw+JyxcbiAgICAgICAgJzwvZGl2PicsICc8YnI+JyxcbiAgICAgICAgJzxpbnB1dCB0eXBlPVwic3VibWl0XCIgdmFsdWU9XCJSdW5cIj4nLCAnPGlucHV0IG5hbWU9XCJjbGVhclwiIHR5cGU9XCJidXR0b25cIiB2YWx1ZT1cIkNsZWFyIGxheWVyc1wiPicsXG4gICAgICAnPC9mb3JtPiddLmpvaW4oJycpO1xuXG4gICAgdmFyIGZvcm0gPSBjb250YWluZXIucXVlcnlTZWxlY3RvcignZm9ybScpO1xuICAgIEwuRG9tRXZlbnRcbiAgICAgIC5vbihmb3JtLCAnc3VibWl0JywgZnVuY3Rpb24gKGV2dCkge1xuICAgICAgICBMLkRvbUV2ZW50LnN0b3AoZXZ0KTtcbiAgICAgICAgdmFyIG1hcmdpbiA9IHBhcnNlRmxvYXQoZm9ybVsnbWFyZ2luJ10udmFsdWUpO1xuICAgICAgICB2YXIgcmFkaW9zID0gQXJyYXkucHJvdG90eXBlLnNsaWNlLmNhbGwoXG4gICAgICAgICAgZm9ybS5xdWVyeVNlbGVjdG9yQWxsKCdpbnB1dFt0eXBlPXJhZGlvXScpKTtcbiAgICAgICAgdmFyIGsgPSAxO1xuICAgICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gcmFkaW9zLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgICAgaWYgKHJhZGlvc1tpXS5jaGVja2VkKSB7XG4gICAgICAgICAgICBrICo9IHBhcnNlSW50KHJhZGlvc1tpXS52YWx1ZSk7XG4gICAgICAgICAgICBicmVhaztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5vcHRpb25zLmNhbGxiYWNrKG1hcmdpbiAqIGspO1xuICAgICAgfSwgdGhpcylcbiAgICAgIC5vbihmb3JtWydjbGVhciddLCAnY2xpY2snLCBmdW5jdGlvbihldnQpIHtcbiAgICAgICAgTC5Eb21FdmVudC5zdG9wKGV2dCk7XG4gICAgICAgIHRoaXMub3B0aW9ucy5jbGVhcigpO1xuICAgICAgfSwgdGhpcyk7XG5cbiAgICBMLkRvbUV2ZW50XG4gICAgICAuZGlzYWJsZUNsaWNrUHJvcGFnYXRpb24odGhpcy5fY29udGFpbmVyKVxuICAgICAgLmRpc2FibGVTY3JvbGxQcm9wYWdhdGlvbih0aGlzLl9jb250YWluZXIpO1xuICAgIHJldHVybiB0aGlzLl9jb250YWluZXI7XG4gIH1cblxufSk7IiwiTC5FZGl0Q29udHJvbCA9IEwuQ29udHJvbC5leHRlbmQoe1xuXG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGNhbGxiYWNrOiBudWxsLFxuICAgIGtpbmQ6ICcnLFxuICAgIGh0bWw6ICcnXG4gIH0sXG5cbiAgb25BZGQ6IGZ1bmN0aW9uIChtYXApIHtcbiAgICB2YXIgY29udGFpbmVyID0gTC5Eb21VdGlsLmNyZWF0ZSgnZGl2JywgJ2xlYWZsZXQtY29udHJvbCBsZWFmbGV0LWJhcicpLFxuICAgICAgICBsaW5rID0gTC5Eb21VdGlsLmNyZWF0ZSgnYScsICcnLCBjb250YWluZXIpO1xuXG4gICAgbGluay5ocmVmID0gJyMnO1xuICAgIGxpbmsudGl0bGUgPSAnQ3JlYXRlIGEgbmV3ICcgKyB0aGlzLm9wdGlvbnMua2luZDtcbiAgICBsaW5rLmlubmVySFRNTCA9IHRoaXMub3B0aW9ucy5odG1sO1xuICAgIEwuRG9tRXZlbnQub24obGluaywgJ2NsaWNrJywgTC5Eb21FdmVudC5zdG9wKVxuICAgICAgICAgICAgICAub24obGluaywgJ2NsaWNrJywgZnVuY3Rpb24gKCkge1xuICAgICAgICAgICAgICAgIHdpbmRvdy5MQVlFUiA9IHRoaXMub3B0aW9ucy5jYWxsYmFjay5jYWxsKG1hcC5lZGl0VG9vbHMpO1xuICAgICAgICAgICAgICB9LCB0aGlzKTtcblxuICAgIHJldHVybiBjb250YWluZXI7XG4gIH1cblxufSk7XG5cbkwuTmV3UG9seWdvbkNvbnRyb2wgPSBMLkVkaXRDb250cm9sLmV4dGVuZCh7XG4gIG9wdGlvbnM6IHtcbiAgICBwb3NpdGlvbjogJ3RvcGxlZnQnLFxuICAgIGtpbmQ6ICdwb2x5Z29uJyxcbiAgICBodG1sOiAn4pawJ1xuICB9XG59KTtcblxuTC5OZXdMaW5lQ29udHJvbCA9IEwuRWRpdENvbnRyb2wuZXh0ZW5kKHtcbiAgb3B0aW9uczoge1xuICAgIHBvc2l0aW9uOiAndG9wbGVmdCcsXG4gICAga2luZDogJ3BvbHlsaW5lJyxcbiAgICBodG1sOiAnLydcbiAgfVxufSk7IiwibW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUkJUcmVlOiByZXF1aXJlKCcuL2xpYi9yYnRyZWUnKSxcbiAgICBCaW5UcmVlOiByZXF1aXJlKCcuL2xpYi9iaW50cmVlJylcbn07XG4iLCJcbnZhciBUcmVlQmFzZSA9IHJlcXVpcmUoJy4vdHJlZWJhc2UnKTtcblxuZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xufVxuXG5Ob2RlLnByb3RvdHlwZS5nZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIpIHtcbiAgICByZXR1cm4gZGlyID8gdGhpcy5yaWdodCA6IHRoaXMubGVmdDtcbn07XG5cbk5vZGUucHJvdG90eXBlLnNldF9jaGlsZCA9IGZ1bmN0aW9uKGRpciwgdmFsKSB7XG4gICAgaWYoZGlyKSB7XG4gICAgICAgIHRoaXMucmlnaHQgPSB2YWw7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB0aGlzLmxlZnQgPSB2YWw7XG4gICAgfVxufTtcblxuZnVuY3Rpb24gQmluVHJlZShjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5zaXplID0gMDtcbn1cblxuQmluVHJlZS5wcm90b3R5cGUgPSBuZXcgVHJlZUJhc2UoKTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIGluc2VydGVkLCBmYWxzZSBpZiBkdXBsaWNhdGVcbkJpblRyZWUucHJvdG90eXBlLmluc2VydCA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIC8vIGVtcHR5IHRyZWVcbiAgICAgICAgdGhpcy5fcm9vdCA9IG5ldyBOb2RlKGRhdGEpO1xuICAgICAgICB0aGlzLnNpemUrKztcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuXG4gICAgdmFyIGRpciA9IDA7XG5cbiAgICAvLyBzZXR1cFxuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIG5vZGUgPSB0aGlzLl9yb290O1xuXG4gICAgLy8gc2VhcmNoIGRvd25cbiAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgIGlmKG5vZGUgPT09IG51bGwpIHtcbiAgICAgICAgICAgIC8vIGluc2VydCBuZXcgbm9kZSBhdCB0aGUgYm90dG9tXG4gICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICBwLnNldF9jaGlsZChkaXIsIG5vZGUpO1xuICAgICAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzdG9wIGlmIGZvdW5kXG4gICAgICAgIGlmKHRoaXMuX2NvbXBhcmF0b3Iobm9kZS5kYXRhLCBkYXRhKSA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgZGlyID0gdGhpcy5fY29tcGFyYXRvcihub2RlLmRhdGEsIGRhdGEpIDwgMDtcblxuICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgbm9kZSA9IG5vZGUuZ2V0X2NoaWxkKGRpcik7XG4gICAgfVxufTtcblxuLy8gcmV0dXJucyB0cnVlIGlmIHJlbW92ZWQsIGZhbHNlIGlmIG5vdCBmb3VuZFxuQmluVHJlZS5wcm90b3R5cGUucmVtb3ZlID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIGlmKHRoaXMuX3Jvb3QgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgIH1cblxuICAgIHZhciBoZWFkID0gbmV3IE5vZGUodW5kZWZpbmVkKTsgLy8gZmFrZSB0cmVlIHJvb3RcbiAgICB2YXIgbm9kZSA9IGhlYWQ7XG4gICAgbm9kZS5yaWdodCA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIHAgPSBudWxsOyAvLyBwYXJlbnRcbiAgICB2YXIgZm91bmQgPSBudWxsOyAvLyBmb3VuZCBpdGVtXG4gICAgdmFyIGRpciA9IDE7XG5cbiAgICB3aGlsZShub2RlLmdldF9jaGlsZChkaXIpICE9PSBudWxsKSB7XG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcbiAgICAgICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3IoZGF0YSwgbm9kZS5kYXRhKTtcbiAgICAgICAgZGlyID0gY21wID4gMDtcblxuICAgICAgICBpZihjbXAgPT09IDApIHtcbiAgICAgICAgICAgIGZvdW5kID0gbm9kZTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGlmKGZvdW5kICE9PSBudWxsKSB7XG4gICAgICAgIGZvdW5kLmRhdGEgPSBub2RlLmRhdGE7XG4gICAgICAgIHAuc2V0X2NoaWxkKHAucmlnaHQgPT09IG5vZGUsIG5vZGUuZ2V0X2NoaWxkKG5vZGUubGVmdCA9PT0gbnVsbCkpO1xuXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBoZWFkLnJpZ2h0O1xuICAgICAgICB0aGlzLnNpemUtLTtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBCaW5UcmVlO1xuXG4iLCJcbnZhciBUcmVlQmFzZSA9IHJlcXVpcmUoJy4vdHJlZWJhc2UnKTtcblxuZnVuY3Rpb24gTm9kZShkYXRhKSB7XG4gICAgdGhpcy5kYXRhID0gZGF0YTtcbiAgICB0aGlzLmxlZnQgPSBudWxsO1xuICAgIHRoaXMucmlnaHQgPSBudWxsO1xuICAgIHRoaXMucmVkID0gdHJ1ZTtcbn1cblxuTm9kZS5wcm90b3R5cGUuZ2V0X2NoaWxkID0gZnVuY3Rpb24oZGlyKSB7XG4gICAgcmV0dXJuIGRpciA/IHRoaXMucmlnaHQgOiB0aGlzLmxlZnQ7XG59O1xuXG5Ob2RlLnByb3RvdHlwZS5zZXRfY2hpbGQgPSBmdW5jdGlvbihkaXIsIHZhbCkge1xuICAgIGlmKGRpcikge1xuICAgICAgICB0aGlzLnJpZ2h0ID0gdmFsO1xuICAgIH1cbiAgICBlbHNlIHtcbiAgICAgICAgdGhpcy5sZWZ0ID0gdmFsO1xuICAgIH1cbn07XG5cbmZ1bmN0aW9uIFJCVHJlZShjb21wYXJhdG9yKSB7XG4gICAgdGhpcy5fcm9vdCA9IG51bGw7XG4gICAgdGhpcy5fY29tcGFyYXRvciA9IGNvbXBhcmF0b3I7XG4gICAgdGhpcy5zaXplID0gMDtcbn1cblxuUkJUcmVlLnByb3RvdHlwZSA9IG5ldyBUcmVlQmFzZSgpO1xuXG4vLyByZXR1cm5zIHRydWUgaWYgaW5zZXJ0ZWQsIGZhbHNlIGlmIGR1cGxpY2F0ZVxuUkJUcmVlLnByb3RvdHlwZS5pbnNlcnQgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJldCA9IGZhbHNlO1xuXG4gICAgaWYodGhpcy5fcm9vdCA9PT0gbnVsbCkge1xuICAgICAgICAvLyBlbXB0eSB0cmVlXG4gICAgICAgIHRoaXMuX3Jvb3QgPSBuZXcgTm9kZShkYXRhKTtcbiAgICAgICAgcmV0ID0gdHJ1ZTtcbiAgICAgICAgdGhpcy5zaXplKys7XG4gICAgfVxuICAgIGVsc2Uge1xuICAgICAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG5cbiAgICAgICAgdmFyIGRpciA9IDA7XG4gICAgICAgIHZhciBsYXN0ID0gMDtcblxuICAgICAgICAvLyBzZXR1cFxuICAgICAgICB2YXIgZ3AgPSBudWxsOyAvLyBncmFuZHBhcmVudFxuICAgICAgICB2YXIgZ2dwID0gaGVhZDsgLy8gZ3JhbmQtZ3JhbmQtcGFyZW50XG4gICAgICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgICAgIHZhciBub2RlID0gdGhpcy5fcm9vdDtcbiAgICAgICAgZ2dwLnJpZ2h0ID0gdGhpcy5fcm9vdDtcblxuICAgICAgICAvLyBzZWFyY2ggZG93blxuICAgICAgICB3aGlsZSh0cnVlKSB7XG4gICAgICAgICAgICBpZihub2RlID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgLy8gaW5zZXJ0IG5ldyBub2RlIGF0IHRoZSBib3R0b21cbiAgICAgICAgICAgICAgICBub2RlID0gbmV3IE5vZGUoZGF0YSk7XG4gICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQoZGlyLCBub2RlKTtcbiAgICAgICAgICAgICAgICByZXQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIHRoaXMuc2l6ZSsrO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgZWxzZSBpZihpc19yZWQobm9kZS5sZWZ0KSAmJiBpc19yZWQobm9kZS5yaWdodCkpIHtcbiAgICAgICAgICAgICAgICAvLyBjb2xvciBmbGlwXG4gICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgIG5vZGUubGVmdC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBub2RlLnJpZ2h0LnJlZCA9IGZhbHNlO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAvLyBmaXggcmVkIHZpb2xhdGlvblxuICAgICAgICAgICAgaWYoaXNfcmVkKG5vZGUpICYmIGlzX3JlZChwKSkge1xuICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ2dwLnJpZ2h0ID09PSBncDtcblxuICAgICAgICAgICAgICAgIGlmKG5vZGUgPT09IHAuZ2V0X2NoaWxkKGxhc3QpKSB7XG4gICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgc2luZ2xlX3JvdGF0ZShncCwgIWxhc3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgIGdncC5zZXRfY2hpbGQoZGlyMiwgZG91YmxlX3JvdGF0ZShncCwgIWxhc3QpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIHZhciBjbXAgPSB0aGlzLl9jb21wYXJhdG9yKG5vZGUuZGF0YSwgZGF0YSk7XG5cbiAgICAgICAgICAgIC8vIHN0b3AgaWYgZm91bmRcbiAgICAgICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBsYXN0ID0gZGlyO1xuICAgICAgICAgICAgZGlyID0gY21wIDwgMDtcblxuICAgICAgICAgICAgLy8gdXBkYXRlIGhlbHBlcnNcbiAgICAgICAgICAgIGlmKGdwICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgZ2dwID0gZ3A7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICBncCA9IHA7XG4gICAgICAgICAgICBwID0gbm9kZTtcbiAgICAgICAgICAgIG5vZGUgPSBub2RlLmdldF9jaGlsZChkaXIpO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdXBkYXRlIHJvb3RcbiAgICAgICAgdGhpcy5fcm9vdCA9IGhlYWQucmlnaHQ7XG4gICAgfVxuXG4gICAgLy8gbWFrZSByb290IGJsYWNrXG4gICAgdGhpcy5fcm9vdC5yZWQgPSBmYWxzZTtcblxuICAgIHJldHVybiByZXQ7XG59O1xuXG4vLyByZXR1cm5zIHRydWUgaWYgcmVtb3ZlZCwgZmFsc2UgaWYgbm90IGZvdW5kXG5SQlRyZWUucHJvdG90eXBlLnJlbW92ZSA9IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICBpZih0aGlzLl9yb290ID09PSBudWxsKSB7XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9XG5cbiAgICB2YXIgaGVhZCA9IG5ldyBOb2RlKHVuZGVmaW5lZCk7IC8vIGZha2UgdHJlZSByb290XG4gICAgdmFyIG5vZGUgPSBoZWFkO1xuICAgIG5vZGUucmlnaHQgPSB0aGlzLl9yb290O1xuICAgIHZhciBwID0gbnVsbDsgLy8gcGFyZW50XG4gICAgdmFyIGdwID0gbnVsbDsgLy8gZ3JhbmQgcGFyZW50XG4gICAgdmFyIGZvdW5kID0gbnVsbDsgLy8gZm91bmQgaXRlbVxuICAgIHZhciBkaXIgPSAxO1xuXG4gICAgd2hpbGUobm9kZS5nZXRfY2hpbGQoZGlyKSAhPT0gbnVsbCkge1xuICAgICAgICB2YXIgbGFzdCA9IGRpcjtcblxuICAgICAgICAvLyB1cGRhdGUgaGVscGVyc1xuICAgICAgICBncCA9IHA7XG4gICAgICAgIHAgPSBub2RlO1xuICAgICAgICBub2RlID0gbm9kZS5nZXRfY2hpbGQoZGlyKTtcblxuICAgICAgICB2YXIgY21wID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCBub2RlLmRhdGEpO1xuXG4gICAgICAgIGRpciA9IGNtcCA+IDA7XG5cbiAgICAgICAgLy8gc2F2ZSBmb3VuZCBub2RlXG4gICAgICAgIGlmKGNtcCA9PT0gMCkge1xuICAgICAgICAgICAgZm91bmQgPSBub2RlO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gcHVzaCB0aGUgcmVkIG5vZGUgZG93blxuICAgICAgICBpZighaXNfcmVkKG5vZGUpICYmICFpc19yZWQobm9kZS5nZXRfY2hpbGQoZGlyKSkpIHtcbiAgICAgICAgICAgIGlmKGlzX3JlZChub2RlLmdldF9jaGlsZCghZGlyKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc3IgPSBzaW5nbGVfcm90YXRlKG5vZGUsIGRpcik7XG4gICAgICAgICAgICAgICAgcC5zZXRfY2hpbGQobGFzdCwgc3IpO1xuICAgICAgICAgICAgICAgIHAgPSBzcjtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGVsc2UgaWYoIWlzX3JlZChub2RlLmdldF9jaGlsZCghZGlyKSkpIHtcbiAgICAgICAgICAgICAgICB2YXIgc2libGluZyA9IHAuZ2V0X2NoaWxkKCFsYXN0KTtcbiAgICAgICAgICAgICAgICBpZihzaWJsaW5nICE9PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmKCFpc19yZWQoc2libGluZy5nZXRfY2hpbGQoIWxhc3QpKSAmJiAhaXNfcmVkKHNpYmxpbmcuZ2V0X2NoaWxkKGxhc3QpKSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy8gY29sb3IgZmxpcFxuICAgICAgICAgICAgICAgICAgICAgICAgcC5yZWQgPSBmYWxzZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIHNpYmxpbmcucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIG5vZGUucmVkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhciBkaXIyID0gZ3AucmlnaHQgPT09IHA7XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGlzX3JlZChzaWJsaW5nLmdldF9jaGlsZChsYXN0KSkpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncC5zZXRfY2hpbGQoZGlyMiwgZG91YmxlX3JvdGF0ZShwLCBsYXN0KSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICBlbHNlIGlmKGlzX3JlZChzaWJsaW5nLmdldF9jaGlsZCghbGFzdCkpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3Auc2V0X2NoaWxkKGRpcjIsIHNpbmdsZV9yb3RhdGUocCwgbGFzdCkpO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBlbnN1cmUgY29ycmVjdCBjb2xvcmluZ1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGdwYyA9IGdwLmdldF9jaGlsZChkaXIyKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGdwYy5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgbm9kZS5yZWQgPSB0cnVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgZ3BjLmxlZnQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgICAgICBncGMucmlnaHQucmVkID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICAvLyByZXBsYWNlIGFuZCByZW1vdmUgaWYgZm91bmRcbiAgICBpZihmb3VuZCAhPT0gbnVsbCkge1xuICAgICAgICBmb3VuZC5kYXRhID0gbm9kZS5kYXRhO1xuICAgICAgICBwLnNldF9jaGlsZChwLnJpZ2h0ID09PSBub2RlLCBub2RlLmdldF9jaGlsZChub2RlLmxlZnQgPT09IG51bGwpKTtcbiAgICAgICAgdGhpcy5zaXplLS07XG4gICAgfVxuXG4gICAgLy8gdXBkYXRlIHJvb3QgYW5kIG1ha2UgaXQgYmxhY2tcbiAgICB0aGlzLl9yb290ID0gaGVhZC5yaWdodDtcbiAgICBpZih0aGlzLl9yb290ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX3Jvb3QucmVkID0gZmFsc2U7XG4gICAgfVxuXG4gICAgcmV0dXJuIGZvdW5kICE9PSBudWxsO1xufTtcblxuZnVuY3Rpb24gaXNfcmVkKG5vZGUpIHtcbiAgICByZXR1cm4gbm9kZSAhPT0gbnVsbCAmJiBub2RlLnJlZDtcbn1cblxuZnVuY3Rpb24gc2luZ2xlX3JvdGF0ZShyb290LCBkaXIpIHtcbiAgICB2YXIgc2F2ZSA9IHJvb3QuZ2V0X2NoaWxkKCFkaXIpO1xuXG4gICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgc2F2ZS5nZXRfY2hpbGQoZGlyKSk7XG4gICAgc2F2ZS5zZXRfY2hpbGQoZGlyLCByb290KTtcblxuICAgIHJvb3QucmVkID0gdHJ1ZTtcbiAgICBzYXZlLnJlZCA9IGZhbHNlO1xuXG4gICAgcmV0dXJuIHNhdmU7XG59XG5cbmZ1bmN0aW9uIGRvdWJsZV9yb3RhdGUocm9vdCwgZGlyKSB7XG4gICAgcm9vdC5zZXRfY2hpbGQoIWRpciwgc2luZ2xlX3JvdGF0ZShyb290LmdldF9jaGlsZCghZGlyKSwgIWRpcikpO1xuICAgIHJldHVybiBzaW5nbGVfcm90YXRlKHJvb3QsIGRpcik7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUkJUcmVlO1xuIiwiXG5mdW5jdGlvbiBUcmVlQmFzZSgpIHt9XG5cbi8vIHJlbW92ZXMgYWxsIG5vZGVzIGZyb20gdGhlIHRyZWVcblRyZWVCYXNlLnByb3RvdHlwZS5jbGVhciA9IGZ1bmN0aW9uKCkge1xuICAgIHRoaXMuX3Jvb3QgPSBudWxsO1xuICAgIHRoaXMuc2l6ZSA9IDA7XG59O1xuXG4vLyByZXR1cm5zIG5vZGUgZGF0YSBpZiBmb3VuZCwgbnVsbCBvdGhlcndpc2VcblRyZWVCYXNlLnByb3RvdHlwZS5maW5kID0gZnVuY3Rpb24oZGF0YSkge1xuICAgIHZhciByZXMgPSB0aGlzLl9yb290O1xuXG4gICAgd2hpbGUocmVzICE9PSBudWxsKSB7XG4gICAgICAgIHZhciBjID0gdGhpcy5fY29tcGFyYXRvcihkYXRhLCByZXMuZGF0YSk7XG4gICAgICAgIGlmKGMgPT09IDApIHtcbiAgICAgICAgICAgIHJldHVybiByZXMuZGF0YTtcbiAgICAgICAgfVxuICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgIHJlcyA9IHJlcy5nZXRfY2hpbGQoYyA+IDApO1xuICAgICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIG51bGw7XG59O1xuXG4vLyByZXR1cm5zIGl0ZXJhdG9yIHRvIG5vZGUgaWYgZm91bmQsIG51bGwgb3RoZXJ3aXNlXG5UcmVlQmFzZS5wcm90b3R5cGUuZmluZEl0ZXIgPSBmdW5jdGlvbihkYXRhKSB7XG4gICAgdmFyIHJlcyA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XG5cbiAgICB3aGlsZShyZXMgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSB0aGlzLl9jb21wYXJhdG9yKGRhdGEsIHJlcy5kYXRhKTtcbiAgICAgICAgaWYoYyA9PT0gMCkge1xuICAgICAgICAgICAgaXRlci5fY3Vyc29yID0gcmVzO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICBpdGVyLl9hbmNlc3RvcnMucHVzaChyZXMpO1xuICAgICAgICAgICAgcmVzID0gcmVzLmdldF9jaGlsZChjID4gMCk7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gbnVsbDtcbn07XG5cbi8vIFJldHVybnMgYW4gaXRlcmF0b3IgdG8gdGhlIHRyZWUgbm9kZSBhdCBvciBpbW1lZGlhdGVseSBhZnRlciB0aGUgaXRlbVxuVHJlZUJhc2UucHJvdG90eXBlLmxvd2VyQm91bmQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGN1ciA9IHRoaXMuX3Jvb3Q7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLml0ZXJhdG9yKCk7XG4gICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICB3aGlsZShjdXIgIT09IG51bGwpIHtcbiAgICAgICAgdmFyIGMgPSBjbXAoaXRlbSwgY3VyLmRhdGEpO1xuICAgICAgICBpZihjID09PSAwKSB7XG4gICAgICAgICAgICBpdGVyLl9jdXJzb3IgPSBjdXI7XG4gICAgICAgICAgICByZXR1cm4gaXRlcjtcbiAgICAgICAgfVxuICAgICAgICBpdGVyLl9hbmNlc3RvcnMucHVzaChjdXIpO1xuICAgICAgICBjdXIgPSBjdXIuZ2V0X2NoaWxkKGMgPiAwKTtcbiAgICB9XG5cbiAgICBmb3IodmFyIGk9aXRlci5fYW5jZXN0b3JzLmxlbmd0aCAtIDE7IGkgPj0gMDsgLS1pKSB7XG4gICAgICAgIGN1ciA9IGl0ZXIuX2FuY2VzdG9yc1tpXTtcbiAgICAgICAgaWYoY21wKGl0ZW0sIGN1ci5kYXRhKSA8IDApIHtcbiAgICAgICAgICAgIGl0ZXIuX2N1cnNvciA9IGN1cjtcbiAgICAgICAgICAgIGl0ZXIuX2FuY2VzdG9ycy5sZW5ndGggPSBpO1xuICAgICAgICAgICAgcmV0dXJuIGl0ZXI7XG4gICAgICAgIH1cbiAgICB9XG5cbiAgICBpdGVyLl9hbmNlc3RvcnMubGVuZ3RoID0gMDtcbiAgICByZXR1cm4gaXRlcjtcbn07XG5cbi8vIFJldHVybnMgYW4gaXRlcmF0b3IgdG8gdGhlIHRyZWUgbm9kZSBpbW1lZGlhdGVseSBhZnRlciB0aGUgaXRlbVxuVHJlZUJhc2UucHJvdG90eXBlLnVwcGVyQm91bmQgPSBmdW5jdGlvbihpdGVtKSB7XG4gICAgdmFyIGl0ZXIgPSB0aGlzLmxvd2VyQm91bmQoaXRlbSk7XG4gICAgdmFyIGNtcCA9IHRoaXMuX2NvbXBhcmF0b3I7XG5cbiAgICB3aGlsZShpdGVyLmRhdGEoKSAhPT0gbnVsbCAmJiBjbXAoaXRlci5kYXRhKCksIGl0ZW0pID09PSAwKSB7XG4gICAgICAgIGl0ZXIubmV4dCgpO1xuICAgIH1cblxuICAgIHJldHVybiBpdGVyO1xufTtcblxuLy8gcmV0dXJucyBudWxsIGlmIHRyZWUgaXMgZW1wdHlcblRyZWVCYXNlLnByb3RvdHlwZS5taW4gPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICBpZihyZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgd2hpbGUocmVzLmxlZnQgIT09IG51bGwpIHtcbiAgICAgICAgcmVzID0gcmVzLmxlZnQ7XG4gICAgfVxuXG4gICAgcmV0dXJuIHJlcy5kYXRhO1xufTtcblxuLy8gcmV0dXJucyBudWxsIGlmIHRyZWUgaXMgZW1wdHlcblRyZWVCYXNlLnByb3RvdHlwZS5tYXggPSBmdW5jdGlvbigpIHtcbiAgICB2YXIgcmVzID0gdGhpcy5fcm9vdDtcbiAgICBpZihyZXMgPT09IG51bGwpIHtcbiAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuXG4gICAgd2hpbGUocmVzLnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIHJlcyA9IHJlcy5yaWdodDtcbiAgICB9XG5cbiAgICByZXR1cm4gcmVzLmRhdGE7XG59O1xuXG4vLyByZXR1cm5zIGEgbnVsbCBpdGVyYXRvclxuLy8gY2FsbCBuZXh0KCkgb3IgcHJldigpIHRvIHBvaW50IHRvIGFuIGVsZW1lbnRcblRyZWVCYXNlLnByb3RvdHlwZS5pdGVyYXRvciA9IGZ1bmN0aW9uKCkge1xuICAgIHJldHVybiBuZXcgSXRlcmF0b3IodGhpcyk7XG59O1xuXG4vLyBjYWxscyBjYiBvbiBlYWNoIG5vZGUncyBkYXRhLCBpbiBvcmRlclxuVHJlZUJhc2UucHJvdG90eXBlLmVhY2ggPSBmdW5jdGlvbihjYikge1xuICAgIHZhciBpdD10aGlzLml0ZXJhdG9yKCksIGRhdGE7XG4gICAgd2hpbGUoKGRhdGEgPSBpdC5uZXh0KCkpICE9PSBudWxsKSB7XG4gICAgICAgIGNiKGRhdGEpO1xuICAgIH1cbn07XG5cbi8vIGNhbGxzIGNiIG9uIGVhY2ggbm9kZSdzIGRhdGEsIGluIHJldmVyc2Ugb3JkZXJcblRyZWVCYXNlLnByb3RvdHlwZS5yZWFjaCA9IGZ1bmN0aW9uKGNiKSB7XG4gICAgdmFyIGl0PXRoaXMuaXRlcmF0b3IoKSwgZGF0YTtcbiAgICB3aGlsZSgoZGF0YSA9IGl0LnByZXYoKSkgIT09IG51bGwpIHtcbiAgICAgICAgY2IoZGF0YSk7XG4gICAgfVxufTtcblxuXG5mdW5jdGlvbiBJdGVyYXRvcih0cmVlKSB7XG4gICAgdGhpcy5fdHJlZSA9IHRyZWU7XG4gICAgdGhpcy5fYW5jZXN0b3JzID0gW107XG4gICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbn1cblxuSXRlcmF0b3IucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbigpIHtcbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuLy8gaWYgbnVsbC1pdGVyYXRvciwgcmV0dXJucyBmaXJzdCBub2RlXG4vLyBvdGhlcndpc2UsIHJldHVybnMgbmV4dCBub2RlXG5JdGVyYXRvci5wcm90b3R5cGUubmV4dCA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XG4gICAgICAgIGlmKHJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21pbk5vZGUocm9vdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvci5yaWdodCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgLy8gbm8gZ3JlYXRlciBub2RlIGluIHN1YnRyZWUsIGdvIHVwIHRvIHBhcmVudFxuICAgICAgICAgICAgLy8gaWYgY29taW5nIGZyb20gYSByaWdodCBjaGlsZCwgY29udGludWUgdXAgdGhlIHN0YWNrXG4gICAgICAgICAgICB2YXIgc2F2ZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSh0aGlzLl9jdXJzb3IucmlnaHQgPT09IHNhdmUpO1xuICAgICAgICB9XG4gICAgICAgIGVsc2Uge1xuICAgICAgICAgICAgLy8gZ2V0IHRoZSBuZXh0IG5vZGUgZnJvbSB0aGUgc3VidHJlZVxuICAgICAgICAgICAgdGhpcy5fYW5jZXN0b3JzLnB1c2godGhpcy5fY3Vyc29yKTtcbiAgICAgICAgICAgIHRoaXMuX21pbk5vZGUodGhpcy5fY3Vyc29yLnJpZ2h0KTtcbiAgICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gdGhpcy5fY3Vyc29yICE9PSBudWxsID8gdGhpcy5fY3Vyc29yLmRhdGEgOiBudWxsO1xufTtcblxuLy8gaWYgbnVsbC1pdGVyYXRvciwgcmV0dXJucyBsYXN0IG5vZGVcbi8vIG90aGVyd2lzZSwgcmV0dXJucyBwcmV2aW91cyBub2RlXG5JdGVyYXRvci5wcm90b3R5cGUucHJldiA9IGZ1bmN0aW9uKCkge1xuICAgIGlmKHRoaXMuX2N1cnNvciA9PT0gbnVsbCkge1xuICAgICAgICB2YXIgcm9vdCA9IHRoaXMuX3RyZWUuX3Jvb3Q7XG4gICAgICAgIGlmKHJvb3QgIT09IG51bGwpIHtcbiAgICAgICAgICAgIHRoaXMuX21heE5vZGUocm9vdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgZWxzZSB7XG4gICAgICAgIGlmKHRoaXMuX2N1cnNvci5sZWZ0ID09PSBudWxsKSB7XG4gICAgICAgICAgICB2YXIgc2F2ZTtcbiAgICAgICAgICAgIGRvIHtcbiAgICAgICAgICAgICAgICBzYXZlID0gdGhpcy5fY3Vyc29yO1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuX2FuY2VzdG9ycy5sZW5ndGgpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gdGhpcy5fYW5jZXN0b3JzLnBvcCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5fY3Vyc29yID0gbnVsbDtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSB3aGlsZSh0aGlzLl9jdXJzb3IubGVmdCA9PT0gc2F2ZSk7XG4gICAgICAgIH1cbiAgICAgICAgZWxzZSB7XG4gICAgICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaCh0aGlzLl9jdXJzb3IpO1xuICAgICAgICAgICAgdGhpcy5fbWF4Tm9kZSh0aGlzLl9jdXJzb3IubGVmdCk7XG4gICAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIHRoaXMuX2N1cnNvciAhPT0gbnVsbCA/IHRoaXMuX2N1cnNvci5kYXRhIDogbnVsbDtcbn07XG5cbkl0ZXJhdG9yLnByb3RvdHlwZS5fbWluTm9kZSA9IGZ1bmN0aW9uKHN0YXJ0KSB7XG4gICAgd2hpbGUoc3RhcnQubGVmdCAhPT0gbnVsbCkge1xuICAgICAgICB0aGlzLl9hbmNlc3RvcnMucHVzaChzdGFydCk7XG4gICAgICAgIHN0YXJ0ID0gc3RhcnQubGVmdDtcbiAgICB9XG4gICAgdGhpcy5fY3Vyc29yID0gc3RhcnQ7XG59O1xuXG5JdGVyYXRvci5wcm90b3R5cGUuX21heE5vZGUgPSBmdW5jdGlvbihzdGFydCkge1xuICAgIHdoaWxlKHN0YXJ0LnJpZ2h0ICE9PSBudWxsKSB7XG4gICAgICAgIHRoaXMuX2FuY2VzdG9ycy5wdXNoKHN0YXJ0KTtcbiAgICAgICAgc3RhcnQgPSBzdGFydC5yaWdodDtcbiAgICB9XG4gICAgdGhpcy5fY3Vyc29yID0gc3RhcnQ7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRyZWVCYXNlO1xuXG4iLCJcbi8qKlxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgZGF0YSBHZW9KU09OXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gICBwcm9qZWN0XG4gKiBAcGFyYW0gIHsqPX0gICAgICAgICBjb250ZXh0XG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oZGF0YSwgcHJvamVjdCwgY29udGV4dCkge1xuICBkYXRhID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShkYXRhKSk7XG4gIGlmIChkYXRhLnR5cGUgPT09ICdGZWF0dXJlQ29sbGVjdGlvbicpIHtcbiAgICAvLyBUaGF0J3MgYSBodWdlIGhhY2sgdG8gZ2V0IHRoaW5ncyB3b3JraW5nIHdpdGggYm90aCBBcmNHSVMgc2VydmVyXG4gICAgLy8gYW5kIEdlb1NlcnZlci4gR2Vvc2VydmVyIHByb3ZpZGVzIGNycyByZWZlcmVuY2UgaW4gR2VvSlNPTiwgQXJjR0lTIOKAlFxuICAgIC8vIGRvZXNuJ3QuXG4gICAgLy9pZiAoZGF0YS5jcnMpIGRlbGV0ZSBkYXRhLmNycztcbiAgICBmb3IgKHZhciBpID0gZGF0YS5mZWF0dXJlcy5sZW5ndGggLSAxOyBpID49IDA7IGktLSkge1xuICAgICAgZGF0YS5mZWF0dXJlc1tpXSA9IHByb2plY3RGZWF0dXJlKGRhdGEuZmVhdHVyZXNbaV0sIHByb2plY3QsIGNvbnRleHQpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBkYXRhID0gcHJvamVjdEZlYXR1cmUoZGF0YSwgcHJvamVjdCwgY29udGV4dCk7XG4gIH1cbiAgcmV0dXJuIGRhdGE7XG59O1xuXG5tb2R1bGUuZXhwb3J0cy5wcm9qZWN0RmVhdHVyZSAgPSBwcm9qZWN0RmVhdHVyZTtcbm1vZHVsZS5leHBvcnRzLnByb2plY3RHZW9tZXRyeSA9IHByb2plY3RHZW9tZXRyeTtcblxuXG4vKipcbiAqIEBwYXJhbSAge09iamVjdH0gICAgIGRhdGEgR2VvSlNPTlxuICogQHBhcmFtICB7RnVuY3Rpb259ICAgcHJvamVjdFxuICogQHBhcmFtICB7Kj19ICAgICAgICAgY29udGV4dFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5mdW5jdGlvbiBwcm9qZWN0RmVhdHVyZShmZWF0dXJlLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIGlmIChmZWF0dXJlLnR5cGUgPT09ICdHZW9tZXRyeUNvbGxlY3Rpb24nKSB7XG4gICAgZm9yICh2YXIgaSA9IDAsIGxlbiA9IGZlYXR1cmUuZ2VvbWV0cmllcy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgICAgZmVhdHVyZS5nZW9tZXRyaWVzW2ldID1cbiAgICAgICAgcHJvamVjdEdlb21ldHJ5KGZlYXR1cmUuZ2VvbWV0cmllc1tpXSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZlYXR1cmUuZ2VvbWV0cnkgPSBwcm9qZWN0R2VvbWV0cnkoZmVhdHVyZS5nZW9tZXRyeSwgcHJvamVjdCwgY29udGV4dCk7XG4gIH1cbiAgcmV0dXJuIGZlYXR1cmU7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtPYmplY3R9ICAgICBkYXRhIEdlb0pTT05cbiAqIEBwYXJhbSAge0Z1bmN0aW9ufSAgIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4ge09iamVjdH1cbiAqL1xuZnVuY3Rpb24gcHJvamVjdEdlb21ldHJ5KGdlb21ldHJ5LCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIHZhciBjb29yZHMgPSBnZW9tZXRyeS5jb29yZGluYXRlcztcbiAgc3dpdGNoIChnZW9tZXRyeS50eXBlKSB7XG4gICAgY2FzZSAnUG9pbnQnOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0LmNhbGwoY29udGV4dCwgY29vcmRzKTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlQb2ludCc6XG4gICAgY2FzZSAnTGluZVN0cmluZyc6XG4gICAgICBmb3IgKHZhciBpID0gMCwgbGVuID0gY29vcmRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICAgIGNvb3Jkc1tpXSA9IHByb2plY3QuY2FsbChjb250ZXh0LCBjb29yZHNbaV0pO1xuICAgICAgfVxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBjb29yZHM7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ1BvbHlnb24nOlxuICAgICAgZ2VvbWV0cnkuY29vcmRpbmF0ZXMgPSBwcm9qZWN0Q29vcmRzKGNvb3JkcywgMSwgcHJvamVjdCwgY29udGV4dCk7XG4gICAgICBicmVhaztcblxuICAgIGNhc2UgJ011bHRpTGluZVN0cmluZyc6XG4gICAgICBnZW9tZXRyeS5jb29yZGluYXRlcyA9IHByb2plY3RDb29yZHMoY29vcmRzLCAxLCBwcm9qZWN0LCBjb250ZXh0KTtcbiAgICAgIGJyZWFrO1xuXG4gICAgY2FzZSAnTXVsdGlQb2x5Z29uJzpcbiAgICAgIGdlb21ldHJ5LmNvb3JkaW5hdGVzID0gcHJvamVjdENvb3Jkcyhjb29yZHMsIDIsIHByb2plY3QsIGNvbnRleHQpO1xuICAgICAgYnJlYWs7XG5cbiAgICBkZWZhdWx0OlxuICAgICAgYnJlYWs7XG4gIH1cbiAgcmV0dXJuIGdlb21ldHJ5O1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7Kn0gICAgICAgICBjb29yZHMgQ29vcmRzIGFycmF5c1xuICogQHBhcmFtICB7TnVtYmVyfSAgICBsZXZlbHNEZWVwXG4gKiBAcGFyYW0gIHtGdW5jdGlvbn0gIHByb2plY3RcbiAqIEBwYXJhbSAgeyo9fSAgICAgICAgIGNvbnRleHRcbiAqIEByZXR1cm4geyp9XG4gKi9cbmZ1bmN0aW9uIHByb2plY3RDb29yZHMoY29vcmRzLCBsZXZlbHNEZWVwLCBwcm9qZWN0LCBjb250ZXh0KSB7XG4gIHZhciBjb29yZCwgaSwgbGVuO1xuICB2YXIgcmVzdWx0ID0gW107XG5cbiAgZm9yIChpID0gMCwgbGVuID0gY29vcmRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgY29vcmQgPSBsZXZlbHNEZWVwID9cbiAgICAgIHByb2plY3RDb29yZHMoY29vcmRzW2ldLCBsZXZlbHNEZWVwIC0gMSwgcHJvamVjdCwgY29udGV4dCkgOlxuICAgICAgcHJvamVjdC5jYWxsKGNvbnRleHQsIGNvb3Jkc1tpXSk7XG5cbiAgICByZXN1bHQucHVzaChjb29yZCk7XG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuIiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuL3NyYy9pbmRleCcpO1xuIiwidmFyIHNpZ25lZEFyZWEgPSByZXF1aXJlKCcuL3NpZ25lZF9hcmVhJyk7XG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gZTFcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IGUyXG4gKiBAcmV0dXJuIHtOdW1iZXJ9XG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3dlZXBFdmVudHNDb21wKGUxLCBlMikge1xuICB2YXIgcDEgPSBlMS5wb2ludDtcbiAgdmFyIHAyID0gZTIucG9pbnQ7XG5cbiAgLy8gRGlmZmVyZW50IHgtY29vcmRpbmF0ZVxuICBpZiAocDFbMF0gPiBwMlswXSkgcmV0dXJuIDE7XG4gIGlmIChwMVswXSA8IHAyWzBdKSByZXR1cm4gLTE7XG5cbiAgLy8gRGlmZmVyZW50IHBvaW50cywgYnV0IHNhbWUgeC1jb29yZGluYXRlXG4gIC8vIEV2ZW50IHdpdGggbG93ZXIgeS1jb29yZGluYXRlIGlzIHByb2Nlc3NlZCBmaXJzdFxuICBpZiAocDFbMV0gIT09IHAyWzFdKSByZXR1cm4gcDFbMV0gPiBwMlsxXSA/IDEgOiAtMTtcblxuICByZXR1cm4gc3BlY2lhbENhc2VzKGUxLCBlMiwgcDEsIHAyKTtcbn07XG5cblxuZnVuY3Rpb24gc3BlY2lhbENhc2VzKGUxLCBlMiwgcDEsIHAyKSB7XG4gIC8vIFNhbWUgY29vcmRpbmF0ZXMsIGJ1dCBvbmUgaXMgYSBsZWZ0IGVuZHBvaW50IGFuZCB0aGUgb3RoZXIgaXNcbiAgLy8gYSByaWdodCBlbmRwb2ludC4gVGhlIHJpZ2h0IGVuZHBvaW50IGlzIHByb2Nlc3NlZCBmaXJzdFxuICBpZiAoZTEubGVmdCAhPT0gZTIubGVmdClcbiAgICByZXR1cm4gZTEubGVmdCA/IDEgOiAtMTtcblxuICAvLyBTYW1lIGNvb3JkaW5hdGVzLCBib3RoIGV2ZW50c1xuICAvLyBhcmUgbGVmdCBlbmRwb2ludHMgb3IgcmlnaHQgZW5kcG9pbnRzLlxuICAvLyBub3QgY29sbGluZWFyXG4gIGlmIChzaWduZWRBcmVhIChwMSwgZTEub3RoZXJFdmVudC5wb2ludCwgZTIub3RoZXJFdmVudC5wb2ludCkgIT09IDApIHtcbiAgICAvLyB0aGUgZXZlbnQgYXNzb2NpYXRlIHRvIHRoZSBib3R0b20gc2VnbWVudCBpcyBwcm9jZXNzZWQgZmlyc3RcbiAgICByZXR1cm4gKCFlMS5pc0JlbG93KGUyLm90aGVyRXZlbnQucG9pbnQpKSA/IDEgOiAtMTtcbiAgfVxuXG4gIGlmIChlMS5pc1N1YmplY3QgPT09IGUyLmlzU3ViamVjdCkge1xuICAgIGlmKGUxLmNvbnRvdXJJZCA9PT0gZTIuY29udG91cklkKXtcbiAgICAgIHJldHVybiAwO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gZTEuY29udG91cklkID4gZTIuY29udG91cklkID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiAoIWUxLmlzU3ViamVjdCAmJiBlMi5pc1N1YmplY3QpID8gMSA6IC0xO1xuICAvL3JldHVybiBlMS5pc1N1YmplY3QgPyAtMSA6IDE7XG59XG4iLCJ2YXIgc2lnbmVkQXJlYSAgICA9IHJlcXVpcmUoJy4vc2lnbmVkX2FyZWEnKTtcbnZhciBjb21wYXJlRXZlbnRzID0gcmVxdWlyZSgnLi9jb21wYXJlX2V2ZW50cycpO1xudmFyIGVxdWFscyAgICAgICAgPSByZXF1aXJlKCcuL2VxdWFscycpO1xuXG5cbi8qKlxuICogQHBhcmFtICB7U3dlZXBFdmVudH0gbGUxXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBsZTJcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBjb21wYXJlU2VnbWVudHMobGUxLCBsZTIpIHtcbiAgaWYgKGxlMSA9PT0gbGUyKSByZXR1cm4gMDtcblxuICAvLyBTZWdtZW50cyBhcmUgbm90IGNvbGxpbmVhclxuICBpZiAoc2lnbmVkQXJlYShsZTEucG9pbnQsIGxlMS5vdGhlckV2ZW50LnBvaW50LCBsZTIucG9pbnQpICE9PSAwIHx8XG4gICAgc2lnbmVkQXJlYShsZTEucG9pbnQsIGxlMS5vdGhlckV2ZW50LnBvaW50LCBsZTIub3RoZXJFdmVudC5wb2ludCkgIT09IDApIHtcblxuICAgIC8vIElmIHRoZXkgc2hhcmUgdGhlaXIgbGVmdCBlbmRwb2ludCB1c2UgdGhlIHJpZ2h0IGVuZHBvaW50IHRvIHNvcnRcbiAgICBpZiAoZXF1YWxzKGxlMS5wb2ludCwgbGUyLnBvaW50KSkgcmV0dXJuIGxlMS5pc0JlbG93KGxlMi5vdGhlckV2ZW50LnBvaW50KSA/IC0xIDogMTtcblxuICAgIC8vIERpZmZlcmVudCBsZWZ0IGVuZHBvaW50OiB1c2UgdGhlIGxlZnQgZW5kcG9pbnQgdG8gc29ydFxuICAgIGlmIChsZTEucG9pbnRbMF0gPT09IGxlMi5wb2ludFswXSkgcmV0dXJuIGxlMS5wb2ludFsxXSA8IGxlMi5wb2ludFsxXSA/IC0xIDogMTtcblxuICAgIC8vIGhhcyB0aGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTEgYmVlbiBpbnNlcnRlZFxuICAgIC8vIGludG8gUyBhZnRlciB0aGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTIgP1xuICAgIGlmIChjb21wYXJlRXZlbnRzKGxlMSwgbGUyKSA9PT0gMSkgcmV0dXJuIGxlMi5pc0Fib3ZlKGxlMS5wb2ludCkgPyAtMSA6IDE7XG5cbiAgICAvLyBUaGUgbGluZSBzZWdtZW50IGFzc29jaWF0ZWQgdG8gZTIgaGFzIGJlZW4gaW5zZXJ0ZWRcbiAgICAvLyBpbnRvIFMgYWZ0ZXIgdGhlIGxpbmUgc2VnbWVudCBhc3NvY2lhdGVkIHRvIGUxXG4gICAgcmV0dXJuIGxlMS5pc0JlbG93KGxlMi5wb2ludCkgPyAtMSA6IDE7XG4gIH1cblxuICBpZiAobGUxLmlzU3ViamVjdCA9PT0gbGUyLmlzU3ViamVjdCl7XG4gICAgaWYgKGVxdWFscyhsZTEucG9pbnQsIGxlMi5wb2ludCkpIHtcbiAgICAgIGlmIChsZTEuY29udG91cklkID09PSBsZTIuY29udG91cklkKXtcbiAgICAgICAgcmV0dXJuIDA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gbGUxLmNvbnRvdXJJZCA+IGxlMi5jb250b3VySWQgPyAxIDogLTE7XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIFNlZ21lbnRzIGFyZSBjb2xsaW5lYXJcbiAgICAgIGlmIChsZTEuaXNTdWJqZWN0ICE9PSBsZTIuaXNTdWJqZWN0KSByZXR1cm4gKGxlMS5pc1N1YmplY3QgJiYgIWxlMi5pc1N1YmplY3QpID8gMSA6IC0xO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBjb21wYXJlRXZlbnRzKGxlMSwgbGUyKSA9PT0gMSA/IDEgOiAtMTtcbn07XG4iLCJtb2R1bGUuZXhwb3J0cyA9IHsgXG4gIE5PUk1BTDogICAgICAgICAgICAgICAwLCBcbiAgTk9OX0NPTlRSSUJVVElORzogICAgIDEsIFxuICBTQU1FX1RSQU5TSVRJT046ICAgICAgMiwgXG4gIERJRkZFUkVOVF9UUkFOU0lUSU9OOiAzXG59O1xuIiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBlcXVhbHMocDEsIHAyKSB7XG4gIHJldHVybiBwMVswXSA9PT0gcDJbMF0gJiYgcDFbMV0gPT09IHAyWzFdO1xufTsiLCJ2YXIgSU5URVJTRUNUSU9OICAgID0gMDtcbnZhciBVTklPTiAgICAgICAgICAgPSAxO1xudmFyIERJRkZFUkVOQ0UgICAgICA9IDI7XG52YXIgWE9SICAgICAgICAgICAgID0gMztcblxudmFyIEVNUFRZICAgICAgICAgICA9IFtdO1xuXG52YXIgZWRnZVR5cGUgICAgICAgID0gcmVxdWlyZSgnLi9lZGdlX3R5cGUnKTtcblxudmFyIFF1ZXVlICAgICAgICAgICA9IHJlcXVpcmUoJ3RpbnlxdWV1ZScpO1xudmFyIFRyZWUgICAgICAgICAgICA9IHJlcXVpcmUoJ2JpbnRyZWVzJykuUkJUcmVlO1xudmFyIFN3ZWVwRXZlbnQgICAgICA9IHJlcXVpcmUoJy4vc3dlZXBfZXZlbnQnKTtcblxudmFyIGNvbXBhcmVFdmVudHMgICA9IHJlcXVpcmUoJy4vY29tcGFyZV9ldmVudHMnKTtcbnZhciBjb21wYXJlU2VnbWVudHMgPSByZXF1aXJlKCcuL2NvbXBhcmVfc2VnbWVudHMnKTtcbnZhciBpbnRlcnNlY3Rpb24gICAgPSByZXF1aXJlKCcuL3NlZ21lbnRfaW50ZXJzZWN0aW9uJyk7XG52YXIgZXF1YWxzICAgICAgICAgID0gcmVxdWlyZSgnLi9lcXVhbHMnKTtcblxudmFyIG1heCA9IE1hdGgubWF4O1xudmFyIG1pbiA9IE1hdGgubWluO1xuXG4vKipcbiAqIEBwYXJhbSAgezxBcnJheS48TnVtYmVyPn0gczFcbiAqIEBwYXJhbSAgezxBcnJheS48TnVtYmVyPn0gczJcbiAqIEBwYXJhbSAge0Jvb2xlYW59ICAgICAgICAgaXNTdWJqZWN0XG4gKiBAcGFyYW0gIHtRdWV1ZX0gICAgICAgICAgIGV2ZW50UXVldWVcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgYmJveFxuICovXG5mdW5jdGlvbiBwcm9jZXNzU2VnbWVudChzMSwgczIsIGlzU3ViamVjdCwgZGVwdGgsIGV2ZW50UXVldWUsIGJib3gpIHtcbiAgLy8gUG9zc2libGUgZGVnZW5lcmF0ZSBjb25kaXRpb24uXG4gIC8vIGlmIChlcXVhbHMoczEsIHMyKSkgcmV0dXJuO1xuXG4gIHZhciBlMSA9IG5ldyBTd2VlcEV2ZW50KHMxLCBmYWxzZSwgdW5kZWZpbmVkLCBpc1N1YmplY3QpO1xuICB2YXIgZTIgPSBuZXcgU3dlZXBFdmVudChzMiwgZmFsc2UsIGUxLCAgICAgICAgaXNTdWJqZWN0KTtcbiAgZTEub3RoZXJFdmVudCA9IGUyO1xuXG4gIGUxLmNvbnRvdXJJZCA9IGUyLmNvbnRvdXJJZCA9IGRlcHRoO1xuXG4gIGlmIChjb21wYXJlRXZlbnRzKGUxLCBlMikgPiAwKSB7XG4gICAgZTIubGVmdCA9IHRydWU7XG4gIH0gZWxzZSB7XG4gICAgZTEubGVmdCA9IHRydWU7XG4gIH1cblxuICBiYm94WzBdID0gbWluKGJib3hbMF0sIHMxWzBdKTtcbiAgYmJveFsxXSA9IG1pbihiYm94WzFdLCBzMVsxXSk7XG4gIGJib3hbMl0gPSBtYXgoYmJveFsyXSwgczFbMF0pO1xuICBiYm94WzNdID0gbWF4KGJib3hbM10sIHMxWzFdKTtcblxuICAvLyBQdXNoaW5nIGl0IHNvIHRoZSBxdWV1ZSBpcyBzb3J0ZWQgZnJvbSBsZWZ0IHRvIHJpZ2h0LFxuICAvLyB3aXRoIG9iamVjdCBvbiB0aGUgbGVmdCBoYXZpbmcgdGhlIGhpZ2hlc3QgcHJpb3JpdHkuXG4gIGV2ZW50UXVldWUucHVzaChlMSk7XG4gIGV2ZW50UXVldWUucHVzaChlMik7XG59XG5cbnZhciBjb250b3VySWQgPSAwO1xuXG5mdW5jdGlvbiBwcm9jZXNzUG9seWdvbihwb2x5Z29uLCBpc1N1YmplY3QsIGRlcHRoLCBxdWV1ZSwgYmJveCkge1xuICB2YXIgaSwgbGVuO1xuICBpZiAodHlwZW9mIHBvbHlnb25bMF1bMF0gPT09ICdudW1iZXInKSB7XG4gICAgZm9yIChpID0gMCwgbGVuID0gcG9seWdvbi5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIHByb2Nlc3NTZWdtZW50KHBvbHlnb25baV0sIHBvbHlnb25baSArIDFdLCBpc1N1YmplY3QsIGRlcHRoICsgMSwgcXVldWUsIGJib3gpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSBwb2x5Z29uLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgICBjb250b3VySWQrKztcbiAgICAgIHByb2Nlc3NQb2x5Z29uKHBvbHlnb25baV0sIGlzU3ViamVjdCwgY29udG91cklkLCBxdWV1ZSwgYmJveCk7XG4gICAgfVxuICB9XG59XG5cblxuZnVuY3Rpb24gZmlsbFF1ZXVlKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gpIHtcbiAgdmFyIGV2ZW50UXVldWUgPSBuZXcgUXVldWUobnVsbCwgY29tcGFyZUV2ZW50cyk7XG4gIGNvbnRvdXJJZCA9IDA7XG5cbiAgcHJvY2Vzc1BvbHlnb24oc3ViamVjdCwgIHRydWUsICAwLCBldmVudFF1ZXVlLCBzYmJveCk7XG4gIHByb2Nlc3NQb2x5Z29uKGNsaXBwaW5nLCBmYWxzZSwgMCwgZXZlbnRRdWV1ZSwgY2Jib3gpO1xuXG4gIHJldHVybiBldmVudFF1ZXVlO1xufVxuXG5cbmZ1bmN0aW9uIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYsIHN3ZWVwTGluZSwgb3BlcmF0aW9uKSB7XG4gIC8vIGNvbXB1dGUgaW5PdXQgYW5kIG90aGVySW5PdXQgZmllbGRzXG4gIGlmIChwcmV2ID09PSBudWxsKSB7XG4gICAgZXZlbnQuaW5PdXQgICAgICA9IGZhbHNlO1xuICAgIGV2ZW50Lm90aGVySW5PdXQgPSB0cnVlO1xuXG4gIC8vIHByZXZpb3VzIGxpbmUgc2VnbWVudCBpbiBzd2VlcGxpbmUgYmVsb25ncyB0byB0aGUgc2FtZSBwb2x5Z29uXG4gIH0gZWxzZSBpZiAoZXZlbnQuaXNTdWJqZWN0ID09PSBwcmV2LmlzU3ViamVjdCkge1xuICAgIGV2ZW50LmluT3V0ICAgICAgPSAhcHJldi5pbk91dDtcbiAgICBldmVudC5vdGhlckluT3V0ID0gcHJldi5vdGhlckluT3V0O1xuXG4gIC8vIHByZXZpb3VzIGxpbmUgc2VnbWVudCBpbiBzd2VlcGxpbmUgYmVsb25ncyB0byB0aGUgY2xpcHBpbmcgcG9seWdvblxuICB9IGVsc2Uge1xuICAgIGV2ZW50LmluT3V0ICAgICAgPSAhcHJldi5vdGhlckluT3V0O1xuICAgIGV2ZW50Lm90aGVySW5PdXQgPSBwcmV2LmlzVmVydGljYWwoKSA/ICFwcmV2LmluT3V0IDogcHJldi5pbk91dDtcbiAgfVxuXG4gIC8vIGNvbXB1dGUgcHJldkluUmVzdWx0IGZpZWxkXG4gIGlmIChwcmV2KSB7XG4gICAgZXZlbnQucHJldkluUmVzdWx0ID0gKCFpblJlc3VsdChwcmV2LCBvcGVyYXRpb24pIHx8IHByZXYuaXNWZXJ0aWNhbCgpKSA/XG4gICAgICAgcHJldi5wcmV2SW5SZXN1bHQgOiBwcmV2O1xuICB9XG4gIC8vIGNoZWNrIGlmIHRoZSBsaW5lIHNlZ21lbnQgYmVsb25ncyB0byB0aGUgQm9vbGVhbiBvcGVyYXRpb25cbiAgZXZlbnQuaW5SZXN1bHQgPSBpblJlc3VsdChldmVudCwgb3BlcmF0aW9uKTtcbn1cblxuXG5mdW5jdGlvbiBpblJlc3VsdChldmVudCwgb3BlcmF0aW9uKSB7XG4gIHN3aXRjaCAoZXZlbnQudHlwZSkge1xuICAgIGNhc2UgZWRnZVR5cGUuTk9STUFMOlxuICAgICAgc3dpdGNoIChvcGVyYXRpb24pIHtcbiAgICAgICAgY2FzZSBJTlRFUlNFQ1RJT046XG4gICAgICAgICAgcmV0dXJuICFldmVudC5vdGhlckluT3V0O1xuICAgICAgICBjYXNlIFVOSU9OOlxuICAgICAgICAgIHJldHVybiBldmVudC5vdGhlckluT3V0O1xuICAgICAgICBjYXNlIERJRkZFUkVOQ0U6XG4gICAgICAgICAgcmV0dXJuIChldmVudC5pc1N1YmplY3QgJiYgZXZlbnQub3RoZXJJbk91dCkgfHxcbiAgICAgICAgICAgICAgICAgKCFldmVudC5pc1N1YmplY3QgJiYgIWV2ZW50Lm90aGVySW5PdXQpO1xuICAgICAgICBjYXNlIFhPUjpcbiAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgIH1cbiAgICBjYXNlIGVkZ2VUeXBlLlNBTUVfVFJBTlNJVElPTjpcbiAgICAgIHJldHVybiBvcGVyYXRpb24gPT09IElOVEVSU0VDVElPTiB8fCBvcGVyYXRpb24gPT09IFVOSU9OO1xuICAgIGNhc2UgZWRnZVR5cGUuRElGRkVSRU5UX1RSQU5TSVRJT046XG4gICAgICByZXR1cm4gb3BlcmF0aW9uID09PSBESUZGRVJFTkNFO1xuICAgIGNhc2UgZWRnZVR5cGUuTk9OX0NPTlRSSUJVVElORzpcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgfVxuICByZXR1cm4gZmFsc2U7XG59XG5cblxuLyoqXG4gKiBAcGFyYW0gIHtTd2VlcEV2ZW50fSBzZTFcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IHNlMlxuICogQHBhcmFtICB7UXVldWV9ICAgICAgcXVldWVcbiAqIEByZXR1cm4ge051bWJlcn1cbiAqL1xuZnVuY3Rpb24gcG9zc2libGVJbnRlcnNlY3Rpb24oc2UxLCBzZTIsIHF1ZXVlKSB7XG4gIC8vIHRoYXQgZGlzYWxsb3dzIHNlbGYtaW50ZXJzZWN0aW5nIHBvbHlnb25zLFxuICAvLyBkaWQgY29zdCB1cyBoYWxmIGEgZGF5LCBzbyBJJ2xsIGxlYXZlIGl0XG4gIC8vIG91dCBvZiByZXNwZWN0XG4gIC8vIGlmIChzZTEuaXNTdWJqZWN0ID09PSBzZTIuaXNTdWJqZWN0KSByZXR1cm47XG5cbiAgdmFyIGludGVyID0gaW50ZXJzZWN0aW9uKFxuICAgIHNlMS5wb2ludCwgc2UxLm90aGVyRXZlbnQucG9pbnQsXG4gICAgc2UyLnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludFxuICApO1xuXG4gIHZhciBuaW50ZXJzZWN0aW9ucyA9IGludGVyID8gaW50ZXIubGVuZ3RoIDogMDtcbiAgaWYgKG5pbnRlcnNlY3Rpb25zID09PSAwKSByZXR1cm4gMDsgLy8gbm8gaW50ZXJzZWN0aW9uXG5cbiAgLy8gdGhlIGxpbmUgc2VnbWVudHMgaW50ZXJzZWN0IGF0IGFuIGVuZHBvaW50IG9mIGJvdGggbGluZSBzZWdtZW50c1xuICBpZiAoKG5pbnRlcnNlY3Rpb25zID09PSAxKSAmJlxuICAgICAgKGVxdWFscyhzZTEucG9pbnQsIHNlMi5wb2ludCkgfHxcbiAgICAgICBlcXVhbHMoc2UxLm90aGVyRXZlbnQucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50KSkpIHtcbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIGlmIChuaW50ZXJzZWN0aW9ucyA9PT0gMiAmJiBzZTEuaXNTdWJqZWN0ID09PSBzZTIuaXNTdWJqZWN0KXtcbiAgICBpZihzZTEuY29udG91cklkID09PSBzZTIuY29udG91cklkKXtcbiAgICBjb25zb2xlLndhcm4oJ0VkZ2VzIG9mIHRoZSBzYW1lIHBvbHlnb24gb3ZlcmxhcCcsXG4gICAgICBzZTEucG9pbnQsIHNlMS5vdGhlckV2ZW50LnBvaW50LCBzZTIucG9pbnQsIHNlMi5vdGhlckV2ZW50LnBvaW50KTtcbiAgICB9XG4gICAgLy90aHJvdyBuZXcgRXJyb3IoJ0VkZ2VzIG9mIHRoZSBzYW1lIHBvbHlnb24gb3ZlcmxhcCcpO1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgLy8gVGhlIGxpbmUgc2VnbWVudHMgYXNzb2NpYXRlZCB0byBzZTEgYW5kIHNlMiBpbnRlcnNlY3RcbiAgaWYgKG5pbnRlcnNlY3Rpb25zID09PSAxKSB7XG5cbiAgICAvLyBpZiB0aGUgaW50ZXJzZWN0aW9uIHBvaW50IGlzIG5vdCBhbiBlbmRwb2ludCBvZiBzZTFcbiAgICBpZiAoIWVxdWFscyhzZTEucG9pbnQsIGludGVyWzBdKSAmJiAhZXF1YWxzKHNlMS5vdGhlckV2ZW50LnBvaW50LCBpbnRlclswXSkpIHtcbiAgICAgIGRpdmlkZVNlZ21lbnQoc2UxLCBpbnRlclswXSwgcXVldWUpO1xuICAgIH1cblxuICAgIC8vIGlmIHRoZSBpbnRlcnNlY3Rpb24gcG9pbnQgaXMgbm90IGFuIGVuZHBvaW50IG9mIHNlMlxuICAgIGlmICghZXF1YWxzKHNlMi5wb2ludCwgaW50ZXJbMF0pICYmICFlcXVhbHMoc2UyLm90aGVyRXZlbnQucG9pbnQsIGludGVyWzBdKSkge1xuICAgICAgZGl2aWRlU2VnbWVudChzZTIsIGludGVyWzBdLCBxdWV1ZSk7XG4gICAgfVxuICAgIHJldHVybiAxO1xuICB9XG5cbiAgLy8gVGhlIGxpbmUgc2VnbWVudHMgYXNzb2NpYXRlZCB0byBzZTEgYW5kIHNlMiBvdmVybGFwXG4gIHZhciBldmVudHMgICAgICAgID0gW107XG4gIHZhciBsZWZ0Q29pbmNpZGUgID0gZmFsc2U7XG4gIHZhciByaWdodENvaW5jaWRlID0gZmFsc2U7XG5cbiAgaWYgKGVxdWFscyhzZTEucG9pbnQsIHNlMi5wb2ludCkpIHtcbiAgICBsZWZ0Q29pbmNpZGUgPSB0cnVlOyAvLyBsaW5rZWRcbiAgfSBlbHNlIGlmIChjb21wYXJlRXZlbnRzKHNlMSwgc2UyKSA9PT0gMSkge1xuICAgIGV2ZW50cy5wdXNoKHNlMiwgc2UxKTtcbiAgfSBlbHNlIHtcbiAgICBldmVudHMucHVzaChzZTEsIHNlMik7XG4gIH1cblxuICBpZiAoZXF1YWxzKHNlMS5vdGhlckV2ZW50LnBvaW50LCBzZTIub3RoZXJFdmVudC5wb2ludCkpIHtcbiAgICByaWdodENvaW5jaWRlID0gdHJ1ZTtcbiAgfSBlbHNlIGlmIChjb21wYXJlRXZlbnRzKHNlMS5vdGhlckV2ZW50LCBzZTIub3RoZXJFdmVudCkgPT09IDEpIHtcbiAgICBldmVudHMucHVzaChzZTIub3RoZXJFdmVudCwgc2UxLm90aGVyRXZlbnQpO1xuICB9IGVsc2Uge1xuICAgIGV2ZW50cy5wdXNoKHNlMS5vdGhlckV2ZW50LCBzZTIub3RoZXJFdmVudCk7XG4gIH1cblxuICBpZiAoKGxlZnRDb2luY2lkZSAmJiByaWdodENvaW5jaWRlKSB8fCBsZWZ0Q29pbmNpZGUpIHtcbiAgICAvLyBib3RoIGxpbmUgc2VnbWVudHMgYXJlIGVxdWFsIG9yIHNoYXJlIHRoZSBsZWZ0IGVuZHBvaW50XG4gICAgc2UxLnR5cGUgPSBlZGdlVHlwZS5OT05fQ09OVFJJQlVUSU5HO1xuICAgIHNlMi50eXBlID0gKHNlMS5pbk91dCA9PT0gc2UyLmluT3V0KSA/XG4gICAgICBlZGdlVHlwZS5TQU1FX1RSQU5TSVRJT04gOlxuICAgICAgZWRnZVR5cGUuRElGRkVSRU5UX1RSQU5TSVRJT047XG5cbiAgICBpZiAobGVmdENvaW5jaWRlICYmICFyaWdodENvaW5jaWRlKSB7XG4gICAgICAvLyBob25lc3RseSBubyBpZGVhLCBidXQgY2hhbmdpbmcgZXZlbnRzIHNlbGVjdGlvbiBmcm9tIFsyLCAxXVxuICAgICAgLy8gdG8gWzAsIDFdIGZpeGVzIHRoZSBvdmVybGFwcGluZyBzZWxmLWludGVyc2VjdGluZyBwb2x5Z29ucyBpc3N1ZVxuICAgICAgZGl2aWRlU2VnbWVudChldmVudHNbMF0ub3RoZXJFdmVudCwgZXZlbnRzWzFdLnBvaW50LCBxdWV1ZSk7XG4gICAgfVxuICAgIHJldHVybiAyO1xuICB9XG5cbiAgLy8gdGhlIGxpbmUgc2VnbWVudHMgc2hhcmUgdGhlIHJpZ2h0IGVuZHBvaW50XG4gIGlmIChyaWdodENvaW5jaWRlKSB7XG4gICAgZGl2aWRlU2VnbWVudChldmVudHNbMF0sIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICAgIHJldHVybiAzO1xuICB9XG5cbiAgLy8gbm8gbGluZSBzZWdtZW50IGluY2x1ZGVzIHRvdGFsbHkgdGhlIG90aGVyIG9uZVxuICBpZiAoZXZlbnRzWzBdICE9PSBldmVudHNbM10ub3RoZXJFdmVudCkge1xuICAgIGRpdmlkZVNlZ21lbnQoZXZlbnRzWzBdLCBldmVudHNbMV0ucG9pbnQsIHF1ZXVlKTtcbiAgICBkaXZpZGVTZWdtZW50KGV2ZW50c1sxXSwgZXZlbnRzWzJdLnBvaW50LCBxdWV1ZSk7XG4gICAgcmV0dXJuIDM7XG4gIH1cblxuICAvLyBvbmUgbGluZSBzZWdtZW50IGluY2x1ZGVzIHRoZSBvdGhlciBvbmVcbiAgZGl2aWRlU2VnbWVudChldmVudHNbMF0sIGV2ZW50c1sxXS5wb2ludCwgcXVldWUpO1xuICBkaXZpZGVTZWdtZW50KGV2ZW50c1szXS5vdGhlckV2ZW50LCBldmVudHNbMl0ucG9pbnQsIHF1ZXVlKTtcblxuICByZXR1cm4gMztcbn1cblxuXG4vKipcbiAqIEBwYXJhbSAge1N3ZWVwRXZlbnR9IHNlXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcFxuICogQHBhcmFtICB7UXVldWV9IHF1ZXVlXG4gKiBAcmV0dXJuIHtRdWV1ZX1cbiAqL1xuZnVuY3Rpb24gZGl2aWRlU2VnbWVudChzZSwgcCwgcXVldWUpICB7XG4gIHZhciByID0gbmV3IFN3ZWVwRXZlbnQocCwgZmFsc2UsIHNlLCAgICAgICAgICAgIHNlLmlzU3ViamVjdCk7XG4gIHZhciBsID0gbmV3IFN3ZWVwRXZlbnQocCwgdHJ1ZSwgIHNlLm90aGVyRXZlbnQsIHNlLmlzU3ViamVjdCk7XG5cbiAgLy8gYXZvaWQgYSByb3VuZGluZyBlcnJvci4gVGhlIGxlZnQgZXZlbnQgd291bGQgYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSByaWdodCBldmVudFxuICBpZiAoY29tcGFyZUV2ZW50cyhsLCBzZS5vdGhlckV2ZW50KSA+IDApIHtcbiAgICBzZS5vdGhlckV2ZW50LmxlZnQgPSB0cnVlO1xuICAgIGwubGVmdCA9IGZhbHNlO1xuICB9XG5cbiAgLy8gYXZvaWQgYSByb3VuZGluZyBlcnJvci4gVGhlIGxlZnQgZXZlbnQgd291bGQgYmUgcHJvY2Vzc2VkIGFmdGVyIHRoZSByaWdodCBldmVudFxuICAvLyBpZiAoY29tcGFyZUV2ZW50cyhzZSwgcikgPiAwKSB7fVxuXG4gIHNlLm90aGVyRXZlbnQub3RoZXJFdmVudCA9IGw7XG4gIHNlLm90aGVyRXZlbnQgPSByO1xuXG4gIHF1ZXVlLnB1c2gobCk7XG4gIHF1ZXVlLnB1c2gocik7XG5cbiAgcmV0dXJuIHF1ZXVlO1xufVxuXG5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzLCBuby1kZWJ1Z2dlciAqL1xuZnVuY3Rpb24gaXRlcmF0b3JFcXVhbHMoaXQxLCBpdDIpIHtcbiAgcmV0dXJuIGl0MS5fY3Vyc29yID09PSBpdDIuX2N1cnNvcjtcbn1cblxuXG5mdW5jdGlvbiBfcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgcG9zLCBldmVudCkge1xuICB2YXIgbWFwID0gd2luZG93Lm1hcDtcbiAgaWYgKCFtYXApIHJldHVybjtcbiAgaWYgKHdpbmRvdy5zd3MpIHdpbmRvdy5zd3MuZm9yRWFjaChmdW5jdGlvbihwKSB7XG4gICAgbWFwLnJlbW92ZUxheWVyKHApO1xuICB9KTtcbiAgd2luZG93LnN3cyA9IFtdO1xuICBzd2VlcExpbmUuZWFjaChmdW5jdGlvbihlKSB7XG4gICAgdmFyIHBvbHkgPSBMLnBvbHlsaW5lKFtlLnBvaW50LnNsaWNlKCkucmV2ZXJzZSgpLCBlLm90aGVyRXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCldLCB7IGNvbG9yOiAnZ3JlZW4nIH0pLmFkZFRvKG1hcCk7XG4gICAgd2luZG93LnN3cy5wdXNoKHBvbHkpO1xuICB9KTtcblxuICBpZiAod2luZG93LnZ0KSBtYXAucmVtb3ZlTGF5ZXIod2luZG93LnZ0KTtcbiAgdmFyIHYgPSBwb3Muc2xpY2UoKTtcbiAgdmFyIGIgPSBtYXAuZ2V0Qm91bmRzKCk7XG4gIHdpbmRvdy52dCA9IEwucG9seWxpbmUoW1tiLmdldE5vcnRoKCksIHZbMF1dLCBbYi5nZXRTb3V0aCgpLCB2WzBdXV0sIHtjb2xvcjogJ2dyZWVuJywgd2VpZ2h0OiAxfSkuYWRkVG8obWFwKTtcblxuICBpZiAod2luZG93LnBzKSBtYXAucmVtb3ZlTGF5ZXIod2luZG93LnBzKTtcbiAgd2luZG93LnBzID0gTC5wb2x5bGluZShbZXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCksIGV2ZW50Lm90aGVyRXZlbnQucG9pbnQuc2xpY2UoKS5yZXZlcnNlKCldLCB7Y29sb3I6ICdibGFjaycsIHdlaWdodDogOSwgb3BhY2l0eTogMC40fSkuYWRkVG8obWFwKTtcbiAgZGVidWdnZXI7XG59XG4vKiBlc2xpbnQtZW5hYmxlIG5vLXVudXNlZC12YXJzLCBuby1kZWJ1Z2dlciAqL1xuXG5cbmZ1bmN0aW9uIHN1YmRpdmlkZVNlZ21lbnRzKGV2ZW50UXVldWUsIHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbikge1xuICB2YXIgc29ydGVkRXZlbnRzID0gW107XG4gIHZhciBwcmV2LCBuZXh0O1xuXG4gIHZhciBzd2VlcExpbmUgPSBuZXcgVHJlZShjb21wYXJlU2VnbWVudHMpO1xuICB2YXIgc29ydGVkRXZlbnRzID0gW107XG5cbiAgdmFyIHJpZ2h0Ym91bmQgPSBtaW4oc2Jib3hbMl0sIGNiYm94WzJdKTtcblxuICB2YXIgcHJldiwgbmV4dDtcblxuICB3aGlsZSAoZXZlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICB2YXIgZXZlbnQgPSBldmVudFF1ZXVlLnBvcCgpO1xuICAgIHNvcnRlZEV2ZW50cy5wdXNoKGV2ZW50KTtcblxuICAgIC8vIG9wdGltaXphdGlvbiBieSBiYm94ZXMgZm9yIGludGVyc2VjdGlvbiBhbmQgZGlmZmVyZW5jZSBnb2VzIGhlcmVcbiAgICBpZiAoKG9wZXJhdGlvbiA9PT0gSU5URVJTRUNUSU9OICYmIGV2ZW50LnBvaW50WzBdID4gcmlnaHRib3VuZCkgfHxcbiAgICAgICAgKG9wZXJhdGlvbiA9PT0gRElGRkVSRU5DRSAgICYmIGV2ZW50LnBvaW50WzBdID4gc2Jib3hbMl0pKSB7XG4gICAgICBicmVhaztcbiAgICB9XG5cbiAgICBpZiAoZXZlbnQubGVmdCkge1xuICAgICAgc3dlZXBMaW5lLmluc2VydChldmVudCk7XG4gICAgICAvLyBfcmVuZGVyU3dlZXBMaW5lKHN3ZWVwTGluZSwgZXZlbnQucG9pbnQsIGV2ZW50KTtcblxuICAgICAgbmV4dCA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG4gICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcbiAgICAgIGV2ZW50Lml0ZXJhdG9yID0gc3dlZXBMaW5lLmZpbmRJdGVyKGV2ZW50KTtcblxuICAgICAgaWYgKHByZXYuZGF0YSgpICE9PSBzd2VlcExpbmUubWluKCkpIHtcbiAgICAgICAgcHJldi5wcmV2KCk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBwcmV2ID0gc3dlZXBMaW5lLmZpbmRJdGVyKHN3ZWVwTGluZS5tYXgoKSk7XG4gICAgICAgIHByZXYubmV4dCgpO1xuICAgICAgfVxuICAgICAgbmV4dC5uZXh0KCk7XG5cbiAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG5cbiAgICAgIGlmIChuZXh0LmRhdGEoKSkge1xuICAgICAgICBpZiAocG9zc2libGVJbnRlcnNlY3Rpb24oZXZlbnQsIG5leHQuZGF0YSgpLCBldmVudFF1ZXVlKSA9PT0gMikge1xuICAgICAgICAgIGNvbXB1dGVGaWVsZHMoZXZlbnQsIHByZXYuZGF0YSgpLCBzd2VlcExpbmUsIG9wZXJhdGlvbik7XG4gICAgICAgICAgY29tcHV0ZUZpZWxkcyhldmVudCwgbmV4dC5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICBpZiAocHJldi5kYXRhKCkpIHtcbiAgICAgICAgaWYgKHBvc3NpYmxlSW50ZXJzZWN0aW9uKHByZXYuZGF0YSgpLCBldmVudCwgZXZlbnRRdWV1ZSkgPT09IDIpIHtcbiAgICAgICAgICB2YXIgcHJldnByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIocHJldi5kYXRhKCkpO1xuICAgICAgICAgIGlmIChwcmV2cHJldi5kYXRhKCkgIT09IHN3ZWVwTGluZS5taW4oKSkge1xuICAgICAgICAgICAgcHJldnByZXYucHJldigpO1xuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBwcmV2cHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihzd2VlcExpbmUubWF4KCkpO1xuICAgICAgICAgICAgcHJldnByZXYubmV4dCgpO1xuICAgICAgICAgIH1cbiAgICAgICAgICBjb21wdXRlRmllbGRzKHByZXYuZGF0YSgpLCBwcmV2cHJldi5kYXRhKCksIHN3ZWVwTGluZSwgb3BlcmF0aW9uKTtcbiAgICAgICAgICBjb21wdXRlRmllbGRzKGV2ZW50LCBwcmV2LmRhdGEoKSwgc3dlZXBMaW5lLCBvcGVyYXRpb24pO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIHtcbiAgICAgIGV2ZW50ID0gZXZlbnQub3RoZXJFdmVudDtcbiAgICAgIG5leHQgPSBzd2VlcExpbmUuZmluZEl0ZXIoZXZlbnQpO1xuICAgICAgcHJldiA9IHN3ZWVwTGluZS5maW5kSXRlcihldmVudCk7XG5cbiAgICAgIC8vIF9yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBldmVudC5vdGhlckV2ZW50LnBvaW50LCBldmVudCk7XG5cbiAgICAgIGlmICghKHByZXYgJiYgbmV4dCkpIGNvbnRpbnVlO1xuXG4gICAgICBpZiAocHJldi5kYXRhKCkgIT09IHN3ZWVwTGluZS5taW4oKSkge1xuICAgICAgICBwcmV2LnByZXYoKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHByZXYgPSBzd2VlcExpbmUuZmluZEl0ZXIoc3dlZXBMaW5lLm1heCgpKTtcbiAgICAgICAgcHJldi5uZXh0KCk7XG4gICAgICB9XG4gICAgICBuZXh0Lm5leHQoKTtcbiAgICAgIHN3ZWVwTGluZS5yZW1vdmUoZXZlbnQpO1xuXG4gICAgICAvL19yZW5kZXJTd2VlcExpbmUoc3dlZXBMaW5lLCBldmVudC5vdGhlckV2ZW50LnBvaW50LCBldmVudCk7XG5cbiAgICAgIGlmIChuZXh0LmRhdGEoKSAmJiBwcmV2LmRhdGEoKSkge1xuICAgICAgICBwb3NzaWJsZUludGVyc2VjdGlvbihwcmV2LmRhdGEoKSwgbmV4dC5kYXRhKCksIGV2ZW50UXVldWUpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICByZXR1cm4gc29ydGVkRXZlbnRzO1xufVxuXG5cbmZ1bmN0aW9uIHN3YXAgKGFyciwgaSwgbikge1xuICB2YXIgdGVtcCA9IGFycltpXTtcbiAgYXJyW2ldID0gYXJyW25dO1xuICBhcnJbbl0gPSB0ZW1wO1xufVxuXG5cbmZ1bmN0aW9uIGNoYW5nZU9yaWVudGF0aW9uKGNvbnRvdXIpIHtcbiAgcmV0dXJuIGNvbnRvdXIucmV2ZXJzZSgpO1xufVxuXG5cbmZ1bmN0aW9uIGlzQXJyYXkgKGFycikge1xuICByZXR1cm4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKGFycikgPT09ICdbb2JqZWN0IEFycmF5XSc7XG59XG5cblxuZnVuY3Rpb24gYWRkSG9sZShjb250b3VyLCBpZHgpIHtcbiAgaWYgKCFpc0FycmF5KGNvbnRvdXJbMF1bMF0pKSB7XG4gICAgY29udG91ciA9IFtjb250b3VyXTtcbiAgfVxuICBjb250b3VyW2lkeF0gPSBbXTtcbiAgcmV0dXJuIGNvbnRvdXI7XG59XG5cblxuZnVuY3Rpb24gY29ubmVjdEVkZ2VzKHNvcnRlZEV2ZW50cykge1xuICAvLyBjb3B5IHRoZSBldmVudHMgaW4gdGhlIHJlc3VsdCBwb2x5Z29uIHRvIHJlc3VsdEV2ZW50cyBhcnJheVxuICB2YXIgcmVzdWx0RXZlbnRzID0gW107XG4gIHZhciBldmVudCwgaSwgbGVuO1xuXG4gIGZvciAoaSA9IDAsIGxlbiA9IHNvcnRlZEV2ZW50cy5sZW5ndGg7IGkgPCBsZW47IGkrKykge1xuICAgIGV2ZW50ID0gc29ydGVkRXZlbnRzW2ldO1xuICAgIGlmICgoZXZlbnQubGVmdCAmJiBldmVudC5pblJlc3VsdCkgfHxcbiAgICAgICghZXZlbnQubGVmdCAmJiBldmVudC5vdGhlckV2ZW50LmluUmVzdWx0KSkge1xuICAgICAgcmVzdWx0RXZlbnRzLnB1c2goZXZlbnQpO1xuICAgIH1cbiAgfVxuXG4gIC8vIER1ZSB0byBvdmVybGFwcGluZyBlZGdlcyB0aGUgcmVzdWx0RXZlbnRzIGFycmF5IGNhbiBiZSBub3Qgd2hvbGx5IHNvcnRlZFxuICB2YXIgc29ydGVkID0gZmFsc2U7XG4gIHdoaWxlICghc29ydGVkKSB7XG4gICAgc29ydGVkID0gdHJ1ZTtcbiAgICBmb3IgKGkgPSAwLCBsZW4gPSByZXN1bHRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICAgIGlmICgoaSArIDEpIDwgbGVuICYmXG4gICAgICAgIGNvbXBhcmVFdmVudHMocmVzdWx0RXZlbnRzW2ldLCByZXN1bHRFdmVudHNbaSArIDFdKSA9PT0gMSkge1xuICAgICAgICBzd2FwKHJlc3VsdEV2ZW50cywgaSwgaSArIDEpO1xuICAgICAgICBzb3J0ZWQgPSBmYWxzZTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBmb3IgKGkgPSAwLCBsZW4gPSByZXN1bHRFdmVudHMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICByZXN1bHRFdmVudHNbaV0ucG9zID0gaTtcbiAgICBpZiAoIXJlc3VsdEV2ZW50c1tpXS5sZWZ0KSB7XG4gICAgICB2YXIgdGVtcCA9IHJlc3VsdEV2ZW50c1tpXS5wb3M7XG4gICAgICByZXN1bHRFdmVudHNbaV0ucG9zID0gcmVzdWx0RXZlbnRzW2ldLm90aGVyRXZlbnQucG9zO1xuICAgICAgcmVzdWx0RXZlbnRzW2ldLm90aGVyRXZlbnQucG9zID0gdGVtcDtcbiAgICB9XG4gIH1cblxuICAvLyBcImZhbHNlXCItZmlsbGVkIGFycmF5XG4gIHZhciBwcm9jZXNzZWQgPSBBcnJheShyZXN1bHRFdmVudHMubGVuZ3RoKTtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuXG4gIHZhciBkZXB0aCAgPSBbXTtcbiAgdmFyIGhvbGVPZiA9IFtdO1xuICB2YXIgaXNIb2xlID0ge307XG5cbiAgZm9yIChpID0gMCwgbGVuID0gcmVzdWx0RXZlbnRzLmxlbmd0aDsgaSA8IGxlbjsgaSsrKSB7XG4gICAgaWYgKHByb2Nlc3NlZFtpXSkgY29udGludWU7XG5cbiAgICB2YXIgY29udG91ciA9IFtdO1xuICAgIHJlc3VsdC5wdXNoKGNvbnRvdXIpO1xuXG4gICAgdmFyIGNvbnRvdXJJZCA9IHJlc3VsdC5sZW5ndGggLSAxO1xuICAgIGRlcHRoLnB1c2goMCk7XG4gICAgaG9sZU9mLnB1c2goLTEpO1xuXG5cbiAgICBpZiAocmVzdWx0RXZlbnRzW2ldLnByZXZJblJlc3VsdCkge1xuICAgICAgdmFyIGxvd2VyQ29udG91cklkID0gcmVzdWx0RXZlbnRzW2ldLnByZXZJblJlc3VsdC5jb250b3VySWQ7XG4gICAgICBpZiAoIXJlc3VsdEV2ZW50c1tpXS5wcmV2SW5SZXN1bHQucmVzdWx0SW5PdXQpIHtcbiAgICAgICAgYWRkSG9sZShyZXN1bHRbbG93ZXJDb250b3VySWRdLCBjb250b3VySWQpO1xuICAgICAgICBob2xlT2ZbY29udG91cklkXSA9IGxvd2VyQ29udG91cklkO1xuICAgICAgICBkZXB0aFtjb250b3VySWRdICA9IGRlcHRoW2xvd2VyQ29udG91cklkXSArIDE7XG4gICAgICAgIGlzSG9sZVtjb250b3VySWRdID0gdHJ1ZTtcbiAgICAgIH0gZWxzZSBpZiAoaXNIb2xlW2xvd2VyQ29udG91cklkXSkge1xuICAgICAgICBhZGRIb2xlKHJlc3VsdFtob2xlT2ZbbG93ZXJDb250b3VySWRdXSwgY29udG91cklkKTtcbiAgICAgICAgaG9sZU9mW2NvbnRvdXJJZF0gPSBob2xlT2ZbbG93ZXJDb250b3VySWRdO1xuICAgICAgICBkZXB0aFtjb250b3VySWRdICA9IGRlcHRoW2xvd2VyQ29udG91cklkXTtcbiAgICAgICAgaXNIb2xlW2NvbnRvdXJJZF0gPSB0cnVlO1xuICAgICAgfVxuICAgIH1cblxuICAgIHZhciBwb3MgPSBpO1xuICAgIHZhciBpbml0aWFsID0gcmVzdWx0RXZlbnRzW2ldLnBvaW50O1xuICAgIGNvbnRvdXIucHVzaChpbml0aWFsKTtcblxuICAgIHdoaWxlIChwb3MgPj0gaSkge1xuICAgICAgcHJvY2Vzc2VkW3Bvc10gPSB0cnVlO1xuXG4gICAgICBpZiAocmVzdWx0RXZlbnRzW3Bvc10ubGVmdCkge1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5yZXN1bHRJbk91dCA9IGZhbHNlO1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5jb250b3VySWQgICA9IGNvbnRvdXJJZDtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHJlc3VsdEV2ZW50c1twb3NdLm90aGVyRXZlbnQucmVzdWx0SW5PdXQgPSB0cnVlO1xuICAgICAgICByZXN1bHRFdmVudHNbcG9zXS5vdGhlckV2ZW50LmNvbnRvdXJJZCAgID0gY29udG91cklkO1xuICAgICAgfVxuXG4gICAgICBwb3MgPSByZXN1bHRFdmVudHNbcG9zXS5wb3M7XG4gICAgICBwcm9jZXNzZWRbcG9zXSA9IHRydWU7XG5cbiAgICAgIGNvbnRvdXIucHVzaChyZXN1bHRFdmVudHNbcG9zXS5wb2ludCk7XG4gICAgICBwb3MgPSBuZXh0UG9zKHBvcywgcmVzdWx0RXZlbnRzLCBwcm9jZXNzZWQpO1xuICAgIH1cblxuICAgIHBvcyA9IHBvcyA9PT0gLTEgPyBpIDogcG9zO1xuXG4gICAgcHJvY2Vzc2VkW3Bvc10gPSBwcm9jZXNzZWRbcmVzdWx0RXZlbnRzW3Bvc10ucG9zXSA9IHRydWU7XG4gICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5yZXN1bHRJbk91dCA9IHRydWU7XG4gICAgcmVzdWx0RXZlbnRzW3Bvc10ub3RoZXJFdmVudC5jb250b3VySWQgICA9IGNvbnRvdXJJZDtcblxuXG5cblxuICAgIC8vIGRlcHRoIGlzIGV2ZW5cbiAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1iaXR3aXNlICovXG4gICAgaWYgKGRlcHRoW2NvbnRvdXJJZF0gJiAxKSB7XG4gICAgICBjaGFuZ2VPcmllbnRhdGlvbihjb250b3VyKTtcbiAgICB9XG4gICAgLyogZXNsaW50LWVuYWJsZSBuby1iaXR3aXNlICovXG4gIH1cblxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBwb3NcbiAqIEBwYXJhbSAge0FycmF5LjxTd2VlcEV2ZW50Pn0gcmVzdWx0RXZlbnRzXG4gKiBAcGFyYW0gIHtBcnJheS48Qm9vbGVhbj59ICAgIHByb2Nlc3NlZFxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5mdW5jdGlvbiBuZXh0UG9zKHBvcywgcmVzdWx0RXZlbnRzLCBwcm9jZXNzZWQpIHtcbiAgdmFyIG5ld1BvcyA9IHBvcyArIDE7XG4gIHZhciBsZW5ndGggPSByZXN1bHRFdmVudHMubGVuZ3RoO1xuICB3aGlsZSAobmV3UG9zIDwgbGVuZ3RoICYmXG4gICAgICAgICBlcXVhbHMocmVzdWx0RXZlbnRzW25ld1Bvc10ucG9pbnQsIHJlc3VsdEV2ZW50c1twb3NdLnBvaW50KSkge1xuICAgIGlmICghcHJvY2Vzc2VkW25ld1Bvc10pIHtcbiAgICAgIHJldHVybiBuZXdQb3M7XG4gICAgfSBlbHNlIHtcbiAgICAgIG5ld1BvcyA9IG5ld1BvcyArIDE7XG4gICAgfVxuICB9XG5cbiAgbmV3UG9zID0gcG9zIC0gMTtcblxuICB3aGlsZSAocHJvY2Vzc2VkW25ld1Bvc10pIHtcbiAgICBuZXdQb3MgPSBuZXdQb3MgLSAxO1xuICB9XG4gIHJldHVybiBuZXdQb3M7XG59XG5cblxuZnVuY3Rpb24gdHJpdmlhbE9wZXJhdGlvbihzdWJqZWN0LCBjbGlwcGluZywgb3BlcmF0aW9uKSB7XG4gIHZhciByZXN1bHQgPSBudWxsO1xuICBpZiAoc3ViamVjdC5sZW5ndGggKiBjbGlwcGluZy5sZW5ndGggPT09IDApIHtcbiAgICBpZiAob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04pIHtcbiAgICAgIHJlc3VsdCA9IEVNUFRZO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFKSB7XG4gICAgICByZXN1bHQgPSBzdWJqZWN0O1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBVTklPTiB8fCBvcGVyYXRpb24gPT09IFhPUikge1xuICAgICAgcmVzdWx0ID0gKHN1YmplY3QubGVuZ3RoID09PSAwKSA/IGNsaXBwaW5nIDogc3ViamVjdDtcbiAgICB9XG4gIH1cbiAgcmV0dXJuIHJlc3VsdDtcbn1cblxuXG5mdW5jdGlvbiBjb21wYXJlQkJveGVzKHN1YmplY3QsIGNsaXBwaW5nLCBzYmJveCwgY2Jib3gsIG9wZXJhdGlvbikge1xuICB2YXIgcmVzdWx0ID0gbnVsbDtcbiAgaWYgKHNiYm94WzBdID4gY2Jib3hbMl0gfHxcbiAgICAgIGNiYm94WzBdID4gc2Jib3hbMl0gfHxcbiAgICAgIHNiYm94WzFdID4gY2Jib3hbM10gfHxcbiAgICAgIGNiYm94WzFdID4gc2Jib3hbM10pIHtcbiAgICBpZiAob3BlcmF0aW9uID09PSBJTlRFUlNFQ1RJT04pIHtcbiAgICAgIHJlc3VsdCA9IEVNUFRZO1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBESUZGRVJFTkNFKSB7XG4gICAgICByZXN1bHQgPSBzdWJqZWN0O1xuICAgIH0gZWxzZSBpZiAob3BlcmF0aW9uID09PSBVTklPTiB8fCBvcGVyYXRpb24gPT09IFhPUikge1xuICAgICAgcmVzdWx0ID0gc3ViamVjdC5jb25jYXQoY2xpcHBpbmcpO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufVxuXG5cbmZ1bmN0aW9uIGJvb2xlYW4oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbikge1xuICB2YXIgdHJpdmlhbCA9IHRyaXZpYWxPcGVyYXRpb24oc3ViamVjdCwgY2xpcHBpbmcsIG9wZXJhdGlvbik7XG4gIGlmICh0cml2aWFsKSB7XG4gICAgcmV0dXJuIHRyaXZpYWwgPT09IEVNUFRZID8gbnVsbCA6IHRyaXZpYWw7XG4gIH1cbiAgdmFyIHNiYm94ID0gW0luZmluaXR5LCBJbmZpbml0eSwgLUluZmluaXR5LCAtSW5maW5pdHldO1xuICB2YXIgY2Jib3ggPSBbSW5maW5pdHksIEluZmluaXR5LCAtSW5maW5pdHksIC1JbmZpbml0eV07XG5cbiAgdmFyIGV2ZW50UXVldWUgPSBmaWxsUXVldWUoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCk7XG5cbiAgdHJpdmlhbCA9IGNvbXBhcmVCQm94ZXMoc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKTtcbiAgaWYgKHRyaXZpYWwpIHtcbiAgICByZXR1cm4gdHJpdmlhbCA9PT0gRU1QVFkgPyBudWxsIDogdHJpdmlhbDtcbiAgfVxuICB2YXIgc29ydGVkRXZlbnRzID0gc3ViZGl2aWRlU2VnbWVudHMoZXZlbnRRdWV1ZSwgc3ViamVjdCwgY2xpcHBpbmcsIHNiYm94LCBjYmJveCwgb3BlcmF0aW9uKTtcbiAgcmV0dXJuIGNvbm5lY3RFZGdlcyhzb3J0ZWRFdmVudHMpO1xufVxuXG5cbm1vZHVsZS5leHBvcnRzID0gYm9vbGVhbjtcblxuXG5tb2R1bGUuZXhwb3J0cy51bmlvbiA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBVTklPTik7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLmRpZmYgPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgRElGRkVSRU5DRSk7XG59O1xuXG5cbm1vZHVsZS5leHBvcnRzLnhvciA9IGZ1bmN0aW9uKHN1YmplY3QsIGNsaXBwaW5nKSB7XG4gIHJldHVybiBib29sZWFuKHN1YmplY3QsIGNsaXBwaW5nLCBYT1IpO1xufTtcblxuXG5tb2R1bGUuZXhwb3J0cy5pbnRlcnNlY3Rpb24gPSBmdW5jdGlvbihzdWJqZWN0LCBjbGlwcGluZykge1xuICByZXR1cm4gYm9vbGVhbihzdWJqZWN0LCBjbGlwcGluZywgSU5URVJTRUNUSU9OKTtcbn07XG5cblxuLyoqXG4gKiBAZW51bSB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cy5vcGVyYXRpb25zID0ge1xuICBJTlRFUlNFQ1RJT046IElOVEVSU0VDVElPTixcbiAgRElGRkVSRU5DRTogICBESUZGRVJFTkNFLFxuICBVTklPTjogICAgICAgIFVOSU9OLFxuICBYT1I6ICAgICAgICAgIFhPUlxufTtcblxuXG4vLyBmb3IgdGVzdGluZ1xubW9kdWxlLmV4cG9ydHMuZmlsbFF1ZXVlICAgICAgICAgICAgPSBmaWxsUXVldWU7XG5tb2R1bGUuZXhwb3J0cy5jb21wdXRlRmllbGRzICAgICAgICA9IGNvbXB1dGVGaWVsZHM7XG5tb2R1bGUuZXhwb3J0cy5zdWJkaXZpZGVTZWdtZW50cyAgICA9IHN1YmRpdmlkZVNlZ21lbnRzO1xubW9kdWxlLmV4cG9ydHMuZGl2aWRlU2VnbWVudCAgICAgICAgPSBkaXZpZGVTZWdtZW50O1xubW9kdWxlLmV4cG9ydHMucG9zc2libGVJbnRlcnNlY3Rpb24gPSBwb3NzaWJsZUludGVyc2VjdGlvbjtcbiIsInZhciBFUFNJTE9OID0gMWUtOTtcblxuLyoqXG4gKiBGaW5kcyB0aGUgbWFnbml0dWRlIG9mIHRoZSBjcm9zcyBwcm9kdWN0IG9mIHR3byB2ZWN0b3JzIChpZiB3ZSBwcmV0ZW5kXG4gKiB0aGV5J3JlIGluIHRocmVlIGRpbWVuc2lvbnMpXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgRmlyc3QgdmVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gYiBTZWNvbmQgdmVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge051bWJlcn0gVGhlIG1hZ25pdHVkZSBvZiB0aGUgY3Jvc3MgcHJvZHVjdFxuICovXG5mdW5jdGlvbiBrcm9zc1Byb2R1Y3QoYSwgYikge1xuICByZXR1cm4gYVswXSAqIGJbMV0gLSBhWzFdICogYlswXTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgZG90IHByb2R1Y3Qgb2YgdHdvIHZlY3RvcnMuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IGEgRmlyc3QgdmVjdG9yXG4gKiBAcGFyYW0ge09iamVjdH0gYiBTZWNvbmQgdmVjdG9yXG4gKiBAcHJpdmF0ZVxuICogQHJldHVybnMge051bWJlcn0gVGhlIGRvdCBwcm9kdWN0XG4gKi9cbmZ1bmN0aW9uIGRvdFByb2R1Y3QoYSwgYikge1xuICByZXR1cm4gYVswXSAqIGJbMF0gKyBhWzFdICogYlsxXTtcbn1cblxuLyoqXG4gKiBGaW5kcyB0aGUgaW50ZXJzZWN0aW9uIChpZiBhbnkpIGJldHdlZW4gdHdvIGxpbmUgc2VnbWVudHMgYSBhbmQgYiwgZ2l2ZW4gdGhlXG4gKiBsaW5lIHNlZ21lbnRzJyBlbmQgcG9pbnRzIGExLCBhMiBhbmQgYjEsIGIyLlxuICpcbiAqIFRoaXMgYWxnb3JpdGhtIGlzIGJhc2VkIG9uIFNjaG5laWRlciBhbmQgRWJlcmx5LlxuICogaHR0cDovL3d3dy5jaW1lYy5vcmcuYXIvfm5jYWx2by9TY2huZWlkZXJfRWJlcmx5LnBkZlxuICogUGFnZSAyNDQuXG4gKlxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYTEgcG9pbnQgb2YgZmlyc3QgbGluZVxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYTIgcG9pbnQgb2YgZmlyc3QgbGluZVxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gYjEgcG9pbnQgb2Ygc2Vjb25kIGxpbmVcbiAqIEBwYXJhbSB7QXJyYXkuPE51bWJlcj59IGIyIHBvaW50IG9mIHNlY29uZCBsaW5lXG4gKiBAcGFyYW0ge0Jvb2xlYW49fSAgICAgICBub0VuZHBvaW50VG91Y2ggd2hldGhlciB0byBza2lwIHNpbmdsZSB0b3VjaHBvaW50c1xuICogICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIChtZWFuaW5nIGNvbm5lY3RlZCBzZWdtZW50cykgYXNcbiAqICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpbnRlcnNlY3Rpb25zXG4gKiBAcmV0dXJucyB7QXJyYXkuPEFycmF5LjxOdW1iZXI+PnxOdWxsfSBJZiB0aGUgbGluZXMgaW50ZXJzZWN0LCB0aGUgcG9pbnQgb2ZcbiAqIGludGVyc2VjdGlvbi4gSWYgdGhleSBvdmVybGFwLCB0aGUgdHdvIGVuZCBwb2ludHMgb2YgdGhlIG92ZXJsYXBwaW5nIHNlZ21lbnQuXG4gKiBPdGhlcndpc2UsIG51bGwuXG4gKi9cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYTEsIGEyLCBiMSwgYjIsIG5vRW5kcG9pbnRUb3VjaCkge1xuICAvLyBUaGUgYWxnb3JpdGhtIGV4cGVjdHMgb3VyIGxpbmVzIGluIHRoZSBmb3JtIFAgKyBzZCwgd2hlcmUgUCBpcyBhIHBvaW50LFxuICAvLyBzIGlzIG9uIHRoZSBpbnRlcnZhbCBbMCwgMV0sIGFuZCBkIGlzIGEgdmVjdG9yLlxuICAvLyBXZSBhcmUgcGFzc2VkIHR3byBwb2ludHMuIFAgY2FuIGJlIHRoZSBmaXJzdCBwb2ludCBvZiBlYWNoIHBhaXIuIFRoZVxuICAvLyB2ZWN0b3IsIHRoZW4sIGNvdWxkIGJlIHRob3VnaHQgb2YgYXMgdGhlIGRpc3RhbmNlIChpbiB4IGFuZCB5IGNvbXBvbmVudHMpXG4gIC8vIGZyb20gdGhlIGZpcnN0IHBvaW50IHRvIHRoZSBzZWNvbmQgcG9pbnQuXG4gIC8vIFNvIGZpcnN0LCBsZXQncyBtYWtlIG91ciB2ZWN0b3JzOlxuICB2YXIgdmEgPSBbYTJbMF0gLSBhMVswXSwgYTJbMV0gLSBhMVsxXV07XG4gIHZhciB2YiA9IFtiMlswXSAtIGIxWzBdLCBiMlsxXSAtIGIxWzFdXTtcbiAgLy8gV2UgYWxzbyBkZWZpbmUgYSBmdW5jdGlvbiB0byBjb252ZXJ0IGJhY2sgdG8gcmVndWxhciBwb2ludCBmb3JtOlxuXG4gIC8qIGVzbGludC1kaXNhYmxlIGFycm93LWJvZHktc3R5bGUgKi9cblxuICBmdW5jdGlvbiB0b1BvaW50KHAsIHMsIGQpIHtcbiAgICByZXR1cm4gW1xuICAgICAgcFswXSArIHMgKiBkWzBdLFxuICAgICAgcFsxXSArIHMgKiBkWzFdXG4gICAgXTtcbiAgfVxuXG4gIC8qIGVzbGludC1lbmFibGUgYXJyb3ctYm9keS1zdHlsZSAqL1xuXG4gIC8vIFRoZSByZXN0IGlzIHByZXR0eSBtdWNoIGEgc3RyYWlnaHQgcG9ydCBvZiB0aGUgYWxnb3JpdGhtLlxuICB2YXIgZSA9IFtiMVswXSAtIGExWzBdLCBiMVsxXSAtIGExWzFdXTtcbiAgdmFyIGtyb3NzID0ga3Jvc3NQcm9kdWN0KHZhLCB2Yik7XG4gIHZhciBzcXJLcm9zcyA9IGtyb3NzICoga3Jvc3M7XG4gIHZhciBzcXJMZW5BID0gZG90UHJvZHVjdCh2YSwgdmEpO1xuICB2YXIgc3FyTGVuQiA9IGRvdFByb2R1Y3QodmIsIHZiKTtcblxuICAvLyBDaGVjayBmb3IgbGluZSBpbnRlcnNlY3Rpb24uIFRoaXMgd29ya3MgYmVjYXVzZSBvZiB0aGUgcHJvcGVydGllcyBvZiB0aGVcbiAgLy8gY3Jvc3MgcHJvZHVjdCAtLSBzcGVjaWZpY2FsbHksIHR3byB2ZWN0b3JzIGFyZSBwYXJhbGxlbCBpZiBhbmQgb25seSBpZiB0aGVcbiAgLy8gY3Jvc3MgcHJvZHVjdCBpcyB0aGUgMCB2ZWN0b3IuIFRoZSBmdWxsIGNhbGN1bGF0aW9uIGludm9sdmVzIHJlbGF0aXZlIGVycm9yXG4gIC8vIHRvIGFjY291bnQgZm9yIHBvc3NpYmxlIHZlcnkgc21hbGwgbGluZSBzZWdtZW50cy4gU2VlIFNjaG5laWRlciAmIEViZXJseVxuICAvLyBmb3IgZGV0YWlscy5cbiAgaWYgKHNxcktyb3NzID4gRVBTSUxPTiAqIHNxckxlbkEgKiBzcXJMZW5CKSB7XG4gICAgLy8gSWYgdGhleSdyZSBub3QgcGFyYWxsZWwsIHRoZW4gKGJlY2F1c2UgdGhlc2UgYXJlIGxpbmUgc2VnbWVudHMpIHRoZXlcbiAgICAvLyBzdGlsbCBtaWdodCBub3QgYWN0dWFsbHkgaW50ZXJzZWN0LiBUaGlzIGNvZGUgY2hlY2tzIHRoYXQgdGhlXG4gICAgLy8gaW50ZXJzZWN0aW9uIHBvaW50IG9mIHRoZSBsaW5lcyBpcyBhY3R1YWxseSBvbiBib3RoIGxpbmUgc2VnbWVudHMuXG4gICAgdmFyIHMgPSBrcm9zc1Byb2R1Y3QoZSwgdmIpIC8ga3Jvc3M7XG4gICAgaWYgKHMgPCAwIHx8IHMgPiAxKSB7XG4gICAgICAvLyBub3Qgb24gbGluZSBzZWdtZW50IGFcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICB2YXIgdCA9IGtyb3NzUHJvZHVjdChlLCB2YSkgLyBrcm9zcztcbiAgICBpZiAodCA8IDAgfHwgdCA+IDEpIHtcbiAgICAgIC8vIG5vdCBvbiBsaW5lIHNlZ21lbnQgYlxuICAgICAgcmV0dXJuIG51bGw7XG4gICAgfVxuICAgIHJldHVybiBub0VuZHBvaW50VG91Y2ggPyBudWxsIDogW3RvUG9pbnQoYTEsIHMsIHZhKV07XG4gIH1cblxuICAvLyBJZiB3ZSd2ZSByZWFjaGVkIHRoaXMgcG9pbnQsIHRoZW4gdGhlIGxpbmVzIGFyZSBlaXRoZXIgcGFyYWxsZWwgb3IgdGhlXG4gIC8vIHNhbWUsIGJ1dCB0aGUgc2VnbWVudHMgY291bGQgb3ZlcmxhcCBwYXJ0aWFsbHkgb3IgZnVsbHksIG9yIG5vdCBhdCBhbGwuXG4gIC8vIFNvIHdlIG5lZWQgdG8gZmluZCB0aGUgb3ZlcmxhcCwgaWYgYW55LiBUbyBkbyB0aGF0LCB3ZSBjYW4gdXNlIGUsIHdoaWNoIGlzXG4gIC8vIHRoZSAodmVjdG9yKSBkaWZmZXJlbmNlIGJldHdlZW4gdGhlIHR3byBpbml0aWFsIHBvaW50cy4gSWYgdGhpcyBpcyBwYXJhbGxlbFxuICAvLyB3aXRoIHRoZSBsaW5lIGl0c2VsZiwgdGhlbiB0aGUgdHdvIGxpbmVzIGFyZSB0aGUgc2FtZSBsaW5lLCBhbmQgdGhlcmUgd2lsbFxuICAvLyBiZSBvdmVybGFwLlxuICB2YXIgc3FyTGVuRSA9IGRvdFByb2R1Y3QoZSwgZSk7XG4gIGtyb3NzID0ga3Jvc3NQcm9kdWN0KGUsIHZhKTtcbiAgc3FyS3Jvc3MgPSBrcm9zcyAqIGtyb3NzO1xuXG4gIGlmIChzcXJLcm9zcyA+IEVQU0lMT04gKiBzcXJMZW5BICogc3FyTGVuRSkge1xuICAgIC8vIExpbmVzIGFyZSBqdXN0IHBhcmFsbGVsLCBub3QgdGhlIHNhbWUuIE5vIG92ZXJsYXAuXG4gICAgcmV0dXJuIG51bGw7XG4gIH1cblxuICB2YXIgc2EgPSBkb3RQcm9kdWN0KHZhLCBlKSAvIHNxckxlbkE7XG4gIHZhciBzYiA9IHNhICsgZG90UHJvZHVjdCh2YSwgdmIpIC8gc3FyTGVuQTtcbiAgdmFyIHNtaW4gPSBNYXRoLm1pbihzYSwgc2IpO1xuICB2YXIgc21heCA9IE1hdGgubWF4KHNhLCBzYik7XG5cbiAgLy8gdGhpcyBpcywgZXNzZW50aWFsbHksIHRoZSBGaW5kSW50ZXJzZWN0aW9uIGFjdGluZyBvbiBmbG9hdHMgZnJvbVxuICAvLyBTY2huZWlkZXIgJiBFYmVybHksIGp1c3QgaW5saW5lZCBpbnRvIHRoaXMgZnVuY3Rpb24uXG4gIGlmIChzbWluIDw9IDEgJiYgc21heCA+PSAwKSB7XG5cbiAgICAvLyBvdmVybGFwIG9uIGFuIGVuZCBwb2ludFxuICAgIGlmIChzbWluID09PSAxKSB7XG4gICAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzbWluID4gMCA/IHNtaW4gOiAwLCB2YSldO1xuICAgIH1cblxuICAgIGlmIChzbWF4ID09PSAwKSB7XG4gICAgICByZXR1cm4gbm9FbmRwb2ludFRvdWNoID8gbnVsbCA6IFt0b1BvaW50KGExLCBzbWF4IDwgMSA/IHNtYXggOiAxLCB2YSldO1xuICAgIH1cblxuICAgIGlmIChub0VuZHBvaW50VG91Y2ggJiYgc21pbiA9PT0gMCAmJiBzbWF4ID09PSAxKSByZXR1cm4gbnVsbDtcblxuICAgIC8vIFRoZXJlJ3Mgb3ZlcmxhcCBvbiBhIHNlZ21lbnQgLS0gdHdvIHBvaW50cyBvZiBpbnRlcnNlY3Rpb24uIFJldHVybiBib3RoLlxuICAgIHJldHVybiBbXG4gICAgICB0b1BvaW50KGExLCBzbWluID4gMCA/IHNtaW4gOiAwLCB2YSksXG4gICAgICB0b1BvaW50KGExLCBzbWF4IDwgMSA/IHNtYXggOiAxLCB2YSksXG4gICAgXTtcbiAgfVxuXG4gIHJldHVybiBudWxsO1xufTtcbiIsIi8qKlxuICogU2lnbmVkIGFyZWEgb2YgdGhlIHRyaWFuZ2xlIChwMCwgcDEsIHAyKVxuICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59IHAwXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gcDFcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSBwMlxuICogQHJldHVybiB7TnVtYmVyfVxuICovXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHNpZ25lZEFyZWEocDAsIHAxLCBwMikge1xuICByZXR1cm4gKHAwWzBdIC0gcDJbMF0pICogKHAxWzFdIC0gcDJbMV0pIC0gKHAxWzBdIC0gcDJbMF0pICogKHAwWzFdIC0gcDJbMV0pO1xufTtcbiIsInZhciBzaWduZWRBcmVhID0gcmVxdWlyZSgnLi9zaWduZWRfYXJlYScpO1xudmFyIEVkZ2VUeXBlICAgPSByZXF1aXJlKCcuL2VkZ2VfdHlwZScpO1xuXG5cbi8qKlxuICogU3dlZXBsaW5lIGV2ZW50XG4gKlxuICogQHBhcmFtIHtBcnJheS48TnVtYmVyPn0gIHBvaW50XG4gKiBAcGFyYW0ge0Jvb2xlYW59ICAgICAgICAgbGVmdFxuICogQHBhcmFtIHtTd2VlcEV2ZW50PX0gICAgIG90aGVyRXZlbnRcbiAqIEBwYXJhbSB7Qm9vbGVhbn0gICAgICAgICBpc1N1YmplY3RcbiAqIEBwYXJhbSB7TnVtYmVyfSAgICAgICAgICBlZGdlVHlwZVxuICovXG5mdW5jdGlvbiBTd2VlcEV2ZW50KHBvaW50LCBsZWZ0LCBvdGhlckV2ZW50LCBpc1N1YmplY3QsIGVkZ2VUeXBlKSB7XG5cbiAgLyoqXG4gICAqIElzIGxlZnQgZW5kcG9pbnQ/XG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5sZWZ0ID0gbGVmdDtcblxuICAvKipcbiAgICogQHR5cGUge0FycmF5LjxOdW1iZXI+fVxuICAgKi9cbiAgdGhpcy5wb2ludCA9IHBvaW50O1xuXG4gIC8qKlxuICAgKiBPdGhlciBlZGdlIHJlZmVyZW5jZVxuICAgKiBAdHlwZSB7U3dlZXBFdmVudH1cbiAgICovXG4gIHRoaXMub3RoZXJFdmVudCA9IG90aGVyRXZlbnQ7XG5cbiAgLyoqXG4gICAqIEJlbG9uZ3MgdG8gc291cmNlIG9yIGNsaXBwaW5nIHBvbHlnb25cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmlzU3ViamVjdCA9IGlzU3ViamVjdDtcblxuICAvKipcbiAgICogRWRnZSBjb250cmlidXRpb24gdHlwZVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgdGhpcy50eXBlID0gZWRnZVR5cGUgfHwgRWRnZVR5cGUuTk9STUFMO1xuXG5cbiAgLyoqXG4gICAqIEluLW91dCB0cmFuc2l0aW9uIGZvciB0aGUgc3dlZXBsaW5lIGNyb3NzaW5nIHBvbHlnb25cbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLmluT3V0ID0gZmFsc2U7XG5cblxuICAvKipcbiAgICogQHR5cGUge0Jvb2xlYW59XG4gICAqL1xuICB0aGlzLm90aGVySW5PdXQgPSBmYWxzZTtcblxuICAvKipcbiAgICogUHJldmlvdXMgZXZlbnQgaW4gcmVzdWx0P1xuICAgKiBAdHlwZSB7U3dlZXBFdmVudH1cbiAgICovXG4gIHRoaXMucHJldkluUmVzdWx0ID0gbnVsbDtcblxuICAvKipcbiAgICogRG9lcyBldmVudCBiZWxvbmcgdG8gcmVzdWx0P1xuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMuaW5SZXN1bHQgPSBmYWxzZTtcblxuXG4gIC8vIGNvbm5lY3Rpb24gc3RlcFxuXG4gIC8qKlxuICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICovXG4gIHRoaXMucmVzdWx0SW5PdXQgPSBmYWxzZTtcbn1cblxuXG5Td2VlcEV2ZW50LnByb3RvdHlwZSA9IHtcblxuICAvKipcbiAgICogQHBhcmFtICB7QXJyYXkuPE51bWJlcj59ICBwXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBpc0JlbG93OiBmdW5jdGlvbihwKSB7XG4gICAgcmV0dXJuIHRoaXMubGVmdCA/XG4gICAgICBzaWduZWRBcmVhICh0aGlzLnBvaW50LCB0aGlzLm90aGVyRXZlbnQucG9pbnQsIHApID4gMCA6XG4gICAgICBzaWduZWRBcmVhICh0aGlzLm90aGVyRXZlbnQucG9pbnQsIHRoaXMucG9pbnQsIHApID4gMDtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gIHBcbiAgICogQHJldHVybiB7Qm9vbGVhbn1cbiAgICovXG4gIGlzQWJvdmU6IGZ1bmN0aW9uKHApIHtcbiAgICByZXR1cm4gIXRoaXMuaXNCZWxvdyhwKTtcbiAgfSxcblxuXG4gIC8qKlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaXNWZXJ0aWNhbDogZnVuY3Rpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucG9pbnRbMF0gPT09IHRoaXMub3RoZXJFdmVudC5wb2ludFswXTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBTd2VlcEV2ZW50O1xuIiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFRpbnlRdWV1ZTtcblxuZnVuY3Rpb24gVGlueVF1ZXVlKGRhdGEsIGNvbXBhcmUpIHtcbiAgICBpZiAoISh0aGlzIGluc3RhbmNlb2YgVGlueVF1ZXVlKSkgcmV0dXJuIG5ldyBUaW55UXVldWUoZGF0YSwgY29tcGFyZSk7XG5cbiAgICB0aGlzLmRhdGEgPSBkYXRhIHx8IFtdO1xuICAgIHRoaXMubGVuZ3RoID0gdGhpcy5kYXRhLmxlbmd0aDtcbiAgICB0aGlzLmNvbXBhcmUgPSBjb21wYXJlIHx8IGRlZmF1bHRDb21wYXJlO1xuXG4gICAgaWYgKGRhdGEpIGZvciAodmFyIGkgPSBNYXRoLmZsb29yKHRoaXMubGVuZ3RoIC8gMik7IGkgPj0gMDsgaS0tKSB0aGlzLl9kb3duKGkpO1xufVxuXG5mdW5jdGlvbiBkZWZhdWx0Q29tcGFyZShhLCBiKSB7XG4gICAgcmV0dXJuIGEgPCBiID8gLTEgOiBhID4gYiA/IDEgOiAwO1xufVxuXG5UaW55UXVldWUucHJvdG90eXBlID0ge1xuXG4gICAgcHVzaDogZnVuY3Rpb24gKGl0ZW0pIHtcbiAgICAgICAgdGhpcy5kYXRhLnB1c2goaXRlbSk7XG4gICAgICAgIHRoaXMubGVuZ3RoKys7XG4gICAgICAgIHRoaXMuX3VwKHRoaXMubGVuZ3RoIC0gMSk7XG4gICAgfSxcblxuICAgIHBvcDogZnVuY3Rpb24gKCkge1xuICAgICAgICB2YXIgdG9wID0gdGhpcy5kYXRhWzBdO1xuICAgICAgICB0aGlzLmRhdGFbMF0gPSB0aGlzLmRhdGFbdGhpcy5sZW5ndGggLSAxXTtcbiAgICAgICAgdGhpcy5sZW5ndGgtLTtcbiAgICAgICAgdGhpcy5kYXRhLnBvcCgpO1xuICAgICAgICB0aGlzLl9kb3duKDApO1xuICAgICAgICByZXR1cm4gdG9wO1xuICAgIH0sXG5cbiAgICBwZWVrOiBmdW5jdGlvbiAoKSB7XG4gICAgICAgIHJldHVybiB0aGlzLmRhdGFbMF07XG4gICAgfSxcblxuICAgIF91cDogZnVuY3Rpb24gKHBvcykge1xuICAgICAgICB2YXIgZGF0YSA9IHRoaXMuZGF0YSxcbiAgICAgICAgICAgIGNvbXBhcmUgPSB0aGlzLmNvbXBhcmU7XG5cbiAgICAgICAgd2hpbGUgKHBvcyA+IDApIHtcbiAgICAgICAgICAgIHZhciBwYXJlbnQgPSBNYXRoLmZsb29yKChwb3MgLSAxKSAvIDIpO1xuICAgICAgICAgICAgaWYgKGNvbXBhcmUoZGF0YVtwb3NdLCBkYXRhW3BhcmVudF0pIDwgMCkge1xuICAgICAgICAgICAgICAgIHN3YXAoZGF0YSwgcGFyZW50LCBwb3MpO1xuICAgICAgICAgICAgICAgIHBvcyA9IHBhcmVudDtcblxuICAgICAgICAgICAgfSBlbHNlIGJyZWFrO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIF9kb3duOiBmdW5jdGlvbiAocG9zKSB7XG4gICAgICAgIHZhciBkYXRhID0gdGhpcy5kYXRhLFxuICAgICAgICAgICAgY29tcGFyZSA9IHRoaXMuY29tcGFyZSxcbiAgICAgICAgICAgIGxlbiA9IHRoaXMubGVuZ3RoO1xuXG4gICAgICAgIHdoaWxlICh0cnVlKSB7XG4gICAgICAgICAgICB2YXIgbGVmdCA9IDIgKiBwb3MgKyAxLFxuICAgICAgICAgICAgICAgIHJpZ2h0ID0gbGVmdCArIDEsXG4gICAgICAgICAgICAgICAgbWluID0gcG9zO1xuXG4gICAgICAgICAgICBpZiAobGVmdCA8IGxlbiAmJiBjb21wYXJlKGRhdGFbbGVmdF0sIGRhdGFbbWluXSkgPCAwKSBtaW4gPSBsZWZ0O1xuICAgICAgICAgICAgaWYgKHJpZ2h0IDwgbGVuICYmIGNvbXBhcmUoZGF0YVtyaWdodF0sIGRhdGFbbWluXSkgPCAwKSBtaW4gPSByaWdodDtcblxuICAgICAgICAgICAgaWYgKG1pbiA9PT0gcG9zKSByZXR1cm47XG5cbiAgICAgICAgICAgIHN3YXAoZGF0YSwgbWluLCBwb3MpO1xuICAgICAgICAgICAgcG9zID0gbWluO1xuICAgICAgICB9XG4gICAgfVxufTtcblxuZnVuY3Rpb24gc3dhcChkYXRhLCBpLCBqKSB7XG4gICAgdmFyIHRtcCA9IGRhdGFbaV07XG4gICAgZGF0YVtpXSA9IGRhdGFbal07XG4gICAgZGF0YVtqXSA9IHRtcDtcbn1cbiIsIi8qKlxuICogT2Zmc2V0IGVkZ2Ugb2YgdGhlIHBvbHlnb25cbiAqXG4gKiBAcGFyYW0gIHtPYmplY3R9IGN1cnJlbnRcbiAqIEBwYXJhbSAge09iamVjdH0gbmV4dFxuICogQGNvc250cnVjdG9yXG4gKi9cbmZ1bmN0aW9uIEVkZ2UoY3VycmVudCwgbmV4dCkge1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5jdXJyZW50ID0gY3VycmVudDtcblxuICAvKipcbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIHRoaXMubmV4dCA9IG5leHQ7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqL1xuICB0aGlzLl9pbk5vcm1hbCA9IHRoaXMuaW53YXJkc05vcm1hbCgpO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgdGhpcy5fb3V0Tm9ybWFsID0gdGhpcy5vdXR3YXJkc05vcm1hbCgpO1xufVxuXG4vKipcbiAqIENyZWF0ZXMgb3V0d2FyZHMgbm9ybWFsXG4gKiBAcmV0dXJuIHtPYmplY3R9XG4gKi9cbkVkZ2UucHJvdG90eXBlLm91dHdhcmRzTm9ybWFsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBpbndhcmRzID0gdGhpcy5pbndhcmRzTm9ybWFsKCk7XG4gIHJldHVybiBbXG4gICAgLWlud2FyZHNbMF0sXG4gICAgLWlud2FyZHNbMV1cbiAgXTtcbn07XG5cbi8qKlxuICogQ3JlYXRlcyBpbndhcmRzIG5vcm1hbFxuICogQHJldHVybiB7T2JqZWN0fVxuICovXG5FZGdlLnByb3RvdHlwZS5pbndhcmRzTm9ybWFsID0gZnVuY3Rpb24oKSB7XG4gIHZhciBkeCA9IHRoaXMubmV4dFswXSAtIHRoaXMuY3VycmVudFswXSxcbiAgICAgIGR5ID0gdGhpcy5uZXh0WzFdIC0gdGhpcy5jdXJyZW50WzFdLFxuICAgICAgZWRnZUxlbmd0aCA9IE1hdGguc3FydChkeCAqIGR4ICsgZHkgKiBkeSk7XG5cbiAgcmV0dXJuIFtcbiAgICAtZHkgLyBlZGdlTGVuZ3RoLFxuICAgICBkeCAvIGVkZ2VMZW5ndGhcbiAgXTtcbn07XG5cbi8qKlxuICogT2Zmc2V0cyB0aGUgZWRnZSBieSBkeCwgZHlcbiAqIEBwYXJhbSAge051bWJlcn0gZHhcbiAqIEBwYXJhbSAge051bWJlcn0gZHlcbiAqIEByZXR1cm4ge0VkZ2V9XG4gKi9cbkVkZ2UucHJvdG90eXBlLm9mZnNldCA9IGZ1bmN0aW9uKGR4LCBkeSkge1xuICB2YXIgY3VycmVudCA9IHRoaXMuY3VycmVudCxcbiAgICAgIG5leHQgPSB0aGlzLm5leHQ7XG5cbiAgcmV0dXJuIG5ldyBFZGdlKFtcbiAgICBjdXJyZW50WzBdICsgZHgsXG4gICAgY3VycmVudFsxXSArIGR5XG4gIF0sIFtcbiAgICBuZXh0WzBdICsgZHgsXG4gICAgbmV4dFsxXSArIGR5XG4gIF0pO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBFZGdlO1xuIiwiKGZ1bmN0aW9uIChnbG9iYWwpe1xudmFyIEVkZ2UgPSByZXF1aXJlKCcuL2VkZ2UnKTtcbnZhciBtYXJ0aW5leiA9IGdsb2JhbC5tYXJ0aW5leiA9IHJlcXVpcmUoJ21hcnRpbmV6LXBvbHlnb24tY2xpcHBpbmcnKTtcblxudmFyIGF0YW4yID0gTWF0aC5hdGFuMjtcblxuLyoqXG4gKiBPZmZzZXQgYnVpbGRlclxuICpcbiAqIEBwYXJhbSB7QXJyYXkuPE9iamVjdD49fSB2ZXJ0aWNlc1xuICogQHBhcmFtIHtOdW1iZXI9fSAgICAgICAgYXJjU2VnbWVudHNcbiAqIEBjb25zdHJ1Y3RvclxuICovXG5mdW5jdGlvbiBPZmZzZXQodmVydGljZXMsIGFyY1NlZ21lbnRzKSB7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtBcnJheS48T2JqZWN0Pn1cbiAgICovXG4gIHRoaXMudmVydGljZXMgPSBudWxsO1xuXG4gIC8qKlxuICAgKiBAdHlwZSB7QXJyYXkuPEVkZ2U+fVxuICAgKi9cbiAgdGhpcy5lZGdlcyA9IG51bGw7XG5cbiAgLyoqXG4gICAqIEB0eXBlIHtCb29sZWFufVxuICAgKi9cbiAgdGhpcy5fY2xvc2VkID0gZmFsc2U7XG5cbiAgaWYgKHZlcnRpY2VzKSB7XG4gICAgICB0aGlzLmRhdGEodmVydGljZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFNlZ21lbnRzIGluIGVkZ2UgYm91bmRpbmcgYXJjaGVzXG4gICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAqL1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzICE9PSB1bmRlZmluZWQgPyBhcmNTZWdtZW50cyA6IDU7XG59XG5cbi8qKlxuICogQ2hhbmdlIGRhdGEgc2V0XG4gKiBAcGFyYW0gIHtBcnJheS48QXJyYXk+fSB2ZXJ0aWNlc1xuICogQHJldHVybiB7T2Zmc2V0fVxuICovXG5PZmZzZXQucHJvdG90eXBlLmRhdGEgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICB2ZXJ0aWNlcyA9IHRoaXMudmFsaWRhdGUodmVydGljZXMpO1xuXG4gIHZhciBlZGdlcyA9IFtdO1xuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdmVydGljZXMubGVuZ3RoOyBpIDwgbGVuOyBpKyspIHtcbiAgICBlZGdlcy5wdXNoKG5ldyBFZGdlKHZlcnRpY2VzW2ldLCB2ZXJ0aWNlc1soaSArIDEpICUgbGVuXSkpO1xuICB9XG5cbiAgdGhpcy52ZXJ0aWNlcyA9IHZlcnRpY2VzO1xuICB0aGlzLmVkZ2VzID0gZWRnZXM7XG4gIHJldHVybiB0aGlzO1xufTtcblxuLyoqXG4gKiBAcGFyYW0gIHtOdW1iZXJ9IGFyY1NlZ21lbnRzXG4gKiBAcmV0dXJuIHtPZmZzZXR9XG4gKi9cbk9mZnNldC5wcm90b3R5cGUuYXJjU2VnbWVudHMgPSBmdW5jdGlvbihhcmNTZWdtZW50cykge1xuICB0aGlzLl9hcmNTZWdtZW50cyA9IGFyY1NlZ21lbnRzO1xuICByZXR1cm4gdGhpcztcbn07XG5cbi8qKlxuICogVmFsaWRhdGVzIGlmIHRoZSBmaXJzdCBhbmQgbGFzdCBwb2ludHMgcmVwZWF0XG4gKiBUT0RPOiBjaGVjayBDQ1dcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS52YWxpZGF0ZSA9IGZ1bmN0aW9uKHZlcnRpY2VzKSB7XG4gIHZhciBsZW4gPSB2ZXJ0aWNlcy5sZW5ndGg7XG4gIGlmICh2ZXJ0aWNlc1swXVswXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMF0gJiZcbiAgICB2ZXJ0aWNlc1swXVsxXSA9PT0gdmVydGljZXNbbGVuIC0gMV1bMV0pIHtcbiAgICB2ZXJ0aWNlcyA9IHZlcnRpY2VzLnNsaWNlKDAsIGxlbiAtIDEpO1xuICAgIHRoaXMuX2Nsb3NlZCA9IHRydWU7XG4gIH1cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuLyoqXG4gKiBDcmVhdGVzIGFyY2ggYmV0d2VlbiB0d28gZWRnZXNcbiAqXG4gKiBAcGFyYW0gIHtBcnJheS48T2JqZWN0Pn0gdmVydGljZXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBjZW50ZXJcbiAqIEBwYXJhbSAge051bWJlcn0gICAgICAgICByYWRpdXNcbiAqIEBwYXJhbSAge09iamVjdH0gICAgICAgICBzdGFydFZlcnRleFxuICogQHBhcmFtICB7T2JqZWN0fSAgICAgICAgIGVuZFZlcnRleFxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgIHNlZ21lbnRzXG4gKiBAcGFyYW0gIHtCb29sZWFufSAgICAgICAgb3V0d2FyZHNcbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5jcmVhdGVBcmMgPSBmdW5jdGlvbih2ZXJ0aWNlcywgY2VudGVyLCByYWRpdXMsIHN0YXJ0VmVydGV4LFxuICAgIGVuZFZlcnRleCwgc2VnbWVudHMsIG91dHdhcmRzKSB7XG5cbiAgdmFyIFBJMiA9IE1hdGguUEkgKiAyLFxuICAgICAgc3RhcnRBbmdsZSA9IGF0YW4yKHN0YXJ0VmVydGV4WzFdIC0gY2VudGVyWzFdLCBzdGFydFZlcnRleFswXSAtIGNlbnRlclswXSksXG4gICAgICBlbmRBbmdsZSA9IGF0YW4yKGVuZFZlcnRleFsxXSAtIGNlbnRlclsxXSwgZW5kVmVydGV4WzBdIC0gY2VudGVyWzBdKTtcblxuICAvLyBvZGQgbnVtYmVyIHBsZWFzZVxuICBpZiAoc2VnbWVudHMgJSAyID09PSAwKSB7XG4gICAgc2VnbWVudHMgLT0gMTtcbiAgfVxuXG4gIGlmIChzdGFydEFuZ2xlIDwgMCkge1xuICAgIHN0YXJ0QW5nbGUgKz0gUEkyO1xuICB9XG5cbiAgaWYgKGVuZEFuZ2xlIDwgMCkge1xuICAgIGVuZEFuZ2xlICs9IFBJMjtcbiAgfVxuXG4gIHZhciBhbmdsZSA9ICgoc3RhcnRBbmdsZSA+IGVuZEFuZ2xlKSA/XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSAtIGVuZEFuZ2xlKSA6XG4gICAgICAgICAgICAgICAoc3RhcnRBbmdsZSArIFBJMiAtIGVuZEFuZ2xlKSksXG4gICAgICBzZWdtZW50QW5nbGUgPSAoKG91dHdhcmRzKSA/IC1hbmdsZSA6IFBJMiAtIGFuZ2xlKSAvIHNlZ21lbnRzO1xuXG4gIHZlcnRpY2VzLnB1c2goc3RhcnRWZXJ0ZXgpO1xuICBmb3IgKHZhciBpID0gMTsgaSA8IHNlZ21lbnRzOyArK2kpIHtcbiAgICBhbmdsZSA9IHN0YXJ0QW5nbGUgKyBzZWdtZW50QW5nbGUgKiBpO1xuICAgIHZlcnRpY2VzLnB1c2goW1xuICAgICAgY2VudGVyWzBdICsgTWF0aC5jb3MoYW5nbGUpICogcmFkaXVzLFxuICAgICAgY2VudGVyWzFdICsgTWF0aC5zaW4oYW5nbGUpICogcmFkaXVzXG4gICAgXSk7XG4gIH1cbiAgdmVydGljZXMucHVzaChlbmRWZXJ0ZXgpO1xuICByZXR1cm4gdmVydGljZXM7XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7QXJyYXkuPE9iamVjdD59IHZlcnRpY2VzXG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5lbnN1cmVMYXN0UG9pbnQgPSBmdW5jdGlvbih2ZXJ0aWNlcykge1xuICBpZiAodGhpcy5fY2xvc2VkKSB7XG4gICAgdmVydGljZXMucHVzaChbXG4gICAgICB2ZXJ0aWNlc1swXVswXSxcbiAgICAgIHZlcnRpY2VzWzBdWzFdXG4gICAgXSk7XG4gIH1cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuLyoqXG4gKiBEZWNpZGVzIGJ5IHRoZSBzaWduIGlmIGl0J3MgYSBwYWRkaW5nIG9yIGEgbWFyZ2luXG4gKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48T2JqZWN0Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5vZmZzZXQgPSBmdW5jdGlvbihkaXN0KSB7XG4gIHJldHVybiBkaXN0ID09PSAwID8gdGhpcy52ZXJ0aWNlcyA6XG4gICAgICAoZGlzdCA+IDAgPyB0aGlzLm1hcmdpbihkaXN0KSA6IHRoaXMucGFkZGluZygtZGlzdCkpO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge0FycmF5LjxBcnJheS48TnVtYmVyPj59IHZlcnRpY2VzXG4gKiBAcGFyYW0gIHtBcnJheS48TnVtYmVyPn0gICAgICAgICBwdDFcbiAqIEBwYXJhbSAge0FycmF5LjxOdW1iZXI+fSAgICAgICAgIHB0MlxuICogQHBhcmFtICB7TnVtYmVyfSAgICAgICAgICAgICAgICAgZGlzdFxuICogQHJldHVybiB7QXJyYXkuPEFycmF5LjxOdW1iZXI+Pn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5fb2Zmc2V0U2VnbWVudCA9IGZ1bmN0aW9uKHZlcnRpY2VzLCBwdDEsIHB0MiwgZGlzdCkge1xuICB2YXIgZWRnZXMgPSBbbmV3IEVkZ2UocHQxLCBwdDIpLCBuZXcgRWRnZShwdDIsIHB0MSldO1xuICB2YXIgaSwgbGVuID0gMjtcblxuICB2YXIgb2Zmc2V0cyA9IFtdO1xuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciBlZGdlID0gZWRnZXNbaV07XG4gICAgdmFyIGR4ID0gZWRnZS5faW5Ob3JtYWxbMF0gKiBkaXN0O1xuICAgIHZhciBkeSA9IGVkZ2UuX2luTm9ybWFsWzFdICogZGlzdDtcblxuICAgIG9mZnNldHMucHVzaChlZGdlLm9mZnNldChkeCwgZHkpKTtcbiAgfVxuXG4gIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKykge1xuICAgIHZhciB0aGlzRWRnZSA9IG9mZnNldHNbaV0sXG4gICAgICAgIHByZXZFZGdlID0gb2Zmc2V0c1soaSArIGxlbiAtIDEpICUgbGVuXTtcbiAgICB0aGlzLmNyZWF0ZUFyYyhcbiAgICAgICAgICAgICAgICB2ZXJ0aWNlcyxcbiAgICAgICAgICAgICAgICBlZGdlc1tpXS5jdXJyZW50LCAvLyBwMSBvciBwMlxuICAgICAgICAgICAgICAgIGRpc3QsXG4gICAgICAgICAgICAgICAgcHJldkVkZ2UubmV4dCxcbiAgICAgICAgICAgICAgICB0aGlzRWRnZS5jdXJyZW50LFxuICAgICAgICAgICAgICAgIHRoaXMuX2FyY1NlZ21lbnRzLFxuICAgICAgICAgICAgICAgIHRydWVcbiAgICAgICAgICAgICk7XG4gIH1cbiAgcmV0dXJuIHZlcnRpY2VzO1xufTtcblxuXG4vKipcbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE51bWJlcj59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUubWFyZ2luID0gZnVuY3Rpb24oZGlzdCkge1xuICBpZiAoZGlzdCA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuXG4gIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmUoZGlzdCk7XG4gIHVuaW9uID0gbWFydGluZXoudW5pb24odW5pb24sIFt0aGlzLmVuc3VyZUxhc3RQb2ludCh0aGlzLnZlcnRpY2VzKV0pO1xuICByZXR1cm4gdW5pb247XG59O1xuXG5cbi8qKlxuICogQHBhcmFtICB7TnVtYmVyfSBkaXN0XG4gKiBAcmV0dXJuIHtBcnJheS48TnVtYmVyPn1cbiAqL1xuT2Zmc2V0LnByb3RvdHlwZS5wYWRkaW5nID0gZnVuY3Rpb24oZGlzdCkge1xuICBpZiAoZGlzdCA9PT0gMCkgcmV0dXJuIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuXG4gIHRoaXMuZW5zdXJlTGFzdFBvaW50KHRoaXMudmVydGljZXMpO1xuICB2YXIgdW5pb24gPSB0aGlzLm9mZnNldExpbmUoZGlzdCk7XG4gIHZhciBkaWZmID0gbWFydGluZXouZGlmZih0aGlzLnZlcnRpY2VzLCB1bmlvbik7XG4gIHJldHVybiBkaWZmO1xufTtcblxuXG4vKipcbiAqIENyZWF0ZXMgbWFyZ2luIHBvbHlnb25cbiAqIEBwYXJhbSAge051bWJlcn0gZGlzdFxuICogQHJldHVybiB7QXJyYXkuPE9iamVjdD59XG4gKi9cbk9mZnNldC5wcm90b3R5cGUub2Zmc2V0TGluZSA9IGZ1bmN0aW9uKGRpc3QpIHtcbiAgaWYgKGRpc3QgPT09IDApIHJldHVybiB0aGlzLnZlcnRpY2VzO1xuXG4gIHZhciB2ZXJ0aWNlcyA9IFtdO1xuICB2YXIgdW5pb24gICAgPSBbXTtcbiAgdGhpcy5fY2xvc2VkID0gdHJ1ZTtcblxuICBmb3IgKHZhciBpID0gMCwgbGVuID0gdGhpcy52ZXJ0aWNlcy5sZW5ndGggLSAxOyBpIDwgbGVuOyBpKyspIHtcbiAgICB2YXIgc2VnbWVudCA9IHRoaXMuZW5zdXJlTGFzdFBvaW50KFxuICAgICAgICB0aGlzLl9vZmZzZXRTZWdtZW50KFtdLCB0aGlzLnZlcnRpY2VzW2ldLCB0aGlzLnZlcnRpY2VzW2kgKyAxXSwgZGlzdClcbiAgICApO1xuICAgIHZlcnRpY2VzLnB1c2goc2VnbWVudCk7XG4gICAgdW5pb24gPSAoaSA9PT0gMCkgPyBzZWdtZW50IDogbWFydGluZXoudW5pb24odW5pb24sIHNlZ21lbnQpO1xuICB9XG5cbiAgcmV0dXJuIHRoaXMudmVydGljZXMubGVuZ3RoID4gMiA/IHVuaW9uIDogW3VuaW9uXTtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0gT2Zmc2V0O1xuXG59KS5jYWxsKHRoaXMsdHlwZW9mIGdsb2JhbCAhPT0gXCJ1bmRlZmluZWRcIiA/IGdsb2JhbCA6IHR5cGVvZiBzZWxmICE9PSBcInVuZGVmaW5lZFwiID8gc2VsZiA6IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgPyB3aW5kb3cgOiB7fSlcbi8vIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0OnV0Zi04O2Jhc2U2NCxleUoyWlhKemFXOXVJam96TENKemIzVnlZMlZ6SWpwYkluTnlZeTl2Wm1aelpYUXVhbk1pWFN3aWJtRnRaWE1pT2x0ZExDSnRZWEJ3YVc1bmN5STZJanRCUVVGQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVR0QlFVTkJPMEZCUTBFN1FVRkRRVHRCUVVOQk8wRkJRMEU3UVVGRFFUdEJRVU5CTzBGQlEwRTdRVUZEUVNJc0ltWnBiR1VpT2lKblpXNWxjbUYwWldRdWFuTWlMQ0p6YjNWeVkyVlNiMjkwSWpvaUlpd2ljMjkxY21ObGMwTnZiblJsYm5RaU9sc2lkbUZ5SUVWa1oyVWdQU0J5WlhGMWFYSmxLQ2N1TDJWa1oyVW5LVHRjYm5aaGNpQnRZWEowYVc1bGVpQTlJR2RzYjJKaGJDNXRZWEowYVc1bGVpQTlJSEpsY1hWcGNtVW9KMjFoY25ScGJtVjZMWEJ2YkhsbmIyNHRZMnhwY0hCcGJtY25LVHRjYmx4dWRtRnlJR0YwWVc0eUlEMGdUV0YwYUM1aGRHRnVNanRjYmx4dUx5b3FYRzRnS2lCUFptWnpaWFFnWW5WcGJHUmxjbHh1SUNwY2JpQXFJRUJ3WVhKaGJTQjdRWEp5WVhrdVBFOWlhbVZqZEQ0OWZTQjJaWEowYVdObGMxeHVJQ29nUUhCaGNtRnRJSHRPZFcxaVpYSTlmU0FnSUNBZ0lDQWdZWEpqVTJWbmJXVnVkSE5jYmlBcUlFQmpiMjV6ZEhKMVkzUnZjbHh1SUNvdlhHNW1kVzVqZEdsdmJpQlBabVp6WlhRb2RtVnlkR2xqWlhNc0lHRnlZMU5sWjIxbGJuUnpLU0I3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUIwZVhCbElIdEJjbkpoZVM0OFQySnFaV04wUG4xY2JpQWdJQ292WEc0Z0lIUm9hWE11ZG1WeWRHbGpaWE1nUFNCdWRXeHNPMXh1WEc0Z0lDOHFLbHh1SUNBZ0tpQkFkSGx3WlNCN1FYSnlZWGt1UEVWa1oyVStmVnh1SUNBZ0tpOWNiaUFnZEdocGN5NWxaR2RsY3lBOUlHNTFiR3c3WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRUIwZVhCbElIdENiMjlzWldGdWZWeHVJQ0FnS2k5Y2JpQWdkR2hwY3k1ZlkyeHZjMlZrSUQwZ1ptRnNjMlU3WEc1Y2JpQWdhV1lnS0habGNuUnBZMlZ6S1NCN1hHNGdJQ0FnSUNCMGFHbHpMbVJoZEdFb2RtVnlkR2xqWlhNcE8xeHVJQ0I5WEc1Y2JpQWdMeW9xWEc0Z0lDQXFJRk5sWjIxbGJuUnpJR2x1SUdWa1oyVWdZbTkxYm1ScGJtY2dZWEpqYUdWelhHNGdJQ0FxSUVCMGVYQmxJSHRPZFcxaVpYSjlYRzRnSUNBcUwxeHVJQ0IwYUdsekxsOWhjbU5UWldkdFpXNTBjeUE5SUdGeVkxTmxaMjFsYm5SeklDRTlQU0IxYm1SbFptbHVaV1FnUHlCaGNtTlRaV2R0Wlc1MGN5QTZJRFU3WEc1OVhHNWNiaThxS2x4dUlDb2dRMmhoYm1kbElHUmhkR0VnYzJWMFhHNGdLaUJBY0dGeVlXMGdJSHRCY25KaGVTNDhRWEp5WVhrK2ZTQjJaWEowYVdObGMxeHVJQ29nUUhKbGRIVnliaUI3VDJabWMyVjBmVnh1SUNvdlhHNVBabVp6WlhRdWNISnZkRzkwZVhCbExtUmhkR0VnUFNCbWRXNWpkR2x2YmloMlpYSjBhV05sY3lrZ2UxeHVJQ0IyWlhKMGFXTmxjeUE5SUhSb2FYTXVkbUZzYVdSaGRHVW9kbVZ5ZEdsalpYTXBPMXh1WEc0Z0lIWmhjaUJsWkdkbGN5QTlJRnRkTzF4dUlDQm1iM0lnS0haaGNpQnBJRDBnTUN3Z2JHVnVJRDBnZG1WeWRHbGpaWE11YkdWdVozUm9PeUJwSUR3Z2JHVnVPeUJwS3lzcElIdGNiaUFnSUNCbFpHZGxjeTV3ZFhOb0tHNWxkeUJGWkdkbEtIWmxjblJwWTJWelcybGRMQ0IyWlhKMGFXTmxjMXNvYVNBcklERXBJQ1VnYkdWdVhTa3BPMXh1SUNCOVhHNWNiaUFnZEdocGN5NTJaWEowYVdObGN5QTlJSFpsY25ScFkyVnpPMXh1SUNCMGFHbHpMbVZrWjJWeklEMGdaV1JuWlhNN1hHNGdJSEpsZEhWeWJpQjBhR2x6TzF4dWZUdGNibHh1THlvcVhHNGdLaUJBY0dGeVlXMGdJSHRPZFcxaVpYSjlJR0Z5WTFObFoyMWxiblJ6WEc0Z0tpQkFjbVYwZFhKdUlIdFBabVp6WlhSOVhHNGdLaTljYms5bVpuTmxkQzV3Y205MGIzUjVjR1V1WVhKalUyVm5iV1Z1ZEhNZ1BTQm1kVzVqZEdsdmJpaGhjbU5UWldkdFpXNTBjeWtnZTF4dUlDQjBhR2x6TGw5aGNtTlRaV2R0Wlc1MGN5QTlJR0Z5WTFObFoyMWxiblJ6TzF4dUlDQnlaWFIxY200Z2RHaHBjenRjYm4wN1hHNWNiaThxS2x4dUlDb2dWbUZzYVdSaGRHVnpJR2xtSUhSb1pTQm1hWEp6ZENCaGJtUWdiR0Z6ZENCd2IybHVkSE1nY21Wd1pXRjBYRzRnS2lCVVQwUlBPaUJqYUdWamF5QkRRMWRjYmlBcVhHNGdLaUJBY0dGeVlXMGdJSHRCY25KaGVTNDhUMkpxWldOMFBuMGdkbVZ5ZEdsalpYTmNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1MllXeHBaR0YwWlNBOUlHWjFibU4wYVc5dUtIWmxjblJwWTJWektTQjdYRzRnSUhaaGNpQnNaVzRnUFNCMlpYSjBhV05sY3k1c1pXNW5kR2c3WEc0Z0lHbG1JQ2gyWlhKMGFXTmxjMXN3WFZzd1hTQTlQVDBnZG1WeWRHbGpaWE5iYkdWdUlDMGdNVjFiTUYwZ0ppWmNiaUFnSUNCMlpYSjBhV05sYzFzd1hWc3hYU0E5UFQwZ2RtVnlkR2xqWlhOYmJHVnVJQzBnTVYxYk1WMHBJSHRjYmlBZ0lDQjJaWEowYVdObGN5QTlJSFpsY25ScFkyVnpMbk5zYVdObEtEQXNJR3hsYmlBdElERXBPMXh1SUNBZ0lIUm9hWE11WDJOc2IzTmxaQ0E5SUhSeWRXVTdYRzRnSUgxY2JpQWdjbVYwZFhKdUlIWmxjblJwWTJWek8xeHVmVHRjYmx4dUx5b3FYRzRnS2lCRGNtVmhkR1Z6SUdGeVkyZ2dZbVYwZDJWbGJpQjBkMjhnWldSblpYTmNiaUFxWEc0Z0tpQkFjR0Z5WVcwZ0lIdEJjbkpoZVM0OFQySnFaV04wUG4wZ2RtVnlkR2xqWlhOY2JpQXFJRUJ3WVhKaGJTQWdlMDlpYW1WamRIMGdJQ0FnSUNBZ0lDQmpaVzUwWlhKY2JpQXFJRUJ3WVhKaGJTQWdlMDUxYldKbGNuMGdJQ0FnSUNBZ0lDQnlZV1JwZFhOY2JpQXFJRUJ3WVhKaGJTQWdlMDlpYW1WamRIMGdJQ0FnSUNBZ0lDQnpkR0Z5ZEZabGNuUmxlRnh1SUNvZ1FIQmhjbUZ0SUNCN1QySnFaV04wZlNBZ0lDQWdJQ0FnSUdWdVpGWmxjblJsZUZ4dUlDb2dRSEJoY21GdElDQjdUblZ0WW1WeWZTQWdJQ0FnSUNBZ0lITmxaMjFsYm5SelhHNGdLaUJBY0dGeVlXMGdJSHRDYjI5c1pXRnVmU0FnSUNBZ0lDQWdiM1YwZDJGeVpITmNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1amNtVmhkR1ZCY21NZ1BTQm1kVzVqZEdsdmJpaDJaWEowYVdObGN5d2dZMlZ1ZEdWeUxDQnlZV1JwZFhNc0lITjBZWEowVm1WeWRHVjRMRnh1SUNBZ0lHVnVaRlpsY25SbGVDd2djMlZuYldWdWRITXNJRzkxZEhkaGNtUnpLU0I3WEc1Y2JpQWdkbUZ5SUZCSk1pQTlJRTFoZEdndVVFa2dLaUF5TEZ4dUlDQWdJQ0FnYzNSaGNuUkJibWRzWlNBOUlHRjBZVzR5S0hOMFlYSjBWbVZ5ZEdWNFd6RmRJQzBnWTJWdWRHVnlXekZkTENCemRHRnlkRlpsY25SbGVGc3dYU0F0SUdObGJuUmxjbHN3WFNrc1hHNGdJQ0FnSUNCbGJtUkJibWRzWlNBOUlHRjBZVzR5S0dWdVpGWmxjblJsZUZzeFhTQXRJR05sYm5SbGNsc3hYU3dnWlc1a1ZtVnlkR1Y0V3pCZElDMGdZMlZ1ZEdWeVd6QmRLVHRjYmx4dUlDQXZMeUJ2WkdRZ2JuVnRZbVZ5SUhCc1pXRnpaVnh1SUNCcFppQW9jMlZuYldWdWRITWdKU0F5SUQwOVBTQXdLU0I3WEc0Z0lDQWdjMlZuYldWdWRITWdMVDBnTVR0Y2JpQWdmVnh1WEc0Z0lHbG1JQ2h6ZEdGeWRFRnVaMnhsSUR3Z01Da2dlMXh1SUNBZ0lITjBZWEowUVc1bmJHVWdLejBnVUVreU8xeHVJQ0I5WEc1Y2JpQWdhV1lnS0dWdVpFRnVaMnhsSUR3Z01Da2dlMXh1SUNBZ0lHVnVaRUZ1WjJ4bElDczlJRkJKTWp0Y2JpQWdmVnh1WEc0Z0lIWmhjaUJoYm1kc1pTQTlJQ2dvYzNSaGNuUkJibWRzWlNBK0lHVnVaRUZ1WjJ4bEtTQS9YRzRnSUNBZ0lDQWdJQ0FnSUNBZ0lDQW9jM1JoY25SQmJtZHNaU0F0SUdWdVpFRnVaMnhsS1NBNlhHNGdJQ0FnSUNBZ0lDQWdJQ0FnSUNBb2MzUmhjblJCYm1kc1pTQXJJRkJKTWlBdElHVnVaRUZ1WjJ4bEtTa3NYRzRnSUNBZ0lDQnpaV2R0Wlc1MFFXNW5iR1VnUFNBb0tHOTFkSGRoY21SektTQS9JQzFoYm1kc1pTQTZJRkJKTWlBdElHRnVaMnhsS1NBdklITmxaMjFsYm5Sek8xeHVYRzRnSUhabGNuUnBZMlZ6TG5CMWMyZ29jM1JoY25SV1pYSjBaWGdwTzF4dUlDQm1iM0lnS0haaGNpQnBJRDBnTVRzZ2FTQThJSE5sWjIxbGJuUnpPeUFySzJrcElIdGNiaUFnSUNCaGJtZHNaU0E5SUhOMFlYSjBRVzVuYkdVZ0t5QnpaV2R0Wlc1MFFXNW5iR1VnS2lCcE8xeHVJQ0FnSUhabGNuUnBZMlZ6TG5CMWMyZ29XMXh1SUNBZ0lDQWdZMlZ1ZEdWeVd6QmRJQ3NnVFdGMGFDNWpiM01vWVc1bmJHVXBJQ29nY21Ga2FYVnpMRnh1SUNBZ0lDQWdZMlZ1ZEdWeVd6RmRJQ3NnVFdGMGFDNXphVzRvWVc1bmJHVXBJQ29nY21Ga2FYVnpYRzRnSUNBZ1hTazdYRzRnSUgxY2JpQWdkbVZ5ZEdsalpYTXVjSFZ6YUNobGJtUldaWEowWlhncE8xeHVJQ0J5WlhSMWNtNGdkbVZ5ZEdsalpYTTdYRzU5TzF4dVhHNWNiaThxS2x4dUlDb2dRSEJoY21GdElDQjdRWEp5WVhrdVBFOWlhbVZqZEQ1OUlIWmxjblJwWTJWelhHNGdLaUJBY21WMGRYSnVJSHRCY25KaGVTNDhUMkpxWldOMFBuMWNiaUFxTDF4dVQyWm1jMlYwTG5CeWIzUnZkSGx3WlM1bGJuTjFjbVZNWVhOMFVHOXBiblFnUFNCbWRXNWpkR2x2YmloMlpYSjBhV05sY3lrZ2UxeHVJQ0JwWmlBb2RHaHBjeTVmWTJ4dmMyVmtLU0I3WEc0Z0lDQWdkbVZ5ZEdsalpYTXVjSFZ6YUNoYlhHNGdJQ0FnSUNCMlpYSjBhV05sYzFzd1hWc3dYU3hjYmlBZ0lDQWdJSFpsY25ScFkyVnpXekJkV3pGZFhHNGdJQ0FnWFNrN1hHNGdJSDFjYmlBZ2NtVjBkWEp1SUhabGNuUnBZMlZ6TzF4dWZUdGNibHh1THlvcVhHNGdLaUJFWldOcFpHVnpJR0o1SUhSb1pTQnphV2R1SUdsbUlHbDBKM01nWVNCd1lXUmthVzVuSUc5eUlHRWdiV0Z5WjJsdVhHNGdLbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCa2FYTjBYRzRnS2lCQWNtVjBkWEp1SUh0QmNuSmhlUzQ4VDJKcVpXTjBQbjFjYmlBcUwxeHVUMlptYzJWMExuQnliM1J2ZEhsd1pTNXZabVp6WlhRZ1BTQm1kVzVqZEdsdmJpaGthWE4wS1NCN1hHNGdJSEpsZEhWeWJpQmthWE4wSUQwOVBTQXdJRDhnZEdocGN5NTJaWEowYVdObGN5QTZYRzRnSUNBZ0lDQW9aR2x6ZENBK0lEQWdQeUIwYUdsekxtMWhjbWRwYmloa2FYTjBLU0E2SUhSb2FYTXVjR0ZrWkdsdVp5Z3RaR2x6ZENrcE8xeHVmVHRjYmx4dVhHNHZLaXBjYmlBcUlFQndZWEpoYlNBZ2UwRnljbUY1TGp4QmNuSmhlUzQ4VG5WdFltVnlQajU5SUhabGNuUnBZMlZ6WEc0Z0tpQkFjR0Z5WVcwZ0lIdEJjbkpoZVM0OFRuVnRZbVZ5UG4wZ0lDQWdJQ0FnSUNCd2RERmNiaUFxSUVCd1lYSmhiU0FnZTBGeWNtRjVManhPZFcxaVpYSStmU0FnSUNBZ0lDQWdJSEIwTWx4dUlDb2dRSEJoY21GdElDQjdUblZ0WW1WeWZTQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ1pHbHpkRnh1SUNvZ1FISmxkSFZ5YmlCN1FYSnlZWGt1UEVGeWNtRjVManhPZFcxaVpYSStQbjFjYmlBcUwxeHVUMlptYzJWMExuQnliM1J2ZEhsd1pTNWZiMlptYzJWMFUyVm5iV1Z1ZENBOUlHWjFibU4wYVc5dUtIWmxjblJwWTJWekxDQndkREVzSUhCME1pd2daR2x6ZENrZ2UxeHVJQ0IyWVhJZ1pXUm5aWE1nUFNCYmJtVjNJRVZrWjJVb2NIUXhMQ0J3ZERJcExDQnVaWGNnUldSblpTaHdkRElzSUhCME1TbGRPMXh1SUNCMllYSWdhU3dnYkdWdUlEMGdNanRjYmx4dUlDQjJZWElnYjJabWMyVjBjeUE5SUZ0ZE8xeHVYRzRnSUdadmNpQW9hU0E5SURBN0lHa2dQQ0JzWlc0N0lHa3JLeWtnZTF4dUlDQWdJSFpoY2lCbFpHZGxJRDBnWldSblpYTmJhVjA3WEc0Z0lDQWdkbUZ5SUdSNElEMGdaV1JuWlM1ZmFXNU9iM0p0WVd4Yk1GMGdLaUJrYVhOME8xeHVJQ0FnSUhaaGNpQmtlU0E5SUdWa1oyVXVYMmx1VG05eWJXRnNXekZkSUNvZ1pHbHpkRHRjYmx4dUlDQWdJRzltWm5ObGRITXVjSFZ6YUNobFpHZGxMbTltWm5ObGRDaGtlQ3dnWkhrcEtUdGNiaUFnZlZ4dVhHNGdJR1p2Y2lBb2FTQTlJREE3SUdrZ1BDQnNaVzQ3SUdrckt5a2dlMXh1SUNBZ0lIWmhjaUIwYUdselJXUm5aU0E5SUc5bVpuTmxkSE5iYVYwc1hHNGdJQ0FnSUNBZ0lIQnlaWFpGWkdkbElEMGdiMlptYzJWMGMxc29hU0FySUd4bGJpQXRJREVwSUNVZ2JHVnVYVHRjYmlBZ0lDQjBhR2x6TG1OeVpXRjBaVUZ5WXloY2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCMlpYSjBhV05sY3l4Y2JpQWdJQ0FnSUNBZ0lDQWdJQ0FnSUNCbFpHZGxjMXRwWFM1amRYSnlaVzUwTENBdkx5QndNU0J2Y2lCd01seHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lHUnBjM1FzWEc0Z0lDQWdJQ0FnSUNBZ0lDQWdJQ0FnY0hKbGRrVmtaMlV1Ym1WNGRDeGNiaUFnSUNBZ0lDQWdJQ0FnSUNBZ0lDQjBhR2x6UldSblpTNWpkWEp5Wlc1MExGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUm9hWE11WDJGeVkxTmxaMjFsYm5SekxGeHVJQ0FnSUNBZ0lDQWdJQ0FnSUNBZ0lIUnlkV1ZjYmlBZ0lDQWdJQ0FnSUNBZ0lDazdYRzRnSUgxY2JpQWdjbVYwZFhKdUlIWmxjblJwWTJWek8xeHVmVHRjYmx4dVhHNHZLaXBjYmlBcUlFQndZWEpoYlNBZ2UwNTFiV0psY24wZ1pHbHpkRnh1SUNvZ1FISmxkSFZ5YmlCN1FYSnlZWGt1UEU1MWJXSmxjajU5WEc0Z0tpOWNiazltWm5ObGRDNXdjbTkwYjNSNWNHVXViV0Z5WjJsdUlEMGdablZ1WTNScGIyNG9aR2x6ZENrZ2UxeHVJQ0JwWmlBb1pHbHpkQ0E5UFQwZ01Da2djbVYwZFhKdUlIUm9hWE11Wlc1emRYSmxUR0Z6ZEZCdmFXNTBLSFJvYVhNdWRtVnlkR2xqWlhNcE8xeHVYRzRnSUhSb2FYTXVaVzV6ZFhKbFRHRnpkRkJ2YVc1MEtIUm9hWE11ZG1WeWRHbGpaWE1wTzF4dUlDQjJZWElnZFc1cGIyNGdQU0IwYUdsekxtOW1abk5sZEV4cGJtVW9aR2x6ZENrN1hHNGdJSFZ1YVc5dUlEMGdiV0Z5ZEdsdVpYb3VkVzVwYjI0b2RXNXBiMjRzSUZ0MGFHbHpMbVZ1YzNWeVpVeGhjM1JRYjJsdWRDaDBhR2x6TG5abGNuUnBZMlZ6S1YwcE8xeHVJQ0J5WlhSMWNtNGdkVzVwYjI0N1hHNTlPMXh1WEc1Y2JpOHFLbHh1SUNvZ1FIQmhjbUZ0SUNCN1RuVnRZbVZ5ZlNCa2FYTjBYRzRnS2lCQWNtVjBkWEp1SUh0QmNuSmhlUzQ4VG5WdFltVnlQbjFjYmlBcUwxeHVUMlptYzJWMExuQnliM1J2ZEhsd1pTNXdZV1JrYVc1bklEMGdablZ1WTNScGIyNG9aR2x6ZENrZ2UxeHVJQ0JwWmlBb1pHbHpkQ0E5UFQwZ01Da2djbVYwZFhKdUlIUm9hWE11Wlc1emRYSmxUR0Z6ZEZCdmFXNTBLSFJvYVhNdWRtVnlkR2xqWlhNcE8xeHVYRzRnSUhSb2FYTXVaVzV6ZFhKbFRHRnpkRkJ2YVc1MEtIUm9hWE11ZG1WeWRHbGpaWE1wTzF4dUlDQjJZWElnZFc1cGIyNGdQU0IwYUdsekxtOW1abk5sZEV4cGJtVW9aR2x6ZENrN1hHNGdJSFpoY2lCa2FXWm1JRDBnYldGeWRHbHVaWG91WkdsbVppaDBhR2x6TG5abGNuUnBZMlZ6TENCMWJtbHZiaWs3WEc0Z0lISmxkSFZ5YmlCa2FXWm1PMXh1ZlR0Y2JseHVYRzR2S2lwY2JpQXFJRU55WldGMFpYTWdiV0Z5WjJsdUlIQnZiSGxuYjI1Y2JpQXFJRUJ3WVhKaGJTQWdlMDUxYldKbGNuMGdaR2x6ZEZ4dUlDb2dRSEpsZEhWeWJpQjdRWEp5WVhrdVBFOWlhbVZqZEQ1OVhHNGdLaTljYms5bVpuTmxkQzV3Y205MGIzUjVjR1V1YjJabWMyVjBUR2x1WlNBOUlHWjFibU4wYVc5dUtHUnBjM1FwSUh0Y2JpQWdhV1lnS0dScGMzUWdQVDA5SURBcElISmxkSFZ5YmlCMGFHbHpMblpsY25ScFkyVnpPMXh1WEc0Z0lIWmhjaUIyWlhKMGFXTmxjeUE5SUZ0ZE8xeHVJQ0IyWVhJZ2RXNXBiMjRnSUNBZ1BTQmJYVHRjYmlBZ2RHaHBjeTVmWTJ4dmMyVmtJRDBnZEhKMVpUdGNibHh1SUNCbWIzSWdLSFpoY2lCcElEMGdNQ3dnYkdWdUlEMGdkR2hwY3k1MlpYSjBhV05sY3k1c1pXNW5kR2dnTFNBeE95QnBJRHdnYkdWdU95QnBLeXNwSUh0Y2JpQWdJQ0IyWVhJZ2MyVm5iV1Z1ZENBOUlIUm9hWE11Wlc1emRYSmxUR0Z6ZEZCdmFXNTBLRnh1SUNBZ0lDQWdJQ0IwYUdsekxsOXZabVp6WlhSVFpXZHRaVzUwS0Z0ZExDQjBhR2x6TG5abGNuUnBZMlZ6VzJsZExDQjBhR2x6TG5abGNuUnBZMlZ6VzJrZ0t5QXhYU3dnWkdsemRDbGNiaUFnSUNBcE8xeHVJQ0FnSUhabGNuUnBZMlZ6TG5CMWMyZ29jMlZuYldWdWRDazdYRzRnSUNBZ2RXNXBiMjRnUFNBb2FTQTlQVDBnTUNrZ1B5QnpaV2R0Wlc1MElEb2diV0Z5ZEdsdVpYb3VkVzVwYjI0b2RXNXBiMjRzSUhObFoyMWxiblFwTzF4dUlDQjlYRzVjYmlBZ2NtVjBkWEp1SUhSb2FYTXVkbVZ5ZEdsalpYTXViR1Z1WjNSb0lENGdNaUEvSUhWdWFXOXVJRG9nVzNWdWFXOXVYVHRjYm4wN1hHNWNibTF2WkhWc1pTNWxlSEJ2Y25SeklEMGdUMlptYzJWME8xeHVJbDE5IiwibW9kdWxlLmV4cG9ydHM9e1xuICBcInR5cGVcIjogXCJGZWF0dXJlQ29sbGVjdGlvblwiLFxuICBcImZlYXR1cmVzXCI6IFtcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcInByb3BlcnRpZXNcIjoge30sXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiUG9seWdvblwiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6XG4gICAgICAgICAgW1tcbiAgW1xuICAgIDExNC4xODcwNzcyODM4NTkyNSxcbiAgICAyMi4yNjY1NzQ3NTY1MjUwMzVcbiAgXSxcbiAgW1xuICAgIDExNC4xODcyNzU3NjczMjYzNSxcbiAgICAyMi4yNjYzNzYxODA0NDk4NlxuICBdLFxuICBbXG4gICAgMTE0LjE4NzU3MDgxMDMxOCxcbiAgICAyMi4yNjY2OTM5MDIwMzQ4NzdcbiAgXSxcbiAgW1xuICAgIDExNC4xODc2Mjk4MTg5MTYzMixcbiAgICAyMi4yNjY3MTg3MjQwMDMzMjZcbiAgXSxcbiAgW1xuICAgIDExNC4xODc4MTIyMDkxMjkzMyxcbiAgICAyMi4yNjY1ODQ2ODUzMjE0XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MTcxNjI1MTM3MzMsXG4gICAgMjIuMjY2NDM1NzUzMzAxOTk4XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MzM3OTIyMDk2MjUsXG4gICAgMjIuMjY2ODc3NTg0NDk3MTRcbiAgXSxcbiAgW1xuICAgIDExNC4xODgyNDY3MjY5ODk3NSxcbiAgICAyMi4yNjY5MDczNzA4MTk2NlxuICBdLFxuICBbXG4gICAgMTE0LjE4ODE4NzcxODM5MTQyLFxuICAgIDIyLjI2Njc4ODIyNTQ5MTU2N1xuICBdLFxuICBbXG4gICAgMTE0LjE4ODE0NDgwMzA0NzE4LFxuICAgIDIyLjI2NjgwODA4MzA1MzI5XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MTc2OTg5NTU1MzYsXG4gICAgMjIuMjY2ODc3NTg0NDk3MTRcbiAgXSxcbiAgW1xuICAgIDExNC4xODgxMzQwNzQyMTExMixcbiAgICAyMi4yNjY4OTI0Nzc2NTkxOVxuICBdLFxuICBbXG4gICAgMTE0LjE4ODE4MjM1Mzk3MzM5LFxuICAgIDIyLjI2Njk1MjA1MDI5MTUyNVxuICBdLFxuICBbXG4gICAgMTE0LjE4ODEyMzM0NTM3NTA2LFxuICAgIDIyLjI2Njk5MTc2NTM2NTY2M1xuICBdLFxuICBbXG4gICAgMTE0LjE4ODA0ODI0MzUyMjY0LFxuICAgIDIyLjI2Njg2MjY5MTMzMzUwN1xuICBdLFxuICBbXG4gICAgMTE0LjE4Nzk1MTY4Mzk5ODExLFxuICAgIDIyLjI2NzAxMTYyMjg5ODUyXG4gIF0sXG4gIFtcbiAgICAxMTQuMTg4MTM0MDc0MjExMTIsXG4gICAgMjIuMjY3MTgwNDExODEzODlcbiAgXSxcbiAgW1xuICAgIDExNC4xODgzNTkzNzk3NjgzNyxcbiAgICAyMi4yNjY5NjY5NDM0NDU2NVxuICBdLFxuICBbXG4gICAgMTE0LjE4ODQyMzc1Mjc4NDczLFxuICAgIDIyLjI2NzAxNjU4NzI4MTI3NlxuICBdLFxuICBbXG4gICAgMTE0LjE4ODA1ODk3MjM1ODY5LFxuICAgIDIyLjI2NzM5Mzg3OTg1NjQ3XG4gIF0sXG4gIFtcbiAgICAxMTQuMTg3NjI0NDU0NDk4MjksXG4gICAgMjIuMjY3MDYxMjY2NzE4MjgzXG4gIF0sXG4gIFtcbiAgICAxMTQuMTg3NDA0NTEzMzU5MDcsXG4gICAgMjIuMjY2OTU3MDE0Njc2NDJcbiAgXSxcbiAgW1xuICAgIDExNC4xODc0NTgxNTc1MzkzNyxcbiAgICAyMi4yNjY5MDI0MDY0MzMwMVxuICBdXG5dXVxuXG4gICAgICB9XG4gICAgfSxcbiAgICB7XG4gICAgICBcInR5cGVcIjogXCJGZWF0dXJlXCIsXG4gICAgICBcImdlb21ldHJ5XCI6IHtcbiAgICAgICAgXCJ0eXBlXCI6IFwiTGluZVN0cmluZ1wiLFxuICAgICAgICBcImNvb3JkaW5hdGVzXCI6IFtcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg2MTcwNjk3MjEyMjIsXG4gICAgICAgICAgICAyMi4yNjg3ODg4NjA2NzUyXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg2MjgzMzQ5OTkwODQsXG4gICAgICAgICAgICAyMi4yNjg2Nzk2NDU1OTY4ODNcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODY1MTQwMTk5NjYxMyxcbiAgICAgICAgICAgIDIyLjI2ODMxNzI0OTQ5ODk5NVxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NjczMzk2MTEwNTM1LFxuICAgICAgICAgICAgMjIuMjY3OTQ0OTIzNzYzMzhcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODY5MzI0NDQ1NzI0MyxcbiAgICAgICAgICAgIDIyLjI2NzYwMjM4MzIxMTU5NlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4Njc0NDY4OTk0MTQsXG4gICAgICAgICAgICAyMi4yNjc0ODgyMDI4NDEzMTdcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODY3NDQ2ODk5NDE0LFxuICAgICAgICAgICAgMjIuMjY3Mzg4OTE1NDg3MDg2XG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg2ODU3MzQyNzIwMDMsXG4gICAgICAgICAgICAyMi4yNjcyMjAxMjY4MjMyMlxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NzEyMDE5OTIwMzQ5LFxuICAgICAgICAgICAgMjIuMjY3MjQ5OTEzMDcyODEzXG4gICAgICAgICAgXSxcbiAgICAgICAgICBbXG4gICAgICAgICAgICAxMTQuMTg3MjE2NzU4NzI4MDMsXG4gICAgICAgICAgICAyMi4yNjcyNTQ4Nzc0NDcxMzNcbiAgICAgICAgICBdLFxuICAgICAgICAgIFtcbiAgICAgICAgICAgIDExNC4xODc1OTIyNjc5OTAxMSxcbiAgICAgICAgICAgIDIyLjI2NzQ1ODQxNjY0MjQ0OFxuICAgICAgICAgIF0sXG4gICAgICAgICAgW1xuICAgICAgICAgICAgMTE0LjE4NzE2MzExNDU0NzczLFxuICAgICAgICAgICAgMjIuMjY4MTgzMjEyMzQ4MzEyXG4gICAgICAgICAgXVxuICAgICAgICBdXG4gICAgICB9XG4gICAgfVxuICBdXG59Il19
