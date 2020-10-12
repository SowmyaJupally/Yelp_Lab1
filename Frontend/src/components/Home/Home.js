import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Navigationbar from '../Navigationbar';
import CustomerHome from './CustomerHome.js';
import OwnerHome from './OwnerHome.js';
import OwnerOrderHome from './OwnerOrderHome.js';

class Home extends Component {
    componentWillMount(){
        document.title = "Yelp | Food Delivery | Order Food online";
    }
    render() {
        let homeComponent = null;
        let redirectVar = null;
        if (localStorage.getItem("user_id")) {
            if (localStorage.getItem("is_owner") === "1")
                homeComponent = <OwnerOrderHome />
            else
                homeComponent = <CustomerHome />
        }
        else {
            redirectVar = <Redirect to="/" />
        }
        return (
            <div>
                {redirectVar}
               
                {homeComponent}
            </div>
        )
    }
}
//export Login Component
export default Home;