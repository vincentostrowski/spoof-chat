import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import Conversations from "./Conversations";
import Convo from "./Convo";
import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../SocketProvider";

const MainApp = ({ setUser, setUserDoc }) => {
  const [conversation, setConversation] = useState();
  const socket = useContext(SocketContext);

  useEffect(() => {
    const handleUpdateProfile = async (updatedUser) => {
      setUserDoc(updatedUser);
    };
    socket.on("updateUser", handleUpdateProfile);
    return () => {
      socket.off("updateUser", handleUpdateProfile);
    };
  });

  const logout = async () => {
    await signOut(auth);
    setUser(null);
  };

  return (
    <div className="flex h-screen">
      <Conversations
        setConversation={setConversation}
        className="w-64 bg-gray-100 min-h-screen p-4 overflow-auto"
        logout={logout}
      />
      {conversation && (
        <Convo
          conversation={conversation}
          className="flex-grow bg-white p-4 overflow-auto"
        />
      )}
    </div>
  );
};

export default MainApp;
