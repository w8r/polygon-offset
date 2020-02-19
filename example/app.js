import Offset from '../src/index';

import './leaflet_multipolygon';
import './polygon_control';
import L from 'leaflet';
import OffsetControl from './offset_control';
import data from '../test/fixtures/demo.json';
import project from 'geojson-project';


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
  center = [22.267, 114.188],
  zoom = 17;
let vertices, result;

const map = (window.map = L.map('map', {
  editable: true,
  maxZoom: 22
}).setView(center, zoom));

map.addControl(
  new L.NewPolygonControl({
    callback: map.editTools.startPolygon
  })
);

map.addControl(
  new L.NewLineControl({
    callback: map.editTools.startPolyline
  })
);

map.addControl(
  new L.NewPointControl({
    callback: map.editTools.startMarker
  })
);

const layers = (window.layers = L.geoJson(data).addTo(map));
const results = (window.results = L.geoJson(null, {
  style: function (feature) {
    return marginStyle;
  }
}).addTo(map));
map.fitBounds(layers.getBounds(), { animate: false });

map.addControl(
  new OffsetControl({
    clear: function () {
      layers.clearLayers();
    },
    callback: run
  })
);

map.on('editable:created', function (evt) {
  layers.addLayer(evt.layer);
  evt.layer.on('click', function (e) {
    if (
      (e.originalEvent.ctrlKey || e.originalEvent.metaKey) &&
      this.editEnabled()
    ) {
      this.editor.newHole(e.latlng);
    }
  });
});

function run(margin, arcSegments) {
  results.clearLayers();
  layers.eachLayer(function (layer) {
    const gj = layer.toGeoJSON();
    const shape = project(gj, (coord) => {
      const pt = map.options.crs.latLngToPoint(
        L.latLng(coord.slice().reverse()),
        map.getZoom()
      );
      return [pt.x, pt.y];
    });

    let result;
    console.log(gj.geometry.type, margin, arcSegments);
    if (gj.geometry.type === 'LineString') {
      if (margin < 0) return;
      const coordinates = new Offset(shape.geometry.coordinates)
        .arcSegments(arcSegments)
        .offsetLine(margin);

      result = {
        type: 'Feature',
        geometry: {
          type: margin === 0 ? 'LineString' : 'Polygon',
          coordinates
        }
      };
    } else {
      const coordinates = new Offset(shape.geometry.coordinates)
        .arcSegments(arcSegments)
        .offset(margin);
      if (gj.geometry.type === 'Point') {
        result = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates
          }
        };
      } else {
        result = {
          type: 'Feature',
          geometry: {
            type: 'Polygon',
            coordinates
          }
        };
      }
    }

    console.log('done', result);
    results.addData(
      project(result, pt => {
        const ll = map.options.crs.pointToLatLng(
          L.point(pt.slice()),
          map.getZoom()
        );
        return [ll.lng, ll.lat];
      })
    );
  });
}

run(20, 15);
