import { createContext } from "react";
import { io } from "socket.io-client";

export const SocketContext = createContext();

export const SocketProvider = ({ children, userId }) => {
  const socket = io(`${import.meta.env.VITE_BASEURL}`, {
    query: {
      userId: userId,
    },
  });

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
