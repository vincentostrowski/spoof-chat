import Avatar from "./Avatar";
import { useState } from "react";

const Message = ({ isUser, message, className }) => {
  const [isHovered, setIsHovered] = useState(false);
  const ownDisplayName = message.displayName === "&3kd&3bdDblp8319";

  return (
    <div className="flex items-start">
      {isUser ? null : (
        <div className="h-full flex flex-col justify-end">
          <Avatar className="w-12 h-12" avatarURL={message.avatarURL} />
        </div>
      )}
      <div className="flex flex-col m-0 p-0">
        <div className=" text-xs text-gray-400 mx-3 mb-1">
          {isHovered || ownDisplayName
            ? message.user.username
            : message.displayName}
        </div>
        <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
          <div
            className={`${className} max-w-60 text-base mb-3`}
            onMouseEnter={() => {
              if (!ownDisplayName) setIsHovered(true);
            }}
            onMouseLeave={() => {
              setIsHovered(false);
            }}
          >
            {message.text}
          </div>
        </div>
      </div>
      {isUser ? (
        <div className="h-full flex flex-col justify-end">
          <Avatar className="w-12 h-12" avatarURL={message.avatarURL} />
        </div>
      ) : null}
    </div>
  );
};

export default Message;
