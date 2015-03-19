'use strict';
var TYPE_KEY = 'type';
var LINK_KEY = 'links';
var SELF_KEY = 'self';
var LINKAGE_KEY = 'linkage';

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
          if (relatedKey === SELF_KEY) {
            return;
          } else if (!Array.isArray(resourceObject[LINK_KEY][relatedKey][LINKAGE_KEY])) {
            resultsObject[relatedKey + 'Id'] = resourceObject[LINK_KEY][relatedKey][LINKAGE_KEY].id;
          } else {
            resultsObject[relatedKey + 'Id'] = resourceObject[LINK_KEY][relatedKey][LINKAGE_KEY].map(function(item) {
              return item.id;
            });
          }
        });
        return;
      }
      resultsObject[key] = resourceObject[key];
    });
    return resultsObject;
  }

  var simpleData = {};
  var tmpArray = [];
  if (jsonApiData.hasOwnProperty('included')) {
    if (!Array.isArray(jsonApiData.data)) {
      tmpArray = [jsonApiData.data];
    } else {
      tmpArray = jsonApiData.data.slice();
    }
    tmpArray.concat(jsonApiData.included).forEach(function (resourceItem) {
      simpleData[resourceItem.type] = simpleData[resourceItem.type] || [];
      simpleData[resourceItem.type].push(convertResource(resourceItem));
    });

  } else if (Array.isArray(jsonApiData.data)) {

    jsonApiData.data.forEach(function (resourceItem) {
      tmpArray.push(convertResource(resourceItem));
    });
    simpleData = tmpArray;

  } else {

    simpleData = convertResource(jsonApiData.data);
  }
  return simpleData;
};

exports.toJsonApi = function (simpleData, info) {
  if (!info || !info.hasOwnProperty('type')) {
    throw new Error('additional info relevant to type is required.');
  }

  function convertResource(simpleResourceObject, type, keys) {
    var apiResourceObject = {};
    apiResourceObject[TYPE_KEY] = type;
    apiResourceObject[LINK_KEY] = {};
    apiResourceObject[LINK_KEY][SELF_KEY] = info.baseUrl + '/' + type + '/' + simpleResourceObject.id;

    Object.keys(simpleResourceObject).forEach(function(key) {
      var linkResourceName,
        linkName;

      // If the resource attribute is actually an Id it defines a relationship
      if (key.substr(-2) === 'Id') {
        linkResourceName = key.substr(0, key.length - 2);
        linkName = keys.hasOwnProperty(linkResourceName) ? keys[linkResourceName] : linkResourceName;
        apiResourceObject[LINK_KEY][linkResourceName] = {
          'related': info.baseUrl + '/' + type + '/' + simpleResourceObject.id + '/' + linkResourceName,
          'self': info.baseUrl + '/' + type + '/' + simpleResourceObject.id + '/' + LINK_KEY + '/' + linkResourceName
        };
        if (Array.isArray(simpleResourceObject[key])) {
          apiResourceObject[LINK_KEY][linkResourceName][LINKAGE_KEY] = simpleResourceObject[key].map(function(itemId) {
            return {
              'type': linkName,
              'id': itemId
            };
          });
        } else {
          apiResourceObject[LINK_KEY][linkResourceName][LINKAGE_KEY] = {
            'type': linkName,
            'id': simpleResourceObject[key]
          };
        }
        return;
      }
      apiResourceObject[key] = simpleResourceObject[key];
    });

    return apiResourceObject;
  }

  var includesLinked = Object.keys(simpleData).every(function (key) {
    return Array.isArray(simpleData[key]);
  });

  var keyNames = info.hasOwnProperty('relates') ? info.relates : {};

  var jsonApiData = {};
  if (includesLinked) {
    var dataTypes = Object.keys(simpleData);
    dataTypes.forEach(function(key) {
      if (key === info.type) {
        jsonApiData.data = jsonApiData.data || [];
        simpleData[key].forEach(function(resourceItem) {
          jsonApiData.data.push(convertResource(resourceItem, key, keyNames));
        });
      } else {
        jsonApiData.included = jsonApiData.included || [];
        simpleData[key].forEach(function(resourceItem) {
          jsonApiData.included.push(convertResource(resourceItem, key, keyNames));
        });
      }
    });
  } else if (Array.isArray(simpleData)) {
    jsonApiData.data = [];
    simpleData.forEach(function(resourceItem) {
      jsonApiData.data.push(convertResource(resourceItem, info.type, keyNames));
    });
  } else {
    jsonApiData.data = convertResource(simpleData, info.type, keyNames);
  }

  return jsonApiData;
};
