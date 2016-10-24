import React from 'react';
const d3 = require('d3');
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
    width: React.PropTypes.number.isRequired,
    height: React.PropTypes.number.isRequired,
    root: React.PropTypes.string.isRequired,
  },

  extractGraph() {
    const root = this.props.root;
    const nodes = [];
    const links = [];

    this.context.graph.nodes.forEach(node => {
      node.dependencies.forEach(dep => {
        links.push({ source: node.name, target: dep });
      });
      const graphNode = { name: node.name, state: node.state };

      // fix the root node to the top of the graph
      if (node.name === root) {
        graphNode.fx = this.props.width / 2;
        graphNode.fy = 5;
      } else {
        graphNode.x = this.props.width / 2;
        graphNode.y = 5;
      }

      nodes.push(graphNode);
    });

    return {
      nodes,
      links,
    };
  },

  makeSvg(links, nodes) {
    this.svg = d3
      .select(this.domElement)
      .append('svg')
      .attr('class', 'd3')
      .attr('class', 'workgraph')
      .attr('width', this.props.width)
      .attr('height', this.props.height);

    this.link = this.svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke-width', 1);

    this.node = this.svg.append('g')
      .attr('class', 'nodes')
      .selectAll('circle')
      .data(nodes)
      .enter()
      .append('circle')
      .attr('r', 5)
      .attr('fill', d => STATE_COLORS[d.state]);

    this.node.append('title')
      .text(d => d.name);
  },

  updateSvg() {
    this.link
      .attr('x1', d => d.source.x)
      .attr('y1', d => d.source.y)
      .attr('x2', d => d.target.x)
      .attr('y2', d => d.target.y);

    this.node
      .attr('cx', d => d.x)
      .attr('cy', d => d.y);
  },

  componentDidMount() {
    const { links, nodes } = this.extractGraph();

    // a force that tries to point edges downward
    const treeForce = alpha => {
      const delta = alpha;

      links.forEach(({ source, target }) => {
        const expectedY = source.y + 30;
        target.vy += (expectedY - target.y) * 0.1;
      });
    };

    this.makeSvg(links, nodes);
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.name).strength(0.5).distance(30))
      .force('charge', d3.forceManyBody(-500).distanceMax(100))
      .force('tree', treeForce);

    this.simulation.on('tick', this.updateSvg);
    this.simulation.nodes(nodes);
    this.simulation.force('link').links(links);
  },

  componentDidUpdate() {
    const { links, nodes } = this.extractGraph();

    this.simulation.nodes(nodes);
    this.simulation.force('link').links(links);
    this.updateSvg();
  },

  componentWillUnmount() {
    // stop the simulation if we're being removed from the DOM..
    this.simulation.stop();
  },

  render() {
    return <div ref={elt => { this.domElement = elt; }} />;
  },
});
