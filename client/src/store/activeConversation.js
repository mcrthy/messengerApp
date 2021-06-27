const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";
const SET_RECEIVING = "SET_RECEIVING";
const SET_OTHER_USER_ONLINE = "SET_OTHER_USER_ONLINE";

export const setActiveChat = (username, conversationId, recipientId, otherUserOnline) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: { username, conversationId, recipientId, otherUserOnline },
  };
};

export const setReceiving = () => {
  return {
    type: SET_RECEIVING,
  }
}

export const setOtherUserOnline = (otherUserOnline) => {
  return {
    type: SET_OTHER_USER_ONLINE,
    otherUserOnline: otherUserOnline || false,
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
    case SET_RECEIVING: {
      const newState = { ...state };
      newState.hasReceived = true;
      return newState;
    }
    case SET_OTHER_USER_ONLINE: {
      const newState = { ...state };
      newState.otherUserOnline = action.otherUserOnline;
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
