const Message = require("../models/message");
const io = require("../socket.js").getIO();

const getMessages = async (req, res) => {
  const conversationId = req.params.id;
  try {
    const messages = await Message.find({ conversation: conversationId })
      .sort({
        createdAt: 1,
        _id: 1,
      })
      .populate("user");
    res.json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const createMessage = async (req, res) => {
  const conversationId = req.params.id;
  const body = req.body;

  const messageBody = {
    text: body.text,
    displayName: body.displayName,
    avatarURL: body.avatarURL,
    user: req.user._id,
    conversation: conversationId,
  };

  const message = new Message(messageBody);

  try {
    const savedMessage = await message.save();
    const populatedMessage = await savedMessage.populate("user");
    await io
      .to(`conversation-${conversationId}`)
      .emit("newMessage", populatedMessage);
    res.status(201).json(populatedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
    console.log(error);
  }
};

module.exports = {
  getMessages,
  createMessage,
};
