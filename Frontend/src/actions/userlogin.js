import { USER_LOGIN } from "./types";
import backendServer from "../webconfig"
import axios from "axios";

export const userLogin = (loginData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/login',loginData)
        .then(response => 
            dispatch({
            type: USER_LOGIN,
            payload: response.data
        }))
        .catch(error => {
            if (error.response && error.response.data) {
                return dispatch({
                    type: USER_LOGIN,
                    payload: error.response.data
                });
            }
        });
}