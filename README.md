# Offset [![npm version](https://badge.fury.io/js/polygon-offset.svg)](https://badge.fury.io/js/polygon-offset) [![CircleCI](https://circleci.com/gh/w8r/polygon-offset.svg?style=shield)](https://circleci.com/gh/w8r/polygon-offset)

Small lib for polygon offsetting(margin/padding). See the [example](http://w8r.github.io/polygon-offset) of how it can be used with [Leaflet](http://leafletjs.com). It handles quite well oddly shaped and concave polygons.

![screenshot 2016-07-27 19 05 53](https://cloud.githubusercontent.com/assets/26884/17184701/f2caf18c-542d-11e6-8cab-a63aee43aac8.png)

The reason I wrote this is that the only working solution to this problem known to me is Angus Johnson's [Clipper](http://www.angusj.com/delphi/clipper.php) library. Library is huge and offsetting in it is subroutine.

This library depends on [Martinez](http://github.com/w8r/martinez/) polygon clipping algorithm, and combined with it weighs ~14kb.

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
// if the first point repeats(for instance GeoJSON) -
// the output will have it as well
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

// if you want to work with the polyline - margin only
var polyline = offset.data(points).offsetLine(5);

```

## Dependencies

[Martinez](https://github.com/w8r/martinez/) clipping algorithm

## Development

```bash
$ npm install
$ npm start
$ open http://localhost:3003
$ make
$ npm test
```

Build

To compile the lib with Google Closure Compiler with `ADVANCED_OPTIMIZATIONS`

```bash
$ make
```

## Sources

* [Hans Muller, Growing and Shrinking Polygons: Round One](http://codepen.io/HansMuller/pen/lDfzt/)
* [POLYGON OFFSETTING BY COMPUTING WINDING NUMBERS, Xiaorui Chen Sara McMains, Berkeley, 2005](http://www.me.berkeley.edu/~mcmains/pubs/DAC05OffsetPolygon.pdf)

## License

The MIT License (MIT)

Copyright (c) 2016 Alexander Milevski

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



