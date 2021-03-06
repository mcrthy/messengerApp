import axios from "axios";
import socket from "../../socket";
import {
  gotConversations,
  addConversation,
  setNewMessage,
  setNewUnseenMessage,
  setSearchedUsers,
  clearUnseenCount,
} from "../conversations";
import { setActiveChat } from "../../store/activeConversation";
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

// expects {message, conversationId, sender, activeConversation}
export const setReceivedMessage = (body) => async (dispatch) => {
  try {
    const {message, conversationId, sender, activeConversation } = body;
    // If the conversation is active, update the message to be seen and set it normally
    if (activeConversation === sender.username) {
      const updatedMessage = await updateMessage({ id: message.id });
      dispatch(setNewMessage(updatedMessage.data));

      sendSeenUpdate({
        recipientId: sender.id,
        conversationId: conversationId,
      });
    } else {
      dispatch(setNewUnseenMessage(message, conversationId, sender));
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

// expects {conversationId, recipientId, otherUsername}
export const handleChatSelection = (body) => async (dispatch) => {
  try {
    const { conversationId, recipientId, otherUsername } = body;

    dispatch(updateUnseenMessages({ conversationId }));
    dispatch(setActiveChat(otherUsername));

    sendSeenUpdate({ recipientId, conversationId });
  } catch (error) {
    console.error(error);
  }
}

export const setMessage = ({ conversationId, recipientId, message }) => async (dispatch) => {
  if (!conversationId) {
    dispatch(addConversation(recipientId, message));
  } else {
    dispatch(setNewMessage(message));
  }
};

// message format to send: {text, recipientId, conversationId, sender}
export const postMessage = (body) => async (dispatch) => {
  try {
    const { text, recipientId, conversationId, sender } = body;

    const data = await saveMessage({ text, recipientId, sender });
    const message = data.message;

    dispatch(setMessage({ conversationId, recipientId, message }));

    sendMessage(data, body);
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
