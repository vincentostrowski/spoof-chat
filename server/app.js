const express = require("express");
const app = express();
const mongoose = require("mongoose");
const config = require("./utils/config");
const cors = require("cors");

mongoose.connect(config.MONGODB_URI);

app.use(cors());
app.use(express.json());
app.use(express.static("dist"));

module.exports = app;
