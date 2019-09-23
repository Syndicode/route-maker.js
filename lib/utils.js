const routeMatchRegexp = /:([^/]+)/g

const mergeSettings = (outerSettings, innerSettings) => {
  if (innerSettings) return Object.assign({}, outerSettings, innerSettings)
  else return outerSettings
}

const prependSlash = (path, settings) =>
  settings.prependSlash && path && path[0] !== '/' ? '/' + path : path

const popSlash = (url) =>
  url[url.length - 1] === '/' ? url.slice(0, -1) : url

const configParams = (path, paramNames, hasParams) => {
  let match
  routeMatchRegexp.lastIndex = 0
  while ((match = routeMatchRegexp.exec(path))) {
    const paramName = match[1]
    paramNames.push(paramName)
    hasParams[paramName] = true
  }
}

module.exports = {
  mergeSettings, prependSlash, popSlash, configParams
}
