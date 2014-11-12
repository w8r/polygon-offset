var Offset = require('../src/offset');

var points = [{
        x: 0,
        y: 0
    }, {
        x: 100,
        y: 0
    }, {
        x: 100,
        y: 100
    }, {
        x: 0,
        y: 100
    }],
    x = -10;

var margined = new Offset(points).margin(10);
var padding = new Offset(points).padding(10);

// decides from the sign of x: negative for padding
var unknown = new Offset(points).offset(x);

console.log('margined', margined, '\n\npadded:', padding, '\n\nadaptive', unknown);
