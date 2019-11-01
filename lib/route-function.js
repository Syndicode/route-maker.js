import {mergeSettings, prependSlash, popSlash, configParams} from './utils'

const routeFunction = (basePath, outerPrefixParamNames, outerPrefixHasParams, paramNames, hasParams, outerSettings) => (...args) => {
  let params, options, path = basePath, paramsI = args.length - 1

  if (typeof args[paramsI] === 'object')
    if (typeof args[paramsI - 1] === 'object') {
      paramsI--
      params = args[paramsI]
      options = args[paramsI + 1]
    } else {
      params = args[paramsI]
    }
  else if (args.length) {
    params = {}
    paramsI++
  }

  let settings = mergeSettings(outerSettings, options)

  const {url} = settings
  if (url) path = popSlash(url) + path

  const {prefix} = settings
  if (prefix) path = prependSlash(prefix, settings) + path

  if (!params) return path

  let prefixParamNames, prefixHasParams
  if (prefix && prefix.indexOf(':') !== -1) {
    prefixParamNames = []
    prefixHasParams = {}
    configParams(prefix, prefixParamNames, prefixHasParams)
  } else {
    prefixParamNames = outerPrefixParamNames
    prefixHasParams = outerPrefixHasParams
  }

  path = replaceParams(path, 0, prefixParamNames, paramsI, args, params, settings)
  path = replaceParams(path, prefixParamNames.length, paramNames, paramsI, args, params, settings)
  return addUriParams(path, params, prefixHasParams, hasParams)
}

const replaceParams = (path, offset, paramNames, paramsI, args, params, {defaults}) => {
  paramNames.forEach((paramName, i) => {
    const index = i + offset
    let value = index < paramsI ? args[index] : params[paramName]

    if (value === undefined && defaults) {
      value = defaults[paramName]
      if (typeof defaults === 'function')
        value = value()
    }

    if (value !== undefined)
      path = path.replace(`:${paramName}`, value)
  })

  return path
}

const addUriParams = (path, params, prefixHasParams, hasParams) => {
  let questionSign = false
  for (const paramName in params) {
    if (!prefixHasParams[paramName] && !hasParams[paramName]) {
      if (!questionSign) {
        path += '?'
        questionSign = true
      } else {
        path += '&'
      }
      path += `${paramName}=${encodeURIComponent(params[paramName])}`
    }
  }

  return path
}

export default routeFunction
