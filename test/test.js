var Offset = require('../src/offset');

// CCW
var points = [
  [0,0], [0,100],
  [100,100], [100,0], [0,0]
];
var x = -10;

var offset = new Offset();
var margined = offset.data(points).margin(10);
var padding = offset.data(points).padding(10);

// decides from the sign of x: negative for padding
var unknown = offset.data(points).arcSegments(3).offset(x);

console.log('data:', points, '\n\nmargined', margined, '\n\npadded:', padding, '\n\nadaptive', unknown);
