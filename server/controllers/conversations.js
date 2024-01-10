const Conversation = require("../models/conversation");
const User = require("../models/user");
const mongoose = require("mongoose");

const createConversation = async (req, res) => {
  const body = req.body;
  const participants = [req.user._id];

  for (let username of body.participants) {
    let user = await User.findOne({ username: username });
    if (user) {
      participants.push(user._id);
    } else {
      return res.status(404).json({ error: `User ${username} not found` });
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const newConvo = {
      participants,
      groupInfo: { owner: req.user._id, name: body.name },
    };

    const convo = new Conversation(newConvo);
    const savedConvo = await convo.save({ session });

    for (let userId of participants) {
      const userDoc = await User.findById(userId);
      userDoc.conversations = userDoc.conversations.concat(savedConvo._id);
      await userDoc.save({ session });
    }

    await session.commitTransaction();
    res.status(201).json(savedConvo);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

/* const getConversation = async (req, res) => {}; */

//Get conversations for a logged in user
const getUserConversations = async (req, res) => {
  await req.user.populate("conversations");
  res.json(req.user.conversations);
};

module.exports = {
  getUserConversations,
  createConversation,
};
