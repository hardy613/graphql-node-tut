async function feed(parent, args, context) {
	const where = args.filter
		? {
			OR: [
				{ url_contains: args.filter },
				{ title_contains: args.filter },
				{ description_contains: args.filter },
			],
		}
		: {}
	const {
		orderBy = 'createdAt_DESC',
		first,
		skip
	} = args

	const queriedPosts = await context.db.query.posts(
		{
			where,
			skip,
			first, 
			orderBy
		},
		'{ id }',
	)

	const countSelectionSet = `
		{
			aggregate {
				count
			}
		}
	`
	const postsConnection = await context.db
		.query.postsConnection({}, countSelectionSet)

	return {
		count: postsConnection.aggregate.count,
		postIds: queriedPosts.map(post => post.id),
		orderBy,
	}
}

async function getPostBySlug(parent, {slug}, context) {
	const posts = await context.db.query.posts(
		{ where: { slug }, first: 1, },
		'{ id views }',
	)

	if(!posts.length) {
		throw new Error(`Could not find post with slug: ${slug}`)
	}
	return posts[0]
}

module.exports = {
	feed,
	getPostBySlug,
}
