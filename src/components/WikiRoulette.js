import React, { Component } from 'react';
import { connect } from 'react-redux';
import WikiArticle from './WikiArticle';
import '../scss/_WikiRoulette.scss';

class WikiRoulette extends Component {
	constructor(props) {
		super(props);
		this.state = {
			articleComponents: []
		};
	}

	componentDidMount() {
		// load initial article
		this.setState(() => ({
			articleComponents: [<WikiArticle key="0" />]
		}));
	}

	appendArticle() {
		// add new article component
		this.setState(({ articleComponents }) => ({
			articleComponents: [
				...articleComponents,
				<WikiArticle key={articleComponents.length} />
			]
		}));

		// update history component via shared state
		// ...
	}

	render() {
		const { articleComponents } = this.state;

		return (
			<div className="WikiRoulette">
				<div className="backdrop" />
				<pre>{JSON.stringify(this.props)}</pre>
				<button type="button" onClick={() => this.appendArticle()}>
					Add article
				</button>
				<div className="articles">{articleComponents.slice(0)}</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WikiRoulette);
