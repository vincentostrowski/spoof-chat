const messagesRouter = require("express").Router();
const messagesController = require("../controllers/messages");

messagesRouter.get(
  "/conversations/:id/messages",
  messagesController.getMessages
);

messagesRouter.post(
  "/conversations/:id/messages",
  messagesController.createMessage
);

module.exports = messagesRouter;
