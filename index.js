var Benchmark = require('benchmark');
var tb = require('travis-benchmark');
var beauty = require('beautify-benchmark');
var _ = require('lodash');
var async = require('async');

async.timesSeries(
  15,
  function(t, next) {
    var count = Math.pow(2, t);
    var suite = new Benchmark.Suite(`${count} cycles`);

    var array = _.times(count, function(t) {
      return t;
    });

    suite.add('for', function() {
      for (var i = 0; i < count; i++) {
        array[i];
      };
    });
    suite.add('while', function() {
      var i = 0;
      while (i < count) {
        i++;
        array[i];
      }
    });
    suite.add('for-in', function() {
      for (var i in array) {
        array[i];
      }
    });
    suite.add('for-of', function() {
      for (var f of array) {
        f;
      }
    });
    suite.add('forEach', function() {
      array.forEach(function(value, index) {
        value;
      });
    });
    suite.add('lodash.forEach', function() {
      _.forEach(array, function(value, index) {
        value;
      });
    });

    suite.on('cycle', function (event) { beauty.add(event.target); });
    suite.on('complete', function(event) {
      beauty.log();
      tb.saveSuite(
        tb.parseSuite(event),
        function(error) {
          next();
        }
      );
    });

    suite.run({ async: true });
  }
);
