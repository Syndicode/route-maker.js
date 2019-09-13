const routeMatchRegexp = /:([^/]+)/g

const mergeSettings = (outerSettings, innerSettings) => {
  if (innerSettings) return Object.assign({}, outerSettings, innerSettings)
  else return outerSettings
}

const prependSlash = (path, settings) => settings.prependSlash && path[0] !== '/' ? '/' + path : path

const createRouteFunction = (basePath, paramNames, hasParams, outerSettings) => (...args) => {
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

  if (settings.prefix) path = prependSlash(settings.prefix, settings) + path

  if (!params) return path

  paramNames.forEach((paramName, i) => {
    const value = i < paramsI ? args[i] : params[paramName]
    path = path.replace(`:${paramName}`, value)
  })

  let questionSign = false
  for (const paramName in params) {
    if (!hasParams[paramName]) {
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

const bindOptions = (outerOptions) => {
  const result = (path, innerOptions) => {
    let result, settings = mergeSettings(outerOptions, innerOptions)

    if (typeof path === 'string') {
      const paramNames = []
      const hasParams = {}

      path = prependSlash(path, settings)

      for (const match of path.matchAll(routeMatchRegexp)) {
        const paramName = match[1]
        paramNames.push(paramName)
        hasParams[paramName] = true
      }
      result = createRouteFunction(path, paramNames, hasParams, settings)
    } else result = path

    if (settings.assign) Object.assign(result, settings.assign)

    return result
  }
  result.options = outerOptions
  result.config = extendRouteBuilder
  return result
}

function extendRouteBuilder(options = {}) {
  return bindOptions(Object.assign({}, this.options, options))
}

const route = bindOptions({prependSlash: true})

export default route
