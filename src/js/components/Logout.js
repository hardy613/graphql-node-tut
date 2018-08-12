import cookies from 'doc-cookies'
import { AUTH_TOKEN } from '../constants'
import { Component } from 'react'
class Logout extends Component {
	componentDidMount() {
		cookies.removeItem(AUTH_TOKEN)
		this.props.history.push('/')
	}

	render() { return null }
}
export default Logout
