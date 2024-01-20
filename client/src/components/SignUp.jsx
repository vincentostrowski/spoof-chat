import { useState } from "react";
import userService from "../services/userService";
import { auth } from "../config/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from "../assets/SpoofLogo.png";

const SignUp = ({ switchToLogin }) => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const body = { username, password, email };
      await userService.create(body);
      await signInWithEmailAndPassword(auth, email, password);

      setUsername("");
      setPassword("");
      setEmail("");
    } catch (err) {
      console.error(err.message);
      alert(err.response.data.error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-200">
      <form
        className="bg-white p-6 rounded shadow-md max-w-md"
        onSubmit={handleSubmit}
      >
        <img
          src={logo}
          alt="Website Logo"
          className="h-20 w-auto mb-5 mx-auto"
        />
        <h2 className="mb-4 text-xl font-bold text-gray-500 text-center">
          Create Account
        </h2>
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
          minLength="6"
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
          onClick={switchToLogin}
          className="text-green-500 hover:underline"
        >
          Already have an account? Log In
        </button>
      </div>
    </div>
  );
};

export default SignUp;
