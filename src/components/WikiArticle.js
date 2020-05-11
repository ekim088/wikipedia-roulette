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

/**
 * Renders the article.
 * @param {Object} article Article summary.
 * @returns {string} Article markup.
 */
const renderArticle = ({
	description,
	externalUrl,
	id,
	image,
	summary,
	title
}: Article) => {
	const titleId: ?string = id ? `${id}-title` : null;
	const summaryId: ?string = id ? `${id}-summary` : null;

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
				<a href={externalUrl} target="_blank" rel="noopener noreferrer">
					Test Link
				</a>
			</div>
		</>
	);
};

/**
 * Renders the article loading state.
 * @returns {string} Article loading state markup.
 */
const renderLoadingState = () => <div>Loading...</div>;

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
	const [summary, setSummary] = useState(summaryProp);
	const [title, setTitle] = useState(titleProp);
	const [loaded, setLoaded] = useState(!!(id && title && description));

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
				setLoaded(true);

				// apply article data to shared state
				dispatchArticle({
					title: responseTitle,
					description: responseDesc
				});
			}

			if (!loaded) {
				fetchArticle();
			}
		},
		/**
		 * See {@link https://github.com/facebook/create-react-app/issues/6880 Github}
		 * for discusson on non-empty dependency array.
		 */
		[dispatchArticle, loaded]
	);

	return (
		<article className="wa" data-id={id}>
			{loaded
				? renderArticle({
						description,
						externalUrl,
						id,
						image,
						summary,
						title
				  })
				: renderLoadingState()}
		</article>
	);
};

const mapStateToProps = () => ({});
const mapDispatchToProps = dispatch => ({
	dispatchArticle: (data: SharedArticle): void => dispatch(addArticle(data))
});

export default connect(mapStateToProps, mapDispatchToProps)(WikiArticle);
