import React from 'react';
import { mount } from '../enzyme';
import AppendToBody from '../../components/AppendToBody';

describe('AppendToBody', () => {
	const MyComponent = props => <div {...props} />;

	it("should append the component's children to the document body", () => {
		mount(
			<div className="test-container">
				<AppendToBody>
					<MyComponent id="myComponent" />
				</AppendToBody>
			</div>
		);
		const el = document.body.querySelector('#myComponent');
		expect(el).not.toBeNull();
		expect(el.closest('.test-container')).toBeNull();
	});

	it("should remove the component's children from the document body on unmount", () => {
		const removeChildFxn = document.body.removeChild;
		document.body.removeChild = jest.fn();
		mount(
			<div className="test-container">
				<AppendToBody>
					<MyComponent id="myComponent" />
				</AppendToBody>
			</div>
		).unmount();
		expect(document.body.removeChild).toHaveBeenCalled();

		// reset mock
		document.body.removeChild = removeChildFxn;
	});
});
