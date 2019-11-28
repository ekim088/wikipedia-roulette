import trim from './trim';

describe('trim', () => {
	it('trims a string to the desired length', () => {
		expect(trim('This is longer than the length', 10).length).toBe(10);
	});

	it('returns the original string if shorter than the desired length', () => {
		expect(trim('Short string!', 50)).toBe('Short string!');
	});

	it('returns trims to the end of the nearest sentence if string contains multiple sentences', () => {
		const sentences =
			'Praesent commodo cursus magna, vel scelerisque nisl consectetur et. Morbi leo risus, porta ac consectetur ac, vestibulum at eros.';
		expect(trim(sentences, 100)).toBe(
			'Praesent commodo cursus magna, vel scelerisque nisl consectetur et.'
		);
	});

	it('avoids ending a sentence at a abbreviation', () => {
		let testSentence = 'South Korea is a country. The U.S.A. is a country';
		expect(trim(testSentence, 45)).toBe('South Korea is a country.');

		testSentence = 'This is a message from Mr. and Mrs. Kim.';
		expect(trim(testSentence, 33)).toBe('This is a message from Mr. and...');
	});
});
