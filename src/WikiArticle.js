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

	render() {
		return (
			<div className="WikiArticle">
				<div className="content">
					<h2 className="title">{this.state.title}</h2>
					<div className="summary">{this.state.summary}</div>
				</div>
				<div
					className="graphic"
					style={{
						backgroundImage: `url('${this.state.image}')`
					}}
				>
				</div>
			</div>
		);
	}
}

export default WikiArticle;
