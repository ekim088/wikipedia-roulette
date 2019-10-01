import React, { Component } from 'react';
import WikiArticle from './WikiArticle';
import './build/WikiRoulette.css';

class WikiRoulette extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articles: [<WikiArticle key="0"/>]
		};
	}

	appendArticle() {
		this.setState({ articles: [ ...this.state.articles, <WikiArticle key={this.state.articles.length}/>] });
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
