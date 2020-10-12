import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { ownerSignup } from '../../actions/signupAction';

//Define a Login Component
class Register extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email : "",
            password : "",
            firstName:"",
            lastName:"",
            ZIP_Code:"",
            Birthday:"",
            is_owner:"",
            registerFlag : false,
            validateError: false,
            errorRedirect : false
        }
        //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.firstNameChangeHandler = this.firstNameChangeHandler.bind(this);
        this.lastNameChangeHandler = this.lastNameChangeHandler.bind(this);
        this.ZIP_CodeChangeHandler = this.ZIP_CodeChangeHandler.bind(this);
        this.BirthdayChangeHandler = this.BirthdayChangeHandler.bind(this);
        this.is_ownerChangeHandler = this.is_ownerChangeHandler.bind(this);
        this.submitRegister = this.submitRegister.bind(this);
    }
    
    //Call the Will Mount to set register Flag to false
    componentWillMount(){
        this.setState({
            registerFlag : false
        })
    }
    //email change handler to update state variable with the text entered by the user
    emailChangeHandler = (e) => {
        this.setState({
            email : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    passwordChangeHandler = (e) => {
        this.setState({
            password : e.target.value
        })
    }
    firstNameChangeHandler = (e) => {
        this.setState({
            firstName : e.target.value
        })
    }
    lastNameChangeHandler = (e) => {
        this.setState({
            lastName : e.target.value
        })
    }
    ZIP_CodeChangeHandler = (e) => {
        this.setState({
            ZIP_Code : e.target.value
        })
    }
    BirthdayChangeHandler = (e) => {
        this.setState({
            Birthday : e.target.value
        })
    }

    is_ownerChangeHandler = (e) => {
        this.setState({
            is_owner : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitRegister = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email : this.state.email,
            password : this.state.password,
            firstName : this.state.firstName,
            lastName : this.state.lastName,
            ZIP_Code : this.state.ZIP_Code,
            Birthday : this.state.Birthday,
            is_owner: this.state.is_owner

        }
        if(this.state.email == "" || this.state.password == "" || this.state.firstName == "" || this.state.lastName == "" || this.state.Birthday == ""){
            this.setState({
                validateError:true
            })
        }

        this.props.ownerSignup(data);

        this.setState({
            signupFlag: 1
        });
        
    }
    render(){
        //redirect based on successful login
        let redirectVar = null;
        if(cookie.load('cookie')){
            console.log("Cookie Loaded");
            redirectVar = <Redirect to= "/home"/>
        }
        if(this.state.registerFlag === true){
            redirectVar = <Redirect to ="/login"/>
        }
        if (this.state.errorRedirect === true) {
            redirectVar = "User Already exists!!"
        }
        let errorAlert = null;
        if(this.state.validateError === true){
            errorAlert = <div>
            <div className="alert alert-danger" role="alert">
                <strong>Error!</strong> Fill all the fields to proceed!
            </div>
        </div>

        }
        if(this.state.registerFlag===2)
        redirectVar=<p style={{color:"red",textAlign:"center"}} > INVALID CREDENTIALS</p>
        return(

            
            <div className="alert alert-danger" role="alert">
                 {redirectVar}
                 <div>
                    {errorAlert}
                </div>
               <div className="form-row container">
                  <h3 className="text-danger font-weight-bold fixed-top top-left title-padding">
                  </h3>
               </div>


            <div class="container">
                
                <div class="register-form">
                <h1>Sign Up for yelp</h1>
                
                <form id = "registerForm" action = "register" method = "POST">
                <select name="Owner" id="owner" required onChange={this.is_ownerChangeHandler}  >
                    <option value="Customer">Customer</option>
                    <option value="Owner">Owner</option>
                   
                </select>
                <input
                type="email"
                name="email"
                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$" 
                onChange={this.emailChangeHandler}
                placeholder="Email"
                required/>
                <input
                type="password"
                onChange={this.passwordChangeHandler}
                name="password"
                placeholder="Password"
                required/>
                <input
                type="text"
                onChange={this.firstNameChangeHandler}
                name="firstName"
                placeholder="FirstName"
                required/>
              <input
                type="text"
                onChange={this.lastNameChangeHandler}
                name="lastName"
                placeholder="LastName"
                required/>
                <input
                type="text"
                onChange={this.ZIP_CodeChangeHandler}
                name="ZIP_Code"
                pattern="[0-9]{5}"
                placeholder="ZIP_code"
                required
              />
              
              <label> Birthday </label>
              <input
                type="date" 
                onChange={this.BirthdayChangeHandler}
                name="Birthday"
                placeholder="Birthday"
                required
              />
              <button onClick={this.submitRegister} className="btn btn-primary">
              Register
              </button>
                </form>
                       
                    </div>
                </div>
            </div>
            
            
        )
    }
}

Register.propTypes = {
    OwnerSignup: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.signup.user
});

export default connect(mapStateToProps, { ownerSignup })(Register);

//export Login Component
//export default Register;