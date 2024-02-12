import React from 'react';
import { Amplify, Auth } from 'aws-amplify';
import { Link, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import awsExports from './aws-exports';
import '@aws-amplify/ui-react/styles.css';
import Main from './pages/Main';
import Account from './pages/Account';
import CustomLogin from './containers/LoginPage';
import CustomSignUp from './containers/SignUpPage';
import './App.css';

Amplify.configure(awsExports);

const App = () => {
  const navigate = useNavigate();

  const handleLoginSuccess = async () => {
    navigate('/accountpage');
  };

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

      <Routes>
        <Route
          path="/login"
          element={
            <CustomLogin
              onLoginSuccess={handleLoginSuccess}
            />
          }
        />
        <Route path="/signup" element={<CustomSignUp />} />
      </Routes>
    </div>
  );
};

export default App;






