const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  name: String,
  profilePictureURL: {
    type: String,
    default: "/images/profilePic.png",
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  passwordHash: {
    type: String,
    required: true,
  },
  contacts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  conversations: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Conversation",
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
