// @flow
import { createContext } from 'react';

// context to store `spin` method to be called by child article
const CylinderContext = createContext<{
	highlightActive: any => void,
	spin: any => void
}>({
	highlightActive() {},
	spin() {}
});

export default CylinderContext;
