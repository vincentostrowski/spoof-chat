const loginRouter = require("express").Router();
const loginController = require("../controllers/login");

loginRouter.get("/", loginController);

module.exports = loginRouter;
