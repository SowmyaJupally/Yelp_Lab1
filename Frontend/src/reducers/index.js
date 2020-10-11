import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import ownerProfileReducer from './ownerProfileReducer'
import customerProfileReducer from './customerProfileReducer'



export default combineReducers({
    login: loginReducer,
    signup: signupReducer,
    customerProfile: customerProfileReducer,
    ownerProfile: ownerProfileReducer
});