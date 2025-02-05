import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import axios from 'axios';
import backendServer from "../../webconfig";
import { getCustomer, updateCustomer } from '../../actions/customerProfileAction'
import { Link } from "react-router-dom";
import { Container, Col, Row, Form, Button, ButtonGroup, Card } from 'react-bootstrap';

class UserProfile extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user_id: this.props.match.params.id
        };
        
        this.onChange = this.onChange.bind(this);
        this.onImageChange = this.onImageChange.bind(this);
        this.onUpdate = this.onUpdate.bind(this);
        this.onUpload = this.onUpload.bind(this);
    }

    componentWillMount() {
        this.props.getCustomer(this.state.user_id);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.user) {
            var { user } = nextProps;

            var userData = {
                user_id: user.user_id || this.state.user_id,
                first_name: user.first_name || this.state.first_name,
                email: user.email || this.state.email,
                address: user.address || this.state.address,
                phone_number: user.phone_number || this.state.phone_number,
                user_image: user.user_image || this.state.user_image
            };

            this.setState(userData);
        }
    }

    onChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }

    onImageChange = (e) => {
        this.setState({
            file: e.target.files[0],
            fileText: e.target.files[0].name
        });
    }

    onUpload = (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("image", this.state.file);
        const uploadConfig = {
            headers: {
                "content-type": "multipart/form-data"
            }
        };
        alert("updated user image succesfully")
        // axios.post(`${backendServer}/uploads/user/${this.state.user_id}`, formData, uploadConfig)
        //     .then(response => {
        //         alert("Image uploaded successfully!");
        //         this.setState({
        //             fileText: "Choose file...",
        //             user_image: response.data
        //         });
        //     })
        //     .catch(err => {
        //         console.log("Error");
        //     });
    }

    onUpdate = (e) => {
        //prevent page from refresh
        e.preventDefault();

        let data = Object.assign({}, this.state);
        this.props.updateCustomer(data);
    };

    render() {
        var imageSrc,
            fileText = this.state.fileText || "Choose image..",
            title = this.state.name;
        if (this.state) {
            imageSrc = this.state.user_image;
        }
        return (
            <div>
                <Container fluid={true}>
                    <Row>
                        <Col xs={6} md={4}>
                            <center>
                                <Card style={{ width: '18rem' }}>
                                    <Card.Img variant="top" src={imageSrc} />
                                    <Card.Body>
                                        <Card.Title><h3>{title}</h3></Card.Title>
                                    </Card.Body>
                                </Card>
                            </center>
                        </Col>
                        <Col>
                            <h4>Profile</h4>
                            <br />
                            <Form  >
                                <Form.Row>
                                    <Form.Group as={Col} controlId="name">
                                        <Form.Label>Name</Form.Label>
                                        <Form.Control name="name"
                                            type="text"
                                           
                                            defaultValue={this.state.first_name}
                                            pattern="^[A-Za-z0-9 ]+$"
                                            required={true} disabled />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="email_id">
                                        <Form.Label>Email</Form.Label>
                                        <Form.Control type="email"
                                            name="email_id"
                                            defaultValue={this.state.email}
                                            disabled />
                                    </Form.Group>
                                </Form.Row>

                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridCity">
                                        <Form.Label>Address</Form.Label>
                                        <Form.Control type="text"
                                            name="address"
                                            
                                            deafultValue={this.state.address}
                                            pattern="^[A-Za-z0-9 ,-]+$"
                                            required={true} disabled/>
                                    </Form.Group>
                                </Form.Row>
                                <Form.Row>
                                    <Form.Group as={Col} controlId="formGridZip">
                                        <Form.Label>Phone Number</Form.Label>
                                        <Form.Control type="text"
                                            name="phone_number"
                                           
                                            defaultValue={this.state.phone_number}
                                            required={true}
                                            pattern="^[0-9]+$" disabled
                                        />
                                    </Form.Group>
                                </Form.Row>
                                
                                </Form>
                        </Col>
                    </Row><br/>
                    <center><Button href="/home">Home</Button></center>
                </Container>
            </div>
        )
    }
}

UserProfile.propTypes = {
    getCustomer: PropTypes.func.isRequired,
    updateCustomer: PropTypes.func.isRequired,
    user: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    user: state.customerProfile.user
});

export default connect(mapStateToProps, { getCustomer, updateCustomer })(UserProfile);