import React from 'react';
const cytoscape = require('cytoscape');
import Well from 'react-bootstrap/lib/Well';
import './graph.css';

export default React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  propTypes: {
    root: React.PropTypes.string.isRequired,
    onSelect: React.PropTypes.func.isRequired,
    showDone: React.PropTypes.bool,
  },

  makeStyle(style) {
    return style
      .selector('node')
        .css({
          shape: 'data(shape)',
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
        })
      .selector('.done')
        .css({
          'background-color': '#80C29E',
          display: this.props.showDone ? 'element' : 'none',
        })
      .selector('.inProgress')
        .css({
          'background-color': '#80a4c2',
        })
      .selector('.ready')
        .css({
          'background-color': '#bf80c2',
        })
      .selector('.blocked')
        .css({
          'background-color': 'darkgray',
        });
  },

  makeCy(container) {
    const graph = this.context.graph.transitiveReduction();

    const nodes = [];
    const edges = [];

    graph.nodes.forEach(node => {
      node.dependencies.forEach(dep => {
        edges.push({
          data: {
            weight: 1,
            source: node.name,
            target: dep,
          },
          selectable: false,
        });
      });
      let shape = 'ellipse';
      if (node.external) {
        shape = 'diamond';
      }
      if (node.milestone) {
        shape = 'square';
      }

      nodes.push({
        data: {
          id: node.name,
          shape,
        },
        classes: node.state,
      });
    });

    return cytoscape({
      container,

      style: this.makeStyle(cytoscape.stylesheet()),

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

  componentDidUpdate() {
    this.makeStyle(this.cy.style().resetToDefault())
      .update();
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

