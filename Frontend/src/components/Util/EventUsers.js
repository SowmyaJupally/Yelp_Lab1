import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import backendServer from '../../webconfig';
import Navigationbar from '../Navigationbar';
import logo from '../Images/yogaEvent.png';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

//Define a Login Component
class EventUsers extends Component{
    //call the constructor method
    constructor(props){
        super(props);
        this.state = {
            users:[],
            redirect:"",
            eventFlag : false,
            event_id:this.props.match.params.id
        }
        
    }
    
    redirect(e,id){

        this.setState({
            redirect: "/userProfile/"+id
        })
    }
    //Call the Will Mount to set the auth Flag to false
    componentWillMount(){
        this.setState({
            homeFlag : false
        })
    }

    componentDidMount(){
        axios.get(`${backendServer}/getEventUsers/${this.state.event_id}`)
        .then((response)=>{
            this.setState({
                users: this.state.users.concat(response.data)
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
        
            var details = this.state.users.map((user)=>{
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
                <img class="card-img-top" src={user.user_image} class = "float-left"/>
                <div class='card-body'>
                <h5 class="card-title" class="font-weight-bold">{user.first_name}</h5>
            <button onClick = {e=>this.redirect(e,user.user_id)} class="btn btn-primary"> view profile</button>
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
export default EventUsers;