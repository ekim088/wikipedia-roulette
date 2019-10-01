import React, { Component } from 'react';
import { WikiApiHandler } from './WikiApiHandler';
import './dist/WikiArticle.css';
import defaultImg from './default-article-image.jpg';

/**
 * For a given character limit, trims text to the nearest word
 * and appends an ellipsis.
 * @param {string} str The string to trim.
 * @param {number} limit Character limit for text.
 * @param {boolean} appendEllipsis Whether to append an ellipsis if the original
 * 	string exceeds the requested limit.
 * @param {string} delimiter The character to trim the string at.
 * @returns {string} The trimmed string.
 */
export const trimStr = (
	str,
	limit = 500,
	appendEllipsis = true,
	delimiter = ' '
) => {
	const ellipsis = '...';
	const updatedLimit = appendEllipsis ? limit - ellipsis.length : limit;
	let updatedStr = str;

	if (str.length > updatedLimit) {
		updatedStr = str.substring(0, str.lastIndexOf(delimiter, updatedLimit));

		if (appendEllipsis) {
			updatedStr += ellipsis;
		}
	}

	return updatedStr;
};

export default class WikiArticle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			id: null,
			title: '',
			description: '',
			summary: '',
			image: defaultImg
		};
	}

	componentDidMount() {
		/**
		 * Initiate call to Wikipedia API. Supplying callback method to
		 * update Component state once API requests complete.
		 */
		WikiApiHandler.getArticleFromComponent((articleData) => {
			const updateObj = {};

			// set up object with state values to update
			for (let key in articleData) {
				if (articleData.hasOwnProperty(key) &&
					articleData[key] &&
					this.state.hasOwnProperty(key)) {
					updateObj[key] = articleData[key];
				}
			}

			// update Component state
			if (Object.keys(updateObj).length > 0) {
				this.setState(updateObj);
			}
		});
	}

	render() {
		return (
			<div className="wa">
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
							{trimStr(this.state.title, 50)}
						</h2>
						<h3 className="wa__subtitle">
							{trimStr(this.state.description, 50)}
						</h3>
						<div className="wa__summary">
							{trimStr(this.state.summary, 250)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}
