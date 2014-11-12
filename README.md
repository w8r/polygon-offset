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

## Sources

* [Hans Muller, Growing and Shrinking Polygons: Round One](http://codepen.io/HansMuller/pen/lDfzt/)
* [POLYGON OFFSETTING BY COMPUTING WINDING NUMBERS, Xiaorui Chen Sara McMains, Berkeley, 2005](http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf)

## License

The MIT License (MIT)

Copyright (c) 2014 Alexander Milevski

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of
the Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.



