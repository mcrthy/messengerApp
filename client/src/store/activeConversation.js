const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";
const SET_HAS_RECEIVED = "SET_HAS_RECEIVED";
const SET_OTHER_USER_ONLINE = "SET_OTHER_USER_ONLINE";
const SET_OTHER_USER_OFFLINE = "SET_OTHER_USER_OFFLINE";

export const setActiveChat = (username, conversationId, recipientId, otherUserOnline) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: { username, conversationId, recipientId, otherUserOnline },
  };
};

export const setHasReceived = () => {
  return {
    type: SET_HAS_RECEIVED,
  }
}

export const setOtherUserOnline = () => {
  return {
    type: SET_OTHER_USER_ONLINE,
  }
}

export const setOtherUserOffline = () => {
  return {
    type: SET_OTHER_USER_OFFLINE,
  }
}

const startingState = {
  username: null,
  conversationId: null,
  recipientId: null,
  hasReceived: false,
  otherUserOnline: false
};

const reducer = (state = startingState, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return {
        username: action.payload.username,
        conversationId: action.payload.conversationId,
        recipientId: action.payload.recipientId,
        hasReceived: false,
        otherUserOnline: action.payload.otherUserOnline,
      };
    }
    case SET_HAS_RECEIVED: {
      const newState = { ...state };
      newState.hasReceived = true;
      return newState;
    }
    case SET_OTHER_USER_ONLINE: {
      const newState = { ...state };
      newState.otherUserOnline = true;
      return newState;
    }
    case SET_OTHER_USER_OFFLINE: {
      const newState = { ...state };
      newState.otherUserOnline = false;
      newState.hasReceived = false;
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
