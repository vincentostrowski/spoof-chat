import userService from "../services/userService";
import { useState } from "react";
import { auth, googleAuthProvider } from "../config/firebase-config";
import {
  signInWithPopup,
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail,
} from "firebase/auth";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmail = async (email, password) => {
    //FIX THIS: should alert user who's signedUp with google to sign in with it
    //FOr some reasno the signInMethods is empty after the call
    const signInMethods = await fetchSignInMethodsForEmail(auth, email);
    console.log(signInMethods);
    console.log(email);
    if (signInMethods.includes("google.com")) {
      alert("Please sign in with Google");
      return;
    }

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;
      console.error(errorCode, errorMessage);
    }
  };

  const signInWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleAuthProvider);

      //If new user created, sending user to endpoint to create MongoDB document
      const user = result.user;
      const creationTime = new Date(user.metadata.creationTime);
      const lastSignInTime = new Date(user.metadata.lastSignInTime);
      if (creationTime.getTime() === lastSignInTime.getTime()) {
        userService.create({
          username: user.displayName,
          email: user.email,
        });
      }
    } catch (error) {
      alert("An error occurred while signing in. Please try again.");
      console.error(error);
    }
  };

  return (
    <div>
      <h1>Login</h1>
      <form
        className=""
        onSubmit={(e) => {
          e.preventDefault();
          signInWithEmail(email, password);
        }}
      >
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <button type="submit">Login</button>
      </form>
      <button onClick={signInWithGoogle}>Login with Google</button>
      <button onClick={props.switchToSignUp}>No account? Sign Up</button>
    </div>
  );
};

export default Login;
