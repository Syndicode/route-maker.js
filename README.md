# route-maker

For defining, building and matching named routes.

Framework agnostic - just works with strings, can be used in browser and node.js.

Zero dependency, production used.

## Install
`npm install route-maker`

## Defining routes
```javascript
// routes.js of your project

import route from 'route-maker'

export default {
  root: route('/'),
  items: route('items'),
  item: route('items/:id')
}
```

## Using routes

Now in router code to get original route string, react for example:

```jsx
import routes from './routes'

<Route path={routes.item()} />
```

And for get path with *id*:

```jsx
import routes from './routes'

<Link to={routes.item({id: 123})} />
```

If param was not matched in string, it will become URI parameter:

```javascript
routes.items({search: 'phrase'}) //= '/items?search=phrase'
```

`match` method of the route:
```javascript
import route from 'route-maker'

route('path').match('path') // {}
route('path').match('wrongPath') // {}
route('path/:type/path/:id/path').match('path/type_value/path/123/path') // {type: 'type_value', b: '123'}
```

URI params are matched too, notice that `:` embedded params are stronger.
```js
import route from 'route-maker'

route(':a/:b').match('1/2?a=another_value&c=3') // {a: 'a', b: '2', c: '3'}
```

### Positional parameters

Parameters can be passed as plain arguments

```javascript
import routes from './routes'

routes.item(123) === '/items/123'
routes.item(123, {param: 'value'}) === '/items/123?param=value'
routes.item(123, {param: 'value'}, {prefix: 'api'}) === '/api/items/123?param=value'
```

Positional parameters can be used with hash-provided parameters:

```javascript
import route from 'route-maker'

const url = route('path/:one/:two')
url(1, {two: 2}) === '/path/1/2'
```

## Options with examples

Options can be set when creating and calling route.

Prefix example:
```javascript
import route from 'route-maker'

let path = route('path', {prefix: 'api'})
path() === '/api/path'
path({}, {prefix: 'api/v2'}) === '/api/v2/path'
//   ⬆ empty params as first argument, can pass null instead
```

Can be changed directly:

```javascript
import route from 'route-maker'

route.options.prefix = 'api'

const path = route('path')
path() === '/api/path'
```

Imported constructor can be extended with `config` method:

```javascript
import route from 'route-maker'

const apiRoute = route.config({prefix: 'api'})
let path = apiRoute('path')
path() === '/api/path'

let path = route('path')
path() === '/path'
```

#### Prefix and defaults example

```javascript
import route from 'route-maker'

const apiRoute = route.config({prefix: 'api/v:apiVersion', defaults: {apiVersion: 1}})
let path = apiRoute('path')
path === '/api/v1/path'

let path = apiRoute('path')
path({apiVersion: 2}) === '/api/v2/path'
```

Default values can be dynamically calculated:

```javascript
import route from 'route-maker'

let currentUser = {}
const userRoute = route.config({prefix: ':userType', defaults: {
  userType: () => currentUser.type
}})

let path = userRoute('path')

currentUser.type = 'customer'
path() === '/customer/path'

currentUser.type = 'admin'
path() === '/admin/path'
```

### Options list

`url` string, full url if needed. Parameters inside are not allowed.

`prefix` string, adds prefix to resulting strings. Parameters inside are allowed.

`prependSlash` boolean, default `true`, adds slash at the begging of path if it is absent

`assign` object, will call `Object.assign` on route instances to add them provided properties

`defaults` object, default parameters. Works with parameters in prefix. If object value is function then it will be called, result will come to url.
