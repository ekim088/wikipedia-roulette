import WikiArticle from '../../components/WikiArticle';
import { wikipediaHandlerTestUtil } from '../mocks';

describe('WikiArticle', () => {
	let container;
	let wikipediaHandlerMock;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		wikipediaHandlerMock = wikipediaHandlerTestUtil.mock();
	});

	afterEach(() => {
		document.body.removeChild(container);
		container = null;

		// reset mocks
		wikipediaHandlerTestUtil.reset();
	});

	it('renders without crashing', async () => {
		ReactDOM.render(
			<Provider store={configureStore()}>
				<WikiArticle />
			</Provider>,
			container
		);

		// wait for component to finish async calls
		await act(async () => {});

		ReactDOM.unmountComponentAtNode(container);
	});

	it('renders an article and fetches article data from Wikipedia if not provided', async () => {
		const wrapper = mount(
			<Provider store={configureStore()}>
				<WikiArticle />
			</Provider>
		);

		// wait for component to finish async calls
		await act(async () => {});

		expect(wikipediaHandlerMock).toHaveBeenCalled();

		/**
		 * NOTE: Cannot currently test useEffect() lifecycle method. Revisit
		 * when able to capture better snapshot.
		 */
		expect(wrapper).toMatchSnapshot();
	});

	it('should not fetch article data if provided', async () => {
		const wrapper = mount(
			<Provider store={configureStore()}>
				<WikiArticle
					id="someId"
					title="Some Title"
					description="Some description"
					summary="Some summary."
				/>
			</Provider>
		);

		// wait for component to finish async calls
		await act(async () => {});

		expect(wikipediaHandlerMock).not.toHaveBeenCalled();
		expect(wrapper).toMatchSnapshot();
	});
});
