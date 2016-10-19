import React from 'react';
import ReactDOM from 'react-dom';
import WorkGraph from './WorkGraph';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import OverviewComponent from './OverviewComponent';
import NextStepsComponent from './NextStepsComponent';
import graphData from '../workgraph/index.yml';
import find from 'lodash.find';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css';

const VIEWS = [
  {
    name: 'overview',
    title: 'Overview',
    component: OverviewComponent,
  },
  {
    name: 'next-steps',
    title: 'Next Steps',
    component: NextStepsComponent,
  },
];

const WorkGraphExplorer = React.createClass({
  propTypes: {
    graph: React.PropTypes.object.isRequired,
  },

  getInitialState() {
    return {
      milestone: null,
      view: VIEWS[0].name,
    };
  },

  render() {
    const currentView = find(VIEWS, { name: this.state.view }) || VIEWS[0];
    const milestoneName = this.state.milestone ? this.state.milestone : 'All Work Items';
    const milestones = this.props.graph.milestones();

    let graph = this.props.graph;
    if (this.state.milestone) {
      graph = graph.subgraph(this.state.milestone);
    }

    return <div>
      <div id="navbar">
        <Navbar fluid={true} inverse={true} staticTop={true}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">TaskCluster Migration Work Graph</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Text>{currentView.title} / {milestoneName}</Navbar.Text>
          <Nav pullRight={true}>
            <NavDropdown title="Milestone" id="milestone">
              <MenuItem onClick={() => { this.setState({ milestone: null }); }}>
                All Work Items
              </MenuItem>
              {milestones
                .map((milestone, index) =>
                  <MenuItem key={index}
                      onClick={() => { this.setState({ milestone: milestone.name }); }}>
                    {milestone.name}
                  </MenuItem>
                )
              }
            </NavDropdown>
          </Nav>
          <Nav pullRight={true}>
            <NavDropdown title="View" id="view">
              {VIEWS
                .map((entry, index) =>
                  <MenuItem key={index} onClick={() => { this.setState({ view: entry.name }); }}>
                    {entry.title}
                  </MenuItem>
                )
              }
            </NavDropdown>
          </Nav>
        </Navbar>
      </div>
      <div id="content">
        <currentView.component graph={graph}/>
      </div>
    </div>;
  },
});

ReactDOM.render(
  // load from the data provided by the webpack plugin
  <WorkGraphExplorer graph={new WorkGraph(graphData)} />,
  document.getElementById('root')
);
