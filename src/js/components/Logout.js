import cookies from 'doc-cookies'
import { AUTH_TOKEN } from '../constants'
import { Component } from 'react'
import ReactRouterPropTypes from 'react-router-prop-types'

class Logout extends Component {

	static propTypes = {
		history: ReactRouterPropTypes.history.isRequired
	}

	componentDidMount() {
		cookies.removeItem(AUTH_TOKEN)
		this.props.history.push('/')
	}

	render() { return null }
}
export default Logout
