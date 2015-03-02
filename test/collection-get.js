'use strict';

var apiUtil = require('../index.js'),
  expect = require('expect.js'),
  sinon = require('sinon');

describe('GET Collection', function () {
  describe('Invalid Scenarios', function () {
    it('', function (done) {
      var server = sinon.fakeServer.create();

      server.respondWith('GET', encodeURI('/api/things'), [404, {
         'Content-Type': 'application/vnd.api+json'
        }, JSON.stringify({
          'errors': [{
            'title': 'Resource not found.'
          }]
        })
      ]);

      done();
    });
  });
});
