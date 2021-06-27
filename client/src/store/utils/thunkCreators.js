import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setNewUnseenMessage,
  setSearchedUsers,
  clearUnseenCount,
  setLatestSeenMessage,
} from "../conversations";
import { setActiveChat, setReceiving } from "../../store/activeConversation";
import { gotUser, setFetchingStatus } from "../user";

// USER THUNK CREATORS

export const fetchUser = () => async (dispatch) => {
  dispatch(setFetchingStatus(true));
  try {
    const { data } = await axios.get("/auth/user");
    dispatch(gotUser(data));
    if (data.id) {
      socket.emit("go-online", data.id);
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setFetchingStatus(false));
  }
};

export const register = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/register", credentials);            
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const login = (credentials) => async (dispatch) => {
  try {
    const { data } = await axios.post("/auth/login", credentials);
    dispatch(gotUser(data));
    socket.emit("go-online", data.id);
  } catch (error) {
    console.error(error);
    dispatch(gotUser({ error: error.response.data.error || "Server Error" }));
  }
};

export const logout = (id) => async (dispatch) => {
  try {
    await axios.delete("/auth/logout");        
    dispatch(gotUser({}));
    socket.emit("logout", id);
  } catch (error) {
    console.error(error);
  }
};

// CONVERSATIONS THUNK CREATORS

export const fetchConversations = () => async (dispatch) => {
  try {
    const { data } = await axios.get("/api/conversations");
    dispatch(gotConversations(data));
  } catch (error) {
    console.error(error);
  }
};

const saveMessage = async (body) => {
  const { data } = await axios.post("/api/messages", body);
  return data;
};

export const updateMessages = async (body) => {
  try {
    await axios.put("/api/messages/seeAll", body);
  } catch (error) {
    console.error(error);
  } 
};

export const updateMessage = async (body) => {
  try {
    const data = await axios.post("/api/messages/seeOne", body);
    return data;
  } catch (error) {
    console.error(error);
  }
};

const sendMessage = (data, body) => {
  socket.emit("new-message", {
    message: data.message,
    recipientId: body.recipientId,
    conversationId: body.conversationId,
    sender: data.sender,
  });
};

const sendSeenUpdate = (body) => {
  socket.emit("set-latest-seen", {
    recipientId: body.recipientId,
    conversationId: body.conversationId,
  });
};

const sendLeftConvoUpdate = (body) => {
  socket.emit("left-convo", {
    recipientId: body.recipientId,
    conversationId: body.conversationId,
  });
};

// expects {message, recipientId, conversationId, sender, userId, activeConversation}
export const setReceivedMessage = (body) => async (dispatch) => {
  try {
    const {message, recipientId, conversationId, sender, userId, activeConversation } = body;

    // only set the message for the recipient
    if (userId === recipientId) {
      // If the conversation is active, update the message to be seen and set it normally
      if (activeConversation.username === sender.username) {
        const updatedMessage = await updateMessage({ id: message.id });
        dispatch(setNewMessage(updatedMessage.data));
        // only need to send a seen update upon first message received in an active conversation, afterwards
        // messages are known to be seen until the recipient leaves the conversation
        if (!activeConversation.hasReceived) {
          sendSeenUpdate({
            recipientId: sender.id,
            conversationId: conversationId,
          });
          dispatch(setReceiving(activeConversation))
        }
      } else {
        dispatch(setNewUnseenMessage(message, conversationId, sender));
      }
    }
  } catch (error) {
    console.error(error);
  }
};

export const updateUnseenMessages = (body) => async (dispatch) => {
  try {
    await updateMessages(body);
    dispatch(clearUnseenCount(body.conversationId));
  } catch (error) {
    console.error(error);
  }
};

// expects {conversationId, recipientId, otherUsername, otherUserOnline, activeConversation}
export const handleChatSelection = (body) => async (dispatch) => {
  try {
    const { conversationId, recipientId, activeConversation, otherUserOnline } = body;

    // if another convo is ongoing, send a message to the recipient indicating that the current user has left
    if (activeConversation.otherUserOnline && activeConversation.hasReceived) {
      sendLeftConvoUpdate({
        recipientId: activeConversation.recipientId,
        conversationId: activeConversation.conversationId,
      });
    }

    dispatch(updateUnseenMessages({ conversationId }));

    if (otherUserOnline) {
      sendSeenUpdate({ recipientId, conversationId });
    }
  } catch (error) {
    console.error(error);
  } finally {
    dispatch(setActiveChat(body.otherUsername, body.conversationId, body.recipientId, body.otherUserOnline));
  }
}

// message format to send: {text, recipientId, conversationId, otherUserActive, otherUserOnline, sender}
export const postMessage = (body) => async (dispatch) => {
  try {

    const { text, recipientId, conversationId, otherUserActive, otherUserOnline, sender } = body;

    const data = await saveMessage({ text, recipientId, sender });

    if (!conversationId) {
      dispatch(addConversation(recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));

      if (otherUserActive) {
        dispatch(setLatestSeenMessage(conversationId, sender.id));
      }
    }

    if (otherUserOnline) {
      sendMessage(data, body);
    }
  } catch (error) {
    console.error(error);
  }
};

export const searchUsers = (searchTerm) => async (dispatch) => {
  try {
    const { data } = await axios.get(`/api/users/${searchTerm}`);
    dispatch(setSearchedUsers(data));
  } catch (error) {
    console.error(error);
  }
};
