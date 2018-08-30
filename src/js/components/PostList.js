import React, { Component } from 'react'
import Post from './Post'
import { Query } from 'react-apollo'
import gql from 'graphql-tag'
const FEED_QUERY = gql`
	{
		feed {
			posts {
				id
				createdAt
				url
				description
				slug
				postedBy {
					id
					name
				}
				votes {
					id
					user {
						id
					}
				}
			}
		}
	}
`

class PostList extends Component {
	render() {
		return (
			<Query query={FEED_QUERY}>
				{({ loading, error, data }) => {
					if (loading) {
						return <div>Fetching</div>
					}

					if (error) {
						return <div>Error</div>
					}

					const { posts } = data.feed

					return (
						<div>
							{posts.map((post, index ) => <Post key={post.id} post={post} index={index} />)}
						</div>
					)
				}}
			</Query>
		)
	}
}

export default PostList
