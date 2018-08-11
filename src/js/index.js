import React from 'react'
import ReactDOM from 'react-dom'
import App from './components/App'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import { cookie } from './utils'
import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from './constants'
const httpLink = createHttpLink({
	uri: 'http://localhost:4000',
})

const authLink = setContext((_, { headers }) => {
	const token = cookie.getItem(AUTH_TOKEN)
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})

const client = new ApolloClient({
	link: authLink.concat(httpLink),
	cache: new InMemoryCache(),
})

ReactDOM.render(
	<ApolloProvider client={client}>
	<App />
	</ApolloProvider>,
	document.getElementById('app')
)
