// Handles API calls to Wikipedia

let tempRequest;

export default function makeApiHandler() {
	window.WikiApiHandler = window.WikiApiHandler || {
		getArticleById: getArticleById,
		getArticleByIdComplete: getArticleByIdComplete,
		getArticleContentComplete: getArticleContentComplete
	}

	return window.WikiApiHandler;
}

function getArticleById(id) {
	const requestByIdPath = 'http://en.wikipedia.org/w/api.php?action=query&generator=random&grnnamespace=0&format=json';

	// get random ID from Wikipedia API if invalid ID provided
	if (isNaN(parseInt(id))) {
		console.log('[WikiApiHandler] Requesting random article ID');
		jSONPRequest(requestByIdPath, 'WikiApiHandler.getArticleByIdComplete');
	} else {
		getArticleContent(id);
	}
}

function getArticleByIdComplete(response) {
	let id;

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

function getArticleContent(id) {
	const contentRequestUrl = `http://en.wikipedia.org/w/api.php?action=parse&prop=text&format=json&pageid=${id}`;

	console.log(`[WikiApiHandler] Requesting article content by ID ${id}`);
	jSONPRequest(contentRequestUrl,'WikiApiHandler.getArticleContentComplete');
}

function getArticleContentComplete(response) {
	console.log(`[WikiApiHandler] Completed article content request`);
	onCompleteRequest();
	return response.parse;
}

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
	
// remove temp script element
function onCompleteRequest() {
	document.body.removeChild(tempRequest);
	tempRequest = null;
}