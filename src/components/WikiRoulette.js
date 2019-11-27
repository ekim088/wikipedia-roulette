import React, { Component } from 'react';
import WikiArticle from './WikiArticle';
import '../scss/WikiRoulette.scss';

export default class WikiRoulette extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [<WikiArticle key="0" />]
		};
	}

	appendArticle() {
		this.setState(({ articles }) => ({
			articles: [...articles, <WikiArticle key={articles.length} />]
		}));
	}

	render() {
		const { articles } = this.state;

		return (
			<div className="WikiRoulette" onClick={() => this.appendArticle()}>
				<div className="backdrop" />
				<div className="articles">{articles.slice(0)}</div>
			</div>
		);
	}
}
