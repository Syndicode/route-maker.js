# route-maker

For named routes, framework agnostic - just works with strings.

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

## Options

Options can be set when creating and calling route.

Prefix example:
```javascript
import route from 'route-maker'

let path = route('path', {prefix: 'api'})
path() === '/api/path'
path({prefix: 'api/v2'}) === '/api/v2/path'
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
path === '/api/path'

let path = route('path')
path === '/path'
```

### Options list

`prefix` string, adds prefix to resulting strings

`prependSlash` boolean, default `true`, adds slash at the begging of path if it is absent

`assign` object, will call `Object.assign` on route instances to add them provided properties

## Node.js

As this package uses es6 export, may be problems with using it with node.js.
