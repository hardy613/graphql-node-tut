const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { getUserId, isUrl, hash, getExtension } = require('../utils')
const { APP_SECRET, UPLOAD_DIR, ALLOWED_IMAGE_TYPES } = require('../constants')
const { createWriteStream } = require('fs')
const mkdirp = require('mkdirp')
const moment = require('moment')

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
		image = null
	} = args
	console.log(args)
	url = url.trim()
	description = description.trim()
	title = title.trim()
	if(!isUrl(url)) {
		throw new Error('Invaild url')
	}
	if(!/https?:\/\//.test(url)) {
		url = `http://${url}`
	}
	const slug = hash(`${moment().unix() + url}`)
	return context.db.mutation.createPost(
		{
			data: {
				url,
				title,
				description,
				slug,
				views,
				image: { connect: { id: image } },
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
	const { stream, filename, mimetype, encoding } = await file;
	const extension = getExtension(filename)
	if(!ALLOWED_IMAGE_TYPES.includes(extension)) {
		throw new Error(`Image type not allowed ${extension}`)
	}
	const storageName = `${moment().unix()}_${filename}`
	const path = `${userId}/${storageName}`
	await storeUpload({ stream, storageName, userId })
	return context.db.mutation.createFile({
			data: {
				path,
				filename: storageName,
				mimetype,
				encoding,
				postedBy: { connect: { id: userId } },
			},
		},
		` { id } `,
	)
}

async function storeUpload ({ stream, storageName, userId }) {
	mkdirp(`${UPLOAD_DIR}/${userId}`)
	return new Promise((resolve, reject) =>
		stream
			.pipe(createWriteStream(`${UPLOAD_DIR}/${userId}/${storageName}`))
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
