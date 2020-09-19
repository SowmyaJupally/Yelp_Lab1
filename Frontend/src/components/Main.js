import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register'
import Navbar from './Navbar/Navbar';
import Events from './Util/Events';

class Main extends Component{
    render(){
        return(
            <div>
            {/*Render Different Component based on Route*/}
            <Route path="/" component = {Navbar}/>
            <Route path ="/login" component = {Login}/> 
            <Route path ="/home" component = {Home}/> 
            <Route path = "/register" component = {Register}/>
            <Route path = "/events" component = {Events}/>
            </div>
       )
    }
}

export default Main;
