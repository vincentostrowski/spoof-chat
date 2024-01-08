import { signOut } from "firebase/auth";
import { auth } from "../config/firebase-config";

const MainApp = (props) => {
  const logout = async () => {
    await signOut(auth);
    props.setUser(null);
  };

  return (
    <>
      <button onClick={logout}>Logout</button>
    </>
  );
};

export default MainApp;
