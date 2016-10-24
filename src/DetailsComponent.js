import React from 'react';
import Panel from 'react-bootstrap/lib/Panel';
import { Link, IndexLink } from 'react-router';

export const DetailsGraph = () => <h1>To Do</h1>;

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

  toggleVisible(name) {
    const update = {};
    update[name] = !this.state.visible[name];
    this.setState({
      visible: { ...this.state.visible, ...update },
    });
  },

  render() {
    const graph = this.context.graph;
    const blocked = [];
    const inProgress = [];
    const ready = [];
    const done = [];

    graph.nodes.forEach(node => {
      if (node.done) {
        done.push(node);
      } else if (!node.dependencies.length) {
        if (node.assigned) {
          inProgress.push(node);
        } else {
          ready.push(node);
        }
      } else {
        blocked.push(node);
      }
    });

    const listItems = (name, title, nodes) => {
      const visible = this.state.visible[name];
      const header = (
        <h2 onClick={() => this.toggleVisible(name)}>
          {title}
        </h2>
      );

      if (!nodes.length) {
        return (
          <Panel collapsible expanded={visible} header={header}>
            <span className="text-muted">no items</span>
          </Panel>
        );
      }

      return <Panel collapsible expanded={visible} header={header}>
        <ul>
          {
            nodes.map(node => <li key={node.name}>{node.title}</li>)
          }
        </ul>
      </Panel>;
    };
    return <div className="container-fluid">
      {listItems('blocked', 'Blocked', blocked)}
      {listItems('inProgress', 'In Progress', inProgress)}
      {listItems('ready', 'Ready', ready)}
      {listItems('done', 'Done', done)}
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
      <nav>
        <ul className="nav nav-tabs">
          <Tab to={root} onlyActiveOnIndex>Graph</Tab>
          <Tab to={`${root}/kanban`}>Kanban</Tab>
        </ul>
        {this.props.children}
      </nav>
    );
  },
});

