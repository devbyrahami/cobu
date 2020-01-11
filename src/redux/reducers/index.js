import * as actionTypes from "../actions/types";
import { combineReducers } from "redux";

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true //previously was true
};

const userReducer = (state = INITIAL_STATE, action) => {
  switch (action.type) {
    case actionTypes.SET_USER:
      return {
        //this might be the error happening,where is ...state??
        currentUser: action.payload.currentUser,
        isLoading: false //previously was false
      };

    case actionTypes.CLEAR_USER:
      return {
        ...state,
        isLoading: false
      };

    default:
      return state;
  }
};

//OUR ROOT REDUCER HERE
const rootReducer = combineReducers({
  user: userReducer
});

export default rootReducer;
