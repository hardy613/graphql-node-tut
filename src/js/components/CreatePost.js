import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import { POST_MUTATION, UPLOAD_FILE_MUTATION } from '../actions/mutation'
import { FEED_QUERY } from '../actions/query'
import { POSTS_PER_PAGE } from '../constants'
import ReactRouterPropTypes from 'react-router-prop-types'

class CreatePost extends Component {
	state = {
		title: '',
		description: '',
		url: '',
		image: null,
	}
	
	static propTypes = {
		history: ReactRouterPropTypes.history.isRequired
	}
	
	render() {
		const { description, url, title, image = null } = this.state
		return (
			<section>
				<h1 className='h4'>create a post</h1>
				<form 
					id='create-post'
					action='#'
					method='post'
					encType='multipart/form-data'
					onSubmit={(e => e.preventDefault())}
				>
				<div className='form-group'>
					<label htmlFor='url' className='form-label'>link</label>
					<input
						id='url'
						name='url'
						className='form-input'
						value={url}
						onChange={e => this.setState({ url: e.target.value })}
						type='text'
						placeholder='https://example.com'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='title' className='form-label'>title</label>
					<input
						id='title'
						name='title'
						className='form-input'
						value={title}
						onChange={e => this.setState({ title: e.target.value })}
						type='text'
						placeholder='Give your link a title'
					/>
				</div>
				<div className='form-group'>
					<label htmlFor='image' className='form-label'>image</label>
					<Mutation
						mutation={UPLOAD_FILE_MUTATION}
						onCompleted={({singleFile: { id }} ) => this.setState({ image: id })}
					>
						{uploadMutation => (
							<input
								id='image'
								name='image'
								className='form-input'
								type='file'
								accept='image/png, image/jpeg'
								onChange={({target: {validity, files: [file]}}) =>
									validity.valid && uploadMutation({variables: {file}})
								}
							/>
						)}
				</Mutation>
				</div>
				<div className='form-group'>
					<label htmlFor='description' className='form-label'>description</label>
					<textarea
						id='description'
						name='description'
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
						onCompleted={() => this.props.history.push('/new')}
						update={(store, {data: { post }}) => {
							const first = POSTS_PER_PAGE
							const skip = 0
							const orderBy = 'createdAt_DESC'
							const variables = { first, skip, orderBy }
							const data = store.readQuery({
								query: FEED_QUERY,
								variables,
							})
							post.votes = []
							data.feed.posts.unshift(post)
							store.writeQuery({
								query: FEED_QUERY,
								data,
								variables,
							})
						}}
					>
						{postMutation => <button className='btn btn-primary' onClick={postMutation}>submit</button>}
					</Mutation>
				</div>
				</form>
			</section>
		)
	}
}

export default CreatePost
