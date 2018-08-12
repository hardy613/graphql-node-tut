import { Component } from 'react'
import { graphql } from 'react-apollo'

class Outbound extends Component {
	componentDidMount() { 
		const { slug } = this.props.match.params
		return fetch('http://localhost:4000', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ query: `query getPostBySlug{
						getPostBySlug(slug: "${slug}") {
							id
							views	
						}
					}
				`
			}),
		})
			.then(res => res.json())
			.then(res => res.data.getPostBySlug)
			.then(data => {
				return fetch('http://localhost:4000', {
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
					}),
				})
			})
			.then(res => res.json())
			.then(res => window.location.replace(res.data.viewPost.url))
	}

	render() {return null}
}
export default Outbound
