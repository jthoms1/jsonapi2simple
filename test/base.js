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
          'id': ['2', '3']
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
          'author': {
            'type': 'people',
            'id': '9'
          },
          'comments': {
            'type': 'comments',
            'id': ['5', '12']
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
        'twitter': 'dgeb'
      },
      {
        'type': 'comments',
        'id': '5',
        'body': 'First!'
      },
      {
        'type': 'comments',
        'id': '12',
        'body': 'I like XML better'
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
