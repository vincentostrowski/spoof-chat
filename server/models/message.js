const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  text: String,
  avatar: String,
  user: mongoose.Schema.ObjectId,
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
