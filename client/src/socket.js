import io from "socket.io-client";
import store from "./store";
import { setReceivedMessage } from "./store/utils/thunkCreators";
import {
  removeOfflineUser,
  addOnlineUser,
  setLatestSeenMessage,
  setOtherUserActive,
} from "./store/conversations";
import { setOtherUserOnline, setOtherUserOffline } from "./store/activeConversation";

const socket = io(window.location.origin);

socket.on("connect", () => {
  console.log("connected to server");

  socket.on("add-online-user", (id) => {
    const activeConversation = store.getState().activeConversation;

    // this is the other user ID, not the convo ID

    if (activeConversation.recipientId === id) {
      store.dispatch(setOtherUserOnline());
    }

    store.dispatch(addOnlineUser(id));
  });

  socket.on("remove-offline-user", (id) => {
    const activeConversation = store.getState().activeConversation;

    if (activeConversation.recipientId === id) {
      store.dispatch(setOtherUserOffline());
    }

    store.dispatch(removeOfflineUser(id));
  });

  socket.on("new-message", async (data) => {
    const userId = store.getState().user.id;
    const activeConversation = store.getState().activeConversation;

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
    if (userId === data.recipientId) {
      store.dispatch(setOtherUserActive(data.conversationId, true));
      store.dispatch(setLatestSeenMessage(data.conversationId, userId));
    }
  });

  socket.on("left-convo", async (data) => {
    const userId = store.getState().user.id;
    if (userId === data.recipientId) {
      store.dispatch(setOtherUserActive(data.conversationId, false));
    }
  });
});

export default socket;
