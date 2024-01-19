import ProfilePic from "./ProfilePic";
import { useEffect, useState } from "react";
import userService from "../services/userService";

const Message = ({ isUser, message, className }) => {
  const [user, setUser] = useState();

  useEffect(() => {
    const getUser = async () => {
      const user = await userService.getUser(message.user);
      console.log();
      setUser(user.data);
    };

    getUser();
  }, []);

  return (
    <div className="flex items-center">
      {isUser ? null : (
        <ProfilePic
          className="w-7 h-7 mt-auto"
          letter={user ? user.username.charAt(0) : ""}
          user={user}
        />
      )}
      <div className="flex flex-col m-0 p-0">
        {isUser ? null : (
          <div className=" text-xs text-gray-400 mx-3 mb-1">
            {user ? user.username : "..."}
          </div>
        )}
        <div className={`${className} ${isUser ? "isUser" : ""} max-w-60`}>
          {message.text}
        </div>
      </div>
    </div>
  );
};

export default Message;
