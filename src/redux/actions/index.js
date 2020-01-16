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

export const setPrivateChannel = isPrivateChannel => {
  return {
    type: actionTypes.SET_PRIVATE_CHANNEL,
    //BUG SOLVED , by adding {} as below.
    payload: { isPrivateChannel }
  };
};

export const setUserPosts = userPosts => {
  return {
    type: actionTypes.SET_USER_POSTS,

    payload: {
      userPosts
    }
  };
};

export const setColors = (primaryColor, secondaryColor) => {
  return {
    type: actionTypes.SET_COLORS,
    payload: {
      primaryColor,
      secondaryColor
    }
  };
};

//TOGGLESIDEPANEL
export const toggleSidePanel = () => ({
  type: actionTypes.TOGGLE_SIDE_PANEL
});
