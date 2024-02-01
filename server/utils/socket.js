const socketIO = require("socket.io");

let io;
let users = {};

module.exports = {
  init: (httpServer) => {
    io = socketIO(httpServer, {
      cors: {
        origin: "*",
      },
    });
    io.on("connection", (socket) => {
      console.log("A user connected");

      const userId = socket.handshake.query.userId;
      users[userId] = socket;

      socket.on("join", (room) => {
        socket.join(room);
      });

      socket.on("disconnect", () => {
        delete users[userId];
      });
    });

    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
  getUsers: () => {
    return users;
  },
};
