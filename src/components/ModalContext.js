// @flow
import { createContext } from 'react';

// context to store `onHide` method to be called by child header
const ModalContext = createContext<{ onHide: (?Event) => void }>({
	onHide() {}
});

export default ModalContext;
