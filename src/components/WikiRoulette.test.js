import React from 'react';
import ReactDOM from 'react-dom';
import WikiRoulette from './WikiRoulette';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<WikiRoulette />, div);
	ReactDOM.unmountComponentAtNode(div);
});
