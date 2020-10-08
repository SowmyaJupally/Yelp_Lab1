import {
    GET_CUSTOMER_DETAILS,
    UPDATE_CUSTOMER_BASIC_DETAILS,
    UPDATE_ABOUT_ME,
    UPDATE_CONTACT_INFO,
  } from './types';
  //import connectionServer from '../webConfig';
  import axios from 'axios';
  
  export const getCustomerDetails = () => (dispatch) => {
    axios
      .get(
        `http://localhost:3001/userdetails/${localStorage.getItem(
          'user_id',
        )}`,
      )
      .then((response) =>
        dispatch({
          type: GET_CUSTOMER_DETAILS,
          payload: response.data,
        }),
      )
      .catch((error) => {
        console.log(error);
      });
  };
  
  export const updateCustomerBasicDetails = (customerData) => (dispatch) => {
    axios
      .post(
        `http://localhost:3001/userdetails/${localStorage.getItem(
          'user_id',
        )}`,
        customerData,
      )
      .then((response) =>
        dispatch({
          type: UPDATE_CUSTOMER_BASIC_DETAILS,
          payload: response.data,
        }),
      )
      .catch((error) => {
        console.log(error);
      });
  };
  
  export const updateAboutMe = (customerData) => (dispatch) => {
    axios
      .post(
        `$http://localhost:3001/userdetails/${localStorage.getItem(
          'user_id',
        )}/aboutme`,
        customerData,
      )
      .then((response) =>
        dispatch({
          type: UPDATE_ABOUT_ME,
          payload: response.data,
        }),
      )
      .catch((error) => {
        console.log(error);
      });
  };
  
  export const updateContactInfo = (customerData) => (dispatch) => {
    axios
      .post(
        `http://localhost:3001/userdetails/${localStorage.getItem(
          'user_id',
        )}/contactInfo`,
        customerData,
      )
      .then((response) =>
        dispatch({
          type: UPDATE_CONTACT_INFO,
          payload: response.data,
        }),
      )
      .catch((error) => {
        console.log(error);
      });
  };
  