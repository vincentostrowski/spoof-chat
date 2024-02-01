import Avatar from "./Avatar";
import { storage } from "../config/firebase-config";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import { useEffect, useState } from "react";

// Component displays profile picture options user can select
const AvatarBrowseRow = ({ setUploaded, setAvatarURL, category }) => {
  const [avatarURLs, setAvatarURLs] = useState([]);
  const [loaded, setLoaded] = useState(false);

  // Fetch profile pictures from firebase storage
  useEffect(() => {
    const getAvatars = async () => {
      const storageRef = ref(storage, `profilePictures/${category}`);
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
  }, []);

  const handleSelection = (url) => {
    setUploaded(true);
    setAvatarURL(url);
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
                  <Avatar className="h-12 w-12" avatarURL={avatarURL} />
                </div>
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

export default AvatarBrowseRow;
