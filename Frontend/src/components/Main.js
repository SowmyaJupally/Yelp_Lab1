import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import Login from './Login/Login';
import Home from './Home/Home';
import Register from './Login/Register'
import Events from './Util/Events';
import LandingPage from './Navbar/LandingPage';
import Reviews from './Util/Reviews';
import CustomerRestaurant from './Restaurants/Customer';
import Restaurant from './Restaurants/Restaurant';
import OwnerOrderHome from './Home/OwnerOrderHome';
import OwnerHome from './Home/OwnerHome';
import ConfirmOrder from './Cart/ConfirmOrder';
import CustomerOrders from './Orders/CustomerOrders';
import OrderHistory from './Orders/OrderHistory';
import OrderBillView from './Orders/OrderBillView';
import OrderItemsView from './Orders/OrderItemsView';
import Cart from './Cart/Cart';
import Menu from './Menu/Menu';
import Profile from './Profile/Profile';
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
            <Route path = "/restaurants" component = {CustomerRestaurant}/>
            <Route path = "/restaurantmenu" component = {Restaurant}/>
            <Route path = "/ownerorderhome" component = {OwnerOrderHome}/>
            <Route path = "/ownerhome" component = {OwnerHome}/>
            <Route exact path="/orders" component={CustomerOrders} />
            <Route path = "/placeorder" component = {ConfirmOrder}/>
            <Route path = "/orderhistory" component = {OrderHistory}/>
            <Route path = "/orderbilling" component = {OrderBillView}/>
            <Route path = "/orderdetails" component = {OrderItemsView}/>
            <Route path = "/menu" component = {Menu}/>
            <Route path = "/cart" component = {Cart}/>
            <Route path="/profile" component={Profile} />

            </div>
            </Provider>
       )
    }
}

export default Main;
