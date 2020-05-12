// @flow
import React, { useState } from 'react';
import WikiArticle from './WikiArticle';

type Props = {
	articles?: Array<WikiArticle>
};

const Cylinder = ({ articles: articlesProp }: Props) => {
	const [articles, setArticles] = useState(articlesProp);
	const appendArticle = () =>
		Array.isArray(articles) &&
		setArticles([...articles, <WikiArticle key={articles.length} />]);

	return (
		<>
			<button type="button" onClick={appendArticle}>
				Add article
			</button>
			<div className="articles">
				{Array.isArray(articles) && articles.slice(0)}
			</div>
		</>
	);
};

Cylinder.defaultProps = {
	articles: [<WikiArticle key="0" />]
};

export default Cylinder;
