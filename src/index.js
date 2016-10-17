import React from 'react';
import ReactDOM from 'react-dom';
import * as graphlib from 'graphlib';
import WorkGraph from './WorkGraph';
import graphData from '../workgraph/index.yml';

const WorkGraphExplorer = React.createClass({
  render() {
    return <pre>
      {JSON.stringify(graphlib.json.write(this.props.graph.g), null, 2)}
    </pre>;
  },
});

ReactDOM.render(
  // load from the data provided by the webpack plugin
  <WorkGraphExplorer graph={new WorkGraph(graphData)} />,
  document.getElementById('root')
);
