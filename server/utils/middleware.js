const jwt = require("jsonwebtoken");

const errorHandler = (error, request, response, next) => {
  console.error(error.message);
  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  } else if (error.name === "ValidationError") {
    return response.status(400).send({ error: error.message });
  } else if (error.name === "JsonWebTokenError") {
    return response.status(401).json({ error: error.message });
  }
  next(error);
};

const unkownEndpoint = (request, response) => {
  response.status(404).send({ error: "unknown endpoint" });
};

const authenticateToken = async (req, res, next) => {
  const authorization = req.get("authorization");
  let token = null;

  if (authorization && authorization.startsWith("Bearer ")) {
    token = authorization.replace("Bearer ", "");
  }

  const decodedToken = jwt.verify(token, process.env.SECRET);

  if (!token || !decodedToken.id) {
    return res.status(401).json({ error: "token missing or invalid" });
  }

  const user = await User.findById(decodedToken.id);
  if (!user) {
    return res.status(401).json({ error: "token invalid" });
  }

  req.user = user;
  next();
};

module.exports = {
  errorHandler,
  unkownEndpoint,
  authenticateToken,
};
