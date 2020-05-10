const addArticle = payload => dispatch => {
	dispatch({
		type: 'ADD_ARTICLE',
		payload
	});
};

export default addArticle;
