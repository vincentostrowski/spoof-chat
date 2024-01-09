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
      {props.children}
      <button onClick={handleAddConvoClick}>Add Convo</button>
      {showNewConversation && (
        <NewConvo
          close={setShowNewConversation}
          onNewConvoAdded={handleNewConvoAdded}
        />
      )}
      <ul className="space-y-4">
        {convos &&
          convos.map((convo) => {
            return (
              <li
                key={convo._id}
                onClick={() => props.setConversation(convo)}
                className="bg-white p-2 rounded"
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
