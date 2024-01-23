import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import Conversations from "./Conversations";
import Convo from "./Convo";
import { useState, useContext, useEffect } from "react";
import { SocketContext } from "../SocketProvider";
import { FiMenu } from "react-icons/fi";

const MainApp = ({ setUser, setUserDoc }) => {
  const [conversation, setConversation] = useState();
  const socket = useContext(SocketContext);
  const [isMobileNavVisible, setIsMobileNavVisible] = useState(true);

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
        className={`w-full lg:w-64 bg-gray-100 min-h-screen p-4 overflow-auto lg:block ${
          isMobileNavVisible ? "block" : "hidden"
        }`}
        logout={logout}
        setIsMobileNavVisible={setIsMobileNavVisible}
      />
      <div
        className={`absolute top-0 left-0 p-4 lg:hidden p-4 ${
          isMobileNavVisible ? "hidden" : "block"
        }`}
      >
        <FiMenu
          onClick={() => {
            setIsMobileNavVisible(!isMobileNavVisible);
            setConversation(null);
          }}
          size={30}
        />
      </div>
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
