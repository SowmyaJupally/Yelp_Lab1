import React, { Component } from 'react';
import { Redirect } from 'react-router';
import Navigationbar from '../Navigationbar';
import CustomerProfile from './CustomerProfile';
import OwnerProfile from './OwnerProfile';

class Profile extends Component {
    componentWillMount(){
        document.title = "Your Profile";
    }
    render() {
        let profileComponent = null;
        let redirectVar = null;
        if (localStorage.getItem("user_id")) {
            if (localStorage.getItem("is_owner") === "1")
                profileComponent = <OwnerProfile />
            else
                profileComponent = <CustomerProfile />
        }
        else {
            redirectVar = <Redirect to="/" />
        }
        return (
            <div>
                {redirectVar}
               
                {profileComponent}
            </div>
        )
    }
}
export default Profile;