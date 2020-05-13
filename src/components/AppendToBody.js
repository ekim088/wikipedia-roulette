// @flow
import * as React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

type Props = {
	children: React.Node,
	containerSelector?: string
};

/**
 * Appends component children to DOM <body>
 * ex.
 * <AppendToBody>
 * 	<MyComponentToAppend />
 * </AppendToBody>
 */
const AppendToBody = ({ children, containerSelector }: Props) => {
	const el = document.createElement('div');

	// safeguard to make sure container <div> does not affect layout
	el.style.display = 'contents';

	useEffect(() => {
		const customContainer =
			containerSelector && document.querySelector(containerSelector);
		const container = customContainer || document.body;

		if (container) {
			container.appendChild(el);
		}

		return () => {
			if (container) {
				container.removeChild(el);
			}
		};
	}, [el, containerSelector]);

	return ReactDOM.createPortal(children, el);
};

AppendToBody.defaultProps = {
	containerSelector: ''
};

export default AppendToBody;
