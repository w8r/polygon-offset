var Offset = require('../src/offset');
require('./leaflet_multipolygon');
require('./polygon_control');
var OffsetControl = require('./offset_control');
var data = require('../test/fixtures/demo.json');
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

run (20);
