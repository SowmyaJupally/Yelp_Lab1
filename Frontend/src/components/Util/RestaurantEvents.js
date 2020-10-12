import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import backendServer from '../../webconfig';
import logo from '../Images/yogaEvent.png';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import Navigationbar from '../Navigationbar';

//Define a Login Component
class RestaurantEvents extends Component{
    //call the constructor method
    constructor(props){
        super(props);
        this.state = {
            events:[],
            redirect:"",
            eventFlag : false,
            event_id:this.props.match.params.id
        }
        
    }
    
    redirect(e,id){

        this.setState({
            redirect: "/eventUsers/"+id
        })
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            homeFlag : false
        })
    }

    componentDidMount(){
        axios.get(`${backendServer}/getRestauarantEvents/${localStorage.getItem("loggedinRestId")}`)
        .then((response)=>{
            this.setState({
                events: this.state.events.concat(response.data)
            })
        })
    }

    // viewEvents(id){
    //     this.setState({redirect:`/eventdetails/${id}`});
    // }
    
    //submit event handler to send a request to the node backend
    
    

    render(){
        /*redirect based on successful login*/
        let redirectVar = null;

        if(this.state.redirect){
            redirectVar = <Redirect to= {this.state.redirect}/>
        }
        
            var details = this.state.events.map((event)=>{
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
                <img class="card-img-top" src={event.event_image} class = "float-left"/>
                <div class='card-body'>
                <h5 class="card-title" class="font-weight-bold">{event.event_name}</h5>
                <p class="card-text"> {event.event_description}</p>
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
                <p class="card-text">  {event.event_location}</p></form>
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
            <p class="card-text"> {event.event_date}</p></form>
                    <button onClick = {e=>this.redirect(e,event.event_id)} class="btn btn-primary"> Registered Users</button>
                <button hidden ="true" class="btn btn-primary">Register Event</button>
                </div></div>
                


            </div>
                )
            })
        return(
            <div>
            {redirectVar}
            <Navigationbar/>
            {details}
            </div>
            
            
        )
    }
}

//export Login Component
export default RestaurantEvents;