'use strict';
var TYPE_KEY = 'type';
var LINK_KEY = 'links';

exports.toSimple = function (jsonApiData) {
  if (!jsonApiData.hasOwnProperty('data')) {
    throw new Error('data attribute required');
  }

  var simpleData = {};

  Object.keys(jsonApiData.data).forEach(function(key) {
    if (TYPE_KEY === key) {
      return;
    }
    if (LINK_KEY === key) {
      Object.keys(jsonApiData.data[LINK_KEY]).forEach(function(relatedKey) {
        if (jsonApiData.data[LINK_KEY][relatedKey].id) {
          simpleData[relatedKey + 'Id'] = jsonApiData.data[LINK_KEY][relatedKey].id;
        } else {
          console.log(jsonApiData.data[LINK_KEY][relatedKey].ids.slice());
          simpleData[relatedKey + 'Ids'] = jsonApiData.data[LINK_KEY][relatedKey].ids.slice();
        }
      });
      return;
    }
    simpleData[key] = jsonApiData.data[key];
  });

  return simpleData;
};

exports.toJsonApi = function (simpleData, info) {
  if (!info || !info.hasOwnProperty('type')) {
    throw new Error('additional info relevant to type is required.');
  }

  var jsonApiData = {
    'data': {
      'type': info.type
    }
  };
  var keyNames = info.hasOwnProperty('relates') ? info.relates : {};

  Object.keys(simpleData).forEach(function(key) {
    var linkKey,
      linkName;
    if (key.substr(-3) === 'Ids') {
      jsonApiData.data.links = jsonApiData.data.links || {};
      linkKey = key.substr(0, key.length - 3);
      linkName = keyNames.hasOwnProperty(linkKey) ? keyNames[linkKey] : linkKey;
      jsonApiData.data.links[linkKey] = {
        'type': linkName,
        'ids': simpleData[key].slice()
      };
      return;
    }
    if (key.substr(-2) === 'Id') {
      jsonApiData.data.links = jsonApiData.data.links || {};
      linkKey = key.substr(0, key.length - 2);
      linkName = keyNames.hasOwnProperty(linkKey) ? keyNames[linkKey] : linkKey;
      jsonApiData.data.links[linkKey] = {
        'type': linkName,
        'id': simpleData[key]
      };
      return;
    }
    jsonApiData.data[key] = simpleData[key];
  });

  return jsonApiData;
};
