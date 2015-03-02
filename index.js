'use strict';

var request = require('superagent');

function promiseYouWill(req) {
  return new Promise(function(resolve, reject) {
    req.end(function(err, res) {
      if (err) {
        reject(err);
      } if (!res.ok) {
        reject(res.error);
      }else {
        resolve(res);
      }
    });
  });
}

function _getResourceUrl(resourceName, id=null) {
  var url = '/api/' + resourceName;
  url += (id) ? '/' + id : '';
  return url;
}

module.exports = {
  get: function(resourceName, options={}) {
    var resourceUrl = _getResourceUrl(resourceName);
    let req = request
      .get(resourceUrl)
      .accept('application/json')
      .query(options);

    return promiseYouWill(req);
  },

  create: function(resourceName, resource, options={}) {
    var resourceUrl = _getResourceUrl(resourceName, resource.id);
    var req = request.post(resourceUrl)
      .set('Content-Type', 'application/json')
      .query(options)
      .send(resource);

    return promiseYouWill(req);
  },

  update: function(resourceName, resource, options={}) {
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
