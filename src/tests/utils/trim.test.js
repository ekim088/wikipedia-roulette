import trim from '../../utils/trim';

describe('trim', () => {
	it('trims and appends ellipsis to single sentence strings greater than the limit', () => {
		const testStr = 'This is longer than the length';
		const limit = testStr.length - 1;
		const expected = 'This is longer than the le...';
		expect(trim(testStr, limit)).toBe(expected);
	});

	it('returns the original string if shorter than or equal the desired length', () => {
		const testStr = 'Short string!';
		expect(trim(testStr, testStr.length)).toBe(testStr);
		expect(trim(testStr, testStr.length + 1)).toBe(testStr);
	});

	it('returns trims to the end of the nearest sentence if string contains multiple sentences', () => {
		const testStr =
			'Praesent commodo cursus magna, vel scelerisque nisl consectetur ' +
			'et. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.';
		const limit = testStr.length - 1;
		expect(trim(testStr, limit)).toBe(
			'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.'
		);
	});

	it('avoids ending a sentence at a abbreviation', () => {
		let testStr = 'South Korea is a country. The U.S.A. is a country';
		let limit = testStr.length - 1;
		expect(trim(testStr, limit)).toBe('South Korea is a country.');

		testStr = 'This is a message from Mr. and Mrs. Kim.';
		limit = testStr.length - 1;
		expect(trim(testStr, limit)).toBe('This is a message from Mr. and Mrs....');
	});
});
