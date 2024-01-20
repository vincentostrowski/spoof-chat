import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

const ProfilePic = ({ avatarURL, className }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (avatarURL) {
        const storage = getStorage();
        const gsReference = ref(storage, avatarURL);

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
};

export default ProfilePic;
