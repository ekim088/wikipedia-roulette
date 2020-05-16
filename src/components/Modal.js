// @flow
import * as React from 'react';
import { useEffect, useMemo, useRef } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';
import { CSSTransition } from 'react-transition-group';
import ModalContext from './ModalContext';
import ModalHeader from './ModalHeader';
import '../scss/_Modal.scss';

type Props = {
	children?: React.Node | string,
	className?: string,
	id?: string,
	onHide: (?Event) => void,
	show: boolean
};

const Modal = ({ children, className, onHide, show, ...rest }: Props) => {
	const keyboadEvent = 'keyup';
	const mouseEvent = 'click';
	const modalRef: { current: any } = useRef(null);

	const handleHide = useEventCallback(onHide);
	const modalContext = useMemo(
		() => ({
			onHide: handleHide
		}),
		[handleHide]
	);

	/**
	 * Call `onHide` handler from parent composite component on press of
	 * `escape` key.
	 * @param {Event} e The click event.
	 */
	const handleKeyUp = useEventCallback((e: KeyboardEvent) => {
		// toggle on escape
		if (e.keyCode === 27) {
			e.preventDefault();
			e.stopPropagation();
			handleHide(e);
		}
	});

	/**
	 * Call `onHide` handler from parent composite component when clicking
	 * on background overlay surrounding dialog.
	 * @param {Event} e The click event.
	 */
	const handleBackgroundClick = useEventCallback((e: MouseEvent) => {
		if (modalRef.current && !modalRef.current.contains(e.target)) {
			handleHide(e);
		}
	});

	useEffect(() => {
		if (show) {
			if (modalRef.current) modalRef.current.focus();

			// bind event listeners to hide modal
			document.addEventListener(mouseEvent, handleBackgroundClick);
			window.addEventListener(keyboadEvent, handleKeyUp);
		}

		return () => {
			document.removeEventListener(mouseEvent, handleBackgroundClick);
			window.removeEventListener(keyboadEvent, handleKeyUp);
		};
	}, [show, handleBackgroundClick, handleKeyUp]);

	return (
		<CSSTransition in={show} classNames="wa-modal" timeout={300} unmountOnExit>
			<ModalContext.Provider value={modalContext}>
				<div
					{...rest}
					className={`wa-modal-container${className ? ` ${className}` : ''}`}
					key="wa-modal"
				>
					<dialog
						className="wa-modal"
						ref={modalRef}
						{...(show ? { open: true } : {})}
					>
						<div>{children}</div>
					</dialog>
				</div>
			</ModalContext.Provider>
		</CSSTransition>
	);
};

Modal.defaultProps = {
	children: undefined,
	className: undefined,
	id: undefined
};

Modal.Header = ModalHeader;

export default Modal;
