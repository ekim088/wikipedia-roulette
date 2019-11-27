// @flow
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
		const trimmedStr: string =
			updatedStr.replace(/(?=[^.?!]*$)./m, '|||').split('|||')[0] || '';

		// append ellipsis if substring does not contain a sentence
		updatedStr = trimmedStr || `${updatedStr.slice(0, -3).trim()}...`;
	}

	return updatedStr;
};

export default trim;
