import userService from "../services/userService";
import { useState } from "react";
import { auth, googleAuthProvider } from "../config/firebase-config";
import { signInWithPopup, signInWithEmailAndPassword } from "firebase/auth";

const Login = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmail = async (email, password) => {
    //should alert user who's signedUp with google to sign in with it

    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      const errorCode = error.code;
      const errorMessage = error.message;

      // The error code for accounts created with a Google provider
      if (errorCode === "auth/account-exists-with-different-credential") {
        alert(
          "You've signed up with Google. Select 'Login with Google' at the bottom"
        );
      } else {
        console.error(errorCode, errorMessage);
      }
    }
  };

  const signInWithGoogle = async () => {
    let result;

    try {
      result = await signInWithPopup(auth, googleAuthProvider);
    } catch (error) {
      alert("An error occurred while signing in. Please try again.");
      console.error(error);
      return;
    }

    //If new user created instead, create user in DB as well
    const user = result.user;
    const creationTime = new Date(user.metadata.creationTime);
    const lastSignInTime = new Date(user.metadata.lastSignInTime);

    try {
      if (creationTime.getTime() === lastSignInTime.getTime()) {
        userService.create({
          username: user.displayName,
          email: user.email,
        });
      }
    } catch (error) {
      console.error("Error creating user in MongoDB:", error);
      // If MongoDB user creation fails, delete the Firebase user
      // maybe use firebase cloud function call for this, as adding this to client code
      // is not allowed it seems
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <form
        className="bg-white p-6 rounded shadow-md max-w-md"
        onSubmit={(e) => {
          e.preventDefault();
          signInWithEmail(email, password);
        }}
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-700 text-center">
          Login
        </h2>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Email address"
        />
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Password"
        />
        <button
          type="submit"
          className="w-full p-2 text-white bg-blue-500 rounded hover:bg-blue-600"
        >
          Login
        </button>
      </form>
      <div className="flex justify-between mt-4 gap-9">
        <button
          onClick={signInWithGoogle}
          className="text-blue-500 hover:underline"
        >
          Login with Google
        </button>
        <button
          onClick={props.switchToSignUp}
          className="text-green-500 hover:underline"
        >
          No account? Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
