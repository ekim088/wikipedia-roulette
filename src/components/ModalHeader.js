// @flow
import * as React from 'react';
import { useContext } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';
import ModalContext from './ModalContext';

type Props = {
	children?: React.Node | string,
	closeButton?: boolean,
	onHide?: (?Event) => void
};

const ModalHeader = ({ children, closeButton, onHide }: Props) => {
	/**
	 * Propogate `onHide` call to method located on parent context in addition
	 * to local if available. Supports <Modal.Header> renders within <Modal>
	 */
	const context = useContext(ModalContext);
	const handleClick = useEventCallback(() => {
		if (context) context.onHide();
		if (onHide) onHide();
	});

	return (
		<header className="wa-modal-header">
			{children}
			{closeButton && (
				<button type="button" className="wa-modal-close" onClick={handleClick}>
					X
				</button>
			)}
		</header>
	);
};

ModalHeader.defaultProps = {
	children: undefined,
	closeButton: false,
	onHide: undefined
};

export default ModalHeader;
