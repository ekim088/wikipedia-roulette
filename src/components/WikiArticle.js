// @flow
import React, { useState, useEffect } from 'react';
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
	externalUrl: ?string,
	id: ?string,
	image: ?string,
	summary: ?string,
	title: ?string
};

export type SharedArticle = {
	title: ?string,
	description: ?string
};

type Props = {
	...Article,
	dispatchArticle: SharedArticle => void
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

const WikiArticle = ({
	description: descProp,
	dispatchArticle,
	externalUrl: urlProp,
	id: idProp,
	image: imgProp,
	summary: summaryProp,
	title: titleProp
}: Props) => {
	const [description, setDescription] = useState(descProp);
	const [externalUrl, setExternalUrl] = useState(urlProp);
	const [id, setId] = useState(idProp);
	const [image, setImage] = useState(imgProp);
	const [styleId] = useState(Math.floor(Math.random() * Math.floor(1)));
	const [summary, setSummary] = useState(summaryProp);
	const [title, setTitle] = useState(titleProp);
	const [isLoaded, setIsLoaded] = useState(
		!!(id && title && description && summary)
	);
	const summaryId: ?string = id ? `summary-${id}` : null;
	const titleId: ?string = id ? `title-${id}` : null;

	// fetch Wikipedia article if article data not available
	useEffect(
		() => {
			async function fetchArticle() {
				const response = await getArticleSummary();
				const {
					description: responseDesc,
					externalUrl: responseUrl,
					id: responseId,
					image: responseImg,
					summary: responseSummary,
					title: responseTitle
				}: Article = { ...parseArticleSummary(response) };

				setDescription(responseDesc);
				setExternalUrl(responseUrl);
				setId(responseId);
				setImage(responseImg);
				setSummary(responseSummary);
				setTitle(responseTitle);
				setIsLoaded(true);

				// apply article data to shared state
				dispatchArticle({
					title: responseTitle,
					description: responseDesc
				});
			}

			if (!isLoaded) {
				fetchArticle();
			}
		},
		/**
		 * See {@link https://github.com/facebook/create-react-app/issues/6880 Github}
		 * for discusson on non-empty dependency array.
		 */
		[dispatchArticle, isLoaded]
	);

	return (
		<article
			className={`wa${isLoaded ? '' : ' loading'}${` style-${styleId}`}`}
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
};

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
	dispatchArticle: (data: SharedArticle): void => dispatch(addArticle(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(WikiArticle);
