import React, { Component } from 'react';
import './WikiArticle.css';
import makeApiHandler from './makeApiHandler';

const WikiApiHandler = makeApiHandler();

class WikiArticle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			summary: '',
			image: null,
			callbackPosition: null
		};
	}

	componentWillMount() {
		/*
		 * define a globally accessible callback method Wiki API Handler is able
		 * to call to be able to update this component's state when JSONP request
		 * completes
		 */
		const callback = (response) => {
			const updateObj = {};

			// set up object with state values to update
			for (let key in response) {
				if (response.hasOwnProperty(key) &&
					response[key] &&
					this.state.hasOwnProperty(key)) {
					updateObj[key] = response[key];
				}
			}

			// update Component state
			if (Object.keys(updateObj).length > 0) {
				this.setState(updateObj);
			}

			// parse article content is available
			if (response.htmlStr) {
				this.parseHtmlForSummary(response.htmlStr);
			}
		};
		let callbackPosition;

		// push callback to global array
		window.WikiApiHandler.articleCallbacks = window.WikiApiHandler.articleCallbacks || [];
		callbackPosition = window.WikiApiHandler.articleCallbacks.length;
		this.setState({ callbackPosition: window.WikiApiHandler.articleCallbacks.length });
		window.WikiApiHandler.articleCallbacks.push(callback);

		// initiate call to API
		WikiApiHandler.getArticleFromComponent(undefined, callbackPosition);
	}

	/**
	 * Parses HTML string of Wikipedia content to generate a summary.
	 * 
	 * @param {string} htmlStr 
	 */
	parseHtmlForSummary(htmlStr) {
		const lengthMax = 300;
		let html = document.createElement('div');
		let firstPar;

		// update div content with string contents
		html.innerHTML = htmlStr;

		console.log(html);
		firstPar = html.querySelector('p:not(.mw-empty-elt)');

		if (firstPar) {
			let summaryStr = firstPar.innerText.length > lengthMax ?
				firstPar.innerText.slice(0, lengthMax) + '...' :
				firstPar.innerText;

			// update article with summary
			this.setState({
				summary: summaryStr
			});
		}

		// remove ref to temp element; does this actually matter?
		html = undefined;
	}

	render() {
		return (
			<div className="WikiArticle">
				<div className="content">
					<h2 className="title">{this.state.title}</h2>
					<p className="summary">{this.state.summary}</p>
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
