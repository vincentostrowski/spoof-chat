import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";
import Conversations from "./Conversations";
import Convo from "./Convo";
import { useState } from "react";

const MainApp = (props) => {
  const [conversation, setConversation] = useState();

  const logout = async () => {
    await signOut(auth);
    props.setUser(null);
  };

  return (
    <div className="flex h-screen">
      <Conversations
        setConversation={setConversation}
        className="w-64 bg-gray-100 min-h-screen p-4 overflow-auto"
      >
        <button
          onClick={logout}
          className="w-full py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Logout
        </button>
      </Conversations>
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
