const admin = require("firebase-admin");
const config = require("./config");

const serviceAccount = JSON.parse(config.FIREBASE_SERVICE_ACCOUNT);

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

module.exports = admin;
