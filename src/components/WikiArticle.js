import React, { Component } from 'react';
import trim from '../utilities/trim';
import getArticleSummary from '../utilities/wikipediaHandler';
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
	thumbnail: { source } = {}
}) => ({
	id: pageid,
	title,
	description,
	summary: extract,
	image: source || defaultImg
});

const renderLoadingState = () => <div>Loading...</div>;

export default class WikiArticle extends Component {
	constructor(props) {
		super(props);
		this.state = { loaded: false };
	}

	componentDidMount() {
		// fetch Wikipedia article and update state
		getArticleSummary().then(articleSummary => {
			this.setState({
				...parseArticleSummary(articleSummary),
				loaded: true
			});
		});
	}

	renderArticle() {
		const { description, image, summary, title } = this.state;

		return (
			<>
				<div
					className="wa__img"
					style={{ backgroundImage: `url('${image}')` }}
				/>
				<div className="wa__body">
					<div className="wa__content">
						<h2 className="wa__title">{trim(title, 50)}</h2>
						<h3 className="wa__subtitle">{trim(description, 50)}</h3>
						<div className="wa__summary">{trim(summary, 250)}</div>
					</div>
				</div>
			</>
		);
	}

	render() {
		const { loaded } = this.state;

		return (
			<div className="wa">
				{loaded ? this.renderArticle() : renderLoadingState()}
			</div>
		);
	}
}
