import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { useState, useEffect } from "react";

const ProfilePic = ({ user, className }) => {
  const [imageUrl, setImageUrl] = useState(null);

  useEffect(() => {
    const fetchImage = async () => {
      if (user.profilePictureURL) {
        const storage = getStorage();
        const gsReference = ref(storage, user.profilePictureURL);

        const url = await getDownloadURL(gsReference);
        setImageUrl(url);
      }
    };

    fetchImage();
  }, [user]);

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
