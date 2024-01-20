import { useEffect, useState, createContext } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/firebase-config";
import MainApp from "./components/MainApp";
import Auth from "./components/Auth";
import userService from "./services/userService";
import { SocketProvider } from "./SocketProvider.jsx";

export const UserDocContext = createContext();

function App() {
  const [user, setUser] = useState(null);
  const [userDoc, setUserDoc] = useState(null);

  useEffect(() => {
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
    //fetch the user doc
    //set context api so that each document has access to this user doc
  }, [user]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  if (user && userDoc) {
    return (
      <SocketProvider userId={userDoc.id}>
        <UserDocContext.Provider value={userDoc}>
          <MainApp setUser={setUser} />
        </UserDocContext.Provider>
      </SocketProvider>
    );
  } else {
    return <Auth />;
  }
}

export default App;
