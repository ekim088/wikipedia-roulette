import { wikiLogger } from './logger';

const wikiEndpoint = 'https://en.wikipedia.org/api/rest_v1';

/**
 * Retrieves a random article from Wikipedia.
 * @returns {string} A Wikipedia article title.
 */
const fetchRandomArticleTitle = async () => {
	wikiLogger.info('requesting random article');

	try {
		const response = await fetch(`${wikiEndpoint}/page/random/title`);
		const json = await response.json();
		const title = json.items[0].title;
		wikiLogger.info(`retrieved article title "${title}"`);
		return title;
	} catch(e) {
		wikiLogger.error(e);
	}
};

/**
 * Retrieves the Wikipedia article summary of a given title.
 * @param {string} title The title of the Wikipedia article to request.
 */
const fetchArticleSummaryByTitle = async title => {
	wikiLogger.info(`requesting article summary by title "${title}"`);

	try {
		const response = await fetch(
			`${wikiEndpoint}/page/summary/${title.replace(' ', '_')}`
		);
		const json = await response.json();
		wikiLogger.info(`retrieved article summary for "${title}"`);
		return json;
	} catch(e) {
		wikiLogger.error(e);
	}
};

/**
 * Retrieves a Wikipedia article.
 * @param {string} [title] The title of the Wikipedia article to request.
 */
export const getArticleSummary = async title =>
	await fetchArticleSummaryByTitle(
		typeof title === 'string'
			? title
			: await fetchRandomArticleTitle()
	);
