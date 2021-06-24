import {
  addNewConvoToStore,
  addOnlineUserToStore,
  addSearchedUsersToStore,
  removeOfflineUserFromStore,
  addMessageToStore,
  addUnseenMessageToStore,
} from "./utils/reducerFunctions";

// ACTIONS

const GET_CONVERSATIONS = "GET_CONVERSATIONS";
const SET_MESSAGE = "SET_MESSAGE";
const SET_UNSEEN_MESSAGE = "SET_UNSEEN_MESSAGE";
const ADD_ONLINE_USER = "ADD_ONLINE_USER";
const REMOVE_OFFLINE_USER = "REMOVE_OFFLINE_USER";
const SET_SEARCHED_USERS = "SET_SEARCHED_USERS";
const CLEAR_SEARCHED_USERS = "CLEAR_SEARCHED_USERS";
const ADD_CONVERSATION = "ADD_CONVERSATION";
const CLEAR_UNSEEN_COUNT = "CLEAR_UNSEEN_COUNT";
const SET_LATEST_SEEN_MESSAGE = "SET_LATEST_SEEN_MESSAGE";
const SET_OTHER_USER_ACTIVE = "SET_OTHER_USER_ACTIVE";

// ACTION CREATORS

export const gotConversations = (conversations) => {
  return {
    type: GET_CONVERSATIONS,
    conversations,
  };
};

export const setNewMessage = (message) => {
  return {
    type: SET_MESSAGE,
    message,
  };
};

export const setOtherUserActive = (conversationId, isActive) => {
  return {
    type: SET_OTHER_USER_ACTIVE,
    payload: { conversationId, isActive }
  };
};

export const setLatestSeenMessage = (conversationId, userId) => {
  return {
    type: SET_LATEST_SEEN_MESSAGE,
    payload: {
      conversationId,
      userId,
    }
  }
};

export const setNewUnseenMessage = (message, conversationId, sender) => {
  return {
    type: SET_UNSEEN_MESSAGE,
    payload: {
      message,
      conversationId,
      sender,
    }
  } 
};

export const addOnlineUser = (id) => {
  return {
    type: ADD_ONLINE_USER,
    id,
  };
};

export const removeOfflineUser = (id) => {
  return {
    type: REMOVE_OFFLINE_USER,
    id,
  };
};

export const setSearchedUsers = (users) => {
  return {
    type: SET_SEARCHED_USERS,
    users,
  };
};

export const clearSearchedUsers = () => {
  return {
    type: CLEAR_SEARCHED_USERS,
  };
};

// add new conversation when sending a new message
export const addConversation = (recipientId, newMessage) => {
  return {
    type: ADD_CONVERSATION,
    payload: { recipientId, newMessage },
  };
};

export const clearUnseenCount = (convoId) => {
  return {
    type: CLEAR_UNSEEN_COUNT,
    convoId,
  };
};

// REDUCER

const reducer = (state = [], action) => {
  switch (action.type) {
    case GET_CONVERSATIONS:
      return action.conversations;
    case SET_MESSAGE:
      return addMessageToStore(state, action.message);
    case SET_UNSEEN_MESSAGE:
      return addUnseenMessageToStore(state, action.payload);
    case SET_LATEST_SEEN_MESSAGE: {
      return state.map((convo) => {
        if (action.payload.conversationId === convo.id) {
          const newConvo = { ...convo };

          const latestMessageId = convo.messages.reduce((messageId, message) => {
            if (message.senderId === action.payload.userId) {
              return message.id;
            } else {
              return messageId;
            }
          }, null);

          newConvo.latestMessageId = latestMessageId;

          return newConvo;
        } else {
          return convo;
        }
      });
    }
    case ADD_ONLINE_USER: {
      return addOnlineUserToStore(state, action.id);
    }
    case REMOVE_OFFLINE_USER: {
      return removeOfflineUserFromStore(state, action.id);
    }
    case SET_SEARCHED_USERS:
      return addSearchedUsersToStore(state, action.users);
    case CLEAR_SEARCHED_USERS:
      return state.filter((convo) => convo.id);
    case ADD_CONVERSATION:
      return addNewConvoToStore(
        state,
        action.payload.recipientId,
        action.payload.newMessage
      );
    case CLEAR_UNSEEN_COUNT: {
      return state.map((convo) => {
        if (action.convoId === convo.id) {
          return { ...convo, unseenCount: 0 };
        } else {
          return convo;
        }
       });
     }
     case SET_OTHER_USER_ACTIVE: {
       return state.map((convo) => {
         if (action.payload.conversationId === convo.id) {
           return { ...convo, otherUserActive: action.payload.isActive };
         } else {
           return convo;
         }
       });
     }
    default:
      return state;
  }
};

export default reducer;
