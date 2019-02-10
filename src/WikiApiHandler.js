/**
 * Defines and returns a handler that components can call to perform Wikipedia API requests.
 */
export const WikiApiHandler = (() => {
	/**
	 * Retrieves a random article from Wikipedia.
	 * 
	 * @returns {string} the title of a random Wikipedia article
	 */
	const getRandomArticle = () => new Promise(async (resolve, reject) => {
		console.log(`[WikiApiHandler] Requesting random article`);
		try {
			const response = await fetch('https://en.wikipedia.org/api/rest_v1/page/random/title');
			const responseJson = await response.json();
			resolve(responseJson.items[0].title);
		} catch(e) {
			reject(e);
		}
	});

	/**
	 * Retrieves a summary of a Wikipedia article.
	 *
	 * @param {string} title - The title of the Wikipedia article to request
	 */
	const getArticleSummary = (title) => new Promise(async (resolve, reject) => {
		console.log(`[WikiApiHandler] Requesting article summary by title "${title}"`);
		try {
			const response = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${title.replace(' ', '_')}`);
			const responseJson = await response.json();
			resolve(responseJson);
		} catch(e) {
			reject(e);
		}
	});

	/**
	 * Translates raw article summary response from API to a format understood
	 * by consuming Component.
	 * 
	 * @param {Object} article - Raw article summary from API
	 * @returns {Object} Translated article data
	 */
	const translateArticleSummary = (summary) => {
		console.log('[WikiApiHandler] Parsing article summary');

		return {
			title: summary.title,
			summary: summary.extract_html,
			image: summary.thumbnail && summary.thumbnail.source
		};
	};

	/**
	 * Queries the Wikipedia API for article content. Can be called externally from
	 * React Component.
	 *
	 * @param {number} callbackPosition - Position in array WikiApiHandler.articleCallbacks
	 * that contains function to call when article request completes. Callback function updates
	 * state of Component requesting content.
	 * @param {string} [title] - The title of the Wikipedia article to request, selects
	 * a random article if undefined
	 */
	const getArticleFromComponent = async (callback, title) => {
		if (typeof title === 'undefined') {
			title = await getRandomArticle(title);
		}

		getArticleSummary(title)
			.then((summary) => translateArticleSummary(summary))
			.then((parsedData) => callback(parsedData));
	};

	return {
		getArticleFromComponent: getArticleFromComponent
	};
})();
