import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import backendServer from "../../webconfig";
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

//Define a Login Component
class OwnerHome extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            res_name : "",
            zipCode : "",
            cuisine:"",
            user_id:"",
            restFlag : false
        }
        //Bind the handlers to this class
        this.res_nameChangeHandler = this.res_nameChangeHandler.bind(this);
        this.zipCodeChangeHandler = this.zipCodeChangeHandler.bind(this);
        this.cuisineChangeHandler = this.cuisineChangeHandler.bind(this);
        this.user_idChangeHandler = this.user_idChangeHandler.bind(this);
        this.submitRestaurant = this.submitRestaurant.bind(this);
    }
    
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            restFlag : false
        })
    }
    //email change handler to update state variable with the text entered by the user
    res_nameChangeHandler = (e) => {
        this.setState({
            res_name : e.target.value
        })
    }
    cuisineChangeHandler = (e) => {
        this.setState({
            cuisine : e.target.value
        })
    }
    //password change handler to update state variable with the text entered by the user
    zipCodeChangeHandler = (e) => {
        this.setState({
            zipCode : e.target.value
        })
    }

    user_idChangeHandler = (e) => {
        this.setState({
            user_id : e.target.value
        })
    }
    //submit Login handler to send a request to the node backend
    submitRestaurant = (e) => {
        var headers = new Headers();
        //prevent page from refresh
        e.preventDefault();
        const data = {
            res_name : this.state.res_name,
            zipCode : this.state.zipCode,
            cuisine : this.state.cuisine,
            user_id: localStorage.getItem("user_id")
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`${backendServer}/ownerhome`,data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    localStorage.setItem("loggedinRestId",response.data)
                    this.setState({
                        restFlag : true
                    })
                }else{
                    this.setState({
                        restFlag : false
                    })
                }
                if(response.data==="error")
                {
                    this.setState({restFlag : 2})
                }
                
                

            });
    }

    render(){
        //redirect based on successful login
        let redirectVar = null;
        console.log('Cookie:', cookie.load('cookie'))
        if(cookie.load('cookie')){
            console.log("Cookie Loaded");
            redirectVar = <Redirect to= "/ownerhome"/>
        }

        

        if(this.state.restFlag === true){
            redirectVar = <Redirect to ="/ownerorderhome"/>
        }
       
        return(
            <div>
                 {redirectVar}
            <div class="container">
                
                <div class="login-form">
                    <div class="main-div">
                        <div class="panel">
                            <h2>Register Your Restaurant</h2>
                            <p>Already Registered ? <a href="/ownerorderhome"> Go to home</a></p>
                            <p>Please enter details about your restaurant</p>
                        </div>
                            <div class="form-group">
                                <input onChange = {this.res_nameChangeHandler} type="text" class="form-control" name="res_name" placeholder="Restaurant Name" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.cuisineChangeHandler} type="text" class="form-control" name="cuisine" placeholder="Cuisine" required/>
                            </div>
                            <div class="form-group">
                                <input onChange = {this.zipCodeChangeHandler} type="text" class="form-control" name="zip_Code" placeholder="ZIP Code" required/>
                            </div>
                            <h5>Upload Image for Restaurant</h5>
                            <button onClick = {(e)=>this.submitRestaurant(e)} class="btn btn-primary">Submit Restaurant Details</button>                 
                    </div>
                    
                </div>
            </div>
            </div>
            
        )
    }
}

//export Login Component
export default OwnerHome;