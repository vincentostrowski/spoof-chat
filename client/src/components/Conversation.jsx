import Message from "./Message";
import MessageInput from "./MessageInput";
import messageService from "../services/messageService";
import { useState, useEffect } from "react";
import { useContext } from "react";
import { SocketContext } from "../contexts/SocketProvider";
import { UserDocContext } from "../App";

// Component displaying currently selected conversation
const Conversation = ({ conversation, className }) => {
  const [messages, setMessages] = useState([]);
  const socket = useContext(SocketContext);

  // Listen for new messages
  useEffect(() => {
    const handleNewMessage = (newMessage) => {
      setMessages((currentMessages) => [...currentMessages, newMessage]);
    };
    socket.on(`newMessage-${conversation.id}`, handleNewMessage);
    return () => {
      socket.off(`newMessage-${conversation.id}`, handleNewMessage);
    };
  }, [conversation]);

  // Fetch messages for conversation
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

  // Remove user from participants to display other participant's username
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
      <ul className="space-y-4 overflow-auto pb-8">
        {messages &&
          messages.map((message, index) => {
            let isUser = false;
            if (message.user.id === userDoc.id) {
              isUser = true;
            }
            return (
              <li key={index} className={`flex ${isUser ? "justify-end" : ""}`}>
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
      <MessageInput conversation={conversation} />
    </div>
  );
};

export default Conversation;
