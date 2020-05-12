import React from 'react';
import ReactDOM from 'react-dom';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from './store';
import { mount, shallow } from './tests/enzyme';

// apply commonly used testing variables to global to minimize imports
global.React = React;
global.ReactDOM = ReactDOM;
global.act = act;
global.Provider = Provider;
global.configureStore = configureStore;
global.mount = mount;
global.shallow = shallow;
