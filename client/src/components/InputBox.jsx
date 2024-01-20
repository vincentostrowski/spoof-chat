import { useState, useEffect, useRef, useContext } from "react";
import messageService from "../services/messageService";
import { UserDocContext } from "../App";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase-config";
import { getAuth } from "firebase/auth";

const InputBox = ({ conversation, className }) => {
  const [text, setText] = useState("");
  const user = useContext(UserDocContext);
  const [displayName, setDisplayName] = useState(user.username);
  const [avatarURL, setAvatarURL] = useState(user.profilePictureURL);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [text]);

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await messageService.create(conversation.id, {
        text,
        displayName,
        avatarURL: await uploadPicFirebase(avatarURL),
      });
      setText("");
    } catch (error) {
      console.log(error);
    }
  };

  const uploadPicFirebase = async (avatarURL) => {
    if (avatarURL) {
      const user = getAuth().currentUser;

      //figure out best way to store the user's profile pics in firebase
      //in their own folder, or should they all be shared?
      const storageRef = ref(
        storage,
        `profilePictures/${user.uid}/${avatarURL.name}`
      );
      await uploadBytesResumable(storageRef, avatarURL);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setAvatarURL(file);
  };

  return (
    <div className={`${className} bg-gray-200 p-2 rounded w-full`}>
      <form onSubmit={onSubmit} className="flex gap-3">
        <label>
          Message Username
          <input
            type="text"
            value={displayName}
            placeholder="Message Display Name"
            onChange={(e) => setDisplayName(e.target.value)}
          />
        </label>
        <label>
          Message Avatar
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className=""
          />
        </label>
        <textarea
          ref={textareaRef}
          placeholder="Enter a message..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-4/5 h-10 resize-none overflow-auto"
          onKeyDown={(e) => {
            if (e.key === "Enter" && !e.shiftKey) {
              e.preventDefault();
              onSubmit(e);
            }
          }}
        />
        <button>Send</button>
      </form>
    </div>
  );
};

export default InputBox;
