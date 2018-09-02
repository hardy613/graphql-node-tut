const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')
const Subscription = require('./resolvers/Subscription')
const Feed = require('./resolvers/Feed')
const { resolve } = require('path')

const resolvers = {
	Query,
	Mutation,
	AuthPayload,
	Subscription,
	Feed,
}

const server = new GraphQLServer({
	typeDefs: resolve(__dirname, 'schema.graphql'),
	resolverValidationOptions: { requireResolversForResolveType: false }, 
	resolvers,
	context: req => ({
		...req,
		db: new Prisma({
			typeDefs: resolve(__dirname, 'generated/prisma.graphql'),
			endpoint: process.env.ENDPOINT,
			secret: process.env.SECRET,
			debug: process.env.DEBUG,
		}),
	}),
})

// eslint-disable-next-line no-console
server.start(() => console.log(`Server is running on ${process.env.ENDPOINT}`))
