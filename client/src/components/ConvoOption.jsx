import ProfilePic from "./ProfilePic";
import { useContext } from "react";
import { UserDocContext } from "../App";

const ConvoOption = ({ convo }) => {
  const userDoc = useContext(UserDocContext);
  const participants = convo.participants.filter(
    (participant) => participant.id !== userDoc.id
  );

  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 relative">
        <ProfilePic
          user={participants[0]}
          className="h-5 w-5 absolute z-10 transform -translate-y-0.5"
        />
        {participants[1] ? (
          <ProfilePic
            user={participants[1]}
            className="h-5 w-5 absolute z-20 left-2 translate-y-0.5"
          />
        ) : null}
      </div>
      <div className="pl-7">
        {participants[1] ? convo.groupInfo.name : participants[0].username}
      </div>
    </div>
  );
};

export default ConvoOption;
