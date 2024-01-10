import { useEffect, useState } from "react";
import ConvoOption from "./ConvoOption";
import convoService from "../services/convoService";
import NewConvo from "./NewConvo";

const Conversations = (props) => {
  const [convos, setConvos] = useState();
  const [showNewConversation, setShowNewConversation] = useState(false);
  const [refreshConvos, setRefreshConvos] = useState(false);

  useEffect(() => {
    const fetchConvos = async () => {
      try {
        const result = await convoService.getAll();
        setConvos(result.data);
      } catch (error) {
        console.log(error);
      }
    };

    fetchConvos();
  }, [refreshConvos]);

  const handleAddConvoClick = () => {
    setShowNewConversation(true);
  };

  const handleNewConvoAdded = () => {
    setRefreshConvos(!refreshConvos);
  };

  return (
    <div className={props.className}>
      <div className="flex flex-col space-y-3 items-center mb-10">
        <button
          onClick={props.logout}
          className="w-3/5 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          Logout
        </button>
        <button
          onClick={handleAddConvoClick}
          className="w-3/5 py-2 px-4 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:bg-red-700"
        >
          New Convo
        </button>
        {showNewConversation && (
          <NewConvo
            close={() => setShowNewConversation(false)}
            onNewConvoAdded={handleNewConvoAdded}
          />
        )}
      </div>
      <ul className="space-y-4">
        {convos &&
          convos.map((convo) => {
            return (
              <li
                key={convo._id}
                onClick={() => props.setConversation(convo)}
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
