import React, { Component } from 'react'
import PostList from './PostList'
import CreatePost from './CreatePost'
import Search from './Search'
import Header from './Header'
import Login from './Login'
import Logout from './Logout'
import Outbound from './Outbound'
import { Switch, Route, Redirect } from 'react-router-dom'

class App extends Component {
	componentDidMount() {
		document.getElementById('body').style.marginTop =
			`${document.getElementById('site-header').offsetHeight}px`
	}

	render() {
		return (
			<div>
				<Header />
				<div id='body' className='container grid-lg'>
					<Switch>
						<Route exact path="/" render={() => <Redirect to="/new" />} />
						<Route path='/new/:page?' component={PostList} />
						<Route path='/top' component={PostList} />
						<Route path='/create' component={CreatePost} />
						<Route path='/search' component={Search} />
						<Route path='/login' component={Login} />
						<Route path='/logout' component={Logout} />
						<Route path='/-/:slug' component={Outbound} />
					</Switch>
				</div>
			</div>
		)
	}
}

export default App
