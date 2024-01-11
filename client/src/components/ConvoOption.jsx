import ProfilePic from "./ProfilePic";

const ConvoOption = (props) => {
  return (
    <div className="flex items-center gap-4">
      <div className="flex items-center gap-3 relative">
        <ProfilePic className="h-5 w-5 absolute z-10 transform -translate-y-0.5" />
        <ProfilePic className="h-5 w-5 absolute z-20 left-2 translate-y-0.5" />
      </div>
      <div className="pl-7">{props.convo.groupInfo.name}</div>
    </div>
  );
};

export default ConvoOption;
