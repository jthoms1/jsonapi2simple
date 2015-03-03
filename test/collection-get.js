'use strict';

var apiUtil = require('../index.js'),
  expect = require('expect.js'),
  sinon = require('sinon');

var api = apiUtil('/api');

describe('GET Collection', function () {
  var server;

  before(function(done) {
    server = sinon.fakeServer.create();
    done();
  });
  after(function(done) {
    server.restore();
    done();
  });

  describe('Invalid Scenarios', function () {
    it('it should throw a promise error on 400 level errors', function (done) {
      server.respondWith('GET', '/api/things', [200, {
          'Content-Type': 'application/json'
        }, JSON.stringify({
          'errors': 'blah'
        })
      ]);

      api.get('things')
        .then(function() {
          console.log('fail');
        })
        .catch(function(err) {
          console.log('hello ' + err);
        });

      server.respond();

      done();
    });
  });
});
