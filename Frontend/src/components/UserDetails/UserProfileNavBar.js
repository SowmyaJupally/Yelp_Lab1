import React, { Component } from 'react';

import 'bootstrap/dist/css/bootstrap.css';
import logo from '../../yelp.png';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../App.css';
import { Dropdown } from 'react-bootstrap';

class UserProfileNavBar extends Component {
  state = {};
  render() {
    return (
      <nav className='navbar navbar-expand-lg navbar-light bg-light'>
        <div className='collapse navbar-collapse' id='navbarSupportedContent'>
          <a href='/'>
            <img
              src={logo}
              alt='logo'
              className='banner-img profile-logo'></img>
          </a>
        </div>
        <div className='nav-search-btn'>
          <form className='form-inline my-2 my-lg-0'>
            <input
              className='form-control mr-sm-2'
              type='search'
              placeholder='Search'
              aria-label='Search'
              maxLength='64'
            />
            <input
              className='form-control mr-sm-2'
              type='search'
              placeholder='Search'
              aria-label='Search'
              maxLength='64'
            />
            <br></br>
            <button
              style={{
                width: '8%',
                backgroundColor: 'red',
              }}
              type='button'
              className='btn'>
              <i className='fas fa-search'></i>
            </button>
          </form>
        </div>
        <div>
          <ul className='navbar-nav mr-auto'>
            <li className='nav-item active'>
              <a className='nav-link' href='reviews'>
                Write a Review <span className='sr-only'>(current)</span>
              </a>
            </li>
            <li className='nav-item'>
              <Dropdown style={{ float: 'right' }}>
                <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
                  <i className='far fa-user'></i>
                </Dropdown.Toggle>
                <Dropdown.Menu>
                  <Dropdown.Item href='/userdetails'>
                    <span className='mr-2'>
                      <i className='far fa-user'></i>
                    </span>
                    About Me
                  </Dropdown.Item>
                  <Dropdown.Divider />
                  <Dropdown.Item onClick={this.handleLogout}>
                    <span className='mr-2'>
                      <i className='fas fa-sign-out-alt'></i>
                    </span>
                    Logout
                  </Dropdown.Item>
                </Dropdown.Menu>
              </Dropdown>
            </li>
          </ul>
        </div>
      </nav>
    );
  }
}

export default UserProfileNavBar;
