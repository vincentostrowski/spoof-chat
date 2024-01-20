import { useEffect, useState, useContext } from "react";
import ConvoOption from "./ConvoOption";
import convoService from "../services/convoService";
import NewConvo from "./NewConvo";
import ProfilePic from "./ProfilePic";
import logo from "../assets/SpoofLogo.png";
import { UserDocContext } from "../App";
import UpdateProfile from "./UpdateProfile";
import { SocketContext } from "../SocketProvider";

const Conversations = ({ className, setConversation, logout }) => {
  const [convos, setConvos] = useState();
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [showUpdateProfile, setShowUpdateProfile] = useState(false);
  const userDoc = useContext(UserDocContext);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const result = await convoService.getAll();
        const returnedConvos = result.data;
        setConvos(returnedConvos);

        //for each of these convos as well,
        //join group using convo id
        //this cannot be done on client side, so we
        returnedConvos.forEach((convo) => {
          socket.emit("join", `conversation-${convo.id}`);
        });
      } catch (error) {
        console.log(error);
      }
    };

    fetchConvos();
  }, []);

  useEffect(() => {
    const handleNewConvo = (newConvo) => {
      setConvos((convos) => [...convos, newConvo]);
    };

    socket.on("newConvo", handleNewConvo);
    return () => {
      socket.off("newConvo", handleNewConvo);
    };
  }, []);

  const handleAddConvoClick = () => {
    setShowNewConversation(true);
  };

  const handleUpdateProfileClick = () => {
    setShowUpdateProfile(true);
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
        <ProfilePic
          avatarURL={userDoc.profilePictureURL}
          className="w-20 h-20"
        />
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
          <UpdateProfile close={() => setShowUpdateProfile(false)} />
        )}
        <button
          onClick={handleAddConvoClick}
          className="w-3/5 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          New Convo
        </button>
        {showNewConversation && (
          <NewConvo close={() => setShowNewConversation(false)} />
        )}
      </div>
      <ul className="space-y-4">
        {convos &&
          convos.map((convo) => {
            return (
              <li
                key={convo._id}
                onClick={() => setConversation(convo)}
                className="bg-white p-2 rounded hover:bg-gray-50 hover:shadow-sm cursor-pointer"
              >
                <ConvoOption convo={convo} />
              </li>
            );
          })}
      </ul>
    </div>
  );
};

export default Conversations;
