// @flow
import React, { Component } from 'react';
import trim from '../utilities/trim';
import getArticleSummary from '../utilities/wikipediaHandler';
import '../scss/_WikiArticle.scss';
import defaultImg from '../default-article-image.jpg';

// flow types
type Article = {
	id: ?string,
	title: ?string,
	description: ?string,
	summary: ?string,
	image: ?string
};

type ArticleResponse = {
	pageid: ?string,
	title: ?string,
	description: ?string,
	extract: ?string,
	thumbnail: { source: ?string }
};

type Props = {};

type State = {
	...Article,
	loaded: boolean
};

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
}: ArticleResponse): Article => ({
	id: pageid,
	title,
	description,
	summary: extract,
	image: source || defaultImg
});

const renderLoadingState = () => <div>Loading...</div>;

export default class WikiArticle extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			id: null,
			title: null,
			description: null,
			summary: null,
			image: null,
			loaded: false
		};
	}

	componentDidMount() {
		// fetch Wikipedia article and update state
		getArticleSummary().then((articleSummary: ArticleResponse): void => {
			this.setState({
				...parseArticleSummary(articleSummary),
				loaded: true
			});
		});
	}

	renderArticle() {
		const { description, id, image, summary, title } = this.state;
		const titleId: ?string = id && `${id}-title`;
		const summaryId: ?string = id && `${id}-summary`;

		return (
			<>
				<div className="wa__img-container">
					<div
						className="wa__img"
						style={{
							backgroundImage: image ? `url('${image}')` : 'none'
						}}
						role="img"
						aria-labelledby={titleId}
						aria-describedby={summaryId}
					/>
				</div>
				<div className="wa__content">
					{description && (
						<h3 className="wa__subtitle">{trim(description, 100)}</h3>
					)}
					<h2 className="wa__title" id={titleId}>
						{title && trim(title, 50)}
					</h2>
					<p className="wa__summary" id={summaryId}>
						{summary && trim(summary, 250)}
					</p>
				</div>
			</>
		);
	}

	render() {
		const { id, loaded } = this.state;

		return (
			<article className="wa" data-id={id}>
				{loaded ? this.renderArticle() : renderLoadingState()}
			</article>
		);
	}
}
