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

## Node.js

As this package uses es6 export, may be problems with using it with node.js.
