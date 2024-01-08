const User = require("../models/user");
const admin = require("../utils/firebaseAdmin");

const createUser = async (request, response) => {
  const { username, name, email, password } = request.body;

  let userRecord;

  //if requested after googleAuth in client, record will already exist
  try {
    userRecord = await admin.auth().getUserByEmail(email);
  } catch (error) {
    userRecord = await admin.auth().createUser({
      email,
      password,
      displayName: username,
    });
  }

  const user = new User({
    username,
    name,
    email,
    _id: userRecord.uid,
  });

  const savedUser = await user.save();

  response.status(201).json(savedUser);
};

const getUsers = async (request, response) => {
  const { search } = request.query;

  let users;
  if (search) {
    // Use a case-insensitive regular expression to search for users
    const searchRegex = new RegExp(search, "i");
    users = await User.find({
      $or: [
        { username: searchRegex },
        { name: searchRegex },
        { email: searchRegex },
      ],
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

const updateUser = async (request, response) => {
  const user = await User.findByIdAndUpdate(request.user.id, request.body, {
    new: true,
  });
  if (!user) {
    throw new Error("User not found");
  }
  response.status(200).json(user);
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
  getUsers,
  updateUser,
  deleteUser,
};
