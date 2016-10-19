import React from 'react';
import Nav from 'react-bootstrap/lib/Nav';
import Navbar from 'react-bootstrap/lib/Navbar';
import NavDropdown from 'react-bootstrap/lib/NavDropdown';
import MenuItem from 'react-bootstrap/lib/MenuItem';
import OverviewComponent from './OverviewComponent';
import NextStepsComponent from './NextStepsComponent';
import find from 'lodash.find';

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

export default React.createClass({
  propTypes: {
    graph: React.PropTypes.object.isRequired,
    location: React.PropTypes.string.isRequired,
  },

  getLocation() {
    const location = this.props.location.split('/');
    const view = location[0] || VIEWS[0].name;
    let milestone = location[1];
    if (!milestone || !this.props.graph.byName[milestone]) {
      milestone = 'all';
    }

    return { view, milestone };
  },

  setLocation({ view, milestone }) {
    const existing = this.getLocation();
    const hash = `${view || existing.view}/${milestone || existing.milestone}`;
    window.location.hash = hash;
  },

  render() {
    const { view, milestone } = this.getLocation();
    const viewInfo = find(VIEWS, { name: view }) || VIEWS[0];
    const milestones = this.props.graph.milestones();

    let graph = this.props.graph;
    if (milestone !== 'all') {
      graph = graph.subgraph(milestone);
    }

    return <div>
      <div id="navbar">
        <Navbar fluid={true} inverse={true} staticTop={true}>
          <Navbar.Header>
            <Navbar.Brand>
              <a href="/">TaskCluster Migration Work Graph</a>
            </Navbar.Brand>
          </Navbar.Header>
          <Navbar.Text>{viewInfo.title} / {milestone}</Navbar.Text>
          <Nav pullRight={true}>
            <NavDropdown title="Milestone" id="milestone">
              <MenuItem onClick={() => { this.setLocation({ milestone: 'all' }); }}>
                All Work Items
              </MenuItem>
              {milestones
                .map((ms, index) =>
                  <MenuItem key={index}
                      onClick={() => { this.setLocation({ milestone: ms.name }); }}>
                    {ms.name}
                  </MenuItem>
                )
              }
            </NavDropdown>
          </Nav>
          <Nav pullRight={true}>
            <NavDropdown title="View" id="view">
              {VIEWS
                .map((entry, index) =>
                  <MenuItem key={index} onClick={() => { this.setLocation({ view: entry.name }); }}>
                    {entry.title}
                  </MenuItem>
                )
              }
            </NavDropdown>
          </Nav>
        </Navbar>
      </div>
      <div id="content">
        <viewInfo.component graph={graph}/>
      </div>
    </div>;
  },
});

