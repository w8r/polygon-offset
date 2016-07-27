var tap = require('tap');
var Offset = require('../src/offset');

// CCW
var points = [
  [0,0], [0,100],
  [100,100], [100,0], [0,0]
];
var x = -10;


tap.test('polygon.offset', function(t) {

  t.test('data', function(t) {
    t.strictSame(new Offset(points).vertices, points.slice(0, points.length - 1), 'read');
    //t.strictSame(new Offset(points).vertices, points, 'stored');
    t.end();
  });

  t.test('margin', function(t) {
    t.strictSame(new Offset(points).arcSegments(1).margin(5), [[[-5,0],[0,0],[0,-5],[100,-5],[100,0],[105,0],[105,100],[100,100],[100,105],[0,105],[0,100],[-5,100],[-5,0]]], 'normal');
    t.strictSame(new Offset(points).arcSegments(0).margin(5), [ [ [ -5, 0 ],[ 0, 0 ],[ 0, -5 ],[ 100, -5 ],[ 100, 0 ],[ 105, 0 ],[ 105, 100 ],[ 100, 100 ],[ 100, 105 ],[ 0, 105 ],[ 0, 100 ],[ -5, 100 ],[ -5, 0 ] ] ], '0 additional segs');
    t.strictSame(new Offset(points).margin(0), points, 'zero');
    t.end();
  });


  t.test('padding', function(t) {
    t.strictSame(new Offset(points).padding(5), [[[5,5],[95,5],[95,95],[5,95],[5,5]]], 'padding');
    t.strictSame(new Offset(points).padding(0), points, 'zero');
    t.end();
  });


  t.test('adaptive', function(t) {
    t.strictSame(new Offset(points).arcSegments(1).offset(5), [[[-5,0],[0,0],[0,-5],[100,-5],[100,0],[105,0],[105,100],[100,100],[100,105],[0,105],[0,100],[-5,100],[-5,0]]], 'normal');
    t.strictSame(new Offset(points).offset(-5), [[[5,5],[95,5],[95,95],[5,95],[5,5]]], 'padding');
    t.end();
  });

  t.test('line', function(t) {
    t.strictSame(new Offset(points.slice(1,3)).arcSegments(2).offsetLine(5), [ [ [ 0, 95 ], [ 0, 105 ], [ 100, 105 ], [ 100, 95 ], [ 0, 95 ] ] ], 'segment');
    t.strictSame(new Offset(points.slice(1,3)).arcSegments(2).offsetLine(0), points.slice(1, 3), 'segment');
    t.strictSame(new Offset(points.slice(1)).arcSegments(2).offsetLine(5), [[[0,-5],[100,-5],[100,0],[105,0],[105,100],[100,100],[100,105],[0,105],[0,95],[95,95],[95,5],[0,5],[0,-5]]] , 'polyline');
    t.strictSame(new Offset(points.slice(1)).offsetLine(0), points.slice(1), 'zero');
    t.end();
  });

  t.end();
});