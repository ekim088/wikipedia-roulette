import React, { Component } from 'react';
import './WikiArticle.css';
import { WikiApiHandler } from './makeApiHandler';
import defaultImg from './default-article-image.jpg';

class WikiArticle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: '',
			summary: '',
			image: defaultImg,
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
				this.parseArticleHtml(response.htmlStr);
			}
		};
		let callbackPosition;

		// push callback to global array
		callbackPosition = WikiApiHandler.articleCallbacks.length;
		this.setState({ callbackPosition: WikiApiHandler.articleCallbacks.length });
		WikiApiHandler.articleCallbacks.push(callback);

		// initiate call to API
		WikiApiHandler.getArticleFromComponent(callbackPosition);
	}

	/**
	 * Parses HTML string of Wikipedia content to fit customized format.
	 * 
	 * @param {string} htmlStr 
	 */
	parseArticleHtml(htmlStr) {
		/**
		 * Parses DOM element for summary content.
		 * 
		 * @param {Element} el Element containing article content
		 */
		const parseHtmlForSummary = (el) => {
			// max length of summary content
			const lengthMax = 300;

			if (typeof el !== 'object') {
				console.log(`[WikiArticle] Invalid object - 
					could not parse article content for summary`);
				return;
			}

			// parse HTML content for article summary
			// currently just grabs first paragraph contents
			console.log(`[WikiArticle] Parsing article content for summary`);
			let firstPar = el.querySelector('p:not(.mw-empty-elt)');

			if (firstPar) {
				let summaryStr = firstPar.innerText.length > lengthMax ?
					firstPar.innerText.slice(0, lengthMax) + '...' :
					firstPar.innerText;

				// update article with summary
				this.setState({ summary: summaryStr });
			}
		};

		/**
		 * Parses DOM element for image content.
		 * 
		 * @param {Element} el Element containing article content
		 */
		const parseHtmlForImage = (el) => {
			const dimensionThreshold = 39999;
			let images = html.querySelectorAll('img');

			if (typeof el !== 'object') {
				console.log(`[WikiArticle] Invalid object - 
					could not parse article content for image`);
				return;
			}

			console.log(`[WikiArticle] Parsing article content for image`);

			// search image for one large enough to use as main article graphic
			// compares images dimensions against a threshold
			for (let image of images) {
				let height = image.getAttribute('height');
				let width = image.getAttribute('width');

				if (height && width && (height * width) > dimensionThreshold) {
					// update article with image
					let src = image.getAttribute('src');
					console.log(`[WikiArticle] Using ${src} as image for ${this.state.title}`);
					this.setState({ image: src });
					return;
				}
			}

			// if image not found in article, call Wikipedia API to attempt to grab a related image
			if (typeof this.state.title !== 'undefined' && 
				typeof this.state.callbackPosition !== 'undefined') {
				WikiApiHandler.getImageFromComponent(this.state.title, this.state.callbackPosition);
			}
		};

		// create element with HTML string contents
		let html = document.createElement('div');
		html.innerHTML = htmlStr;

		// parse contents
		parseHtmlForSummary(html);
		parseHtmlForImage(html);

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
