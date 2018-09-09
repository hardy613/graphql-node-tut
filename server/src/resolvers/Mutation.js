const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId, isUrl, hash, getExtension } = require('../utils')
const { APP_SECRET, UPLOAD_DIR, ALLOWED_IMAGE_TYPES } = require('../constants')
const { createWriteStream } = require('fs')
var mkdirp = require('mkdirp');

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
	const userId = getUserId(context)
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
	if(!/https?:\/\//.test(url)) {
		url = `http://${url}`
	}
	const slug = hash(`${userId} + url}`)
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

async function singleFile(_, { file }, context) {
	const userId = getUserId(context)
	console.log(await file)
	const { stream, filename, mimetype, encoding } = await file;
	const extension = getExtension(filename)
	if(!ALLOWED_IMAGE_TYPES.includes(extension)) {
		throw new Error(`Image type not allowed ${extension}`)
	}
	await storeUpload({ stream, filename, userId })
	return { stream, filename, mimetype, encoding }
}

async function storeUpload ({ stream, filename, userId }) {
	const path = mkdirp(`${UPLOAD_DIR}/${userId}`)
	return new Promise((resolve, reject) =>
		stream
			.pipe(createWriteStream(`${path}/${filename}`))
			.on('error', reject)
			.on('finish', resolve)
	)
}

module.exports = {
	signup,
	login,
	post,
	vote,
	viewPost,
	singleFile,
}
