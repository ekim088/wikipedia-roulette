// @flow

// list of known abbreviations that should not be at end of sentence
const abbreviationBlacklist: Array<string> = ['Mr', 'Mrs', 'St', 'Mt'];

/**
 * Trims text to the nearest end of sentence punctuation.
 * @param {string} str The string to trim.
 * @returns {string} The trimmed string.
 */
const trimToNearestPunctuation = (str: string): string =>
	str.replace(/(?=[^.?!]*$)./m, '|||').split('|||')[0] || '';

/**
 * Trims text to the nearest sentence that does not exceed the given
 * character limit.
 * @param {string} str The string to trim.
 * @param {number} limit Character limit for text.
 * @returns {string} The trimmed string.
 */
const trim = (str: string, limit: number = 500) => {
	let updatedStr: string = str;

	if (str.length > limit) {
		updatedStr = updatedStr.substring(0, limit);

		// trim to nearest end of sentence
		let trimmedStr: string = trimToNearestPunctuation(updatedStr);

		/**
		 * Tests whether a string ends in a single character or known
		 * abbreviation. To be passed to `Array.prototype.every`.
		 * @param {string} str The string to trim.
		 * @param {number} limit Character limit for text.
		 * @returns {string} The trimmed string.
		 */
		const doesNotEndInAbbreviation = (abbrev: string): boolean =>
			!trimmedStr.endsWith(`${abbrev}.`) &&
			!trimmedStr.match(/\s{1}\w{1}\.$/gi);

		// attempt to avoid abbreviations; retrim if found
		while (
			trimmedStr &&
			(trimmedStr.slice(-3, -1).indexOf('.') > -1 ||
				!abbreviationBlacklist.every(doesNotEndInAbbreviation))
		) {
			trimmedStr = trimToNearestPunctuation(trimmedStr.slice(0, -1));
		}

		// append ellipsis if substring does not contain a sentence
		updatedStr = trimmedStr || `${updatedStr.slice(0, -3).trim()}...`;
	}

	return updatedStr;
};

export default trim;
