const route = require('./route-maker.js')
const assert = require('assert')

// basic behaviour
const path = '/some/:entity_type/entity/:id'
assert.strictEqual(route(path)({entity_type: 'ice_cream', id: 123}), '/some/ice_cream/entity/123')
assert.strictEqual(route(path)(), path)

// adds slash by default
assert.strictEqual(route('path')(), '/path')

// uri params
assert.strictEqual(route('path')({a: 1, b: 2}), '/path?a=1&b=2')

// set configuation
const routeProperties = {key: 'value'}
const extendedRoute = route.config({assign: routeProperties})

assert.strictEqual(extendedRoute('path').key, 'value')

// prefix
assert.strictEqual(route('path', {prefix: 'prefix'})(null), '/prefix/path')
assert.strictEqual(route('path', {prefix: 'prefix', prependSlash: false})(null), 'prefixpath')
assert.strictEqual(route('path')(null, {prefix: 'prefix'}), '/prefix/path')
assert.strictEqual(route('path')(null, {prefix: 'prefix', prependSlash: false}), 'prefix/path')

const apiRoute = route.config({prefix: 'api'})
assert.strictEqual(apiRoute('path')(), '/api/path')

// positional params
assert.strictEqual(route('path/:a/:b/:c')(1, 2, 3), '/path/1/2/3')
assert.strictEqual(route('path/:a/:b')(1, {b: 2}), '/path/1/2')
assert.strictEqual(route('path/:a/:b')(1, {b: 2, c: 3}), '/path/1/2?c=3')
assert.strictEqual(route('path/:a/:b')(1, {b: 2, c: 3}, {prefix: 'api'}), '/api/path/1/2?c=3')

// defaults
const defaults = {a: 1}
assert.strictEqual(route(':a')({}, {defaults}), '/1')
assert.strictEqual(route(':a', {defaults})({}), '/1')

// defaults with prefix
const prefix = ':a'
assert.strictEqual(route('')({}, {prefix, defaults}), '/1')
assert.strictEqual(route('', {prefix, defaults})({}), '/1')
