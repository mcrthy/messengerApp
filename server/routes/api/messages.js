const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {recipientId, text, sender} in body (sender will be null if a conversation already exists)
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { recipientId, text, sender } = req.body;

    let conversation = await Conversation.findConversation(
      senderId,
      recipientId
    );

    if (!conversation) {
      // create conversation
      conversation = await Conversation.create({
        user1Id: senderId,
        user2Id: recipientId,
      });
      if (onlineUsers.includes(sender.id)) {
        sender.online = true;
      }
    }
    const message = await Message.create({
      senderId,
      text,
      conversationId: conversation.id,
    });
    res.json({ message, sender });
  } catch (error) {
    next(error);
  }
});

router.put("/update", async (req, res, next) => {
  try {
    const unseenMessages = await Message.findAll({
      where: {
        conversationId: {
          [Op.eq]: req.body.conversationId,
        },
        senderId: {
          [Op.not]: req.user.id,
        },
        seen: {
          [Op.eq]: false,
        },
      }
    });

    unseenMessages.forEach(async (message) => {
      message.seen = true;
      await message.save();
    });

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});
module.exports = router;
