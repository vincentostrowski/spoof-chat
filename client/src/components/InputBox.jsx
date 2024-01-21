import { useState, useEffect, useRef, useContext } from "react";
import messageService from "../services/messageService";
import { UserDocContext } from "../App";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase-config";
import { getAuth } from "firebase/auth";
import ProfilePic from "./ProfilePic";
import ProfilePicTester from "./ProfilePicTester";
import ProfilePicSelector from "./ProfilePicSelector";
import resizeProfilePic from "../services/resizeProfilePic";

import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const InputBox = ({ conversation, className }) => {
  const [text, setText] = useState("");
  const user = useContext(UserDocContext);
  const [displayName, setDisplayName] = useState(user.username);
  //this initializes to the stored firebase link of user profilepic
  //eventually getting passed to profile pic which fetches from firebae
  const [avatarURL, setAvatarURL] = useState(user.profilePictureURL);
  const [onFirebase, setOnFirebase] = useState(true);
  const [openEmojis, setOpenEmojis] = useState(false);
  const [openSelector, setOpenSelector] = useState(false);
  const textareaRef = useRef(null);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "0px";
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = scrollHeight + "px";
    }
  }, [text]);

  //remember, we are uploading file to firebase,
  //then with the returned link from the upload, storing it in the model
  const onSubmit = async (e) => {
    e.preventDefault();
    if (text === "") return;
    try {
      const uploadedURL = onFirebase
        ? avatarURL
        : await uploadPicFirebase(avatarURL);
      setOnFirebase(true);
      await messageService.create(conversation.id, {
        text,
        displayName,
        avatarURL: uploadedURL,
      });
      setText("");
      setAvatarURL(uploadedURL);
    } catch (error) {
      console.log(error);
    }
  };

  //Uploads given picture to firebase and returns url to be used.
  const uploadPicFirebase = async (avatarURL) => {
    if (avatarURL) {
      const user = getAuth().currentUser;
      //figure out best way to store the user's profile pics in firebase
      //in their own folder, or should they all be shared?
      const storageRef = ref(
        storage,
        `profilePictures/${user.uid}/${avatarURL.name}`
      );

      const resizedImage = await resizeProfilePic(avatarURL, 200, 200);
      await uploadBytesResumable(storageRef, resizedImage);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB

    if (file.size > maxSize) {
      alert("File is too large. Please upload a file smaller than 5MB.");
      return;
    }

    setAvatarURL(file);
    setOnFirebase(false);
  };

  const handleEmojiSelect = (emoji) => {
    setText((prevText) => prevText + emoji.native);
  };

  return (
    <div className={`${className} bg-gray-200 p-2 rounded w-full h-30`}>
      <div>
        <form onSubmit={onSubmit} className="flex gap-3">
          <div className="flex flex-col justify-center items-center">
            <input
              type="text"
              value={displayName}
              placeholder="Message Display Name"
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-center"
              required
            />

            {/* if avatar is initial firebase url , passed to component which fetches from firebase*/}
            {/* if changed by upload, goes to one with no firebase fetch */}
            <div className="flex">
              {onFirebase ? (
                <ProfilePic avatarURL={avatarURL} className="w-20 h-20" />
              ) : (
                <ProfilePicTester avatarURL={avatarURL} className="w-20 h-20" />
              )}
              <div className="flex flex-col justify-between p-2">
                <button
                  type="button"
                  onClick={() => document.getElementById("fileUpload").click()}
                >
                  Upload
                </button>
                <input
                  id="fileUpload"
                  type="file"
                  onChange={handleFileChange}
                  style={{ display: "none" }}
                />
                <button
                  type="button"
                  onClick={() => setOpenSelector(!openSelector)}
                >
                  Browse
                </button>
              </div>
            </div>
          </div>
          <div className="flex flex-grow">
            <textarea
              ref={textareaRef}
              placeholder="Enter a message..."
              value={text}
              onChange={(e) => setText(e.target.value)}
              className="w-4/5 h-10 resize-none overflow-auto flex-grow"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (text.trim() !== "") {
                    onSubmit(e);
                  }
                }
              }}
            />
            {openEmojis && (
              <div className="absolute z-10 bottom-36">
                <Picker
                  data={data}
                  onEmojiSelect={handleEmojiSelect}
                  onClickOutside={() => {
                    if (openEmojis) {
                      setOpenEmojis(false);
                    }
                  }}
                />
              </div>
            )}
            <div className="flex items-start gap-4">
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setOpenEmojis(!openEmojis);
                }}
              >
                😊
              </button>
              <button>Send</button>
            </div>
          </div>
        </form>
      </div>
      {openSelector && (
        <div>
          <ProfilePicSelector
            setOnFirebase={setOnFirebase}
            setAvatarURL={setAvatarURL}
            setDisplayName={setDisplayName}
            user={user}
          />
        </div>
      )}
    </div>
  );
};

export default InputBox;
