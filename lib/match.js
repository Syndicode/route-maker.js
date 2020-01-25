const buildParsed = (path) => {
  const routeArray = path.slice(1).split('/')
  const indexParams = {}
  routeArray.forEach((item, i) => {
    if (item[0] === ':')
      indexParams[i] = item.slice(1)
  })
  return {routeArray, indexParams}
}

export default function(path) {
  if (!this._match)
    this._match = buildParsed(this.path)

  const {routeArray, indexParams} = this._match

  if (path[0] === '/') path = path.slice(1)

  let search
  const index = path.indexOf('?')
  if (index !== -1) {
    search = path.slice(index + 1)
    path = path.slice(0, index)
  }

  const pathArray = path.split('/')
  const result = {}
  const {length} = routeArray
  for (let i = 0; i < length; i++) {
    const item = routeArray[i]
    const param = indexParams[i]
    if (param)
      result[param] = pathArray[i]
    else if (item !== pathArray[i])
      return null
  }

  if (!search) return result

  const searchPairs = search.split('&')
  for (let pair of searchPairs) {
    const index = pair.indexOf('=')
    if (index === -1) continue
    const key = pair.slice(0, index)
    if (result.hasOwnProperty(key)) continue
    result[key] = decodeURIComponent(pair.slice(index + 1))
  }

  return result
}