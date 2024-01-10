import { useState } from "react";
import userService from "../services/userService";
import { auth, googleAuthProvider } from "../config/firebase-config";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const SignUp = (props) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const body = { username, password, email, name };
      await userService.create(body);
      await signInWithEmailAndPassword(auth, email, password);

      setUsername("");
      setPassword("");
      setEmail("");
      setName("");
    } catch (err) {
      console.error(err.message);
    }
  };

  const signUpWithGoogle = async () => {
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <form
        className="bg-white p-6 rounded shadow-md max-w-md"
        onSubmit={handleSubmit}
      >
        <h2 className="mb-4 text-2xl font-bold text-gray-700 text-center">
          Create Account
        </h2>
        <input
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="Name"
        />
        <input
          type="email"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Email"
        />
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          className="w-full p-2 mb-4 border border-gray-300 rounded"
          placeholder="Username"
        />
        <input
          type="password"
          id="password"
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
          Sign Up
        </button>
      </form>
      <div className="flex justify-between mt-4 gap-9">
        <button
          onClick={signUpWithGoogle}
          className="text-blue-500 hover:underline"
        >
          Sign Up with Google
        </button>
        <button
          onClick={props.switchToLogin}
          className="text-green-500 hover:underline"
        >
          Already have an account? Log In
        </button>
      </div>
    </div>
  );
};

export default SignUp;
