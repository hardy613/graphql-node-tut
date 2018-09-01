import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'
import cookies from 'doc-cookies'

class Header extends Component {
	
	static get authToken() {
		return cookies.getItem(AUTH_TOKEN)
	}
	get authToken() {
		return this.constructor.authToken
	}

	render() {
		return (
			<header className='navbar'> 
			<section className='navbar-section'>
				<a className='btn btn-link btn-action'>
					<i className='icon icon-menu'></i>
				</a>

				<Link to='/' className='btn btn-link'>
           feed
				</Link>
				<Link to='/create' className='btn btn-link'>
           submit
				</Link>
				<Link to='/search' className='btn btn-link'>
           search
				</Link>
			</section>
			<section className='navbar-section'>
				{this.authToken ? (
					<Link to='/logout' className='btn btn-primary'>
           logout
					</Link>
				) : (
					<Link to='/login' className='btn btn-primary'>
           login
					</Link>
				)}
			</section>
			</header>
		)
	}
}

export default withRouter(Header)
