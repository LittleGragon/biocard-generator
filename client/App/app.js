import React from 'react';
import { render } from 'react-dom';
import 'babel-polyfill';
import { BrowserRouter } from 'react-router-dom';
import RouterContent from './routes.js';
import './font/Geom_Graphic_Semi-Bold.ttf';

const rootDocument = document.getElementById('app');
render(<BrowserRouter><RouterContent /></BrowserRouter>, rootDocument);
