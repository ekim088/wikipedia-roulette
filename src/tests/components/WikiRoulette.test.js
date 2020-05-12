import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from '../../store';
import { mount } from '../enzyme';
import WikiRoulette from '../../components/WikiRoulette';
import * as wikipediaHandlerModule from '../../utils/wikipediaHandler';

describe('WikiRoulette', () => {
	const defaultWikipediaHandler = wikipediaHandlerModule.default;
	let container;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);

		wikipediaHandlerModule.default = jest.fn(() => ({
			content_urls: {
				desktop: {
					page: 'someDesktopUrl.com'
				},
				mobile: {
					page: 'someDesktopUrl.com'
				}
			},
			description: 'some description',
			extract: 'some extract',
			pageid: 'someId',
			thumbnail: {
				source: 'someimage.png'
			},
			title: 'Some Title'
		}));
	});

	afterEach(() => {
		document.body.removeChild(container);
		container = null;

		// reset mocks
		wikipediaHandlerModule.default = defaultWikipediaHandler;
	});

	it('renders without crashing', async () => {
		ReactDOM.render(
			<Provider store={configureStore()}>
				<WikiRoulette />
			</Provider>,
			container
		);

		// wait for component to finish async calls
		await act(async () => {});

		ReactDOM.unmountComponentAtNode(container);
	});

	it('renders the app', async () => {
		const wrapper = mount(
			<Provider store={configureStore()}>
				<WikiRoulette />
			</Provider>
		);

		// wait for component to finish async calls
		await act(async () => {});

		expect(wrapper).toMatchSnapshot();
	});
});
