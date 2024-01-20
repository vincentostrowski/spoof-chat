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
          avatarURL={participants[0].profilePictureURL}
          className="h-5 w-5 absolute z-10 transform -translate-y-0.5"
        />
        {participants[1] ? (
          <ProfilePic
            avatarURL={participants[1].profilePictureURL}
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
