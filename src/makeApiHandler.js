// Handles API calls to Wikipedia.

// Stores a temporary DOM element that performs JSONP request
let tempRequest;

/**
 * Position in array window.WikiApiHandler.articleCallbacks that contains
 * function to call when article request completes. Callback function updates
 * state of Component requesting content.
 */
let currentCallbackPosition;

/**
 * Defines and returns a static WikiApiHandler that components can call
 * to perform API requests. Utilizes JSONP requests to skirt around cross
 * origin scripting issues.
 */
export default function makeApiHandler() {
	window.WikiApiHandler = window.WikiApiHandler || {
		getArticleFromComponent: getArticleFromComponent,
		getRandomArticleIdComplete: getRandomArticleIdComplete,
		getArticleContentComplete: getArticleContentComplete
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
 * Executes on completion of article content request.
 *
 * @param {Object} response The API response
 */
function getArticleContentComplete(response) {
	console.log(`[WikiApiHandler] Completed article content request`);
	onCompleteRequest();

	if (typeof currentCallbackPosition !== 'undefined' &&
		Array.isArray(window.WikiApiHandler.articleCallbacks) &&
		typeof window.WikiApiHandler.articleCallbacks[currentCallbackPosition] === 'function') {
		window.WikiApiHandler.articleCallbacks[currentCallbackPosition](response.parse);
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