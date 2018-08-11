import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import { cookie } from '../utils'
import { Mutation } from 'react-apollo'
import gql from 'graphql-tag'

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`

class Login extends Component {
  state = {
    login: true, // switch between Login and SignUp
    email: '',
    password: '',
    name: '',
  }

  render() {
    const { login, email, password, name } = this.state
    return (
      <div>
       <p>{login ? 'Login' : 'Sign Up'}</p>
			
        <div>
          {!login && (
            <input
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              type="text"
              placeholder="Your name"
            />
          )}
          <input
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type="text"
            placeholder="Your email address"
          />
          <input
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type="password"
            placeholder={!login ? "Choose a safe password" : "Your password"}
          />
        </div>
        <div>
			<Mutation
				mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
				variables={{ email, password, name }}
				onCompleted={data => this._confirm(data)}
			>
				{mutation => (
					<button onClick={mutation}>
						{login ? 'login' : 'create account'}
					</button>
				)}
			</Mutation>
			<button
            onClick={() => this.setState({ login: !login })}
          >
            {login
              ? 'need to create an account?'
              : 'already have an account?'}
          </button>
        </div>
      </div>
    )
  }

  _confirm = async data => {
		const { token } = this.state.login ? data.login : data.signup
		this._saveUserData(token)
		this.props.history.push('/')
  }

  _saveUserData = token => {
    cookie.setItem(AUTH_TOKEN, token)
  }
}

export default Login
