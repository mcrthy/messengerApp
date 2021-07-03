import io from "socket.io-client";
import store from "./store";
import { setMessage, setReceivedMessage } from "./store/utils/thunkCreators";
import {
  removeOfflineUser,
  addOnlineUser,
  setLatestSeenMessage,
} from "./store/conversations";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    store.dispatch(addOnlineUser(id));
  });
  
  socket.on("remove-offline-user", (id) => {
    store.dispatch(removeOfflineUser(id));
  });
  socket.on("new-message-recipient", async (data) => {
    const activeConversation = store.getState().activeConversation;
    store.dispatch(setReceivedMessage({
      message: data.message,
      conversationId: data.conversationId,
      sender: data.sender,
      activeConversation,
    }));
  });
  socket.on("new-message-sender", async (data) => {
    store.dispatch(setMessage({
      conversationId: data.conversationId,
      recipientId: data.recipientId,
      message: data.message,
    }));
  });
  socket.on("set-latest-seen", async (data) => {
    const userId = store.getState().user.id;
      store.dispatch(setLatestSeenMessage(data.conversationId, userId));
  });
});

export default socket;
