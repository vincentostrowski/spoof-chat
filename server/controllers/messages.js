const Message = require("../models/message");

const getMessages = async (req, res) => {
  const conversationId = req.params.id;
  try {
    const messages = await Message.find({ conversation: conversationId }).sort({
      createdAt: 1,
      _id: 1,
    });
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
    user: req.user._id,
    userfirebaseID: req.user.firebaseId,
    conversation: conversationId,
  };

  const message = new Message(messageBody);

  try {
    const savedMessage = await message.save();
    res.status(201).json(savedMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

module.exports = {
  getMessages,
  createMessage,
};
