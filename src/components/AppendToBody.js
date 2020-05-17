// @flow
import * as React from 'react';
import { useEffect } from 'react';
import ReactDOM from 'react-dom';

type Props = {
	children: React.Node,
	containerSelector?: string,
	prepend?: boolean
};

/**
 * Appends component children to DOM <body>
 * ex.
 * <AppendToBody>
 * 	<MyComponentToAppend />
 * </AppendToBody>
 */
const AppendToBody = ({ children, containerSelector, prepend }: Props) => {
	const el = document.createElement('div');

	// safeguard to make sure container <div> does not affect layout
	el.style.display = 'contents';

	useEffect(() => {
		const customContainer =
			containerSelector && document.querySelector(containerSelector);
		const container = customContainer || document.body;

		if (container) {
			if (prepend) {
				container.prepend(el);
			} else {
				container.append(el);
			}
		}

		return () => {
			if (container) {
				container.removeChild(el);
			}
		};
	}, [el, containerSelector, prepend]);

	return ReactDOM.createPortal(children, el);
};

AppendToBody.defaultProps = {
	containerSelector: '',
	prepend: false
};

export default AppendToBody;
