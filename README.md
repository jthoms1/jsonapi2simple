[![Build
Status](https://travis-ci.org/jthoms1/jsonapi2simple.svg?branch=master)](https://travis-ci.org/jthoms1/jsonapi2simple)
[![Dependency Status](https://david-dm.org/jthoms1/jsonapi2simple.svg)](https://david-dm.org/jthoms1/jsonapi2simple)
[![Coverage Status](https://coveralls.io/repos/jthoms1/jsonapi2simple/badge.svg?branch=master&service=github)](https://coveralls.io/github/jthoms1/jsonapi2simple?branch=master)
# jsonapi2simple
Utility to allow conversion between simple JSON data and JSONAPI service based structure.

# Usage
The conversion process will allow you to convert JSONAPI structures into more managable JSON.
This tool was built for allowing front-end applications to work with a simplified structure during view/editing and then transform back to JSONAPI for server interactions.
```javascript
var converter = require('jsonapi2simple');
var objectInfo = {
  'type': 'articles',
  'baseUrl': '/api',
  'relates': {
    'author': 'people'
  }
};
var simpleContent = converter.toSimple({
  'data': {
    'id': '4f32132',
    'type': 'articles',
    'title': 'This Tool is Easy',
    'links': {
      'self': '/api/articles/4f32132'
    }
  }
}, objectInfo);
/*
simpleContent now contains:
{
  'id': '4f32132',
  'title': 'This Tool is Easy'
}
*/
var jsonApiContent = converter.toJsonApi(simple, objectInfo);
/*
jsonApiContent now contains:
{
  'data': {
    'id': '4f32132',
    'type': 'articles',
    'title': 'This Tool is Easy',
    'links': {
      'self': '/api/articles/4f32132'
    }
  }
}
*/
```

This can also be used for more complex structures. Usually with a front-end application the code that is interacting with the server will contain some meta data about the request such as its type and the resource's relationships to other resources.

For more complex structures or other use cases please refer to the included tests.
