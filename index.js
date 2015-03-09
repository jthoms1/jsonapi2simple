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
  var tmpArray = [];
  if (jsonApiData.hasOwnProperty('linked')) {

    if (!Array.isArray(jsonApiData.data)) {
      tmpArray = [jsonApiData.data];
    } else {
      tmpArray = jsonApiData.data.slice();
    }
    tmpArray.concat(jsonApiData.linked).forEach(function (resourceItem) {
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
    apiResourceObject.type = type;

    Object.keys(simpleResourceObject).forEach(function(key) {
      var linkKey,
        linkName;

      if (key.substr(-2) === 'Id') {
        apiResourceObject.links = apiResourceObject.links || {};
        linkKey = key.substr(0, key.length - 2);
        linkName = keys.hasOwnProperty(linkKey) ? keys[linkKey] : linkKey;
        apiResourceObject.links[linkKey] = {
          'type': linkName,
          'id': simpleResourceObject[key]
        };
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
        jsonApiData.linked = jsonApiData.linked || [];
        simpleData[key].forEach(function(resourceItem) {
          jsonApiData.linked.push(convertResource(resourceItem, key, keyNames));
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
