import React, { Component } from "react";
import { Container, Alert } from "react-bootstrap";
import axios from "axios";
import ItemCard from "../Restaurants/ItemCard";
import backendServer from "../../webconfig";

class MenuView extends Component {
    constructor(props) {
        super(props);
        this.state = {
            menu_sections: [],
            menu_items: []
        };

        this.sectionItems = this.sectionItems.bind(this);
        this.deleteItem = this.deleteItem.bind(this);
        this.getSections();
        this.getMenuItems();
    }

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

    getMenuItems = () => {
        axios.get(`${backendServer}/items/${localStorage.getItem("user_id")}`)
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
    };

    sectionItems = (menu_section) => {
        var itemsRender = [], items, item, section;
        if (this.state && this.state.menu_items && this.state.menu_items.length > 0) {
            items = this.state.menu_items.filter(menu_item => menu_item.menu_section_id === menu_section.menu_section_id);
            if (items.length > 0) {
                section = <h4>{menu_section.menu_section_name}</h4>;
                itemsRender.push(section);
                for (var i = 0; i < items.length; i++) {
                    item = <ItemCard menu_item={items[i]} deleteItem={this.deleteItem}/>;
                    itemsRender.push(item);
                }
            }
            return itemsRender;
        }
    };

    deleteItem = (e) => {
        const data = {
            item_id: e.target.name,
        };
        axios.post(`${backendServer}/itemdelete`, data)
            .then(response => {
                let new_menu_items = this.state.menu_items;
                let index = new_menu_items.map(menu_item => menu_item.item_id).indexOf(parseInt(data.item_id));
                if (index > -1) {
                    new_menu_items.splice(index, 1);
                }
                this.setState({
                    menu_items: new_menu_items,
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

    render() {
        let message = null,
            section,
            renderOutput = [];

        if (this.state.message === "ITEM_DELETED") {
            message = <Alert variant="warning">Item deleted successfully!</Alert>;
        }

        if (this.state && this.state.menu_sections && this.state.menu_sections.length > 0) {
            for (var i = 0; i < this.state.menu_sections.length; i++) {
                section = this.sectionItems(this.state.menu_sections[i]);
                renderOutput.push(section);
            }
        }
        return (
            <Container className="justify-content">
                <br />
                <h3>Menu</h3>
                {message}
                {renderOutput}
            </Container>
        );
    }
}

export default MenuView;