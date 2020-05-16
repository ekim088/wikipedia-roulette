import Modal from '../../components/Modal';

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

	it('should render a modal with a close button and content div', () => {
		const wrapper = shallow(<Modal show onHide={jest.fn()} />);
		expect(wrapper).toMatchSnapshot();
	});

	it('should call the onHide method on click of the close button', () => {
		const mockOnHide = jest.fn();
		shallow(<Modal show onHide={mockOnHide} />)
			.find('button')
			.simulate('click');
		expect(mockOnHide).toHaveBeenCalled();
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
		const onHide = jest.fn();
		const wrapper = mount(<Modal show onHide={onHide} />);

		// simulate click inside modal
		const modalNode = wrapper.find('.wa-modal').getDOMNode();
		eventMap.click({ target: modalNode });
		expect(onHide).not.toHaveBeenCalled();

		// simulate click outside modal
		const modalContainerNode = wrapper.find('.wa-modal-container').getDOMNode();
		const mockEventWithOutsideEl = { target: modalContainerNode };
		eventMap.click(mockEventWithOutsideEl);
		expect(onHide).toHaveBeenCalledWith(mockEventWithOutsideEl);
	});

	it('should trigger onHide function when pressing escape key', () => {
		/**
		 * Setup event map to simulate document events (enzyme simulate() will
		 * not work with document events)
		 */
		window.addEventListener = jest.fn(eventMapBasedListener);
		window.removeEventListener = jest.fn();
		const onHide = jest.fn();
		mount(<Modal show onHide={onHide} />);

		// simulate enter key press
		eventMap.keyup({ keyCode: 13 });
		expect(onHide).not.toHaveBeenCalled();

		// simulate escape key press
		const mockEvent = {
			keyCode: 27,
			preventDefault: jest.fn()
		};
		eventMap.keyup(mockEvent);
		expect(onHide).toHaveBeenCalledWith(mockEvent);
		expect(mockEvent.preventDefault).toHaveBeenCalled();
	});
});
