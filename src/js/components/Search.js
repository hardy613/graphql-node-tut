import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import PostItem from './PostItem'
import { FEED_SEARCH_QUERY } from '../actions/query'
import PropTypes from 'prop-types'

class Search extends Component {

	state = {
		posts: [],
		filter: ''
	}

	static propTypes = {
		client: PropTypes.object.isRequired,
	}

	render() {
		return (
			<section>
				<h1 className='h4'>search posts</h1>
				<div className='input-group'>
					<input
						id='search'
						name='search'
						className='form-input'
						placeholder='search'
						type='text'
						onChange={e => this.setState({ filter: e.target.value })}
					/>
					<button 
						onClick={() => this._executeSearch()}
						className='btn btn-primary input-group-btn'
					>search</button>
				</div>
				<div id='results'>
					{this.state.posts.length > 0 && (
						<p className='h5'>results</p>
					)}
					{this.state.posts.map((post, index) => (
						<PostItem 
							key={post.id}
							post={post}
							index={index}
							isSearch={true}
						/>
					))}
				</div>
			</section>
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
