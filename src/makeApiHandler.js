// Handles API calls to Wikipedia.

// Stores a temporary DOM element that performs JSONP request
let tempRequest;

/**
 * Position in array window.WikiApiHandler.articleCallbacks that contains
 * function to call when article request completes. Callback function updates
 * state of Component requesting content.
 */
let currentCallbackPosition;

let article = {};

/**
 * Defines and returns a static WikiApiHandler that components can call
 * to perform API requests. Utilizes JSONP requests to skirt around cross
 * origin scripting issues.
 */
export default function makeApiHandler() {
	window.WikiApiHandler = window.WikiApiHandler || {
		getArticleFromComponent: getArticleFromComponent,
		getRandomArticleIdComplete: getRandomArticleIdComplete,
		getArticleContentComplete: getArticleContentComplete,
		getImagesByCategoryComplete: getImagesByCategoryComplete,
		getImageByTitleComplete: getImageByTitleComplete
	}

	return window.WikiApiHandler;
}

/**
 * Modifies the content of a given site's file with a desired xml content.
 *
 * @param {string} id The unique ID of the Wikipedia article to request, selects
 * 	a random article if undefined
 * @param {number} callbackPosition The position of the callback function to call
 * 	when the request completes
 */
function getArticleFromComponent(id, callbackPosition) {
	// store callback function position to call when request completes
	currentCallbackPosition = callbackPosition;

	if (typeof id === 'undefined' || isNaN(parseInt(id))) {
		getRandomArticleId();
	} else {
		getArticleContent(id);
	}
}

/**
 * Retrieves a random article ID from Wikipedia.
 */
function getRandomArticleId() {
	const requestIdPath = 'http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&format=json';

	console.log('[WikiApiHandler] Requesting random article ID');
	jSONPRequest(requestIdPath, 'WikiApiHandler.getRandomArticleIdComplete');
}

/**
 * Executes on completion of random article ID request. Initiates call to
 * retrieve article content.
 * 
 * @param {Object} response The API response
 */
function getRandomArticleIdComplete(response) {
	onCompleteRequest();

	// use first key from response data as article id
	if (response && response.query && typeof response.query.pages === 'object') {
		let id;
		let ids = Object.keys(response.query.pages);
		
		if (ids.length > 0) {
			id = ids[0];
			console.log(`[WikiApiHandler] Completed random ID request with ID ${id}`);
			getArticleContent(id);
		}
	}
}

/**
 * Retrieves content of Wikipedia article by ID.
 *
 * @param {string} id The unique ID of the Wikipedia article to request
 */
function getArticleContent(id) {
	const contentRequestUrl = `http://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&pageid=${id}`;

	console.log(`[WikiApiHandler] Requesting article content by ID ${id}`);
	jSONPRequest(contentRequestUrl,'WikiApiHandler.getArticleContentComplete');
}

/**
 * Executes on completion of article content request. Initiates request for images associated with article.
 *
 * @param {Object} response The API response
 */
function getArticleContentComplete(response) {
	onCompleteRequest();

	if (response && response.parse) {
		article.title = response.parse.title;
		article.htmlStr = response.parse.text['*'];

		// update article component with latest article information
		performComponentCallback();

		// request images for article
		console.log(`[WikiApiHandler] Completed article content request for ${article.title}`);
		getImagesByCategory();
	} else {
		console.error(`[WikiApiHandler] Could not retrieve article content`);
	}
}

/**
 * Requests a list of images from Wikipedia associated with a category.
 *
 * @param {string} category The API response
 */
function getImagesByCategory(category = article.title) {
	const escapedCategory = escape(category);
	const imgRequestUrl = `http://en.wikipedia.org/w/api.php?action=query&prop=images&format=json&titles=${escapedCategory}`;

	console.log(`[WikiApiHandler] Requesting images associated with ${category}`);
	jSONPRequest(imgRequestUrl, 'WikiApiHandler.getImagesByCategoryComplete');
}

/**
 * Executes upon completion of image list request. Initiates call to request a single
 * image file.
 *
 * @param {Object} response The API response
 */
function getImagesByCategoryComplete(response) {
	let imgList;
	let imgFound = false;

	console.log(`[WikiApiHandler] Completed image list request for ${article.title}`);
	onCompleteRequest();

	// retrieve first list of returned images
	if (response &&
		response.query &&
		response.query.pages &&
		Object.keys(response.query.pages).length > 0) {
		let id = Object.keys(response.query.pages)[0];
		imgList = response.query.pages[id].images;
	}

	// parse image list and avoid Wikipedia icons and graphics
	if (Array.isArray(imgList) && imgList.length > 0) {
		console.log(`[WikiApiHandler] Parsing image list for appropriate graphic`);

		for(let image of imgList) {
			if ((image.title.indexOf('Commons-logo') === -1) &&
				(image.title.indexOf('Wiki letter') === -1) &&
				(image.title.indexOf('Hexagonal Icon') === -1) &&
				(image.title.indexOf('Ambox') === -1) &&
				(image.title.indexOf('DAB list gray') === -1) &&
				(image.title.indexOf('Text document') === -1) &&
				(image.title.indexOf('Disambig gray') === -1)) {
				// once a candidate img is found, make an additional API call to get the actual image file
				imgFound = true;
				getImageByTitle(image.title);
				break;
			}
		}

		if (!imgFound) {
			console.log(`[WikiApiHandler] Could not find image for ${article.title}`);
		}
	}
}

/**
 * Requests an image from Wikipedia that best matches a title.
 *
 * @param {string} category The API response
 */
function getImageByTitle(imageTitle) {
	const imgRequestUrl = `http://en.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url&format=json&titles=${imageTitle}`;

	console.log(`[WikiApiHandler] Requesting file paths for ${imageTitle} images`);
	jSONPRequest(imgRequestUrl, 'WikiApiHandler.getImageByTitleComplete');
}

/**
 * Executes upon completion of image file request.
 *
 * @param {Object} response The API response
 */
function getImageByTitleComplete(response) {
	console.log(`[WikiApiHandler] Completed image file paths request`);
	onCompleteRequest();

	// parse list of images for a single file
	if (response &&
		response.query &&
		response.query.pages &&
		Object.keys(response.query.pages).length > 0) {
		let id = Object.keys(response.query.pages)[0];
		let img = response.query.pages[id].imageinfo[0].url;
		article.image = img;
	}

	// update article component with latest article information
	performComponentCallback();
}

/**
 * Updates current component specified by currentCallbackPosition with information
 * on article object.
 */
function performComponentCallback() {
	console.log('[WikiApiHandler] Performing update on article Component');

	if (typeof currentCallbackPosition !== 'undefined' &&
		Array.isArray(window.WikiApiHandler.articleCallbacks) &&
		typeof window.WikiApiHandler.articleCallbacks[currentCallbackPosition] === 'function') {
		window.WikiApiHandler.articleCallbacks[currentCallbackPosition](article);
	}
}

/**
 * Performs JSONP Request.
 *
 * @param {string} query The API query string to call
 * @param {string} callback The path of the method to call when JSONP method completes
 */
function jSONPRequest(query, callback) {
	// query currently in progress
	if (tempRequest) {
		return;
	}

	tempRequest = document.createElement('script');
	tempRequest.type = 'text/javascript';
	tempRequest.id = 'jsGetFromWikipedia';
	tempRequest.src = `${query}&callback=${callback}`;
	document.body.appendChild(tempRequest);
}
	
/**
 * Tears down temporary objects created during JSONP request.
 */
function onCompleteRequest() {
	document.body.removeChild(tempRequest);
	tempRequest = null;
}
