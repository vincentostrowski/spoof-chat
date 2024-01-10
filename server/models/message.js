const mongoose = require("mongoose");

const messageSchema = mongoose.Schema({
  text: String,
  avatar: String,
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },
  userfirebaseID: String,
  conversation: {
    type: mongoose.Schema.ObjectId,
    ref: "Conversation",
    required: true,
  },
});

messageSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Message = mongoose.model("Message", messageSchema);

module.exports = Message;
