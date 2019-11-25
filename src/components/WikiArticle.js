import React, { Component } from 'react';
import trim from '../utilities/trim';
import { getArticleSummary } from '../utilities/wikipediaHandler';
import '../scss/WikiArticle.scss';
import defaultImg from '../default-article-image.jpg';

/**
 * Parses raw article summary response to format consumable by Component.
 * @param {Object} summaryResponse Article summary response.
 * @returns {Object} Parsed article data.
 */
const parseArticleSummary = ({
	pageid,
	title,
	description,
	extract,
	thumbnail: {
		source
	} = {}
}) => ({
	id: pageid,
	title,
	description,
	summary: extract,
	image: source || defaultImg
});

export default class WikiArticle extends Component {
	constructor(props) {
		super(props);
		this.state = { loaded: false };
	}

	componentDidMount() {
		// fetch Wikipedia article and update state
		getArticleSummary()
			.then(articleSummary => {
				this.setState({
					...parseArticleSummary(articleSummary),
					loaded: true
				})
			});
	}

	renderArticle() {
		return (
			<React.Fragment>
				<div
					className="wa__img"
					style={{
						backgroundImage: `url('${this.state.image}')`
					}}
				>
				</div>
				<div className="wa__body">
					<div className="wa__content">
						<h2 className="wa__title">
							{trim(this.state.title, 50)}
						</h2>
						<h3 className="wa__subtitle">
							{trim(this.state.description, 50)}
						</h3>
						<div className="wa__summary">
							{trim(this.state.summary, 250)}
						</div>
					</div>
				</div>
			</React.Fragment>
		);
	}

	renderLoadingState() {
		return (
			<div>Loading...</div>
		);
	}

	render() {
		return (
			<div className="wa">
				{this.state.loaded ? (
					this.renderArticle()
				) : (
					this.renderLoadingState()
				)}
			</div>
		);
	}
}
