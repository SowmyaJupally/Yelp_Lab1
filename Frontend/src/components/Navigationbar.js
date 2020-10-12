
import React, { Component } from "react";
import { Link } from "react-router-dom";
import { connect } from 'react-redux';
import grubhubLogo from "../Images/yelplogo.png";
import cartIcon from "../Images/cart.png";
import menuIcon from "../Images/menu.png";
import historyIcon from "../Images/history.png";
import futureIcon from "../Images/future.png";
import userIcon from "../Images/user.png";
import logoutIcon from "../Images/logout.png";
import cookie from 'react-cookies';
import { Navbar, Nav, Dropdown } from 'react-bootstrap';

//create the Navbar Component
class Navigationbar extends Component {
  constructor() {
    super();
    this.state = {
      name: localStorage.getItem("name")
    }
  }

  //handle logout to destroy the cookie
  handleLogout = () => {
    cookie.remove('cookie', { path: '/' })
    console.log("logout done")
    localStorage.clear()
    
    this.setState({
      a:"a"
    })
  };

  render() {
    let navUser = null;
    let pendingOrders = null;
    let nameMsg = null;

    if (localStorage.getItem("is_owner") === "0") {
      pendingOrders = (<Dropdown.Item><Link to="/orders" class="nav-link"><img src={futureIcon} width="20" height="auto" class="d-inline-block align-top" alt="" />&nbsp;&nbsp;Pending Orders</Link></Dropdown.Item>);
    }

    nameMsg = (
      <Dropdown>
        <Dropdown.Toggle variant="link" id="dropdown-basic">
          Hi, {this.state.name}!
        </Dropdown.Toggle>
        <Dropdown.Menu>
          <Dropdown.Item><Link to="/ownerprofile" class="nav-link"><img src={userIcon} width="20" height="auto" class="d-inline-block align-top" alt="" />&nbsp;&nbsp;Profile</Link></Dropdown.Item>
          <Dropdown.Item><Link to="/menu" class="nav-link"><img src={userIcon} width="20" height="auto" class="d-inline-block align-top" alt="" />&nbsp;&nbsp;Menu</Link></Dropdown.Item>
          <Dropdown.Item><Link to="/createevents" class="nav-link"><img src={userIcon} width="20" height="auto" class="d-inline-block align-top" alt="" />&nbsp;&nbsp;Events</Link></Dropdown.Item>
          <Dropdown.Item><Link to="/orders/history" class="nav-link"><img src={historyIcon} width="20" height="auto" class="d-inline-block align-top" alt="" />&nbsp;&nbsp;Past Orders</Link></Dropdown.Item>
          {pendingOrders}
          <Dropdown.Item><Link to="/RestaurantEvents" class="nav-link"><img src={userIcon} width="20" height="auto" class="d-inline-block align-top" alt="" />&nbsp;&nbsp;Existing Events</Link></Dropdown.Item>
          
          <Dropdown.Item><Link to="/" class="nav-link" onClick={this.handleLogout}><img src={logoutIcon} width="20" height="auto" class="d-inline-block align-top" alt="" />&nbsp;&nbsp;Logout</Link></Dropdown.Item>
        </Dropdown.Menu>
      </Dropdown>
    );

    if (localStorage.getItem("user_id")) {
      if (localStorage.getItem("is_owner") === "1") {
        navUser = (
          <div class="collapse navbar-collapse navbar-right" id="navbarNav">
            <Nav className="mr-auto">
            </Nav>
            <Nav.Link>{nameMsg}</Nav.Link>
            <Nav.Link>
              <Link to="/menu/view" class="nav-link" href="#">
                <img src={menuIcon} width="35" height="auto" class="d-inline-block align-top" alt="Menu" />
              </Link>
            </Nav.Link>
          </div>
        );
      }
      else {
        navUser = (
          <div class="collapse navbar-collapse navbar-right" id="navbarNav">
            <Nav className="mr-auto">
            </Nav>
            <Nav.Link>{nameMsg}</Nav.Link>
            <Nav.Link>
              <Link to="/cart" class="nav-link" href="#">
                <img src={cartIcon} width="35" height="auto" class="d-inline-block align-top" alt="Cart" />
              </Link>
            </Nav.Link>
          </div>

        );
      }
    }
    else {
      navUser = (
        <div class="collapse navbar-collapse navbar-right" id="navbarNav">
          <Nav className="mr-auto">
          </Nav>
          <Nav.Link><Link to="/login" class="nav-link"><img src={userIcon} width="20" height="auto" class="d-inline-block align-top" alt="" />&nbsp;Login</Link></Nav.Link>
        </div>

      );
    }

    return (
      <div>
        <Navbar bg="light" variant="light">
          <Navbar.Brand>
            <Link to='/' class="nav-link" href="#">
              <img src={grubhubLogo} width="100" height="auto" class="d-inline-block align-top" alt="Grubhub" />
            </Link>
          </Navbar.Brand>
          {navUser}
        </Navbar>
      </div>
    );
  }
}

export default (Navigationbar);