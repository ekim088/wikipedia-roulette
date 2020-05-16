import Modal from '../../components/Modal';
import ModalHeader from '../../components/ModalHeader';

describe('Modal', () => {
	const documentAddEventListenerFxn = document.addEventListener;
	const documentRemoveEventListenerFxn = document.removeEventListener;
	const windowAddEventListenerFxn = window.addEventListener;
	const windowRemoveEventListenerFxn = window.removeEventListener;
	let eventMap = {};
	const eventMapBasedListener = (event, callback) => {
		eventMap[event] = callback;
	};

	afterEach(() => {
		// reset event map for simulating bindings and events
		eventMap = {};

		// reset mocks to document and window methods
		document.addEventListener = documentAddEventListenerFxn;
		document.removeEventListener = documentRemoveEventListenerFxn;
		window.addEventListener = windowAddEventListenerFxn;
		window.removeEventListener = windowRemoveEventListenerFxn;
	});

	it('should render a modal', () => {
		const wrapper = shallow(<Modal show onHide={jest.fn()} />);
		expect(wrapper).toMatchSnapshot();
	});

	it('should render a modal with body content', () => {
		const wrapper = shallow(
			<Modal show onHide={jest.fn()}>
				This is the body content.
			</Modal>
		);
		expect(wrapper).toMatchSnapshot();
	});

	it('should have a static Header property that contains the ModalHeader component', () => {
		expect(Modal.Header).toBe(ModalHeader);
	});

	it('should render a modal with a header', () => {
		const wrapper = shallow(
			<Modal show onHide={jest.fn()}>
				<Modal.Header />
				This is the body content.
			</Modal>
		);
		expect(wrapper).toMatchSnapshot();
	});

	it('should call the onHide method on click of the close button in the modal header', async () => {
		const mockClickHandler = jest.fn();
		const wrapper = mount(
			<Modal show onHide={jest.fn()}>
				<Modal.Header closeButton />
				This is the body content.
			</Modal>
		);

		const closeButton = wrapper.find('button.wa-modal-close');
		closeButton.simulate('click');

		/**
		 * somehow wrapping expect in timeout waits for click response to occur
		 * but `act` does not?
		 */
		setTimeout(() => {
			expect(mockClickHandler).toHaveBeenCalled();
		});
	});

	it('should setup event listeners to manage modal on mount', () => {
		window.addEventListener = jest.fn();
		document.addEventListener = jest.fn();
		mount(<Modal show onHide={jest.fn()} />);
		expect(window.addEventListener).toHaveBeenCalledWith(
			'keyup',
			expect.any(Function)
		);
		expect(document.addEventListener).toHaveBeenCalledWith(
			'click',
			expect.any(Function)
		);
	});

	it('should remove event listeners to manage modal on unmount', () => {
		window.removeEventListener = jest.fn();
		document.removeEventListener = jest.fn();
		mount(<Modal show onHide={jest.fn()} />).unmount();
		expect(window.removeEventListener).toHaveBeenCalledWith(
			'keyup',
			expect.any(Function)
		);
		expect(document.removeEventListener).toHaveBeenCalledWith(
			'click',
			expect.any(Function)
		);
	});

	it('should trigger onHide function when clicking outside of the modal', () => {
		/**
		 * Setup event map to simulate document events (enzyme simulate() will
		 * not work with document events)
		 */
		document.addEventListener = jest.fn(eventMapBasedListener);
		document.removeEventListener = jest.fn();
		const mockClickHandler = jest.fn();
		const wrapper = mount(<Modal show onHide={mockClickHandler} />);

		// simulate click inside modal
		const modalNode = wrapper.find('.wa-modal').getDOMNode();
		eventMap.click({ target: modalNode });
		expect(mockClickHandler).not.toHaveBeenCalled();

		// simulate click outside modal
		const modalContainerNode = wrapper.find('.wa-modal-container').getDOMNode();
		const mockEventWithOutsideEl = { target: modalContainerNode };
		eventMap.click(mockEventWithOutsideEl);
		expect(mockClickHandler).toHaveBeenCalledWith(mockEventWithOutsideEl);
	});

	it('should trigger onHide function when pressing escape key', () => {
		/**
		 * Setup event map to simulate document events (enzyme simulate() will
		 * not work with document events)
		 */
		window.addEventListener = jest.fn(eventMapBasedListener);
		window.removeEventListener = jest.fn();
		const mockClickHandler = jest.fn();
		mount(<Modal show onHide={mockClickHandler} />);

		// simulate enter key press
		eventMap.keyup({ keyCode: 13 });
		expect(mockClickHandler).not.toHaveBeenCalled();

		// simulate escape key press
		const mockEvent = {
			keyCode: 27,
			preventDefault: jest.fn(),
			stopPropagation: jest.fn()
		};
		eventMap.keyup(mockEvent);
		expect(mockClickHandler).toHaveBeenCalledWith(mockEvent);
		expect(mockEvent.preventDefault).toHaveBeenCalled();
	});
});
