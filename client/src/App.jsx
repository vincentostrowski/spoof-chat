import MainPage from "./views/MainPage";
import AuthPage from "./views/AuthPage";
import userService from "./services/userService";
import { useEffect, useState, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase-config";
import { SocketProvider } from "./contexts/SocketProvider.jsx";
import logo from "./assets/SpoofLogo.png";

export const UserDocContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    //fetch the user doc
    //set context api so that each document has access to this user doc
    const getUserDoc = async () => {
      if (user) {
        try {
          const response = await userService.getUserFirebaseUID();
          setUserDoc(response.data);
        } catch (error) {
          console.log(error);
        }
      }
    };

    getUserDoc();
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (loading) {
    return (
      <div className="flex w-screen h-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center">
          <img
            src={logo}
            alt="Website Logo"
            className="h-10 w-auto self-start"
          />
          <div>Loading...</div>
        </div>
      </div>
    );
  } else if (user && userDoc) {
    return (
      <SocketProvider userId={userDoc.id}>
        <UserDocContext.Provider value={userDoc}>
          <MainPage setUser={setUser} setUserDoc={setUserDoc} />
        </UserDocContext.Provider>
      </SocketProvider>
    );
  } else if (user === null) {
    return <AuthPage />;
  }
}

export default App;
