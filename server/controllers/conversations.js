const Conversation = require("../models/conversation");
const User = require("../models/user");
const mongoose = require("mongoose");
const io = require("../socket.js").getIO();
//get reference map of user sockets to add new convo rooms
const users = require("../socket.js").getUsers();

const createConversation = async (req, res) => {
  const body = req.body;
  const participants = [req.user._id];
  console.log(body.participants);

  if (body.participants.length === 1) {
    let user = await User.findOne({ username: body.participants[0] });
    if (user) {
      body.name = user.username;
    } else {
      return res.status(404).json({ error: `User not found` });
    }
  }

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

      //were trying to get the socket per participant so we can add them to room
      const userSocket = users[userId];
      if (userSocket) {
        userSocket.join(`conversation-${savedConvo._id}`);
      }
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
