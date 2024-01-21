import ProfilePic from "./ProfilePic";
import { storage } from "../config/firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

const ProfilePicSelector = ({
  setOnFirebase,
  setAvatarURL,
  setDisplayName,
  user,
}) => {
  //and public/shared pics
  //offer search bar for brining up public ones that match query
  const [avatarURLs, setAvatarURLs] = useState([]);

  useEffect(() => {
    const getAvatars = async () => {
      const storageRef = ref(storage, `profilePictures/${user.firebaseId}`);
      const storedAvatars = await listAll(storageRef);
      const avatarURLs = await Promise.all(
        storedAvatars.items.map((item) => getDownloadURL(item))
      );
      setAvatarURLs(avatarURLs);
    };
    getAvatars();
  });

  const handleSelection = (url) => {
    setOnFirebase(true);
    setAvatarURL(url);
    setDisplayName("");
  };

  return (
    avatarURLs && (
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
    )
  );
};

export default ProfilePicSelector;
