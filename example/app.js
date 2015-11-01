var L = require('leaflet');
var Offset = require('../src/offset');

var points = [
        [22.266574756525035, 114.18707728385925],
        [22.26637618044986, 114.18727576732635],
        [22.266693902034877, 114.187570810318],
        [22.266718724003326, 114.18762981891632],
        [22.2665846853214, 114.18781220912933],
        [22.266435753301998, 114.18817162513733],
        [22.26687758449714, 114.18833792209625],
        [22.26690737081966, 114.18824672698975],
        [22.266788225491567, 114.18818771839142],
        [22.26680808305329, 114.18814480304718],
        [22.26687758449714, 114.18817698955536],
        [22.26689247765919, 114.18813407421112],
        [22.266952050291525, 114.18818235397339],
        [22.266991765365663, 114.18812334537506],
        [22.266862691333507, 114.18804824352264],
        [22.26701162289852, 114.18795168399811],
        [22.26718041181389, 114.18813407421112],
        [22.26696694344565, 114.18835937976837],
        [22.267016587281276, 114.18842375278473],
        [22.26739387985647, 114.18805897235869],
        [22.267061266718283, 114.18762445449829],
        [22.26695701467642, 114.18740451335907],
        [22.26690240643301, 114.18745815753937]
    ],
    style = {
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
    zoom = 18,
    map, vertices, result;

map = global.map = L.map('map').setView(center, zoom);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; ' +
        '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

L.polygon(points, style).addTo(map);


vertices = points.map(function(p) {
  var pt = map.options.crs.latLngToPoint(L.latLng(p), map.getZoom());
  return [pt.x, pt.y];
});

console.time('margin');
result = new Offset(vertices).margin(40);
console.timeEnd('margin');
result = result.map(function(p) {
    return map.options.crs.pointToLatLng(L.point(p), map.getZoom());
});

L.polygon(result, marginStyle).addTo(map);
console.time('padding');
result = new Offset(vertices).padding(10);
console.timeEnd('padding');
result = result.map(function(p) {
    return map.options.crs.pointToLatLng(L.point(p), map.getZoom());
});

L.polygon(result, paddingStyle).addTo(map);
