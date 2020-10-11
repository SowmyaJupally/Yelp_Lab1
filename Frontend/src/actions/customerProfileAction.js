import { GET_CUSTOMER, UPDATE_CUSTOMER } from "./types";
import backendServer from "../webconfig"
import axios from "axios";

export const getCustomer = () => dispatch => {
    axios.get(`${backendServer}/customer/${localStorage.getItem("user_id")}`)
        .then(response => response.data[0])
        .then(customer => dispatch({
            type: GET_CUSTOMER,
            payload: customer
        }))
        .catch(error => {
            console.log(error);
        });
}

export const updateCustomer = (customerProfileData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(`${backendServer}/customer`, customerProfileData)
        .then(response => response.data)
        .then(data => {
            if (data === 'CUSTOMER_UPDATED') {
                localStorage.setItem("name", customerProfileData.name);
                alert("Profile Updated Successfully!");
            }
            return dispatch({
                type: UPDATE_CUSTOMER,
                payload: data
            })
        })
        .catch(error => {
            console.log(error);
        });
}