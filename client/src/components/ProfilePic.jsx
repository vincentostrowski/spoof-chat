import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect, memo, useContext } from "react";
import { UserDocContext } from "../App";

const ProfilePic = memo(({ avatarURL, className }) => {
  const [imageUrl, setImageUrl] = useState(null);
  const user = useContext(UserDocContext);
  const URL =
    avatarURL === "&3kd&3bdDblp8319" ? user.profilePictureURL : avatarURL;

  useEffect(() => {
    const fetchImage = async () => {
      if (URL) {
        const storage = getStorage();
        const gsReference = ref(storage, URL);
        const url = await getDownloadURL(gsReference);
        setImageUrl(url);
      }
    };

    fetchImage();
  }, [avatarURL]);

  const style = imageUrl
    ? {
        backgroundImage: `url(${imageUrl})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }
    : {};

  return (
    <div
      className={`${className} bg-gray-400 rounded-full flex items-center justify-center`}
      style={style}
    >
      {/* <p className="text-gray-100">{props.letter}</p> */}
    </div>
  );
});

ProfilePic.displayName = "ProfilePic";

export default ProfilePic;
