import gql from 'graphql-tag'

const FEED_QUERY = gql`
	{
		feed {
			posts {
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

const FEED_SEARCH_QUERY = gql`
  query FeedSearchQuery($filter: String!) {
    feed(filter: $filter) {
      posts {
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

export {
	FEED_QUERY,
	FEED_SEARCH_QUERY,
}
