const { resolve } = require('path')

const UPLOAD_DIR = resolve(__dirname, '../../uploads')
const MAX_SHORT_URL_LENGTH = 5
const APP_SECRET = process.env.APP_SECRET
const ALLOWED_IMAGE_TYPES = [
	'jpeg',
	'jpg',
	'png',
]

module.exports = {
	MAX_SHORT_URL_LENGTH,
	APP_SECRET,
	UPLOAD_DIR,
	ALLOWED_IMAGE_TYPES,
}
