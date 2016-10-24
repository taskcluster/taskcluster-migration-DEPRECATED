import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import Col from 'react-bootstrap/lib/Col';
import Row from 'react-bootstrap/lib/Row';
import WorkItem from './WorkItem';
import GraphComponent from './GraphComponent';
import { Link, IndexLink } from 'react-router';
import './details.css';

export const DetailsGraph = React.createClass({
  render() {
    return <GraphComponent width={600} height={600} root={this.props.params.rootWorkItem}/>;
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

    const byState = { blocked: [], inProgress: [], ready: [], done: [] };
    graph.nodes.forEach(node => byState[node.state].push(node));

    const listItems = (state, title) => {
      const visible = this.state.visible[state];
      const nodes = byState[state];

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
            // TODO: use react-columns?  Or all in one column?  Order will matter..
            nodes.map(node => (
              <Col xs={12} lg={6}>
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

