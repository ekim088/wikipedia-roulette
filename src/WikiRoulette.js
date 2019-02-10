import React, { Component } from 'react';
import './WikiRoulette.css';
import WikiArticle from './WikiArticle';

class WikiRoulette extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [<WikiArticle />]
		};
	}

	appendArticle() {
		this.setState({ articles: [ ...this.state.articles, <WikiArticle />] });
	}

	render() {
		return (
			<div className="WikiRoulette" onClick={() => this.appendArticle()}>
				<div className="backdrop"></div>
				<div className="articles">
					{this.state.articles.map(article => article)}
				</div>
			</div>
		);
	}
}

export default WikiRoulette;
