import Avatar from "./Avatar";
import ConversationOption from "./ConversationOption";
import UpdateProfileForm from "./UpdateProfileForm";
import NewConversationForm from "./NewConversationForm";
import convoService from "../services/convoService";
import { useEffect, useState, useContext } from "react";
import { UserDocContext } from "../App";
import { SocketContext } from "../contexts/SocketProvider";
import logo from "../assets/SpoofLogo.png";

const SideBar = ({
  className,
  setConversation,
  logout,
  setIsMobileNavVisible,
}) => {
  const [convos, setConvos] = useState();
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const userDoc = useContext(UserDocContext);
  const socket = useContext(SocketContext);

  // Fetch all conversations a user is in and join their rooms for real time updates
  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const result = await convoService.getAll();
        const returnedConvos = result.data;
        setConvos(returnedConvos);

        returnedConvos.forEach((convo) => {
          socket.emit("join", `conversation-${convo.id}`);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchConvos();
  }, []);

  // Listen for new conversations
  useEffect(() => {
    const handleNewConvo = (newConvo) => {
      setConvos((convos) => [...convos, newConvo]);
    };

    socket.on("newConvo", handleNewConvo);
    return () => {
      socket.off("newConvo", handleNewConvo);
    };
  }, [socket]);

  const handleAddConvoClick = () => {
    setShowNewConversation(!showNewConversation);
  };

  const handleUpdateProfileClick = () => {
    setShowUpdateProfile(!showUpdateProfile);
  };

  return (
    <div className={className}>
      <div className="flex flex-col space-y-3 items-center mb-10">
        <div className="flex w-full justify-center">
          <img
            src={logo}
            alt="Website Logo"
            className="h-10 w-auto self-start"
          />
        </div>
        <Avatar avatarURL={userDoc.profilePictureURL} className="w-20 h-20" />
        <button
          onClick={logout}
          className="w-3/5 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Logout
        </button>
        <button
          onClick={handleUpdateProfileClick}
          className="w-3/5 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Update Profile
        </button>
        {showUpdateProfile && (
          <UpdateProfileForm close={() => setShowUpdateProfile(false)} />
        )}
        <button
          onClick={handleAddConvoClick}
          className="w-3/5 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          New Convo
        </button>
        {showNewConversation && (
          <NewConversationForm close={() => setShowNewConversation(false)} />
        )}
      </div>
      <ul className="space-y-4">
        {convos &&
          convos.map((convo, index) => {
            return (
              <li
                key={index}
                onClick={() => {
                  setConversation(convo);
                  setIsMobileNavVisible(false);
                }}
                className="bg-white p-2 rounded hover:bg-gray-50 hover:shadow-sm cursor-pointer"
              >
                <ConversationOption convo={convo} />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default SideBar;
