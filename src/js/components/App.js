import React, { Component } from 'react'
import PostList from './PostList'
import CreatePost from './CreatePost'
import Search from './Search'
import Header from './Header'
import Sidebar from './Sidebar'
import Login from './Login'
import Logout from './Logout'
import Outbound from './Outbound'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

class App extends Component {
	render() {
		return (
			<BrowserRouter>
				<div>
					<Header />
					<Sidebar />
					<div>
						<Switch>
							<Route exact path='/' component={PostList} />
							<Route path='/create' component={CreatePost} />
							<Route path='/search' component={Search} />
							<Route path='/login' component={Login} />
							<Route path='/logout' component={Logout} />
							<Route path='/-/:slug' component={Outbound} />
						</Switch>
					</div>
				</div>
			</BrowserRouter>
		)
	}
}

export default App
