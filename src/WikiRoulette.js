import React, { Component } from 'react';
import './WikiRoulette.css';
import WikiArticle from './WikiArticle';

class WikiRoulette extends Component {
	constructor(props) {
		super(props);
		this.state = {};
	}

	render() {
		return (
			<div className="WikiRoulette">
				<div className="backdrop"></div>
				<div className="articles">
					<WikiArticle />
				</div>
			</div>
		);
	}
}

export default WikiRoulette;
