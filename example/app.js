import Offset from '../src/index';

import './leaflet_multipolygon';
import './polygon_control';
import L from 'leaflet';
import OffsetControl from './offset_control';
import data from '../test/fixtures/demo.json';
import project from 'geojson-project';

const arcSegments = 15;

const style = {
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
    zoom = 17;
let vertices, result;

const map = window.map = L.map('map', {
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

var layers = window.layers = L.geoJson(data).addTo(map);
var results = window.results = L.geoJson(null, {
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
