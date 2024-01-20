import messageService from "../services/messageService";
import { useState, useEffect } from "react";
import Message from "./Message";
import InputBox from "./InputBox";
import { useContext } from "react";
import { SocketContext } from "../SocketProvider";
import { UserDocContext } from "../App";

const Convo = ({ conversation, className }) => {
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);

  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setMessages((currentMessages) => [...currentMessages, newMessage]);
    };
    socket.on("newMessage", handleNewMessage);
    return () => {
      socket.off("newMessage", handleNewMessage);
    };
  }, []);

  useEffect(() => {
    const loadMessages = async () => {
      const { data } = await messageService.getAll(conversation.id);
      setMessages(data);
    };

    loadMessages();
    //cleanup so when props.conversation.id changes, rendered messages removed right away
    return () => {
      setMessages([]);
    };
  }, [conversation.id]);

  const userDoc = useContext(UserDocContext);
  const participants = conversation.participants.filter(
    (participant) => participant.id !== userDoc.id
  );

  return (
    <div className={`${className} flex flex-col justify-between`}>
      <div className="text-center">
        {participants[1]
          ? conversation.groupInfo.name
          : participants[0].username}
      </div>
      <ul className="space-y-4 overflow-auto ">
        {messages &&
          messages.map((message) => {
            let isUser = false;
            if (message.user === userDoc.id) {
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
                      ? "bg-blue-500 text-white rounded-lg p-2 mx-2 mb-2 inline-block"
                      : "bg-gray-300 rounded-lg p-2 mx-2 mb-2 inline-block"
                  }`}
                  isUser={isUser}
                />
              </li>
            );
          })}
      </ul>
      <InputBox className="" conversation={conversation} />
    </div>
  );
};

export default Convo;
