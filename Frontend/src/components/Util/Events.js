import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';

//Define a Login Component
class Events extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {
            
            homeFlag : false
        }
        //Bind the handlers to this class
        
        this.submitEvents = this.submitEvents.bind(this);
        
    }
    
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            homeFlag : false
        })
    }
    
    //submit event handler to send a request to the node backend
    submitEvents = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            email : this.state.email,
            password : this.state.password
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/events',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        homeFlag : true
                    })
                }else{
                    this.setState({
                        homeFlag : false
                    })
                }
                if(response.data==="error")
                {
                    this.setState({homeFlag : 2})
                }
                

            });
    }
    

    render(){
        //redirect based on successful login
        let redirectVar = null;
        if(this.state.homeFlag === true){
            redirectVar = <Redirect to= "/events"/>
        }
        return(
            <div>
                {redirectVar}
            <div class="container">
            <div class="events-form">
            <div class="main-div">
            <div class="panel">
            <button onClick = {this.submitEvents} class="btn btn-primary">Events</button>
            </div>
            </div>
            </div></div>
            </div>
            
            
        )
    }
}

//export Login Component
export default Events;