const express = require("express");
const usersRouter = express.Router();
const userController = require("../controllers/users");
const checkFirebaseToken = require("../utils/middleware").checkFirebaseToken;

//no authentication needed
usersRouter.post("/", userController.createUser);

//routes that need authentication
usersRouter.use(checkFirebaseToken);
usersRouter.get("/", userController.getUsers);
usersRouter.get("/:id", userController.getUser);
usersRouter.put("/:id", userController.updateUser);
usersRouter.delete("/:id", userController.deleteUser);

module.exports = usersRouter;
