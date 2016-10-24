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
  },

  extractGraph() {
    const links = [];

    this.context.graph.nodes.forEach(node => {
      node.dependencies.forEach(dep => {
        links.push({ source: node.name, target: dep });
      });
    });

    return {
      nodes: this.context.graph.nodes,
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
      .attr('r', 7)
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

    this.makeSvg(links, nodes);
    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id(d => d.name))
      .force('charge', d3.forceManyBody())
      .force('center', d3.forceCenter(this.props.width / 2, this.props.height / 2));

    this.simulation.on('tick', this.updateSvg);
    this.simulation.nodes(nodes);
    this.simulation.force('link').links(links);
  },

  componentDidUpdate() {
    // update with new state
  },

  componentWillUnmount() {
    // TODO: this lifecycle is wrong, and we keep creating new simultations..
    this.simulation.stop();
  },

  render() {
    return <div ref={elt => { this.domElement = elt; }} />;
  },
});
