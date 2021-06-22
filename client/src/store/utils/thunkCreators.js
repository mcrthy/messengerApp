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
    await axios.put("/api/messages/updateAll", body);
  } catch (error) {
    console.error(error);
  } 
};

export const updateMessage = async (body) => {
  try {
    const data = await axios.post("/api/messages/updateOne", body);
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


// expects {message, recipientId, conversationId, sender, userId, activeConversation}
export const setReceivedMessage = (body) => async (dispatch) => {
  try {
    const {message, recipientId, conversationId, sender, userId, activeConversation } = body;

    // only set the message for the recipient
    if (userId === recipientId) {
      // If the conversation is active, update the message to be seen and set it normally
      if (activeConversation === sender.username) {
        const updatedMessage = await updateMessage({ id: message.id });
        dispatch(setNewMessage(updatedMessage.data));
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

// message format to send: {text, recipientId, conversationId, sender}
export const postMessage = (body) => async (dispatch) => {
  try {

    const { text, recipientId, conversationId, sender } = body;

    const data = await saveMessage({ text, recipientId, sender });

    if (!conversationId) {
      dispatch(addConversation(recipientId, data.message));
    } else {
      dispatch(setNewMessage(data.message));
    }

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
