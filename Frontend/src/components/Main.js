import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register'
import Events from './Util/Events';
import LandingPage from './Navbar/LandingPage';
import Reviews from './Util/Reviews';
import CustomerDetails from './UserDetails/UserDetails';
import CustomerRestaurant from './Restaurants/Customer';
import Restaurant from './Restaurants/Restaurant';
import OwnerOrderHome from './Home/OwnerOrderHome';
import OwnerHome from './Home/OwnerHome';
import ConfirmOrder from './Cart/ConfirmOrder';
import Cart from './Cart/Cart';
import { Provider } from "react-redux";
import store from "../store";

class Main extends Component{
    render(){
        return(
            <Provider store={store}>
            <div>
            {/*Render Different Component based on Route*/}

            <Route exact path="/" component = {LandingPage}/>
            <Route path ="/login" component = {Login}/> 
            <Route path ="/home" component = {Home}/> 
            <Route path = "/register" component = {Register}/>
            <Route path = "/events" component = {Events}/>
            <Route path = "/reviews" component = {Reviews}/>
            <Route path = "/userdetails" component = {CustomerDetails}/>
            <Route path = "/restaurants" component = {CustomerRestaurant}/>
            <Route path = "/restaurantmenu" component = {Restaurant}/>
            <Route path = "/ownerorderhome" component = {OwnerOrderHome}/>
            <Route path = "/ownerhome" component = {OwnerHome}/>
            <Route path = "/placeorder" component = {ConfirmOrder}/>
            <Route path = "/cart" component = {Cart}/>
            </div>
            </Provider>
       )
    }
}

export default Main;
