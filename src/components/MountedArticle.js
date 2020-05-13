// @flow
import React, { useState, useRef } from 'react';
import WikiArticle from './WikiArticle';
import type { Props as WikiArticleProps, SharedArticle } from './WikiArticle';
import AppendToBody from './AppendToBody';

type Props = {
	...WikiArticleProps
};

const MountedArticle = (props: Props) => {
	const { title: titleProp, description: descriptionProp } = props;
	const [title, setTitle] = useState(titleProp);
	const [description, setDescription] = useState(descriptionProp);
	const updateArticleData = (data: SharedArticle) => {
		setTitle(data.title);
		setDescription(data.description);
	};
	const articleRef = useRef(null);
	let testToggle = false;

	const updateRef = () => {
		if (articleRef.current) {
			if (!testToggle) {
				articleRef.current.style.border = '2px dashed red';
			} else {
				articleRef.current.style.border = '';
			}

			testToggle = !testToggle;
		}
	};

	return (
		<>
			<WikiArticle {...props} callback={updateArticleData} ref={articleRef} />
			{title && description && (
				<AppendToBody>
					<button type="button" onClick={updateRef}>
						<span>{title}</span>
						<span>{description}</span>
					</button>
				</AppendToBody>
			)}
		</>
	);
};

MountedArticle.defaultProps = { ...WikiArticle.defaultProps };

export default MountedArticle;
