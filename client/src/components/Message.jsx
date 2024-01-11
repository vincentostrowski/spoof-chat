import ProfilePic from "./ProfilePic";
import { useEffect, useState } from "react";
import userService from "../services/userService";

const Message = (props) => {
  const [name, setName] = useState();

  useEffect(() => {
    const getName = async () => {
      const user = await userService.getUser(props.message.user);
      console.log();
      setName(user.data.username);
    };

    getName();
  }, []);

  return (
    <div className="flex items-center">
      {props.isUser ? null : (
        <ProfilePic
          className="w-7 h-7 mt-auto"
          letter={name ? name.charAt(0) : ""}
        />
      )}
      <div className="flex flex-col m-0 p-0">
        {props.isUser ? null : (
          <div className=" text-xs text-gray-400 mx-3 mb-1">
            {name ? name : "..."}
          </div>
        )}
        <div
          className={`${props.className} ${
            props.isUser ? "isUser" : ""
          } max-w-60`}
        >
          {props.message.text}
        </div>
      </div>
    </div>
  );
};

export default Message;
