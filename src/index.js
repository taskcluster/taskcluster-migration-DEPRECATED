import React from 'react';
import ReactDOM from 'react-dom';
import WorkGraph from './WorkGraph';
import WorkGraphExplorer from './WorkGraphExplorer';
import graphData from '../workgraph/index.yml';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

function render() {
  const location = window.location.hash.replace(/^#\/?|\/$/g, '');
  ReactDOM.render(
    // load from the data provided by the webpack plugin
    <WorkGraphExplorer graph={new WorkGraph(graphData)} location={location}/>,
    document.getElementById('root')
  );
}

render();
window.addEventListener('hashchange', render, false);
