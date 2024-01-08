import { auth, googleAuthProvider } from "../config/firebase-config";
import { signInWithPopup } from "firebase/auth";

const Login = (props) => {
  const signInWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleAuthProvider);
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
