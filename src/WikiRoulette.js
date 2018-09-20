import React, { Component } from 'react';
import logo from './logo.svg';
import './WikiRoulette.css';
import makeApiHandler from './makeApiHandler';

const WikiApiHandler = makeApiHandler()

class WikiRoulette extends Component {
	render() {
		console.log(WikiApiHandler.getArticleById());

		return (
			<div className="WikiRoulette">
				<header className="WikiRoulette-header">
					<img src={logo} className="WikiRoulette-logo" alt="logo" />
					<h1 className="WikiRoulette-title">Welcome to React</h1>
				</header>
				<p className="WikiRoulette-intro">
					To get started, edit <code>src/WikiRoulette.js</code> and save to reload.
				</p>
			</div>
		);
	}
}

export default WikiRoulette;
