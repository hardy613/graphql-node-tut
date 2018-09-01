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

	const queriedPosts = await context.db.query.posts(
		{ where, skip: args.skip, first: args.first, orderBy: args.orderBy },
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
	}
}

async function getPostBySlug(parent, {slug}, context, info) {
	const posts = await context.db.query.posts(
		{ where: { slug }, first: 1, },
		info,
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
