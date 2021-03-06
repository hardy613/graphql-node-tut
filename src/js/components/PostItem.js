import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'
import { 
	AUTH_TOKEN,
	UPLOAD_DIR,
} from '../constants'
import cookies from 'doc-cookies'
import { Mutation } from 'react-apollo'
import { VOTE_MUTATION } from '../actions/mutation'
import PropTypes from 'prop-types'

class PostItem extends Component {

	static propTypes = {
		updateStoreAfterVote: PropTypes.func,
		post: PropTypes.object.isRequired,
		isSearch: PropTypes.bool.isRequired,
	}

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
			image,
			url,
			slug,
			votes,
			views,
			createdAt,
			postedBy
		} = this.props.post

		const { isSearch } = this.props
		const hostname = this._getHostname(url)	
		return (
			<article className='card'>
				<header>
				{!image || !image.path ? '' :
					(<div className='card-image'>
						<a 
							target='_blank'
							href={`${UPLOAD_DIR}/${image.path}`}
							title='view in a new tab'
						>
							<img src={`${UPLOAD_DIR}/${image.path}`} className='img-responsive' />
						</a>
					</div>)}
				<div className='card-header'>
					<h2 className='card-title h5'>
						<Link 
							to={'/-?' + slug}
							target='_blank'
							title={title}>
								{title}
						</Link>
						{' '}<span className='domain text-break'>{hostname}</span>
					</h2>
					<p className='card-subtitle text-gray'>
						posted by{' '}
						{postedBy ? postedBy.name
							: 'Unknown'}{' - '}
						<span title={moment(createdAt).format()}>
							{moment(createdAt).fromNow()}
						</span>
					</p>
				</div>
				</header>
				<div className='card-body'>{description}</div>
				<footer className='card-footer'>
					{authToken && (
						<Mutation 
							mutation={VOTE_MUTATION}
							variables={{ postId: this.props.post.id }}
							update={(store, { data: { vote } }) => {
								if(typeof this.props.updateStoreAfterVote === 'function') {
									this.props.updateStoreAfterVote(store, vote, this.props.post.id)
								}
							}}
						>
							{voteMutation => !isSearch && (
								<p>
									<button 
										className='btn btn-primary' 
										onClick={voteMutation}>
									like
									</button>
								</p>)}
						</Mutation>)}
					<p>
						<sub>{votes.length} likes | {views} views</sub>
					</p>
				</footer>
			</article>
		)
	}
}

export default PostItem
