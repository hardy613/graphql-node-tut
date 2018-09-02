import { Component } from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'

class Outbound extends Component {

	static propTypes = {
		match: ReactRouterPropTypes.match.isRequired,
	}

	componentDidMount() { 
		const { slug } = this.props.match.params
		return fetch(process.env.HTTP_URI, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: `query getPostBySlug{
						getPostBySlug(slug: "${slug}") {
							id
							views	
						}
					}
				`
			})
		})
			.then(res => res.json())
			.then(res => res.data.getPostBySlug)
			.then(data => {
				return fetch(process.env.HTTP_URI, {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ query: `mutation ViewPostMutation {
								viewPost(id: "${data.id}", views: ${data.views + 1}) {
									id
									url
									views
								}
							}				
						`
					})
				})
			})
			.then(res => res.json())
			.then(res => window.location.replace(res.data.viewPost.url))
	}

	render() { 
		return null
	}
}

export default Outbound
