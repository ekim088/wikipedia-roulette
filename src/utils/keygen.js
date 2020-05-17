// @flow

// generated key store
const keys: Array<string> = [];

/**
 * Inserts a unique key into the store.
 * @param {string} key The key to store.
 */
export const storeKey = (key: string) => {
	if (keys.indexOf(key) === -1) {
		keys.push(key);
	}
};

/**
 * Really basic key generator.
 * @returns {string} A key.
 */
export const generateKey = (): string => {
	let key;

	do {
		key = `${Math.round(Math.random() * 100000)}`;
	} while (keys.indexOf(key) > -1);

	storeKey(key);
	return key;
};
