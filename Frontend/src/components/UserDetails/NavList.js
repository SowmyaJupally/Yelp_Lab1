import React, { Component } from 'react';
import { ListGroup } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import styled from 'styled-components';

const StyledLink = styled(NavLink)`
  display: block;
  position: relative;
  transition: background-color 200ms ease-out 50ms;
  &:focus,
  &:hover,
  &:visited,
  &:link {
    text-decoration: none;
    color: #333;
  }
  activeStyle {
    backgroung-color: #d3d3d3;
  }
`;

class NavList extends Component {
  render() {
    const name = localStorage.getItem('first_name');
    return (
      <div className='col-md-8' style={{ marginLeft: '10%' }}>
        <h5>{name}'s Profile</h5>
        <ListGroup
          variant='flush'
          style={{ marginBottom: '20%', padding: '0%' }}>
          <ListGroup.Item action variant='light'>
            <StyledLink to='/userdetails/user_details'>Profile Overview</StyledLink>
          </ListGroup.Item>
          <ListGroup.Item action variant='light'>
            <StyledLink to='/userdetials/basic_details'> Basic Details</StyledLink>
          </ListGroup.Item>
          <ListGroup.Item action variant='light'>
            <StyledLink to='/userdetails/about_section'>About Me</StyledLink>
          </ListGroup.Item>
          <ListGroup.Item action variant='light'>
            <StyledLink to='/userdetails/contact_info' activeClassName='active'>
              Contact Information
            </StyledLink>
          </ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}

export default NavList;
