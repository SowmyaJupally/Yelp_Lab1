import React, { Component } from "react";
import { Form, Col, Row, Container, Button, Alert } from "react-bootstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import backendServer from "../../webconfig";

class MenuSections extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu_section_name: "",
            menu_sections: []
        };

        this.onChange = this.onChange.bind(this);
        this.deleteSection = this.deleteSection.bind(this);
        this.getSections();
    }

    onChange = e => {
        this.setState({
            [e.target.name]: e.target.value
        });
    };

    getSections = () => {
        axios.get(`${backendServer}/sections/${localStorage.getItem("user_id")}`)
            .then(response => {
                if (response.data[0]) {
                    if (response.data[0].status === 'NO_RECORD') {
                        this.setState({
                            message: response.data[0].status
                        });
                    }
                    else {
                        this.setState({
                            menu_sections: response.data
                        });
                    }
                }
            })
            .catch(err => {
                if (err.response && err.response.data) {
                    console.log(err.response.data);
                }
            });
    };

    deleteSection = (e) => {
        const data = {
            menu_section_id: e.target.name,
        };
        axios.post(`${backendServer}/sectiondelete`, data)
            .then(response => {
                let new_menu_sections = this.state.menu_sections;
                let index = new_menu_sections.map(menu_section => menu_section.menu_section_id).indexOf(parseInt(data.menu_section_id));
                if (index > -1) {
                    new_menu_sections.splice(index, 1);
                }
                this.setState({
                    menu_sections: new_menu_sections,
                    message: response.data
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

    onSubmit = e => {
        e.preventDefault();
        const data = {
            user_id: localStorage.getItem("user_id"),
            menu_section_name: this.state.menu_section_name
        };

        axios.post(`${backendServer}/sections`, data)
            .then(response => {
                this.setState({
                    menu_sections: [...this.state.menu_sections, { menu_section_id: response.data.menu_section_id, menu_section_name: response.data.menu_section_name }],
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

    render() {
        let message = null,
            menuSectionsList = null;

        if (this.state.message === "SECTION_ADDED") {
            message = <Alert variant="success">Section Added Succesfully</Alert>;
        }
        else if (this.state.message === "SECTION_EXISTS") {
            message = <Alert variant="warning">A section with name {this.state.menu_section_name} already exists</Alert>;
        }
        else if (this.state.message === "NO_RECORD") {
            message = <Alert variant="warning">You have not added any sections in your Menu.</Alert>;
        }
        else if (this.state.message === "SECTION_DELETED") {
            message = <Alert variant="warning">Section deleted successfully!</Alert>;
        }
        if (this.state && this.state.menu_sections && this.state.menu_sections.length > 0) {
            menuSectionsList = this.state.menu_sections.map(menu_section => {
                return (
                    <tr>
                        <td>
                            {menu_section.menu_section_name}
                        </td>
                        <td align="right">
                            <Link to={{pathname: "/menu/section/update", state: {menu_section_id: menu_section.menu_section_id}}}>
                                <Button variant="link" name={menu_section.menu_section_id}>Edit</Button>&nbsp;
                            </Link>
                            <Button variant="link" onClick={this.deleteSection} name={menu_section.menu_section_id}>Delete</Button>
                        </td>
                    </tr>
                )
            })
        }

        return (
            <Container className="justify-content">
                <br />
                <h3>Add New Section</h3><br />
                <Form onSubmit={this.onSubmit}>
                    <Form.Group as={Row} controlId="menu_section_name">
                        <Form.Label column sm="2">
                            Section Name:
                        </Form.Label>
                        <Col sm="4">
                            <Form.Control
                                style={{ width: "15rem" }}
                                type="text"
                                name="menu_section_name"
                                placeholder="Enter Menu Section.."
                                onChange={this.onChange}
                                pattern="^[A-Za-z ]+$"
                                required
                            />
                        </Col>
                        <Col sm="6">
                            <Button type="sumbit">Add Section</Button>
                        </Col>
                    </Form.Group>
                </Form>
                {message}
                <br /><br />
                <table class="table" style={{ width: "50%" }}>
                    <thead>
                        <th>Sections</th>
                    </thead>
                    <tbody>
                        {menuSectionsList}
                    </tbody>
                </table>
            </Container>
        );
    }
}

export default MenuSections;