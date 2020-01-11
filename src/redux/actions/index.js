import * as actionTypes from "./types";

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
