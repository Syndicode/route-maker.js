const routeMatchRegexp = /:([^/]+)/g

const createRouteFunction = (basePath, paramNames, hasParams) => (params) => {
  if (!params) return basePath

  let path = basePath
  paramNames.forEach((paramName) => {
    path = path.replace(`:${paramName}`, params[paramName])
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

const bindOptions = (options) => {
  const result = (path) => {
    let result
    if (typeof path === 'string') {
      const paramNames = []
      const hasParams = {}

      if (options.prependSlash && path[0] !== '/') path = '/' + path

      for (const match of path.matchAll(routeMatchRegexp)) {
        const paramName = match[1]
        paramNames.push(paramName)
        hasParams[paramName] = true
      }
      result = createRouteFunction(path, paramNames, hasParams)
    } else result = path

    if (options.assign) Object.assign(result, options.assign)

    return result
  }
  result.options = options
  result.config = extendRouteBuilder
  return result
}

function extendRouteBuilder(options = {}) {
  return bindOptions(Object.assign({}, this.options, options))
}

const route = bindOptions({prependSlash: true})

export default route
