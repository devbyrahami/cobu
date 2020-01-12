import * as actionTypes from "./types";

//---USER ACTIONS---
//show user
export const setUser = user => ({
  type: actionTypes.SET_USER,
  payload: {
    currentUser: user
  }
});

export const clearUser = () => ({
  type: actionTypes.CLEAR_USER
});

//---CHANNEL ACTIONS---

export const setCurrentChannel = channel => {
  return {
    type: actionTypes.SET_CURRENT_CHANNEL,
    payload: {
      currentChannel: channel
    }
  };
};
