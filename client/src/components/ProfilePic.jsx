import { memo } from "react";

const ProfilePic = memo(({ avatarURL, className }) => {
  const style = avatarURL
    ? {
        backgroundImage: `url(${avatarURL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div
      className={`${className} bg-gray-400 rounded-full flex items-center justify-center`}
      style={style}
    ></div>
  );
});

ProfilePic.displayName = "ProfilePic";

export default ProfilePic;
