# Offset

Small lib for polygon offsetting(margin/padding). See the [example](http://w8r.github.io/polygon-offset) of how it can be used with [Leaflet](http://leafletjs.com).

## Install

Node

```bash
$ npm install polygon-offset
```

Browserify
```js
var Offset = require('polygon-offset');
```

Browser

```html
<script src="path/to/offset.min.js"></script>
```

## Use

```js
var points = [
    {x:0, y: 0}, {x: 100, y:0},
    {x: 100, y:100}, {x: 0, y: 100}];

var margined = new Offset(points).margin(10);
var padding  = new Offset(points).padding(10);

// decides from the sign of x: negative for padding
var unknown  = new Offset(points).offset(x);

```

## Development

```bash
$ npm install
$ npm start
$ open http://localhost:3000
$ make
```

Build

To compile the lib with Google Closure Compiler with ADVANCED_OPTIMIZATIONS

```bash
$ make
```


