import AvatarBrowseRow from "./AvatarBrowseRow";

// Component displays rows of profile picture options user can select
const AvatarBrowse = ({ className, setUploaded, setAvatarURL }) => {
  return (
    <div className="flex justify-center h-40 inline-block rounded-t-xl">
      <div className={`${className} bg-gray-200 rounded-t-xl`}>
        <AvatarBrowseRow
          setUploaded={setUploaded}
          setAvatarURL={setAvatarURL}
          category="Celebs"
          clasName=""
        />
        <AvatarBrowseRow
          setUploaded={setUploaded}
          setAvatarURL={setAvatarURL}
          category="Profs"
          clasName=""
        />
      </div>
    </div>
  );
};

export default AvatarBrowse;
