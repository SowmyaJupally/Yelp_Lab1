import { OWNER_SIGNUP } from "./types";
import axios from "axios";

export const ownerSignup = (ownerData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post('http://localhost:3001/register', ownerData)
        .then(response => dispatch({
            type: OWNER_SIGNUP,
            payload: response.data
        }))
        .catch(error => {
            if (error.response && error.response.data) {
                return dispatch({
                    type: OWNER_SIGNUP,
                    payload: error.response.data
                });
            }
            return;
        });
}