import React, { Component } from 'react';
import makeApiHandler from './makeApiHandler';

const WikiApiHandler = makeApiHandler();

class WikiArticle extends Component {
	constructor(props) {
		super(props);
		this.state = {
			title: 'Loading...',
			summary: 'Aenean lacinia bibendum nulla sed consectetur.',
			image: '',
			callbackPosition: undefined
		};
	}

	componentWillMount() {
		/*
		 * define a globally accessible callback method Wiki API Handler is able
		 * to call to be able to update this component's state when JSONP request
		 * completes
		 */
		const callback = (response) => {
			this.setState({
				title: response.title,
				//summary: response.text,
				image: response.image
			})
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

	render() {
		return (
			<div className="WikiArticle">
				<h2>{this.state.title}</h2>
				<p>{this.state.summary}</p>
				<img src={this.state.image} />
			</div>
		);
	}
}

export default WikiArticle;
