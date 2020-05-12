/* eslint react/prefer-stateless-function: 0 */
// @flow
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Cylinder from './Cylinder';
import type { SharedArticle } from './WikiArticle';
import '../scss/_WikiRoulette.scss';

// flow types
type Props = {
	articles: ?Array<SharedArticle> // eslint-disable-line react/no-unused-prop-types
};

type State = {};

class WikiRoulette extends Component<Props, State> {
	render() {
		return (
			<div className="WikiRoulette">
				<div className="backdrop" />
				<pre>{JSON.stringify(this.props)}</pre>
				<Cylinder />
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
