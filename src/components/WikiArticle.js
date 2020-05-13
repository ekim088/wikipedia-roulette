// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import trim from '../utils/trim';
import getArticleSummary from '../utils/wikipediaHandler';
import type { ArticleResponse } from '../utils/wikipediaHandler';
import '../scss/_WikiArticle.scss';
import defaultImg from '../default-article-image.jpg';

import addArticle from '../actions/addArticle';

// flow types
type Article = {
	description: ?string,
	externalUrl?: string,
	id: ?string,
	image?: string,
	summary: ?string,
	title: ?string
};

export type SharedArticle = {
	title: ?string,
	description: ?string
};

export type Props = {
	...Article,
	callback?: SharedArticle => any,
	dispatchArticle?: SharedArticle => void
};

type State = {
	...Article,
	isLoaded: boolean
};

/**
 * Parses raw article summary response to format consumable by Component.
 * @param {Object} summaryResponse Article summary response.
 * @returns {Object} Parsed article data.
 */
export const parseArticleSummary = ({
	content_urls: contentUrls,
	description,
	extract,
	pageid,
	thumbnail: { source } = {},
	title
}: ArticleResponse): Article => ({
	description,
	externalUrl:
		(contentUrls && contentUrls.desktop && contentUrls.desktop.page) || '',
	id: pageid,
	image: source || defaultImg,
	summary: extract,
	title
});

class WikiArticle extends Component<Props, State> {
	static defaultProps = {
		callback: undefined,
		externalUrl: undefined,
		dispatchArticle: undefined,
		image: undefined
	};

	constructor(props: Props) {
		super(props);

		const { description, externalUrl, id, image, summary, title } = props;
		this.state = {
			description,
			externalUrl,
			id,
			image,
			summary,
			title,
			isLoaded: !!(id && title && description && summary)
		};
	}

	async componentDidMount() {
		const { callback, dispatchArticle } = this.props;
		const { isLoaded } = this.state;

		// fetch Wikipedia article and update state if data not available
		if (!isLoaded) {
			await this.fetchArticle();
		}

		// apply article data to shared state
		const { title, description } = this.state;
		const sharedArticleData = { title, description };

		if (typeof dispatchArticle === 'function') {
			dispatchArticle(sharedArticleData);
		}

		// perform post-mount callback
		if (typeof callback === 'function') {
			callback(sharedArticleData);
		}
	}

	async fetchArticle() {
		const response = await getArticleSummary();
		const article: Article = { ...parseArticleSummary(response) };

		// update state with article data
		this.setState({
			...article,
			isLoaded: true
		});
	}

	render() {
		const {
			description,
			externalUrl,
			id,
			image,
			isLoaded,
			summary,
			title
		} = this.state;
		const summaryId: ?string = id ? `summary-${id}` : null;
		const titleId: ?string = id ? `title-${id}` : null;

		return (
			<article
				className={`wa${isLoaded ? '' : ' loading'} style-0`}
				data-id={id}
			>
				<div className={`wa-header${image ? ' has-image' : ''}`}>
					{image && (
						<div
							className="wa-img"
							style={{ backgroundImage: `url('${image}')` }}
							role="img"
							aria-labelledby={titleId}
							aria-describedby={summaryId}
						/>
					)}
					<div className="wa-header-content">
						{title && <h2 className="wa-title">{trim(title, 50)}</h2>}
						{description && (
							<h3 className="wa-description">{trim(description, 100)}</h3>
						)}
					</div>
				</div>
				<div className="wa-content">
					{summary && (
						<p className="wa-summary" id={summaryId}>
							{trim(summary, 250)}
						</p>
					)}
					<a href={externalUrl} target="_blank" rel="noopener noreferrer">
						Test Link
					</a>
				</div>
			</article>
		);
	}
}

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
	dispatchArticle: (data: SharedArticle): void => dispatch(addArticle(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(WikiArticle);
