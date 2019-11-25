/**
 * For a given character limit, trims text to the nearest word
 * and appends an ellipsis.
 * @param {string} str The string to trim.
 * @param {number} limit Character limit for text.
 * @param {boolean} appendEllipsis Whether to append an ellipsis if the original
 * 	string exceeds the requested limit.
 * @param {string} delimiter The character to trim the string at.
 * @returns {string} The trimmed string.
 */
const trim = (
	str,
	limit = 500,
	appendEllipsis = true,
	delimiter = ' '
) => {
	const ellipsis = '...';
	const updatedLimit = appendEllipsis ? limit - ellipsis.length : limit;
	let updatedStr = str;

	if (str.length > updatedLimit) {
		updatedStr = str.substring(0, str.lastIndexOf(delimiter, updatedLimit));

		if (appendEllipsis) {
			updatedStr += ellipsis;
		}
	}

	return updatedStr;
};

export default trim;
