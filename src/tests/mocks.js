import * as wikipediaHandlerModule from '../utils/wikipediaHandler';

const wikipediaHandlerModuleDefault = wikipediaHandlerModule.default;

const mockWikipediaData = {
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
};

export const wikipediaHandlerTestUtil = {
	mock: () => {
		wikipediaHandlerModule.default = jest.fn(() => mockWikipediaData);
		return wikipediaHandlerModule.default;
	},
	reset: () => {
		wikipediaHandlerModule.default = wikipediaHandlerModuleDefault;
	}
};
