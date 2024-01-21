import ProfilePic from "./ProfilePic";
import { storage } from "../config/firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

const ProfilePicSelector = ({
  setOnFirebase,
  setAvatarURL,
  avatarURL,
  setDisplayName,
  user,
}) => {
  //and public/shared pics
  //offer search bar for brining up public ones that match query
  const [avatarURLs, setAvatarURLs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const getAvatars = async () => {
      const storageRef = ref(storage, `profilePictures/${user.firebaseId}`);
      const storedAvatars = await listAll(storageRef);
      const avatarURLs = await Promise.all(
        storedAvatars.items.map((item) => getDownloadURL(item))
      );
      setAvatarURLs(avatarURLs);
      setLoaded(true);
    };
    getAvatars();
  }, [avatarURL]);

  const handleSelection = (url) => {
    setOnFirebase(true);
    setAvatarURL(url);
    setDisplayName("");
  };

  return (
    <div>
      {loaded && avatarURLs.length > 0 && (
        <div>
          <ul className="flex justify-center gap-1">
            {avatarURLs.map((avatarURL, index) => (
              <li
                onClick={() => {
                  handleSelection(avatarURL);
                }}
                key={index}
              >
                <ProfilePic
                  className="h-16 w-16"
                  avatarURL={avatarURL}
                  onClick={() => {
                    handleSelection(avatarURL);
                  }}
                />
              </li>
            ))}
          </ul>
        </div>
      )}
      {loaded && avatarURLs.length === 0 && (
        <div className="text-center w-full">No previously uploaded avatars</div>
      )}
    </div>
  );
};

export default ProfilePicSelector;
