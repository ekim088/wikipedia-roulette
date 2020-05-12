import WikiRoulette from '../../components/WikiRoulette';
import { wikipediaHandlerTestUtil } from '../mocks';

describe('WikiRoulette', () => {
	let container;

	beforeEach(() => {
		container = document.createElement('div');
		document.body.appendChild(container);
		wikipediaHandlerTestUtil.mock();
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
