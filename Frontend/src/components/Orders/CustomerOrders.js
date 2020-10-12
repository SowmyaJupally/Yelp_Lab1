import React, { Component } from 'react';
import { Redirect } from 'react-router';
import axios from 'axios';
import { Card, Container, Col, Row, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import backendServer from "../../webconfig";
import Navigationbar from '../Navigationbar';

class CustomerOrders extends Component {
    constructor(props) {
        super(props);
        this.setState({
            pending_orders: []
        });

        this.cancelOrder = this.cancelOrder.bind(this);
        this.getPendingOrders();
    }

    componentWillMount() {
        document.title = "Your Orders";
    }

    cancelOrder = (e) => {
        let pending_orders = this.state.pending_orders;
        let data = {
            order_id: parseInt(e.target.name)
        };

        axios.post(`${backendServer}/cancelorder`, data)
            .then(response => {
                if (response.data === "ORDER_CANCELLED") {
                    let index = pending_orders.findIndex(order => order.order_id === data.order_id);
                    pending_orders.splice(index, 1);
                    this.setState({
                        pending_orders: pending_orders,
                        message: response.data
                    });
                }
            })
            .catch(error => {
                this.setState({
                    message: "ORDER_ERROR"
                });
            });
    };

    getPendingOrders = () => {
        axios.get(`${backendServer}/pendingorders/${localStorage.getItem("user_id")}`)
            .then(response => {
                if (response.data[0]) {
                    this.setState({
                        pending_orders: response.data
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({
                        message: err.response.data
                    });
                }
            });
    };

    render() {
        let redirectVar = null;
        let orders = [];
        let orderCards = null;
        let message = null;
        if (!localStorage.getItem("user_id") || localStorage.getItem("is_owner") === "1") {
            redirectVar = <Redirect to="/" />
        }
        if (this.state && this.state.message === "ORDER_CANCELLED") {
            message = <Alert variant="success">Your order is cancelled.</Alert>
        }
        else if (this.state && this.state.message === "ORDER_ERROR") {
            message = <Alert variant="warning">Your order could not be cancelled.</Alert>
        }
        else if (this.state && this.state.message === "NO_PENDING_ORDERS") {
            message = (
                <Link to="/orderhistory">
                    <Alert variant="warning">You do not have any pending orders. Click here to view your past orders.</Alert>
                </Link>
            );
        }
        if (this.state && this.state.pending_orders) {
            orders = this.state.pending_orders;
            if (orders.length > 0) {
                orderCards = orders.map(order => {
                    return (
                        <Card style={{ width: "60rem", margin: "2%" }}>
                            <Card.Body>
                                <Row>
                                    <Col>
                                        <Card.Title>{order.res_name}</Card.Title>
                                        <Card.Subtitle className="mb-2 text-muted">{order.res_address} | {order.res_zip_code}</Card.Subtitle>
                                        <Row>
                                            <Link to={{ pathname: "/orderdetails", state: {order_details: order, prevPath: "/orders"} }}>
                                                <Button variant="link">Order Details</Button>
                                            </Link>
                                            <Link to={{ pathname: "/orderbilling", state: {order_details: order, prevPath: "/orders"}}}>
                                                <Button variant="link">Billing Details</Button>
                                            </Link>
                                        </Row>
                                    </Col>
                                    <Col align="center">
                                        <Card.Text>{order.order_status}</Card.Text>
                                        <Card.Text>{order.order_date}</Card.Text>
                                    </Col>
                                    <Col align="right">
                                        <Button variant="secondary" name={order.order_id} onClick={this.cancelOrder}>Cancel Order</Button>&nbsp;
                                </Col>
                                </Row>
                            </Card.Body>
                        </Card>
                    );
                });
            }
        }
        return (
            <div>
                {redirectVar}
                <Navigationbar/>
                <Container className="justify-content">
                    <h3>Your Pending Orders</h3><br />
                    {message}
                    {orderCards}
                    <center>
                        <Button href="/home">Home</Button>
                    </center>
                </Container>
            </div>
        )
    }
}

export default CustomerOrders;