import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import Post from './Post'
import { FEED_SEARCH_QUERY } from '../actions/query'
class Search extends Component {

	state = {
		posts: [],
		filter: ''
	}

	render() {
		return (
			<div>
				<div>
					Search
					<input
						type='text'
						onChange={e => this.setState({ filter: e.target.value })}
					/>
					<button onClick={() => this._executeSearch()}>OK</button>
				</div>
				{this.state.posts.map((post, index) => (
					<Post key={post.id} post={post} index={index} />
				))}
			</div>
		)
	}

	_executeSearch = async () => {
		const { filter } = this.state
		const result = await this.props.client.query({
			query: FEED_SEARCH_QUERY,
			variables: { filter },
		})
		const posts = result.data.feed.posts
		this.setState({ posts })
	}
}

export default withApollo(Search)
