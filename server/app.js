require("./utils/firebaseAdmin");
const express = require("express");
const app = express();
require("express-async-errors");
const mongoose = require("mongoose");
const config = require("./utils/config");
const middleware = require("./utils/middleware");
const cors = require("cors");
const usersRouter = require("./routes/users");
const conversationsRouter = require("./routes/conversations");
const messagesRouter = require("./routes/messages");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

app.use(middleware.lowercaseFields);
app.use("/api/users", usersRouter);
app.use(middleware.checkFirebaseToken);
app.use("/api/conversations", conversationsRouter);
app.use("/api", messagesRouter);
app.use(middleware.unkownEndpoint);
app.use(middleware.errorHandler);

module.exports = app;
