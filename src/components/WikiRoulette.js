// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import WikiArticle from './WikiArticle';
import type { SharedArticle } from './WikiArticle';
import '../scss/_WikiRoulette.scss';

// flow types
type Props = {
	articles: Array<SharedArticle> // eslint-disable-line react/no-unused-prop-types
};

type State = {
	articleComponents: Array<WikiArticle>
};

class WikiRoulette extends Component<Props, State> {
	constructor(props: Props) {
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

/**
 * See {@link https://github.com/facebook/flow/issues/7493 GitHub} for more
 * informartion on typing connect.
 */
const mapStateToProps = state => ({ ...state });
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(WikiRoulette);
