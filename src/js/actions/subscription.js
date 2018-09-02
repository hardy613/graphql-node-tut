import gql from 'graphql-tag'
import { 
	POST_FRAGMENT,
	POST_META_FRAGMENT,
} from './fragments/post'

const NEW_POSTS_SUBSCRIPTION = gql`
	subscription {
		newPost {
			node {
				id
				createdAt
				url
				title
				image
				description
				slug
				postedBy {
					id
					name
				}
				votes {
					id
					user {
						id
					}
				}
			}
		}
	}
`

const NEW_VOTES_SUBSCRIPTION = gql`
	${POST_FRAGMENT}
	${POST_META_FRAGMENT}
  subscription {
    newVote {
      node {
        id
        post {
					... postFragment
					... postMetaFragment
        }
        user {
          id
        }
      }
    }
  }
`

export {
	NEW_POSTS_SUBSCRIPTION,
	NEW_VOTES_SUBSCRIPTION,
}
