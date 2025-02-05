
import { OWNER_SIGNUP } from '../actions/types';

const initialState = {
    user: {}
};

export default function (state = initialState, action) {
    switch (action.type) {
        case OWNER_SIGNUP:
            return {
                ...state,
                user: action.payload
            };
        default:
            return state;
    }
};