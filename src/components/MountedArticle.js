// @flow
import React, { useContext, useEffect, useRef, useState } from 'react';
import useEventCallback from '@restart/hooks/useEventCallback';
import AppendToBody from './AppendToBody';
import CylinderContext from './CylinderContext';
import WikiArticle from './WikiArticle';
import type { Article, Props as WikiArticleProps } from './WikiArticle';

type Props = {
	...WikiArticleProps,
	isActive?: boolean
};

const MountedArticle = ({ isActive, ...rest }: Props) => {
	const {
		description: descriptionProp,
		id,
		onArticleLoad,
		title: titleProp
	} = rest;
	const [description, setDescription] = useState(descriptionProp);
	const [title, setTitle] = useState(titleProp);
	const articleRef = useRef(null);
	const context = useContext(CylinderContext);

	/**
	 * Calls parent context methods to center/highlight this article into view.
	 */
	const spinIntoView = useEventCallback(() => {
		if (articleRef.current) {
			const offset = articleRef.current.offsetTop;
			if (context) context.spin(offset);
			if (context) context.highlightActive(id);
		}
	});

	/**
	 * Updates local article data to initiate render of toggle button.
	 * @param {Object} data Article data shared by `WikiArticle`.
	 */
	const updateArticleData = (data: Article) => {
		setDescription(data.description);
		setTitle(data.title);
	};

	// spin cylinder on mount
	useEffect(() => {
		spinIntoView();
	}, [spinIntoView]);

	return (
		<>
			<WikiArticle
				{...rest}
				className={isActive ? 'active' : ''}
				onArticleLoad={data => {
					if (onArticleLoad) onArticleLoad(data);
					updateArticleData(data);
				}}
				onClick={!isActive ? spinIntoView : null}
				ref={articleRef}
			/>
			{title && description && (
				<AppendToBody containerSelector="#shortcuts" prepend>
					<div className="wr-trigger">
						<button type="button" onClick={spinIntoView}>
							<span className="trigger-title">{title}</span>
							<span className="trigger-description">{description}</span>
						</button>
					</div>
				</AppendToBody>
			)}
		</>
	);
};

MountedArticle.defaultProps = {
	...WikiArticle.defaultProps,
	isActive: false
};

export default MountedArticle;
