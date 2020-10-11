import React, { Component } from "react";
import { Redirect } from "react-router";
import { BrowserRouter as Router, NavLink, Route } from "react-router-dom";
import { Nav } from "react-bootstrap";
import Navigationbar from "../Navigationbar";
import MenuView from "./MenuView";
import MenuSections from "./MenuSections";
import MenuItems from "./MenuItems";
import EditMenuSections from './EditMenuSections';
import EditMenuItems from './EditMenuItems';

class Menu extends Component {
  constructor(props) {
    super(props);
    this.setState({
      activeTab: ""
    });

    this.onTabClick = this.onTabClick.bind(this);
  }

  componentWillMount(){
    document.title = "Your Menu"
  }
  onTabClick = e => {
    this.setState({
      activeTab: e.target.eventKey
    });
  };

  render() {
    let redirectVar = null;
    if (!localStorage.getItem("user_id") || !parseInt(localStorage.getItem("is_owner"))) {
      redirectVar = <Redirect to="/" />
    }

    return (
      <div>
        {redirectVar}
        <div>
          <Navigationbar />
        </div>
        <div>
          <Router>
            <Nav variant="tabs" >
              <Nav.Item>
                <Nav.Link eventKey="1" as={NavLink} to="/menu/view">
                  Menu
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="2" as={NavLink} to="/menu/section">
                  Menu Sections
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="3" as={NavLink} to="/menu/item">
                  Menu Items
                </Nav.Link>
              </Nav.Item>
            </Nav>
            <Route path="/menu/view" component={MenuView} />
            <Route path="/menu/section" component={MenuSections} exact/>
            <Route path="/menu/item" component={MenuItems} exact/>
            <Route path="/menu/section/update" component={EditMenuSections} />
            <Route path="/menu/item/update" component={EditMenuItems} />
          </Router>
        </div>
      </div>
    );
  }
}

export default Menu;