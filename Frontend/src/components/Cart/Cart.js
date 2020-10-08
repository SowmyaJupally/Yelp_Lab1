import React, { Component } from 'react';
import { Redirect } from 'react-router';
import backendServer from "../../webconfig"
import { Button, Alert, Container, Table, Card, ListGroup, ListGroupItem} from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from 'axios';

class Cart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            cart_items: []
        };
        this.clearCart = this.clearCart.bind(this);
        this.removeItem = this.removeItem.bind(this);
        this.getRestaurantDetails();
    }

    componentWillMount() {
        document.title = "Your Cart";
        let cartItems = [];
        if (localStorage.getItem("cart_items")) {
            cartItems.push(...JSON.parse(localStorage.getItem("cart_items")));
            this.setState({
                cart_items: cartItems
            });
        }
    };

    getRestaurantDetails = () => {
        let res_id;
        if (localStorage.getItem("cart_res_id")) {
            res_id = localStorage.getItem("cart_res_id");
            axios.get(`${backendServer}/restaurants/${res_id}`)
                .then(response => {
                    if (response.data) {
                        this.setState({
                            restaurant: response.data,
                        });
                    }
                })
                .catch(error => {
                    if (error.response && error.response.data) {
                        console.log(error.response.data);
                    }
                })
        }
    };

    onQuantityChange = (e) => {
        let item_id = parseInt(e.target.name);
        let newQuantity = parseInt(e.target.value);
        let cart_items = this.state.cart_items;
        let index = cart_items.findIndex((cart_item => cart_item.item_id === item_id));
        cart_items[index].item_quantity = newQuantity;
        this.setState({
            cart_items: cart_items
        });
        localStorage.setItem("cart_items", JSON.stringify(cart_items));
    };

    removeItem = (e) => {
        let item_id = parseInt(e.target.name);
        let cart_items = this.state.cart_items;
        let index = cart_items.findIndex((cart_item => cart_item.item_id === item_id));
        cart_items.splice(index, 1);
        this.setState({
            cart_items: cart_items
        });
        localStorage.setItem("cart_items", JSON.stringify(cart_items));
    }

    calculateSubTotal = () => {
        let cart_items = this.state.cart_items;
        let subTotal = 0;
        for (var i = 0; i < cart_items.length; i++) {
            for (var j = 0; j < cart_items.length; j++) {
                if (cart_items[i].item_id === cart_items[j].item_id) {
                    subTotal += (cart_items[i].item_quantity * cart_items[j].item_price);
                }
            }
        }
        subTotal = subTotal.toFixed(2);
        return subTotal;
    };

    clearCart = () => {
        localStorage.removeItem("cart_items");
        this.setState({
            cart_items: []
        });
    };

    render() {
        let redirectVar = null,
            itemsRender = [],
            message = null,
            resName, resAddress, resZIP, restaurantDetails = null, discountAmount = null, deliveryAmount = null;

        let discount = 20,
            delivery = 6,
            tax = 9.25;

        if (!localStorage.getItem("user_id") || localStorage.getItem("is_owner") === "1") {
            redirectVar = <Redirect to="/" />
        }

        if (this.state && this.state.restaurant) {
            resName = this.state.restaurant.res_name;
            resAddress = this.state.restaurant.address;
            resZIP = this.state.restaurant.res_zip_code;
        }

        if (this.state && this.state.cart_items.length === 0) {
            message =
                [<center><Alert variant="warning">You haven't added any items to your cart. Please add your favorite items.</Alert><br />
                    <Button href="/home">Home</Button></center>
                ]
        }
        else {
           
            restaurantDetails = (
                <Card style={{ width: "60rem", margin: "2%" }}>
                    <ListGroup className="list-group-flush">
                        <ListGroupItem><h3>{resName}</h3></ListGroupItem>
                        <ListGroupItem>{resAddress} | {resZIP}</ListGroupItem>
                    </ListGroup>
                </Card>
            );
            let cart_items = this.state.cart_items;
            var subTotal = this.calculateSubTotal(cart_items);
            if (subTotal < 100) {
                discount = 0;
                deliveryAmount = (
                    <tr>
                        <td colSpan="4">Delivery Charges</td>
                        <td align="center">$ {delivery.toFixed(2)}</td>
                    </tr>
                );
            }
            else {
                delivery = 0;
                message = <Alert variant="success">Congrats! Your purchase is eligible for a discount of {discount}% and free delivery!</Alert>;
                discountAmount = (<tr>
                    <td colSpan="4">Discounts ({discount}%)</td>
                    <td align="center">$ {(subTotal * discount / 100).toFixed(2)}</td>
                </tr>);
            }
            var total = ((subTotal * (100 + tax - discount) / 100) + delivery).toFixed(2);
            for (var i = 0; i < cart_items.length; i++) {
                let item = (
                    <tr>
                        <td align="center">{cart_items[i].item_name}</td>
                        <td align="center">$ {cart_items[i].item_price}</td>
                        <td align="center">
                            <input type="number" name={cart_items[i].item_id} min="1" max="10" width="10%" onChange={this.onQuantityChange} defaultValue={cart_items[i].item_quantity}></input>
                        </td>
                        <td align="center">
                            <Button variant="link" name={cart_items[i].item_id}>
                                <img src={""} width="15" name={cart_items[i].item_id} onClick={this.removeItem} alt="" />
                            </Button>
                        </td>
                        <td align="center">$ {cart_items[i].item_price * cart_items[i].item_quantity}</td>
                    </tr>
                );
                itemsRender.push(item);
            }
            var confirmDetails = {restaurant: this.state.restaurant, subTotal: subTotal, delivery: delivery, discount: discount, tax: tax, total: total, cart_items: this.state.cart_items};
            var cartTable = (
                <div>
                    <Table style={{ width: "90%" }}>
                        <thead align="center">
                            <th>Item Name</th>
                            <th>Price</th>
                            <th>Quantity</th>
                            <th></th>
                            <th>Total Price</th>
                        </thead>
                        <tbody>
                            {itemsRender}
                            <br /><br /><br /><br />
                            <tr>
                                <td colSpan="4"><b>Sub Total</b></td>
                                <td align="center"><b>$ {subTotal}</b></td>
                            </tr>
                            <tr>
                                <td colSpan="4">Tax ({tax}%)</td>
                                <td align="center">$ {(subTotal * tax / 100).toFixed(2)}</td>
                            </tr>
                            {discountAmount}
                            {deliveryAmount}
                            <tr>
                                <td colSpan="4"><b>Total</b></td>
                                <td align="center"><b>$ {total}</b></td>
                            </tr>
                        </tbody>
                    </Table>
                    <Button variant="warning" onClick={this.clearCart}>Clear Cart</Button> &nbsp; &nbsp;
                    <Button variant="primary" href="/home">Save for Later</Button> &nbsp; &nbsp;
                    <Link to={{pathname: "/placeorder", state: confirmDetails}}>
                        <Button variant="success">Proceed to Checkout</Button>
                    </Link>
                </div>
            );
        }

        return (
            <div>
                {redirectVar}
                
                <Container>
                    <h3>Your Cart</h3><br />
                    <center>
                        {message}
                        {restaurantDetails}
                        {cartTable}
                        <br /><br />
                    </center>
                </Container>

            </div>
        )
    }
}
export default Cart;