const express = require("express");
const conversationsRouter = express.Router();
const conversationController = require("../controllers/conversations");

conversationsRouter.get("/", conversationController.getUserConversations);
conversationsRouter.post("/", conversationController.createConversation);

module.exports = conversationsRouter;
