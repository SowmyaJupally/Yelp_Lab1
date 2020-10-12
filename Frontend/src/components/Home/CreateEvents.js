import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import logo from '../../yelp.png';
import 'bootstrap/dist/css/bootstrap.css';
import backendServer from '../../webconfig';
import Navigationbar from '../Navigationbar';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Dropdown } from 'react-bootstrap';


//Define a Login Component
class CreateEvents extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {

            event_name:"",
            event_date:"",
            event_location:"",
            event_description:"",
            res_id:localStorage.getItem("loggedinRestId"),
            eventFlag : false
        }
        //Bind the handlers to this class
        this.event_nameChangeHandler = this.event_nameChangeHandler.bind(this);
        this.event_dateChangeHandler = this.event_dateChangeHandler.bind(this);
        this.event_locationChangeHandler = this.event_locationChangeHandler.bind(this);
        this.event_descriptionChangeHandler = this.event_descriptionChangeHandler.bind(this);
        //some change 
        this.submitEvents = this.submitEvents.bind(this);
        
    }

    componentWillMount(){
        this.setState({
            reviewFlag : false
        })
    }

    event_nameChangeHandler = (e) => {
        this.setState({
            event_name : e.target.value
        })
    }

    event_dateChangeHandler = (e) => {
        this.setState({
            event_date : e.target.value
        })
    }

    event_locationChangeHandler = (e) => {
        this.setState({
            event_location : e.target.value
        })
    }

    event_descriptionChangeHandler = (e) => {
        this.setState({
            event_description : e.target.value
        })
    }
    
    //submit event handler to send a request to the node backend
    submitEvents = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            
            event_name : this.state.event_name,
            event_date: this.state.event_date,
            event_location : this.state.event_location,
            event_description: this.state.event_description,
            res_id: this.state.res_id
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post(`${backendServer}/createevents`,data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    alert("created events")
                    this.setState({
                        eventsFlag : true
                    })
                }else{
                    this.setState({
                        eventsFlag : false
                    })
                }

            });
    }
    

    render(){
        //redirect based on successful login
        let redirectVar = null;
        console.log('Cookie:', cookie.load('cookie'))
        if(!cookie.load('cookie')){
            console.log("Cookie Loaded");
            redirectVar = <Redirect to= "/login"/>
        }

        if(this.state.eventsFlag){
            redirectVar = <Redirect to= "/RestaurantEvents"/>
        }
        
        return(
            <div>
                {redirectVar}
                <Navigationbar/>
                    <React.Fragment>
                    <div class="col-md-12 text-center">
                    <h2>Create an Event</h2>
                    
                        
                    
                    <div class="form-group">
              <label class="col-md-3 control-label" for="message"></label>
              <div class="col-md-9">
                <textarea onChange = {this.event_nameChangeHandler} class="form-control" id="event_name" name="event_name" placeholder="Event Name" rows="1"></textarea>
                <textarea onChange = {this.event_dateChangeHandler} class="form-control" id="event_date" name="event_date" placeholder="Event Date" rows="1"></textarea>
                <textarea onChange = {this.event_locationChangeHandler} class="form-control" id="event_location" name="event_location" placeholder="Event location" rows="1"></textarea>
                <textarea onChange = {this.event_descriptionChangeHandler} class="form-control" id="event_description" name="event_description" placeholder="Event description" rows="1"></textarea>
                <button onClick = {this.submitEvents} type="submit" class="btn btn-primary btn-md">Submit</button>
              </div>
              <a href="/home">home</a>
            </div>
                </div>
              </React.Fragment>
            </div>
        )
    }
}

//export Login Component
export default CreateEvents;