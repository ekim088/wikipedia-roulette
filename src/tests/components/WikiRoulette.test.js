import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../../store';
import WikiRoulette from '../../components/WikiRoulette';

describe('WikiRoulette', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<Provider store={configureStore()}>
				<WikiRoulette />
			</Provider>,
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	});
});
