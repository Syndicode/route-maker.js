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

assert.strictEqual(extendedRoute(path).key, 'value')

// prefix
assert.strictEqual(route('path', {prefix: 'prefix'})(null), '/prefix/path')
assert.strictEqual(route('path', {prefix: 'prefix', prependSlash: false})(null), 'prefixpath')
assert.strictEqual(route('path')(null, {prefix: 'prefix'}), '/prefix/path')
assert.strictEqual(route('path')(null, {prefix: 'prefix', prependSlash: false}), 'prefix/path')
