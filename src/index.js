import React from 'react';
import ReactDOM from 'react-dom';
import WikiRoulette from './WikiRoulette';
import registerServiceWorker from './registerServiceWorker';
import './scss/index.scss';

ReactDOM.render(<WikiRoulette />, document.getElementById('root'));
registerServiceWorker();
