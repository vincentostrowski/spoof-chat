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
    <div>
      <h1>Sign Up</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <button onClick={signUpWithGoogle}>Sign Up with Google</button>
      <button onClick={props.switchToLogin}>
        Already have an account? Log In
      </button>
    </div>
  );
};

export default SignUp;
