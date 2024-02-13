import React from "react";
import { Link } from "react-router-dom";

const LandingPage = () => {

    return (
    <div className="app-container">
      <h1 className="welcome-message">Welcome to Blur Vid!</h1>
      <div className="button-container">
        <Link to="/login">
          <button className="styled-button">Login</button>
        </Link>
        <Link to="/signup">
          <button className="styled-button">Signup</button>
        </Link>
      </div>
    </div>
    );
};

export default LandingPage;