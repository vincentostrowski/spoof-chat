import userService from "../services/userService";
import { useState, useContext } from "react";
import { UserDocContext } from "../App";
import ProfilePic from "./ProfilePic";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { storage } from "../config/firebase-config";
import { getAuth } from "firebase/auth";

const UpdateProfile = (props) => {
  const [profilePicture, setProfilePicture] = useState();
  const userDoc = useContext(UserDocContext);
  const [username, setUsername] = useState(userDoc.username);

  //allow the ProfilePic in this form to update when changed file
  //allow user to crop profilePic within the form
  const uploadPicFirebase = async (profilePicture) => {
    if (profilePicture) {
      const user = getAuth().currentUser;

      //figure out best way to store the user's profile pics in firebase
      //in their own folder, or should they all be shared?
      const storageRef = ref(
        storage,
        `profilePictures/${user.uid}/${profilePicture.name}`
      );
      await uploadBytesResumable(storageRef, profilePicture);
      const downloadURL = await getDownloadURL(storageRef);
      return downloadURL;
    }
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      const profilePictureURL = await uploadPicFirebase(profilePicture);
      await userService.update(userDoc.id, {
        profilePictureURL,
        username,
      });
      console.log("works");
      props.close();
    } catch (error) {
      console.log(error);
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setProfilePicture(file);
  };

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center justify-center pointer-events-auto w-full max-w-md">
        <ProfilePic user={userDoc} className="w-20 h-20" />
        <form
          onSubmit={onSubmit}
          className="bg-white p-6 rounded shadow-md max-w-md w-full"
        >
          <label>
            Profile Picture:
            <input type="file" accept="image/*" onChange={handleFileChange} />
          </label>
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={handleUsernameChange}
            className="w-full p-2 border border-gray-300 rounded"
          ></input>
          <button type="submit">Save Changes</button>
          <button
            onClick={props.close}
            className="w-1/3 py-2 bg-red-500 text-white rounded hover:bg-red-600"
          >
            cancel
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdateProfile;
