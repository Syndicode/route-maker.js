import {mergeSettings, prependSlash, configParams} from './utils'
import routeFunction from './route-function'

const routeBuilder = (outerOptions) => {
  const result = (path = '', innerOptions) => {
    let result, settings = mergeSettings(outerOptions, innerOptions)

    if (typeof path === 'string') {
      path = prependSlash(path, settings)

      const {prefix} = settings
      const prefixParamNames = []
      const prefixHasParams = {}
      if (prefix && prefix.indexOf(':') !== -1)
        configParams(prefix, prefixParamNames, prefixHasParams)

      const paramNames = []
      const hasParams = {}
      configParams(path, paramNames, hasParams)
      result = routeFunction(path, prefixParamNames, prefixHasParams, paramNames, hasParams, settings)
    } else result = path

    if (settings.assign) Object.assign(result, settings.assign)

    return result
  }
  result.options = outerOptions
  result.config = configRouteBuilder
  return result
}

function configRouteBuilder(options = {}) {
  return routeBuilder(Object.assign({}, this.options, options))
}

export default routeBuilder
