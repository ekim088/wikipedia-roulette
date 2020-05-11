import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from '../../store';
import { mount } from '../enzyme';
import WikiArticle from '../../components/WikiArticle';

describe('WikiArticle', () => {
	it('renders without crashing', () => {
		const div = document.createElement('div');
		ReactDOM.render(
			<Provider store={configureStore()}>
				<WikiArticle id="0" title="Some Title" description="Some Description" />
			</Provider>,
			div
		);
		ReactDOM.unmountComponentAtNode(div);
	});

	it('renders an article', () => {
		const wrapper = mount(
			<Provider store={configureStore()}>
				<WikiArticle id="0" title="Some Title" description="Some Description" />
			</Provider>
		);
		expect(wrapper).toMatchSnapshot();
	});
});
