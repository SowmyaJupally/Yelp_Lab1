import React, { Component } from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import { Redirect } from 'react-router';
import logo from '../../yelp.png';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Dropdown } from 'react-bootstrap';
import { ThemeConsumer } from 'react-bootstrap/esm/ThemeProvider';


//Define a Login Component
class CustomerHome extends Component {
  //call the constructor method
  constructor(props) {
    //Call the constrictor of Super class i.e The Component
    super(props);
    //maintain the state required for this component
    this.state = {

      res_name: "",
      address: "",
      cuisine: "",
      timings: "",
      homeFlag: false
    }
    //Bind the handlers to this class
    //some change 
    this.handleLogout = this.handleLogout.bind(this)
    this.res_nameHandler = this.res_nameHandler.bind(this);
    this.addressChangeHandler = this.addressChangeHandler.bind(this);
    this.cuisineChangeHandler = this.cuisineChangeHandler.bind(this);
    this.timingsChangeHandler = this.timingsChangeHandler.bind(this);
    this.submitEvents = this.submitEvents.bind(this);

  }

  handleLogout = () => {
    cookie.remove('cookie', { path: '/' })
    console.log("logout done")
    localStorage.clear()
    this.setState({
      a:"a"
    })
    
  }
  //Call the Will Mount to set the auth Flag to false
  componentWillMount() {
    this.setState({
      homeFlag: false
    })
  }

  res_nameHandler = (e) => {
    this.setState({
      res_name: e.target.value
    })
  }

  addressChangeHandler = (e) => {
    this.setState({
      address: e.target.value
    })
  }

  cuisineChangeHandler = (e) => {
    this.setState({
      cuisine: e.target.value
    })
  }

  timingsChangeHandler = (e) => {
    this.setState({
      timings: e.target.value
    })
  }


  //submit event handler to send a request to the node backend
  submitEvents = (e) => {
    //prevent page from refresh
    e.preventDefault();
    const data = {
      res_name: this.state.res_name,
      address: this.state.address,
      cuisine: this.state.cuisine,
      timings: this.state.timings
    }
    //set the with credentials to true
    axios.defaults.withCredentials = true;
    //make a post request with the user data
    axios.post('http://localhost:3001/customerhome', data)
      .then(response => {
        console.log("Status Code : ", response.status);
        if (response.status === 200) {
          this.setState({
            homeFlag: true
          })
        } else {
          this.setState({
            homeFlag: false
          })
        }

      });
  }


  render() {
    //redirect based on successful login
    let redirectVar = null;
    let homeComponent = null;

    console.log('Cookie:', cookie.load('cookie'))
    if (!cookie.load('cookie')) {
      console.log("Cookie Loaded");
      redirectVar = <Redirect to="/login" />
    }
    return (
      <div>
        {redirectVar}

        <React.Fragment>
          <div className='bg-overlay'>
            
          <div className='container'>
            <div className='row' style={{ paddingTop: '3%' }}>
              <div className='col-md-9'>
                <a href='/reviews' className='nav-landing'>
                  Write a Review
            </a>
                <a href='/events' className='nav-landing'>
                  Events
            </a>
                <a href='/restaurants' className='nav-landing'>
                  Restaurants
            </a>
              </div>
              <li className='nav-item'>
                <Dropdown style={{ float: 'right' }}>
                  <Dropdown.Toggle variant='secondary' id='dropdown-basic'>
                    <i className='far fa-user'></i>
                  </Dropdown.Toggle>
                  <Dropdown.Menu>
                    <Dropdown.Item href='/profile'>
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
            </div>
          </div>
          
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
      </div>


    )
  }
}

//export Login Component
export default CustomerHome;