import React, { Component } from 'react'
import Post from './Post'
import { Query } from 'react-apollo'
import { FEED_QUERY } from '../actions/query'

class PostList extends Component {

	_updateCacheAfterVote = (store, createVote, postId) => {
		const data = store.readQuery({ query: FEED_QUERY })

		const votedLink = data.feed.posts.find(post => post.id === postId)
		votedLink.votes = createVote.post.votes

		store.writeQuery({ query: FEED_QUERY, data })
	}

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
						<div className='container grid-lg'>
							{posts
								.map((post, index) => <Post 
									key={post.id} 
									post={post} 
									index={index} 
									updateStoreAfterVote={this._updateCacheAfterVote}
									/>)}
						</div>
					)
				}}
			</Query>
		)
	}
}

export default PostList
