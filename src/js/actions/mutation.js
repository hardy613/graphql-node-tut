import gql from 'graphql-tag'
import { POST_FRAGMENT } from './fragments/post'

const POST_MUTATION = gql`
	${POST_FRAGMENT}
	mutation PostMutation($description: String!, $url: String!, $title: String!) {
		post(description: $description, url: $url, title: $title) {
			... postFragment
		}
	}
`

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

const VOTE_MUTATION = gql`
	mutation VoteMutation($postId: ID!) {
		vote(postId: $postId) {
			id
			post {
				votes {
					id
					user {
						id
					}
				}
			}
			user {
				id
			}
		}
	}
`

const UPLOAD_FILE_MUTATION = gql`
  mutation uploadMutation($file: Upload!) {
    singleFile(file: $file) {
			id
		}
  }
`

export {
	POST_MUTATION,
	SIGNUP_MUTATION,
	LOGIN_MUTATION,
	VOTE_MUTATION,
	UPLOAD_FILE_MUTATION,
}
