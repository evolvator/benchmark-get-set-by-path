var Benchmark = require('benchmark');
var tb = require('travis-benchmark');
var _ = require('lodash');
var nestedProperty = require('nested-property');
var objectPath = require("object-path");
var async = require('async');

var object = {"O73RO":{"ZWHKS":{"X3OPE":{"6F4C8":{"53GNL":{"YORMF":{"2CXEF":{"AIPED":{"IDG0W":{"BUOW1":{"TMPJI":"7A7U2"}}}}}}}}}}};
var maxPath = [];
for (var pointer = object; typeof pointer == 'object'; pointer = pointer[_.keys(pointer)[0]])
  maxPath.push(_.keys(pointer)[0]);

async.timesSeries(
  maxPath.length,
  function(t, next) {
    var suite = new Benchmark.Suite(`get depth ${t+1} by [object]`);
    
    var path = maxPath.slice(0, t + 1);
    
    eval(`suite.add('js (without checking)', function() { object${_.map(path, p => `['${p}']`)}; });`);
    suite.add('lodash@4.17.10 get [string]', function() {
      _.get(object, path.join('.'));
    });
    suite.add('lodash@4.17.10 get [array]', function() {
      _.get(object, path);
    });
    suite.add('nested-property@0.0.7 get', function() {
      nestedProperty.get(object, path.join('.'));
    });
    suite.add('object-path@0.11.4 get [string]', function() {
      objectPath.get(object, path.join('.'));
    });
    suite.add('object-path@0.11.4 get [array]', function() {
      objectPath.get(object, path);
    });
    
    tb.wrapSuite(suite, () => next());
    suite.run({ async: true });
  }
);