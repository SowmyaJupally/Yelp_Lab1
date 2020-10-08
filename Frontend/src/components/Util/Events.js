import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import logo from '../Images/yogaEvent.png';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

//Define a Login Component
class Events extends Component{
    //call the constructor method
    constructor(props){
        super(props);
        this.state = {
            events:[],
            redirect:"",
            eventFlag : false,
            event_id:this.props.match.params.id
        }
        this.submitEvents = this.submitEvents.bind(this);
        
    }
    
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            homeFlag : false
        })
    }

    componentDidMount(){
        axios.get('http://localhost:3001/' + `getevents/` + this.state.eventFlag)
        .then((response)=>{
            this.setState({
                events: this.state.events.concat(response.data)
            })
        })
    }

    viewEvents(id){
        this.setState({redirect:`/eventdetails/${id}`});
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
        /*redirect based on successful login
        let redirectVar = null;
        if(this.state.homeFlag === true){
            redirectVar = <Redirect to= "/events"/>*/
        return(
            <div>
                <React.Fragment>
                <nav class="navbar navbar-light bg-light">
                <form class="form-inline">
                <a class="logo-link" href="/home"></a>
                <input class="form-control mr-sm-2" type="search" placeholder="Search" aria-label="Search"></input>
                    <button
                        style={{
                            width: '15%',
                            opacity: '1.0',
                                backgroundColor: 'red',
                                }}
                            type='button'
                            className='btn'>
                            <i className='fas fa-search'></i>
                    </button>
            
                </form>
                </nav>
                </React.Fragment>
                
                <div class="card">
                <img class="card-img-top" src={logo} class = "float-left"/>
                <div class='card-body'>
                <h5 class="card-title" class="font-weight-bold">Yoga For Kids</h5>
                <p class="card-text"> From age 5-12 kids Yoga</p>
                <form class="form-inline">
                <button
                style={{
                    width: '10%',
                    padding:'1px',
                    opacity: '1.0',
                        backgroundColor: 'white',
                        }}
                    type='button'
                    className='btn'>
                    <i className='fas fa-map-marker-alt'></i>
                </button>
                <p class="card-text">  Virual Via Facebook Live</p></form>
                <form class="form-inline">
                <button
                style={{
                    width: '10%',
                    padding:'1px',
                    opacity: '1.0',
                        backgroundColor: 'white',
                        }}
                    type='button'
                    className='btn'>
                    <i className='fas fa-calendar-alt'></i>
            </button>
            <p class="card-text"> Sep 28, 10AM-12PM</p></form>
                <a href="#" class="btn btn-primary">See Event</a>
                </div></div>
                


            </div>
        )
    }
}

//export Login Component
export default Events;