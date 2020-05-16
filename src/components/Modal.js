// @flow
import * as React from 'react';
import { useEffect, useRef } from 'react';
import { CSSTransition } from 'react-transition-group';
import '../scss/_Modal.scss';

type Props = {
	children?: React.Node | string,
	onHide: ({ ... }) => void,
	show: boolean
};

const Modal = ({ children, onHide, show }: Props) => {
	const keyboadEvent = 'keyup';
	const mouseEvent = 'click';
	const modalRef: { current: any } = useRef(null);

	useEffect(() => {
		/**
		 * Call `onHide` handler from parent composite component on press of
		 * `escape` key.
		 * @param {Event} e The click event.
		 */
		const handleKeyUp = (e: KeyboardEvent) => {
			// toggle on escape
			if (e.keyCode === 27) {
				e.preventDefault();
				onHide(e);
			}
		};

		/**
		 * Call `onHide` handler from parent composite component when clicking
		 * on background overlay surrounding dialog.
		 * @param {Event} e The click event.
		 */
		const handleBackgroundClick = (e: MouseEvent) => {
			if (modalRef.current && !modalRef.current.contains(e.target)) {
				onHide(e);
			}
		};

		// apply/remove post page load event handlers to toggle modal
		if (show) {
			if (modalRef.current) modalRef.current.focus();
			window.addEventListener(keyboadEvent, handleKeyUp);
			document.addEventListener(mouseEvent, handleBackgroundClick);
		} else {
			window.removeEventListener(keyboadEvent, handleKeyUp);
			document.removeEventListener(mouseEvent, handleBackgroundClick);
		}

		return () => {
			// unbind event handlers on unnmount
			window.removeEventListener(keyboadEvent, handleKeyUp);
			document.removeEventListener(mouseEvent, handleBackgroundClick);
		};
	}, [onHide, show]);

	return (
		<CSSTransition in={show} classNames="wa-modal" timeout={300} unmountOnExit>
			<div className="wa-modal-container" key="wa-modal">
				<dialog
					className="wa-modal"
					ref={modalRef}
					{...(show ? { open: true } : {})}
				>
					<button type="button" className="wa-modal-close" onClick={onHide}>
						X
					</button>
					<div>{children}</div>
				</dialog>
			</div>
		</CSSTransition>
	);
};

Modal.defaultProps = {
	children: undefined
};

export default Modal;
