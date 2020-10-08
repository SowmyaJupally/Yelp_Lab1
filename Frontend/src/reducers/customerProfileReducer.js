import {
    GET_CUSTOMER_DETAILS,
    UPDATE_CUSTOMER_BASIC_DETAILS,
    UPDATE_ABOUT_ME,
    UPDATE_CONTACT_INFO,
  } from '../actions/types';
  
  const initialState = {
    user: {},
  };
  
  export default function (state = initialState, action) {
    switch (action.type) {
      case GET_CUSTOMER_DETAILS:
        return { ...state, user: action.payload };
      case UPDATE_CUSTOMER_BASIC_DETAILS:
        return { ...state, user: action.payload };
      case UPDATE_ABOUT_ME:
        return { ...state, user: action.payload };
      case UPDATE_CONTACT_INFO:
        return { ...state, user: action.payload };
      default:
        return state;
    }
  }
  