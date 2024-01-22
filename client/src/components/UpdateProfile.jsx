import userService from "../services/userService";
import { useState, useContext } from "react";
import { UserDocContext } from "../App";
import ProfilePic from "./ProfilePic";
import ProfilePicTester from "./ProfilePicTester";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase-config";
import { getAuth } from "firebase/auth";
import resizeProfilePic from "../services/resizeProfilePic";

const UpdateProfile = ({ close }) => {
  const userDoc = useContext(UserDocContext);
  const [profilePicture, setProfilePicture] = useState(
    userDoc.profilePictureURL
  );
  const [username, setUsername] = useState(userDoc.username);
  const [onFirebase, setOnFirebase] = useState(true);

  //allow the ProfilePic in this form to update when changed file
  //allow user to crop profilePic within the form
  const uploadPicFirebase = async (profilePicture) => {
    if (profilePicture) {
      const user = getAuth().currentUser;

      //figure out best way to store the user's profile pics in firebase
      //in their own folder, or should they all be shared?
      const storageRef = ref(
        storage,
        `profilePictures/${user.uid}/profilePicture`
      );

      const resizedImage = await resizeProfilePic(profilePicture, 200, 200);
      await uploadBytesResumable(storageRef, resizedImage);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const uploadedURL = onFirebase
        ? profilePicture
        : await uploadPicFirebase(profilePicture);
      setOnFirebase(true);
      await userService.update(userDoc.id, {
        profilePictureURL: uploadedURL,
        username,
      });
      close();
    } catch (error) {
      console.log(error);
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

    setProfilePicture(newFile);
    setOnFirebase(false);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <form
        onSubmit={onSubmit}
        className="bg-white p-6 rounded shadow-md max-w-md w-full flex flex-col justify-center items-center pointer-events-auto"
      >
        {onFirebase ? (
          <ProfilePic avatarURL={profilePicture} className="w-20 h-20 m-2" />
        ) : (
          <ProfilePicTester
            avatarURL={profilePicture}
            className="w-20 h-20 m-2"
          />
        )}
        <button
          type="button"
          onClick={() => document.getElementById("fileUpload").click()}
          className="text-sm mb-4"
        >
          Upload
        </button>
        <input
          id="fileUpload"
          type="file"
          onChange={handleFileChange}
          style={{ display: "none" }}
        />
        <input
          type="text"
          name="username"
          placeholder="Username"
          value={username}
          onChange={handleUsernameChange}
          className="w-full p-2 border border-gray-300 rounded text-center"
        ></input>
        <div className="flex w-full justify-center p-4 gap-7">
          <button
            type="submit"
            className="w-1/3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            save
          </button>
          <button
            onClick={close}
            className="w-1/3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default UpdateProfile;
