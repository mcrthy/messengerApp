import io from "socket.io-client";
import store from "./store";
import { setReceivedMessage } from "./store/utils/thunkCreators";
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
  socket.on("new-message", async (data) => {
    const activeConversation = store.getState().activeConversation;
    const userId = store.getState().user.id;
    store.dispatch(setReceivedMessage({
      message: data.message,
      recipientId: data.recipientId,
      conversationId: data.conversationId,
      sender: data.sender,
      userId,
      activeConversation,
    }));
  });
  socket.on("set-latest-seen", async (data) => {
    const userId = store.getState().user.id;
      store.dispatch(setLatestSeenMessage(data.conversationId, userId));
  });
});

export default socket;
