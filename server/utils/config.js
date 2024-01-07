if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const FIREBASE_SERVICE_ACCOUNT = process.env.FIREBASE_SERVICE_ACCOUNT;
const PORT = process.env.PORT;
const MONGODB_URI =
  process.env.NODE_ENV === "test"
    ? process.env.TEST_MONGODB_URI
    : process.env.MONGODB_URI;

module.exports = {
  MONGODB_URI,
  PORT,
  FIREBASE_SERVICE_ACCOUNT,
};
