import React, { Component, Fragment } from 'react'
import PostItem from './PostItem'
import { Query } from 'react-apollo'
import { FEED_QUERY } from '../actions/query'
import {
	NEW_POSTS_SUBSCRIPTION,
	NEW_VOTES_SUBSCRIPTION,
} from '../actions/subscription'
import { POSTS_PER_PAGE } from '../constants'
import Pagination from './Pagination'
import ReactRouterPropTypes from 'react-router-prop-types'

class PostList extends Component {
	static propTypes = {
		location: ReactRouterPropTypes.location.isRequired,
		match: ReactRouterPropTypes.match.isRequired,
	}

	_updateCacheAfterVote = (store, createVote, postId) => {
		const isNewPage = this.props.location.pathname.includes('new')
		const page = parseInt(this.props.match.params.page || 1, 10)

		const skip = isNewPage ? (page - 1) * POSTS_PER_PAGE : 0
		const first = isNewPage ? POSTS_PER_PAGE : 100
		const orderBy = isNewPage ? 'createdAt_DESC' : null
		const data = store.readQuery({
			query: FEED_QUERY,
			variables: { first, skip, orderBy }
		})

		const votedPost = data.feed.posts.find(post => post.id === postId)
		votedPost.votes = createVote.post.votes

		store.writeQuery({ query: FEED_QUERY, data })
	}

	_subscribeToNewPosts = async subscribeToMore => {
		subscribeToMore({
			document: NEW_POSTS_SUBSCRIPTION,
			updateQuery: (prev, { subscriptionData }) => {
				if (!subscriptionData.data) return prev
				const newPost = subscriptionData.data.newPost.node

				return Object.assign({}, prev, {
					feed: {
						posts: [newPost, ...prev.feed.posts],
						count: prev.feed.posts.length + 1,
						__typename: prev.feed.__typename
					}
				})
			}
		})
	}

	_subscribeToNewVotes = subscribeToMore => {
		subscribeToMore({
			document: NEW_VOTES_SUBSCRIPTION
		})
	}

	_getQueryVariables = () => {
		const isNewPage = this.props.location.pathname.includes('new')
		const page = parseInt(this.props.match.params.page || 1, 10)
		const skip = isNewPage ? (page - 1) * POSTS_PER_PAGE : 0
		const first = isNewPage ? POSTS_PER_PAGE : 100
		const orderBy = isNewPage ? 'createdAt_DESC' : null
		return { first, skip, orderBy }
	}

	_getPostsToRender = data => {
		const isNewPage = this.props.location.pathname.includes('new')
		if (isNewPage) {
			return data.feed.posts
		}
		const rankedPosts = data.feed.posts.slice()
		rankedPosts.sort((post1, post2) => post2.votes.length - post1.votes.length)
		return rankedPosts
	}

	render() {
		return (
			<Query 
				query={FEED_QUERY}
				variables={this._getQueryVariables()}
			>
				{({ loading, error, data, subscribeToMore }) => {
					if (loading) {
						return <div>Fetching</div>
					}

					if (error) {
						return <div>Error</div>
					}

					this._subscribeToNewPosts(subscribeToMore)
					this._subscribeToNewVotes(subscribeToMore)

					const posts = this._getPostsToRender(data)
					const isNewPage = this.props.location.pathname.includes('new')
					const page = parseInt(this.props.match.params.page || 1, 10)
					const pageIndex = isNewPage ? (page - 1) * POSTS_PER_PAGE : 0
						
					return (
						<section>
							<h1 className='h4'>
								{isNewPage ? 'new posts' : 'top 100 posts'}
							</h1>
							<Fragment>
								{posts
									.map((post, index) => <PostItem 
										key={post.id} 
										post={post} 
										index={index + pageIndex} 
										isSearch={false}
										updateStoreAfterVote={this._updateCacheAfterVote}
									/>)}
								{isNewPage && (data.feed.count / POSTS_PER_PAGE > 1 ) && (
									<Pagination 
										{...this.props}
										count={data.feed.count}
										pagePrefix='/new/'
									/>
								)}
							</Fragment>
						</section>
					)
				}}
			</Query>
		)
	}
}

export default PostList
