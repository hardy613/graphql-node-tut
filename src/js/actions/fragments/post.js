import gql from 'graphql-tag'

export const POST_META_FRAGMENT = gql`
	fragment postMetaFragment on Post {
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
`

export const POST_FRAGMENT = gql`
	fragment postFragment on Post {
		id
		createdAt
		url
		title
		description
		slug
		views
		image {
			id
			path
		}
	}
`
