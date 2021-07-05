import React from "react";
import { Box } from "@material-ui/core";
import { BadgeAvatar, ChatContent } from "../Sidebar";
import { makeStyles } from "@material-ui/core/styles";
import { connect } from "react-redux";
import { handleChatSelection } from "../../store/utils/thunkCreators";

const useStyles = makeStyles(() => ({
  root: {
    borderRadius: 8,
    height: 80,
    boxShadow: "0 2px 10px 0 rgba(88,133,196,0.05)",
    marginBottom: 10,
    display: "flex",
    alignItems: "center",
    "&:hover": {
      cursor: "grab",
    },
  },
}));

const Chat = ({ conversation, handleChatSelection }) => {
  const classes = useStyles();
  const otherUser = conversation.otherUser;

  const handleClick = async (conversation) => {
    const body = {
      conversationId: conversation.id,
      otherUsername: conversation.otherUser.username,
      recipientId: conversation.otherUser.id,
    };
    await handleChatSelection(body);
  };

  return (
    <Box
      onClick={() => handleClick(conversation)}
      className={classes.root}
    >
      <BadgeAvatar
        photoUrl={otherUser.photoUrl}
        username={otherUser.username}
        online={otherUser.online}
        sidebar={true}
      />
      <ChatContent conversation={conversation} />
    </Box>
  ); 
}

const mapDispatchToProps = (dispatch) => {
  return {
    handleChatSelection: (body) => {
      dispatch(handleChatSelection(body));
    },
  };
};

export default connect(null, mapDispatchToProps)(Chat);
