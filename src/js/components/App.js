import React, { Component } from 'react'
import LinkList from './LinkList'
import CreateLink from './CreateLink'
import Header from './Header'
import Login from './Login'
import Logout from './Logout'
import { Switch, Route, BrowserRouter } from 'react-router-dom'

class App extends Component {
	render() {
		return (
			<BrowserRouter>
			<div>
				<Header />
				<div>
					<Switch>
						<Route exact path='/' component={LinkList} />
						<Route path='/create' component={CreateLink} />
						<Route path='/login' component={Login} />
						<Route path='/logout' component={Logout} />
					</Switch>
				</div>
			</div>
			</BrowserRouter>
		)
	}
}

export default App
