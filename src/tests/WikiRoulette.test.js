import React from 'react';
import ReactDOM from 'react-dom';
import WikiRoulette from '../components/WikiRoulette';

it('renders without crashing', () => {
	const div = document.createElement('div');
	ReactDOM.render(<WikiRoulette />, div);
	ReactDOM.unmountComponentAtNode(div);
});
