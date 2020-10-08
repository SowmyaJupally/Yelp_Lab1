import React, {Component} from 'react';
import '../../App.css';
import axios from 'axios';
import cookie from 'react-cookies';
import {Redirect} from 'react-router';
import logo from '../../yelp.png';
import 'bootstrap/dist/css/bootstrap.css';
import '@fortawesome/fontawesome-free/css/all.min.css';
import { Dropdown } from 'react-bootstrap';


//Define a Login Component
class Reviews extends Component{
    //call the constructor method
    constructor(props){
        //Call the constrictor of Super class i.e The Component
        super(props);
        //maintain the state required for this component
        this.state = {

            res_name:"",
            review:"",
            reviewFlag : false
        }
        //Bind the handlers to this class
        //some change 
        this.submitReview = this.submitReview.bind(this);
        
    }

    componentWillMount(){
        this.setState({
            reviewFlag : false
        })
    }
    
    //submit event handler to send a request to the node backend
    submitReview = (e) => {
        //prevent page from refresh
        e.preventDefault();
        const data = {
            res_name : this.state.res_name,
            review : this.state.review
            
        }
        //set the with credentials to true
        axios.defaults.withCredentials = true;
        //make a post request with the user data
        axios.post('http://localhost:3001/reviews',data)
            .then(response => {
                console.log("Status Code : ",response.status);
                if(response.status === 200){
                    this.setState({
                        reviewFlag : true
                    })
                }else{
                    this.setState({
                        reviewFlag : false
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
        
        return(
            <div>
                {redirectVar}
                    <React.Fragment>
                    <div class="col-md-12 text-center">
                    <h2>Write a Review</h2>
                    <h6>Review your favorite businesses and share your experiences with our community</h6>
                        <div class="btn-group">
                            <button type="button" float="center" class="btn btn-primary dropdown-toggle" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                            Select Restaurants
                            </button>
                        </div>

                        <p class="mb-2">Rate the Place</p>
                        <div class="form-group">
              <label class="col-md-3 control-label" for="message"></label>
              <div class="col-md-9">
                <textarea class="form-control" id="message" name="message" placeholder="Please enter your feedback here..." rows="5"></textarea>
                <button type="submit" class="btn btn-primary btn-md">Submit</button>
              </div>
            </div>

            
            
                </div>
              </React.Fragment>
            </div>
        )
    }
}

//export Login Component
export default Reviews;