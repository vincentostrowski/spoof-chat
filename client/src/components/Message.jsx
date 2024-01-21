import ProfilePic from "./ProfilePic";
import { useState } from "react";

const Message = ({ isUser, message, className }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="flex items-start">
      {isUser ? null : (
        <div className="pt-10">
          <ProfilePic className="w-12 h-12" avatarURL={message.avatarURL} />
        </div>
      )}
      <div className="flex flex-col m-0 p-0">
        <div className=" text-xs text-gray-400 mx-3 mb-1">
          {isHovered ? message.user.username : message.displayName}
        </div>
        <div
          className={`${className} max-w-60 text-base`}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          {message.text}
        </div>
      </div>
      {isUser ? (
        <div className="pt-10">
          <ProfilePic className="w-12 h-12" avatarURL={message.avatarURL} />
        </div>
      ) : null}
    </div>
  );
};

export default Message;
