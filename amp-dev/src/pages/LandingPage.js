import React, { useState } from "react";
import { Link } from "react-router-dom";
import CustomLogin from "./LoginPage";
import CustomSignUp from "./SignUpPage";

const LandingPage = () => {
  const [showLogin, setShowLogin] = useState(true);

  const toggleForm = () => {
    setShowLogin((prevShowLogin) => !prevShowLogin);
  };

  return (
    <div className="app-container">
      <h1 className="welcome-message">Welcome to Blur Vid!</h1>
      <div className="button-container">
        <button className="styled-button" onClick={() => setShowLogin(true)}>
          Login
        </button>
        <button className="styled-button" onClick={() => setShowLogin(false)}>
          Signup
        </button>
      </div>

      <div className="forms-container">
        {showLogin ? <CustomLogin /> : <CustomSignUp />}
      </div>
    </div>
  );
};

export default LandingPage;
