const User = require("../models/user");
const admin = require("../utils/firebaseAdmin");
const io = require("../socket.js").getIO();
const users = require("../socket.js").getUsers();

const createUser = async (request, response) => {
  const { username, email, password } = request.body;

  //creating both user in Mongo & FireBase
  try {
    //Firebase user creation
    const userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });

    //Mongo user creation. If fails, delete Firebase user
    try {
      const user = new User({
        username,
        email,
        firebaseId: userRecord.uid,
        profilePictureURL:
          "gs://splitchat-fdadc.appspot.com/profilePictures/user.jpg",
      });

      const savedUser = await user.save();
      response.status(201).json(savedUser);
    } catch (mongoError) {
      await admin.auth().deleteUser(userRecord.uid);
      if (mongoError.code === 11000) {
        return response.status(400).json({ error: "Username already in use" });
      } else {
        return response.status(500).json({
          error:
            "An error occurred while creating your account. Please try again.",
        });
      }
    }
  } catch (error) {
    if (error.code === "auth/email-already-exists") {
      return response.status(400).json({ error: "Email already in use" });
    } else if (error.code === "auth/invalid-email") {
      return response.status(400).json({ error: "Invalid email" });
    } else if (error.code === "auth/weak-password") {
      return response.status(400).json({ error: "Weak password" });
    }
  }
};

const getUsers = async (request, response) => {
  const { search } = request.query;

  let users;
  if (search) {
    // Use a case-insensitive regular expression to search for users
    const searchRegex = new RegExp(search, "i");
    users = await User.find({
      $or: [{ username: searchRegex }, { email: searchRegex }],
    });
  } else {
    users = await User.find({})
      .skip((page - 1) * limit)
      .limit(limit);
  }

  response.status(200).json(users);
};

const getUser = async (request, response) => {
  const user = await User.findById(request.params.id);
  if (!user) {
    throw new Error("User not found");
  }
  response.status(200).json(user);
};

const getUserFirebaseUID = async (request, response) => {
  response.status(200).json(request.user);
};

const updateUser = async (request, response) => {
  try {
    const { profilePictureURL, username } = request.body;
    const user = request.user;
    if (username != user.username) {
      user.username = username;
    }

    if (profilePictureURL) {
      user.profilePictureURL = profilePictureURL;
    }

    await user.save();
    const socket = users[user._id];
    const socketId = socket.id;
    io.to(socketId).emit("updateUser", user.toJSON());
    //another socket emit to users who are in groups with this updated user
    //they should rerender: convo,

    //looop through conversationIDs user is part of, since rooms named based on this
    //for each room emit 'peerUpdated'
    //catch this emit in convo component & conversations

    response.status(200).json(user);
  } catch (error) {
    if (error.code === 11000) {
      response.status(400).json({ message: "Username is already in use" });
    } else {
      response
        .status(500)
        .json({ message: "An error occurred while updating your profile" });
    }
  }
};

const deleteUser = async (request, response) => {
  const user = await User.findByIdAndDelete(request.user.id);
  if (!user) {
    throw new Error("User not found");
  }
  response.status(204).end();
};

module.exports = {
  createUser,
  getUser,
  getUserFirebaseUID,
  getUsers,
  updateUser,
  deleteUser,
};
