// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import trim from '../utilities/trim';
import getArticleSummary from '../utilities/wikipediaHandler';
import '../scss/_WikiArticle.scss';
import defaultImg from '../default-article-image.jpg';

import addArticle from '../actions/addArticle';

// flow types
type Article = {
	description: ?string,
	externalUrl: ?string,
	id: ?string,
	image: ?string,
	summary: ?string,
	title: ?string
};

type ArticleResponse = {
	content_urls: {
		desktop: {
			page: ?string
		},
		mobile: {
			page: ?string
		}
	},
	description: ?string,
	extract: ?string,
	pageid: ?string,
	thumbnail: { source: ?string },
	title: ?string
};

export type SharedArticle = {
	title: ?string,
	description: ?string
};

type Props = {
	dispatchArticle: SharedArticle => void
};

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
	content_urls: contentUrls,
	description,
	extract,
	pageid,
	thumbnail: { source } = {},
	title
}: ArticleResponse): Article => ({
	description,
	externalUrl: contentUrls ? contentUrls.desktop.page : '',
	id: pageid,
	image: source || defaultImg,
	summary: extract,
	title
});

const renderLoadingState = () => <div>Loading...</div>;

class WikiArticle extends Component<Props, State> {
	constructor(props: Props) {
		super(props);
		this.state = {
			description: null,
			externalUrl: null,
			id: null,
			image: null,
			loaded: false,
			summary: null,
			title: null
		};
	}

	async componentDidMount() {
		const { dispatchArticle } = this.props;

		// fetch Wikipedia article and update state
		const articleSummary: ArticleResponse = await getArticleSummary();
		const article: Article = { ...parseArticleSummary(articleSummary) };
		const { title, description } = article;

		// apply article data to state
		this.setState({
			...article,
			loaded: true
		});

		// apply article data to shared state
		dispatchArticle({ title, description });
	}

	renderArticle() {
		const { description, externalUrl, id, image, summary, title } = this.state;
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
					<a href={externalUrl}>Test Link</a>
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

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
	dispatchArticle: data => dispatch(addArticle(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(WikiArticle);
