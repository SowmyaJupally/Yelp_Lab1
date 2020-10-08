import React, { Component } from 'react';
import Navbar from './NavLandingPage';
import logo from './yelp.png';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import '../../App.css';

class LandingPage extends Component {
  render() {
    return (
      <React.Fragment>
        <div className='bg-overlay'>
          <Navbar></Navbar>
          <div className='container'>
            <div className='landing-header'>
              <img src={logo} className='logo'></img>
              <div className='input-group'>
                <span className='form-rounded'>Find</span>
                <input
                  autoComplete='off'
                  maxLength='64'
                  placeholder='plumbers, delivery, takeout...'
                  aria-autocomplete='list'
                  tabIndex='1'
                  className='form-control landingtextbox'
                />

                <input
                  autoComplete='off'
                  maxLength='64'
                  placeholder='address...'
                  aria-autocomplete='list'
                  tabIndex='1'
                  className='form-control landingtextbox'
                />
                <button
                  style={{
                    width: '5%',
                    opacity: '1.0',
                    backgroundColor: 'red',
                  }}
                  type='button'
                  className='btn'>
                  <i className='fas fa-search'></i>
                </button>
              </div>
              <br />
            </div>
          </div>
        </div>
      </React.Fragment>
    );
  }
}

export default LandingPage;
