import { useState } from "react";
import LogIn from "./LogIn";
import SignUp from "./SignUp";

const App = () => {
  const [isSigningUp, setIsSigningUp] = useState(false);

  const switchToSignUp = () => {
    setIsSigningUp(true);
  };

  const switchToLogin = () => {
    setIsSigningUp(false);
  };

  if (isSigningUp) {
    return <SignUp switchToLogin={switchToLogin} />;
  } else {
    return <LogIn switchToSignUp={switchToSignUp} />;
  }
};

export default App;
