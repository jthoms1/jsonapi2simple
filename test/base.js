'use strict';

var transform = require('../index.js'),
  expect = require('expect.js');

describe('Data with no relationships', function () {
  var info = {
    'type': 'articles',
    'baseUrl': '/api'
  };
  var apiData = {
    'data': {
      'type': 'articles',
      'id': '1',
      'title': 'Rails is a Melting Pot',
      'links': {
        'self': '/api/articles/1'
      }
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
    'baseUrl': '/api',
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
        'self': '/api/articles/1',
        'author': {
          'self': '/api/articles/1/links/author',
          'related': '/api/articles/1/author',
          'linkage': { 'type': 'people', 'id': '1' }
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
    'type': 'articles',
    'baseUrl': '/api'
  };
  var apiData = {
    'data': {
      'type': 'articles',
      'id': '1',
      'title': 'Rails is a Melting Pot',
      'links': {
        'self': '/api/articles/1',
        'tags': {
          'self': '/api/articles/1/links/tags',
          'related': '/api/articles/1/tags',
          'linkage': [
            { 'type': 'tags', 'id': '2' },
            { 'type': 'tags', 'id': '3' }
          ]
        }
      }
    }
  };
  var simpleData = {
    'id': '1',
    'title': 'Rails is a Melting Pot',
    'tagsId': ['2', '3']
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

describe('Multiple data entries', function () {
  var info = {
    'type': 'articles',
    'baseUrl': '/api',
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
          'self': '/api/articles/1',
          'author': {
            'self': '/api/articles/1/links/author',
            'related': '/api/articles/1/author',
            'linkage': { 'type': 'people', 'id': '9' }
          },
          'comments': {
            'self': '/api/articles/1/links/comments',
            'related': '/api/articles/1/comments',
            'linkage': [
              { 'type': 'comments', 'id': '5' },
              { 'type': 'comments', 'id': '12' }
            ]
          }
        }
      },
      {
        'type': 'articles',
        'id': '6',
        'title': 'JSON API paints my bikeshed too!',
        'links': {
          'self': '/api/articles/6',
          'author': {
            'self': '/api/articles/6/links/author',
            'related': '/api/articles/6/author',
            'linkage': { 'type': 'people', 'id': '9' }
          },
          'comments': {
            'self': '/api/articles/1/links/comments',
            'related': '/api/articles/1/comments',
            'linkage': [
              { 'type': 'comments', 'id': '6' },
              { 'type': 'comments', 'id': '13' }
            ]
          }
        }
      }
    ]
  };
  var simpleData = [
    {
      'id': '1',
      'title': 'JSON API paints my bikeshed!',
      'authorId': '9',
      'commentsId': ['5', '12']
    },
    {
      'id': '6',
      'title': 'JSON API paints my bikeshed too!',
      'authorId': '9',
      'commentsId': ['6', '13']
    }
  ];
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
    'baseUrl': '/api',
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
          'self': '/api/articles/1',
          'author': {
            'self': '/api/articles/6/links/author',
            'related': '/api/articles/6/author',
            'linkage': { 'type': 'people', 'id': '9' }
          },
          'comments': {
            'self': '/api/articles/1/links/comments',
            'related': '/api/articles/1/comments',
            'linkage': [
              { 'type': 'comments', 'id': '5' },
              { 'type': 'comments', 'id': '12' }
            ]
          }
        }
      }
    ],
    'included': [
      {
        'type': 'people',
        'id': '9',
        'first-name': 'Dan',
        'last-name': 'Gebhardt',
        'twitter': 'dgeb',
        'links': {
          'self': '/api/people/9'
        }
      },
      {
        'type': 'comments',
        'id': '5',
        'body': 'First!',
        'links': {
          'self': '/api/comments/5'
        }
      },
      {
        'type': 'comments',
        'id': '12',
        'body': 'I like XML better',
        'links': {
          'self': '/api/comments/12'
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
        'commentsId': ['5', '12']
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
