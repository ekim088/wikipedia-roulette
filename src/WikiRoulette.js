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
				<WikiArticle />
			</div>
		);
	}
}

export default WikiRoulette;
