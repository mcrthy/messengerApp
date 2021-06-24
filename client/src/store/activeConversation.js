const SET_ACTIVE_CHAT = "SET_ACTIVE_CHAT";
const SET_RECEIVING = "SET_RECEIVING";

export const setActiveChat = (username, conversationId, recipientId) => {
  return {
    type: SET_ACTIVE_CHAT,
    payload: { username, conversationId, recipientId },
  };
};

export const setReceiving = (username) => {
  return {
    type: SET_RECEIVING,
    username
  }
}

const startingState = {
  username: null,
  conversationId: null,
  recipientId: null,
  isReceiving: false,
};

const reducer = (state = startingState, action) => {
  switch (action.type) {
    case SET_ACTIVE_CHAT: {
      return {
        username: action.payload.username,
        conversationId: action.payload.conversationId,
        recipientId: action.payload.recipientId,
        isReceiving: false,
      };
    }
    case SET_RECEIVING: {
      const newState = { ...state };
      newState.isReceiving = true;
      return newState;
    }
    default:
      return state;
  }
};

export default reducer;
