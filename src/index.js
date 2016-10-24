import React from 'react';
import ReactDOM from 'react-dom';
import WorkGraph from './WorkGraph';
import App from './App';
import graphData from '../workgraph/index.yml';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

ReactDOM.render(<App graph={new WorkGraph(graphData)}/>, document.getElementById('root'));
