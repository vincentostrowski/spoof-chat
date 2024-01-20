import ProfilePic from "./ProfilePic";

//refactoring to make sure fields only dependent on message model

const Message = ({ isUser, message, className }) => {
  return (
    <div className="flex items-center">
      {isUser ? null : (
        <ProfilePic className="w-7 h-7 mt-auto" avatarURL={message.avatarURL} />
      )}
      <div className="flex flex-col m-0 p-0">
        <div className=" text-xs text-gray-400 mx-3 mb-1">
          {message.displayName}
        </div>
        <div className={`${className} max-w-60`}>{message.text}</div>
      </div>
      {isUser ? (
        <ProfilePic className="w-7 h-7 mt-auto" avatarURL={message.avatarURL} />
      ) : null}
    </div>
  );
};

export default Message;
