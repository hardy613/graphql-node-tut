import React, { Component } from 'react'
import { withApollo } from 'react-apollo'
import Post from './Post'
import { FEED_SEARCH_QUERY } from '../actions/query'
import PropTypes from 'prop-types'

class Search extends Component {

	state = {
		posts: [],
		filter: ''
	}

	static propTypes = {
		client: {
			query: PropTypes.func.required
		}
	}

	render() {
		return (
			<div className='container'>
				<div className='form-group'>
					<label htmlFor='search' className='form-label'>
						Search
					</label>
					<input
						id='search'
						name='search'
						className='form-input'
						type='text'
						onChange={e => this.setState({ filter: e.target.value })}
					/>
				</div>
				<div className='form-group'>
					<button 
						onClick={() => this._executeSearch()}
						className='btn btn-primary'
					>OK</button>
				</div>
				<div className='grid-lg'>
					{this.state.posts.map((post, index) => (
						<Post key={post.id} post={post} index={index} />
					))}
				</div>
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
