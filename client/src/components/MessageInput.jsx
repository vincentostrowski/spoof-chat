import Avatar from "./Avatar";
import AvatarUploadsRow from "./AvatarUploadsRow";
import AvatarBrowse from "./AvatarBrowse";
import AvatarURLPaste from "./AvatarURLPaste";
import messageService from "../services/messageService";
import resizeProfilePic from "../utils/resizeProfilePic";
import { useState, useEffect, useRef, useContext } from "react";
import { UserDocContext } from "../App";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase-config";
import { getAuth } from "firebase/auth";
import data from "@emoji-mart/data";
import Picker from "@emoji-mart/react";

const MessageInput = ({ conversation, className }) => {
  const [text, setText] = useState("");
  const user = useContext(UserDocContext);
  const [displayName, setDisplayName] = useState(user.username);
  //Initializes to the stored firebase link of user profilepic,
  //eventually getting passed to profile pic which fetches from firebae
  const [avatarURL, setAvatarURL] = useState(user.profilePictureURL);
  const [uploaded, setUploaded] = useState(true);
  const [openEmojis, setOpenEmojis] = useState(false);
  const [openBrowse, setOpenBrowse] = useState(false);
  const [openPasteURL, setOpenPasteURL] = useState(false);
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
    if (text === "") return;
    if (displayName === "") {
      alert("Please enter a message name as well");
      return;
    }
    try {
      const uploadedURL = uploaded
        ? avatarURL
        : await uploadPicFirebase(avatarURL);
      setUploaded(true);
      await messageService.create(conversation.id, {
        text,
        displayName:
          displayName === user.username ? "&3kd&3bdDblp8319" : displayName,
        avatarURL: uploadedURL,
      });
      setText("");
      setAvatarURL(uploadedURL);
    } catch (error) {
      console.log(error);
      alert("Something went wrong with creating your message");
    }
  };

  //Uploads given picture to firebase and returns url to be used.
  const uploadPicFirebase = async (avatarURL) => {
    if (avatarURL) {
      const user = getAuth().currentUser;
      const storageRef = ref(
        storage,
        `profilePictures/${user.uid}/${avatarURL.name}`
      );

      const metadata = {
        cacheControl: "public, max-age=31536000",
      };

      const resizedImage = await resizeProfilePic(avatarURL, 100, 100);
      await uploadBytesResumable(storageRef, resizedImage, metadata);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    const maxSize = 1 * 1024 * 1024; // 1MB

    if (file.size > maxSize) {
      alert("File is too large. Please upload a file smaller than 5MB.");
      return;
    }

    const sanitizedFileName = file.name.replace(/[^a-zA-Z0-9.]/g, "");
    const newFile = new File([file], sanitizedFileName, { type: file.type });

    setAvatarURL(newFile);
    setUploaded(false);
  };

  const handleEmojiSelect = (emoji) => {
    setText((prevText) => prevText + emoji.native);
  };

  return (
    <div>
      {openBrowse && (
        <AvatarBrowse
          setUploaded={setUploaded}
          setAvatarURL={setAvatarURL}
          clasName="mb-30"
        />
      )}
      {openPasteURL && (
        <AvatarURLPaste
          setUploaded={setUploaded}
          setAvatarURL={setAvatarURL}
          setOpenPasteURL={setOpenPasteURL}
        />
      )}
      <div className={`${className} bg-gray-200 p-2 rounded w-full h-30`}>
        <div>
          <form onSubmit={onSubmit} className="flex gap-3">
            <div className="flex flex-col items-center flex-shrink">
              <input
                type="text"
                value={displayName}
                placeholder="message name"
                onChange={(e) => setDisplayName(e.target.value)}
                className="text-center rounded-lg text-gray-400 w-full"
                required
              />
              {uploaded ? (
                <Avatar avatarURL={avatarURL} className="w-20 h-20 m-2" />
              ) : (
                <Avatar
                  avatarURL={URL.createObjectURL(avatarURL)}
                  className="w-20 h-20 m-2"
                />
              )}
              <button
                type="button"
                onClick={() => document.getElementById("fileUpload").click()}
                className="text-xs"
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
                className="text-xs"
                onClick={() => setOpenPasteURL(!openPasteURL)}
              >
                Paste URL
              </button>
            </div>
            <div className="flex flex-col flex-grow justify-between flex-shrink">
              <div className="flex">
                <textarea
                  ref={textareaRef}
                  placeholder="enter a message..."
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  className="w-4/5 h-10 resize-none overflow-auto flex-grow rounded-lg text-center"
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
                  <div className="absolute z-10 bottom-36 right-4">
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
                <div className="flex items-start gap-4 px-2">
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setOpenEmojis(!openEmojis);
                    }}
                  >
                    😊
                  </button>
                  <button className="rounded-lg bg-blue-600 text-white p-1">
                    Send
                  </button>
                </div>
              </div>
              <AvatarUploadsRow
                setUploaded={setUploaded}
                setAvatarURL={setAvatarURL}
                avatarURL={avatarURL}
                setDisplayName={setDisplayName}
                user={user}
              />
              <button
                type="button"
                className="text-xs"
                onClick={(e) => {
                  e.preventDefault();
                  setOpenBrowse(!openBrowse);
                }}
              >
                Browse
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MessageInput;
