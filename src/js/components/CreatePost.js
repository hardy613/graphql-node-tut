import React, { Component } from 'react'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const POST_MUTATION = gql`
	mutation PostMutation($description: String!, $url: String!) {
		post(description: $description, url: $url) {
			id
			createdAt
			url
			description
			slug
		}
	}
`

class CreatePost extends Component {

	state = {
		description: '',
		url: '',
	}
	
	render() {
		const { description, url } = this.state
		return (
			<div>
				<div className='form-group'>
					<label className='form-label'>Title</label>
					<input
						value={description}
						onChange={e => this.setState({ description: e.target.value })}
						type='text'
						placeholder='Your title for the link'
						/>
				</div>
				<div className='form-group'>
					<label className='form-label'>Uniform Resource Locator</label>
					<input
						value={url}
						onChange={e => this.setState({ url: e.target.value })}
						type='text'
						placeholder='https://example.com'
						/>
				</div>
				<div className='form-group'>
					<Mutation
						mutation={POST_MUTATION}
						variables={{ description, url }}
						onCompleted={() => this.props.history.push('/')}
						>
						{postMutation => <button className='btn btn-primary' onClick={postMutation}>Submit</button>}
					</Mutation>
				</div>
			</div>
		)
	}
}

export default CreatePost
