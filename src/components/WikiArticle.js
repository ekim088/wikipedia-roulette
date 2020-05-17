// @flow
import * as React from 'react';
import { Component } from 'react';
import { connect } from 'react-redux';
import trim from '../utils/trim';
import getArticleSummary from '../utils/wikipediaHandler';
import type { ArticleResponse } from '../utils/wikipediaHandler';
import '../scss/_WikiArticle.scss';
import defaultImg from '../default-article-image.jpg';

import addArticle from '../actions/addArticle';

// flow types
export type Article = {
	articleId: ?string,
	description: ?string,
	externalUrl?: string,
	image?: string,
	summary: ?string,
	title: ?string
};

export type Props = {
	...Article,
	className?: string,
	dispatchArticle?: Article => void,
	forwardedRef?: React.ElementRef<any>,
	id?: string,
	onArticleLoad?: Article => void
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
	articleId: pageid,
	description,
	externalUrl:
		(contentUrls && contentUrls.desktop && contentUrls.desktop.page) || '',
	image: source || defaultImg,
	summary: extract,
	title
});

class WikiArticle extends Component<Props, State> {
	// eslint-disable-next-line react/static-property-placement
	static defaultProps = {
		className: undefined,
		externalUrl: undefined,
		dispatchArticle: undefined,
		forwardedRef: null,
		id: undefined,
		image: undefined,
		onArticleLoad: undefined
	};

	constructor(props: Props) {
		super(props);

		const {
			articleId,
			description,
			externalUrl,
			image,
			summary,
			title
		} = props;
		this.state = {
			articleId,
			description,
			externalUrl,
			image,
			summary,
			title,
			isLoaded: !!(articleId && title && description && summary)
		};
	}

	async componentDidMount() {
		const { dispatchArticle, onArticleLoad } = this.props;
		const { isLoaded } = this.state;

		// fetch Wikipedia article and update state if data not available
		if (!isLoaded) {
			await this.fetchArticle();
		}

		// apply article data to shared state
		const {
			articleId,
			description,
			externalUrl,
			image,
			summary,
			title
		} = this.state;
		const articleData = {
			articleId,
			description,
			externalUrl,
			image,
			summary,
			title
		};

		if (typeof dispatchArticle === 'function') {
			dispatchArticle(articleData);
		}

		// perform post article load callback
		if (typeof onArticleLoad === 'function') {
			onArticleLoad(articleData);
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
		const { className, forwardedRef, id } = this.props;
		const {
			articleId,
			description,
			externalUrl,
			image,
			isLoaded,
			summary,
			title
		} = this.state;
		const articleClasses = `wa style-0${isLoaded ? '' : ' loading'}${
			className ? ` ${className}` : ''
		}`;
		let descriptionId: ?string;
		let titleId: ?string;
		let accessibilityProps = {};

		if (id) {
			descriptionId = id ? `description-${id}` : null;
			titleId = id ? `title-${id}` : null;
			accessibilityProps = {
				'aria-labelledby': titleId,
				'aria-describedby': descriptionId
			};
		}

		return (
			<article
				className={articleClasses}
				data-id={articleId}
				ref={forwardedRef}
				{...(id ? { id } : {})}
			>
				<div className={`wa-header${image ? ' has-image' : ''}`}>
					{image && (
						<div
							{...accessibilityProps}
							className="wa-img"
							style={{ backgroundImage: `url('${image}')` }}
							role="img"
						/>
					)}
					<div className="wa-header-content">
						{title && (
							<h2 className="wa-title" {...(titleId ? { id: titleId } : {})}>
								{trim(title, 50)}
							</h2>
						)}
						{description && (
							<h3
								className="wa-description"
								{...(descriptionId ? { id: descriptionId } : {})}
							>
								{trim(description, 100)}
							</h3>
						)}
					</div>
				</div>
				<div className="wa-content">
					{summary && <p className="wa-summary">{trim(summary, 250)}</p>}
					<a href={externalUrl} target="_blank" rel="noopener noreferrer">
						Test Link
					</a>
				</div>
			</article>
		);
	}
}

// forward ref forwarded by redux connect wrapper to base component
const WikiArticleWithForwardedRef = React.forwardRef((props: Props, ref) => (
	<WikiArticle {...props} forwardedRef={ref} />
));

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
	dispatchArticle: (data: Article): void => dispatch(addArticle(data))
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
	forwardRef: true
})(WikiArticleWithForwardedRef);
