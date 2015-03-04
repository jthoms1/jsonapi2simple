'use strict';
var assign = require('object-assign');

exports.toSimple = function (data) {
  return assign({}, data);
};

exports.toJsonApi = function (data, info) {
  return assign({}, data);
};
