import route from './route-maker.js'
import assert from 'assert'

const path = '/some/:entity_type/entity/:id'
let url = route(path)

assert.strictEqual(url({entity_type: 'ice_cream', id: 123}), '/some/ice_cream/entity/123')
assert.strictEqual(url(), path)

// adds slash by default
assert.strictEqual(route('path')(), '/path')

// uri params
assert.strictEqual(route('path')({a: 1, b: 2}), '/path?a=1&b=2')

// set configuation
const routeProperties = {key: 'value'}
const extendedRoute = route.config({assign: routeProperties})

url = extendedRoute(path)
assert.strictEqual(url.key, 'value')
