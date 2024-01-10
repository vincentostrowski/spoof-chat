import messageService from "../services/messageService";
import { useState, useEffect, useRef } from "react";
import { auth } from "../config/firebase-config";
import Message from "./Message";
import InputBox from "./InputBox";
/* 
How to handle this part?????
-given props.conversation

- to type message will use an input element, form with send (submit button)
  - maybe this can be it's own component

- how to deal with messages?
- query DB for all messages with this convo as it's convo field ID
- start placing them in by time created
- 
*/

const Convo = (props) => {
  const [messages, setMessages] = useState([]);
  const [pagination, setPagination] = useState({ limit: 10, skip: 0 });
  const [newMessage, setNewMessage] = useState(false);

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView();
  }, [messages]);

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await messageService.getAll(
        props.conversation.id,
        pagination
      );
      //FIGURE OUT HOW TO uSE PAGINATION & SKIP & LIMIT
      /* setMessages();
      setPagination(); */

      //until then ^ just use below to set
      setMessages(data);
    };

    loadMessages();
    //cleanup so when props.conversation.id changes, rendered messages removed right away
    return () => {
      setMessages([]);
      setPagination({ limit: 10, skip: 0 });
    };
  }, [props.conversation.id, newMessage]);

  return (
    <div className={`${props.className} flex flex-col justify-between`}>
      {props.conversation.groupInfo.name}

      <ul className="space-y-4 overflow-auto ">
        {messages &&
          messages.map((message) => {
            let isUser = false;
            if (auth.currentUser.uid == message.userfirebaseID) {
              isUser = true;
            }
            return (
              <li
                key={message._id}
                className={`flex ${isUser ? "justify-end" : ""}`}
              >
                <Message
                  message={message}
                  className={`${
                    isUser
                      ? "bg-blue-500 text-white rounded-lg p-2 m-2 inline-block"
                      : "bg-gray-300 rounded-lg p-2 m-2 inline-block"
                  }`}
                  isUser={isUser}
                  //pass isUser so maybe Messages will render different
                />
              </li>
            );
          })}
        <div ref={messagesEndRef} />
      </ul>
      <InputBox
        className=""
        conversation={props.conversation}
        setNewMessage={setNewMessage}
        newMessage={newMessage}
      />
    </div>
  );
};

export default Convo;
