// @flow
import * as React from 'react';
import { useState } from 'react';
import MountedArticle from './MountedArticle';

import Modal from './Modal';

type Props = {
	articles?: Array<React.Node>
};

const Cylinder = ({ articles: articlesProp }: Props) => {
	const [articles, setArticles] = useState(articlesProp);
	const appendArticle = () =>
		Array.isArray(articles) &&
		setArticles([...articles, <MountedArticle key={articles.length} />]);

	// modal testing
	const [showModal, setShowModal] = useState(false);
	const openModal = () => setShowModal(true);
	const closeModal = () => setShowModal(false);

	return (
		<>
			<button type="button" onClick={appendArticle}>
				Add article
			</button>
			<button type="button" onClick={openModal}>
				Show Modal
			</button>
			<section className="articles">
				{Array.isArray(articles) && articles.slice(0)}
			</section>
			<Modal show={showModal} onHide={closeModal}>
				<p>Testing this!</p>
			</Modal>
		</>
	);
};

Cylinder.defaultProps = {
	articles: [<MountedArticle key="0" />]
};

export default Cylinder;
