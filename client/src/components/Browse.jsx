import BrowseSelector from "./BrowseSelector";

const Browse = ({ className, setUploaded, setAvatarURL }) => {
  return (
    <div className="flex justify-center h-40 inline-block rounded-t-xl">
      <div className={`${className} bg-gray-200 rounded-t-xl`}>
        <BrowseSelector
          setUploaded={setUploaded}
          setAvatarURL={setAvatarURL}
          category="Celebs"
          clasName=""
        />
        <BrowseSelector
          setUploaded={setUploaded}
          setAvatarURL={setAvatarURL}
          category="Profs"
          clasName=""
        />
      </div>
    </div>
  );
};

export default Browse;
