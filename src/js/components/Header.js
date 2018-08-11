import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import { cookie } from '../utils'

class Header extends Component {
	
	static get authToken() {
		return cookie.getItem(AUTH_TOKEN)
	}
	get authToken() {
		return this.constructor.authToken
	}

	render() {
		return (
			<div>
				<div>
					<div>Link me bo</div>
					<Link to='/'>
            feed
					</Link>
					<Link to='/create'>
            submit
					</Link>
				</div>
				<div>
        {this.authToken ? (
         <Link to='/logout'> 
            logout
          </Link>
        ) : (
          <Link to='/login'>
            login
          </Link>
        )}
      </div>
			</div>
		)
	}
}

export default withRouter(Header)
