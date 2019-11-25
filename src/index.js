import React from 'react';
import ReactDOM from 'react-dom';
import registerServiceWorker from './registerServiceWorker';
import WikiRoulette from './WikiRoulette';
import './scss/index.scss';

ReactDOM.render(<WikiRoulette />, document.getElementById('root'));
registerServiceWorker();
