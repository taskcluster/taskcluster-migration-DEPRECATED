import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import Button from 'react-bootstrap/lib/Button';
import Alert from 'react-bootstrap/lib/Alert';
import WorkItem from './WorkItem';
import GraphDisplay from './GraphDisplay';
import { Link, IndexLink } from 'react-router';
import './details.css';

export const DetailsGraph = React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      showDone: true,
      selectedNode: null,
    };
  },

  handleNodeSelected(name) {
    this.setState({ selectedNode: name });
  },

  renderNodeInfo() {
    const node = this.context.graph.byName[this.state.selectedNode];

    if (!node) {
      return (
        <Alert bsStyle="info">
          <p>Select a node in the graph to see details about it</p>
        </Alert>
      );
    }

    return <WorkItem node={node} detailed />;
  },

  render() {
    return (
      <Row>
        <Col className="hidden-xs hidden-sm" md={7}>
          <GraphDisplay
            root={this.props.params.rootWorkItem}
            onSelect={this.handleNodeSelected}
            showDone={this.state.showDone} />
            <div className="pull-right">
              <Button bsStyle="info" bsSize="small"
                  onClick={() => this.setState({ showDone: !this.state.showDone })}>
                {this.state.showDone ? 'Hide' : 'Show'} completed
              </Button>
            </div>
        </Col>
        <Col className="hidden-md hidden-lg" xs={6}>
          <ul>
            {this.context.graph.nodes.map(node => (
              <li key={node.name} onClick={() => this.handleNodeSelected(node.name)}>
                {node.name}
              </li>
            ))}
          </ul>
        </Col>
        <Col xs={6} md={5}>
          {this.renderNodeInfo()}
        </Col>
      </Row>
    );
  },
});

export const DetailsKanban = React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      visible: {
        blocked: false,
        inProgress: true,
        ready: true,
        done: false,
      },
    };
  },

  toggleVisible(state) {
    const update = {};
    update[state] = !this.state.visible[state];
    this.setState({
      visible: { ...this.state.visible, ...update },
    });
  },

  render() {
    const graph = this.context.graph;
    const distances = graph.rootDistances(this.props.params.rootWorkItem);

    const byState = { blocked: [], inProgress: [], ready: [], done: [] };
    graph.nodes.forEach(node => byState[node.state].push(node));

    const listItems = (state, title) => {
      const visible = this.state.visible[state];
      const nodes = byState[state];

      // sort the longest distances first
      nodes.sort((a, b) => distances[b.name] - distances[a.name]);

      const header = (
        <h2 onClick={() => this.toggleVisible(state)}>
          {title}
        </h2>
      );

      const className = `wi-${state}`;

      if (!nodes.length) {
        return (
          <Panel collapsible expanded={visible} header={header}>
            <span className="text-muted">no items</span>
          </Panel>
        );
      }

      return <Panel collapsible className={className} expanded={visible} header={header}>
        <Row>
          {
            nodes.map(node => (
              <Col key={node.name} xs={12}>
                <WorkItem node={node} />
              </Col>
            ))
          }
        </Row>
      </Panel>;
    };
    return <div className="container-fluid">
      {listItems('blocked', 'Blocked')}
      {listItems('inProgress', 'In Progress')}
      {listItems('ready', 'Ready')}
      {listItems('done', 'Done')}
    </div>;
  },
});

const Tab = React.createClass({
  // see http://brandonlehr.com/bootstrap-tabs-react-router-and-the-active-class/
  contextTypes: {
    router: React.PropTypes.object.isRequired,
  },

  propTypes: {
    to: React.PropTypes.string,
    onlyActiveOnIndex: React.PropTypes.bool,
    children: React.PropTypes.node,
  },

  render() {
    const isActive = this.context.router.isActive(this.props.to, this.props.onlyActiveOnIndex);
    const LinkComponent = this.props.onlyActiveOnIndex ? IndexLink : Link;
    const className = isActive ? 'active' : '';

    return (
      <li className={className}>
        <LinkComponent to={this.props.to}>{this.props.children}</LinkComponent>
      </li>
    );
  },
});

export const DetailsComponent = React.createClass({
  contextTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  childContextTypes: {
    graph: React.PropTypes.object,
  },

  getChildContext() {
    // limit the graph to work items rooted at rootWorkItem and pass that along as
    // the graph context
    const graph = this.props.params.rootWorkItem === 'all' ?
      this.context.graph :
      this.context.graph.subgraph(this.props.params.rootWorkItem);
    return { graph };
  },

  render() {
    const root = `/details/${this.props.params.rootWorkItem}`;
    return (
      <div>
        <nav>
          <ul className="nav nav-tabs">
            <Tab to={root} onlyActiveOnIndex>Graph</Tab>
            <Tab to={`${root}/kanban`}>Kanban</Tab>
          </ul>
        </nav>
        <div className="details-pane">
          {this.props.children}
        </div>
      </div>
    );
  },
});

