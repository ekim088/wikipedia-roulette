import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import WikiRoulette from './WikiRoulette';
import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(<WikiRoulette />, document.getElementById('root'));
registerServiceWorker();
