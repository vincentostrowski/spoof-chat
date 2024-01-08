import userService from "../services/userService";
import { auth, googleAuthProvider } from "../config/firebase-config";
import { signInWithPopup } from "firebase/auth";

const Login = (props) => {
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
      <button onClick={signInWithGoogle}>Sign in with Google</button>
      <button onClick={props.switchToSignUp}>No account? Sign Up</button>
    </div>
  );
};

export default Login;
