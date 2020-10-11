import React, { Component } from 'react';
import { Redirect } from 'react-router';
import { Button, Container, Table, Card } from "react-bootstrap";
import axios from 'axios';
import backendServer from "../../webconfig";

class OrderItemsView extends Component {
    constructor(props) {
        super(props);

        this.state = {
            order_details: {},
            order_items: {}
        };
    }

    componentWillMount() {
        if (this.props.location.state) {
            this.setState({
                order_details: this.props.location.state.order_details,
                prevPath: this.props.location.state.prevPath
            });

            axios.get(`${backendServer}/grubhub/orders/orderitems/${this.props.location.state.order_details.order_id}`)
                .then(response => {
                    if (response.data[0]) {
                        this.setState({
                            order_items: response.data
                        });
                    }
                })
                .catch(error => {
                    console.log(error);
                });
        }
    }

    render() {
        let order_details;
        let items;
        let itemsRender = [];
        let itemsCard = null;
        let redirectVar = null;

        if (!localStorage.getItem("user_id") || !this.props.location.state) {
            redirectVar = <Redirect to="/" />;
        }
        console.log(this.props);
        if (this.state && this.state.order_details && this.state.order_items) {
            order_details = this.state.order_details;
            items = this.state.order_items;
            if (items.length > 0) {
                items.forEach(item => {
                    let itemRow = (
                        <tr>
                            <td colSpan="4" align="center">{item.item_name}</td>
                            <td colSpan="4" align="center">{item.item_quantity}</td>
                        </tr>
                    );
                    itemsRender.push(itemRow);
                });
            }
            itemsCard =
                (
                    <center>
                        <Card style={{ width: "40rem" }}>
                            <Card.Title>
                                <br />
                                <h3>{order_details.res_name}</h3>
                            </Card.Title>
                            <Card.Body>
                                <b>Order Details</b>
                                <Table>
                                    <thead align="center">
                                        <th colSpan="4">Item Name</th>
                                        <th colSpan="4">Quantity</th>
                                    </thead>
                                    <tbody>
                                        {itemsRender}
                                        <br />
                                        <br />
                                        <tr>
                                            <td colSpan="4">Customer Name:</td>
                                            <td>{order_details.name}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Delivery Address:</td>
                                            <td>{order_details.address}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Contact Number:</td>
                                            <td>{order_details.phone_number}</td>
                                        </tr>
                                        <tr>
                                            <td colSpan="4">Order Date:</td>
                                            <td>{order_details.order_date}</td>
                                        </tr>
                                    </tbody>
                                </Table>
                                <Button variant="secondary" href={this.state.prevPath}>Back</Button>
                            </Card.Body>
                        </Card>
                    </center>
                );
            return (
                <div>
                    
                    {redirectVar}
                    <Container className="justify-content">
                        {itemsCard}
                    </Container>
                </div>
            );
        }
    }
}

export default OrderItemsView;