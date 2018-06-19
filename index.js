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
var setValue = require('set-value');
var dotProp = require('dot-prop');
var objectSet = require('object-set');
var objectPathSet = require('object-path-set');
var shvl = require('shvl');
var dot2val = require('dot2val');

var object = {"O73RO":{"ZWHKS":{"X3OPE":{"6F4C8":{"53GNL":{"YORMF":{"2CXEF":{"AIPED":{"IDG0W":{"BUOW1":{"TMPJI":"7A7U2"}}}}}}}}}}};
var maxPath = [];
for (var pointer = object; typeof pointer == 'object'; pointer = pointer[_.keys(pointer)[0]])
  maxPath.push(_.keys(pointer)[0]);

async.series(
  (next) => {
    async.timesSeries(
      maxPath.length,
      function(t, next) {
        var suite = new Benchmark.Suite(`get depth ${t+1} by [object]`);
        
        var arrPath = maxPath.slice(0, t + 1);
        var strDotPath = arrPath.join('.');
        var strSquarePath = _.map(arrPath, function(p) { return `["${p}"]`; }).join('');
        
        eval(`suite.add('js (without checking)', function() { object${_.map(arrPath, function(p) { return `['${p}']`; })}; });`);
        suite.add('lodash@4.17.10 get [string]', function() {
          _.get(object, strDotPath);
        });
        suite.add('lodash@4.17.10 get [array]', function() {
          _.get(object, arrPath);
        });
        suite.add('nested-property@0.0.7 get', function() {
          nestedProperty.get(object, strDotPath);
        });
        suite.add('object-path@0.11.4 get [string]', function() {
          objectPath.get(object, strDotPath);
        });
        suite.add('object-path@0.11.4 get [array]', function() {
          objectPath.get(object, arrPath);
        });
        suite.add('object-path-get@1.0.0 [string]', function() {
          objectPathGet(object, strDotPath);
        });
        suite.add('object-path-get@1.0.0 [array]', function() {
          objectPathGet(object, arrPath);
        });
        suite.add('get-object-path@0.0.3 get [string]', function() {
          getObjectPath(object, strDotPath);
        });
        suite.add('get-value@3.0.1 get [array]', function() {
          getValue(object, arrPath);
        });
        suite.add('get-value@3.0.1 get [string]', function() {
          getValue(object, strDotPath);
        });
        suite.add('object-resolve-path@1.1.1 get [string]', function() {
          objectResolvePath(object, strSquarePath);
        });
        suite.add('dotty@0.1.0 get [array]', function() {
          dotty.get(object, arrPath);
        });
        suite.add('dotty@0.1.0 get [string]', function() {
          dotty.get(object, strDotPath);
        });
        suite.add('dot-access@1.0.0 get [string]', function() {
          dotAccess.get(object, strDotPath);
        });
        suite.add('dot-prop@4.2.0 get [string]', function() {
          dotProp.get(object, strDotPath);
        });
        suite.add('shvl@1.3.1 get [array]', function() {
          shvl.get(object, arrPath);
        });
        suite.add('shvl@1.3.1 get [string]', function() {
          shvl.get(object, strDotPath);
        });
        suite.add('dot2val@1.2.2 get [string]', function() {
          dot2val.get(object, strDotPath);
        });
        
        tb.wrapSuite(suite, () => next());
        suite.run({ async: true });
      },
      (next) => next()
    );
  },
  (next) => {
    async.timesSeries(
      maxPath.length,
      function(t, next) {
        var suite = new Benchmark.Suite(`set depth ${t+1} by [object]`);
        
        var arrPath = maxPath.slice(0, t + 1);
        var strDotPath = arrPath.join('.');
        var strSquarePath = _.map(arrPath, function(p) { return `["${p}"]`; }).join('');
        
        eval(`suite.add('js (without checking)', function() { var data = {}; ${_.map(arrPath.slice(0, arrPath.length-1), function(value, index) {
          return `data${_.map(arrPath.slice(0, index + 1), function(value) {
            return `["${value}"]`;
          }).join('')} = {};`;
        }).join('')} data${_.map(arrPath, function(value) { return `["${value}"]` }).join('')} = 123; });`);
        suite.add('lodash@4.17.10 set [string]', function() {
          var data = {};
          _.set(data, strDotPath, 123);
        });
        suite.add('lodash@4.17.10 set [array]', function() {
          var data = {};
          _.set(data, arrPath, 123);
        });
        suite.add('nested-property@0.0.7 set', function() {
          var data = {};
          nestedProperty.set(data, strDotPath, 123);
        });
        suite.add('object-path@0.11.4 set [string]', function() {
          var data = {};
          objectPath.set(data, strDotPath, 123);
        });
        suite.add('object-path@0.11.4 set [array]', function() {
          var data = {};
          objectPath.set(data, arrPath, 123);
        });
        suite.add('set-value@3.0.0 set [string]', function() {
          var data = {};
          setValue(data, arrPath, 123);
        });
        suite.add('dot-prop@4.2.0 set [string]', function() {
          var data = {};
          dotProp.set(data, strDotPath, 123);
        });
        suite.add('object-path-set@1.0.0 set [string]', function() {
          var data = {};
          objectPathSet(data, strDotPath, 123);
        });
        suite.add('object-set@1.0.1 set [string]', function() {
          var data = {};
          objectSet(data, strDotPath, 123);
        });
        suite.add('shvl@1.3.1 set [array]', function() {
          var data = {};
          shvl.set(data, arrPath, 123);
        });
        suite.add('shvl@1.3.1 set [string]', function() {
          var data = {};
          shvl.set(data, strDotPath, 123);
        });
        suite.add('dot2val@1.2.2 set [string]', function() {
          var data = {};
          dot2val.set(data, strDotPath, 123);
        });
        
        tb.wrapSuite(suite, () => next());
        suite.run({ async: true });
      },
      (next) => next()
    );
  }
);