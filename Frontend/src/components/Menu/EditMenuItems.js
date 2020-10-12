import React, { Component } from "react";
import { Form, Col, Row, Button, Alert, Card } from "react-bootstrap";
import { Redirect } from "react-router";
import backendServer from "../../webconfig";
import Navigationbar from '../Navigationbar';
import axios from "axios";

class EditMenuItems extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu_sections: []
        };

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.onUpload = this.onUpload.bind(this);
        this.getSections();
    }

    componentWillMount() {
        let item_id = this.props.location.state.item_id;
        this.setState({
            item_id: item_id
        });
        axios.get(`${backendServer}/menuitem/${item_id}`)
            .then(response => {
                if (response.data.status && response.data.status === "NO_RECORD") {
                    this.setState({
                        noRecordFlag: true
                    });
                }
                else {
                    this.setState({
                        item_name: response.data.item_name,
                        item_description: response.data.item_description,
                        item_price: response.data.item_price,
                        item_image: response.data.item_image,
                        menu_section_id: response.data.menu_section_id,
                        menu_section_name: response.data.menu_section_name,
                        data_flag: true
                    });
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
    };

    getSections = () => {
        axios.get(`${backendServer}/sections/${localStorage.getItem("user_id")}`)
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
    };

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    onSubmit = e => {
        e.preventDefault();
        const data = {
            user_id: parseInt(localStorage.getItem("user_id")),
            item_id: this.state.item_id,
            item_name: this.state.item_name,
            item_description: this.state.item_description,
            item_price: this.state.item_price,
            menu_section_name: this.state.menu_section_name,
            item_image: this.state.item_image
        };

        axios.post(`${backendServer}/itemsupdate`, data)
            .then(response => {
                this.setState({
                    message: response.data.status
                });
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    this.setState({
                        message: err.response.data
                    });
                }
            });
    };

    onImageChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileText: e.target.files[0].name
        });
    }

    onUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("itemimage", this.state.file);
        const uploadConfig = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        axios.post(`${backendServer}/item/${this.state.item_id}`, formData, uploadConfig)
            .then(response => {
                alert("Image uploaded successfully!");
                this.setState({
                    fileText: "Choose file...",
                    item_image: response.data
                });
            })
            .catch(err => {
                console.log("Error");
            });
    }

    render() {
        let message = null,
            redirectVar = null;

        if (this.state.message === "ITEM_UPDATED") {
            redirectVar = <Redirect to="/menu/view" />;
        }
        else if (this.state.message === "ITEM_EXISTS") {
            message = <Alert variant="warning">A item with name {this.state.item_name} already exists</Alert>;
        }

        if (this.state && this.state.noRecordFlag) {
            redirectVar = <Redirect to="/menu/view" />;
        }

        let section_options = null;
        if (this.state && this.state.menu_sections && this.state.menu_sections.length > 0) {
            section_options = this.state.menu_sections.map(menu_section => {
                if (menu_section.menu_section_name === this.state.menu_section_name) {
                    return (
                        <option selected>{menu_section.menu_section_name}</option>
                    );
                }
                return (
                    <option>{menu_section.menu_section_name}</option>
                );
            })
        }

        var imageSrc,
            fileText = this.state.fileText || "Choose image..";
        if (this.state) {
            imageSrc = `${backendServer}/grubhub/images/item/${this.state.item_image}`;
        }
        return (
            <div>
                {redirectVar}
                <Navigationbar/>
                <Row>
                    <Col xs={6} md={4}>
                        <center>
                            <br /><br />
                            <Card style={{ width: '18rem' }}>
                                <Card.Img variant="top" src={imageSrc} />
                            </Card>
                            <form onSubmit={this.onUpload}><br /><br /><br />
                                <div class="custom-file" style={{ width: "80%" }}>
                                    <input type="file" class="custom-file-input" name="image" accept="image/*" onChange={this.onImageChange} required />
                                    <label class="custom-file-label" for="image" style={{ "text-align": "left" }}>{fileText}</label>
                                </div><br /><br />
                                <Button type="submit" variant="primary">Upload</Button>
                            </form>
                        </center>
                    </Col>
                    <Col>
                        <br /><br />
                        <h3>Edit Menu Item</h3><br />
                        <Form onSubmit={this.onSubmit}>
                            <Form.Group as={Row} controlId="item_name">
                                <Form.Label column sm="3">
                                    Item Name:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control style={{ width: "15rem" }} type="text" name="item_name" placeholder="Enter Item Name.." defaultValue={this.state.item_name} onChange={this.onChange} pattern="^[A-Za-z0-9 ]+$" required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_description">
                                <Form.Label column sm="3">
                                    Item Description:
                                </Form.Label>
                                <Col sm="4">
                                    <Form.Control style={{ width: "15rem" }} type="text" name="item_description" placeholder="Enter Item Description.." defaultValue={this.state.item_description} onChange={this.onChange} pattern="^[A-Za-z0-9 ,.-]+$" required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_price">
                                <Form.Label column sm="3">Price: </Form.Label>
                                <Col sm="4">
                                    <Form.Control style={{ width: "15rem" }} type="text" name="item_price" placeholder="Enter Price.." defaultValue={this.state.item_price} onChange={this.onChange} pattern="^(\d*\.)?\d+$" required />
                                </Col>
                            </Form.Group>
                            <Form.Group as={Row} controlId="item_section">
                                <Form.Label column sm="3">Section:</Form.Label>
                                <Col sm="4">
                                    <Form.Control as="select" style={{ width: "15rem" }} onChange={this.onChange} name="menu_section_name">
                                        {section_options}
                                    </Form.Control>
                                </Col>
                            </Form.Group>
                            <Button type="sumbit">Update Item</Button>&nbsp;
                            <Button variant="warning" href="/menu/view">Cancel</Button>
                        </Form>
                        {message}
                    </Col>
                </Row>
            </div>
        );
    }
}

export default EditMenuItems;
