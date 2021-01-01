import React from "react";
import "../Stylesheets/Login.css";
import { auth, provider } from "../firebase";

function Login() {

  function signIn() {                             // Function to sign in
    auth.signInWithPopup(provider)                // signInWithPopup is a Firebase Auth method for performing sign in
        .then(() => window.location.href = "/")
        .catch((error) => alert(error.message));
  }

  return (
    <div className="login">
      <div className="login__container">
        <img src="logo512.png" alt="" />
        <div className="login__text">
          <h1>BCA-MINI-PROJECT</h1>
          <p>
            A Room-Based Chat App
          </p>
        </div>

        <button onClick={signIn}>
            <img
              className="gIcon"
              src="https://developers.google.com/identity/images/g-logo.png"
              height="25"
              width="25"
              alt=""
            />
          Sign In With Google
        </button>

        <div className="login__footer">
            <p>Developed By: Joseito Fernandes</p>
            <p>Rollno: R/BCA-18-208</p>
        </div>
      </div>
    </div>
  );
}

export default Login;
