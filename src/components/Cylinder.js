// @flow
import * as React from 'react';
import { useState } from 'react';
import MountedArticle from './MountedArticle';

type Props = {
	articles?: Array<React.Node>
};

const Cylinder = ({ articles: articlesProp }: Props) => {
	const [articles, setArticles] = useState(articlesProp);
	const appendArticle = () =>
		Array.isArray(articles) &&
		setArticles([...articles, <MountedArticle key={articles.length} />]);

	return (
		<>
			<button type="button" onClick={appendArticle}>
				Add article
			</button>
			<section className="articles">
				{Array.isArray(articles) && articles.slice(0)}
			</section>
		</>
	);
};

Cylinder.defaultProps = {
	articles: [<MountedArticle key="0" />]
};

export default Cylinder;
