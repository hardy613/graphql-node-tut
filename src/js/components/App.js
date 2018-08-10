import React, { Component } from 'react'
import LinkList from './LinkList'
import CreateLink from './CreateLink'
import Header from './Header'
import { Switch, Route } from 'react-router-dom'

class App extends Component {
  render() {
    return (
			<div>
				<Header />
				<div>
					<Switch>
          	<Route exact path='/' component={LinkList} />
          	<Route exact path='/create' component={CreateLink} />
        	</Switch>
				</div>
			</div>
		)
  }
}

export default App