// @flow
import * as React from 'react';
import { useEffect, useMemo, useState } from 'react';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import useEventCallback from '@restart/hooks/useEventCallback';
import CylinderContext from './CylinderContext';
import MountedArticle from './MountedArticle';
import { generateKey, storeKey } from '../utils/keygen';
import type { Article } from './WikiArticle';
import '../scss/_Cylinder.scss';

type ArticleWithKey = {
	...Article,
	key?: string
};

type Props = {
	articles?: Array<ArticleWithKey>
};

const Cylinder = ({ articles: articlesProp = [] }: Props) => {
	// indicates the currently active article by element ID
	const [activeId, setActiveId] = useState();

	// an array of article data to be passed as props to `WikiArticle`
	const [articles, setArticles] = useState(articlesProp);

	// toggles the ability to add articles, disabled while another is loading
	const [appendIsEnabled, setAppendIsEnabled] = useState(true);

	// applies inline tranformation styling to move the cylinder
	const [style, setStyle] = useState({});

	/**
	 * Appends a new article.
	 */
	const appendArticle = () => {
		setAppendIsEnabled(false);
		setArticles([...articles, {}]);
	};

	/**
	 * Passed as callback function to `WikiArticle` to re-enabled append
	 * button once article data has loaded.
	 */
	const enableAppendButton = () => setAppendIsEnabled(true);

	/**
	 * Updates the active article ID.
	 */
	const highlightActive = useEventCallback(id => setActiveId(id));

	/**
	 * Updates the position of the cylinder.
	 */
	const spin = useEventCallback((offset: ?number) =>
		setStyle({
			transform: `translateY(-${offset || 0}px)`
		})
	);

	/**
	 * Context to be passed to articles to update Cylinder state.
	 */
	const cylinderContext = useMemo(() => ({ highlightActive, spin }), [
		highlightActive,
		spin
	]);

	/**
	 * initialize article if none provided, doing in `useEffect` also allows
	 * `CSSTransition` to affect initial article
	 */
	useEffect(() => {
		if (articles.length === 0) appendArticle();
	}, []); // eslint-disable-line react-hooks/exhaustive-deps

	// mounted articles to render with animation and context wrappers applied
	const articlesToMount = articles.map(article => {
		const articleData = article;
		const { key: keyProp, ...rest } = articleData;
		let key = keyProp;

		if (!key) {
			key = generateKey();
			articleData.key = key;
		} else {
			storeKey(key);
		}

		return (
			<CSSTransition
				key={`article-transition-${key}`}
				timeout={300}
				classNames="articles-item"
			>
				<li>
					<CylinderContext.Provider
						key={`article-context-${key}`}
						value={cylinderContext}
					>
						<MountedArticle
							{...rest}
							id={`article-${key}`}
							isActive={activeId === `article-${key}`}
							onArticleLoad={enableAppendButton}
						/>
					</CylinderContext.Provider>
				</li>
			</CSSTransition>
		);
	});

	return (
		<div className="cylinder">
			<TransitionGroup
				className="articles"
				component="ul"
				{...(Object.keys(style).length > 0 ? { style } : {})}
			>
				{articlesToMount}
			</TransitionGroup>
			<div className="cylinder-options">
				<button
					className="wr-button add-article"
					type="button"
					onClick={appendArticle}
					disabled={!appendIsEnabled}
				>
					<i className="material-icons">
						{appendIsEnabled ? 'add_circle_outline' : 'hourglass_empty'}
					</i>
				</button>
			</div>
		</div>
	);
};

Cylinder.defaultProps = {
	articles: []
};

export default Cylinder;
