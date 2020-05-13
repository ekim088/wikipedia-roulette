// @flow
import * as React from 'react';
import { useState } from 'react';
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

	return (
		<>
			<WikiArticle {...props} callback={updateArticleData} />
			{title && description && (
				<AppendToBody>
					<button type="button">
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
