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
    if (displayName === "") {
      alert("Please enter a message name as well");
      return;
    }
    try {
      const uploadedURL = onFirebase
        ? avatarURL
        : await uploadPicFirebase(avatarURL);
      setOnFirebase(true);
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
  //100x100 since these will only be used as message images
  const uploadPicFirebase = async (avatarURL) => {
    if (avatarURL) {
      const user = getAuth().currentUser;
      //figure out best way to store the user's profile pics in firebase
      //in their own folder, or should they all be shared?
      const storageRef = ref(
        storage,
        `profilePictures/${user.uid}/${avatarURL.name}`
      );

      const resizedImage = await resizeProfilePic(avatarURL, 100, 100);
      await uploadBytesResumable(storageRef, resizedImage);
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
    setOnFirebase(false);
  };

  // if all URLS the same, no need to fetch them from firebase.
  // should all be numbered 0-9

  // have function that's called at the end of fileChange
  // move the fetching of avatarURL from firebase here, in a useEffect, w/ [onFirebase]
  // hold a state for avatarURLs here and pass this to profilePicSelector
  // maybe have profile selector open at all times
  // 'browse' should open public searchable pics
  // when avatarURLs == 10, notify user of limit and need to replace
  //        "You have 10 images stored already, outlie indicates which image will be replaced on send"

  // ProfilePicSelector should then chage to indicate the profilePic that will be replaced on submit
  // user can change this by clicking to set the outline on what will be replaced on send

  // add option to delete all messages using that certain profile pic? as they may be pointless to user now
  //

  /* const checkAvatarLimit = () => {
    if 
  } */

  const handleEmojiSelect = (emoji) => {
    setText((prevText) => prevText + emoji.native);
  };

  return (
    <div className={`${className} bg-gray-200 p-2 rounded w-full h-30`}>
      <div>
        <form onSubmit={onSubmit} className="flex gap-3">
          <div className="flex flex-col items-center">
            <input
              type="text"
              value={displayName}
              placeholder="message name"
              onChange={(e) => setDisplayName(e.target.value)}
              className="text-center rounded-lg text-gray-400"
              required
            />

            {/* if avatar is initial firebase url , passed to component which fetches from firebase*/}
            {/* if changed by upload, goes to one with no firebase fetch */}

            {onFirebase ? (
              <ProfilePic avatarURL={avatarURL} className="w-20 h-20 m-2" />
            ) : (
              <ProfilePicTester
                avatarURL={avatarURL}
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
          </div>
          <div className="flex flex-col flex-grow">
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
            <ProfilePicSelector
              setOnFirebase={setOnFirebase}
              setAvatarURL={setAvatarURL}
              avatarURL={avatarURL}
              setDisplayName={setDisplayName}
              user={user}
            />
            <button type="button" className="text-xs">
              Browse
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default InputBox;
