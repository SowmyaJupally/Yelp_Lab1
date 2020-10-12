import React, { Component } from "react";
import { Card, Modal, Button, Col, Row } from "react-bootstrap";
import backendServer from "../../webconfig";


class ItemCard extends Component {
  constructor(props) {
    super(props);
    this.setState({
      showModal: false,
      item_quantity: 1
    });

    this.openModal = this.openModal.bind(this);
    this.onClose = this.onClose.bind(this);
    this.addToCart = this.addToCart.bind(this);
  }

  openModal = () => {
    this.setState({
      showModal: true
    });
  };

  onClose = (e) => {
    this.setState({
      showModal: false
    });
  }

  onQuantityChange = (e) => {
    let quantity = parseInt(e.target.value);
    this.setState({
      item_quantity: quantity
    });
  };

  addToCart = (e) => {
    let item_id = this.props.menu_item.item_id;
    let cartItems = [];

    if (parseInt(localStorage.getItem("cart_res_id")) !== this.props.menu_item.res_id) {
      localStorage.setItem("cart_items", cartItems);
    }

    if (localStorage.getItem("cart_items")) {
      cartItems.push(...JSON.parse(localStorage.getItem("cart_items")));
    }

    localStorage.setItem("res_id", this.props.res_id);

    let index = cartItems.findIndex((cartItem => cartItem.item_id === item_id));
    if (index === -1) {
      cartItems.push({ item_id: item_id, item_quantity: this.state.item_quantity || 1, item_price: this.props.menu_item.item_price, item_name: this.props.menu_item.item_name });
      localStorage.setItem("cart_res_id", this.props.menu_item.res_id);
      localStorage.setItem("cart_items", JSON.stringify(cartItems));
      this.setState({
        showModal: false,
        item_quantity: 1
      });
    }
  };

  removeFromCart = (e) => {
    let item_id = this.props.menu_item.item_id;
    let cartItems = [];

    if (localStorage.getItem("cart_items")) {
      cartItems.push(...JSON.parse(localStorage.getItem("cart_items")));
    }

    let index = cartItems.findIndex((cartItem => cartItem.item_id === item_id));
    if(index !== -1){
      e.target.textContent = "Add to Cart";
      e.target.className = "btn btn-primary";
      cartItems.splice(index, 1);
      localStorage.setItem("cart_items", JSON.stringify(cartItems));
      this.setState({
        item_quantity: null
      });
    }
  };


  render() {
      let imageSrc = this.props.menu_item.item_image;
    //let imageSrc = `${backendServer}/grubhub/images/item/${this.props.menu_item.item_image}`;
    let buttonText = "Add to Cart";
    let buttonVariant = "primary";
    let cartItems = [];
    let cartItemIds = [];
    let showModal = false;
    let buttonClick = this.openModal;
    if (localStorage.getItem("cart_items")) {
      cartItems.push(...JSON.parse(localStorage.getItem("cart_items")));
      cartItemIds = cartItems.map(cartItem => cartItem.item_id);
      buttonText = cartItemIds.includes(this.props.menu_item.item_id) ? "Remove from Cart" : buttonText;
      buttonVariant = cartItemIds.includes(this.props.menu_item.item_id) ? "warning" : buttonVariant;
      buttonClick = cartItemIds.includes(this.props.menu_item.item_id) ? this.removeFromCart : this.openModal;
    }
    if(this.state){
      showModal = this.state.showModal;
    }

    return (
      <div>
        <Card bg="white" style={{ width: "50rem", margin: "2%" }}>
          <Row>
            <Col>
              <Card.Img style={{ width: "12rem", height: "9rem" }} alt="" src={imageSrc} />
            </Col>
            <Col>
            <Card.Body>
              <Card.Title>{this.props.menu_item.item_name}</Card.Title>
              <Card.Text>{this.props.menu_item.item_description}</Card.Text>
              <Card.Text>Price: $ {this.props.menu_item.item_price}</Card.Text>
            </Card.Body>
            </Col>
            <Col align="right">
              <br /><br />
              <Button variant={buttonVariant} onClick={buttonClick} name={this.props.menu_item.item_id}>{buttonText}</Button>&nbsp; &nbsp;
            </Col>
          </Row>
        </Card>
        <Modal show={showModal} onHide={this.onClose} centered>
          <Modal.Header closeButton>
            <Modal.Title>{this.props.menu_item.item_name}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <center>
              <img src={imageSrc} width="100%" alt="" />
              <p>{this.props.menu_item.item_description}</p>
              Quantity: <input type="number" name={this.props.menu_item.item_id} min="1" max="10" width="10%" onChange={this.onQuantityChange} defaultValue="1" autofocus></input>
            </center>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.onClose}>
              Close
            </Button>
            <Button variant="primary" hidden = "true" onClick={this.addToCart}>
              Add to Cart
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default ItemCard;