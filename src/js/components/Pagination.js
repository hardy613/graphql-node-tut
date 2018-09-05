import React, { Component } from 'react'
import { POSTS_PER_PAGE } from '../constants'
import ReactRouterPropTypes from 'react-router-prop-types'
import PropTypes from 'prop-types'

class Pagination extends Component {

	static propTypes = {
		history: ReactRouterPropTypes.history.isRequired,
		match: ReactRouterPropTypes.match.isRequired,
		pagePrefix: PropTypes.string.isRequired,
		count: PropTypes.number.isRequired,
	}

	_nextPage = count => {
		const page = parseInt(this.props.match.params.page || 1, 10)
		if (page < count / POSTS_PER_PAGE) {
			this.props.history.push(`${this.props.pagePrefix}${page + 1}`)
		}
	}

	_previousPage = () => {
		const page = parseInt(this.props.match.params.page || 1, 10)
		if (page > 1) {
			this.props.history.push(`${this.props.pagePrefix}${page - 1}`)
		}
	}

	_gotoPage = (page = 1) => {
		this.props.history.push(`${this.props.pagePrefix}${page}`)
	}

	_buildPageButtons = pages => {
		const page = parseInt(this.props.match.params.page || 1, 10)
		let html = []
		let buildPages = [1]

		if(page - 1 > 2 && pages >= 4) {
			buildPages.push('...')
		}

		if(page - 1 > 0 && !buildPages.includes(page - 1)) {
			buildPages.push(page - 1)
		}

		if(!buildPages.includes(page)) {
			buildPages.push(page)
		}

		if(page + 1 <= pages) {
			buildPages.push(page + 1)
		}

		if(pages - page > 2 && pages >= 4) {
			buildPages.push('...')
		}

		if(!buildPages.includes(pages)) {
			buildPages.push(pages)
		}

		return buildPages.map((value, index) => {
			const element = value === '...' ? (
				<span>{value}</span>
			) : (
				<a role='button'
					className='btn'
					onClick={() => this._gotoPage(value)}
				>{value}</a>
			)

			return (
				<li key={index} className={'page-item' + (value === page ? ' active':'')}>
					{element}
				</li>	
		)})
	}

	render() {
		const { count } = this.props
		const pages = Math.ceil(count / POSTS_PER_PAGE)
		return pages > 1 && (
			<ul className='pagination'>
				<li className='page-item'>
					<button className='btn' onClick={this._previousPage}>previous</button>
				</li>
				{this._buildPageButtons(pages)}
				<li className='page-item'>
					<button className='btn' onClick={() => this._nextPage(count)}>next</button>
				</li>
			</ul>
		)
	}
}

export default Pagination
