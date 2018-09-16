const jwt = require('jsonwebtoken')
const { APP_SECRET } = require('./constants')

function getUserId(context) {
	const Authorization = context.request.get('Authorization')
	if (Authorization) {
		const token = Authorization.replace('Bearer ', '')
		const { userId } = jwt.verify(token, APP_SECRET)
		return userId
	}

	throw new Error('Not authenticated')
}

function isUrl(url = '') {
	const expression = /[-a-zA-Z0-9@:%_+.~#?&//=]{2,256}\.[a-z]{2,4}\b(\/[-a-zA-Z0-9@:%_+.~#?&//=]*)?/gi
	const regex = new RegExp(expression)
	return url.match(regex)
}

function hash(string = '', max) {
	let hash = 0
	let i = 0
	if(!string.length) return hash
	while(i < string.length) {
		hash = ((hash << 5) - hash + string.charCodeAt(i++) << 0)
	}
	hash = hash.toString(16)
	if(!max || typeof max !== 'number') {
		max = hash.length
	}
	return hash.substring(0, max)
}

function getExtension(filename) {
	return filename.split('.').pop()
}

module.exports = {
	getUserId,
	isUrl,
	hash,
	getExtension,
}
