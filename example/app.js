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