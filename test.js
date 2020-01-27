const route = require('./route-maker')
const match = require('./match')
const assert = require('assert')
let path

// basic behaviour
path = '/some/:entity_type/entity/:id'
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

// url
assert.strictEqual(route('path', {url: 'http://example.com'})(), 'http://example.com/path')
assert.strictEqual(route('path', {url: 'http://example.com:3000'})({3000: 'value'}), 'http://example.com:3000/path?3000=value')

// prefix
assert.strictEqual(route('path', {prefix: 'prefix'})(null), '/prefix/path')
assert.strictEqual(route('path', {prefix: 'prefix', prependSlash: false})(null), 'prefixpath')
assert.strictEqual(route('path')(null, {prefix: 'prefix'}), '/prefix/path')
assert.strictEqual(route('path')(null, {prefix: 'prefix', prependSlash: false}), 'prefix/path')

const apiRoute = route.config({prefix: 'api'})
assert.strictEqual(apiRoute('path')(), '/api/path')

// url and prefix
assert.strictEqual(route('path', {url: 'url', prefix: 'prefix'})(), 'url/prefix/path')

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

// test match
assert.deepEqual(match(route('path').path, '/path'), {})
assert.deepEqual(match('first/:a/second/:b/third', '/path'), null)
assert.deepEqual(
  match('first/:a/second/:b/third', 'first/12/second/shmyak/third'),
  {a: '12', b: 'shmyak'}
)

assert.deepEqual(
  match('first/:a/second/:b/third', '/first/12/second/shmyak/third?a=34&param=pampam'),
  {a: '12', b: 'shmyak', param: 'pampam'}
)
