import React from "react";
import { Box } from "@material-ui/core";
import { SenderBubble, OtherUserBubble } from "../ActiveChat";
import moment from "moment";

const Messages = (props) => {
  const { messages, otherUser, userId, latestMessageId } = props;

  return (
    <Box>
      {messages.map((message) => {
        const time = moment(message.createdAt).format("h:mm");
        const isLatestSeen = latestMessageId === message.id;

        return message.senderId === userId ? (
          <SenderBubble
            key={message.id}
            text={message.text}
            isLatestSeen={isLatestSeen}
            time={time}
            otherUser={otherUser} />
        ) : (
          <OtherUserBubble
            key={message.id}
            text={message.text}
            time={time}
            otherUser={otherUser} />
        );
      })}
    </Box>
  );
};

export default Messages;
