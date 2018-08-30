import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import moment from 'moment'

class Post extends Component {
	render() {
		const {
			description,
			url,
			slug,
			votes,
			createdAt,
			postedBy
		} = this.props.post

		return (
			<div>
				<p>{this.props.index}</p>
				<p>{description}</p>
				<Link to={'/-/' + slug} target='_blank'>{url}</Link>
				<p><sub>{votes.length} likes | by{' '}
					{postedBy
						? postedBy.name
						: 'Unknown'}{' '}
					{moment(createdAt).fromNow()}
				</sub></p>
			</div>
		)
	}
}

export default Post
