import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import ItemCard from "./ItemCard"
import { Button, Card, Container, Col, Row } from 'react-bootstrap';
import backendServer from "../../webconfig";
import Navigationbar from '../Navigationbar';

class Restaurant extends Component {
    constructor(props) {
        super(props);
        this.setState({
            menu_sections: [],
            menu_items: []
        });
        this.sectionItems = this.sectionItems.bind(this);
        this.getSections();
        this.getMenuItems();
    }

    componentWillMount() {
        if (this.props.location.state) {
            document.title = this.props.location.state.res_name;
        }
    }

    getSections = () => {
        if (this.props.location.state) {
            axios.get(`${backendServer}/sections/${this.props.location.state.user_id}`)
                .then(response => {
                    if (response.data[0]) {
                        this.setState({
                            menu_sections: response.data
                        });
                    }
                })
                .catch(err => {
                    if (err.response && err.response.data) {
                        console.log(err.response.data);
                    }
                });
        }
    };

    getMenuItems = () => {
        if (this.props.location.state) {
            axios.get(`${backendServer}/items/${this.props.location.state.user_id}`)
                .then(response => {
                    if (response.data[0]) {
                        this.setState({
                            menu_items: response.data
                        });
                    }
                })
                .catch(err => {
                    if (err.response && err.response.data) {
                        console.log(err.response.data);
                    }
                });
        }
    };

    sectionItems = (menu_section) => {
        var itemsRender = [], items, item, section;


        if (this.state && this.state.menu_items && this.state.menu_items.length > 0) {
            items = this.state.menu_items.filter(menu_item => menu_item.menu_section_id === menu_section.menu_section_id);
            if (items.length > 0) {
                section = menu_section.menu_section_name;
                itemsRender.push(section);
                for (var i = 0; i < items.length; i++) {
                    
                    item = <ItemCard menu_item={items[i]} />;
                    itemsRender.push(item);
                }
            }
            return itemsRender;
        }
    };

    render() {
        let redirectVar = null,
            section = null,
            renderOutput = [],
            resImageSrc = null,
            resName, resPhone, resAddress, resCuisine, resZIP, 
            restaurant = this.props.location.state;

            

            console.log("props.location:" , this.props)
            localStorage.setItem("res-id", this.props.location.state.res_id);

        if (
            //localStorage.getItem("user_id") || 
        !this.props.location.state) {
            console.log("redirecting to home")
            redirectVar = <Redirect to="/home" />
        }

        if (restaurant) {
            resImageSrc = restaurant.res_image
            //resImageSrc = `${backendServer}/grubhub/images/restaurant/${restaurant.res_image}`;
            resName = restaurant.res_name;
            resAddress = restaurant.res_address;
            resZIP = restaurant.res_zip_code;
            resAddress = restaurant.address;
            resPhone = restaurant.phone_number;
            resCuisine = restaurant.res_cuisine;
        }
        if (this.state && this.state.menu_sections && this.state.menu_sections.length > 0) {
            for (var i = 0; i < this.state.menu_sections.length; i++) {
                section = this.sectionItems(this.state.menu_sections[i]);
                renderOutput.push(section);
            }
        }
        return (
            <div>
                {redirectVar}
                <Navigationbar/>
                <Card bg="info" text="white" style={{ width: "70rem", height: "30rem", margin: "2%" }}>
                    <Row>
                        <Col>
                            <Card.Img style={{ width: "18rem", height: "15rem" }} float="left" src={resImageSrc} />
                        </Col>
                        <Card.Body float="right">
                            <Card.Title><h1>{resName}</h1></Card.Title>
                            <br />
                            <Card.Text><h4>{resAddress} | {resZIP} | {resPhone}</h4></Card.Text>
                            <br />
                            <Card.Text><h4>Cuisine: {resCuisine}</h4></Card.Text>
                        </Card.Body>
                    </Row>
                </Card>
                <Container>
                    {renderOutput}
                </Container>
                <center>
                    <Button variant="primary" classname="Write a Review" href="/reviews" >Write A Review</Button>
                    &nbsp;&nbsp;
                    <Button variant="primary" classname="home"  href="/home" >Home</Button>
                    &nbsp;&nbsp;
                    <Button variant="success" name="goToCart" href="/cart">Go To Cart</Button>
                </center>
                <br/>
            </div>
        )
    }
}

export default Restaurant;