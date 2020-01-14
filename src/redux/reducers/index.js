import * as actionTypes from "../actions/types";
import { combineReducers } from "redux";

const INITIAL_STATE = {
  currentUser: null,
  isLoading: true, //previously was true
  isPrivateChannel: false
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

//---CHANNEL REDUCER----
const INITIAL_STATE_CHANNEL = {
  currentChannel: null,
  isPrivateChannel: false,
  userPosts: null
};

const channelReducer = (state = INITIAL_STATE_CHANNEL, action) => {
  switch (action.type) {
    case actionTypes.SET_CURRENT_CHANNEL:
      return {
        ...state,
        currentChannel: action.payload.currentChannel
      };

    case actionTypes.SET_PRIVATE_CHANNEL:
      return {
        ...state,
        isPrivateChannel: action.payload.isPrivateChannel
      };
    case actionTypes.SET_USER_POSTS:
      return {
        ...state,
        userPosts: action.payload.userPosts
      };

    default:
      return state;
  }
};

//OUR ROOT REDUCER HERE
const rootReducer = combineReducers({
  user: userReducer,
  channel: channelReducer
});

export default rootReducer;
