import { useState } from "react";
import { auth } from "../config/firebase-config";
import { signInWithEmailAndPassword } from "firebase/auth";
import logo from "../assets/logoTEST.png";

const Login = ({ switchToSignUp }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const signInWithEmail = async (email, password) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error) {
      if (error.code === "auth/user-not-found") {
        alert("There is no user associated with this email.");
      } else if (error.code === "auth/wrong-password") {
        alert("The password is incorrect.");
      } else if (error.code === "auth/invalid-credential") {
        alert("Invalid credentials");
      } else {
        alert(error.code, error.message);
      }
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
        <img
          src={logo}
          alt="Website Logo"
          className="h-20 w-auto mb-5 mx-auto"
        />
        <h2 className="mb-4 text-xl font-bold text-gray-500 text-center">
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
          onClick={switchToSignUp}
          className="text-green-500 hover:underline"
        >
          No account? Sign Up
        </button>
      </div>
    </div>
  );
};

export default Login;
