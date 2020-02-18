import { assert } from 'chai';
import Offset from '../dist/polygon-offset';
import Edge from '../src/edge';

function prec(arr, precision) {
  if (typeof arr[0] === 'number') {
    return arr.map(function (n) {
      return parseFloat(n.toFixed(precision));
    });
  }
  for (var i = 0; i < arr.length; i++) {
    arr[i] = prec(arr[i], precision);
  }
  return arr;
}

// CCW
const points = [[0, 0], [0, 100], [100, 100], [100, 0], [0, 0]];
let x = -10;

describe('polygon.offset', () => {
  it('edge', () => {
    const e = new Edge([0, 0], [0, 5]);
    assert.deepEqual(e.current, [0, 0], 'current');
    assert.deepEqual(e.next, [0, 5], 'next');
    assert.deepEqual(e._inNormal, [-1, 0], 'inwards normal');
    assert.deepEqual(e._outNormal, [1, -0], 'outwards normal');
  });

  it('data', () => {
    assert.throws(function () {
      return new Offset(1);
    }, 'Offset requires at least one coodinate to work with');
    assert.deepEqual(new Offset(points).vertices, points, 'read');
    //assert.deepEqual(new Offset(points).vertices, points, 'stored');
  });

  it('margin', () => {
    assert.deepEqual(prec(new Offset(points).arcSegments(3).margin(5), 3), [
      [
        [-5, 0],
        [-5, 100],
        [-4.33, 101.16],
        [-4.33, 102.5],
        [-3.17, 103.17],
        [-2.5, 104.33],
        [-1.16, 104.33],
        [0, 105],
        [100, 105],
        [101.16, 104.33],
        [102.5, 104.33],
        [103.17, 103.17],
        [104.33, 102.5],
        [104.33, 101.16],
        [105, 100],
        [105, 0],
        [104.33, -1.16],
        [104.33, -2.5],
        [103.17, -3.17],
        [102.5, -4.33],
        [101.16, -4.33],
        [100, -5],
        [0, -5],
        [-1.16, -4.33],
        [-2.5, -4.33],
        [-3.17, -3.17],
        [-4.33, -2.5],
        [-4.33, -1.16],
        [-5, 0]
      ]
    ]);
    assert.deepEqual(
      new Offset(points).arcSegments(1).margin(5),
      [
        [
          [-5, 0],
          [-5, 100],
          [0, 100],
          [0, 105],
          [100, 105],
          [100, 100],
          [105, 100],
          [105, 0],
          [100, 0],
          [100, -5],
          [0, -5],
          [0, 0],
          [-5, 0]
        ]
      ],
      'normal'
    );
    assert.deepEqual(
      new Offset(points).arcSegments(0).margin(5),
      [
        [
          [-5, 0],
          [-5, 100],
          [0, 100],
          [0, 105],
          [100, 105],
          [100, 100],
          [105, 100],
          [105, 0],
          [100, 0],
          [100, -5],
          [0, -5],
          [0, 0],
          [-5, 0]
        ]
      ],
      '0 additional segs'
    );
    assert.deepEqual(new Offset(points).margin(0), points, 'zero');
  });

  it('padding', () => {
    assert.deepEqual(new Offset(points).arcSegments(5).padding(10), [
      [[10, 10], [10, 90], [90, 90], [90, 10], [10, 10]]
    ]);
    assert.deepEqual(
      new Offset(points).padding(5),
      [[[5, 5], [5, 95], [95, 95], [95, 5], [5, 5]]],
      'normal'
    );
    assert.deepEqual(new Offset(points).padding(0), points, 'zero');
  });

  it('adaptive', () => {
    assert.deepEqual(
      prec(new Offset(points).arcSegments(3).offset(1), 3),
      [
        [
          [-1, 0],
          [-1, 100],
          [-0.866, 100.232],
          [-0.866, 100.5],
          [-0.634, 100.634],
          [-0.5, 100.866],
          [-0.232, 100.866],
          [0, 101],
          [100, 101],
          [100.232, 100.866],
          [100.5, 100.866],
          [100.634, 100.634],
          [100.866, 100.5],
          [100.866, 100.232],
          [101, 100],
          [101, 0],
          [100.866, -0.232],
          [100.866, -0.5],
          [100.634, -0.634],
          [100.5, -0.866],
          [100.232, -0.866],
          [100, -1],
          [0, -1],
          [-0.232, -0.866],
          [-0.5, -0.866],
          [-0.634, -0.634],
          [-0.866, -0.5],
          [-0.866, -0.232],
          [-1, 0]
        ]
      ],
      'margin'
    );
    assert.deepEqual(
      prec(new Offset(points).arcSegments(3).offset(-1), 3),
      [[[1, 1], [1, 99], [99, 99], [99, 1], [1, 1]]],
      'padding'
    );
  });

  it('line', () => {
    assert.deepEqual(
      new Offset(points.slice(1, 3)).arcSegments(2).offsetLine(5),
      [[[0, 95], [0, 105], [100, 105], [100, 95], [0, 95]]],
      'segment'
    );
    assert.deepEqual(
      new Offset(points.slice(1, 3)).arcSegments(2).offsetLine(0),
      points.slice(1, 3),
      'segment'
    );
    assert.deepEqual(
      new Offset(points.slice(1)).arcSegments(2).offsetLine(5),
      Offset.orientRings([
        [
          [0, -5],
          [100, -5],
          [100, 0],
          [105, 0],
          [105, 100],
          [100, 100],
          [100, 105],
          [0, 105],
          [0, 95],
          [95, 95],
          [95, 5],
          [0, 5],
          [0, -5]
        ]
      ]),
      'polyline'
    );
    assert.deepEqual(
      new Offset(points.slice(1)).offsetLine(0),
      points.slice(1),
      'zero'
    );
  });

  it('point', () => {
    assert.deepEqual(
      prec(new Offset([0, 0]).offset(5), 3),
      [
        [
          [4.206, 2.703],
          [5, -0],
          [4.206, -2.703],
          [2.077, -4.548],
          [-0.712, -4.949],
          [-3.274, -3.779],
          [-4.797, -1.409],
          [-4.797, 1.409],
          [-3.274, 3.779],
          [-0.712, 4.949],
          [2.077, 4.548],
          [4.206, 2.703]
        ]
      ],
      'circle'
    );
    assert.deepEqual(new Offset([0, 0]).offset(-10), [0, 0], 'negative');
    assert.deepEqual(new Offset([0, 0]).offset(0), [0, 0], 'zero');
  });

  it('Avoid mutation of last point of polygons', () => {
    const out = new Offset([
      [0, 0],
      [0, 100],
      [100, 100],
      [100, 0],
      [0, 0]
    ]).offset(5);
    out[0][0][0] = 'foo';
    assert.equal(out[0][0][0], 'foo');
    assert.equal(out[0][out[0].length - 1][0], -5);
  });
});
