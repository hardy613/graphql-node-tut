import React, { Component } from 'react'
import { Link } from 'react-router-dom'
import { withRouter } from 'react-router'

class Header extends Component {
  render() {
    return (
      <div>
        <div>
          <div>Link me bo</div>
          <Link to='/'>
            new
          </Link>
          <Link to='/create'>
            submit
          </Link>
        </div>
      </div>
    )
  }
}

export default withRouter(Header)