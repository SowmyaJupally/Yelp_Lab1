import { OWNER_SIGNUP } from "./types";
import axios from "axios";
import backendServer from '../webconfig';

export const ownerSignup = (ownerData) => dispatch => {
    axios.defaults.withCredentials = true;
    axios.post(`${backendServer}/register`, ownerData)
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