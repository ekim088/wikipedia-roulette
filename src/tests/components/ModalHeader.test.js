import ModalHeader from '../../components/ModalHeader';

describe('ModalHeader', () => {
	it('should render a modal header', () => {
		const wrapper = shallow(<ModalHeader />);
		expect(wrapper).toMatchSnapshot();
	});

	it('should render a modal header with a close button', () => {
		const wrapper = shallow(<ModalHeader closeButton />);
		expect(wrapper).toMatchSnapshot();
	});

	it('should call onHide on click of the close button', () => {
		const mockClickHandler = jest.fn();
		shallow(<ModalHeader closeButton onHide={mockClickHandler} />)
			.find('button')
			.simulate('click');
		expect(mockClickHandler).toHaveBeenCalled();
	});

	it('should not error on click of the close button without onHide', () => {
		const wrapper = shallow(<ModalHeader closeButton />);
		expect(() => {
			wrapper.find('button').simulate('click');
		}).not.toThrow();
	});
});
