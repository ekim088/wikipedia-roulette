import React from 'react';
import ReactDOM from 'react-dom';
import WikiRoulette from './WikiRoulette';
import registerServiceWorker from './registerServiceWorker';
import './build/index.css';

ReactDOM.render(<WikiRoulette />, document.getElementById('root'));
registerServiceWorker();
