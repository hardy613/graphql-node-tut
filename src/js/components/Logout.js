import { cookie } from '../utils'
import { AUTH_TOKEN } from '../constants'
import { Component } from 'react'
class Logout extends Component {
	render() {
		cookie.removeItem(AUTH_TOKEN)
		this.props.history.push('/')
		return null
	}
}
export default Logout
