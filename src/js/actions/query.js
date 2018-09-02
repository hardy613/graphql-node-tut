import gql from 'graphql-tag'
import { 
	POST_FRAGMENT, 
	POST_META_FRAGMENT,
} from './fragments/post'

const FEED_QUERY = gql`
	${POST_FRAGMENT}
	${POST_META_FRAGMENT}
	query FeedQuery(
		$first: Int
		$skip: Int
		$orderBy: PostOrderByInput
		) {
		feed (
			first: $first
			skip: $skip
			orderBy: $orderBy
			) {
			count
			posts {
				... postFragment
				... postMetaFragment
			}
		}
	}
`

const FEED_SEARCH_QUERY = gql`
	${POST_FRAGMENT}
	${POST_META_FRAGMENT}
	query FeedSearchQuery($filter: String!) {
		feed(filter: $filter) {
			posts {
				... postFragment
					... postMetaFragment
			}
		}
	}
`

export {
	FEED_QUERY,
	FEED_SEARCH_QUERY,
}
