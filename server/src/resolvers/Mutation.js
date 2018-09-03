const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId, isUrl, hash } = require('../utils')
const { MAX_SHORT_URL_LENGTH, APP_SECRET } = require('../constants')
const moment= require('moment')

async function signup(parent, args, context) {
	const password = await bcrypt.hash(args.password, 10)
	const user = await context.db.mutation.createUser({
		data: { ...args, password },
	}, '{ id }')

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
		token,
		user,
	}
}

async function login(parent, {email, password}, context) {
	const user = await context.db.query.user({ where: { email } }, ' { id password } ')
	if (!user) {
		throw new Error('No such user found')
	}

	const valid = await bcrypt.compare(password, user.password)
	if (!valid) {
		throw new Error('Invalid password')
	}

	const token = jwt.sign({ userId: user.id }, APP_SECRET)

	return {
		token,
		user,
	}
}

async function post(parent, args, context, info) {
	let {
		url = '',
		description = '',
		title = '',
		views = 1,
	} = args
	url = url.trim()
	description = description.trim()
	title = title.trim()
	if(!isUrl(url)) {
		throw new Error('Invaild url')
	}
	const userId = getUserId(context)
	const slug = hash(`${moment().millisecond() + url}`, MAX_SHORT_URL_LENGTH)
	return context.db.mutation.createPost(
		{
			data: {
				url,
				title,
				description,
				slug,
				views,
				postedBy: { connect: { id: userId } },
			},
		},
		info,
	)
}

async function vote(parent, {postId}, context, info) {
	const userId = getUserId(context)
	const postExists = await context.db.exists.Vote({
		user: { id: userId },
		post: { id: postId },
	})
	if (postExists) {
		throw new Error(`Already voted for post: ${postId}`)
	}

	return context.db.mutation.createVote(
		{
			data: {
				user: { connect: { id: userId } },
				post: { connect: { id: postId } },
			},
		},
		info,
	)
}

async function viewPost(parent, {id, views}, context) {
	if (!id) {
		throw new Error('An id is required')
	}
	const postExists = await context.db.exists.Post({
		id
	})
	if (!postExists) {
		throw new Error(`Could not find post for ${id}`)
	}
	return context.db.mutation.updatePost({
		where: { id, },
		data: { views },
	})
}

module.exports = {
	signup,
	login,
	post,
	vote,
	viewPost,
}
