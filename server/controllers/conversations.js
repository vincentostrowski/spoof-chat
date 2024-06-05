const Conversation = require("../models/conversation");
const User = require("../models/user");
const mongoose = require("mongoose");
const io = require("../utils/socket.js").getIO();
//get reference map of user sockets to add new convo rooms
const users = require("../utils/socket.js").getUsers();

const findUserByUsername = async (username) => {
  const user = await User.findOne({ username });
  if (!user) {
    throw new Error(`User ${username} not found`);
  }
  return user;
};

const createNewConversation = async (participants, owner, name, session) => {
  if (!name.trim()) {
    name = "private";
  }
  const newConvo = {
    participants,
    groupInfo: { owner, name },
  };
  const convo = new Conversation(newConvo);
  return await convo.save({ session });
};

const updateUserConversations = async (userId, conversationId, session) => {
  const userDoc = await User.findById(userId);
  userDoc.conversations = userDoc.conversations.concat(conversationId);
  await userDoc.save({ session });
};

const joinUserToConversation = (userId, conversationId) => {
  const userSocket = users[userId];
  if (userSocket) {
    userSocket.join(`conversation-${conversationId}`);
  }
};

// Endpoint to create a new conversation using above helper functions
const createConversation = async (req, res) => {
  const body = req.body;
  const participants = [req.user._id];

  for (let username of body.participants) {
    try {
      const user = await findUserByUsername(username);
      participants.push(user._id);
    } catch (error) {
      return res.status(404).json({ error: error.message });
    }
  }

  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const savedConvo = await createNewConversation(
      participants,
      req.user._id,
      body.name,
      session
    );

    for (let userId of participants) {
      await updateUserConversations(userId, savedConvo._id, session);
      joinUserToConversation(userId, savedConvo._id);
    }

    await session.commitTransaction();
    await savedConvo.populate("participants");
    res.status(201).json(savedConvo);

    //sending an emit with newConvo to be added to all in the convo's corresponding room
    io.to(`conversation-${savedConvo._id}`).emit("newConvo", savedConvo);
  } catch (error) {
    await session.abortTransaction();
    res.status(500).json({ error: error.message });
  } finally {
    session.endSession();
  }
};

const getUserConversations = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate({
      path: "conversations",
      populate: {
        path: "participants",
      },
    });
    const conversations = user.conversations;
    res.json(conversations);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getUserConversations,
  createConversation,
};
