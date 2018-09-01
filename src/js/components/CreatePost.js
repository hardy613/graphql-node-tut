import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'
import { POST_MUTATION } from '../actions/mutation'
import { FEED_QUERY } from '../actions/query'

class CreatePost extends Component {

	state = {
		title: '',
		description: '',
		url: '',
	}
	
	render() {
		const { description, url, title, image = '' } = this.state
		return (
			<div className='container'>
				<div className='form-group'>
					<label className='form-label'>Link</label>
					<input
						className='form-input'
						value={url}
						onChange={e => this.setState({ url: e.target.value })}
						type='text'
						placeholder='https://example.com'
						/>
				</div>
				<div className='form-group'>
					<label className='form-label'>Title</label>
					<input
						className='form-input'
						value={title}
						onChange={e => this.setState({ title: e.target.value })}
						type='text'
						placeholder='Give your link a title'
						/>
				</div>
				<div className='form-group'>
					<label className='form-label'>Description</label>
					<textarea
						className='form-input'
						value={description}
						onChange={e => this.setState({ description: e.target.value })}
						type='text'
						placeholder='Describe your link'
						></textarea>
				</div>
				<div className='form-group'>
					<Mutation
						mutation={POST_MUTATION}
						variables={{ title, description, url, image }}
						onCompleted={() => this.props.history.push('/')}
						update={(store, {data: { post }}) => {
							const data = store.readQuery({ query: FEED_QUERY })
							post.votes = []
							data.feed.posts.unshift(post)
							store.writeQuery({
								query: FEED_QUERY,
								data,
							})
						}}
						>
						{postMutation => <button className='btn btn-primary' onClick={postMutation}>Submit</button>}
					</Mutation>
				</div>
			</div>
		)
	}
}

export default CreatePost
