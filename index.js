var Benchmark = require('benchmark');
var tb = require('travis-benchmark');
var _ = require('lodash');
var nestedProperty = require('nested-property');
var objectPath = require("object-path");
var async = require('async');
var objectPathGet = require('object-path-get');
var getObjectPath = require('get-object-path');
var getValue = require('get-value');
var objectResolvePath = require('object-resolve-path');
var dotty = require('dotty');
var dotAccess = require('dot-access');

var object = {"O73RO":{"ZWHKS":{"X3OPE":{"6F4C8":{"53GNL":{"YORMF":{"2CXEF":{"AIPED":{"IDG0W":{"BUOW1":{"TMPJI":"7A7U2"}}}}}}}}}}};
var maxPath = [];
for (var pointer = object; typeof pointer == 'object'; pointer = pointer[_.keys(pointer)[0]])
  maxPath.push(_.keys(pointer)[0]);

async.timesSeries(
  maxPath.length,
  function(t, next) {
    var suite = new Benchmark.Suite(`get depth ${t+1} by [object]`);
    
    var arrPath = maxPath.slice(0, t + 1);
    var strPath = strPath.join('.');
    
    eval(`suite.add('js (without checking)', function() { object${_.map(arrPath, p => `['${p}']`)}; });`);
    suite.add('lodash@4.17.10 get [string]', function() {
      _.get(object, strPath);
    });
    suite.add('lodash@4.17.10 get [array]', function() {
      _.get(object, arrPath);
    });
    suite.add('nested-property@0.0.7 get', function() {
      nestedProperty.get(object, strPath);
    });
    suite.add('object-path@0.11.4 get [string]', function() {
      objectPath.get(object, strPath);
    });
    suite.add('object-path@0.11.4 get [array]', function() {
      objectPath.get(object, arrPath);
    });
    suite.add('object-path-get@1.0.0 get [string]', function() {
      objectPathGet(object, strPath);
    });
    suite.add('object-path-get@1.0.0 get [array]', function() {
      objectPathGet(object, arrPath);
    });
    suite.add('get-object-path@0.0.3 get [string]', function() {
      getObjectPath(object, strPath);
    });
    suite.add('get-value@3.0.1 get [array]', function() {
      getValue(object, arrPath);
    });
    suite.add('get-value@3.0.1 get [string]', function() {
      getValue(object, strPath);
    });
    suite.add('object-resolve-path@1.1.1 get [string]', function() {
      objectResolvePath(object, strPath);
    });
    suite.add('dotty@0.1.0 get [array]', function() {
      dotty.get(object, arrPath);
    });
    suite.add('dotty@0.1.0 get [string]', function() {
      dotty.get(object, strPath);
    });
    suite.add('dot-access@1.0.0 get [string]', function() {
      dotAccess.get(object, strPath);
    });
    
    tb.wrapSuite(suite, () => next());
    suite.run({ async: true });
  }
);