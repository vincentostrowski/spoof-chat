import ProfilePic from "./ProfilePic";
import { storage } from "../config/firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

const ProfilePicSelector = ({
  setUploaded,
  setAvatarURL,
  avatarURL,
  setDisplayName,
  user,
}) => {
  const [avatarURLs, setAvatarURLs] = useState([]);
  const [loaded, setLoaded] = useState(false);
  const [names, setNames] = useState({});

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
    return () => {
      setAvatarURLs([]);
      setLoaded(false);
    };
  }, [avatarURL]);

  const handleSelection = (url, index) => {
    setUploaded(true);
    setAvatarURL(url);
    setDisplayName(names[index] || "");
  };

  return (
    <div className="p-3 h-20">
      {loaded && avatarURLs.length > 0 && (
        <div>
          <ul className="flex justify-center gap-1">
            {avatarURLs.map((avatarURL, index) => (
              <li key={index}>
                <div
                  onClick={() => {
                    handleSelection(avatarURL, index);
                  }}
                >
                  <ProfilePic className="h-12 w-12" avatarURL={avatarURL} />
                </div>
                <input
                  type="text"
                  name={index}
                  placeholder="name"
                  value={names[index] || ""}
                  className="w-12 text-[0.7rem] h-3 bg-gray-200 text-gray-500 text-center border border-gray-400 rounded"
                  autoComplete="off"
                  onChange={(e) => {
                    setNames({
                      ...names,
                      [index]: e.target.value,
                    });
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
