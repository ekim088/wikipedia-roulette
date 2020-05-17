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
	let attempts = 0;
	let key;

	do {
		key = `${Math.round(Math.random() * 100000)}`;
		attempts += 1;
	} while (keys.indexOf(key) > -1 && attempts < 10);

	storeKey(key);
	return key;
};
