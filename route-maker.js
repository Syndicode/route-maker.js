(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global['route-maker'] = factory());
}(this, (function () { 'use strict';

  var routeMatchRegexp = /:([^/]+)/g;
  var mergeSettings = function mergeSettings(outerSettings, innerSettings) {
    if (innerSettings) return Object.assign({}, outerSettings, innerSettings);else return outerSettings;
  };
  var prependSlash = function prependSlash(path, settings) {
    return settings.prependSlash && path && path[0] !== '/' ? '/' + path : path;
  };
  var popSlash = function popSlash(url) {
    return url[url.length - 1] === '/' ? url.slice(0, -1) : url;
  };
  var configParams = function configParams(path, paramNames, hasParams) {
    var match;
    routeMatchRegexp.lastIndex = 0;

    while (match = routeMatchRegexp.exec(path)) {
      var paramName = match[1];
      paramNames.push(paramName);
      hasParams[paramName] = true;
    }
  };

  function _typeof(obj) {
    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  var routeFunction = function routeFunction(basePath, outerPrefixParamNames, outerPrefixHasParams, paramNames, hasParams, outerSettings) {
    var resolver = function resolver() {
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }

      var params,
          options,
          path = basePath,
          paramsI = args.length - 1;
      if (_typeof(args[paramsI]) === 'object') {
        if (_typeof(args[paramsI - 1]) === 'object') {
          paramsI--;
          params = args[paramsI];
          options = args[paramsI + 1];
        } else {
          params = args[paramsI];
        }
      } else if (args.length) {
        params = {};
        paramsI++;
      }
      var settings = mergeSettings(outerSettings, options);
      var url = settings.url;
      if (url) path = popSlash(url) + path;
      var prefix = settings.prefix;
      if (prefix) path = prependSlash(prefix, settings) + path;
      if (!params) return path;
      var prefixParamNames, prefixHasParams;

      if (prefix && prefix.indexOf(':') !== -1) {
        prefixParamNames = [];
        prefixHasParams = {};
        configParams(prefix, prefixParamNames, prefixHasParams);
      } else {
        prefixParamNames = outerPrefixParamNames;
        prefixHasParams = outerPrefixHasParams;
      }

      path = replaceParams(path, 0, prefixParamNames, paramsI, args, params, settings);
      path = replaceParams(path, prefixParamNames.length, paramNames, paramsI, args, params, settings);
      return addUriParams(path, params, prefixHasParams, hasParams);
    };

    resolver.path = basePath;
    return resolver;
  };

  var replaceParams = function replaceParams(path, offset, paramNames, paramsI, args, params, _ref) {
    var defaults = _ref.defaults;
    paramNames.forEach(function (paramName, i) {
      var index = i + offset;
      var value = index < paramsI ? args[index] : params[paramName];

      if (value === undefined && defaults) {
        value = defaults[paramName];
        if (typeof defaults === 'function') value = value();
      }

      if (value !== undefined) path = path.replace(":".concat(paramName), value);
    });
    return path;
  };

  var addUriParams = function addUriParams(path, params, prefixHasParams, hasParams) {
    var questionSign = false;

    for (var paramName in params) {
      if (!prefixHasParams[paramName] && !hasParams[paramName]) {
        if (!questionSign) {
          path += '?';
          questionSign = true;
        } else {
          path += '&';
        }

        path += "".concat(paramName, "=").concat(encodeURIComponent(params[paramName]));
      }
    }

    return path;
  };

  var routeBuilder = function routeBuilder(outerOptions) {
    var result = function result() {
      var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';
      var innerOptions = arguments.length > 1 ? arguments[1] : undefined;
      var result,
          settings = mergeSettings(outerOptions, innerOptions);

      if (typeof path === 'string') {
        path = prependSlash(path, settings);
        var prefix = settings.prefix;
        var prefixParamNames = [];
        var prefixHasParams = {};
        if (prefix && prefix.indexOf(':') !== -1) configParams(prefix, prefixParamNames, prefixHasParams);
        var paramNames = [];
        var hasParams = {};
        configParams(path, paramNames, hasParams);
        result = routeFunction(path, prefixParamNames, prefixHasParams, paramNames, hasParams, settings);
      } else result = path;

      if (settings.assign) Object.assign(result, settings.assign);
      return result;
    };

    result.options = outerOptions;
    result.config = configRouteBuilder;
    return result;
  };

  function configRouteBuilder() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    return routeBuilder(Object.assign({}, this.options, options));
  }

  var routeMaker = routeBuilder({
    prependSlash: true
  });

  return routeMaker;

})));
