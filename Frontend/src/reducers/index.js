import { combineReducers } from 'redux';
import loginReducer from './loginReducer';
import signupReducer from './signupReducer';
import customerProfileReducer from './customerProfileReducer'



export default combineReducers({
    login: loginReducer,
    signup: signupReducer,
    CustomerDetails: customerProfileReducer
});