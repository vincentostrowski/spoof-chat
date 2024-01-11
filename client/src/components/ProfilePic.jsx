const ProfilePic = (props) => {
  return (
    <div
      className={`${props.className} bg-gray-400 rounded-full flex items-center justify-center`}
    >
      <p className="text-gray-100">{props.letter}</p>
    </div>
  );
};

export default ProfilePic;
