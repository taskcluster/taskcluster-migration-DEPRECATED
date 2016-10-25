import React from 'react';
const cytoscape = require('cytoscape');
import Well from 'react-bootstrap/lib/Well';
import './graph.css';

const STATE_COLORS = {
  done: '#80C29E',
  inProgress: '#80a4c2',
  ready: '#bf80c2',
  blocked: 'darkgray',
};

export default React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  propTypes: {
    root: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
  },

  makeCy(container) {
    const nodes = [];
    const edges = [];

    this.context.graph.nodes.forEach(node => {
      node.dependencies.forEach(dep => {
        edges.push({
          data: {
            weight: 1,
            source: node.name,
            target: dep,
          },
        });
      });
      nodes.push({
        data: {
          id: node.name,
          color: STATE_COLORS[node.state],
        },
      });
    });

    return cytoscape({
      container,

      style: cytoscape.stylesheet()
        .selector('node')
          .css({
            'background-color': 'data(color)',
          })
        .selector('edge')
          .css({
            'target-arrow-shape': 'triangle',
            width: 2,
            'line-color': '#ddd',
            'target-arrow-color': '#ddd',
            'curve-style': 'bezier',
          })
        .selector(':selected')
          .css({
            'background-blacken': '0.5',
            'line-color': '#61bffc',
            'target-arrow-color': '#61bffc',
            'transition-property': 'background-blacken, line-color, target-arrow-color',
            'transition-duration': '0.2s',
          }),

      elements: { nodes, edges },

      layout: {
        name: 'breadthfirst',
        directed: true,
        roots: `#${this.props.root}`,
        padding: 1,
      },
    });
  },

  handleSelected() {
    const selected = this.cy.$(':selected');
    if (selected.length === 1) {
      this.props.onSelect(selected[0].id());
    } else {
      this.props.onSelect(null);
    }
  },

  componentDidMount() {
    this.cy = this.makeCy(this.domElement);
    this.cy.on('select', this.handleSelected);
    this.cy.on('unselect', this.handleSelected);
  },

  componentWillUnmount() {
    this.cy.destroy();
  },

  render() {
    return (
      <Well bsSize="large">
        <div id="cy" ref={elt => { this.domElement = elt; }} />
      </Well>
    );
  },
});

