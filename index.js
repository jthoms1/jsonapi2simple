'use strict';

var request = require('superagent');
require('es6-promise').polyfill();

function promiseYouWill(req) {
  return new Promise(function(resolve, reject) {
    req.end(function(err, res) {
      if (err) {
        reject(err);
      } if (res.ok) {
        resolve(res);
      } else {
        reject(res.error);
      }
    });
  });
}

module.exports = function(basePath) {
  function _getResourceUrl(resourceName, id) {
    var url = basePath + '/' + resourceName;
    url += (id) ? '/' + id : '';
    return url;
  }

  return {
    get: function(resourceName, options) {
      options = options || {};
      var resourceUrl = _getResourceUrl(resourceName);
      var req = request
        .get(resourceUrl)
        .accept('application/json')
        .query(options);

      return promiseYouWill(req);
    },

    create: function(resourceName, resource, options) {
      options = options || {};
      var resourceUrl = _getResourceUrl(resourceName, resource.id);
      var req = request.post(resourceUrl)
        .set('Content-Type', 'application/json')
        .query(options)
        .send(resource);

      return promiseYouWill(req);
    },

    update: function(resourceName, resource, options) {
      options = options || {};
      var resourceUrl = _getResourceUrl(resourceName, resource.id);
      var req = request.put(resourceUrl)
        .set('Content-Type', 'application/json')
        .query(options)
        .send(resource);

      return promiseYouWill(req);
    },

    del: function(resourceName, resource) {
      var resourceUrl = _getResourceUrl(resourceName, resource.id);
      var req = request.del(resourceUrl);

      return promiseYouWill(req);
    }
  };
};
