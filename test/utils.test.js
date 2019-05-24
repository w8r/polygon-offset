var tap = require('tap');
var Utils = require('../src/utils');

tap.test('orientRings', function(t) {

  t.test('empty', function(t){
    Utils.orientRings([]);
    t.end();
  });


  t.end();
});
