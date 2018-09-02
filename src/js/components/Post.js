import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { AUTH_TOKEN } from '../constants'
import cookies from 'doc-cookies'
import { Mutation } from 'react-apollo'
import { VOTE_MUTATION } from '../actions/mutation'

class Post extends Component {
	_getHostname(url) {
		const link = document.createElement('a')
		link.href = url
		return link.hostname
	}

	render() {
		const authToken = cookies.getItem(AUTH_TOKEN)
		const {
			title,
			description,
			image = null,
			url,
			slug,
			votes,
			createdAt,
			postedBy
		} = this.props.post
		const domain = this._getHostname(url)	
		return (
			<div className='card'>
				{!image ? '' :
					(<div className='card-image'>
						<img src={image} className='img-responsive' />
					</div>)}
				<div className='card-header'>
					<p className='card-title h5'>
						<Link to={'/-/' + slug} target='_blank'>{title}</Link>
						{' '}<span className='domain'>({domain})</span>
					</p>
					<p className='card-subtitle text-gray'>
						posted by{' '}
						{postedBy ? postedBy.name
							: 'Unknown'}{' - '}
						{moment(createdAt).fromNow()}
					</p>
				</div>
				<div className='card-body'>{description}</div>
				<div className='card-footer'>
					{authToken && (
						<Mutation 
							mutation={VOTE_MUTATION}
							variables={{ postId: this.props.post.id }}
							update={(store, { data: { vote } }) =>
								this.props.updateStoreAfterVote(store, vote, this.props.post.id)
							}
						>
							{voteMutation => (
								<p>
									<a 
										className='btn btn-primary' 
										onClick={voteMutation}>
									Like
									</a>
								</p>)}
						</Mutation>)}
					<p>
						<sub>{votes.length} likes</sub>
					</p>
				</div>
			</div>
		)
	}
}

export default Post
