const ProfilePicTester = ({ avatarURL, className }) => {
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
};

export default ProfilePicTester;
