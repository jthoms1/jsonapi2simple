'use strict';

var transform = require('../index.js'),
  expect = require('expect.js');

describe('Data with no relationships', function () {
  var info = {
    'type': 'articles',
    'relates': {
      'author': 'people'
    }
  };
  var apiData = {
    'data': {
      'type': 'articles',
      'id': '1',
      'title': 'Rails is a Melting Pot'
    }
  };
  var simpleData = {
    'id': '1',
    'title': 'Rails is a Melting Pot'
  };

  it('should convert jsonapi data to simple', function (done) {
    var result = transform.toSimple(apiData);
    expect(result).to.eql(simpleData);
    done();
  });
  it('should convert simple data to jsonapi', function (done) {
    var result = transform.toJsonApi(simpleData, info);
    expect(result).to.eql(apiData);
    done();
  });
});

describe('Data with 1-to-1 relationships', function () {
  var info = {
    'type': 'articles',
    'relates': {
      'author': 'people'
    }
  };
  var apiData = {
    'data': {
      'type': 'articles',
      'id': '1',
      'title': 'Rails is a Melting Pot',
      'links': {
        'author': {
          'type': 'people',
          'id': '1'
        }
      }
    }
  };
  var simpleData = {
    'id': '1',
    'title': 'Rails is a Melting Pot',
    'authorId': '1'
  };


  it('should convert jsonapi data to simple', function (done) {
    var result = transform.toSimple(apiData);
    expect(result).to.eql(simpleData);
    done();
  });
  it('should convert simple data to jsonapi', function (done) {
    var result = transform.toJsonApi(simpleData, info);
    expect(result).to.eql(apiData);
    done();
  });
});

describe('Data with 1-to-many relationships', function () {
  var info = {
    'type': 'articles'
  };
  var apiData = {
    'data': {
      'type': 'articles',
      'id': '1',
      'title': 'Rails is a Melting Pot',
      'links': {
        'tags': {
          'type': 'tags',
          'ids': ['2', '3']
        }
      }
    }
  };
  var simpleData = {
    'id': '1',
    'title': 'Rails is a Melting Pot',
    'tagsIds': ['2', '3']
  };

  it('should convert jsonapi data to simple', function (done) {
    var result = transform.toSimple(apiData);
    expect(result).to.eql(simpleData);
    done();
  });
  it('should convert simple data to jsonapi', function (done) {
    var result = transform.toJsonApi(simpleData, info);
    expect(result).to.eql(apiData);
    done();
  });
});

describe('Compound documents', function () {
  var info = {
    'type': 'articles',
    'relates': {
      'author': 'people'
    }
  };
  var apiData = {
    'data': [
      {
        'type': 'articles',
        'id': '1',
        'title': 'JSON API paints my bikeshed!',
        'links': {
          'self': 'http://example.com/articles/1',
          'author': {
            'self': 'http://example.com/articles/1/links/author',
            'resource': 'http://example.com/articles/1/author',
            'type': 'people',
            'id': '9'
          },
          'comments': {
            'self': 'http://example.com/articles/1/links/comments',
            'resource': 'http://example.com/articles/1/comments',
            'type': 'comments',
            'ids': ['5', '12']
          }
        }
      }
    ],
    'linked': [
      {
        'type': 'people',
        'id': '9',
        'first-name': 'Dan',
        'last-name': 'Gebhardt',
        'twitter': 'dgeb',
        'links': {
          'self': 'http://example.com/people/9'
        }
      },
      {
        'type': 'comments',
        'id': '5',
        'body': 'First!',
        'links': {
          'self': 'http://example.com/comments/5'
        }
      },
      {
        'type': 'comments',
        'id': '12',
        'body': 'I like XML better',
        'links': {
          'self': 'http://example.com/comments/12'
        }
      }
    ]
  };
  var simpleData = {
    'articles': [
      {
        'id': '1',
        'title': 'JSON API paints my bikeshed!',
        'authorId': '9',
        'commentsIds': ['5', '12']
      }
    ],
    'people': [
      {
        'id': '9',
        'first-name': 'Dan',
        'last-name': 'Gebhardt',
        'twitter': 'dgeb'
      }
    ],
    'comments': [
      {
        'id': '5',
        'body': 'First!'
      },
      {
        'id': '12',
        'body': 'I like XML better'
      }
    ]
  };

  it('should convert jsonapi data to simple', function (done) {
    var result = transform.toSimple(apiData);
    expect(result).to.eql(simpleData);
    done();
  });
  it('should convert simple data to jsonapi', function (done) {
    var result = transform.toJsonApi(simpleData, info);
    expect(result).to.eql(apiData);
    done();
  });
});
