import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { userLogin } from '../../actions/userlogin'

//Define a Login Component
class Login extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            email : "",
            password : "",
            authFlag : false
        }
        //Bind the handlers to this class
        this.emailChangeHandler = this.emailChangeHandler.bind(this);
        this.passwordChangeHandler = this.passwordChangeHandler.bind(this);
        this.submitLogin = this.submitLogin.bind(this);
    }
    
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            authFlag : false
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
    //submit Login handler to send a request to the node backend
    submitLogin = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email : this.state.email,
            password : this.state.password
        }


        this.props.userLogin(data);

        this.setState({
            authFlag:1
        })
        //set the with credentials to true
       /* axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/login',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        authFlag : true
                    })
                }else{
                    this.setState({
                        authFlag : false
                    })
                }
                if(response.data==="error")
                {
                    this.setState({authFlag : 2})
                }
                

            });*/
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;

        console.log('Cookie:', cookie.load('cookie'))
        if(cookie.load('cookie')){
            console.log("Cookie Loaded");
            redirectVar = <Redirect to= "/home"/>
        }

        if(this.props.user && this.props.user.user_id){
            localStorage.setItem("user_id", this.props.user.user_id);
            localStorage.setItem("is_owner", this.props.user.is_owner)
            if(this.props.user.is_owner){
                localStorage.setItem("loggedinRestId", this.props.user.restaurantId)
            }
        }

        if(this.state.authFlag===2)
        redirectVar=<p style={{color:"red",textAlign:"center"}} > INVALID CREDENTIALS</p>
        return(
            <div>
                 {redirectVar}
            <div class="container">
                
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <h2>Yelp Login</h2>
                            <p>Please enter your email and password</p>
                        </div>
                        
                            <div class="form-group">
                                <input onChange = {this.emailChangeHandler} type="text" class="form-control" name="email" placeholder="Email"/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.passwordChangeHandler} type="password" class="form-control" name="password" placeholder="Password"/>
                            </div>
                            <button onClick = {this.submitLogin} class="btn btn-primary">Login</button>                 
                    </div>
                </div>
            </div>
            </div>
            
        )
    }
}

Login.propTypes = {
    userLogin:PropTypes.func.isRequired,
    user:PropTypes.object.isRequired
}

const mapStateToProps = state => { 
    return ({
    user: state.login.user
})};

//export Login Component
export default connect(mapStateToProps, { userLogin })(Login);