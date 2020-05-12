// @flow
import * as React from 'react';
import ReactDOM from 'react-dom';

type Props = {
	children: React.Node
};

/**
 * Appends component children to DOM <body>
 * ex.
 * <AppendToBody>
 * 	<MyComponentToAppend />
 * </AppendToBody>
 */
const AppendToBody = ({ children }: Props) => {
	const el = document.createElement('div');

	// safeguard to make sure container <div> does not affect layout
	el.style.display = 'contents';

	React.useEffect(() => {
		if (document.body) {
			document.body.appendChild(el);
		}

		return () => {
			if (document.body) {
				document.body.removeChild(el);
			}
		};
	}, [el]);

	return ReactDOM.createPortal(children, el);
};

export default AppendToBody;
