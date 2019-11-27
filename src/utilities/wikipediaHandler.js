import { wikiLogger } from './logger';

const wikiEndpoint = 'https://en.wikipedia.org/api/rest_v1';

/**
 * Retrieves a random article from Wikipedia.
 * @returns {string} A Wikipedia article title.
 */
const fetchRandomArticleTitle = async () => {
	let articleTitle;
	wikiLogger.info('requesting random article');

	try {
		const response = await fetch(`${wikiEndpoint}/page/random/title`);
		const json = await response.json();
		const { title } = json.items[0];
		wikiLogger.info(`retrieved article title "${title}"`);
		articleTitle = title;
	} catch (e) {
		wikiLogger.error(e);
	}

	return articleTitle;
};

/**
 * Retrieves the Wikipedia article summary of a given title.
 * @param {string} title The title of the Wikipedia article to request.
 */
const fetchArticleSummaryByTitle = async title => {
	let responseJson;
	wikiLogger.info(`requesting article summary by title "${title}"`);

	try {
		const response = await fetch(
			`${wikiEndpoint}/page/summary/${title.replace(' ', '_')}`
		);
		const json = await response.json();
		wikiLogger.info(`retrieved article summary for "${title}"`);
		responseJson = json;
	} catch (e) {
		wikiLogger.error(e);
	}

	return responseJson;
};

/**
 * Retrieves a Wikipedia article.
 * @param {string} [title] The title of the Wikipedia article to request.
 */
const getArticleSummary = async title =>
	fetchArticleSummaryByTitle(
		typeof title === 'string' ? title : await fetchRandomArticleTitle()
	);

export default getArticleSummary;
