var Benchmark = require('benchmark');
var tb = require('travis-benchmark');
var beauty = require('beautify-benchmark');

var suite = new Benchmark.Suite(`Demo suite`);

for (var i = 0; i < 5; i++) {
  suite.add('Demo test', function() {
    for (var w = 0; w < i * 10000; w++) {};
  });
}

suite.on('cycle', function (event) { beauty.add(event.target); });
suite.on('complete', function(event) {
  beauty.log();
  tb.saveSuite(
    tb.parseSuite(event),
    function(error) {}
  );
});

suite.run({ async: true });