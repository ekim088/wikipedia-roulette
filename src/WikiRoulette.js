import React, { Component } from 'react';
import logo from './logo.svg';
import './WikiRoulette.css';

class WikiRoulette extends Component {
	render() {
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
