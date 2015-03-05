'use strict';
var TYPE_KEY = 'type';
var LINK_KEY = 'links';

exports.toSimple = function (jsonApiData) {
  if (!jsonApiData.hasOwnProperty('data')) {
    throw new Error('data attribute required');
  }

  function convertResource(resourceObject) {
    var resultsObject = {};
    Object.keys(resourceObject).forEach(function(key) {
      if (TYPE_KEY === key) {
        return;
      }
      if (LINK_KEY === key) {
        Object.keys(resourceObject[LINK_KEY]).forEach(function(relatedKey) {
          if (!Array.isArray(resourceObject[LINK_KEY][relatedKey].id)) {
            resultsObject[relatedKey + 'Id'] = resourceObject[LINK_KEY][relatedKey].id;
          } else {
            resultsObject[relatedKey + 'Id'] = resourceObject[LINK_KEY][relatedKey].id.slice();
          }
        });
        return;
      }
      resultsObject[key] = resourceObject[key];
    });
    return resultsObject;
  }

  var simpleData = {};

  if (jsonApiData.hasOwnProperty('linked')) {
    var tmpArray;
    if (!Array.isArray(jsonApiData.data)) {
      tmpArray = [jsonApiData.data];
    } else {
      tmpArray = jsonApiData.data.slice();
    }
    tmpArray.concat(jsonApiData.linked).forEach(function (resourceItem) {
      simpleData[resourceItem.type] = simpleData[resourceItem.type] || [];
      simpleData[resourceItem.type].push(convertResource(resourceItem));
    });
  } else {
    simpleData = convertResource(jsonApiData.data);
  }
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
