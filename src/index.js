import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import configureStore from './store';
import registerServiceWorker from './registerServiceWorker';
import WikiRoulette from './components/WikiRoulette';

ReactDOM.render(
	<Provider store={configureStore()}>
		<WikiRoulette />
	</Provider>,
	document.getElementById('root')
);
registerServiceWorker();
