import React from 'react'
import ReactDOM from 'react-dom'
import { BrowserRouter } from 'react-router-dom'
import App from './components/App'
import { ApolloProvider } from 'react-apollo'
import { ApolloClient } from 'apollo-client'
import { createHttpLink } from 'apollo-link-http'
import { InMemoryCache } from 'apollo-cache-inmemory'
import cookies from 'doc-cookies'
import { setContext } from 'apollo-link-context'
import { AUTH_TOKEN } from './constants'
import { split } from 'apollo-link'
import { WebSocketLink } from 'apollo-link-ws'
import { getMainDefinition } from 'apollo-utilities'

const httpLink = createHttpLink({
	uri: process.env.HTTP_URI,
})

const authLink = setContext((_, { headers }) => {
	const token = cookies.getItem(AUTH_TOKEN)
	return {
		headers: {
			...headers,
			authorization: token ? `Bearer ${token}` : ''
		}
	}
})

const wsLink = new WebSocketLink({
	uri: process.env.WS_URI,
	options: {
		reconnect: true,
		connectionParams: {
			authToken: cookies.getItem(AUTH_TOKEN),
		}
	}
})

const link = split(
	({ query }) => {
		const { kind, operation } = getMainDefinition(query)
		return kind === 'OperationDefinition' && operation === 'subscription'
	},
	wsLink,
	authLink.concat(httpLink)
)

const client = new ApolloClient({
	link,
	cache: new InMemoryCache()
})

ReactDOM.render(
	<BrowserRouter>
		<ApolloProvider client={client}>
			<App />
		</ApolloProvider>
	</BrowserRouter>,
	document.getElementById('app')
)
