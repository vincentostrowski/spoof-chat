import { memo } from "react";

const ProfilePicTester = memo(({ avatarURL, className }) => {
  const style = avatarURL
    ? {
        backgroundImage: `url(${URL.createObjectURL(avatarURL)})`,
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

ProfilePicTester.displayName = "ProfilePicTester";

export default ProfilePicTester;
