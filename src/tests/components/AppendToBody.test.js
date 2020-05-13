import React from 'react';
import { mount } from '../enzyme';
import AppendToBody from '../../components/AppendToBody';

describe('AppendToBody', () => {
	const MyComponent = props => <div {...props} />;
	let container;
	let el;

	afterEach(() => {
		// reset DOM
		document.getElementsByTagName('html')[0].innerHTML = '';
		container = null;
		el = null;
	});

	it("should append the component's children to the document body", () => {
		mount(
			<div className="test-container">
				<AppendToBody>
					<MyComponent id="myComponent" />
				</AppendToBody>
			</div>
		);
		el = document.body.querySelector('#myComponent');
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

	it("should append the component's children to a container matching a selector", () => {
		container = document.createElement('div');
		container.id = 'someId';
		document.body.appendChild(container);
		mount(
			<AppendToBody containerSelector="#someId">
				<MyComponent id="myComponent" />
			</AppendToBody>
		);
		el = document.body.querySelector('#myComponent');
		expect(el.closest('#someId')).not.toBeNull();
	});

	it("should remove the component's children from a container matching a selector on unmount", () => {
		container = document.createElement('div');
		container.id = 'someId';
		const removeChildFxn = container.removeChild;
		container.removeChild = jest.fn();
		document.body.appendChild(container);
		mount(
			<AppendToBody containerSelector="#someId">
				<MyComponent id="myComponent" />
			</AppendToBody>
		).unmount();
		expect(container.removeChild).toHaveBeenCalled();

		// reset mock
		container.removeChild = removeChildFxn;
	});

	it("should append the component's children to the document body if a container matching a selector is not found", () => {
		mount(
			<div className="test-container">
				<AppendToBody containerSelector=".doesNotExist">
					<MyComponent id="myComponent" />
				</AppendToBody>
			</div>
		);
		el = document.body.querySelector('#myComponent');
		expect(el).not.toBeNull();
		expect(el.closest('.test-container')).toBeNull();
	});
});
