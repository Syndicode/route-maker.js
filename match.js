(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.match = factory());
}(this, (function () { 'use strict';

  function match(routePath, path) {
    if (routePath[0] === '/') routePath = routePath.slice(1);
    const routeArray = routePath.split('/');
    const indexParams = {};
    routeArray.forEach((item, i) => {
      if (item[0] === ':')
        indexParams[i] = item.slice(1);
    });

    if (path[0] === '/') path = path.slice(1);

    let search;
    const index = path.indexOf('?');
    if (index !== -1) {
      search = path.slice(index + 1);
      path = path.slice(0, index);
    }

    const pathArray = path.split('/');
    const result = {};
    const {length} = routeArray;
    for (let i = 0; i < length; i++) {
      const item = routeArray[i];
      const param = indexParams[i];
      if (param)
        result[param] = pathArray[i];
      else if (item !== pathArray[i])
        return null
    }

    if (!search) return result

    const searchPairs = search.split('&');
    for (let pair of searchPairs) {
      const index = pair.indexOf('=');
      if (index === -1) continue
      const key = pair.slice(0, index);
      if (result.hasOwnProperty(key)) continue
      result[key] = decodeURIComponent(pair.slice(index + 1));
    }

    return result
  }

  return match;

})));
