const admin = require("../utils/firebaseAdmin");
const User = require("../models/user");

const errorHandler = (error, request, response, next) => {
  if (process.env.NODE_ENV !== "test") {
    console.error(error.message);
  }

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.me === "User not found") {
    return response.status(404).end();
  }
  next(error);
};

const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const checkFirebaseToken = async (req, res, next) => {
  const authorizationHeader = req.headers.authorization;

  if (!authorizationHeader || !authorizationHeader.startsWith("Bearer ")) {
    return res.status(401).send("Unauthorized: No token provided.");
  }

  const token = authorizationHeader.split("Bearer ")[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(token);

    const user = await User.findOne({ firebaseUid: decodedToken.uid });

    if (!user) {
      return res.status(404).send("User not found in MongoDB.");
    }
    req.user = user;
    next();
  } catch (error) {
    if (error.code === "auth/id-token-expired") {
      res.status(401).send("Unauthorized: Token expired.");
    } else {
      res.status(403).send("Unauthorized: Invalid token.");
    }
  }
};

module.exports = {
  errorHandler,
  unkownEndpoint,
  checkFirebaseToken,
};
