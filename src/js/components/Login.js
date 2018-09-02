import React, { Component } from 'react'
import { AUTH_TOKEN } from '../constants'
import cookies from 'doc-cookies'
import { Mutation } from 'react-apollo'
import { SIGNUP_MUTATION, LOGIN_MUTATION } from '../actions/mutation'
import ReactRouterPropTypes from 'react-router-prop-types'

class Login extends Component {
  state = {
    login: true,
		email: '',
    password: '',
    name: '',
  }

	static propTypes = {
		history: ReactRouterPropTypes.history.isRequired
	}

  render() {
    const { login, email, password, name } = this.state
    return (
      <div className='container'>
      <p>{login ? 'Login' : 'Sign Up'}</p>
          {!login && (
						<div className='form-group'>
							<label htmlFor='name' className='form-label'>Name</label>
							<input
							id='name'
							name='name'
							className='form-input'
              value={name}
              onChange={e => this.setState({ name: e.target.value })}
              type='text'
              placeholder='Your name'
            />
					</div>
          )}
				<div className='form-group'>
					<label htmlFor='email' className='form-label'>Email</label>
          <input
						id='email'
						name='email'
						className='form-input'
            value={email}
            onChange={e => this.setState({ email: e.target.value })}
            type='email'
            placeholder='Your email address'
          />
				</div>
				<div className='form-group'>
					<label htmlFor='password' className='form-label'>Password</label>
          <input
						id='password'
						name='password'
						className='form-input'
            value={password}
            onChange={e => this.setState({ password: e.target.value })}
            type='password'
            placeholder={!login ? 'Choose a safe password' : 'Your password'}
          />
        </div>
        <div className='form-group'>
					<Mutation
						mutation={login ? LOGIN_MUTATION : SIGNUP_MUTATION}
						variables={{ email, password, name }}
						onCompleted={data => this._confirm(data)}
					>
						{mutation => (
							<button onClick={mutation} className='btn btn-primary btn-block'>
								{login ? 'login' : 'create account'}
							</button>
						)}
					</Mutation>
					<a onClick={() => this.setState({ login: !login })}>
            {login
              ? 'need to create an account?'
              : 'already have an account?'}
          </a>
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
    cookies.setItem(AUTH_TOKEN, token)
  }
}

export default Login
