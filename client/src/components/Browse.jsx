import BrowseSelector from "./BrowseSelector";

const Browse = ({ className, setOnFirebase, setAvatarURL, avatarURL }) => {
  return (
    <div className="flex justify-center h-40 inline-block rounded-t-xl">
      <div className={`${className} bg-gray-200 rounded-t-xl`}>
        <BrowseSelector
          setOnFirebase={setOnFirebase}
          setAvatarURL={setAvatarURL}
          avatarURL={avatarURL}
          category="Celebs"
          clasName=""
        />
        <BrowseSelector
          setOnFirebase={setOnFirebase}
          setAvatarURL={setAvatarURL}
          avatarURL={avatarURL}
          category="Profs"
          clasName=""
        />
      </div>
    </div>
  );
};

export default Browse;
