const { GraphQLServer } = require('graphql-yoga')
const { Prisma } = require('prisma-binding')
const Query = require('./resolvers/Query')
const Mutation = require('./resolvers/Mutation')
const AuthPayload = require('./resolvers/AuthPayload')
const Subscription = require('./resolvers/Subscription')
const Feed = require('./resolvers/Feed')
const { resolve, join } = require('path')
const express = require('express')

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
			secret: process.env.DB_SECRET,
			debug: process.env.DEBUG,
		}),
	}),
})

server.express.use('/uploads', express.static(join(__dirname, '../uploads')))
// eslint-disable-next-line no-console
server.start({
	getEndpoint: true,
}, () => console.log(`Server is running on ${process.env.ENDPOINT}`))

