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

	const [showModal2, setShowModal2] = useState(false);
	const openModal2 = () => setShowModal2(true);
	const closeModal2 = () => setShowModal2(false);

	return (
		<>
			<button type="button" onClick={appendArticle}>
				Add article
			</button>
			<button type="button" onClick={openModal}>
				Show Modal 1
			</button>
			<button type="button" onClick={openModal2}>
				Show Modal 2
			</button>
			<section className="articles">
				{Array.isArray(articles) && articles.slice(0)}
			</section>
			<Modal show={showModal} id="modal-1" onHide={closeModal}>
				<Modal.Header closeButton>Modal 1</Modal.Header>
				<p>
					Donec sed odio dui. Aenean eu leo quam. Pellentesque ornare sem
					lacinia quam venenatis vestibulum.
				</p>
			</Modal>

			<Modal
				className="test"
				show={showModal2}
				id="modal-2"
				onHide={closeModal2}
			>
				<Modal.Header>Modal 2</Modal.Header>
				<p>
					Cum sociis natoque penatibus et magnis dis parturient montes, nascetur
					ridiculus mus. Nullam id dolor id nibh ultricies vehicula ut id elit.
					Fusce dapibus, tellus ac cursus commodo, tortor mauris condimentum
					nibh, ut fermentum massa justo sit amet risus.
				</p>
			</Modal>
		</>
	);
};

Cylinder.defaultProps = {
	articles: [<MountedArticle key="0" />]
};

export default Cylinder;
