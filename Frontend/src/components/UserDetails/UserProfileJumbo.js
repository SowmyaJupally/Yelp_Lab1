import React, { Component } from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/js/bootstrap.min';
import { Card, CardImg, Jumbotron } from 'react-bootstrap';
import profilepic from '../../yelp.png';
import '../../App.css';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getCustomerDetails } from '../../actions/customerProfileAction';

class UserProfileJumbo extends Component {
  constructor(props) {
    super(props);
    this.state = {
      // profileImage: '',
      // uploadedFile: '',
      // fileText: '',
    };
    this.changeProfileImage = this.changeProfileImage.bind(this);
  }

  componentWillMount() {
    this.props.getCustomerDetails();
  }

  changeProfileImage = (e) => {
    this.setState({
      uploadedFile: e.target.files[0],
      fileText: e.target.files[0].name,
    });
    console.log(e.target.files[0]);
  };

  render() {
    return (
      <React.Fragment>
        <Jumbotron>
          <div className='row'>
            <div
              className=' col-md-2 card profilePic'
              style={{ position: 'absolute' }}>
              <label htmlFor='profileImage'>
                <a
                  href='#'
                  className='btn btn-secondary btn-sm btn-rounded'
                  style={{ marginLeft: '10px', marginTop: '10px' }}>
                  <i
                    className='fas fa-camera'
                    style={{ marginRight: '10px' }}></i>
                  Add a photo
                </a>
              </label>
              <input
                type='file'
                name='profileImage'
                id='profileImage'
                style={{ display: 'none' }}
                value=''
                onChange={this.changeProfileImage}></input>
              <CardImg variant='top' src={profilepic} className='profileImg' />
            </div>
            <div className='col-md-3'></div>
            <div className='col-md-4 profileName'>
              <h1 className='h1 display-5'>
                {this.props.user.firstname} {this.props.user.lastname}
              </h1>
              <h5>{this.props.user.city}</h5>
              <br />
              <h6>"{this.props.user.headline}"</h6>
            </div>
            <div className='col-md-3 vertical-divider'>
              <ul className='list-unstyled'>
                <li>
                  <a href='#'>
                    <span>
                      <i className='fas fa-camera'></i>{' '}
                    </span>
                    Add Profile Photo
                  </a>
                </li>
                <li>
                  <a href='/userdetails/basic_details'>
                    <span>
                      <i className='fas fa-id-card'></i>{' '}
                    </span>
                    Update your profile
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </Jumbotron>
      </React.Fragment>
    );
  }
}

UserProfileJumbo.propTypes = {
  getCustomerDetails: PropTypes.func.isRequired,
  user: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  user: state.CustomerDetails.user,
});

export default connect(mapStateToProps, { getCustomerDetails })(
  UserProfileJumbo,
);
