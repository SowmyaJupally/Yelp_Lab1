import React, {Component} from 'react';
import '../../App.css';
import {Link} from 'react-router-dom';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import {backend} from '../../webconfig';
import Background from '../../yelp.png';

//Define a Login Component
class Navbar extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        this.handleLogout = this.handleLogout.bind(this)
        //maintain the state required for this component
        this.state = {
            headerArray:[],
            firstTime:true
        }
        //Bind the handlers to this class
    }


    handleLogout=() => {
        cookie.remove('cookie',{path:'/'})
        console.log("logout done")
    }
    

    componentDidMount(){
        axios.get(backend+'tabHeaders/')
                .then((response) => {
                //update the state with the response data
                this.setState({
                    headerArray : this.state.headerArray.concat(response.data),
                    firstTime:false
                });
            });
        }


    render(){
        //redirect based on successful login
        let redirectVar = null;

        console.log('Cookie:', cookie.load('cookie'))
        if(cookie.load('cookie')){
            console.log("Cookie Loaded");
            redirectVar = <Redirect to= "/home"/>
        }
        
        return(
            <div style = {{background:'#f7f7f7'}}>
            {redirectVar}
            <div className="container"></div>
            <div className = "topNav">
                <nav className="navbar navbar-inverse">
                    <div className="container-fluid">
                        <div className="navbar-header">
                        <a href="/register"><span className="glyphicon glyphicon-tasks"></span> Register</a>
                        <a href="/login"><span className="glyphicon glyphicon-log-in"></span> Login</a>
                        <a href="/home"><span className="glyphyicon glyphicon-log-in"></span> Home</a>
                        <a href="/" onClick={this.handleLogout}><span className="glyphicon glyphicon-log-in"></span> Logout</a>
                        </div>
                    </div>
                </nav>
            </div>
            </div>
        )
    }
}

//export Login Component
export default Navbar;