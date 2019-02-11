import React, { Component } from 'react';
import './WikiArticle.css';
import { WikiApiHandler } from './WikiApiHandler';
import defaultImg from './default-article-image.jpg';

class WikiArticle extends Component {
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

	componentWillMount() {
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

	/**
	 * For a given character limit, trims text to the nearest word
	 * and appends an ellipsis.
	 * 
	 * @param {string} str - The string to trim
	 * @param {number} limit - Character limit for text
	 * @param {boolean} appendEllipsis - Whether to append an ellipsis
	 * @param {string} delimiter - The character to trim the string at
	 * @returns {string} The trimmed string
	 */
	trimStr(str, limit = 500, appendEllipsis = false, delimiter = ' ') {
		if (appendEllipsis) {
			limit = limit - 3;
		}

		if (str.length > limit) {
			str = str.substring(0, str.lastIndexOf(delimiter, limit));

			if (appendEllipsis) {
				str += '...';
			}
		}

		return str;
	}

	render() {
		return (
			<div className="wa">
				<div
					className="wa-img"
					style={{
						backgroundImage: `url('${this.state.image}')`
					}}
				>
				</div>
				<div className="wa-body">
					<div className="wa-content">
						<h2 className="title">{this.state.title}</h2>
						<h3 className="description">{this.state.description}</h3>
						<div className="summary">
							{this.trimStr(this.state.summary, 210, true)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default WikiArticle;
