const router = require("express").Router();
const { Conversation, Message } = require("../../db/models");
const onlineUsers = require("../../onlineUsers");
const { Op } = require("sequelize");

// expects {text, recipientId, sender}
router.post("/", async (req, res, next) => {
  try {
    if (!req.user) {
      return res.sendStatus(401);
    }
    const senderId = req.user.id;
    const { text, recipientId, sender } = req.body;

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

// expects {conversationId}
router.put("/seeAll", async (req, res, next) => {
  try {
    await Message.update({seen: true}, {
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

    return res.sendStatus(200);
  } catch (error) {
    next(error);
  }
});

// expects {id}
router.post("/seeOne", async (req, res, next) => {
  try {
    const message = await Message.findOne({
      where: {
        id: {
          [Op.eq]: req.body.id,
        }
      }
    });

    message.seen = true;
    await message.save();

    res.json(message.dataValues);
  } catch (error) {
    next(error);
  }
});

module.exports = router;