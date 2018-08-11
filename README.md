# Remux

A opinionated and simplified interface for [Redux](https://redux.js.org/).

## Install

```
yarn add remux
```

Install these packages too, if you haven't already:

```
yarn add redux react-redux redux-thunk immer
```

## Example

#### `data.js`

```js
import remux from 'remux'
import * as actionHandlers from './actions'
import * as reducerHandlers from './reducers'

export const { store, connect, actions } = remux({
  actions: actionHandlers,
  reducers: reducerHandlers,
  initialState: {
    message: 'Hello World!',
    user: {
      name: 'Visitor',
    },
  },
})
```

#### `actions.js`

```js
export async function loadUser({ email }, { actions }) {
  actions.setUser({
    user: await get('/users', { email }),
  })
}
```

#### `reducers.js`

```js
export async function setUser(state, { user }) {
  state.user = user
}

export async function setMessage(state, { message }) {
  state.message = message
}
```

#### `index.js`

```js
import React from 'react'
import { render } from 'react-dom'
import { Provider } from 'react-redux'

import { store } from './data'
import App from './app'

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('root')
)
```

#### `app.js`

```js
@connect(
  'message',
  'user'
)
export default class App extends Component {
  render() {
    return (
      <div>
        <h1>{this.props.message}</h1>
        <h2>Your name is {this.props.user.name}.</h2>
      </div>
    )
  }
}
```

## License

MIT
